import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function run() {
  const client = new InferenceClient(process.env.HUGGIN_FACE_ACCESS_TOKEN);
  const buffer = fs.readFileSync("test-tts/public/omnivoice_final.wav");
  const blob = new Blob([buffer], { type: "audio/wav" });
  
  try {
    const result = await client.automaticSpeechRecognition({
      model: "openai/whisper-large-v3",
      data: blob,
      parameters: { return_timestamps: true }
    });
    console.log("Resultado de Whisper:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
