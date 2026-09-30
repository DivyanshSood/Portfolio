#!/usr/bin/env node
/* ===========================================================================
   Blog cover generator — /public/blog/<slug>.jpg at 1200×750.

   Brandbook title card: the red chevron block (same 72% cut as every hero)
   with a Geist Mono eyebrow and the headline in Archivo 900 italic, 125%
   width, uppercase, white — white is the only text colour on red. Below the
   chevron, on paper: DIVYANSHSOOD.COM and a red JOURNAL over a 3px ink rule.

   Only title-card posts are rendered (coverAlt starting "Title card"); posts
   whose cover is a photograph are never touched.

   Copy lives in COVER_COPY below, keyed by post slug. A post with no entry
   falls back to its manifest title, which always renders but is rarely the
   punchiest line — write an entry.

   Existing files are never overwritten (the hand-made 30 would change); pass
   --force to rebuild anyway, or --only=<slug>,<slug> to scope a run.

     node scripts/gen-blog-covers.mjs
     node scripts/gen-blog-covers.mjs --only=rag-for-business-websites --force

   Local-only, like scripts/portfolio-pdf.mjs: it needs a real Chrome to
   rasterise text, so covers are committed rather than built on CI.
   =========================================================================== */

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import sharp from "sharp";
import { POSTS } from "../src/lib/blog-posts.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/blog");
const FONT_DIR = resolve(ROOT, "public/fonts");

const W = 1200;
const H = 750;
const QUALITY = 82;

/* Headline copy, per slug. `lines` are rendered uppercase, one per line, and
   auto-fitted to the box. (`accent` is left over from the previous template;
   the brandbook allows only white on red, so it is ignored.) */
const COVER_COPY = {
  "website-cost-himachal-pradesh": {
    eyebrow: "PRICING \u00b7 HIMACHAL",
    lines: ["THE PRICE,", "IN", "RUPEES."],
    accent: [2],
  },
  "rank-on-google-maps-himachal": {
    eyebrow: "LOCAL SEO \u00b7 GOOGLE MAPS",
    lines: ["GET", "ON THE", "MAP."],
    accent: [2],
  },
  "cbse-mandatory-public-disclosure-school-website": {
    eyebrow: "SCHOOLS \u00b7 CBSE",
    lines: ["PUBLISH", "THE", "RECORD."],
    accent: [2],
  },
  "taxi-tour-operator-website-pages": {
    eyebrow: "TRAVEL \u00b7 LOCAL SEO",
    lines: ["ONE ROUTE.", "ONE", "PAGE."],
    accent: [2],
  },
  "hotel-near-me-landing-pages": {
    eyebrow: "HOTELS \u00b7 LOCAL SEO",
    lines: ["STAY", "NEAR", "WHAT MATTERS."],
    accent: [2],
  },
  "aeo-geo-llmo-ai-seo-explained": {
    eyebrow: "GEO · VOCABULARY",
    lines: ["AEO. GEO.", "LLMO.", "AI SEO."],
    accent: [2],
  },
  "entity-graph-schema-node-by-node": {
    eyebrow: "STRUCTURED DATA · AEO",
    lines: ["THE ENTITY", "GRAPH, NODE", "BY NODE."],
    accent: [2],
  },
  "measure-ai-assistant-citations": {
    eyebrow: "AI SEARCH · MEASUREMENT",
    lines: ["IS AI", "ACTUALLY", "QUOTING YOU?"],
    accent: [2],
  },
  "how-ai-is-transforming-website-development": {
    eyebrow: "AI · WEB DEVELOPMENT",
    lines: ["HOW AI IS", "TRANSFORMING", "WEB DEV."],
    accent: [2],
  },
  "challenges-and-limitations-of-ai-in-web-development": {
    eyebrow: "AI · LIMITS",
    lines: ["WHERE AI", "ACTUALLY", "BREAKS."],
    accent: [2],
  },
  "ai-features-that-actually-work-on-websites": {
    eyebrow: "AI · PRODUCT",
    lines: ["AI FEATURES", "THAT ACTUALLY", "WORK."],
    accent: [2],
  },
  "rag-for-business-websites": {
    eyebrow: "AI · RAG",
    lines: ["WHEN A BOT", "SHOULD READ", "YOUR DOCS."],
    accent: [2],
  },
  "ai-chatbot-for-indian-business": {
    eyebrow: "AI · CHATBOTS",
    lines: ["YOU ALREADY", "HAVE", "WHATSAPP."],
    accent: [2],
  },
  "ai-website-builder-vs-developer-india": {
    eyebrow: "AI · INDIA",
    lines: ["AI BUILDER", "VS", "DEVELOPER."],
    accent: [2],
  },
};

const argv = process.argv.slice(2);
const FORCE = argv.includes("--force");
const only = argv.find((a) => a.startsWith("--only="));
const ONLY = only ? only.slice(7).split(",").filter(Boolean) : null;

