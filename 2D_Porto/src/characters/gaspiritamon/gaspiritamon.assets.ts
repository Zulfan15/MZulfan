/**
 * Single place to configure where Gaspiritamon's 3 image files are served from.
 * Override via `loadGaspiritamon('/custom/path')` when embedding in another app.
 */
export const GASPIRITAMON_DEFAULT_ASSET_BASE = '/assets/characters/gaspiritamon';

export const GASPIRITAMON_ASSET_FILES = {
  walk: 'walk-cycle.jpg',
  battle: 'battle.jpg',
  sheet: 'gaspiritamon.jpg',
} as const;

export function resolveGaspiritamonAssets(baseUrl = GASPIRITAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    walk: `${clean}/${GASPIRITAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${GASPIRITAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${GASPIRITAMON_ASSET_FILES.sheet}`,
  };
}
