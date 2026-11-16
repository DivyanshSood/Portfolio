/* ===========================================================================
   Client testimonials — the SINGLE source for /testimonials/ and the homepage
   "What clients say" block (and the Review JSON-LD on /testimonials/).

   Every entry is a real quote already published on this site: the wording is
   the client's, copied from the case study it belongs to. Nothing here may be
   invented, paraphrased or "tidied up" — not a name, a role, a number or a
   word of the quote. Personal projects (personal: true in
   src/lib/projects/data.mjs) never get an entry: they have no clients.

   ── FOR THE OWNER: what to send for each client ────────────────────────────
   For every entry below (and for each new client quote), send:
     name        the person's real name as they want it shown ("Ramesh Kumar")
     role        their role ("Owner", "Principal", "Founder")
     photo       a square photo (at least 240 × 240), or say "no photo"
     reviewUrl   the link to THEIR review on the studio's Google Business
                 Profile, if they left one (Maps → the review → Share)
     metric      ONE before/after number you can source, with where it comes
                 from ("Direct bookings per month: 4 → 19, owner's booking
                 log, Oct 2026"), or "none"
     permission  their written OK (WhatsApp is fine) to show their name,
                 photo and quote on this site. Keep the message.
   A card shows whatever is present (name, photo, review link, metric). Review
   JSON-LD is emitted only when `name` AND `permission` are both set.

   Fields
     quote       string, the client's exact words
     name        string | null   — null until the client agrees to be named
     role        string          — "Founder", "Admin", …
     org         string          — the business, as on its own site
     town        string | null
     projectSlug string          — must match a client project in data.mjs
     liveUrl     string          — the client's live site
     reviewUrl   string | null   — their Google review, when one exists
     photo       string | null   — /images/testimonials/<slug>.webp
     metric      { value: string, label: string, source: string } | null
     permission  boolean         — true only with the client's written OK
   =========================================================================== */

import { projects } from "../lib/projects/data.mjs";

/** @typedef {{ value: string; label: string; source: string }} TestimonialMetric */
/**
 * @typedef {{
 *   quote: string; name: string | null; role: string; org: string; town: string | null;
 *   projectSlug: string; liveUrl: string; reviewUrl: string | null; photo: string | null;
 *   metric: TestimonialMetric | null; permission: boolean;
 * }} Testimonial
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    // /projects/modernkbs/ "In their words". The 7 days is the admin's own
    // account, never a studio stat (brand rules).
    quote: "Every other agency said 6 months. Delivered in 7 days.",
    name: null,
    role: "Admin",
    org: "Modern K.B.S.",
    town: "Ladwara",
    projectSlug: "modernkbs",
    liveUrl: "https://www.modernkbs.com",
    reviewUrl: null,
    photo: null,
    metric: null,
    permission: false,
  },
  {
    // /projects/nandini/ "In their words" (the full quote).
    quote:
      "The website is so beautiful — looks 10 times more premium than our competitors. We started getting direct bookings instead of losing them to Google Maps.",
    name: null,
    role: "Founder",
    org: "Nandini Travels",
    town: "Kangra",
    projectSlug: "nandini",
    liveUrl: "https://www.nandinitravel.com",
    reviewUrl: null,
    photo: null,
    metric: null,
    permission: false,
  },
  {
    // /projects/chinkiz/ "In her words". "Chinki" is already published (the
    // case study and the old testimonial credit). permission stays false, so
    // no Review markup, until the owner confirms her written OK.
    quote: "I did not think it could be achieved without going to e-commerce builders and only using custom code.",
    name: "Chinki",
    role: "Founder",
    org: "ChinkiZ Knitting Knife",
    town: null,
    projectSlug: "chinkiz",
    liveUrl: "https://www.chinkizknittingknife.com",
    reviewUrl: null,
    photo: null,
    metric: null,
    permission: false,
  },
];

// Build-time guard: every entry points at a real CLIENT case study.
for (const t of TESTIMONIALS) {
  const p = projects.find((x) => x.slug === t.projectSlug);
  if (!p) throw new Error(`testimonials.mjs: unknown projectSlug "${t.projectSlug}"`);
  if (p.personal) throw new Error(`testimonials.mjs: "${t.projectSlug}" is a personal project — no client quotes`);
  if (!t.quote.trim()) throw new Error(`testimonials.mjs: empty quote for "${t.projectSlug}"`);
}

/** "Name, Role" when there is a name, else just the role. */
export const testimonialPerson = (/** @type {Testimonial} */ t) => (t.name ? `${t.name}, ${t.role}` : t.role);

/** "Org · Town". */
export const testimonialOrg = (/** @type {Testimonial} */ t) => [t.org, t.town].filter(Boolean).join(" · ");

/** True when a Review node may be emitted: a named client who gave permission. */
export const canMarkUp = (/** @type {Testimonial} */ t) => Boolean(t.name && t.permission);
