import rss from "@astrojs/rss";
import { SITE, POSTS } from "../lib/blog.mjs";

// Blog RSS feed → /rss.xml. Helps feed readers, aggregators and AI crawlers
// discover fresh posts without re-crawling. Linked from <head> and llms.txt.
export async function GET(context) {
  const site = context.site ?? SITE;
  // Newest post date, not build time: the feed's content only changes when a
  // post does, and a lastBuildDate that moves on every deploy is the same fake
  // freshness signal the sitemap deliberately avoids.
  const newest = POSTS.map((p) => p.updatedDate || p.pubDate).sort().at(-1);

  return rss({
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    title: "Divyansh Sood® Studio — Journal",
    description:
      "Notes and case studies on building custom-coded, conversion-focused websites for businesses worldwide.",
    site,
    items: POSTS.map((p) => ({
      title: p.title,
      description: p.description,
      pubDate: new Date(p.pubDate),
      link: `/blog/${p.slug}/`,
      categories: p.tags,
    })),
    // atom:link rel="self" is required for RSS 2.0 validity and is what
    // aggregators use to canonicalise the feed — without it, a feed reached via
    // a mirror or a proxy can be treated as a separate subscription.
    customData: [
      "<language>en</language>",
      newest ? `<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : "",
      `<atom:link href="${new URL("/rss.xml", site).href}" rel="self" type="application/rss+xml"/>`,
    ]
      .filter(Boolean)
      .join(""),
  });
}
