// Genera los recursos del manifiesto (imagenes FLUX + clips i2v LTX-2) llamando a endpoints de
// inferencia (Modal serverless del claude-code-video-toolkit, o cualquier endpoint con el mismo
// contrato). Reemplaza el paso manual de HF: lee el spec, detecta lo que falta y lo deja en public/.
//
// .env:  MODAL_LTX_URL=...   MODAL_FLUX_URL=...   (los web endpoints que devuelve `modal deploy`)
// Uso:   node scripts/generate.mjs [spec.dia2.json]
// Después: node scripts/normalize.mjs <clips>  &&  node scripts/render.mjs <spec>
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const outDir = path.join(root, "out");
const LTX = env.MODAL_LTX_URL;
const WAN = env.MODAL_WAN_URL;
const VIDEO_URL = WAN || LTX; // preferimos Wan 2.2 si está deployado; si no, LTX
const FLUX = env.MODAL_FLUX_URL;

const specFile = process.argv[2] ?? "spec.dia2.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));

// --- helpers (mismo criterio que render.mjs) ---
const publicFiles = existsSync(publicDir) ? readdirSync(publicDir) : [];
const stem = (f) => f.replace(/\.[^.]+$/, "").toLowerCase();
const resolveAsset = (name) =>
  !name ? null : publicFiles.includes(name) ? name : publicFiles.find((f) => stem(f) === stem(name)) ?? null;
const ASPECT = { "9:16": { w: 704, h: 1280 }, "4:5": { w: 1024, h: 1280 }, "1:1": { w: 1024, h: 1024 }, "16:9": { w: 1280, h: 704 } };
const dims = ASPECT[spec.aspect] ?? ASPECT["9:16"];
const framesFor = (seconds, fps = 24) => { let k = Math.max(Math.ceil(seconds * fps), 25); while ((k - 1) % 8 !== 0) k++; return k; };
const IMG_TYPES = new Set(["imagen_generada", "kenburns", "asset_cliente"]);

// base para i2v: 1) out/<stem>.base.jpg (recorte 9:16 que dejamos), 2) la imagen base de la escena en public/
function baseImagePath(archivo, baseArchivo) {
  const crop = path.join(outDir, `${archivo.replace(/\.[^.]+$/, "")}.base.jpg`);
  if (existsSync(crop)) return crop;
  const f = resolveAsset(baseArchivo);
  return f ? path.join(publicDir, f) : null;
}

// --- recolectar jobs (dedup por archivo) ---
const imgJobs = new Map();
const vidJobs = new Map();
for (const esc of spec.escenas ?? []) {
  const dur = (esc.t_out ?? 0) - (esc.t_in ?? 0);
  const baseEnEscena = esc.visual.fuentes.find((f) => IMG_TYPES.has(f.tipo) && f.archivo)?.archivo;
  for (const f of esc.visual.fuentes) {
    if (resolveAsset(f.archivo)) continue; // ya existe en public/
    if (f.tipo === "imagen_generada" && f.prompt) {
      imgJobs.set(f.archivo, { archivo: f.archivo, prompt: f.prompt });
    } else if (f.tipo === "video_generado" && f.prompt_movimiento) {
      const j = vidJobs.get(f.archivo) ?? { archivo: f.archivo, prompt: f.prompt_movimiento, base: f.base_archivo ?? baseEnEscena, dur: 0 };
      j.dur = Math.max(j.dur, dur);
      vidJobs.set(f.archivo, j);
    }
  }
}

if (!imgJobs.size && !vidJobs.size) { console.log("Nada para generar: el manifiesto ya está resuelto en public/."); process.exit(0); }
if (imgJobs.size && !FLUX) { console.error("Faltan imágenes por generar pero no hay MODAL_FLUX_URL en .env"); process.exit(1); }
if (vidJobs.size && !VIDEO_URL) { console.error("Faltan clips por generar pero no hay MODAL_WAN_URL ni MODAL_LTX_URL en .env"); process.exit(1); }

async function callJson(url, payload) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const j = await r.json();
  if (j.success === false) throw new Error(j.error ?? "fallo de inferencia");
  return j;
}

// 1) imágenes (FLUX) — primero, porque un clip i2v puede derivar de una imagen generada
for (const job of imgJobs.values()) {
  console.log(`FLUX  -> ${job.archivo}`);
  const j = await callJson(FLUX, { operation: "generate", prompt: job.prompt, width: dims.w, height: dims.h });
  if (!j.image_base64) throw new Error(`FLUX no devolvió image_base64 para ${job.archivo}`);
  await writeFile(path.join(publicDir, job.archivo), Buffer.from(j.image_base64, "base64"));
  publicFiles.push(job.archivo);
}

// 2) clips i2v (LTX-2)
for (const job of vidJobs.values()) {
  const base = baseImagePath(job.archivo, job.base);
  if (!base) { console.error(`Sin imagen base para ${job.archivo} (base: ${job.base}). Generá/dejá la base y reintentá.`); process.exit(1); }
  const image_base64 = (await readFile(base)).toString("base64");
  const num_frames = framesFor(job.dur || 5);
  console.log(`i2v -> ${job.archivo}  (base: ${path.basename(base)}, ${num_frames}f @24, ${dims.w}x${dims.h})`);
  const j = await callJson(VIDEO_URL, { prompt: job.prompt, image_base64, width: dims.w, height: dims.h, num_frames, fps: 24, quality: "standard" });
  if (!j.video_base64) throw new Error(`el endpoint no devolvió video_base64 para ${job.archivo}`);
  await writeFile(path.join(publicDir, job.archivo), Buffer.from(j.video_base64, "base64"));
}

console.log(`\nlisto: ${imgJobs.size} imagen(es) + ${vidJobs.size} clip(s) en public/.`);
if (vidJobs.size) console.log(`Ahora: node scripts/normalize.mjs ${[...vidJobs.keys()].join(" ")}  &&  node scripts/render.mjs ${specFile}`);
