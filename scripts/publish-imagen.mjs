// Sube UNA imagen al Storage y apunta posts.media_url a ella, para que la web la muestre.
// Para una sola imagen (feed/story de 1 imagen). Para varias slides usá publish-carrusel.mjs.
//
// Clave: la web, cuando el post NO es video, lista la CARPETA de media_url y muestra todo lo que
// haya ahí. Por eso la imagen va en una carpeta propia del post ({user}/{camp}/{postId}/archivo),
// nunca suelta en la carpeta de la campaña (si no se mezclaría con otros archivos).
//
// Uso:  node scripts/publish-imagen.mjs <postId> <archivo> [nombreEnStorage]
//   <postId>          UUID del post (la web ya lo conoce; mirá la pestaña Posts)
//   <archivo>         ruta a la imagen (absoluta, relativa, o solo el nombre si está en out/)
//   [nombreEnStorage] opcional; por defecto usa el nombre del archivo
//
// El user y la campaña se deducen SOLOS del post (post -> campaign -> business -> user_id).
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env"); process.exit(1); }

const CONTENT_TYPE = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const sanitize = (name) => name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

const postId = process.argv[2];
const archivoArg = process.argv[3];
if (!postId || !archivoArg) {
  console.error("Uso: node scripts/publish-imagen.mjs <postId> <archivo> [nombreEnStorage]");
  process.exit(1);
}

// Encontrar el archivo: como se pasó, o dentro de out/.
const archivo = existsSync(archivoArg) ? archivoArg : path.join(root, "out", archivoArg);
if (!existsSync(archivo)) {
  console.error(`No encuentro la imagen: ${archivoArg} (probé también en out/).`);
  process.exit(1);
}
const ext = path.extname(archivo).toLowerCase();
const contentType = CONTENT_TYPE[ext];
if (!contentType) {
  console.error(`Extensión no soportada (${ext}). Usá png, jpg, jpeg o webp.`);
  process.exit(1);
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const q = async (p) => {
  const r = await fetch(`${URL}/rest/v1/${p}`, { headers });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};

// Deducir user + campaña del post (post -> campaign -> business -> user_id).
const [post] = await q(`posts?id=eq.${postId}&select=campaign_id`);
if (!post) { console.error(`No existe el post ${postId}.`); process.exit(1); }
const [camp] = await q(`campaigns?id=eq.${post.campaign_id}&select=business_id`);
const [biz] = await q(`businesses?id=eq.${camp.business_id}&select=user_id`);
if (!biz?.user_id) { console.error("No pude deducir el user_id del post (¿negocio sin dueño?)."); process.exit(1); }

const nombre = sanitize(process.argv[4] ?? path.basename(archivo));
// Carpeta propia del post: la web lista esta carpeta y muestra solo esta imagen.
const storagePath = `${biz.user_id}/${post.campaign_id}/${postId}/${nombre}`;
const bytes = await readFile(archivo);

// 1) subir al bucket privado post-media (upsert)
console.log(`> subiendo ${path.basename(archivo)} (${(bytes.length / 1e3).toFixed(0)} KB) -> post-media/${storagePath}`);
const up = await fetch(`${URL}/storage/v1/object/post-media/${storagePath}`, {
  method: "POST",
  headers: { ...headers, "Content-Type": contentType, "x-upsert": "true" },
  body: bytes,
});
if (!up.ok) { console.error("Falló el upload:", up.status, await up.text()); process.exit(1); }

// 2) apuntar el post a la imagen subida (la web firma esta URL y la muestra)
const patch = await fetch(`${URL}/rest/v1/posts?id=eq.${postId}`, {
  method: "PATCH",
  headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
  body: JSON.stringify({ media_url: storagePath, media_tipo: "imagen" }),
});
if (!patch.ok) { console.error("Falló el PATCH del post:", patch.status, await patch.text()); process.exit(1); }
const [updated] = await patch.json();
console.log(`listo: post ${updated.id} (${updated.fecha}) -> media_url = ${updated.media_url}`);
