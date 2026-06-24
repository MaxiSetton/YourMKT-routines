// Carga centralizada de variables de entorno para todo el pipeline.
// Precedencia (gana el último que define una clave): ../.env  →  ./.env  →  process.env.
//
//  - En las ROUTINES de Claude Code (cloud) NO se commitea ningún .env: las claves llegan como
//    env vars del environment y se leen de process.env. Por eso process.env gana siempre.
//  - En DEV local cae a un .env: primero el de la app (../.env, para no romper el setup histórico)
//    y por encima el del repo del pipeline (./.env) si existe.
//
// Antes cada script leía el .env a mano desde rutas distintas (../.env vs ./.env) — ese footgun
// (mantener las dos en sync) queda resuelto acá: importá `{ env }` y listo.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function parseDotenv(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

export const env = {
  ...parseDotenv(path.join(repoRoot, "..", ".env")), // .env de la app (dev local histórico)
  ...parseDotenv(path.join(repoRoot, ".env")),        // .env del repo del pipeline
};
// process.env por encima de los archivos: en cloud es la ÚNICA fuente; en local permite override.
for (const [k, v] of Object.entries(process.env)) {
  if (v !== undefined && v !== "") env[k] = v;
}
