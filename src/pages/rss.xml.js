import rss from "@astrojs/rss";
import { SITE, POSTS } from "../lib/blog.mjs";

// Blog RSS feed → /rss.xml. Helps feed readers, aggregators and AI crawlers
// discover fresh posts without re-crawling. Linked from <head> and llms.txt.
export async function GET(context) {
  return rss({
    title: "Divyansh Sood® Studio — Journal",
    description:
      "Notes and case studies on building custom-coded, conversion-focused websites for businesses worldwide.",
    site: context.site ?? SITE,
    items: POSTS.map((p) => ({
      title: p.title,
      description: p.description,
      pubDate: new Date(p.pubDate),
      link: `/blog/${p.slug}/`,
      categories: p.tags,
    })),
    customData: "<language>en</language>",
  });
}
