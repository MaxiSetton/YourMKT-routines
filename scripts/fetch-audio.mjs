// Baja audio libre de derechos (música / SFX) por API a public/. HTTP directo, sin scraping.
// Uso:  node scripts/fetch-audio.mjs <source> "<query>" <destFile> [indice]
//   source: pixabay | freesound | jamendo
//   ej:  node scripts/fetch-audio.mjs freesound "whoosh transition" public/sfx-whoosh.mp3
//        node scripts/fetch-audio.mjs jamendo  "lofi calm"        public/music-lofi.mp3
//        node scripts/fetch-audio.mjs pixabay  "soft pop click"   public/sfx-pop.mp3
// Keys en .env:  PIXABAY_API_KEY · FREESOUND_API_KEY · JAMENDO_CLIENT_ID
// Filtra por uso comercial / CC0 cuando la API lo permite. Cachea: si el destino ya existe, no rebaja.
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { env } from "./_env.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const [source, query, destArg, idxArg] = process.argv.slice(2);
if (!source || !query || !destArg) {
  console.error('Uso: node scripts/fetch-audio.mjs <pixabay|freesound|jamendo> "<query>" <destFile> [indice]');
  process.exit(1);
}
const dest = path.isAbsolute(destArg) ? destArg : path.join(root, destArg);
const idx = Number(idxArg ?? 0) || 0;
if (existsSync(dest)) { console.log(`(cache) ya existe: ${path.basename(dest)} — no rebajo.`); process.exit(0); }

const need = (k) => { if (!env[k]) { console.error(`Falta ${k} en .env`); process.exit(1); } return env[k]; };
const getJson = async (url, headers = {}) => {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};
const download = async (url, headers = {}) => {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`descarga ${r.status} ${await r.text()}`);
  await writeFile(dest, Buffer.from(await r.arrayBuffer()));
};

// Devuelve { url, headers, nombre, licencia } del resultado elegido.
async function resolve() {
  if (source === "pixabay") {
    const key = need("PIXABAY_API_KEY");
    // Audio API de Pixabay: devuelve hits[] con una URL directa al mp3.
    const j = await getJson(`https://pixabay.com/api/audio/?key=${key}&q=${encodeURIComponent(query)}&per_page=20`);
    const hit = (j.hits ?? [])[idx];
    if (!hit) throw new Error("sin resultados en Pixabay");
    const url = hit.audio_download || hit.download || hit.audio || hit.url;
    return { url, nombre: hit.tags ?? hit.id, licencia: "Pixabay (uso comercial, sin atribución)" };
  }
  if (source === "freesound") {
    // auth simple por token= (alcanza para search + previews públicos). Usa el client secret de la app.
    const key = env.FREESOUND_API_KEY || env.FREESOUND_API_SECRET;
    if (!key) { console.error("Falta FREESOUND_API_SECRET (o FREESOUND_API_KEY) en .env"); process.exit(1); }
    const fields = "id,name,license,previews";
    let filterStr = 'license:"Creative Commons 0"';
    if (dest.includes("music")) filterStr += ' duration:[60 TO 300]';
    const filter = encodeURIComponent(filterStr);
    const sort = "rating_desc";
    const j = await getJson(`https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&filter=${filter}&sort=${sort}&fields=${fields}&page_size=20&token=${key}`);
    const hit = (j.results ?? [])[idx];
    if (!hit) throw new Error("sin resultados CC0 en Freesound");
    // preview hq-mp3: URL pública del CDN (no requiere OAuth como el /download/).
    const url = hit.previews?.["preview-hq-mp3"] || hit.previews?.["preview-lq-mp3"];
    return { url, nombre: hit.name, licencia: hit.license };
  }
  if (source === "jamendo") {
    const cid = need("JAMENDO_CLIENT_ID");
    const j = await getJson(`https://api.jamendo.com/v3.0/tracks/?client_id=${cid}&format=json&limit=20&fuzzytags=${encodeURIComponent(query)}&audiodownload_allowed=true&order=popularity_total`);
    const hit = (j.results ?? [])[idx];
    if (!hit) throw new Error("sin resultados descargables en Jamendo");
    if (!hit.audiodownload_allowed) throw new Error("ese track no permite descarga");
    return { url: hit.audiodownload, nombre: hit.name, licencia: hit.license_ccurl ?? "Jamendo CC" };
  }
  throw new Error(`source desconocido: ${source} (usá pixabay|freesound|jamendo)`);
}

try {
  const { url, nombre, licencia } = await resolve();
  if (!url) throw new Error("el resultado no trae URL de descarga directa");
  console.log(`> ${source}: "${nombre}" [${licencia}]`);
  await download(url);
  console.log(`listo: ${path.basename(dest)}  <-  ${url.slice(0, 80)}...`);
} catch (e) {
  console.error(`FALLO (${source}): ${e.message}`);
  process.exit(1);
}
