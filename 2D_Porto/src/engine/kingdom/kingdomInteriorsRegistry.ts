import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import type { KingdomInteriorProp } from '../kingdomInteriorShared';
import {
  THRONE_COLS,
  THRONE_ROWS,
  THRONE_SPAWN,
  THRONE_COLLISION,
  THRONE_PROPS,
  renderThroneHallScene,
} from './throneHallScene';
import {
  BLACKSMITH_COLS,
  BLACKSMITH_ROWS,
  BLACKSMITH_SPAWN,
  BLACKSMITH_COLLISION,
  BLACKSMITH_PROPS,
  renderBlacksmithScene,
} from './blacksmithScene';
import {
  TAVERN_COLS,
  TAVERN_ROWS,
  TAVERN_SPAWN,
  TAVERN_COLLISION,
  TAVERN_PROPS,
  renderTavernScene,
} from './tavernScene';
import {
  MAGE_COLS,
  MAGE_ROWS,
  MAGE_SPAWN,
  MAGE_COLLISION,
  MAGE_PROPS,
  renderMageTowerScene,
} from './mageTowerScene';
import {
  BARRACKS_COLS,
  BARRACKS_ROWS,
  BARRACKS_SPAWN,
  BARRACKS_COLLISION,
  BARRACKS_PROPS,
  renderBarracksScene,
} from './barracksScene';
import {
  ABBEY_COLS,
  ABBEY_ROWS,
  ABBEY_SPAWN,
  ABBEY_COLLISION,
  ABBEY_PROPS,
  renderAbbeyScene,
} from './abbeyScene';
import {
  JOUSTING_COLS,
  JOUSTING_ROWS,
  JOUSTING_SPAWN,
  JOUSTING_COLLISION,
  JOUSTING_PROPS,
  renderJoustingScene,
} from './joustingScene';

export type KingdomInteriorSceneId =
  | 'kingdom-castle'
  | 'kingdom-blacksmith'
  | 'kingdom-tavern'
  | 'kingdom-mage-tower'
  | 'kingdom-barracks'
  | 'kingdom-chapel'
  | 'kingdom-jousting';

