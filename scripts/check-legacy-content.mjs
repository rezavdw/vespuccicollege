import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const pages = JSON.parse(fs.readFileSync("src/data/legacy-pages.json", "utf8"));
const menu = fs.readFileSync("src/lib/site.ts", "utf8");
const routes = new Set([...menu.matchAll(/\{ label: "[^"]+", href: "([^"]+)"/g)].map((match) => match[1]).filter((href) => href !== "/"));
const assets = new Set();
for (const href of routes) {
  const page = pages[href];
  assert.ok(page, `Missing content: ${href}`);
  assert.equal(new URL(page.sourceUrl).origin, "https://vespuccicollege.net");
  assert.ok(page.html.replace(/<[^>]+>/g, "").trim() || page.forms.length, `Empty content: ${href}`);
  assert.ok(!/<(?:script|style|form|iframe|input)\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:javascript|data):/i.test(page.html), `Unsafe HTML: ${href}`);
  for (const match of page.html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = match[1];
    if (target.startsWith("/legacy/")) assets.add(target);
    else if (target.startsWith("/")) assert.ok(target === "/" || routes.has(target), `Unknown internal link: ${target}`);
    else assert.ok(/^(https?:|mailto:|tel:)/.test(target), `Invalid link: ${target}`);
    assert.ok(!target.includes(".pdfhttps:"), `Malformed PDF link: ${href}`);
  }
  for (const form of page.forms) assert.equal(new URL(form.src).origin, "https://vespuccicollege.net");
}
for (const asset of assets) {
  const filename = path.join("public", asset);
  assert.ok(fs.existsSync(filename), `Missing asset: ${asset}`);
  if (asset.endsWith(".pdf")) {
    const handle = fs.openSync(filename, "r");
    const signature = Buffer.alloc(5);
    fs.readSync(handle, signature, 0, 5, 0);
    fs.closeSync(handle);
    assert.equal(signature.toString(), "%PDF-", `Invalid PDF: ${asset}`);
  }
}
console.log(`Validated ${routes.size} subpages and ${assets.size} local assets.`);