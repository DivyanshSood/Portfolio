// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://www.divyanshsood.com",
  trailingSlash: "ignore",
  output: "static",
  adapter: vercel(),
  integrations: [sitemap()],
  build: {
    // case-study + blog pages live at /projects/<slug>/ and /blog/<slug>/
    format: "directory",
  },
});
