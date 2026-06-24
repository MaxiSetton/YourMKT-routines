// Valida un spec.<id>.json contra schemas/spec.schema.json (draft-07).
// La Routine 2 lo corre antes de persistir el spec: si no valida, el render fallaría.
// Uso: node scripts/validate-spec.mjs <spec.json>
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const specArg = process.argv[2];
if (!specArg) { console.error("Uso: node scripts/validate-spec.mjs <spec.json>"); process.exit(1); }

const schema = JSON.parse(await readFile(path.join(root, "schemas", "spec.schema.json"), "utf8"));
const spec = JSON.parse(await readFile(path.isAbsolute(specArg) ? specArg : path.join(root, specArg), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (validate(spec)) {
  console.log(`✓ ${path.basename(specArg)} valida contra spec.schema.json`);
  process.exit(0);
}
console.error(`✗ ${path.basename(specArg)} NO valida (${validate.errors.length} errores):`);
for (const e of validate.errors) {
  console.error(`  ${e.instancePath || "(root)"} — ${e.message}${e.params ? " " + JSON.stringify(e.params) : ""}`);
}
process.exit(1);
