/* ===========================================================================
   Marlboro Cross — the photo list for /marlboro-cross/ and /about/.

   One list, read by two things:
     - scripts/gen-bike-images.mjs, which turns the owner's original photos
       into the published WebP ladder (and the share card);
     - the pages, which take `alt` from here and the pixel sizes from
       src/data/bike-images.json (written by the generator).

   Publishing rules (owner decisions, 22 Nov 2026) — keep them when adding a
   photo:
     - Original photos, unedited: no blurring, no cutouts, no retouching. The
       generator only turns them upright, resizes them and converts them to
       WebP (an earlier blur, then a background cutout, were both dropped at
       the owner's request).
     - No photos taken at home.
     - Alt text describes the bike and the place, and never names the tobacco
       brand. Places are described, never guessed ("snow-capped peaks", not a
       named range nobody confirmed). The page never adds the logo as a
       graphic of its own.
     - The generator writes no metadata, so EXIF and GPS never ship.
   =========================================================================== */

/** @typedef {{ slug: string, src: string, alt: string, role?: "hero" | "about" }} BikePhoto */

/** @type {BikePhoto[]} */
export const BIKE_PHOTOS = [
  {
    slug: "ridge-side-profile",
    src: "IMG_1847",
    role: "hero",
    alt: "Marlboro Cross, a red and white hand-painted Royal Enfield Scram 411 scrambler, parked side-on on a rocky ridge with forested Himalayan mountains behind it",
  },
  {
    slug: "forest-trail",
    src: "IMG_2837",
    role: "about",
    alt: "The red and white hand-painted Scram 411 on a muddy forest trail in Himachal Pradesh, a helmet resting on the seat",
  },
  {
    slug: "snow-peaks-railing",
    src: "IMG_0215",
    alt: "Marlboro Cross parked against a white roadside railing, with snow-capped mountains and pine forest behind it",
  },
  {
    slug: "tank-and-snow",
    src: "IMG_0212",
    alt: "Close view of the hand-painted red and white tank and front end, with snow-covered peaks in the background",
  },
  {
    slug: "mountain-lookout",
    src: "IMG_1835",
    alt: "The scrambler on a mountain lookout, hazy blue ridgelines stretching away behind it",
  },
  {
    slug: "valley-ledge",
    src: "IMG_2500",
    alt: "The red and white Scram 411 on a dirt ledge above a deep forested valley, snow on the peaks beyond",
  },
  {
    slug: "sunset-cockpit",
    src: "IMG_2255",
    alt: "Rider's view over the red and white tank and handlebars, looking down an empty highway at sunset",
  },
  {
    slug: "dusty-trail",
    src: "IMG_2496",
    alt: "The scrambler parked against a dusty hillside on an unpaved trail, auxiliary lights on the front",
  },
  {
    slug: "dusk-grass",
    src: "IMG_0420",
    alt: "Side view of the bike in dry grass at dusk, the hand-painted tank and white fenders catching the last light",
  },
  {
    slug: "road-crossing",
    src: "IMG_2258",
    alt: "Side profile of the red and white Scram 411 at a road crossing under a pastel sky",
  },
  {
    slug: "roadside-profile",
    src: "IMG_2792",
    alt: "Full side profile of the bike on a roadside verge, showing the knobby tyres, high front fender and aftermarket exhaust",
  },
  {
    slug: "handguards-flyscreen",
    src: "IMG_2881",
    alt: "Front three-quarter view of the scrambler on grass, with Acerbis handguards, a flyscreen, auxiliary lights and knobby tyres",
  },
  {
    slug: "white-grass",
    src: "IMG_2898",
    alt: "The bike framed by tall white flowering grass, green hills behind it",
  },
  {
    slug: "tank-under-conifer",
    src: "IMG_1437",
    alt: "Low angle of the hand-painted tank and front wheel beneath a tall conifer",
  },
  {
    slug: "dusk-silhouette",
    src: "IMG_0596",
    alt: "The scrambler silhouetted against hazy hills at dusk",
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
