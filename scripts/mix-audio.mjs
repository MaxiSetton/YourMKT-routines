// Mezcla de audio determinista (FFmpeg): voz + música (ducked por sidechain) + SFX colocados al segundo,
// normalizado a -14 LUFS, pegado sobre el video renderizado. Reemplaza a post.mjs cuando hay SFX/ducking.
// Lee spec.audio (musica + sfx[]) y resuelve el ancla de cada SFX:
//   t: <seg>  |  corte: "<id_escena>" (-> su t_in)  |  palabra: <n> (-> from de la n-esima palabra en subs.json)
// Uso:  node scripts/mix-audio.mjs spec.dia4.json [out/<id>.mp4]   -> out/<id>-final.mp4
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const outDir = path.join(root, "out");

// ffmpeg/ffprobe de .tools o PATH
const toolsDir = path.join(root, ".tools");
let ffmpeg = "ffmpeg", ffprobe = "ffprobe";
if (existsSync(toolsDir)) for (const d of readdirSync(toolsDir)) {
  if (existsSync(path.join(toolsDir, d, "bin", "ffmpeg.exe"))) ffmpeg = path.join(toolsDir, d, "bin", "ffmpeg.exe");
  if (existsSync(path.join(toolsDir, d, "bin", "ffprobe.exe"))) ffprobe = path.join(toolsDir, d, "bin", "ffprobe.exe");
}

const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const specFile = positional[0] ?? "spec.dia4.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
const videoIn = positional[1] ? path.resolve(positional[1]) : path.join(outDir, `${spec.id ?? "reel"}.mp4`);
// modo "audio_nativo_ig" (o --no-music): export SIN cama de música; el usuario agrega el audio nativo/trending en IG.
const igMode = spec.audio?.modo === "audio_nativo_ig";
const noMusic = igMode || flags.includes("--no-music");
if (!existsSync(videoIn)) { console.error(`No existe ${videoIn} — corré render.mjs primero.`); process.exit(1); }
const voice = path.join(publicDir, "voice.mp3");
if (!existsSync(voice)) { console.error("Falta public/voice.mp3 — corré tts.mjs primero."); process.exit(1); }
const outFile = path.join(outDir, `${spec.id ?? "reel"}-final.mp4`);

// resuelve recursivamente (el asset puede estar en una subcarpeta por-video), por nombre/stem, prefiriendo `carpeta`
const carpeta = spec.carpeta ? String(spec.carpeta).replace(/\/+$/, "") : null;
const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join("/")];
});
const allFiles = existsSync(publicDir) ? walk(publicDir) : [];
const baseOf = (f) => f.split("/").pop();
const stemf = (f) => baseOf(f).replace(/\.[^.]+$/, "").toLowerCase();
const resolveFile = (name) => {
  if (!name) return null;
  let c = allFiles.filter((f) => baseOf(f) === name);
  if (!c.length) c = allFiles.filter((f) => stemf(f) === stemf(name));
  if (!c.length) return null;
  return (carpeta && c.find((f) => f.startsWith(carpeta + "/"))) || c[0];
};

