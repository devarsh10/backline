// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const excludedFromSitemap = ['/cart', '/checkout', '/order-confirmation', '/contact-success'];

export default defineConfig({
  site: 'https://backlineindia.com',
  integrations: [
    sitemap({
      filter: (page) => !excludedFromSitemap.some((path) => page.includes(path)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
