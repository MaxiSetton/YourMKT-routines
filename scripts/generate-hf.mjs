// Genera los recursos del manifiesto via Hugging Face Inference Router (providers).
//   imagen_generada                 -> FLUX.1-dev   TEXT-to-image   (prompt = f.prompt)
//   video_generado SIN imagen base  -> Wan2.2-5B    TEXT-to-video   (inputs = prompt_movimiento)
//   video_generado CON imagen base  -> Wan2.2-14B   IMAGE-to-video  (base = imagen_generada / asset real / stock)
// Genera PRIMERO las imagenes (asi pueden ser base de un i2v) y despues los videos.
// Pide todo YA EN EL ASPECTO FINAL (desde spec.aspect). Deja el crudo en public/<archivo>.
//   (flux.2-dev en el router HF es image-EDIT, no t2i -> para stills nuevos va FLUX.1)
//
// .env:  HUGGIN_FACE_ACCESS_TOKEN=hf_...
// Uso:   node scripts/generate-hf.mjs spec.dia4.json
// Providers (override): HF_IMG_PROVIDER (def fal-ai) · HF_T2V_PROVIDER (def fal-ai) · HF_I2V_PROVIDER (def wavespeed)
import { InferenceClient } from "@huggingface/inference";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const TOKEN = env.HUGGIN_FACE_ACCESS_TOKEN;
if (!TOKEN) { console.error("Falta HUGGIN_FACE_ACCESS_TOKEN en .env"); process.exit(1); }

const IMG_T2I_MODEL = "black-forest-labs/FLUX.1-dev";  // flux.1 dev (text-to-image, sin base)
const IMG_EDIT_MODEL = "black-forest-labs/FLUX.2-dev"; // flux.2 dev (image-to-image/edit, con base real)
const T2V_MODEL = "Wan-AI/Wan2.2-TI2V-5B";          // wan2.2 5B  (text-to-video)
const I2V_MODEL = "Wan-AI/Wan2.2-I2V-A14B";         // wan2.2 14B (image-to-video)
const IMG_PROVIDER = env.HF_IMG_PROVIDER || process.env.HF_IMG_PROVIDER || "fal-ai";
const T2V_PROVIDER = env.HF_T2V_PROVIDER || process.env.HF_T2V_PROVIDER || "fal-ai";
const I2V_PROVIDER = env.HF_I2V_PROVIDER || process.env.HF_I2V_PROVIDER || "wavespeed";
const FPS = 24;
const ASPECT = { "9:16": "9:16", "16:9": "16:9", "1:1": "1:1", "4:5": "9:16" };
const ASPECT_WH = { "9:16": { width: 720, height: 1280 }, "16:9": { width: 1280, height: 720 }, "1:1": { width: 1024, height: 1024 }, "4:5": { width: 1024, height: 1280 } };
const DEFAULT_NEG =
  "low quality, blurry, distorted, deformed, morphing, warping, flickering, jitter, shaky camera, " +
  "text, watermark, logo, captions, oversaturated, plastic look, cgi, cartoon";

const specFile = process.argv[2] ?? "spec.dia4.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
const aspect = ASPECT[spec.aspect] ?? "9:16";
const wh = ASPECT_WH[spec.aspect] ?? ASPECT_WH["9:16"];

// `carpeta` (opcional): subcarpeta de public/ donde van los assets de ESTA pieza. Ahi escribimos lo generado.
const carpeta = spec.carpeta ? String(spec.carpeta).replace(/\/+$/, "") : null;
const assetsDir = carpeta ? path.join(publicDir, carpeta) : publicDir;
await mkdir(assetsDir, { recursive: true });
// Lista public/ RECURSIVAMENTE (rutas relativas con "/"): el asset puede estar en cualquier subcarpeta.
const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join("/")];
});
const publicFiles = existsSync(publicDir) ? walk(publicDir) : [];
const baseOf = (f) => f.split("/").pop();
const stem = (f) => baseOf(f).replace(/\.[^.]+$/, "").toLowerCase();
const prefer = (c) => (carpeta && c.find((f) => f.startsWith(carpeta + "/"))) || c[0] || null;
const IMG_EXT = new Set(["jpg", "jpeg", "png", "webp"]);
const isImg = (f) => f && IMG_EXT.has(f.split(".").pop().toLowerCase());
const VID_EXT = new Set(["mp4", "mov", "webm", "m4v"]);
const isVid = (f) => f && VID_EXT.has(f.split(".").pop().toLowerCase());
// resuelve por nombre/stem del TIPO correcto (un .jpg y un .mp4 comparten stem), recursivo y prefiriendo la carpeta
const resolveKind = (name, kind) => { if (!name) return null; return prefer(publicFiles.filter((f) => (baseOf(f) === name || stem(f) === stem(name)) && kind(f))); };
const mime = (f) => ({ jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[f.split(".").pop().toLowerCase()] || "image/jpeg");
const clampFrames = (n) => Math.min(161, Math.max(17, Math.round(n)));

const client = new InferenceClient(TOKEN);
const keepAlive = setInterval(() => {}, 1000); // que node no salga con code 13 si un provider no deja handle de IO
const withTimeout = (p, ms = 240000) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);
const fail = (e) => { console.error(`  FALLO: ${e?.name}: ${e?.message}`); if (e?.httpResponse) e.httpResponse.text().then((t) => console.error("  body:", t)).catch(() => {}); clearInterval(keepAlive); process.exit(1); };

