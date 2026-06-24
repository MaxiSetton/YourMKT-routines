// Descarga a public/ el material de la campaña de un negocio (service-role).
// Uso: node scripts/fetch-assets.mjs [nombreNegocio]   (default: bruma)
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const rendererRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(rendererRoot, "public");
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const q = async (p) => {
  const r = await fetch(`${URL}/rest/v1/${p}`, { headers });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};

await mkdir(publicDir, { recursive: true });
const nombre = process.argv[2] ?? "bruma";
const [neg] = await q(`businesses?nombre=ilike.*${encodeURIComponent(nombre)}*&select=id,nombre`);
const camps = await q(`campaigns?business_id=eq.${neg.id}&select=id,nombre&order=created_at.desc`);

let n = 0;
for (const c of camps) {
  const assets = await q(`campaign_assets?campaign_id=eq.${c.id}&select=*`);
  for (const a of assets) {
    n++;
    const ext = (a.nombre_archivo?.split(".").pop() || "jpg").toLowerCase();
    const dest = `cliente-${a.categoria}-${n}.${ext}`;
    const r = await fetch(`${URL}/storage/v1/object/post-media/${a.url}`, { headers });
    if (!r.ok) {
      console.log(`FALLO ${a.url}: ${r.status}`);
      continue;
    }
    await writeFile(path.join(publicDir, dest), Buffer.from(await r.arrayBuffer()));
    console.log(`${dest}  <-  [${a.tipo}/${a.categoria}] ${a.descripcion}`);
  }
}

// logo de marca
const [b] = await q(`businesses?id=eq.${neg.id}&select=logo_url`);
if (b?.logo_url) {
  const r = await fetch(`${URL}/storage/v1/object/business-docs/${b.logo_url}`, { headers });
  if (r.ok) {
    const ext = b.logo_url.split(".").pop().toLowerCase();
    await writeFile(path.join(publicDir, `logo.${ext}`), Buffer.from(await r.arrayBuffer()));
    console.log(`logo.${ext}  <-  brand logo`);
  } else {
    console.log(`logo no descargado: ${r.status}`);
  }
}
