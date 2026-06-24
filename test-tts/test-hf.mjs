import { HfInference } from "@huggingface/inference";
import { writeFile } from "node:fs/promises";
import * as dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env') });

const hf = new HfInference(process.env.HUGGIN_FACE_ACCESS_TOKEN);

async function run() {
  console.log("Probando HF Inference API para TTS...");
  try {
    const res = await hf.textToSpeech({
      model: "suno/bark",
      inputs: "[es] Hola, ¿cómo estás? Cambiamos el origen del mes.",
    });
    
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(root, "test-tts/public/hf-bark.wav"), buffer);
    console.log("Audio de HF Bark generado!");
  } catch(e) {
    console.error("Error HF Bark:", e.message);
  }

  try {
    const res2 = await hf.textToSpeech({
      model: "facebook/mms-tts-spa",
      inputs: "Hola, ¿cómo estás? Cambiamos el origen del mes.",
    });
    const buffer2 = Buffer.from(await res2.arrayBuffer());
    await writeFile(path.join(root, "test-tts/public/hf-mms.wav"), buffer2);
    console.log("Audio de HF MMS generado!");
  } catch(e) {
    console.error("Error HF MMS:", e.message);
  }
}

run();
