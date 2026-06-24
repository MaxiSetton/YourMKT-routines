// Etapa 1 (Ideacion): siembra el calendario de una campaña en la DB (posts borrador + plan de assets).
// La skill campaign-director PRODUCE el artefacto (calendar.<slug>.json); este script solo lo EJECUTA.
// Uso: node scripts/seed-calendar.mjs <calendar.json> [--force]
//   --force: siembra aunque la campaña ya tenga posts (por defecto aborta para no duplicar).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const rendererRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" };
const get = async (p) => (await fetch(`${base}/rest/v1/${p}`, { headers })).json();

const args = process.argv.slice(2);
const force = args.includes("--force");
const calPath = args.find((a) => !a.startsWith("--"));
if (!calPath) {
  console.error("Falta el calendario. Uso: npm run seed:calendar -- <calendar.json> [--force]");
  process.exit(1);
}
const cal = JSON.parse(await readFile(path.isAbsolute(calPath) ? calPath : path.join(rendererRoot, calPath), "utf8"));

const [neg] = await get(`businesses?nombre=ilike.*${encodeURIComponent(cal.negocio ?? "bruma")}*&select=id,nombre`);
if (!neg) { console.error(`No encontré el negocio "${cal.negocio}".`); process.exit(1); }
const [camp] = await get(
  `campaigns?business_id=eq.${neg.id}&nombre=ilike.*${encodeURIComponent(cal.campaign)}*&select=*&order=created_at.desc&limit=1`
);
if (!camp) { console.error(`No encontré la campaña "${cal.campaign}" del negocio ${neg.nombre}.`); process.exit(1); }
console.log(`Negocio: ${neg.nombre} | Campaña: ${camp.nombre}`);

// Guarda contra doble siembra.
const existentes = await get(`posts?campaign_id=eq.${camp.id}&select=id`);
if (existentes.length && !force) {
  console.error(`La campaña ya tiene ${existentes.length} posts. Usá --force para sembrar igual (puede duplicar).`);
  process.exit(1);
}

// fecha_inicio: si la campaña no la tiene y el calendario la trae, la seteamos.
let inicio = camp.fecha_inicio;
if (!inicio && cal.fecha_inicio) {
  const r = await fetch(`${base}/rest/v1/campaigns?id=eq.${camp.id}`, { method: "PATCH", headers, body: JSON.stringify({ fecha_inicio: cal.fecha_inicio }) });
  if (!r.ok) { console.error("Error seteando fecha_inicio:", r.status, await r.text()); process.exit(1); }
  inicio = cal.fecha_inicio;
  console.log(`fecha_inicio seteada en ${inicio}.`);
}
if (!inicio) { console.error("La campaña no tiene fecha_inicio y el calendario tampoco. No puedo fechar los posts."); process.exit(1); }

// 1) Plan de assets → campaign_assets. Devuelve los ids para mapear key→uuid.
const assetMap = {};
if (cal.assets?.length) {
  const rows = cal.assets.map((a) => ({
    campaign_id: camp.id, tipo: a.tipo, categoria: a.categoria,
    url: null, nombre_archivo: null, descripcion: a.descripcion,
    origen: a.origen, prompt: a.prompt ?? null,
  }));
  const r = await fetch(`${base}/rest/v1/campaign_assets`, { method: "POST", headers, body: JSON.stringify(rows) });
  if (!r.ok) { console.error("Error insertando assets:", r.status, await r.text()); process.exit(1); }
  const ins = await r.json();
  cal.assets.forEach((a, i) => { assetMap[a.key] = ins[i].id; });
  console.log(`Insertados ${ins.length} slots de asset (a_pedir / a_generar).`);
}

// 2) Calendario → posts (borrador), con el spec estratégico completo y el reparto de assets.
const start = new Date(inicio + "T12:00:00Z");
const postRows = cal.pieces.map((p) => {
  const f = new Date(start);
  f.setUTCDate(f.getUTCDate() + p.d);
  return {
    campaign_id: camp.id,
    fecha: f.toISOString().slice(0, 10),
    hora: p.hora,
    formato: p.formato,
    texto: p.texto,
    rol: p.rol,
    pilar: p.pilar,
    angulo: p.angulo,
    hook: p.hook,
    hook_formula: p.hook_formula,
    cta: p.cta,
    asset_ids: (p.assets ?? []).map((k) => assetMap[k]).filter(Boolean),
    no_repetir: p.no_repetir,
    estado: "borrador",
    version: 1,
  };
});
const res = await fetch(`${base}/rest/v1/posts`, { method: "POST", headers, body: JSON.stringify(postRows) });
if (!res.ok) { console.error("Error insertando posts:", res.status, await res.text()); process.exit(1); }
const inserted = await res.json();

console.log(`\nInsertados ${inserted.length} posts (borrador):`);
for (const p of inserted.sort((a, b) => a.fecha.localeCompare(b.fecha))) {
  console.log(`  ${p.fecha} ${p.hora} [${p.formato}] ${p.rol} · ${p.asset_ids?.length ?? 0} assets — ${p.hook}`);
}
