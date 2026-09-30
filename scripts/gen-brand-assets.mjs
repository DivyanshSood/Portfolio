#!/usr/bin/env node
/* ===========================================================================
   Brand asset generator — the icon set and the default share image, in the
   Divyansh Sood® Studio brandbook (ink / red / white, Archivo 900 italic at
   125% width, radius 0).

     public/icon.svg            512² red square, "DS" white, "®" ink — the
                                letters are OUTLINED to paths, so the icon
                                never depends on a font being available
     public/icon-512.png        maskable-safe (glyphs sit inside the 80% zone)
     public/icon-192.png
     public/apple-touch-icon.png  180²
     public/favicon.ico         16² + 32² (PNG-in-ICO)
     public/og-home.png         1200×630 red chevron share card

   Outlines need the variable TTF (the self-hosted WOFF2 stores transformed
   glyph tables the outliner can't vary), so the upstream Archivo italic TTF
   is fetched from github.com/google/fonts into the OS temp dir on first run.
   Rasterising uses local Chrome, like scripts/gen-blog-covers.mjs — local-only,
   and the outputs are committed.

     node scripts/gen-brand-assets.mjs
   =========================================================================== */

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import sharp from "sharp";
import { create } from "fontkitten";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUB = resolve(ROOT, "public");
const FONT_DIR = resolve(PUB, "fonts");

const RED = "#E4151F";
const INK = "#0B0B0C";

const chrome = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => existsSync(p));
if (!chrome) {
  console.error("!! No Chrome/Chromium found — brand assets are committed, so this is local-only.");
  process.exit(1);
}

// ---- Outlined "DS®" ---------------------------------------------------------
const TTF = join(tmpdir(), "Archivo-Italic-wdth-wght.ttf");
if (!existsSync(TTF)) {
  const url = "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo-Italic%5Bwdth%2Cwght%5D.ttf";
  const r = spawnSync("curl", ["-sSL", "-o", TTF, url], { stdio: "inherit" });
  if (r.status !== 0 || !existsSync(TTF)) {
    console.error("!! Could not fetch the Archivo italic TTF from google/fonts.");
    process.exit(1);
  }
}
const font = create(readFileSync(TTF)).getVariation({ wght: 900, wdth: 125 });
const UPM = font.unitsPerEm;

/** Path data for `text` set at `size`px with its baseline at (x, y); tracking in em. */
function setText(text, size, x, y, tracking = 0) {
  const s = size / UPM;
  let pen = x;
  const parts = [];
  for (const g of font.glyphsForString(text)) {
    const d = g.path.scale(s, -s).translate(pen, y).toSVG();
    if (d) parts.push(d);
    pen += g.advanceWidth * s + tracking * size;
  }
  return { d: parts.join(""), width: pen - x - tracking * size };
}

// "DS" centred optically in a 512 square; "®" at .3em, top-right, red.
const SIZE = 200;
const ds = setText("DS", SIZE, 0, 0, -0.02);
const DS_X = (512 - ds.width - SIZE * 0.3 * 0.9) / 2;
const BASE = 256 + SIZE * 0.36; // cap height of Archivo ≈ .72em → centred
const dsPath = setText("DS", SIZE, DS_X, BASE, -0.02).d;
const regPath = setText("®", SIZE * 0.3, DS_X + ds.width + SIZE * 0.04, BASE - SIZE * 0.72 + SIZE * 0.3 * 0.72).d;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Divyansh Sood® Studio">
  <rect width="512" height="512" fill="${RED}"/>
  <path fill="#FFFFFF" d="${dsPath}"/>
  <path fill="${INK}" d="${regPath}"/>
</svg>
`;
writeFileSync(join(PUB, "icon.svg"), iconSvg);
console.log("   ✓ icon.svg");

// ---- Raster helpers -----------------------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), "ds-brand-"));
function shoot(html, w, h, name) {
  const page = join(tmp, `${name}.html`);
  const png = join(tmp, `${name}.png`);
  writeFileSync(page, html);
  spawnSync(chrome, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${w},${h}`, "--virtual-time-budget=4000", `--screenshot=${png}`, "file://" + page], { stdio: "pipe" });
  if (!existsSync(png)) throw new Error(`Chrome produced no screenshot for ${name}`);
  return png;
}

// Icons: rasterise the SVG once at 1024 and scale down with sharp.
const iconPng = shoot(`<!doctype html><style>*{margin:0}html,body{width:512px;height:512px;overflow:hidden}</style>${iconSvg}`, 512, 512, "icon");
for (const [file, size] of [["icon-512.png", 512], ["icon-192.png", 192], ["apple-touch-icon.png", 180]]) {
  await sharp(iconPng).resize(size, size).png({ compressionLevel: 9 }).toFile(join(PUB, file));
  console.log(`   ✓ ${file}`);
}

// favicon.ico — an ICO directory holding two PNG images (16² and 32²).
const icoImages = await Promise.all([16, 32].map((s) => sharp(iconPng).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = 6 + 16 * icoImages.length;
const dir = icoImages.map((buf, i) => {
  const e = Buffer.alloc(16);
  const s = [16, 32][i];
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
writeFileSync(join(PUB, "favicon.ico"), Buffer.concat([header, ...dir, ...icoImages]));
console.log("   ✓ favicon.ico");

// ---- og-home.png: the Home hero as a 1200×630 card -----------------------------
const ff = (family, file, style, weight, stretch = "") =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ""}font-display:block;src:url('file://${join(FONT_DIR, file)}') format('woff2');}`;
const og = `<!doctype html><meta charset="utf-8"><style>
${ff("Archivo", "archivo.woff2", "normal", "100 900", "62% 125%")}
${ff("Archivo", "archivo-italic.woff2", "italic", "100 900", "62% 125%")}
${ff("Geist Mono", "geist-mono.woff2", "normal", "400 700")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;background:#fff;overflow:hidden}
.red{position:absolute;inset:0 0 auto 0;height:470px;background:${RED};color:#fff;clip-path:polygon(0 0,100% 0,100% 72%,50% 100%,0 72%);padding:44px 64px 0}
.top{display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:17px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:26px}
.name{font-family:'Archivo',sans-serif;font-weight:900;font-style:italic;font-stretch:125%;text-transform:uppercase;line-height:.84;letter-spacing:-0.03em;font-size:122px}
.name sup{font-size:.3em;vertical-align:top;margin-left:.2em}
.row{position:absolute;left:64px;right:64px;bottom:40px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.lead{font-family:'Archivo',sans-serif;font-weight:650;font-size:27px;line-height:1.22;letter-spacing:-0.01em;color:${INK};max-width:640px}
.lead em{color:${RED};font-weight:900;font-stretch:115%}
.url{font-family:'Geist Mono',monospace;font-size:17px;letter-spacing:.08em;text-transform:uppercase;color:${INK};white-space:nowrap}
</style>
<div class="red"><div class="top"><span>Divyansh Sood® Studio — Portfolio 2026</span><span>Custom-coded · Worldwide</span></div>
<div class="name">Divyansh<br>Sood<sup>®</sup></div></div>
<div class="row"><div class="lead">Web designer &amp; developer in Himachal Pradesh — custom-coded websites that <em>convert</em>.</div><div class="url">divyanshsood.com</div></div>`;
const ogPng = shoot(og, 1200, 630, "og");
await sharp(ogPng).resize(1200, 630).png({ compressionLevel: 9 }).toFile(join(PUB, "og-home.png"));
console.log("   ✓ og-home.png");

rmSync(tmp, { recursive: true, force: true });
