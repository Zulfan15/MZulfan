/**
 * Single place to configure where Holloknightmon's 4 image files are served from.
 * Override via `loadHolloknightmon('/custom/path')` when embedding in another app.
 */
export const HOLLOKNIGHTMON_DEFAULT_ASSET_BASE = '/assets/characters/holloknightmon';

export const HOLLOKNIGHTMON_ASSET_FILES = {
  idle: 'idle.jpg',
  walk: 'walk-cycle.jpg',
  battle: 'battle.jpg',
  sheet: 'holloknightmon.jpg',
} as const;

export function resolveHolloknightmonAssets(baseUrl = HOLLOKNIGHTMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${HOLLOKNIGHTMON_ASSET_FILES.idle}`,
    walk: `${clean}/${HOLLOKNIGHTMON_ASSET_FILES.walk}`,
    battle: `${clean}/${HOLLOKNIGHTMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${HOLLOKNIGHTMON_ASSET_FILES.sheet}`,
  };
}
