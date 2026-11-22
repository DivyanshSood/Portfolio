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

   THE RULE: a date is the day of the last commit that materially changed the
   page's visible copy. The same rule applies to `updatedDate` in
   blog-posts.mjs and `updated` in projects/data.mjs.

   Counts:   a sentence added, removed or rewritten in the page's own copy
             (body, hero lead, FAQ, a post's sign-off), or a fact, number,
             price, timeline or claim changed; adding or removing a
             case-study card on a page that lists them.
   Doesn't:  shared template and components (header, footer, nav, CTA
             buttons, page chrome), markup, styling and accessibility
             attributes, tracking, links (targets, anchor text, an added
             link or related-reading card), SEO-only fields the visitor
             doesn't see (title tag, meta description, keywords, JSON-LD,
             image alt), and typo, punctuation or "we"→"I" fixes.

   Dates are IST (Asia/Kolkata), the site's time zone; one commit (b423a8f)
   was stamped in UTC, 23:08 on 1 Nov, which is 2 Nov in IST.

   All dates in the three files were re-derived this way on 16 Nov 2026 from
   the commit diffs (`git log -p --follow` on each page's sources), after an
   audit found 55 of 86 sitemap URLs sharing 6–7 Nov: some dates had been
   bumped by commits that didn't change that page's copy.

   HOW TO MAINTAIN: when a change meets the rule above, set the page's date
   here (or in blog-posts.mjs / data.mjs) to the day it ships. Otherwise
   leave it alone. Adding a page without an entry is caught by
   `npm run verify:seo`, which fails on any sitemap URL missing lastmod.
   =========================================================================== */

/** @type {Record<string, string>} URL path (trailing slash) → ISO date */
export const PAGE_UPDATED = {
  "/": "2026-11-16",
  "/about/": "2026-11-13",
  "/agencies/": "2026-11-16",
  "/portfolio/": "2026-11-16",
  "/press/": "2026-11-06",
  "/privacy/": "2026-11-16",
  "/results/": "2026-11-16",
  "/testimonials/": "2026-11-16",
  "/website-audit/": "2026-09-30",

  // Free tools.
  "/tools/": "2026-11-22",
  "/tools/llms-txt-generator/": "2026-11-13",
  "/tools/website-cost-calculator/": "2026-11-22",
  "/tools/google-review-qr-code-generator/": "2026-11-22",
  "/tools/whatsapp-link-generator/": "2026-11-22",
  "/tools/serp-snippet-preview/": "2026-11-22",
  "/tools/local-business-schema-generator/": "2026-11-22",

  // Service pages.
  "/services/": "2026-11-22",
  "/services/ai-development/": "2026-11-16",
  "/services/ecommerce-website-development/": "2026-11-16",
  "/services/landing-page-design/": "2026-11-16",
  "/services/seo-geo-services/": "2026-11-22",
  "/services/web-app-development/": "2026-11-16",
  "/services/website-development/": "2026-11-16",

  // Industry pages — content in src/lib/verticals.mjs.
  "/services/school-website-development/": "2026-11-16",
  "/services/hotel-website-development/": "2026-11-22",
  "/services/travel-website-development/": "2026-11-22",
  "/services/cbse-school-website-development/": "2026-11-16",
  "/services/homestay-website-development/": "2026-11-22",
  "/services/taxi-website-development/": "2026-11-22",

  // Location pages — the hub and four towns are hand-written; the rest are
  // generated from src/lib/locations.mjs (added 2026-11-07), so an edit to one
  // town's entry there moves only that town's date.
  "/web-developer-himachal-pradesh/": "2026-11-16",
  "/web-developer-dharamshala/": "2026-11-16",
  "/web-developer-kangra/": "2026-11-07",
  "/web-developer-manali/": "2026-11-16",
  "/web-developer-shimla/": "2026-11-16",
  "/web-developer-palampur/": "2026-11-16",
  "/web-developer-mandi/": "2026-11-07",
  "/web-developer-hamirpur/": "2026-11-07",
  "/web-developer-solan/": "2026-11-07",
  "/web-developer-una/": "2026-11-07",
  "/web-developer-kullu/": "2026-11-16",
  "/web-developer-bilaspur/": "2026-11-07",
  "/web-developer-chamba/": "2026-11-13",
  "/web-developer-nahan/": "2026-11-07",
  "/web-developer-baddi/": "2026-11-07",
  "/web-developer-pathankot/": "2026-11-07",
  "/web-developer-chandigarh/": "2026-11-13",
  "/web-developer-ludhiana/": "2026-11-07",
  "/web-developer-jalandhar/": "2026-11-07",
  "/web-developer-amritsar/": "2026-11-07",

  // Hindi page (hreflang pair with "/").
  "/hi/": "2026-11-16",
};
