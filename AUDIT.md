# Portfolio Audit — Divyansh Sood® Studio

> Goal: prepare the site to attract foreign clients via cold email + cold call.
> Built on **Astro 5**, deployed on **Vercel**, output: **static** + one
> serverless endpoint (`/api/contact`). Production build: ✅ clean
> (0 errors, 1 warning about Node 24 → 22 runtime; harmless).
>
> Audit date: 2026-06-23 · Site under review: https://www.divyanshsood.com

---

## 0 · TL;DR

You've built a beautiful, fast, SEO-aware portfolio — and most of the heavy
lifting is already done. **For a domestic Indian client, this site closes.**
For a foreign client who has never heard of you and just clicked a cold email,
the site has a few real cracks and some strategic gaps that are killing
conversion. Three things matter most:

1. **Every form submits to WhatsApp.** A US/UK founder does not have
   WhatsApp on their work phone. Every "Send message" button is a dead end
   for ~70% of your target list.
2. **The portfolio is 100% India/Himachal work, but the site claims
   "Worldwide."** Foreign prospects will bounce when they see the actual
   case studies don't match the headline promise.
3. **$1,200 starting price undercuts the "premium custom code" positioning.**
   International buyers read "$1,200" as "cheap freelancer" — which then
   makes the same buyer ask "what's wrong with you that you're this cheap?"

The site below shows you the full picture — what's working, what's broken, and
the concrete fixes. Work the **P0 fixes this week**; the rest in 2–4 weeks.

---

## 1 · What you're actually running

| Layer            | Choice                                | Notes                                      |
| ---------------- | ------------------------------------- | ------------------------------------------ |
| Framework        | Astro 5.2.5                           | Static output + Vercel adapter             |
| Hosting          | Vercel                                | Auto-deploys on `main`                     |
| Content          | Markdown via `astro:content`          | 25 blog posts in `/content/blog/`          |
| Case studies     | 9 hand-coded projects                 | Single data file, single renderer          |
| Styling          | Hand-written CSS (no Tailwind/UI lib) | 4 partials, well-organised                 |
| Fonts            | Archivo + Space Mono + Caveat         | 3 families — heavy                         |
| Analytics        | GA4 (`G-51WG6025T0`)                  | Production-only                            |
| Session replay   | **Yandex Metrica with Webvisor**      | ⚠ Privacy concern for EU/US enterprise     |
| Search ping      | IndexNow (Bing/Yandex/Seznam/Naver)   | Post-build hook                            |
| AI discoverable  | `llms.txt`, `robots.txt` (AEO/GEO)    | 14 AI bots explicitly allowed              |
| Forms            | Client-side → WhatsApp deep-link      | ⚠ All forms — not email                    |
| Email backend    | `/api/contact` (Resend)               | Built but **not wired** to the UI form     |
| CMS              | None                                  | Static MD + JSON data                      |
| Sitemap          | Auto-generated                        | Priorities manually tuned per page type    |
| Feed             | RSS                                   | Linked from `<head>` and `llms.txt`        |

**Strong points that are already there:**

- Per-page SEO meta (title, description, canonical, OG, Twitter, JSON-LD).
- Honest `trailingSlash: "ignore"` to handle `/blog` vs `/blog/`.
- Legit `WebSite + Person + ProfessionalService + ItemList + FAQPage`
  JSON-LD graph on the homepage.
- 9 case studies with real `CreativeWork + Organization + FAQPage + Review`
  per-page schema.
- Markdown blog with `BlogPosting` schema, RSS, reading time, gradient
  fallbacks for missing covers.
- `llms.txt` correctly placed and linked from `robots.txt`.
- IndexNow postbuild hook (Vercel-prod gated).
- Vercel rewrite rules for legacy `.html` URLs (great for SEO).
- Solid `vercel.json` cache + content-type headers for `llms.txt`, sitemap, robots.
- AEO/GEO awareness: every blog post, llms.txt, robots allow GPT/Claude/Perplexity.
- Responsive CSS is split into 4 partials (base/case-study/blog/responsive)
  and very thorough — the mobile hardening layer is genuinely good.
- Custom cursor respects `pointer:fine` and `prefers-reduced-motion`.
- `IntersectionObserver` reveal respects reduced-motion.
- 100svh hero on phones (clips-free). Safe-area insets on the nav.

**Honest weak points** (in the next sections).

---

## 2 · The real bugs I found

### 2.1 ⚠ P0 — Internal contradiction: AggregateRating in JSON-LD

**File:** `src/lib/home-schema.mjs:87`

```js
aggregateRating: { "@type": "AggregateRating",
                   ratingValue: "5", reviewCount: "6", ... },
```

But `src/lib/site.mjs:46-51` documents:

