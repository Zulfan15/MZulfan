/**
 * Single place to configure where Vamdramon's sprite sheets are served from.
 * Override via `loadVamdramon('/custom/path')` when embedding in another app.
 *
 * Once generated after quota reset, set `idle: 'idle-cycle.webp'`,
 * `walk: 'walk-cycle.webp'`, and `battle: 'battle.webp'`.
 */
export const VAMDRAMON_DEFAULT_ASSET_BASE = '/assets/characters/vamdramon';

export const VAMDRAMON_ASSET_FILES: {
  sheet: string;
  idle: string | null;
  walk: string | null;
  battle: string | null;
} = {
  sheet: 'vamdramon.webp',
  idle: null,
  walk: null,
  battle: null,
};

export function resolveVamdramonAssets(baseUrl = VAMDRAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    sheet: `${clean}/${VAMDRAMON_ASSET_FILES.sheet}`,
    idle: VAMDRAMON_ASSET_FILES.idle ? `${clean}/${VAMDRAMON_ASSET_FILES.idle}` : null,
    walk: VAMDRAMON_ASSET_FILES.walk ? `${clean}/${VAMDRAMON_ASSET_FILES.walk}` : null,
    battle: VAMDRAMON_ASSET_FILES.battle ? `${clean}/${VAMDRAMON_ASSET_FILES.battle}` : null,
  };
}
