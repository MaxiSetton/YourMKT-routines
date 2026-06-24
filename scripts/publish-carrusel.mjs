// Sube las slides de un carrusel al Storage y apunta posts.media_url a la PORTADA (slide 1).
// La web muestra una sola imagen por post; las 5 slides quedan en el bucket para subir a IG.
// Uso:  node scripts/publish-carrusel.mjs [postId] [specId]
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Defaults: Dia 3 (educacion) de la campaña Yirgacheffe de Bruma.
const USER = "1e04265d-55c5-4fbc-bdd8-64007d57c987";
const CAMP = "873c6f03-80af-4d86-8c94-32a59f57602c";
const postId = process.argv[2] ?? "296b790a-61da-451a-b3a6-700d353e60c4";
const specId = process.argv[3] ?? "bruma-dia3-educacion";

const outDir = path.join(root, "out");
const slides = (await readdir(outDir))
  .filter((f) => f.startsWith(`${specId}-slide-`) && f.endsWith(".png"))
  .sort((a, b) => Number(a.match(/slide-(\d+)/)[1]) - Number(b.match(/slide-(\d+)/)[1]));
if (!slides.length) { console.error(`No hay slides ${specId}-slide-*.png en out/. Corré render-carrusel primero.`); process.exit(1); }

// Carpeta propia por post: la web lista esta carpeta y muestra TODAS las slides en orden.
let portada = null;
for (const file of slides) {
  const storagePath = `${USER}/${CAMP}/${postId}/${file}`;
  const bytes = await readFile(path.join(outDir, file));
  const up = await fetch(`${URL}/storage/v1/object/post-media/${storagePath}`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "image/png", "x-upsert": "true" },
    body: bytes,
  });
  if (!up.ok) { console.error(`Fallo upload ${file}:`, up.status, await up.text()); process.exit(1); }
  console.log(`subida ${file} -> post-media/${storagePath}`);
  if (!portada) portada = storagePath;
}

const patch = await fetch(`${URL}/rest/v1/posts?id=eq.${postId}`, {
  method: "PATCH",
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
  body: JSON.stringify({ media_url: portada, media_tipo: "imagen" }),
});
if (!patch.ok) { console.error("Fallo PATCH del post:", patch.status, await patch.text()); process.exit(1); }
const [post] = await patch.json();
console.log(`listo: ${slides.length} slides subidas; post ${post.id} (${post.fecha}) -> media_url = ${post.media_url}`);
