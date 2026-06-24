// Normaliza clips de HF para que Remotion pueda hacer seek (evita "No frame found at position").
// Los modelos i2v exportan H.264 con timestamps/GOP que el compositor no indexa -> re-encode a
// H.264 limpio, CFR 30fps, keyframes parejos, +faststart. Guarda el crudo como <nombre>.src.mp4.
// Uso:  node scripts/normalize.mjs [archivo1.mp4 archivo2.mp4 ...]
//   sin args: normaliza todos los public/*.mp4 que todavia no tengan su .src.mp4 (= aun crudos).
import { existsSync, readdirSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");

// ffmpeg de .tools (build estatico) o del PATH
const toolsDir = path.join(root, ".tools");
let ffmpeg = "ffmpeg";
if (existsSync(toolsDir)) {
  for (const d of readdirSync(toolsDir)) {
    const cand = path.join(toolsDir, d, "bin", "ffmpeg.exe");
    if (existsSync(cand)) { ffmpeg = cand; break; }
  }
}

const isSrc = (f) => f.endsWith(".src.mp4");
// public/ se organiza por-video en subcarpetas y gen:hf escribe ahi -> resolvemos los args RECURSIVAMENTE
// por basename (igual que render/gen/mix), preservando la subcarpeta en la salida.
const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join("/")];
});
const allRel = existsSync(publicDir) ? walk(publicDir) : [];
const baseOf = (f) => f.split("/").pop();
const resolveRel = (name) => {
  const norm = name.split(path.sep).join("/");
  if (existsSync(path.join(publicDir, norm))) return norm; // ruta relativa tal cual (incluye subcarpeta)
  return allRel.find((f) => baseOf(f) === baseOf(norm)) ?? norm; // por basename en cualquier subcarpeta
};

let targets = process.argv.slice(2);
if (!targets.length) {
  // sin args: solo los clips crudos del top-level de public/ (conservador; no toca subcarpetas con cache)
  targets = readdirSync(publicDir).filter(
    (f) => f.endsWith(".mp4") && !isSrc(f) && !existsSync(path.join(publicDir, f.replace(/\.mp4$/, ".src.mp4")))
  );
}
if (!targets.length) { console.log("Nada para normalizar."); process.exit(0); }

for (const name of targets) {
  const rel = resolveRel(name);
  const inPath = path.join(publicDir, rel);
  if (!existsSync(inPath)) { console.log(`(skip) no existe: ${rel}`); continue; }
  const srcPath = inPath.replace(/\.mp4$/, ".src.mp4");
  // preservar el crudo como .src.mp4 (una sola vez) y re-encodear desde ahi
  if (!existsSync(srcPath)) renameSync(inPath, srcPath);
  console.log(`> normalizando ${rel}  (crudo -> ${path.basename(srcPath)})`);
  const r = spawnSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", srcPath,
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-r", "30", "-g", "30", "-crf", "18", "-movflags", "+faststart", "-an",
    inPath,
  ], { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) { console.error(`fallo el re-encode de ${rel}`); process.exit(1); }
}
console.log("listo: clips Remotion-safe en public/");
