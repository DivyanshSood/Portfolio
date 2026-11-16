// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { POSTS } from "./src/lib/blog-posts.mjs";
import { projects } from "./src/lib/projects/data.mjs";
import { PAGE_UPDATED } from "./src/lib/page-updated.mjs";

// Real last-modified dates for the sitemap. Bing/Yandex use lastmod for crawl
// scheduling and explicitly distrust sitemaps whose lastmod is always "now" —
// stamping new Date() on every URL each deploy taught them to ignore ours.
//
// Every URL now carries one, from three real sources and no derived value:
//   /blog/<slug>/     the post manifest's updatedDate (or pubDate)
//   /projects/<slug>/ the `updated` field already in projects/data.mjs
//   everything else   the hand-maintained map in page-updated.mjs
// Topic hubs are the newest date among the posts tagged into them, and the
// blog index is the newest post overall — both are true by construction, since
// those pages are literally a rendering of the posts beneath them.
/** @type {Map<string, string>} */
const lastmods = new Map();
/** @param {string} d */
const asIso = (d) => new Date(d).toISOString();
/** @param {(string | undefined)[]} dates */
const newest = (dates) => dates.filter(Boolean).sort().at(-1);

for (const p of POSTS) lastmods.set(`/blog/${p.slug}/`, asIso(p.updatedDate || p.pubDate));
for (const p of projects) if (p.updated) lastmods.set(`/projects/${p.slug}/`, asIso(p.updated));
for (const [path, d] of Object.entries(PAGE_UPDATED)) lastmods.set(path, asIso(d));

const newestPost = newest(POSTS.map((p) => p.updatedDate || p.pubDate));
if (newestPost) lastmods.set("/blog/", asIso(newestPost));

// The AI topic hub renders every post whose tags intersect this list — the same
// predicate the page itself uses (blog/topics/ai-web-development.astro). Keep
// the two in sync: the hub genuinely changes whenever a post it lists does.
const AI_TAGS = ["ai", "ai development", "ai-assisted development", "ai features", "ai search", "llm", "rag", "geo", "claude", "claude code", "chatgpt", "gpt", "gemini", "chatbot", "llms.txt", "automation"];
const newestAi = newest(
  POSTS.filter((p) => (p.tags || []).some((t) => AI_TAGS.includes(t.toLowerCase()))).map(
    (p) => p.updatedDate || p.pubDate
  )
);
if (newestAi) lastmods.set("/blog/topics/ai-web-development/", asIso(newestAi));

// https://astro.build/config
export default defineConfig({
  site: "https://www.divyanshsood.com",
  // "always" — not "ignore". Under "ignore" both /blog/x and /blog/x/ returned
  // 200 with identical HTML, so every indexable page existed at two crawlable
  // URLs and Googlebot had to fetch both and throw one away. One canonical URL
  // form (trailing slash, matching every <link rel=canonical> and the sitemap);
  // the bare form now 308s to it.
  trailingSlash: "always",
  output: "static",
  // The hosts the on-demand routes (/api/*, /thanks/) may trust in the Host
  // header. Without this list Astro (5.15+) ignores Host and builds every
  // request URL as "localhost", so its built-in checkOrigin compared a real
  // form post's Origin (https://www.divyanshsood.com) with https://localhost
  // and answered 403 "Cross-site POST form submissions are forbidden" — which
  // would kill the no-JS fallback of the brief forms (method="post" to
  // /api/contact/). Listing our own hosts lets checkOrigin see the real
  // origin. *.vercel.app covers preview deployments (Vercel only routes a
  // preview's own hostname to it); localhost is for `vercel dev`. The
  // endpoint still applies its own exact-host origin guard (src/lib/api-guard.ts).
  security: {
    allowedDomains: [
      { hostname: "www.divyanshsood.com", protocol: "https" },
      { hostname: "divyanshsood.com", protocol: "https" },
      { hostname: "**.vercel.app", protocol: "https" },
      { hostname: "localhost" },
    ],
  },
  // maxDuration 30: the chat waits up to 20 s for Gemini; at the default limit a
  // slow answer ended the function and the widget got HTML instead of JSON.
  adapter: vercel({ maxDuration: 30 }),
  // Legacy-URL redirects all live in vercel.json, not here. Under
  // trailingSlash:"always" the adapter's canonicalising 308 is emitted *above*
  // Astro's own redirect routes, so "/start" 308'd to "/start/" and then missed
  // the "^/start$" rule — a dead route plus an empty /start/index.html. The
  // platform-level rules in vercel.json match both forms in a single hop
  // (Vercel answers "permanent": true with a 308, which Google and Bing treat
  // exactly like a 301).
  integrations: [
    sitemap({
      // Noindexed pages stay out of the sitemap too: the print-only PDF source,
      // and /thanks/ (the no-JS form landing page; on-demand, so the
      // integration would skip it anyway — the filter makes that explicit).
      filter: (page) => !page.includes("/portfolio-pdf") && !page.includes("/thanks/"),
      // lastmod only. changefreq and priority were dropped (16 Nov 2026 audit):
      // Google's sitemap docs say it ignores both; lastmod is the field that counts.
      serialize(item) {
        const lastmod = lastmods.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  // Static-asset caching is set in vercel.json, not here, and the split is
  // deliberate — vercel.json is JSON and can't hold the reasoning, so it lives
  // with the rest of the build config:
  //
  //   /_astro/*   the adapter already stamps max-age=31536000, immutable
  //               (filenames are content-hashed, so it's always safe).
  //   /fonts/*    same treatment, added by hand. Everything under /public used
  //               to fall through to Vercel's default (max-age=0,
  //               must-revalidate), so the three fonts preloaded in every
  //               <head> cost a conditional request on every repeat visit
  //               before text could paint. Names only change when
  //               self-host-fonts.py writes a new one, so a year is safe.
  //   /images/*   30 days + stale-while-revalidate, NOT immutable. The cover
  //   /blog/*     and work-shot generators rewrite these under the SAME
  //               filename, so an immutable year would strand visitors on a
  //               stale image with nothing to bust it.
  build: {
    // case-study + blog pages live at /projects/<slug>/ and /blog/<slug>/
    format: "directory",
    // Inline page CSS into <head> so first paint isn't blocked on a separate
    // stylesheet round-trip (the render-blocking cost that hurt mobile FCP/LCP).
    inlineStylesheets: "always",
  },
});
