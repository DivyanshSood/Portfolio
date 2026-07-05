# Site Health Report — Conversion, Indexing & Bugs

**Date:** 3 July 2026 · **Scope:** why visitors don't contact, why DuckDuckGo/Bing don't list the site, missing pieces & bugs.
**Method:** knowledge-graph pass over the whole repo (`graphify-out/`), source review, and live checks against `www.divyanshsood.com` (HTTP headers, `/api/contact`, sitemaps, Bing/DDG index probes, Calendly).
**No code was changed.** Everything below is findings + recommendations.

---

## 1. Why people visit but never contact

### 🔴 P0 — The contact form's backend is NOT configured in production (confirmed live)

This is almost certainly the single biggest lead-killer, and it's not a code bug — it's a missing environment variable.

- A live test POST to `https://www.divyanshsood.com/api/contact` returned `{"ok":false,"reason":"not_configured"}` — **`RESEND_API_KEY` is not set in Vercel**, so no form on the site ever sends an email to you.
- When that happens, `src/scripts/contact-form.js` falls back to `window.location.href = "mailto:..."`. On most machines this fails silently: Windows users without a configured Mail app, and everyone who lives in Gmail/Outlook web, sees **nothing happen** — and the visitor's typed message is gone (the form hides itself after "success").
- This affects **all three forms**: homepage "Start a project", `/website-audit` free-audit form, and the start-a-project form.
- The irony: the blog post *"Why Indian websites don't generate leads"* — section 1 is literally titled **"The contact form goes nowhere useful."**

**Fix (no code needed):** in Vercel → Project → Settings → Environment Variables, set `RESEND_API_KEY` (from resend.com), verify `divyanshsood.com` as a Resend sending domain, and set `CONTACT_FROM` to that verified sender (the default `onboarding@resend.dev` is test-only) and `CONTACT_TO` to your inbox. The endpoint (`src/pages/api/contact.ts`) is already deployed and working — it returned proper 422s on invalid input during testing.

### 🟠 P1 — You can't see the leads you're losing: zero conversion tracking

- There are **no analytics events anywhere** — no `gtag('event', …)`, no Metrica `reachGoal` on form submits, Calendly clicks, WhatsApp clicks, phone taps, or PDF downloads. You cannot currently answer "how many people *tried* to contact me."
- Analytics (GA4 + Yandex Metrica) only load **after** cookie-consent accept. Most visitors ignore banners, so your traffic numbers are also undercounting real visits. That's a GDPR-compliant trade-off, but you should know the funnel data you do have is a fraction of reality.
- There's no thank-you page — success is shown inline — so even simple page-based conversion goals are impossible.

### 🟠 P1 — Funnel/pricing mismatch: the traffic you attract isn't the buyer you priced for

- The content engine is heavily India/Himachal-targeted (the graph clustered a whole "Himachal-Targeted Local Business Content Cluster" and "India SMB website market" series: development cost in India, GBP-vs-website Himachal, choosing a developer in Himachal, Nandini/ModernKBS case studies…).
- But the offer starts at **$3,000 USD** (`PROJECT_MIN_USD` in `src/lib/site.mjs`), positioned for international founders.
- So the visitors your SEO actually brings (Indian SMB owners researching ₹-level budgets) hit a $3K floor and bounce; the US/EU founders the pricing targets aren't the ones the content ranks for. Visits without contacts is the expected output of that mismatch. Either add a visible smaller-scope path for Indian buyers, or build content that foreign founders actually search for (comparisons, "hire offshore developer" angles, niche-specific landing pages).

### 🟡 P2 — Trust gaps that suppress the leap from "impressed" to "messaged"

- **Client logos are all placeholders** — every `src: ""` in `CLIENT_LOGOS` (`src/lib/site.mjs`), so the strip renders text wordmarks only.
- **Founder photo appears to be AI-generated** — the ImageKit filenames are literally `ChatGPT Image Jun 23, 2026….jpg`. Buyers at $3K+ do reverse-image-check founders; a synthetic-looking headshot reads as a red flag for an "independent developer you can trust."
- Testimonials have no faces, links, or verifiable handles; the Google-reviews link exists but shows no count/stars (deliberate, per the schema decision — fine, but it means the page shows *zero* third-party-verifiable proof).
- The promise *"I'll personally review your brief and get back to you within two hours"* sits directly above a form that currently delivers nothing. If anyone tested it and got silence, that promise actively burned trust.

