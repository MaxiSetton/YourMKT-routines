// Orquesta el render. Para cada escena resuelve la CADENA DE FUENTES contra lo que existe en public/
// (stand-in del pool de Supabase). La logica "lo que hay es lo que hay" vive aca, en Node.
import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const outDir = path.join(root, "out");
const cliArgs = process.argv.slice(2);
const draft = cliArgs.includes("--draft");
const specFile = cliArgs.find((a) => !a.startsWith("--")) ?? "spec.dia1.json";

const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
// `carpeta` (opcional en el spec): subcarpeta de public/ con los assets de ESTA pieza (organizacion por video).
const carpeta = spec.carpeta ? String(spec.carpeta).replace(/\/+$/, "") : null;

// Lista public/ RECURSIVAMENTE (rutas relativas con "/"): el asset puede vivir en cualquier subcarpeta.
// Resuelve por nombre sin importar la extension (bg.png -> bg.jpg) y PREFIERE la `carpeta` de la pieza.
const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join("/")];
});
const publicFiles = existsSync(publicDir) ? walk(publicDir) : [];
const baseOf = (f) => f.split("/").pop();
const stem = (f) => baseOf(f).replace(/\.[^.]+$/, "").toLowerCase();
const resolveAsset = (name) => {
  if (!name) return null;
  let c = publicFiles.filter((f) => baseOf(f) === name);
  if (!c.length) c = publicFiles.filter((f) => stem(f) === stem(name));
  if (!c.length) return null;
  return (carpeta && c.find((f) => f.startsWith(carpeta + "/"))) || c[0];
};
const VIDEO_EXT = ["mp4", "mov", "webm", "m4v"];
const isVideoFile = (f) => VIDEO_EXT.includes(f.split(".").pop().toLowerCase());

// Resuelve una escena recorriendo la cadena de fuentes en orden de preferencia: la primera que exista gana.
// Un recurso GENERADO declarado (video_generado/imagen_generada) que NO existe es un agujero del manifiesto:
// se reporta como faltante y se sigue al fallback. En render final, cualquier faltante bloquea (ver gate abajo).
function resolverEscena(escena) {
  const faltantes = [];
  for (const f of escena.visual.fuentes) {
    const esGenerado = f.tipo === "video_generado" || f.tipo === "imagen_generada";
    let file = resolveAsset(f.archivo);
    // un recurso generado debe resolver al TIPO correcto: si el stem matchea otro tipo (ej. la foto
    // base del mismo nombre que el clip), NO es el recurso generado -> se considera faltante.
    if (file && f.tipo === "video_generado" && !isVideoFile(file)) file = null;
    if (file && f.tipo === "imagen_generada" && isVideoFile(file)) file = null;
    if (file) {
      const video = isVideoFile(file);
      const resuelto = {
        kind: video ? "video" : "image",
        src: file,
        fit: "cover",
        kenburns: f.tipo === "kenburns" && !video,
        intencion: escena.visual.intencion,
        via: `${f.tipo}:${file}`,
      };
      return { resuelto, faltantes, fallback: faltantes.length > 0 };
    }
    if (esGenerado) {
      faltantes.push({
        escena: escena.id,
        archivo: f.archivo ?? "(sin nombre)",
        tipo: f.tipo,
        base: f.base,
        prompt: f.prompt,
        prompt_movimiento: f.prompt_movimiento,
      });
    }
  }
  return { resuelto: { kind: "placeholder", intencion: escena.visual.intencion, via: "placeholder" }, faltantes, fallback: faltantes.length > 0 };
}

const resumen = [];
const faltantes = [];
for (const escena of spec.escenas) {
  const r = resolverEscena(escena);
  escena.resuelto = r.resuelto;
  faltantes.push(...r.faltantes);
  resumen.push(`${escena.rol}: ${escena.resuelto.kind}${escena.resuelto.src ? ` (${escena.resuelto.src})` : ""}${r.fallback ? "  ⚠ FALLBACK (falta el recurso dirigido)" : ""}`);
  // overlays que referencian un archivo (ej. logo del BrandTag): también es un recurso que debe existir.
  for (const ov of escena.overlays ?? []) {
    const logo = ov.props?.logo;
    if (typeof logo === "string" && !resolveAsset(logo)) {
      faltantes.push({ escena: escena.id, archivo: logo, tipo: "logo", base: ov.componente });
    }
  }
}

if (spec.audio.musica) {
  const m = resolveAsset(spec.audio.musica.src);
  spec.audio.musica.exists = Boolean(m);
  if (m) spec.audio.musica.src = m;
}
const voiceExists = existsSync(path.join(publicDir, "voice.mp3"));
const subs = existsSync(path.join(publicDir, "subs.json"))
  ? JSON.parse(await readFile(path.join(publicDir, "subs.json"), "utf8"))
  : [];

// rangos donde se oculta el subtitulo (escenas con tarjeta propia, ej. CTA)
const hideRanges = spec.escenas.filter((e) => e.ocultarSubtitulos).map((e) => [e.t_in, e.t_out]);

await mkdir(outDir, { recursive: true });
const propsPath = path.join(outDir, "props.json");
await writeFile(propsPath, JSON.stringify({ spec, subs, voiceExists, hideRanges }, null, 2));

console.log(`spec: ${specFile} (${spec.arquetipo}) | voz: ${voiceExists ? "ok" : "FALTA"} | subs: ${subs.length} | musica: ${spec.audio.musica?.exists ? "ok" : "falta"}`);
console.log("escenas ->", resumen.join("  |  "));

// GATE: recursos generados declarados que faltan -> manifiesto. En final no se renderiza (sin fallback mudo).
if (faltantes.length) {
  console.log(`\n⚠ Faltan ${faltantes.length} recurso(s) declarado(s). MANIFIESTO A GENERAR (HF) y dejar en public/:`);
  for (const m of faltantes) {
    console.log(`  • ${m.archivo}  [${m.tipo}]  (escena: ${m.escena}${m.base ? `, base: ${m.base}` : ""})`);
    if (m.prompt) console.log(`      imagen: ${m.prompt}`);
    if (m.prompt_movimiento) console.log(`      movimiento: ${m.prompt_movimiento}`);
  }
  if (!draft) {
    console.log(`\nNo renderizo la pieza final. Generá esos recursos, guardalos con ese nombre en public/ y volvé a correr.`);
    console.log(`Para previsualizar el armado con fallbacks: node scripts/render.mjs ${specFile} --draft`);
    process.exit(2);
  }
  console.log(`\n[--draft] Renderizo con fallbacks (Ken Burns). Es un BORRADOR para previsualizar — NO es la pieza final.`);
}

const outFile = path.join(outDir, `${spec.id ?? "reel"}.mp4`);
// --concurrency bajo + caché grande de OffthreadVideo: evita "No frame found at position"
// (la caché de video se desaloja bajo presión de memoria; ver troubleshooting de Remotion).
const args = [
  "render", "Reel", outFile, `--props=${propsPath}`,
  "--concurrency=2",
  "--offthreadvideo-cache-size-in-bytes=2000000000",
];
const bin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "remotion.cmd" : "remotion");
console.log(`\n> remotion ${args.join(" ")}\n`);

const child = spawn(bin, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
child.on("exit", (code) => {
  if (code === 0) console.log(`\nlisto: ${outFile}`);
  process.exit(code ?? 1);
});
