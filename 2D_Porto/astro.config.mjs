// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @param {import('node:http').IncomingMessage} req */
async function readJsonBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  return JSON.parse(body || '{}');
}

/**
 * @param {import('node:http').ServerResponse} res
 * @param {number} statusCode
 * @param {unknown} payload
 */
function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

/**
 * @param {unknown} raw
 * @param {number} maxLen
 * @returns {string}
 */
function sanitizeDevText(raw, maxLen) {
  return typeof raw === 'string'
    ? raw.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen)
    : '';
}

function devSocialApiPlugin() {
  /** @type {Array<{ id: string; name: string; org?: string; badgeRole: string; avatar: string; stamp: string; message: string; createdAt: string }>} */
  const entries = [
    {
      id: 'seed-1',
      name: 'Sarah K.',
      org: 'Cloud & AI Talent Acquisition',
      badgeRole: 'Recruiter',
      avatar: '⚡',
      stamp: '💼 Recruiter Visited',
      message: 'Loved the interactive town concept and live system architecture cards. Super memorable portfolio!',
      createdAt: '2026-11-14T09:30:00.000Z',
    },
    {
      id: 'seed-2',
      name: 'Dr. Hendra R.',
      org: 'ITENAS Informatics Mentor',
      badgeRole: 'Fellow Developer',
      avatar: '🧬',
      stamp: '🚀 10/10 Engineering',
      message: '99.56% thesis benchmark plus TensorRT FP16 edge vision pipeline — solid engineering rigor.',
      createdAt: '2026-11-12T14:20:00.000Z',
    },
    {
      id: 'seed-3',
      name: 'Rafi P.',
      org: 'Backend Guild',
      badgeRole: 'Fellow Developer',
      avatar: '🔥',
      stamp: '💡 Great Architecture',
      message: 'FoodLink Kafka outbox + Redis mutex lock deep dive in Dev Center is genuinely insightful.',
      createdAt: '2026-11-10T18:45:00.000Z',
    },
    {
      id: 'seed-4',
      name: 'Nadia W.',
      org: 'Kanto Explorer',
      badgeRole: 'Trainer',
      avatar: '🌙',
      stamp: '🌟 Awesome Portfolio!',
      message: 'Found Digi-Sanctuary and took a PokéSnap with Lunala at sunset! GG on the pixel art.',
      createdAt: '2026-11-08T11:10:00.000Z',
    },
  ];

  /** @type {Record<string, { impressive: number; cool: number; arch: number }>} */
  const reactions = {
    aeroscan: { impressive: 18, cool: 14, arch: 11 },
    foodlink: { impressive: 15, cool: 11, arch: 16 },
    thesis: { impressive: 14, cool: 9, arch: 12 },
    'omr-grader': { impressive: 9, cool: 10, arch: 7 },
    foodrescue: { impressive: 11, cool: 8, arch: 9 },
    inception: { impressive: 8, cool: 7, arch: 6 },
    'rc-tank': { impressive: 12, cool: 15, arch: 8 },
  };

  return {
    name: 'dev-social-api-plugin',
    // @ts-ignore
    configureServer(server) {
      // @ts-ignore
      server.middlewares.use('/api/guestbook', async (req, res, next) => {
        if (req.method === 'GET') {
          return sendJson(res, 200, { entries, source: 'memory' });
        }
        if (req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const message = sanitizeDevText(body.message, 160);
            if (message.length < 2) {
              return sendJson(res, 400, { error: 'Message must be between 2 and 160 characters.' });
            }
            const allowedRoles = ['Recruiter', 'Fellow Developer', 'Trainer', 'Guest'];
            const rawRole = sanitizeDevText(body.badgeRole, 24);
            const entry = {
              id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: sanitizeDevText(body.name, 36) || 'Trainer Guest',
              org: sanitizeDevText(body.org, 44) || undefined,
              badgeRole: allowedRoles.includes(rawRole) ? rawRole : 'Guest',
              avatar: sanitizeDevText(body.avatar, 8) || '🧢',
              stamp: sanitizeDevText(body.stamp, 36) || '🌟 Awesome Portfolio!',
              message,
              createdAt: new Date().toISOString(),
            };
            entries.unshift(entry);
            if (entries.length > 50) entries.length = 50;
            return sendJson(res, 201, { entry, entries, source: 'memory' });
          } catch {
            return sendJson(res, 400, { error: 'Invalid JSON payload.' });
          }
        }
        return next();
      });

      // @ts-ignore
      server.middlewares.use('/api/reactions', async (req, res, next) => {
        if (req.method === 'GET') {
          return sendJson(res, 200, { counts: reactions, source: 'memory' });
        }
        if (req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const projectId = sanitizeDevText(body.projectId, 32).toLowerCase();
            const rawKind = sanitizeDevText(body.kind, 16);
            const delta = body.delta === -1 ? -1 : 1;
            if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
              return sendJson(res, 400, { error: 'Invalid projectId.' });
            }
            if (rawKind !== 'impressive' && rawKind !== 'cool' && rawKind !== 'arch') {
              return sendJson(res, 400, { error: 'Invalid reaction kind.' });
            }
            const cur = reactions[projectId] || { impressive: 0, cool: 0, arch: 0 };
            cur[rawKind] = Math.max(0, (cur[rawKind] || 0) + delta);
            reactions[projectId] = cur;
            return sendJson(res, 200, { projectId, counts: reactions, source: 'memory' });
          } catch {
            return sendJson(res, 400, { error: 'Invalid JSON payload.' });
          }
        }
        return next();
      });
    },
  };
}

function townEditorDevPlugin() {
  return {
    name: 'town-editor-dev-plugin',
    // @ts-ignore
    configureServer(server) {
      // @ts-ignore
      server.middlewares.use('/api/dev/save-town', async (req, res, next) => {
        if (req.method === 'POST') {
          try {
            const data = await readJsonBody(req);
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
    plugins: [tailwindcss(), townEditorDevPlugin(), devSocialApiPlugin()],
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
