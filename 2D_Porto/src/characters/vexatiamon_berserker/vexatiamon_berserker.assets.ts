/**
 * Single place to configure where Vexatiamon Berserker's sprite sheets are served from.
 * Override via `loadVexatiamonBerserker('/custom/path')` when embedding in another app.
 *
 * Once generated after quota reset, set `idle: 'idle-cycle.webp'`,
 * `walk: 'walk-cycle.webp'`, and `battle: 'battle.webp'`.
 */
export const VEXATIAMON_BERSERKER_DEFAULT_ASSET_BASE =
  '/assets/characters/vexatiamon_berserker';

export const VEXATIAMON_BERSERKER_ASSET_FILES: {
  sheet: string;
  idle: string | null;
  walk: string | null;
  battle: string | null;
} = {
  sheet: 'vexatiamon_berserker.webp',
  idle: null,
  walk: null,
  battle: null,
};

export function resolveVexatiamonBerserkerAssets(
  baseUrl = VEXATIAMON_BERSERKER_DEFAULT_ASSET_BASE
) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    sheet: `${clean}/${VEXATIAMON_BERSERKER_ASSET_FILES.sheet}`,
    idle: VEXATIAMON_BERSERKER_ASSET_FILES.idle
      ? `${clean}/${VEXATIAMON_BERSERKER_ASSET_FILES.idle}`
      : null,
    walk: VEXATIAMON_BERSERKER_ASSET_FILES.walk
      ? `${clean}/${VEXATIAMON_BERSERKER_ASSET_FILES.walk}`
      : null,
    battle: VEXATIAMON_BERSERKER_ASSET_FILES.battle
      ? `${clean}/${VEXATIAMON_BERSERKER_ASSET_FILES.battle}`
      : null,
  };
}
