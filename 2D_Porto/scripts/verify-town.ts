/**
 * Build & Integrity Smoke Verification Script (`npm run verify`)
 * Checks:
 *  1. `src/data/profile.yaml` validates cleanly against ProfileSchema (Zod).
 *  2. `src/data/townLayout.json` buildings/NPCs are inside map bounds (0..44, 0..63).
 *  3. All PMD Pokémon entries in `PMD_POKEMON_CONFIGS` point to existing PNG files in `public/`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { ProfileSchema } from '../src/lib/schema';
import { PMD_POKEMON_CONFIGS } from '../src/engine/pokemonPMDAnimator';
import { COMPANIONS } from '../src/engine/pokemonCompanions';

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

// 2. Validate townLayout.json bounds
try {
  const layout = JSON.parse(readFileSync(resolve(root, 'src/data/townLayout.json'), 'utf8'));
  const buildings = Array.isArray(layout.buildings) ? layout.buildings : [];
  for (const b of buildings) {
    if (b.hidden) continue;
    if (b.x < 0 || b.y < 0 || b.x + (b.w || 1) > 45 || b.y + (b.h || 1) > 64) {
      fail(`Building/NPC "${b.id}" out of bounds (x=${b.x}, y=${b.y}, w=${b.w}, h=${b.h})`);
    }
  }
  console.log(`✅ townLayout.json valid (${buildings.length} entries inside 45x64 grid)`);
} catch (err) {
  fail(`Cannot validate townLayout.json: ${String(err)}`);
}

// 3. Validate PMD asset paths & Companion sync
let assetCount = 0;
for (const [id, cfg] of Object.entries(PMD_POKEMON_CONFIGS)) {
  const specs = [cfg.idle, cfg.walk, cfg.shoot, cfg.attack, cfg.rearUp].filter(Boolean);
  for (const spec of specs) {
    const rel = spec!.src.replace(/^\//, '');
    const full = resolve(root, 'public', rel);
    if (!existsSync(full)) {
      fail(`Missing PMD PNG for "${id}": ${full}`);
    } else {
      assetCount++;
    }
  }
}
console.log(`✅ PMD Assets verified (${Object.keys(PMD_POKEMON_CONFIGS).length} Pokémon, ${assetCount} sprite sheets)`);
console.log(`✅ Companions catalog loaded (${COMPANIONS.length} companions)`);

if (errors > 0) {
  console.error(`\n✖ Verification failed with ${errors} error(s).`);
  process.exit(1);
}
console.log('\n🎉 All Zulfan Town integrity checks passed!');
