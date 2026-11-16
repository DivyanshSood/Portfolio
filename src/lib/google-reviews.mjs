/* ===========================================================================
   Google Business Profile reviews, rendered as static HTML by
   components/brand/GoogleReviews.astro. Two sources, in this order:

   1. src/data/google-reviews.json — reviews copied by hand from the Business
      Profile. No API, no billing. Used whenever it has entries. Each entry:
        { "author": "Name as shown on Google",
          "text": "The review, word for word",
          "published": "2026-09",            // YYYY-MM or YYYY-MM-DD
          "authorUrl": "" }                  // optional: reviewer's Maps profile
   2. The Places API (New), at BUILD time — only when the file is empty and
      GOOGLE_PLACES_API_KEY is set (Google requires a billing account for it).

   Why build time: the reviews are then plain text in the page — crawlable,
   no client-side fetch, no API key in the browser, no layout shift.

   Env (Vercel → Project → Settings → Environment Variables, and .env locally):
     GOOGLE_PLACES_API_KEY  Places API (New) key. Restrict it to the Places
                            API; it is only ever used server-side at build.
     GOOGLE_PLACE_ID        optional override for GBP_PLACE_ID in site.mjs.

   Never fails the build: no key, a network error or an API error all return
   [] and the review section simply isn't rendered.

   The rating (getGoogleRating, below): the studio's own Google rating and
   review count, shown as linked text by components/brand/GoogleRating.astro
   (owner decision 2026-11-16). Read from the same Places API call when the key
   is set and dated the build day; otherwise GBP_RATING in site.mjs, dated by
   hand. Never marked up: no Review/AggregateRating/reviewRating for Google
   data. Google forbids marking up ratings collected on another site, and
   treats a business's reviews shown on its own site as self-serving.

   Terms: Google Maps Platform limits how long Places content may be kept.
   Each deploy re-fetches, so redeploy regularly (a weekly Vercel Deploy Hook
   on a cron does it) rather than letting one build's copy sit for months.
   =========================================================================== */
import { GBP_PLACE_ID, GBP_SEARCH_QUERY, GBP_RATING } from "./site.mjs";
import LOCAL from "../data/google-reviews.json";

const API = "https://places.googleapis.com/v1";

const env = (k) => {
  try {
    return import.meta.env?.[k] || process.env[k] || "";
  } catch {
    return process.env[k] || "";
  }
};

/** @typedef {{ author: string; authorUrl: string; text: string; when: string; published: string; url: string }} GoogleReview */

async function resolvePlaceId(key) {
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: GBP_SEARCH_QUERY, languageCode: "en" }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const place = (await res.json()).places?.[0];
  if (!place) throw new Error(`no place matched "${GBP_SEARCH_QUERY}"`);
  console.log(
    `[google-reviews] resolved "${place.displayName?.text}" (${place.formattedAddress}) → ${place.id}\n` +
      `[google-reviews] paste it into GBP_PLACE_ID in src/lib/site.mjs if that is the right listing.`
  );
  return place.id;
}

/** Hand-copied reviews: a fixed date ages correctly, "2 months ago" wouldn't. */
function fromFile() {
  const fmt = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });
  return /** @type {any[]} */ (LOCAL)
    .filter((r) => r && String(r.text ?? "").trim() && String(r.author ?? "").trim())
    .map((r) => {
      const d = r.published ? new Date(r.published.length === 7 ? `${r.published}-01` : r.published) : null;
      return {
        author: String(r.author).trim(),
        authorUrl: String(r.authorUrl ?? ""),
        text: String(r.text).trim(),
        when: d && !isNaN(+d) ? fmt.format(d) : "",
        published: r.published ?? "",
        url: "",
      };
    });
}

/** @type {Promise<any | null> | undefined} */
let placeCached;
/** One Place Details call per build (reviews + rating), or null with no key / on error. */
function getPlace() {
  return (placeCached ??= (async () => {
    const key = env("GOOGLE_PLACES_API_KEY");
    if (!key) return null;
    try {
      const id = env("GOOGLE_PLACE_ID") || GBP_PLACE_ID || (await resolvePlaceId(key));
      const res = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=en`, {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "reviews,googleMapsUri,rating,userRatingCount" },
      });
      if (!res.ok) throw new Error(`place details ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return await res.json();
    } catch (e) {
      console.warn(`[google-reviews] Places API skipped: ${e instanceof Error ? e.message : e}`);
      return null;
    }
  })());
}

async function load() {
  const local = fromFile();
  if (local.length) {
    console.log(`[google-reviews] ${local.length} review(s) from src/data/google-reviews.json.`);
    return local;
  }
  if (!env("GOOGLE_PLACES_API_KEY")) {
    console.log("[google-reviews] src/data/google-reviews.json is empty and no API key — review section skipped.");
    return [];
  }
  try {
    const data = await getPlace();
    if (!data) return [];
    /** @type {GoogleReview[]} */
    const reviews = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri ?? "",
        // The reviewer's own words where Google has them, not the machine
        // translation.
        text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
        when: r.relativePublishTimeDescription ?? "",
        published: r.publishTime ?? "",
        url: r.googleMapsUri ?? data.googleMapsUri ?? "",
      }))
      // A star-only review has nothing to quote.
      .filter((r) => r.text);
    console.log(`[google-reviews] ${reviews.length} review(s) with text fetched.`);
    return reviews;
  } catch (e) {
    console.warn(`[google-reviews] skipped: ${e instanceof Error ? e.message : e}`);
    return [];
  }
}

/** @typedef {{ value: number; count: number; asOf: string; url: string; source: "places" | "constant" }} GoogleRating */

/** Today's date in IST (the site's time zone), YYYY-MM-DD. */
const todayIst = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

/** @type {Promise<GoogleRating> | undefined} */
let ratingCached;
/**
 * The studio's Google rating: live from the Places API at build when the key
 * is set (dated the build day), else the hand-dated GBP_RATING constant.
 * Display only — never put it in JSON-LD.
 */
export function getGoogleRating() {
  return (ratingCached ??= (async () => {
    const data = await getPlace();
    const value = Number(data?.rating);
    const count = Number(data?.userRatingCount);
    if (value > 0 && value <= 5 && Number.isInteger(count) && count > 0) {
      console.log(`[google-reviews] rating ${value} from ${count} reviews (Places API).`);
      return { value, count, asOf: todayIst(), url: GBP_RATING.url, source: "places" };
    }
    return { ...GBP_RATING, source: "constant" };
  })());
}

/** @type {Promise<GoogleReview[]> | undefined} */
let cached;
/** Up to 5 reviews (the Places API maximum), fetched once per build. */
export function getGoogleReviews() {
  return (cached ??= load());
}
