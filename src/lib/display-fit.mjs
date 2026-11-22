/* ===========================================================================
   display-fit — how wide a word is in the display face, in em.

   The display style (Archivo 900 italic at 125% width, -0.03em tracking) is
   wide enough that a short figure can be wider than the column it sits in.
   With `overflow-wrap` as the only guard, the browser then breaks it mid-word:
   "DHARAMSH-ALA" in a hero, "41.8 / K" or "201 / 9" in a stat grid. Measuring
   the widest word up front lets a component cap its font size so that word
   always fits, and breaking stays a last resort.

   Advance widths were measured from Archivo 900 italic at 125% with the
   display's -0.03em tracking. Anything unlisted counts as 1em (wider than any
   real glyph here, so the estimate errs towards fitting), plus .15em for the
   italic overhang. Lowercase is measured as uppercase for the same reason.
   Used by PageHero (hero display name) and ResultGrid (stat values).
   =========================================================================== */

export const GLYPH = {
  A: .924, B: .9, C: .909, D: .903, E: .83, F: .777, G: .982, H: .979, I: .365, J: .734, K: .958, L: .756, M: 1.148,
  N: .977, O: .978, P: .835, Q: .978, R: .913, S: .852, T: .847, U: .959, V: .908, W: 1.2, X: .931, Y: .936, Z: .847,
  "0": .781, "1": .701, "2": .779, "3": .783, "4": .789, "5": .783, "6": .785, "7": .716, "8": .798, "9": .785,
  ".": .351, ",": .351, "&": 1.035, "'": .294, "’": .294, "?": .713, "-": .386, "®": .77,
};

/** One word's width in em, italic overhang included. */
export const wordEm = (w) => [...w.toUpperCase()].reduce((s, c) => s + (GLYPH[c] ?? 1), 0.15);

/** The widest word of a phrase, in em. */
export const widestWordEm = (text) => Math.max(...String(text).split(/\s+/).filter(Boolean).map(wordEm));
