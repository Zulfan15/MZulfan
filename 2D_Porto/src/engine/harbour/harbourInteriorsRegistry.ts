import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import type { HarbourInteriorProp } from '../harbourInteriorShared';
import {
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
  LIGHTHOUSE_SPAWN,
  LIGHTHOUSE_COLLISION,
  LIGHTHOUSE_PROPS,
  renderLighthouseScene,
} from './lighthouseScene';
import {
  WAREHOUSE_COLS,
  WAREHOUSE_ROWS,
  WAREHOUSE_SPAWN,
  WAREHOUSE_COLLISION,
  WAREHOUSE_PROPS,
  renderWarehouseScene,
} from './warehouseScene';
import {
  INN_COLS,
  INN_ROWS,
  INN_SPAWN,
  INN_COLLISION,
  INN_PROPS,
  renderInnScene,
} from './innScene';
import {
  GALLEON_COLS,
  GALLEON_ROWS,
  GALLEON_SPAWN,
  GALLEON_COLLISION,
  GALLEON_PROPS,
  renderGalleonScene,
} from './galleonScene';
import {
  MARKET_COLS,
  MARKET_ROWS,
  MARKET_SPAWN,
  MARKET_COLLISION,
  MARKET_PROPS,
  renderMarketScene,
} from './marketScene';

export type HarbourInteriorSceneId =
  | 'harbour-lighthouse'
  | 'harbour-warehouse'
  | 'harbour-inn'
  | 'harbour-galleon'
  | 'harbour-market';

export interface HarbourInteriorConfig {
  id: HarbourInteriorSceneId;
  cols: number;
  rows: number;
  spawn: typeof LIGHTHOUSE_SPAWN;
  collision: Uint8Array;
  props: HarbourInteriorProp[];
  render: (ctx: CanvasRenderingContext2D, tick: number, pmdAnimator?: PokemonPMDAnimator) => void;
  exitRespawn: string;
  exitRoute: string;
  waveColor: string;
  pmPreloads: string[];
  digimonPreloads: string[];
  title: string;
  icon: string;
  guideText: string;
  labels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }>;
}

