/* ===========================================================================
   Responsive image helpers — the SINGLE source for the self-hosted work-image
   width ladder.

   Every project shot in /public/images/work ships as a 1920px base
   (`<name>.webp`) plus one pre-generated variant per width below
   (`<name>-<w>.webp`), written by scripts/gen-work-variants.mjs.

   LOCAL_WIDTHS used to be redeclared in four places — render.mjs, index.astro,
   DepthGallery.astro and the generator itself — so adding a width meant
   remembering all four, and missing one produced 404s for images that had
   simply never been generated. Import from here instead.

   Remote (ImageKit) sources resize with a `?tr=` query instead and are handled
   by their own callers; only the local ladder lives here.
   =========================================================================== */

/** Pre-generated variant widths, ascending. Must match the generator. */
export const LOCAL_WIDTHS = [480, 768, 1080, 1440];

/** The unsuffixed base file's intrinsic width. */
export const BASE_WIDTH = 1920;

/** Self-hosted images are root-relative; ImageKit ones are absolute URLs. */
export const isLocalImage = (src) => src.startsWith("/");

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
