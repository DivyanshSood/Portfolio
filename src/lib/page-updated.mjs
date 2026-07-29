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
  "/": "2026-07-28",
  "/about/": "2026-07-29",
  "/agencies/": "2026-07-28",
  "/portfolio/": "2026-07-28",
  "/press/": "2026-07-28",
  "/privacy/": "2026-07-28",
  "/results/": "2026-07-28",
  "/testimonials/": "2026-07-28",
  "/website-audit/": "2026-07-28",

  // Free tools — the /tools/ hub was 98 words and got real context this pass;
  // the generator gained an evidence-led FAQ.
  "/tools/": "2026-07-29",
  "/tools/llms-txt-generator/": "2026-07-29",

  // Service pages — all six had their generic "Read →" cross-links rewritten
  // to descriptive anchor text this pass; seo-geo-services also gained an FAQ.
  "/services/": "2026-07-28",
  "/services/ai-development/": "2026-07-29",
  "/services/ecommerce-website-development/": "2026-07-29",
  "/services/landing-page-design/": "2026-07-29",
  "/services/seo-geo-services/": "2026-07-29",
  "/services/web-app-development/": "2026-07-29",
  "/services/website-development/": "2026-07-29",

  // Location pages
  "/web-developer-dharamshala/": "2026-07-28",
  "/web-developer-kangra/": "2026-07-28",
  "/web-developer-manali/": "2026-07-28",
  "/web-developer-shimla/": "2026-07-28",
};
