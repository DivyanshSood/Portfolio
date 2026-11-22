#!/usr/bin/env node
/* ===========================================================================
   Marlboro Cross photos → /public/images/bike/*.webp + share card + manifest.

   Local-only, like the other generators: the outputs are committed, the
   owner's originals are not (they carry GPS and are 2–7 MB each). macOS only:
   it uses `sips` for HEIC and the system's subject lift for the cutout.

     node scripts/gen-bike-images.mjs "/path/to/originals"

   The folder holds the iPhone originals named as in src/lib/bike.mjs
   (IMG_1847.jpg, IMG_0215.HEIC, …).

   For each photo in BIKE_PHOTOS (owner decision 22 Nov 2026: the bike as
   photographed, nothing blurred, on a plain background):
     1. HEIC → JPEG with `sips` (sharp's prebuilt binaries can't decode HEVC);
     2. rotate upright from EXIF orientation;
     3. cut the bike out with scripts/bike-cutout.swift (Vision subject lift,
        compiled once per run into a temp folder);
     4. trim to the bike, centre it on a Tarmac Tint (--tint) canvas — 16:9
        for the hero, 4:3 for the rest — with a soft contact shadow so it sits
        on the ground instead of floating;
     5. write the 1920px base + the LOCAL_WIDTHS ladder from images.mjs as
        WebP. sharp writes no metadata unless asked, so EXIF/GPS are dropped
        (asserted on every output).
   Then the 1200×630 share card from the hero, and src/data/bike-images.json
   with each base's pixel size for width/height attributes.
   =========================================================================== */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { BIKE_PHOTOS, BIKE_HERO, BIKE_OG } from "../src/lib/bike.mjs";
import { LOCAL_WIDTHS, BASE_WIDTH } from "../src/lib/images.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "bike");
const MANIFEST = join(ROOT, "src", "data", "bike-images.json");
const QUALITY = 78;

// The canvas colour is the site's own Tarmac Tint, read from brand.css so it
// can't drift from the token.
const TINT = readFileSync(join(ROOT, "src", "styles", "brand.css"), "utf8").match(/--tint:\s*(#[0-9A-Fa-f]{6})/)?.[1];
if (!TINT) throw new Error("brand.css: --tint not found");

const srcDir = process.argv[2];
if (!srcDir || !existsSync(srcDir)) {
  console.error('Usage: node scripts/gen-bike-images.mjs "/path/to/originals"');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const files = readdirSync(srcDir);
const tmp = mkdtempSync(join(tmpdir(), "bike-"));
const CUTOUT = join(tmp, "bike-cutout");
execFileSync("swiftc", ["-O", join(ROOT, "scripts", "bike-cutout.swift"), "-o", CUTOUT], { stdio: "inherit" });

/** The original for a base name, as a path sharp can read. */
function original(name) {
  const f = files.find((x) => x.slice(0, -extname(x).length) === name);
  if (!f) throw new Error(`${name}: not found in ${srcDir}`);
  const p = join(srcDir, f);
  if (!/^\.hei[cf]$/i.test(extname(f))) return p;
  const out = join(tmp, `${name}-heic.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "95", p, "--out", out], { stdio: "ignore" });
  return out;
}

/** The bike alone, trimmed to its own bounding box, as an RGBA PNG buffer. */
async function cutout(photo) {
  const upright = join(tmp, `${photo.slug}-up.jpg`);
  await sharp(original(photo.src)).rotate().jpeg({ quality: 95 }).toFile(upright);
  const cut = join(tmp, `${photo.slug}-cut.png`);
  execFileSync(CUTOUT, [upright, cut], { stdio: "inherit" });

  // Bounding box of everything that is meaningfully opaque.
  const { data, info } = await sharp(cut).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error(`${photo.slug}: the cutout is empty`);
  // A bike that runs off the photo looks sliced flat on a plain background.
  const edges = [x0 <= 2 && "left", y0 <= 2 && "top", x1 >= info.width - 3 && "right", y1 >= info.height - 3 && "bottom"].filter(Boolean);
  if (edges.length) throw new Error(`${photo.slug} (${photo.src}): the bike touches the photo's ${edges.join(" and ")} edge — pick a photo with the whole bike in frame`);
  return sharp(cut).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer({ resolveWithObject: true });
}

/**
 * The bike centred on a tint canvas of W×H, at most `fill` of the width and
 * `fillH` of the height, its wheels on a line at ~86% of the height, with a
 * soft elliptical shadow under it.
 */
async function compose(bike, W, H, fill = 0.84, fillH = 0.76) {
  const scale = Math.min((W * fill) / bike.info.width, (H * fillH) / bike.info.height);
  const bw = Math.round(bike.info.width * scale), bh = Math.round(bike.info.height * scale);
  const left = Math.round((W - bw) / 2);
  const top = Math.max(0, Math.min(H - bh, Math.round(H * 0.86 - bh)));
  const sw = Math.round(bw * 0.92), sh = Math.max(8, Math.round(bh * 0.07));
  const shadow = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      `<filter id="b" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="${Math.round(sh * 0.55)}"/></filter>` +
      `<ellipse cx="${W / 2}" cy="${top + bh - sh * 0.3}" rx="${sw / 2}" ry="${sh / 2}" fill="#0B0B0C" fill-opacity=".22" filter="url(#b)"/></svg>`
  );
  const scaled = await sharp(bike.data).resize(bw, bh).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: TINT } })
    .composite([{ input: shadow }, { input: scaled, left, top }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function assertNoMeta(path) {
  const m = await sharp(path).metadata();
  if (m.exif || m.xmp || m.iptc) throw new Error(`${path} still carries metadata`);
}

const manifest = {};
for (const photo of BIKE_PHOTOS) {
  const bike = await cutout(photo);
  const [rw, rh] = photo === BIKE_HERO ? [16, 9] : [4, 3];
  const W = BASE_WIDTH, H = Math.round((BASE_WIDTH * rh) / rw);
  const buf = await compose(bike, W, H);

  const base = join(OUT, `${photo.slug}.webp`);
  await sharp(buf).webp({ quality: QUALITY }).toFile(base);
  await assertNoMeta(base);
  for (const lw of LOCAL_WIDTHS) {
    const p = join(OUT, `${photo.slug}-${lw}.webp`);
    await sharp(buf).resize(lw).webp({ quality: QUALITY }).toFile(p);
    await assertNoMeta(p);
  }
  manifest[photo.slug] = { w: W, h: H };
  console.log(`  ${photo.slug}  ${W}×${H}`);

  if (photo === BIKE_HERO) {
    const og = join(ROOT, "public", BIKE_OG);
    await sharp(await compose(bike, 1200, 630, 0.8, 0.78)).jpeg({ quality: 84, mozjpeg: true }).toFile(og);
    await assertNoMeta(og);
    console.log(`  share card → ${BIKE_OG}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${BIKE_PHOTOS.length} photos → public/images/bike, sizes → src/data/bike-images.json`);
