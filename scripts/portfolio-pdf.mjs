#!/usr/bin/env node
/* ===========================================================================
   Regenerate /portfolio.pdf from the print-only /portfolio-pdf page.
   Uses headless Chrome (installed on this Mac) to print to A4.
   (/portfolio is now the browsable HTML portfolio; /portfolio-pdf is the
   print source, noindexed, kept separate so the PDF stays clean.)
   Run after `npm run build` so the page exists in /dist/client/portfolio-pdf/.
   =========================================================================== */

import { spawnSync } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST_HTML = resolve(ROOT, "dist/client/portfolio-pdf/index.html");
const OUT = resolve(ROOT, "public/portfolio.pdf");

/* ---------------------------------------------------------------------------
   /portfolio-pdf is build scaffolding, not a page anyone should reach. It
   shipped as a live 200 carrying BOTH noindex and canonical→/portfolio/ — a
   combination Google's guidance rules out, because the canonical says
   "consolidate into /portfolio/" while the noindex says "drop me", and the
   noindex can carry across to the canonical target. Deindexing the real
   /portfolio/ page is not a risk worth a URL with zero inbound links that is
   already excluded from the sitemap (the visible download points at
   /portfolio.pdf, the file, not this route).

   So the route is pruned from the build output instead of being redirected —
   nothing to redirect, nothing to conflict. Both paths must go: the Vercel
   adapter copies static files into .vercel/output/static BEFORE postbuild runs,
   so deleting only dist/client would still deploy it.
   --------------------------------------------------------------------------- */
function prune() {
  for (const dir of ["dist/client/portfolio-pdf", ".vercel/output/static/portfolio-pdf"]) {
    const p = resolve(ROOT, dir);
    if (!existsSync(p)) continue;
    rmSync(p, { recursive: true, force: true });
    console.log("[portfolio-pdf] pruned", dir);
  }
}

// The committed public/portfolio.pdf ships as-is on CI/Vercel — those build
// hosts have no Chrome, so regeneration is a local-only convenience. Skip there
// (and exit 0) so the deploy never fails on a missing browser binary. Refresh
// the PDF locally with `npm run pdf:portfolio` before committing a new version.
// The prune still has to run: it's the only thing keeping the route off prod.
if (process.env.VERCEL || process.env.CI) {
  console.log("[portfolio-pdf] skipped — CI/Vercel build uses the committed PDF");
  prune();
  process.exit(0);
}

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
  // Non-fatal: the committed PDF is used as-is when no browser is available.
  console.warn("!! No Chrome/Chromium binary found — keeping the committed PDF. Looked in:");
  candidates.forEach((p) => console.warn("   ", p));
  prune();
  process.exit(0);
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

// Last, so the print source still exists for the render above.
prune();
