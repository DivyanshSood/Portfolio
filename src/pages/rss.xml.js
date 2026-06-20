import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE, orderPosts } from "../lib/blog.mjs";

// Blog RSS feed → /rss.xml. Helps feed readers, aggregators and AI crawlers
// discover fresh posts without re-crawling. Linked from <head> and llms.txt.
export async function GET(context) {
  const posts = orderPosts(await getCollection("blog"));

  return rss({
    title: "Divyansh Sood® Studio — Journal",
    description:
      "Notes and case studies on building custom-coded, conversion-focused websites for businesses worldwide.",
    site: context.site ?? SITE,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: "<language>en</language>",
  });
}