// duración del video
const dur = Number(spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", videoIn], { encoding: "utf8" }).stdout.trim()) || (spec.duracion_seg ?? 15);

// timing por palabra (subs.json) para anclar SFX a palabras
let words = [];
const subsPath = path.join(publicDir, "subs.json");
if (existsSync(subsPath)) words = JSON.parse(await readFile(subsPath, "utf8")).flatMap((b) => b.words ?? []);
const escenaTin = Object.fromEntries((spec.escenas ?? []).map((e) => [e.id, e.t_in]));

// segundos de un cue segun su ancla
function cueSeconds(c) {
  if (typeof c.t === "number") return c.t;
  if (c.corte != null && escenaTin[c.corte] != null) return escenaTin[c.corte];
  if (typeof c.palabra === "number" && words[c.palabra]) return words[c.palabra].from;
  return null;
}
const VOL_DEFAULT = { whoosh: 0.5, riser: 0.45, impact: 0.7, pop: 0.55, subdrop: 0.6, ambience: 0.25 };
// Largo máximo por tipo (seg). Los SFX de banco vienen largos y "zumban" si se reproducen enteros:
// recortamos el acento a la longitud del evento + fade-out, así subraya y no ensucia. `ambience` es una
// cama diegética (vapor/molienda) y va SOSTENIDA → no se recorta a transiente. Override por cue: `dur`.
const SFX_MAXLEN = { whoosh: 0.6, pop: 0.4, impact: 0.8, riser: 1.2, subdrop: 1.0, ambience: null };
const SFX_FADE = 0.12; // fade-out al final del recorte (evita el corte seco que clickea)

const musica = spec.audio?.musica;
const musicaSrc = (!noMusic && musica?.src) ? resolveFile(musica.src) : null;
const duck = musica?.duck !== false; // default true
const mVol = musica?.volumen ?? 0.2;
const mStart = Number(musica?.start_seg ?? 0); // offset en seg para alinear la actividad de la música a las pausas

// Énfasis como FUENTE ÚNICA: cada escena.enfasis con sfx_archivo => un acento anclado a la MISMA palabra
// que resalta el render (Subtitles lee el mismo word_idx). Así el pop sonoro y el visual caen en el mismo
// frame, sin declarar índices por separado (anti-drift). El director NO agrega además un cue manual ahí.
const enfasisCues = (spec.escenas ?? [])
  .filter((e) => e.enfasis && typeof e.enfasis.word_idx === "number" && e.enfasis.sfx_archivo)
  .map((e) => ({ tipo: e.enfasis.sfx || "pop", archivo: e.enfasis.sfx_archivo, palabra: e.enfasis.word_idx }));
const declaredCues = [...(spec.audio?.sfx ?? []), ...enfasisCues];

// SFX que existen en public/
const sfxCues = declaredCues
  .map((c) => ({ ...c, sec: cueSeconds(c), file: resolveFile(c.archivo) }))
  .filter((c) => c.sec != null && c.file);
const missing = declaredCues.filter((c) => !resolveFile(c.archivo));
if (missing.length) console.log(`(aviso) ${missing.length} SFX declarado(s) sin archivo en public/ — se omiten: ${missing.map((m) => m.archivo).join(", ")}`);

// --- construir inputs + filtergraph ---
const inputs = ["-i", videoIn, "-i", voice];
let idx = 2; // 0=video, 1=voz
const fc = [];
const needKey = Boolean(musicaSrc) && duck; // [vkey] solo se usa para el sidechain de la música
fc.push(`[1:a]aformat=sample_rates=48000:channel_layouts=stereo${needKey ? ",asplit=2[voc][vkey]" : "[voc]"}`);
const mixLabels = ["[voc]"];

if (musicaSrc) {
  inputs.push("-stream_loop", "-1", "-i", path.join(publicDir, musicaSrc));
  const mi = idx++;
  fc.push(`[${mi}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=${mStart.toFixed(3)}:${(mStart + dur).toFixed(3)},asetpts=PTS-STARTPTS,volume=${mVol}[mraw]`);
  if (duck) {
    // Ducking DINÁMICO: baja claro bajo la voz y vuelve PLENA en los silencios (sube cuando no habla).
    fc.push(`[mraw][vkey]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=260[mduck]`);
    mixLabels.push("[mduck]");
  } else {
    mixLabels.push("[mraw]");
  }
}

sfxCues.forEach((c, i) => {
  inputs.push("-i", path.join(publicDir, c.file));
  const si = idx++;
  const ms = Math.max(0, Math.round(c.sec * 1000));
  const vol = c.vol ?? VOL_DEFAULT[c.tipo] ?? 0.5;
  // Recorte al largo del evento (anti-"zumbido") + fade-out; ambience va sostenida (no se recorta).
  // El cue puede sobrescribir el largo con `dur`. Si el archivo es más corto, atrim/afade no hacen daño.
  const maxLen = c.dur ?? SFX_MAXLEN[c.tipo];
  const cut = maxLen
    ? `atrim=0:${maxLen.toFixed(2)},asetpts=PTS-STARTPTS,afade=t=out:st=${Math.max(0, maxLen - SFX_FADE).toFixed(2)}:d=${SFX_FADE},`
    : "";
  fc.push(`[${si}:a]aformat=sample_rates=48000:channel_layouts=stereo,${cut}volume=${vol},adelay=${ms}:all=1[s${i}]`);
  mixLabels.push(`[s${i}]`);
});

fc.push(`${mixLabels.join("")}amix=inputs=${mixLabels.length}:duration=longest:normalize=0[mixed]`);
fc.push(`[mixed]loudnorm=I=-14:TP=-1.5:LRA=11[outa]`);

const args = [
  "-y", "-loglevel", "error",
  ...inputs,
  "-filter_complex", fc.join(";"),
  "-map", "0:v:0", "-map", "[outa]",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  "-t", dur.toFixed(3), "-movflags", "+faststart",
  outFile,
];

console.log(`mezcla: voz${musicaSrc ? ` + música(${musicaSrc}${duck ? ", ducked" : ""})` : ""} + ${sfxCues.length} SFX -> ${path.basename(outFile)}`);
for (const c of sfxCues) console.log(`  ${c.sec.toFixed(2)}s  ${c.tipo}  ${c.file}`);
const r = spawnSync(ffmpeg, args, { stdio: "inherit", shell: process.platform === "win32" });
if (r.status !== 0) { console.error("fallo la mezcla"); process.exit(1); }
console.log(`\nlisto: ${outFile} (-14 LUFS)`);
if (noMusic) console.log(`[IG] Export SIN cama de música (voz + SFX). Subí el reel y agregá el audio nativo en la app${spec.audio?.ig_audio ? `: ${spec.audio.ig_audio}` : ""} (bajale el volumen para que se oiga la voz).`);