export interface KingdomInteriorConfig {
  id: KingdomInteriorSceneId;
  cols: number;
  rows: number;
  spawn: typeof THRONE_SPAWN;
  collision: Uint8Array;
  props: KingdomInteriorProp[];
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

const REGISTRY: Record<KingdomInteriorSceneId, KingdomInteriorConfig> = {
  'kingdom-castle': {
    id: 'kingdom-castle',
    cols: THRONE_COLS,
    rows: THRONE_ROWS,
    spawn: THRONE_SPAWN,
    collision: THRONE_COLLISION,
    props: THRONE_PROPS,
    render: renderThroneHallScene,
    exitRespawn: '22,20,down',
    exitRoute: '/kingdom?from=castle',
    waveColor: '#fbbf24',
    pmPreloads: ['solgaleo'],
    digimonPreloads: ['omnimon', 'gallantmon'],
    title: 'Grand Throne Hall',
    icon: '👑',
    guideText: 'Welcome to Grand Throne Hall (15×12)! Walk up the royal red carpet to commune with King Solgaleo and the Royal Knights Omnimon & Gallantmon.',
    labels: {
      solgaleo: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'royal-throne': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'royal-charter': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'treasury-coffer': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      omnimon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      gallantmon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'sovereign-seal': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'vanguard-display': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'diplomacy-lectern': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-blacksmith': {
    id: 'kingdom-blacksmith',
    cols: BLACKSMITH_COLS,
    rows: BLACKSMITH_ROWS,
    spawn: BLACKSMITH_SPAWN,
    collision: BLACKSMITH_COLLISION,
    props: BLACKSMITH_PROPS,
    render: renderBlacksmithScene,
    exitRespawn: '8,20,down',
    exitRoute: '/kingdom?from=blacksmith',
    waveColor: '#fb923c',
    pmPreloads: ['archaludon', 'tyranitar'],
    digimonPreloads: ['cannondramon'],
    title: 'Dragonflame Blacksmith',
    icon: '⚒️',
    guideText: 'Welcome to Dragonflame Blacksmith (15×12)! Meet Master Smith Archaludon, Tyranitar & Cannondramon beside the glowing forge.',
    labels: {
      archaludon: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'dragon-hearth': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'armory-rack': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'quench-trough': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      tyranitar: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      cannondramon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'master-anvil': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'smelting-bellows': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'grindstone-bench': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-tavern': {
    id: 'kingdom-tavern',
    cols: TAVERN_COLS,
    rows: TAVERN_ROWS,
    spawn: TAVERN_SPAWN,
    collision: TAVERN_COLLISION,
    props: TAVERN_PROPS,
    render: renderTavernScene,
    exitRespawn: '36,20,down',
    exitRoute: '/kingdom?from=tavern',
    waveColor: '#f59e0b',
    pmPreloads: ['empoleon', 'snorlax', 'samurott'],
    digimonPreloads: [],
    title: 'Golden Griffin Tavern',
    icon: '🍺',
    guideText: 'Welcome to The Golden Griffin Inn (15×12)! Feast with Snorlax, order drinks from Empoleon, and read Mission Quests beside Samurott.',
    labels: {
      empoleon: { x: 7, y: 2, w: 1, h: 1, lift: 1.25 },
      'oak-bar': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'quest-board': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'ale-barrels': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      snorlax: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      samurott: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'banquet-table': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'hearth-fireplace': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'bard-stage': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-mage-tower': {
    id: 'kingdom-mage-tower',
    cols: MAGE_COLS,
    rows: MAGE_ROWS,
    spawn: MAGE_SPAWN,
    collision: MAGE_COLLISION,
    props: MAGE_PROPS,
    render: renderMageTowerScene,
    exitRespawn: '8,36,down',
    exitRoute: '/kingdom?from=mage-tower',
    waveColor: '#c084fc',
    pmPreloads: ['mewtwo', 'latias', 'latios'],
    digimonPreloads: [],
    title: 'Astral Mage Sanctum',
    icon: '🔮',
    guideText: 'Welcome to Astral Mage Sanctum (15×12)! Align ML Research constellations with Archmage Mewtwo and twin spirits Latias & Latios.',
    labels: {
      mewtwo: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'astral-telescope': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'arcana-grimoire': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'ley-crystal': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      latias: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      latios: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'rune-circle': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'alchemy-alembic': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'star-orrery': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-barracks': {
    id: 'kingdom-barracks',
    cols: BARRACKS_COLS,
    rows: BARRACKS_ROWS,
    spawn: BARRACKS_SPAWN,
    collision: BARRACKS_COLLISION,
    props: BARRACKS_PROPS,
    render: renderBarracksScene,
    exitRespawn: '37,31,down',
    exitRoute: '/kingdom?from=barracks',
    waveColor: '#38bdf8',
    pmPreloads: ['lucario', 'salamence'],
    digimonPreloads: ['kentaurosmon'],
    title: "Knights' Barracks",
    icon: '🛡️',
    guideText: "Welcome to Knights' Order Barracks (15×12)! Inspect the Hall of Valor and train beside Lucario, Kentaurosmon & Salamence.",
    labels: {
      lucario: { x: 7, y: 2, w: 1, h: 1, lift: 1.25 },
      'war-map': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'honors-banner': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'archery-rack': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      kentaurosmon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      salamence: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'vanguard-crest': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'training-dummy': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'quarters-trunk': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-chapel': {
    id: 'kingdom-chapel',
    cols: ABBEY_COLS,
    rows: ABBEY_ROWS,
    spawn: ABBEY_SPAWN,
    collision: ABBEY_COLLISION,
    props: ABBEY_PROPS,
    render: renderAbbeyScene,
    exitRespawn: '34,50,down',
    exitRoute: '/kingdom?from=chapel',
    waveColor: '#60a5fa',
    pmPreloads: ['lugia'],
    digimonPreloads: ['seraphimon', 'guardiangemon'],
    title: 'Saint Avalon Abbey',
    icon: '⛪',
    guideText: 'Welcome to Saint Avalon Abbey (15×12)! Ring the Cathedral Bells with Guardian Lugia and choir Digimon Seraphimon & GuardiAngemon.',
    labels: {
      lugia: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'rose-stained-glass': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'bell-carillon': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'contact-scroll': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      seraphimon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      guardiangemon: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'grace-altar': { x: 7, y: 6, w: 1, h: 1, lift: 1.0 },
      'chapel-pews': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'blessing-font': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
  'kingdom-jousting': {
    id: 'kingdom-jousting',
    cols: JOUSTING_COLS,
    rows: JOUSTING_ROWS,
    spawn: JOUSTING_SPAWN,
    collision: JOUSTING_COLLISION,
    props: JOUSTING_PROPS,
    render: renderJoustingScene,
    exitRespawn: '12,45,down',
    exitRoute: '/kingdom?from=jousting',
    waveColor: '#ef4444',
    pmPreloads: ['koraidon'],
    digimonPreloads: ['blackwargreymon', 'imp_fighter'],
    title: 'Royal Jousting Arena',
    icon: '🐎',
    guideText: 'Welcome to the Stone Jousting Colosseum (15×12)! Step onto the golden sand tournament pit to face Koraidon, BlackWarGreymon & Imperialdramon!',
    labels: {
      koraidon: { x: 7, y: 2, w: 1, h: 1, lift: 1.3 },
      'royal-pavilion': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
      'lance-rack': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
      'herald-drum': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
      blackwargreymon: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
      imp_fighter: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
      'sand-stable': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
      'arena-scoreboard': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
    },
  },
};

export function isKingdomInteriorScene(id: string): id is KingdomInteriorSceneId {
  return id in REGISTRY;
}

export function getKingdomInteriorConfig(id: string): KingdomInteriorConfig | undefined {
  return isKingdomInteriorScene(id) ? REGISTRY[id] : undefined;
}
