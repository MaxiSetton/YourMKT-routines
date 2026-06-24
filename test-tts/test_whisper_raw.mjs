import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const buffer = fs.readFileSync("test-tts/public/omnivoice_final.wav");
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGIN_FACE_ACCESS_TOKEN}`,
      "Content-Type": "audio/wav",
    },
    body: buffer,
  });
  
  const result = await response.json();
  console.log("Raw API result:", JSON.stringify(result, null, 2));
}

run();
