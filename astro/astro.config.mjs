import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.divyanshsood.com',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
