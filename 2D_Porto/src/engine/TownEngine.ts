import { DIRS, Tile, type CharacterPalette, type Dir, type Lamp, type TownData, type TownMap, type Vec } from './types';
import { createTownMap } from './map';
import { createTownBackgroundCanvas, drawPikachu } from './townBackground';
import { TILE_SIZE, drawCharacter, drawRiderCharacter, drawLucario, drawPixelMatrix } from './sprites';
import { renderLighting } from './tiles';
import { findPath } from './pathfinding';
import { sfx } from '../game/sfx';
import { gameStore } from '../game/store';
import { townConfig, SPAWNABLE_TEMPLATES } from './townConfig';
import { TownEditor } from './townEditor';
import {
  HOME_COLS,
  HOME_ROWS,
  HOME_SPAWN,
  HOME_COLLISION,
  HOME_PROPS,
  HOME2F_COLS,
  HOME2F_ROWS,
  HOME2F_SPAWN,
  HOME2F_COLLISION,
  HOME2F_PROPS,
  isHomeWalkable,
  renderHomeFloor,
  renderHomeWalls,
  renderHomeProps,
  renderHome2FFloor,
  renderHome2FWalls,
  renderHome2FProps,
} from './homeScene';
import {
  DEV_COLS,
  DEV_ROWS,
  DEV_SPAWN,
  DEV_COLLISION,
  DEV_PROPS,
  createDevBackgroundCanvas,
  renderDevAnimations,
} from './devScene';
import {
  LAB_COLS,
  LAB_ROWS,
  LAB_SPAWN,
  LAB_COLLISION,
  LAB_PROPS,
  createLabBackgroundCanvas,
  renderLabAnimations,
} from './labScene';
import {
  ARCADE_COLS,
  ARCADE_ROWS,
  ARCADE_SPAWN,
  ARCADE_COLLISION,
  ARCADE_PROPS,
  createArcadeBackgroundCanvas,
} from './arcadeScene';
import {
  RECEPTION_COLS,
  RECEPTION_ROWS,
  RECEPTION_SPAWN,
  RECEPTION_COLLISION,
  RECEPTION_PROPS,
  createReceptionBackgroundCanvas,
  renderReceptionAnimations,
  triggerHealAnimation,
} from './receptionScene';
import {
  MART_COLS,
  MART_ROWS,
  MART_SPAWN,
  MART_COLLISION,
  MART_PROPS,
  createMartBackgroundCanvas,
  renderMartAnimations,
  triggerCashRegisterAnimation,
} from './martScene';
import {
  TOWER_COLS,
  TOWER_ROWS,
  TOWER_SPAWN,
  TOWER_COLLISION,
  TOWER_PROPS,
  createTowerBackgroundCanvas,
  renderTowerAnimations,
} from './towerScene';
import {
  CAFE_COLS,
  CAFE_ROWS,
  CAFE_SPAWN,
  CAFE_COLLISION,
  CAFE_PROPS,
  createCafeBackgroundCanvas,
  renderCafeAnimations,
  triggerCafeBrewAnimation,
} from './cafeScene';
import {
  ARENA_COLS,
  ARENA_ROWS,
  ARENA_SPAWN,
  ARENA_COLLISION,
  ARENA_PROPS,
  createArenaBackgroundCanvas,
  renderArenaAnimations,
  triggerArenaBattleAnimation,
} from './arenaScene';
import {
  GARDEN_COLS,
  GARDEN_ROWS,
  GARDEN_SPAWN,
  GARDEN_COLLISION,
  GARDEN_PROPS,
  createGardenBackgroundCanvas,
  renderGardenAnimations,
  triggerGardenHarvestAnimation,
} from './gardenScene';
import {
  NEIGHBOUR_COLS,
  NEIGHBOUR_ROWS,
  NEIGHBOUR_SPAWN,
  NEIGHBOUR_COLLISION,
  NEIGHBOUR_PROPS,
  createNeighbourBackgroundCanvas,
  renderNeighbourAnimations,
  triggerNeighbourAnimation,
} from './neighbourScene';
import { RESHIRAM_IMAGE_SRC } from './reshiramSprite';
import { ZEKROM_IMAGE_SRC } from './zekromSprite';
import { GIRATINA_IMAGE_SRC } from './giratinaSprite';
import { PALKIA_IMAGE_SRC } from './palkiaSprite';
import { DIALGA_IMAGE_SRC } from './dialgaSprite';
import { RAYQUAZA_IMAGE_SRC } from './rayquazaSprite';
import { GROUDON_IMAGE_SRC } from './groudonSprite';
import { KYOGRE_IMAGE_SRC } from './kyogreSprite';
import { LATIOS_IMAGE_SRC } from './latiosSprite';
import { LATIAS_IMAGE_SRC } from './latiasSprite';
import { DARKRAI_IMAGE_SRC } from './darkraiSprite';
import { NECROZMA_IMAGE_SRC } from './necrozmaSprite';
import { LUNALA_IMAGE_SRC } from './lunalaSprite';
import { SOLGALEO_IMAGE_SRC } from './solgaleoSprite';
import { SAMUROTT_IMAGE_SRC } from './samurottSprite';
import { CHARIZARD_IMAGE_SRC } from './charizardSprite';
import { TYRANITAR_IMAGE_SRC } from './tyranitarSprite';
import { GARCHOMP_IMAGE_SRC } from './garchompSprite';
import { URSHIFU_IMAGE_SRC } from './urshifuSprite';
import { PokemonPMDAnimator, type PMDAction } from './pokemonPMDAnimator';

export interface BubbleAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface EngineCallbacks {
  onDialogue: (name: string, lines: string[], onAction?: () => void) => void;
  onBubble?: (title: string, text: string, action?: BubbleAction | BubbleAction[]) => void;
  onNavigate: (route: string) => void;
  onEncounter: () => void;
  onRefill: () => void;
  onOpenModal: (target: 'map' | 'dex') => void;
}

export interface FollowerPokemon {
  id: string;
  name: string;
  title: string;
  icon: string;
}

export interface MoveParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'flame' | 'sand' | 'claw' | 'water' | 'aura' | 'psychic' | 'cosmic' | 'shockwave';
  rot?: number;
  rotSpeed?: number;
}

const MEWTWO_IMAGE_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwBAMAAAA0zul4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEUAAAD4+Pjg4PC4sMi4iMCYiJh4gHiIWJBQWFBAQEAAAABuf+WbAAAAAXRSTlMAQObYZgAAAWxJREFUeNrt2DGtJDEQRdGi8Ck8Co+CKRSFT8EUmkJRuChX7vGMg81Wqk52bmjpSC+wHDi+ffv27dsz8TTEPAvxhvAgXASJp+CvBEg+MIBGqNWvfCCMMWmC6G/HWDVBtHvB4ybRDfWGzDGA6IHoZLPhntkNbXNcI7S82OUDiUYY3LCuHx9YdMJAyoufn+1u2QpJSYzlKs8F6ISSvILMa8sx6IOB064igkziyDYYVJXzNfXAQQ88Y6WrktjRDiVd3u5s7YJkZUp52WfqHLMNkllSpsHmuNEEwS5LEhFY3GdzLtcCKVd5zqkXUQHzrgdil1RjjCUJpJpv1wFxvtySKVEfSPTA5TYsSSq9JEQPDD6wrC1rsx4Y3NvGmKU3NBGNMJBdc25YSmUzDMisDV2iD54+0jZOoh9WJuDlAqIbcruIKNtFRDcklzsvJf3wdjvsfhhAPAtPID0KKaX0KJRSxIMwQI/BQ+Nf4f/7/fYHGujw6q4E2bwAAAAASUVORK5CYII=';

const ARCEUS_IMAGE_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAMFBMVEX///+EhIyEcwDexTq9pRkA5gAAnAD/71rFADp7hJQ6QlJaWmNaY3O1tb3m5u8QEBBxRTodAAAAAXRSTlMAQObYZgAAA4dJREFUeNrl1tuO4zgMRVGRotMdWdT5/78dUdQlU6lJ2W0/DND7JQgMLFCxIjt8jCjcGiludUkdRMH/EyStERGoADd5xaJSUHTfw0vaOueZ5p6BNTcd65dO3K3BKRUHXbCKd87UX+KcwQtcaa75xf2AR78MXEFTSln/pWEUDkTTyyi1qvV0cMs5NiAXCznDP1Itz5Jxp0H83raE5lYMreQcwrkIubb93h6+4pcVwgrnQ6o9Hjn7whEuB7UZt2Sge9fFlLYN1YPeBCLDPCXcdNQQGZdIbwFTSmipGriHO6JiGciRb+DM66KB17mZgVdFcmmQqKD3h152R9eIIrHFF0BPVQHZHiYCCBbznw+oukPEQNN6ODto8tGKZR6ziGkLPCkmNY/mDxgGuEThc2AtlREcvDaipufwtIEcLohImpI2TAGECqL2DXhwa+L5TE/3msLA1z3IvtVjDce8BjYPEr1XEbGHHzwiwtNBC/u+w2J5BZkf2xajCHDgP4xsnpbWXnoAD9FW+ng8Ioz7GUTKOeXsjIueNpEr55l2wFvge5VyjYFD4F7H0Q+gNk4ABHDEEW7XCVJZsWWfjTtwQDhnqWZkE7unvlTLTBYuRFSIUemP3jr/DETpuQtENw30xo9I3punnasBKZXRGBQQE0WEF7jX1K9/JaHTUzJuzVsW2UDMO47ympML1M75dIvH+gKx0L0B6rOG1iu4q1UKpkZEqKkuEcwTdE+zc+EtOLi8GkhbZUyvw0PmKFDN2UCEbwKLKqZHpAAHwD31HLRgYG659xZEGErjnhXAD+khLs+bIBC+bxcx0PIRDGQW6IhZRKDdi/jE+YiC5QUDTRC8ctAByrqvn0csZYIWEExh6XYeA07s84g0vApum3EWLLucM9YmxAFQINOrIM/piRyETs/BH9YsiNJA9r/t9GpwUDuoCAfWvAdE9sMFMHB5NO8a9zP259BAF23VsYvoYDSQuT87D4EIfcT+LEd4FW2hHPsNORRC8BERXERYIuwKTnkevgd3m1CioW0FhDMij/23jjeqoL0tAO20pXIGfH/mgtrrwhb7SQw9AQa8gWxcBR8VtJ6++w+HLyDPt4XzoIcvX62+cYqB7l1o/vtcLPeA3Ef0KFwV2UBpIJuYL4LgJiKgiDh4XSQaz7O7QNwPWmxrRrgN9BERbhAHwneDkJhzuB7wenrcGv99YPhv7x9JGV04/CcT4gAAAABJRU5ErkJggg==';

const BLASTOISE_IMAGE_SRC = TYRANITAR_IMAGE_SRC;

export type TownAtmosphere = 'day' | 'sunset' | 'night';
export type TownWeather = 'petals' | 'rain' | 'stars';

export interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  type: 'petal' | 'leaf' | 'raindrop' | 'ripple' | 'star' | 'meteor' | 'firefly';
  sway?: number;
  swaySpeed?: number;
  life?: number;
  maxLife?: number;
  len?: number;
}

type BreezeParticle = WeatherParticle;

interface DustPuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface FlyParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export class TownEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private map: TownMap;
  private callbacks: EngineCallbacks;
  private currentScene: 'town' | 'home' | 'dev' | 'lab' | 'arcade' | 'reception' | 'mart' | 'tower' | 'cafe' | 'arena' | 'garden' | 'neighbour' = 'town';
  private homeFloor: '1F' | '2F' = '1F';
  public activeTowerFloor: '1F' | '2F' | '3F' | '4F' = '1F';
  private devBackgroundCanvas: HTMLCanvasElement | null = null;
  private labBackgroundCanvas: HTMLCanvasElement | null = null;
  private arcadeBackgroundCanvas: HTMLCanvasElement | null = null;
  private charizardImg: HTMLImageElement | null = null;
  private tyranitarImg: HTMLImageElement | null = null;
  private garchompImg: HTMLImageElement | null = null;
  private urshifuImg: HTMLImageElement | null = null;
  private blastoiseImg: HTMLImageElement | null = null;
  private arceusImg: HTMLImageElement | null = null;
  private mewtwoImg: HTMLImageElement | null = null;
  private reshiramImg: HTMLImageElement | null = null;
  private zekromImg: HTMLImageElement | null = null;
  private giratinaImg: HTMLImageElement | null = null;
  private palkiaImg: HTMLImageElement | null = null;
  private dialgaImg: HTMLImageElement | null = null;
  private rayquazaImg: HTMLImageElement | null = null;
  private groudonImg: HTMLImageElement | null = null;
  private kyogreImg: HTMLImageElement | null = null;
  private latiosImg: HTMLImageElement | null = null;
  private latiasImg: HTMLImageElement | null = null;
  private darkraiImg: HTMLImageElement | null = null;
  private necrozmaImg: HTMLImageElement | null = null;
  private lunalaImg: HTMLImageElement | null = null;
  private solgaleoImg: HTMLImageElement | null = null;
  private samurottImg: HTMLImageElement | null = null;
  private receptionBackgroundCanvas: HTMLCanvasElement | null = null;
  private martBackgroundCanvas: HTMLCanvasElement | null = null;
  private towerBackgroundCanvas: HTMLCanvasElement | null = null;
  private cafeBackgroundCanvas: HTMLCanvasElement | null = null;
  private arenaBackgroundCanvas: HTMLCanvasElement | null = null;
  private gardenBackgroundCanvas: HTMLCanvasElement | null = null;
  private neighbourBackgroundCanvas: HTMLCanvasElement | null = null;
  private townBackgroundCanvas: HTMLCanvasElement | null = null;
  public townAtmosphere: TownAtmosphere = 'day';
  public weather: TownWeather = 'petals';
  private editor: TownEditor;

  // X-Ray Collision Inspector Mode
  private xrayMode: boolean = false;
  private xrayHoverTile: Vec | null = null;

  // Player state
  private playerPos: Vec = { x: 18, y: 12 };
  private playerTarget: Vec = { x: 18, y: 12 };
  private playerDir: Dir = 'down';
  private isMoving = false;
  private moveProgress = 0; // 0 to 1 between tiles
  private stepCount = 0;
  private path: Vec[] = [];
  private pendingTarget: string | null = null;
  private marker: Vec | null = null;
  private particles: WeatherParticle[] = [];
  private fireflies: WeatherParticle[] = [];
  private heldDirs: Dir[] = [];
  private bufferedDir: Dir | null = null;
  private isShiftHeld = false;
  private isBikeActive = false;
  private isRidingPokemon = false;
  private coffeeBoostTimer = 0;
  private dustPuffs: DustPuff[] = [];
  private flyBurstParticles: FlyParticle[] = [];
  private lastBumpTime = 0;

  // Active Walking Follower Pokémon
  public activeFollower: FollowerPokemon | null = null;
  private followerPos: Vec = { x: 18, y: 13 };
  private followerTarget: Vec = { x: 18, y: 13 };
  private followerTrail: Vec[] = [];
  private followerDir: Dir = 'down';
  private followerFacing: 'left' | 'right' = 'right';
  private followerEmoteTime = 0;
  private followerEmote = '❤️';
  private followerWalkTick = 0;
  private rayquazaAttackTick = 0;
  private arceusAttackTick = 0;
  private reshiramAttackTick = 0;
  private zekromAttackTick = 0;
  private giratinaAttackTick = 0;
  private palkiaAttackTick = 0;
  private dialgaAttackTick = 0;
  private lunalaAttackTick = 0;
  private solgaleoAttackTick = 0;
  private garchompAttackTick = 0;
  private groudonAttackTick = 0;
  private kyogreAttackTick = 0;
  private tyranitarAttackTick = 0;
  private gyaradosAttackTick = 0;
  private pmdAnimator = new PokemonPMDAnimator();

  // Signature Move Visual FX & Camera Shake
  private moveParticles: MoveParticle[] = [];
  private cameraShakeTime = 0;
  private cameraShakeIntensity = 0;

  private playerPalette: CharacterPalette = {
    skin: '#fecda5',
    hair: '#000000',
    shirt: '#0665d9',
    pants: '#0665d9',
    shoes: '#000000',
    cap: '#de1e1b',
    isAsh: true,
  };

  // Rendering & Camera
  private zoom = 3;
  private defaultZoom = 2;
  private isCustomZoom = false;
  private zoomTimeout: number | null = null;
  private cameraX = 0;
  private cameraY = 0;
  private tick = 0;
  private isAwake = false;
  private rafId: number | null = null;
  private lastTime = 0;

  // Cleanup handlers
  private unbindEvents: (() => void)[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    townData: TownData,
    initialSpawn = 'town',
    callbacks: EngineCallbacks
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.callbacks = callbacks;
    this.map = createTownMap(townData);

    if (initialSpawn === 'about' || initialSpawn === 'home') {
      this.currentScene = 'home';
      const is2F =
        typeof window !== 'undefined' &&
        (window.location.search.includes('floor=2') || window.location.hash === '#2f');
      this.homeFloor = is2F ? '2F' : '1F';
      const spawn = is2F ? HOME2F_SPAWN : HOME_SPAWN;
      this.playerPos = { x: spawn.x, y: spawn.y };
      this.playerTarget = { x: spawn.x, y: spawn.y };
      this.playerDir = spawn.dir;
      this.cameraX = ((is2F ? HOME2F_COLS : HOME_COLS) * TILE_SIZE) / 2;
      this.cameraY = ((is2F ? HOME2F_ROWS : HOME_ROWS) * TILE_SIZE) / 2;
    } else if (initialSpawn === 'dev') {
      this.currentScene = 'dev';
      gameStore.addStamp('dev');
      this.playerPos = { x: DEV_SPAWN.x, y: DEV_SPAWN.y };
      this.playerTarget = { x: DEV_SPAWN.x, y: DEV_SPAWN.y };
      this.playerDir = DEV_SPAWN.dir;
      this.cameraX = (DEV_COLS * TILE_SIZE) / 2;
      this.cameraY = (DEV_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'lab') {
      this.currentScene = 'lab';
      this.playerPos = { x: LAB_SPAWN.x, y: LAB_SPAWN.y };
      this.playerTarget = { x: LAB_SPAWN.x, y: LAB_SPAWN.y };
      this.playerDir = LAB_SPAWN.dir;
      this.cameraX = (LAB_COLS * TILE_SIZE) / 2;
      this.cameraY = (LAB_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'arcade') {
      this.currentScene = 'arcade';
      this.playerPos = { x: ARCADE_SPAWN.x, y: ARCADE_SPAWN.y };
      this.playerTarget = { x: ARCADE_SPAWN.x, y: ARCADE_SPAWN.y };
      this.playerDir = ARCADE_SPAWN.dir;
      this.cameraX = (ARCADE_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARCADE_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'reception') {
      this.currentScene = 'reception';
      this.playerPos = { x: RECEPTION_SPAWN.x, y: RECEPTION_SPAWN.y };
      this.playerTarget = { x: RECEPTION_SPAWN.x, y: RECEPTION_SPAWN.y };
      this.playerDir = RECEPTION_SPAWN.dir;
      this.cameraX = (RECEPTION_COLS * TILE_SIZE) / 2;
      this.cameraY = (RECEPTION_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'mart' || initialSpawn === 'shop') {
      this.currentScene = 'mart';
      this.playerPos = { x: MART_SPAWN.x, y: MART_SPAWN.y };
      this.playerTarget = { x: MART_SPAWN.x, y: MART_SPAWN.y };
      this.playerDir = MART_SPAWN.dir;
      this.cameraX = (MART_COLS * TILE_SIZE) / 2;
      this.cameraY = (MART_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'tower' || initialSpawn === 'office') {
      this.currentScene = 'tower';
      this.playerPos = { x: TOWER_SPAWN.x, y: TOWER_SPAWN.y };
      this.playerTarget = { x: TOWER_SPAWN.x, y: TOWER_SPAWN.y };
      this.playerDir = TOWER_SPAWN.dir;
      this.cameraX = (TOWER_COLS * TILE_SIZE) / 2;
      this.cameraY = (TOWER_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'cafe' || initialSpawn === 'bar' || initialSpawn === 'kiosk') {
      this.currentScene = 'cafe';
      this.playerPos = { x: CAFE_SPAWN.x, y: CAFE_SPAWN.y };
      this.playerTarget = { x: CAFE_SPAWN.x, y: CAFE_SPAWN.y };
      this.playerDir = CAFE_SPAWN.dir;
      this.cameraX = (CAFE_COLS * TILE_SIZE) / 2;
      this.cameraY = (CAFE_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'arena' || initialSpawn === 'colosseum') {
      this.currentScene = 'arena';
      this.playerPos = { x: ARENA_SPAWN.x, y: ARENA_SPAWN.y };
      this.playerTarget = { x: ARENA_SPAWN.x, y: ARENA_SPAWN.y };
      this.playerDir = ARENA_SPAWN.dir;
      this.cameraX = (ARENA_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARENA_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'garden' || initialSpawn === 'berry') {
      this.currentScene = 'garden';
      this.playerPos = { x: GARDEN_SPAWN.x, y: GARDEN_SPAWN.y };
      this.playerTarget = { x: GARDEN_SPAWN.x, y: GARDEN_SPAWN.y };
      this.playerDir = GARDEN_SPAWN.dir;
      this.cameraX = (GARDEN_COLS * TILE_SIZE) / 2;
      this.cameraY = (GARDEN_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'neighbour' || initialSpawn === 'villa') {
      this.currentScene = 'neighbour';
      this.playerPos = { x: NEIGHBOUR_SPAWN.x, y: NEIGHBOUR_SPAWN.y };
      this.playerTarget = { x: NEIGHBOUR_SPAWN.x, y: NEIGHBOUR_SPAWN.y };
      this.playerDir = NEIGHBOUR_SPAWN.dir;
      this.cameraX = (NEIGHBOUR_COLS * TILE_SIZE) / 2;
      this.cameraY = (NEIGHBOUR_ROWS * TILE_SIZE) / 2;
    } else {
      this.currentScene = 'town';
      let spawnX = 22;
      let spawnY = 28;
      let spawnDir: Dir = 'down';

      const exitSpawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('town:respawn') : null;
      if (exitSpawn) {
        sessionStorage.removeItem('town:respawn');
        const [sx, sy] = exitSpawn.split(',').map(Number);
        if (!isNaN(sx) && !isNaN(sy)) {
          spawnX = sx;
          spawnY = sy;
        }
      } else {
        const spawn = this.map.spawns[initialSpawn] || this.map.spawns.town;
        spawnX = spawn?.x ?? 22;
        spawnY = spawn?.y ?? 28;
        spawnDir = spawn?.dir ?? 'down';
      }

      this.playerPos = { x: spawnX, y: spawnY };
      this.playerTarget = { x: spawnX, y: spawnY };
      this.playerDir = spawnDir;
      this.cameraX = (this.map.w * TILE_SIZE) / 2;
      this.cameraY = (this.map.h * TILE_SIZE) / 2;

      const flyAnim = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('town:fly_anim') : null;
      if (flyAnim) {
        sessionStorage.removeItem('town:fly_anim');
        sfx.fly();
        this.spawnFlyBurst(spawnX, spawnY);
      }
    }

    this.editor = new TownEditor(this);
    if (typeof Image !== 'undefined') {
      this.tyranitarImg = new Image();
      this.tyranitarImg.src = TYRANITAR_IMAGE_SRC;
      this.blastoiseImg = this.tyranitarImg;
      this.arceusImg = new Image();
      this.arceusImg.src = ARCEUS_IMAGE_SRC;
      this.mewtwoImg = new Image();
      this.mewtwoImg.src = MEWTWO_IMAGE_SRC;
      this.reshiramImg = new Image();
      this.reshiramImg.src = RESHIRAM_IMAGE_SRC;
      this.zekromImg = new Image();
      this.zekromImg.src = ZEKROM_IMAGE_SRC;
      this.giratinaImg = new Image();
      this.giratinaImg.src = GIRATINA_IMAGE_SRC;
      this.palkiaImg = new Image();
      this.palkiaImg.src = PALKIA_IMAGE_SRC;
      this.dialgaImg = new Image();
      this.dialgaImg.src = DIALGA_IMAGE_SRC;
      this.rayquazaImg = new Image();
      this.rayquazaImg.src = RAYQUAZA_IMAGE_SRC;
      this.groudonImg = new Image();
      this.groudonImg.src = GROUDON_IMAGE_SRC;
      this.kyogreImg = new Image();
      this.kyogreImg.src = KYOGRE_IMAGE_SRC;
      this.latiosImg = new Image();
      this.latiosImg.src = LATIOS_IMAGE_SRC;
      this.latiasImg = new Image();
      this.latiasImg.src = LATIAS_IMAGE_SRC;
      this.darkraiImg = new Image();
      this.darkraiImg.src = DARKRAI_IMAGE_SRC;
      this.necrozmaImg = new Image();
      this.necrozmaImg.src = NECROZMA_IMAGE_SRC;
      this.lunalaImg = new Image();
      this.lunalaImg.src = LUNALA_IMAGE_SRC;
      this.solgaleoImg = new Image();
      this.solgaleoImg.src = SOLGALEO_IMAGE_SRC;
      this.samurottImg = new Image();
      this.samurottImg.src = SAMUROTT_IMAGE_SRC;
      this.charizardImg = new Image();
      this.charizardImg.src = CHARIZARD_IMAGE_SRC;
      this.garchompImg = new Image();
      this.garchompImg.src = GARCHOMP_IMAGE_SRC;
      this.urshifuImg = new Image();
      this.urshifuImg.src = URSHIFU_IMAGE_SRC;
    }
    townConfig.subscribe(() => {
      this.invalidateBackgroundCanvas();
      this.updateDomLabels();
      this.wake();
    });

    if (typeof window !== 'undefined') {
      const savedAtmo = localStorage.getItem('town:atmosphere') as TownAtmosphere | null;
      if (savedAtmo === 'day' || savedAtmo === 'sunset' || savedAtmo === 'night') {
        this.townAtmosphere = savedAtmo;
      }
      const savedWeather = localStorage.getItem('town:weather') as TownWeather | null;
      if (savedWeather === 'petals' || savedWeather === 'rain' || savedWeather === 'stars') {
        this.weather = savedWeather;
      }
      sfx.setBgmTheme(this.townAtmosphere);

      const savedFollower = localStorage.getItem('town:active_follower');
      if (savedFollower) {
        this.setActiveFollower(savedFollower, false);
      }
    }

    this.initParticles();
    this.bindControls();
    this.handleResize();
    if (this.currentScene === 'home') {
      this.updateFloorBadge();
      this.updateRoomGuide();
    }
    this.wake();
  }

  public initParticles() {
    const totalW = this.map.w * TILE_SIZE;
    const totalH = this.map.h * TILE_SIZE;
    this.particles = [];
    this.fireflies = [];

    // Weather Particles
    if (this.weather === 'petals') {
      // 45 Sakura petals & gentle leaves
      for (let i = 0; i < 45; i++) {
        const isPetal = Math.random() < 0.65;
        this.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: 0.35 + Math.random() * 0.45,
          vy: 0.25 + Math.random() * 0.35,
          size: isPetal ? (Math.random() > 0.5 ? 2.5 : 2) : 2,
          alpha: 0.4 + Math.random() * 0.45,
          color: isPetal ? (Math.random() > 0.5 ? '#ffb7c5' : '#ffccd5') : '#a8e063',
          type: isPetal ? 'petal' : 'leaf',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.03,
        });
      }
    } else if (this.weather === 'rain') {
      // 65 Lo-Fi Raindrops
      for (let i = 0; i < 65; i++) {
        this.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: -1.4 - Math.random() * 0.8,
          vy: 8.5 + Math.random() * 3.5,
          size: 1,
          len: 7 + Math.random() * 6,
          alpha: 0.35 + Math.random() * 0.45,
          color: 'rgba(180, 220, 255, 0.75)',
          type: 'raindrop',
        });
      }
    } else if (this.weather === 'stars') {
      // 45 Twinkling Stars
      const starColors = ['#fff9db', '#d0ebff', '#eebefa', '#ffec99'];
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.15 - Math.random() * 0.2,
          size: Math.random() > 0.6 ? 2.5 : 1.5,
          alpha: 0.3 + Math.random() * 0.5,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          type: 'star',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.04 + Math.random() * 0.04,
        });
      }
    }

    // Night Time Fireflies (Kunang-Kunang)
    if (this.townAtmosphere === 'night') {
      for (let i = 0; i < 22; i++) {
        this.fireflies.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 2,
          alpha: 0.4 + Math.random() * 0.5,
          color: '#d4ff59',
          type: 'firefly',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.03 + Math.random() * 0.04,
        });
      }
    }
  }

  public destroy() {
    this.sleep();
    this.unbindEvents.forEach((u) => u());
    this.unbindEvents = [];
  }

  public invalidateBackgroundCanvas() {
    this.townBackgroundCanvas = null;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getCameraX(): number {
    return this.cameraX;
  }

  public getCameraY(): number {
    return this.cameraY;
  }

  public setCameraPos(x: number, y: number): void {
    this.cameraX = x;
    this.cameraY = y;
    this.updateDomLabels();
    this.wake();
  }

  public getScene(): string {
    return this.currentScene;
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getDefaultZoom(): number {
    return this.defaultZoom;
  }

  public setZoom(zoom: number) {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.isCustomZoom = true;
    this.zoom = Math.max(0.6 * dpr, Math.min(5.0 * dpr, zoom));
    this.updateDomLabels();
    this.showZoomIndicator();
    this.wake();
  }

  public zoomBy(factor: number) {
    this.setZoom(this.zoom * factor);
  }

  public showZoomIndicator() {
    if (typeof document === 'undefined') return;
    const indicator = document.getElementById('town-zoom-indicator');
    const text = document.getElementById('town-zoom-text');
    if (!indicator || !text) return;

    const base = this.defaultZoom > 0 ? this.defaultZoom : 1;
    const pct = Math.round((this.zoom / base) * 100);
    text.textContent = `${pct}%`;

    indicator.classList.add('is-visible');
    if (this.zoomTimeout) {
      window.clearTimeout(this.zoomTimeout);
    }
    this.zoomTimeout = window.setTimeout(() => {
      indicator.classList.remove('is-visible');
    }, 1400);
  }

  public panCamera(dx: number, dy: number) {
    this.cameraX += dx;
    this.cameraY += dy;
    this.updateDomLabels();
    this.wake();
  }

  public getEditor(): TownEditor {
    return this.editor;
  }

  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
    const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;
    return {
      x: canvasX / dpr,
      y: canvasY / dpr,
    };
  }

  public isWalkable(x: number, y: number): boolean {
    return this.canWalk(x, y);
  }

  // --- X-Ray Collision & Hidden Obstacle Inspector Mode ---
  public isXray(): boolean {
    return this.xrayMode;
  }

  public setXray(enabled: boolean): void {
    if (this.xrayMode === enabled) return;
    this.xrayMode = enabled;
    if (this.canvas) {
      this.canvas.style.cursor = this.xrayMode ? 'crosshair' : '';
    }
    const xrayBtn = document.getElementById('btn-toggle-xray');
    if (xrayBtn) xrayBtn.classList.toggle('is-active', this.xrayMode);
    const devMenuBtn = document.getElementById('btn-toggle-dev-menu');
    if (devMenuBtn) devMenuBtn.classList.toggle('is-active', this.xrayMode || this.editor.isEnabled());
    const burgerXray = document.getElementById('burger-item-xray');
    if (burgerXray) burgerXray.classList.toggle('is-active', this.xrayMode);
    const xrayBar = document.getElementById('town-xray-bar');
    if (xrayBar) {
      xrayBar.style.display = this.xrayMode ? 'flex' : 'none';
      xrayBar.classList.toggle('hidden', !this.xrayMode);
    }
    sfx.select();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: this.xrayMode
          ? '🔬 Mode X-Ray Aktif! Klik rintangan atau tembok untuk menghapus / membuka jalan.'
          : '🔬 Mode X-Ray Nonaktif.',
      })
    );
    this.wake();
  }

  public toggleXray(): boolean {
    this.setXray(!this.xrayMode);
    return this.xrayMode;
  }

  public getTileCollisionInfo(x: number, y: number): {
    walkable: boolean;
    reason: string;
    entityId?: string;
    entityName?: string;
    override?: string;
    isBaseBlocked?: boolean;
    isHidden?: boolean;
  } {
    if (x < 0 || x >= this.map.w || y < 0 || y >= this.map.h) {
      return { walkable: false, reason: 'Batas Peta (Out of Bounds)' };
    }

    // 0. Check if a hidden entity is located at this tile
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden && x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        return {
          walkable: true,
          reason: `Objek Tersembunyi: ${b.name || b.id}`,
          entityId: b.id,
          entityName: b.name || b.id,
          isHidden: true,
        };
      }
    }

    // 1. Explicit tile override
    const override = townConfig.getTileOverride(x, y);
    if (override === 'walkable_override') {
      return { walkable: true, reason: 'Jalan Dibuka (Walkable Override)', override };
    }
    if (
      override === 'solid_override' ||
      override === 'water' ||
      override === 'hedge' ||
      override === 'fence' ||
      override === 'fence_water'
    ) {
      const label =
        override === 'solid_override'
          ? 'Tembok Kustom (Solid Override)'
          : override === 'water'
          ? 'Air / Kolam'
          : override === 'hedge'
          ? 'Semak Pagar'
          : override === 'fence'
          ? 'Pagar Kayu'
          : 'Pagar Air';
      return { walkable: false, reason: label, override };
    }

    // 2. Dynamic entities from townConfig
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden) continue;

      if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;

      if (b.kind === 'tree') {
        const trunkY = b.y + b.h - 1;
        if (x >= b.x && x < b.x + b.w && y >= trunkY && y < b.y + b.h) {
          return {
            walkable: false,
            reason: `Batang Pohon (${b.name || b.id})`,
            entityId: b.id,
            entityName: b.name || b.id,
          };
        }
        continue;
      }

      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        if (b.kind === 'building') {
          const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
          const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
          const isDoor =
            ((x === doorX || (b.w >= 6 && (x === doorX - 1 || x === doorX + 1))) &&
             (y === doorY || y === b.y + b.h - 1));
          if (isDoor) {
            return {
              walkable: true,
              reason: `Pintu Masuk (${b.name || b.id})`,
              entityId: b.id,
              entityName: b.name || b.id,
            };
          }
          return {
            walkable: false,
            reason: `Dinding Bangunan (${b.name || b.id})`,
            entityId: b.id,
            entityName: b.name || b.id,
          };
        }

        return {
          walkable: false,
          reason: `Objek / Rintangan (${b.name || b.id})`,
          entityId: b.id,
          entityName: b.name || b.id,
        };
      }
    }

    // 3. Tile override clearing base fence
    if (
      override === 'grass' ||
      override === 'cobble' ||
      override === 'lab_paver' ||
      override === 'dev_paver' ||
      override === 'tall_grass'
    ) {
      const baseGround = this.map.ground[y * this.map.w + x];
      if (baseGround === Tile.FENCE || ((x === 38 || x === 39) && y === 30)) {
        return { walkable: true, reason: 'Pagar Dibuka Menjadi Jalan', override };
      }
    }

    // 4. Base map terrain collision
    const isBaseBlocked = this.map.collision[y * this.map.w + x] !== 0;
    if (isBaseBlocked) {
      const tileType = this.map.ground[y * this.map.w + x];
      const groundDesc =
        tileType === Tile.WATER
          ? 'Air / Sungai'
          : tileType === Tile.FENCE
          ? 'Pagar Pembatas'
          : tileType === Tile.TREE
          ? 'Pohon Rindang'
          : 'Tembok / Batas Medan Asli';
      return { walkable: false, reason: groundDesc, isBaseBlocked: true };
    }

    return { walkable: true, reason: 'Bisa Dilewati (Lantai / Jalan Bersih)' };
  }

  public handleXrayClick(tileX: number, tileY: number, forceDelete = false): void {
    if (tileX < 0 || tileX >= this.map.w || tileY < 0 || tileY >= this.map.h) return;

    // 1. Check if user clicked on a hidden entity -> permanently delete it!
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden && tileX >= b.x && tileX < b.x + b.w && tileY >= b.y && tileY < b.y + b.h) {
        townConfig.purgeBuilding(b.id);
        this.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🗑️ Objek tersembunyi "${b.name || b.id}" berhasil dihapus permanen!`,
          })
        );
        this.wake();
        return;
      }
    }

    // 2. Check if an active obstacle entity covers this tile
    let obstacleEntity: any = null;
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden) continue;
      if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;
      if (tileX >= b.x && tileX < b.x + b.w && tileY >= b.y && tileY < b.y + b.h) {
        obstacleEntity = b;
        break;
      }
    }

    // If obstacle entity found
    if (obstacleEntity) {
      const isLandmark = obstacleEntity.kind === 'building';
      if (!isLandmark || forceDelete) {
        obstacleEntity.locked = false;
        // Purge permanently so it doesn't leave a ghost hidden box!
        townConfig.purgeBuilding(obstacleEntity.id);
        townConfig.setTileOverride(tileX, tileY, 'walkable_override');
        this.map.collision[tileY * this.map.w + tileX] = 0;
        this.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🗑️ Rintangan "${obstacleEntity.name || obstacleEntity.id}" berhasil dihapus & jalan dibuka!`,
          })
        );
        this.wake();
        return;
      } else {
        // For landmark building wall, open passage on this tile
        townConfig.setTileOverride(tileX, tileY, 'walkable_override');
        this.map.collision[tileY * this.map.w + tileX] = 0;
        this.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🟢 Dinding "${obstacleEntity.name || obstacleEntity.id}" di (${tileX}, ${tileY}) dibuka! Sekarang dapat dilewati.`,
          })
        );
        this.wake();
        return;
      }
    }

    // If no obstacle entity, check current collision override
    const curOverride = townConfig.getTileOverride(tileX, tileY);
    if (curOverride === 'walkable_override') {
      townConfig.removeTileOverride(tileX, tileY);
      this.townBackgroundCanvas = null;
      sfx.select();
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `🔄 Koordinat (${tileX}, ${tileY}) dikembalikan ke kondisi awal.`,
        })
      );
      this.wake();
      return;
    }

    // If tile is blocked by terrain / fence / water / solid override
    if (!this.isTileWalkable(tileX, tileY)) {
      townConfig.setTileOverride(tileX, tileY, 'walkable_override');
      this.map.collision[tileY * this.map.w + tileX] = 0;
      this.townBackgroundCanvas = null;
      sfx.confirm();
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `🟢 Koordinat (${tileX}, ${tileY}) dibuka! Sekarang dapat dilewati.`,
        })
      );
      this.wake();
      return;
    }

    // If tile is clean, user can ensure it stays permanently walkable
    townConfig.setTileOverride(tileX, tileY, 'walkable_override');
    sfx.select();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `✅ Koordinat (${tileX}, ${tileY}) ditandai selalu bisa dilewati (Walkable Override).`,
      })
    );
    this.wake();
  }

  public renderXrayOverlay(ctx: CanvasRenderingContext2D): void {
    if (this.currentScene !== 'town') return;

    // Viewport bounds calculation in world tiles
    const viewW = this.canvas.width / this.zoom;
    const viewH = this.canvas.height / this.zoom;
    const left = this.cameraX - viewW / 2;
    const right = this.cameraX + viewW / 2;
    const top = this.cameraY - viewH / 2;
    const bottom = this.cameraY + viewH / 2;

    const minX = Math.max(0, Math.floor(left / TILE_SIZE) - 1);
    const maxX = Math.min(this.map.w - 1, Math.ceil(right / TILE_SIZE) + 1);
    const minY = Math.max(0, Math.floor(top / TILE_SIZE) - 1);
    const maxY = Math.min(this.map.h - 1, Math.ceil(bottom / TILE_SIZE) + 1);

    ctx.save();

    // 1. Subtle cyber grid lines across visible viewport
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = minX; x <= maxX + 1; x++) {
      ctx.moveTo(x * TILE_SIZE, minY * TILE_SIZE);
      ctx.lineTo(x * TILE_SIZE, (maxY + 1) * TILE_SIZE);
    }
    for (let y = minY; y <= maxY + 1; y++) {
      ctx.moveTo(minX * TILE_SIZE, y * TILE_SIZE);
      ctx.lineTo((maxX + 1) * TILE_SIZE, y * TILE_SIZE);
    }
    ctx.stroke();

    // 2. Collision tiles overlay (Solid = Red, Walkable Override = Green)
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const override = townConfig.getTileOverride(x, y);
        const walkable = this.isTileWalkable(x, y);
        const tx = x * TILE_SIZE;
        const ty = y * TILE_SIZE;

        if (override === 'walkable_override') {
          // Explicitly unblocked / opened path
          ctx.fillStyle = 'rgba(16, 185, 129, 0.38)';
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Small checkmark
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(tx + 4, ty + 8);
          ctx.lineTo(tx + 7, ty + 12);
          ctx.lineTo(tx + 12, ty + 4);
          ctx.stroke();
        } else if (!walkable) {
          // Blocked obstacle or solid collision
          ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Diagonal hatch mark
          ctx.beginPath();
          ctx.moveTo(tx + 3, ty + 3);
          ctx.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 3);
          ctx.stroke();
        }
      }
    }

    // 3. Entity wireframes & hidden object highlights
    const allEntities = townConfig.getBuildings(true);
    for (const b of allEntities) {
      if (b.x + b.w < minX || b.x > maxX || b.y + b.h < minY || b.y > maxY) continue;

      const bx = b.x * TILE_SIZE;
      const by = b.y * TILE_SIZE;
      const bw = b.w * TILE_SIZE;
      const bh = b.h * TILE_SIZE;

      if (b.hidden) {
        // Invisible / Hidden Object revealed by X-Ray!
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        ctx.fillStyle = '#f3e8ff';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`👻 [HIDDEN] ${b.name || b.id}`, bx + 2, by + 2);
      } else {
        // Normal entity footprint
        ctx.strokeStyle = b.kind === 'building' ? 'rgba(56, 189, 248, 0.75)' : 'rgba(251, 146, 60, 0.75)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
        ctx.setLineDash([]);

        // Highlight doors if building
        if (b.kind === 'building') {
          const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
          const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
          ctx.fillStyle = 'rgba(34, 197, 94, 0.65)';
          ctx.fillRect(doorX * TILE_SIZE + 2, doorY * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1;
          ctx.strokeRect(doorX * TILE_SIZE + 2, doorY * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }
    }

    // 4. Hover tile indicator & floating inspector tooltip card
    if (
      this.xrayHoverTile &&
      this.xrayHoverTile.x >= 0 &&
      this.xrayHoverTile.x < this.map.w &&
      this.xrayHoverTile.y >= 0 &&
      this.xrayHoverTile.y < this.map.h
    ) {
      const hx = this.xrayHoverTile.x;
      const hy = this.xrayHoverTile.y;
      const info = this.getTileCollisionInfo(hx, hy);

      const hxWorld = hx * TILE_SIZE;
      const hyWorld = hy * TILE_SIZE;

      // Pulsing cursor frame in world coords
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.008);
      ctx.strokeStyle = info.walkable
        ? `rgba(52, 211, 153, ${0.7 + pulse * 0.3})`
        : `rgba(248, 113, 113, ${0.7 + pulse * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(hxWorld, hyWorld, TILE_SIZE, TILE_SIZE);

      // Reset transform to screen/canvas physical coordinates for crystal-clear tooltip rendering
      ctx.restore();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasX = this.canvas.width / 2 + ((hx + 0.5) * TILE_SIZE - this.cameraX) * this.zoom;
      const canvasY = this.canvas.height / 2 + (hy * TILE_SIZE - this.cameraY) * this.zoom;

      const cardW = Math.round(240 * dpr);
      const cardH = Math.round(76 * dpr);
      let cardX = canvasX + 16 * dpr;
      let cardY = canvasY - cardH - 12 * dpr;

      if (cardX + cardW > this.canvas.width - 12 * dpr) {
        cardX = canvasX - cardW - 16 * dpr;
      }
      if (cardX < 12 * dpr) {
        cardX = 12 * dpr;
      }
      if (cardY < 12 * dpr) {
        cardY = canvasY + 28 * dpr;
      }
      if (cardY + cardH > this.canvas.height - 12 * dpr) {
        cardY = this.canvas.height - cardH - 12 * dpr;
      }

      // Rounded tooltip background
      const radius = 8 * dpr;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.94)';
      ctx.strokeStyle = info.isHidden
        ? 'rgba(192, 132, 252, 0.9)'
        : info.walkable
        ? 'rgba(52, 211, 153, 0.8)'
        : 'rgba(248, 113, 113, 0.8)';
      ctx.lineWidth = 1.5 * dpr;

      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + radius, radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH, radius);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - radius, radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.arcTo(cardX, cardY, cardX + radius, cardY, radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tooltip Text Lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Line 1: Header / Coordinate
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(11 * dpr)}px monospace`;
      ctx.fillText(`🔬 X-RAY [${hx}, ${hy}]`, cardX + 10 * dpr, cardY + 8 * dpr);

      // Line 1 Right: Status
      ctx.textAlign = 'right';
      ctx.fillStyle = info.isHidden ? '#c084fc' : info.walkable ? '#34d399' : '#f87171';
      ctx.font = `bold ${Math.round(10 * dpr)}px sans-serif`;
      ctx.fillText(
        info.isHidden ? '👻 TERSEMBUNYI' : info.walkable ? '🟢 BISA DILEWATI' : '⛔ TERHALANG',
        cardX + cardW - 10 * dpr,
        cardY + 9 * dpr
      );

      // Line 2: Reason / Object detail
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f1f5f9';
      ctx.font = `${Math.round(10.5 * dpr)}px sans-serif`;
      const truncatedReason = info.reason.length > 28 ? info.reason.slice(0, 26) + '...' : info.reason;
      ctx.fillText(`Objek: ${truncatedReason}`, cardX + 10 * dpr, cardY + 28 * dpr);

      // Line 3: Action hint
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.round(9.5 * dpr)}px sans-serif`;
      const hint = info.isHidden
        ? '👉 Klik untuk HAPUS PERMANEN objek ini'
        : !info.walkable
        ? '👉 Klik untuk HAPUS / BUKA JALAN'
        : info.override === 'walkable_override'
        ? '👉 Klik untuk reset kondisi asli'
        : '👉 Koordinat bebas halangan';
      ctx.fillText(hint, cardX + 10 * dpr, cardY + 48 * dpr);
    }

    ctx.restore();
  }

  public setPlayerTile(x: number, y: number): void {
    const clampedX = Math.max(0, Math.min(this.map.w - 1, Math.round(x)));
    const clampedY = Math.max(0, Math.min(this.map.h - 1, Math.round(y)));
    this.playerPos = { x: clampedX, y: clampedY };
    this.playerTarget = { x: clampedX, y: clampedY };
    this.isMoving = false;
    this.moveProgress = 0;
    this.cameraX = (clampedX + 0.5) * TILE_SIZE;
    this.cameraY = (clampedY + 0.5) * TILE_SIZE;
    this.updateDomLabels();
    this.wake();
  }

  public getPlayerPos(): Vec {
    return { ...this.playerPos };
  }

  public getPlayerDir(): Dir {
    return this.playerDir;
  }

  public getMarker(): Vec | null {
    return this.marker ? { ...this.marker } : null;
  }

  public getPath(): Vec[] {
    return [...this.path];
  }

  public isBike(): boolean {
    return this.isBikeActive;
  }

  public isRiding(): boolean {
    return this.isRidingPokemon;
  }

  public getRideClass(pokemonId?: string): 'sky' | 'surf' | 'charge' {
    const fid = (pokemonId ?? this.activeFollower?.id ?? '').toLowerCase();
    if (
      [
        'rayquaza',
        'lunala',
        'giratina',
        'reshiram',
        'zekrom',
        'charizard',
        'latios',
        'latias',
        'mewtwo',
        'darkrai',
        'necrozma',
      ].includes(fid)
    ) {
      return 'sky';
    }
    if (['kyogre', 'palkia', 'samurott', 'urshifu', 'gyarados'].includes(fid)) {
      return 'surf';
    }
    return 'charge';
  }

  private findNearestWalkableLandTile(originX: number, originY: number, maxRadius = 2): Vec | null {
    if (this.currentScene !== 'town' || this.isTileWalkableOnFoot(originX, originY)) {
      return { x: originX, y: originY };
    }
    for (let r = 1; r <= maxRadius; r++) {
      const candidates: Vec[] = [];
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const nx = originX + dx;
          const ny = originY + dy;
          if (this.isTileWalkableOnFoot(nx, ny)) {
            candidates.push({ x: nx, y: ny });
          }
        }
      }
      if (candidates.length > 0) {
        const dirVec = DIRS[this.playerDir];
        candidates.sort((a, b) => {
          const da = Math.hypot(a.x - (originX + dirVec.x), a.y - (originY + dirVec.y));
          const db = Math.hypot(b.x - (originX + dirVec.x), b.y - (originY + dirVec.y));
          return da - db;
        });
        return candidates[0];
      }
    }
    return null;
  }

  private ensureSafeFootPosition() {
    if (this.currentScene !== 'town') return;
    if (!this.isTileWalkableOnFoot(this.playerPos.x, this.playerPos.y)) {
      const land = this.findNearestWalkableLandTile(this.playerPos.x, this.playerPos.y, 12);
      if (land) {
        this.playerPos = { ...land };
        this.playerTarget = { ...land };
        this.isMoving = false;
        this.moveProgress = 0;
      }
    }
  }

  public toggleBike(): boolean {
    if (this.isRidingPokemon) {
      const land = this.findNearestWalkableLandTile(this.playerPos.x, this.playerPos.y, 2);
      if (!land) {
        sfx.bump();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: '🌊 Tidak bisa ganti ke Mach Bike di tengah perairan! Menepi ke daratan terlebih dahulu.',
            })
          );
        }
        return false;
      }
      this.playerPos = { ...land };
      this.playerTarget = { ...land };
      this.isRidingPokemon = false;
      window.dispatchEvent(
        new CustomEvent('town:pokeride-changed', {
          detail: { active: false, follower: this.activeFollower, rideClass: this.getRideClass() },
        })
      );
    }
    this.isBikeActive = !this.isBikeActive;
    if (this.isBikeActive) {
      sfx.bikeBell();
    }
    window.dispatchEvent(
      new CustomEvent('town:bike-changed', {
        detail: { active: this.isBikeActive },
      })
    );
    this.wake();
    return this.isBikeActive;
  }

  public setBike(active: boolean) {
    if (this.isBikeActive !== active) {
      if (active && this.isRidingPokemon) {
        this.isRidingPokemon = false;
        this.ensureSafeFootPosition();
        window.dispatchEvent(
          new CustomEvent('town:pokeride-changed', {
            detail: { active: false, follower: this.activeFollower, rideClass: this.getRideClass() },
          })
        );
      }
      this.isBikeActive = active;
      if (this.isBikeActive) {
        sfx.bikeBell();
      }
      window.dispatchEvent(
        new CustomEvent('town:bike-changed', {
          detail: { active: this.isBikeActive },
        })
      );
      this.wake();
    }
  }

  public togglePokeRide(): boolean {
    if (!this.activeFollower) {
      sfx.select();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '🐾 Pilih Pokémon partner terlebih dahulu (Tekan P) untuk menunggangi!',
          })
        );
      }
      return false;
    }

    // If currently riding and attempting to dismount, verify safe land tile
    if (this.isRidingPokemon && this.currentScene === 'town') {
      const land = this.findNearestWalkableLandTile(this.playerPos.x, this.playerPos.y, 2);
      if (!land) {
        sfx.bump();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: '🌊 Tidak bisa turun di tengah perairan/rintangan! Arahkan tunggangan ke tepi daratan dahulu.',
            })
          );
        }
        return true;
      }
      if (land.x !== this.playerPos.x || land.y !== this.playerPos.y) {
        this.playerPos = { ...land };
        this.playerTarget = { ...land };
        this.isMoving = false;
        this.moveProgress = 0;
      }
    }

    this.isRidingPokemon = !this.isRidingPokemon;
    const rideClass = this.getRideClass(this.activeFollower.id);

    if (this.isRidingPokemon) {
      if (this.isBikeActive) {
        this.isBikeActive = false;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('town:bike-changed', {
              detail: { active: false },
            })
          );
        }
      }
      this.followerPos = { ...this.playerPos };
      this.followerTarget = { ...this.playerTarget };
      this.followerTrail = [];
      sfx.confirm();

      const fid = this.activeFollower.id;
      const toastMsg =
        fid === 'pikachu'
          ? '⚡ Pikachu melompat ke pundak Red! Mode Sprint Aktif! (Tekan R untuk turun)'
          : rideClass === 'sky'
          ? `✈️ Sky Soar bersama ${this.activeFollower.name}! Bisa terbang melintasi air & pagar! (R: Turun)`
          : rideClass === 'surf'
          ? `🌊 Aqua Surf bersama ${this.activeFollower.name}! Bisa berselancar di atas perairan! (R: Turun)`
          : `⚡ Terra Charge bersama ${this.activeFollower.name}! Kecepatan tinggi aktif! (R: Turun)`;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: toastMsg,
          })
        );
      }
      this.spawnRideMountFX();
    } else {
      sfx.step();
      const init = this.getFollowerInitialPos(this.playerPos.x, this.playerPos.y, this.playerDir);
      this.followerPos = { ...init.pos };
      this.followerTarget = { ...init.pos };
      this.followerTrail = [...init.trail];
      this.followerDir = this.playerDir;
      this.followerFacing = this.playerDir === 'left' ? 'left' : 'right';

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `👟 Turun dari ${this.activeFollower.name}. Partner kembali berjalan mengiringi.`,
          })
        );
      }
    }

    this.wake();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('town:pokeride-changed', {
          detail: { active: this.isRidingPokemon, follower: this.activeFollower, rideClass },
        })
      );
    }
    return this.isRidingPokemon;
  }

  public setPokeRide(active: boolean) {
    if (this.isRidingPokemon !== active) {
      this.togglePokeRide();
    }
  }

  public flyTo(tileX: number, tileY: number, locationName?: string) {
    sfx.fly();
    if (this.currentScene !== 'town') {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('town:respawn', `${tileX},${tileY}`);
        sessionStorage.setItem('town:fly_anim', '1');
      }
      this.callbacks.onNavigate('/');
      return;
    }

    this.heldDirs = [];
    this.bufferedDir = null;
    this.path = [];
    this.marker = null;
    this.isMoving = false;
    this.moveProgress = 0;

    const clampedX = Math.max(0, Math.min(this.map.w - 1, Math.round(tileX)));
    const clampedY = Math.max(0, Math.min(this.map.h - 1, Math.round(tileY)));
    this.playerPos = { x: clampedX, y: clampedY };
    this.playerTarget = { x: clampedX, y: clampedY };
    if (this.activeFollower) {
      if (this.isRidingPokemon) {
        this.followerPos = { x: clampedX, y: clampedY };
        this.followerTarget = { x: clampedX, y: clampedY };
        this.followerTrail = [];
      } else {
        const init = this.getFollowerInitialPos(clampedX, clampedY, this.playerDir);
        this.followerPos = { ...init.pos };
        this.followerTarget = { ...init.pos };
        this.followerTrail = [...init.trail];
      }
      this.followerDir = this.playerDir;
      this.followerFacing = this.playerDir === 'left' ? 'left' : 'right';
    }
    this.cameraX = (clampedX + 0.5) * TILE_SIZE;
    this.cameraY = (clampedY + 0.5) * TILE_SIZE;

    this.spawnFlyBurst(clampedX, clampedY);
    this.updateDomLabels();
    this.wake();

    window.dispatchEvent(
      new CustomEvent('town:fly-complete', {
        detail: { x: clampedX, y: clampedY, name: locationName },
      })
    );
  }

  public renderVisitorMinimap(canvas: HTMLCanvasElement): void {
    this.editor.renderMinimap(canvas);
  }

  public getMap(): TownMap {
    return this.map;
  }

  public getActiveLamps(): Lamp[] {
    const allBuildings = townConfig.getBuildings(true);
    if (allBuildings.length > 0) {
      const lamps: Lamp[] = [];
      const buildings = townConfig.getBuildings();
      for (const b of buildings) {
        if (b.hidden) continue;
        if (b.kind === 'lamp') {
          if (b.subType === 'stone_lantern') {
            lamps.push({ x: b.x, y: b.y, radius: 44, color: 'amber' });
          } else if (b.subType === 'lamp_cyber') {
            lamps.push({ x: b.x, y: b.y, radius: 52, color: 'cyan' });
          } else {
            lamps.push({ x: b.x, y: b.y, radius: 48, color: 'warm' });
          }
        } else if (b.kind === 'object') {
          if (b.subType === 'holo_projector' || b.id.startsWith('holo_projector')) {
            lamps.push({ x: b.x, y: b.y, radius: 40, color: 'cyan' });
          } else if (b.subType === 'pokestop' || b.id.startsWith('pokestop')) {
            lamps.push({ x: b.x, y: b.y, radius: 42, color: 'cyan' });
          } else if (b.subType === 'server_rack' || b.id.startsWith('server_rack')) {
            lamps.push({ x: b.x, y: b.y, radius: 34, color: 'cyan' });
          } else if (b.subType === 'pc_terminal' || b.id.startsWith('pc_terminal')) {
            lamps.push({ x: b.x, y: b.y, radius: 36, color: 'cyan' });
          } else if (b.subType === 'egg_incubator' || b.id.startsWith('egg_incubator')) {
            lamps.push({ x: b.x, y: b.y, radius: 36, color: 'gold' });
          } else if (b.subType === 'jukebox' || b.id.startsWith('jukebox')) {
            lamps.push({ x: b.x, y: b.y, radius: 40, color: 'magenta' });
          } else if (b.subType === 'campfire' || b.id === 'campfire') {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 52, color: 'amber' });
          }
        }
      }
      return lamps;
    }
    return this.map.lamps;
  }

  public handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    // Measure parent container to prevent canvas inline style feedback loop
    const container = this.canvas.parentElement || this.canvas;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (this.currentScene === 'town') {
      this.townBackgroundCanvas = null;
    }

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    const previousRatio = this.defaultZoom > 0 ? this.zoom / this.defaultZoom : 1;

    // Calculate zoom to frame the scene cleanly
    if (this.currentScene === 'home') {
      const targetW = HOME_COLS * TILE_SIZE * 1.05;
      const targetH = HOME_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (HOME_COLS * TILE_SIZE) / 2;
      this.cameraY = (HOME_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'dev') {
      const targetW = DEV_COLS * TILE_SIZE * 1.05;
      const targetH = DEV_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (DEV_COLS * TILE_SIZE) / 2;
      this.cameraY = (DEV_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'lab') {
      const targetW = LAB_COLS * TILE_SIZE * 1.05;
      const targetH = LAB_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (LAB_COLS * TILE_SIZE) / 2;
      this.cameraY = (LAB_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'arcade') {
      const targetW = ARCADE_COLS * TILE_SIZE * 1.05;
      const targetH = ARCADE_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (ARCADE_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARCADE_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'reception') {
      const targetW = RECEPTION_COLS * TILE_SIZE * 1.05;
      const targetH = RECEPTION_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (RECEPTION_COLS * TILE_SIZE) / 2;
      this.cameraY = (RECEPTION_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'mart') {
      const targetW = MART_COLS * TILE_SIZE * 1.05;
      const targetH = MART_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (MART_COLS * TILE_SIZE) / 2;
      this.cameraY = (MART_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'tower') {
      const targetW = TOWER_COLS * TILE_SIZE * 1.05;
      const targetH = TOWER_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (TOWER_COLS * TILE_SIZE) / 2;
      this.cameraY = (TOWER_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'cafe') {
      const targetW = CAFE_COLS * TILE_SIZE * 1.05;
      const targetH = CAFE_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (CAFE_COLS * TILE_SIZE) / 2;
      this.cameraY = (CAFE_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'arena') {
      const targetW = ARENA_COLS * TILE_SIZE * 1.05;
      const targetH = ARENA_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (ARENA_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARENA_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'garden') {
      const targetW = GARDEN_COLS * TILE_SIZE * 1.05;
      const targetH = GARDEN_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (GARDEN_COLS * TILE_SIZE) / 2;
      this.cameraY = (GARDEN_ROWS * TILE_SIZE) / 2;
    } else if (this.currentScene === 'neighbour') {
      const targetW = NEIGHBOUR_COLS * TILE_SIZE * 1.05;
      const targetH = NEIGHBOUR_ROWS * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      const zoomH = this.canvas.height / targetH;
      this.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
      this.cameraX = (NEIGHBOUR_COLS * TILE_SIZE) / 2;
      this.cameraY = (NEIGHBOUR_ROWS * TILE_SIZE) / 2;
    } else {
      const targetW = this.map.w * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      this.defaultZoom = Math.max(zoomW, 1.15 * dpr);
      this.cameraX = (this.map.w * TILE_SIZE) / 2;
      this.cameraY = (this.map.h * TILE_SIZE) / 2;
    }

    if (!this.isCustomZoom) {
      this.zoom = this.defaultZoom;
    } else if (previousRatio > 0) {
      this.zoom = this.defaultZoom * previousRatio;
    }

    this.updateDomLabels();
    this.wake();
  };

  public recenterCamera() {
    this.isCustomZoom = false;
    this.zoom = this.defaultZoom;
    this.handleResize();
    this.updateDomLabels();
    this.showZoomIndicator();
    this.wake();
  }

  // Energy-efficient sleep/wake loop
  public wake() {
    if (this.isAwake) return;
    this.isAwake = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  public sleep() {
    this.isAwake = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (time: number) => {
    if (!this.isAwake) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.render();

    // Dev, lab, reception, mart, and tower scenes continue loop for animated lights, screen scanlines, and idle states
    if (
      !this.xrayMode &&
      this.currentScene !== 'dev' &&
      this.currentScene !== 'lab' &&
      this.currentScene !== 'reception' &&
      this.currentScene !== 'mart' &&
      this.currentScene !== 'tower' &&
      this.currentScene !== 'cafe' &&
      this.currentScene !== 'arena' &&
      this.currentScene !== 'garden' &&
      this.currentScene !== 'neighbour' &&
      !this.isMoving &&
      this.path.length === 0 &&
      !this.marker &&
      this.heldDirs.length === 0 &&
      this.dustPuffs.length === 0 &&
      this.flyBurstParticles.length === 0
    ) {
      this.sleep();
      return;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private bindControls() {
    const codeToDir: Record<string, Dir> = {
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down',
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in forms / modals / inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.shiftKey !== this.isShiftHeld) {
        this.isShiftHeld = e.shiftKey;
        this.wake();
      }

      // Mach Bike toggle
      if (e.code === 'KeyB') {
        e.preventDefault();
        this.toggleBike();
        return;
      }

      // Poké Ride toggle
      if (e.code === 'KeyR') {
        e.preventDefault();
        this.togglePokeRide();
        return;
      }

      // Radar mini-map toggle
      if (e.code === 'KeyM') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('town:toggle-minimap'));
        return;
      }

      // If town editor is enabled and NOT in playtest mode, editor handles keys
      if (this.currentScene === 'town' && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
        return;
      }

      const dir = codeToDir[e.code];
      if (dir) {
        e.preventDefault();
        this.setDirPressed(dir, true);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        this.interactFacing();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey !== this.isShiftHeld) {
        this.isShiftHeld = e.shiftKey;
        this.wake();
      }
      const dir = codeToDir[e.code];
      if (dir) {
        this.setDirPressed(dir, false);
      }
    };

    const onBlur = () => {
      this.heldDirs = [];
      this.bufferedDir = null;
      this.isShiftHeld = false;
    };

    const onClick = (e: MouseEvent) => {
      if (this.currentScene === 'town' && this.editor.isEnabled()) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const clickScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const clickScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      // Convert screen coordinate to tile coordinate
      const worldX = (clickScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
      const worldY = (clickScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;

      const targetTileX = Math.floor(worldX / TILE_SIZE);
      const targetTileY = Math.floor(worldY / TILE_SIZE);

      if (this.xrayMode) {
        this.handleXrayClick(targetTileX, targetTileY, e.shiftKey);
        return;
      }

      // In Dev Center: clicking on any prop or NPC walks to and interacts with it!
      if (this.currentScene === 'dev') {
        const isEternatusHit = (
          (targetTileX >= 11 && targetTileX <= 12 && targetTileY >= 10 && targetTileY <= 12) ||
          Math.hypot(worldX - 192, worldY - 194) <= 28
        );

        const hitProp = isEternatusHit
          ? DEV_PROPS.find((p) => p.id === 'eternatus')
          : DEV_PROPS.find(
              (p) => targetTileX >= p.x && targetTileX < p.x + p.w && targetTileY >= p.y && targetTileY < p.y + p.h
            );

        if (hitProp) {
          const isAdjacent = (
            this.playerPos.x >= hitProp.x - 1 &&
            this.playerPos.x <= hitProp.x + hitProp.w &&
            this.playerPos.y >= hitProp.y - 1 &&
            this.playerPos.y <= hitProp.y + hitProp.h
          );

          if (isAdjacent) {
            if (this.playerPos.x < hitProp.x) this.playerDir = 'right';
            else if (this.playerPos.x >= hitProp.x + hitProp.w) this.playerDir = 'left';
            else if (this.playerPos.y < hitProp.y) this.playerDir = 'down';
            else if (this.playerPos.y >= hitProp.y + hitProp.h) this.playerDir = 'up';
            this.interactFacing(hitProp.id);
            this.wake();
            return;
          }

          this.walkToObject(hitProp.id);
          this.wake();
          return;
        }

        this.pendingTarget = null;
        this.walkTo(targetTileX, targetTileY);
        return;
      }

      // In Tech Tower: clicking on any prop or NPC walks to and interacts with it!
      if (this.currentScene === 'tower') {
        const isXurkitreeHit = (
          (targetTileX >= 5 && targetTileX <= 9 && targetTileY >= 3 && targetTileY <= 5) ||
          Math.hypot(worldX - 120, worldY - 56) <= 24
        );

        const hitProp = isXurkitreeHit
          ? TOWER_PROPS.find((p) => p.id === 'xurkitree')
          : TOWER_PROPS.find(
              (p) => targetTileX >= p.x && targetTileX < p.x + p.w && targetTileY >= p.y && targetTileY < p.y + p.h
            );

        if (hitProp) {
          const isAdjacent = (
            this.playerPos.x >= hitProp.x - 1 &&
            this.playerPos.x <= hitProp.x + hitProp.w &&
            this.playerPos.y >= hitProp.y - 1 &&
            this.playerPos.y <= hitProp.y + hitProp.h
          );

          if (isAdjacent) {
            if (this.playerPos.x < hitProp.x) this.playerDir = 'right';
            else if (this.playerPos.x >= hitProp.x + hitProp.w) this.playerDir = 'left';
            else if (this.playerPos.y < hitProp.y) this.playerDir = 'down';
            else if (this.playerPos.y >= hitProp.y + hitProp.h) this.playerDir = 'up';
            this.interactFacing(hitProp.id);
            this.wake();
            return;
          }

          this.walkToObject(hitProp.id);
          this.wake();
          return;
        }

        this.pendingTarget = null;
        this.walkTo(targetTileX, targetTileY);
        return;
      }

      // If clicking inside a building footprint, redirect target to its door
      for (const b of this.map.buildings) {
        const cfg = townConfig.getBuilding(b.id) || b;
        const bx = cfg.x;
        const by = cfg.y;
        const bw = cfg.w;
        const bh = cfg.h;
        if (targetTileX >= bx && targetTileX < bx + bw && targetTileY >= by && targetTileY < by + bh) {
          const doorX = (cfg as any).doorX ?? b.doors?.[0]?.x;
          const doorY = (cfg as any).doorY ?? b.doors?.[0]?.y;
          if (doorX !== undefined && doorY !== undefined) {
            this.pendingTarget = null;
            this.walkTo(doorX, doorY);
            return;
          }
        }
      }

      // Check if clicking directly on an NPC or Pokémon
      const arenaCfg = townConfig.getBuilding('arena');
      const aceX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : 28;
      const aceY = arenaCfg ? arenaCfg.y + 1 : 17;
      const hitNpc =
        this.map.npcs.find((n) => {
          const cfg = townConfig.getBuilding(n.id);
          const nx = cfg ? cfg.x : (n.id === 'ace' ? aceX : n.x);
          const ny = cfg ? cfg.y : (n.id === 'ace' ? aceY : n.y);
          const nw = cfg?.w ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(n.id) ? 2 : 1);
          const nh = cfg?.h ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(n.id) ? 2 : 1);
          return targetTileX >= nx && targetTileX < nx + nw && targetTileY >= ny && targetTileY < ny + nh;
        }) ||
        townConfig.getBuildings().find((b) => {
          if (b.hidden || b.kind !== 'npc') return false;
          return targetTileX >= b.x && targetTileX < b.x + b.w && targetTileY >= b.y && targetTileY < b.y + b.h;
        });

      if (hitNpc) {
        const cfg = townConfig.getBuilding(hitNpc.id);
        const nx = cfg ? cfg.x : (hitNpc.id === 'ace' ? aceX : hitNpc.x);
        const ny = cfg ? cfg.y : (hitNpc.id === 'ace' ? aceY : hitNpc.y);
        const nw = (hitNpc as any).w ?? cfg?.w ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(hitNpc.id) ? 2 : 1);
        const nh = (hitNpc as any).h ?? cfg?.h ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(hitNpc.id) ? 2 : 1);

        // If player is already adjacent to this NPC, interact immediately!
        const isAdjacent = (
          this.playerPos.x >= nx - 1 &&
          this.playerPos.x <= nx + nw &&
          this.playerPos.y >= ny - 1 &&
          this.playerPos.y <= ny + nh
        );

        if (isAdjacent) {
          if (this.playerPos.x < nx) this.playerDir = 'right';
          else if (this.playerPos.x >= nx + nw) this.playerDir = 'left';
          else if (this.playerPos.y < ny) this.playerDir = 'down';
          else if (this.playerPos.y >= ny + nh) this.playerDir = 'up';
          this.interactFacing(hitNpc.id);
          this.wake();
          return;
        }

        // Find nearest walkable adjacent tile
        let bestTile: Vec | null = null;
        let bestDist = Infinity;
        for (let dx = -1; dx <= nw; dx++) {
          for (let dy = -1; dy <= nh; dy++) {
            if (dx >= 0 && dx < nw && dy >= 0 && dy < nh) continue;
            const tx = nx + dx;
            const ty = ny + dy;
            if (this.canWalk(tx, ty)) {
              const d = Math.hypot(tx - this.playerPos.x, ty - this.playerPos.y);
              if (d < bestDist) {
                bestDist = d;
                bestTile = { x: tx, y: ty };
              }
            }
          }
        }

        if (bestTile) {
          this.pendingTarget = hitNpc.id;
          this.walkTo(bestTile.x, bestTile.y);
          return;
        }
      }

      // Click on active follower to mount, or click on player to mount/dismount Poké Ride
      if (this.isRidingPokemon) {
        const isPlayerHit =
          (targetTileX === this.playerPos.x && targetTileY === this.playerPos.y) ||
          Math.hypot(worldX - (this.playerPos.x * TILE_SIZE + 8), worldY - (this.playerPos.y * TILE_SIZE + 8)) <= 20;
        if (isPlayerHit) {
          this.togglePokeRide();
          return;
        }
      } else if (this.activeFollower) {
        const isFollowerHit =
          (targetTileX === this.followerPos.x && targetTileY === this.followerPos.y) ||
          Math.hypot(worldX - (this.followerPos.x * TILE_SIZE + 8), worldY - (this.followerPos.y * TILE_SIZE + 8)) <= 20;
        if (isFollowerHit) {
          this.togglePokeRide();
          return;
        }
      }

      this.pendingTarget = null;
      this.walkTo(targetTileX, targetTileY);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (this.currentScene === 'town' && this.editor.isEnabled()) {
        this.editor.handleMouseDown(e);
        this.wake();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.currentScene === 'town' && this.editor.isEnabled()) {
        this.editor.handleMouseMove(e);
        this.wake();
      } else if (this.xrayMode) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        const worldX = (mouseScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
        const worldY = (mouseScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;
        const tx = Math.floor(worldX / TILE_SIZE);
        const ty = Math.floor(worldY / TILE_SIZE);

        if (!this.xrayHoverTile || this.xrayHoverTile.x !== tx || this.xrayHoverTile.y !== ty) {
          this.xrayHoverTile = { x: tx, y: ty };
          this.wake();
        }
      } else if (this.currentScene === 'dev') {
        const rect = this.canvas.getBoundingClientRect();
        const mouseScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        const worldX = (mouseScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
        const worldY = (mouseScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;
        const tx = Math.floor(worldX / TILE_SIZE);
        const ty = Math.floor(worldY / TILE_SIZE);

        const isEternatusHover = (
          (tx >= 11 && tx <= 12 && ty >= 10 && ty <= 12) ||
          Math.hypot(worldX - 192, worldY - 194) <= 28
        );
        const hitProp = isEternatusHover || DEV_PROPS.some(
          (p) => tx >= p.x && tx < p.x + p.w && ty >= p.y && ty < p.y + p.h
        );
        this.canvas.style.cursor = hitProp ? 'pointer' : '';
      } else if (this.currentScene === 'tower') {
        const rect = this.canvas.getBoundingClientRect();
        const mouseScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        const worldX = (mouseScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
        const worldY = (mouseScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;
        const tx = Math.floor(worldX / TILE_SIZE);
        const ty = Math.floor(worldY / TILE_SIZE);

        const isXurkitreeHover = (
          (tx >= 5 && tx <= 9 && ty >= 3 && ty <= 5) ||
          Math.hypot(worldX - 120, worldY - 56) <= 24
        );
        const hitProp = isXurkitreeHover || TOWER_PROPS.some(
          (p) => tx >= p.x && tx < p.x + p.w && ty >= p.y && ty < p.y + p.h
        );
        this.canvas.style.cursor = hitProp ? 'pointer' : '';
      }
    };

    const onMouseLeave = () => {
      if (this.xrayHoverTile) {
        this.xrayHoverTile = null;
        this.wake();
      }
      if (this.canvas) {
        this.canvas.style.cursor = '';
      }
    };

    const onMouseUp = () => {
      if (this.currentScene === 'town' && this.editor.isEnabled()) {
        this.editor.handleMouseUp();
        this.wake();
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Prevent browser window from scrolling while hovering/wheeling over the town canvas
      e.preventDefault();

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      // Exponential zoom based on deltaY (silky smooth for mouse wheel and precision trackpads)
      const zoomFactor = Math.exp(-e.deltaY * 0.0018);
      const minZoom = 0.65 * dpr;
      const maxZoom = 4.8 * dpr;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, this.zoom * zoomFactor));

      if (Math.abs(newZoom - this.zoom) > 0.0001) {
        // Zoom centered around mouse pointer if in editor mode
        if (this.currentScene === 'town' && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
          const rect = this.canvas.getBoundingClientRect();
          const mouseCanvasX = (e.clientX - rect.left) * dpr;
          const mouseCanvasY = (e.clientY - rect.top) * dpr;
          const worldX = (mouseCanvasX - this.canvas.width / 2) / this.zoom + this.cameraX;
          const worldY = (mouseCanvasY - this.canvas.height / 2) / this.zoom + this.cameraY;
          this.cameraX = worldX - (mouseCanvasX - this.canvas.width / 2) / newZoom;
          this.cameraY = worldY - (mouseCanvasY - this.canvas.height / 2) / newZoom;
        }

        this.isCustomZoom = true;
        this.zoom = newZoom;
        this.updateDomLabels();
        this.showZoomIndicator();
        this.wake();
      }
    };

    let touchStartDist = 0;
    let touchStartZoom = this.zoom;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartZoom = this.zoom;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDist > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = dist / touchStartDist;
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const minZoom = 0.65 * dpr;
        const maxZoom = 4.8 * dpr;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, touchStartZoom * scale));
        if (Math.abs(newZoom - this.zoom) > 0.001) {
          this.isCustomZoom = true;
          this.zoom = newZoom;
          this.updateDomLabels();
          this.showZoomIndicator();
          this.wake();
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStartDist = 0;
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      if (this.currentScene === 'town' && this.editor.isEnabled()) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    this.canvas.addEventListener('click', onClick);
    this.canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    this.canvas.addEventListener('wheel', onWheel, { passive: false });
    this.canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    this.canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    this.canvas.addEventListener('contextmenu', onContextMenu);
    this.canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', this.handleResize);

    const onSetAtmo = (e: Event) => {
      const custom = e as CustomEvent<{ atmosphere: TownAtmosphere }>;
      if (custom.detail?.atmosphere) this.setAtmosphere(custom.detail.atmosphere);
    };
    const onCycleAtmo = () => {
      this.cycleAtmosphere();
    };
    const onSetWeather = (e: Event) => {
      const custom = e as CustomEvent<{ weather: TownWeather }>;
      if (custom.detail?.weather) this.setWeather(custom.detail.weather);
    };
    const onCycleWeather = () => {
      this.cycleWeather();
    };

    window.addEventListener('town:set-atmosphere', onSetAtmo);
    window.addEventListener('town:cycle-atmosphere', onCycleAtmo);
    window.addEventListener('town:set-weather', onSetWeather);
    window.addEventListener('town:cycle-weather', onCycleWeather);

    const onSetFollower = (e: Event) => {
      const custom = e as CustomEvent<{ followerId: string | null }>;
      if (custom.detail !== undefined) this.setActiveFollower(custom.detail.followerId);
    };
    const onTogglePokeRide = () => {
      this.togglePokeRide();
    };
    window.addEventListener('town:toggle-pokeride', onTogglePokeRide);
    const onTriggerMove = (e: Event) => {
      const custom = e as CustomEvent<{ pokemonId: string; originX?: number; originY?: number }>;
      if (custom.detail?.pokemonId) {
        this.triggerSignatureMove(custom.detail.pokemonId, custom.detail.originX, custom.detail.originY);
      }
    };

    const onLocate = (e: Event) => {
      const custom = e as CustomEvent<{ propId: string; targetId?: string }>;
      const id = custom.detail?.propId || custom.detail?.targetId;
      if (id) {
        this.walkToObject(id);
      }
    };

    const onCoffeeBoost = () => {
      this.activateCoffeeBoost();
    };
    const onTowerFloor = (e: Event) => {
      const custom = e as CustomEvent<{ floor: '1F' | '2F' | '3F' | '4F' }>;
      if (custom.detail?.floor) {
        this.setTowerFloor(custom.detail.floor, false);
      }
    };

    window.addEventListener('town:set-follower', onSetFollower);
    window.addEventListener('town:trigger-move', onTriggerMove);
    window.addEventListener('town:locate', onLocate);
    window.addEventListener('town:coffee-boost', onCoffeeBoost);
    window.addEventListener('town:tower-floor', onTowerFloor);

    const onReceptionHeal = () => {
      triggerHealAnimation();
      this.wake();
    };
    window.addEventListener('town:reception-heal-anim', onReceptionHeal);

    const onLuckyEgg = () => {
      this.activateCoffeeBoost(25);
      this.wake();
    };
    window.addEventListener('town:claim-lucky-egg', onLuckyEgg);

    const onMartCashAnim = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string }>;
      triggerCashRegisterAnimation(ce.detail?.text || 'CHA-CHING! +1 BRIEF');
      this.wake();
    };
    window.addEventListener('town:mart-cash-anim', onMartCashAnim);

    const onCafeBrewAnim = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string }>;
      triggerCafeBrewAnimation(ce.detail?.text || 'FRESH BREW! +100 FOCUS');
      this.wake();
    };
    window.addEventListener('town:cafe-brew-anim', onCafeBrewAnim);

    const onArenaFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerArenaBattleAnimation(ce.detail?.text || 'CRITICAL HIT! 100% EFFICIENCY', ce.detail?.color || '#a855f7');
      this.wake();
    };
    window.addEventListener('town:arena-fx', onArenaFx);

    const onGardenFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerGardenHarvestAnimation(ce.detail?.text || 'FRESH BERRIES HARVESTED! 🍇', ce.detail?.color || '#fde047');
      this.wake();
    };
    window.addEventListener('town:garden-fx', onGardenFx);

    const onNeighbourFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerNeighbourAnimation(ce.detail?.text || 'NEIGHBOUR FRIENDSHIP +10! 🏡', ce.detail?.color || '#fbbf24');
      this.wake();
    };
    window.addEventListener('town:neighbour-fx', onNeighbourFx);

    this.unbindEvents.push(
      () => window.removeEventListener('keydown', onKeyDown),
      () => window.removeEventListener('keyup', onKeyUp),
      () => window.removeEventListener('blur', onBlur),
      () => this.canvas.removeEventListener('click', onClick),
      () => this.canvas.removeEventListener('mousedown', onMouseDown),
      () => window.removeEventListener('mousemove', onMouseMove),
      () => window.removeEventListener('mouseup', onMouseUp),
      () => this.canvas.removeEventListener('wheel', onWheel),
      () => this.canvas.removeEventListener('touchstart', onTouchStart),
      () => this.canvas.removeEventListener('touchmove', onTouchMove),
      () => this.canvas.removeEventListener('touchend', onTouchEnd),
      () => this.canvas.removeEventListener('contextmenu', onContextMenu),
      () => this.canvas.removeEventListener('mouseleave', onMouseLeave),
      () => window.removeEventListener('resize', this.handleResize),
      () => window.removeEventListener('town:set-atmosphere', onSetAtmo),
      () => window.removeEventListener('town:cycle-atmosphere', onCycleAtmo),
      () => window.removeEventListener('town:set-weather', onSetWeather),
      () => window.removeEventListener('town:cycle-weather', onCycleWeather),
      () => window.removeEventListener('town:set-follower', onSetFollower),
      () => window.removeEventListener('town:trigger-move', onTriggerMove),
      () => window.removeEventListener('town:locate', onLocate),
      () => window.removeEventListener('town:coffee-boost', onCoffeeBoost),
      () => window.removeEventListener('town:tower-floor', onTowerFloor),
      () => window.removeEventListener('town:reception-heal-anim', onReceptionHeal),
      () => window.removeEventListener('town:claim-lucky-egg', onLuckyEgg),
      () => window.removeEventListener('town:mart-cash-anim', onMartCashAnim),
      () => window.removeEventListener('town:cafe-brew-anim', onCafeBrewAnim),
      () => window.removeEventListener('town:arena-fx', onArenaFx),
      () => window.removeEventListener('town:garden-fx', onGardenFx),
      () => window.removeEventListener('town:neighbour-fx', onNeighbourFx)
    );
  }

  public walkTo(targetX: number, targetY: number) {
    this.heldDirs = [];
    this.bufferedDir = null;
    const is2F = this.currentScene === 'home' && this.homeFloor === '2F';
    const cols =
      this.currentScene === 'home'
        ? (is2F ? HOME2F_COLS : HOME_COLS)
        : this.currentScene === 'dev'
          ? DEV_COLS
          : this.currentScene === 'lab'
            ? LAB_COLS
            : this.currentScene === 'arcade'
              ? ARCADE_COLS
              : this.currentScene === 'reception'
                ? RECEPTION_COLS
                : this.currentScene === 'mart'
                  ? MART_COLS
                  : this.currentScene === 'tower'
                    ? TOWER_COLS
                    : this.currentScene === 'cafe'
                      ? CAFE_COLS
                      : this.currentScene === 'arena'
                        ? ARENA_COLS
                        : this.currentScene === 'garden'
                          ? GARDEN_COLS
                          : this.currentScene === 'neighbour'
                            ? NEIGHBOUR_COLS
                            : this.map.w;
    const rows =
      this.currentScene === 'home'
        ? (is2F ? HOME2F_ROWS : HOME_ROWS)
        : this.currentScene === 'dev'
          ? DEV_ROWS
          : this.currentScene === 'lab'
            ? LAB_ROWS
            : this.currentScene === 'arcade'
              ? ARCADE_ROWS
              : this.currentScene === 'reception'
                ? RECEPTION_ROWS
                : this.currentScene === 'mart'
                  ? MART_ROWS
                  : this.currentScene === 'tower'
                    ? TOWER_ROWS
                    : this.currentScene === 'cafe'
                      ? CAFE_ROWS
                      : this.currentScene === 'arena'
                        ? ARENA_ROWS
                        : this.currentScene === 'garden'
                          ? GARDEN_ROWS
                          : this.currentScene === 'neighbour'
                            ? NEIGHBOUR_ROWS
                            : this.map.h;
    if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) return;
    const start = this.isMoving ? this.playerTarget : this.playerPos;
    const collisionMap =
      this.currentScene === 'home'
        ? is2F
          ? HOME2F_COLLISION
          : HOME_COLLISION
        : this.currentScene === 'dev'
          ? DEV_COLLISION
          : this.currentScene === 'lab'
            ? LAB_COLLISION
            : this.currentScene === 'arcade'
              ? ARCADE_COLLISION
              : this.currentScene === 'reception'
                ? RECEPTION_COLLISION
                : this.currentScene === 'mart'
                  ? MART_COLLISION
                  : this.currentScene === 'tower'
                    ? TOWER_COLLISION
                    : this.currentScene === 'cafe'
                      ? CAFE_COLLISION
                      : this.currentScene === 'arena'
                        ? ARENA_COLLISION
                        : this.currentScene === 'garden'
                          ? GARDEN_COLLISION
                          : this.currentScene === 'neighbour'
                            ? NEIGHBOUR_COLLISION
                            : this.getEffectiveCollisionMap();

    let destX = targetX;
    let destY = targetY;
    if (collisionMap[destY * cols + destX] !== 0) {
      const neighbors = [
        { x: destX, y: destY + 1 },
        { x: destX, y: destY - 1 },
        { x: destX + 1, y: destY },
        { x: destX - 1, y: destY },
      ].filter(
        (n) => n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows && collisionMap[n.y * cols + n.x] === 0
      );
      if (neighbors.length > 0) {
        neighbors.sort(
          (a, b) => Math.hypot(a.x - start.x, a.y - start.y) - Math.hypot(b.x - start.x, b.y - start.y)
        );
        destX = neighbors[0].x;
        destY = neighbors[0].y;
      }
    }

    const found = findPath(start, { x: destX, y: destY }, collisionMap, cols, rows);
    if (found && found.length > 0) {
      this.marker = { x: destX, y: destY };
      this.path = found;
      this.wake();
    } else if (this.pendingTarget) {
      const t = this.pendingTarget;
      this.pendingTarget = null;
      this.triggerPendingTarget(t);
    }
  }

  public isTileWalkableOnFoot(x: number, y: number): boolean {
    if (x < 0 || x >= this.map.w || y < 0 || y >= this.map.h) return false;

    // 1. Explicit tile brush overrides
    const override = townConfig.getTileOverride(x, y);
    if (override === 'walkable_override') return true;
    if (
      override === 'solid_override' ||
      override === 'water' ||
      override === 'hedge' ||
      override === 'fence' ||
      override === 'fence_water'
    ) {
      return false;
    }

    // 2. Dynamic entities from townConfig (Buildings, NPCs, Objects, Props, Trees, Benches, Signs)
    for (const b of townConfig.getBuildings()) {
      if (b.hidden) continue;

      // Open-air walkable zones (arenas, gardens, contest grounds)
      if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;

      // Tree collision: trunk row at bottom of tree footprint
      if (b.kind === 'tree') {
        const trunkY = b.y + b.h - 1;
        if (x >= b.x && x < b.x + b.w && y >= trunkY && y < b.y + b.h) {
          return false;
        }
        continue;
      }

      // Check if coordinate is inside entity footprint
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        // Buildings: footprint is solid EXCEPT entrance door
        if (b.kind === 'building') {
          const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
          const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
          const isDoor =
            ((x === doorX || (b.w >= 6 && (x === doorX - 1 || x === doorX + 1))) &&
             (y === doorY || y === b.y + b.h - 1));
          if (isDoor) continue;
          return false;
        }

        // All other objects, NPCs, benches, hedges, signs, water fences are solid obstacles
        return false;
      }
    }

    // 3. Tile override clearing base fence/obstacle
    if (
      override === 'grass' ||
      override === 'cobble' ||
      override === 'lab_paver' ||
      override === 'dev_paver' ||
      override === 'tall_grass'
    ) {
      const baseGround = this.map.ground[y * this.map.w + x];
      if (baseGround === Tile.FENCE || ((x === 38 || x === 39) && y === 30)) {
        return true;
      }
    }

    // 4. Base map terrain collision (island boundaries, cliffs, water)
    return this.map.collision[y * this.map.w + x] === 0;
  }

  public isTileWalkable(x: number, y: number): boolean {
    if (this.isTileWalkableOnFoot(x, y)) return true;

    // Poké Ride All-Terrain Traversal (Sky Soar & Aqua Surf)
    if (
      this.isRidingPokemon &&
      this.activeFollower &&
      this.currentScene === 'town' &&
      (!this.editor || !this.editor.isEnabled())
    ) {
      // Keep mount inside map bounds (prevent flying off the edge of the canvas)
      if (x < 1 || x >= this.map.w - 1 || y < 1 || y >= this.map.h - 1) return false;

      const rideClass = this.getRideClass(this.activeFollower.id);
      if (rideClass === 'charge') return false;

      const override = townConfig.getTileOverride(x, y);
      if (override === 'solid_override') return false;

      // Check dynamic entities: Buildings, Trees, and NPCs remain solid even when flying/surfing
      for (const b of townConfig.getBuildings()) {
        if (b.hidden) continue;
        if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;

        if (b.kind === 'tree') {
          const trunkY = b.y + b.h - 1;
          if (x >= b.x && x < b.x + b.w && y >= trunkY && y < b.y + b.h) {
            return false;
          }
          continue;
        }

        if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
          if (b.kind === 'building') {
            const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
            const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
            const isDoor =
              ((x === doorX || (b.w >= 6 && (x === doorX - 1 || x === doorX + 1))) &&
               (y === doorY || y === b.y + b.h - 1));
            if (isDoor) continue;
            return false;
          }
          // Sky mounts can soar over low fences/hedges, but not NPCs or large props
          const sub = b.subType || b.id;
          if (rideClass === 'sky' && (sub.includes('fence') || sub.includes('hedge'))) {
            continue;
          }
          return false;
        }
      }

      const baseGround = this.map.ground[y * this.map.w + x];
      if (rideClass === 'sky') {
        if (
          override === 'water' ||
          override === 'fence' ||
          override === 'hedge' ||
          override === 'fence_water' ||
          baseGround === Tile.WATER ||
          baseGround === Tile.FENCE
        ) {
          return true;
        }
      } else if (rideClass === 'surf') {
        if (override === 'water' || baseGround === Tile.WATER) {
          return true;
        }
      }
    }

    return false;
  }

  private getEffectiveCollisionMap(): Uint8Array {
    const coll = new Uint8Array(this.map.w * this.map.h);
    for (let y = 0; y < this.map.h; y++) {
      for (let x = 0; x < this.map.w; x++) {
        coll[y * this.map.w + x] = this.isTileWalkable(x, y) ? 0 : 1;
      }
    }
    return coll;
  }

  public setAtmosphere(mode: TownAtmosphere) {
    this.townAtmosphere = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('town:atmosphere', mode);
    }
    sfx.setBgmTheme(mode);
    this.initParticles();
    this.wake();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('town:atmosphere-changed', {
          detail: { atmosphere: this.townAtmosphere, weather: this.weather },
        })
      );
    }
  }

  public cycleAtmosphere(): TownAtmosphere {
    const next: TownAtmosphere =
      this.townAtmosphere === 'day' ? 'sunset' : this.townAtmosphere === 'sunset' ? 'night' : 'day';
    sfx.select();
    this.setAtmosphere(next);
    return this.townAtmosphere;
  }

  public setWeather(w: TownWeather) {
    this.weather = w;
    if (typeof window !== 'undefined') {
      localStorage.setItem('town:weather', w);
    }
    sfx.select();
    this.initParticles();
    this.wake();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('town:weather-changed', {
          detail: { weather: this.weather, atmosphere: this.townAtmosphere },
        })
      );
    }
  }

  public cycleWeather(): TownWeather {
    const next: TownWeather =
      this.weather === 'petals' ? 'rain' : this.weather === 'rain' ? 'stars' : 'petals';
    this.setWeather(next);
    return this.weather;
  }

  public harvestBerries() {
    try {
      const STORAGE_KEY = 'critterdex:v1';
      let data: any = { seen: {}, caught: {}, steps: 0, balls: 0, quiz: [] };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        data = JSON.parse(raw);
      }
      data.balls = (data.balls || 0) + 3;
      data.met = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      sfx.heal();
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble(
          'Berry Harvest 🍇',
          `You picked fresh Oran, Sitrus & Cheri berries! +3 Poké Balls added to your bag. Total Poké Balls: ${data.balls} 🎒`
        );
      }
    } catch {
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Berry Harvest 🍇', 'You picked some delicious berries! (+3 Poké Balls)');
      }
    }
  }

  public walkToObject(id: string) {
    if (this.currentScene === 'tower') {
      this.pendingTarget = id;
      switch (id) {
        case 'xurkitree':
        case 'porygon':
          this.walkTo(7, 6);
          break;
        case 'robotics-bay':
          this.walkTo(2, 5);
          break;
        case 'server-rack':
          this.walkTo(12, 6);
          break;
        case 'career-terminal':
          this.walkTo(2, 9);
          break;
        case 'elevator':
          this.walkTo(9, 9);
          break;
        case 'lounge':
          this.walkTo(12, 8);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = TOWER_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'mart') {
      this.pendingTarget = id;
      switch (id) {
        case 'clerk':
          this.walkTo(6, 6);
          break;
        case 'meowth':
          this.walkTo(7, 6);
          break;
        case 'services-shelf':
          this.walkTo(2, 5);
          break;
        case 'tech-tms':
          this.walkTo(11, 5);
          break;
        case 'potions-shelf':
          this.walkTo(2, 6);
          break;
        case 'key-showcase':
          this.walkTo(11, 6);
          break;
        case 'drink-cooler':
          this.walkTo(12, 4);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = MART_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'cafe') {
      this.pendingTarget = id;
      switch (id) {
        case 'barista':
          this.walkTo(6, 6);
          break;
        case 'alcremie':
          this.walkTo(7, 6);
          break;
        case 'vinyl-jukebox':
          this.walkTo(2, 5);
          break;
        case 'pastry-case':
          this.walkTo(11, 5);
          break;
        case 'roast-board':
          this.walkTo(2, 6);
          break;
        case 'vip-booth':
          this.walkTo(11, 6);
          break;
        case 'craft-tap':
          this.walkTo(12, 4);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = CAFE_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'arena') {
      this.pendingTarget = id;
      switch (id) {
        case 'mewtwo-boss':
          this.walkTo(7, 3);
          break;
        case 'lucario-coach':
          this.walkTo(3, 6);
          break;
        case 'referee-dan':
          this.walkTo(11, 6);
          break;
        case 'battle-terminal':
          this.walkTo(2, 5);
          break;
        case 'algorithm-dojo':
          this.walkTo(12, 5);
          break;
        case 'trophy-vault':
          this.walkTo(2, 7);
          break;
        case 'stat-radar':
          this.walkTo(12, 7);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = ARENA_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'garden') {
      this.pendingTarget = id;
      switch (id) {
        case 'botanist-flora':
          this.walkTo(6, 4);
          break;
        case 'shaymin-npc':
          this.walkTo(8, 4);
          break;
        case 'plot-oran':
          this.walkTo(2, 5);
          break;
        case 'plot-sitrus':
          this.walkTo(12, 5);
          break;
        case 'watering-well':
          this.walkTo(5, 6);
          break;
        case 'plot-cheri':
          this.walkTo(2, 9);
          break;
        case 'berry-blender':
          this.walkTo(12, 9);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = GARDEN_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'neighbour') {
      this.pendingTarget = id;
      switch (id) {
        case 'neighbour-maya':
          this.walkTo(6, 4);
          break;
        case 'eevee-companion':
          this.walkTo(8, 4);
          break;
        case 'guestbook-board':
          this.walkTo(2, 5);
          break;
        case 'coop-table':
          this.walkTo(12, 5);
          break;
        case 'fireplace-hearth':
          this.walkTo(5, 6);
          break;
        case 'retro-console':
          this.walkTo(2, 9);
          break;
        case 'mentorship-shelf':
          this.walkTo(12, 9);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = NEIGHBOUR_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'reception') {
      this.pendingTarget = id;
      switch (id) {
        case 'mira':
          this.walkTo(7, 5);
          break;
        case 'chansey':
          this.walkTo(9, 5);
          break;
        case 'healing-machine':
          this.walkTo(11, 4);
          break;
        case 'pc-terminal':
          this.walkTo(13, 6);
          break;
        case 'directory-board':
          this.walkTo(2, 4);
          break;
        case 'waiting-couch':
          this.walkTo(4, 7);
          break;
        case 'exit':
          this.walkTo(7, 11);
          break;
        default:
          const prop = RECEPTION_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'arcade') {
      this.pendingTarget = id;
      switch (id) {
        case 'robot':
          this.walkTo(9, 6);
          break;
        case 'scoreboard':
          this.walkTo(13, 2);
          break;
        case 'exit':
          this.walkTo(9, 13);
          break;
        default:
          const prop = ARCADE_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'lab') {
      this.pendingTarget = id;
      switch (id) {
        case 'lab-posters':
          this.walkTo(3, 2);
          break;
        case 'lab-whiteboard':
          this.walkTo(8, 2);
          break;
        case 'lab-bench':
          this.walkTo(6, 9);
          break;
        case 'hood':
          this.walkTo(10, 4);
          break;
        case 'fridge':
          this.walkTo(10, 9);
          break;
        case 'book-aeroscan':
          this.walkTo(1, 12);
          break;
        case 'book-spam':
          this.walkTo(2, 12);
          break;
        case 'book-omr':
          this.walkTo(3, 12);
          break;
        case 'plant':
          this.walkTo(10, 12);
          break;
        case 'exit':
          this.walkTo(6, 14);
          break;
        default:
          const prop = LAB_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'dev') {
      this.pendingTarget = id;
      switch (id) {
        case 'timeline':
          this.walkTo(7, 3);
          break;
        case 'radar':
          this.walkTo(2, 5);
          break;
        case 'telemetry':
          this.walkTo(12, 6);
          break;
        case 'lebronette':
        case 'snorlax':
          this.walkTo(7, 15);
          break;
        case 'eternatus':
          this.walkTo(10, 11);
          break;
        case 'console-wasm':
          this.walkTo(3, 9);
          break;
        case 'console-edge':
          this.walkTo(7, 9);
          break;
        case 'console-static':
          this.walkTo(11, 9);
          break;
        case 'whiteboard':
          this.walkTo(2, 11);
          break;
        case 'rack':
          this.walkTo(12, 11);
          break;
        case 'coffee':
          this.walkTo(12, 14);
          break;
        case 'plant':
          this.walkTo(2, 16);
          break;
        case 'exit':
          this.walkTo(7, 18);
          break;
        default:
          const prop = DEV_PROPS.find((p) => p.id === id);
          if (prop) this.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (this.currentScene === 'home') {
      this.pendingTarget = id;
      switch (id) {
        case 'shop-posters':
          this.walkTo(2, 2);
          break;
        case 'shop-polaroids':
          this.walkTo(9, 2);
          break;
        case 'stairs-up':
          this.switchHomeFloor('2F');
          break;
        case 'shop-jukebox':
          this.walkTo(2, 5);
          break;
        case 'shop-closet':
          this.walkTo(10, 6);
          break;
        case 'crates':
          this.walkTo(6, 7);
          break;
        case 'decks':
          this.walkTo(6, 10);
          break;
        case 'mirror':
          this.walkTo(12, 8);
          break;
        case 'counter':
          this.walkTo(2, 10);
          break;
        case 'plant':
          this.walkTo(12, 12);
          break;
        case 'motorbike':
          this.walkTo(10, 13);
          break;
        case 'exit':
          this.walkTo(7, 14);
          break;
        case 'home2f-fridge':
          this.walkTo(2, 3);
          break;
        case 'home2f-tv':
          this.walkTo(6, 3);
          break;
        case 'home2f-twin':
          this.walkTo(6, 5);
          break;
        case 'home2f-computer':
          this.walkTo(11, 8);
          break;
        case 'home2f-couch':
          this.walkTo(5, 5);
          break;
        case 'home2f-coffee':
          this.walkTo(9, 5);
          break;
        case 'home2f-palm':
          this.walkTo(2, 10);
          break;
        case 'home2f-bamboo':
          this.walkTo(12, 10);
          break;
        case 'home2f-stairs-down':
          this.switchHomeFloor('1F');
          break;
      }
      return;
    }

    const ALIAS_MAP: Record<string, string[]> = {
      depop: ['shop'],
      shop: ['depop'],
      berry: ['garden'],
      garden: ['berry'],
      neighbour: ['villa'],
      villa: ['neighbour'],
      lookout: ['telescope', 'sign_lookout'],
      hobby: ['gazebo', 'sign_hobby'],
      ranger: ['ranger', 'camp'],
      contest: ['contest', 'podium'],
      kiosk: ['cafe', 'bar'],
    };

    let cfg = townConfig.getBuilding(id);
    if (!cfg && ALIAS_MAP[id]) {
      for (const alias of ALIAS_MAP[id]) {
        cfg = townConfig.getBuilding(alias);
        if (cfg) break;
      }
    }

    if (cfg && cfg.doorX !== undefined && cfg.doorY !== undefined) {
      if (cfg.kind === 'building' && cfg.id !== 'arena') {
        this.pendingTarget = null;
      } else {
        this.pendingTarget = id;
      }
      this.walkTo(cfg.doorX, cfg.doorY);
      return;
    }

    // Dynamic fallback for custom/moved objects in town layout
    if (cfg) {
      if (cfg.kind === 'building') {
        this.pendingTarget = null;
        this.walkTo(cfg.x + Math.floor(cfg.w / 2), cfg.y + cfg.h);
      } else if (cfg.kind === 'npc') {
        this.pendingTarget = id;
        this.walkTo(cfg.x, cfg.y + 1);
      } else {
        this.pendingTarget = id;
        this.walkTo(cfg.x + Math.floor(cfg.w / 2), cfg.y + cfg.h);
      }
      return;
    }

    switch (id) {
      case 'home':
        this.pendingTarget = null;
        this.walkTo(15, 27);
        break;
      case 'dev':
        this.pendingTarget = null;
        this.walkTo(16, 12);
        break;
      case 'lab':
        this.pendingTarget = null;
        this.walkTo(27, 9);
        break;
      case 'villa':
      case 'neighbour':
        this.pendingTarget = null;
        this.walkTo(27, 24);
        break;
      case 'arcade':
        this.pendingTarget = null;
        this.walkTo(28, 43);
        break;
      case 'reception':
        this.pendingTarget = null;
        this.walkTo(15, 35);
        break;
      case 'office':
      case 'tower':
        this.pendingTarget = null;
        this.walkTo(6, 51);
        break;
      case 'shop':
      case 'mart':
      case 'depop':
        this.pendingTarget = null;
        this.walkTo(15, 42);
        break;
      case 'statue':
        this.pendingTarget = 'statue';
        this.walkTo(16, 17);
        break;
      case 'fountain':
        this.pendingTarget = 'fountain';
        this.walkTo(28, 33);
        break;
      case 'twin':
        this.pendingTarget = 'twin';
        this.walkTo(25, 27);
        break;
      case 'reshiram':
        this.pendingTarget = 'reshiram';
        this.walkTo(8, 28);
        break;
      case 'zekrom':
        this.pendingTarget = 'zekrom';
        this.walkTo(8, 38);
        break;
      case 'giratina':
        this.pendingTarget = 'giratina';
        this.walkTo(31, 26);
        break;
      case 'palkia':
        this.pendingTarget = 'palkia';
        this.walkTo(31, 33);
        break;
      case 'dialga':
        this.pendingTarget = 'dialga';
        this.walkTo(38, 36);
        break;
      case 'charizard':
      case 'lebron':
        this.pendingTarget = 'charizard';
        this.walkTo(26, 33);
        break;
      case 'kiosk':
        this.pendingTarget = 'kiosk';
        this.walkTo(28, 52);
        break;
      case 'linkedin':
        this.pendingTarget = 'linkedin';
        this.walkTo(36, 48);
        break;
      case 'resume':
        this.pendingTarget = 'resume';
        this.walkTo(40, 48);
        break;
      case 'github':
        this.pendingTarget = 'github';
        this.walkTo(36, 52);
        break;
      case 'email':
        this.pendingTarget = 'email';
        this.walkTo(40, 52);
        break;
      case 'lookout':
        this.pendingTarget = 'lookout';
        this.walkTo(39, 4);
        break;
      case 'arena': {
        this.pendingTarget = 'arena';
        const arenaCfg = townConfig.getBuilding('arena');
        const targetX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) : 28;
        const targetY = arenaCfg ? arenaCfg.y + arenaCfg.h - 1 : 24;
        this.walkTo(targetX, targetY);
        break;
      }
      case 'ace': {
        this.pendingTarget = 'ace';
        const arenaCfg = townConfig.getBuilding('arena');
        const targetX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : 28;
        const targetY = arenaCfg ? arenaCfg.y + 2 : 18;
        this.walkTo(targetX, targetY);
        break;
      }
      case 'berry':
        this.pendingTarget = 'berry';
        this.walkTo(36, 21);
        break;
      case 'contest': {
        this.pendingTarget = 'contest';
        const cCfg = townConfig.getBuilding('contest');
        if (cCfg && !cCfg.hidden) {
          this.walkTo(cCfg.x + 3, cCfg.y + 5);
        } else {
          this.walkTo(39, 31);
        }
        break;
      }
      case 'ranger':
      case 'tyranitar':
      case 'blastoise':
        this.pendingTarget = 'ranger';
        this.walkTo(37, 43);
        break;
      case 'hobby':
        this.pendingTarget = 'hobby';
        this.walkTo(8, 35);
        break;
      case 'ace':
        this.pendingTarget = 'ace';
        this.walkTo(28, 18);
        break;
    }
  }

  public getActiveHeldDir(): Dir | null {
    if (this.heldDirs.length === 0) return null;
    return this.heldDirs[this.heldDirs.length - 1];
  }

  public setDirPressed(dir: Dir, pressed: boolean) {
    if (pressed) {
      if (!this.heldDirs.includes(dir)) {
        this.heldDirs.push(dir);
      } else {
        this.heldDirs = this.heldDirs.filter((d) => d !== dir);
        this.heldDirs.push(dir);
      }
      this.path = [];
      this.pendingTarget = null;
      this.marker = null;

      if (!this.isMoving) {
        this.stepTowards(dir);
      } else {
        this.bufferedDir = dir;
      }
      this.wake();
    } else {
      this.heldDirs = this.heldDirs.filter((d) => d !== dir);
      if (this.bufferedDir === dir) {
        this.bufferedDir = null;
      }
    }
  }

  private stepTowards(dir: Dir) {
    this.playerDir = dir;
    const next = {
      x: this.playerPos.x + DIRS[dir].x,
      y: this.playerPos.y + DIRS[dir].y,
    };

    if (this.canWalk(next.x, next.y)) {
      this.onPlayerStepStart(next);
      this.playerTarget = next;
      this.isMoving = true;
      this.moveProgress = 0;
      this.wake();
    } else {
      this.isMoving = false;
      this.moveProgress = 0;
      const now = performance.now();
      if (now - this.lastBumpTime > 300) {
        sfx.bump();
        this.lastBumpTime = now;
      }
      this.wake();
    }
  }

  public queueMove(dir: Dir) {
    this.path = []; // cancel auto path
    this.pendingTarget = null;
    this.marker = null;
    this.playerDir = dir;

    if (this.isMoving) {
      this.bufferedDir = dir;
      return;
    }

    this.stepTowards(dir);
  }

  private canWalk(x: number, y: number): boolean {
    if (this.currentScene === 'home') {
      if (this.homeFloor === '2F') {
        if (x < 0 || x >= HOME2F_COLS || y < 0 || y >= HOME2F_ROWS) return false;
        return HOME2F_COLLISION[y * HOME2F_COLS + x] === 0;
      }
      return isHomeWalkable(x, y);
    }
    if (this.currentScene === 'dev') {
      if (x < 0 || x >= DEV_COLS || y < 0 || y >= DEV_ROWS) return false;
      return DEV_COLLISION[y * DEV_COLS + x] === 0;
    }
    if (this.currentScene === 'lab') {
      if (x < 0 || x >= LAB_COLS || y < 0 || y >= LAB_ROWS) return false;
      return LAB_COLLISION[y * LAB_COLS + x] === 0;
    }
    if (this.currentScene === 'arcade') {
      if (x < 0 || x >= ARCADE_COLS || y < 0 || y >= ARCADE_ROWS) return false;
      return ARCADE_COLLISION[y * ARCADE_COLS + x] === 0;
    }
    if (this.currentScene === 'reception') {
      if (x < 0 || x >= RECEPTION_COLS || y < 0 || y >= RECEPTION_ROWS) return false;
      return RECEPTION_COLLISION[y * RECEPTION_COLS + x] === 0;
    }
    if (this.currentScene === 'mart') {
      if (x < 0 || x >= MART_COLS || y < 0 || y >= MART_ROWS) return false;
      return MART_COLLISION[y * MART_COLS + x] === 0;
    }
    if (this.currentScene === 'tower') {
      if (x < 0 || x >= TOWER_COLS || y < 0 || y >= TOWER_ROWS) return false;
      return TOWER_COLLISION[y * TOWER_COLS + x] === 0;
    }
    if (this.currentScene === 'cafe') {
      if (x < 0 || x >= CAFE_COLS || y < 0 || y >= CAFE_ROWS) return false;
      return CAFE_COLLISION[y * CAFE_COLS + x] === 0;
    }
    if (this.currentScene === 'arena') {
      if (x < 0 || x >= ARENA_COLS || y < 0 || y >= ARENA_ROWS) return false;
      return ARENA_COLLISION[y * ARENA_COLS + x] === 0;
    }
    if (this.currentScene === 'garden') {
      if (x < 0 || x >= GARDEN_COLS || y < 0 || y >= GARDEN_ROWS) return false;
      return GARDEN_COLLISION[y * GARDEN_COLS + x] === 0;
    }
    if (this.currentScene === 'neighbour') {
      if (x < 0 || x >= NEIGHBOUR_COLS || y < 0 || y >= NEIGHBOUR_ROWS) return false;
      return NEIGHBOUR_COLLISION[y * NEIGHBOUR_COLS + x] === 0;
    }
    return this.isTileWalkable(x, y);
  }

  private update(dt: number) {
    this.tick++;
    if (this.isMoving) {
      this.followerWalkTick++;
    }
    if (this.rayquazaAttackTick > 0) {
      this.rayquazaAttackTick--;
    }
    if (this.arceusAttackTick > 0) {
      this.arceusAttackTick--;
    }
    if (this.reshiramAttackTick > 0) {
      this.reshiramAttackTick--;
    }
    if (this.zekromAttackTick > 0) {
      this.zekromAttackTick--;
    }
    if (this.giratinaAttackTick > 0) {
      this.giratinaAttackTick--;
    }
    if (this.palkiaAttackTick > 0) {
      this.palkiaAttackTick--;
    }
    if (this.dialgaAttackTick > 0) {
      this.dialgaAttackTick--;
    }
    if (this.lunalaAttackTick > 0) {
      this.lunalaAttackTick--;
    }
    if (this.solgaleoAttackTick > 0) {
      this.solgaleoAttackTick--;
    }
    if (this.garchompAttackTick > 0) {
      this.garchompAttackTick--;
    }
    if (this.groudonAttackTick > 0) {
      this.groudonAttackTick--;
    }
    if (this.kyogreAttackTick > 0) {
      this.kyogreAttackTick--;
    }
    if (this.tyranitarAttackTick > 0) {
      this.tyranitarAttackTick--;
    }
    if (this.gyaradosAttackTick > 0) {
      this.gyaradosAttackTick--;
    }

    // Update dynamic weather particles
    const totalW = this.map.w * TILE_SIZE;
    const totalH = this.map.h * TILE_SIZE;

    // Periodic shooting meteor in starfall weather
    if (this.weather === 'stars' && this.tick % 170 === 0 && Math.random() < 0.85) {
      this.particles.push({
        x: Math.random() * totalW * 0.8 + totalW * 0.2,
        y: Math.random() * (totalH * 0.4),
        vx: -6.5,
        vy: 4.2,
        size: 2,
        len: 26,
        alpha: 0.95,
        color: '#ffffff',
        type: 'meteor',
        life: 0,
        maxLife: 35,
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.type === 'meteor') {
        p.x += p.vx;
        p.y += p.vy;
        p.life = (p.life || 0) + 1;
        p.alpha = Math.max(0, 0.95 * (1 - p.life / (p.maxLife || 35)));
        if (p.life >= (p.maxLife || 35)) {
          this.particles.splice(i, 1);
        }
        continue;
      }

      if (p.type === 'ripple') {
        p.life = (p.life || 0) + 1;
        p.size += 0.35;
        p.alpha = Math.max(0, 0.5 * (1 - p.life / (p.maxLife || 14)));
        if (p.life >= (p.maxLife || 14)) {
          this.particles.splice(i, 1);
        }
        continue;
      }

      if (p.type === 'petal' || p.type === 'leaf') {
        p.x += p.vx + Math.sin(this.tick * (p.swaySpeed || 0.03) + (p.sway || 0)) * 0.55;
        p.y += p.vy;
        if (p.x > totalW) p.x = 0;
        if (p.y > totalH) p.y = 0;
      } else if (p.type === 'raindrop') {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > totalH || p.x < 0) {
          // 8% chance to spawn water ripple on landing
          if (Math.random() < 0.08 && this.particles.length < 85) {
            this.particles.push({
              x: p.x,
              y: p.y > totalH ? totalH - 4 : p.y,
              vx: 0,
              vy: 0,
              size: 1.5,
              alpha: 0.5,
              color: 'rgba(180, 220, 255, 0.6)',
              type: 'ripple',
              life: 0,
              maxLife: 14,
            });
          }
          p.y = -10;
          p.x = Math.random() * (totalW + 60);
        }
      } else if (p.type === 'star') {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = totalW;
        if (p.y < 0) p.y = totalH;
      }
    }

    // Update fireflies (night only)
    if (this.townAtmosphere === 'night') {
      for (const f of this.fireflies) {
        f.vx += (Math.random() - 0.5) * 0.08;
        f.vy += (Math.random() - 0.5) * 0.08;
        f.vx = Math.max(-0.4, Math.min(0.4, f.vx));
        f.vy = Math.max(-0.4, Math.min(0.4, f.vy));
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = totalW;
        if (f.x > totalW) f.x = 0;
        if (f.y < 0) f.y = totalH;
        if (f.y > totalH) f.y = 0;
      }
    }

    // Update signature move particles & camera shake
    if (this.cameraShakeTime > 0) this.cameraShakeTime--;
    if (this.followerEmoteTime > 0) this.followerEmoteTime--;
    for (let i = this.moveParticles.length - 1; i >= 0; i--) {
      const p = this.moveParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life++;
      p.alpha = Math.max(0, 0.95 * (1 - p.life / p.maxLife));
      if (p.life >= p.maxLife) {
        this.moveParticles.splice(i, 1);
      }
    }

    if (this.isMoving) {
      const rideClass = this.isRidingPokemon ? this.getRideClass() : null;
      const baseSpeed = this.isRidingPokemon
        ? rideClass === 'charge'
          ? 14.5
          : rideClass === 'sky'
          ? 14.2
          : 13.5 // Fast Poké Ride velocity!
        : this.isBikeActive
        ? 12.1
        : this.isShiftHeld
        ? 8.8
        : 5.5; // tiles per second (Shift = running shoes, Bike = Mach bike!)
      const speed = this.coffeeBoostTimer > 0 ? baseSpeed * 1.5 : baseSpeed;
      this.moveProgress += dt * speed;

      // Emit footstep / tire dust puffs or Poké Ride elemental trails when moving
      if ((this.isShiftHeld || this.isBikeActive || this.isRidingPokemon || this.coffeeBoostTimer > 0) && this.tick % (this.isRidingPokemon ? 3 : this.isBikeActive ? 3 : 5) === 0) {
        const curDrawX = (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
        const curDrawY = (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
        if (this.isRidingPokemon) {
          this.spawnRideTrailFX(curDrawX, curDrawY);
        } else {
          this.spawnDustPuff(curDrawX, curDrawY);
        }
      }

      if (this.moveProgress >= 1) {
        this.playerPos = { ...this.playerTarget };
        if (this.activeFollower) {
          this.followerPos = { ...this.followerTarget };
        }
        this.stepCount++;
        sfx.step();

        // Check tile triggers
        const prevScene = this.currentScene;
        const prevFloor = this.homeFloor;
        this.onStepComplete();
        if (this.currentScene !== prevScene || this.homeFloor !== prevFloor) {
          this.heldDirs = [];
          this.bufferedDir = null;
          this.isMoving = false;
          this.moveProgress = 0;
          return;
        }

        // If path is complete, clear marker and trigger pending interaction
        if (this.path.length > 0) {
          const nextStep = this.path.shift()!;
          const dx = nextStep.x - this.playerPos.x;
          const dy = nextStep.y - this.playerPos.y;

          if (dx === 1) this.playerDir = 'right';
          else if (dx === -1) this.playerDir = 'left';
          else if (dy === 1) this.playerDir = 'down';
          else if (dy === -1) this.playerDir = 'up';

          this.onPlayerStepStart(nextStep);
          this.playerTarget = nextStep;
          this.moveProgress = Math.max(0, this.moveProgress - 1);
          this.isMoving = true;
        } else {
          this.marker = null;
          if (this.pendingTarget) {
            const t = this.pendingTarget;
            this.pendingTarget = null;
            this.triggerPendingTarget(t);
          }

          // Check if WASD key is held or if a direction was buffered
          const nextDir = this.bufferedDir || this.getActiveHeldDir();
          this.bufferedDir = null;

          if (nextDir) {
            this.playerDir = nextDir;
            const next = {
              x: this.playerPos.x + DIRS[nextDir].x,
              y: this.playerPos.y + DIRS[nextDir].y,
            };

            if (this.canWalk(next.x, next.y)) {
              this.onPlayerStepStart(next);
              this.playerTarget = next;
              this.moveProgress = Math.max(0, this.moveProgress - 1);
              this.isMoving = true;
            } else {
              this.isMoving = false;
              this.moveProgress = 0;
              const now = performance.now();
              if (now - this.lastBumpTime > 300) {
                sfx.bump();
                this.lastBumpTime = now;
              }
            }
          } else {
            this.isMoving = false;
            this.moveProgress = 0;
          }
        }
      }
    } else if (this.path.length > 0) {
      const nextStep = this.path.shift()!;
      const dx = nextStep.x - this.playerPos.x;
      const dy = nextStep.y - this.playerPos.y;

      if (dx === 1) this.playerDir = 'right';
      else if (dx === -1) this.playerDir = 'left';
      else if (dy === 1) this.playerDir = 'down';
      else if (dy === -1) this.playerDir = 'up';

      this.onPlayerStepStart(nextStep);
      this.playerTarget = nextStep;
      this.isMoving = true;
      this.moveProgress = 0;
    } else if (this.heldDirs.length > 0) {
      const activeDir = this.getActiveHeldDir();
      if (activeDir) {
        this.stepTowards(activeDir);
      }
    }

    if (this.coffeeBoostTimer > 0) {
      this.coffeeBoostTimer = Math.max(0, this.coffeeBoostTimer - dt);
    }

    // Update dust puff particles
    for (let i = this.dustPuffs.length - 1; i >= 0; i--) {
      const p = this.dustPuffs[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life += dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.dustPuffs.splice(i, 1);
      }
    }

    // Update fly burst particles
    for (let i = this.flyBurstParticles.length - 1; i >= 0; i--) {
      const p = this.flyBurstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life += dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.flyBurstParticles.splice(i, 1);
      }
    }
  }

  private spawnDustPuff(x: number, y: number) {
    const count = this.isBikeActive ? 2 : 1;
    for (let i = 0; i < count; i++) {
      let ox = 8;
      let oy = 14;
      let vx = (Math.random() - 0.5) * 0.4;
      let vy = -0.2 - Math.random() * 0.3;
      if (this.playerDir === 'left') {
        ox = 14 + Math.random() * 2;
        vx = 0.5 + Math.random() * 0.5;
      } else if (this.playerDir === 'right') {
        ox = 2 - Math.random() * 2;
        vx = -0.5 - Math.random() * 0.5;
      } else if (this.playerDir === 'up') {
        oy = 15;
        vy = 0.3 + Math.random() * 0.4;
      } else if (this.playerDir === 'down') {
        oy = 12;
        vy = -0.3 - Math.random() * 0.4;
      }
      this.dustPuffs.push({
        x: x + ox,
        y: y + oy,
        vx,
        vy,
        size: 2 + Math.random() * 2,
        alpha: 0.8,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.15,
      });
    }
  }

  public spawnFlyBurst(tileX: number, tileY: number) {
    const cx = (tileX + 0.5) * TILE_SIZE;
    const cy = (tileY + 0.5) * TILE_SIZE;
    const colors = ['#38bdf8', '#7dd3fc', '#ffffff', '#bae6fd', '#0284c7'];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.2 + Math.random() * 2.8;
      this.flyBurstParticles.push({
        x: cx + Math.cos(angle) * 3,
        y: cy + Math.sin(angle) * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        color: colors[i % colors.length],
        life: 0,
        maxLife: 0.55 + Math.random() * 0.25,
      });
    }
  }

  public activateCoffeeBoost(durationSec = 30) {
    this.coffeeBoostTimer = durationSec;
    sfx.confirm();
    const curDrawX = this.playerPos.x * TILE_SIZE;
    const curDrawY = this.playerPos.y * TILE_SIZE;
    for (let i = 0; i < 8; i++) {
      this.spawnDustPuff(curDrawX, curDrawY);
    }
    window.dispatchEvent(new CustomEvent('town:lucky-egg-boost', { detail: { duration: durationSec } }));
    if (this.callbacks.onBubble) {
      this.callbacks.onBubble(
        '🥚 Lucky Egg Turbo Buff Active!',
        `Chansey's Lucky Egg has filled you with boundless energy! Character movement speed is boosted by +50% for ${durationSec} seconds. Enjoy exploring Zulfan's Portfolio Town!`
      );
    }
  }

  private drawMachBike(
    ctx: CanvasRenderingContext2D,
    dir: Dir,
    x: number,
    y: number,
    tick: number,
    isMoving: boolean
  ) {
    ctx.save();
    const frameColor = '#e11d48';
    const frameHighlight = '#fda4af';
    const chromeColor = '#cbd5e1';
    const tireColor = '#0f172a';
    const rimColor = '#64748b';
    const pedalColor = '#facc15';

    if (dir === 'left' || dir === 'right') {
      const isLeft = dir === 'left';
      const frontWheelX = isLeft ? x + 1 : x + 12;
      const rearWheelX = isLeft ? x + 12 : x + 1;
      const wheelY = y + 11;

      // 1. Wheels
      ctx.fillStyle = tireColor;
      ctx.fillRect(rearWheelX, wheelY, 4, 4);
      ctx.fillRect(frontWheelX, wheelY, 4, 4);

      ctx.fillStyle = rimColor;
      ctx.fillRect(rearWheelX + 1, wheelY + 1, 2, 2);
      ctx.fillRect(frontWheelX + 1, wheelY + 1, 2, 2);

      // Rotating spokes
      if (isMoving) {
        ctx.fillStyle = chromeColor;
        const spokeTick = Math.floor(tick / 2) % 2;
        if (spokeTick === 0) {
          ctx.fillRect(rearWheelX + 1, wheelY + 1, 1, 2);
          ctx.fillRect(frontWheelX + 1, wheelY + 1, 1, 2);
        } else {
          ctx.fillRect(rearWheelX + 1, wheelY + 2, 2, 1);
          ctx.fillRect(frontWheelX + 1, wheelY + 2, 2, 1);
        }
      }

      // 2. Bike Frame
      ctx.fillStyle = frameColor;
      const midX = isLeft ? x + 7 : x + 6;
      ctx.fillRect(midX, y + 12, 3, 2);
      if (isLeft) {
        ctx.fillRect(x + 9, y + 12, 3, 1);
        ctx.fillRect(x + 5, y + 9, 3, 3);
        ctx.fillRect(x + 8, y + 8, 2, 4);
        ctx.fillRect(x + 4, y + 8, 4, 2);
        ctx.fillRect(x + 2, y + 9, 2, 3);
      } else {
        ctx.fillRect(x + 4, y + 12, 3, 1);
        ctx.fillRect(x + 8, y + 9, 3, 3);
        ctx.fillRect(x + 6, y + 8, 2, 4);
        ctx.fillRect(x + 8, y + 8, 4, 2);
        ctx.fillRect(x + 12, y + 9, 2, 3);
      }

      // Frame highlight
      ctx.fillStyle = frameHighlight;
      ctx.fillRect(isLeft ? x + 5 : x + 9, y + 8, 2, 1);

      // 3. Handlebars
      ctx.fillStyle = chromeColor;
      const hbX = isLeft ? x + 3 : x + 11;
      ctx.fillRect(hbX, y + 6, 2, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(isLeft ? x + 2 : x + 12, y + 6, 1, 2);

      // 4. Saddle / Seat
      ctx.fillStyle = '#1e293b';
      const saddleX = isLeft ? x + 8 : x + 5;
      ctx.fillRect(saddleX, y + 7, 3, 2);

      // 5. Pedals
      ctx.fillStyle = pedalColor;
      const pedalAngle = isMoving ? tick * 0.4 : 0;
      const pedX = Math.round(midX + 1 + Math.cos(pedalAngle) * 2);
      const pedY = Math.round(y + 12 + Math.sin(pedalAngle) * 2);
      ctx.fillRect(pedX, pedY, 2, 1.5);
    } else if (dir === 'down') {
      // Facing Down
      ctx.fillStyle = chromeColor;
      ctx.fillRect(x + 4, y + 7, 8, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 3, y + 7, 1, 2);
      ctx.fillRect(x + 12, y + 7, 1, 2);

      ctx.fillStyle = frameColor;
      ctx.fillRect(x + 7, y + 8, 2, 4);

      ctx.fillStyle = tireColor;
      ctx.fillRect(x + 7, y + 11, 2, 5);
      ctx.fillStyle = rimColor;
      ctx.fillRect(x + 7.5, y + 12, 1, 3);

      ctx.fillStyle = pedalColor;
      const pedTick = tick % 8 < 4;
      ctx.fillRect(x + 4, y + 13 + (pedTick ? 0 : 1), 2, 1);
      ctx.fillRect(x + 10, y + 13 + (pedTick ? 1 : 0), 2, 1);
    } else {
      // Facing Up
      ctx.fillStyle = tireColor;
      ctx.fillRect(x + 7, y + 11, 2, 5);
      ctx.fillStyle = rimColor;
      ctx.fillRect(x + 7.5, y + 12, 1, 3);

      ctx.fillStyle = frameColor;
      ctx.fillRect(x + 7, y + 8, 2, 4);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 6, y + 7, 4, 2);

      ctx.fillStyle = chromeColor;
      ctx.fillRect(x + 5, y + 5, 6, 1.5);
    }

    ctx.restore();
  }

  private renderPathAndMarker(ctx: CanvasRenderingContext2D) {
    // 1. Breadcrumbs along remaining steps in this.path
    if (this.path.length > 0) {
      ctx.save();
      // Connective dashed guide line
      ctx.beginPath();
      const startX = (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress + 0.5) * TILE_SIZE;
      const startY = (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress + 0.5) * TILE_SIZE;
      ctx.moveTo(startX, startY);
      for (const step of this.path) {
        ctx.lineTo((step.x + 0.5) * TILE_SIZE, (step.y + 0.5) * TILE_SIZE);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();

      // Glowing breadcrumb dots at each waypoint
      for (let i = 0; i < this.path.length; i++) {
        const step = this.path[i];
        const px = (step.x + 0.5) * TILE_SIZE;
        const py = (step.y + 0.5) * TILE_SIZE;
        const pulse = 0.6 + 0.4 * Math.sin(this.tick * 0.15 + i * 0.4);

        ctx.save();
        ctx.fillStyle = `rgba(56, 189, 248, ${0.35 * pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(224, 242, 254, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Animated Pulsing Destination Target Ring at this.marker
    if (this.marker) {
      ctx.save();
      const mx = (this.marker.x + 0.5) * TILE_SIZE;
      const my = (this.marker.y + 0.5) * TILE_SIZE;

      // Expanding ripple ring
      const rippleProgress = (this.tick % 36) / 36;
      const rippleRadius = 4 + rippleProgress * 12;
      const rippleAlpha = (1 - rippleProgress) * 0.85;

      ctx.strokeStyle = `rgba(56, 189, 248, ${rippleAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mx, my, rippleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glowing ring
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Center focal point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();

      // Floating bobbing target pin above the tile
      const bounce = Math.sin(this.tick * 0.18) * 3;
      const pinY = my - 12 + bounce;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(mx, pinY + 5);
      ctx.lineTo(mx - 3.5, pinY);
      ctx.lineTo(mx + 3.5, pinY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(mx, pinY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx - 0.8, pinY - 1.8, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  private triggerPendingTarget(id: string) {
    switch (id) {
      case 'statue':
        this.playerDir = 'up';
        this.interactFacing('statue');
        break;
      case 'twin':
        this.playerDir = 'up';
        this.interactFacing('twin');
        break;
      case 'reshiram':
        this.playerDir = 'left';
        this.interactFacing('reshiram');
        break;
      case 'zekrom':
        this.playerDir = 'left';
        this.interactFacing('zekrom');
        break;
      case 'giratina':
        this.playerDir = 'right';
        this.interactFacing('giratina');
        break;
      case 'palkia':
        this.playerDir = 'right';
        this.interactFacing('palkia');
        break;
      case 'dialga':
        this.playerDir = 'right';
        this.interactFacing('dialga');
        break;
      case 'charizard':
      case 'lebron':
        this.playerDir = 'down';
        this.interactFacing('charizard');
        break;
      case 'rayquaza':
        this.playerDir = 'left';
        this.interactFacing('rayquaza');
        break;
      case 'arceus':
        this.playerDir = 'up';
        this.interactFacing('arceus');
        break;
      case 'garchomp':
        this.playerDir = 'up';
        this.interactFacing('garchomp');
        break;
      case 'urshifu':
      case 'urshifu_gmax':
        this.playerDir = 'up';
        this.interactFacing('urshifu');
        break;
      case 'samurott':
        this.playerDir = 'up';
        this.interactFacing('samurott');
        break;
      case 'mewtwo':
        this.playerDir = 'up';
        this.interactFacing('mewtwo');
        break;
      case 'kiosk':
      case 'cafe':
      case 'bar':
        this.playerDir = 'up';
        this.interactFacing('kiosk');
        break;
      case 'linkedin':
        this.playerDir = 'up';
        this.interactFacing('linkedin');
        break;
      case 'resume':
        this.playerDir = 'up';
        this.interactFacing('resume');
        break;
      case 'github':
        this.playerDir = 'down';
        this.interactFacing('github');
        break;
      case 'email':
        this.playerDir = 'down';
        this.interactFacing('email');
        break;
      case 'shop':
      case 'mart':
      case 'depop':
        this.playerDir = 'up';
        this.interactFacing('depop');
        break;
      case 'lookout':
        this.playerDir = 'up';
        this.interactFacing('lookout');
        break;
      case 'arena':
        this.playerDir = 'up';
        this.interactFacing('arena');
        break;
      case 'berry':
      case 'garden':
        this.playerDir = 'up';
        this.interactFacing('berry');
        break;
      case 'contest':
        this.playerDir = 'up';
        this.interactFacing('contest');
        break;
      case 'ranger':
      case 'tyranitar':
      case 'blastoise':
        this.playerDir = 'up';
        this.interactFacing('ranger');
        break;
      case 'hobby':
        this.playerDir = 'up';
        this.interactFacing('hobby');
        break;
      case 'ace':
        this.playerDir = 'up';
        this.interactFacing('ace');
        break;
      // Home 1F props
      case 'shop-posters':
        this.playerDir = 'up';
        this.interactFacing('shop-posters');
        break;
      case 'shop-polaroids':
        this.playerDir = 'up';
        this.interactFacing('shop-polaroids');
        break;
      case 'shop-jukebox':
        this.playerDir = 'up';
        this.interactFacing('shop-jukebox');
        break;
      case 'shop-closet':
        this.playerDir = 'up';
        this.interactFacing('shop-closet');
        break;
      case 'crates':
      case 'decks':
      case 'mirror':
      case 'counter':
      case 'plant':
      case 'motorbike':
        this.interactFacing(id);
        break;
      case 'stairs-up':
        this.switchHomeFloor('2F');
        break;
      // Home 2F props
      case 'home2f-fridge':
        this.playerDir = 'left';
        this.interactFacing('home2f-fridge');
        break;
      case 'home2f-tv':
        this.playerDir = 'up';
        this.interactFacing('home2f-tv');
        break;
      case 'home2f-twin':
      case 'home2f-couch':
        this.playerDir = 'down';
        this.interactFacing('home2f-twin');
        break;
      case 'home2f-computer':
        this.playerDir = 'down';
        this.interactFacing('home2f-computer');
        break;
      case 'home2f-coffee':
        this.playerDir = 'up';
        this.interactFacing('home2f-coffee');
        break;
      case 'home2f-palm':
        this.playerDir = 'left';
        this.interactFacing('home2f-palm');
        break;
      case 'home2f-bamboo':
        this.playerDir = 'right';
        this.interactFacing('home2f-bamboo');
        break;
      case 'home2f-stairs-down':
        this.switchHomeFloor('1F');
        break;
      // Reception props
      case 'mira':
        this.playerDir = 'up';
        this.interactFacing('mira');
        break;
      case 'healing-machine':
        this.playerDir = 'up';
        this.interactFacing('healing-machine');
        break;
      case 'pc-terminal':
        this.playerDir = 'up';
        this.interactFacing('pc-terminal');
        break;
      case 'directory-board':
        this.playerDir = 'up';
        this.interactFacing('directory-board');
        break;
      case 'waiting-couch':
        this.playerDir = 'left';
        this.interactFacing('waiting-couch');
        break;
      // Tech Tower props
      case 'xurkitree':
      case 'porygon':
        this.playerDir = 'up';
        this.interactFacing('xurkitree');
        break;
      case 'robotics-bay':
        this.playerDir = 'up';
        this.interactFacing('robotics-bay');
        break;
      case 'server-rack':
        this.playerDir = 'up';
        this.interactFacing('server-rack');
        break;
      case 'career-terminal':
        this.playerDir = 'up';
        this.interactFacing('career-terminal');
        break;
      case 'elevator':
        this.playerDir = 'up';
        this.interactFacing('elevator');
        break;
      case 'lounge':
        this.playerDir = 'right';
        this.interactFacing('lounge');
        break;
      // Poké Mart props
      case 'clerk':
        this.playerDir = 'up';
        this.interactFacing('clerk');
        break;
      case 'meowth':
        this.playerDir = 'up';
        this.interactFacing('meowth');
        break;
      case 'services-shelf':
        this.playerDir = 'up';
        this.interactFacing('services-shelf');
        break;
      case 'tech-tms':
        this.playerDir = 'up';
        this.interactFacing('tech-tms');
        break;
      case 'potions-shelf':
        this.playerDir = 'up';
        this.interactFacing('potions-shelf');
        break;
      case 'key-showcase':
        this.playerDir = 'up';
        this.interactFacing('key-showcase');
        break;
      case 'drink-cooler':
        this.playerDir = 'right';
        this.interactFacing('drink-cooler');
        break;
      // Poké-Café & Bar props
      case 'barista':
        this.playerDir = 'up';
        this.interactFacing('barista');
        break;
      case 'alcremie':
        this.playerDir = 'up';
        this.interactFacing('alcremie');
        break;
      case 'vinyl-jukebox':
        this.playerDir = 'up';
        this.interactFacing('vinyl-jukebox');
        break;
      case 'pastry-case':
        this.playerDir = 'up';
        this.interactFacing('pastry-case');
        break;
      case 'roast-board':
        this.playerDir = 'up';
        this.interactFacing('roast-board');
        break;
      case 'vip-booth':
        this.playerDir = 'up';
        this.interactFacing('vip-booth');
        break;
      case 'craft-tap':
        this.playerDir = 'right';
        this.interactFacing('craft-tap');
        break;
      // Gladiator Colosseum props
      case 'mewtwo-boss':
      case 'battle-terminal':
      case 'algorithm-dojo':
        this.playerDir = 'up';
        this.interactFacing(id);
        break;
      case 'lucario-coach':
        this.playerDir = 'left';
        this.interactFacing(id);
        break;
      case 'referee-dan':
        this.playerDir = 'right';
        this.interactFacing(id);
        break;
      case 'trophy-vault':
      case 'stat-radar':
        this.playerDir = 'down';
        this.interactFacing(id);
        break;
      // Botanical Berry Garden props
      case 'botanist-flora':
      case 'shaymin-npc':
      case 'plot-oran':
      case 'plot-sitrus':
      case 'plot-cheri':
      case 'berry-blender':
        this.playerDir = 'up';
        this.interactFacing(id);
        break;
      case 'watering-well':
        this.playerDir = 'left';
        this.interactFacing(id);
        break;
      // Dev Center props
      case 'eternatus':
        this.playerDir = 'right';
        this.interactFacing('eternatus');
        break;
      case 'snorlax':
      case 'lebronette':
        this.playerDir = 'up';
        this.interactFacing('snorlax');
        break;
      case 'coffee':
        this.playerDir = 'right';
        this.interactFacing('coffee');
        break;
      case 'rack':
        this.playerDir = 'right';
        this.interactFacing('rack');
        break;
      case 'whiteboard':
        this.playerDir = 'left';
        this.interactFacing('whiteboard');
        break;
      case 'console-wasm':
      case 'console-edge':
      case 'console-static':
      case 'telemetry':
      case 'radar':
      case 'timeline':
        this.playerDir = 'up';
        this.interactFacing(id);
        break;
      default:
        this.interactFacing(id);
        break;
    }
  }

  private onStepComplete() {
    if (this.currentScene === 'tower') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'mart') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'cafe') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '29,32');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'arena') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '38,44');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'garden') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '28,44');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'neighbour') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '27,25');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'reception') {
      if (this.playerPos.x === 7 && this.playerPos.y === 11) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'arcade') {
      if (this.playerPos.x === 9 && this.playerPos.y === 13) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'lab') {
      if (this.playerPos.x === 6 && this.playerPos.y === 14) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'dev') {
      if (this.playerPos.x === 7 && this.playerPos.y === 18) {
        sfx.door();
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
        this.callbacks.onNavigate('/');
        return;
      }
      return;
    }

    if (this.currentScene === 'home') {
      if (this.homeFloor === '1F') {
        if (this.playerPos.x === 7 && this.playerPos.y === 14) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
          this.callbacks.onNavigate('/');
          return;
        }
        if ((this.playerPos.x === 12 || this.playerPos.x === 13) && this.playerPos.y === 2) {
          sfx.step();
          this.switchHomeFloor('2F');
          return;
        }
      } else {
        // In 2F
        if ((this.playerPos.x === 12 || this.playerPos.x === 13) && this.playerPos.y === 2) {
          sfx.step();
          this.switchHomeFloor('1F');
          return;
        }
      }
      return;
    }

    const tileIdx = this.playerPos.y * this.map.w + this.playerPos.x;

    // 1. Dynamic building door triggers from townConfig (door tile or entrance step walking up)
    for (const b of this.map.buildings) {
      const cfg = townConfig.getBuilding(b.id);
      const doorX = cfg?.doorX ?? b.doors?.[0]?.x;
      const doorY = cfg?.doorY ?? b.doors?.[0]?.y;
      const route = cfg?.link ?? b.route;
      if (doorX !== undefined && doorY !== undefined && route) {
        if (
          (this.playerPos.x === doorX && this.playerPos.y === doorY) ||
          (this.playerPos.x === doorX && this.playerPos.y === doorY + 1 && this.playerDir === 'up')
        ) {
          sfx.door();
          this.callbacks.onNavigate(route);
          return;
        }
      }
      if (Array.isArray(b.doors)) {
        for (const d of b.doors) {
          if (
            (d.x === this.playerPos.x && d.y === this.playerPos.y) ||
            (d.x === this.playerPos.x && d.y === this.playerPos.y + 1 && this.playerDir === 'up')
          ) {
            sfx.door();
            this.callbacks.onNavigate(route || '/');
            return;
          }
        }
      }
    }

    // Static door fallback
    const route = this.map.doors.get(tileIdx);
    if (route) {
      sfx.door();
      this.callbacks.onNavigate(route);
      return;
    }

    // 2. Tall grass encounter (Map ground or custom tall_grass override)
    const customOverride = townConfig.getTileOverride(this.playerPos.x, this.playerPos.y);
    if (this.map.ground[tileIdx] === 2 || customOverride === 'tall_grass') {
      document.dispatchEvent(
        new CustomEvent('town:grass', {
          detail: {
            at: { ...this.playerPos },
          },
        })
      );
    }
  }

  public getHomeFloor(): '1F' | '2F' {
    return this.homeFloor;
  }

  public switchHomeFloor(floor: '1F' | '2F') {
    this.homeFloor = floor;
    if (floor === '2F') {
      this.playerPos = { x: 12, y: 4 };
      this.playerTarget = { x: 12, y: 4 };
      this.playerDir = 'down';
      this.cameraX = (HOME2F_COLS * TILE_SIZE) / 2;
      this.cameraY = (HOME2F_ROWS * TILE_SIZE) / 2;
      try {
        history.replaceState(null, '', '/about?floor=2');
      } catch { }
    } else {
      this.playerPos = { x: 12, y: 4 };
      this.playerTarget = { x: 12, y: 4 };
      this.playerDir = 'down';
      this.cameraX = (HOME_COLS * TILE_SIZE) / 2;
      this.cameraY = (HOME_ROWS * TILE_SIZE) / 2;
      try {
        history.replaceState(null, '', '/about');
      } catch { }
    }
    this.path = [];
    this.isMoving = false;
    this.pendingTarget = null;
    this.marker = null;
    this.updateFloorBadge();
    this.updateRoomGuide();
    this.updateDomLabels();
    this.wake();
  }

  private updateFloorBadge() {
    const chip = document.querySelector('[data-floor-chip]');
    if (chip) {
      chip.textContent = this.homeFloor;
      chip.removeAttribute('hidden');
    }
    document.documentElement.setAttribute('data-floor', this.homeFloor);
  }

  private updateRoomGuide() {
    const titleEl = document.querySelector('[data-town-guide-title]');
    const textEl = document.querySelector('[data-town-guide-text]');
    if (this.currentScene === 'home') {
      if (this.homeFloor === '2F') {
        if (titleEl) titleEl.textContent = "ZULFAN'S PLACE";
        if (textEl)
          textEl.textContent =
            'The TV works, you can leave Zulfan a note on the fridge, sit at his desk, or say hi to the twin on the couch. Take the stairs back down to the shop.';
      } else {
        if (titleEl) titleEl.textContent = 'CRATE & CLOSET';
        if (textEl)
          textEl.textContent =
            "Pick a song on the jukebox, dig the crates for a Crate Match, call in a request at the DJ booth and browse the closet. The stairs at the back go up to Zulfan's place. Step on the mat to leave.";
      }
    }
  }

  public setTowerFloor(floor: '1F' | '2F' | '3F' | '4F', notify: boolean = true) {
    this.activeTowerFloor = floor;
    sfx.door();
    this.wake();
    if (notify) {
      const tabId =
        floor === '1F'
          ? 'floor-1'
          : floor === '2F'
          ? 'floor-2'
          : floor === '3F'
          ? 'floor-3'
          : 'floor-4';
      window.dispatchEvent(
        new CustomEvent('town:tower-floor-changed', {
          detail: { floor, tabId },
        })
      );
    }
  }

  public openElevatorMenu() {
    sfx.select();
    if (this.callbacks.onBubble) {
      this.callbacks.onBubble(
        `Executive Elevator 🛗 (Active Floor: ${this.activeTowerFloor})`,
        'High-speed Tech Tower executive elevator. Please select your destination floor:',
        [
          {
            label: '1️⃣ Floor 1F: Lobby & AI Reception (Xurkitree)',
            onClick: () => {
              this.setTowerFloor('1F');
              this.walkToObject('xurkitree');
            },
          },
          {
            label: '2️⃣ Floor 2F: Robotics & IoT Bay (ITENAS & ESP32)',
            onClick: () => {
              this.setTowerFloor('2F');
              this.walkToObject('robotics-bay');
            },
          },
          {
            label: '3️⃣ Floor 3F: Cloud NOC & Security (Huawei HCIA)',
            onClick: () => {
              this.setTowerFloor('3F');
              this.walkToObject('server-rack');
            },
          },
          {
            label: '4️⃣ Floor 4F: Enterprise & Mentorship (6x Lab Assistant)',
            onClick: () => {
              this.setTowerFloor('4F');
              this.walkToObject('career-terminal');
            },
          },
        ]
      );
    }
  }

  public interactFacing(targetId?: string) {
    const activeTarget = targetId || this.pendingTarget;
    if (this.currentScene === 'tower') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? TOWER_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        TOWER_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.id === 'lounge') {
          window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'lounge', floor: '4F' } }));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Executive Sky Lounge Barista ☕',
              'A cozy artisan coffee lounge where engineers and lab assistants recharge! Select your handcrafted beverage:',
              [
                {
                  label: '☕ West Java Arabica Pour-Over (+50% Speed)',
                  onClick: () => {
                    this.activateCoffeeBoost();
                  },
                },
                {
                  label: '⚡ ITENAS Nitro Cold Brew (+80% Turbo Speed)',
                  onClick: () => {
                    this.activateCoffeeBoost(15000);
                    sfx.confirm();
                  },
                },
                {
                  label: '🍵 Uji Matcha Focus (Engineering Trivia)',
                  onClick: () => {
                    sfx.heal();
                    if (this.callbacks.onBubble) {
                      this.callbacks.onBubble(
                        'Matcha Focus · Engineering Milestone 🍵',
                        'Muhammad Zulfan graduated with a 3.49/4.00 GPA from ITENAS Bandung, coordinated the Robotics Laboratory, and earned Bronze at the National IDEA FEST 3 for smart embedded system design!'
                      );
                    }
                  },
                },
              ]
            );
          } else {
            this.activateCoffeeBoost();
          }
        } else if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'xurkitree' || prop.target.name === 'porygon') {
            this.setTowerFloor('1F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'xurkitree', floor: '1F' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Xurkitree AI Host ⚡ (UB-03 Lighting)',
                '⚡ BZZZZT-KZZT! Welcome to Tech Tower HQ! I am Xurkitree, the high-voltage AI Host managing Muhammad Zulfan\'s robotics research, high-security cloud NOC, and enterprise engineering track record. Which floor would you like to visit?',
                [
                  {
                    label: '🛗 Call Executive Elevator',
                    onClick: () => {
                      this.openElevatorMenu();
                    },
                  },
                  {
                    label: '🤖 Visit Robotics Bay (2F)',
                    onClick: () => {
                      this.setTowerFloor('2F');
                      this.walkToObject('robotics-bay');
                    },
                  },
                  {
                    label: '🔒 Check Cloud & Security NOC (3F)',
                    onClick: () => {
                      this.setTowerFloor('3F');
                      this.walkToObject('server-rack');
                    },
                  },
                  {
                    label: '💼 Experience & Mentorship Kiosk (4F)',
                    onClick: () => {
                      this.setTowerFloor('4F');
                      this.walkToObject('career-terminal');
                    },
                  },
                ]
              );
            } else {
              this.callbacks.onDialogue('Xurkitree AI Host ⚡', [
                '⚡ BZZZT-KZZT! Welcome to Tech Tower! This 4-story facility is Muhammad Zulfan\'s research hub for robotics, cloud infrastructure, and distributed AI.',
                'Use the Executive Elevator to explore floors 1F through 4F!',
              ]);
            }
          } else if (prop.target.name === 'robotics-bay') {
            this.setTowerFloor('2F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'robotics-bay', floor: '2F' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Robotics & IoT Lab Bay 🤖 (2F)',
                'Hardware & IoT Research Facility: Track record as ITENAS Robotics Laboratory Coordinator (kinematics curriculum, multimodal sensors, microcontrollers) and the ESP32 Remote Control Tank prototype with live web telemetry.',
                [
                  {
                    label: '🎮 Launch ESP32 RC Tank Testbench',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-tank-sandbox'));
                    },
                  },
                  {
                    label: '📜 View 2F Robotics & RC Tank Details',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '2F', propId: 'robotics-bay' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      this.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'server-rack') {
            this.setTowerFloor('3F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'server-rack', floor: '3F' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Cloud & Network NOC 🖧 (3F)',
                'Network Operations Center & Security: Internationally certified in Huawei HCIA-Security V4.0 (Firewall policies, IPSec VPN, NAT traversal) & high-concurrency cloud architecture (Apache Kafka, Redis Lua Mutexes, Kubernetes).',
                [
                  {
                    label: '🛡️ Launch Huawei Firewall & NOC Monitor',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-noc-sandbox'));
                    },
                  },
                  {
                    label: '🔒 View 3F Security & Topology Details',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '3F', propId: 'server-rack' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      this.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'career-terminal') {
            this.setTowerFloor('4F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'career-terminal', floor: '4F' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Experience & Mentorship Terminal 💼 (4F)',
                'Professional Career Kiosk: 6x ITENAS Laboratory Assistant (Robotics, IoT, Computer Networks, OOP Java, SQL Database), Software Development Intern at PT Dwi Purwa Teknologi, and Bronze Medalist at IDEA FEST 3.',
                [
                  {
                    label: '🎓 Launch 6x Lab Assistant & Career Kiosk',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-career-kiosk'));
                    },
                  },
                  {
                    label: '🎓 Open 4F Career Track Record & CV',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '4F', propId: 'career-terminal' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      this.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'elevator') {
            this.openElevatorMenu();
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'cafe') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? CAFE_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        CAFE_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'barista') {
            sfx.espressoBrew();
            triggerCafeBrewAnimation('WELCOME TO POKÉ-CAFÉ ☕');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Master Barista Rio · Poké-Café & Bar ☕',
                'Welcome to the Poké-Café & Developer Roastery Bar! We craft specialty single-origin TypeScript espresso, TensorRT cold brews, and artisan Castelia Cones. Care to brew a custom blend or pull up a chair for a Coffee Chat with Zulfan?',
                [
                  {
                    label: '☕ Brew Custom Dev Blend (+100 Energy)',
                    onClick: () => {
                      sfx.espressoBrew();
                      this.callbacks.onRefill();
                      triggerCafeBrewAnimation('DARK TYPESCRIPT ROAST! +100%');
                      const el = document.getElementById('cafe-custom-brewer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📋 Browse Artisanal Menu',
                    onClick: () => {
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '💬 Book VIP Coffee Chat',
                    onClick: () => {
                      this.walkToObject('vip-booth');
                      const el = document.getElementById('cafe-vip-lounge');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'alcremie') {
            sfx.heal();
            triggerCafeBrewAnimation('ALCREMIE SWEET CHARM! 🍓✨');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Alcremie · Pastry Mascot 🍓✨',
                '"Alcre-cremie~!" Alcremie twirls happily and tops your drink with whipped strawberry cream and zero-bug sugar sprinkles! Stamina & coding focus restored to 100%!',
                [
                  {
                    label: '🍦 Taste Castelia Cone (+25s Speed Boost)',
                    onClick: () => {
                      sfx.heal();
                      this.callbacks.onRefill();
                      this.activateCoffeeBoost(25);
                      triggerCafeBrewAnimation('CASTELIA CONE RUSH! ⚡');
                    },
                  },
                  {
                    label: '🧁 Inspect Pastry Showcase',
                    onClick: () => {
                      this.walkToObject('pastry-case');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'vinyl-jukebox') {
            sfx.discSpin();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'vinyl-jukebox' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Lo-Fi Vinyl Jukebox 🎵',
                'Warm analog synthwaves & acoustic guitar tracks spinning at 33⅓ RPM. Switch the café ambiance between Morning Acoustic, Golden Sunset Lo-Fi, and Midnight Jazz!',
                [
                  {
                    label: '🎵 Open Jukebox & Track Selector',
                    onClick: () => {
                      const el = document.getElementById('cafe-jukebox-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🌙 Switch to Midnight Jazz Vibe',
                    onClick: () => {
                      sfx.discSpin();
                      window.dispatchEvent(new CustomEvent('town:cafe-jukebox-track', { detail: { mood: 'night' } }));
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'pastry-case') {
            sfx.martChime();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'pastry-case', category: 'pastry' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Castelia Cone & Poké Puff Showcase 🍦',
                'Chilled glass cloches displaying Unova-famous Castelia Cones, Kalos Supreme Poké Puffs, Lumiose Galettes, and Old Gateau brain fuel for late-night debugging.',
                [
                  {
                    label: '🧁 Filter Sweets & Pastries Menu',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'pastry' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🍦 Order Castelia Cone (+100 Energy)',
                    onClick: () => {
                      sfx.heal();
                      this.callbacks.onRefill();
                      triggerCafeBrewAnimation('CASTELIA CONE SERVED! 🍦');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'roast-board') {
            sfx.espressoBrew();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'roast-board', category: 'espresso' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Specialty Dev Roasts & V60 Brew Lab 🫘',
                "Small-batch copper roaster & Chemex pour-over station. Today's single-origin beans: Dark Roasted TypeScript, YOLOv11 TensorRT Shot (75 FPS), and Go Routine Pour-Over.",
                [
                  {
                    label: '☕ Open Custom Blend Builder',
                    onClick: () => {
                      const el = document.getElementById('cafe-custom-brewer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🔥 Filter Specialty Roasts',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'espresso' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'vip-booth') {
            sfx.select();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'vip-booth' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'VIP Coffee Chat & Pairing Booth 💬',
                'Reserved leather booth with dual monitors and warm pendant lighting. Grab a virtual espresso with Zulfan to discuss full-stack web roles, Edge AI research, or system architecture!',
                [
                  {
                    label: '💬 Open Coffee Chat Scheduler',
                    onClick: () => {
                      const el = document.getElementById('cafe-vip-lounge');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📄 View Official CV (PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          } else if (prop.target.name === 'craft-tap') {
            sfx.espressoBrew();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'craft-tap', category: 'elixir' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Nitro Cold Brew & Craft Mocktail Tap 🍹',
                'Pressurized nitrogen cold brew & botanical night-bar elixirs: Kafka Event-Stream Tonic, Redis Lua Sub-Millisecond Fizz, and Berry Matcha Cloud.',
                [
                  {
                    label: '🍹 Filter Night Bar & Cold Brews',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'elixir' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '⚡ Pour Nitro Cold Brew (+20s Speed)',
                    onClick: () => {
                      sfx.espressoBrew();
                      this.callbacks.onRefill();
                      this.activateCoffeeBoost(20);
                      triggerCafeBrewAnimation('NITRO COLD BREW! +20s BOOST');
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '29,32');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'arena') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? ARENA_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        ARENA_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'mewtwo-boss') {
            sfx.encounter();
            triggerArenaBattleAnimation('IMPERIAL PSYSTRIKE! 👑', '#f59e0b');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Grand Champion Mewtwo · Imperial Tribune 👑',
                'MEWTWO (Telepathy): "Ave, Challenger! Welcome to the Gladiator Colosseum. Step onto the sacred sand to test your blade in 1v1 combat, or face the Six Trials of Rome!"',
                [
                  {
                    label: '⚔️ Enter the Gladiator Pit (1v1 Duel)',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🦁 Face the Six Colosseum Trials',
                    onClick: () => {
                      const el = document.getElementById('algo-dojo-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'lucario-coach') {
            sfx.confirm();
            triggerArenaBattleAnimation('LANISTA AURA BLESSING! 🥊', '#38bdf8');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Lanista Lucario · Master of Gladiators 🥊',
                '"Your combat aura burns bright, Gladiator!" Lanista Lucario sharpens your tactics and restores your warrior stamina to 100%. Choose your Champion from the Armory to break Mewtwo’s Imperial Guard!',
                [
                  {
                    label: '⚔️ Choose Champion & Duel (+100% Stamina)',
                    onClick: () => {
                      sfx.heal();
                      this.callbacks.onRefill();
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🛡️ Inspect Obelisk Combat Runes',
                    onClick: () => {
                      this.walkToObject('stat-radar');
                      const el = document.getElementById('stat-radar-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'referee-dan') {
            sfx.select();
            triggerArenaBattleAnimation('MUNERA SANCTIONED! 📯', '#dc2626');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Legatus Arbiter · Chief Judge of the Sand 📯',
                '"By decree of the Colosseum Senate: 4 signature strikes per Gladiator, 3 Imperial Blessings per bout, and the Golden Caesar Laurel for victorious challengers! Let the Munera begin!"',
                [
                  {
                    label: '⚔️ Step into the Gladiator Pit',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🏆 Visit the Hall of Victors',
                    onClick: () => {
                      this.walkToObject('trophy-vault');
                      const el = document.getElementById('trophy-vault-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'battle-terminal') {
            sfx.confirm();
            triggerArenaBattleAnimation('ARMORY FORGE READY! ⚔️', '#ef4444');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Gladiator Armory & Weapon Rack ⚔️',
                'Forged blades, Roman Scutum shields, and Golden Tridents! Command Charizard (Ignis Myrmillo), Lucario (Aura Dimachaerus), Garchomp (Draco Secutor), or Dialga (Chronos Hoplomachus) in the Gladiator Pit!',
                [
                  {
                    label: '⚔️ Open Gladiator Duel Pit',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'algorithm-dojo') {
            sfx.select();
            triggerArenaBattleAnimation('PORTA BESTIARIORUM OPEN! 🦁', '#d97706');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Porta Bestiariorum · Six Trials Gate 🦁',
                'Behind these iron portcullis bars lie the Six Engineering Trials of the Colosseum: Computer Vision, Praetorian CyberSec, High-Velocity Web, Concurrent Backends, NLP Scrolls, and IoT Telemetry!',
                [
                  {
                    label: '🦁 Enter the Six Colosseum Trials',
                    onClick: () => {
                      const el = document.getElementById('algo-dojo-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'trophy-vault') {
            sfx.heal();
            triggerArenaBattleAnimation('AVE VICTOR! SPOILS OF ROME 🏆', '#fbbf24');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Hall of Victors · Marble Pedestals 🏆',
                "Behold Muhammad Zulfan's consecrated Colosseum spoils: IDEA FEST 3 National Bronze Medallion, Huawei HCIA-Security V4.0 Praetorian Seal, ITENAS Senate GPA 3.49/4.00, and 6× Legion Lab Assistantship.",
                [
                  {
                    label: '🏆 Inspect Pedestals & Laurels',
                    onClick: () => {
                      const el = document.getElementById('trophy-vault-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📜 Download Imperial Scroll (CV PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          } else if (prop.target.name === 'stat-radar') {
            sfx.select();
            triggerArenaBattleAnimation('OBELISK RUNES AWAKENED: 565 PWR 🛡️', '#f59e0b');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Obelisk of Mars · 6-Axis Combat Runes 🛡️',
                'Carved in ancient sandstone (565 Total Combat Power): Eagle Vision AI/CV (98), Gladius Full-Stack (96), Aqueduct Backend (95), Aegis CyberSec (92), Chariot IoT (90), and Senate Algorithms (94).',
                [
                  {
                    label: '🛡️ Inspect Gladiator Runes',
                    onClick: () => {
                      const el = document.getElementById('stat-radar-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '38,44');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'garden') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? GARDEN_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        GARDEN_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'botanist-flora') {
            sfx.heal();
            triggerGardenHarvestAnimation('BOTANIST BLESSING! +3 POKE BALLS 🌸', '#f472b6');
            this.harvestBerries();
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Master Botanist Flora · Sakura Conservatory 👩‍🌾',
                '"Welcome to our Botanical Berry Plantation! Under the shade of the Mother Sakura Tree, we cultivate 6 heirloom berry strains. Try planting, watering, and harvesting in the Live 6-Plot Farm!"',
                [
                  {
                    label: '🌱 Open 6-Plot Berry Plantation',
                    onClick: () => {
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🍯 Spin the Copper Berry Blender',
                    onClick: () => {
                      const el = document.getElementById('berry-blender-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'shaymin-npc') {
            sfx.confirm();
            triggerGardenHarvestAnimation('SHAYMIN SEED FLARE BLOOM! 🌺', '#4ade80');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Shaymin · Gratitude Blossom Guardian 🦔',
                '"Shay-min! 🌸" Shaymin releases a warm Gracidea pollen breeze across the greenhouse! Your movement speed is boosted by +50% and all soil beds are enriched!',
                [
                  {
                    label: '✨ Receive Gracidea Speed Blessing (+50% Speed)',
                    onClick: () => {
                      this.activateCoffeeBoost(30);
                      window.dispatchEvent(new CustomEvent('garden:ripen-all'));
                    },
                  },
                  {
                    label: '📖 Read Botanical Skill Compendium',
                    onClick: () => {
                      const el = document.getElementById('berry-compendium-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-oran') {
            sfx.select();
            triggerGardenHarvestAnimation('ORAN & PECHA BED INSPECTED! 🍊', '#38bdf8');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'North-West Raised Bed · Oran & Pecha Cultivars 🍊',
                'Cobalt-blue Oran Berries (+10 HP Resilience) & sweet pink Pecha Blossoms thrive in moist volcanic loam — symbolizing Zulfan’s rock-solid Full-Stack Web & TypeScript foundation.',
                [
                  {
                    label: '🍊 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 0 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-sitrus') {
            sfx.select();
            triggerGardenHarvestAnimation('SITRUS & LUM HYBRID RIPE! 🍋', '#facc15');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'North-East Raised Bed · Sitrus & Miracle Lum 🍋',
                'Golden Sitrus Berries (+25% HP) and rare Emerald Lum Berries (Cure-All Miracle) represent high-yield Computer Vision (YOLOv8 AeroScan) & Huawei HCIA-Security V4.0 protection!',
                [
                  {
                    label: '🍋 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 1 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-cheri') {
            sfx.select();
            triggerGardenHarvestAnimation('CHERI & LEPPA SPICE HARVEST! 🍒', '#ef4444');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'South-West Terrace · Cheri & Leppa Berries 🍒',
                'Spicy ruby Cheri Berries and high-PP Leppa Berries fuel rapid IoT microcontroller reflexes (ESP32/Arduino) and non-stop backend API endurance!',
                [
                  {
                    label: '🍒 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 2 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'watering-well') {
            sfx.heal();
            triggerGardenHarvestAnimation('SPRAYDUCK IRRIGATION SHOWER! 💧', '#38bdf8');
            window.dispatchEvent(new CustomEvent('garden:water-all'));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Sprayduck Spring Well · Greenhouse Irrigation 💧',
                'You filled the iconic yellow Sprayduck watering can from the crystal Sakura spring and irrigated all 6 plantation beds to 100% moisture!',
                [
                  {
                    label: '🌱 Check Irrigated Plots',
                    onClick: () => {
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'berry-blender') {
            sfx.confirm();
            triggerGardenHarvestAnimation('COPPER BERRY BLENDER SPINNING! 🍯', '#f59e0b');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Artisanal Berry Blender & Combee Apiary 🍯',
                'Combine 3 harvested berries in our high-RPM Hoenn Copper Berry Blender to craft Gold Pokéblocks, Developer Focus Jams, and Combee Honey Elixirs!',
                [
                  {
                    label: '🍯 Launch Berry Blender Lab',
                    onClick: () => {
                      const el = document.getElementById('berry-blender-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '28,44');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'neighbour') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? NEIGHBOUR_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        NEIGHBOUR_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'neighbour-maya') {
            sfx.confirm();
            triggerNeighbourAnimation('FELLOW DEV GREETING! 🤝', '#38bdf8');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Neighbour Maya · Fellow Dev 👋',
                '"Hey Zulfan! Welcome to our cozy dev cottage. Feel free to grab some hot tea by the fireplace, challenge the PR Ping-Pong game, or sign our guestbook corkboard!"',
                [
                  {
                    label: '🤝 Open Co-Op Chronicles',
                    onClick: () => {
                      const el = document.getElementById('coop-chronicles-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📌 Sign Neighbour Guestbook',
                    onClick: () => {
                      const el = document.getElementById('guestbook-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'eevee-companion') {
            sfx.heal();
            triggerNeighbourAnimation('EEVEE AFFECTION +100! 🦊💖', '#fbbf24');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Eevee · Cottage Mascot 🦊',
                '"Eev-vee! ✨" Eevee wags its fluffy tail happily and cuddles up! Which evolutionary tech vibe matches your engineering mindset today?',
                [
                  {
                    label: '🦊 Match My Eeveelution Tech Vibe',
                    onClick: () => {
                      const el = document.getElementById('eevee-vibe-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '☕ Share a Cup of Oolong Tea',
                    onClick: () => {
                      this.walkToObject('fireplace-hearth');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'guestbook-board') {
            sfx.select();
            triggerNeighbourAnimation('CORKBOARD OPENED! 📌', '#a855f7');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Neighbour Guestbook & Endorsement Corkboard 📌',
                'A wooden corkboard covered with colourful sticky notes, peer reviews, and heartfelt dev endorsements from visiting trainers across Sinnoh & Unova.',
                [
                  {
                    label: '📌 Leave a Sticky Note / Endorsement',
                    onClick: () => {
                      const el = document.getElementById('guestbook-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'coop-table') {
            sfx.confirm();
            triggerNeighbourAnimation('PAIR-PROGRAMMING DESK! 💻', '#3b82f6');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Co-Op Pair-Programming Desk 🤝',
                'Dual mechanical keyboards, ultrawide curved monitor, and Git pull requests ready for review. Explore collaborative open-source sprints & ITENAS hackathon milestones!',
                [
                  {
                    label: '🤝 Inspect Co-Op Projects & Sprints',
                    onClick: () => {
                      const el = document.getElementById('coop-chronicles-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'fireplace-hearth') {
            sfx.heal();
            this.callbacks.onRefill();
            this.activateCoffeeBoost(25);
            triggerNeighbourAnimation('WARM TEA BOOST! +25s SPEED 🍵', '#f97316');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Fireside Oolong Tea Table 🍵',
                'You enjoyed a piping-hot porcelain cup of roasted Oolong tea by the crackling brick fireplace. Stamina restored to 100% and +50% movement speed for 25s!',
                [
                  {
                    label: '🎮 Play PR Ping-Pong Corner',
                    onClick: () => {
                      this.walkToObject('retro-console');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'retro-console') {
            sfx.select();
            triggerNeighbourAnimation('PR PING-PONG READY! 🎮', '#10b981');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Retro CRT & PR Ping-Pong Corner 🎮',
                'A vintage CRT TV hooked up to a custom indie mini-game: PR Review Ping-Pong! Defend your branch against incoming merge conflicts and syntax bugs.',
                [
                  {
                    label: '🎮 Start PR Ping-Pong Mini-Game',
                    onClick: () => {
                      const el = document.getElementById('ping-pong-game-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'mentorship-shelf') {
            sfx.select();
            triggerNeighbourAnimation('6x LAB MENTORSHIP GUILD! 📚', '#6366f1');
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                '6× Lab Mentorship & Guild Library 📚',
                'Cedar shelves filled with curriculum modules, robotics lab manuals, and student project showcases from Zulfan\'s 6 semesters as ITENAS Laboratory Assistant.',
                [
                  {
                    label: '📚 Inspect Mentorship Impact & Guild',
                    onClick: () => {
                      const el = document.getElementById('mentorship-guild-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📄 View Official CV (PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '27,25');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'mart') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? MART_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        MART_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'clerk') {
            sfx.martChime();
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Clerk Kevin · Poké Mart',
                "Welcome to Zulfan's Poké Mart! We supply full-stack web platforms, edge TensorRT AI models, and custom software consultations. What would you like to inspect?",
                [
                  {
                    label: '📦 Browse Store Catalog',
                    onClick: () => {
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🪙 Talk to Meowth (Cashier Mascot)',
                    onClick: () => {
                      this.walkToObject('meowth');
                    },
                  },
                  {
                    label: '🎒 Inspect Engineering Services',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="services"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🧾 Checkout Brief at Counter',
                    onClick: () => {
                      const btn = document.getElementById('checkout-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '🔑 Key Items & CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                ]
              );
            } else {
              this.callbacks.onDialogue('Clerk Kevin', [
                "Welcome to Zulfan's Poké Mart! Browse our software services, developer potions, or pick up Zulfan's official CV below!",
              ]);
            }
          } else if (prop.target.name === 'meowth') {
            sfx.cashRegister();
            triggerCashRegisterAnimation('CHA-CHING! 🪙');
            if (this.callbacks.onBubble) {
              const meowthQuotes = [
                "Meowth! 🪙 'That\\'s right! Zulfan\\'s edge AI vision pipelines run at 120 FPS on Jetson hardware without breaking a sweat!'",
                "Meowth jingled his Amulet Coin! 🪙 'Recruiters who hire Zulfan get double sprint velocity and 100% clean git commits!'",
                "Meowth whispers knowingly! 🪙 'Looking for a verified full-stack engineer? Zulfan graduated from ITENAS with a 3.49 GPA and coordinated 6 lab semesters!'",
                "Meowth purrs! 🪙 'Psst! All Technical TMs and official CVs here are 100% free! Keep your Poké-Dollars for coffee!'",
                "Meowth grins! 🪙 'IDEA FEST Bronze Medalist and HCIA-Security Certified... this engineer is ready for high-impact production roles!'"
              ];
              const randomQuote = meowthQuotes[Math.floor(Math.random() * meowthQuotes.length)];

              this.callbacks.onBubble(
                'Meowth 🪙 (Cashier Mascot & Amulet Coin)',
                randomQuote,
                [
                  {
                    label: '🪙 Meowth Pay Day (+₽ 1,000)',
                    onClick: () => {
                      sfx.confirm();
                      triggerCashRegisterAnimation('PAY DAY! +₽1,000');
                      const btn = document.getElementById('btn-meowth-payday');
                      btn?.click();
                    },
                  },
                  {
                    label: '💰 Open Trainer Wallet Ledger',
                    onClick: () => {
                      const badge = document.getElementById('wallet-badge-btn');
                      badge?.click();
                    },
                  },
                  {
                    label: '💿 Insert TM into Disc Reader',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('town:open-tm-reader', {
                          detail: { tmId: 'tm-01' },
                        })
                      );
                    },
                  },
                  {
                    label: '👨‍💼 Talk to Clerk Kevin',
                    onClick: () => {
                      this.walkToObject('clerk');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'services-shelf') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Engineering Services Shelf 🎒',
                'Custom software solutions ready for commission: Full-Stack Web Development (Laravel 12 / Next.js) and Edge AI Computer Vision (YOLOv11 + TensorRT ~1.8ms/frame).',
                [
                  {
                    label: '🎒 View Services (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="services"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '👨‍💼 Ask Clerk Kevin',
                    onClick: () => {
                      this.walkToObject('clerk');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'tech-tms') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Technical TMs & Stack Discs 💿',
                'Inscribe cutting-edge technologies into your codebase: Python & PyTorch, TypeScript & Astro, Laravel 12 & PHP, Docker & Kubernetes, and TensorRT & CUDA.',
                [
                  {
                    label: '💿 Insert TM into Disc Reader',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('town:open-tm-reader', {
                          detail: { tmId: 'tm-01' },
                        })
                      );
                    },
                  },
                  {
                    label: '📦 Filter Catalog (Tech TMs Tab)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="tms"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🔬 Open Research Lab (/lab)',
                    onClick: () => {
                      this.callbacks.onNavigate('/lab');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'potions-shelf') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Dev Potions & Productivity Boosters 🧪',
                'Essential engineer supplies: Bandung Specialty Espresso (+100% Focus), Clean Architecture Ether (100% Code Quality), and Git Full Restore.',
                [
                  {
                    label: '🧪 Inspect Potions (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="potions"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '☕ Grab Cold Brew at Cooler',
                    onClick: () => {
                      this.walkToObject('drink-cooler');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'key-showcase') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Key Items Pedestal & CV 🔑',
                "Pedestal showcasing Muhammad Zulfan's ITENAS Informatics Diploma (GPA 3.49/4.00), AeroScan AI Weights, and Official CV / Résumé.",
                [
                  {
                    label: '📄 Download Official CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                  {
                    label: '🔑 Inspect Key Shelf (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="key"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'drink-cooler') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Poké-Cooler & Cold Brew Vending 🥤',
                'POKÉ-COOLER: Chilled Fresh Water, Soda Pop, and Bandung Specialty Cold Brew to keep development productivity at maximum (+50% walking speed boost!).',
                [
                  {
                    label: '☕ Drink Bandung Espresso (₽ 50)',
                    onClick: () => {
                      const btn = document.getElementById('drink-coffee-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '🧪 Use Clean Arch Ether (₽ 100)',
                    onClick: () => {
                      const btn = document.getElementById('drink-ether-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '📦 Inspect Potions Shelf',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="potions"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          this.callbacks.onNavigate(`/${prop.target.id === 'town' ? '' : prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'reception') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? RECEPTION_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        RECEPTION_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'mira') {
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Nurse Mira · Front Desk Concierge',
                "Welcome to the Poké Center! I'm Mira. Feel free to ask me anything about Zulfan's engineering track record, research, or ask me for campus directions!",
                [
                  {
                    label: '💬 Chat with Mira (Ask AI)',
                    onClick: () => {
                      const input = document.querySelector<HTMLInputElement>('#chat-input');
                      input?.focus();
                      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    },
                  },
                  {
                    label: '🎯 Recruiter Concierge & Role Matcher',
                    onClick: () => {
                      const rc = document.querySelector('#recruiter-concierge');
                      rc?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '💖 Ask Chansey to Heal & Refill Balls',
                    onClick: () => {
                      this.walkToObject('chansey');
                    },
                  },
                  {
                    label: '📋 View Campus Directory',
                    onClick: () => {
                      this.walkToObject('directory-board');
                    },
                  },
                  {
                    label: '💻 Access Network PC',
                    onClick: () => {
                      this.walkToObject('pc-terminal');
                    },
                  },
                ]
              );
            } else {
              this.callbacks.onDialogue('Nurse Mira', [
                "Welcome to the Pokémon Center! I'm Mira. Ask me anything about Zulfan's background or town directions!",
              ]);
            }
          } else if (prop.target.name === 'chansey') {
            sfx.heal();
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Chansey 🥚 (Front Desk Medical Assistant)',
                "Chan-sey! 💖 Chansey greets you with a warm smile and cradles a glowing Lucky Egg! Would you like to heal your party, refill your Poké Balls, or enjoy a fresh Lucky Egg speed boost?",
                [
                  {
                    label: '💖 Rest & Refill 10 Poké Balls',
                    onClick: () => {
                      sfx.heal();
                      triggerHealAnimation();
                      this.callbacks.onRefill();
                      window.dispatchEvent(new CustomEvent('town:refill-balls'));
                      if (this.callbacks.onBubble) {
                        this.callbacks.onBubble(
                          'Pokéball Healing Station ✨',
                          'Your party has been fully rested and your bag refilled to 10 Poké Balls! Ready for your next journey in Town!'
                        );
                      }
                    },
                  },
                  {
                    label: '🥚 Take Lucky Egg (+50% Speed Boost)',
                    onClick: () => {
                      this.activateCoffeeBoost(25);
                      sfx.confirm();
                      if (this.callbacks.onBubble) {
                        this.callbacks.onBubble(
                          'Lucky Egg Speed Boost 🥚✨',
                          "Chansey gave you a fresh Lucky Egg! You feel energized and ready to explore Zulfan's portfolio town with +50% turbo movement speed for 25 seconds!"
                        );
                      }
                    },
                  },
                  {
                    label: '💬 Chat with Nurse Mira',
                    onClick: () => {
                      this.walkToObject('mira');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'healing-machine') {
            sfx.heal();
            triggerHealAnimation();
            this.callbacks.onRefill();
            window.dispatchEvent(new CustomEvent('town:refill-balls'));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Pokéball Healing Station ✨',
                'Your party has been fully rested and all Poké Balls refilled to 10! Ready for your next journey in Town!'
              );
            }
          } else if (prop.target.name === 'pc-terminal') {
            sfx.select();
            window.dispatchEvent(new CustomEvent('reception:open-pc'));
          } else if (prop.target.name === 'directory-board') {
            sfx.select();
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Campus Directory Board 📋',
                "Official Directory of Muhammad Zulfan's Portfolio Town. Discover 8 specialized research facilities, engineering labs, and interactive showcases across the campus.",
                [
                  {
                    label: '📋 View All 8 Facilities (Scroll Panel)',
                    onClick: () => {
                      const dir = document.querySelector('#campus-directory');
                      dir?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '🎯 Recruiter Concierge & Role Matcher',
                    onClick: () => {
                      const rc = document.querySelector('#recruiter-concierge');
                      rc?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '🗺️ Exit to Town Square (Open Map)',
                    onClick: () => {
                      this.callbacks.onNavigate('/');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'waiting-couch') {
            sfx.select();
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'VIP Visitor Lounge 🛋️',
                "A plush executive lounge. On the mahogany coffee table rests Muhammad Zulfan's official résumé, ITENAS Computer Science academic records (GPA 3.49/4.00), and research pre-prints.",
                [
                  {
                    label: '📰 Read Portfolio Zines & Research (Scroll)',
                    onClick: () => {
                      const lounge = document.querySelector('#vip-lounge-section');
                      lounge?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '🥚 Claim Lucky Egg Buff (+50% Speed)',
                    onClick: () => {
                      this.activateCoffeeBoost(25);
                    },
                  },
                  {
                    label: '📄 Download Official CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                  {
                    label: '📋 Read Visitor FAQ & Credentials',
                    onClick: () => {
                      const faq = document.querySelector('#visitor-inquiries');
                      faq?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                ]
              );
            }
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          this.callbacks.onNavigate(`/${prop.target.id === 'town' ? '' : prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'arcade') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? ARCADE_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        ARCADE_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'lab') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? LAB_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        LAB_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'dev') {
      const fx = this.playerPos.x + DIRS[this.playerDir].x;
      const fy = this.playerPos.y + DIRS[this.playerDir].y;
      const prop =
        (activeTarget ? DEV_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        DEV_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (this.playerPos.x >= p.x - 1 &&
              this.playerPos.x <= p.x + p.w &&
              this.playerPos.y >= p.y - 1 &&
              this.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();

        // Bi-Directional Sync for Dev Center Consoles & Props
        if (prop.id === 'console-wasm') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'aeroscan' } }));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'AI Inference Console 🖥️',
              "Edge AI & TensorRT. Zulfan's YOLOv11s model, optimized with TensorRT 10: ~1.8 ms/frame (>500 FPS) on an RTX 4060.",
              {
                label: 'Buka Debrief AeroScan 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'aeroscan' } }));
                },
              }
            );
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'console-edge') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'foodlink' } }));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Distributed Systems Console 🌐',
              'FoodLink Cloud-Native Platform. Laravel 12 API Gateway, Redis Queue, PostGIS spatial matchmaking, and Docker orchestration.',
              {
                label: 'Buka Debrief FoodLink 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'foodlink' } }));
                },
              }
            );
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'console-static') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'omr-grader' } }));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Static Architecture Console ⚡',
              'Static-first Astro framework. Compiled HTML at build time; 60 FPS lightweight canvas engine with zero bloat.',
              {
                label: 'Lihat Arsitektur Kota 📜',
                onClick: () => {
                  const el = document.getElementById('sec-build');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  (el as any)?.setAttribute('open', '');
                },
              }
            );
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'whiteboard') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'thesis' } }));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Architecture Whiteboard 📋',
              'End-to-End System Blueprint: profile.yaml ➔ Static Pages + 2D Engine + AI Digital Twin & Knowledge Base.',
              {
                label: 'Open Thesis Debrief 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'thesis' } }));
                },
              }
            );
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'rack') {
          document.dispatchEvent(new CustomEvent('town:telemetry'));
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'High-Performance Compute Rack 🗄️',
              'Active Server Rack: Compute cluster for model training, TensorRT FP16 quantization, and continuous deployment pipeline.',
              {
                label: 'Open Telemetry Wall 📈',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:telemetry'));
                },
              }
            );
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'eternatus') {
          sfx.select();
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Eternatus ⚡ (Server Assistant & Dynamo Core)',
              'Mission Control Server Assistant online! Eternatus channels infinite power to the AI compute clusters, TensorRT inference pipelines, and distributed backends. Ready to overclock!',
              [
                {
                  label: '📈 Open Telemetry Wall',
                  onClick: () => {
                    document.dispatchEvent(new CustomEvent('town:telemetry'));
                  },
                },
                {
                  label: '⚡ Overclock Core (+50% Speed)',
                  onClick: () => {
                    this.activateCoffeeBoost();
                  },
                },
              ]
            );
          } else {
            this.callbacks.onDialogue(prop.label, [
              'Server Assistant Eternatus active! Infinite power flowing to AI clusters.',
            ]);
          }
        } else if (prop.id === 'snorlax' || prop.id === 'lebronette') {
          sfx.select();
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Snorlax 💤 (Head of Comfort)',
              'Zzz... Snorlax is sleeping peacefully guarding the Mission Control command desk. Slow and steady breathing. Would you like to play the Poké Flute to greet him?',
              [
                {
                  label: '🎶 Play Poké Flute',
                  onClick: () => {
                    sfx.heal();
                    if (this.callbacks.onBubble) {
                      this.callbacks.onBubble(
                        'Snorlax 💤 (Snorlax Smiles)',
                        '♪~♫~ A melodious tune from the Poké Flute echoes softly! Snorlax stirs happily, opens one eye, gives a warm smile, and comfortably resumes dozing... 💤'
                      );
                    }
                  },
                },
                {
                  label: '🏥 Visit Poké Center',
                  onClick: () => {
                    this.callbacks.onNavigate('/reception');
                  },
                },
              ]
            );
          } else {
            this.callbacks.onDialogue(prop.label, ['Zzz... Snorlax is fast asleep.']);
          }
        } else if (prop.id === 'coffee') {
          sfx.select();
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(
              'Coffee Machine ☕ (Robusta Overclock)',
              'Mission Control automatic espresso machine is ready to brew pure West Java robusta coffee. Delivers an instant caffeine boost for turbo speed!',
              {
                label: '☕ Drink Coffee (Turbo Speed +50%)',
                onClick: () => {
                  this.activateCoffeeBoost();
                },
              }
            );
          } else {
            this.activateCoffeeBoost();
          }
        } else if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            this.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          sfx.door();
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('town:respawn', '22,28');
          this.callbacks.onNavigate(prop.target.id === 'town' ? '/' : `/${prop.target.id}`);
        }
        this.wake();
      }
      return;
    }

    if (this.currentScene === 'home') {
      if (this.homeFloor === '1F') {
        if (
          activeTarget === 'stairs-up' ||
          ((this.playerPos.x === 12 || this.playerPos.x === 13) && this.playerPos.y <= 2)
        ) {
          this.switchHomeFloor('2F');
          return;
        }
        const fx = this.playerPos.x + DIRS[this.playerDir].x;
        const fy = this.playerPos.y + DIRS[this.playerDir].y;
        const prop =
          (activeTarget ? HOME_PROPS.find((p) => p.id === activeTarget) : undefined) ||
          HOME_PROPS.find(
            (p) =>
              (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
              (this.playerPos.x >= p.x - 1 &&
                this.playerPos.x <= p.x + p.w &&
                this.playerPos.y >= p.y - 1 &&
                this.playerPos.y <= p.y + p.h)
          );

        if (prop) {
          sfx.select();
          if (prop.id === 'stairs-up') {
            this.switchHomeFloor('2F');
            return;
          }
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.name, prop.lines.join(' '), prop.action);
          } else {
            this.callbacks.onDialogue(prop.name, prop.lines);
          }
          this.wake();
        }
      } else {
        // 2F
        if (
          activeTarget === 'home2f-stairs-down' ||
          ((this.playerPos.x === 12 || this.playerPos.x === 13) && this.playerPos.y <= 2)
        ) {
          this.switchHomeFloor('1F');
          return;
        }
        const fx = this.playerPos.x + DIRS[this.playerDir].x;
        const fy = this.playerPos.y + DIRS[this.playerDir].y;
        const prop =
          (activeTarget ? HOME2F_PROPS.find((p) => p.id === activeTarget) : undefined) ||
          HOME2F_PROPS.find(
            (p) =>
              (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
              (this.playerPos.x >= p.x - 1 &&
                this.playerPos.x <= p.x + p.w &&
                this.playerPos.y >= p.y - 1 &&
                this.playerPos.y <= p.y + p.h)
          );

        if (prop) {
          sfx.select();
          if (prop.id === 'home2f-stairs-down') {
            this.switchHomeFloor('1F');
            return;
          }
          if (prop.id === 'home2f-fridge') {
            document.dispatchEvent(new CustomEvent('town:fridge'));
          }
          if (prop.id === 'home2f-computer') {
            document.dispatchEvent(new CustomEvent('town:desk'));
          }
          if (this.callbacks.onBubble) {
            this.callbacks.onBubble(prop.name, prop.lines.join(' '), prop.action);
          } else {
            this.callbacks.onDialogue(prop.name, prop.lines);
          }
          this.wake();
        }
      }
      return;
    }

    const fx = this.playerPos.x + DIRS[this.playerDir].x;
    const fy = this.playerPos.y + DIRS[this.playerDir].y;

    const arenaCfg = townConfig.getBuilding('arena');
    const aceX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : 28;
    const aceY = arenaCfg ? arenaCfg.y + 1 : 17;

    // 1. Check NPC
    const npc =
      (activeTarget ? this.map.npcs.find((n) => n.id === activeTarget || (n as any).subType === activeTarget) : undefined) ||
      this.map.npcs.find((n) => {
        const cfg = townConfig.getBuilding(n.id);
        const nx = cfg ? cfg.x : (n.id === 'ace' ? aceX : n.x);
        const ny = cfg ? cfg.y : (n.id === 'ace' ? aceY : n.y);
        const nw = cfg?.w ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(n.id) ? 2 : 1);
        const nh = cfg?.h ?? (['charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados'].includes(n.id) ? 2 : 1);
        const inFacing = fx >= nx && fx < nx + nw && fy >= ny && fy < ny + nh;
        const isAdjacent = (
          this.playerPos.x >= nx - 1 &&
          this.playerPos.x <= nx + nw &&
          this.playerPos.y >= ny - 1 &&
          this.playerPos.y <= ny + nh
        );
        return inFacing || isAdjacent;
      });
    if (npc) {
      sfx.select();
      if (npc.id === 'rayquaza' || (npc as any).subType === 'rayquaza') {
        sfx.select();
        const rayquazaActions: BubbleAction[] = [
          {
            label: '⚡ Deru Badai (Delta Stream)',
            onClick: () => this.triggerSignatureMove('rayquaza', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('rayquaza'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Rayquaza Sang Naga Langit 🐉',
            'Kyyyaaaarrrr-shooo...! 🐉 Aura zamrud naga langit berputar megah di angkasa. [Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability] Mengarungi stratosfer awan menjaga stabilitas uptime sistem 99.99%!',
            rayquazaActions
          );
        } else {
          this.callbacks.onDialogue('Rayquaza Sang Naga Langit 🐉', [
            'RAYQUAZA: "Kyyyaaaarrrr-shooo...!" 🐉',
            'Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:rayquaza'));
        this.wake();
        return;
      }
      if (npc.id === 'garchomp' || (npc as any).subType === 'garchomp') {
        sfx.select();
        const garchompActions: BubbleAction[] = [
          {
            label: '⚡ Tebasan Naga (Dragon Claw)',
            onClick: () => this.triggerSignatureMove('garchomp', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('garchomp'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Garchomp Sang Predator Darat 🦈',
            'Gyaaa-shhh...! 🦈 Sayap sirip tajam Garchomp berdesir membelah angin. [Tech Guardian: High-Speed Algorithms, Optimization & Clean Code] Bergerak secepat jet tempur supersonik mengeksekusi logika komputasi!',
            garchompActions
          );
        } else {
          this.callbacks.onDialogue('Garchomp Sang Predator Darat 🦈', [
            'GARCHOMP: "Gyaaa-shhh...!" 🦈',
            'Tech Guardian: High-Speed Algorithms, Optimization & Clean Code.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:garchomp'));
        this.wake();
        return;
      }
      if (
        npc.id === 'urshifu' ||
        (npc as any).subType === 'urshifu' ||
        npc.id === 'urshifu_gmax' ||
        (npc as any).subType === 'urshifu_gmax'
      ) {
        sfx.select();
        const urshifuActions: BubbleAction[] = [
          {
            label: '⚡ Serbuan Beruntun (G-Max Rapid Flow)',
            onClick: () => this.triggerSignatureMove('urshifu', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('urshifu'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Urshifu G-Max Rapid Strike 🌊',
            'Hssshaaarrr-kwooo...! 🌊 Aliran deras jurus Rapid Strike bergemuruh di sekitar sang Master Wushu. [Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX] Menghadirkan solusi kilat yang kokoh dan tepat sasaran.',
            urshifuActions
          );
        } else {
          this.callbacks.onDialogue('Urshifu G-Max Rapid Strike 🌊', [
            'URSHIFU: "Hssshaaarrr-kwooo...!" 🌊',
            'Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:urshifu'));
        this.wake();
        return;
      }
      if (npc.id === 'dialga' || (npc as any).subType === 'dialga') {
        sfx.select();
        const dialgaActions: BubbleAction[] = [
          {
            label: '⚡ Dentang Waktu (Roar of Time)',
            onClick: () => this.triggerSignatureMove('dialga', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('dialga'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Dialga (The Temporal Pokémon) ⏳🔷',
            'Gugyugubah...! ⏳🔷 Kristal berlian di dada Dialga memancarkan denyut waktu kosmik. [Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices] Mengatur latensi real-time, sinkronisasi data presisi, dan arsitektur konkurensi di Zulfan\'s Town.',
            dialgaActions
          );
        } else {
          this.callbacks.onDialogue('Dialga Sang Penguasa Waktu ⏳🔷', [
            'DIALGA: "Gugyugubah...!" ⏳🔷',
            'Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices.',
            'Kristal berlian memancarkan denyut Roar of Time menjaga setiap detik evolusi teknologi.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:dialga'));
        this.wake();
        return;
      }
      if (npc.id === 'palkia' || (npc as any).subType === 'palkia') {
        sfx.select();
        const palkiaActions: BubbleAction[] = [
          {
            label: '⚡ Riak Dimensi (Spacial Rend)',
            onClick: () => this.triggerSignatureMove('palkia', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('palkia'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Palkia (The Spatial Pokémon) 🌌💧',
            'Gyaaa-ooohhn...! 🌌💧 Mutiara kosmik di pundak Palkia bergetar memancarkan gelombang ruang. [Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure] Menghubungkan setiap simpul arsitektur awan tanpa batas dimensi.',
            palkiaActions
          );
        } else {
          this.callbacks.onDialogue('Palkia Sang Penguasa Ruang 🌌💧', [
            'PALKIA: "Gyaaa-ooohhn...!" 🌌💧',
            'Tech Guardian: Spatial Computing, Distributed Systems & High-Speed Cloud Networking.',
            'Mutiara kosmik menenun struktur konektivitas terdistribusi di Zulfan\'s Town.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:palkia'));
        this.wake();
        return;
      }
      if (npc.id === 'giratina' || (npc as any).subType === 'giratina') {
        sfx.select();
        const giratinaActions: BubbleAction[] = [
          {
            label: '⚡ Gemuruh Shadow Force',
            onClick: () => this.triggerSignatureMove('giratina', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('giratina'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Giratina (The Renegade Pokémon) 👻🌌',
            'Gyaaa-shhhooo...! 👻🌌 Portal bayangan antimateri berputar di bawah mantel Giratina. [Tech Guardian: Fault Tolerance, Chaos Engineering & Resilient Rollback] Menguji ketangguhan sistem dari celah dimensi yang tak terduga.',
            giratinaActions
          );
        } else {
          this.callbacks.onDialogue('Giratina Sang Penguasa Distorsi 👻🌌', [
            'GIRATINA: "Gyaaa-shhhooo...!" 👻🌌',
            'Tech Guardian: Fault Tolerance & Resilient Chaos Engineering.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:giratina'));
        this.wake();
        return;
      }
      if (npc.id === 'zekrom' || (npc as any).subType === 'zekrom') {
        sfx.select();
        const zekromActions: BubbleAction[] = [
          {
            label: '⚡ Kilatan Fusion Bolt',
            onClick: () => this.triggerSignatureMove('zekrom', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('zekrom'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Zekrom (The Deep Black Pokémon) 🖤⚡',
            'Bzzzz-Vrrrooom...! 🖤⚡ Generator petir Zekrom berputar kencang. [Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute] Memberikan daya komputasi raksasa untuk memproses data masif tanpa jeda.',
            zekromActions
          );
        } else {
          this.callbacks.onDialogue('Zekrom Sang Naga Idealisme 🖤⚡', [
            'ZEKROM: "Bzzzz-Vrrrooom...!" 🖤⚡',
            'Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:zekrom'));
        this.wake();
        return;
      }
      if (npc.id === 'reshiram' || (npc as any).subType === 'reshiram') {
        sfx.select();
        const reshiramActions: BubbleAction[] = [
          {
            label: '⚡ Kobaran Fusion Flare',
            onClick: () => this.triggerSignatureMove('reshiram', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('reshiram'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Reshiram (The Vast White Pokémon) 🤍🔥',
            'Vaaa-zhooom...! 🤍🔥 Ekor turbin Reshiram membara dengan api kebenaran murni. [Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture] Memastikan setiap baris kode terverifikasi bersih dan bebas kerentanan.',
            reshiramActions
          );
        } else {
          this.callbacks.onDialogue('Reshiram Sang Naga Kebenaran 🤍🔥', [
            'RESHIRAM: "Vaaa-zhooom...!" 🤍🔥',
            'Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:reshiram'));
        this.wake();
        return;
      }
      if (npc.id === 'arceus') {
        sfx.select();
        const arceusActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Kosmik (Judgment)',
            onClick: () => this.triggerSignatureMove('arceus', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('arceus'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Arceus (The Alpha Pokémon) 🌟',
            'Dooo-oooonnn...! ✨ Pendaran cahaya keemasan cincin kosmik berputar agung di atas pelataran Dev Center. [Tech Guardian: Enterprise System Architecture & End-to-End Product Vision] Merancang fondasi ekosistem software menyeluruh dari rancangan arsitektur hingga tahap produksi global.',
            arceusActions
          );
        } else {
          this.callbacks.onDialogue('Arceus Sang Pencipta 🌟', [
            'ARCEUS: "Dooo-oooonnn...!" ✨',
            'Tech Guardian: Enterprise System Architecture & End-to-End Product Vision.',
          ]);
        }
        this.wake();
        return;
      }
      if (npc.id === 'charizard' || npc.id === 'lebron') {
        sfx.select();
        const charizardActions: BubbleAction[] = [
          {
            label: '⚡ Semburan Api (Flamethrower)',
            onClick: () => this.triggerSignatureMove('charizard', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('charizard'),
          },
          {
            label: '🔥 Mulai Encounter Battle',
            onClick: () => document.dispatchEvent(new CustomEvent('town:charizard')),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Charizard Sang Naga Api 🔥',
            'GRAAAWWWRRR...! 🔥 Ekor api Charizard membakar semangat petualang di alun-alun kota! [Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps] Menghadirkan aplikasi web modern yang cepat, tangguh, dan membakar habis setiap bug!',
            charizardActions
          );
        } else {
          this.callbacks.onDialogue('Charizard Sang Naga Api 🔥', npc.lines, () =>
            document.dispatchEvent(new CustomEvent('town:charizard'))
          );
        }
        this.wake();
        return;
      }
      if (npc.id === 'ranger' || npc.id === 'tyranitar' || (npc as any).subType === 'tyranitar') {
        sfx.select();
        const tyranitarActions: BubbleAction[] = [
          {
            label: '⚡ Badai Pasir (Sandstorm)',
            onClick: () => this.triggerSignatureMove('tyranitar', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('tyranitar'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Tyranitar Sang Pelindung Zirah 🪨',
            'Gwoooaaargh! 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan menjaga perbatasan Zulfan\'s Town. [Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure] Kokoh bertahan dari segala spike traffic dan ancaman siber!',
            tyranitarActions
          );
        } else {
          this.callbacks.onDialogue('Tyranitar Sang Pelindung Zirah 🪨', npc.lines);
        }
        this.wake();
        return;
      }
      if (npc.id === 'ace' || npc.id === 'mewtwo' || (npc as any).subType === 'mewtwo') {
        sfx.select();
        const mewtwoActions: BubbleAction[] = [
          {
            label: '⚡ Gelombang Psikis (Psystrike)',
            onClick: () => this.triggerSignatureMove('mewtwo', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('mewtwo'),
          },
          {
            label: '⚔️ Uji Tech Challenge Quiz',
            onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Mewtwo Sang Penantang 🔮',
            'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik. [Tech Guardian: AI Agents, LLM Orchestration & Deep Learning] Menguasai penalaran multi-agent cerdas dan otomatisasi AI melampaui komputasi biasa.',
            mewtwoActions
          );
        } else {
          this.callbacks.onDialogue('Mewtwo Sang Penantang 🔮', npc.lines, () =>
            document.dispatchEvent(new CustomEvent('town:arena-quiz'))
          );
        }
        this.wake();
        return;
      }
      if (npc.id === 'twin') {
        sfx.select();
        gameStore.addStamp('twin');
        const twinActions: BubbleAction[] = [
          {
            label: '⚡ Bola Aura (Aura Sphere)',
            onClick: () => this.triggerSignatureMove('lucario', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('lucario'),
          },
          {
            label: '💬 Buka Digital Twin AI',
            href: '/twin',
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Digital Twin & Lucario 🌀',
            'Aura Zulfan beresonansi kuat di sini! [Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend] Merasakan kebutuhan pengguna secara empatik dan menghadirkan interaksi digital yang memikat.',
            twinActions
          );
        } else {
          this.callbacks.onDialogue('Digital Twin & Lucario 🌀', npc.lines, () =>
            this.callbacks.onNavigate('/twin')
          );
        }
        this.wake();
        return;
      }
      if (npc.id === 'groudon' || (npc as any).subType === 'groudon') {
        sfx.select();
        const groudonLines = [
          'GROUDON: "Gwoooaaarrr-ghuuu...!" 🌋🔥',
          'Di pelataran daratan Zulfan\'s Town, Groudon Sang Penguasa Magma & Benua berdiri kokoh nan perkasa.',
          'Aura panas Desolate Land memancar dari alur garis hitam di tubuh merah crimsonnya, mengeringkan kabut dan memadatkan magma menjadi daratan kokoh.',
          'Dalam mitologi Hoenn purba, Groudon adalah Pokémon Legendaris yang menciptakan dan memperluas benua alam semesta.',
        ];
        const groudonActions: BubbleAction[] = [
          {
            label: '⚡ Gemuruh Magma Precipice Blades',
            onClick: () => this.triggerSignatureMove('groudon', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('groudon'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Groudon (The Continent Pokémon) 🌋🔥',
            'Gwoooaaarrr-ghuuu...! 🌋🔥 (Kerak bumi bergetar dan gelombang panas Desolate Land memancar dari tubuh Groudon. Sang Penguasa Daratan menjaga kestabilan pondasi benua di Zulfan\'s Town.)',
            groudonActions
          );
        } else {
          this.callbacks.onDialogue('Groudon Sang Penguasa Daratan 🌋🔥', groudonLines);
        }
        document.dispatchEvent(new CustomEvent('town:groudon'));
        this.wake();
        return;
      }
      if (npc.id === 'kyogre' || (npc as any).subType === 'kyogre') {
        sfx.select();
        const kyogreLines = [
          'KYOGRE: "Gyaaa-oooh-shuuu...!" 🌊💧',
          'Di perairan dan pesisir Zulfan\'s Town, Kyogre Sang Penguasa Samudra & Palung Laut melayang dengan anggun.',
          'Aura hujan lebat Primordial Sea memancar dari guratan merah di sirip lebarnya, mengisi sumber mata air dan menjaga kedalaman samudra tanpa batas.',
          'Dalam mitologi Hoenn purba, Kyogre dipuja sebagai pencipta lautan luas yang mempertemukan pulau-pulau di alam semesta.',
        ];
        const kyogreActions: BubbleAction[] = [
          {
            label: '⚡ Gelombang Samudra Origin Pulse',
            onClick: () => this.triggerSignatureMove('kyogre', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('kyogre'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Kyogre (The Sea Basin Pokémon) 🌊💧',
            'Gyaaa-oooh-shuuu...! 🌊💧 (Deru ombak samudra dan rintik hujan Primordial Sea memancar dari sirip Kyogre. Sang Penguasa Samudra menjaga kemurnian aliran air di Zulfan\'s Town.)',
            kyogreActions
          );
        } else {
          this.callbacks.onDialogue('Kyogre Sang Penguasa Samudra 🌊💧', kyogreLines);
        }
        document.dispatchEvent(new CustomEvent('town:kyogre'));
        this.wake();
        return;
      }
      if (npc.id === 'latios' || (npc as any).subType === 'latios') {
        sfx.select();
        const latiosLines = [
          'LATIOS: "Shwiii-shooo...!" ✈️🔷',
          'Di angkasa Zulfan\'s Town, Latios Sang Pokémon Eon melayang dengan aerodinamika supersonik.',
          'Bentuk tubuhnya yang ramping seperti pesawat jet memungkinkannya melesat melebihi kecepatan suara sambil memproyeksikan telepati kedamaian.',
          'Dalam legenda Hoenn dan Alto Mare, Latios adalah pelindung berhati murni yang menjaga Soul Dew demi keselamatan seluruh kota.',
        ];
        const latiosActions: BubbleAction[] = [
          {
            label: '⚡ Kecepatan Jet Luster Purge',
            onClick: () => this.triggerSignatureMove('latios', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('latios'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Latios (The Eon Pokémon) ✈️🔷',
            'Shwiii-shooo...! ✈️🔷 (Sayap jet Latios berpendar memancarkan gelombang psikis aerodinamis. Sang Penjaga Jiwa dan Cahaya mengawasi Zulfan\'s Town dengan kecepatan kilat.)',
            latiosActions
          );
        } else {
          this.callbacks.onDialogue('Latios Sang Penjelajah Angkasa ✈️🔷', latiosLines);
        }
        document.dispatchEvent(new CustomEvent('town:latios'));
        this.wake();
        return;
      }
      if (npc.id === 'latias' || (npc as any).subType === 'latias') {
        sfx.select();
        const latiasLines = [
          'LATIAS: "Kyuuu-wiiin...!" 💖✨',
          'Di taman dan angkasa Zulfan\'s Town, Latias Sang Pokémon Eon melayang dengan keanggunan berhati murni.',
          'Bulu halusnya dapat membiaskan cahaya untuk berkamuflase, memancarkan telepati kehangatan dan empati kepada setiap orang.',
          'Dalam legenda Hoenn dan Alto Mare, Latias adalah pelindung lembut nan pemberani yang menjaga keharmonisan kota.',
        ];
        const latiasActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Mistik Mist Ball',
            onClick: () => this.triggerSignatureMove('latias', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('latias'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Latias (The Eon Pokémon) 💖✨',
            'Kyuuu-wiiin...! 💖✨ (Sayap kemerahan Latias berpendar membiaskan kilau cahaya Refract Light. Sang Pelindung Jiwa menyebarkan aura kedamaian dan kehangatan di Zulfan\'s Town.)',
            latiasActions
          );
        } else {
          this.callbacks.onDialogue('Latias Sang Pelindung Hati 💖✨', latiasLines);
        }
        document.dispatchEvent(new CustomEvent('town:latias'));
        this.wake();
        return;
      }
      if (npc.id === 'darkrai' || (npc as any).subType === 'darkrai') {
        sfx.select();
        const darkraiLines = [
          'DARKRAI: "Zzzz-shhhwaaaddd...!" 🌑💤',
          'Di perbatasan bayang-bayang Zulfan\'s Town, Darkrai Sang Pokémon Mistik melayang dalam keheningan malam.',
          'Kabut bayangan hitam pekat berputar di bawah mantelnya. Konon saat bulan baru muncul, Darkrai dapat memicu tidur lelap dan mimpi buruk tak berujung (Dark Void).',
          'Namun di balik reputasinya yang menakutkan, Darkrai bertindak sebagai pelindung tersembunyi yang mengusir marabahaya dari dimensi bayangan.',
        ];
        const darkraiActions: BubbleAction[] = [
          {
            label: '⚡ Dimensi Bayangan Dark Void',
            onClick: () => this.triggerSignatureMove('darkrai', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('darkrai'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Darkrai (The Pitch-Black Pokémon) 🌑💤',
            'Zzzz-shhhwaaaddd...! 🌑💤 (Kabut bayangan hitam berputar di bawah mantel Darkrai. Sang Penguasa Dimensi Mimpi Buruk mengawasi perbatasan Zulfan\'s Town dari balik tirai kegelapan.)',
            darkraiActions
          );
        } else {
          this.callbacks.onDialogue('Darkrai Sang Penguasa Mimpi Buruk 🌑💤', darkraiLines);
        }
        document.dispatchEvent(new CustomEvent('town:darkrai'));
        this.wake();
        return;
      }
      if (npc.id === 'necrozma' || (npc as any).subType === 'necrozma' || npc.id === 'necrozma_dusk_mane') {
        sfx.select();
        const necrozmaLines = [
          'NECROZMA (Dusk Mane): "Ggg-rraaa-shhh-kzzzt...!" 🦁☀️',
          'Di pelataran Zulfan\'s Town, wujud fusi perkasa Necrozma Dusk Mane berdiri memancarkan cahaya surya menyilaukan.',
          'Prisma kristal hitam di kepalanya menyerap dan membiaskan energi matahari dari Solgaleo menjadi pancaran daya tak terbatas.',
          'Dalam legenda Alola dan Ultra Megalopolis, Necrozma adalah Pembawa Cahaya legendaris yang menguasai ruang antar-dimensi Ultra Space.',
        ];
        const necrozmaActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Surya Sunsteel Strike',
            onClick: () => this.triggerSignatureMove('necrozma', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('necrozma'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Necrozma Dusk Mane (The Prism Pokémon) 🦁☀️',
            'Ggg-rraaa-shhh-kzzzt...! 🦁☀️ (Prisma kristal hitam beresonansi dengan surya terang Solgaleo. Necrozma Dusk Mane memancarkan kekuatan cahaya murni Sunsteel Strike yang menerangi Zulfan\'s Town.)',
            necrozmaActions
          );
        } else {
          this.callbacks.onDialogue('Necrozma Dusk Mane Sang Prisma Surya 🦁☀️', necrozmaLines);
        }
        document.dispatchEvent(new CustomEvent('town:necrozma'));
        this.wake();
        return;
      }
      if (npc.id === 'lunala' || (npc as any).subType === 'lunala') {
        sfx.select();
        const lunalaLines = [
          'LUNALA: "Mahaaalo-laaa...!" 🌙✨',
          'Di angkasa malam Zulfan\'s Town, Lunala Sang Utusan Rembulan membentangkan sayap sabitnya yang mempesona.',
          'Sayapnya menyerap dan membiaskan cahaya malam menjadi energi kosmik penenang jiwa.',
          'Dalam legenda Alola dan mitologi Ultra Space, Lunala dipuja sebagai pelindung malam yang membawa berkah kedamaian.',
        ];
        const lunalaActions: BubbleAction[] = [
          {
            label: '⚡ Sinar Rembulan Moongeist Beam',
            onClick: () => this.triggerSignatureMove('lunala', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('lunala'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Lunala (The Moone Pokémon) 🌙✨',
            'Mahaaalo-laaa...! 🌙✨ (Sayap bulan sabit Lunala membentang menyerap cahaya malam dalam fase Full Moon. Sang Utusan Rembulan menaburkan debu kosmik starlight yang melindungi Zulfan\'s Town.)',
            lunalaActions
          );
        } else {
          this.callbacks.onDialogue('Lunala Sang Utusan Rembulan 🌙✨', lunalaLines);
        }
        document.dispatchEvent(new CustomEvent('town:lunala'));
        this.wake();
        return;
      }
      if (npc.id === 'solgaleo' || (npc as any).subType === 'solgaleo') {
        sfx.select();
        const solgaleoLines = [
          'SOLGALEO: "Laaa-lionnn-shooo...!" ☀️🦁',
          'Di pelataran Zulfan\'s Town, Solgaleo Sang Utusan Mentari berdiri perkasa dengan surai surya yang berkobar.',
          'Surai dan tubuhnya memancarkan energi matahari berlimpah yang menghangatkan seluruh penjuru kota.',
          'Dalam mitologi Alola dan peradaban kuno, Solgaleo disembah sebagai Sang Pemangsa Mentari yang membawa cahaya kehidupan abadi.',
        ];
        const solgaleoActions: BubbleAction[] = [
          {
            label: '⚡ Kilau Surya Sunsteel Corona',
            onClick: () => this.triggerSignatureMove('solgaleo', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('solgaleo'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Solgaleo (The Sunne Pokémon) ☀️🦁',
            'Laaa-lionnn-shooo...! ☀️🦁 (Surai keemasan Solgaleo berkobar terang benderang dalam fase Radiant Sun. Sang Utusan Mentari memancarkan kehangatan surya Sunsteel Strike yang melindungi Zulfan\'s Town.)',
            solgaleoActions
          );
        } else {
          this.callbacks.onDialogue('Solgaleo Sang Utusan Mentari ☀️🦁', solgaleoLines);
        }
        document.dispatchEvent(new CustomEvent('town:solgaleo'));
        this.wake();
        return;
      }
      if (npc.id === 'samurott' || (npc as any).subType === 'samurott') {
        sfx.select();
        const samurottLines = [
          'SAMUROTT: "Rrrwooon-kllliiinggg...!" ⚔️🌊',
          'Di pelataran Zulfan\'s Town, Samurott Sang Formidable Seamitar berdiri gagah menghunus pedang kerang Seamitar.',
          'Bilah Seamitar yang terpasang di pelindung kakinya diasah dengan presisi mutlak, siap memotong kode kusut dan rintangan teknis.',
          'Sebagai pelindung Clean Code dan Precision Architecture, Samurott melambangkan ketangguhan dan eksekusi tanpa cela.',
        ];
        const samurottActions: BubbleAction[] = [
          {
            label: '⚔️ Tebasan Kerang Razor Shell',
            onClick: () => this.triggerSignatureMove('samurott', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => this.setActiveFollower('samurott'),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(
            'Samurott (Formidable Seamitar) ⚔️🌊',
            'Rrrwooon-kllliiinggg...! ⚔️🌊 (Samurott menghunus pedang kerang Seamitar berkecepatan kilat. Ombak air berputar membentuk tebasan Razor Shell presisi tinggi yang melindungi Zulfan\'s Town.)',
            samurottActions
          );
        } else {
          this.callbacks.onDialogue('Samurott Formidable Seamitar ⚔️🌊', samurottLines);
        }
        document.dispatchEvent(new CustomEvent('town:samurott'));
        this.wake();
        return;
      }
      if (npc.id === 'charizard' || npc.id === 'lebron' || npc.action?.kind === 'event') {
        const evt = npc.action?.kind === 'event' ? npc.action.name : npc.id;
        document.dispatchEvent(new CustomEvent(`town:${evt}`));
        this.wake();
        return;
      }
      if (this.callbacks.onBubble) {
        let action: { label: string; href?: string; onClick?: () => void } | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            action = { label: 'Talk / Enter', href: npc.action.route };
          } else if (npc.action.kind === 'refill') {
            action = { label: 'Refill Poké Balls', onClick: () => this.callbacks.onRefill() };
          } else if (npc.action.kind === 'open') {
            const t = npc.action.target;
            action = { label: `Open ${t.toUpperCase()}`, onClick: () => this.callbacks.onOpenModal(t) };
          }
        }
        this.callbacks.onBubble(npc.name, npc.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            const r = npc.action.route;
            onAction = () => this.callbacks.onNavigate(r);
          } else if (npc.action.kind === 'refill') {
            onAction = () => this.callbacks.onRefill();
          } else if (npc.action.kind === 'open') {
            const t = npc.action.target;
            onAction = () => this.callbacks.onOpenModal(t);
          }
        }
        this.callbacks.onDialogue(npc.name, npc.lines, onAction);
      }
      this.wake();
      return;
    }

    // 2. Check Sign
    const sign = this.map.signs.find((s) => s.x === fx && s.y === fy);
    if (sign) {
      sfx.select();
      if (this.callbacks.onBubble) {
        let action:
          | { label: string; href?: string; onClick?: () => void }
          | { label: string; href?: string; onClick?: () => void }[]
          | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            action = { label: `Open ${sign.name}`, href: sign.action.route };
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            action = { label: `Open ${sign.name}`, onClick: () => this.callbacks.onOpenModal(t) };
          } else if (sign.action.kind === 'event') {
            const evt = sign.action.name;
            action = [
              {
                label: '🚪 Enter Poké-Café & Bar (/cafe)',
                href: '/cafe',
              },
              {
                label: '☕ Order Dev Roast (+100 Energy)',
                onClick: () => {
                  sfx.espressoBrew();
                  this.callbacks.onRefill();
                  document.dispatchEvent(new CustomEvent(`town:${evt}`));
                },
              },
            ];
          }
        }
        this.callbacks.onBubble(sign.name, sign.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            const r = sign.action.route;
            onAction = () => this.callbacks.onNavigate(r);
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            onAction = () => this.callbacks.onOpenModal(t);
          }
        }
        this.callbacks.onDialogue(sign.name, sign.lines, onAction);
      }
      this.wake();
      return;
    }

    // 2a. Check dynamic building entrance doors
    for (const b of townConfig.getBuildings()) {
      if (b.hidden || b.kind !== 'building' || !b.link) continue;
      const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
      const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h;
      const route = b.link;

      const isFacingDoor = (fx === doorX && fy === doorY) || (b.w >= 6 && fx === doorX - 1 && fy === doorY);
      const isAtEntrance = (this.playerDir === 'up' && this.playerPos.y === doorY + 1 && (this.playerPos.x === doorX || (b.w >= 6 && this.playerPos.x === doorX - 1)));
      const isStandingOnDoor = (this.playerPos.x === doorX && this.playerPos.y === doorY) || (b.w >= 6 && this.playerPos.x === doorX - 1 && this.playerPos.y === doorY);

      if (isFacingDoor || isAtEntrance || isStandingOnDoor) {
        sfx.door();
        this.callbacks.onNavigate(route);
        this.wake();
        return;
      }
    }

    // Static door fallback in interactFacing: only if building hasn't moved
    for (const b of this.map.buildings) {
      const cfg = townConfig.getBuilding(b.id);
      if (cfg && (cfg.x !== b.x || cfg.y !== b.y || cfg.hidden)) continue;
      if (Array.isArray(b.doors)) {
        for (const d of b.doors) {
          if ((fx === d.x && fy === d.y) || (this.playerPos.x === d.x && this.playerPos.y === d.y)) {
            sfx.door();
            this.callbacks.onNavigate(cfg?.link ?? b.route ?? '/');
            this.wake();
            return;
          }
        }
      }
    }

    // 2b. Check Custom Placed Objects, NPCs, Signs, Props from townConfig
    const customPlaced =
      (activeTarget
        ? townConfig.getBuildings().find((b) => !b.hidden && (b.id === activeTarget || b.subType === activeTarget))
        : undefined) ||
      townConfig.getBuildings().find((b) => {
        if (b.hidden) return false;
        // Skip major indoor buildings which have their own doors
        if (['dev', 'lab', 'home', 'shop', 'arcade', 'reception', 'office', 'tower'].includes(b.id)) return false;
        const inFacing = fx >= b.x && fx < b.x + b.w && fy >= b.y && fy < b.y + b.h;
        const isAdjacent = (
          this.playerPos.x >= b.x - 1 &&
          this.playerPos.x <= b.x + b.w &&
          this.playerPos.y >= b.y - 1 &&
          this.playerPos.y <= b.y + b.h
        );
        return inFacing || isAdjacent;
      });

    if (activeTarget === 'kiosk' || activeTarget === 'cafe' || activeTarget === 'bar' || customPlaced?.id === 'kiosk') {
      sfx.select();
      const kioskLines = [
        'POKÉ-CAFÉ BARISTA STAND ☕',
        'Specialty roasts & Castelia Cones crafted fresh for devs & trainers!',
        '"Today\'s blend: Dark Roasted TypeScript with notes of React & zero runtime bugs!"',
      ];
      const kioskActions = [
        {
          label: '🚪 Enter Poké-Café & Bar (/cafe)',
          href: '/cafe',
        },
        {
          label: '☕ Quick Sip Dev Roast (+100 Energy)',
          onClick: () => {
            sfx.espressoBrew();
            this.callbacks.onRefill();
            document.dispatchEvent(new CustomEvent('town:cafe-coffee'));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Poké-Café Barista Stand ☕',
                'You enjoyed a warm cup of Dark Roasted TypeScript! Fresh espresso aroma restored your coding focus & stamina to 100%! Step inside the Café & Bar for custom blends, Lo-Fi Vinyl Jukebox & VIP Coffee Chats! ☕✨',
                {
                  label: '🚪 Step Inside Poké-Café & Bar',
                  href: '/cafe',
                }
              );
            }
          },
        },
      ];
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Poké-Café Barista Stand ☕', kioskLines.join(' '), kioskActions);
      } else {
        this.callbacks.onDialogue('Poké-Café Barista Stand ☕', kioskLines, () => this.callbacks.onNavigate('/cafe'));
      }
      this.wake();
      return;
    }

    if (activeTarget === 'arena' || activeTarget === 'colosseum' || customPlaced?.id === 'arena') {
      sfx.select();
      const arenaLines = [
        'BATTLE FRONTIER & ALGORITHM COLOSSEUM ⚔️',
        'Step into the Grand Stadium where Frontier Brain Mewtwo & Tactical Coach Lucario test your AI, full-stack architecture, and competitive engineering mastery!',
      ];
      const arenaActions = [
        {
          label: '⚔️ Enter Battle Frontier Arena (/arena)',
          href: '/arena',
        },
        {
          label: '🔮 Quick Telepathy Quiz vs Mewtwo',
          onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
        },
      ];
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Battle Frontier Colosseum ⚔️', arenaLines.join(' '), arenaActions);
      } else {
        this.callbacks.onDialogue('Battle Frontier Colosseum ⚔️', arenaLines, () => this.callbacks.onNavigate('/arena'));
      }
      this.wake();
      return;
    }

    if (
      activeTarget === 'berry' ||
      activeTarget === 'garden' ||
      customPlaced?.id === 'garden' ||
      customPlaced?.id === 'berry'
    ) {
      sfx.select();
      const berryLines = [
        'ORGANIC BERRY ORCHARD & SAKURA GROVE 🌸',
        'Oran, Sitrus, dan Cheri berries tumbuh subur di kebun botani di bawah naungan pohon sakura.',
        'Tempat yang asri dan tenang untuk memulihkan stamina para trainer dan developer!',
      ];
      const berryActions = [
        {
          label: '🌸 Enter Berry Garden & Conservatory (/garden)',
          href: '/garden',
        },
        {
          label: '🍇 Petik Buah Berry (+3 Poké Balls)',
          onClick: () => this.harvestBerries(),
        },
      ];
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Berry Garden & Sakura Grove 🌸', berryLines.join(' '), berryActions);
      } else {
        this.callbacks.onDialogue('Berry Garden & Sakura Grove 🌸', berryLines, () =>
          this.callbacks.onNavigate('/garden')
        );
      }
      this.wake();
      return;
    }

    if (
      activeTarget === 'neighbour' ||
      activeTarget === 'villa' ||
      customPlaced?.id === 'villa' ||
      customPlaced?.id === 'neighbour'
    ) {
      sfx.select();
      const neighbourLines = [
        "NEIGHBOUR'S COTTAGE & FELLOW DEV GUILD 🏡",
        "A warm, sunlit cottage where fellow developers, open-source contributors, and Eevee hang out!",
        "Step inside to pair-program, sign the Neighbour Guestbook, and discover Eeveelution tech vibes!",
      ];
      const neighbourActions = [
        {
          label: "🏡 Enter Neighbour's House (/neighbour)",
          href: '/neighbour',
        },
        {
          label: '🦊 Say Hi to Eevee & Maya',
          onClick: () => {
            sfx.heal();
            this.callbacks.onRefill();
            document.dispatchEvent(new CustomEvent('town:neighbour-fx', { detail: { text: 'EEVEE CHEERED FOR YOU! 🦊💖', color: '#f59e0b' } }));
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                "Neighbour's Cottage 🏡",
                "Neighbour Maya and Eevee greeted you warmly from the cottage porch! Your energy is refreshed to 100%! Step inside to pair-program, play PR Ping-Pong, and sign the Guestbook! 🦊✨",
                {
                  label: "🏡 Step Inside Neighbour's Cottage",
                  href: '/neighbour',
                }
              );
            }
          },
        },
      ];
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble("Neighbour's House 🏡", neighbourLines.join(' '), neighbourActions);
      } else {
        this.callbacks.onDialogue("Neighbour's House 🏡", neighbourLines, () => this.callbacks.onNavigate('/neighbour'));
      }
      this.wake();
      return;
    }

    if (customPlaced) {
      const tpl = SPAWNABLE_TEMPLATES.find(
        (t) => t.id === customPlaced.id || t.id === 'tpl_' + customPlaced.id || t.subType === customPlaced.subType || t.subType === customPlaced.id
      );
      if (customPlaced.dialogue || tpl?.defaultDialogue || customPlaced.kind === 'npc' || customPlaced.kind === 'sign') {
        sfx.select();
        const text = customPlaced.dialogue || tpl?.defaultDialogue || `${customPlaced.name} berdiri di koordinat (${customPlaced.x}, ${customPlaced.y}).`;

        let action: BubbleAction | BubbleAction[] | undefined;
        let dialogueText = customPlaced.dialogue || tpl?.defaultDialogue || `${customPlaced.name} berdiri di koordinat (${customPlaced.x}, ${customPlaced.y}).`;

        if (customPlaced.link) {
          action = { label: 'Buka / Kunjungi ↗', href: customPlaced.link };
        } else if (customPlaced.subType === 'pokeball_item') {
          action = {
            label: '🎁 Ambil Item (+2 Poké Ball)',
            onClick: () => {
              sfx.heal();
              this.callbacks.onRefill();
              if (this.callbacks.onBubble) {
                this.callbacks.onBubble(customPlaced.name, 'Kamu membuka Poké Ball ini dan menemukan persediaan bola cadangan! ✨');
              }
            },
          };
        } else if (customPlaced.subType === 'pokestop') {
          action = {
            label: '🔄 Putar Piringan Poké-Stop',
            onClick: () => {
              sfx.heal();
              this.callbacks.onRefill();
              if (this.callbacks.onBubble) {
                this.callbacks.onBubble('Poké-Stop ✨', 'Piringan berputar cepat! Kamu mendapatkan Poké Ball segar dan energi petualang baru! 🎒');
              }
            },
          };
        } else if (customPlaced.subType === 'groudon') {
          dialogueText = "GROUDON: 'Gwoooaaarrr-ghuuu...!' 🌋🔥 [Tech Guardian: Rock-Solid Storage & Database Partitioning] Menjaga kestabilan pondasi benua dan data persisten tak tergoyahkan.";
          action = [
            {
              label: '⚡ Gemuruh Magma Precipice Blades',
              onClick: () => this.triggerSignatureMove('groudon', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('groudon'),
            },
          ];
        } else if (customPlaced.subType === 'kyogre') {
          dialogueText = "KYOGRE: 'Gyaaa-oooh-shuuu...!' 🌊💧 [Tech Guardian: Streaming Data Pipelines & Event-Driven Architecture] Mengalirkan jutaan pesan data secara kontinu tanpa hambatan.";
          action = [
            {
              label: '⚡ Gelombang Samudra Origin Pulse',
              onClick: () => this.triggerSignatureMove('kyogre', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('kyogre'),
            },
          ];
        } else if (customPlaced.subType === 'gyarados') {
          dialogueText = "GYARADOS: 'Gwoooaaargh... Roaaar!' 🌊🐉 [Tech Guardian: High-Throughput Streaming & Resilient Network Pipelines] Mengalirkan jutaan transaksi data secara deras dan pantang menyerah menembus arus!";
          action = [
            {
              label: '⚡ Semburan Air (Hydro Pump)',
              onClick: () => this.triggerSignatureMove('gyarados', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('gyarados'),
            },
          ];
        } else if (customPlaced.subType === 'latios') {
          dialogueText = "LATIOS: 'Shwiii-shooo...!' ✈️🔷 [Tech Guardian: High-Speed Telemetry & API Edge Gateways] Mengarahkan arus komputasi supersonik dengan latensi paling rendah.";
          action = [
            {
              label: '⚡ Kecepatan Jet Luster Purge',
              onClick: () => this.triggerSignatureMove('latios', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('latios'),
            },
          ];
        } else if (customPlaced.subType === 'latias') {
          dialogueText = "LATIAS: 'Kyuuu-wiiin...!' 💖✨ [Tech Guardian: Responsive Frontend & Empathetic UX] Membiaskan antarmuka digital yang memikat dan bersahabat di segala platform.";
          action = [
            {
              label: '⚡ Cahaya Mistik Mist Ball',
              onClick: () => this.triggerSignatureMove('latias', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('latias'),
            },
          ];
        } else if (customPlaced.subType === 'darkrai') {
          dialogueText = "DARKRAI: 'Zzzz-shhhwaaaddd...!' 🌑💤 [Tech Guardian: Cyber Security, Encryption & Penetration Testing] Mengunci celah ilegal dan menjaga sistem dari dimensi bayangan.";
          action = [
            {
              label: '⚡ Dimensi Bayangan Dark Void',
              onClick: () => this.triggerSignatureMove('darkrai', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('darkrai'),
            },
          ];
        } else if (customPlaced.subType === 'necrozma' || customPlaced.subType === 'necrozma_dusk_mane') {
          dialogueText = "NECROZMA: 'Ggg-rraaa-shhh-kzzzt...!' 🦁☀️ [Tech Guardian: Multi-Modal AI & Cross-Platform Convergence] Membiaskan cahaya komputasi surya tak terbatas Sunsteel Strike.";
          action = [
            {
              label: '⚡ Cahaya Surya Sunsteel Strike',
              onClick: () => this.triggerSignatureMove('necrozma', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('necrozma'),
            },
          ];
        } else if (customPlaced.subType === 'lunala') {
          dialogueText = "LUNALA: 'Mahaaalo-laaa...!' 🌙✨ [Tech Guardian: Dark Mode Aesthetics & Night-Shift Reliability] Menjaga keandalan operasional sistem 24/7 di bawah sinar kosmik.";
          action = [
            {
              label: '⚡ Sinar Rembulan Moongeist Beam',
              onClick: () => this.triggerSignatureMove('lunala', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('lunala'),
            },
          ];
        } else if (customPlaced.subType === 'solgaleo') {
          dialogueText = "SOLGALEO: 'Laaa-lionnn-shooo...!' ☀️🦁 [Tech Guardian: High-Performance GPU Computing & Radiant Power Delivery] Menyalurkan daya komputasi grafis dan inferensi model tercepat.";
          action = [
            {
              label: '⚡ Kilau Surya Sunsteel Corona',
              onClick: () => this.triggerSignatureMove('solgaleo', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('solgaleo'),
            },
          ];
        } else if (customPlaced.subType === 'samurott') {
          dialogueText = "SAMUROTT: 'Rrrwooon-kllliiinggg...!' ⚔️🌊 [Tech Guardian: Precision Systems & Clean Code Mastery] Menghunus pedang Seamitar untuk memotong bug rumit, refactoring bersih, dan performa kode yang tangguh.";
          action = [
            {
              label: '⚔️ Tebasan Kerang Razor Shell',
              onClick: () => this.triggerSignatureMove('samurott', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('samurott'),
            },
          ];
        } else if (customPlaced.subType === 'rayquaza') {
          dialogueText = "RAYQUAZA: 'Krrr-shhhwaaahh...!' 🐉 [Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability] Mengarungi stratosfer awan menjaga stabilitas uptime sistem 99.99%!";
          action = [
            {
              label: '⚡ Deru Badai (Delta Stream)',
              onClick: () => this.triggerSignatureMove('rayquaza', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('rayquaza'),
            },
          ];
        } else if (customPlaced.subType === 'charizard') {
          dialogueText = "CHARIZARD: 'GRAAAWWWRRR...!' 🔥 Ekor api Charizard membakar semangat petualang di Zulfan's Town! [Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps] Solusi cepat, tangguh, dan membakar habis setiap bug!";
          action = [
            {
              label: '⚡ Semburan Api (Flamethrower)',
              onClick: () => this.triggerSignatureMove('charizard', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('charizard'),
            },
          ];
        } else if (customPlaced.subType === 'tyranitar' || customPlaced.subType === 'blastoise') {
          dialogueText = "TYRANITAR: 'Gwoooaaargh!' 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan. [Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure] Kokoh bertahan dari segala lonjakan traffic dan ancaman siber!";
          action = [
            {
              label: '⚡ Badai Pasir (Sandstorm)',
              onClick: () => this.triggerSignatureMove('tyranitar', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('tyranitar'),
            },
          ];
        } else if (customPlaced.subType === 'garchomp') {
          dialogueText = "GARCHOMP: 'Gyaaa-shhh...!' 🦈 Sayap sirip tajam Garchomp berdesir membelah angin. [Tech Guardian: High-Speed Algorithms, Optimization & Clean Code] Bergerak secepat jet tempur supersonik mengeksekusi logika!";
          action = [
            {
              label: '⚡ Tebasan Naga (Dragon Claw)',
              onClick: () => this.triggerSignatureMove('garchomp', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('garchomp'),
            },
          ];
        } else if (customPlaced.subType === 'urshifu' || customPlaced.subType === 'urshifu_gmax') {
          dialogueText = "URSHIFU: 'Hssshaaarrr-kwooo...!' 🌊 Aliran deras jurus Rapid Strike bergemuruh. [Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX] Menghadirkan solusi kilat yang kokoh dan tepat sasaran.";
          action = [
            {
              label: '⚡ Serbuan Beruntun (G-Max Rapid Flow)',
              onClick: () => this.triggerSignatureMove('urshifu', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('urshifu'),
            },
          ];
        } else if (customPlaced.subType === 'lucario') {
          dialogueText = "LUCARIO: 'Aura Zulfan beresonansi kuat di sini!' 🌀 [Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend] Merasakan kebutuhan pengguna secara empatik dan menghadirkan interaksi digital yang memikat.";
          action = [
            {
              label: '⚡ Bola Aura (Aura Sphere)',
              onClick: () => this.triggerSignatureMove('lucario', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('lucario'),
            },
          ];
        } else if (customPlaced.subType === 'mewtwo') {
          dialogueText = "MEWTWO: 'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik.' 🔮 [Tech Guardian: AI Agents, LLM Orchestration & Deep Learning] Menguasai penalaran multi-agent cerdas dan otomatisasi AI.";
          action = [
            {
              label: '⚡ Gelombang Psikis (Psystrike)',
              onClick: () => this.triggerSignatureMove('mewtwo', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('mewtwo'),
            },
          ];
        } else if (customPlaced.subType === 'arceus') {
          dialogueText = "ARCEUS: 'Dooo-oooonnn...!' ✨ [Tech Guardian: Enterprise System Architecture & End-to-End Product Vision] Merancang fondasi ekosistem software menyeluruh dari rancangan arsitektur hingga produksi global.";
          action = [
            {
              label: '⚡ Cahaya Kosmik (Judgment)',
              onClick: () => this.triggerSignatureMove('arceus', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('arceus'),
            },
          ];
        } else if (customPlaced.subType === 'dialga') {
          dialogueText = "DIALGA: 'Gugyugubah...!' ⏳🔷 [Tech Guardian: Time-Critical Backend & Microservices] Mengatur latensi real-time dan sinkronisasi data presisi.";
          action = [
            {
              label: '⚡ Dentang Waktu (Roar of Time)',
              onClick: () => this.triggerSignatureMove('dialga', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('dialga'),
            },
          ];
        } else if (customPlaced.subType === 'palkia') {
          dialogueText = "PALKIA: 'Gyaaa-ooohhn...!' 🌌💧 [Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure] Menghubungkan setiap simpul arsitektur awan tanpa batas dimensi.";
          action = [
            {
              label: '⚡ Riak Dimensi (Spacial Rend)',
              onClick: () => this.triggerSignatureMove('palkia', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('palkia'),
            },
          ];
        } else if (customPlaced.subType === 'reshiram') {
          dialogueText = "RESHIRAM: 'Vaaa-zhooom...!' 🤍🔥 [Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture] Memastikan setiap baris kode terverifikasi bersih dan bebas kerentanan.";
          action = [
            {
              label: '⚡ Kobaran Fusion Flare',
              onClick: () => this.triggerSignatureMove('reshiram', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('reshiram'),
            },
          ];
        } else if (customPlaced.subType === 'zekrom') {
          dialogueText = "ZEKROM: 'Bzzzz-Vrrrooom...!' 🖤⚡ [Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute] Memberikan daya komputasi raksasa untuk memproses data masif tanpa jeda.";
          action = [
            {
              label: '⚡ Kilatan Fusion Bolt',
              onClick: () => this.triggerSignatureMove('zekrom', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('zekrom'),
            },
          ];
        } else if (customPlaced.subType === 'giratina') {
          dialogueText = "GIRATINA: 'Gyaaa-shhhooo...!' 👻🌌 [Tech Guardian: Fault Tolerance, Chaos Engineering & Resilient Rollback] Menguji ketangguhan sistem dari celah dimensi yang tak terduga.";
          action = [
            {
              label: '⚡ Gemuruh Shadow Force',
              onClick: () => this.triggerSignatureMove('giratina', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('giratina'),
            },
          ];
        } else if (customPlaced.subType === 'pikachu') {
          dialogueText = "PIKACHU: 'Pika-Pikaaa-Chuuu!' ⚡ [Tech Guardian: Community Engagement & Interactive Web Experiences] Maskot setia penyemangat petualangan di Zulfan's Town!";
          action = [
            {
              label: '⚡ Sambaran Kilat (Thunderbolt)',
              onClick: () => this.triggerSignatureMove('pikachu', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => this.setActiveFollower('pikachu'),
            },
          ];
        }

        if (Array.isArray(action) && customPlaced.subType) {
          const rideId =
            customPlaced.subType === 'blastoise'
              ? 'tyranitar'
              : customPlaced.subType.replace('_gmax', '').replace('_dusk_mane', '');
          action.push({
            label: '🏇 Tunggangi (Poké Ride)',
            onClick: () => {
              this.setActiveFollower(rideId, false);
              this.setPokeRide(true);
            },
          });
        }

        if (this.callbacks.onBubble) {
          this.callbacks.onBubble(customPlaced.name, dialogueText, action);
        } else {
          const firstAct = Array.isArray(action) ? action[0] : action;
          this.callbacks.onDialogue(
            customPlaced.name,
            [dialogueText],
            firstAct?.href ? () => this.callbacks.onNavigate(firstAct!.href!) : firstAct?.onClick
          );
        }
        this.wake();
        return;
      }
    }

    // 3. Check Prop (Statue / Fountain / East & West POIs)
    const contestCfg = townConfig.getBuilding('contest');
    const prop = this.map.props.find((p) => {
      let px = p.x;
      let py = p.y;
      if (p.id === 'contest' && contestCfg && !contestCfg.hidden) {
        px = contestCfg.x + 3;
        py = contestCfg.y + 2;
      }
      return (
        Math.hypot(px - fx, py - fy) <= 2.8 ||
        (Math.abs(px - this.playerPos.x) <= 2 && Math.abs(py - this.playerPos.y) <= 2)
      );
    });
    if (prop) {
      sfx.select();
      if (prop.id === 'lookout') {
        const next = this.townAtmosphere === 'day' ? 'Sunset' : this.townAtmosphere === 'sunset' ? 'Night' : 'Day';
        const action = {
          label: `🌅 Switch to ${next} Time`,
          onClick: () => {
            const current = this.cycleAtmosphere();
            const upcoming = current === 'day' ? 'Sunset' : current === 'sunset' ? 'Night' : 'Day';
            if (this.callbacks.onBubble) {
              this.callbacks.onBubble(
                'Scenic Lookout Point 🔭',
                `Panoramic ocean vista overlooking Sinnoh. Atmosphere switched to ${current.toUpperCase()}!`,
                {
                  label: `🌅 Switch to ${upcoming} Time`,
                  onClick: () => this.cycleAtmosphere(),
                }
              );
            }
          },
        };
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble('Scenic Lookout Point 🔭', prop.lines.join(' '), action);
        } else {
          this.callbacks.onDialogue('Scenic Lookout Point', prop.lines);
        }
        this.wake();
        return;
      }
      if (prop.id === 'berry') {
        const actions = [
          {
            label: '🌸 Enter Berry Garden & Conservatory (/garden)',
            href: '/garden',
          },
          {
            label: '🍇 Pick Berries (+3 Poké Balls)',
            onClick: () => this.harvestBerries(),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble('Berry Garden & Sakura Grove 🌸', prop.lines.join(' '), actions);
        } else {
          this.callbacks.onDialogue('Berry Garden', prop.lines, () => this.callbacks.onNavigate('/garden'));
        }
        this.wake();
        return;
      }
      if (prop.id === 'contest') {
        if (contestCfg && contestCfg.hidden) {
          return;
        }
        const action = {
          label: '🌟 View Frontend Architecture',
          onClick: () => this.callbacks.onNavigate('/dev'),
        };
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble('Contest Stage Podium 🎪', prop.lines.join(' '), action);
        } else {
          this.callbacks.onDialogue('Contest Stage', prop.lines);
        }
        this.wake();
        return;
      }
      if (prop.id === 'arena') {
        const actions = [
          {
            label: '⚔️ Enter Battle Frontier Arena (/arena)',
            href: '/arena',
          },
          {
            label: '🔮 Quick Telepathy Quiz vs Mewtwo',
            onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
          },
        ];
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble('Pokémon Battle Arena ⚔️', prop.lines.join(' '), actions);
        } else {
          this.callbacks.onDialogue('Battle Arena', prop.lines, () => this.callbacks.onNavigate('/arena'));
        }
        this.wake();
        return;
      }
      if (prop.id === 'hobby') {
        const action = {
          label: '☕ Check Arcade Showcase',
          onClick: () => this.callbacks.onNavigate('/arcade'),
        };
        if (this.callbacks.onBubble) {
          this.callbacks.onBubble("Off-Duty Pergola & Boardwalk 🚴", prop.lines.join(' '), action);
        } else {
          this.callbacks.onDialogue('Off-Duty Pergola', prop.lines);
        }
        this.wake();
        return;
      }
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble(prop.name, prop.lines.join(' '));
      } else {
        this.callbacks.onDialogue(prop.name, prop.lines);
      }
      this.wake();
      return;
    }

    // 4. Check Shop (Depop stall)
    const shop = this.map.buildings.find((b) => b.id === 'shop' && fx >= b.x && fx < b.x + b.w && fy >= b.y && fy < b.y + b.h);
    if (shop) {
      sfx.select();
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Depop & Store', "Visit Muhammad Zulfan's verified classic web portfolio and showcases.", {
          label: 'Visit Portfolio',
          href: 'https://zulfan15.github.io/MZulfan',
        });
      } else {
        this.callbacks.onDialogue('Depop & Store', ["Visit Muhammad Zulfan's verified classic web portfolio and showcases."], () => {
          window.open('https://zulfan15.github.io/MZulfan', '_blank');
        });
      }
      this.wake();
      return;
    }
  }

  public updateDomLabels() {
    const container = document.querySelector('[data-town-labels]');
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (this.currentScene === 'home') {
      const is2F = this.homeFloor === '2F';
      const home1FLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'shop-posters': { x: 1, y: 1, w: 4, h: 1, lift: 0 },
        'shop-polaroids': { x: 8, y: 1, w: 4, h: 1, lift: 0 },
        'stairs-up': { x: 12, y: 2, w: 2, h: 1, lift: 0.5 },
        'shop-jukebox': { x: 1, y: 3, w: 2, h: 2, lift: 0 },
        'shop-closet': { x: 9, y: 5, w: 3, h: 1, lift: 0 },
      };

      const home2FLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'home2f-fridge': { x: 1, y: 2, w: 1, h: 2, lift: 1 },
        'home2f-tv': { x: 5, y: 2, w: 3, h: 1, lift: 2 },
        'home2f-twin': { x: 6, y: 6, w: 1, h: 1, lift: 1 },
        'home2f-computer': { x: 11, y: 9, w: 2, h: 1, lift: 1.5 },
        'home2f-stairs-down': { x: 12, y: 2, w: 2, h: 1, lift: 0.5 },
      };

      const activeLabels = is2F ? home2FLabels : home1FLabels;
      const inactiveLabels = is2F ? home1FLabels : home2FLabels;

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (inactiveLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
        if (!activeLabels[id]) return;

        btn.style.display = '';
        const obj = activeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'tower') {
      const towerLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        xurkitree: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        porygon: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'robotics-bay': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'server-rack': { x: 11, y: 3, w: 3, h: 3, lift: 0.75 },
        'career-terminal': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        elevator: { x: 8, y: 7, w: 3, h: 2, lift: 0.75 },
        lounge: { x: 13, y: 7, w: 1, h: 3, lift: 0.75 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !towerLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = towerLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'mart') {
      const martLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        clerk: { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        meowth: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'services-shelf': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'tech-tms': { x: 10, y: 3, w: 3, h: 2, lift: 0.75 },
        'potions-shelf': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        'key-showcase': { x: 10, y: 7, w: 3, h: 2, lift: 0.75 },
        'drink-cooler': { x: 13, y: 3, w: 1, h: 3, lift: 0.5 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !martLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = martLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'cafe') {
      const cafeLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        barista: { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        alcremie: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'vinyl-jukebox': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'pastry-case': { x: 10, y: 3, w: 3, h: 2, lift: 0.75 },
        'roast-board': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        'vip-booth': { x: 10, y: 7, w: 3, h: 2, lift: 0.75 },
        'craft-tap': { x: 13, y: 3, w: 1, h: 3, lift: 0.5 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !cafeLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = cafeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'arena') {
      const arenaLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'mewtwo-boss': { x: 7, y: 2, w: 1, h: 1, lift: 1.05 },
        'lucario-coach': { x: 2, y: 6, w: 1, h: 1, lift: 0.9 },
        'referee-dan': { x: 12, y: 6, w: 1, h: 1, lift: 0.9 },
        'battle-terminal': { x: 1, y: 3, w: 2, h: 2, lift: 0.5 },
        'algorithm-dojo': { x: 12, y: 3, w: 2, h: 2, lift: 0.5 },
        'trophy-vault': { x: 1, y: 8, w: 2, h: 2, lift: 0.35 },
        'stat-radar': { x: 12, y: 8, w: 2, h: 2, lift: 0.35 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !arenaLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = arenaLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'garden') {
      const gardenLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'botanist-flora': { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        'shaymin-npc': { x: 8, y: 3, w: 1, h: 1, lift: 0.45 },
        'plot-oran': { x: 1, y: 3, w: 3, h: 2, lift: 0.55 },
        'plot-sitrus': { x: 11, y: 3, w: 3, h: 2, lift: 0.55 },
        'watering-well': { x: 4, y: 6, w: 1, h: 1, lift: 0.85 },
        'plot-cheri': { x: 1, y: 7, w: 3, h: 2, lift: 0.45 },
        'berry-blender': { x: 11, y: 7, w: 3, h: 2, lift: 0.45 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !gardenLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = gardenLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'neighbour') {
      const neighbourLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'neighbour-maya': { x: 6, y: 3, w: 1, h: 1, lift: 1.45 },
        'eevee-companion': { x: 8, y: 3, w: 1, h: 1, lift: 0.45 },
        'guestbook-board': { x: 1, y: 3, w: 3, h: 2, lift: 0.55 },
        'coop-table': { x: 11, y: 3, w: 3, h: 2, lift: 0.55 },
        'fireplace-hearth': { x: 4, y: 6, w: 1, h: 1, lift: 0.85 },
        'retro-console': { x: 1, y: 7, w: 3, h: 2, lift: 0.45 },
        'mentorship-shelf': { x: 11, y: 7, w: 3, h: 2, lift: 0.45 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !neighbourLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = neighbourLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'reception') {
      const receptionLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        mira: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        chansey: { x: 9, y: 3, w: 1, h: 1, lift: 1.1 },
        'healing-machine': { x: 10, y: 2, w: 3, h: 2, lift: 0.75 },
        'pc-terminal': { x: 13, y: 4, w: 1, h: 2, lift: 0.5 },
        'directory-board': { x: 1, y: 3, w: 2, h: 1, lift: 1.25 },
        'waiting-couch': { x: 1, y: 6, w: 3, h: 2, lift: 0.25 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !receptionLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = receptionLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'arcade') {
      const arcadeLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        robot: { x: 8, y: 4, w: 3, h: 3, lift: 1.375 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !arcadeLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = arcadeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'lab') {
      const labLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'lab-posters': { x: 1, y: 1, w: 4, h: 1, lift: 0.8 },
        'lab-whiteboard': { x: 6, y: 1, w: 5, h: 1, lift: 0.8 },
        'lab-bench': { x: 4, y: 7, w: 5, h: 2, lift: 0.1 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !labLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = labLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (this.currentScene === 'dev') {
      const devLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        timeline: { x: 4, y: 1, w: 7, h: 1, lift: 0.8 },
        radar: { x: 1, y: 3, w: 2, h: 2, lift: 0.1 },
        telemetry: { x: 12, y: 3, w: 2, h: 3, lift: -0.3 },
        snorlax: { x: 6, y: 13, w: 3, h: 2, lift: -1.45 },
        lebronette: { x: 6, y: 13, w: 3, h: 2, lift: -1.45 },
        coffee: { x: 13, y: 14, w: 1, h: 1, lift: 0.7 },
        rack: { x: 13, y: 11, w: 1, h: 2, lift: 0.6 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !devLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = devLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
        const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    const ALIAS_MAP: Record<string, string[]> = {
      depop: ['shop'],
      shop: ['depop'],
      berry: ['garden'],
      garden: ['berry'],
      neighbour: ['villa'],
      villa: ['neighbour'],
      lookout: ['telescope', 'sign_lookout'],
      hobby: ['gazebo', 'sign_hobby'],
      ranger: ['ranger', 'camp'],
      contest: ['contest', 'podium'],
      kiosk: ['cafe', 'bar'],
    };

    const STATIC_LABELS = new Set(['linkedin', 'resume', 'github', 'email']);
    const POKEMON_LABEL_IDS = new Set([
      'charizard',
      'lebron',
      'reshiram',
      'zekrom',
      'giratina',
      'palkia',
      'dialga',
      'rayquaza',
      'groudon',
      'kyogre',
      'latios',
      'latias',
      'darkrai',
      'necrozma',
      'necrozma_dusk_mane',
      'lunala',
      'solgaleo',
      'samurott',
      'arceus',
      'ranger',
      'tyranitar',
      'gyarados',
      'garchomp',
      'urshifu',
      'urshifu_gmax',
      'blastoise',
      'ace',
      'mewtwo',
      'twin',
    ]);

    const labelDefs: Record<string, { x: number; y: number; w: number; h: number; kind: string; lift?: number }> = {
      dev: { x: 10, y: 1, w: 12, h: 11, kind: 'building', lift: 0.1 },
      lab: { x: 24, y: 3, w: 7, h: 6, kind: 'building', lift: 0.1 },
      villa: { x: 25, y: 20, w: 6, h: 5, kind: 'building', lift: 0.1 },
      neighbour: { x: 25, y: 20, w: 6, h: 5, kind: 'building', lift: 0.1 },
      home: { x: 11, y: 20, w: 10, h: 7, kind: 'building', lift: 0.5 },
      reception: { x: 12, y: 29, w: 7, h: 6, kind: 'building', lift: 0.05 },
      office: { x: 3, y: 46, w: 6, h: 8, kind: 'building', lift: 0.1 },
      arcade: { x: 25, y: 36, w: 8, h: 7, kind: 'building', lift: 0.1 },
      shop: { x: 12, y: 37, w: 6, h: 6, kind: 'building', lift: 0.08 },
      depop: { x: 12, y: 37, w: 6, h: 6, kind: 'building', lift: 0.08 },
      fountain: { x: 27, y: 29, w: 4, h: 4, kind: 'fountain', lift: 0.2 },
      statue: { x: 16, y: 16, w: 1, h: 1, kind: 'statue', lift: 0.1 },
      twin: { x: 25, y: 26, w: 1, h: 1, kind: 'npc', lift: 0.35 },
      kiosk: { x: 26, y: 47, w: 5, h: 4, kind: 'board', lift: 0.15 },
      linkedin: { x: 34.5, y: 49, w: 1, h: 1, kind: 'board', lift: 0.1 },
      resume: { x: 41.5, y: 49, w: 1, h: 1, kind: 'resume', lift: 0.1 },
      github: { x: 34.5, y: 53.5, w: 1, h: 1, kind: 'signpost', lift: 0.1 },
      email: { x: 41.5, y: 53.5, w: 1, h: 1, kind: 'mailbox', lift: 0.1 },
      lookout: { x: 37, y: 3, w: 2, h: 2, kind: 'statue', lift: 0.1 },
      arena: { x: 24, y: 17, w: 10, h: 9, kind: 'statue', lift: 0.1 },
      berry: { x: 36, y: 17, w: 7, h: 9, kind: 'statue', lift: 0.1 },
      contest: { x: 36, y: 28, w: 7, h: 8, kind: 'statue', lift: 0.1 },
      hobby: { x: 6, y: 32, w: 3, h: 3, kind: 'board', lift: 0.25 },
    };

    const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
    buttons.forEach((btn) => {
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (POKEMON_LABEL_IDS.has(id)) {
        btn.style.visibility = 'hidden';
        btn.style.display = 'none';
        return;
      }
      if (!labelDefs[id]) return;

      const obj = { ...labelDefs[id] };

      // 1. Resolve dynamic building config (with alias fallback)
      let bConfig = townConfig.getBuilding(id);
      if (!bConfig && ALIAS_MAP[id]) {
        for (const alias of ALIAS_MAP[id]) {
          bConfig = townConfig.getBuilding(alias);
          if (bConfig) break;
        }
      }

      // If this is a managed town object and it has been deleted or hidden, hide its DOM tag
      if (!STATIC_LABELS.has(id)) {
        if (!bConfig || bConfig.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
      }

      // Special check for Ace Trainer when tied to Arena
      if (id === 'ace') {
        const arenaCfg = townConfig.getBuilding('arena');
        if (bConfig && bConfig.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
        if (arenaCfg && arenaCfg.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
      }

      btn.style.display = '';

      // 2. Compute dynamic world coordinates (centered horizontally and anchored above roof)
      let worldX: number;
      let worldY: number;

      const hasCustomPin =
        bConfig &&
        bConfig.labelX !== undefined &&
        bConfig.labelY !== undefined &&
        (bConfig.w <= 1 || Math.abs(bConfig.labelX - bConfig.x) > 0.1);

      if (hasCustomPin && bConfig) {
        worldX = bConfig.labelX! * TILE_SIZE;
        worldY = (bConfig.labelY! - (obj.lift ?? 0)) * TILE_SIZE;
      } else if (bConfig) {
        worldX = (bConfig.x + bConfig.w / 2) * TILE_SIZE;
        worldY = (bConfig.y - (obj.lift ?? 0)) * TILE_SIZE;
      } else {
        worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;
      }

      const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
      const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

      const cssX = canvasX / dpr;
      let cssY = canvasY / dpr;

      if (obj.kind === 'npc') {
        cssY -= 12;
      } else if (obj.kind === 'statue') {
        cssY -= 4;
      } else {
        cssY -= 2;
      }

      // Clamping to ensure top-edge badges (e.g. Dev Center) are never cut off by viewport
      if (cssY < 24) cssY = 24;

      const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
      btn.style.left = `${Math.round(cssX)}px`;
      btn.style.top = `${Math.round(cssY)}px`;
      btn.style.transform = '';
      btn.style.visibility = visible ? 'visible' : 'hidden';
    });

    // Update Floating Transform Action Bubble position in editor mode
    const transformBubble = document.getElementById('town-transform-bubble');
    if (transformBubble) {
      if (
        this.currentScene === 'town' &&
        this.editor &&
        this.editor.isEnabled() &&
        !this.editor.isPlaytesting()
      ) {
        const selected = this.editor.getSelectedBuilding();
        if (selected) {
          const worldX = (selected.x + selected.w / 2) * TILE_SIZE;
          const worldY = selected.y * TILE_SIZE;
          const pt = this.worldToScreen(worldX, worldY);
          const rect = this.canvas.getBoundingClientRect();
          const isTopClipped = pt.y < 85;
          const topPos = isTopClipped
            ? pt.y + (selected.h * TILE_SIZE * this.zoom) / dpr + 32
            : pt.y - 14;
          transformBubble.style.left = `${Math.round(
            Math.max(120, Math.min(rect.width - 120, pt.x))
          )}px`;
          transformBubble.style.top = `${Math.round(topPos)}px`;
          transformBubble.style.display = 'block';
          transformBubble.classList.remove('hidden');

          const titleEl = document.getElementById('transform-bubble-title');
          const badgeEl = document.getElementById(
            'transform-bubble-orient-badge'
          );
          if (titleEl) titleEl.textContent = selected.name;
          if (badgeEl) {
            const orient = selected.orientation || 'N';
            const orientLabels: Record<'N' | 'E' | 'S' | 'W', string> = {
              W: '⬅️ Hadap Kiri',
              E: '➡️ Hadap Kanan',
              S: '⬇️ Hadap Depan',
              N: '⬆️ Hadap Belakang',
            };
            badgeEl.textContent = orientLabels[orient] || orient;
          }
        } else {
          transformBubble.style.display = 'none';
          transformBubble.classList.add('hidden');
        }
      } else {
        transformBubble.style.display = 'none';
        transformBubble.classList.add('hidden');
      }
    }
  }

  private render() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    if (this.currentScene === 'home') {
      const is2F = this.homeFloor === '2F';
      const cols = is2F ? HOME2F_COLS : HOME_COLS;
      const rows = is2F ? HOME2F_ROWS : HOME_ROWS;
      this.cameraX = (cols * TILE_SIZE) / 2;
      this.cameraY = (rows * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Dark burgundy interior background
      ctx.fillStyle = '#1d1414';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (is2F) {
        // 1. Home 2F parquet wood floor & red rug
        renderHome2FFloor(ctx);

        // 2. Home 2F walls, Indonesian flag, clock, window, stairwell
        renderHome2FWalls(ctx, this.tick);

        // 3. Home 2F furniture (Fridge, TV, Couch, Twin, Desk, Swivel chair, Plants)
        renderHome2FProps(ctx, this.tick);
      } else {
        // 1. Parquet wood floor
        renderHomeFloor(ctx);

        // 2. Burgundy slatted walls & CRATE & CLOSET neon sign
        renderHomeWalls(ctx, this.tick);

        // 3. Room props (Jukebox, closet, crates, decks, mirror, counter, plant, motorbike, exit mat)
        renderHomeProps(ctx, this.tick);
      }

      // 4. Click marker
      this.renderPathAndMarker(ctx);

      // 5. Player character inside the room
      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'dev') {
      this.cameraX = (DEV_COLS * TILE_SIZE) / 2;
      this.cameraY = (DEV_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Dark slate background
      ctx.fillStyle = '#070a14';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      // 1. Static pre-rendered background canvas
      if (!this.devBackgroundCanvas) {
        this.devBackgroundCanvas = createDevBackgroundCanvas();
      }
      ctx.drawImage(this.devBackgroundCanvas, 0, 0);

      // 2. Dynamic live instrumentation (viewscreen ticker, sweeping radar, telemetry, rack lights, clock, lebronette)
      renderDevAnimations(ctx, performance.now());

      // 3. Click marker & path preview
      this.renderPathAndMarker(ctx);

      // 4. Player character
      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'tower') {
      this.cameraX = (TOWER_COLS * TILE_SIZE) / 2;
      this.cameraY = (TOWER_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (!this.towerBackgroundCanvas) {
        this.towerBackgroundCanvas = createTowerBackgroundCanvas();
      }
      ctx.drawImage(this.towerBackgroundCanvas, 0, 0);

      renderTowerAnimations(ctx, this.tick, this.activeTowerFloor);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'mart') {
      this.cameraX = (MART_COLS * TILE_SIZE) / 2;
      this.cameraY = (MART_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#0a1128';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (!this.martBackgroundCanvas) {
        this.martBackgroundCanvas = createMartBackgroundCanvas();
      }
      ctx.drawImage(this.martBackgroundCanvas, 0, 0);

      renderMartAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'cafe') {
      this.cameraX = (CAFE_COLS * TILE_SIZE) / 2;
      this.cameraY = (CAFE_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#140c08';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

      if (this.cameraShakeTime > 0) {
        const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      if (!this.cafeBackgroundCanvas) {
        this.cafeBackgroundCanvas = createCafeBackgroundCanvas();
      }
      ctx.drawImage(this.cafeBackgroundCanvas, 0, 0);

      renderCafeAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * this.moveProgress * 0 +
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'arena') {
      this.cameraX = (ARENA_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARENA_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#271609';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

      if (this.cameraShakeTime > 0) {
        const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      if (!this.arenaBackgroundCanvas) {
        this.arenaBackgroundCanvas = createArenaBackgroundCanvas();
      }
      ctx.drawImage(this.arenaBackgroundCanvas, 0, 0);

      renderArenaAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'garden') {
      this.cameraX = (GARDEN_COLS * TILE_SIZE) / 2;
      this.cameraY = (GARDEN_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#0e2414';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

      if (this.cameraShakeTime > 0) {
        const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      if (!this.gardenBackgroundCanvas) {
        this.gardenBackgroundCanvas = createGardenBackgroundCanvas();
      }
      ctx.drawImage(this.gardenBackgroundCanvas, 0, 0);

      renderGardenAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'neighbour') {
      this.cameraX = (NEIGHBOUR_COLS * TILE_SIZE) / 2;
      this.cameraY = (NEIGHBOUR_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Warm honey-oak hearthwood cottage tone
      ctx.fillStyle = '#26170e';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

      if (this.cameraShakeTime > 0) {
        const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      if (!this.neighbourBackgroundCanvas) {
        this.neighbourBackgroundCanvas = createNeighbourBackgroundCanvas();
      }
      ctx.drawImage(this.neighbourBackgroundCanvas, 0, 0);

      renderNeighbourAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'reception') {
      this.cameraX = (RECEPTION_COLS * TILE_SIZE) / 2;
      this.cameraY = (RECEPTION_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (!this.receptionBackgroundCanvas) {
        this.receptionBackgroundCanvas = createReceptionBackgroundCanvas();
      }
      ctx.drawImage(this.receptionBackgroundCanvas, 0, 0);

      renderReceptionAnimations(ctx, this.tick);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'arcade') {
      this.cameraX = (ARCADE_COLS * TILE_SIZE) / 2;
      this.cameraY = (ARCADE_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#151026';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (!this.arcadeBackgroundCanvas) {
        this.arcadeBackgroundCanvas = createArcadeBackgroundCanvas();
      }
      ctx.drawImage(this.arcadeBackgroundCanvas, 0, 0);

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    if (this.currentScene === 'lab') {
      this.cameraX = (LAB_COLS * TILE_SIZE) / 2;
      this.cameraY = (LAB_ROWS * TILE_SIZE) / 2;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = '#06110f';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

      if (!this.labBackgroundCanvas) {
        this.labBackgroundCanvas = createLabBackgroundCanvas();
      }
      ctx.drawImage(this.labBackgroundCanvas, 0, 0);

      renderLabAnimations(ctx, performance.now());

      this.renderPathAndMarker(ctx);

      const drawX =
        (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
      const drawY =
        (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
      const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

      ctx.restore();

      this.updateDomLabels();
      return;
    }

    // Smooth camera following player with map boundary clamps
    const targetCamX =
      (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress + 0.5) * TILE_SIZE;
    const targetCamY =
      (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress + 0.5) * TILE_SIZE;

    const viewW = this.canvas.width / this.zoom;
    const viewH = this.canvas.height / this.zoom;
    const mapPixelW = this.map.w * TILE_SIZE;
    const mapPixelH = this.map.h * TILE_SIZE;

    // Horizontal camera positioning & boundary clamping
    if (mapPixelW <= viewW) {
      this.cameraX = mapPixelW / 2;
    } else if (this.currentScene === 'town' && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
      this.cameraX = Math.max(viewW / 2, Math.min(mapPixelW - viewW / 2, this.cameraX));
    } else {
      this.cameraX = Math.max(viewW / 2, Math.min(mapPixelW - viewW / 2, targetCamX));
    }

    // Vertical camera positioning & boundary clamping
    if (mapPixelH <= viewH) {
      this.cameraY = mapPixelH / 2;
    } else if (this.currentScene === 'town' && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
      this.cameraY = Math.max(viewH / 2, Math.min(mapPixelH - viewH / 2, this.cameraY));
    } else {
      this.cameraY = Math.max(viewH / 2, Math.min(mapPixelH - viewH / 2, targetCamY));
    }

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dark forest surround background
    ctx.fillStyle = '#162e1d';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply zoom & center camera
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.cameraX, -this.cameraY);

    if (this.cameraShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Procedural 2D Pixel-Art Background Canvas (Handcrafted Pokémon Gen 4/5 style)
    if (!this.townBackgroundCanvas) {
      this.townBackgroundCanvas = createTownBackgroundCanvas(this.map);
    }
    ctx.drawImage(this.townBackgroundCanvas, 0, 0);

    // 2. Sparkling animated water reflection on the fountain pool & courtyard basin
    const fountain = townConfig.getBuilding('fountain') || { x: 27, y: 29 };
    const basin = townConfig.getBuilding('basin') || { x: 15, y: 15 };
    const shimmer = Math.sin(this.tick * 0.08);
    ctx.fillStyle = `rgba(180, 240, 255, ${0.28 + shimmer * 0.16})`;
    ctx.beginPath();
    ctx.arc((fountain.x + 2) * TILE_SIZE, (fountain.y + 2) * TILE_SIZE, 1.7 * TILE_SIZE, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc((basin.x + 1) * TILE_SIZE, (basin.y + 1) * TILE_SIZE, 0.7 * TILE_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dynamic animated water wave foam on the ocean coast (left side)
    const oceanShimmer = Math.sin(this.tick * 0.05);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + oceanShimmer * 0.08})`;
    for (let oy = 4; oy < 32; oy += 3) {
      const ox = 2 + ((oy * 7 + Math.floor(this.tick / 18)) % 5);
      ctx.fillRect(ox * TILE_SIZE, oy * TILE_SIZE, 14, 2);
    }

    // 4. Warm street lamp lighting pools on the ground (Dynamic from townConfig)
    renderLighting(ctx, this.getActiveLamps());

    // 7. Click target pulse marker & pathfinding breadcrumbs
    this.renderPathAndMarker(ctx);

    // 8. NPCs (Reading dynamic positions from townConfig)
    for (const npc of this.map.npcs) {
      const cfg = townConfig.getBuilding(npc.id);
      if (cfg?.hidden) continue;
      const arenaCfg = townConfig.getBuilding('arena');
      const curTileX = cfg ? cfg.x : (npc.id === 'ace' && arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : npc.x);
      const curTileY = cfg ? cfg.y : (npc.id === 'ace' && arenaCfg ? arenaCfg.y + 1 : npc.y);

      if (npc.id === 'twin') {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(curTileX * TILE_SIZE + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(curTileX * TILE_SIZE + 8), 0);
        }
        drawLucario(ctx, curTileX * TILE_SIZE, curTileY * TILE_SIZE, this.tick, 1);
        if (isFlipped) ctx.restore();
      } else if (npc.id === 'charizard' || npc.id === 'lebron' || (npc as any).subType === 'charizard') {
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const breath = Math.sin(this.tick * 0.05) * 0.8;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(20, 25, 30, 0.35)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 15, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }

        // Fire Dragon tail flame ember glow & heat radiance
        const flamePulse = 0.45 + Math.sin(this.tick * 0.15) * 0.2;
        const flameX = drawX + 5;
        const flameY = drawY - 11 + breath;

        const flameGrad = ctx.createRadialGradient(flameX, flameY, 1, flameX, flameY, 8);
        flameGrad.addColorStop(0, `rgba(255, 245, 150, ${flamePulse + 0.3})`);
        flameGrad.addColorStop(0.4, `rgba(249, 115, 22, ${flamePulse})`);
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Fiery ember sparks rising into the air
        if (this.tick % 16 < 10) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(flameX + Math.sin(this.tick * 0.3) * 3, flameY - 2 - (this.tick % 8), 1.5, 1.5);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(flameX - 1 + Math.cos(this.tick * 0.25) * 4, flameY - 1 - (this.tick % 6), 1.5, 1.5);
        }

        // Authentic Pokémon Black & White Charizard Sprite
        if (this.charizardImg && this.charizardImg.complete && this.charizardImg.naturalWidth > 0) {
          ctx.drawImage(this.charizardImg, drawX - 13, drawY - 20 + breath, 42, 42);
        }

        if (isFlipped) ctx.restore();
      } else if (npc.id === 'dialga' || (npc as any).subType === 'dialga') {
        // Authentic Dialga Temporal Steel/Dragon Overworld Sprite with Roar of Time Diamond Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 1.5;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Diamond Chest Core Temporal Energy Glow (pulsing cyan / cobalt / diamond blue)
        const corePulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const coreX = drawX + 8;
        const coreY = drawY - 2 + levitate;
        const coreGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
        coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
        coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Roar of Time temporal distortion pulse ring (concentric expanding wave)
        const timePhase = (this.tick * 0.045) % 1;
        const ringRadius = 5 + timePhase * 16;
        const ringAlpha = (1 - timePhase) * 0.65;
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(coreX, coreY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Diamond time-sparkles floating around Dialga
        if (this.tick % 24 < 14) {
          ctx.fillStyle = '#f0f9ff';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, coreY - 4 - (this.tick % 14), 1.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.16) * 10, coreY + 4 - (this.tick % 10), 2, 2);
        }

        // Draw PMD Animated Dialga
        const dir = (cfg?.orientation === 'E' || cfg?.orientation === 'SE' || cfg?.orientation === 'NE') ? 'E' : (cfg?.orientation || 'W');
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'dialga',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD not yet loaded
        if (!pmdDrawn && this.dialgaImg && this.dialgaImg.complete && this.dialgaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.dialgaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'palkia' || (npc as any).subType === 'palkia') {
        // Authentic Palkia Spatial Dragon/Water Overworld Sprite with Spacial Rend Pearl Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 1.6;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(25, 20, 35, 0.4)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dimensional Spatial Pearl Glow (rippling pink/magenta spacetime wave)
        const spatialPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const pearlX = drawX + 8;
        const pearlY = drawY - 2 + levitate;
        const spatGrad = ctx.createRadialGradient(pearlX, pearlY, 3, pearlX, pearlY, 18);
        spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
        spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
        spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
        ctx.fillStyle = spatGrad;
        ctx.beginPath();
        ctx.arc(pearlX, pearlY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Spacial Rend dimensional space-warp slice lines
        const rendAngle = this.tick * 0.03;
        for (let r = 0; r < 2; r++) {
          const angle = rendAngle + (r * Math.PI) / 2;
          const rx1 = pearlX + Math.cos(angle) * 14;
          const ry1 = pearlY + Math.sin(angle) * 8;
          const rx2 = pearlX - Math.cos(angle) * 14;
          const ry2 = pearlY - Math.sin(angle) * 8;
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx1, ry1);
          ctx.lineTo(rx2, ry2);
          ctx.stroke();
        }

        // Pearlescent sparkles
        if (this.tick % 24 < 14) {
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(pearlX + Math.sin(this.tick * 0.2) * 12, pearlY - 4 - (this.tick % 14), 1.5, 1.5);
          ctx.fillStyle = '#e879f9';
          ctx.fillRect(pearlX - 6 + Math.cos(this.tick * 0.16) * 10, pearlY + 4 - (this.tick % 10), 2, 2);
        }

        // Draw PMD Animated Palkia
        const dir = (cfg?.orientation === 'E' || cfg?.orientation === 'SE' || cfg?.orientation === 'NE') ? 'E' : (cfg?.orientation || 'W');
        const coreX = drawX + 8;
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'palkia',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD not yet loaded
        if (!pmdDrawn && this.palkiaImg && this.palkiaImg.complete && this.palkiaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.palkiaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'giratina' || (npc as any).subType === 'giratina') {
        // Authentic Giratina Altered Forme Overworld Sprite with Distortion World Antimatter Portal
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 1.8;

        // Distortion World Antimatter Ground Portal (swirling dark rift)
        const portalPulse = 0.45 + Math.sin(this.tick * 0.07) * 0.15;
        const portalX = drawX + 8;
        const portalY = drawY + 16;
        const portGrad = ctx.createRadialGradient(portalX, portalY, 3, portalX, portalY, 16);
        portGrad.addColorStop(0, `rgba(88, 28, 135, ${portalPulse + 0.3})`);
        portGrad.addColorStop(0.5, `rgba(24, 24, 27, ${portalPulse})`);
        portGrad.addColorStop(1, 'rgba(24, 24, 27, 0)');
        ctx.fillStyle = portGrad;
        ctx.beginPath();
        ctx.ellipse(portalX, portalY, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Swirling antimatter rift orbit ring
        ctx.strokeStyle = `rgba(220, 38, 38, ${portalPulse * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(portalX, portalY, 13 + Math.sin(this.tick * 0.08) * 2, 4.5, this.tick * 0.02, 0, Math.PI * 2);
        ctx.stroke();

        // Floating ghost / dark antimatter wisps
        if (this.tick % 22 < 14) {
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(portalX + Math.sin(this.tick * 0.2) * 10, portalY - 6 - (this.tick % 16), 1.5, 1.5);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(portalX - 4 + Math.cos(this.tick * 0.18) * 12, portalY - 4 - (this.tick % 14), 2, 2);
          ctx.fillStyle = '#f87171';
          ctx.fillRect(portalX + 4 - Math.sin(this.tick * 0.15) * 8, portalY - 8 - (this.tick % 12), 1.5, 1.5);
        }

        // Draw PMD Animated Giratina
        const dir = (cfg?.orientation === 'E' || cfg?.orientation === 'SE' || cfg?.orientation === 'NE') ? 'E' : 'W';
        const coreX = drawX + 8;
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'giratina',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD not yet loaded
        if (!pmdDrawn && this.giratinaImg && this.giratinaImg.complete && this.giratinaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.giratinaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'zekrom' || (npc as any).subType === 'zekrom') {
        // Authentic Zekrom (Deep Black Pokémon) PMD Animated Sprite with Lightning Generator Turbine
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.035) * 1.5;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(10, 15, 25, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Electric Lightning Turbine Glow behind tail (Fusion Bolt)
        const turbineGlow = 0.35 + Math.sin(this.tick * 0.09) * 0.15;
        const tailX = drawX - 3;
        const tailY = drawY + 8 + levitate;
        const elecGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 15);
        elecGrad.addColorStop(0, `rgba(56, 189, 248, ${turbineGlow + 0.3})`);
        elecGrad.addColorStop(0.5, `rgba(2, 132, 199, ${turbineGlow})`);
        elecGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = elecGrad;
        ctx.beginPath();
        ctx.arc(tailX, tailY, 15, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic blue/cyan lightning discharges surging from the tail
        const sparkPhase = Math.floor(this.tick / 3) % 4;
        if (this.tick % 20 < 14) {
          ctx.fillStyle = sparkPhase % 2 === 0 ? '#38bdf8' : '#e0f2fe';
          ctx.fillRect(tailX + Math.sin(this.tick * 0.25) * 8, tailY - 5 - (this.tick % 14), 2, 2);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(tailX - 3 + Math.cos(this.tick * 0.2) * 9, tailY - 2 - (this.tick % 10), 1.5, 1.5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(tailX + 3 - Math.sin(this.tick * 0.15) * 8, tailY - 7 - (this.tick % 12), 1.5, 1.5);
        }

        // Draw PMD Animated Zekrom
        const dir = (cfg?.orientation === 'E' || cfg?.orientation === 'SE' || cfg?.orientation === 'NE') ? 'E' : 'W';
        const coreX = drawX + 8;
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'zekrom',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD not yet loaded
        if (!pmdDrawn && this.zekromImg && this.zekromImg.complete && this.zekromImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.zekromImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'reshiram' || (npc as any).subType === 'reshiram') {
        // Authentic Reshiram (Vast White Pokémon) PMD Animated Sprite with Jet Turbine Fusion Flare
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const coreX = drawX + 8;
        const coreY = drawY + 16;
        const levitate = Math.sin(this.tick * 0.035) * 1.5;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(20, 25, 35, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fiery Jet Turbine Glow behind tail (Fusion Flare)
        const turbineGlow = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const tailX = drawX - 3;
        const tailY = drawY + 8 + levitate;
        const fireGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 14);
        fireGrad.addColorStop(0, `rgba(255, 165, 0, ${turbineGlow + 0.25})`);
        fireGrad.addColorStop(0.5, `rgba(239, 68, 68, ${turbineGlow})`);
        fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(tailX, tailY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Fiery ember particles rising from tail turbine
        if (this.tick % 24 < 16) {
          ctx.fillStyle = '#ffedd5';
          ctx.fillRect(tailX + Math.sin(this.tick * 0.2) * 6, tailY - 4 - (this.tick % 16), 1.5, 1.5);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(tailX - 2 + Math.cos(this.tick * 0.15) * 8, tailY - 2 - (this.tick % 12), 2, 2);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(tailX + 2 - Math.sin(this.tick * 0.1) * 7, tailY - 6 - (this.tick % 14), 1.5, 1.5);
        }

        // Draw PMD Animated Reshiram
        const dir = cfg?.orientation || npc.dir || 'W';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'reshiram',
          'idle',
          dir,
          coreX,
          coreY,
          this.tick
        );

        // Fallback to static sprite if PMD image not loaded yet
        if (!pmdDrawn && this.reshiramImg && this.reshiramImg.complete && this.reshiramImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.reshiramImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'arceus' || (npc as any).subType === 'arceus') {
        // Divine Arceus Overworld Sprite with Golden Judgment Ring
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 2;

        // Ground shadow
        ctx.fillStyle = 'rgba(20, 25, 30, 0.4)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Celestial Golden Halo Rings (Judgment Wheel Ring)
        const haloR = 14 + Math.sin(this.tick * 0.05) * 2;
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX + 8, drawY - 4 + levitate, haloR, 0, Math.PI * 2);
        ctx.stroke();

        // Cross rays of the Wheel of Origin
        const angle = this.tick * 0.015;
        for (let a = 0; a < 4; a++) {
          const rayAngle = angle + (a * Math.PI) / 2;
          const rx1 = drawX + 8 + Math.cos(rayAngle) * (haloR - 4);
          const ry1 = drawY - 4 + levitate + Math.sin(rayAngle) * (haloR - 4);
          const rx2 = drawX + 8 + Math.cos(rayAngle) * (haloR + 4);
          const ry2 = drawY - 4 + levitate + Math.sin(rayAngle) * (haloR + 4);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx1, ry1);
          ctx.lineTo(rx2, ry2);
          ctx.stroke();
        }

        // Divine golden stardust sparkles
        if (this.tick % 30 < 15) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(drawX + 8 + Math.cos(this.tick * 0.1) * 16, drawY - 4 + levitate + Math.sin(this.tick * 0.1) * 16, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(drawX + 8 - Math.sin(this.tick * 0.12) * 14, drawY - 4 + levitate - Math.cos(this.tick * 0.12) * 14, 1.5, 1.5);
        }

        // Draw PMD Animated Arceus
        const dir = cfg?.orientation || npc.dir || 'W';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'arceus',
          'idle',
          dir,
          drawX + 8,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD image not loaded yet
        if (!pmdDrawn && this.arceusImg && this.arceusImg.complete && this.arceusImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.arceusImg, drawX - 12, drawY - 18 + levitate, 40, 40);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'ranger' || npc.id === 'blastoise' || npc.id === 'tyranitar' || (npc as any).subType === 'tyranitar') {
        // Authentic Tyranitar Rock/Dark Armor Pokémon Overworld Sprite with Sand Stream Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const stomp = Math.sin(this.tick * 0.04) * 0.8;

        // Ground shadow beneath heavy armor body
        ctx.fillStyle = 'rgba(25, 20, 15, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }

        // Sand Stream & Earth particles swirling around Tyranitar
        if (this.tick % 18 < 12) {
          const sandAngle = (this.tick * 0.08) % (Math.PI * 2);
          const sandRadius = 11 + Math.sin(this.tick * 0.1) * 3;
          const sandX = drawX + 8 + Math.cos(sandAngle) * sandRadius;
          const sandY = drawY + 11 + Math.sin(sandAngle) * 3 + stomp;
          ctx.fillStyle = '#d4b182'; // Desert sand grain
          ctx.fillRect(sandX, sandY, 1.5, 1.5);

          // Rocky dark armor dust
          if (this.tick % 24 < 8) {
            ctx.fillStyle = '#4b5563';
            ctx.fillRect(drawX + 4 + Math.sin(this.tick * 0.2) * 8, drawY + 12 - (this.tick % 8), 1.5, 1.5);
          }
        }

        // Draw Tyranitar 8-direction PMD animated sprite (with fallback)
        const dir = (cfg?.orientation || 'W').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'tyranitar',
          'idle',
          pmdDir,
          drawX + 8,
          drawY + 16,
          this.tick
        );

        if (!pmdDrawn) {
          const img = this.tyranitarImg || this.blastoiseImg;
          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, drawX - 13, drawY - 20 + stomp, 42, 42);
          }
        }
        if (isFlipped) ctx.restore();
      } else if (npc.id === 'garchomp' || (npc as any).subType === 'garchomp') {
        // Authentic Garchomp Dragon/Ground Mach Pokémon Overworld Sprite
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const coreX = drawX + 8;
        const machBob = Math.sin(this.tick * 0.05) * 0.9;

        // Ground contact shadow
        ctx.fillStyle = 'rgba(20, 20, 30, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 13, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dragon Claw & Supersonic Mach Slipstream particles
        if (this.tick % 16 < 11) {
          ctx.fillStyle = '#38bdf8'; // Sky blue dragon aura
          ctx.fillRect(coreX + Math.cos(this.tick * 0.15) * 12, drawY + 6 - (this.tick % 10) + machBob, 2, 1);
          ctx.fillStyle = '#fde047'; // Sand dune speed spark
          ctx.fillRect(coreX - 5 + Math.sin(this.tick * 0.2) * 10, drawY + 14 - (this.tick % 8), 1.5, 1.5);
          ctx.fillStyle = '#f43f5e'; // Crimson star chest spark
          ctx.fillRect(coreX + Math.cos(this.tick * 0.25) * 8, drawY - 2 + machBob, 1.5, 1.5);
        }

        // Draw Garchomp 8-direction PMD animated sprite (with fallback)
        const dir = (cfg?.orientation || 'W').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'garchomp',
          'idle',
          pmdDir,
          coreX,
          drawY + 16,
          this.tick
        );

        if (!pmdDrawn && this.garchompImg && this.garchompImg.complete && this.garchompImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.garchompImg, drawX - 13, drawY - 20 + machBob, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'urshifu' || (npc as any).subType === 'urshifu' || (npc as any).subType === 'urshifu_gmax') {
        // Authentic Urshifu Gigantamax Rapid Strike Overworld Sprite with G-Max Torrent Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const stanceBob = Math.sin(this.tick * 0.04) * 0.8;

        // Ground shadow beneath colossal Gigantamax stance
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 16, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }

        // Gigantamax Crimson Dynamax clouds & Rapid Strike water torrent swirls
        const dynPhase = (this.tick * 0.05) % (Math.PI * 2);
        const cloudX = drawX + 8 + Math.cos(dynPhase) * 14;
        const cloudY = drawY - 14 + Math.sin(dynPhase) * 4;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.75)'; // G-Max red
        ctx.fillRect(cloudX, cloudY, 2.5, 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
        ctx.fillRect(cloudX - 2, cloudY + 1, 2, 1.5);

        if (this.tick % 16 < 11) {
          ctx.fillStyle = '#38bdf8'; // Rapid Strike hydro blue
          ctx.fillRect(drawX + 8 + Math.sin(this.tick * 0.1) * 13, drawY + 8 + Math.cos(this.tick * 0.1) * 4, 2, 2);
          ctx.fillStyle = '#bae6fd'; // Water mist splash
          ctx.fillRect(drawX + 4 + Math.cos(this.tick * 0.15) * 10, drawY + 12 - (this.tick % 8), 1.5, 1.5);
        }

        // Authentic Pokémon Urshifu Gigantamax Rapid Strike Sprite
        if (this.urshifuImg && this.urshifuImg.complete && this.urshifuImg.naturalWidth > 0) {
          ctx.drawImage(this.urshifuImg, drawX - 16, drawY - 24 + stanceBob, 48, 45);
        }
        if (isFlipped) ctx.restore();
      } else if (npc.id === 'ace' || npc.id === 'mewtwo' || (npc as any).subType === 'mewtwo') {
        // Authentic Mewtwo Pokémon Overworld Sprite with Psychic Aura & Telekinesis
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.045) * 2.2;

        // Ground shadow (subtly pulses with levitation height)
        const shadowScale = 1 - Math.sin(this.tick * 0.045) * 0.15;
        ctx.fillStyle = 'rgba(25, 15, 35, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 12 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing Psystrike / Psychic Aura Rings
        const auraR = 14 + Math.sin(this.tick * 0.06) * 2;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX + 8, drawY - 2 + levitate, auraR, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting telekinetic psychic energy orbs
        for (let i = 0; i < 3; i++) {
          const orbAngle = this.tick * 0.04 + (i * Math.PI * 2) / 3;
          const ox = drawX + 8 + Math.cos(orbAngle) * (auraR - 2);
          const oy = drawY - 2 + levitate + Math.sin(orbAngle) * (auraR - 4) * 0.5;
          ctx.fillStyle = '#e9d5ff';
          ctx.beginPath();
          ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ambient psychic sparkles
        if (this.tick % 24 < 12) {
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(drawX + 8 + Math.cos(this.tick * 0.1) * 14, drawY - 4 + levitate + Math.sin(this.tick * 0.1) * 14, 2, 2);
          ctx.fillStyle = '#f3e8ff';
          ctx.fillRect(drawX + 8 - Math.sin(this.tick * 0.15) * 12, drawY - 2 + levitate - Math.cos(this.tick * 0.15) * 12, 1.5, 1.5);
        }

        if (this.mewtwoImg && this.mewtwoImg.complete && this.mewtwoImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.mewtwoImg, drawX - 11, drawY - 16 + levitate, 38, 38);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'rayquaza' || (npc as any).subType === 'rayquaza') {
        // Authentic Rayquaza Sky High Dragon/Flying Overworld Sprite with Ozone Emerald Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 2.0;

        // Ground shadow
        ctx.fillStyle = 'rgba(10, 30, 20, 0.4)';
        ctx.beginPath();
        ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric Ozone Emerald Aura
        const auraPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const coreX = drawX + 8;
        const coreY = drawY - 2 + levitate;
        const spatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
        spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
        spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
        ctx.fillStyle = spatGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Stardust & Delta Stream wind sparkles
        if (this.tick % 24 < 14) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, coreY - 4 - (this.tick % 14), 1.5, 1.5);
          ctx.fillStyle = '#34d399';
          ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.16) * 10, coreY + 4 - (this.tick % 10), 2, 2);
        }

        // Draw PMD Animated Rayquaza
        const dir = cfg?.orientation || npc.dir || 'W';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'rayquaza',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD image not loaded yet
        if (!pmdDrawn && this.rayquazaImg && this.rayquazaImg.complete && this.rayquazaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.rayquazaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'groudon' || (npc as any).subType === 'groudon') {
        // Authentic Groudon Continent Ground Overworld Sprite with Primal Magma & Desolate Land Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const breath = Math.sin(this.tick * 0.04) * 0.8;
        const coreX = drawX + 8;
        const coreY = drawY + 8;

        // Ground shadow beneath heavy continent body
        ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primal Magma / Desolate Land Heat Radiance (ambient pulsing heat wave gradient)
        const magmaPulse = 0.35 + Math.sin(this.tick * 0.07) * 0.15;
        const heatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        heatGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.25})`);
        heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
        heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Volcanic embers & magma sparks rising upward from the scorched earth
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.25) * 14, coreY + 8 - ((this.tick * 1.5) % 18), 1.5, 1.5);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 12, coreY + 10 - ((this.tick * 1.2) % 16), 2, 2);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 10, coreY + 6 - (this.tick % 14), 1.5, 1.5);
        }

        // Draw Groudon 8-direction PMD animated sprite (with fallback)
        const dir = (cfg?.orientation || 'W').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'groudon',
          'idle',
          pmdDir,
          coreX,
          drawY + 16,
          this.tick
        );

        if (!pmdDrawn && this.groudonImg && this.groudonImg.complete && this.groudonImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.groudonImg, drawX - 13, drawY - 20 + breath, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'kyogre' || (npc as any).subType === 'kyogre') {
        // Authentic Kyogre Sea Basin Water Overworld Sprite with Primordial Sea Aqua Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const swimY = Math.sin(this.tick * 0.04) * 1.8;
        const coreX = drawX + 8;
        const coreY = drawY + 2 + swimY;

        // Water ripple shadow
        ctx.fillStyle = 'rgba(7, 43, 79, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 15, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primordial Sea Oceanic Hydro Aura
        const waterPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
        aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
        aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
        aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
        ctx.fillStyle = aquaGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
        ctx.fill();

        // Hydro droplet & bioluminescent mist bubbles
        if (this.tick % 22 < 13) {
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 13, coreY - 4 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.17) * 11, coreY + 4 + Math.sin(this.tick * 0.17) * 7, 2, 2);
          ctx.fillStyle = '#f0f9ff';
          ctx.fillRect(coreX + 5 + Math.sin(this.tick * 0.28) * 9, coreY - 6 - (this.tick % 8), 1.5, 1.5);
        }

        // Draw Kyogre 8-direction PMD animated sprite (with fallback)
        const dir = (cfg?.orientation || 'W').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'kyogre',
          'idle',
          pmdDir,
          coreX,
          drawY + 16,
          this.tick
        );

        if (!pmdDrawn && this.kyogreImg && this.kyogreImg.complete && this.kyogreImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.kyogreImg, drawX - 13, drawY - 20 + swimY, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'latios' || (npc as any).subType === 'latios') {
        // Authentic Latios Eon Dragon/Psychic Overworld Sprite with Jet Stream Azure Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const jetHover = Math.sin(this.tick * 0.055) * 2.2;
        const coreX = drawX + 8;
        const coreY = drawY + 1 + jetHover;

        // Aerodynamic ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 13, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eon Psychic / Jet Stream Azure Radiant Aura
        const jetPulse = 0.35 + Math.sin(this.tick * 0.09) * 0.15;
        const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        auraGrad.addColorStop(0, `rgba(191, 219, 254, ${jetPulse + 0.3})`);
        auraGrad.addColorStop(0.5, `rgba(59, 130, 246, ${jetPulse})`);
        auraGrad.addColorStop(1, 'rgba(29, 78, 216, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Jet stream vapor trails & psychic stardust
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#93c5fd';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.24) * 12, coreY - 4 + Math.cos(this.tick * 0.24) * 8, 1.5, 1.5);
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 10, coreY + 3 + Math.sin(this.tick * 0.18) * 6, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 8, coreY - 5 - (this.tick % 7), 1.5, 1.5);
        }

        // Draw Latios sprite
        if (this.latiosImg && this.latiosImg.complete && this.latiosImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.latiosImg, drawX - 13, drawY - 20 + jetHover, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'latias' || (npc as any).subType === 'latias') {
        // Authentic Latias Eon Dragon/Psychic Overworld Sprite with Crimson Rose Mist Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const floatY = Math.sin(this.tick * 0.055 + 1.2) * 2.2;
        const coreX = drawX + 8;
        const coreY = drawY + 1 + floatY;

        // Aerodynamic ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eon Crimson / Rose Mist Radiant Aura
        const rosePulse = 0.35 + Math.sin(this.tick * 0.09 + 1.0) * 0.15;
        const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        auraGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.3})`);
        auraGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse})`);
        auraGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Light refraction glass crystals & pink stardust
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#fda4af';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.24) * 12, coreY - 4 + Math.cos(this.tick * 0.24) * 8, 1.5, 1.5);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.18) * 10, coreY + 3 + Math.sin(this.tick * 0.18) * 6, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 8, coreY - 5 - (this.tick % 7), 1.5, 1.5);
        }

        // Draw Latias sprite
        if (this.latiasImg && this.latiasImg.complete && this.latiasImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.latiasImg, drawX - 13, drawY - 20 + floatY, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'darkrai' || (npc as any).subType === 'darkrai') {
        // Authentic Darkrai Pitch-Black Dark Overworld Sprite with Dark Void Nightmare Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.04) * 2.0;
        const coreX = drawX + 8;
        const coreY = drawY + 2 + levitate;

        // Shadowy abyss portal pool
        const portalPulse = 0.4 + Math.sin(this.tick * 0.08) * 0.15;
        ctx.fillStyle = `rgba(15, 23, 42, ${portalPulse + 0.2})`;
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 14, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pitch-Black / Nightmare Dark Void Aura
        const voidPulse = 0.35 + Math.sin(this.tick * 0.07) * 0.15;
        const voidGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
        voidGrad.addColorStop(0, `rgba(192, 132, 252, ${voidPulse + 0.25})`);
        voidGrad.addColorStop(0.5, `rgba(88, 28, 135, ${voidPulse})`);
        voidGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = voidGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
        ctx.fill();

        // Shadow mist wisps & nightmare sparks
        if (this.tick % 22 < 14) {
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, coreY + 6 - ((this.tick * 1.3) % 18), 1.5, 1.5);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.16) * 10, coreY + 8 - ((this.tick * 1.1) % 16), 2, 2);
          ctx.fillStyle = '#f3e8ff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 8, coreY - 4 - (this.tick % 10), 1.5, 1.5);
        }

        // Draw Darkrai sprite
        if (this.darkraiImg && this.darkraiImg.complete && this.darkraiImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.darkraiImg, drawX - 13, drawY - 20 + levitate, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'necrozma' || (npc as any).subType === 'necrozma' || npc.id === 'necrozma_dusk_mane') {
        // Authentic Necrozma Dusk Mane Prism Psychic/Steel Overworld Sprite with Solar Flare Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const breath = Math.sin(this.tick * 0.04) * 0.9;
        const coreX = drawX + 8;
        const coreY = drawY + 6;

        // Ground shadow beneath heavy lion paws
        ctx.fillStyle = 'rgba(25, 15, 10, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Radiant Solar Prism Aura
        const solarPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        sunGrad.addColorStop(0, `rgba(254, 240, 138, ${solarPulse + 0.3})`);
        sunGrad.addColorStop(0.4, `rgba(245, 158, 11, ${solarPulse})`);
        sunGrad.addColorStop(0.8, `rgba(79, 70, 229, ${solarPulse * 0.6})`);
        sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Solar flare / prism laser sparkles
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.25) * 14, coreY + 6 - ((this.tick * 1.4) % 18), 1.5, 1.5);
          ctx.fillStyle = '#818cf8';
          ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 12, coreY + 8 - ((this.tick * 1.2) % 16), 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 10, coreY + 4 - (this.tick % 14), 1.5, 1.5);
        }

        // Draw Necrozma Dusk Mane sprite (120x112 scaled to 46x43)
        if (this.necrozmaImg && this.necrozmaImg.complete && this.necrozmaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.necrozmaImg, drawX - 15, drawY - 21 + breath, 46, 43);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'lunala' || (npc as any).subType === 'lunala') {
        // Authentic Lunala Moone Psychic/Ghost Overworld Sprite with Full Moon Starlight Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const levitate = Math.sin(this.tick * 0.045) * 2.2;
        const coreX = drawX + 8;
        const coreY = drawY + 2 + levitate;

        // Crescent lunar ground shadow beneath wingspan
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 17, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Full Moon Cosmic Starlight Radiant Aura
        const moonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const moonGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
        moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
        moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
        moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Lunar dust sparkles & starlight constellation glints
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#c7d2fe';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 14, coreY - 4 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX - 9 + Math.cos(this.tick * 0.16) * 12, coreY + 3 + Math.sin(this.tick * 0.16) * 6, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 5 + Math.sin(this.tick * 0.28) * 10, coreY - 6 - (this.tick % 7), 1.5, 1.5);
        }

        // Draw PMD Animated Lunala
        const dir = (cfg?.orientation === 'E' || cfg?.orientation === 'SE' || cfg?.orientation === 'NE') ? 'E' : (cfg?.orientation || 'W');
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'lunala',
          'idle',
          dir,
          coreX,
          drawY + 16,
          this.tick
        );

        // Fallback to static sprite if PMD not yet loaded
        if (!pmdDrawn && this.lunalaImg && this.lunalaImg.complete && this.lunalaImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.lunalaImg, drawX - 15, drawY - 21 + levitate, 46, 46);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'solgaleo' || (npc as any).subType === 'solgaleo') {
        // Authentic Solgaleo Sunne Psychic/Steel Overworld Sprite with Radiant Sun Solar Corona Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const breath = Math.sin(this.tick * 0.04) * 0.9;
        const coreX = drawX + 8;
        const coreY = drawY + 6;

        // Ground shadow beneath heavy lion paws
        ctx.fillStyle = 'rgba(25, 15, 5, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Radiant Sun Solar Corona Aura (pure radiant gold / amber / white heat)
        const sunPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
        const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
        sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
        sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
        sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Solar flare sparks & prism glints
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 14, coreY + 4 - ((this.tick * 1.3) % 16), 1.5, 1.5);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.17) * 12, coreY + 6 - ((this.tick * 1.1) % 15), 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 10, coreY + 2 - (this.tick % 13), 1.5, 1.5);
        }

        // Draw Solgaleo 8-direction PMD animated sprite (with fallback)
        const dir = (cfg?.orientation || 'S').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = this.pmdAnimator.draw(
          ctx,
          'solgaleo',
          'idle',
          pmdDir,
          coreX,
          drawY + 16,
          this.tick
        );

        if (!pmdDrawn && this.solgaleoImg && this.solgaleoImg.complete && this.solgaleoImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.solgaleoImg, drawX - 15, drawY - 21 + breath, 46, 43);
          if (isFlipped) ctx.restore();
        }
      } else if (npc.id === 'samurott' || (npc as any).subType === 'samurott') {
        // Authentic Samurott Overworld Sprite with Seamitar Hydro Aura
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const breath = Math.sin(this.tick * 0.05) * 0.8;
        const coreX = drawX + 8;
        const coreY = drawY + 6;

        // Ground shadow
        ctx.fillStyle = 'rgba(10, 25, 45, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hydro Seamitar Aura
        const waterPulse = 0.3 + Math.sin(this.tick * 0.08) * 0.15;
        const waterGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        waterGrad.addColorStop(0, `rgba(255, 255, 255, ${waterPulse + 0.3})`);
        waterGrad.addColorStop(0.4, `rgba(56, 189, 248, ${waterPulse + 0.15})`);
        waterGrad.addColorStop(0.75, `rgba(14, 165, 233, ${waterPulse * 0.7})`);
        waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Water splash sparks & seamitar glint
        if (this.tick % 20 < 12) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 12, coreY + 4 - ((this.tick * 1.2) % 14), 1.5, 1.5);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.17) * 10, coreY + 5 - ((this.tick * 1.0) % 13), 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 8, coreY + 2 - (this.tick % 11), 1.5, 1.5);
        }

        // Draw Samurott sprite (96x96 scaled to 42x42)
        if (this.samurottImg && this.samurottImg.complete && this.samurottImg.naturalWidth > 0) {
          const isFlipped = (cfg?.orientation || 'W') === 'E';
          if (isFlipped) {
            ctx.save();
            ctx.translate(drawX + 8, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + 8), 0);
          }
          ctx.drawImage(this.samurottImg, drawX - 13, drawY - 20 + breath, 42, 42);
          if (isFlipped) ctx.restore();
        }
      } else {
        const drawX = curTileX * TILE_SIZE;
        const drawY = curTileY * TILE_SIZE;
        const dir =
          cfg?.orientation === 'W'
            ? 'left'
            : cfg?.orientation === 'E'
            ? 'right'
            : cfg?.orientation === 'N'
            ? 'up'
            : cfg?.orientation === 'S'
            ? 'down'
            : npc.dir;
        drawCharacter(
          ctx,
          npc.palette,
          dir,
          0,
          drawX,
          drawY,
          1
        );
      }

      // Floating speech bubble for interactive Pokémon & NPCs
      const isTalkable = [
        'twin',
        'charizard',
        'ranger',
        'tyranitar',
        'dialga',
        'palkia',
        'giratina',
        'rayquaza',
        'arceus',
        'ace',
        'mewtwo',
        'reshiram',
        'zekrom',
        'groudon',
        'kyogre',
        'garchomp',
        'urshifu',
        'samurott',
      ].includes(npc.id) || (npc as any).subType;

      if (isTalkable) {
        const isBig = [
          'charizard',
          'dialga',
          'palkia',
          'giratina',
          'rayquaza',
          'arceus',
          'tyranitar',
          'garchomp',
          'urshifu',
          'groudon',
          'kyogre',
          'reshiram',
          'zekrom',
          'samurott',
        ].includes(npc.id);
        const bx = curTileX * TILE_SIZE + (isBig ? 24 : 18);
        const by = curTileY * TILE_SIZE - 10 + Math.sin(this.tick * 0.08 + curTileX * 0.5) * 1.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(bx, by, 13, 9, 3);
        ctx.fill();
        ctx.strokeStyle = '#1c1726';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#1c1726';
        ctx.fillRect(bx + 2.5, by + 3.5, 1.5, 1.5);
        ctx.fillRect(bx + 5.5, by + 3.5, 1.5, 1.5);
        ctx.fillRect(bx + 8.5, by + 3.5, 1.5, 1.5);
      }
    }

    // Custom spawned NPCs
    for (const b of townConfig.getBuildings()) {
      if (b.kind === 'npc' && !this.map.npcs.some((n) => n.id === b.id)) {
        if (b.hidden) continue;
        const isPokemon = [
          'charizard', 'tyranitar', 'blastoise', 'garchomp', 'urshifu', 'rayquaza',
          'mewtwo', 'arceus', 'dialga', 'palkia', 'reshiram', 'zekrom',
          'giratina', 'groudon', 'kyogre', 'gyarados', 'latios', 'latias', 'darkrai',
          'necrozma', 'lunala', 'solgaleo', 'samurott', 'lucario', 'pikachu'
        ].includes(b.subType || b.id);
        const isFlipped = (isPokemon && !this.pmdAnimator.isSupported(b.subType || b.id)) ? b.orientation === 'E' : false;
        const centerX = b.x * TILE_SIZE + 8;
        if (isFlipped) {
          ctx.save();
          ctx.translate(centerX, 0);
          ctx.scale(-1, 1);
          ctx.translate(-centerX, 0);
        }
        if ((b.subType === 'charizard' || b.id === 'charizard') && this.charizardImg && this.charizardImg.complete) {
          const breath = Math.sin(this.tick * 0.05) * 0.8;
          ctx.drawImage(this.charizardImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        } else if ((b.subType === 'tyranitar' || b.id === 'tyranitar' || b.subType === 'blastoise' || b.id === 'blastoise') && (this.pmdAnimator.isSupported('tyranitar') || this.tyranitarImg || this.blastoiseImg)) {
          const stomp = Math.sin(this.tick * 0.04) * 0.8;
          const coreX = b.x * TILE_SIZE + 8;
          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'tyranitar',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn) {
            const img = this.tyranitarImg || this.blastoiseImg;
            if (img && img.complete) {
              ctx.drawImage(img, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + stomp, 42, 42);
            }
          }
        } else if ((b.subType === 'garchomp' || b.id === 'garchomp') && (this.pmdAnimator.isSupported('garchomp') || (this.garchompImg && this.garchompImg.complete))) {
          const machBob = Math.sin(this.tick * 0.05) * 0.9;
          const drawX = b.x * TILE_SIZE;
          const drawY = b.y * TILE_SIZE;
          const coreX = drawX + 8;

          // Ground shadow
          ctx.fillStyle = 'rgba(20, 20, 30, 0.4)';
          ctx.beginPath();
          ctx.ellipse(coreX, drawY + 16, 13, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dragon Claw & Mach slipstream particles
          if (this.tick % 16 < 11) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(coreX + Math.cos(this.tick * 0.15) * 12, drawY + 6 - (this.tick % 10) + machBob, 2, 1);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(coreX - 5 + Math.sin(this.tick * 0.2) * 10, drawY + 14 - (this.tick % 8), 1.5, 1.5);
          }

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'garchomp',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn && this.garchompImg && this.garchompImg.complete) {
            ctx.drawImage(this.garchompImg, drawX - 13, drawY - 20 + machBob, 42, 42);
          }
        } else if ((b.subType === 'urshifu' || b.id === 'urshifu' || b.subType === 'urshifu_gmax') && this.urshifuImg && this.urshifuImg.complete) {
          const stanceBob = Math.sin(this.tick * 0.04) * 0.8;
          const drawX = b.x * TILE_SIZE;
          const drawY = b.y * TILE_SIZE;

          // Ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
          ctx.beginPath();
          ctx.ellipse(drawX + 8, drawY + 16, 16, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Gigantamax Crimson Dynamax clouds & Rapid Strike water torrent
          const dynPhase = (this.tick * 0.05) % (Math.PI * 2);
          const cloudX = drawX + 8 + Math.cos(dynPhase) * 14;
          const cloudY = drawY - 14 + Math.sin(dynPhase) * 4;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
          ctx.fillRect(cloudX, cloudY, 2.5, 2);

          if (this.tick % 16 < 11) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(drawX + 8 + Math.sin(this.tick * 0.1) * 13, drawY + 8 + Math.cos(this.tick * 0.1) * 4, 2, 2);
            ctx.fillStyle = '#bae6fd';
            ctx.fillRect(drawX + 4 + Math.cos(this.tick * 0.15) * 10, drawY + 12 - (this.tick % 8), 1.5, 1.5);
          }

          ctx.drawImage(this.urshifuImg, drawX - 16, drawY - 24 + stanceBob, 48, 45);
        } else if (b.subType === 'dialga' || b.id === 'dialga') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.04) * 1.5;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'dialga',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );
          if (!pmdDrawn && this.dialgaImg && this.dialgaImg.complete) {
            ctx.drawImage(this.dialgaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if (b.subType === 'palkia' || b.id === 'palkia') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.04) * 1.6;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'palkia',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );
          if (!pmdDrawn && this.palkiaImg && this.palkiaImg.complete) {
            ctx.drawImage(this.palkiaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if (b.subType === 'giratina' || b.id === 'giratina') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.04) * 1.8;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'giratina',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );
          if (!pmdDrawn && this.giratinaImg && this.giratinaImg.complete) {
            ctx.drawImage(this.giratinaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if (b.subType === 'zekrom' || b.id === 'zekrom') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.035) * 1.5;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'zekrom',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );
          if (!pmdDrawn && this.zekromImg && this.zekromImg.complete) {
            ctx.drawImage(this.zekromImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if (b.subType === 'reshiram' || b.id === 'reshiram') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.035) * 1.5;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'reshiram',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );

          if (!pmdDrawn && this.reshiramImg && this.reshiramImg.complete) {
            ctx.drawImage(this.reshiramImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if (b.subType === 'arceus' || b.id === 'arceus') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.04) * 2;

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'arceus',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );

          if (!pmdDrawn && this.arceusImg && this.arceusImg.complete) {
            ctx.drawImage(this.arceusImg, b.x * TILE_SIZE - 12, b.y * TILE_SIZE - 18 + lev, 40, 40);
          }
        } else if ((b.subType === 'mewtwo' || b.id === 'mewtwo') && this.mewtwoImg && this.mewtwoImg.complete) {
          const lev = Math.sin(this.tick * 0.045) * 2.2;
          ctx.drawImage(this.mewtwoImg, b.x * TILE_SIZE - 11, b.y * TILE_SIZE - 16 + lev, 38, 38);
        } else if (b.subType === 'rayquaza' || b.id === 'rayquaza') {
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 16;
          const lev = Math.sin(this.tick * 0.04) * 2.0;

          // Atmospheric Ozone Emerald Aura
          const auraPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const spatGrad = ctx.createRadialGradient(coreX, b.y * TILE_SIZE - 2 + lev, 2, coreX, b.y * TILE_SIZE - 2 + lev, 18);
          spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
          spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
          spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
          ctx.fillStyle = spatGrad;
          ctx.beginPath();
          ctx.arc(coreX, b.y * TILE_SIZE - 2 + lev, 18, 0, Math.PI * 2);
          ctx.fill();

          // Stardust & Delta Stream wind sparkles
          if (this.tick % 24 < 14) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, b.y * TILE_SIZE - 6 - (this.tick % 14), 1.5, 1.5);
            ctx.fillStyle = '#34d399';
            ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.16) * 10, b.y * TILE_SIZE + 2 - (this.tick % 10), 2, 2);
          }

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'rayquaza',
            'idle',
            dir,
            coreX,
            coreY,
            this.tick
          );

          if (!pmdDrawn && this.rayquazaImg && this.rayquazaImg.complete) {
            ctx.drawImage(this.rayquazaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
          }
        } else if ((b.subType === 'groudon' || b.id === 'groudon') && (this.pmdAnimator.isSupported('groudon') || (this.groudonImg && this.groudonImg.complete))) {
          const breath = Math.sin(this.tick * 0.04) * 0.8;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 8;

          // Ground shadow beneath heavy continent body
          ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Primal Magma / Desolate Land Heat Radiance
          const magmaPulse = 0.35 + Math.sin(this.tick * 0.07) * 0.15;
          const heatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
          heatGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.25})`);
          heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
          heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
          ctx.fillStyle = heatGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Volcanic embers & magma sparks rising upward from the scorched earth
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.25) * 14, coreY + 8 - ((this.tick * 1.5) % 18), 1.5, 1.5);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 12, coreY + 10 - ((this.tick * 1.2) % 16), 2, 2);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 10, coreY + 6 - (this.tick % 14), 1.5, 1.5);
          }

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'groudon',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn && this.groudonImg && this.groudonImg.complete) {
            ctx.drawImage(this.groudonImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
          }
        } else if ((b.subType === 'kyogre' || b.id === 'kyogre') && (this.pmdAnimator.isSupported('kyogre') || (this.kyogreImg && this.kyogreImg.complete))) {
          const swimY = Math.sin(this.tick * 0.04) * 1.8;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 2 + swimY;

          // Water ripple shadow
          ctx.fillStyle = 'rgba(7, 43, 79, 0.4)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Primordial Sea Oceanic Hydro Aura
          const waterPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
          aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
          aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
          aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
          ctx.fillStyle = aquaGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
          ctx.fill();

          // Hydro droplet & bioluminescent mist bubbles
          if (this.tick % 22 < 13) {
            ctx.fillStyle = '#7dd3fc';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 13, coreY - 4 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.17) * 11, coreY + 4 + Math.sin(this.tick * 0.17) * 7, 2, 2);
            ctx.fillStyle = '#f0f9ff';
            ctx.fillRect(coreX + 5 + Math.sin(this.tick * 0.28) * 9, coreY - 6 - (this.tick % 8), 1.5, 1.5);
          }

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'kyogre',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn && this.kyogreImg && this.kyogreImg.complete) {
            ctx.drawImage(this.kyogreImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + swimY, 42, 42);
          }
        } else if ((b.subType === 'latios' || b.id === 'latios') && this.latiosImg && this.latiosImg.complete) {
          const jetHover = Math.sin(this.tick * 0.055) * 2.2;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 1 + jetHover;

          // Aerodynamic ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 13, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Eon Psychic / Jet Stream Azure Radiant Aura
          const jetPulse = 0.35 + Math.sin(this.tick * 0.09) * 0.15;
          const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
          auraGrad.addColorStop(0, `rgba(191, 219, 254, ${jetPulse + 0.3})`);
          auraGrad.addColorStop(0.5, `rgba(59, 130, 246, ${jetPulse})`);
          auraGrad.addColorStop(1, 'rgba(29, 78, 216, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
          ctx.fill();

          // Jet stream vapor trails & psychic stardust
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#93c5fd';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.24) * 12, coreY - 4 + Math.cos(this.tick * 0.24) * 8, 1.5, 1.5);
            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 10, coreY + 3 + Math.sin(this.tick * 0.18) * 6, 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 8, coreY - 5 - (this.tick % 7), 1.5, 1.5);
          }

          ctx.drawImage(this.latiosImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + jetHover, 42, 42);
        } else if ((b.subType === 'latias' || b.id === 'latias') && this.latiasImg && this.latiasImg.complete) {
          const floatY = Math.sin(this.tick * 0.055 + 1.2) * 2.2;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 1 + floatY;

          // Aerodynamic ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 12, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Eon Crimson / Rose Mist Radiant Aura
          const rosePulse = 0.35 + Math.sin(this.tick * 0.09 + 1.0) * 0.15;
          const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
          auraGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.3})`);
          auraGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse})`);
          auraGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
          ctx.fill();

          // Light refraction glass crystals & pink stardust
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#fda4af';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.24) * 12, coreY - 4 + Math.cos(this.tick * 0.24) * 8, 1.5, 1.5);
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.18) * 10, coreY + 3 + Math.sin(this.tick * 0.18) * 6, 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 8, coreY - 5 - (this.tick % 7), 1.5, 1.5);
          }

          ctx.drawImage(this.latiasImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + floatY, 42, 42);
        } else if ((b.subType === 'darkrai' || b.id === 'darkrai') && this.darkraiImg && this.darkraiImg.complete) {
          const levitate = Math.sin(this.tick * 0.04) * 2.0;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 2 + levitate;

          // Shadowy abyss portal pool
          const portalPulse = 0.4 + Math.sin(this.tick * 0.08) * 0.15;
          ctx.fillStyle = `rgba(15, 23, 42, ${portalPulse + 0.2})`;
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 14, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pitch-Black / Nightmare Dark Void Aura
          const voidPulse = 0.35 + Math.sin(this.tick * 0.07) * 0.15;
          const voidGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
          voidGrad.addColorStop(0, `rgba(192, 132, 252, ${voidPulse + 0.25})`);
          voidGrad.addColorStop(0.5, `rgba(88, 28, 135, ${voidPulse})`);
          voidGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = voidGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
          ctx.fill();

          // Shadow mist wisps & nightmare sparks
          if (this.tick % 22 < 14) {
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, coreY + 6 - ((this.tick * 1.3) % 18), 1.5, 1.5);
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.16) * 10, coreY + 8 - ((this.tick * 1.1) % 16), 2, 2);
            ctx.fillStyle = '#f3e8ff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 8, coreY - 4 - (this.tick % 10), 1.5, 1.5);
          }

          ctx.drawImage(this.darkraiImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + levitate, 42, 42);
        } else if ((b.subType === 'necrozma' || b.subType === 'necrozma_dusk_mane' || b.id === 'necrozma' || b.id === 'necrozma_dusk_mane') && this.necrozmaImg && this.necrozmaImg.complete) {
          const breath = Math.sin(this.tick * 0.04) * 0.9;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 6;

          // Ground shadow beneath heavy lion paws
          ctx.fillStyle = 'rgba(25, 15, 10, 0.45)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Radiant Solar Prism Aura
          const solarPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
          sunGrad.addColorStop(0, `rgba(254, 240, 138, ${solarPulse + 0.3})`);
          sunGrad.addColorStop(0.4, `rgba(245, 158, 11, ${solarPulse})`);
          sunGrad.addColorStop(0.8, `rgba(79, 70, 229, ${solarPulse * 0.6})`);
          sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Solar flare / prism laser sparkles
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.25) * 14, coreY + 6 - ((this.tick * 1.4) % 18), 1.5, 1.5);
            ctx.fillStyle = '#818cf8';
            ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.18) * 12, coreY + 8 - ((this.tick * 1.2) % 16), 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.3) * 10, coreY + 4 - (this.tick % 14), 1.5, 1.5);
          }

          ctx.drawImage(this.necrozmaImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + breath, 46, 43);
        } else if (b.subType === 'lunala' || b.id === 'lunala') {
          const levitate = Math.sin(this.tick * 0.045) * 2.2;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 2 + levitate;

          // Crescent lunar ground shadow beneath wingspan
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 17, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Full Moon Cosmic Starlight Radiant Aura
          const moonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const moonGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
          moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
          moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
          moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
          moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = moonGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Lunar dust sparkles & starlight constellation glints
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#c7d2fe';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 14, coreY - 4 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(coreX - 9 + Math.cos(this.tick * 0.16) * 12, coreY + 3 + Math.sin(this.tick * 0.16) * 6, 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 5 + Math.sin(this.tick * 0.28) * 10, coreY - 6 - (this.tick % 7), 1.5, 1.5);
          }

          const dir = b.orientation || 'W';
          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'lunala',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn && this.lunalaImg && this.lunalaImg.complete) {
            ctx.drawImage(this.lunalaImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + levitate, 46, 46);
          }
        } else if ((b.subType === 'solgaleo' || b.id === 'solgaleo') && this.solgaleoImg && this.solgaleoImg.complete) {
          const breath = Math.sin(this.tick * 0.04) * 0.9;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 6;

          // Ground shadow beneath heavy lion paws
          ctx.fillStyle = 'rgba(25, 15, 5, 0.45)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Radiant Sun Solar Corona Aura
          const sunPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
          sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
          sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
          sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
          sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Solar flare sparks & prism glints
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 14, coreY + 4 - ((this.tick * 1.3) % 16), 1.5, 1.5);
            ctx.fillStyle = '#f97316';
            ctx.fillRect(coreX - 8 + Math.cos(this.tick * 0.17) * 12, coreY + 6 - ((this.tick * 1.1) % 15), 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 10, coreY + 2 - (this.tick % 13), 1.5, 1.5);
          }

          const pmdDrawn = this.pmdAnimator.draw(
            ctx,
            'solgaleo',
            'idle',
            'down',
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
          if (!pmdDrawn && this.solgaleoImg && this.solgaleoImg.complete) {
            ctx.drawImage(this.solgaleoImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + breath, 46, 43);
          }
        } else if ((b.subType === 'samurott' || b.id === 'samurott') && this.samurottImg && this.samurottImg.complete) {
          const breath = Math.sin(this.tick * 0.05) * 0.8;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 6;

          // Ground shadow
          ctx.fillStyle = 'rgba(10, 25, 45, 0.45)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Hydro Seamitar Aura
          const waterPulse = 0.3 + Math.sin(this.tick * 0.08) * 0.15;
          const waterGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
          waterGrad.addColorStop(0, `rgba(255, 255, 255, ${waterPulse + 0.3})`);
          waterGrad.addColorStop(0.4, `rgba(56, 189, 248, ${waterPulse + 0.15})`);
          waterGrad.addColorStop(0.75, `rgba(14, 165, 233, ${waterPulse * 0.7})`);
          waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = waterGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
          ctx.fill();

          // Water splash sparks & seamitar glint
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 12, coreY + 4 - ((this.tick * 1.2) % 14), 1.5, 1.5);
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.17) * 10, coreY + 5 - ((this.tick * 1.0) % 13), 2, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(coreX + 4 + Math.sin(this.tick * 0.28) * 8, coreY + 2 - (this.tick % 11), 1.5, 1.5);
          }

          ctx.drawImage(this.samurottImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        } else if ((b.subType === 'gyarados' || b.id === 'gyarados') && this.pmdAnimator.isSupported('gyarados')) {
          const swimY = Math.sin(this.tick * 0.04) * 1.5;
          const coreX = b.x * TILE_SIZE + 8;
          const coreY = b.y * TILE_SIZE + 4 + swimY;

          // Ground shadow
          ctx.fillStyle = 'rgba(7, 43, 79, 0.45)';
          ctx.beginPath();
          ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Surging Dragon Rage / Waterfall Hydro Aura
          const waterPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
          const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
          aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
          aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
          aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
          ctx.fillStyle = aquaGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Hydro droplets & dragon mist sparks
          if (this.tick % 20 < 12) {
            ctx.fillStyle = '#bae6fd';
            ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 13, coreY - 4 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.17) * 11, coreY + 4 + Math.sin(this.tick * 0.17) * 7, 2, 2);
          }

          const dir = b.orientation || 'W';
          this.pmdAnimator.draw(
            ctx,
            'gyarados',
            'idle',
            dir,
            coreX,
            b.y * TILE_SIZE + 16,
            this.tick
          );
        } else {
          const dir =
            b.orientation === 'W'
              ? 'left'
              : b.orientation === 'E'
              ? 'right'
              : b.orientation === 'N'
              ? 'up'
              : 'down';
          drawCharacter(ctx, this.playerPalette, dir, 0, b.x * TILE_SIZE, b.y * TILE_SIZE, 1);
        }
        if (isFlipped) {
          ctx.restore();
        }

        // Draw speech bubble for custom placed Pokémon & NPCs
        const bx = b.x * TILE_SIZE + ((b.w || 1) >= 2 ? 24 : 18);
        const by = b.y * TILE_SIZE - 10 + Math.sin(this.tick * 0.08 + b.x * 0.5) * 1.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(bx, by, 13, 9, 3);
        ctx.fill();
        ctx.strokeStyle = '#1c1726';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#1c1726';
        ctx.fillRect(bx + 2.5, by + 3.5, 1.5, 1.5);
        ctx.fillRect(bx + 5.5, by + 3.5, 1.5, 1.5);
        ctx.fillRect(bx + 8.5, by + 3.5, 1.5, 1.5);
      }
    }

    // 9. Dust puffs beneath player
    for (const p of this.dustPuffs) {
      ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha * 0.75})`;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.size), Math.floor(p.size));
    }

    // 9. Follower & Player
    const followerY = this.isMoving
      ? this.followerPos.y + (this.followerTarget.y - this.followerPos.y) * this.moveProgress
      : this.followerPos.y;
    const playerY = this.isMoving
      ? this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress
      : this.playerPos.y;

    const drawX =
      (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
    const drawY =
      (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
    const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

    if (this.isRidingPokemon && this.activeFollower) {
      this.drawPokeRide(ctx, drawX, drawY, stepFrame);
    } else {
      if (this.activeFollower && followerY <= playerY) {
        this.drawFollower(ctx);
      }

      if (this.isBikeActive) {
        // Sitting on Mach Bike: render Ash slightly raised
        const bikeYOffset = -2;
        drawCharacter(ctx, this.playerPalette, this.playerDir, 0, drawX, drawY + bikeYOffset, 1);
        this.drawMachBike(ctx, this.playerDir, drawX, drawY, this.tick, this.isMoving);
      } else {
        drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);
      }

      if (this.activeFollower && followerY > playerY) {
        this.drawFollower(ctx);
      }
    }

    // Signature move visual burst particles
    this.renderMoveParticles(ctx);

    // Fly burst particles
    for (const p of this.flyBurstParticles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      ctx.restore();
    }

    // Authentic Pokémon tall grass immersion (grass blades rustle over trainer's feet)
    if (this.currentScene === 'town') {
      const curTile = this.map.ground[this.playerPos.y * this.map.w + this.playerPos.x];
      if (curTile === 2) {
        ctx.fillStyle = '#458f2f';
        ctx.fillRect(drawX + 1, drawY + 11, 14, 5);
        ctx.fillStyle = '#55a437';
        ctx.fillRect(drawX + 2, drawY + 9, 3, 4);
        ctx.fillRect(drawX + 7, drawY + 8, 3, 5);
        ctx.fillRect(drawX + 11, drawY + 10, 3, 4);
        ctx.fillStyle = '#8ce458';
        ctx.fillRect(drawX + 3, drawY + 8, 2, 2);
        ctx.fillRect(drawX + 8, drawY + 7, 2, 2);
      }
    }

    // 10. Day / Sunset / Night Atmosphere Overlay, Building Windows & Dynamic Lighting
    if (this.currentScene === 'town') {
      if (this.townAtmosphere === 'sunset') {
        ctx.fillStyle = 'rgba(255, 135, 45, 0.16)';
        ctx.fillRect(0, 0, this.map.w * TILE_SIZE, this.map.h * TILE_SIZE);
        renderLighting(ctx, this.getActiveLamps());
      } else if (this.townAtmosphere === 'night') {
        // Deep indigo night atmosphere
        ctx.fillStyle = 'rgba(12, 18, 50, 0.44)';
        ctx.fillRect(0, 0, this.map.w * TILE_SIZE, this.map.h * TILE_SIZE);

        // Warm illuminated building windows at night
        this.renderNightBuildingWindows(ctx);

        // Street lantern glowing pools
        renderLighting(ctx, this.getActiveLamps());
      }

      // Rainy weather cool ambient wash
      if (this.weather === 'rain') {
        ctx.fillStyle = 'rgba(20, 45, 80, 0.12)';
        ctx.fillRect(0, 0, this.map.w * TILE_SIZE, this.map.h * TILE_SIZE);
      }
    }

    // 11. Dynamic Weather Particles & Fireflies
    this.renderWeatherParticles(ctx);

    // 12. Town Editor Overlay (Grid, Building Dragging, Coordinates Tooltip)
    if (this.currentScene === 'town' && this.editor.isEnabled()) {
      this.editor.renderOverlay(ctx);
    }

    // 13. X-Ray Collision & Hidden Obstacle Inspector Overlay
    if (this.xrayMode) {
      this.renderXrayOverlay(ctx);
    }

    ctx.restore();

    // Position HTML DOM labels
    this.updateDomLabels();
  }

  private renderNightBuildingWindows(ctx: CanvasRenderingContext2D) {
    const buildings = townConfig.getBuildings();
    ctx.save();
    for (const b of buildings) {
      if (b.hidden) continue;
      const bx = b.x * TILE_SIZE;
      const by = b.y * TILE_SIZE;
      const bw = b.w * TILE_SIZE;

      // Render soft glowing warm windows on major buildings
      const bType = b.subType || b.id;
      if (['house', 'home', 'villa', 'dev', 'lab', 'reception', 'shop', 'mart', 'tower', 'office', 'arcade'].includes(bType)) {
        ctx.fillStyle = 'rgba(253, 230, 138, 0.72)';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
        ctx.shadowBlur = 6;

        if (bType === 'house' || bType === 'home' || bType === 'villa') {
          ctx.fillRect(bx + 8, by + 18, 10, 8);
          ctx.fillRect(bx + bw - 18, by + 18, 10, 8);
        } else if (bType === 'dev' || bType === 'lab') {
          ctx.fillRect(bx + 10, by + 16, 12, 10);
          ctx.fillRect(bx + bw - 22, by + 16, 12, 10);
          ctx.fillRect(bx + Math.floor(bw / 2) - 6, by + 16, 12, 10);
        } else if (bType === 'reception') {
          ctx.fillRect(bx + 12, by + 20, 14, 12);
          ctx.fillRect(bx + bw - 26, by + 20, 14, 12);
        } else if (bType === 'shop' || bType === 'mart') {
          ctx.fillRect(bx + 10, by + 20, 16, 10);
        } else if (bType === 'arcade') {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.75)';
          ctx.shadowColor = 'rgba(192, 132, 252, 0.9)';
          ctx.fillRect(bx + 10, by + 18, 12, 10);
          ctx.fillRect(bx + bw - 22, by + 18, 12, 10);
        } else if (bType === 'tower' || bType === 'office') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.shadowColor = 'rgba(14, 165, 233, 0.9)';
          ctx.fillRect(bx + 12, by + 14, 10, 8);
          ctx.fillRect(bx + bw - 22, by + 14, 10, 8);
          ctx.fillRect(bx + 12, by + 30, 10, 8);
          ctx.fillRect(bx + bw - 22, by + 30, 10, 8);
        }
      }
    }
    ctx.restore();
  }

  private renderWeatherParticles(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.particles) {
      if (p.type === 'petal') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        ctx.fillRect(px, py, p.size, p.size);
        ctx.fillRect(px + 1, py + 1, Math.max(1, p.size - 0.5), Math.max(1, p.size - 0.5));
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      } else if (p.type === 'raindrop') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.vx * (p.len || 8)) / 10, p.y + (p.vy * (p.len || 8)) / 10);
        ctx.stroke();
      } else if (p.type === 'ripple') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'star') {
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(this.tick * (p.swaySpeed || 0.04) + (p.sway || 0)));
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * pulse;
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        ctx.fillRect(px, py, p.size, p.size);
        // Twinkling sparkle cross
        ctx.fillRect(px - 1, py, 1, 1);
        ctx.fillRect(px + p.size, py, 1, 1);
        ctx.fillRect(px, py - 1, 1, 1);
        ctx.fillRect(px, py + p.size, 1, 1);
      } else if (p.type === 'meteor') {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#fef08a');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Fireflies at night
    if (this.townAtmosphere === 'night') {
      for (const f of this.fireflies) {
        const pulse = 0.25 + 0.75 * Math.abs(Math.sin(this.tick * (f.swaySpeed || 0.03) + (f.sway || 0)));
        ctx.save();
        ctx.globalAlpha = f.alpha * pulse;
        ctx.fillStyle = f.color;
        ctx.shadowColor = '#d4ff59';
        ctx.shadowBlur = 8;
        const fx = Math.floor(f.x);
        const fy = Math.floor(f.y);
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private onPlayerStepStart(newTarget: Vec) {
    if (!this.activeFollower) return;

    if (this.isRidingPokemon) {
      this.followerPos = { ...this.playerPos };
      this.followerTarget = { ...newTarget };
      this.followerDir = this.playerDir;
      this.followerFacing = this.playerDir === 'left' ? 'left' : 'right';
      return;
    }

    this.followerPos = { ...this.followerTarget };

    // Check if player is reversing direction towards the follower (into the gap tile or follower's tile)
    const isReversing =
      (newTarget.x === this.followerPos.x && newTarget.y === this.followerPos.y) ||
      (this.followerTrail.length > 0 &&
        newTarget.x === this.followerTrail[0].x &&
        newTarget.y === this.followerTrail[0].y);

    if (isReversing) {
      // Step follower backwards away from player to maintain the 1-tile gap
      const dx = this.followerPos.x - newTarget.x;
      const dy = this.followerPos.y - newTarget.y;
      const backupX = this.followerPos.x + dx;
      const backupY = this.followerPos.y + dy;

      if (this.canWalk(backupX, backupY)) {
        this.followerTarget = { x: backupX, y: backupY };
      } else {
        // Wall behind: follower holds position
        this.followerTarget = { ...this.followerPos };
      }
      this.followerTrail = [{ ...newTarget }];
    } else {
      // Normal movement along the breadcrumb trail (1-tile gap behind player)
      if (this.followerTrail.length > 0) {
        this.followerTarget = { ...this.followerTrail[0] };
        this.followerTrail.shift();
      } else {
        this.followerTarget = { ...this.playerPos };
      }
      this.followerTrail.push({ ...this.playerPos });
    }

    const dx = this.followerTarget.x - this.followerPos.x;
    const dy = this.followerTarget.y - this.followerPos.y;
    if (dx > 0) {
      this.followerDir = 'right';
      this.followerFacing = 'right';
    } else if (dx < 0) {
      this.followerDir = 'left';
      this.followerFacing = 'left';
    } else if (dy > 0) {
      this.followerDir = 'down';
      if (this.playerDir === 'right' || this.playerDir === 'left') {
        this.followerFacing = this.playerDir;
      }
    } else if (dy < 0) {
      this.followerDir = 'up';
      if (this.playerDir === 'right' || this.playerDir === 'left') {
        this.followerFacing = this.playerDir;
      }
    } else {
      // Stationary: face towards the player
      const pdx = this.playerPos.x - this.followerPos.x;
      const pdy = this.playerPos.y - this.followerPos.y;
      if (Math.abs(pdx) >= Math.abs(pdy)) {
        if (pdx !== 0) {
          this.followerDir = pdx > 0 ? 'right' : 'left';
          this.followerFacing = pdx > 0 ? 'right' : 'left';
        }
      } else {
        if (pdy !== 0) {
          this.followerDir = pdy > 0 ? 'down' : 'up';
        }
      }
    }
  }

  private getTileBehind(x: number, y: number, dir: Dir, dist = 1): Vec {
    if (dir === 'up') return { x, y: y + dist };
    if (dir === 'down') return { x, y: y - dist };
    if (dir === 'left') return { x: x + dist, y };
    return { x: x - dist, y };
  }

  private getFollowerInitialPos(playerX: number, playerY: number, dir: Dir): { pos: Vec; trail: Vec[] } {
    const behind1 = this.getTileBehind(playerX, playerY, dir, 1);
    const behind2 = this.getTileBehind(playerX, playerY, dir, 2);

    // Prefer 2-tile distance (1-tile empty gap between player and follower)
    if (this.canWalk(behind2.x, behind2.y) && this.canWalk(behind1.x, behind1.y)) {
      return { pos: behind2, trail: [behind1] };
    }
    // If 2 tiles straight behind is blocked, check adjacent walkable tiles of behind1
    const alts: Vec[] = [
      { x: behind1.x + 1, y: behind1.y },
      { x: behind1.x - 1, y: behind1.y },
      { x: behind1.x, y: behind1.y + 1 },
      { x: behind1.x, y: behind1.y - 1 },
    ];
    for (const alt of alts) {
      if (alt.x === playerX && alt.y === playerY) continue;
      if (this.canWalk(alt.x, alt.y) && this.canWalk(behind1.x, behind1.y)) {
        return { pos: alt, trail: [behind1] };
      }
    }
    // Fallback: 1-tile distance if tight space
    if (this.canWalk(behind1.x, behind1.y)) {
      return { pos: behind1, trail: [behind1] };
    }
    return { pos: { x: playerX, y: playerY }, trail: [{ x: playerX, y: playerY }] };
  }

  public getActiveFollower(): FollowerPokemon | null {
    return this.activeFollower;
  }

  public setActiveFollower(id: string | null, announce = true) {
    if (!id || id === 'none' || id === 'dismiss') {
      if (this.isRidingPokemon) {
        this.isRidingPokemon = false;
        this.ensureSafeFootPosition();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('town:pokeride-changed', {
              detail: { active: false, follower: null, rideClass: 'charge' },
            })
          );
        }
      }
      this.activeFollower = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('town:active_follower');
        localStorage.removeItem('town:activeFollower');
      }
      this.wake();
      if (announce && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '👟 Pokémon partner diistirahatkan.',
          })
        );
        window.dispatchEvent(
          new CustomEvent('town:follower-changed', {
            detail: { follower: null, followerId: null },
          })
        );
      }
      return;
    }

    const followersMap: Record<string, { name: string; title: string; icon: string }> = {
      lucario: { name: 'Lucario', title: 'Aura Guardian', icon: '🌀' },
      charizard: { name: 'Charizard', title: 'Flame Titan', icon: '🔥' },
      tyranitar: { name: 'Tyranitar', title: 'Armor Rock', icon: '🪨' },
      garchomp: { name: 'Garchomp', title: 'Mach Dragon', icon: '🦈' },
      urshifu: { name: 'Urshifu', title: 'Rapid Strike', icon: '🌊' },
      rayquaza: { name: 'Rayquaza', title: 'Sky High Dragon', icon: '🐉' },
      mewtwo: { name: 'Mewtwo', title: 'Psychic Overlord', icon: '🔮' },
      arceus: { name: 'Arceus', title: 'Alpha Architect', icon: '✨' },
      dialga: { name: 'Dialga', title: 'Temporal Dragon', icon: '⏳' },
      palkia: { name: 'Palkia', title: 'Spatial Dragon', icon: '🌌' },
      pikachu: { name: 'Pikachu', title: 'Electric Mascot', icon: '⚡' },
      reshiram: { name: 'Reshiram', title: 'Vast White Dragon', icon: '🤍' },
      zekrom: { name: 'Zekrom', title: 'Deep Black Dragon', icon: '🖤' },
      giratina: { name: 'Giratina', title: 'Renegade Shadow', icon: '👻' },
      groudon: { name: 'Groudon', title: 'Continent Titan', icon: '🌋' },
      kyogre: { name: 'Kyogre', title: 'Sea Basin Titan', icon: '🌊' },
      gyarados: { name: 'Gyarados', title: 'Atrocious Water Titan', icon: '🌊' },
      latios: { name: 'Latios', title: 'Eon Jet Guardian', icon: '✈️' },
      latias: { name: 'Latias', title: 'Eon Mist Guardian', icon: '💖' },
      darkrai: { name: 'Darkrai', title: 'Pitch-Black Shadow', icon: '🌑' },
      necrozma: { name: 'Necrozma', title: 'Prism Solar Light', icon: '🦁' },
      lunala: { name: 'Lunala', title: 'Moone Lunar Beast', icon: '🌙' },
      solgaleo: { name: 'Solgaleo', title: 'Sunne Solar Beast', icon: '☀️' },
      samurott: { name: 'Samurott', title: 'Formidable Seamitar', icon: '⚔️' },
    };

    const cleanId = id.toLowerCase().replace(/[^a-z]/g, '');
    const matchedKey = Object.keys(followersMap).find((k) => cleanId.includes(k));
    if (!matchedKey) return;

    const data = followersMap[matchedKey];
    this.activeFollower = {
      id: matchedKey,
      name: data.name,
      title: data.title,
      icon: data.icon,
    };

    if (this.isRidingPokemon) {
      if (this.getRideClass(matchedKey) === 'charge') {
        this.ensureSafeFootPosition();
      }
      this.followerPos = { ...this.playerPos };
      this.followerTarget = { ...this.playerTarget };
      this.followerTrail = [];
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:pokeride-changed', {
            detail: { active: true, follower: this.activeFollower, rideClass: this.getRideClass(matchedKey) },
          })
        );
      }
    } else {
      const init = this.getFollowerInitialPos(this.playerPos.x, this.playerPos.y, this.playerDir);
      this.followerPos = { ...init.pos };
      this.followerTarget = { ...init.pos };
      this.followerTrail = [...init.trail];
    }
    this.followerDir = this.playerDir;
    this.followerFacing = this.playerDir === 'left' ? 'left' : 'right';
    this.followerEmoteTime = 90;
    this.followerEmote = '❤️';

    if (typeof window !== 'undefined') {
      localStorage.setItem('town:active_follower', matchedKey);
      localStorage.setItem('town:activeFollower', matchedKey);
    }
    sfx.confirm();
    this.wake();

    if (announce && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `🤝 ${data.icon} ${data.name} (${data.title}) sekarang menjadi partner jalanmu!`,
        })
      );
      window.dispatchEvent(
        new CustomEvent('town:follower-changed', {
          detail: { follower: this.activeFollower, followerId: this.activeFollower.id },
        })
      );
    }
  }

  public triggerSignatureMove(pokemonId: string, originX?: number, originY?: number) {
    const id = pokemonId.toLowerCase();
    const ox =
      originX !== undefined
        ? originX * TILE_SIZE + 8
        : (this.activeFollower ? this.followerPos.x : this.playerPos.x) * TILE_SIZE + 8;
    const oy =
      originY !== undefined
        ? originY * TILE_SIZE + 8
        : (this.activeFollower ? this.followerPos.y : this.playerPos.y) * TILE_SIZE + 8;

    this.cameraShakeTime = 28;
    this.cameraShakeIntensity = 3.6;
    sfx.encounter();

    if (id.includes('charizard')) {
      for (let i = 0; i < 45; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const spd = 2.5 + Math.random() * 4.5;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 3 + Math.random() * 4,
          color: ['#f97316', '#ef4444', '#fde047', '#ffedd5'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 25 + Math.floor(Math.random() * 20),
          type: 'flame',
        });
      }
    } else if (id.includes('tyranitar') || id.includes('blastoise')) {
      this.tyranitarAttackTick = 26;
      for (let i = 0; i < 45; i++) {
        const r = 8 + Math.random() * 32;
        const ang = Math.random() * Math.PI * 2;
        this.moveParticles.push({
          x: ox + Math.cos(ang) * r,
          y: oy + Math.sin(ang) * r,
          vx: -Math.sin(ang) * 3.5,
          vy: Math.cos(ang) * 3.5,
          size: 2 + Math.random() * 2.5,
          color: ['#d97706', '#b45309', '#fde68a', '#78350f'][Math.floor(Math.random() * 4)],
          alpha: 0.9,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 15),
          type: 'sand',
        });
      }
    } else if (id.includes('garchomp')) {
      this.garchompAttackTick = 26;
      for (let i = 0; i < 35; i++) {
        const spd = 3.5 + Math.random() * 4.5;
        const ang = Math.PI * 0.25 + (Math.random() - 0.5) * 0.8;
        this.moveParticles.push({
          x: ox + (Math.random() - 0.5) * 20,
          y: oy + (Math.random() - 0.5) * 20,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#06b6d4', '#22d3ee', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 24 + Math.floor(Math.random() * 14),
          type: 'claw',
        });
      }
    } else if (id.includes('urshifu')) {
      for (let i = 0; i < 45; i++) {
        const spd = 3 + Math.random() * 5;
        const ang = Math.random() * Math.PI * 2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3.5,
          color: ['#0284c7', '#38bdf8', '#7dd3fc', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 26 + Math.floor(Math.random() * 18),
          type: 'water',
        });
      }
    } else if (id.includes('lucario')) {
      for (let i = 0; i < 40; i++) {
        const spd = 2 + Math.random() * 4;
        const ang = Math.random() * Math.PI * 2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#38bdf8', '#6366f1', '#818cf8', '#e0e7ff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 15),
          type: 'aura',
        });
      }
    } else if (id.includes('mewtwo')) {
      for (let i = 0; i < 45; i++) {
        const spd = 2.2 + Math.random() * 4.2;
        const ang = Math.random() * Math.PI * 2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3.5,
          color: ['#a855f7', '#d946ef', '#ec4899', '#f0abfc'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 15),
          type: 'psychic',
        });
      }
    } else if (id.includes('arceus')) {
      this.arceusAttackTick = 37;
      for (let i = 0; i < 45; i++) {
        this.moveParticles.push({
          x: ox + (Math.random() - 0.5) * 50,
          y: oy - 60 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 4.5 + Math.random() * 3.5,
          size: 3 + Math.random() * 3.5,
          color: ['#fbbf24', '#fde047', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 26 + Math.floor(Math.random() * 14),
          type: 'cosmic',
        });
      }
    } else if (id.includes('rayquaza')) {
      this.rayquazaAttackTick = 26;
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 5;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 16),
          type: 'shockwave',
        });
      }
    } else if (id.includes('dialga')) {
      this.dialgaAttackTick = 28;
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4.5;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#0284c7', '#38bdf8', '#bae6fd', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 15),
          type: 'cosmic',
        });
      }
    } else if (id.includes('palkia')) {
      this.palkiaAttackTick = 28;
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4.5;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#e11d48', '#fb7185', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 15),
          type: 'cosmic',
        });
      }
    } else if (id.includes('reshiram')) {
      this.reshiramAttackTick = 30;
      for (let i = 0; i < 50; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const spd = 3.0 + Math.random() * 5.0;
        this.moveParticles.push({
          x: ox + (Math.random() - 0.5) * 12,
          y: oy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 3 + Math.random() * 4,
          color: ['#ffffff', '#ffedd5', '#f97316', '#ef4444'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 18),
          type: 'flame',
        });
      }
    } else if (id.includes('zekrom')) {
      this.zekromAttackTick = 28;
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.2 + Math.random() * 5.2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3.5,
          color: ['#06b6d4', '#22d3ee', '#38bdf8', '#0284c7', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 26 + Math.floor(Math.random() * 16),
          type: 'shockwave',
        });
      }
    } else if (id.includes('giratina')) {
      this.giratinaAttackTick = 27;
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.4 + Math.random() * 4.2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3.5,
          color: ['#701a75', '#a21caf', '#c026d3', '#3b0764', '#18181b'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 32 + Math.floor(Math.random() * 16),
          type: 'psychic',
        });
      }
    } else if (id.includes('groudon')) {
      this.groudonAttackTick = 28;
      for (let i = 0; i < 50; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
        const spd = 3.5 + Math.random() * 5.5;
        this.moveParticles.push({
          x: ox + (Math.random() - 0.5) * 30,
          y: oy + 10,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3.5 + Math.random() * 4,
          color: ['#dc2626', '#ea580c', '#b45309', '#fde047'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 16),
          type: 'sand',
        });
      }
    } else if (id.includes('kyogre')) {
      this.kyogreAttackTick = 26;
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.0 + Math.random() * 5.0;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3.5,
          color: ['#0284c7', '#0ea5e9', '#38bdf8', '#bae6fd', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 16),
          type: 'water',
        });
      }
    } else if (id.includes('gyarados')) {
      this.gyaradosAttackTick = 25;
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4.5;
        this.moveParticles.push({
          x: ox + Math.cos(ang) * 12,
          y: oy + Math.sin(ang) * 12,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3,
          color: ['#0284c7', '#38bdf8', '#0ea5e9', '#bae6fd', '#1d4ed8'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 15),
          type: 'spark',
        });
      }
    } else if (id.includes('latios')) {
      for (let i = 0; i < 45; i++) {
        const ang = Math.PI * 0.25 + (Math.random() - 0.5) * 1.0;
        const spd = 4.0 + Math.random() * 5.5;
        this.moveParticles.push({
          x: ox + (Math.random() - 0.5) * 20,
          y: oy + (Math.random() - 0.5) * 20,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3,
          color: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 26 + Math.floor(Math.random() * 14),
          type: 'shockwave',
        });
      }
    } else if (id.includes('latias')) {
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4.2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3,
          color: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 15),
          type: 'aura',
        });
      }
    } else if (id.includes('darkrai')) {
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = 6 + Math.random() * 28;
        this.moveParticles.push({
          x: ox + Math.cos(ang) * r,
          y: oy + Math.sin(ang) * r,
          vx: -Math.sin(ang) * 3.2,
          vy: Math.cos(ang) * 3.2,
          size: 2.5 + Math.random() * 3.5,
          color: ['#3b0764', '#581c87', '#7e22ce', '#a855f7', '#0f172a'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 32 + Math.floor(Math.random() * 16),
          type: 'psychic',
        });
      }
    } else if (id.includes('necrozma')) {
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.5 + Math.random() * 5.0;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3.5,
          color: ['#f59e0b', '#fbbf24', '#fde047', '#818cf8', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 15),
          type: 'cosmic',
        });
      }
    } else if (id.includes('lunala')) {
      this.lunalaAttackTick = 25;
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.8 + Math.random() * 4.6;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 3.5,
          color: ['#4338ca', '#6366f1', '#818cf8', '#c7d2fe', '#e0e7ff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 30 + Math.floor(Math.random() * 16),
          type: 'cosmic',
        });
      }
    } else if (id.includes('solgaleo')) {
      this.solgaleoAttackTick = 25;
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.2 + Math.random() * 5.2;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3 + Math.random() * 4,
          color: ['#ea580c', '#f59e0b', '#fbbf24', '#fef08a', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 16),
          type: 'flame',
        });
      }
    } else if (id.includes('samurott')) {
      for (let i = 0; i < 50; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.5 + Math.random() * 5.0;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.8 + Math.random() * 3.8,
          color: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 0.95,
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 16),
          type: 'water',
        });
      }
    } else {
      for (let i = 0; i < 40; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 4;
        this.moveParticles.push({
          x: ox,
          y: oy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3,
          color: ['#facc15', '#fde047', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 0.95,
          life: 0,
          maxLife: 24 + Math.floor(Math.random() * 12),
          type: 'shockwave',
        });
      }
    }

    this.wake();
  }

  private drawFollower(ctx: CanvasRenderingContext2D) {
    if (!this.activeFollower) return;

    const drawX =
      (this.isMoving
        ? this.followerPos.x + (this.followerTarget.x - this.followerPos.x) * this.moveProgress
        : this.followerPos.x) * TILE_SIZE;
    const drawY =
      (this.isMoving
        ? this.followerPos.y + (this.followerTarget.y - this.followerPos.y) * this.moveProgress
        : this.followerPos.y) * TILE_SIZE;

    const isFollowerWalking =
      this.isMoving &&
      (this.followerPos.x !== this.followerTarget.x || this.followerPos.y !== this.followerTarget.y);
    const stepBob = isFollowerWalking ? Math.sin(this.moveProgress * Math.PI * 2) * 1.5 : 0;
    const idleBob = Math.sin(this.tick * 0.08) * 1.2;

    const fid = this.activeFollower.id;
    const isFlipped = this.followerFacing === 'right';

    ctx.save();
    // Authentic ground contact shadow matching placed NPC scale
    const shadowMap: Record<string, { rx: number; ry: number; yOff: number }> = {
      urshifu: { rx: 16, ry: 5.5, yOff: 16 },
      lunala: { rx: 17, ry: 5, yOff: 16 },
      solgaleo: { rx: 16, ry: 6, yOff: 16 },
      samurott: { rx: 14, ry: 5, yOff: 16 },
      necrozma: { rx: 16, ry: 6, yOff: 16 },
      groudon: { rx: 15, ry: 6, yOff: 16 },
      kyogre: { rx: 15, ry: 5.5, yOff: 16 },
      gyarados: { rx: 16, ry: 5.5, yOff: 16 },
      dialga: { rx: 14, ry: 5, yOff: 16 },
      palkia: { rx: 14, ry: 5, yOff: 16 },
      giratina: { rx: 14, ry: 5, yOff: 16 },
      zekrom: { rx: 14, ry: 5, yOff: 16 },
      reshiram: { rx: 14, ry: 5, yOff: 16 },
      rayquaza: { rx: 14, ry: 5, yOff: 16 },
      darkrai: { rx: 14, ry: 5.5, yOff: 16 },
      garchomp: { rx: 13, ry: 4.5, yOff: 16 },
      tyranitar: { rx: 13, ry: 5, yOff: 16 },
      charizard: { rx: 12, ry: 4.5, yOff: 15 },
      arceus: { rx: 12, ry: 4.5, yOff: 16 },
      mewtwo: { rx: 12, ry: 4.5, yOff: 16 },
      latios: { rx: 12, ry: 4.5, yOff: 16 },
      latias: { rx: 12, ry: 4.5, yOff: 16 },
    };
    const s = shadowMap[fid];
    if (s) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + s.yOff, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid !== 'lucario' && fid !== 'pikachu') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 14, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const shouldFlip = isFlipped && !this.pmdAnimator.isSupported(fid);
    if (shouldFlip) {
      ctx.translate(drawX + 8, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(drawX + 8), 0);
    }

    if (fid === 'pikachu') {
      drawPikachu(ctx, drawX, drawY + stepBob + idleBob);
    } else if (fid === 'lucario') {
      drawLucario(ctx, drawX, drawY + stepBob, this.tick, 1);
    } else if (fid === 'charizard') {
      if (this.charizardImg && this.charizardImg.complete) {
        // Fire Dragon tail flame ember glow
        const flamePulse = 0.45 + Math.sin(this.tick * 0.15) * 0.2;
        const flameX = drawX + 5;
        const flameY = drawY - 11 + stepBob + idleBob;
        const flameGrad = ctx.createRadialGradient(flameX, flameY, 1, flameX, flameY, 8);
        flameGrad.addColorStop(0, `rgba(255, 245, 150, ${flamePulse + 0.3})`);
        flameGrad.addColorStop(0.4, `rgba(249, 115, 22, ${flamePulse})`);
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.charizardImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'tyranitar') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;

      // Sand Stream & armored rock dust aura
      const sandPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const sandGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
      sandGrad.addColorStop(0, `rgba(217, 119, 6, ${sandPulse + 0.3})`);
      sandGrad.addColorStop(0.5, `rgba(180, 83, 9, ${sandPulse * 0.7})`);
      sandGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = sandGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Sand swirl & rock armor fragments
      if (this.tick % 16 < 11) {
        ctx.fillStyle = '#d4b182';
        ctx.fillRect(coreX + Math.cos(this.tick * 0.15) * 12, coreY - 12 - (this.tick % 10), 1.5, 1.5);
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(coreX - 6 + Math.sin(this.tick * 0.2) * 10, coreY - 6 - (this.tick % 8), 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.tyranitarAttackTick > 0) {
        action = 'shoot';
        animTick = 26 - this.tyranitarAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'tyranitar',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.tyranitarImg && this.tyranitarImg.complete) {
        ctx.drawImage(this.tyranitarImg, drawX - 13, drawY - 20 + stepBob, 42, 42);
      }
    } else if (fid === 'garchomp') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;

      // Dragon Rush / Mach supersonic slipstream aura
      const dragonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const dragonGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
      dragonGrad.addColorStop(0, `rgba(56, 189, 248, ${dragonPulse + 0.3})`);
      dragonGrad.addColorStop(0.5, `rgba(3, 105, 161, ${dragonPulse * 0.7})`);
      dragonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = dragonGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Sandstorm sparks & dragon energy
      if (this.tick % 16 < 11) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX + Math.cos(this.tick * 0.15) * 12, coreY - 12 - (this.tick % 10), 2, 1);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(coreX - 6 + Math.sin(this.tick * 0.2) * 10, coreY - 6 - (this.tick % 8), 1.5, 1.5);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.garchompAttackTick > 0) {
        action = 'shoot';
        animTick = 26 - this.garchompAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'garchomp',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.garchompImg && this.garchompImg.complete) {
        ctx.drawImage(this.garchompImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'urshifu') {
      if (this.urshifuImg && this.urshifuImg.complete) {
        ctx.drawImage(this.urshifuImg, drawX - 16, drawY - 24 + stepBob, 48, 45);
      }
    } else if (fid === 'rayquaza') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const auraCoreY = drawY - 2 + idleBob * 1.8;

      // Atmospheric Ozone Emerald Aura
      const auraPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const spatGrad = ctx.createRadialGradient(coreX, auraCoreY, 2, coreX, auraCoreY, 18);
      spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
      spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
      spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
      ctx.fillStyle = spatGrad;
      ctx.beginPath();
      ctx.arc(coreX, auraCoreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.rayquazaAttackTick > 0) {
        action = 'shoot';
        animTick = 26 - this.rayquazaAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'rayquaza',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.rayquazaImg && this.rayquazaImg.complete) {
        ctx.drawImage(this.rayquazaImg, drawX - 13, drawY - 20 + idleBob * 1.8, 42, 42);
      }
    } else if (fid === 'mewtwo') {
      if (this.mewtwoImg && this.mewtwoImg.complete) {
        const auraR = 14 + Math.sin(this.tick * 0.06) * 2;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX + 8, drawY - 2 + stepBob + idleBob, auraR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.drawImage(this.mewtwoImg, drawX - 11, drawY - 16 + stepBob + idleBob, 38, 38);
      }
    } else if (fid === 'arceus') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;

      const haloR = 14 + Math.sin(this.tick * 0.05) * 2;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(coreX, drawY - 4 + stepBob + idleBob, haloR, 0, Math.PI * 2);
      ctx.stroke();

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.arceusAttackTick > 0) {
        action = 'shoot';
        animTick = 37 - this.arceusAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'arceus',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.arceusImg && this.arceusImg.complete) {
        ctx.drawImage(this.arceusImg, drawX - 12, drawY - 18 + stepBob + idleBob, 40, 40);
      }
    } else if (fid === 'dialga') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const corePulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
      coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
      coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
      coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Roar of Time temporal distortion pulse ring
      const timePhase = (this.tick * 0.045) % 1;
      const ringRadius = 5 + timePhase * 16;
      const ringAlpha = (1 - timePhase) * 0.65;
      ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(coreX, coreY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Diamond time-sparkles floating around Dialga
      if (this.tick % 24 < 14) {
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(coreX + Math.sin(this.tick * 0.2) * 12, coreY - 4 - (this.tick % 14), 1.5, 1.5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.16) * 10, coreY + 4 - (this.tick % 10), 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.dialgaAttackTick > 0) {
        action = 'shoot';
        animTick = 28 - this.dialgaAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'dialga',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.dialgaImg && this.dialgaImg.complete) {
        ctx.drawImage(this.dialgaImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'palkia') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const spatialPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const spatGrad = ctx.createRadialGradient(coreX, coreY, 3, coreX, coreY, 18);
      spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
      spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
      spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
      ctx.fillStyle = spatGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Spacial Rend dimensional space-warp slice lines
      const rendAngle = this.tick * 0.03;
      for (let r = 0; r < 2; r++) {
        const angle = rendAngle + (r * Math.PI) / 2;
        const rx1 = coreX + Math.cos(angle) * 14;
        const ry1 = coreY + Math.sin(angle) * 8;
        const rx2 = coreX - Math.cos(angle) * 14;
        const ry2 = coreY - Math.sin(angle) * 8;
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.palkiaAttackTick > 0) {
        action = 'shoot';
        animTick = 28 - this.palkiaAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'palkia',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.palkiaImg && this.palkiaImg.complete) {
        ctx.drawImage(this.palkiaImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'reshiram') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const turbineGlow = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const tailX = drawX - 3;
      const tailY = drawY + 8 + stepBob + idleBob;
      const fireGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 14);
      fireGrad.addColorStop(0, `rgba(255, 165, 0, ${turbineGlow + 0.25})`);
      fireGrad.addColorStop(0.5, `rgba(239, 68, 68, ${turbineGlow})`);
      fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(tailX, tailY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.reshiramAttackTick > 0) {
        action = 'shoot';
        animTick = 30 - this.reshiramAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'reshiram',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.reshiramImg && this.reshiramImg.complete) {
        ctx.drawImage(this.reshiramImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'zekrom') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const turbineGlow = 0.35 + Math.sin(this.tick * 0.09) * 0.15;
      const tailX = drawX - 3;
      const tailY = drawY + 8 + stepBob + idleBob;
      const elecGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 15);
      elecGrad.addColorStop(0, `rgba(56, 189, 248, ${turbineGlow + 0.3})`);
      elecGrad.addColorStop(0.5, `rgba(2, 132, 199, ${turbineGlow})`);
      elecGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = elecGrad;
      ctx.beginPath();
      ctx.arc(tailX, tailY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic blue/cyan lightning discharges surging from the tail
      const sparkPhase = Math.floor(this.tick / 3) % 4;
      if (this.tick % 20 < 14) {
        ctx.fillStyle = sparkPhase % 2 === 0 ? '#38bdf8' : '#e0f2fe';
        ctx.fillRect(tailX + Math.sin(this.tick * 0.25) * 8, tailY - 5 - (this.tick % 14), 2, 2);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(tailX - 3 + Math.cos(this.tick * 0.2) * 9, tailY - 2 - (this.tick % 10), 1.5, 1.5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tailX + 3 - Math.sin(this.tick * 0.15) * 8, tailY - 7 - (this.tick % 12), 1.5, 1.5);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.zekromAttackTick > 0) {
        action = 'shoot';
        animTick = 28 - this.zekromAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'zekrom',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.zekromImg && this.zekromImg.complete) {
        ctx.drawImage(this.zekromImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    } else if (fid === 'giratina') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const shadowGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 17);
      shadowGrad.addColorStop(0, 'rgba(232, 121, 249, 0.5)');
      shadowGrad.addColorStop(0.6, 'rgba(112, 26, 117, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 17, 0, Math.PI * 2);
      ctx.fill();

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.giratinaAttackTick > 0) {
        action = 'shoot';
        animTick = 27 - this.giratinaAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'giratina',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.giratinaImg && this.giratinaImg.complete) {
        ctx.drawImage(this.giratinaImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.5, 42, 42);
      }
    } else if (fid === 'groudon') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const heatGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
      heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
      heatGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
      heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = heatGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Volcanic embers & magma sparks
      if (this.tick % 16 < 11) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(coreX + Math.sin(this.tick * 0.25) * 12, coreY - 12 - (this.tick % 10), 1.5, 1.5);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.18) * 10, coreY - 6 - (this.tick % 8), 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.groudonAttackTick > 0) {
        action = 'shoot';
        animTick = 28 - this.groudonAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'groudon',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.groudonImg && this.groudonImg.complete) {
        ctx.drawImage(this.groudonImg, drawX - 13, drawY - 20 + stepBob, 42, 42);
      }
    } else if (fid === 'kyogre') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const aquaPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
      aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.3})`);
      aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse})`);
      aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = aquaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Hydro droplet & bioluminescent mist bubbles
      if (this.tick % 16 < 11) {
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 12, coreY - 12 - (this.tick % 10), 1.5, 1.5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX - 6 + Math.cos(this.tick * 0.17) * 10, coreY - 6 - (this.tick % 8), 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.kyogreAttackTick > 0) {
        action = 'shoot';
        animTick = 26 - this.kyogreAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'kyogre',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.kyogreImg && this.kyogreImg.complete) {
        ctx.drawImage(this.kyogreImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.4, 42, 42);
      }
    } else if (fid === 'gyarados') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const aquaPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
      aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
      aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = aquaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();

      // Surging water spray & dragon mist droplets
      if (this.tick % 16 < 11) {
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 13, coreY - 12 - (this.tick % 10), 1.5, 1.5);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(coreX - 7 + Math.cos(this.tick * 0.17) * 11, coreY - 6 - (this.tick % 8), 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.gyaradosAttackTick > 0) {
        action = 'shoot';
        animTick = 25 - this.gyaradosAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      this.pmdAnimator.draw(
        ctx,
        'gyarados',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );
    } else if (fid === 'latios') {
      if (this.latiosImg && this.latiosImg.complete) {
        const coreX = drawX + 8;
        const coreY = drawY + stepBob + idleBob * 1.6;
        const jetGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 15);
        jetGrad.addColorStop(0, 'rgba(191, 219, 254, 0.6)');
        jetGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.35)');
        jetGrad.addColorStop(1, 'rgba(29, 78, 216, 0)');
        ctx.fillStyle = jetGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.latiosImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.6, 42, 42);
      }
    } else if (fid === 'latias') {
      if (this.latiasImg && this.latiasImg.complete) {
        const coreX = drawX + 8;
        const coreY = drawY + stepBob + idleBob * 1.6;
        const roseGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 15);
        roseGrad.addColorStop(0, 'rgba(254, 205, 211, 0.65)');
        roseGrad.addColorStop(0.6, 'rgba(244, 63, 94, 0.35)');
        roseGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
        ctx.fillStyle = roseGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.latiasImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.6, 42, 42);
      }
    } else if (fid === 'darkrai') {
      if (this.darkraiImg && this.darkraiImg.complete) {
        const coreX = drawX + 8;
        const coreY = drawY + 2 + stepBob + idleBob * 1.4;
        const voidGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 16);
        voidGrad.addColorStop(0, 'rgba(192, 132, 252, 0.55)');
        voidGrad.addColorStop(0.6, 'rgba(88, 28, 135, 0.4)');
        voidGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = voidGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.darkraiImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.4, 42, 42);
      }
    } else if (fid === 'necrozma') {
      if (this.necrozmaImg && this.necrozmaImg.complete) {
        const coreX = drawX + 8;
        const coreY = drawY + 4 + stepBob;
        const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 17);
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
        sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
        sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 17, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.necrozmaImg, drawX - 15, drawY - 21 + stepBob, 46, 43);
      }
    } else if (fid === 'lunala') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const moonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const moonGrad = ctx.createRadialGradient(coreX, coreY - 14, 2, coreX, coreY - 14, 20);
      moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
      moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
      moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
      moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 14, 20, 0, Math.PI * 2);
      ctx.fill();

      // Lunar dust sparkles & starlight constellation glints
      if (this.tick % 20 < 12) {
        ctx.fillStyle = '#c7d2fe';
        ctx.fillRect(coreX + Math.sin(this.tick * 0.22) * 14, coreY - 18 + Math.cos(this.tick * 0.22) * 8, 1.5, 1.5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX - 9 + Math.cos(this.tick * 0.16) * 12, coreY - 11 + Math.sin(this.tick * 0.16) * 6, 2, 2);
      }

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.lunalaAttackTick > 0) {
        action = 'shoot';
        animTick = 25 - this.lunalaAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'lunala',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.lunalaImg && this.lunalaImg.complete) {
        ctx.drawImage(this.lunalaImg, drawX - 15, drawY - 21 + stepBob + idleBob * 1.5, 46, 46);
      }
    } else if (fid === 'solgaleo') {
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const sunGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.45)');
      sunGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.25)');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Determine action, direction, and animation frame tick
      let action: 'idle' | 'walk' | 'shoot' = 'idle';
      let animTick = this.tick;
      if (this.solgaleoAttackTick > 0) {
        action = 'shoot';
        animTick = 25 - this.solgaleoAttackTick;
      } else if (isFollowerWalking) {
        action = 'walk';
        animTick = this.followerWalkTick;
      }
      const dir = this.followerDir || 'down';

      const pmdDrawn = this.pmdAnimator.draw(
        ctx,
        'solgaleo',
        action,
        dir,
        coreX,
        coreY,
        animTick
      );

      if (!pmdDrawn && this.solgaleoImg && this.solgaleoImg.complete) {
        ctx.drawImage(this.solgaleoImg, drawX - 15, drawY - 21 + stepBob, 46, 43);
      }
    } else if (fid === 'samurott') {
      if (this.samurottImg && this.samurottImg.complete) {
        const coreX = drawX + 8;
        const coreY = drawY + 4 + stepBob;
        const waterGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 16);
        waterGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        waterGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.45)');
        waterGrad.addColorStop(0.8, 'rgba(14, 165, 233, 0.25)');
        waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(this.samurottImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
      }
    }

    ctx.restore();

    // Cute thought emote bubble (heart or music note)
    if (this.followerEmoteTime > 0) {
      const pmdCfg = this.pmdAnimator.getConfig(fid);
      const topOffset = pmdCfg ? Math.round(pmdCfg.idle.anchorY * pmdCfg.scale + 8) : 18;
      const emoteY = drawY + 16 - topOffset;
      ctx.save();
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(drawX + 8, emoteY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#000000';
      ctx.fillText(this.followerEmote, drawX + 8, emoteY + 0.5);
      ctx.restore();
    }
  }

  private spawnRideMountFX() {
    const ox = this.playerPos.x * TILE_SIZE + 8;
    const oy = this.playerPos.y * TILE_SIZE + 16;
    for (let i = 0; i < 24; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 3;
      this.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1,
        size: 2.5 + Math.random() * 2,
        color: ['#facc15', '#38bdf8', '#c084fc', '#ffffff', '#4ade80'][Math.floor(Math.random() * 5)],
        alpha: 0.9,
        life: 0,
        maxLife: 20 + Math.floor(Math.random() * 10),
        type: 'cosmic',
      });
    }
  }

  private spawnRideTrailFX(drawX: number, drawY: number) {
    if (!this.activeFollower) return;
    const fid = this.activeFollower.id;
    const rideClass = this.getRideClass(fid);
    const tileX = Math.max(0, Math.min(this.map.w - 1, Math.round(drawX / TILE_SIZE)));
    const tileY = Math.max(0, Math.min(this.map.h - 1, Math.round(drawY / TILE_SIZE)));
    const override = townConfig.getTileOverride(tileX, tileY);
    const baseGround = this.map.ground[tileY * this.map.w + tileX];
    const isOverWater = this.currentScene === 'town' && (override === 'water' || baseGround === Tile.WATER);

    const cx = drawX + 8;
    const cy = drawY + 14;

    if (isOverWater && rideClass === 'surf') {
      // Aqua Surf water wake ripples & splash droplets
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 6,
        y: cy,
        vx: 0,
        vy: 0,
        size: 2.5,
        alpha: 0.65,
        color: 'rgba(125, 211, 252, 0.85)',
        type: 'ripple',
        life: 0,
        maxLife: 16,
      });
      this.moveParticles.push({
        x: cx + (Math.random() - 0.5) * 10,
        y: cy,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -0.8 - Math.random() * 1.2,
        size: 2,
        color: Math.random() < 0.5 ? '#38bdf8' : '#e0f2fe',
        alpha: 0.85,
        life: 0,
        maxLife: 14,
        type: 'water',
      });
      return;
    }

    if (rideClass === 'sky') {
      // Sky Soar wind / starlight slipstream particles
      const colorMap: Record<string, string[]> = {
        rayquaza: ['#34d399', '#a7f3d0', '#fef08a'],
        lunala: ['#818cf8', '#e0e7ff', '#38bdf8'],
        giratina: ['#c084fc', '#f43f5e', '#fde047'],
        reshiram: ['#fb923c', '#fef08a', '#ffffff'],
        zekrom: ['#38bdf8', '#93c5fd', '#e0f2fe'],
        charizard: ['#f97316', '#facc15', '#fed7aa'],
      };
      const palette = colorMap[fid] || ['#38bdf8', '#e0f2fe', '#c084fc'];
      this.moveParticles.push({
        x: cx + (Math.random() - 0.5) * 12,
        y: cy - 6 + (Math.random() - 0.5) * 6,
        vx: -DIRS[this.playerDir].x * (1.2 + Math.random()) + (Math.random() - 0.5) * 0.6,
        vy: -DIRS[this.playerDir].y * (1.2 + Math.random()) + (Math.random() - 0.5) * 0.6,
        size: 2 + Math.random() * 1.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.8,
        life: 0,
        maxLife: 15,
        type: 'cosmic',
      });
      return;
    }

    // Terra Charge high-speed ground dash sparks + dust puff
    this.spawnDustPuff(drawX, drawY);
    if (this.tick % 6 === 0) {
      const sparkColors: Record<string, string> = {
        dialga: '#38bdf8',
        arceus: '#facc15',
        groudon: '#f97316',
        solgaleo: '#fde047',
        lucario: '#60a5fa',
        pikachu: '#facc15',
      };
      this.moveParticles.push({
        x: cx + (Math.random() - 0.5) * 10,
        y: cy,
        vx: -DIRS[this.playerDir].x * 1.5 + (Math.random() - 0.5),
        vy: -0.6 - Math.random() * 0.8,
        size: 2,
        color: sparkColors[fid] || '#cbd5e1',
        alpha: 0.85,
        life: 0,
        maxLife: 12,
        type: 'aura',
      });
    }
  }

  private drawPokeRide(
    ctx: CanvasRenderingContext2D,
    drawX: number,
    drawY: number,
    stepFrame: number
  ) {
    if (!this.activeFollower) return;
    const fid = this.activeFollower.id;
    const isMoving = this.isMoving;
    const animTick = isMoving ? Math.floor(this.tick * 1.35) : this.tick;
    const dir = this.playerDir;
    const coreX = drawX + 8;
    const coreY = drawY + 16;

    // Special case: Pikachu sprints alongside / on Ash's shoulder with lightning aura!
    if (fid === 'pikachu') {
      drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);
      if (!this.playerPalette.isAsh) {
        const pikaOffset = this.playerDir === 'left' ? 7 : -5;
        const pikaBob = isMoving ? Math.sin(this.moveProgress * Math.PI * 2) * 1.5 : Math.sin(this.tick * 0.08) * 1.0;
        drawPikachu(ctx, drawX + pikaOffset, drawY - 14 + pikaBob);
      }
      return;
    }

    const rideClass = this.getRideClass(fid);
    const tileX = Math.max(0, Math.min(this.map.w - 1, Math.round(drawX / TILE_SIZE)));
    const tileY = Math.max(0, Math.min(this.map.h - 1, Math.round(drawY / TILE_SIZE)));
    const override = townConfig.getTileOverride(tileX, tileY);
    const baseGround = this.map.ground[tileY * this.map.w + tileX];
    const isOverWater = this.currentScene === 'town' && (override === 'water' || baseGround === Tile.WATER);

    // Step bob / ride bobbing
    const rideBob = isMoving
      ? Math.sin(this.moveProgress * Math.PI * 2) * (rideClass === 'sky' ? 2.0 : 1.5)
      : Math.sin(this.tick * 0.08) * (rideClass === 'sky' ? 1.8 : 1.0);

    // Ground shadow or water wake beneath the Pokémon mount (never on top of the Pokémon!)
    const shadowMap: Record<string, { rx: number; ry: number; yOff: number }> = {
      urshifu: { rx: 16, ry: 5.5, yOff: 16 },
      lunala: { rx: 17, ry: 5, yOff: 16 },
      solgaleo: { rx: 16, ry: 6, yOff: 16 },
      samurott: { rx: 14, ry: 5, yOff: 16 },
      necrozma: { rx: 16, ry: 6, yOff: 16 },
      groudon: { rx: 15, ry: 6, yOff: 16 },
      kyogre: { rx: 15, ry: 5.5, yOff: 16 },
      gyarados: { rx: 16, ry: 5.5, yOff: 16 },
      dialga: { rx: 15, ry: 5.5, yOff: 16 },
      palkia: { rx: 15, ry: 5.5, yOff: 16 },
      giratina: { rx: 15, ry: 5.5, yOff: 16 },
      zekrom: { rx: 15, ry: 5.5, yOff: 16 },
      reshiram: { rx: 15, ry: 5.5, yOff: 16 },
      rayquaza: { rx: 15, ry: 5.5, yOff: 16 },
      darkrai: { rx: 14, ry: 5.5, yOff: 16 },
      garchomp: { rx: 14, ry: 5, yOff: 16 },
      tyranitar: { rx: 14, ry: 5.5, yOff: 16 },
      charizard: { rx: 14, ry: 5, yOff: 15 },
      arceus: { rx: 14, ry: 5, yOff: 16 },
      mewtwo: { rx: 13, ry: 4.5, yOff: 16 },
      latios: { rx: 13, ry: 4.5, yOff: 16 },
      latias: { rx: 13, ry: 4.5, yOff: 16 },
    };
    const s = shadowMap[fid] ?? { rx: 14, ry: 5, yOff: 16 };
    ctx.fillStyle = rideClass === 'sky' ? 'rgba(15, 23, 42, 0.28)' : 'rgba(15, 23, 42, 0.42)';
    ctx.beginPath();
    ctx.ellipse(
      coreX,
      drawY + s.yOff,
      rideClass === 'sky' ? s.rx * 0.85 : s.rx,
      rideClass === 'sky' ? s.ry * 0.85 : s.ry,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Water surf wake ring when surfing on water
    if (isOverWater && rideClass === 'surf') {
      const wavePulse = 0.5 + 0.5 * Math.sin(this.tick * 0.14);
      ctx.save();
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.55 + wavePulse * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 15, s.rx + 2 + wavePulse * 2, s.ry + 1, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Determine attack tick and action
    let action: PMDAction = isMoving ? 'walk' : 'idle';
    let attackTick = 0;
    if (fid === 'rayquaza' && this.rayquazaAttackTick > 0) {
      action = 'shoot';
      attackTick = 26 - this.rayquazaAttackTick;
    } else if (fid === 'arceus' && this.arceusAttackTick > 0) {
      action = 'shoot';
      attackTick = 30 - this.arceusAttackTick;
    } else if (fid === 'reshiram' && this.reshiramAttackTick > 0) {
      action = 'shoot';
      attackTick = 28 - this.reshiramAttackTick;
    } else if (fid === 'zekrom' && this.zekromAttackTick > 0) {
      action = 'shoot';
      attackTick = 26 - this.zekromAttackTick;
    } else if (fid === 'giratina' && this.giratinaAttackTick > 0) {
      action = 'shoot';
      attackTick = 24 - this.giratinaAttackTick;
    } else if (fid === 'palkia' && this.palkiaAttackTick > 0) {
      action = 'shoot';
      attackTick = 28 - this.palkiaAttackTick;
    } else if (fid === 'dialga' && this.dialgaAttackTick > 0) {
      action = 'shoot';
      attackTick = 28 - this.dialgaAttackTick;
    } else if (fid === 'lunala' && this.lunalaAttackTick > 0) {
      action = 'shoot';
      attackTick = 25 - this.lunalaAttackTick;
    } else if (fid === 'solgaleo' && this.solgaleoAttackTick > 0) {
      action = 'shoot';
      attackTick = 25 - this.solgaleoAttackTick;
    } else if (fid === 'garchomp' && this.garchompAttackTick > 0) {
      action = 'shoot';
      attackTick = 26 - this.garchompAttackTick;
    } else if (fid === 'groudon' && this.groudonAttackTick > 0) {
      action = 'shoot';
      attackTick = 28 - this.groudonAttackTick;
    } else if (fid === 'kyogre' && this.kyogreAttackTick > 0) {
      action = 'shoot';
      attackTick = 26 - this.kyogreAttackTick;
    } else if (fid === 'tyranitar' && this.tyranitarAttackTick > 0) {
      action = 'shoot';
      attackTick = 26 - this.tyranitarAttackTick;
    } else if (fid === 'gyarados' && this.gyaradosAttackTick > 0) {
      action = 'shoot';
      attackTick = 25 - this.gyaradosAttackTick;
    }

    const curAnimTick = attackTick > 0 ? attackTick : animTick;

    // Draw background visual aura for PMD/legendary Pokémon
    if (fid === 'rayquaza') {
      const ozonePulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const ozoneGrad = ctx.createRadialGradient(coreX, coreY - 12, 3, coreX, coreY - 12, 22);
      ozoneGrad.addColorStop(0, `rgba(52, 211, 153, ${ozonePulse + 0.3})`);
      ozoneGrad.addColorStop(0.5, `rgba(16, 185, 129, ${ozonePulse})`);
      ozoneGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = ozoneGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 12, 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'arceus') {
      const cosPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const cosGrad = ctx.createRadialGradient(coreX, coreY - 12, 3, coreX, coreY - 12, 20);
      cosGrad.addColorStop(0, `rgba(254, 240, 138, ${cosPulse + 0.3})`);
      cosGrad.addColorStop(0.5, `rgba(234, 179, 8, ${cosPulse})`);
      cosGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = cosGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 12, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'dialga') {
      const corePulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const coreGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
      coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
      coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'palkia') {
      const spatialPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const spatGrad = ctx.createRadialGradient(coreX, coreY - 10, 3, coreX, coreY - 10, 20);
      spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
      spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
      spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
      ctx.fillStyle = spatGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'lunala') {
      const moonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const moonGrad = ctx.createRadialGradient(coreX, coreY - 14, 2, coreX, coreY - 14, 22);
      moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
      moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
      moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 14, 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'solgaleo') {
      const sunPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const sunGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
      sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
      sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'garchomp') {
      const dragonPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const dragonGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      dragonGrad.addColorStop(0, `rgba(56, 189, 248, ${dragonPulse + 0.3})`);
      dragonGrad.addColorStop(0.5, `rgba(3, 105, 161, ${dragonPulse * 0.7})`);
      dragonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = dragonGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'groudon') {
      const magmaPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const magmaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      magmaGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.35})`);
      magmaGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
      magmaGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = magmaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'kyogre') {
      const aquaPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
      aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
      aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = aquaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'tyranitar') {
      const sandPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const sandGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      sandGrad.addColorStop(0, `rgba(217, 119, 6, ${sandPulse + 0.35})`);
      sandGrad.addColorStop(0.5, `rgba(180, 83, 9, ${sandPulse * 0.8})`);
      sandGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = sandGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'gyarados') {
      const aquaPulse = 0.35 + Math.sin(this.tick * 0.08) * 0.15;
      const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
      aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
      aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
      aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = aquaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Anatomical per-species and per-direction saddle offsets relative to (coreX, coreY)
    const saddleConfigs: Record<
      string,
      {
        down: { dx: number; dy: number };
        side: { dx: number; dy: number };
        up: { dx: number; dy: number };
      }
    > = {
      dialga:   { down: { dx: 0, dy: -21 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -19 } },
      giratina: { down: { dx: 0, dy: -23 }, side: { dx: -8, dy: -19 }, up: { dx: 0, dy: -19 } },
      palkia:   { down: { dx: 0, dy: -21 }, side: { dx: -3, dy: -19 }, up: { dx: 0, dy: -19 } },
      rayquaza: { down: { dx: 0, dy: -21 }, side: { dx: -4, dy: -19 }, up: { dx: 0, dy: -19 } },
      lunala:   { down: { dx: 0, dy: -17 }, side: { dx: -2, dy: -16 }, up: { dx: 0, dy: -16 } },
      arceus:   { down: { dx: 0, dy: -20 }, side: { dx: -4, dy: -18 }, up: { dx: 0, dy: -19 } },
      reshiram: { down: { dx: 0, dy: -19 }, side: { dx: -5, dy: -17 }, up: { dx: 0, dy: -17 } },
      zekrom:   { down: { dx: 0, dy: -19 }, side: { dx: -5, dy: -17 }, up: { dx: 0, dy: -17 } },
      groudon:  { down: { dx: 0, dy: -22 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 } },
      kyogre:   { down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -18 } },
      charizard:{ down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -17 } },
      garchomp: { down: { dx: 0, dy: -17 }, side: { dx: -3, dy: -16 }, up: { dx: 0, dy: -16 } },
      tyranitar:{ down: { dx: 0, dy: -19 }, side: { dx: -3, dy: -18 }, up: { dx: 0, dy: -18 } },
      gyarados: { down: { dx: 0, dy: -22 }, side: { dx: -5, dy: -20 }, up: { dx: 0, dy: -21 } },
      urshifu:  { down: { dx: 0, dy: -19 }, side: { dx: -3, dy: -18 }, up: { dx: 0, dy: -18 } },
      solgaleo: { down: { dx: 0, dy: -18 }, side: { dx: -4, dy: -17 }, up: { dx: 0, dy: -17 } },
      necrozma: { down: { dx: 0, dy: -19 }, side: { dx: -3, dy: -18 }, up: { dx: 0, dy: -18 } },
      samurott: { down: { dx: 0, dy: -17 }, side: { dx: -3, dy: -16 }, up: { dx: 0, dy: -17 } },
      latios:   { down: { dx: 0, dy: -16 }, side: { dx: -2, dy: -15 }, up: { dx: 0, dy: -16 } },
      latias:   { down: { dx: 0, dy: -16 }, side: { dx: -2, dy: -15 }, up: { dx: 0, dy: -16 } },
      darkrai:  { down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -17 } },
      mewtwo:   { down: { dx: 0, dy: -17 }, side: { dx: -3, dy: -16 }, up: { dx: 0, dy: -17 } },
      lucario:  { down: { dx: 0, dy: -13 }, side: { dx: -2, dy: -12 }, up: { dx: 0, dy: -13 } },
    };

    const saddle = saddleConfigs[fid] ?? {
      down: { dx: 0, dy: -19 },
      side: { dx: -3, dy: -17 },
      up: { dx: 0, dy: -17 },
    };

    let riderDx = 0;
    let riderDy = -19;
    if (dir === 'down') {
      riderDx = saddle.down.dx;
      riderDy = saddle.down.dy;
    } else if (dir === 'up') {
      riderDx = saddle.up.dx;
      riderDy = saddle.up.dy;
    } else if (dir === 'right') {
      riderDx = saddle.side.dx;
      riderDy = saddle.side.dy;
    } else if (dir === 'left') {
      riderDx = -saddle.side.dx;
      riderDy = saddle.side.dy;
    }

    // Draw the Pokémon mount sprite at majestic 1.18x mount scale
    const pmdDrawn = this.pmdAnimator.draw(
      ctx,
      fid,
      action,
      dir,
      coreX,
      coreY,
      curAnimTick,
      1.18
    );

    // Fallback to static sprite if PMD not available or not yet loaded
    if (!pmdDrawn) {
      const isFlipped = this.playerDir === 'left';
      if (isFlipped) {
        ctx.save();
        ctx.translate(drawX + 8, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(drawX + 8), 0);
      }
      if (fid === 'charizard' && this.charizardImg?.complete) {
        ctx.drawImage(this.charizardImg, drawX - 16, drawY - 24 + rideBob, 48, 48);
      } else if (fid === 'garchomp' && this.garchompImg?.complete) {
        ctx.drawImage(this.garchompImg, drawX - 16, drawY - 23 + rideBob, 48, 48);
      } else if (fid === 'tyranitar' && this.tyranitarImg?.complete) {
        ctx.drawImage(this.tyranitarImg, drawX - 16, drawY - 23 + rideBob, 48, 48);
      } else if (fid === 'urshifu' && this.urshifuImg?.complete) {
        ctx.drawImage(this.urshifuImg, drawX - 18, drawY - 25 + rideBob, 52, 48);
      } else if (fid === 'mewtwo' && this.mewtwoImg?.complete) {
        ctx.drawImage(this.mewtwoImg, drawX - 14, drawY - 21 + rideBob, 44, 44);
      } else if (fid === 'groudon' && this.groudonImg?.complete) {
        ctx.drawImage(this.groudonImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
      } else if (fid === 'kyogre' && this.kyogreImg?.complete) {
        ctx.drawImage(this.kyogreImg, drawX - 18, drawY - 22 + rideBob, 52, 46);
      } else if (fid === 'latios' && this.latiosImg?.complete) {
        ctx.drawImage(this.latiosImg, drawX - 16, drawY - 21 + rideBob, 48, 44);
      } else if (fid === 'latias' && this.latiasImg?.complete) {
        ctx.drawImage(this.latiasImg, drawX - 16, drawY - 21 + rideBob, 48, 44);
      } else if (fid === 'darkrai' && this.darkraiImg?.complete) {
        ctx.drawImage(this.darkraiImg, drawX - 15, drawY - 23 + rideBob, 46, 46);
      } else if (fid === 'necrozma' && this.necrozmaImg?.complete) {
        ctx.drawImage(this.necrozmaImg, drawX - 17, drawY - 24 + rideBob, 50, 46);
      } else if (fid === 'solgaleo' && this.solgaleoImg?.complete) {
        ctx.drawImage(this.solgaleoImg, drawX - 17, drawY - 24 + rideBob, 50, 46);
      } else if (fid === 'samurott' && this.samurottImg?.complete) {
        ctx.drawImage(this.samurottImg, drawX - 16, drawY - 23 + rideBob, 48, 46);
      } else if (fid === 'lucario') {
        drawLucario(ctx, drawX, drawY + rideBob, this.tick, 1.1);
      }
      if (isFlipped) ctx.restore();
    }

    // Draw seated rider on the Pokémon's anatomical saddle (authentic Ash Ketchum sprite, realistic 0.60x mount scale & soft blending)
    drawRiderCharacter(
      ctx,
      this.playerPalette,
      dir,
      isMoving ? stepFrame : 0,
      coreX + riderDx,
      coreY + riderDy + rideBob * 0.75,
      0.60,
      0.82
    );
  }

  private renderMoveParticles(ctx: CanvasRenderingContext2D) {
    if (this.moveParticles.length === 0) return;
    ctx.save();
    for (const p of this.moveParticles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    ctx.restore();
  }
}
