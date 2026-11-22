#!/usr/bin/env node
/* ===========================================================================
   Marlboro Cross photos → /public/images/bike/*.webp + share card + manifest.

   Local-only, like the other generators: the outputs are committed, the
   owner's originals are not (they carry GPS and are 2–7 MB each).

     node scripts/gen-bike-images.mjs "/path/to/originals"

   The folder holds the iPhone originals named as in src/lib/bike.mjs
   (IMG_1847.jpg, IMG_0215.HEIC, …). HEIC is converted with macOS `sips`
   first, because sharp's prebuilt binaries can't decode HEVC-coded HEIC.

   For each photo in BIKE_PHOTOS:
     1. rotate upright from EXIF orientation;
     2. blur every `blur` box (tobacco wordmark/chevron, number plates). The
        whole frame is blurred once and each box is cut from that copy, so
        the blur carries the surrounding colour rather than a hard smear;
     3. write the 1920px base + the LOCAL_WIDTHS ladder from images.mjs as
        WebP. sharp writes no metadata unless asked, so EXIF/GPS are dropped
        (the script asserts it on every output).
   Then the 1200×630 share card from the hero, and src/data/bike-images.json
   with each base's pixel size for width/height attributes.
   =========================================================================== */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { BIKE_PHOTOS, BIKE_HERO, BIKE_OG } from "../src/lib/bike.mjs";
import { LOCAL_WIDTHS, BASE_WIDTH } from "../src/lib/images.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "bike");
const MANIFEST = join(ROOT, "src", "data", "bike-images.json");
const QUALITY = 74;

const srcDir = process.argv[2];
if (!srcDir || !existsSync(srcDir)) {
  console.error('Usage: node scripts/gen-bike-images.mjs "/path/to/originals"');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const files = readdirSync(srcDir);
const tmp = mkdtempSync(join(tmpdir(), "bike-"));

/** The original for a base name, as a path sharp can read. */
function original(name) {
  const f = files.find((x) => x.slice(0, -extname(x).length) === name);
  if (!f) throw new Error(`${name}: not found in ${srcDir}`);
  const p = join(srcDir, f);
  if (!/^\.hei[cf]$/i.test(extname(f))) return p;
  const out = join(tmp, `${name}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "95", p, "--out", out], { stdio: "ignore" });
  return out;
}

/** Upright pixels with every blur box applied. */
async function prepared(photo) {
  const { data, info } = await sharp(original(photo.src)).rotate().jpeg({ quality: 95 }).toBuffer({ resolveWithObject: true });
  if (!photo.blur.length) return { buf: data, w: info.width, h: info.height };
  const { width: W, height: H } = info;
  // Strong enough that 30px-high lettering is a colour wash at any output size.
  const sigma = Math.max(24, Math.round(Math.max(W, H) * 0.012));
  const soft = await sharp(data).blur(sigma).jpeg({ quality: 95 }).toBuffer();
  const patches = [];
  for (const [fx, fy, fw, fh] of photo.blur) {
    const bx = Math.round(fx * W), by = Math.round(fy * H);
    const bw = Math.round(fw * W), bh = Math.round(fh * H);
    // Feathered edge: a hard rectangle reads as a censor bar. The mask is the
    // box grown by pad/2 on each side with a pad/4 blur, so the box itself is
    // still fully covered (the falloff starts outside it) and the wash fades
    // into the paint around it.
    const pad = Math.max(16, Math.round(Math.min(bw, bh) * 0.35));
    const left = Math.max(0, bx - pad), top = Math.max(0, by - pad);
    const width = Math.min(W, bx + bw + pad) - left;
    const height = Math.min(H, by + bh + pad) - top;
    const g = Math.round(pad / 2);
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(pad / 4).toFixed(1)}"/></filter>` +
        `<rect x="${bx - left - g}" y="${by - top - g}" width="${bw + 2 * g}" height="${bh + 2 * g}" rx="${g}" fill="#fff" filter="url(#f)"/></svg>`
    );
    const patch = await sharp(soft)
      .extract({ left, top, width, height })
      .ensureAlpha()
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();
    patches.push({ input: patch, left, top });
  }
  return { buf: await sharp(data).composite(patches).jpeg({ quality: 95 }).toBuffer(), w: W, h: H };
}

async function assertNoMeta(path) {
  const m = await sharp(path).metadata();
  if (m.exif || m.xmp || m.iptc) throw new Error(`${path} still carries metadata`);
}

const manifest = {};
for (const photo of BIKE_PHOTOS) {
  const { buf, w, h } = await prepared(photo);
  const baseH = Math.round((h * BASE_WIDTH) / w);
  const base = join(OUT, `${photo.slug}.webp`);
  await sharp(buf).resize(BASE_WIDTH).webp({ quality: QUALITY }).toFile(base);
  await assertNoMeta(base);
  for (const lw of LOCAL_WIDTHS) {
    const p = join(OUT, `${photo.slug}-${lw}.webp`);
    await sharp(buf).resize(lw).webp({ quality: QUALITY }).toFile(p);
    await assertNoMeta(p);
  }
  manifest[photo.slug] = { w: BASE_WIDTH, h: baseH };
  console.log(`  ${photo.slug}  ${BASE_WIDTH}×${baseH}  (${photo.blur.length} blurred)`);

  if (photo === BIKE_HERO) {
    const og = join(ROOT, "public", BIKE_OG);
    await sharp(buf).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
    await assertNoMeta(og);
    console.log(`  share card → ${BIKE_OG}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${BIKE_PHOTOS.length} photos → public/images/bike, sizes → src/data/bike-images.json`);
