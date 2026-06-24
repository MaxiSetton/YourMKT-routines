import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const specFile = process.argv[2] ?? "spec.dia1.json";
const publicDir = path.join(root, "public");

const specPath = path.join(root, specFile);
const spec = JSON.parse(await readFile(specPath, "utf8"));
const subs = JSON.parse(await readFile(path.join(publicDir, "subs.json"), "utf8"));

// Aplana todos los words de subs.json en un array contiguo
const words = subs.flatMap(b => b.words);
const TAIL = 0.4; // cola del ULTIMO plano (cierre / loop) tras la ultima palabra

// normaliza para matchear palabras sin importar acentos/puntuacion/mayusculas
const norm = (s) => (s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

let currentTime = 0;
let prevSync = -1; // ultima palabra de la escena anterior (para acotar el rango de busqueda del enfasis)

// CORTE SOBRE LA VOZ: cada escena termina cuando ARRANCA la primera palabra de la siguiente
// (sync_word_idx es la ULTIMA palabra de la escena; los bloques son contiguos, asi que la 1a de la
// siguiente es sync+1). La PAUSA entre lineas queda como COLA del plano actual (el visual sostiene el
// beat y el corte cae justo cuando entra la nueva linea), no como un hueco mudo al inicio del siguiente.
for (let k = 0; k < spec.escenas.length; k++) {
  const escena = spec.escenas[k];
  const prevDur = (escena.t_out ?? 0) - (escena.t_in ?? 0); // duracion tentativa, ANTES de pisar t_in
  escena.t_in = currentTime;
  const idx = escena.sync_word_idx;
  const isLast = k === spec.escenas.length - 1;

  if (idx != null && words[idx]) {
    if (!isLast && words[idx + 1]) {
      escena.t_out = parseFloat(words[idx + 1].from.toFixed(2)); // corte = inicio de la linea siguiente
    } else {
      escena.t_out = parseFloat((words[idx].to + TAIL).toFixed(2)); // ultima: fin + cola de cierre
    }
  } else {
    // Sin sync_word_idx: NO colapsar al fin del audio (eso descuadra todo). Preservamos la duracion
    // tentativa de ESTA escena (la que puso el guionista/reel-director) corrida tras la anterior, asi
    // las demas escenas no se aplastan. Avisamos para que se agregue el sync_word_idx que falta.
    console.warn(`Advertencia: escena "${escena.id}" sin sync_word_idx valido (${idx}). Preservo su duracion tentativa (${(prevDur || 3).toFixed(2)}s). Agregale sync_word_idx para cortar sobre la voz.`);
    escena.t_out = parseFloat((currentTime + (prevDur > 0 ? prevDur : 3)).toFixed(2));
  }

  // Resolver enfasis.word_idx desde enfasis.texto: el director marca la PALABRA clave (no un indice
  // plano). Buscamos esa palabra DENTRO del rango de esta escena (prevSync+1 .. idx) y fijamos el indice
  // global; asi el pop visual (Subtitles) y el pop sonoro (mix-audio) caen en la MISMA palabra.
  if (escena.enfasis && escena.enfasis.word_idx == null && escena.enfasis.texto && idx != null) {
    const target = norm(escena.enfasis.texto.split(/\s+/)[0]);
    let found = null;
    for (let w = prevSync + 1; w <= idx && w < words.length; w++) {
      if (words[w] && norm(words[w].w) === target) { found = w; break; }
    }
    if (found != null) escena.enfasis.word_idx = found;
    else console.warn(`Advertencia: no encontre la palabra de enfasis "${escena.enfasis.texto}" en la escena "${escena.id}" (rango ${prevSync + 1}..${idx}).`);
  }
  if (idx != null) prevSync = idx;

  currentTime = escena.t_out;
}

// duracion_seg = EXACTA al contenido (fin de la ultima escena), NO redondeada hacia arriba: asi la
// composicion (round(duracion*fps)) termina justo donde termina la ultima escena, sin hueco (fondo
// crema) al final. El pacing de cada escena se controla estimando bien + ajustando las pausas del
// guion (ver tts.mjs / skill guionista), no estirando escenas a mano.
spec.duracion_seg = parseFloat(currentTime.toFixed(3));

await writeFile(specPath, JSON.stringify(spec, null, 2));
console.log(`Retime finalizado. spec.json actualizado con t_in/t_out automáticos.`);
