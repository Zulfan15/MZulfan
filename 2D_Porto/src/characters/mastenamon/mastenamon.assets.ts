/**
 * Single place to configure where Mastenamon's 4 image files are served from.
 * Override via `loadMastenamon('/custom/path')` when embedding in another app.
 */
export const MASTENAMON_DEFAULT_ASSET_BASE = '/assets/characters/mastenamon';

export const MASTENAMON_ASSET_FILES = {
  idle: 'idle.png',
  walk: 'walk-cycle.webp',
  battle: 'battle.png',
  sheet: 'mastenamon.webp',
} as const;

export function resolveMastenamonAssets(baseUrl = MASTENAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${MASTENAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${MASTENAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${MASTENAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${MASTENAMON_ASSET_FILES.sheet}`,
  };
}
