/* ===========================================================================
   Central site config — booking + founder assets.
   Two values you swap when ready (each is used everywhere via imports):

     1. CALENDLY_URL   → paste your real Calendly event link.
     2. FOUNDER_PHOTO  → paste your ImageKit photo URL (same host as the
                          project images). Leave it "" and a styled "DS"
                          monogram placeholder renders instead — nothing breaks.
   =========================================================================== */

// TODO(divyansh): replace with your real Calendly link, e.g.
//   "https://calendly.com/divyanshsood/intro-call"
export const CALENDLY_URL = "https://calendly.com/divyanshsood/intro-call";

// Opens the scheduler in a new tab. Kept here so every CTA stays in sync.
export const BOOK_LABEL = "Book an intro call";

// Founder photo. Local fallback at /divyansh-photo.jpg; swap to an ImageKit
// URL (same host as the project images) once you've uploaded a re-crop there
// for a smaller responsive payload.
export const FOUNDER_PHOTO = "/divyansh-photo.jpg";
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

/* Lowest project price we'll take on — kept here so the pricing copy and the
   inquiry-form budget options stay in sync. Repositioned for international
   buyers; Indian / pre-seed startups can still reach out for a smaller scope. */
export const PROJECT_MIN_USD = "$3,000";