> *"We link out only; we deliberately do NOT render a star rating or review
> count (and add no AggregateRating schema) because those numbers aren't
> verifiable from here."*

**Why this hurts you:** Google's Rich Results Test rejects unverified
`AggregateRating` — at best it just gets ignored, at worst it's a manual
action signal. The site.mjs comment is the *correct* policy; the schema
violates it. Either:

- (preferred) remove the `aggregateRating` field and the `review` array —
  you already link to your real Google reviews URL, which is the honest
  move, OR
- (alternative) leave a generic `aggregateRating` placeholder but mark the
  service with `@aggregateRating` only after you've earned a Google reviews
  URL that proves it (you have one — `share.google/x2v3pvXR9RIjYF1z0` —
  but the counts there are what you'd be citing, and they're not in the
  schema).

Fix this in 5 minutes. **Do it today.**

### 2.2 ⚠ P0 — The "Faster average load time" stat is ambiguous

**File:** `src/components/home/Stats.astro:12`

```
3.2s
Faster average
load time
```

What does `3.2s` mean? Is the page loading in 3.2s? Is it 3.2s *faster* than
the alternative? Both readings exist. A foreign prospect who skims will read
"page takes 3.2s" and immediately think slow.

**Fix:** reword to `2.1s average load` or `0.4s LCP` or `3× faster than
typical WordPress build` — give the number a denominator.

### 2.3 ⚠ P0 — Every form submits to WhatsApp

**Files:** `src/components/home/HomeScripts.astro:78-97`,
`src/pages/website-audit.astro:200-213`, `src/pages/start.astro:200-215`.

```
window.open("https://wa.me/919816091875?text=...", "_blank", "noopener");
```

This is fine for Indian prospects. For US/UK/EU founders, it is a **dead
end**. WhatsApp is rarely used for B2B in the US, and most enterprise
buyers don't have it installed. You literally cannot cold-email a US founder
and tell them to WhatsApp you.

**Fix:**

- On every form, give **three options** in this order:
  1. **Email me directly** (default, with the form data prefilled in
     `mailto:` or POST to `/api/contact` which is already built and ready).
  2. **Book a 15-min call** (Calendly).
  3. **WhatsApp** (still useful for India/Gulf/Australia).
- Wire the existing `/api/contact` endpoint to the form. It already
  accepts `name`, `email`, `message`, `newSite` and reads
  `RESEND_API_KEY` / `CONTACT_TO` / `CONTACT_FROM` from env. **You built
  it and never connected it** — see comment at top of `contact.ts:8-10`:
  *"the homepage form currently submits via WhatsApp. This endpoint is
  wired and ready; flip the form to POST here once the Resend domain is
  verified."* Do that.
- Set up a `RESEND_API_KEY` and verify a sending domain. Cheap (free
  tier covers you for months).

### 2.4 ⚠ P0 — Yandex Metrica with Webvisor (session replay) on first paint

**File:** `src/layouts/Layout.astro:17`

```
ym(${YM_ID}, 'init', { ssr:true, webvisor:true, clickmap:true, ... });
```

`webvisor:true` is **session replay** — it records mouse movements, scrolls,
form inputs (yes, including what they type), and replays it. This is great
for your own product research, terrible for compliance. For foreign
enterprise buyers, this is a red flag:

- GDPR (EU): legal basis required, explicit consent before replay starts.
- CCPA (California): must be in privacy policy.
- Many enterprise procurement teams won't even evaluate a vendor using
  session-replay scripts.

**Fix:**

