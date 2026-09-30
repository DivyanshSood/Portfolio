/* ===========================================================================
   Responsive image helpers — the SINGLE source for the self-hosted work-image
   width ladder.

   Every project shot in /public/images/work ships as a 1920px base
   (`<name>.webp`) plus one pre-generated variant per width below
   (`<name>-<w>.webp`), written by scripts/gen-work-variants.mjs.

   LOCAL_WIDTHS is consumed through localVariant/localSrcset by every page that
   shows a project image, and by the generator. Import it; never redeclare it.
   A copy that drifts from the generator emits srcset entries for variants that
   were never written.
   =========================================================================== */

/** Pre-generated variant widths, ascending. Must match the generator. */
export const LOCAL_WIDTHS = [480, 768, 1080, 1440];

/** The unsuffixed base file's intrinsic width. */
export const BASE_WIDTH = 1920;

/**
 * Narrowest pre-generated variant at least `w` wide.
 * Falls back to the 1920px base when `w` exceeds the ladder.
 */
export function localVariant(src, w) {
  const W = LOCAL_WIDTHS.find((x) => x >= w);
  return W ? src.replace(/\.webp$/, `-${W}.webp`) : src;
}

/** Full `srcset` for a local image: every variant plus the 1920px base. */
export function localSrcset(src) {
  return [
    ...LOCAL_WIDTHS.map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`),
    `${src} ${BASE_WIDTH}w`,
  ].join(", ");
}

/* ---------------------------------------------------------------------------
   Blog covers.

   Covers are authored as `/blog/<slug>.jpg` at 1200px wide with whatever height
   they came out at, and both places that display one (.post-cover and the
   .blog-card thumb) force `aspect-ratio:16/10` with `object-fit:cover` — so the
   full-height JPEG was always being cropped away in the browser after being
   downloaded in full.

   scripts/gen-work-variants.mjs now pre-crops each cover to 16:10 and writes a
   WebP base plus the ladder below. The .jpg stays exactly where it is: it is
   still the og:image, because social scrapers are the one audience that can't
   be relied on to take WebP.
   --------------------------------------------------------------------------- */

/** Pre-generated cover widths, ascending. Must match the generator. */
export const COVER_WIDTHS = [480, 768, 1080];

/** The unsuffixed cover base width (authoring width — never upscaled past it). */
export const COVER_BASE_WIDTH = 1200;

/** Display aspect ratio, as [w, h]. Matches `aspect-ratio:16/10` in blog.css. */
export const COVER_RATIO = [16, 10];

/** `/blog/<slug>.jpg` → `/blog/<slug>.webp` (the responsive base). */
export const coverBase = (cover) => cover.replace(/\.jpe?g$/, ".webp");

/** Full `srcset` for a cover: every variant plus the 1200px base. */
export function coverSrcset(cover) {
  const base = coverBase(cover);
  return [
    ...COVER_WIDTHS.map((w) => `${base.replace(/\.webp$/, `-${w}.webp`)} ${w}w`),
    `${base} ${COVER_BASE_WIDTH}w`,
  ].join(", ");
}

/* `sizes` for a post's cover, measured from src/layouts/Post.astro: the
   main column is 820px at most, full width minus the 16px gutters below the
   900px breakpoint. */
export const COVER_SIZES_POST = "(max-width: 900px) calc(100vw - 32px), 820px";
