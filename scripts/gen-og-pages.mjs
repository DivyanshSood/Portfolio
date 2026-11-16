#!/usr/bin/env node
/* ===========================================================================
   Per-page share cards — public/images/og/pages/<key>.jpg at 1200×630, and
   src/data/og-manifest.json mapping each page's path to its card.

   Without a card of its own, every service, town and studio page shared the
   homepage's og-home.png, so a WhatsApp or LinkedIn preview of
   /web-developer-palampur/ looked exactly like one of /privacy/. Base.astro
   now looks the current path up in the manifest whenever a page passes no
   `ogImage`, and falls back to og-home.png for anything not listed.

   The card is the brandbook hero on ink: the red chevron (same 72% cut as
   every hero) carrying the page's hero kicker in Geist Mono and its display
   title in Archivo 900 italic at 125% width, uppercase, white; below it on
   ink, DS® and the page's URL.

   The copy is read from the BUILT page (dist/client), not retyped here: the
   kicker is the hero's `.ph-kicker` line and the title is the hero's display
   name (`.ph-name`). A page whose hero copy changes gets a matching card on
   the next run, with nothing to keep in sync. OVERRIDES below covers the few
   heroes that can't be used as they are.

   Rendering is satori (layout → SVG) + resvg (SVG → PNG) + sharp (→ JPEG). Satori
   can't read WOFF2 or vary a variable font, so it uses static TTF instances
   committed in scripts/og-fonts/, cut from the self-hosted WOFF2 files with
   fontTools:
     python3 -m venv .venv && .venv/bin/pip install fonttools brotli
     .venv/bin/python - <<'PY'
     from fontTools.ttLib import TTFont; from fontTools.varLib import instancer
     f = instancer.instantiateVariableFont(TTFont("public/fonts/archivo-italic.woff2"), {"wght": 900, "wdth": 125}); f.flavor = None
     f.save("scripts/og-fonts/Archivo-BlackItalic-Expanded.ttf")
     f = instancer.instantiateVariableFont(TTFont("public/fonts/geist-mono.woff2"), {"wght": 400}); f.flavor = None
     f.save("scripts/og-fonts/GeistMono-Regular.ttf")
     PY
   They are the latin subset, like the site: no Devanagari, so the Hindi page
   gets a card in English (see OVERRIDES).

   Local-only, like the other generators: outputs are committed.
     npm run build && npm run og:pages && npm run build
   (the first build is what the copy is read from; the second ships the
   manifest). Re-run whenever a page in PAGES is added or its hero changes.
   =========================================================================== */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { create } from "fontkitten";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "client");
const OUT_DIR = join(ROOT, "public", "images", "og", "pages");
const MANIFEST = join(ROOT, "src", "data", "og-manifest.json");
const FONTS = join(ROOT, "scripts", "og-fonts");

const W = 1200;
const H = 630;
const RED = "#E4151F";
const INK = "#0B0B0C";
const HOST = "divyanshsood.com";

/* ---- Which pages get a card ------------------------------------------------
   Every /services/* page and every /web-developer-* page found in the build is
   picked up automatically (so a new niche or town page is covered by a
   re-run); the studio pages are listed by hand. */
const STUDIO_PAGES = [
  "/hi/",
  "/about/",
  "/agencies/",
  "/results/",
  "/testimonials/",
  "/portfolio/",
  "/press/",
  "/tools/",
  "/tools/llms-txt-generator/",
  "/website-audit/",
  "/privacy/",
];

/* Heroes that can't be used as they are. */
const OVERRIDES = {
  // The fonts carry no Devanagari, and satori can't shape it anyway.
  "/hi/": { kicker: "In Hindi · Kangra · Himachal Pradesh", title: "Web developer in Kangra" },
  // The portfolio hero has no kicker line.
  "/portfolio/": { kicker: "Portfolio · Case studies · Live sites" },
};