### 🟡 P2 — Smaller conversion UX nits

- On the mailto fallback the form is hidden after submission, so the visitor **can't retry** or copy their message.
- The email-capture surface is thin: no lead magnet besides the audit form, no newsletter, nothing for "not ready to buy" visitors — 23 blog posts with no way to keep the reader.

---

## 2. Why DuckDuckGo (and Bing/Yahoo/Ecosia) don't list the site

### The headline finding

**`site:divyanshsood.com` returns zero results on Bing** (verified via Bing's RSS endpoint, which fell back to generic results — its behavior for an empty site: query). DuckDuckGo, Yahoo and Ecosia all syndicate Bing's index, so they inherit the blank. Google indexes you because Google crawls independently and more aggressively.

### What it is NOT (all verified live — your technical setup is clean)

| Check | Result |
|---|---|
| robots.txt | 200, correct type, allows all + explicit Bingbot allow |
| sitemap-index.xml / sitemap-0.xml | 200, `application/xml`, 42 URLs, all correct |
| Bingbot & DuckDuckBot user-agent fetch | Both get normal HTTP 200, full 133 KB HTML — no cloaking, no bot challenge |
| Canonicals | Consistent (`www`, trailing slash), match sitemap exactly |
| apex → www | Proper 308 |
| meta robots | `index, follow` |
| IndexNow key file | Serves 200 at `/e566ac6cd12040fca466d550fa1b5cac.txt`; postbuild ping hits both api.indexnow.org and Yandex |

### The likely real causes, in order

1. **Bing's indexing threshold for new/low-authority domains.** IndexNow and sitemaps get URLs *discovered*, not *indexed*. Bing is notoriously conservative: a domain relaunched in June 2026 with a thin backlink profile can sit at zero indexed pages for weeks-to-months even when perfectly crawlable. This is the dominant factor.
2. **Fake sitemap freshness is eroding trust.** `astro.config.mjs` sets `item.lastmod = new Date().toISOString()` — **every page claims to have been modified at every deploy.** Bing explicitly uses lastmod for crawl scheduling and explicitly distrusts sitemaps whose lastmod is always "now." This one *is* a code-level bug worth fixing: use real content dates (blog frontmatter dates, git dates) or omit lastmod.
3. **Backlink famine.** Bing needs at least a few external signals to justify indexing. Currently the profile is near-empty.

### Recommended actions (in order of impact)

1. **Bing Webmaster Tools → URL Submission**: manually submit the homepage + top 10 pages (10/day quota). Then check **Site Explorer / Crawl Information** for the specific exclusion reason ("Discovered but not crawled" vs "Crawled but not indexed" tells you exactly where you're stuck).
2. **Fix the sitemap `lastmod`** to real per-page dates (code change, small).
3. **Earn 3–5 real crawlable links**: GitHub profile website field, LinkedIn contact-info website, the Google Business Profile website link, dev directories (Clutch/GoodFirms free tiers), and links from the client sites you built (InHimalayas etc. — a "Site by Divyansh Sood" footer credit on even 2–3 client sites is the classic fix and also drives referral leads).
4. **Yandex Webmaster**: you're verified — check its indexing status too; the IndexNow ping is already reaching Yandex directly.
5. **DuckDuckGo itself needs nothing** — there is no manual submission; when Bing indexes you, DDG follows automatically.
6. Patience is genuinely part of the answer: with clean tech + a few links + BWT submissions, Bing typically starts indexing within 2–8 weeks.

---

## 3. Bugs & oddities found (none touched)

1. **🔴 Resend unconfigured in production** — covered above; the only P0.
2. **🟠 Sitemap lies about freshness** — `lastmod = new Date()` on every URL every build (`astro.config.mjs`). Hurts Bing/Yandex trust; also makes `changefreq`/`priority` hints ring hollow.
3. **🟡 Stale, misleading comments in the contact path** — `src/pages/api/contact.ts` says "the homepage form currently submits via WhatsApp" and `Contact.astro` says "The submit is wired to WhatsApp in HomeScripts.astro." Neither is true (it POSTs to `/api/contact` with a mailto fallback). Whoever edits this next will be misled.
4. **🟡 Homepage og:image is a WebSeek project screenshot** (`AiWebsitegenerator-1.webp`) — when anyone shares your homepage on WhatsApp/LinkedIn/iMessage, the preview card shows a random product screenshot, not a branded "Divyansh Sood Studio" card. Cheap high-visibility win.
5. **🟡 No spam protection on `/api/contact`** — no honeypot, no rate-limit, no Turnstile. The moment Resend is switched on, bots will find it. Add a honeypot field before enabling.
6. **🟢 Unused `newSite` param** — the endpoint reads `data.newSite` but `contact-form.js` never sends it (the checkbox is folded into the message text). Harmless dead code.
7. **🟢 Duplicate URLs via `trailingSlash: "ignore"`** — `/about` and `/about/` both serve 200 with identical content. Canonicals point to the `/` version so it self-heals, but a 308 from one to the other would be cleaner for Bing.
8. **🟢 Form retry impossible after fallback** — `showSuccess()` hides the form even when only the mailto fallback fired.
9. **🟢 SEO title is brand-first** — "Built in the Himalayas, Shipping Worldwide" is lovely but matches no commercial query; the H1 is screen-reader-only. Google forgives this; Bing is more literal. Consider keeping the brand poetry but front-loading one commercial keyword.

---

## 4. What feels missing (opportunities, not defects)

- **Proof artifacts for the $3K+ buyer**: real client logos, linked testimonials, one deep case study with numbers (the AUDIT_CONTENT.md five-beat structure is written but not fully deployed as a flagship case study page).
- **A capture path for not-ready-yet visitors**: the 23-post blog has no email capture at all.
- **Conversion measurement**: events on submit/click/call/PDF + a thank-you page would make every future decision data-driven.
- **Backlink/citation flywheel**: footer credits on client sites, GBP posts, directory profiles — this solves Bing *and* brings direct referrals.
- **A "small projects" release valve** for the India-targeted traffic the blog already wins, so those visits stop evaporating at the $3,000 line.

---

## 5. Priority checklist (do in this order)

1. ☐ **YOU:** Set `RESEND_API_KEY` / `CONTACT_FROM` / `CONTACT_TO` in Vercel; verify the Resend domain; test the form end-to-end. *(15 min, no deploy needed beyond env)*
2. ✅ ~~Add honeypot/rate-limit to `/api/contact`~~ — **done 2026-07-03**: honeypot on all 3 forms + server-side check + input length caps.
3. ☐ **YOU:** Bing Webmaster Tools: URL-submit top pages; read the crawl-exclusion reason in Site Explorer.
4. ✅ ~~Fix sitemap `lastmod` to real dates~~ — **done 2026-07-03**: blog URLs get manifest dates, other pages omit lastmod.
5. ☐ **YOU:** Get 3–5 real backlinks (client-site footer credits first).
6. ✅ ~~Branded og:image for the homepage~~ — **done 2026-07-03**: `/og-home.png` generated from the site's own fonts/colors, now the Layout default.
7. ✅ ~~Add conversion events~~ — **done 2026-07-03**: `dsTrack()` fires `form_submit`, `form_mailto_fallback`, `calendly_click`, `whatsapp_click`, `phone_click`, `email_click`, `pdf_download` to GA4 + Metrica (only after consent).
8. ☐ **YOU:** Decide the India-traffic strategy (small-scope offer vs foreign-intent content).

**Also fixed 2026-07-03:** stale "submits via WhatsApp" comments corrected; form no longer hides on the mailto fallback (visitors can retry); dead `newSite` param removed from the endpoint; homepage title now front-loads "Web Developer".

**Awaiting your OK (visible copy):** the audit form's note on `/website-audit` still says *"Sends your details to me on WhatsApp — no spam, no list."* — factually wrong (it emails you / opens the mail client). Say the word and I'll reword it.

---

*Knowledge graph updated: 289 nodes, 482 edges, 31 communities → `graphify-out/graph.html` (interactive), `graphify-out/GRAPH_REPORT.md` (audit trail). Graph health note: 120 dangling-endpoint edges from semantic/AST ID mismatches — cosmetic, doesn't affect these findings.*
