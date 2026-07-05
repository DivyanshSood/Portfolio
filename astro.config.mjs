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
  trailingSlash: "ignore",
  output: "static",
  adapter: vercel(),
  // /start was merged into /website-audit (its qualifying form now lives there).
  redirects: {
    "/start": "/website-audit/",
  },
  integrations: [
    sitemap({
      // The print-only PDF source is noindexed — keep it out of the sitemap too.
      filter: (page) => !page.includes("/portfolio-pdf"),
      // Freshness + crawl-priority hints honoured by Bing, Yandex & others.
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = postLastmod.get(path) ?? (path === "/blog/" && newestPost ? new Date(newestPost).toISOString() : undefined);
        if (lastmod) item.lastmod = lastmod;
        if (path === "/") {
          item.changefreq = "weekly";
          item.priority = 1.0;
        } else if (path === "/blog/" || path === "/blog") {
          item.changefreq = "weekly";
          item.priority = 0.8;
        } else if (path.startsWith("/blog/") || path.startsWith("/projects/")) {
          item.changefreq = "monthly";
          item.priority = 0.7;
        } else {
          item.changefreq = "monthly";
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