const chrome = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => existsSync(p));
if (!chrome) {
  console.error("!! No Chrome/Chromium found — covers are committed, so this is local-only.");
  process.exit(1);
}

const fontFace = (family, file, weight, style = "normal", stretch = "") =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ""}font-display:block;src:url('file://${join(FONT_DIR, file)}') format('woff2');}`;

function html({ eyebrow, lines, year }) {
  const body = lines.map((l) => `<span class="l">${esc(l)}</span>`).join("");
  return `<!doctype html><meta charset="utf-8"><style>
${fontFace("Archivo", "archivo-italic.woff2", "100 900", "italic", "62% 125%")}
${fontFace("Geist Mono", "geist-mono.woff2", "400 700")}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;background:#fff;}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#fff;}
.red{position:absolute;left:0;top:0;width:${W}px;height:620px;background:#E4151F;
     clip-path:polygon(0 0,100% 0,100% 72%,50% 100%,0 72%);}
/* Content stays above the chevron's 72% edge so nothing falls into the cut. */
.pad{position:absolute;left:64px;right:64px;top:48px;height:392px;display:flex;flex-direction:column;}
.mono{font-family:'Geist Mono',monospace;font-size:18px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;}
.top{display:flex;justify-content:space-between;color:#fff;}
.mid{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding-top:24px;}
#h{font-family:'Archivo',sans-serif;font-weight:900;font-style:italic;font-stretch:125%;text-transform:uppercase;
   line-height:.88;letter-spacing:-0.02em;color:#fff;display:flex;flex-direction:column;}
.bot{position:absolute;left:64px;right:64px;bottom:40px;display:flex;justify-content:space-between;
     padding-top:14px;border-top:3px solid #0B0B0C;color:#0B0B0C;}
.bot .j{color:#E4151F;}
</style>
<div class="c"><div class="red"></div><div class="pad">
  <div class="top mono"><span>${esc(eyebrow)}</span><span>${year}</span></div>
  <div class="mid"><div id="h">${body}</div></div>
</div>
<div class="bot mono"><span>DIVYANSHSOOD.COM</span><span class="j">(07) JOURNAL</span></div></div>
<script>
/* Auto-fit: the headline is sized down until the longest line and the whole
   block both clear their box. */
(function(){
  var h=document.getElementById('h'), mid=h.parentElement;
  for(var s=110;s>=30;s-=1){
    h.style.fontSize=s+'px';
    var wide=[].some.call(h.children,function(el){return el.scrollWidth>mid.clientWidth;});
    if(!wide && h.scrollHeight<=mid.clientHeight-24) break;
  }
  document.documentElement.setAttribute('data-fitted','1');
})();
</script>`;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const tmp = mkdtempSync(join(tmpdir(), "ds-covers-"));
let made = 0;
let skipped = 0;

for (const post of POSTS) {
  const slug = post.slug;
  if (ONLY && !ONLY.includes(slug)) continue;
  const out = resolve(OUT_DIR, `${slug}.jpg`);
  // Photo covers are the author's own images — never overwrite them.
  if (post.coverAlt && !/^Title card/.test(post.coverAlt)) continue;
  if (existsSync(out) && !FORCE) {
    skipped++;
    continue;
  }

  const copy = COVER_COPY[slug];
  const spec = copy ?? {
    eyebrow: (post.tags?.[0] ?? "Journal").toUpperCase(),
    // Fallback: break the manifest title into ~14-character lines.
    lines: wrap(post.title.toUpperCase(), 14),
    accent: [],
  };
  if (!copy) console.warn(`   (no COVER_COPY entry for ${slug} — using the title)`);

  const page = join(tmp, `${slug}.html`);
  const png = join(tmp, `${slug}.png`);
  writeFileSync(page, html({ ...spec, year: String(post.pubDate).slice(0, 4) }));

  const r = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--window-size=${W},${H}`,
      "--virtual-time-budget=4000",
      `--screenshot=${png}`,
      "file://" + page,
    ],
    { stdio: "pipe" }
  );
  if (!existsSync(png)) {
    console.error(`!! ${slug}: Chrome produced no screenshot`);
    console.error(String(r.stderr).split("\n").slice(-4).join("\n"));
    continue;
  }

  await sharp(png).resize(W, H).jpeg({ quality: QUALITY, mozjpeg: true }).toFile(out);
  made++;
  console.log(`   ✓ ${slug}.jpg`);
}

rmSync(tmp, { recursive: true, force: true });
console.log(`gen-blog-covers: ${made} written, ${skipped} left alone (use --force to rebuild)`);

function wrap(text, max) {
  const out = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && (line + " " + word).length > max) {
      out.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  if (line) out.push(line);
  return out;
}
