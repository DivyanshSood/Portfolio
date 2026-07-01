export const SITE = "https://www.divyanshsood.com";
export const DEFAULT_OG =
  "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp";

// Post metadata now lives in a hand-maintained manifest (each post's prose is
// its own src/pages/blog/<slug>.astro page). Re-exported so the index, RSS feed
// and per-post "read next" all read from one ordered, newest-first source.
export { POSTS } from "./blog-posts.mjs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

export function iso(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

export function gradient(slug = "") {
  let n = 0;
  for (const c of slug) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  const palettes = [
    "linear-gradient(150deg,#ff1f1f 0%,#7a1e00 100%)",
    "linear-gradient(150deg,#1f1f23 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#3a2a1a 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#ff1f1f 0%,#1f1f23 100%)",
    "linear-gradient(150deg,#2a1206 0%,#0b0b0c 100%)",
  ];
  return palettes[n % palettes.length];
}
