/**
 * Single place to configure where Mazagamon's 4 image files are served from.
 * Override via `loadMazagamon('/custom/path')` when embedding in another app.
 */
export const MAZAGAMON_DEFAULT_ASSET_BASE = '/assets/characters/mazagamon';

export const MAZAGAMON_ASSET_FILES = {
  idle: 'idle.png',
  walk: 'walk-cycle-v2.webp',
  battle: 'battle.webp',
  sheet: 'mazagamon.webp',
} as const;

export function resolveMazagamonAssets(baseUrl = MAZAGAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${MAZAGAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${MAZAGAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${MAZAGAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${MAZAGAMON_ASSET_FILES.sheet}`,
  };
}
