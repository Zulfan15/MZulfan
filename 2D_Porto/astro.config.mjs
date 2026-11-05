// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function townEditorDevPlugin() {
  return {
    name: 'town-editor-dev-plugin',
    // @ts-ignore
    configureServer(server) {
      // @ts-ignore
      server.middlewares.use('/api/dev/save-town', async (req, res, next) => {
        if (req.method === 'POST') {
          try {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const data = JSON.parse(body);
            const targetPath = fileURLToPath(new URL('./src/data/townLayout.json', import.meta.url));
            await fs.mkdir(path.dirname(targetPath), { recursive: true });
            const payload = {
              version: 2,
              updatedAt: new Date().toISOString(),
              buildings: Array.isArray(data.buildings) ? data.buildings : [],
              tiles: Array.isArray(data.tiles) ? data.tiles : []
            };
            await fs.writeFile(targetPath, JSON.stringify(payload, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Saved to disk successfully' }));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: String(err) }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  // Update this once the Cloudflare Worker has a custom domain.
  site: 'https://zulfan-town.workers.dev',
  output: 'static',
  trailingSlash: 'ignore',
  redirects: {
    '/town': '/',
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss(), townEditorDevPlugin()],
    worker: { format: 'es' },
  },
});
