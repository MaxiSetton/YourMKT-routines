// Renderiza un carrusel (feed) a PNGs: una imagen por slide. Usa la composicion "Carrusel".
// Bundle una sola vez y renderStill por frame (frame i = slide i).
// Uso:  node scripts/render-carrusel.mjs [spec.dia3.carrusel.json]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const specFile = process.argv[2] ?? "spec.dia3.carrusel.json";
const spec = JSON.parse(await readFile(path.join(root, specFile), "utf8"));
const outDir = path.join(root, "out");
await mkdir(outDir, { recursive: true });

console.log("bundling...");
const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const inputProps = { spec };
const composition = await selectComposition({ serveUrl, id: "Carrusel", inputProps });
console.log(`carrusel ${spec.id}: ${spec.slides.length} slides (${composition.width}x${composition.height})`);

for (let i = 0; i < spec.slides.length; i++) {
  const output = path.join(outDir, `${spec.id}-slide-${i + 1}.png`);
  await renderStill({ serveUrl, composition, frame: i, output, inputProps, overwrite: true });
  console.log(`  slide ${i + 1}/${spec.slides.length} -> ${path.basename(output)}`);
}
console.log(`listo: ${spec.slides.length} slides en out/`);
