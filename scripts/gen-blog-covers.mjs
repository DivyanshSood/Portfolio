#!/usr/bin/env node
/* ===========================================================================
   Blog cover generator — /public/blog/<slug>.jpg at 1200×750.

   The first 30 covers were made by hand from the same template and are the
   reference this script reproduces: near-black field, an Anton headline in
   warm off-white with one line in the neon accent, a JetBrains Mono eyebrow
   and footer rule. This exists so cover #31 doesn't drift from cover #1.

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
   auto-fitted to the box; `accent` lists the zero-based lines painted neon. */
const COVER_COPY = {
  "how-ai-is-transforming-website-development": {
    eyebrow: "AI · WEB DEVELOPMENT",
    lines: ["HOW AI IS", "TRANSFORMING", "WEB DEV."],
    accent: [2],
  },
  "benefits-of-ai-in-web-development": {
    eyebrow: "AI · BENEFITS",
    lines: ["THE BENEFITS", "THAT ACTUALLY", "SURVIVED."],
    accent: [2],
  },
  "challenges-and-limitations-of-ai-in-web-development": {
    eyebrow: "AI · LIMITS",
    lines: ["WHERE AI", "ACTUALLY", "BREAKS."],
    accent: [2],
  },
  "future-of-ai-assisted-web-development": {
    eyebrow: "AI · FUTURE",
    lines: ["THE FUTURE OF", "AI-ASSISTED", "DEVELOPMENT."],
    accent: [2],
  },
  "how-i-build-websites-with-claude-code": {
    eyebrow: "AI · WORKFLOW",
    lines: ["HOW I BUILD", "CLIENT SITES", "WITH AI."],
    accent: [2],
  },
  "ai-features-that-actually-work-on-websites": {
    eyebrow: "AI · PRODUCT",
    lines: ["AI FEATURES", "THAT ACTUALLY", "WORK."],
    accent: [2],
  },
  "claude-vs-gpt-vs-gemini-for-product-features": {
    eyebrow: "AI · MODELS",
    lines: ["CLAUDE, GPT,", "GEMINI:", "WHAT I SHIPPED."],
    accent: [2],
  },
  "rag-for-business-websites": {
    eyebrow: "AI · RAG",
    lines: ["WHEN A BOT", "SHOULD READ", "YOUR DOCS."],
    accent: [2],
  },
  "learn-ai-assisted-development-2026": {
    eyebrow: "AI · LEARNING",
    lines: ["LEARN AI-", "ASSISTED DEV:", "THE PATH", "I'D TAKE."],
    accent: [2, 3],
  },
  "ai-chatbot-for-indian-business": {
    eyebrow: "AI · CHATBOTS",
    lines: ["YOU ALREADY", "HAVE", "WHATSAPP."],
    accent: [2],
  },
  "how-indian-businesses-use-ai-2026": {
    eyebrow: "AI · INDIA",
    lines: ["HOW INDIA", "ACTUALLY", "USES AI."],
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

const fontFace = (family, file, weight) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url('file://${join(FONT_DIR, file)}') format('woff2');}`;

function html({ eyebrow, lines, accent, year }) {
  const body = lines
    .map((l, i) => `<span class="l${accent.includes(i) ? " a" : ""}">${esc(l)}</span>`)
    .join("");
  return `<!doctype html><meta charset="utf-8"><style>
${fontFace("Anton", "anton-400.woff2", 400)}
${fontFace("JetBrains Mono", "jetbrains-mono.woff2", "400 500")}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;background:#0D0D0F;}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden;
   background:radial-gradient(70% 62% at 88% 2%,rgba(217,255,60,.055),transparent 58%),#0D0D0F;}
/* The faint circular edge in the top-right of every hand-made cover. */
.arc{position:absolute;top:-300px;right:-190px;width:900px;height:900px;border-radius:50%;
     background:radial-gradient(circle at 50% 50%,rgba(217,255,60,.035),rgba(217,255,60,.018) 64%,transparent 71%);}
.pad{position:absolute;inset:44px 68px;display:flex;flex-direction:column;}
.mono{font-family:'JetBrains Mono',monospace;font-size:19px;font-weight:400;
      letter-spacing:.17em;text-transform:uppercase;color:#75757C;}
.top,.bot{display:flex;justify-content:space-between;align-items:baseline;}
.top{padding-bottom:16px;border-bottom:1px solid rgba(244,242,236,.16);}
.bot{padding-top:18px;border-top:1px solid rgba(244,242,236,.16);}
.bot .j{color:#D9FF3C;}
/* Uneven padding, not a true centre: it sits the headline slightly high in
   the frame, the way the hand-made covers do. */
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 0 54px;}
#h{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;
   line-height:.96;letter-spacing:.005em;color:#F0EEE8;display:flex;flex-direction:column;}
#h .a{color:#D9FF3C;}
</style>
<div class="c"><div class="arc"></div><div class="pad">
  <div class="top mono"><span>${esc(eyebrow)}</span><span>${year}</span></div>
  <div class="mid"><div id="h">${body}</div></div>
  <div class="bot mono"><span>DIVYANSHSOOD.COM</span><span class="j">JOURNAL</span></div>
</div></div>
<script>
/* Auto-fit: the template is a fixed 1200×750 frame, so the headline is sized
   down until the longest line and the whole block both clear their box. */
(function(){
  var h=document.getElementById('h'), mid=h.parentElement;
  for(var s=104;s>=30;s-=1){
    h.style.fontSize=s+'px';
    var wide=[].some.call(h.children,function(el){return el.scrollWidth>mid.clientWidth;});
    if(!wide && h.scrollHeight<=mid.clientHeight) break;
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
