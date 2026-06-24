// Genera public/voice.wav con OmniVoice usando una voz de referencia.
// Soporta pausas explícitas mediante el tag [PAUSA=X.X].
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import dotenv from "dotenv";
import { exec } from "node:child_process";
import { promisify } from "node:util";

dotenv.config();
const execAsync = promisify(exec);

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const specFile = process.argv[2] ?? "spec.dia1.json";

const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
let rawText = spec.audio.voz.texto.replace(/[\r\n]+/g, " ").trim();
const maxPalabras = spec.subtitulos?.maxPalabras ?? 4;
// OmniVoice mete una "o" espuria al inicio de CADA bloque (artefacto de clonacion zero-shot).
// Se recortan estos ms del inicio de cada generacion (omnivoice_local.py). Override: TTS_TRIM_HEAD_MS.
const TRIM_HEAD_MS = Number(process.env.TTS_TRIM_HEAD_MS ?? 120);

await mkdir(publicDir, { recursive: true });

// --- 1. PARSEO DE PAUSAS ---
// Tags: [PAUSA=X.X] (duracion fija) o [PAUSA] (marcador -> usa el default; se afina midiendo los
// bloques y fijando cada pausa por separado, ver skill guionista). El valor es opcional.
const PAUSE_DEFAULT = Number(process.env.TTS_PAUSE_DEFAULT ?? 0.3);
const segments = [];
const regex = /\[PAUS[AE](?:=([\d.]+))?\]/gi;
let lastIndex = 0;
let match;
while ((match = regex.exec(rawText)) !== null) {
  const textBefore = rawText.slice(lastIndex, match.index).trim();
  if (textBefore) segments.push({ type: 'text', text: textBefore });
  segments.push({ type: 'pause', duration: match[1] != null ? parseFloat(match[1]) : PAUSE_DEFAULT });
  lastIndex = regex.lastIndex;
}
const textAfter = rawText.slice(lastIndex).trim();
if (textAfter) segments.push({ type: 'text', text: textAfter });

if (segments.length === 0) segments.push({ type: 'text', text: rawText });

// El texto limpio que se pasa a align_words.py
const cleanText = segments.filter(s => s.type === 'text').map(s => s.text).join(" ").replace(/"/g, "'");

// --- 2. GENERACION OMNIVOICE (LOCAL CPU) ---
console.log(`Clonando voz con OmniVoice LOCALMENTE por bloques...`);
const ref_audio_path = path.join(publicDir, "audio-[vocals].mp3");
const scriptPath = path.join(root, "scripts", "omnivoice_local.py");

const toolsDir = path.join(root, ".tools");
let ffmpeg = "ffmpeg";
if (existsSync(toolsDir)) for (const d of readdirSync(toolsDir)) {
  if (existsSync(path.join(toolsDir, d, "bin", "ffmpeg.exe"))) ffmpeg = path.join(toolsDir, d, "bin", "ffmpeg.exe");
}

// Cache de bloques de VOZ por hash del (texto + speed + trim): cambiar SOLO las pausas no re-sintetiza
// (OmniVoice es lento). La síntesis se hace una vez por texto de bloque; re-ensamblar es instantáneo.
const cacheDir = path.join(publicDir, ".tts-cache");
await mkdir(cacheDir, { recursive: true });
const blockKey = (text) => createHash("md5").update(`${text}|trim=${TRIM_HEAD_MS}|sp=0.85|onset=v2`).digest("hex").slice(0, 16);

const partFiles = [];   // orden final (voz cacheada + silencios)
const tempsToDelete = []; // solo silencios + concat list (los bloques de voz quedan en cache)
let partIndex = 0;

for (const seg of segments) {
  if (seg.type === 'text') {
    const key = blockKey(seg.text);
    const cWav = path.join(cacheDir, `${key}.wav`);
    if (!existsSync(cWav)) {
      const tCmd = seg.text.replace(/"/g, "'");
      const command = `python "${scriptPath}" --text "${tCmd}" --ref_audio "${ref_audio_path}" --output "${cWav}" --trim_ms ${TRIM_HEAD_MS}`;
      try {
        await execAsync(command);
        console.log(`  bloque sintetizado [${key}]: "${seg.text.slice(0, 48)}${seg.text.length > 48 ? "…" : ""}"`);
      } catch (e) {
        console.error(`Fallo en OmniVoice para el bloque: ${seg.text}`, e);
        process.exit(1);
      }
    } else {
      console.log(`  bloque CACHE [${key}]: "${seg.text.slice(0, 48)}${seg.text.length > 48 ? "…" : ""}"`);
    }
    partFiles.push(cWav);
  } else if (seg.type === 'pause') {
    const pWav = path.join(publicDir, `_temp_sil_${partIndex}.wav`);
    // Silencio: mismo sample rate (24000) y canales (mono) que OmniVoice para que el concat -c copy funcione.
    try {
      await execAsync(`"${ffmpeg}" -y -f lavfi -i aevalsrc=0:sample_rate=24000 -t ${seg.duration} -c:a pcm_s16le -ac 1 "${pWav}"`);
      partFiles.push(pWav);
      tempsToDelete.push(pWav);
    } catch (e) {
      console.error("Fallo generando silencio", e);
      process.exit(1);
    }
  }
  partIndex++;
}

// Concatenar todos
const concatListFile = path.join(publicDir, "_concat_list.txt");
const concatContent = partFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
await writeFile(concatListFile, concatContent);

const voicePath = path.join(publicDir, "voice.wav");
const voiceMp3Path = path.join(publicDir, "voice.mp3");

console.log("Concatenando bloques de audio...");
try {
  await execAsync(`"${ffmpeg}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${voicePath}"`);
} catch (e) {
  console.error("Fallo concatenando WAVs", e);
  process.exit(1);
}

// Limpiar SOLO silencios + lista de concat (los bloques de voz quedan en .tts-cache para reuso)
for (const f of tempsToDelete) {
  if (existsSync(f)) unlinkSync(f);
}
if (existsSync(concatListFile)) unlinkSync(concatListFile);

// Convertir a MP3
const conv = await execAsync(`"${ffmpeg}" -y -i "${voicePath}" -codec:a libmp3lame -q:a 2 "${voiceMp3Path}"`);
if (conv.stderr && !existsSync(voiceMp3Path)) {
  console.error("Fallo al convertir voice.wav -> voice.mp3", conv.stderr);
  process.exit(1);
}

// --- 3. SUBTITULOS KARAOKE ---
console.log("Alineando subtitulos (faster-whisper)...");
const alignScript = path.join(root, "scripts", "align_words.py");
const subsPath = path.join(publicDir, "subs.json");
try {
  const { stdout } = await execAsync(
    `python "${alignScript}" --audio "${voicePath}" --text "${cleanText}" --out "${subsPath}" --max ${maxPalabras}`
  );
  console.log(stdout.trim());
  
  // Limpiar puntuacion de los subtitulos para que Remotion los renderice limpios
  if (existsSync(subsPath)) {
    const rawSubs = JSON.parse(await readFile(subsPath, "utf8"));
    for (const b of rawSubs) {
      if (b.words) {
        for (const w of b.words) {
          if (w.w) {
            w.w = w.w.replace(/[.,!?…]/g, "");
          }
        }
      }
    }
    await writeFile(subsPath, JSON.stringify(rawSubs, null, 2));
  }
} catch (e) {
  console.error("Fallo la alineacion de subtitulos:", e.stderr || e.message);
  process.exit(1);
}
console.log(`TTS ok: voice.mp3 generado por bloques + subs.json alineados y limpios.`);
