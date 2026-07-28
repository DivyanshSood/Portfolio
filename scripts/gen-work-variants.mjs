/* ===========================================================================
   Responsive image variants for /public/images/work.

   Each project screenshot is committed as a 1920px "base" (`<name>-1.webp`,
   `<name>-2.webp`). Browsers on phones shouldn't download that, so this script
   writes narrower WebP variants next to each base — `<name>-<w>.webp` for every
   width in WIDTHS.

   WIDTHS is imported from src/lib/images.mjs, the same module the site's image
   code reads (render.mjs, the homepage deck, DepthGallery). Add a width there
   and re-run this script — the ladder can no longer drift out of sync, which
   used to 404 for any width the generator hadn't been told about.

   Run after adding or replacing a base image:
     node scripts/gen-work-variants.mjs
   =========================================================================== */
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOCAL_WIDTHS as WIDTHS } from "../src/lib/images.mjs";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "work");
const QUALITY = 80;

const files = await readdir(DIR);
// A base ends in `-1.webp` … `-3.webp`; a variant ends in `-<width>.webp`
// (480/768/1080/1440), so the two can't be confused.
const bases = files.filter((f) => /-[1-3]\.webp$/.test(f));

let made = 0;
for (const base of bases) {
  const src = path.join(DIR, base);
  const meta = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (meta.width && meta.width <= w) continue; // never upscale
    const out = path.join(DIR, base.replace(/\.webp$/, `-${w}.webp`));
    await sharp(src).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
    made++;
  }
}
console.log(`gen-work-variants: ${bases.length} bases → ${made} variants in ${path.relative(process.cwd(), DIR)}`);
