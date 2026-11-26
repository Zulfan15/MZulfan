/**
 * Centralized browser storage helpers for Zulfan's Town.
 * Unifies legacy/duplicate localStorage keys (such as `town:activeFollower` vs
 * `town:active_follower`, and `arcade-sound` vs `sfx_enabled`).
 */
export const STORAGE_KEYS = {
  GAME_SAVE: 'zulfan_town_save',
  WELCOMED: 'zulfan_town_welcomed',
  SFX_ENABLED: 'sfx_enabled',
  BGM_ENABLED: 'bgm_enabled',
  BGM_THEME: 'bgm_theme',
  ARCADE_SOUND_LEGACY: 'arcade-sound',
  ACTIVE_FOLLOWER: 'town:active_follower',
  ACTIVE_FOLLOWER_LEGACY: 'town:activeFollower',
  DIGI_COMPANION: 'digimon:active_companion',
  ATMOSPHERE: 'town:atmosphere',
  WEATHER: 'town:weather',
  PANEL_LAYOUT: 'town:panel_layout',
  SKIP_TITLE: 'town:skip_title',
} as const;

export function getStoredActiveFollower(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const primary = localStorage.getItem(STORAGE_KEYS.ACTIVE_FOLLOWER);
    if (primary) {
      if (localStorage.getItem(STORAGE_KEYS.ACTIVE_FOLLOWER_LEGACY)) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_FOLLOWER_LEGACY);
      }
      return primary;
    }
    const legacy = localStorage.getItem(STORAGE_KEYS.ACTIVE_FOLLOWER_LEGACY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FOLLOWER, legacy);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FOLLOWER_LEGACY);
      return legacy;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export function setStoredActiveFollower(followerId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (followerId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FOLLOWER, followerId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FOLLOWER);
    }
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FOLLOWER_LEGACY);
  } catch {
    // ignore storage errors
  }
}

export function isStoredSfxEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const sfxRaw = localStorage.getItem(STORAGE_KEYS.SFX_ENABLED);
    if (sfxRaw !== null) {
      return sfxRaw !== '0';
    }
    const arcadeRaw = localStorage.getItem(STORAGE_KEYS.ARCADE_SOUND_LEGACY);
    if (arcadeRaw !== null) {
      return arcadeRaw === 'on';
    }
  } catch {
    // ignore storage errors
  }
  return true;
}

export function setStoredSfxEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SFX_ENABLED, enabled ? '1' : '0');
    localStorage.removeItem(STORAGE_KEYS.ARCADE_SOUND_LEGACY);
  } catch {
    // ignore storage errors
  }
}
