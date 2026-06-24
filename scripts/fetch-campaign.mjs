// Lee de Supabase (service-role) el negocio + campañas + material para un negocio dado.
// Uso: node scripts/fetch-campaign.mjs [nombreNegocio]   (default: bruma)
import { env } from "./_env.mjs";

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const q = async (p) => {
  const r = await fetch(`${URL}/rest/v1/${p}`, { headers });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};

const nombre = process.argv[2] ?? "bruma";
const negocios = await q(`businesses?nombre=ilike.*${encodeURIComponent(nombre)}*&select=*`);
if (!negocios.length) {
  console.log(`No se encontró negocio que matchee "${nombre}".`);
  process.exit(0);
}
const neg = negocios[0];
console.log("=== NEGOCIO ===");
console.log(JSON.stringify(neg, null, 2));

const camps = await q(`campaigns?business_id=eq.${neg.id}&select=*&order=created_at.desc`);
console.log(`\n=== CAMPAÑAS (${camps.length}) ===`);
for (const c of camps) {
  console.log(JSON.stringify(c, null, 2));
  const assets = await q(`campaign_assets?campaign_id=eq.${c.id}&select=*`);
  console.log(`-- MATERIAL (${assets.length}) --`);
  for (const a of assets) console.log(`  [${a.tipo}/${a.categoria}] ${a.nombre_archivo} :: ${a.descripcion}  (url: ${a.url})`);
}
