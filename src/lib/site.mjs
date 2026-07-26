/* ===========================================================================
   Central site config — booking + founder assets. Both are live and used
   everywhere via imports. FOUNDER_PHOTO may be set to "" — a styled "DS"
   monogram placeholder renders instead; nothing breaks.
   =========================================================================== */

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
   Client logos — swap-ready. Paste an image URL (and the brand's site) for any
   client whose real logo you have. Until a logo `src` is filled in, the
   Testimonials strip falls back to clean text wordmarks — no broken images.
   Tip: host the logos on the same ImageKit account as the project images and
   prefer a transparent PNG/SVG that reads on a light background.
--------------------------------------------------------------------------- */
export const CLIENT_LOGOS = [
  { name: "Baglamukhi Travels", src: "", url: "https://baglamukhitravels.com" },
  { name: "Dharamshala Tours", src: "", url: "" },
  { name: "Redline Studios", src: "", url: "" },
  { name: "ChinkiZ Knitting Knife", src: "", url: "" },
  { name: "Modern K.B.S.", src: "", url: "" },
  { name: "Nandini Travels", src: "", url: "" },
  { name: "North Peak Power Systems", src: "", url: "" },
];

// True only once at least one real logo image is supplied above.
export const HAS_CLIENT_LOGOS = CLIENT_LOGOS.some((l) => l.src.trim().length > 0);

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
export const GBP_CID = "6503761533006416527";
export const GOOGLE_MAPS_CID_URL = `https://www.google.com/maps?cid=${GBP_CID}`;

/* Lowest project price we'll take on — kept here so the pricing copy and the
   inquiry-form budget options stay in sync. Repositioned for international
   buyers; Indian / pre-seed startups can still reach out for a smaller scope. */
export const PROJECT_MIN_USD = "$3,000";

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
export const SOCIAL_PROFILES = [
  { name: "GitHub", url: "https://github.com/DivyanshSood" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/divyansh-sood-023556151/" },
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
