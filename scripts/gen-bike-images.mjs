#!/usr/bin/env node
/* ===========================================================================
   Marlboro Cross photos → /public/images/marlboro-cross/*.webp + share card + manifest.

   Local-only, like the other generators: the outputs are committed, the
   owner's originals are not (they carry GPS and are 2–7 MB each).

     node scripts/gen-bike-images.mjs "/path/to/originals"

   The folder holds the iPhone originals named as in src/lib/bike.mjs
   (IMG_1847.jpg, IMG_0215.HEIC, …). HEIC is converted with macOS `sips`
   first, because sharp's prebuilt binaries can't decode HEVC-coded HEIC.

   The photos are published as taken (owner decision, 22 Nov 2026): no blur,
   no cutout, no retouching. For each photo in BIKE_PHOTOS the script only
     1. turns it upright from its EXIF orientation;
     2. writes the 1920px base + the LOCAL_WIDTHS ladder from images.mjs as
        WebP. sharp writes no metadata unless asked, so EXIF/GPS are dropped
        (asserted on every output).
   Then the 1200×630 share card from the hero (a centre crop, the only shape
   change, because share cards have a fixed size), and
   src/data/bike-images.json with each base's pixel size.
   =========================================================================== */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { BIKE_PHOTOS, BIKE_HERO, BIKE_OG, BIKE_DIR } from "../src/lib/bike.mjs";
import { LOCAL_WIDTHS, BASE_WIDTH } from "../src/lib/images.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", BIKE_DIR);
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

async function assertNoMeta(path) {
  const m = await sharp(path).metadata();
  if (m.exif || m.xmp || m.iptc) throw new Error(`${path} still carries metadata`);
}

const manifest = {};
for (const photo of BIKE_PHOTOS) {
  // Upright pixels, full resolution, nothing else changed.
  const { data: buf, info } = await sharp(original(photo.src)).rotate().jpeg({ quality: 95 }).toBuffer({ resolveWithObject: true });
  const baseH = Math.round((info.height * BASE_WIDTH) / info.width);

  const base = join(OUT, `${photo.slug}.webp`);
  await sharp(buf).resize(BASE_WIDTH).webp({ quality: QUALITY }).toFile(base);
  await assertNoMeta(base);
  for (const lw of LOCAL_WIDTHS) {
    const p = join(OUT, `${photo.slug}-${lw}.webp`);
    await sharp(buf).resize(lw).webp({ quality: QUALITY }).toFile(p);
    await assertNoMeta(p);
  }
  manifest[photo.slug] = { w: BASE_WIDTH, h: baseH };
  console.log(`  ${photo.slug}  ${BASE_WIDTH}×${baseH}`);

  if (photo === BIKE_HERO) {
    const og = join(ROOT, "public", BIKE_OG);
    await sharp(buf).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
    await assertNoMeta(og);
    console.log(`  share card → ${BIKE_OG}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${BIKE_PHOTOS.length} photos → public${BIKE_DIR}, sizes → src/data/bike-images.json`);
