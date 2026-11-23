/**
 * Single place to configure where Ragnaloardmon's 5 image files are served from.
 * Override via `loadRagnaloardmon('/custom/path')` when embedding in another app.
 */
export const RAGNALOARDMON_DEFAULT_ASSET_BASE = '/assets/characters/ragnaloardmon';

export const RAGNALOARDMON_ASSET_FILES = {
  idle: 'idle.png',
  walk: 'walk-cycle.jpg',
  battle: 'battle.jpg',
  sheet: 'ragnaloardmon.jpg',
  ds: 'ragnaloardmon-ds.jpg',
} as const;

export function resolveRagnaloardmonAssets(baseUrl = RAGNALOARDMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${RAGNALOARDMON_ASSET_FILES.idle}`,
    walk: `${clean}/${RAGNALOARDMON_ASSET_FILES.walk}`,
    battle: `${clean}/${RAGNALOARDMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${RAGNALOARDMON_ASSET_FILES.sheet}`,
    ds: `${clean}/${RAGNALOARDMON_ASSET_FILES.ds}`,
  };
}
