/**
 * Single place to configure where Plusiamon's 5 image files are served from.
 * Override via `loadPlusiamon('/custom/path')` when embedding in another app.
 */
export const PLUSIAMON_DEFAULT_ASSET_BASE = '/assets/characters/plusiamon';

export const PLUSIAMON_ASSET_FILES = {
  idle: 'idle.png',
  walk: 'walk-cycle.png',
  battle: 'battle.png',
  sheet: 'plusiamon.jpg',
  ds: 'plusiamon-ds.png',
} as const;

export function resolvePlusiamonAssets(baseUrl = PLUSIAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${PLUSIAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${PLUSIAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${PLUSIAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${PLUSIAMON_ASSET_FILES.sheet}`,
    ds: `${clean}/${PLUSIAMON_ASSET_FILES.ds}`,
  };
}
