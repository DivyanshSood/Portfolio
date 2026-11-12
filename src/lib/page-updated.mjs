/* ===========================================================================
   PAGE_UPDATED — hand-maintained last-modified dates for the pages that have
   no other date source.

   Blog posts carry `updatedDate` in blog-posts.mjs and case studies carry
   `updated` in projects/data.mjs; both feed the sitemap automatically. The
   commercial and marketing pages had nothing, so 32 of 75 sitemap URLs shipped
   with no <lastmod> at all — including the homepage, every service page and
   every city page. lastmod is the main signal Bing and Google use to schedule
   recrawls, so the pages most likely to change were the ones giving crawlers
   no reason to come back.

   WHY A HAND-MAINTAINED MAP AND NOT git log:
   Vercel shallow-clones the repo, so `git log -1 -- <file>` resolves to the
   deploy commit for every file and would stamp "everything changed today" on
   every deploy. Bing explicitly distrusts sitemaps whose lastmod is always
   now — that fake signal is worse than the honest absence it replaces. The
   dates below were read once from real local git history and are literals
   from then on.

   HOW TO MAINTAIN: when you meaningfully change a page's content, bump its
   date here. Chrome-level edits (a shared component, a header, a typo) are not
   a content change and should not move it. Adding a page without an entry is
   caught by `npm run verify:seo`, which fails on any sitemap URL missing
   lastmod.
   =========================================================================== */

/** @type {Record<string, string>} URL path (trailing slash) → ISO date */
export const PAGE_UPDATED = {
  "/": "2026-11-13",
  "/about/": "2026-11-06",
  "/agencies/": "2026-11-06",
  "/portfolio/": "2026-11-06",
  "/press/": "2026-11-06",
  "/privacy/": "2026-11-06",
  "/results/": "2026-11-06",
  "/testimonials/": "2026-11-06",
  "/website-audit/": "2026-07-28",

  // Free tools — the /tools/ hub was 98 words and got real context this pass;
  // the generator gained an evidence-led FAQ.
  "/tools/": "2026-07-29",
  "/tools/llms-txt-generator/": "2026-07-29",

  // Service pages — all six had their generic "Read →" cross-links rewritten
  // to descriptive anchor text this pass; seo-geo-services also gained an FAQ.
  "/services/": "2026-11-06",
  "/services/ai-development/": "2026-11-06",
  "/services/ecommerce-website-development/": "2026-11-06",
  "/services/landing-page-design/": "2026-11-06",
  "/services/seo-geo-services/": "2026-07-29",
  "/services/web-app-development/": "2026-11-06",
  "/services/website-development/": "2026-11-07",

  // Industry pages — content in src/lib/verticals.mjs.
  "/services/school-website-development/": "2026-11-06",
  "/services/hotel-website-development/": "2026-09-29",
  "/services/travel-website-development/": "2026-11-06",

  // Location pages — the four hand-written ones gained a "company" FAQ, the
  // hub breadcrumb and their own nearby list on 2026-11-07; the rest are
  // generated from src/lib/locations.mjs (added 2026-11-07).
  "/web-developer-himachal-pradesh/": "2026-11-07",
  "/web-developer-dharamshala/": "2026-11-07",
  "/web-developer-kangra/": "2026-11-07",
  "/web-developer-manali/": "2026-11-07",
  "/web-developer-shimla/": "2026-11-07",
  "/web-developer-palampur/": "2026-11-07",
  "/web-developer-mandi/": "2026-11-07",
  "/web-developer-hamirpur/": "2026-11-07",
  "/web-developer-solan/": "2026-11-07",
  "/web-developer-una/": "2026-11-07",
  "/web-developer-kullu/": "2026-11-07",
  "/web-developer-bilaspur/": "2026-11-07",
  "/web-developer-chamba/": "2026-11-07",
  "/web-developer-nahan/": "2026-11-07",
  "/web-developer-baddi/": "2026-11-07",
  "/web-developer-pathankot/": "2026-11-07",
  "/web-developer-chandigarh/": "2026-11-07",
  "/web-developer-ludhiana/": "2026-11-07",
  "/web-developer-jalandhar/": "2026-11-07",
  "/web-developer-amritsar/": "2026-11-07",

  // Hindi page (hreflang pair with "/").
  "/hi/": "2026-11-07",
};
