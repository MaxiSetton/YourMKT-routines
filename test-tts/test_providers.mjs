import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const client = new InferenceClient(process.env.HUGGIN_FACE_ACCESS_TOKEN);
  
  console.log("Checking Text-to-Speech models...");
  try {
    // There is no direct "list models" in the JS client easily, but we can try 
    // sending a text-to-speech request to a specific model or provider to see if it works.
    console.log("To use Inference Providers, we must specify a model that the provider hosts via HF.");
  } catch (e) {
    console.error(e);
  }
}

run();
