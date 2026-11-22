/* ===========================================================================
   TOOLS — the single list of free tools under /tools/<slug>/.

   Read by the /tools/ hub (cards + ItemList), the "Related free tools" block
   on every tool page (src/components/brand/RelatedTools.astro), the sitemap
   lastmod map (page-updated.mjs) and the OG card generator. Adding a tool =
   a page in src/pages/tools/ + an entry here + a line in both llms*.txt.

   `updated` follows the same rule as page-updated.mjs: the day the tool's
   visible copy last changed materially, as a literal.
   `related` lists 3 sibling slugs — it's also what keeps every tool page
   above verify-seo's two-inbound-links floor.
   =========================================================================== */

export const TOOL_GROUPS = [
  { id: "plan", title: "Planning a website", note: "Budget, compare, launch" },
  { id: "local", title: "Hotels, homestays, taxi & travel", note: "Bookings, payments, reviews" },
  { id: "seo", title: "Google, local SEO & AI search", note: "Snippets, schema, GEO" },
  { id: "dev", title: "Developers & site owners", note: "Tags, files, images, audits" },
];

export const TOOLS = [
  // ---- Planning a website ----
  { slug: "website-cost-calculator", group: "plan", name: "Website cost calculator", tag: "Pricing · India", short: "Published starting prices, typical timelines and what adds scope, then a brief for a fixed quote.", related: ["website-running-cost-calculator", "web-developer-quote-comparison", "website-launch-checklist"], updated: "2026-11-22" },
  { slug: "web-developer-quote-comparison", group: "plan", name: "Web developer quote comparison", tag: "Buying · Checklist", short: "Put up to three quotes side by side on ownership, support, timelines and the costs that come later.", related: ["website-cost-calculator", "website-running-cost-calculator", "website-launch-checklist"], updated: "2026-11-22" },
  { slug: "website-running-cost-calculator", group: "plan", name: "Website running-cost calculator", tag: "Budget · Yearly", short: "Domain, hosting, email and add-ons over one and three years, against a monthly builder plan.", related: ["website-cost-calculator", "web-developer-quote-comparison", "website-launch-checklist"], updated: "2026-11-22" },
  { slug: "website-launch-checklist", group: "plan", name: "Website launch checklist", tag: "Launch · Checklist", short: "An interactive pre-launch checklist that remembers your progress in this browser and prints cleanly.", related: ["meta-tag-generator", "xml-sitemap-generator", "redirect-generator"], updated: "2026-11-22" },

  // ---- Hotels, homestays, taxi & travel ----
  { slug: "google-review-qr-code-generator", group: "local", name: "Google review QR card", tag: "Reviews · Print", short: "Your review link or Place ID as a QR code and a printable A6 card for the desk, rooms or taxi.", related: ["whatsapp-link-generator", "upi-qr-code-generator", "vcard-qr-code-generator"], updated: "2026-11-22" },
  { slug: "whatsapp-link-generator", group: "local", name: "WhatsApp link generator", tag: "WhatsApp · QR", short: "A wa.me link with a pre-filled booking message, a QR code and a button for your website.", related: ["google-review-qr-code-generator", "google-maps-directions-link-generator", "tour-itinerary-maker"], updated: "2026-11-22" },
  { slug: "upi-qr-code-generator", group: "local", name: "UPI QR code generator", tag: "Payments · Print", short: "A UPI payment QR for any UPI ID, with an optional fixed amount, and a printable counter card.", related: ["google-review-qr-code-generator", "vcard-qr-code-generator", "whatsapp-link-generator"], updated: "2026-11-22" },
  { slug: "vcard-qr-code-generator", group: "local", name: "Contact card (vCard) QR", tag: "Contacts · QR", short: "A QR code that saves your name, phone, WhatsApp, email and address to a guest’s contacts.", related: ["whatsapp-link-generator", "upi-qr-code-generator", "google-review-qr-code-generator"], updated: "2026-11-22" },
  { slug: "taxi-fare-chart-maker", group: "local", name: "Taxi fare chart maker", tag: "Taxi · Fares", short: "Per-km rates, minimum km, driver allowance and tolls into a clean fare chart for your site or WhatsApp.", related: ["tour-itinerary-maker", "whatsapp-link-generator", "google-maps-directions-link-generator"], updated: "2026-11-22" },
  { slug: "tour-itinerary-maker", group: "local", name: "Tour itinerary maker", tag: "Travel · PDF", short: "A day-by-day trip plan with stays, vehicle and inclusions, as a printable PDF and WhatsApp text.", related: ["taxi-fare-chart-maker", "whatsapp-link-generator", "google-maps-directions-link-generator"], updated: "2026-11-22" },
  { slug: "google-maps-directions-link-generator", group: "local", name: "Google Maps directions link", tag: "Maps · Links", short: "A “Get directions” link and button for your place, ready for booking confirmations.", related: ["whatsapp-link-generator", "vcard-qr-code-generator", "local-business-schema-generator"], updated: "2026-11-22" },

  // ---- Google, local SEO & AI search ----
  { slug: "serp-snippet-preview", group: "seo", name: "SERP snippet preview", tag: "SEO · Snippets", short: "Your title and meta description on desktop and mobile, measured in pixels, with fixes.", related: ["meta-tag-generator", "faq-schema-generator", "utm-link-builder"], updated: "2026-11-22" },
  { slug: "local-business-schema-generator", group: "seo", name: "Local business schema generator", tag: "Schema · JSON-LD", short: "JSON-LD for a hotel, homestay, travel agency, school or any local business.", related: ["faq-schema-generator", "llms-txt-generator", "google-business-profile-description-checker"], updated: "2026-11-22" },
  { slug: "faq-schema-generator", group: "seo", name: "FAQ schema generator", tag: "Schema · FAQ", short: "Question-and-answer pairs into valid FAQPage JSON-LD, with an honest note on what Google shows.", related: ["local-business-schema-generator", "serp-snippet-preview", "meta-tag-generator"], updated: "2026-11-22" },
  { slug: "google-business-profile-description-checker", group: "seo", name: "Business Profile description checker", tag: "Local SEO · GBP", short: "Write your Google Business Profile description within 750 characters, with checks for what gets rejected.", related: ["google-review-qr-code-generator", "local-business-schema-generator", "ai-visibility-prompt-pack"], updated: "2026-11-22" },
  { slug: "ai-visibility-prompt-pack", group: "seo", name: "AI visibility prompt pack", tag: "GEO · AI search", short: "Ten prompts to test whether ChatGPT, Claude, Gemini and Perplexity recommend your business, with a score sheet.", related: ["llms-txt-generator", "ai-crawler-robots-txt-generator", "local-business-schema-generator"], updated: "2026-11-22" },
  { slug: "llms-txt-generator", group: "seo", name: "llms.txt generator", tag: "GEO · AI search", short: "A spec-correct llms.txt from five fields, with a straight answer on what the file does and doesn’t do.", related: ["ai-crawler-robots-txt-generator", "ai-visibility-prompt-pack", "local-business-schema-generator"], updated: "2026-11-13" },
  { slug: "ai-crawler-robots-txt-generator", group: "seo", name: "AI crawler robots.txt generator", tag: "GEO · robots.txt", short: "Choose which AI crawlers may read your site, search and training bots separately, and get the robots.txt.", related: ["robots-txt-tester", "llms-txt-generator", "ai-visibility-prompt-pack"], updated: "2026-11-22" },
  { slug: "utm-link-builder", group: "seo", name: "UTM link builder", tag: "Analytics · GA4", short: "Campaign links with UTM tags for posters, WhatsApp, Instagram and ads, so GA4 shows what worked.", related: ["whatsapp-link-generator", "meta-tag-generator", "serp-snippet-preview"], updated: "2026-11-22" },

  // ---- Developers & site owners ----
  { slug: "meta-tag-generator", group: "dev", name: "Meta & Open Graph tag generator", tag: "HTML · Social", short: "Title, description, canonical, Open Graph and Twitter tags in one block, with a share-card preview.", related: ["serp-snippet-preview", "og-image-maker", "hreflang-tag-generator"], updated: "2026-11-22" },
  { slug: "og-image-maker", group: "dev", name: "Social share image maker", tag: "Images · 1200×630", short: "A 1200×630 share image from a title, a line and your colours, made in the browser.", related: ["meta-tag-generator", "favicon-generator", "image-compressor"], updated: "2026-11-22" },
  { slug: "favicon-generator", group: "dev", name: "Favicon generator", tag: "Icons · Manifest", short: "Every favicon size, an .ico, the web app manifest and the head tags, from one image or a letter.", related: ["og-image-maker", "image-compressor", "meta-tag-generator"], updated: "2026-11-22" },
  { slug: "image-compressor", group: "dev", name: "Image compressor (WebP/AVIF)", tag: "Images · Speed", short: "Resize and convert photos to WebP or AVIF in your browser, in batches, with before-and-after sizes.", related: ["favicon-generator", "og-image-maker", "lighthouse-report-explainer"], updated: "2026-11-22" },
  { slug: "redirect-generator", group: "dev", name: "Redirect map generator", tag: "Migrations · 301", short: "Old-to-new URL pairs into Vercel, Netlify, Apache or Nginx redirect rules, with chain and loop checks.", related: ["xml-sitemap-generator", "robots-txt-tester", "website-launch-checklist"], updated: "2026-11-22" },
  { slug: "robots-txt-tester", group: "dev", name: "robots.txt tester", tag: "Crawling · Rules", short: "Paste a robots.txt and a URL to see whether a crawler may fetch it, and which rule decided.", related: ["ai-crawler-robots-txt-generator", "xml-sitemap-generator", "redirect-generator"], updated: "2026-11-22" },
  { slug: "xml-sitemap-generator", group: "dev", name: "XML sitemap generator", tag: "Crawling · Sitemap", short: "A valid sitemap.xml from a list of URLs, with optional lastmod dates.", related: ["robots-txt-tester", "redirect-generator", "hreflang-tag-generator"], updated: "2026-11-22" },
  { slug: "hreflang-tag-generator", group: "dev", name: "hreflang tag generator", tag: "Languages · SEO", short: "Reciprocal hreflang tags for a Hindi and English (or any multilingual) site, including x-default.", related: ["meta-tag-generator", "xml-sitemap-generator", "redirect-generator"], updated: "2026-11-22" },
  { slug: "lighthouse-report-explainer", group: "dev", name: "Lighthouse report explainer", tag: "Speed · Audits", short: "Drop a Lighthouse JSON report and get the scores and the biggest fixes in plain English.", related: ["image-compressor", "color-contrast-checker", "website-launch-checklist"], updated: "2026-11-22" },
  { slug: "color-contrast-checker", group: "dev", name: "Colour contrast checker", tag: "Accessibility · WCAG", short: "Check two colours against WCAG AA and AAA, and get the nearest shade that passes.", related: ["lighthouse-report-explainer", "og-image-maker", "favicon-generator"], updated: "2026-11-22" },
];

export const TOOL_BY_SLUG = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));
export const toolPath = (slug) => `/tools/${slug}/`;
