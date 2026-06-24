import { client, handle_file } from "@gradio/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function run() {
  try {
    console.log("Iniciando cliente OmniVoice...");
    const app = await client("k2-fsa/OmniVoice", {
      hf_token: process.env.HUGGIN_FACE_ACCESS_TOKEN
    });

    // Agregamos pausas exageradas (múltiples puntos suspensivos y comas)
    const texto = "¿Qué tiene este grano? ... ... Que no podíamos esperar... para tostarlo. ... ... Cambiamos el origen del mes... ... Es un Etiopía Yirgacheffe... recién tostado. ... ... ¡Y nos tiene un poco obsesionados! ... ... Esta semana... lo tenés en filtrado en la barra en bruma. ... ... Pasá... a probarlo.";

    // Le pasamos el audio que dejaste preparado
    const ref_audio = handle_file("test-tts/public/audio-[vocals].mp3");

    console.log("Enviando petición de CLONACIÓN a la IA (con más pausas y menor velocidad)...");

    // Parámetros correctos para /_clone_fn
    const result = await app.predict("/_clone_fn", [
      texto,      // text
      "Auto",     // lang
      ref_audio,  // ref_aud
      "",         // ref_text
      "",         // instruct
      32,         // ns
      2,          // gs 
      true,       // dn
      0.85,       // sp (Bajamos la velocidad de 1.0 a 0.85 para que no hable tan rápido)
      0,          // du
      true,       // pp
      true,       // po
    ]);

    console.log("Resultado de la IA recibido:", result.data[1]);

    const audioObj = result.data[0];

    console.log("Descargando audio generado...");
    const response = await fetch(audioObj.url);
    const buffer = await response.arrayBuffer();

    fs.writeFileSync("test-tts/public/omnivoice_final.wav", Buffer.from(buffer));
    console.log("¡Éxito! Audio guardado en test-tts/public/omnivoice_final.wav");

  } catch (error) {
    console.error("Error conectando al Space:", error);
  }
}

run();
