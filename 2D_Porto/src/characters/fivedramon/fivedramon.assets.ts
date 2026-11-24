/**
 * Single place to configure where Fivedramon's 4 image files are served from.
 * Override via `loadFivedramon('/custom/path')` when embedding in another app.
 */
export const FIVEDRAMON_DEFAULT_ASSET_BASE = '/assets/characters/fivedramon';

export const FIVEDRAMON_ASSET_FILES = {
  idle: 'idle.png',
  walk: 'walk-cycle.png',
  battle: 'battle.png',
  sheet: 'fivedramon.webp',
} as const;

export function resolveFivedramonAssets(baseUrl = FIVEDRAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${FIVEDRAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${FIVEDRAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${FIVEDRAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${FIVEDRAMON_ASSET_FILES.sheet}`,
  };
}
