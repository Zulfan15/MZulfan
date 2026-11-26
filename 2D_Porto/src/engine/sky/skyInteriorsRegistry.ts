import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import type { SkyInteriorProp } from '../skyInteriorShared';
import {
  CITADEL_COLS,
  CITADEL_ROWS,
  CITADEL_SPAWN,
  CITADEL_COLLISION,
  CITADEL_PROPS,
  renderCitadelScene,
} from './citadelScene';
import {
  WINDMILL_COLS,
  WINDMILL_ROWS,
  WINDMILL_SPAWN,
  WINDMILL_COLLISION,
  WINDMILL_PROPS,
  renderWindmillScene,
} from './windmillScene';
import {
  WORKSHOP_COLS,
  WORKSHOP_ROWS,
  WORKSHOP_SPAWN,
  WORKSHOP_COLLISION,
  WORKSHOP_PROPS,
  renderWorkshopScene,
} from './workshopScene';
import {
  INN_COLS,
  INN_ROWS,
  INN_SPAWN,
  INN_COLLISION,
  INN_PROPS,
  renderInnScene,
} from './innScene';
import {
  OBSERVATORY_COLS,
  OBSERVATORY_ROWS,
  OBSERVATORY_SPAWN,
  OBSERVATORY_COLLISION,
  OBSERVATORY_PROPS,
  renderObservatoryScene,
} from './observatoryScene';
import {
  CHAPEL_COLS,
  CHAPEL_ROWS,
  CHAPEL_SPAWN,
  CHAPEL_COLLISION,
  CHAPEL_PROPS,
  renderChapelScene,
} from './chapelScene';

export type SkyInteriorSceneId =
  | 'sky-citadel'
  | 'sky-windmill'
  | 'sky-workshop'
  | 'sky-inn'
  | 'sky-observatory'
  | 'sky-chapel';

