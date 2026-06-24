// Sube el reel renderizado al Storage de Supabase y setea posts.media_url para que la web lo muestre.
// Corré DESPUES de render + post (necesita out/reel-final.mp4).
// Uso:  node scripts/publish.mjs [postId] [storagePath] [archivo]
// Defaults: post Dia 2 de Bruma -> post-media/<userId>/<campaignId>/dia2-deseo-reel.mp4
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env"); process.exit(1); }

const postId = process.argv[2] ?? "63c07276-2c95-4f77-9f8d-b1b8c6c3fc56"; // default: Dia 2 de Bruma (test)
let storagePath = process.argv[3]; // path completo {user}/{camp}/file.mp4, o solo el nombre del archivo
const archivo = process.argv[4] ?? path.join(root, "out", "reel-final.mp4");

// Si storagePath no trae carpetas (es solo un nombre, o no se pasó) deducimos el prefijo
// {user}/{camp}/ del postId (post → campaign → business → user_id), igual que publish-imagen/carrusel.
// Así la routine pasa <postId> <nombre.mp4> <archivo> y no necesita conocer el userId.
if (!storagePath || !storagePath.includes("/")) {
  const filename = storagePath || path.basename(archivo);
  const get = async (p) => {
    const r = await fetch(`${URL}/rest/v1/${p}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return r.json();
  };
  const [post] = await get(`posts?id=eq.${postId}&select=campaign_id`);
  if (!post) { console.error(`No existe el post ${postId}.`); process.exit(1); }
  const [camp] = await get(`campaigns?id=eq.${post.campaign_id}&select=business_id`);
  const [biz] = await get(`businesses?id=eq.${camp.business_id}&select=user_id`);
  if (!biz?.user_id) { console.error("No pude deducir el user_id del post."); process.exit(1); }
  storagePath = `${biz.user_id}/${post.campaign_id}/${filename}`;
}

if (!existsSync(archivo)) {
  console.error(`No encuentro ${archivo}. Corré primero: node scripts/render.mjs spec.dia2.json  &&  node scripts/post.mjs`);
  process.exit(1);
}
const bytes = await readFile(archivo);

// 1) subir al bucket privado post-media (upsert)
console.log(`> subiendo ${path.basename(archivo)} (${(bytes.length / 1e6).toFixed(1)} MB) -> post-media/${storagePath}`);
const up = await fetch(`${URL}/storage/v1/object/post-media/${storagePath}`, {
  method: "POST",
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "video/mp4", "x-upsert": "true" },
  body: bytes,
});
if (!up.ok) { console.error("Fallo el upload:", up.status, await up.text()); process.exit(1); }

// 2) apuntar el post al archivo subido (la web firma esta URL y reproduce el video)
const patch = await fetch(`${URL}/rest/v1/posts?id=eq.${postId}`, {
  method: "PATCH",
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
  body: JSON.stringify({ media_url: storagePath, media_tipo: "video" }),
});
if (!patch.ok) { console.error("Fallo el PATCH del post:", patch.status, await patch.text()); process.exit(1); }
const [post] = await patch.json();
console.log(`listo: post ${post.id} (${post.fecha}) -> media_url = ${post.media_url}`);
