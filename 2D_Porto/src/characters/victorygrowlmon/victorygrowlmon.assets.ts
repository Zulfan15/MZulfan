/**
 * Single place to configure where VictoryGrowlmon's 4 image files are served from.
 * Override via `loadVictoryGrowlmon('/custom/path')` when embedding in another app.
 */
export const VICTORYGROWLMON_DEFAULT_ASSET_BASE = '/assets/characters/victorygrowlmon';

export const VICTORYGROWLMON_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'victorygrowlmon.webp',
} as const;

export function resolveVictoryGrowlmonAssets(baseUrl = VICTORYGROWLMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${VICTORYGROWLMON_ASSET_FILES.idle}`,
    walk: `${clean}/${VICTORYGROWLMON_ASSET_FILES.walk}`,
    battle: `${clean}/${VICTORYGROWLMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${VICTORYGROWLMON_ASSET_FILES.sheet}`,
  };
}
