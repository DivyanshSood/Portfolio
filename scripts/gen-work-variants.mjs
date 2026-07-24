/* ===========================================================================
   Responsive image variants for /public/images/work.

   Each project screenshot is committed as a 1920px "base" (`<name>-1.webp`,
   `<name>-2.webp`). Browsers on phones shouldn't download that, so this script
   writes narrower WebP variants next to each base — `<name>-<w>.webp` for every
   width in WIDTHS. The site's image code (src/lib/projects/render.mjs, the
   homepage deck in src/pages/index.astro, and src/components/DepthGallery.astro)
   builds srcsets / picks a width from exactly these files, so keep WIDTHS here in
   sync with the LOCAL_WIDTHS arrays there.

   Run after adding or replacing a base image:
     node scripts/gen-work-variants.mjs
   =========================================================================== */
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "work");
const WIDTHS = [480, 768, 1080, 1440]; // 1920 stays the unsuffixed base
const QUALITY = 80;

const files = await readdir(DIR);
// A base ends in `-1.webp` / `-2.webp`; a variant ends in `-<width>.webp`.
const bases = files.filter((f) => /-[12]\.webp$/.test(f));

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
