import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const packageRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));
const destination = path.resolve("public/pdfjs");
fs.mkdirSync(destination, { recursive: true });
fs.copyFileSync(path.join(packageRoot, "build/pdf.worker.min.mjs"), path.join(destination, "pdf.worker.min.mjs"));
for (const directory of ["standard_fonts", "cmaps", "wasm"]) {
  fs.cpSync(path.join(packageRoot, directory), path.join(destination, directory), { recursive: true });
}
fs.copyFileSync(path.join(packageRoot, "LICENSE"), path.join(destination, "LICENSE"));
console.log("PDF.js browser assets synchronized.");