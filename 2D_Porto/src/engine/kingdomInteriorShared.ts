import type { Dir } from './types';

export const KINGDOM_INTERIOR_COLS = 15;
export const KINGDOM_INTERIOR_ROWS = 12;

export const KINGDOM_INTERIOR_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

export interface KingdomInteriorProp {
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

export function createKingdomInteriorBaseCollision(): Uint8Array {
  const w = KINGDOM_INTERIOR_COLS;
  const h = KINGDOM_INTERIOR_ROWS;
  const coll = new Uint8Array(w * h);

  // North stone fortress walls (rows 0..1)
  for (let y = 0; y <= 1; y++) {
    for (let x = 0; x < w; x++) {
      coll[y * w + x] = 1;
    }
  }

  // East & West castle perimeter walls
  for (let y = 0; y < h; y++) {
    coll[y * w + 0] = 1;
    coll[y * w + (w - 1)] = 1;
  }

  // South perimeter except center stone archway exit (7, 11)
  for (let x = 0; x < w; x++) {
    coll[(h - 1) * w + x] = x === 7 ? 0 : 1;
  }

  return coll;
}

// --- 7 Royal Crests Meta-Progression (persisted in localStorage) ---

export type RoyalCrestKey =
  | 'sovereignty'
  | 'steel'
  | 'fellowship'
  | 'arcana'
  | 'valor'
  | 'grace'
  | 'chivalry';

export interface RoyalCrestMeta {
  key: RoyalCrestKey;
  name: string;
  sanctum: string;
  route: string;
  icon: string;
  color: string;
  trial: string;
}

export const ROYAL_CRESTS_META: Record<RoyalCrestKey, RoyalCrestMeta> = {
  sovereignty: {
    key: 'sovereignty',
    name: 'Crest of Sovereignty',
    sanctum: 'Grand Throne Hall',
    route: '/kingdom/castle',
    icon: '👑',
    color: '#fbbf24',
    trial: 'Complete the 3-Question Royal Audience with Solgaleo',
  },
  steel: {
    key: 'steel',
    name: 'Crest of Steel',
    sanctum: 'Dragonflame Blacksmith',
    route: '/kingdom/blacksmith',
    icon: '⚒️',
    color: '#fb923c',
    trial: 'Strike the Anvil Timing Gauge 3× in the Gold Zone',
  },
  fellowship: {
    key: 'fellowship',
    name: 'Crest of Fellowship',
    sanctum: 'Golden Griffin Tavern',
    route: '/kingdom/tavern',
    icon: '🍺',
    color: '#f59e0b',
    trial: 'Inspect Missions & Share a Royal Feast with Snorlax',
  },
  arcana: {
    key: 'arcana',
    name: 'Crest of Arcana',
    sanctum: 'Astral Mage Sanctum',
    route: '/kingdom/mage-tower',
    icon: '🔮',
    color: '#a855f7',
    trial: 'Align the 5 ML Research Pipeline Star Runes',
  },
  valor: {
    key: 'valor',
    name: 'Crest of Valor',
    sanctum: "Knights' Barracks",
    route: '/kingdom/barracks',
    icon: '🛡️',
    color: '#38bdf8',
    trial: 'Land 3 Bullseyes in Lucario’s Archery Drill',
  },
  grace: {
    key: 'grace',
    name: 'Crest of Grace',
    sanctum: 'Saint Avalon Abbey',
    route: '/kingdom/chapel',
    icon: '⛪',
    color: '#60a5fa',
    trial: 'Harmonize the 3-Round Cathedral Bell Hymn with Lugia',
  },
  chivalry: {
    key: 'chivalry',
    name: 'Crest of Chivalry',
    sanctum: 'Royal Jousting Arena',
    route: '/kingdom/jousting',
    icon: '🐎',
    color: '#ef4444',
    trial: 'Best Koraidon in the Sand Lists Jousting Timing Duel',
  },
};

const CREST_STORAGE_KEY = 'avalon:kingdom:crests:v1';
const EXCALIBUR_STORAGE_KEY = 'avalon:kingdom:excalibur:v1';

export type RoyalCrestMap = Partial<Record<RoyalCrestKey, boolean>>;

export function getRoyalCrests(): RoyalCrestMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CREST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RoyalCrestMap) : {};
  } catch {
    return {};
  }
}

export function awardRoyalCrest(key: RoyalCrestKey): RoyalCrestMap {
  const current = getRoyalCrests();
  const next: RoyalCrestMap = { ...current, [key]: true };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CREST_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('kingdom:crest-updated', { detail: { key, crests: next } }));
    } catch {
      // ignore storage failure
    }
  }
  return next;
}

export function countRoyalCrests(): number {
  const crests = getRoyalCrests();
  return (Object.keys(ROYAL_CRESTS_META) as RoyalCrestKey[]).filter((k) => Boolean(crests[k])).length;
}

export function hasExcaliburAwakened(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(EXCALIBUR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function awakenExcalibur(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(EXCALIBUR_STORAGE_KEY, 'true');
    window.dispatchEvent(new CustomEvent('kingdom:excalibur-awakened'));
    return true;
  } catch {
    return false;
  }
}
