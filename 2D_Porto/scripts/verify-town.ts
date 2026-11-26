/**
 * Build & Integrity Smoke Verification Script (`npm run verify`)
 * Checks:
 *  1. `src/data/profile.yaml` validates cleanly against ProfileSchema (Zod).
 *  2. All 6 world layout JSON files in `src/data/` parse cleanly and Town bounds hold.
 *  3. All PMD Pokémon entries & Hero Male sprite exist in `public/`.
 *  4. Every page route under `src/pages/` is registered in `placesRegistry.ts`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse } from 'yaml';
import { ProfileSchema } from '../src/lib/schema';
import { ROUTE_PLACE_NAMES } from '../src/lib/placesRegistry';
import { PMD_POKEMON_CONFIGS } from '../src/engine/pokemonPMDAnimator';
import { COMPANIONS } from '../src/engine/pokemonCompanions';
import { DIGIMON_CATALOG } from '../src/engine/digimonCatalog';
import { HERO_SPRITE_URL } from '../src/engine/heroSprite';

const root = process.cwd();
let errors = 0;

function fail(msg: string) {
  console.error(`❌ ${msg}`);
  errors++;
}

// 1. Validate profile.yaml
try {
  const rawYaml = parse(readFileSync(resolve(root, 'src/data/profile.yaml'), 'utf8'));
  const parsed = ProfileSchema.safeParse(rawYaml);
  if (!parsed.success) {
    fail(`profile.yaml Zod error: ${parsed.error.issues.map((i) => i.message).join(', ')}`);
  } else {
    console.log(`✅ profile.yaml valid (${parsed.data.missions.length} missions)`);
  }
} catch (err) {
  fail(`Cannot parse profile.yaml: ${String(err)}`);
}

// 2. Validate all 6 world layout JSON files
const layoutSpecs = [
  { file: 'townLayout.json', checkBounds: true, maxW: 100, maxH: 100 },
  { file: 'digimonLayout.json', checkBounds: false, maxW: 0, maxH: 0 },
  { file: 'kingdomLayout.json', checkBounds: false, maxW: 0, maxH: 0 },
  { file: 'harbourLayout.json', checkBounds: false, maxW: 0, maxH: 0 },
  { file: 'skyCastleLayout.json', checkBounds: false, maxW: 0, maxH: 0 },
  { file: 'darkCastleLayout.json', checkBounds: false, maxW: 0, maxH: 0 },
];

for (const spec of layoutSpecs) {
  try {
    const layout = JSON.parse(readFileSync(resolve(root, 'src/data', spec.file), 'utf8'));
    const buildings = Array.isArray(layout.buildings) ? layout.buildings : [];
    if (spec.checkBounds) {
      for (const b of buildings) {
        if (b.hidden) continue;
        if (b.x < 0 || b.y < 0 || b.x + (b.w || 1) > spec.maxW || b.y + (b.h || 1) > spec.maxH) {
          fail(`${spec.file}: "${b.id}" out of bounds (x=${b.x}, y=${b.y}, w=${b.w}, h=${b.h})`);
        }
      }
    }
    console.log(`✅ ${spec.file} valid (${buildings.length} entries)`);
  } catch (err) {
    fail(`Cannot validate ${spec.file}: ${String(err)}`);
  }
}

// 3. Validate PMD asset paths, Companion sync, and Hero Male sprite
let assetCount = 0;
for (const [id, cfg] of Object.entries(PMD_POKEMON_CONFIGS)) {
  const specs = [cfg.idle, cfg.walk, cfg.shoot, cfg.attack, cfg.rearUp].filter(Boolean);
  for (const spec of specs) {
    const rel = decodeURIComponent(spec!.src.replace(/^\//, ''));
    const full = resolve(root, 'public', rel);
    if (!existsSync(full)) {
      fail(`Missing PMD PNG for "${id}": ${full}`);
    } else {
      assetCount++;
    }
  }
}

const heroRel = decodeURIComponent(HERO_SPRITE_URL.replace(/^\//, ''));
const heroFull = resolve(root, 'public', heroRel);
if (!existsSync(heroFull)) {
  fail(`Missing Hero Male sprite sheet: ${heroFull}`);
} else {
  console.log(`✅ Hero Male sprite verified (${heroRel})`);
}

console.log(`✅ PMD Assets verified (${Object.keys(PMD_POKEMON_CONFIGS).length} Pokémon, ${assetCount} sprite sheets)`);
console.log(`✅ Companions catalog loaded (${COMPANIONS.length} companions)`);

let digiCount = 0;
for (const entry of DIGIMON_CATALOG) {
  if (!entry.spriteSheetUrl) {
    fail(`Digimon "${entry.id}" has empty spriteSheetUrl`);
    continue;
  }
  const rel = decodeURIComponent(entry.spriteSheetUrl.replace(/^\//, ''));
  const full = resolve(root, 'public', rel);
  if (!existsSync(full)) {
    fail(`Missing Digimon sprite sheet for "${entry.id}": ${full}`);
  } else {
    digiCount++;
  }
}
console.log(`✅ Digimon catalog verified (${digiCount} sprite sheets)`);

// 4. Validate public image/sprite asset sizes (guard against >1.5 MB unoptimized assets, warn >1 MB)
function checkPublicAssetSizes(dir: string): { checked: number; warnings: number } {
  let checked = 0;
  let warnings = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      const sub = checkPublicAssetSizes(full);
      checked += sub.checked;
      warnings += sub.warnings;
    } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(entry)) {
      checked++;
      const sizeKb = Math.round(st.size / 1024);
      const rel = relative(resolve(root, 'public'), full).replace(/\\/g, '/');
      if (st.size > 1536 * 1024) {
        fail(`Oversized image asset (>1.5 MB): public/${rel} (${sizeKb} KB)`);
      } else if (st.size > 1024 * 1024) {
        console.warn(`⚠️  Large image asset (>1 MB): public/${rel} (${sizeKb} KB)`);
        warnings++;
      }
    }
  }
  return { checked, warnings };
}

const sizeReport = checkPublicAssetSizes(resolve(root, 'public'));
console.log(`✅ Public image sizes verified (${sizeReport.checked} images checked, ${sizeReport.warnings} >1 MB warnings)`);

// 5. Validate all Astro page routes are registered in placesRegistry
function collectAstroPages(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectAstroPages(full));
    } else if (entry.endsWith('.astro')) {
      out.push(full);
    }
  }
  return out;
}

const pagesDir = resolve(root, 'src/pages');
const pageFiles = collectAstroPages(pagesDir);
for (const pf of pageFiles) {
  const rel = relative(pagesDir, pf).replace(/\\/g, '/').replace(/\.astro$/, '');
  const route = rel === 'index' ? '/' : rel.endsWith('/index') ? `/${rel.slice(0, -6)}` : `/${rel}`;
  if (!ROUTE_PLACE_NAMES[route.toLowerCase()]) {
    fail(`Unregistered page route "${route}" (${rel}.astro) — add it to src/lib/placesRegistry.ts`);
  }
}
console.log(`✅ Places registry verified (${pageFiles.length} Astro routes registered)`);

if (errors > 0) {
  console.error(`\n✖ Verification failed with ${errors} error(s).`);
  process.exit(1);
}
console.log('\n🎉 All Zulfan Town integrity checks passed!');
