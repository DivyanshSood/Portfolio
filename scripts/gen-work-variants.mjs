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
      left in place at 1200×750 as the ladder's source; share images are
      written separately (pass 4).

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
  PORTRAIT_WIDTHS,
} from "../src/lib/images.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK_DIR = path.join(ROOT, "public", "images", "work");
const BLOG_DIR = path.join(ROOT, "public", "blog");
const QUALITY = 80;
const FORCE = process.argv.includes("--force");
// Detailed photo heroes that came out over 150 KB at QUALITY (16 Nov 2026
// audit). These settings bring each 1440w file under 120 KB (KiB too) with no visible
// loss. Keyed by output file name; everything else uses { quality: QUALITY }.
const WEBP_OVERRIDES = {
  "hotel-himalayan-brothers-1-1440.webp": { quality: 58, effort: 6, preset: "photo" }, // 182 → 116 KiB
  "sunny-himachal-travels-1-1440.webp": { quality: 67, effort: 6 }, // 159 → 115 KiB
  "sach-pass-1-1440.webp": { quality: 74, effort: 6 }, // 150 → 113 KiB
};
// `--only=<file>,<file>` rewrites just those outputs (implies --force for them).
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");

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
    const name = base.replace(/\.webp$/, `-${w}.webp`);
    const out = path.join(WORK_DIR, name);
    if (ONLY ? !ONLY.includes(name) : existsSync(out) && !FORCE) continue;
    await sharp(src).resize({ width: w }).webp(WEBP_OVERRIDES[name] ?? { quality: QUALITY }).toFile(out);
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

/* --- 3. Founder portraits ------------------------------------------------ */

const IMG_DIR = path.join(ROOT, "public", "images");
const portraits = (await readdir(IMG_DIR)).filter((f) => /^divyansh-portrait(-about)?\.webp$/.test(f));
let portraitMade = 0;
for (const base of portraits) {
  const src = path.join(IMG_DIR, base);
  const meta = await sharp(src).metadata();
  for (const w of PORTRAIT_WIDTHS) {
    if (meta.width && meta.width <= w) continue;
    const out = path.join(IMG_DIR, base.replace(/\.webp$/, `-${w}.webp`));
    if (existsSync(out) && !FORCE) continue;
    await sharp(src).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
    portraitMade++;
  }
}
console.log(`portraits: ${portraits.length} bases → ${portraitMade} variants written in ${rel(IMG_DIR)}`);

/* --- 4. Social share images (og:image) ----------------------------------- */
// Scrapers (Facebook, LinkedIn, WhatsApp, X) are the one audience that can't
// be relied on to take WebP, and the og tags must state the file's REAL size.
// Every share image is a 1200×630 (1.91:1) JPEG — the size Facebook, LinkedIn
// and X crop to, so nothing is trimmed off the card in the feed (16 Nov 2026
// audit; these were 1200×750 before):
//   case studies  /images/og/<slug>.jpg, from the `<slug>-1.webp` base,
//                 top-anchored so the site's header and hero stay in frame
//   blog covers   /images/og/blog/<slug>.jpg, centre-cropped from the cover
//                 .jpg, for PHOTO covers only. Title-card covers are re-laid
//                 out at 1200×630 by scripts/gen-blog-covers.mjs instead — a
//                 crop would cut through the headline or the footer rule.
// The cover .jpg itself stays 1200×750 (16:10): it is the source of the WebP
// ladder in pass 2, so it is only ever normalised to that size, never to OG.
const OG_W = 1200;
const OG_H = 630;
const COVER_W = COVER_BASE_WIDTH;
const COVER_H = coverHeight(COVER_BASE_WIDTH);
const OG_DIR = path.join(ROOT, "public", "images", "og");
const OG_BLOG_DIR = path.join(OG_DIR, "blog");
const { mkdir, rename } = await import("node:fs/promises");
const { POSTS } = await import("../src/lib/blog-posts.mjs");
await mkdir(OG_BLOG_DIR, { recursive: true });

let ogMade = 0;
for (const base of bases.filter((f) => f.endsWith("-1.webp") && !f.endsWith("-mobile-1.webp"))) {
  const name = base.replace(/-1\.webp$/, ".jpg");
  const out = path.join(OG_DIR, name);
  if (ONLY ? !ONLY.includes(name) : existsSync(out) && !FORCE) continue;
  await sharp(path.join(WORK_DIR, base))
    .resize(OG_W, OG_H, { fit: "cover", position: "top" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  ogMade++;
}

// Covers are authored at 16:10; one that isn't is centre-cropped in place.
let coversCropped = 0;
for (const cover of covers) {
  const src = path.join(BLOG_DIR, cover);
  const meta = await sharp(src).metadata();
  if (meta.width === COVER_W && meta.height === COVER_H) continue;
  const tmp = src + ".tmp";
  await sharp(src)
    .resize(COVER_W, COVER_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(tmp);
  await rename(tmp, src);
  coversCropped++;
}

const titleCard = new Set(POSTS.filter((p) => /^Title card/.test(p.coverAlt ?? "")).map((p) => p.slug));
let blogOgMade = 0;
for (const cover of covers) {
  const slug = cover.replace(/\.jpe?g$/i, "");
  if (titleCard.has(slug)) continue; // gen-blog-covers.mjs owns these
  const out = path.join(OG_BLOG_DIR, `${slug}.jpg`);
  if (existsSync(out) && !FORCE) continue;
  await sharp(path.join(BLOG_DIR, cover))
    .resize(OG_W, OG_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  blogOgMade++;
}
console.log(
  `og:    ${ogMade} case-study share images in ${rel(OG_DIR)}; ${blogOgMade} photo-cover share images in ${rel(OG_BLOG_DIR)}; ` +
    `${coversCropped} blog covers normalised to ${COVER_W}×${COVER_H}`
);
