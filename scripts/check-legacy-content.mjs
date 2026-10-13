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
  assert.ok(page.html.replace(/<[^>]+>/g, "").trim() || page.forms.length || page.documents?.length, `Empty content: ${href}`);
  assert.ok(!/<(?:script|style|form|iframe|input)\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:javascript|data):/i.test(page.html), `Unsafe HTML: ${href}`);
  for (const match of page.html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = match[1];
    if (target.startsWith("/legacy/")) assets.add(target);
    else if (target.startsWith("/")) assert.ok(target === "/" || routes.has(target), `Unknown internal link: ${target}`);
    else assert.ok(/^(https?:|mailto:|tel:)/.test(target), `Invalid link: ${target}`);
    assert.ok(!target.includes(".pdfhttps:"), `Malformed PDF link: ${href}`);
  }
  const headings = [...page.html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)];
  const normalize = (value) => value.replace(/<[^>]+>/g, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  for (let index = 1; index < headings.length; index++) {
    const previous = headings[index - 1];
    const current = headings[index];
    const between = page.html.slice(previous.index + previous[0].length, current.index).trim();
    if (!between) assert.notEqual(normalize(previous[1]), normalize(current[1]), "Duplicate adjacent headings: " + href);
  }
  const markers = [...page.html.matchAll(/data-pdf-book="(\d+)"/g)];
  assert.equal(markers.length, page.documents?.length ?? 0, "Book marker mismatch: " + href);
  for (const marker of markers) assert.ok(page.documents[Number(marker[1])], "Unknown book marker");
  for (const document of page.documents ?? []) {
    assert.ok(document.src.startsWith("/legacy/") && document.src.endsWith(".pdf"), "Invalid book PDF");
    assets.add(document.src);
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