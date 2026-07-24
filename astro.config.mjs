// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

const excludedFromSitemap = ['/cart', '/checkout', '/order-confirmation', '/contact-success', '/admin', '/account'];

export default defineConfig({
  site: 'https://backlineindia.com',
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
  integrations: [
    sitemap({
      filter: (page) => !excludedFromSitemap.some((path) => page.includes(path)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
