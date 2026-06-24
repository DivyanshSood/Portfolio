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
    // Drives the closing footer + post-template CTA copy + channel choice
    // (email/Calendly for international & d2c-brand, WhatsApp for indian-smb).
    audience: z.enum(["international", "indian-smb", "d2c-brand"]).default("international"),
    draft: z.coerce.boolean().optional(),
  }),
});

export const collections = { blog };
