// Etapa 1→2: lee de la DB la pieza de UN día puntual de una campaña, para dirigirla/renderizarla.
// La fuente de verdad es la DB (posts sembrados por seed:calendar), NO los spec.*.json a mano:
// así "pedí el reel del día 4 de tal campaña" siempre resuelve a la pieza correcta, sin colisiones de nombre.
// Uso: node scripts/fetch-piece.mjs <campaña> <dia> [negocio] [formato]
//   <campaña>: substring del nombre, sin importar acentos (ej. "conoce"). Desambigua entre campañas del negocio.
//   <dia>:     día 1-indexado (día 1 = fecha_inicio de la campaña).
//   [negocio]: substring del nombre del negocio (default "bruma").
//   [formato]: opcional (reel|feed|story|carrusel...) para desambiguar si un día tiene más de una pieza.
// Escribe piece.<slug>-dia<N>.json (post + assets resueltos + marca + contexto) y lo imprime.
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./_env.mjs";

const rendererRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en ../.env"); process.exit(1); }
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const q = async (p) => {
  const r = await fetch(`${URL}/rest/v1/${p}`, { headers });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};
const fold = (s) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slug = (s) => fold(s.split(/[—–-]/)[0]).trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// Comparación laxa: sin acentos y SIN separadores, para que "conoce-bruma" (forma slug que usa
// el resto del sistema) matchee "Conocé Bruma — …" igual que el substring "conoce".
const loose = (s) => fold(s).replace(/[^a-z0-9]+/g, "");

const [campArg, diaArg, negArg, formatoArg] = process.argv.slice(2);
const dia = Number(diaArg);
if (!campArg || !Number.isInteger(dia) || dia < 1) {
  console.error("Uso: npm run fetch:piece -- <campaña> <dia> [negocio] [formato]\n  ej: npm run fetch:piece -- conoce 4");
  process.exit(1);
}

// 1) Negocio
const negocios = await q(`businesses?nombre=ilike.*${encodeURIComponent(negArg ?? "bruma")}*&select=*`);
if (!negocios.length) { console.error(`No encontré el negocio "${negArg ?? "bruma"}".`); process.exit(1); }
const neg = negocios[0];

// 2) Campaña (match sin acentos, en JS, para tolerar "conoce" vs "Conocé")
const camps = await q(`campaigns?business_id=eq.${neg.id}&select=*&order=created_at.desc`);
const matches = camps.filter((c) => loose(c.nombre).includes(loose(campArg)));
if (!matches.length) {
  console.error(`No encontré una campaña que matchee "${campArg}" en ${neg.nombre}. Campañas:`);
  for (const c of camps) console.error(`  · ${c.nombre}`);
  process.exit(1);
}
if (matches.length > 1) {
  console.error(`"${campArg}" matchea ${matches.length} campañas — afiná el texto:`);
  for (const c of matches) console.error(`  · ${c.nombre}`);
  process.exit(1);
}
const camp = matches[0];
if (!camp.fecha_inicio) { console.error(`La campaña "${camp.nombre}" no tiene fecha_inicio. Corré seed:calendar primero.`); process.exit(1); }

// 3) Día N (1-indexado) → fecha = fecha_inicio + (N-1), igual que seed-calendar.
const fecha = new Date(camp.fecha_inicio + "T12:00:00Z");
fecha.setUTCDate(fecha.getUTCDate() + (dia - 1));
const fechaISO = fecha.toISOString().slice(0, 10);

const enFecha = await q(`posts?campaign_id=eq.${camp.id}&fecha=eq.${fechaISO}&select=*&order=hora`);
if (!enFecha.length) {
  const total = await q(`posts?campaign_id=eq.${camp.id}&select=fecha,formato,rol&order=fecha`);
  console.error(`No hay post para el día ${dia} (${fechaISO}) de "${camp.nombre}".`);
  if (!total.length) console.error("La campaña no tiene posts sembrados. Corré: npm run seed:calendar -- <calendar.json>");
  else { console.error("Días con pieza:"); total.forEach((p, i) => console.error(`  día ${i + 1}  ${p.fecha} [${p.formato}] ${p.rol}`)); }
  process.exit(1);
}
let post = enFecha[0];
if (enFecha.length > 1) {
  const f = enFecha.filter((p) => fold(p.formato) === fold(formatoArg ?? ""));
  if (formatoArg && f.length) post = f[0];
  else {
    console.error(`El día ${dia} tiene ${enFecha.length} piezas — pasá un formato para elegir:`);
    for (const p of enFecha) console.error(`  [${p.formato}] ${p.rol} · ${p.hook}`);
    if (!formatoArg) process.exit(1);
  }
}

// 4) Resolver los assets asignados (en el orden de asset_ids).
let assets = [];
if (post.asset_ids?.length) {
  const rows = await q(`campaign_assets?id=in.(${post.asset_ids.join(",")})&select=*`);
  assets = post.asset_ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
}