export interface SkyInteriorConfig {
  id: SkyInteriorSceneId;
  cols: number;
  rows: number;
  spawn: typeof CITADEL_SPAWN;
  collision: Uint8Array;
  props: SkyInteriorProp[];
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

const REGISTRY: Record<SkyInteriorSceneId, SkyInteriorConfig> = {
  'sky-citadel': {
    id: 'sky-citadel',
    cols: CITADEL_COLS,
    rows: CITADEL_ROWS,
    spawn: CITADEL_SPAWN,
    collision: CITADEL_COLLISION,
    props: CITADEL_PROPS,
    render: renderCitadelScene,
    exitRespawn: '22,15,down',
    exitRoute: '/sky-castle?from=citadel',
    waveColor: '#38bdf8',
    pmPreloads: ['rayquaza'],
    digimonPreloads: ['imp_paladin', 'valkyrimon'],
    title: 'White Marble Sky Citadel',
    icon: '👑',
    guideText:
      'Welcome inside White Marble Sky Citadel (15×12)! March up the crimson carpet to synchronize all 3 Architecture Pillars with Rayquaza, Imperialdramon PM & Valkyrimon.',
    labels: {
      rayquaza: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'sky-throne': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'arch-blueprint': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'twin-console': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      imp_paladin: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      valkyrimon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'firmament-orb': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'flagship-ledger': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'envoy-banner': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'sky-windmill': {
    id: 'sky-windmill',
    cols: WINDMILL_COLS,
    rows: WINDMILL_ROWS,
    spawn: WINDMILL_SPAWN,
    collision: WINDMILL_COLLISION,
    props: WINDMILL_PROPS,
    render: renderWindmillScene,
    exitRespawn: '8,25,down',
    exitRoute: '/sky-castle?from=windmill',
    waveColor: '#fbbf24',
    pmPreloads: ['latios'],
    digimonPreloads: ['vortexdramon', 'varodurumon'],
    title: 'Upper Cloud Windmill',
    icon: '🌬️',
    guideText:
      'Welcome inside Upper Cloud Windmill (15×12)! Calibrate the 4 AeroScan TensorRT Turbine Blades alongside Latios, Vortexdramon & Varodurumon.',
    labels: {
      latios: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'wind-shaft': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'aeroscan-radar': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'tensorrt-bench': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      vortexdramon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      varodurumon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'turbine-dial': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'dataset-crates': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      anemometer: { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'sky-workshop': {
    id: 'sky-workshop',
    cols: WORKSHOP_COLS,
    rows: WORKSHOP_ROWS,
    spawn: WORKSHOP_SPAWN,
    collision: WORKSHOP_COLLISION,
    props: WORKSHOP_PROPS,
    render: renderWorkshopScene,
    exitRespawn: '6,40,down',
    exitRoute: '/sky-castle?from=workshop',
    waveColor: '#22d3ee',
    pmPreloads: ['reshiram'],
    digimonPreloads: ['plusiamon', 'crossmon'],
    title: 'Lower Sky-Dock Workshop',
    icon: '⚙️',
    guideText:
      'Welcome inside Lower Sky-Dock Workshop (15×12)! Wire the 4-stage ESP32 & Robotics telemetry circuit with Reshiram, Plusiamon & Crossmon.',
    labels: {
      reshiram: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'airship-rig': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'esp32-bench': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'robotics-rack': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      plusiamon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      crossmon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'circuit-core': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'flutter-console': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'sky-dock-log': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'sky-inn': {
    id: 'sky-inn',
    cols: INN_COLS,
    rows: INN_ROWS,
    spawn: INN_SPAWN,
    collision: INN_COLLISION,
    props: INN_PROPS,
    render: renderInnScene,
    exitRespawn: '15,46,down',
    exitRoute: '/sky-castle?from=inn',
    waveColor: '#f59e0b',
    pmPreloads: ['latias'],
    digimonPreloads: ['phoenixmon', 'zhuqiaomon'],
    title: 'Cloudhaven Timber Inn',
    icon: '🏠',
    guideText:
      'Welcome inside Cloudhaven Timber Inn (15×12)! Serve the 3 Fellowship & Mentoring orders beside Latias, Phoenixmon & Zhuqiaomon.',
    labels: {
      latias: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'hearth-fireplace': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'tea-counter': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'mentoring-board': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      phoenixmon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      zhuqiaomon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'tea-kettle-pedestal': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'fellowship-table': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'inn-guestbook': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'sky-observatory': {
    id: 'sky-observatory',
    cols: OBSERVATORY_COLS,
    rows: OBSERVATORY_ROWS,
    spawn: OBSERVATORY_SPAWN,
    collision: OBSERVATORY_COLLISION,
    props: OBSERVATORY_PROPS,
    render: renderObservatoryScene,
    exitRespawn: '38,27,down',
    exitRoute: '/sky-castle?from=observatory',
    waveColor: '#c084fc',
    pmPreloads: ['deoxys'],
    digimonPreloads: ['gracenovamon', 'amaterasumon'],
    title: 'Golden Astral Observatory',
    icon: '🔭',
    guideText:
      'Welcome inside Golden Astral Observatory (15×12)! Focus the 4 Amethyst Research Lenses with Deoxys, GraceNovamon & Amaterasumon.',
    labels: {
      deoxys: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'brass-telescope': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'nlp-lens-desk': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'amethyst-array': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      gracenovamon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      amaterasumon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'orrery-core': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'cv-plates': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'star-almanac': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'sky-chapel': {
    id: 'sky-chapel',
    cols: CHAPEL_COLS,
    rows: CHAPEL_ROWS,
    spawn: CHAPEL_SPAWN,
    collision: CHAPEL_COLLISION,
    props: CHAPEL_PROPS,
    render: renderChapelScene,
    exitRespawn: '37,47,down',
    exitRoute: '/sky-castle?from=chapel',
    waveColor: '#60a5fa',
    pmPreloads: ['arceus'],
    digimonPreloads: ['seraphimon', 'sakuyamon'],
    title: 'Radiant Sky Chapel',
    icon: '⛪',
    guideText:
      'Welcome inside Radiant Sky Chapel (15×12)! Ring the 3 Sapphire Sky-Bell Hymns beside Arceus, Seraphimon & Sakuyamon.',
    labels: {
      arceus: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'radiant-altar': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'honors-scroll': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'sapphire-belfry': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      seraphimon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      sakuyamon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'bell-resonance-font': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'vow-lectern': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'plume-sanctuary': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
};

export function isSkyInteriorScene(scene: string): scene is SkyInteriorSceneId {
  return scene in REGISTRY;
}

export function getSkyInteriorConfig(scene: string): SkyInteriorConfig | null {
  return isSkyInteriorScene(scene) ? REGISTRY[scene] : null;
}