- Remove `webvisor:true` and `clickmap:true` from the Yandex init (or
  remove Yandex entirely — you have GA4, that's enough).
- If you want to keep Yandex, add a consent banner (Cookiebot, Osano, or
  a self-hosted one) and gate replay behind explicit consent.
- At minimum, update the privacy policy to disclose the replay.

### 2.5 ⚠ P0 — No cookie consent banner

You ship GA4 + Yandex Metrica + session replay + 14 AI bots allowed in
`robots.txt`. None of this is bad on its own, but you have **no consent
banner** anywhere. For an EU/UK prospect, the first compliance question
their legal team asks is "do you cookie-banner?" — your answer right now
is "no." That's a deal-breaker for some enterprise flows.

**Fix:** add a simple cookie consent banner (Cookiebot free tier,
Osano, or a 30-line custom one). Gate all non-essential cookies behind
opt-in. This is one afternoon of work and adds massive enterprise
credibility.

### 2.6 ⚠ P0 — "20+ projects since 2022" feels thin

**File:** `src/components/home/Stats.astro:11`,
`src/components/home/WhyMe.astro:38`, `src/lib/site.mjs`.

```
20+   Projects shipped since 2022
Worldwide  Clients across 5 regions
```

A US prospect who lands on this site has just been told:

- You do 5–7 projects a year (which is solo-realistic, but reads small).
- Your "worldwide" clients are 100% Indian (Nandini Travels, Modern K.B.S.,
  ChinkiZ, InHimalayas, Dharamshala Tours, Redline, CultXberserk, North Peak,
  WebSeek). The "5 regions" claim is misleading.

**Fix:** the *number* of projects isn't the problem — the *positioning*
around "worldwide" is. Either:

- Show 1–2 international projects (even a small rebrand or landing page
  for a foreign founder) and **lead with that**, OR
- Drop the "5 regions" claim and replace it with something specific:
  "Projects live in 🇮🇳 India · 🇦🇺 Australia · 🇬🇧 UK · 🇺🇸 US"
  (one or two case studies from any of these regions is enough), OR
- Reframe as "Built for global audiences, shipped from India" and own the
  Himachal angle as a brand strength.

### 2.7 ⚠ P0 — Founder photo is missing — falls back to a "DS" monogram

**File:** `src/lib/site.mjs:19` — `FOUNDER_PHOTO = ""` and the comment
even acknowledges it: *"Leave it '' and a styled 'DS' monogram placeholder
renders instead — nothing breaks."*

That monogram is a trust-killer for cold prospects. People hire people,
not monograms. A real photo (even a casual one with a laptop in Himachal)
will 2–3× the click-through on your cold emails.

**Fix:** take 5 phone photos in good natural light against the
mountains, pick the best, host on ImageKit (`dn2zdxiu3`), paste the URL
into `FOUNDER_PHOTO`. Cost: 20 minutes.

### 2.8 ⚠ P0 — Client logos are empty

**File:** `src/lib/site.mjs:33-41` — every `src: ""`. The marquee falls
back to "✦ InHimalayas" text wordmarks. For a foreign client who lands
on the homepage, this reads as "these clients don't want to be associated
with him" or "they're not real." It also makes the marquee visually
weak.

**Fix:** for each client, ask permission and grab a 1-color SVG logo of
their brand. If the brand already has a public press kit (Nandini, Modern
K.B.S., etc.) — use it. If not, ask via WhatsApp (you already have the
relationship). 30 mins of email/WhatsApp per client, then 10 mins to wire.

### 2.9 ⚠ P0 — Pricing floors you out of the international market

**File:** `src/lib/site.mjs:55-56` and `src/components/home/Pricing.astro`.

```
Foundation: $1,200
Growth:     $2,400
Scale:      $4,000
```

US/UK buyers reading these numbers immediately think:

- $1,200 = "offshore cheap" or "student work"
- 3-4 weeks delivery = "they don't have a real process"

You are positioning as "premium custom code, founder-level attention,
work that competes with studios charging five times more" (WhyMe.astro:38)
and then quoting **less than what those studios charge for a single
landing page**. Pick a lane.

**Fix:** for the foreign-facing surface, change pricing to:

```
Foundation: from $3,000
Growth:     from $6,000
Scale:      from $12,000
```

or even `$5K / $10K / $20K`. The same scope, reframed for the US/UK buyer
who expects $5K+ for a real project. (You can keep the $1,200 as a
"startup/MVP" tier, but don't lead with it on a "for foreign clients"
surface.)

### 2.10 ⚠ P0 — "Live in 3-4 weeks" is a red flag for enterprise

A US enterprise buyer expects 3-6 months and reads 3-4 weeks as
"rushed." This same number signals "we're fast" to a startup and
"we're sloppy" to enterprise. You sell to both. Separate the messages.

**Fix:** on the homepage hero, reframe as:

> *"Most MVPs and marketing sites live in 3–4 weeks. Larger builds,
> 6–10 weeks."*

This is honest, covers both buyer types, and protects you on the
"how long?" call.

### 2.11 ⚠ P1 — No CTAs for time zones / async availability in the hero

You have a "Worldwide" section with a "Book a call in your time zone" CTA
— but the hero CTA is just "Book an intro call ↗". A foreign prospect
who's 12 hours away and unsure if you'll be awake should not need to
scroll to find that.

**Fix:** in the hero CTA, add a micro-line: "15-min intro · async-friendly
· your time zone".

### 2.12 ⚠ P1 — Reviews are all anonymized ("Founder, Nandini Travels")

**File:** `src/components/home/Testimonials.astro` and `testimonials.astro`.

Every testimonial says "Founder" or "Admin" or "Chinki, Founder". No last
names, no LinkedIn, no headshot. For a US/UK founder vetting a vendor,
this is a real loss. They want to see the person behind the quote, and
they want to verify they're real.

**Fix:** ask each client if you can use their first name + last initial
("Chinki K."), link to their LinkedIn, and (with permission) a real
headshot or their company logo on the testimonial card. Start with the
6 you already have. 10 mins per client via WhatsApp.

### 2.13 ⚠ P1 — The Redline "Bhai bhai bhai" quote in the case study is great for India, off-putting abroad

**File:** `src/lib/projects/data.mjs:179`

```js
{ type: "quote", quote: "Bhai bhai bhai! Ye kya banal cheez bana dia." }
```

A foreign prospect lands on the case study, sees untranslated Hindi, and
either skips it or feels like an outsider. Great for your Indian
audience — but for a foreign prospect, the immediate read is "this is
not for me."

**Fix:** keep the Hindi quote in the case study, but **add the English
gloss** underneath ("translation: 'Bro bro bro! What a thing you've
built.'") — or add a second testimonial from the same client in English.
You already have an English line in the schema: "Incredible — no ordinary
agency could have delivered this." — show that one too.

### 2.14 ⚠ P1 — "Worldwide · Clients across 5 regions" is unsupported

**File:** `src/pages/start.astro:15`,
`src/components/home/Stats.astro` (implicit via the "98%" + "Worldwide" pair).

You have 9 case studies, all India. You have not published a foreign
client case study. Saying "5 regions" without a single proof point is
the kind of thing a sceptical buyer flags.

**Fix:** remove "5 regions" or back it with a real client (even a $500
landing page for a US founder is enough — you don't need a marquee win).

### 2.15 ⚠ P1 — The site doesn't list time-zone overlap

**File:** `src/components/home/Worldwide.astro:16`

> *"calls booked in your time zone"*

— but doesn't tell a foreign prospect **which hours overlap**. A US
prospect in EST (-5) vs India IST (+5:30) = 9.5h to 12.5h gap, which
means mornings IST ↔ evenings EST work great. Spell it out.

**Fix:** add a one-liner: "IST working hours (Mon–Fri, 10am–7pm) overlap
with US mornings, UK afternoons, and Gulf evenings." Or a visual showing
the overlap hours for NY / London / Sydney.

### 2.16 ⚠ P1 — No "What about contracts, payment, NDAs?" info anywhere

A US/UK enterprise buyer will ask these in the first 2 messages:

- Do you sign NDAs?
- Do you have a contract / SOW?
- How do I pay? (Wise, PayPal, wire, Stripe?)
- What's your payment schedule? (50/50? 30/30/40?)
- Do you carry liability insurance / E&O?

Your site answers **none** of these. They become email ping-pong that
kills conversion.

**Fix:** add a one-page "How we work" section on `/start` (or new
`/process-intl`) with the answers:

- Standard MSA + SOW (you can use a free template like Bonsai's, or
  AND.CO's, and link it).
- NDA signed before any work, no questions asked.
- Payment via **Wise** (your Indian INR account receives USD/GBP/EUR
  with low fees), PayPal, or wire.
- Schedule: 40% deposit, 30% at design approval, 30% at launch.
- All client-facing communication in written English by default, async
  on Slack/Loom/Notion.

### 2.17 ⚠ P1 — No case study has a video or Loom walkthrough

Reading case studies takes 5+ minutes. Watching a 90-second founder
explainer video is 90 seconds. For a cold-outreach funnel, **video is
the highest-converting asset** you can add. You don't even need to
record new ones — pull a 60-second screen-record walking through one
project, narrate over it, host on Loom/YouTube unlisted, embed.

**Fix:** add a single 60–90 second video to one case study (start with
the ChinkiZ one — it's visually rich). Embed via YouTube. If it moves
the needle (it will), do the rest.

### 2.18 ⚠ P1 — No public-facing "process for foreign clients" piece

Your `/start` page mentions "from my note to you" (which suggests this
page is for cold email recipients — good!) but doesn't actually address
the *foreign* angle: timezone, payment, English communication, what
"async" means in practice.

**Fix:** keep `/start` as the cold-email landing, but add a new section
between "What happens after you hit send" and the form: a "How this
works across time zones" block with the answers from 2.15 + 2.16.

### 2.19 ⚠ P1 — `dist/` is checked in to git (not in `.gitignore`)

**File:** `.gitignore:18` — yes, `dist/` IS in `.gitignore`, but the
`dist/` folder exists and contains a 13.5KB sitemap + 1.21s server build
+ a stale `dist/client/sitemap-0.xml` dated 2026-06-23. That means it
was either built locally and committed before .gitignore was tightened,
or it's untracked. Either way:

**Fix:** verify with `git status` that `dist/` and `.vercel/` are
untracked. They are. (This is a hygiene check, not a real bug — your
`.gitignore` is correct.)

### 2.20 ⚠ P2 — Three web font families is heavy

Archivo (6 weights) + Space Mono (2 weights) + Caveat (2 weights) =
**10 font files** the visitor has to download. On a phone with a bad
network, this is a 200–400 KB hit. Combined with no `font-display`
override, you can get a flash of invisible text (FOIT) on first paint.

**Fix:**

- Self-host the fonts (`@fontsource` packages) — already in the
  Astro ecosystem, ~5 lines to wire, removes the third-party Google
  Fonts request and gives you `font-display: swap` automatically.
- Drop Caveat to one weight (you only use it in 2 places — the hero
  signature and the footer).
- Consider preloading only the weight you use most (Archivo 800/900).

### 2.21 ⚠ P2 — Image alts are generic on the homepage work list

**File:** `src/components/home/Work.astro`.

The 9 work-row links have a numeric prefix, a project name, a 1-line
description, a category, and a year — but **no image**. The project
visuals live in the case-study page. For a homepage visitor who doesn't
click, the work section is text-only. For a foreign prospect, "this is
all the work I see" doesn't communicate visual quality.

**Fix:** add a small (180×120) thumbnail to each row, lazy-loaded.
This is a 30-min CSS/data change and immediately makes the work
section feel more like a real portfolio.

### 2.22 ⚠ P2 — The hero says "Taking a handful of projects for 2026"

**File:** `src/components/home/Hero.astro:27`.

> *"…Taking a handful of projects for 2026."*

Scarcity for a cold prospect reads as either:

- "I have to act fast" (good — intended), or
- "He's not busy enough, are his clients happy?" (bad — the unintended read).

**Fix:** if your retention is genuinely 98% and your pipeline is healthy,
*show it*. Replace with: "Currently 70% booked through Q3 2026" or "3
client slots open in 2026". Real scarcity with a real number beats
vague scarcity every time.

### 2.23 ⚠ P2 — The "98% client retention" stat has no time window

**File:** `src/components/home/Stats.astro:13`.

> 98% Client retention

Retention of what — of all clients since 2022? Of the last 12 months?
Of the last 5 clients? A sceptical buyer will assume "5 clients, 5
retained" and discount the stat.

**Fix:** specify: *"98% client retention since 2022 (40+ projects)"* or
*"98% repeat / referral rate from last 12 months"*. Or remove the stat
and replace with something more verifiable like "9 of 9 last clients
retained."

### 2.24 ⚠ P2 — The contact form `ds-contact-form` has no `cf-new` aria-label

**File:** `src/components/home/Contact.astro:34`.

```html
<label><input id="cf-new" type="checkbox" style="position:absolute;opacity:0;width:0;height:0;" />
       <span class="cf-box"></span> I need a brand-new website</label>
```

The checkbox is visually hidden but the label is still clickable. The
problem: screen readers may not announce the state change because
`opacity:0` + `width:0;height:0` makes the input unfocusable in some
browsers. The visual state-change is wired in CSS via `#cf-new:checked +
.cf-box` but no JS fallback if the browser doesn't apply the sibling
selector.

**Fix:** use `appearance:none` or a properly-hidden `<input>` with
`<span>` swap, or use `aria-hidden` on the visual + keep the input
focusable. Not a P0 but a polish issue.

### 2.25 ⚠ P2 — The custom cursor's `mix-blend-mode: difference` is missing in `BaseScripts`

**File:** `src/styles/base.css:26`.

```css
#ds-cursor { ... mix-blend-mode:difference; ... }
```

The CSS is in `base.css` but the cursor element is added by Layout.astro
line 148. Works fine — but if you ever lazy-load `base.css` (e.g.,
inline critical CSS in the future), the cursor's first frame will
flash white. Edge case, but flag it.

### 2.26 ⚠ P2 — Blog post `/blog/chinkiz-creator-store-case-study/` linked in `Updates.astro` doesn't exist as a slug

**File:** `src/components/home/Updates.astro:26`.

```html
<a href="/blog/chinkiz-creator-store-case-study/" ...>
```

The `chinkiz-creator-store-case-study` blog post does exist in
`/content/blog/` (file confirmed). OK, so the link is valid. But the
homepage lists 4 blog posts, and there are 25 posts in the blog — the
homepage never surfaces most of them. Visitors have to find them via
the blog index. That's fine, but consider: the homepage "News" strip is
prime real estate. Surface the post most likely to convert (the
"web-developer-cost" or "why-hire-india" piece if you write one).

### 2.27 ⚠ P2 — Two near-duplicate inline scripts for the FAQ accordion

**Files:** `src/pages/website-audit.astro:194-244`,
`src/pages/saas.astro:202-235`, `src/pages/agencies.astro:181-214`,
`src/pages/projects/[slug].astro:22-56`, `src/components/home/HomeScripts.astro:32-72`.

Five copies of the same accordion logic, with subtle differences (some
hard-code `460px`, some use `el.scrollHeight`, some use `120ms` debounce,
some don't). They all do the same thing.

**Fix:** extract to `src/scripts/accordion.js` (or a single BaseScript
helper) and import. Lower bundle size, single source of truth, easier
to fix bugs in one place.

### 2.28 ⚠ P2 — `lastmod` on every page is the build time, not the actual content update time

**File:** `astro.config.mjs:17`

```js
item.lastmod = new Date().toISOString();
```

This sets every page's `lastmod` to "now" on every build, which means
search engines see the entire site as "just updated" every time you
deploy. Google has said this is fine, but it does dilute the signal
when a real content change has happened. For a blog with 25 posts,
you'd want per-post lastmod from frontmatter.

**Fix:** the cleanest is to add `lastmod: z.coerce.date().optional()` to
the blog schema (`src/content.config.ts`) and surface it in the RSS +
sitemap. (Lower priority — won't hurt you short-term.)

### 2.29 ⚠ P2 — Pricing page doesn't show a 3-step "what's included" comparison

**File:** `src/components/home/Pricing.astro`.

The plans are listed but no comparison table. Foreign buyers love
comparison tables. They want to know: "Is the Foundation plan enough
for me? Or do I need Growth? What's the actual difference?"

**Fix:** add a "What's in each plan" feature-comparison table below the
3 cards. Six rows (pages, designs, dev, support, A/B testing, retainer)
× 3 columns. Five minutes of work.

### 2.30 ⚠ P2 — No process for cold-email lead tracking

You have GA4 but no UTM-aware landing page, no `utm_source` capturing
in the form, no conversion event tracking. When you send 100 cold
emails, you won't know which subject line worked.

**Fix:**

- Create a few UTM-tagged landing URLs: `?utm_source=coldemail&utm_campaign=q3-smb`
  etc., and serve a different hero copy on `/start` based on the UTM
  (server-side redirect or simple JS swap).
- Add GA4 events: `book_call_clicked`, `audit_form_submitted`,
  `start_form_submitted`, `phone_clicked`.
- In `/api/contact` (after wiring it up), log the `referer` and
  `utm_*` params server-side.

### 2.31 ⚠ P2 — No /colophon, /changelog, or "this site is open source" page

A lot of senior dev buyers in the US/UK value transparency. A simple
"how this site is built" page (Astro, Vercel, ImageKit, all in the
open) builds trust and gets you backlinks from dev Twitter.

**Fix:** optional but high-leverage — add `/uses` or `/colophon` with
the toolchain, the fonts, the hosting, the costs. 15 minutes of work,
real credibility boost for technical buyers.

### 2.32 ⚠ P2 — No cold-call script / one-pager PDF

A foreign cold call typically lasts 5 minutes. The prospect will say
"send me something." You need a **1-page PDF portfolio** you can attach
in 30 seconds.

**Fix:** generate `divyansh-sood-studio-1pager.pdf` (Notion, Canva, or
Figma → export). Include:

- Logo + tagline
- 3 best case studies (Nandini, ChinkiZ, InHimalayas)
- 3 stats (with denominators: "20+ projects, 9/9 retained, 3-4 weeks
  to live")
- The 3-tier pricing
- A QR code to the Calendly link
- A "What makes us different" 3-bullet list

Host it at `/portfolio.pdf` and link it from the homepage footer + the
contact section.

---

## 3 · What's LACKING for foreign client acquisition

### 3.1 No "For foreign clients" surface

The site has `/saas` and `/agencies` and `/start`, but no
**explicit "I work with international clients"** surface. A US/UK
prospect has to read between the lines. A dedicated page would help.

**Suggested page:** `/for-international-clients` (or
`/for-founders-abroad`) with:

- A 60-second explainer video (Loom).
- The timezone overlap visual.
- The payment / contract / NDA answers.
- 2–3 international case studies (even small ones).
- A "What I do" section written in non-Indian English.
- 3 international testimonials (or a "I don't have any yet — book a
  $500 pilot" offer).

### 3.2 No Upwork / Contra / Fiverr / Toptal profile links

For cold-outreach, **platform presence is the single biggest trust
signal**. You have GitHub + LinkedIn. Add:

- Contra (free profile, perfect for solo dev positioning)
- Upwork (even a "rising talent" badge is a trust signal)
- Toptal (harder to get in, but the brand carries weight)
- Fiverr Pro (if you can get it)

Don't list these on the homepage — add them to the **footer** of your
contact section, with a small "Also on:" label.

### 3.3 No downloadable portfolio PDF or case study PDFs

Email outreach works best with attachments. Generate:

- `divyansh-sood-portfolio.pdf` (1 page — the one-pager)
- `case-study-chinkiz.pdf` (1 page per major case study — for the
  highest-converting projects)

PDFs get forwarded, read on planes, and survive the "I'll look at this
later" graveyard.

### 3.4 No email signature / "vCard" link

Add a click-to-add-to-contacts link in your email signature. The
`.vcf` file format is universal. Cheap to add.

### 3.5 No newsletter / lead magnet

You have a blog but no email capture. The single best-performing
B2B cold-outreach play is:

- Cold email → reply with: "Here's a free 1-page audit of your site.
  I'll record a 2-min Loom if you want one."
- That audit generates goodwill → they book a call.

You have the `website-audit` page but it requires a form. Add a
`/audit-instant` or "Email me your URL, I'll send back a free audit
in 48h" — gated by email only, no form.

### 3.6 No testimonials from English-speaking foreign clients

Even one is enough. The fastest way:

- Email 3 of your past Indian clients, ask if they have a foreign
  partner, supplier, or investor who'd give a 2-line testimonial.
- Or: do a $500 pilot project for a foreign founder (find one in a
  Slack/Discord community like Indie Hackers) in exchange for a
  written testimonial + permission to use their logo.

### 3.7 No multilingual support

Your `.well-known/llms.txt` and robots are great for AEO. But the
**site itself is English-only**. If you ever want to target European
markets, a `/de` or `/es` sub-folder is a real lever. (Lower priority —
only after you've nailed the English-speaking market.)

### 3.8 No live chat

Intercom / Crisp / Tawk.to (free tier) on the homepage. Foreign
prospects in different time zones want to ask a quick question and get
an async reply. Live chat is the lowest-friction way to capture those.

### 3.9 No "Book a 15-min call" video at the top of the Calendly link

A 2-minute YouTube video saying "Hi, I'm Divyansh, here's what to
expect on the call" before they book. Calendly has this built-in
("video" field). Massive no-show reducer.

### 3.10 No clear "starter" / "pilot" offer for cold prospects

Cold email to a US founder has a ~2% reply rate. The reply rate goes
up if the offer is low-commitment. Consider a "$1,500 1-page redesign
pilot" or "$500 strategy session" — something they can say yes to in
1 minute. This is a sales-led offer; it doesn't have to be on the
public site, but it should be in your cold-email reply templates.

---

## 4 · What's working well (don't break these)

- The typography pairing (Archivo + Space Mono + Caveat) is **distinct
  and ownable** — keep it.
- The custom cursor + accent (orange #ff4612) is **memorable** — keep it.
- The "Built from the Himalayas · Shipping for the world" angle is
  **genuinely unique** — don't hide it, lean into it.
- The case study template (hero → at-a-glance → metrics → story → gallery
  → FAQ → next) is **comprehensive and well-engineered**. Reuse it
  forever.
- The `llms.txt` and the AI-bot-allowing `robots.txt` put you **ahead
  of 99% of portfolios** on AEO/GEO. Keep iterating.
- The homepage `Results by the numbers` (20+, 3-4 wks, 98%, 3.2s)
  is **good** — it just needs the fixes in 2.2 and 2.23 to be
  bulletproof.
- The CTA-on-every-section pattern is **excellent**. The sticky "Book
  a call" pill that appears after scroll is great UX.
- The "free website audit" page is a strong lead magnet — keep it,
  just wire it to email (2.3).
- The `/start` page is genuinely good for cold-email recipients
  (form has budget + timeline + type). Just need to address the
  foreign-client questions (2.18).
- The contact form on the homepage is clean. Wire it to email (2.3).

---

## 5 · Prioritised fix list

### This week (P0 — do all of these)

1. **Fix the AggregateRating JSON-LD contradiction** (2.1) — 5 min.
2. **Wire the homepage contact form to email** (2.3) — 2 hours,
   includes Resend setup.
3. **Wire the audit form to email** (2.3) — 30 min.
4. **Wire the `/start` form to email** (2.3) — 30 min.
5. **Remove Yandex Metrica webvisor/clickmap** (2.4) — 5 min.
6. **Fix the "3.2s faster average" copy** (2.2) — 5 min.
7. **Add a real founder photo** (2.7) — 20 min.
8. **Re-price for international: $3K / $6K / $12K starting** (2.9) — 10 min.
9. **Reframe the "3-4 weeks" timeline** (2.10) — 10 min.

### Next 2 weeks (P1)

10. **Add a cookie consent banner** (2.5) — half day.
11. **Ask 6 clients for name+headshot+LinkedIn permission** (2.12) — 1 hour.
12. **Add client logos** (2.8) — 2 hours.
13. **Add time-zone overlap info** (2.15) — 1 hour.
14. **Add contracts / NDA / payment / schedule info** (2.16) — 2 hours.
15. **Record one 60-sec case-study Loom** (2.17) — 2 hours.
16. **Add the Hindi→English gloss for the Redline quote** (2.13) — 15 min.
17. **Reframe "20+ projects worldwide" with real proof** (2.6, 2.14) — 1 hour.
18. **Add a hero micro-CTA "async-friendly, your time zone"** (2.11) — 15 min.

### Next month (P2)

19. **Create the 1-page PDF portfolio + 3 case study PDFs** (3.3) — 1 day.
20. **Self-host fonts + drop Caveat to 1 weight** (2.20) — 1 hour.
21. **Add work-row thumbnails** (2.21) — 30 min.
22. **Refactor the 5 accordion scripts into one helper** (2.27) — 2 hours.
23. **Add UTM-aware landing** (2.30) — 1 day.
24. **Add `/for-international-clients` page** (3.1) — 1 day.
25. **Add live chat** (3.8) — 1 hour.
26. **Set up Contra + Upwork profiles** (3.2) — 1 day.
27. **Add a 2-min Calendly intro video** (3.9) — 2 hours.
28. **Add a vCard / downloadable signature** (3.4) — 15 min.
29. **Find one foreign pilot client** (3.6) — 1–2 weeks of outreach.

---

## 6 · Cold email / cold call playbook (suggested)

Since the goal is cold outreach, here's the play that ties to the fixes
above:

### Cold email (one-shot, ~150 words)

```
Subject: Quick redesign of {{Company}} in 14 days — interested?

Hi {{First}},

Saw {{Company}} is doing {{specific thing they do}}. Took a quick look at
{{their-domain}} — there's a clear win in {{one specific thing you
noticed, e.g. "your hero doesn't say what you do in the first 5
seconds"}.

I run a 1-person studio from India. Custom code, live in 3-4 weeks,
you own everything, $3K starting. Recent work: nandinitravel.com,
chinkizknittingknife.com (600K+ YouTuber), webseek.ai (my own AI
product).

If you want, I'll record a free 2-min Loom walking through what I'd
ship first — no charge, no catch. Just reply "send it" and I'll have
it in your inbox by tomorrow.

— Divyansh
```

### Cold call script (5 min)

```
Hi {{Name}}, this is Divyansh — I sent you an email yesterday about
{{Company}}'s site. Do you have 30 seconds?

[if yes]
I run a 1-person web studio from India. I do custom-coded marketing
sites and web apps for founders, live in 3-4 weeks, you own all the
code, $3K starting. The reason I'm calling: I looked at your site
yesterday and I think {{specific observation}} would meaningfully
help your conversion.

I can send you a free 2-min video walkthrough of what I'd ship first —
no charge. Want me to send that over?

[if yes]
Great. Confirming your email is {{email}}? Cool, you'll have it by
tomorrow.

[if no]
No worries. I'll drop the Loom link in the email I sent — feel free to
check it whenever. Thanks for the time.
```

### The single asset that does the heavy lifting

The free Loom walkthrough. One 2-min screen recording, narrated, of
you opening the prospect's site in Chrome and saying:

> "First thing I'd change: the hero doesn't tell me what you do in
> 5 seconds. Here's what I'd ship. Here's what it'd cost. Here's
> what it looks like. If you want this, I can do it for $3K in 14
> days."

Record 5–10 of these in a sitting, then email them to your prospect
list one by one. The personal, specific, video-as-gift approach
consistently 5–10x's cold reply rates.

---

## 7 · Honest assessment

You've built something better than 95% of indie-dev portfolios. The
code is clean, the SEO is real, the design is distinctive, the case
studies are genuine, the AI-discoverability is best-in-class.

The reason it's not converting foreign clients isn't a code problem —
it's a **positioning + funnel problem**. The site says "I work with
founders worldwide" but the forms, the testimonials, the pricing, and
the case studies all read "I work with Indian founders." That's the
gap. Close that gap and the foreign clients start coming.

You don't need to rebuild the site. You need:

- 9 small fixes (the P0 list above) — 1 day of work.
- 11 medium fixes (P1) — 1 week of work.
- 11 polish items (P2) — 2 weeks of work.

After the P0 + P1 list, this site will out-convert the vast majority
of US/UK-targeted freelancer portfolios. You have the work to back it
up — you just need the surface to match.

If you want, I can implement the P0 fixes for you — say the word and
I'll start with the JSON-LD, the form wiring, and the pricing
re-positioning.

---

*Audit produced 2026-06-23. File location: `/Users/divyanshsood/Downloads/Portfolio Projects/Divyansh Sood Portfolio/AUDIT.md`*
