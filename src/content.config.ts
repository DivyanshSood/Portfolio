import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Blog posts stay as Markdown in /content/blog (existing source of truth).
const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.coerce.boolean().optional(),
  }),
});

export const collections = { blog };
