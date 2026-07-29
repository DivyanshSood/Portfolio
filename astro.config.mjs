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
  adapter: vercel(),
  // Legacy-URL redirects all live in vercel.json, not here. Under
  // trailingSlash:"always" the adapter's canonicalising 308 is emitted *above*
  // Astro's own redirect routes, so "/start" 308'd to "/start/" and then missed
  // the "^/start$" rule — a dead route plus an empty /start/index.html. The
  // platform-level rules in vercel.json match both forms in a single 301.
  integrations: [
    sitemap({
      // The print-only PDF source is noindexed — keep it out of the sitemap too.
      filter: (page) => !page.includes("/portfolio-pdf"),
      // Freshness + crawl-priority hints honoured by Bing, Yandex & others.
      // The sitemap package types changefreq as its EnumChangefreq, so plain
      // string literals need a JSDoc cast to keep `astro check` green.
      serialize(item) {
        const weekly = /** @type {import("sitemap").EnumChangefreq} */ ("weekly");
        const monthly = /** @type {import("sitemap").EnumChangefreq} */ ("monthly");
        const path = new URL(item.url).pathname;
        const lastmod = lastmods.get(path);
        if (lastmod) item.lastmod = lastmod;
        if (path === "/") {
          item.changefreq = weekly;
          item.priority = 1.0;
        } else if (path === "/blog/" || path === "/blog") {
          item.changefreq = weekly;
          item.priority = 0.8;
        } else if (path.startsWith("/blog/topics/")) {
          // Topic hubs sit above individual posts: they're the rankable centre
          // of a cluster and gain a link every time a post joins it, so they
          // change more often than any single post does. Must be tested BEFORE
          // the generic "/blog/" branch below, which would otherwise swallow it.
          item.changefreq = weekly;
          item.priority = 0.8;
        } else if (path.startsWith("/blog/") || path.startsWith("/projects/")) {
          item.changefreq = monthly;
          item.priority = 0.7;
        } else if (path.startsWith("/services/") || path.startsWith("/web-developer-") || path.startsWith("/tools/")) {
          // Commercial service + location + free-tool pages — crawl-priority
          // just below the blog hub, above the generic marketing pages. The
          // free tools are link magnets, so they earn the higher tier.
          item.changefreq = monthly;
          item.priority = 0.8;
        } else {
          item.changefreq = monthly;
          item.priority = 0.5;
        }
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
