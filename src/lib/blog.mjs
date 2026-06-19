export const SITE = "https://www.divyanshsood.com";
export const DEFAULT_OG =
  "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

export function iso(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

export function readingTime(body = "") {
  const words = String(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function gradient(slug = "") {
  let n = 0;
  for (const c of slug) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  const palettes = [
    "linear-gradient(150deg,#ff4612 0%,#7a1e00 100%)",
    "linear-gradient(150deg,#1f1f23 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#3a2a1a 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#ff4612 0%,#1f1f23 100%)",
    "linear-gradient(150deg,#2a1206 0%,#0b0b0c 100%)",
  ];
  return palettes[n % palettes.length];
}

/**
 * Sort newest-first and drop drafts.
 * @template {{ data: { draft?: boolean | undefined; pubDate: Date | string } }} T
 * @param {T[]} entries
 * @returns {T[]}
 */
export function orderPosts(entries) {
  return entries
    .filter((e) => !e.data.draft)
    .sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate));
}
