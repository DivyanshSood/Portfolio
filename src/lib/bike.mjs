/* ===========================================================================
   Marlboro Cross — the photo list for /marlboro-cross/ and /about/.

   One list, read by two things:
     - scripts/gen-bike-images.mjs, which cuts the bike out of each of the
       owner's original photos and sets it on the site's Tarmac Tint;
     - the pages, which take `alt` from here and the pixel sizes from
       src/data/bike-images.json (written by the generator).

   Publishing rules (owner decisions, 22 Nov 2026) — keep them when adding a
   photo:
     - The bike as photographed: paint, stickers and plates are not blurred
       (owner's call, replacing the earlier blur of the tank wordmark and
       plates). The background is replaced, so the scenery isn't shown.
     - The whole bike must be in the original frame. The generator refuses a
       cutout that touches the photo's edge, because a bike cut off by the
       frame looks sliced flat on a plain background.
     - No photos taken at home.
     - Alt text describes the bike and the angle. The page never adds the
       tobacco logo as a graphic of its own, and alt text doesn't name it.
     - The generator writes no metadata, so EXIF and GPS never ship.
   =========================================================================== */

/** @typedef {{ slug: string, src: string, alt: string, role?: "hero" | "about" }} BikePhoto */

/** @type {BikePhoto[]} */
export const BIKE_PHOTOS = [
  {
    slug: "side-profile",
    src: "IMG_1847",
    role: "hero",
    alt: "Marlboro Cross, a red and white hand-painted Royal Enfield Scram 411 scrambler, in full side profile",
  },
  {
    slug: "helmet-on-seat",
    src: "IMG_2837",
    role: "about",
    alt: "The red and white hand-painted Scram 411 from the side, mud on the tyres and a helmet resting on the seat",
  },
  {
    slug: "front-three-quarter",
    src: "IMG_2880",
    alt: "Front three-quarter view of the scrambler with Acerbis handguards, a flyscreen and knobby tyres",
  },
  {
    slug: "side-grass",
    src: "IMG_2886",
    alt: "Side view of the scrambler, with the aftermarket exhaust and the high front fender",
  },
  {
    slug: "side-dusk",
    src: "IMG_0417",
    alt: "Side view of the bike, the hand-painted tank and white fenders in warm evening light",
  },
  {
    slug: "side-exhaust",
    src: "IMG_2792",
    alt: "Full side profile showing the knobby tyres, high front fender and aftermarket exhaust",
  },
  {
    slug: "side-low",
    src: "IMG_2898",
    alt: "Side view of the bike, low and long, with dirt still on the tyres",
  },
  {
    slug: "rear-three-quarter",
    src: "IMG_0458",
    alt: "Rear three-quarter view of the scrambler, showing the tail, rear fender and hand-painted tank",
  },
  {
    slug: "rear-view",
    src: "IMG_1836",
    alt: "The Scram 411 from behind, with the rear tyre, exhaust and number plate",
  },
  {
    slug: "side-panel",
    src: "IMG_2768",
    alt: "Side profile of the scrambler, white side panel and red-and-white tank in full view",
  },
  {
    slug: "front-flyscreen",
    src: "IMG_2867",
    alt: "Front view of the scrambler with its flyscreen, X-taped headlight and Acerbis handguards",
  },
];

export const BIKE_DIR = "/images/bike";
export const BIKE_OG = `${BIKE_DIR}/marlboro-cross-og.jpg`;

/** Published path of a photo's 1920px base. */
export const bikeSrc = (slug) => `${BIKE_DIR}/${slug}.webp`;

export const BIKE_HERO = BIKE_PHOTOS.find((p) => p.role === "hero");
export const BIKE_ABOUT = BIKE_PHOTOS.find((p) => p.role === "about");
/** Everything except the hero, which the page already shows full width. */
export const BIKE_GALLERY = BIKE_PHOTOS.filter((p) => p.role !== "hero");