function section(path) {
  if (path.startsWith("/services/")) return "Services";
  if (path.startsWith("/web-developer-")) return "Locations";
  if (path.startsWith("/tools/")) return "Tools";
  if (path === "/hi/") return "Hindi";
  return "Studio";
}

/* ---- Read the hero copy from the built page -------------------------------- */
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

function heroCopy(path) {
  const file = join(DIST, path, "index.html");
  if (!existsSync(file)) throw new Error(`${path}: no ${file} — run \`npm run build\` first`);
  const html = readFileSync(file, "utf8");
  const name = html.match(/<(h1|div)[^>]*class="ph-name[^"]*"[^>]*>([\s\S]*?)<\/\1>/);
  if (!name) throw new Error(`${path}: no .ph-name hero title found`);
  // Drop the superscript (the portfolio's "17") and its screen-reader space.
  const title = text(name[2].replace(/<span class="sup"[^>]*>(?:<span[^>]*>[^<]*<\/span>)?[^<]*<\/span>/g, ""));
  const k = html.match(/class="ph-kicker"[^>]*>([\s\S]*?)<\/div>/);
  // Years date a card that may be shared for a long time; the rest stays.
  const kicker = k
    ? text(k[1])
        .split(" · ")
        .filter((seg) => !/^(Updated\s+)?\d{4}([-–—\s]+\d{2,4})?$/.test(seg.trim()))
        .join(" · ")
    : "";
  return { title: title.replace(/\.\s*$/, ""), kicker };
}

function discover() {
  const out = [];
  for (const d of readdirSync(join(DIST, "services"), { withFileTypes: true })) {
    if (d.isDirectory() && existsSync(join(DIST, "services", d.name, "index.html"))) out.push(`/services/${d.name}/`);
  }
  for (const d of readdirSync(DIST, { withFileTypes: true })) {
    if (d.isDirectory() && d.name.startsWith("web-developer-") && existsSync(join(DIST, d.name, "index.html")))
      out.push(`/${d.name}/`);
  }
  return ["/services/", ...out.sort(), ...STUDIO_PAGES];
}

/* ---- Fonts and measuring ---------------------------------------------------- */
const DISPLAY_TTF = readFileSync(join(FONTS, "Archivo-BlackItalic-Expanded.ttf"));
const MONO_TTF = readFileSync(join(FONTS, "GeistMono-Regular.ttf"));
const display = create(DISPLAY_TTF);
const TRACK = -0.02; // em, as on the blog covers
const LEAD = 0.9;

/** Width in px of `s` set in the display face at `size`, with tracking and
    a little room for the italic overhang. Kerning is ignored (it only ever
    tightens), so this errs wide. */
function measure(s, size) {
  let adv = 0;
  for (const g of display.glyphsForString(s)) adv += g.advanceWidth;
  return (adv / display.unitsPerEm) * size + TRACK * size * Math.max(0, [...s].length - 1) + 0.08 * size;
}

/** Greedy word wrap at `size` into lines no wider than `max`. */
function wrap(words, size, max) {
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure(next, size) > max) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** The largest size (and its lines) at which the title fits the box. */
function fit(title, boxW, boxH) {
  const words = title.toUpperCase().split(/\s+/);
  for (let size = 112; size >= 30; size -= 2) {
    const lines = wrap(words, size, boxW);
    if (lines.length * size * LEAD <= boxH && lines.every((l) => measure(l, size) <= boxW)) return { size, lines };
  }
  throw new Error(`"${title}" doesn't fit the card even at 30px`);
}

/* ---- The card ---------------------------------------------------------------- */
const RED_H = 430; // chevron block height; its sides meet the cut at 72%
const PAD = 64;
const TITLE_TOP = 104;
const TITLE_H = Math.round(RED_H * 0.72) - TITLE_TOP - 14; // clears the cut

const chevron =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${RED_H}"><polygon fill="${RED}" points="0,0 ${W},0 ${W},${RED_H * 0.72} ${W / 2},${RED_H} 0,${RED_H * 0.72}"/></svg>`
  ).toString("base64");

