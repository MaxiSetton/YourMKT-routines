// Alinea la ACTIVIDAD de la música a las PAUSAS de la voz. Analiza la envolvente de energía de la música
// (RMS por ventana) y elige el OFFSET de inicio (musica.start_seg) que maximiza energía en los huecos sin
// voz y la minimiza bajo la voz -> los picos/swells de la música caen en las pausas y se calma cuando se habla.
// Lo consume mix-audio.mjs (atrim desde start_seg). Corré DESPUES de tts + retime (necesita subs.json + duracion).
// Uso: node scripts/align-music.mjs spec.<id>.json
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const toolsDir = path.join(root, ".tools");
let ffmpeg = "ffmpeg";
if (existsSync(toolsDir)) for (const d of readdirSync(toolsDir)) {
  if (existsSync(path.join(toolsDir, d, "bin", "ffmpeg.exe"))) ffmpeg = path.join(toolsDir, d, "bin", "ffmpeg.exe");
}

const specFile = process.argv[2] ?? "spec.dia4.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
if (!spec.audio?.musica?.src) { console.log("Sin música en el spec — nada que alinear."); process.exit(0); }
const dur = spec.duracion_seg;

// resolver el archivo de música (recursivo, prefiriendo la carpeta de la pieza) — igual que mix-audio
const carpeta = spec.carpeta ? String(spec.carpeta).replace(/\/+$/, "") : null;
const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join("/")];
});
const allFiles = existsSync(publicDir) ? walk(publicDir) : [];
const baseOf = (f) => f.split("/").pop();
const stemf = (f) => baseOf(f).replace(/\.[^.]+$/, "").toLowerCase();
const resolveFile = (name) => {
  let c = allFiles.filter((f) => baseOf(f) === name);
  if (!c.length) c = allFiles.filter((f) => stemf(f) === stemf(name));
  return (carpeta && c.find((f) => f.startsWith(carpeta + "/"))) || c[0] || null;
};
const musRel = resolveFile(spec.audio.musica.src);
if (!musRel) { console.error(`No encuentro la música ${spec.audio.musica.src} en public/`); process.exit(1); }

// decodificar música a PCM mono f32le @ 8kHz (suficiente para una envolvente de energía)
const SR = 8000;
const r = spawnSync(ffmpeg, ["-v", "error", "-i", path.join(publicDir, musRel), "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"],
  { maxBuffer: 1 << 30 });
if (r.status !== 0 || !r.stdout?.length) { console.error("No pude decodificar la música"); process.exit(1); }
const buf = r.stdout;
const pcm = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));

// envolvente RMS por ventana de 100ms, normalizada 0..1
const W = 0.1, win = Math.round(SR * W);
const nbins = Math.floor(pcm.length / win);
const e = new Float32Array(nbins);
for (let b = 0; b < nbins; b++) { let s = 0; for (let k = 0; k < win; k++) { const v = pcm[b * win + k]; s += v * v; } e[b] = Math.sqrt(s / win); }
let emax = 0; for (let b = 0; b < nbins; b++) emax = Math.max(emax, e[b]);
if (emax > 0) for (let b = 0; b < nbins; b++) e[b] /= emax;

// máscara de voz/pausa del reel por ventana (de subs.json)
const subsPath = path.join(publicDir, "subs.json");
const words = existsSync(subsPath) ? JSON.parse(await readFile(subsPath, "utf8")).flatMap((bk) => bk.words ?? []) : [];
const reelBins = Math.ceil(dur / W);
const voiced = new Float32Array(reelBins);
for (const w of words) { const a = Math.floor(w.from / W), b = Math.ceil(w.to / W); for (let i = a; i < b && i < reelBins; i++) voiced[i] = 1; }
// peso: +1 en pausa, -1 bajo la voz -> el offset óptimo pone los picos en las pausas y la calma bajo la voz
const wgt = new Float32Array(reelBins);
for (let i = 0; i < reelBins; i++) wgt[i] = voiced[i] ? -1 : 1;

const maxOff = Math.max(0, nbins - reelBins);
let best = 0, bestScore = -Infinity;
for (let off = 0; off <= maxOff; off++) {
  let score = 0;
  for (let i = 0; i < reelBins; i++) { const mi = off + i; if (mi < nbins) score += e[mi] * wgt[i]; }
  if (score > bestScore) { bestScore = score; best = off; }
}
const startSeg = +(best * W).toFixed(2);
spec.audio.musica.start_seg = startSeg;
await writeFile(path.join(root, specFile), JSON.stringify(spec, null, 2));
console.log(`align-music: start_seg=${startSeg}s  (música ${(nbins * W).toFixed(0)}s, reel ${dur}s, score=${bestScore.toFixed(1)})`);
console.log(`  -> los swells de la música caen en las pausas; se calma bajo la voz. mix-audio lo usa por atrim.`);
