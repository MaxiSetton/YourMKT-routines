import { client } from "@gradio/client";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    const app = await client("k2-fsa/OmniVoice", {
        hf_token: process.env.HUGGIN_FACE_ACCESS_TOKEN
    });
    const apiInfo = await app.view_api();
    console.log("=== API INFO ===");
    console.log(JSON.stringify(apiInfo, null, 2));
  } catch (error) {
    console.error("Error connecting to Space:", error);
  }
}

run();
