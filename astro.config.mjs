// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { POSTS } from "./src/lib/blog-posts.mjs";

// Real last-modified dates for the sitemap. Bing/Yandex use lastmod for crawl
// scheduling and explicitly distrust sitemaps whose lastmod is always "now" —
// stamping new Date() on every URL each deploy taught them to ignore ours.
// Blog posts get their manifest date; the blog index gets the newest post's
// date; every other page omits lastmod (honest absence beats a fake value).
const postLastmod = new Map(
  POSTS.map((p) => [`/blog/${p.slug}/`, new Date(p.updatedDate || p.pubDate).toISOString()])
);
const newestPost = POSTS.map((p) => p.updatedDate || p.pubDate)
  .sort()
  .at(-1);

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
        const lastmod = postLastmod.get(path) ?? (path === "/blog/" && newestPost ? new Date(newestPost).toISOString() : undefined);
        if (lastmod) item.lastmod = lastmod;
        if (path === "/") {
          item.changefreq = weekly;
          item.priority = 1.0;
        } else if (path === "/blog/" || path === "/blog") {
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
  build: {
    // case-study + blog pages live at /projects/<slug>/ and /blog/<slug>/
    format: "directory",
    // Inline page CSS into <head> so first paint isn't blocked on a separate
    // stylesheet round-trip (the render-blocking cost that hurt mobile FCP/LCP).
    inlineStylesheets: "always",
  },
});
