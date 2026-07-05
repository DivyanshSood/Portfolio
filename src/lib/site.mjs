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
  { name: "InHimalayas", src: "", url: "https://www.inhimalayas.com" },
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
