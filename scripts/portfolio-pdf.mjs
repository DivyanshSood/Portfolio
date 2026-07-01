#!/usr/bin/env node
/* ===========================================================================
   Regenerate /portfolio.pdf from the print-only /portfolio-pdf page.
   Uses headless Chrome (installed on this Mac) to print to A4.
   (/portfolio is now the browsable HTML portfolio; /portfolio-pdf is the
   print source, noindexed, kept separate so the PDF stays clean.)
   Run after `npm run build` so the page exists in /dist/client/portfolio-pdf/.
   =========================================================================== */

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST_HTML = resolve(ROOT, "dist/client/portfolio-pdf/index.html");
const OUT = resolve(ROOT, "public/portfolio.pdf");

if (!existsSync(DIST_HTML)) {
  console.error(
    "!! dist/client/portfolio-pdf/index.html not found. Run `npm run build` first."
  );
  process.exit(1);
}

const fileUrl = "file://" + DIST_HTML;
const candidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("!! No Chrome/Chromium binary found at:");
  candidates.forEach((p) => console.error("   ", p));
  process.exit(1);
}

const args = [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--print-to-pdf=" + OUT,
  "--print-to-pdf-no-header",
  fileUrl,
];

console.log("Rendering:", fileUrl);
console.log("Output:   ", OUT);
const r = spawnSync(chrome, args, { stdio: "inherit" });
if (r.status !== 0) {
  console.error("Chrome exited with status", r.status);
  process.exit(r.status ?? 1);
}
if (!existsSync(OUT)) {
  console.error("!! Chrome did not write", OUT);
  process.exit(1);
}
console.log("OK · portfolio.pdf:", (statSync(OUT).size / 1024).toFixed(1), "KB");
