import textToSpeech from '@google-cloud/text-to-speech';
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "test-tts", "public"); // local to test-tts
const specFile = process.argv[2] ?? "test-tts/spec-test.json";

const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
const { texto, voz_tts } = spec.audio.voz;
const maxPalabras = spec.subtitulos?.maxPalabras ?? 4;

await mkdir(publicDir, { recursive: true });

// Process SSML to inject <mark> for word boundaries
let markedSsml = "";
let wordIndex = 0;
let words = [];

// Ensure it has <speak>
let ssml = texto;
if (!ssml.includes("<speak>")) ssml = `<speak>${ssml}</speak>`;

ssml.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, textChunk) => {
  if (tag) {
    markedSsml += tag;
  } else if (textChunk) {
    markedSsml += textChunk.replace(/([\wáéíóúñÁÉÍÓÚÑ]+)/g, (w) => {
      words.push(w);
      return `<mark name="${wordIndex++}"/>${w}`;
    });
  }
});

console.log("Generating audio with Google Cloud TTS...");
const client = new textToSpeech.TextToSpeechClient();

const request = {
  input: { ssml: markedSsml },
  voice: { languageCode: 'es-AR', name: voz_tts || 'es-AR-Neural2-B' },
  audioConfig: { audioEncoding: 'MP3' },
  enableTimePointing: ['SSML_MARK']
};

const [response] = await client.synthesizeSpeech(request);

// Write Audio
const audioPath = path.join(publicDir, "voice.mp3");
await writeFile(audioPath, response.audioContent, 'binary');

// Process Subtitles
const timepoints = response.timepoints || [];
const boundary = timepoints.map((tp, i) => {
    const nextTp = timepoints[i+1];
    return {
        w: words[parseInt(tp.markName)],
        from: tp.timeSeconds,
        to: nextTp ? nextTp.timeSeconds : tp.timeSeconds + 0.4
    };
});

// Group into subtitle lines
const PAUSA = 0.3;
const cap = Math.max(maxPalabras, 5);
const subs = [];
let cur = [];
for (let i = 0; i < boundary.length; i++) {
  cur.push(boundary[i]);
  const next = boundary[i + 1];
  const gap = next ? next.from - boundary[i].to : Infinity;
  if (cur.length >= cap || gap > PAUSA || !next) {
    subs.push({ from: cur[0].from, to: cur[cur.length - 1].to, words: cur });
    cur = [];
  }
}

await writeFile(path.join(publicDir, "subs.json"), JSON.stringify(subs, null, 2));
console.log(`TTS ok: voice.mp3 + ${subs.length} bloques de subtitulos (${words.length} palabras).`);
