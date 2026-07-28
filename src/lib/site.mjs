/* ===========================================================================
   Central site config — booking + founder assets. Both are live and used
   everywhere via imports. FOUNDER_PHOTO may be set to "" — a styled "DS"
   monogram placeholder renders instead; nothing breaks.
   =========================================================================== */

/* Canonical origin — the SINGLE source for absolute URLs (canonicals, JSON-LD
   @id graph, OG tags, sitemap). Must match `site` in astro.config.mjs and stay
   www + https: the Vercel adapter 308s the bare host, so an @id built from the
   wrong form silently splits the entity graph across two origins.
   src/lib/blog.mjs and src/lib/projects/data.mjs re-export this one. */
export const SITE = "https://www.divyanshsood.com";

export const CALENDLY_URL = "https://calendly.com/sood-divyansh007/30min";

// Founder photos, self-hosted in /public/images as pre-optimised WebP (hero
// 1600w ~43KB, about 1200w ~45KB) with neutral filenames — the public URL is
// part of the page, so it must not leak asset provenance. FOUNDER_PHOTO is the
// hero portrait (direct gaze); FOUNDER_PHOTO_ABOUT is the editorial
// three-quarter shot used on /about.
export const FOUNDER_PHOTO = "/images/divyansh-portrait.webp";
export const FOUNDER_PHOTO_ABOUT = "/images/divyansh-portrait-about.webp";
export const FOUNDER_PHOTO_ALT =
  "Divyansh Sood — founder, Divyansh Sood® Studio, Himachal Pradesh, India";

// Whether a real photo has been supplied (drives the monogram fallback).
export const HAS_FOUNDER_PHOTO = FOUNDER_PHOTO.trim().length > 0;

/* ---------------------------------------------------------------------------
   Google Business Profile reviews — real share link supplied by the client.
   Used as a "Read our Google reviews" proof link across the site. We link out
   only; we deliberately do NOT render a star rating or review count (and add no
   AggregateRating schema) because those numbers aren't verifiable from here.
--------------------------------------------------------------------------- */
export const GOOGLE_REVIEWS_URL = "https://share.google/x2v3pvXR9RIjYF1z0";

/* ---------------------------------------------------------------------------
   Google Business Profile / Maps. GOOGLE_MAPS_URL is the shareable place link
   used for visible "find me on Maps" links. GBP_CID is the listing's Customer
   ID; GOOGLE_MAPS_CID_URL is the canonical cid-based map URL used in structured
   data (hasMap + sameAs) so search engines tie the site to the real listing.
--------------------------------------------------------------------------- */
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/ACwV9EfEteWVoTD49";
const GBP_CID = "6503761533006416527";
export const GOOGLE_MAPS_CID_URL = `https://www.google.com/maps?cid=${GBP_CID}`;

/* NOTE: there is deliberately no price constant here. Pricing was removed from
   the site entirely by owner decision (2026-07-28) — every project is quoted in
   writing after a call, so no figure is published anywhere. Do not reintroduce
   a PROJECT_MIN_* export, a price in copy, or an Offer/PriceSpecification node
   in JSON-LD. (The one exception is the free llms.txt generator, which is
   correctly marked up as price:"0" + isAccessibleForFree — that's a "this tool
   is free" signal, not a price claim.) */

/* ---------------------------------------------------------------------------
   Verified public profiles — the SINGLE source for schema `sameAs` (Person +
   Studio) via SAME_AS below. Only list URLs that actually resolve to this
   person/studio: `sameAs` is an identity claim, and pointing it at a
   non-existent or wrong profile weakens the entity graph instead of building
   it. That's why the not-yet-created profiles are commented out, not guessed.

   To activate a profile: create it, set its "website" field to point back to
   https://www.divyanshsood.com/, then (1) uncomment its line here with the real
   handle, and (2) mirror the URL into public/llms.txt `## Contact` and the
   footer socials in src/layouts/Studio.astro. The schema updates automatically.
--------------------------------------------------------------------------- */
const SOCIAL_PROFILES = [
  { name: "GitHub", url: "https://github.com/DivyanshSood" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/divyanshsood/" },
  // ↓ Uncomment each once the profile is live and its website field links back here:
  // { name: "dev.to", url: "https://dev.to/<handle>" },
  // { name: "Hashnode", url: "https://hashnode.com/@<handle>" },
  // { name: "Behance", url: "https://www.behance.net/<handle>" },
  // { name: "Dribbble", url: "https://dribbble.com/<handle>" },
  // { name: "X", url: "https://x.com/<handle>" },
  // { name: "Product Hunt", url: "https://www.producthunt.com/@<handle>" },
  // { name: "Wikidata", url: "https://www.wikidata.org/wiki/<Qid>" },
];

// URL list consumed directly by JSON-LD `sameAs` on the Person and Studio nodes.
export const SAME_AS = SOCIAL_PROFILES.map((p) => p.url);
