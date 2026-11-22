/* ===========================================================================
   Marlboro Cross — the photo list for /marlboro-cross/ and /about/.

   One list, read by two things:
     - scripts/gen-bike-images.mjs, which turns the owner's original photos
       into the published WebP ladder (and the share card), blurring every
       `blur` box first;
     - the pages, which take `alt` from here and the pixel sizes from
       src/data/bike-images.json (written by the generator).

   Publishing rules (owner decisions, 22 Nov 2026) — keep them when adding a
   photo:
     - The tank and side panels carry a tobacco wordmark and chevron. Every
       instance that is legible gets a `blur` box. India's COTPA 2003 bans
       indirect tobacco advertising, and the page must not show the logo.
       "Marlboro Cross" is the bike's nickname, set in the site's own type.
     - Any readable number plate gets a `blur` box.
     - No photos taken at home.
     - Alt text describes the bike and the place; it never names the tobacco
       brand. Places are described, never guessed ("snow-capped peaks", not a
       named range nobody confirmed).
     - The generator writes no metadata, so EXIF and GPS never ship.

   `blur` boxes are fractions (0–1) of the upright photo: [x, y, w, h].
   =========================================================================== */

/** @typedef {{ slug: string, src: string, alt: string, blur: number[][], role?: "hero" | "about" }} BikePhoto */

/** @type {BikePhoto[]} */
export const BIKE_PHOTOS = [
  {
    slug: "ridge-side-profile",
    src: "IMG_1847",
    role: "hero",
    alt: "Marlboro Cross, a red and white hand-painted Royal Enfield Scram 411 scrambler, parked side-on on a rocky ridge with forested Himalayan mountains behind it",
    blur: [[0.35, 0.555, 0.15, 0.1], [0.82, 0.6, 0.065, 0.11]],
  },
  {
    slug: "forest-trail",
    src: "IMG_2837",
    role: "about",
    alt: "The red and white hand-painted Scram 411 on a muddy forest trail in Himachal Pradesh, a helmet resting on the seat",
    blur: [[0.385, 0.655, 0.075, 0.06]],
  },
  {
    slug: "snow-peaks-railing",
    src: "IMG_0215",
    alt: "Marlboro Cross parked against a white roadside railing, with snow-capped mountains and pine forest behind it",
    blur: [[0.395, 0.65, 0.13, 0.105], [0.72, 0.72, 0.07, 0.1]],
  },
  {
    slug: "tank-and-snow",
    src: "IMG_0212",
    alt: "Close view of the hand-painted red and white tank and front end, with snow-covered peaks in the background",
    blur: [[0.5, 0.615, 0.2, 0.075]],
  },
  {
    slug: "mountain-lookout",
    src: "IMG_1835",
    alt: "The scrambler on a mountain lookout, hazy blue ridgelines stretching away behind it",
    blur: [[0.47, 0.62, 0.1, 0.07], [0.265, 0.7, 0.045, 0.11]],
  },
  {
    slug: "valley-ledge",
    src: "IMG_2500",
    alt: "The red and white Scram 411 on a dirt ledge above a deep forested valley, snow on the peaks beyond",
    blur: [[0.3, 0.62, 0.095, 0.06], [0.47, 0.665, 0.13, 0.075]],
  },
  {
    slug: "sunset-cockpit",
    src: "IMG_2255",
    alt: "Rider's view over the red and white tank and handlebars, looking down an empty highway at sunset",
    blur: [],
  },
  {
    slug: "dusty-trail",
    src: "IMG_2496",
    alt: "The scrambler parked against a dusty hillside on an unpaved trail, auxiliary lights on the front",
    blur: [[0.36, 0.635, 0.12, 0.105], [0.505, 0.685, 0.065, 0.06], [0.6, 0.7, 0.115, 0.095], [0.75, 0.635, 0.075, 0.105]],
  },
  {
    slug: "dusk-grass",
    src: "IMG_0420",
    alt: "Side view of the bike in dry grass at dusk, the hand-painted tank and white fenders catching the last light",
    blur: [[0.48, 0.525, 0.2, 0.09], [0.025, 0.61, 0.075, 0.16]],
  },
  {
    slug: "road-crossing",
    src: "IMG_2258",
    alt: "Side profile of the red and white Scram 411 at a road crossing under a pastel sky",
    blur: [[0.35, 0.625, 0.06, 0.07], [0.87, 0.64, 0.075, 0.12], [0.215, 0.595, 0.06, 0.08]],
  },
  {
    slug: "roadside-profile",
    src: "IMG_2792",
    alt: "Full side profile of the bike on a roadside verge, showing the knobby tyres, high front fender and aftermarket exhaust",
    blur: [[0.55, 0.455, 0.065, 0.065], [0.35, 0.525, 0.12, 0.07], [0.06, 0.53, 0.06, 0.13]],
  },
  {
    slug: "handguards-flyscreen",
    src: "IMG_2881",
    alt: "Front three-quarter view of the scrambler on grass, with Acerbis handguards, a flyscreen, auxiliary lights and knobby tyres",
    blur: [[0.32, 0.51, 0.065, 0.06]],
  },
  {
    slug: "white-grass",
    src: "IMG_2898",
    alt: "The bike framed by tall white flowering grass, green hills behind it",
    blur: [[0.44, 0.6, 0.08, 0.075]],
  },
  {
    slug: "tank-under-conifer",
    src: "IMG_1437",
    alt: "Low angle of the hand-painted tank and front wheel beneath a tall conifer",
    blur: [[0.66, 0.54, 0.23, 0.095]],
  },
  {
    slug: "dusk-silhouette",
    src: "IMG_0596",
    alt: "The scrambler silhouetted against hazy hills at dusk",
    blur: [[0.49, 0.565, 0.08, 0.085], [0.355, 0.555, 0.1, 0.07]],
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
