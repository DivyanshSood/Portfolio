// Re-exported so a post's frontmatter needs one import, and so the booking
// link lives in exactly one place rather than hard-coded into every post.
export { SITE, CALENDLY_URL } from "./site.mjs";

// Identity nodes for each post's JSON-LD. Re-exported here for the same reason
// as the above: a post gets one import line, and the author/publisher facts
// live in one file instead of being copy-pasted across the manifest.
export { authorNode, publisherNode, websiteNode, topicsForTags, TOPICS } from "./entity.mjs";

// Social card used by /blog/ and by any post without its own cover. This was a
// WebSeek product screenshot hosted on ImageKit — so the journal's share card
// was a screenshot of an unrelated product, served from a third-party origin.
// /og-home.png is the branded 1200x630 card the rest of the site already
// defaults to in Studio.astro.
export const DEFAULT_OG = "https://www.divyanshsood.com/og-home.png";

// Post metadata now lives in a hand-maintained manifest (each post's prose is
// its own src/pages/blog/<slug>.astro page). Re-exported so the index, RSS feed
// and per-post "read next" all read from one ordered, newest-first source.
// Imported (not just re-exported) so helpers below have a local binding.
import { POSTS as POSTS_LIST } from "./blog-posts.mjs";
export { POSTS_LIST as POSTS };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

export function iso(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

/**
 * Topically-related posts for a given slug, best match first.
 *
 * Scoring by shared tags gives each post a handful of *relevant* inbound links
 * from its own topic cluster. Linking on publish order instead would make the
 * blog one chain with no cross-links and little reason to crawl past /blog/.
 *
 * Shared tags dominate; a shared audience breaks ties between posts that share
 * none, so the fallback is still a sensible neighbour rather than a random one.
 */
export function related(slug, limit = 4) {
  const posts = POSTS_LIST;
  const self = posts.find((p) => p.slug === slug);
  if (!self) return posts.slice(0, limit);

  const tags = new Set((self.tags || []).map((t) => t.toLowerCase()));

  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const shared = (p.tags || []).filter((t) => tags.has(t.toLowerCase())).length;
      const score = shared * 3 + (p.audience && p.audience === self.audience ? 2 : 0);
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score || +new Date(b.post.pubDate) - +new Date(a.post.pubDate))
    .slice(0, limit)
    .map((x) => x.post);
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