const REGISTRY: Record<HarbourInteriorSceneId, HarbourInteriorConfig> = {
  'harbour-lighthouse': {
    id: 'harbour-lighthouse',
    cols: LIGHTHOUSE_COLS,
    rows: LIGHTHOUSE_ROWS,
    spawn: LIGHTHOUSE_SPAWN,
    collision: LIGHTHOUSE_COLLISION,
    props: LIGHTHOUSE_PROPS,
    render: renderLighthouseScene,
    exitRespawn: '11,13,down',
    exitRoute: '/harbour?from=lighthouse',
    waveColor: '#fde047',
    pmPreloads: ['kyogre', 'palkia'],
    digimonPreloads: ['azulongmon'],
    title: 'Old Port Lighthouse',
    icon: '🗼',
    guideText:
      'Welcome inside Old Port Lighthouse (15×12)! Climb to the brass Fresnel chamber guarded by Kyogre, Palkia & Azulongmon.',
    labels: {
      kyogre: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'fresnel-lens': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'edge-radar': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'astrolabe-desk': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      palkia: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      azulongmon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'beacon-prism': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'signal-bell': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'spiral-stairs': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'harbour-warehouse': {
    id: 'harbour-warehouse',
    cols: WAREHOUSE_COLS,
    rows: WAREHOUSE_ROWS,
    spawn: WAREHOUSE_SPAWN,
    collision: WAREHOUSE_COLLISION,
    props: WAREHOUSE_PROPS,
    render: renderWarehouseScene,
    exitRespawn: '27,20,down',
    exitRoute: '/harbour?from=warehouse',
    waveColor: '#94a3b8',
    pmPreloads: ['gyarados', 'regigigas'],
    digimonPreloads: ['vikemon'],
    title: 'Customs & Cargo Warehouse',
    icon: '📦',
    guideText:
      'Welcome inside Customs & Cargo Warehouse (15×12)! Inspect data manifests and royal supply crates alongside Gyarados, Vikemon & Regigigas.',
    labels: {
      gyarados: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'crane-beam': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'manifest-ledger': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'royal-crates': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      vikemon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      regigigas: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'customs-scales': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'spice-barrels': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'sluice-gate': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'harbour-inn': {
    id: 'harbour-inn',
    cols: INN_COLS,
    rows: INN_ROWS,
    spawn: INN_SPAWN,
    collision: INN_COLLISION,
    props: INN_PROPS,
    render: renderInnScene,
    exitRespawn: '10,30,down',
    exitRoute: '/harbour?from=inn',
    waveColor: '#f87171',
    pmPreloads: ['urshifu', 'gardevoir'],
    digimonPreloads: ['plesiomon'],
    title: 'Harbourmaster Tudor Inn',
    icon: '🏡',
    guideText:
      'Welcome inside Harbourmaster Tudor Inn (15×12)! Enjoy warm spiced sea-tea and plan sea routes with Urshifu, Gardevoir & Plesiomon.',
    labels: {
      urshifu: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'tudor-hearth': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'tea-counter': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'ship-cabinet': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      gardevoir: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      plesiomon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'chart-table': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'sailors-log': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'garden-window': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'harbour-galleon': {
    id: 'harbour-galleon',
    cols: GALLEON_COLS,
    rows: GALLEON_ROWS,
    spawn: GALLEON_SPAWN,
    collision: GALLEON_COLLISION,
    props: GALLEON_PROPS,
    render: renderGalleonScene,
    exitRespawn: '30,40,down',
    exitRoute: '/harbour?from=galleon',
    waveColor: '#38bdf8',
    pmPreloads: ['garchomp'],
    digimonPreloads: ['neptunemon', 'metalseadramon'],
    title: 'The Sovereign Brigantine',
    icon: '🏴‍☠️',
    guideText:
      'Welcome aboard The Sovereign Brigantine (15×12)! Step into the Admiral’s Great Cabin guarded by Neptunemon, Garchomp & MetalSeadramon.',
    labels: {
      neptunemon: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'admiral-window': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'port-cannons': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'war-map': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      garchomp: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      metalseadramon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'brass-helm': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'treasure-chest': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'ship-bell': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'harbour-market': {
    id: 'harbour-market',
    cols: MARKET_COLS,
    rows: MARKET_ROWS,
    spawn: MARKET_SPAWN,
    collision: MARKET_COLLISION,
    props: MARKET_PROPS,
    render: renderMarketScene,
    exitRespawn: '7,34,down',
    exitRoute: '/harbour?from=market',
    waveColor: '#34d399',
    pmPreloads: ['celebi'],
    digimonPreloads: ['sakuyamon', 'herculeskabuterimon'],
    title: 'Dockside Market Pavilion',
    icon: '⛵',
    guideText:
      'Welcome to Dockside Market Pavilion (15×12)! Browse coastal trade stalls and the sandy coral terrace with Celebi, Sakuyamon & HerculesKabuterimon.',
    labels: {
      celebi: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'guild-crest-arch': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'cv-charter-stall': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'pigeon-roost': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      sakuyamon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      herculeskabuterimon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'coral-tidepool': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'pearl-counter': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'trade-ledger': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
};

export const HARBOUR_INTERIOR_IDS = Object.keys(REGISTRY) as HarbourInteriorSceneId[];

export function isHarbourInteriorScene(id: string): id is HarbourInteriorSceneId {
  return id in REGISTRY;
}

export function getHarbourScene(id: HarbourInteriorSceneId): HarbourInteriorConfig {
  return REGISTRY[id];
}

export function getHarbourInteriorConfig(id: string): HarbourInteriorConfig | null {
  return isHarbourInteriorScene(id) ? REGISTRY[id] : null;
}
