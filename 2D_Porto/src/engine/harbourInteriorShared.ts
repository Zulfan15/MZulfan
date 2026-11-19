import type { Dir } from './types';

export const HARBOUR_INTERIOR_COLS = 15;
export const HARBOUR_INTERIOR_ROWS = 12;

export const HARBOUR_INTERIOR_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

export interface HarbourInteriorProp {
  id: string;
  kind: 'npc' | 'prop' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: { type: 'event'; name: string } | { type: 'place'; id: string } | { type: 'note'; text: string };
  label: string;
  style: string;
  labelLift?: number;
  hideLabel?: boolean;
  hint?: string;
  scrollTarget?: string;
}

export function createHarbourInteriorBaseCollision(): Uint8Array {
  const w = HARBOUR_INTERIOR_COLS;
  const h = HARBOUR_INTERIOR_ROWS;
  const coll = new Uint8Array(w * h);

  // North coastal stone fortress wall (rows 0..1)
  for (let y = 0; y <= 1; y++) {
    for (let x = 0; x < w; x++) {
      coll[y * w + x] = 1;
    }
  }

  // West & East perimeter masonry / timber hull walls
  for (let y = 0; y < h; y++) {
    coll[y * w + 0] = 1;
    coll[y * w + (w - 1)] = 1;
  }

  // South perimeter except center stone gangway exit (7, 11)
  for (let x = 0; x < w; x++) {
    coll[(h - 1) * w + x] = x === 7 ? 0 : 1;
  }

  return coll;
}

// --- 5 Royal Maritime Seals Meta-Progression (persisted in localStorage) ---

export type MaritimeSealKey =
  | 'beacon'
  | 'quartermaster'
  | 'navigator'
  | 'armada'
  | 'guild';

export interface MaritimeSealMeta {
  key: MaritimeSealKey;
  name: string;
  sanctum: string;
  route: string;
  icon: string;
  color: string;
  trial: string;
}

export const MARITIME_SEALS_META: Record<MaritimeSealKey, MaritimeSealMeta> = {
  beacon: {
    key: 'beacon',
    name: 'Seal of the Beacon',
    sanctum: 'Old Port Lighthouse',
    route: '/harbour/lighthouse',
    icon: '🗼',
    color: '#fbbf24',
    trial: 'Align the 4 Brass Fresnel Mirrors with Kyogre to guide the Royal Fleet',
  },
  quartermaster: {
    key: 'quartermaster',
    name: 'Seal of the Quartermaster',
    sanctum: 'Customs & Cargo Warehouse',
    route: '/harbour/warehouse',
    icon: '📦',
    color: '#94a3b8',
    trial: 'Balance & Dispatch 4 Imperial Supply Crates for Gyarados',
  },
  navigator: {
    key: 'navigator',
    name: 'Seal of the Navigator',
    sanctum: 'Harbourmaster Tudor Inn',
    route: '/harbour/inn',
    icon: '🧭',
    color: '#f87171',
    trial: 'Plot a 4-Waypoint Sea Route across the Azure Archipelago with Urshifu',
  },
  armada: {
    key: 'armada',
    name: 'Seal of the Armada',
    sanctum: 'The Sovereign Brigantine',
    route: '/harbour/galleon',
    icon: '🏴‍☠️',
    color: '#38bdf8',
    trial: 'Steer the Helm & Fire a Royal Salute under Lord Admiral Neptunemon',
  },
  guild: {
    key: 'guild',
    name: 'Seal of the Guild',
    sanctum: 'Dockside Market Pavilion',
    route: '/harbour/market',
    icon: '⚖️',
    color: '#34d399',
    trial: 'Match 3 Royal Trade Contracts at Celebi’s Merchant Appraisal Scales',
  },
};

const SEAL_STORAGE_KEY = 'avalon:harbour:seals:v1';
const VOYAGE_STORAGE_KEY = 'avalon:harbour:voyage:v1';

export type MaritimeSealMap = Partial<Record<MaritimeSealKey, boolean>>;

export function getMaritimeSeals(): MaritimeSealMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SEAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MaritimeSealMap) : {};
  } catch {
    return {};
  }
}

export function awardMaritimeSeal(key: MaritimeSealKey): MaritimeSealMap {
  const current = getMaritimeSeals();
  const next: MaritimeSealMap = { ...current, [key]: true };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SEAL_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('harbour:seal-updated', { detail: { key, seals: next } }));
    } catch {
      // ignore storage failure
    }
  }
  return next;
}

export function countMaritimeSeals(): number {
  const seals = getMaritimeSeals();
  return (Object.keys(MARITIME_SEALS_META) as MaritimeSealKey[]).filter((k) => Boolean(seals[k])).length;
}

export function hasVoyageAwakened(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(VOYAGE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function awakenVoyage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(VOYAGE_STORAGE_KEY, 'true');
    window.dispatchEvent(new CustomEvent('harbour:voyage-awakened'));
    return true;
  } catch {
    return false;
  }
}
