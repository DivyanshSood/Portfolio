/* ===========================================================================
   Responsive image variants. Two passes, one entry point.

   1. /public/images/work — project screenshots.
      Each is committed as a 1920px "base" (`<name>-1.webp`, `<name>-2.webp`).
      Browsers on phones shouldn't download that, so this writes narrower WebP
      variants next to each base — `<name>-<w>.webp` for every LOCAL_WIDTH.

   2. /public/blog — post covers.
      Covers are authored as `<slug>.jpg` at 1200px wide, and both places that
      display one force `aspect-ratio:16/10` with `object-fit:cover`. So the
      browser was downloading a full-height JPEG and throwing the extra away —
      and /blog/ did that for every post on the page at once. This pre-crops to
      16:10 and writes a WebP base plus the COVER_WIDTHS ladder. The .jpg is
      left in place: it's still the og:image, and social scrapers are the one
      audience that can't be relied on to take WebP.

   Both ladders are imported from src/lib/images.mjs, the same module the site's
   image code reads. Add a width there and re-run — the ladder can no longer
   drift out of sync, which used to 404 for any width the generator hadn't been
   told about.

   Run after adding or replacing a base image or a cover:
     node scripts/gen-work-variants.mjs          # only what's missing
     node scripts/gen-work-variants.mjs --force  # rebuild everything
   =========================================================================== */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LOCAL_WIDTHS as WIDTHS,
  COVER_WIDTHS,
  COVER_BASE_WIDTH,
  COVER_RATIO,
} from "../src/lib/images.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK_DIR = path.join(ROOT, "public", "images", "work");
const BLOG_DIR = path.join(ROOT, "public", "blog");
const QUALITY = 80;
const FORCE = process.argv.includes("--force");

const rel = (p) => path.relative(process.cwd(), p);

/* --- 1. Work screenshots ------------------------------------------------- */

const workFiles = await readdir(WORK_DIR);
// A base ends in `-1.webp` … `-3.webp`; a variant ends in `-<width>.webp`
// (480/768/1080/1440), so the two can't be confused.
const bases = workFiles.filter((f) => /-[1-3]\.webp$/.test(f));

let workMade = 0;
for (const base of bases) {
  const src = path.join(WORK_DIR, base);
  const meta = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (meta.width && meta.width <= w) continue; // never upscale
    const out = path.join(WORK_DIR, base.replace(/\.webp$/, `-${w}.webp`));
    if (existsSync(out) && !FORCE) continue;
    await sharp(src).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
    workMade++;
  }
}
console.log(`work:  ${bases.length} bases → ${workMade} variants written in ${rel(WORK_DIR)}`);

/* --- 2. Blog covers ------------------------------------------------------ */

const coverHeight = (w) => Math.round((w * COVER_RATIO[1]) / COVER_RATIO[0]);
const covers = (await readdir(BLOG_DIR)).filter((f) => /\.jpe?g$/i.test(f));

let coverMade = 0;
let bytesBefore = 0;
let bytesAfter = 0;
for (const cover of covers) {
  const src = path.join(BLOG_DIR, cover);
  bytesBefore += (await stat(src)).size;

  // The 1200px WebP base, then each rung of the ladder. The crop is centred on
  // purpose: that is exactly what `object-fit:cover` was already doing in the
  // browser, so moving the crop to build time changes bytes, not framing. A
  // smarter strategy (sharp.strategy.attention) would reframe covers that are
  // live today.
  for (const w of [COVER_BASE_WIDTH, ...COVER_WIDTHS]) {
    const name = cover.replace(/\.jpe?g$/i, w === COVER_BASE_WIDTH ? ".webp" : `-${w}.webp`);
    const out = path.join(BLOG_DIR, name);
    if (!existsSync(out) || FORCE) {
      await sharp(src)
        .resize(w, coverHeight(w), { fit: "cover", position: "centre" })
        .webp({ quality: QUALITY })
        .toFile(out);
      coverMade++;
    }
    bytesAfter += (await stat(out)).size;
  }
}
const mb = (n) => (n / 1048576).toFixed(2) + " MB";
console.log(
  `blog:  ${covers.length} covers → ${coverMade} variants written in ${rel(BLOG_DIR)}\n` +
    `       ${mb(bytesBefore)} of JPEG → ${mb(bytesAfter)} of WebP across the whole ladder`
);
