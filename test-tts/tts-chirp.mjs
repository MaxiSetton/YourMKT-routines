import textToSpeech from '@google-cloud/text-to-speech';
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "test-tts", "public");

async function run() {
  await mkdir(publicDir, { recursive: true });
  console.log("Generando voz con el modelo Generativo Chirp3 de Google Cloud...");
  const client = new textToSpeech.TextToSpeechClient();
  const text = "¿Qué tiene este grano que no podíamos esperar para tostarlo? Cambiamos el origen del mes. Es un Etiopía Yirgacheffe, recién tostado, ¡y nos tiene un poco obsesionados! Esta semana lo tenés en filtrado, en la barra. Pasá a probarlo.";
  const request = {
    input: { text: text },
    // Probamos con Achernar, una de las voces HD generativas de Google
    voice: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Achernar' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  await writeFile(path.join(publicDir, "chirp.mp3"), response.audioContent, 'binary');
  console.log("¡Audio Chirp3 generado en public/chirp.mp3!");
}
run().catch(console.error);
