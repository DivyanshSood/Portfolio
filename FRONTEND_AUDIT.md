# Front-end audit — divyanshsood.com

**Date:** 2026-07-03 · **Scope:** everything the visitor sees and touches (layout, motion, forms, mobile, a11y, perf) · **Method:** full source review of every component/style/script + real-browser behavioral testing of the built site (puppeteer + system Chrome, desktop 1280×800 and mobile 390×844 with touch emulation, real clock) + full-page renders of 10 pages.

Companion to `SITE_HEALTH_REPORT.md` (SEO/indexing/lead-pipeline). This one is only about the front end.

---

## ✅ Resolution status — all findings fixed 2026-07-03 (build + real-browser verified)

- **#1 Mobile pricing** → same plans/rows now render as stacked cards ≤720px (table hidden there, unchanged on desktop). Verified at 390px: all 3 tiers, prices, ✓/—, and CTAs visible.
- **#2 Mobile testimonials** → touch auto-swap removed; quote stays put, screenshot renders as a static 170px proof strip below the attribution. Desktop hover swap unchanged (both re-verified).
- **#3 Hero** → owner-approved: tagline (existing OG-card line) + "Start a project"/"See the work" CTAs added to the card; "ELITE FOLIO | ALERT" chip → "Selected work ↓".
- **#4** → founder photos self-hosted as `/images/divyansh-portrait*.webp` (43/45 KB, smaller than before); "ChatGPT Image" URLs gone.
- **#5** → homepage now preloads the hero portrait (LCP).
- **#6** → process step descriptions are `<p>` (one `h2` left in the section — the heading).
- **#7** → project field is a `<textarea rows="4">`.
- **#8–#11** → kicker plumbing removed from Nav + 33 pages; dead Hero CSS gone; `.nav-links{display:none}` / `.work-row` / `.price-inner` / `.hero-meta` rules removed from responsive.css; stale motion comments corrected.
- **#12** → MotionController now smooth-scrolls `/#section` links too; About uses `#work`.
- **#13** → footers reserve 84px above the fixed pill on phones (homepage + shared cs-foot).
- **#14** → owner-approved: marquee now respects `prefers-reduced-motion` (static, still visible).
- **#15** → blob resumes after tab-switch only when the section is on screen.
- **#16** → 404 wordmark links home.
- **#17** → accepted as-is (JS-only forms), by design.
- **Copy items** → all three approved and applied: hero tagline/CTAs, "Selected work ↓" chip, and the /website-audit note now reads "Goes straight to my inbox — no spam, no list."

Original findings kept below for reference.

---

## Verified working (tested, not assumed)

- **Scroll reveals** — GSAP/Lenis reveal system works on load, full scroll down, scroll back up, and deep links (`/#contact`): nothing ever stays stuck hidden. The no-JS / reduced-motion / JS-crash fallbacks in `base.css` + the 3s head-script failsafe are all correctly wired.
- **Mobile hamburger menu** — opens (opacity 1, tappable), closes on link/Escape/outside tap, `aria-expanded` synced.
- **FAQ accordions** — all answers fit the 320px cap at 390px width (tallest is 142px); no clipping.
- **No horizontal overflow** on any tested page at 390px (home, portfolio, website-audit, blog index, blog post, project, about, testimonials, results, agencies, privacy).
- **Zero console errors / zero failed requests** on all tested pages. The only console line is the expected "unable to create webgl context" in GPU-less headless — and the CSS fallback sphere correctly engages (`is-fallback`).
- **All 21 remote images (ImageKit/Unsplash) return 200**, including both ChinkiZ gallery images. (Empty tiles in my screenshots were lazy-load artifacts, not broken images.)
- **Exactly one `h1` per page**, focus-visible ring site-wide, cookie banner reopen via footer "Cookies" works, honeypots present on all 3 forms.

---

## P1 — costs you conversions (all on the two pages that sell)

### 1. Pricing table is effectively invisible on phones
`src/components/home/Pricing.astro` — the table has `min-width: 760px` inside a horizontal scroll region. At 390px the label column (38% + padding ≈ full viewport) eats the whole screen: a phone visitor sees **feature names with no prices, no ✓/—, no plan columns, no "Get started" buttons** — everything sits off-screen right with **no swipe affordance**. The sticky header's empty first cell also renders as a large blank block that reads as broken. Verified visually at 390px.
**Fix direction (no copy change):** stack plans as cards under ~720px, or keep the scroll but add a visible "swipe →" cue + collapse the label column. This is the money section; on mobile it currently answers "how much?" with a blank.

### 2. Testimonial quotes self-destruct on mobile
`src/components/home/Testimonials.astro:321-339` — on touch devices each card gets `.is-shown` 1.5s after entering view, which fades the quote/attribution to `opacity: 0` **permanently** and swaps in the project screenshot. Verified: `faceOpacity: "0"` on device emulation; the rendered section shows three screenshots and zero readable words. 1.5s is not enough to read a two-sentence quote — mobile visitors effectively never see your social proof. (Desktop is fine: hover is user-initiated and reversible.)
**Fix direction:** on touch, don't auto-swap — show the photo behind/below the quote, or toggle on tap.