const h = (type, style, children) => ({ type, props: { style, children } });
const mono = { fontFamily: "Geist Mono", fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase" };

function card({ path, title, kicker }) {
  const { size, lines } = fit(title, W - PAD * 2, TITLE_H);
  return h("div", { width: W, height: H, display: "flex", position: "relative", backgroundColor: INK }, [
    { type: "img", props: { src: chevron, width: W, height: RED_H, style: { position: "absolute", left: 0, top: 0 } } },
    // Kicker + section label
    h("div", { position: "absolute", left: PAD, right: PAD, top: 46, display: "flex", justifyContent: "space-between", color: "#fff", ...mono }, [
      h("div", { display: "flex", maxWidth: 860 }, kicker),
      h("div", { display: "flex" }, section(path)),
    ]),
    // Title, one div per line so the wrap is exactly the one measured above
    h(
      "div",
      { position: "absolute", left: PAD, right: PAD, top: TITLE_TOP, height: TITLE_H, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
      lines.map((l) =>
        h("div", { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontStyle: "italic", fontSize: size, lineHeight: LEAD, letterSpacing: `${TRACK}em`, color: "#fff", whiteSpace: "nowrap" }, l)
      )
    ),
    // DS® + URL on ink, over a hairline
    h(
      "div",
      { position: "absolute", left: PAD, right: PAD, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 18, borderTop: "2px solid #2A2A2D" },
      [
        h("div", { display: "flex", alignItems: "flex-start", fontFamily: "Archivo", fontWeight: 900, fontStyle: "italic", fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em", color: "#fff" }, [
          "DS",
          h("div", { display: "flex", fontSize: 18, color: RED, marginLeft: 4, marginTop: 2 }, "®"),
        ]),
        h("div", { display: "flex", ...mono, color: "#fff", paddingBottom: 4 }, [
          HOST.toUpperCase(),
          h("div", { display: "flex", color: RED }, path === "/" ? "" : path.toUpperCase()),
        ]),
      ]
    ),
  ]);
}

const FONT_LIST = [
  { name: "Archivo", data: DISPLAY_TTF, weight: 900, style: "italic" },
  { name: "Geist Mono", data: MONO_TTF, weight: 400, style: "normal" },
];

const keyOf = (path) => (path.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home");

/* ---- Run ------------------------------------------------------------------------ */
if (!existsSync(DIST)) {
  console.error("!! dist/client not found — run `npm run build` first (the cards read each page's hero from it).");
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const manifest = {};
const written = new Set();
for (const path of discover()) {
  const copy = { ...heroCopy(path), ...OVERRIDES[path] };
  // "Services · Web apps · MVPs" under a "Services" label says it twice.
  const segs = copy.kicker.split(" · ");
  if (segs.length > 1 && segs[0].toLowerCase() === section(path).toLowerCase()) copy.kicker = segs.slice(1).join(" · ");
  const key = keyOf(path);
  const svg = await satori(card({ path, ...copy }), { width: W, height: H, fonts: FONT_LIST });
  // Rasterise at 2× and scale down, for clean edges on the italic display type.
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W * 2 } }).render().asPng();
  const file = `${key}.jpg`;
  await sharp(png).resize(W, H).jpeg({ quality: 88, mozjpeg: true }).toFile(join(OUT_DIR, file));
  written.add(file);
  manifest[path] = {
    image: `/images/og/pages/${file}`,
    alt: `Share card for Divyansh Sood® Studio: “${copy.title}”${copy.kicker ? ` — ${copy.kicker}` : ""}`,
  };
  console.log(`   ✓ ${file.padEnd(48)} ${copy.title}`);
}

// Cards for pages that no longer exist would ship forever; remove them.
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith(".jpg") && !written.has(f)) {
    unlinkSync(join(OUT_DIR, f));
    console.log(`   – removed stale ${f}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`gen-og-pages: ${written.size} cards in public/images/og/pages, manifest at src/data/og-manifest.json`);
