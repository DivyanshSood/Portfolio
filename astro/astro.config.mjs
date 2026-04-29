import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://divyanshsood.com',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