### 3. The hero sells nothing above the fold
`src/components/home/Hero.astro` — the visible fold is: portrait + "EST. 2026" + "DESIGN / DEVELOPMENT" + the red signature. The `h1` (name + what you do) is screen-reader-only. There is **no headline, no value proposition, no CTA** in the hero, and on a 1440×900 first visit the **cookie banner covers the signature** — the only identity element. A cold visitor gets no answer to "who is this / what do I get / what do I do next" without scrolling.
Also: the bottom-left chip reads **"ELITE FOLIO · 2026 | ALERT ↗"** — this looks like leftover template copy and means nothing to a buyer. *(Visible copy — flagging only, per your rule; needs your OK to change.)*

---

## P2 — real bugs & trust issues (quick wins)

4. **Founder photo URL says it's AI-generated.** `src/lib/site.mjs:21-22` — the hero portrait's public URL is `.../My%20images/ChatGPT%20Image%20Jun%2023,%202026...jpg`. Anyone who opens the image in a new tab (right-click, or dev tools) sees "ChatGPT Image". For a personal brand selling "hire a real person," that's a trust leak. Rename the files on ImageKit to something neutral (`divyansh-portrait.jpg`) and update the two constants.
5. **Homepage LCP image isn't preloaded.** The hero portrait is a CSS `background-image`, discovered only after CSS parses. `Layout.astro` already supports a `preloadImage` prop — `index.astro` just doesn't pass it. One-line fix; directly improves LCP on the page that matters most.
6. **Process steps are marked up as `<h2>`.** `src/components/home/Process.astro:24` — each step *description* is an `<h2 class="cs-card-h2">`, adding five junk headings to the page outline (screen readers + SEO). Should be `<p>`.
7. **"Tell me about your project" is a single-line `<input>`.** `src/components/home/Contact.astro:53` — the main brief field can't hold a brief. A `<textarea rows="4">` invites the detail you want from a $3k+ lead. (Server + mailto fallback already handle multi-line fine.)

---

## P3 — polish, dead code, stale comments

8. **Dead `kicker` plumbing in the nav.** `Nav.astro` accepts a `kicker` prop and styles `.kicker`/`.nav-divider`, but the markup never renders it — `index.astro:49` passes a kicker that never shows. Dead code in 3 files (`Nav.astro`, `responsive.css` `#ds-nav .kicker` rules).
9. **Dead CSS in Hero.astro** for removed markup: `.hero-corner-page*`, `.hero-author*`, `.hero-avatar*`, `.hero-name*`, `.hero-brandline`, and the `heroRise` animation for `.hero-namewrap` targets nothing.
10. **Dead/conflicting rules in responsive.css:** `.nav-links{display:none}` at ≤860px fights the hamburger dropdown (currently masked by the scoped component rule — fragile); `.work-row` and `.price-inner` rules target markup that no longer exists.
11. **Stale comments say motion is disabled** — `StickyBook.astro:2-5` ("No scroll-driven show/hide (motion is disabled site-wide)") and `HomeScripts.astro:2-3` ("no motion site-wide"); motion has been back since June. `index.astro:57` says "top 3 of 9" but 4 are featured. These comments will mislead the next edit.
12. **Anchor behavior is inconsistent on the homepage.** In-page links written as `#work`/`#contact` glide via Lenis; the ones written as `/#work` (About's "See the work", nav "Contact") hash-jump instantly. Same page, two behaviors — normalize to `#...` on homepage components.
13. **Sticky "Book a call" pill overlaps the footer bar on phones.** At page bottom it visually covers the lower half of "Back to top ↑" (still tappable at center — verified). Extra bottom padding on the footer, or hide the pill near the footer, cleans it up.
14. **Marquee ignores `prefers-reduced-motion` on purpose** (`Testimonials.astro:305-311`). It also has no pause control on touch (WCAG 2.2.2 wants one for >5s motion; hover-pause exists on desktop only). Low risk, but it's the one deliberate a11y exception on the site.
15. **ClosingCta blob keeps animating off-screen after tab switches** — `visibilitychange` calls `play()` regardless of the IntersectionObserver state. Battery nit on mobile.
16. **404 page brand mark isn't a link** and the page has no nav — fine as a design choice, but the wordmark should at least link home (the "Back home" button carries it today).
17. **Forms are JS-only.** No `action` attribute; with JS off, submit does nothing. Acceptable for this audience — noting for completeness.

---

## Pending your OK (visible copy — not touched)

- `/website-audit` note: *"Sends your details to me on WhatsApp — no spam, no list."* → factually wrong (goes to email API/mailto). Suggested: *"Goes straight to my inbox — no spam, no list."*
- Hero chip *"ELITE FOLIO · 2026 | ALERT ↗"* (finding #3) — suggest replacing with something meaningful ("Selected work ↓") or removing.
- Any hero headline/CTA addition (finding #3) is also copy — I'll draft options only when you say go.

## Suggested order

1. #1 pricing-on-mobile and #2 testimonials-on-mobile (the two pages that close deals are broken on the device most visitors use).
2. #4 photo rename + #5 LCP preload + #6 heading fix + #7 textarea — under an hour combined.
3. P3 cleanup in one housekeeping commit.
