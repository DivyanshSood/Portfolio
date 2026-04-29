import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.divyanshsood.com',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
