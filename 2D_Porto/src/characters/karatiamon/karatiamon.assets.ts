/**
 * Single place to configure where Karatiamon's 4 image files are served from.
 * Override via `loadKaratiamon('/custom/path')` when embedding in another app.
 */
export const KARATIAMON_DEFAULT_ASSET_BASE = '/assets/characters/karatiamon';

export const KARATIAMON_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'karatiamon.webp',
} as const;

export function resolveKaratiamonAssets(baseUrl = KARATIAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${KARATIAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${KARATIAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${KARATIAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${KARATIAMON_ASSET_FILES.sheet}`,
  };
}
