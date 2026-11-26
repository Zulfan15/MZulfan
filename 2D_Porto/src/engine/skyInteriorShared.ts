import type { Dir } from './types';

export const SKY_INTERIOR_COLS = 15;
export const SKY_INTERIOR_ROWS = 12;

export const SKY_INTERIOR_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

export interface SkyInteriorProp {
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

export function createSkyInteriorBaseCollision(): Uint8Array {
  const w = SKY_INTERIOR_COLS;
  const h = SKY_INTERIOR_ROWS;
  const coll = new Uint8Array(w * h);

  // North cloud-citadel upper wall (rows 0..1)
  for (let y = 0; y <= 1; y++) {
    for (let x = 0; x < w; x++) {
      coll[y * w + x] = 1;
    }
  }

  // West & East perimeter walls
  for (let y = 0; y < h; y++) {
    coll[y * w + 0] = 1;
    coll[y * w + (w - 1)] = 1;
  }

  // South perimeter except center skyway exit at (7, 11)
  for (let x = 0; x < w; x++) {
    coll[(h - 1) * w + x] = x === 7 ? 0 : 1;
  }

  return coll;
}

// --- 6 Celestial Plumes Meta-Progression (persisted in localStorage) ---

export type SkyPlumeKey =
  | 'sovereignty'
  | 'gale'
  | 'thrust'
  | 'hearth'
  | 'starlight'
  | 'radiance';

export interface SkyPlumeMeta {
  key: SkyPlumeKey;
  name: string;
  sanctum: string;
  route: string;
  icon: string;
  color: string;
  trial: string;
}

export const SKY_PLUMES_META: Record<SkyPlumeKey, SkyPlumeMeta> = {
  sovereignty: {
    key: 'sovereignty',
    name: 'Plume of Sovereignty',
    sanctum: 'White Marble Sky Citadel',
    route: '/sky-castle/citadel',
    icon: '👑',
    color: '#38bdf8',
    trial: 'Synchronize all 3 Flagship Architecture Pillars beside Rayquaza',
  },
  gale: {
    key: 'gale',
    name: 'Plume of Gale',
    sanctum: 'Upper Cloud Windmill',
    route: '/sky-castle/windmill',
    icon: '🌬️',
    color: '#fbbf24',
    trial: 'Calibrate the 4 AeroScan Turbine Blades to <2 ms / >500 FPS with Latios',
  },
  thrust: {
    key: 'thrust',
    name: 'Plume of Thrust',
    sanctum: 'Lower Sky-Dock Workshop',
    route: '/sky-castle/workshop',
    icon: '⚙️',
    color: '#22d3ee',
    trial: 'Activate the 4-Stage ESP32 & Robotics Telemetry Circuit with Reshiram',
  },
  hearth: {
    key: 'hearth',
    name: 'Plume of Hearth',
    sanctum: 'Cloudhaven Timber Inn',
    route: '/sky-castle/inn',
    icon: '🏠',
    color: '#f59e0b',
    trial: 'Serve 3 Sky-Berry Fellowship & Lab Mentoring Orders beside Latias',
  },
  starlight: {
    key: 'starlight',
    name: 'Plume of Starlight',
    sanctum: 'Golden Astral Observatory',
    route: '/sky-castle/observatory',
    icon: '🔭',
    color: '#c084fc',
    trial: 'Align the 4 Amethyst Research Lenses (99.56% F1 & Transfer Learning) with Deoxys',
  },
  radiance: {
    key: 'radiance',
    name: 'Plume of Radiance',
    sanctum: 'Radiant Sky Chapel',
    route: '/sky-castle/chapel',
    icon: '⛪',
    color: '#60a5fa',
    trial: 'Harmonize the 3 Sapphire Sky-Bell Hymns with Arceus',
  },
};

const PLUME_STORAGE_KEY = 'avalon:sky:plumes:v1';
const CRYSTAL_STORAGE_KEY = 'avalon:sky:crystal:v1';

export type SkyPlumeMap = Partial<Record<SkyPlumeKey, boolean>>;

export function getSkyPlumes(): SkyPlumeMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PLUME_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SkyPlumeMap) : {};
  } catch {
    return {};
  }
}

export function awardSkyPlume(key: SkyPlumeKey): SkyPlumeMap {
  const current = getSkyPlumes();
  const next: SkyPlumeMap = { ...current, [key]: true };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PLUME_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('sky:plume-updated', { detail: { key, plumes: next } }));
    } catch {
      // ignore storage failure
    }
  }
  return next;
}

export function countSkyPlumes(): number {
  const plumes = getSkyPlumes();
  return (Object.keys(SKY_PLUMES_META) as SkyPlumeKey[]).filter((k) => Boolean(plumes[k])).length;
}

export function hasCrystalAwakened(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CRYSTAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function awakenSkyCrystal(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(CRYSTAL_STORAGE_KEY, 'true');
    window.dispatchEvent(new CustomEvent('sky:crystal-awakened'));
    return true;
  } catch {
    return false;
  }
}