// Carpeta por-video: {marca}-{campaña}. Bajamos ahí los assets asignados que YA tienen archivo subido
// (a_pedir cumplidos), con nombres predecibles, para que el reel-director los referencie sin adivinar.
// Lo que sea a_generar queda sin archivo_local: lo genera gen:hf dentro de esta misma carpeta.
const carpeta = `${slug(neg.nombre.split(/\s+/)[0])}-${slug(camp.nombre)}`;
const assetsDir = path.join(rendererRoot, "public", carpeta);
await mkdir(assetsDir, { recursive: true });
let bajados = 0;
for (let i = 0; i < assets.length; i++) {
  const a = assets[i];
  if (!a.url) { a.archivo_local = null; continue; }
  const ext = (a.nombre_archivo?.split(".").pop() || (a.tipo === "video" ? "mp4" : "jpg")).toLowerCase();
  const local = `asset-${a.categoria}-${i + 1}.${ext}`;
  a.archivo_local = `${carpeta}/${local}`;
  const dest = path.join(assetsDir, local);
  if (existsSync(dest)) { bajados++; continue; } // cache
  const r = await fetch(`${URL}/storage/v1/object/post-media/${a.url}`, { headers });
  if (!r.ok) { console.error(`  no pude bajar ${a.url}: ${r.status}`); a.archivo_local = null; continue; }
  await writeFile(dest, Buffer.from(await r.arrayBuffer()));
  bajados++;
}

const pieceId = `${slug(camp.nombre)}-dia${dia}`;
const piece = {
  piece_id: pieceId,
  carpeta,
  dia,
  fecha: fechaISO,
  negocio: {
    nombre: neg.nombre, instagram: neg.instagram, sitio_web: neg.sitio_web,
    tono_marca: neg.tono_marca, tono_detalle: neg.tono_detalle, evitar: neg.evitar,
    estetica_visual: neg.estetica_visual, propuesta_valor: neg.propuesta_valor,
    color_primario: neg.color_primario, color_acento: neg.color_acento, color_fondo: neg.color_fondo,
    vibe_tipografico: neg.vibe_tipografico, voz_preferencia: neg.voz_preferencia, logo_url: neg.logo_url,
  },
  campania: {
    id: camp.id, nombre: camp.nombre, brief: camp.brief, objetivo: camp.objetivo,
    que_promociona: camp.que_promociona, fecha_inicio: camp.fecha_inicio, duracion_dias: camp.duracion_dias,
    nivel_conciencia: camp.nivel_conciencia, audiencia_objetivo: camp.audiencia_objetivo,
    elementos_especificos: camp.elementos_especificos,
  },
  post: {
    id: post.id, fecha: post.fecha, hora: post.hora, formato: post.formato, estado: post.estado, version: post.version,
    rol: post.rol, pilar: post.pilar, angulo: post.angulo, hook: post.hook, hook_formula: post.hook_formula,
    cta: post.cta, texto: post.texto, no_repetir: post.no_repetir,
    media_url: post.media_url, media_tipo: post.media_tipo,
  },
  assets: assets.map((a) => ({
    id: a.id, tipo: a.tipo, categoria: a.categoria, origen: a.origen,
    descripcion: a.descripcion, prompt: a.prompt, url: a.url, nombre_archivo: a.nombre_archivo,
    archivo_local: a.archivo_local ?? null,
  })),
};

const outFile = path.join(rendererRoot, `piece.${pieceId}.json`);
await writeFile(outFile, JSON.stringify(piece, null, 2));

console.log(`\n=== PIEZA día ${dia} · ${camp.nombre} ===`);
console.log(`piece_id : ${pieceId}   carpeta: public/${carpeta}/  (${bajados}/${assets.length} assets con archivo)`);
console.log(`fecha    : ${fechaISO} ${post.hora ?? ""}   formato: ${post.formato}   estado: ${post.estado}`);
console.log(`rol/pilar: ${post.rol} · ${post.pilar}`);
console.log(`hook     : ${post.hook}   (${post.hook_formula})`);
console.log(`angulo   : ${post.angulo}`);
console.log(`cta      : ${post.cta}`);
console.log(`no_repetir: ${post.no_repetir}`);
console.log(`\n-- ASSETS (${assets.length}) --`);
for (const a of assets) {
  const tiene = a.url ? "✓ subido" : (a.origen === "a_generar" ? "↯ a_generar" : "✗ falta (a_pedir)");
  console.log(`  [${a.tipo}/${a.categoria}] ${tiene}  ${a.descripcion}${a.url ? `\n      url: ${a.url}` : ""}`);
}
console.log(`\n→ ${path.basename(outFile)} escrito. Pasáselo al reel-director para escribir spec.${pieceId}.json.`);
