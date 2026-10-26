// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Update this once the Cloudflare Worker has a custom domain.
  site: 'https://zulfan-town.workers.dev',
  output: 'static',
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    worker: { format: 'es' },
  },
});