// ---------- 1) IMAGENES (FLUX.1 t2i) primero: pueden ser base de un i2v ----------
const imgJobs = new Map();
for (const esc of spec.escenas ?? []) {
  for (const f of esc.visual.fuentes) {
    if (f.tipo !== "imagen_generada" || !f.prompt) continue;
    if (resolveKind(f.archivo, isImg)) continue;
    if (!imgJobs.has(f.archivo)) imgJobs.set(f.archivo, { archivo: f.archivo, prompt: f.prompt, base: resolveKind(f.base_archivo, isImg) });
  }
}
for (const job of imgJobs.values()) {
  const t0 = Date.now();
  let out;
  try {
    if (job.base) {
      console.log(`\nFLUX.2-dev (edit, ${IMG_PROVIDER}, base=${job.base}) -> ${job.archivo}`);
      const bbuf = await readFile(path.join(publicDir, job.base));
      out = await withTimeout(client.imageToImage({
        model: IMG_EDIT_MODEL, provider: IMG_PROVIDER,
        inputs: new Blob([bbuf], { type: mime(job.base) }),
        parameters: { prompt: job.prompt, image_size: { width: wh.width, height: wh.height } },
      }));
    } else {
      console.log(`\nFLUX.1-dev (t2i, ${IMG_PROVIDER}, ${wh.width}x${wh.height}) -> ${job.archivo}`);
      out = await withTimeout(client.textToImage({
        model: IMG_T2I_MODEL, provider: IMG_PROVIDER, inputs: job.prompt,
        parameters: { image_size: { width: wh.width, height: wh.height }, width: wh.width, height: wh.height },
      }));
    }
  } catch (e) { fail(e); }
  const ibuf = Buffer.from(await out.arrayBuffer());
  await writeFile(path.join(assetsDir, job.archivo), ibuf);
  publicFiles.push((carpeta ? carpeta + "/" : "") + job.archivo); // visible para la deteccion de base del i2v
  console.log(`  ok: ${(ibuf.length / 1e6).toFixed(2)} MB en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// ---------- 2) VIDEOS (t2v sin base / i2v con base) ----------
const vidJobs = new Map();
for (const esc of spec.escenas ?? []) {
  const dur = (esc.t_out ?? 0) - (esc.t_in ?? 0);
  const baseEnEscena = esc.visual.fuentes
    .map((f) => (f.tipo === "asset_cliente" || f.tipo === "imagen_generada") ? resolveKind(f.archivo, isImg) : null)
    .find(Boolean) ?? null;
  for (const f of esc.visual.fuentes) {
    if (f.tipo !== "video_generado" || !f.prompt_movimiento) continue;
    if (resolveKind(f.archivo, isVid)) continue;
    const base = resolveKind(f.base_archivo, isImg) ?? baseEnEscena;
    const j = vidJobs.get(f.archivo) ?? { archivo: f.archivo, prompt: f.prompt_movimiento, negative: f.negative ?? DEFAULT_NEG, dur: 0, base };
    j.dur = Math.max(j.dur, dur);
    vidJobs.set(f.archivo, j);
  }
}
// GUARD de orden: la duracion de cada clip sale de t_out - t_in (job.dur). Si la voz todavia no se
// lockeo (no hay subs.json => no corrio tts + retime), los t_in/t_out son TENTATIVOS y van a cambiar:
// el clip queda mas corto/largo que su escena -> congela el ultimo frame o corta a mitad de movimiento.
// Orden canonico: tts -> retime -> gen:hf. Avisamos (no bloqueamos: a veces solo se pre-generan imagenes).
if (vidJobs.size > 0 && !existsSync(path.join(publicDir, "subs.json"))) {
  console.warn(
    `\n⚠️  Vas a generar ${vidJobs.size} clip(s) de video SIN voz lockeada (no existe public/subs.json).\n` +
    `   Las duraciones (t_out - t_in) son tentativas y el retime las va a cambiar -> el clip no va a\n` +
    `   cuadrar con su escena (freeze/corte). Corré primero:  npm run tts  &&  npm run retime  -- ${path.basename(specFile)}\n`
  );
}

for (const job of vidJobs.values()) {
  const num_frames = clampFrames((job.dur || 4) * FPS);
  const t0 = Date.now();
  let out;
  try {
    if (job.base) {
      console.log(`\ni2v (Wan-14B, ${I2V_PROVIDER}, base=${job.base}) -> ${job.archivo}`);
      const buf = await readFile(path.join(publicDir, job.base));
      out = await withTimeout(client.imageToVideo({
        model: I2V_MODEL, provider: I2V_PROVIDER,
        inputs: new Blob([buf], { type: mime(job.base) }),
        parameters: { prompt: job.prompt, negative_prompt: job.negative, num_frames },
      }));
    } else {
      console.log(`\nt2v (Wan-5B, ${T2V_PROVIDER}, ${aspect}, ${num_frames}f) -> ${job.archivo}`);
      out = await withTimeout(client.textToVideo({
        model: T2V_MODEL, provider: T2V_PROVIDER, inputs: job.prompt,
        parameters: { negative_prompt: job.negative, aspect_ratio: aspect, resolution: "720p", num_frames, frames_per_second: FPS },
      }));
    }
  } catch (e) { fail(e); }
  const vbuf = Buffer.from(await out.arrayBuffer());
  await writeFile(path.join(assetsDir, job.archivo), vbuf);
  console.log(`  ok: ${(vbuf.length / 1e6).toFixed(2)} MB en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

clearInterval(keepAlive);
const n = imgJobs.size + vidJobs.size;
if (!n) console.log("Nada para generar: el manifiesto ya esta resuelto en public/.");
else console.log(`\nlisto: ${imgJobs.size} imagen(es) + ${vidJobs.size} clip(s) en public/. Reencode CFR 30fps (normalize.mjs) y render.`);
