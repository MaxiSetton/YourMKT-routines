// FALLBACK de voz (Routine 3): el environment no tiene la referencia de voz para clonar con OmniVoice
// (no existe public/audio-[vocals].mp3 ni hay fuente en la DB). Se usa la voz CONFIGURADA de la marca
// (businesses.voz_preferencia == spec.audio.voz.voz_tts == es-AR-TomasNeural) vía EdgeTTS, y los subs
// salen de la alineación forzada REAL (align_words.py / faster-whisper), igual que el camino canónico.
import { EdgeTTS } from "@andresaya/edge-tts";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const specFile = process.argv[2] ?? "spec.dia4.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
const texto = spec.audio.voz.texto.replace(/\[PAUS[AE](=[\d.]+)?\]/gi, " ").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
const voz = spec.audio.voz.voz_tts || "es-AR-TomasNeural";
const maxPalabras = spec.subtitulos?.maxPalabras ?? 4;

await mkdir(publicDir, { recursive: true });
console.log(`EdgeTTS (${voz}) -> public/voice.mp3`);
const tts = new EdgeTTS();
await tts.synthesize(texto, voz, { rate: "-10%" });
await tts.toFile(path.join(publicDir, "voice")); // -> public/voice.mp3
console.log(`voice.mp3 generado (~${tts.getDuration?.()?.toFixed?.(1) ?? "?"}s)`);

// voice.wav para la alineación forzada (faster-whisper)
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(publicDir, "voice.mp3"),
  "-ar", "24000", "-ac", "1", path.join(publicDir, "voice.wav")]);

// subs.json con timing REAL por palabra (align_words.py), mismo formato que el camino canónico
const cleanText = texto.replace(/"/g, "'");
const out = execFileSync("python", [path.join(root, "scripts", "align_words.py"),
  "--audio", path.join(publicDir, "voice.wav"), "--text", cleanText,
  "--out", path.join(publicDir, "subs.json"), "--max", String(maxPalabras)], { encoding: "utf8" });
console.log(out.trim());
console.log("OK: voice.mp3 + voice.wav + subs.json (alineación forzada faster-whisper).");
