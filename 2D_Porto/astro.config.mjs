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
            const targetWorld =
              data?.target === 'digimon'
                ? 'digimon'
                : data?.target === 'kingdom'
                  ? 'kingdom'
                  : data?.target === 'dark-castle'
                    ? 'dark-castle'
                    : data?.target === 'harbour'
                      ? 'harbour'
                      : data?.target === 'sky-castle'
                        ? 'sky-castle'
                        : 'town';
            const targetFile =
              targetWorld === 'digimon'
                ? './src/data/digimonLayout.json'
                : targetWorld === 'kingdom'
                  ? './src/data/kingdomLayout.json'
                  : targetWorld === 'dark-castle'
                    ? './src/data/darkCastleLayout.json'
                    : targetWorld === 'harbour'
                      ? './src/data/harbourLayout.json'
                      : targetWorld === 'sky-castle'
                        ? './src/data/skyCastleLayout.json'
                        : './src/data/townLayout.json';
            const targetPath = fileURLToPath(new URL(targetFile, import.meta.url));
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
            res.end(
              JSON.stringify({
                success: true,
                target: targetWorld,
                message: `Saved ${targetWorld} layout to disk successfully`,
              })
            );
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
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'town-background',
                test: /src[\\/]engine[\\/]townBackground\.ts/,
                priority: 10,
              },
              {
                name: 'town-pokemon-fx',
                test: /src[\\/]engine[\\/]townPokemon(Fx|Overworld)\.ts/,
                priority: 10,
              },
              {
                name: 'town-pokemon-assets',
                test: /src[\\/]engine[\\/](pokemon(PMDAnimator|Companions)|.*Sprite)\.ts/,
                priority: 10,
              },
              {
                name: 'town-editor',
                test: /(src[\\/]engine[\\/]town(Editor|Config)\.ts|src[\\/]data[\\/]townLayout\.json)/,
                priority: 10,
              },
              {
                name: 'town-scenes',
                test: /src[\\/]engine[\\/](.*Scene\.ts|(digi|kingdom|darkCastle|harbour|skyCastle)(Map|Background|Assets|Catalog|SpriteLoader|Animator|monCatalog).*\.ts)/,
                priority: 10,
              },
              {
                name: 'town-engine',
                test: /src[\\/]engine[\\/]TownEngine\.ts/,
                priority: 5,
              },
            ],
          },
        },
      },
    },
  },
});
