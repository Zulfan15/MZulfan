import { DIRS, Tile, type CharacterPalette, type Dir, type Lamp, type TownData, type TownMap, type Vec } from './types';
import { createTownMap, DIGI_GATE_PORTAL } from './map';
import { createDigiMap, DIGI_COLS, DIGI_DARK_CASTLE_GATE, DIGI_KINGDOM_GATE, DIGI_PLAZA_CONSOLE, DIGI_RETURN_GATE, DIGI_ROWS, DIGI_SKY_CASTLE_GATE, DIGI_SPAWN } from './digiMap';
import { createSkyCastleMap, SKY_CASTLE_BUILDING_DOORS, SKY_CASTLE_COLS, SKY_CASTLE_LANDMARKS, SKY_CASTLE_RETURN_GATE, SKY_CASTLE_ROWS, SKY_CASTLE_SPAWN } from './skyCastleMap';
import { getSkyInteriorConfig, isSkyInteriorScene, type SkyInteriorSceneId } from './sky/skyInteriorsRegistry';
import { triggerSkyWave } from './sky/skySceneBase';
import { hasCrystalAwakened } from './skyInteriorShared';
import { createKingdomMap, KINGDOM_BUILDING_DOORS, KINGDOM_COLS, KINGDOM_LANDMARKS, KINGDOM_RETURN_GATE, KINGDOM_ROWS, KINGDOM_SPAWN } from './kingdomMap';
import { getKingdomInteriorConfig, isKingdomInteriorScene, type KingdomInteriorSceneId } from './kingdom/kingdomInteriorsRegistry';
import { triggerKingdomWave } from './kingdom/kingdomSceneBase';
import { createHarbourMap, HARBOUR_BUILDING_DOORS, HARBOUR_COLS, HARBOUR_LANDMARKS, HARBOUR_RETURN_GATE, HARBOUR_ROWS, HARBOUR_SPAWN } from './harbourMap';
import { getHarbourInteriorConfig, isHarbourInteriorScene, type HarbourInteriorSceneId } from './harbour/harbourInteriorsRegistry';
import { triggerHarbourWave } from './harbour/harbourSceneBase';
import { createDarkCastleMap, DARK_CASTLE_COLS, DARK_CASTLE_LANDMARKS, DARK_CASTLE_RETURN_GATE, DARK_CASTLE_ROWS, DARK_CASTLE_SPAWN } from './darkCastleMap';
import { CATHEDRAL_COLS, CATHEDRAL_ROWS, CATHEDRAL_SPAWN, CATHEDRAL_COLLISION, CATHEDRAL_PROPS, triggerCathedralEchoWave } from './cathedralScene';
import { FORGE_COLS, FORGE_ROWS, FORGE_SPAWN, FORGE_COLLISION, FORGE_PROPS, triggerForgePlasmaWave } from './forgeScene';
import { MANOR_COLS, MANOR_ROWS, MANOR_SPAWN, MANOR_COLLISION, MANOR_PROPS, triggerManorShadowWave } from './manorScene';
import { VAULT_COLS, VAULT_ROWS, VAULT_SPAWN, VAULT_COLLISION, VAULT_PROPS, triggerVaultChronoWave } from './vaultScene';
import { isAllSealsUnlocked } from './darkInteriorShared';
import { DigimonPatrolController } from './digimonAnimator';
import { getDigimonById, type DigimonCatalogEntry } from './digimonCatalog';
import { requestDigimonSprites, selectDigimonOverworldFrame } from './digiSpriteLoader';
import { TILE_SIZE, drawCharacter } from './sprites';
import { renderLighting } from './tiles';
import { findPath } from './pathfinding';
import { sfx } from '../game/sfx';
import { gameStore } from '../game/store';
import { getStoredActiveFollower, setStoredActiveFollower } from '../game/storage';
import { townConfig } from './townConfig';
import { TownEditor } from './townEditor';
import { HOME_COLS, HOME_ROWS, HOME_SPAWN, HOME_COLLISION, HOME2F_COLS, HOME2F_ROWS, HOME2F_SPAWN, HOME2F_COLLISION, isHomeWalkable } from './homeScene';
import { DEV_COLS, DEV_ROWS, DEV_SPAWN, DEV_COLLISION, DEV_PROPS } from './devScene';
import { LAB_COLS, LAB_ROWS, LAB_SPAWN, LAB_COLLISION, LAB_PROPS } from './labScene';
import { ARCADE_COLS, ARCADE_ROWS, ARCADE_SPAWN, ARCADE_COLLISION } from './arcadeScene';
import { RECEPTION_COLS, RECEPTION_ROWS, RECEPTION_SPAWN, RECEPTION_COLLISION, triggerHealAnimation } from './receptionScene';
import { MART_COLS, MART_ROWS, MART_SPAWN, MART_COLLISION, triggerCashRegisterAnimation } from './martScene';
import { TOWER_COLS, TOWER_ROWS, TOWER_SPAWN, TOWER_COLLISION, TOWER_PROPS } from './towerScene';
import { CAFE_COLS, CAFE_ROWS, CAFE_SPAWN, CAFE_COLLISION, triggerCafeBrewAnimation } from './cafeScene';
import { ARENA_COLS, ARENA_ROWS, ARENA_SPAWN, ARENA_COLLISION, triggerArenaBattleAnimation } from './arenaScene';
import { GARDEN_COLS, GARDEN_ROWS, GARDEN_SPAWN, GARDEN_COLLISION, triggerGardenHarvestAnimation } from './gardenScene';
import { NEIGHBOUR_COLS, NEIGHBOUR_ROWS, NEIGHBOUR_SPAWN, NEIGHBOUR_COLLISION, triggerNeighbourAnimation } from './neighbourScene';
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
import { EMPOLEON_IMAGE_SRC } from './empoleonSprite';
import { REGIGIGAS_IMAGE_SRC } from './regigigasSprite';
import { KORAIDON_IMAGE_SRC } from './koraidonSprite';
import { ETERNATUS_IMAGE_SRC } from './eternatusSprite';
import { CHARIZARD_IMAGE_SRC } from './charizardSprite';
import { TYRANITAR_IMAGE_SRC } from './tyranitarSprite';
import { GARCHOMP_IMAGE_SRC } from './garchompSprite';
import { URSHIFU_IMAGE_SRC } from './urshifuSprite';
import { GARDEVOIR_IMAGE_SRC } from './gardevoirSprite';
import { CELEBI_IMAGE_SRC } from './celebiSprite';
import { LUGIA_IMAGE_SRC } from './lugiaSprite';
import { ARCHALUDON_IMAGE_SRC } from './archaludonSprite';
import { GOUGINGFIRE_IMAGE_SRC } from './gougingfireSprite';
import { GREATTUSK_IMAGE_SRC } from './greattuskSprite';
import { KYUREM_IMAGE_SRC } from './kyuremSprite';
import { SALAMENCE_IMAGE_SRC } from './salamenceSprite';
import { PokemonPMDAnimator } from './pokemonPMDAnimator';
import { drawCelebiForestAura as drawCelebiForestAuraHelper, drawFollower as drawFollowerHelper, drawGardevoirPsychicAura as drawGardevoirPsychicAuraHelper, drawPokeRide as drawPokeRideHelper, findActiveResonance as findActiveResonanceHelper, renderMoveParticles as renderMoveParticlesHelper, spawnRideMountFX as spawnRideMountFXHelper, spawnRideTrailFX as spawnRideTrailFXHelper, triggerResonanceBurst as triggerResonanceBurstHelper, triggerSignatureMove as triggerSignatureMoveHelper, type ResonanceMatch, type TownPokemonFxHost } from './townPokemonFx';
import { renderOverworldPokemonNPCs, type TownPokemonOverworldHost } from './townPokemonOverworld';
import { buildGhostTrainers, findGhostAtTile, renderGhostTrainers, updateGhostTrainers, type GhostTrainerNpc } from './ghostTrainers';
import type { GuestbookEntry } from '../lib/socialClient';
import { applyInteriorResizeZoom, renderInteriorScene } from './core/interiorSceneRenderer';
import { getTileCollisionInfoHelper, handleXrayClickHelper, renderXrayOverlayHelper } from './core/xrayInspector';
import { getActiveLampsHelper, initParticlesHelper, renderNightBuildingWindowsHelper, renderPortalPulseOverlayHelper, renderWeatherParticlesHelper } from './core/weatherAndNightFx';
import { walkToObjectHelper } from './core/objectNavigation';
import { updateDomLabelsHelper } from './core/domLabels';
import { interactFacingHelper, triggerPendingTargetHelper } from './core/sceneInteractions';
import {
  getFoundHiddenPokeballs,
  HIDDEN_POKEBALL_ITEMS,
  SUMMIT_VISTA_POINT,
} from './world/townGeography';
import { renderTownLivingWaterAndWildlife } from './world/townLivingFx';

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
  type: 'flame' | 'sand' | 'claw' | 'water' | 'aura' | 'psychic' | 'cosmic' | 'shockwave' | 'spark';
  rot?: number;
  rotSpeed?: number;
}

const MEWTWO_IMAGE_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwBAMAAAA0zul4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEUAAAD4+Pjg4PC4sMi4iMCYiJh4gHiIWJBQWFBAQEAAAABuf+WbAAAAAXRSTlMAQObYZgAAAWxJREFUeNrt2DGtJDEQRdGi8Ck8Co+CKRSFT8EUmkJRuChX7vGMg81Wqk52bmjpSC+wHDi+ffv27dsz8TTEPAvxhvAgXASJp+CvBEg+MIBGqNWvfCCMMWmC6G/HWDVBtHvB4ybRDfWGzDGA6IHoZLPhntkNbXNcI7S82OUDiUYY3LCuHx9YdMJAyoufn+1u2QpJSYzlKs8F6ISSvILMa8sx6IOB064igkziyDYYVJXzNfXAQQ88Y6WrktjRDiVd3u5s7YJkZUp52WfqHLMNkllSpsHmuNEEwS5LEhFY3GdzLtcCKVd5zqkXUQHzrgdil1RjjCUJpJpv1wFxvtySKVEfSPTA5TYsSSq9JEQPDD6wrC1rsx4Y3NvGmKU3NBGNMJBdc25YSmUzDMisDV2iD54+0jZOoh9WJuDlAqIbcruIKNtFRDcklzsvJf3wdjvsfhhAPAtPID0KKaX0KJRSxIMwQI/BQ+Nf4f/7/fYHGujw6q4E2bwAAAAASUVORK5CYII=';

const ARCEUS_IMAGE_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAMFBMVEX///+EhIyEcwDexTq9pRkA5gAAnAD/71rFADp7hJQ6QlJaWmNaY3O1tb3m5u8QEBBxRTodAAAAAXRSTlMAQObYZgAAA4dJREFUeNrl1tuO4zgMRVGRotMdWdT5/78dUdQlU6lJ2W0/DND7JQgMLFCxIjt8jCjcGiludUkdRMH/EyStERGoADd5xaJSUHTfw0vaOueZ5p6BNTcd65dO3K3BKRUHXbCKd87UX+KcwQtcaa75xf2AR78MXEFTSln/pWEUDkTTyyi1qvV0cMs5NiAXCznDP1Itz5Jxp0H83raE5lYMreQcwrkIubb93h6+4pcVwgrnQ6o9Hjn7whEuB7UZt2Sge9fFlLYN1YPeBCLDPCXcdNQQGZdIbwFTSmipGriHO6JiGciRb+DM66KB17mZgVdFcmmQqKD3h152R9eIIrHFF0BPVQHZHiYCCBbznw+oukPEQNN6ODto8tGKZR6ziGkLPCkmNY/mDxgGuEThc2AtlREcvDaipufwtIEcLohImpI2TAGECqL2DXhwa+L5TE/3msLA1z3IvtVjDce8BjYPEr1XEbGHHzwiwtNBC/u+w2J5BZkf2xajCHDgP4xsnpbWXnoAD9FW+ng8Ioz7GUTKOeXsjIueNpEr55l2wFvge5VyjYFD4F7H0Q+gNk4ABHDEEW7XCVJZsWWfjTtwQDhnqWZkE7unvlTLTBYuRFSIUemP3jr/DETpuQtENw30xo9I3punnasBKZXRGBQQE0WEF7jX1K9/JaHTUzJuzVsW2UDMO47ympML1M75dIvH+gKx0L0B6rOG1iu4q1UKpkZEqKkuEcwTdE+zc+EtOLi8GkhbZUyvw0PmKFDN2UCEbwKLKqZHpAAHwD31HLRgYG659xZEGErjnhXAD+khLs+bIBC+bxcx0PIRDGQW6IhZRKDdi/jE+YiC5QUDTRC8ctAByrqvn0csZYIWEExh6XYeA07s84g0vApum3EWLLucM9YmxAFQINOrIM/piRyETs/BH9YsiNJA9r/t9GpwUDuoCAfWvAdE9sMFMHB5NO8a9zP259BAF23VsYvoYDSQuT87D4EIfcT+LEd4FW2hHPsNORRC8BERXERYIuwKTnkevgd3m1CioW0FhDMij/23jjeqoL0tAO20pXIGfH/mgtrrwhb7SQw9AQa8gWxcBR8VtJ6++w+HLyDPt4XzoIcvX62+cYqB7l1o/vtcLPeA3Ef0KFwV2UBpIJuYL4LgJiKgiDh4XSQaz7O7QNwPWmxrRrgN9BERbhAHwneDkJhzuB7wenrcGv99YPhv7x9JGV04/CcT4gAAAABJRU5ErkJggg==';

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

export class TownEngine implements TownPokemonFxHost, TownPokemonOverworldHost {
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  map: TownMap;
  callbacks: EngineCallbacks;
  currentScene: 'town' | 'home' | 'dev' | 'lab' | 'arcade' | 'reception' | 'mart' | 'tower' | 'cafe' | 'arena' | 'garden' | 'neighbour' | 'digimon' | 'kingdom' | 'harbour' | 'sky-castle' | 'dark-castle' | 'dark-cathedral' | 'dark-forge' | 'dark-manor' | 'dark-vault' | KingdomInteriorSceneId | HarbourInteriorSceneId | SkyInteriorSceneId = 'town';
  homeFloor: '1F' | '2F' = '1F';
  public activeTowerFloor: '1F' | '2F' | '3F' | '4F' = '1F';
  devBackgroundCanvas: HTMLCanvasElement | null = null;
  labBackgroundCanvas: HTMLCanvasElement | null = null;
  arcadeBackgroundCanvas: HTMLCanvasElement | null = null;
  gardevoirImg: HTMLImageElement | null = null;
  celebiImg: HTMLImageElement | null = null;
  lugiaImg: HTMLImageElement | null = null;
  archaludonImg: HTMLImageElement | null = null;
  gougingfireImg: HTMLImageElement | null = null;
  greattuskImg: HTMLImageElement | null = null;
  kyuremImg: HTMLImageElement | null = null;
  salamenceImg: HTMLImageElement | null = null;
  charizardImg: HTMLImageElement | null = null;
  tyranitarImg: HTMLImageElement | null = null;
  garchompImg: HTMLImageElement | null = null;
  urshifuImg: HTMLImageElement | null = null;
  blastoiseImg: HTMLImageElement | null = null;
  arceusImg: HTMLImageElement | null = null;
  mewtwoImg: HTMLImageElement | null = null;
  reshiramImg: HTMLImageElement | null = null;
  zekromImg: HTMLImageElement | null = null;
  giratinaImg: HTMLImageElement | null = null;
  palkiaImg: HTMLImageElement | null = null;
  dialgaImg: HTMLImageElement | null = null;
  rayquazaImg: HTMLImageElement | null = null;
  groudonImg: HTMLImageElement | null = null;
  kyogreImg: HTMLImageElement | null = null;
  latiosImg: HTMLImageElement | null = null;
  latiasImg: HTMLImageElement | null = null;
  darkraiImg: HTMLImageElement | null = null;
  necrozmaImg: HTMLImageElement | null = null;
  lunalaImg: HTMLImageElement | null = null;
  solgaleoImg: HTMLImageElement | null = null;
  samurottImg: HTMLImageElement | null = null;
  empoleonImg: HTMLImageElement | null = null;
  regigigasImg: HTMLImageElement | null = null;
  koraidonImg: HTMLImageElement | null = null;
  eternatusImg: HTMLImageElement | null = null;
  receptionBackgroundCanvas: HTMLCanvasElement | null = null;
  martBackgroundCanvas: HTMLCanvasElement | null = null;
  towerBackgroundCanvas: HTMLCanvasElement | null = null;
  cafeBackgroundCanvas: HTMLCanvasElement | null = null;
  arenaBackgroundCanvas: HTMLCanvasElement | null = null;
  gardenBackgroundCanvas: HTMLCanvasElement | null = null;
  neighbourBackgroundCanvas: HTMLCanvasElement | null = null;
  townBackgroundCanvas: HTMLCanvasElement | null = null;
  private digiBackgroundCanvas: HTMLCanvasElement | null = null;
  private kingdomBackgroundCanvas: HTMLCanvasElement | null = null;
  private harbourBackgroundCanvas: HTMLCanvasElement | null = null;
  private skyCastleBackgroundCanvas: HTMLCanvasElement | null = null;
  private darkCastleBackgroundCanvas: HTMLCanvasElement | null = null;
  digimonPatrol = new DigimonPatrolController();
  lastDomLabelKey = '';
  public townAtmosphere: TownAtmosphere = 'day';
  public weather: TownWeather = 'petals';
  editor: TownEditor;

  // X-Ray Collision Inspector Mode
  private xrayMode: boolean = false;
  xrayHoverTile: Vec | null = null;

  // Player state
  playerPos: Vec = { x: 18, y: 12 };
  playerTarget: Vec = { x: 18, y: 12 };
  playerDir: Dir = 'down';
  isMoving = false;
  isJumpingLedge = false;
  moveProgress = 0; // 0 to 1 between tiles
  private stepCount = 0;
  private path: Vec[] = [];
  pendingTarget: string | null = null;
  private marker: Vec | null = null;
  particles: WeatherParticle[] = [];
  fireflies: WeatherParticle[] = [];
  private heldDirs: Dir[] = [];
  private bufferedDir: Dir | null = null;
  private isShiftHeld = false;
  private isBikeActive = false;
  private isRidingPokemon = false;
  private coffeeBoostTimer = 0;
  private lastResonanceKey = '';
  ghostTrainers: GhostTrainerNpc[] = [];
  ghostTrainersEnabled = true;
  private dustPuffs: DustPuff[] = [];
  private flyBurstParticles: FlyParticle[] = [];
  private lastBumpTime = 0;

  // Active Walking Follower Pokémon
  public activeFollower: FollowerPokemon | null = null;
  followerPos: Vec = { x: 18, y: 13 };
  followerTarget: Vec = { x: 18, y: 13 };
  private followerTrail: Vec[] = [];
  followerDir: Dir = 'down';
  followerFacing: 'left' | 'right' = 'right';
  followerEmoteTime = 0;
  followerEmote = '❤️';
  followerWalkTick = 0;
  lucarioAttackTick = 0;
  mewtwoAttackTick = 0;
  rayquazaAttackTick = 0;
  arceusAttackTick = 0;
  reshiramAttackTick = 0;
  zekromAttackTick = 0;
  giratinaAttackTick = 0;
  palkiaAttackTick = 0;
  dialgaAttackTick = 0;
  necrozmaAttackTick = 0;
  lunalaAttackTick = 0;
  solgaleoAttackTick = 0;
  garchompAttackTick = 0;
  groudonAttackTick = 0;
  kyogreAttackTick = 0;
  tyranitarAttackTick = 0;
  gyaradosAttackTick = 0;
  snorlaxAttackTick = 0;
  samurottAttackTick = 0;
  empoleonAttackTick = 0;
  regigigasAttackTick = 0;
  koraidonAttackTick = 0;
  eternatusAttackTick = 0;
  urshifuAttackTick = 0;
  darkraiAttackTick = 0;
  latiosAttackTick = 0;
  latiasAttackTick = 0;
  charizardAttackTick = 0;
  gardevoirAttackTick = 0;
  celebiAttackTick = 0;
  lugiaAttackTick = 0;
  archaludonAttackTick = 0;
  gougingfireAttackTick = 0;
  greattuskAttackTick = 0;
  kyuremAttackTick = 0;
  salamenceAttackTick = 0;
  pmdAnimator = new PokemonPMDAnimator();

  // Signature Move Visual FX & Camera Shake
  moveParticles: MoveParticle[] = [];
  cameraShakeTime = 0;
  cameraShakeIntensity = 0;

  playerPalette: CharacterPalette = {
    skin: '#fecda5',
    hair: '#f86800',
    shirt: '#1d4ed8',
    pants: '#384870',
    shoes: '#202020',
    cap: '#de1e1b',
    isAsh: true,
  };

  // Rendering & Camera
  zoom = 3;
  defaultZoom = 2;
  private isCustomZoom = false;
  private zoomTimeout: number | null = null;
  cameraX = 0;
  cameraY = 0;
  tick = 0;
  private isAwake = false;
  private rafId: number | null = null;
  private lastTime = 0;

  // Cleanup handlers
  private unbindEvents: (() => void)[] = [];
  private loadingWorldBg = new Set<string>();

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
    this.map =
      initialSpawn === 'digimon'
        ? createDigiMap(townData)
        : initialSpawn === 'kingdom'
          ? createKingdomMap(townData)
          : initialSpawn === 'harbour'
            ? createHarbourMap(townData)
            : initialSpawn === 'sky-castle'
              ? createSkyCastleMap(townData)
              : initialSpawn === 'dark-castle'
                ? createDarkCastleMap(townData)
                : createTownMap(townData);

    // Clear base collision on already-collected Hidden PokéBalls in Town overworld
    if (
      initialSpawn !== 'digimon' &&
      initialSpawn !== 'kingdom' &&
      initialSpawn !== 'harbour' &&
      initialSpawn !== 'sky-castle' &&
      initialSpawn !== 'dark-castle'
    ) {
      const foundBalls = getFoundHiddenPokeballs();
      for (const item of HIDDEN_POKEBALL_ITEMS) {
        if (foundBalls.has(item.id) && item.x >= 0 && item.x < this.map.w && item.y >= 0 && item.y < this.map.h) {
          this.map.collision[item.y * this.map.w + item.x] = 0;
        }
      }
    }

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
    } else if (initialSpawn === 'digimon') {
      this.currentScene = 'digimon';
      let sx = DIGI_SPAWN.x;
      let sy = DIGI_SPAWN.y;
      let sdir: Dir = DIGI_SPAWN.dir;
      const digiRespawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('digimon:respawn') : null;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('digimon:respawn');
      if (digiRespawn) {
        const [rx, ry, rdir] = digiRespawn.split(',');
        if (!isNaN(Number(rx)) && !isNaN(Number(ry))) {
          sx = Number(rx);
          sy = Number(ry);
          if (rdir === 'up' || rdir === 'down' || rdir === 'left' || rdir === 'right') sdir = rdir;
        }
      } else if (typeof window !== 'undefined' && window.location.search.includes('from=kingdom')) {
        sx = 20;
        sy = 38;
        sdir = 'up';
      } else if (typeof window !== 'undefined' && window.location.search.includes('from=dark-castle')) {
        sx = 8;
        sy = 22;
        sdir = 'right';
      } else if (typeof window !== 'undefined' && window.location.search.includes('from=sky-castle')) {
        sx = 33;
        sy = 22;
        sdir = 'left';
      }
      this.playerPos = { x: sx, y: sy };
      this.playerTarget = { x: sx, y: sy };
      this.playerDir = sdir;
      this.cameraX = (DIGI_COLS * TILE_SIZE) / 2;
      this.cameraY = (DIGI_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'kingdom') {
      this.currentScene = 'kingdom';
      let kx = KINGDOM_SPAWN.x;
      let ky = KINGDOM_SPAWN.y;
      let kdir: Dir = KINGDOM_SPAWN.dir;
      const kingdomRespawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('kingdom:respawn') : null;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('kingdom:respawn');
      if (kingdomRespawn) {
        const [rx, ry, rdir] = kingdomRespawn.split(',');
        if (!isNaN(Number(rx)) && !isNaN(Number(ry))) {
          kx = Number(rx);
          ky = Number(ry);
          if (rdir === 'up' || rdir === 'down' || rdir === 'left' || rdir === 'right') kdir = rdir;
        }
      } else if (typeof window !== 'undefined') {
        if (window.location.search.includes('from=harbour')) {
          kx = 22;
          ky = 57;
          kdir = 'up';
        } else {
          for (const [slug, door] of Object.entries(KINGDOM_BUILDING_DOORS)) {
            if (window.location.search.includes(`from=${slug}`)) {
              kx = door.spawn.x;
              ky = door.spawn.y;
              kdir = door.spawn.dir;
              break;
            }
          }
        }
      }
      this.playerPos = { x: kx, y: ky };
      this.playerTarget = { x: kx, y: ky };
      this.playerDir = kdir;
      this.cameraX = (KINGDOM_COLS * TILE_SIZE) / 2;
      this.cameraY = (KINGDOM_ROWS * TILE_SIZE) / 2;
    } else if (isKingdomInteriorScene(initialSpawn)) {
      const cfg = getKingdomInteriorConfig(initialSpawn)!;
      this.currentScene = cfg.id;
      this.playerPos = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerTarget = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerDir = cfg.spawn.dir;
      this.cameraX = (cfg.cols * TILE_SIZE) / 2;
      this.cameraY = (cfg.rows * TILE_SIZE) / 2;
      for (const pkmId of cfg.pmPreloads) {
        this.pmdAnimator.preloadPokemon(pkmId);
      }
      for (const digiId of cfg.digimonPreloads) {
        requestDigimonSprites(digiId, () => this.wake(), 'overworld');
      }
    } else if (initialSpawn === 'harbour') {
      this.currentScene = 'harbour';
      let hx = HARBOUR_SPAWN.x;
      let hy = HARBOUR_SPAWN.y;
      let hdir: Dir = HARBOUR_SPAWN.dir;
      const harbourRespawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('harbour:respawn') : null;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('harbour:respawn');
      if (harbourRespawn) {
        const [rx, ry, rdir] = harbourRespawn.split(',');
        if (!isNaN(Number(rx)) && !isNaN(Number(ry))) {
          hx = Number(rx);
          hy = Number(ry);
          if (rdir === 'up' || rdir === 'down' || rdir === 'left' || rdir === 'right') hdir = rdir;
        }
      } else if (typeof window !== 'undefined') {
        for (const [slug, door] of Object.entries(HARBOUR_BUILDING_DOORS)) {
          if (window.location.search.includes(`from=${slug}`)) {
            hx = door.spawn.x;
            hy = door.spawn.y;
            hdir = door.spawn.dir;
            break;
          }
        }
      }
      this.playerPos = { x: hx, y: hy };
      this.playerTarget = { x: hx, y: hy };
      this.playerDir = hdir;
      this.cameraX = (HARBOUR_COLS * TILE_SIZE) / 2;
      this.cameraY = (HARBOUR_ROWS * TILE_SIZE) / 2;
    } else if (isHarbourInteriorScene(initialSpawn)) {
      const cfg = getHarbourInteriorConfig(initialSpawn)!;
      this.currentScene = cfg.id;
      this.playerPos = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerTarget = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerDir = cfg.spawn.dir;
      this.cameraX = (cfg.cols * TILE_SIZE) / 2;
      this.cameraY = (cfg.rows * TILE_SIZE) / 2;
      for (const pkmId of cfg.pmPreloads) {
        this.pmdAnimator.preloadPokemon(pkmId);
      }
      for (const digiId of cfg.digimonPreloads) {
        requestDigimonSprites(digiId, () => this.wake(), 'overworld');
      }
    } else if (initialSpawn === 'sky-castle') {
      this.currentScene = 'sky-castle';
      let sx = SKY_CASTLE_SPAWN.x;
      let sy = SKY_CASTLE_SPAWN.y;
      let sdir: Dir = SKY_CASTLE_SPAWN.dir;
      const skyRespawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sky-castle:respawn') : null;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('sky-castle:respawn');
      if (skyRespawn) {
        const [rx, ry, rdir] = skyRespawn.split(',');
        if (!isNaN(Number(rx)) && !isNaN(Number(ry))) {
          sx = Number(rx);
          sy = Number(ry);
          if (rdir === 'up' || rdir === 'down' || rdir === 'left' || rdir === 'right') sdir = rdir;
        }
      } else if (typeof window !== 'undefined') {
        for (const [slug, door] of Object.entries(SKY_CASTLE_BUILDING_DOORS)) {
          if (window.location.search.includes(`from=${slug}`)) {
            sx = door.spawn.x;
            sy = door.spawn.y;
            sdir = door.spawn.dir;
            break;
          }
        }
      }
      this.playerPos = { x: sx, y: sy };
      this.playerTarget = { x: sx, y: sy };
      this.playerDir = sdir;
      this.cameraX = (SKY_CASTLE_COLS * TILE_SIZE) / 2;
      this.cameraY = (SKY_CASTLE_ROWS * TILE_SIZE) / 2;
    } else if (isSkyInteriorScene(initialSpawn)) {
      const cfg = getSkyInteriorConfig(initialSpawn)!;
      this.currentScene = cfg.id;
      this.playerPos = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerTarget = { x: cfg.spawn.x, y: cfg.spawn.y };
      this.playerDir = cfg.spawn.dir;
      this.cameraX = (cfg.cols * TILE_SIZE) / 2;
      this.cameraY = (cfg.rows * TILE_SIZE) / 2;
      for (const pkmId of cfg.pmPreloads) {
        this.pmdAnimator.preloadPokemon(pkmId);
      }
      for (const digiId of cfg.digimonPreloads) {
        requestDigimonSprites(digiId, () => this.wake(), 'overworld');
      }
    } else if (initialSpawn === 'dark-castle') {
      this.currentScene = 'dark-castle';
      let dx = DARK_CASTLE_SPAWN.x;
      let dy = DARK_CASTLE_SPAWN.y;
      let ddir: Dir = DARK_CASTLE_SPAWN.dir;
      const darkRespawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dark-castle:respawn') : null;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('dark-castle:respawn');
      if (darkRespawn) {
        const [rx, ry, rdir] = darkRespawn.split(',');
        if (!isNaN(Number(rx)) && !isNaN(Number(ry))) {
          dx = Number(rx);
          dy = Number(ry);
          if (rdir === 'up' || rdir === 'down' || rdir === 'left' || rdir === 'right') ddir = rdir;
        }
      } else if (typeof window !== 'undefined') {
        if (window.location.search.includes('from=cathedral')) { dx = 9; dy = 21; ddir = 'down'; }
        else if (window.location.search.includes('from=forge')) { dx = 33; dy = 25; ddir = 'down'; }
        else if (window.location.search.includes('from=manor')) { dx = 11; dy = 52; ddir = 'down'; }
        else if (window.location.search.includes('from=vault')) { dx = 34; dy = 50; ddir = 'down'; }
      }
      this.playerPos = { x: dx, y: dy };
      this.playerTarget = { x: dx, y: dy };
      this.playerDir = ddir;
      this.cameraX = (DARK_CASTLE_COLS * TILE_SIZE) / 2;
      this.cameraY = (DARK_CASTLE_ROWS * TILE_SIZE) / 2;
    } else if (initialSpawn === 'dark-cathedral') {
      this.currentScene = 'dark-cathedral';
      this.playerPos = { x: CATHEDRAL_SPAWN.x, y: CATHEDRAL_SPAWN.y };
      this.playerTarget = { x: CATHEDRAL_SPAWN.x, y: CATHEDRAL_SPAWN.y };
      this.playerDir = CATHEDRAL_SPAWN.dir;
      this.cameraX = (CATHEDRAL_COLS * TILE_SIZE) / 2;
      this.cameraY = (CATHEDRAL_ROWS * TILE_SIZE) / 2;
      this.pmdAnimator.preloadPokemon('lunala');
      this.pmdAnimator.preloadPokemon('necrozma');
      this.pmdAnimator.preloadPokemon('gardevoir');
    } else if (initialSpawn === 'dark-forge') {
      this.currentScene = 'dark-forge';
      this.playerPos = { x: FORGE_SPAWN.x, y: FORGE_SPAWN.y };
      this.playerTarget = { x: FORGE_SPAWN.x, y: FORGE_SPAWN.y };
      this.playerDir = FORGE_SPAWN.dir;
      this.cameraX = (FORGE_COLS * TILE_SIZE) / 2;
      this.cameraY = (FORGE_ROWS * TILE_SIZE) / 2;
      this.pmdAnimator.preloadPokemon('charizard');
      this.pmdAnimator.preloadPokemon('groudon');
      requestDigimonSprites('machinedramon', () => this.wake(), 'overworld');
    } else if (initialSpawn === 'dark-manor') {
      this.currentScene = 'dark-manor';
      this.playerPos = { x: MANOR_SPAWN.x, y: MANOR_SPAWN.y };
      this.playerTarget = { x: MANOR_SPAWN.x, y: MANOR_SPAWN.y };
      this.playerDir = MANOR_SPAWN.dir;
      this.cameraX = (MANOR_COLS * TILE_SIZE) / 2;
      this.cameraY = (MANOR_ROWS * TILE_SIZE) / 2;
      this.pmdAnimator.preloadPokemon('darkrai');
      this.pmdAnimator.preloadPokemon('giratina');
      this.pmdAnimator.preloadPokemon('urshifu');
    } else if (initialSpawn === 'dark-vault') {
      this.currentScene = 'dark-vault';
      this.playerPos = { x: VAULT_SPAWN.x, y: VAULT_SPAWN.y };
      this.playerTarget = { x: VAULT_SPAWN.x, y: VAULT_SPAWN.y };
      this.playerDir = VAULT_SPAWN.dir;
      this.cameraX = (VAULT_COLS * TILE_SIZE) / 2;
      this.cameraY = (VAULT_ROWS * TILE_SIZE) / 2;
      this.pmdAnimator.preloadPokemon('dialga');
      this.pmdAnimator.preloadPokemon('celebi');
      requestDigimonSprites('chronomon_dm', () => this.wake(), 'overworld');
    } else {
      this.currentScene = 'town';
      let spawnX = 48;
      let spawnY = 28;
      let spawnDir: Dir = 'down';
      let fromExitRespawn = false;

      const exitSpawn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('town:respawn') : null;
      const lastPlace = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('town:last_place') : null;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('town:respawn');
        sessionStorage.removeItem('town:last_place');
      }

      if (exitSpawn) {
        fromExitRespawn = true;
        const parts = exitSpawn.split(',');
        const sx = Number(parts[0]);
        const sy = Number(parts[1]);
        const sdir = parts[2] as Dir | undefined;
        if (!isNaN(sx) && !isNaN(sy)) {
          spawnX = sx;
          spawnY = sy;
          if (sdir === 'up' || sdir === 'down' || sdir === 'left' || sdir === 'right') {
            spawnDir = sdir;
          }
        }
      } else if (typeof window !== 'undefined' && window.location.search.includes('from=digimon')) {
        const digiReturn = this.map.spawns.digimon;
        spawnX = digiReturn?.x ?? DIGI_GATE_PORTAL.returnSpawn.x;
        spawnY = digiReturn?.y ?? DIGI_GATE_PORTAL.returnSpawn.y;
        spawnDir = digiReturn?.dir ?? 'up';
      } else if (lastPlace && lastPlace !== 'town' && initialSpawn === 'town') {
        fromExitRespawn = true;
        const parts = townConfig.getExitRespawnForPlace(lastPlace).split(',');
        const sx = Number(parts[0]);
        const sy = Number(parts[1]);
        const sdir = parts[2] as Dir | undefined;
        if (!isNaN(sx) && !isNaN(sy)) {
          spawnX = sx;
          spawnY = sy;
          if (sdir === 'up' || sdir === 'down' || sdir === 'left' || sdir === 'right') {
            spawnDir = sdir;
          }
        }
      } else {
        const spawn = this.map.spawns[initialSpawn] || this.map.spawns.town;
        spawnX = spawn?.x ?? 48;
        spawnY = spawn?.y ?? 28;
        spawnDir = spawn?.dir ?? 'down';
      }

      if (fromExitRespawn) {
        const safePos = this.resolveSafeTownRespawn(spawnX, spawnY);
        spawnX = safePos.x;
        spawnY = safePos.y;
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
      this.empoleonImg = new Image();
      this.empoleonImg.src = EMPOLEON_IMAGE_SRC;
      this.regigigasImg = new Image();
      this.regigigasImg.src = REGIGIGAS_IMAGE_SRC;
      this.koraidonImg = new Image();
      this.koraidonImg.src = KORAIDON_IMAGE_SRC;
      this.eternatusImg = new Image();
      this.eternatusImg.src = ETERNATUS_IMAGE_SRC;
      this.charizardImg = new Image();
      this.charizardImg.src = CHARIZARD_IMAGE_SRC;
      this.garchompImg = new Image();
      this.garchompImg.src = GARCHOMP_IMAGE_SRC;
      this.urshifuImg = new Image();
      this.urshifuImg.src = URSHIFU_IMAGE_SRC;
      this.gardevoirImg = new Image();
      this.gardevoirImg.src = GARDEVOIR_IMAGE_SRC;
      this.celebiImg = new Image();
      this.celebiImg.src = CELEBI_IMAGE_SRC;
      this.lugiaImg = new Image();
      this.lugiaImg.src = LUGIA_IMAGE_SRC;
      this.archaludonImg = new Image();
      this.archaludonImg.src = ARCHALUDON_IMAGE_SRC;
      this.gougingfireImg = new Image();
      this.gougingfireImg.src = GOUGINGFIRE_IMAGE_SRC;
      this.greattuskImg = new Image();
      this.greattuskImg.src = GREATTUSK_IMAGE_SRC;
      this.kyuremImg = new Image();
      this.kyuremImg.src = KYUREM_IMAGE_SRC;
      this.salamenceImg = new Image();
      this.salamenceImg.src = SALAMENCE_IMAGE_SRC;
    }
    townConfig.subscribe(() => {
      this.invalidateBackgroundCanvas();
      this.updateDomLabels(true);
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

      const savedFollower =
        this.currentScene === 'digimon' ||
          this.currentScene === 'kingdom' ||
          this.currentScene === 'harbour' ||
          this.currentScene === 'sky-castle' ||
          this.currentScene === 'dark-castle'
          ? (() => {
            const digiSaved = localStorage.getItem('digimon:active_companion');
            return digiSaved === 'none'
              ? null
              : digiSaved || getStoredActiveFollower();
          })()
          : getStoredActiveFollower();
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
    initParticlesHelper(this);
  }

  public destroy() {
    this.sleep();
    this.unbindEvents.forEach((u) => u());
    this.unbindEvents = [];
  }

  isWorldScene(): boolean {
    return (
      this.currentScene === 'town' ||
      this.currentScene === 'digimon' ||
      this.currentScene === 'kingdom' ||
      this.currentScene === 'harbour' ||
      this.currentScene === 'sky-castle' ||
      this.currentScene === 'dark-castle'
    );
  }

  public invalidateBackgroundCanvas() {
    this.townBackgroundCanvas = null;
    this.digiBackgroundCanvas = null;
    this.kingdomBackgroundCanvas = null;
    this.harbourBackgroundCanvas = null;
    this.skyCastleBackgroundCanvas = null;
    this.darkCastleBackgroundCanvas = null;
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
    this.zoom = Math.max(0.35 * dpr, Math.min(5.0 * dpr, zoom));
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

  public getTileCollisionInfo(x: number, y: number) {
    return getTileCollisionInfoHelper(this, x, y);
  }

  public handleXrayClick(tileX: number, tileY: number, forceDelete = false): void {
    handleXrayClickHelper(this, tileX, tileY, forceDelete);
  }

  public renderXrayOverlay(ctx: CanvasRenderingContext2D): void {
    renderXrayOverlayHelper(this, ctx);
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
        'celebi',
        'lugia',
        'kyurem',
        'salamence',
        'latios',
        'latias',
        'mewtwo',
        'darkrai',
        'necrozma',
        'eternatus',
        'wargreymon',
        'omnimon',
        'gallantmon',
        'imperialdramon',
        'imperialdramonpm',
        'beelzemon',
        'seraphimon',
        'valkyrimon',
        'ophanimon',
        'azulongmon',
        'zhuqiaomon',
        'varodurumon',
        'ravemon',
        'ulforceveedramon',
        'alphamon',
        'darkdramon',
        'dynasmon',
        'crusadermon',
        'chronomon',
        'eaglemon',
        'holloknightmon',
        'mastenamon',
        'fivedramon',
        'plusiamon',
      ].includes(fid)
    ) {
      return 'sky';
    }
    if (
      ['kyogre', 'palkia', 'samurott', 'empoleon', 'urshifu', 'gyarados', 'neptunemon', 'leviamon', 'vikemon'].includes(
        fid
      )
    ) {
      return 'surf';
    }
    return 'charge';
  }

  private findNearestWalkableLandTile(originX: number, originY: number, maxRadius = 2): Vec | null {
    if (!this.isWorldScene() || this.isTileWalkableOnFoot(originX, originY)) {
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
    if (!this.isWorldScene()) return;
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
    if (!this.isWorldScene()) {
      if (this.isRidingPokemon) {
        this.isRidingPokemon = false;
        this.wake();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('town:pokeride-changed', {
              detail: {
                active: false,
                follower: this.activeFollower,
                rideClass: this.getRideClass(),
              },
            })
          );
        }
        return false;
      }
      sfx.bump();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '🏠 Tidak bisa menunggangi Pokémon/Digimon di dalam ruangan! Keluar ke peta luar terlebih dahulu.',
          })
        );
      }
      return false;
    }

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
    if (this.isRidingPokemon && this.isWorldScene()) {
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
    this.isJumpingLedge = false;
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
    return getActiveLampsHelper(this);
  }

  public handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    // Measure parent container to prevent canvas inline style feedback loop
    const container = this.canvas.parentElement || this.canvas;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (this.isWorldScene()) {
      this.townBackgroundCanvas = null;
      this.digiBackgroundCanvas = null;
      this.kingdomBackgroundCanvas = null;
      this.harbourBackgroundCanvas = null;
      this.skyCastleBackgroundCanvas = null;
      this.darkCastleBackgroundCanvas = null;
    }

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    const previousRatio = this.defaultZoom > 0 ? this.zoom / this.defaultZoom : 1;

    // Calculate zoom to frame the scene cleanly (cap world framing width at 45 cols so 100x100 maps keep crisp RPG scale)
    if (!applyInteriorResizeZoom(this, dpr)) {
      const framingCols = Math.min(this.map.w, 45);
      const targetW = framingCols * TILE_SIZE * 1.05;
      const zoomW = this.canvas.width / targetW;
      this.defaultZoom = Math.max(zoomW, 1.15 * dpr);
      const effectiveZoom = !this.isCustomZoom
        ? this.defaultZoom
        : previousRatio > 0
          ? this.defaultZoom * previousRatio
          : this.zoom;
      const viewW = this.canvas.width / effectiveZoom;
      const viewH = this.canvas.height / effectiveZoom;
      const mapPixelW = this.map.w * TILE_SIZE;
      const mapPixelH = this.map.h * TILE_SIZE;
      const px = (this.playerPos.x + 0.5) * TILE_SIZE;
      const py = (this.playerPos.y + 0.5) * TILE_SIZE;
      this.cameraX = mapPixelW <= viewW ? mapPixelW / 2 : Math.max(viewW / 2, Math.min(mapPixelW - viewW / 2, px));
      this.cameraY = mapPixelH <= viewH ? mapPixelH / 2 : Math.max(viewH / 2, Math.min(mapPixelH - viewH / 2, py));
    }

    if (!this.isCustomZoom) {
      this.zoom = this.defaultZoom;
    } else if (previousRatio > 0) {
      this.zoom = this.defaultZoom * previousRatio;
    }

    this.updateDomLabels(true);
    this.wake();
  };

  public recenterCamera() {
    this.isCustomZoom = false;
    this.zoom = this.defaultZoom;
    this.handleResize();
    this.updateDomLabels(true);
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
    const hasPatrollingDigimon =
      this.isWorldScene() &&
      this.digimonPatrol.isEnabled() &&
      !this.editor?.isEnabled() &&
      townConfig.getBuildings().some((b) => b.kind === 'digimon' && !b.hidden);
    if (
      !this.xrayMode &&
      !hasPatrollingDigimon &&
      this.currentScene !== 'dev' &&
      this.currentScene !== 'lab' &&
      this.currentScene !== 'reception' &&
      this.currentScene !== 'mart' &&
      this.currentScene !== 'tower' &&
      this.currentScene !== 'cafe' &&
      this.currentScene !== 'arena' &&
      this.currentScene !== 'garden' &&
      this.currentScene !== 'neighbour' &&
      this.currentScene !== 'town' &&
      this.currentScene !== 'digimon' &&
      this.currentScene !== 'dark-cathedral' &&
      this.currentScene !== 'dark-forge' &&
      this.currentScene !== 'dark-manor' &&
      this.currentScene !== 'dark-vault' &&
      !isKingdomInteriorScene(this.currentScene) &&
      !isHarbourInteriorScene(this.currentScene) &&
      !isSkyInteriorScene(this.currentScene) &&
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
      if (this.isWorldScene() && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
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
      if (this.isWorldScene() && this.editor.isEnabled()) {
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

      // In Dark Interior, Kingdom Interior & Harbour Interior scenes: clicking on props or NPCs walks to or interacts with them
      if (
        this.currentScene === 'dark-cathedral' ||
        this.currentScene === 'dark-forge' ||
        this.currentScene === 'dark-manor' ||
        this.currentScene === 'dark-vault' ||
        isKingdomInteriorScene(this.currentScene) ||
        isHarbourInteriorScene(this.currentScene) ||
        isSkyInteriorScene(this.currentScene)
      ) {
        const kingdomCfg = getKingdomInteriorConfig(this.currentScene);
        const harbourCfg = getHarbourInteriorConfig(this.currentScene);
        const skyCfg = getSkyInteriorConfig(this.currentScene);
        const propsList = kingdomCfg
          ? kingdomCfg.props
          : harbourCfg
            ? harbourCfg.props
            : skyCfg
              ? skyCfg.props
              : this.currentScene === 'dark-cathedral'
              ? CATHEDRAL_PROPS
              : this.currentScene === 'dark-forge'
                ? FORGE_PROPS
                : this.currentScene === 'dark-manor'
                  ? MANOR_PROPS
                  : VAULT_PROPS;

        const hitProp = propsList.find(
          (p) => targetTileX >= p.x && targetTileX < p.x + p.w && targetTileY >= p.y && targetTileY < p.y + p.h
        );

        if (hitProp) {
          const isAdjacent =
            this.playerPos.x >= hitProp.x - 1 &&
            this.playerPos.x <= hitProp.x + hitProp.w &&
            this.playerPos.y >= hitProp.y - 1 &&
            this.playerPos.y <= hitProp.y + hitProp.h;

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

      // In Research Lab: clicking on any prop or Pheromosa walks to and interacts with it!
      if (this.currentScene === 'lab') {
        const isPheromosaHit =
          (targetTileX === 9 && targetTileY >= 3 && targetTileY <= 4) ||
          Math.hypot(worldX - 152, worldY - 64) <= 22;

        const hitProp = isPheromosaHit
          ? LAB_PROPS.find((p) => p.id === 'pheromosa')
          : LAB_PROPS.find(
            (p) => targetTileX >= p.x && targetTileX < p.x + p.w && targetTileY >= p.y && targetTileY < p.y + p.h
          );

        if (hitProp) {
          const isAdjacent =
            this.playerPos.x >= hitProp.x - 1 &&
            this.playerPos.x <= hitProp.x + hitProp.w &&
            this.playerPos.y >= hitProp.y - 1 &&
            this.playerPos.y <= hitProp.y + hitProp.h;

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
        if ((cfg as any).hidden) continue;
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

      // If clicking inside a Dark Castle landmark or North Vortex portal, walk to its entrance
      if (this.currentScene === 'dark-castle') {
        if (targetTileX >= 20 && targetTileX <= 24 && targetTileY >= 4 && targetTileY <= 8) {
          this.walkToObject('dark-castle-return');
          return;
        }
        const hitDarkLandmark = DARK_CASTLE_LANDMARKS.find(
          (lm) => targetTileX >= lm.x && targetTileX < lm.x + lm.w && targetTileY >= lm.y && targetTileY < lm.y + lm.h
        );
        if (hitDarkLandmark) {
          this.walkToObject(hitDarkLandmark.id);
          return;
        }
      }

      // If clicking inside a Kingdom landmark, North Drawbridge Gate, or South Harbour Gate (22, 59), walk directly there
      if (this.currentScene === 'kingdom') {
        if (targetTileX >= 20 && targetTileX <= 24 && targetTileY >= 2 && targetTileY <= 6) {
          this.walkToObject('kingdom-return');
          return;
        }
        if (targetTileX >= 21 && targetTileX <= 23 && targetTileY >= 57 && targetTileY <= 59) {
          this.walkToObject('harbour-gate');
          return;
        }
        const hitKingdomLandmark = KINGDOM_LANDMARKS.find(
          (lm) => targetTileX >= lm.x && targetTileX < lm.x + lm.w && targetTileY >= lm.y && targetTileY < lm.y + lm.h
        );
        if (hitKingdomLandmark) {
          this.walkToObject(hitKingdomLandmark.id);
          return;
        }
        const hitKingdomEntity = townConfig.getBuildings().find((b) => {
          if (b.hidden) return false;
          if (b.kind !== 'building' && b.kind !== 'object') return false;
          return targetTileX >= b.x && targetTileX < b.x + b.w && targetTileY >= b.y && targetTileY < b.y + b.h;
        });
        if (hitKingdomEntity) {
          this.walkToObject(hitKingdomEntity.id);
          return;
        }
      }

      // If clicking inside a Sky Castle landmark or South Sky-Bridge Return Gate, walk directly there
      if (this.currentScene === 'sky-castle') {
        if (targetTileX >= 21 && targetTileX <= 23 && targetTileY >= 57 && targetTileY <= 59) {
          this.walkToObject('sky-castle-return');
          return;
        }
        const hitSkyLandmark = SKY_CASTLE_LANDMARKS.find(
          (lm) => targetTileX >= lm.x && targetTileX < lm.x + lm.w && targetTileY >= lm.y && targetTileY < lm.y + lm.h
        );
        if (hitSkyLandmark) {
          this.walkToObject(hitSkyLandmark.id);
          return;
        }
      }

      // If clicking inside a Harbour landmark or North Kingdom Return Road, walk directly there
      if (this.currentScene === 'harbour') {
        if (targetTileX >= 21 && targetTileX <= 24 && targetTileY >= 0 && targetTileY <= 2) {
          this.walkToObject('harbour-return');
          return;
        }
        const hitHarbourLandmark = HARBOUR_LANDMARKS.find(
          (lm) => targetTileX >= lm.x && targetTileX < lm.x + lm.w && targetTileY >= lm.y && targetTileY < lm.y + lm.h
        );
        if (hitHarbourLandmark) {
          this.walkToObject(hitHarbourLandmark.id);
          return;
        }
      }

      // Check Ghost Trainers patrolling Town Square plaza
      if (this.currentScene === 'town' && this.ghostTrainersEnabled && this.ghostTrainers.length > 0) {
        const hitGhost = findGhostAtTile(this.ghostTrainers, targetTileX, targetTileY);
        if (hitGhost) {
          this.showGhostTrainerBubble(hitGhost);
          this.wake();
          return;
        }
      }

      // Check Hidden PokéBalls & Highland Summit Vista Point on click in Town Overworld
      if (this.currentScene === 'town') {
        const foundSet = getFoundHiddenPokeballs();
        const hitLoot = HIDDEN_POKEBALL_ITEMS.find(
          (item) => !foundSet.has(item.id) && item.x === targetTileX && item.y === targetTileY
        );
        const isVistaClick =
          targetTileX === SUMMIT_VISTA_POINT.x && targetTileY === SUMMIT_VISTA_POINT.y;
        const specialTarget = hitLoot
          ? { id: hitLoot.id, x: hitLoot.x, y: hitLoot.y }
          : isVistaClick
            ? { id: SUMMIT_VISTA_POINT.id, x: SUMMIT_VISTA_POINT.x, y: SUMMIT_VISTA_POINT.y }
            : null;
        if (specialTarget) {
          const isAdj =
            Math.abs(this.playerPos.x - specialTarget.x) +
              Math.abs(this.playerPos.y - specialTarget.y) <=
            1;
          if (isAdj) {
            if (this.playerPos.x < specialTarget.x) this.playerDir = 'right';
            else if (this.playerPos.x > specialTarget.x) this.playerDir = 'left';
            else if (this.playerPos.y < specialTarget.y) this.playerDir = 'down';
            else if (this.playerPos.y > specialTarget.y) this.playerDir = 'up';
            this.interactFacing(specialTarget.id);
            this.wake();
            return;
          }
          const adjCandidates = [
            { x: specialTarget.x, y: specialTarget.y + 1 },
            { x: specialTarget.x, y: specialTarget.y - 1 },
            { x: specialTarget.x - 1, y: specialTarget.y },
            { x: specialTarget.x + 1, y: specialTarget.y },
          ].filter((p) => this.canWalk(p.x, p.y));
          if (adjCandidates.length > 0) {
            adjCandidates.sort(
              (a, b) =>
                Math.hypot(a.x - this.playerPos.x, a.y - this.playerPos.y) -
                Math.hypot(b.x - this.playerPos.x, b.y - this.playerPos.y)
            );
            this.pendingTarget = specialTarget.id;
            this.walkTo(adjCandidates[0].x, adjCandidates[0].y);
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
          const nw = cfg?.w ?? (['lugia', 'charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados', 'snorlax', 'latias'].includes(n.id) ? 2 : 1);
          const nh = cfg?.h ?? (['lugia', 'charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados', 'snorlax', 'latias'].includes(n.id) ? 2 : 1);
          return targetTileX >= nx && targetTileX < nx + nw && targetTileY >= ny && targetTileY < ny + nh;
        }) ||
        townConfig.getBuildings().find((b) => {
          if (b.hidden || (b.kind !== 'npc' && b.kind !== 'digimon')) return false;
          const anchor =
            b.kind === 'digimon'
              ? this.digimonPatrol.getInteractAnchor(b)
              : { x: b.x, y: b.y, w: b.w, h: b.h };
          return (
            targetTileX >= anchor.x &&
            targetTileX < anchor.x + anchor.w &&
            targetTileY >= anchor.y &&
            targetTileY < anchor.y + anchor.h
          );
        });

      if (hitNpc) {
        const cfg = townConfig.getBuilding(hitNpc.id);
        const anchor =
          cfg?.kind === 'digimon'
            ? this.digimonPatrol.getInteractAnchor(cfg)
            : null;
        const defaultNpcSize = [
          'lugia', 'charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar',
          'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott',
          'empoleon', 'regigigas', 'koraidon', 'eternatus', 'gyarados', 'snorlax', 'latias',
        ].includes(hitNpc.id)
          ? 2
          : 1;
        const nx = anchor ? anchor.x : cfg ? cfg.x : (hitNpc.id === 'ace' ? aceX : hitNpc.x);
        const ny = anchor ? anchor.y : cfg ? cfg.y : (hitNpc.id === 'ace' ? aceY : hitNpc.y);
        const nw = anchor ? anchor.w : ((hitNpc as any).w ?? cfg?.w ?? defaultNpcSize);
        const nh = anchor ? anchor.h : ((hitNpc as any).h ?? cfg?.h ?? defaultNpcSize);

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

      // Click on active follower to mount, or click on player to dismount Poké Ride (outdoors only)
      if (this.isWorldScene()) {
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
      }

      if (
        this.currentScene === 'digimon' &&
        targetTileX >= DIGI_PLAZA_CONSOLE.x &&
        targetTileX < DIGI_PLAZA_CONSOLE.x + DIGI_PLAZA_CONSOLE.w &&
        targetTileY >= DIGI_PLAZA_CONSOLE.y &&
        targetTileY < DIGI_PLAZA_CONSOLE.y + DIGI_PLAZA_CONSOLE.h
      ) {
        this.walkToObject('digidex-console');
        return;
      }

      this.pendingTarget = null;
      this.walkTo(targetTileX, targetTileY);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (this.isWorldScene() && this.editor.isEnabled()) {
        this.editor.handleMouseDown(e);
        this.wake();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.isWorldScene() && this.editor.isEnabled()) {
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
      } else if (this.currentScene === 'lab') {
        const rect = this.canvas.getBoundingClientRect();
        const mouseScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        const worldX = (mouseScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
        const worldY = (mouseScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;
        const tx = Math.floor(worldX / TILE_SIZE);
        const ty = Math.floor(worldY / TILE_SIZE);

        const isPheromosaHover =
          (tx === 9 && ty >= 3 && ty <= 4) ||
          Math.hypot(worldX - 152, worldY - 64) <= 22;
        const hitProp = isPheromosaHover || LAB_PROPS.some(
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
      if (this.isWorldScene() && this.editor.isEnabled()) {
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
      const minZoom = (this.map.w >= 100 ? 0.35 : 0.65) * dpr;
      const maxZoom = 4.8 * dpr;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, this.zoom * zoomFactor));

      if (Math.abs(newZoom - this.zoom) > 0.0001) {
        // Zoom centered around mouse pointer if in editor mode
        if (this.isWorldScene() && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
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
        const minZoom = (this.map.w >= 100 ? 0.35 : 0.65) * dpr;
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
      if (this.isWorldScene() && this.editor.isEnabled()) {
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

    const onSetDigiCompanion = (e: Event) => {
      const custom = e as CustomEvent<{ companionId: string | null }>;
      if (custom.detail !== undefined) {
        this.setActiveFollower(custom.detail.companionId);
      }
    };
    const onToggleDigiPatrol = (e: Event) => {
      const custom = e as CustomEvent<{ enabled?: boolean }>;
      const next =
        typeof custom.detail?.enabled === 'boolean'
          ? custom.detail.enabled
          : !this.digimonPatrol.isEnabled();
      this.digimonPatrol.setEnabled(next);
      window.dispatchEvent(
        new CustomEvent('digimon:patrol-changed', { detail: { enabled: next } })
      );
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: next
            ? '🚶 Auto Digimon Patrol: ACTIVE (Digimon roam freely across the island)'
            : '⏸️ Auto Digimon Patrol: PAUSED (Digimon returned to anchor tiles)',
        })
      );
      this.wake();
    };
    window.addEventListener('digimon:set-companion', onSetDigiCompanion);
    window.addEventListener('digimon:toggle-patrol', onToggleDigiPatrol);

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

    const onVaultFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerVaultChronoWave(ce.detail?.text || 'TEMPORAL SHIFT +90! ⚙️', ce.detail?.color || '#fbbf24');
      this.wake();
    };
    window.addEventListener('town:vault-fx', onVaultFx);

    const onManorFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerManorShadowWave(ce.detail?.text || 'NIGHTMARE COUNTERED!', ce.detail?.color || '#ef4444');
      this.wake();
    };
    window.addEventListener('town:manor-fx', onManorFx);

    const onCathedralFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerCathedralEchoWave(ce.detail?.text || 'ECHO HARMONY!', ce.detail?.color || '#c084fc');
      this.wake();
    };
    window.addEventListener('town:cathedral-fx', onCathedralFx);

    const onForgeFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerForgePlasmaWave(ce.detail?.text || 'REACTOR STABILIZED!', ce.detail?.color || '#fb923c');
      this.wake();
    };
    window.addEventListener('town:forge-fx', onForgeFx);

    const onKingdomFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerKingdomWave(this.currentScene, ce.detail?.text || 'AVALON BLESSING!', ce.detail?.color || '#fbbf24');
      this.wake();
    };
    window.addEventListener('town:kingdom-fx', onKingdomFx);

    const onHarbourFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerHarbourWave(this.currentScene, ce.detail?.text || 'ADMIRALTY SALUTE!', ce.detail?.color || '#38bdf8');
      this.wake();
    };
    window.addEventListener('town:harbour-fx', onHarbourFx);

    const onSkyFx = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string; color?: string }>;
      triggerSkyWave(this.currentScene, ce.detail?.text || 'CELESTIAL RESONANCE!', ce.detail?.color || '#38bdf8');
      this.wake();
    };
    window.addEventListener('town:sky-fx', onSkyFx);

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
      () => window.removeEventListener('town:neighbour-fx', onNeighbourFx),
      () => window.removeEventListener('town:vault-fx', onVaultFx),
      () => window.removeEventListener('town:manor-fx', onManorFx),
      () => window.removeEventListener('town:cathedral-fx', onCathedralFx),
      () => window.removeEventListener('town:forge-fx', onForgeFx),
      () => window.removeEventListener('town:kingdom-fx', onKingdomFx),
      () => window.removeEventListener('town:harbour-fx', onHarbourFx),
      () => window.removeEventListener('town:sky-fx', onSkyFx),
      () => window.removeEventListener('digimon:set-companion', onSetDigiCompanion),
      () => window.removeEventListener('digimon:toggle-patrol', onToggleDigiPatrol)
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
                            : this.currentScene === 'dark-cathedral' || this.currentScene === 'dark-forge' || this.currentScene === 'dark-manor' || this.currentScene === 'dark-vault' || isKingdomInteriorScene(this.currentScene) || isHarbourInteriorScene(this.currentScene) || isSkyInteriorScene(this.currentScene)
                              ? 15
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
                            : this.currentScene === 'dark-cathedral' || this.currentScene === 'dark-forge' || this.currentScene === 'dark-manor' || this.currentScene === 'dark-vault' || isKingdomInteriorScene(this.currentScene) || isHarbourInteriorScene(this.currentScene) || isSkyInteriorScene(this.currentScene)
                              ? 12
                              : this.map.h;
    if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) return;
    const start = this.isMoving ? this.playerTarget : this.playerPos;
    const kingdomCfgWalk = getKingdomInteriorConfig(this.currentScene);
    const harbourCfgWalk = getHarbourInteriorConfig(this.currentScene);
    const skyCfgWalk = getSkyInteriorConfig(this.currentScene);
    const collisionMap =
      kingdomCfgWalk
        ? kingdomCfgWalk.collision
        : harbourCfgWalk
          ? harbourCfgWalk.collision
          : skyCfgWalk
            ? skyCfgWalk.collision
            : this.currentScene === 'home'
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
                            : this.currentScene === 'dark-cathedral'
                              ? CATHEDRAL_COLLISION
                              : this.currentScene === 'dark-forge'
                                ? FORGE_COLLISION
                                : this.currentScene === 'dark-manor'
                                  ? MANOR_COLLISION
                                  : this.currentScene === 'dark-vault'
                                    ? VAULT_COLLISION
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
    return this.checkTileWalkableOnFoot(x, y, false);
  }

  private checkTileWalkableOnFoot(x: number, y: number, ignoreDigimon = false): boolean {
    if (x < 0 || x >= this.map.w || y < 0 || y >= this.map.h) return false;

    // 1. Explicit tile brush overrides
    const override = townConfig.getTileOverride(x, y);
    if (override === 'walkable_override') return true;
    if (
      override === 'solid_override' ||
      override === 'water' ||
      override === 'shallow_water' ||
      override === 'cliff' ||
      override === 'ledge' ||
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

      // Patrol Digimon occupy their active patrol footprint (ignored during own terrain sampling)
      if (b.kind === 'digimon') {
        if (ignoreDigimon) continue;
        const anchor = this.digimonPatrol.getInteractAnchor(b);
        if (x >= anchor.x && x < anchor.x + anchor.w && y >= anchor.y && y < anchor.y + anchor.h) {
          return false;
        }
        continue;
      }

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
        // Buildings: footprint is solid EXCEPT entrance door (keep Kingdom medieval building footprints solid so player stops at portcullis front tile)
        if (b.kind === 'building') {
          if (this.currentScene === 'kingdom') {
            return false;
          }
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

    // 3. Tile override clearing base fence/obstacle (or extending bridges over water/cliffs)
    if (
      override === 'grass' ||
      override === 'cobble' ||
      override === 'sand' ||
      override === 'cliff_stairs' ||
      override === 'bridge_wood' ||
      override === 'lab_paver' ||
      override === 'dev_paver' ||
      override === 'tall_grass' ||
      override === 'cyber_grid' ||
      override === 'lava_rock' ||
      override === 'cryo_ice' ||
      override === 'holy_marble' ||
      override === 'castle_flagstone' ||
      override === 'royal_carpet' ||
      override === 'tudor_cobble' ||
      override === 'drawbridge_wood'
    ) {
      const baseGround = this.map.ground[y * this.map.w + x];
      if (
        baseGround === Tile.FENCE ||
        baseGround === Tile.CLIFF ||
        baseGround === Tile.LEDGE ||
        override === 'bridge_wood' ||
        override === 'cliff_stairs' ||
        ((this.currentScene === 'digimon' ||
          this.currentScene === 'kingdom' ||
          this.currentScene === 'harbour' ||
          this.currentScene === 'sky-castle' ||
          this.currentScene === 'dark-castle') &&
          baseGround === Tile.WATER) ||
        ((x === 38 || x === 39) && y === 30)
      ) {
        return true;
      }
    }

    // 4. Base map terrain collision (island boundaries, cliffs, water)
    return this.map.collision[y * this.map.w + x] === 0;
  }

  public isTileWalkable(x: number, y: number): boolean {
    if (this.isTileWalkableOnFoot(x, y)) return true;

    // Poké Ride All-Terrain Traversal (Sky Soar & Aqua Surf)
    // Keep floating/abyssal castles ('sky-castle', 'dark-castle') strictly bounded to bridges/islands
    if (
      this.isRidingPokemon &&
      this.activeFollower &&
      this.isWorldScene() &&
      this.currentScene !== 'sky-castle' &&
      this.currentScene !== 'dark-castle' &&
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
          override === 'shallow_water' ||
          override === 'ledge' ||
          override === 'fence' ||
          override === 'hedge' ||
          override === 'fence_water' ||
          baseGround === Tile.WATER ||
          baseGround === Tile.SHALLOW_WATER ||
          baseGround === Tile.LEDGE ||
          baseGround === Tile.FENCE
        ) {
          return true;
        }
      } else if (rideClass === 'surf') {
        if (
          override === 'water' ||
          override === 'shallow_water' ||
          baseGround === Tile.WATER ||
          baseGround === Tile.SHALLOW_WATER
        ) {
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
    walkToObjectHelper(this, id);
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

  private canHopLedgeDown(fromX: number, fromY: number): boolean {
    if (this.currentScene !== 'town') return false;
    const ledgeY = fromY + 1;
    const landY = fromY + 2;
    if (fromX < 0 || fromX >= this.map.w || landY >= this.map.h) return false;
    const ov = townConfig.getTileOverride(fromX, ledgeY);
    const isLedge =
      ov === 'ledge' ||
      ((ov === null || ov === undefined) &&
        this.map.ground[ledgeY * this.map.w + fromX] === Tile.LEDGE);
    if (!isLedge) return false;
    return this.canWalk(fromX, landY);
  }

  private stepTowards(dir: Dir) {
    this.playerDir = dir;
    const next = {
      x: this.playerPos.x + DIRS[dir].x,
      y: this.playerPos.y + DIRS[dir].y,
    };

    if (this.canWalk(next.x, next.y)) {
      this.isJumpingLedge = false;
      this.onPlayerStepStart(next);
      this.playerTarget = next;
      this.isMoving = true;
      this.moveProgress = 0;
      this.wake();
    } else if (dir === 'down' && this.canHopLedgeDown(this.playerPos.x, this.playerPos.y)) {
      const hopDest = { x: this.playerPos.x, y: this.playerPos.y + 2 };
      this.onPlayerStepStart(hopDest);
      this.playerTarget = hopDest;
      this.isMoving = true;
      this.isJumpingLedge = true;
      this.moveProgress = 0;
      sfx.select();
      this.wake();
    } else {
      this.isMoving = false;
      this.isJumpingLedge = false;
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

  canWalk(x: number, y: number): boolean {
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
    if (this.currentScene === 'dark-cathedral') {
      if (x < 0 || x >= CATHEDRAL_COLS || y < 0 || y >= CATHEDRAL_ROWS) return false;
      return CATHEDRAL_COLLISION[y * CATHEDRAL_COLS + x] === 0;
    }
    if (this.currentScene === 'dark-forge') {
      if (x < 0 || x >= FORGE_COLS || y < 0 || y >= FORGE_ROWS) return false;
      return FORGE_COLLISION[y * FORGE_COLS + x] === 0;
    }
    if (this.currentScene === 'dark-manor') {
      if (x < 0 || x >= MANOR_COLS || y < 0 || y >= MANOR_ROWS) return false;
      return MANOR_COLLISION[y * MANOR_COLS + x] === 0;
    }
    if (this.currentScene === 'dark-vault') {
      if (x < 0 || x >= VAULT_COLS || y < 0 || y >= VAULT_ROWS) return false;
      return VAULT_COLLISION[y * VAULT_COLS + x] === 0;
    }
    const kingdomCfg = getKingdomInteriorConfig(this.currentScene);
    if (kingdomCfg) {
      if (x < 0 || x >= kingdomCfg.cols || y < 0 || y >= kingdomCfg.rows) return false;
      return kingdomCfg.collision[y * kingdomCfg.cols + x] === 0;
    }
    const harbourCfg = getHarbourInteriorConfig(this.currentScene);
    if (harbourCfg) {
      if (x < 0 || x >= harbourCfg.cols || y < 0 || y >= harbourCfg.rows) return false;
      return harbourCfg.collision[y * harbourCfg.cols + x] === 0;
    }
    const skyCfg = getSkyInteriorConfig(this.currentScene);
    if (skyCfg) {
      if (x < 0 || x >= skyCfg.cols || y < 0 || y >= skyCfg.rows) return false;
      return skyCfg.collision[y * skyCfg.cols + x] === 0;
    }
    return this.isTileWalkable(x, y);
  }

  private update(dt: number) {
    this.tick++;
    if (this.isMoving) {
      this.followerWalkTick++;
    }
    if (this.lucarioAttackTick > 0) {
      this.lucarioAttackTick--;
    }
    if (this.mewtwoAttackTick > 0) {
      this.mewtwoAttackTick--;
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
    if (this.necrozmaAttackTick > 0) {
      this.necrozmaAttackTick--;
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
    if (this.snorlaxAttackTick > 0) {
      this.snorlaxAttackTick--;
    }
    if (this.samurottAttackTick > 0) {
      this.samurottAttackTick--;
    }
    if (this.empoleonAttackTick > 0) {
      this.empoleonAttackTick--;
    }
    if (this.regigigasAttackTick > 0) {
      this.regigigasAttackTick--;
    }
    if (this.koraidonAttackTick > 0) {
      this.koraidonAttackTick--;
    }
    if (this.eternatusAttackTick > 0) {
      this.eternatusAttackTick--;
    }
    if (this.urshifuAttackTick > 0) {
      this.urshifuAttackTick--;
    }
    if (this.darkraiAttackTick > 0) {
      this.darkraiAttackTick--;
    }
    if (this.latiosAttackTick > 0) {
      this.latiosAttackTick--;
    }
    if (this.latiasAttackTick > 0) {
      this.latiasAttackTick--;
    }
    if (this.charizardAttackTick > 0) {
      this.charizardAttackTick--;
    }
    if (this.gardevoirAttackTick > 0) {
      this.gardevoirAttackTick--;
    }
    if (this.celebiAttackTick > 0) {
      this.celebiAttackTick--;
    }
    if (this.lugiaAttackTick > 0) {
      this.lugiaAttackTick--;
    }
    if (this.archaludonAttackTick > 0) {
      this.archaludonAttackTick--;
    }
    if (this.gougingfireAttackTick > 0) {
      this.gougingfireAttackTick--;
    }
    if (this.greattuskAttackTick > 0) {
      this.greattuskAttackTick--;
    }
    if (this.kyuremAttackTick > 0) {
      this.kyuremAttackTick--;
    }
    if (this.salamenceAttackTick > 0) {
      this.salamenceAttackTick--;
    }

    const buildings = townConfig.getBuildings();
    if (this.currentScene === 'digimon' || buildings.some((b) => b.kind === 'digimon' && !b.hidden)) {
      const patrolMoving = this.digimonPatrol.update(
        dt,
        buildings,
        this.playerPos.x,
        this.playerPos.y,
        Boolean(this.editor?.isEnabled()),
        (tx, ty) => this.checkTileWalkableOnFoot(tx, ty, true),
        this.currentScene
      );
      if (patrolMoving) {
        this.wake();
      }
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
      const speed = this.isJumpingLedge
        ? 3.8
        : this.coffeeBoostTimer > 0
          ? baseSpeed * 1.5
          : baseSpeed;
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
        const wasJumpingLedge = this.isJumpingLedge;
        this.isJumpingLedge = false;
        this.playerPos = { ...this.playerTarget };
        if (this.activeFollower) {
          this.followerPos = { ...this.followerTarget };
        }
        this.stepCount++;
        sfx.step();
        if (wasJumpingLedge) {
          for (let i = 0; i < 3; i++) {
            this.spawnDustPuff(this.playerPos.x * TILE_SIZE, this.playerPos.y * TILE_SIZE);
          }
        }

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
              this.isJumpingLedge = false;
              this.onPlayerStepStart(next);
              this.playerTarget = next;
              this.moveProgress = Math.max(0, this.moveProgress - 1);
              this.isMoving = true;
            } else if (nextDir === 'down' && this.canHopLedgeDown(this.playerPos.x, this.playerPos.y)) {
              const hopDest = { x: this.playerPos.x, y: this.playerPos.y + 2 };
              this.onPlayerStepStart(hopDest);
              this.playerTarget = hopDest;
              this.moveProgress = Math.max(0, this.moveProgress - 1);
              this.isMoving = true;
              this.isJumpingLedge = true;
              sfx.select();
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

    if (this.currentScene === 'town' && this.ghostTrainersEnabled && this.ghostTrainers.length > 0) {
      updateGhostTrainers(this.ghostTrainers, dt, (nx, ny) => {
        if (nx === this.playerPos.x && ny === this.playerPos.y) return false;
        if (nx === this.playerTarget.x && ny === this.playerTarget.y) return false;
        return this.canWalk(nx, ny);
      });
    }

    if (this.tick % 12 === 0 && typeof window !== 'undefined') {
      const res = findActiveResonanceHelper(this);
      const nextKey = res ? `${res.id}:${res.followerId}:${res.nearbyId}` : '';
      if (nextKey !== this.lastResonanceKey) {
        this.lastResonanceKey = nextKey;
        window.dispatchEvent(new CustomEvent('town:resonance-available', { detail: res }));
      }
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

  spawnDustPuff(x: number, y: number) {
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

  renderPathAndMarker(ctx: CanvasRenderingContext2D) {
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
    triggerPendingTargetHelper(this, id);
  }

  private resolveSafeTownRespawn(x: number, y: number): { x: number; y: number } {
    if (this.checkTileWalkableOnFoot(x, y)) return { x, y };
    const offsets = [
      { dx: 0, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 1 },
      { dx: 2, dy: 1 },
    ];
    for (const { dx, dy } of offsets) {
      const cx = x + dx;
      const cy = y + dy;
      if (this.checkTileWalkableOnFoot(cx, cy)) return { x: cx, y: cy };
    }
    return { x, y };
  }

  exitCurrentSceneToTown() {
    sfx.door();
    if (this.currentScene === 'dark-cathedral') {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dark-castle:respawn', '9,21,down');
      this.callbacks.onNavigate('/dark-castle?from=cathedral');
      return;
    }
    if (this.currentScene === 'dark-forge') {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dark-castle:respawn', '33,25,down');
      this.callbacks.onNavigate('/dark-castle?from=forge');
      return;
    }
    if (this.currentScene === 'dark-manor') {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dark-castle:respawn', '11,52,down');
      this.callbacks.onNavigate('/dark-castle?from=manor');
      return;
    }
    if (this.currentScene === 'dark-vault') {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dark-castle:respawn', '34,50,down');
      this.callbacks.onNavigate('/dark-castle?from=vault');
      return;
    }
    const kingdomExitCfg = getKingdomInteriorConfig(this.currentScene);
    if (kingdomExitCfg) {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('kingdom:respawn', kingdomExitCfg.exitRespawn);
      this.callbacks.onNavigate(kingdomExitCfg.exitRoute);
      return;
    }
    const harbourExitCfg = getHarbourInteriorConfig(this.currentScene);
    if (harbourExitCfg) {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('harbour:respawn', harbourExitCfg.exitRespawn);
      this.callbacks.onNavigate(harbourExitCfg.exitRoute);
      return;
    }
    const skyExitCfg = getSkyInteriorConfig(this.currentScene);
    if (skyExitCfg) {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('sky-castle:respawn', skyExitCfg.exitRespawn);
      this.callbacks.onNavigate(skyExitCfg.exitRoute);
      return;
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('town:respawn', townConfig.getExitRespawnForPlace(this.currentScene));
    }
    this.callbacks.onNavigate('/');
  }

  private onStepComplete() {
    const simpleExits: Record<string, { x: number; y: number }> = {
      tower: { x: 7, y: 11 },
      mart: { x: 7, y: 11 },
      cafe: { x: 7, y: 11 },
      arena: { x: 7, y: 11 },
      garden: { x: 7, y: 11 },
      neighbour: { x: 7, y: 11 },
      reception: { x: 7, y: 11 },
      'dark-cathedral': { x: 7, y: 11 },
      'dark-forge': { x: 7, y: 11 },
      'dark-manor': { x: 7, y: 11 },
      'dark-vault': { x: 7, y: 11 },
      'kingdom-castle': { x: 7, y: 11 },
      'kingdom-blacksmith': { x: 7, y: 11 },
      'kingdom-tavern': { x: 7, y: 11 },
      'kingdom-mage-tower': { x: 7, y: 11 },
      'kingdom-barracks': { x: 7, y: 11 },
      'kingdom-chapel': { x: 7, y: 11 },
      'kingdom-jousting': { x: 7, y: 11 },
      'harbour-lighthouse': { x: 7, y: 11 },
      'harbour-warehouse': { x: 7, y: 11 },
      'harbour-inn': { x: 7, y: 11 },
      'harbour-galleon': { x: 7, y: 11 },
      'harbour-market': { x: 7, y: 11 },
      'sky-citadel': { x: 7, y: 11 },
      'sky-windmill': { x: 7, y: 11 },
      'sky-workshop': { x: 7, y: 11 },
      'sky-inn': { x: 7, y: 11 },
      'sky-observatory': { x: 7, y: 11 },
      'sky-chapel': { x: 7, y: 11 },
      arcade: { x: 9, y: 13 },
      lab: { x: 6, y: 14 },
      dev: { x: 7, y: 18 },
    };
    const exitTile = simpleExits[this.currentScene];
    if (exitTile) {
      if (this.playerPos.x === exitTile.x && this.playerPos.y === exitTile.y) {
        this.exitCurrentSceneToTown();
      }
      return;
    }

    if (this.currentScene === 'home') {
      if (this.homeFloor === '1F') {
        if (this.playerPos.x === 7 && this.playerPos.y === 14) {
          this.exitCurrentSceneToTown();
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
      if (cfg?.hidden) continue;
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
      // Check static b.doors only if the building has not been moved or given a custom door in townConfig
      const hasMovedOrCustomDoor = Boolean(
        cfg &&
        (cfg.x !== b.x ||
          cfg.y !== b.y ||
          cfg.doorX !== undefined ||
          cfg.doorY !== undefined)
      );
      if (!hasMovedOrCustomDoor && Array.isArray(b.doors)) {
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

    // Static door fallback (Town <-> Digi-Sanctuary <-> Medieval Kingdom portal gates or non-town scenes; skip stale town building doors)
    const route = this.map.doors.get(tileIdx);
    if (route) {
      const isTownPortal =
        this.currentScene === 'town' &&
        this.playerPos.y === DIGI_GATE_PORTAL.triggerY &&
        this.playerPos.x >= DIGI_GATE_PORTAL.xMin &&
        this.playerPos.x <= DIGI_GATE_PORTAL.xMax;
      if (this.currentScene !== 'town' || isTownPortal) {
        sfx.door();
        if (this.currentScene === 'digimon' && route.startsWith('/?from=digimon') && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(
        'town:respawn',
        `${DIGI_GATE_PORTAL.returnSpawn.x},${DIGI_GATE_PORTAL.returnSpawn.y},up`
      );
        }
        if (this.currentScene === 'kingdom' && route.startsWith('/digimon?from=kingdom') && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('digimon:respawn', '20,38,up');
        }
        if (this.currentScene === 'dark-castle' && route.startsWith('/digimon?from=dark-castle') && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('digimon:respawn', '8,22,right');
        }
        if (this.currentScene === 'sky-castle' && route.startsWith('/digimon?from=sky-castle') && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('digimon:respawn', '33,22,left');
        }
        if (this.currentScene === 'harbour' && route.startsWith('/kingdom?from=harbour') && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('kingdom:respawn', '22,57,up');
        }
        this.callbacks.onNavigate(route);
        return;
      }
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
    interactFacingHelper(this, targetId);
  }

  public updateDomLabels(force = false) {
    updateDomLabelsHelper(this, force);
  }

  private render() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    if (renderInteriorScene(this, ctx)) {
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
    } else if (this.isWorldScene() && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
      this.cameraX = Math.max(viewW / 2, Math.min(mapPixelW - viewW / 2, this.cameraX));
    } else {
      this.cameraX = Math.max(viewW / 2, Math.min(mapPixelW - viewW / 2, targetCamX));
    }

    // Vertical camera positioning & boundary clamping
    if (mapPixelH <= viewH) {
      this.cameraY = mapPixelH / 2;
    } else if (this.isWorldScene() && this.editor.isEnabled() && !this.editor.isPlaytesting()) {
      this.cameraY = Math.max(viewH / 2, Math.min(mapPixelH - viewH / 2, this.cameraY));
    } else {
      this.cameraY = Math.max(viewH / 2, Math.min(mapPixelH - viewH / 2, targetCamY));
    }

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dark surround backdrop (Deep data sea on /digimon, pure black framing for Kingdom/Harbour/Sky/Dark maps, dark forest on Town)
    ctx.fillStyle =
      this.currentScene === 'digimon'
        ? '#040a18'
        : this.currentScene === 'kingdom' ||
          this.currentScene === 'harbour' ||
          this.currentScene === 'sky-castle' ||
          this.currentScene === 'dark-castle'
          ? '#000000'
          : '#162e1d';
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

    if (this.currentScene === 'digimon') {
      // 1. Procedural Digi-Sanctuary Island Background Canvas (lazy-loaded)
      if (!this.digiBackgroundCanvas && !this.loadingWorldBg.has('digimon')) {
        this.loadingWorldBg.add('digimon');
        import('./digiBackground')
          .then((m) => {
            this.digiBackgroundCanvas = m.createDigiBackgroundCanvas(this.map);
            this.loadingWorldBg.delete('digimon');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('digimon'));
      }
      if (this.digiBackgroundCanvas) {
        ctx.drawImage(this.digiBackgroundCanvas, 0, 0);
      }

      // Animated Digital Return Gate, Kingdom Portal Gate, Dark Castle Void Gate, Sky Castle Cloud Gate & DigiDex Console holographic pulses
      this.renderPortalPulseOverlay(ctx, DIGI_RETURN_GATE.xMin, DIGI_RETURN_GATE.yMin);
      this.renderPortalPulseOverlay(ctx, DIGI_KINGDOM_GATE.xMin, DIGI_KINGDOM_GATE.yMin);
      this.renderPortalPulseOverlay(ctx, DIGI_DARK_CASTLE_GATE.xMin, DIGI_DARK_CASTLE_GATE.yMin + 0.5);
      this.renderPortalPulseOverlay(ctx, DIGI_SKY_CASTLE_GATE.xMin, DIGI_SKY_CASTLE_GATE.yMin + 0.5);
      const pulse = 0.25 + 0.2 * Math.sin(this.tick * 0.08);
      ctx.fillStyle = `rgba(0, 240, 255, ${pulse})`;
      ctx.fillRect(DIGI_PLAZA_CONSOLE.x * TILE_SIZE + 16, DIGI_PLAZA_CONSOLE.y * TILE_SIZE + 14, 16, 2);
    } else if (this.currentScene === 'sky-castle') {
      // 1. Sky Castle 45x60 Floating Citadel Canvas backed by cloud illustration (lazy-loaded)
      if (!this.skyCastleBackgroundCanvas && !this.loadingWorldBg.has('sky-castle')) {
        this.loadingWorldBg.add('sky-castle');
        import('./skyCastleBackground')
          .then((m) => {
            this.skyCastleBackgroundCanvas = m.createSkyCastleBackgroundCanvas(this.map, () => {
              this.invalidateBackgroundCanvas();
              this.wake();
            });
            this.loadingWorldBg.delete('sky-castle');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('sky-castle'));
      }
      if (this.skyCastleBackgroundCanvas) {
        ctx.drawImage(this.skyCastleBackgroundCanvas, 0, 0);
      }

      // Azure Crystal Plaza living halo & 6/6 Celestial Plumes Awakening
      const skyCrystalAwakened = hasCrystalAwakened();
      const skyPulse = 0.2 + 0.14 * Math.sin(this.tick * 0.08);
      if (skyCrystalAwakened) {
        ctx.fillStyle = `rgba(56, 189, 248, ${0.28 + skyPulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(22.5 * TILE_SIZE, 29.5 * TILE_SIZE, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(250, 204, 21, ${0.55 + skyPulse * 0.45})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(22.5 * TILE_SIZE, 29.5 * TILE_SIZE, 28, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2 + this.tick * 0.04;
          const sx = 22.5 * TILE_SIZE + Math.cos(ang) * 26;
          const sy = 29.5 * TILE_SIZE + Math.sin(ang) * 11;
          ctx.fillStyle = i % 2 === 0 ? '#fef08a' : '#7dd3fc';
          ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
      } else {
        ctx.strokeStyle = `rgba(125, 211, 252, ${0.25 + skyPulse * 0.35})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(22.5 * TILE_SIZE, 29.5 * TILE_SIZE, 22, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.currentScene === 'dark-castle') {
      // 1. Dark Castle 45x64 Citadel Canvas backed by pixel-art image (lazy-loaded)
      if (!this.darkCastleBackgroundCanvas && !this.loadingWorldBg.has('dark-castle')) {
        this.loadingWorldBg.add('dark-castle');
        import('./darkCastleBackground')
          .then((m) => {
            this.darkCastleBackgroundCanvas = m.createDarkCastleBackgroundCanvas(this.map, () => {
              this.invalidateBackgroundCanvas();
              this.wake();
            });
            this.loadingWorldBg.delete('dark-castle');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('dark-castle'));
      }
      if (this.darkCastleBackgroundCanvas) {
        ctx.drawImage(this.darkCastleBackgroundCanvas, 0, 0);
      }

      // Subtle living pulse on North Abyssal Vortex & Obsidian Obelisk Ring
      const pulse = 0.14 + 0.12 * Math.sin(this.tick * 0.07);
      ctx.fillStyle = `rgba(244, 63, 94, ${pulse})`;
      ctx.beginPath();
      ctx.arc(22.5 * TILE_SIZE, 6.2 * TILE_SIZE, 26, 0, Math.PI * 2);
      ctx.fill();

      const allSealsAwakened = isAllSealsUnlocked();
      if (allSealsAwakened) {
        // Radiant cosmic awakening: Expanding gold & violet auroral halo
        const cosmicPulse = 0.45 + 0.35 * Math.sin(this.tick * 0.1);
        ctx.fillStyle = `rgba(251, 191, 36, ${cosmicPulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(22.5 * TILE_SIZE, 29 * TILE_SIZE, 38, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(244, 63, 94, ${0.6 + cosmicPulse * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(22.5 * TILE_SIZE, 29 * TILE_SIZE, 30, 13, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 4 orbiting cosmic star runes
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2 + this.tick * 0.04;
          const sx = 22.5 * TILE_SIZE + Math.cos(ang) * 28;
          const sy = 29 * TILE_SIZE + Math.sin(ang) * 12;
          ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#c084fc';
          ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
      } else {
        ctx.strokeStyle = `rgba(192, 132, 252, ${0.22 + pulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(22.5 * TILE_SIZE, 29 * TILE_SIZE, 26, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      this.renderPortalPulseOverlay(ctx, DARK_CASTLE_RETURN_GATE.xMin, DARK_CASTLE_RETURN_GATE.yMin);
    } else if (this.currentScene === 'harbour') {
      // 1. Harbour Town 45x60 Coastal Canvas backed by pixel-art image (lazy-loaded)
      if (!this.harbourBackgroundCanvas && !this.loadingWorldBg.has('harbour')) {
        this.loadingWorldBg.add('harbour');
        import('./harbourBackground')
          .then((m) => {
            this.harbourBackgroundCanvas = m.createHarbourBackgroundCanvas(this.map, () => {
              this.invalidateBackgroundCanvas();
              this.wake();
            });
            this.loadingWorldBg.delete('harbour');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('harbour'));
      }
      if (this.harbourBackgroundCanvas) {
        ctx.drawImage(this.harbourBackgroundCanvas, 0, 0);
      }
    } else if (this.currentScene === 'kingdom') {
      // 1. Royal Kingdom 45x60 Citadel Canvas backed by pixel-art image (lazy-loaded)
      if (!this.kingdomBackgroundCanvas && !this.loadingWorldBg.has('kingdom')) {
        this.loadingWorldBg.add('kingdom');
        import('./kingdomBackground')
          .then((m) => {
            this.kingdomBackgroundCanvas = m.createKingdomBackgroundCanvas(this.map, () => {
              this.invalidateBackgroundCanvas();
              this.wake();
            });
            this.loadingWorldBg.delete('kingdom');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('kingdom'));
      }
      if (this.kingdomBackgroundCanvas) {
        ctx.drawImage(this.kingdomBackgroundCanvas, 0, 0);
      }
    } else {
      // 1. Procedural 2D Pixel-Art Background Canvas (lazy-loaded)
      if (!this.townBackgroundCanvas && !this.loadingWorldBg.has('town')) {
        this.loadingWorldBg.add('town');
        import('./townBackground')
          .then((m) => {
            this.townBackgroundCanvas = m.createTownBackgroundCanvas(this.map);
            this.loadingWorldBg.delete('town');
            this.wake();
          })
          .catch(() => this.loadingWorldBg.delete('town'));
      }
      if (this.townBackgroundCanvas) {
        ctx.drawImage(this.townBackgroundCanvas, 0, 0);
      }

      // 2. Sparkling animated water reflection on the fountain pool & courtyard basin
      const fountain = townConfig.getBuilding('fountain') || { x: 30, y: 52 };
      const basin = townConfig.getBuilding('basin') || { x: 41, y: 15 };
      const shimmer = Math.sin(this.tick * 0.08);
      ctx.fillStyle = `rgba(180, 240, 255, ${0.28 + shimmer * 0.16})`;
      ctx.beginPath();
      ctx.arc((fountain.x + 2) * TILE_SIZE, (fountain.y + 2) * TILE_SIZE, 1.7 * TILE_SIZE, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc((basin.x + 1) * TILE_SIZE, (basin.y + 1) * TILE_SIZE, 0.7 * TILE_SIZE, 0, Math.PI * 2);
      ctx.fill();

      // 3. Living 100x100 Waterfalls, Coastal Surf, River Sparkles, Swimming Fish & Wildlife
      renderTownLivingWaterAndWildlife(this, ctx);

      // 3b. Animated South Digi-Gate Portal rings & sunset/night halo at (47..49, 95..96)
      this.renderPortalPulseOverlay(ctx, DIGI_GATE_PORTAL.xMin, DIGI_GATE_PORTAL.yMin);
    }

    const halfViewW = (this.canvas.width / this.zoom) / 2;
    const halfViewH = (this.canvas.height / this.zoom) / 2;
    const lightBounds = {
      minX: this.cameraX - halfViewW - 80,
      maxX: this.cameraX + halfViewW + 80,
      minY: this.cameraY - halfViewH - 80,
      maxY: this.cameraY + halfViewH + 80,
    };

    // 4. Warm street lamp lighting pools on the ground (Dynamic from townConfig)
    renderLighting(ctx, this.getActiveLamps(), lightBounds);

    // 7. Click target pulse marker & pathfinding breadcrumbs
    this.renderPathAndMarker(ctx);

    // 8. NPCs (Reading dynamic positions from townConfig)
    renderOverworldPokemonNPCs(this, ctx);

    // 8a. Ghost Trainers (Asynchronous Guestbook visitors patrolling Fountain Plaza)
    if (this.currentScene === 'town' && this.ghostTrainersEnabled && this.ghostTrainers.length > 0) {
      renderGhostTrainers(ctx, this.ghostTrainers, this.tick);
    }

    // 8b. Custom spawned Digimon (Digimon World DS lazy sprite slicing + orientation)
    this.renderCustomDigimonEntities(ctx);

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
    const hopArcY = this.isJumpingLedge
      ? -Math.round(Math.sin(Math.min(1, this.moveProgress) * Math.PI) * 11)
      : 0;

    if (this.isJumpingLedge) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 14, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.isRidingPokemon && this.activeFollower) {
      this.drawPokeRide(ctx, drawX, drawY + hopArcY, stepFrame);
    } else {
      if (this.activeFollower && followerY <= playerY) {
        this.drawFollower(ctx);
      }

      if (this.isBikeActive) {
        // Sitting on Mach Bike: render Ash slightly raised
        const bikeYOffset = -2 + hopArcY;
        drawCharacter(ctx, this.playerPalette, this.playerDir, 0, drawX, drawY + bikeYOffset, 1);
        this.drawMachBike(ctx, this.playerDir, drawX, drawY + hopArcY, this.tick, this.isMoving);
      } else {
        drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY + hopArcY, 1);
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
    if (this.isWorldScene() && !this.isJumpingLedge) {
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
    if (this.isWorldScene()) {
      if (this.townAtmosphere === 'sunset') {
        ctx.fillStyle = this.currentScene === 'digimon' ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 135, 45, 0.16)';
        ctx.fillRect(0, 0, this.map.w * TILE_SIZE, this.map.h * TILE_SIZE);
        renderLighting(ctx, this.getActiveLamps(), lightBounds);
      } else if (this.townAtmosphere === 'night') {
        // Deep indigo night atmosphere
        ctx.fillStyle = this.currentScene === 'digimon' ? 'rgba(4, 9, 26, 0.42)' : 'rgba(12, 18, 50, 0.44)';
        ctx.fillRect(0, 0, this.map.w * TILE_SIZE, this.map.h * TILE_SIZE);

        // Warm illuminated building windows at night
        if (this.currentScene === 'town') {
          this.renderNightBuildingWindows(ctx);
        }

        // Street lantern glowing pools
        renderLighting(ctx, this.getActiveLamps(), lightBounds);
      }

      // Portal twilight/night halo on top of evening atmosphere
      if (this.townAtmosphere === 'sunset' || this.townAtmosphere === 'night') {
        const portalCoords =
          this.currentScene === 'digimon'
            ? [
              { x: DIGI_RETURN_GATE.xMin, y: DIGI_RETURN_GATE.yMin, inner: 'rgba(0, 240, 255, 0.48)', mid: 'rgba(251, 191, 36, 0.18)' },
              { x: DIGI_KINGDOM_GATE.xMin, y: DIGI_KINGDOM_GATE.yMin, inner: 'rgba(251, 191, 36, 0.48)', mid: 'rgba(220, 38, 38, 0.20)' },
              { x: DIGI_DARK_CASTLE_GATE.xMin, y: DIGI_DARK_CASTLE_GATE.yMin + 0.5, inner: 'rgba(244, 63, 94, 0.50)', mid: 'rgba(147, 51, 234, 0.24)' },
              { x: DIGI_SKY_CASTLE_GATE.xMin, y: DIGI_SKY_CASTLE_GATE.yMin + 0.5, inner: 'rgba(125, 211, 252, 0.52)', mid: 'rgba(251, 191, 36, 0.24)' },
            ]
            : this.currentScene === 'kingdom'
              ? [{ x: KINGDOM_RETURN_GATE.xMin, y: KINGDOM_RETURN_GATE.yMin, inner: 'rgba(251, 191, 36, 0.45)', mid: 'rgba(56, 189, 248, 0.18)' }]
              : this.currentScene === 'harbour'
                ? [{ x: HARBOUR_RETURN_GATE.xMin, y: HARBOUR_RETURN_GATE.yMin, inner: 'rgba(251, 191, 36, 0.40)', mid: 'rgba(56, 189, 248, 0.16)' }]
                : this.currentScene === 'sky-castle'
                  ? [{ x: SKY_CASTLE_RETURN_GATE.xMin, y: SKY_CASTLE_RETURN_GATE.yMin - 1, inner: 'rgba(125, 211, 252, 0.48)', mid: 'rgba(251, 191, 36, 0.22)' }]
                  : this.currentScene === 'dark-castle'
                    ? [{ x: DARK_CASTLE_RETURN_GATE.xMin, y: DARK_CASTLE_RETURN_GATE.yMin - 1, inner: 'rgba(244, 63, 94, 0.52)', mid: 'rgba(147, 51, 234, 0.26)' }]
                    : [{ x: DIGI_GATE_PORTAL.xMin, y: DIGI_GATE_PORTAL.yMin, inner: 'rgba(0, 240, 255, 0.48)', mid: 'rgba(251, 191, 36, 0.18)' }];
        for (const p of portalCoords) {
          const gcx = (p.x + 1.5) * TILE_SIZE;
          const gcy = (p.y + 1) * TILE_SIZE;
          const halo = ctx.createRadialGradient(gcx, gcy, 4, gcx, gcy, 38);
          halo.addColorStop(0, p.inner);
          halo.addColorStop(0.55, p.mid);
          halo.addColorStop(1, 'rgba(0, 240, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(gcx, gcy, 38, 0, Math.PI * 2);
          ctx.fill();
        }
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
    if (this.isWorldScene() && this.editor.isEnabled()) {
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

  private renderPortalPulseOverlay(ctx: CanvasRenderingContext2D, startTileX: number, startTileY: number) {
    renderPortalPulseOverlayHelper(this, ctx, startTileX, startTileY);
  }

  private renderNightBuildingWindows(ctx: CanvasRenderingContext2D) {
    renderNightBuildingWindowsHelper(ctx);
  }

  /**
   * Renders all placed `kind === 'digimon'` entities with lazy DS sprite slicing,
   * elemental ground aura, N/S/W/E orientation mirroring, and digital speech indicator.
   */
  private renderCustomDigimonEntities(ctx: CanvasRenderingContext2D) {
    const digiEntities = townConfig.getBuildings().filter((b) => b.kind === 'digimon' && !b.hidden);
    if (digiEntities.length === 0) return;

    const zoneAuraColors: Record<string, { inner: string; rim: string }> = {
      flame: { inner: 'rgba(249, 115, 22, 0.30)', rim: 'rgba(251, 146, 60, 0.65)' },
      cyber: { inner: 'rgba(14, 165, 233, 0.30)', rim: 'rgba(56, 189, 248, 0.65)' },
      aqua: { inner: 'rgba(6, 182, 212, 0.30)', rim: 'rgba(103, 232, 249, 0.65)' },
      holy: { inner: 'rgba(251, 191, 36, 0.28)', rim: 'rgba(253, 224, 71, 0.65)' },
      plaza: { inner: 'rgba(0, 240, 255, 0.28)', rim: 'rgba(251, 191, 36, 0.65)' },
    };

    const halfViewW = (this.canvas.width / this.zoom) / 2;
    const halfViewH = (this.canvas.height / this.zoom) / 2;
    const cullMargin = TILE_SIZE * 5;
    const minViewX = this.cameraX - halfViewW - cullMargin;
    const maxViewX = this.cameraX + halfViewW + cullMargin;
    const minViewY = this.cameraY - halfViewH - cullMargin;
    const maxViewY = this.cameraY + halfViewH + cullMargin;

    for (const b of digiEntities) {
      const digiId = b.subType || b.id;
      const entry = getDigimonById(digiId);
      if (!entry) continue;

      const pose = this.digimonPatrol.getRenderPose(b);
      const bwPx = Math.max(TILE_SIZE, (b.w || 2) * TILE_SIZE);
      const bhPx = Math.max(TILE_SIZE, (b.h || 2) * TILE_SIZE);
      const centerX = pose.tileX * TILE_SIZE + bwPx / 2;
      const footY = pose.tileY * TILE_SIZE + bhPx - 2;
      if (centerX < minViewX || centerX > maxViewX || footY < minViewY || footY > maxViewY) {
        continue;
      }
      const bob = pose.isWalking
        ? Math.abs(Math.sin(this.tick * 0.28 + b.x)) * 1.4
        : Math.sin(this.tick * 0.055 + b.x * 0.7) * 0.8;

      const entityScale = b.scaleMultiplier || 1;
      const digiHeightScale = 1.22 * entityScale;
      const aura = zoneAuraColors[entry.elementZone] || zoneAuraColors.plaza;
      ctx.save();
      ctx.fillStyle = aura.inner;
      ctx.beginPath();
      ctx.ellipse(centerX, footY, 17 * entityScale, 6 * entityScale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = aura.rim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, footY, 15.8 * entityScale, 5.2 * entityScale, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(4, 10, 24, 0.48)';
      ctx.beginPath();
      ctx.ellipse(centerX, footY, 12.5 * entityScale, 4 * entityScale, 0, 0, Math.PI * 2);
      ctx.fill();

      this.drawDigimonOverworldSprite(
        ctx,
        entry,
        pose.orientation,
        this.tick,
        pose.isWalking,
        centerX,
        footY + bob,
        digiHeightScale,
        true
      );
      ctx.restore();

      const renderedH = Math.max(18, Math.round((entry.overworldTargetHeight || 34) * digiHeightScale));
      const bx = pose.tileX * TILE_SIZE + bwPx - 6;
      const by = footY - renderedH - 6 + Math.sin(this.tick * 0.08 + b.x * 0.5) * 1.4;
      ctx.save();
      ctx.fillStyle = '#091526';
      ctx.beginPath();
      ctx.roundRect(bx, by, 13, 9, 3);
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(bx + 2.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 5.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 8.5, by + 3.5, 1.5, 1.5);
      ctx.restore();
    }
  }

  drawDigimonOverworldSprite(
    ctx: CanvasRenderingContext2D,
    entry: DigimonCatalogEntry,
    orientation: 'N' | 'S' | 'E' | 'W',
    animTick: number,
    isWalking: boolean,
    centerX: number,
    footY: number,
    heightScale = 1,
    drawLoadingFallback = true
  ): boolean {
    const sprites = requestDigimonSprites(entry.id, () => this.wake(), 'overworld');
    if (!sprites) {
      if (drawLoadingFallback) {
        const pulse = 0.4 + 0.3 * Math.sin(this.tick * 0.12);
        ctx.fillStyle = `rgba(0, 240, 255, ${pulse})`;
        ctx.fillRect(centerX - 8, footY - 24, 16, 22);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 8, footY - 24, 16, 22);
      }
      return false;
    }

    const { frame, flipX } = selectDigimonOverworldFrame(
      entry,
      sprites,
      orientation,
      animTick,
      false,
      isWalking
    );
    if (!frame) return false;

    const targetH = Math.max(18, Math.round((entry.overworldTargetHeight || 34) * heightScale));
    const scale = targetH / frame.height;
    const drawW = Math.max(12, Math.round(frame.width * scale));
    const drawH = Math.max(12, Math.round(frame.height * scale));

    ctx.save();
    ctx.translate(Math.round(centerX), Math.round(footY));
    if (flipX) {
      ctx.scale(-1, 1);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame.canvas, -Math.round(drawW / 2), -drawH, drawW, drawH);
    ctx.restore();
    return true;
  }

  private renderWeatherParticles(ctx: CanvasRenderingContext2D) {
    renderWeatherParticlesHelper(this, ctx);
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
        if (this.currentScene === 'digimon') {
          if (getStoredActiveFollower()) {
            localStorage.setItem('digimon:active_companion', 'none');
          } else {
            localStorage.removeItem('digimon:active_companion');
          }
        } else {
          setStoredActiveFollower(null);
        }
      }
      this.wake();
      if (announce && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail:
              this.currentScene === 'digimon'
                ? '👟 Partner companion diistirahatkan.'
                : '👟 Pokémon partner diistirahatkan.',
          })
        );
        window.dispatchEvent(
          new CustomEvent('town:follower-changed', {
            detail: { follower: null, followerId: null },
          })
        );
        window.dispatchEvent(
          new CustomEvent('digimon:companion-changed', {
            detail: { companion: null, companionId: null },
          })
        );
      }
      return;
    }

    const followersMap: Record<string, { name: string; title: string; icon: string }> = {
      lucario: { name: 'Lucario', title: 'Aura Guardian', icon: '🌀' },
      charizard: { name: 'Charizard', title: 'Flame Titan', icon: '🔥' },
      gardevoir: { name: 'Gardevoir', title: 'Psychic/Fairy Guardian', icon: '🧚' },
      celebi: { name: 'Celebi', title: 'Time Travel Forest Guardian', icon: '🌿' },
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
      snorlax: { name: 'Snorlax', title: 'Sleeping Titan', icon: '😴' },
      latios: { name: 'Latios', title: 'Eon Jet Guardian', icon: '✈️' },
      latias: { name: 'Latias', title: 'Eon Mist Guardian', icon: '💖' },
      darkrai: { name: 'Darkrai', title: 'Pitch-Black Shadow', icon: '🌑' },
      necrozma: { name: 'Necrozma', title: 'Prism Solar Light', icon: '🦁' },
      lunala: { name: 'Lunala', title: 'Moone Lunar Beast', icon: '🌙' },
      solgaleo: { name: 'Solgaleo', title: 'Sunne Solar Beast', icon: '☀️' },
      samurott: { name: 'Samurott', title: 'Formidable Seamitar', icon: '⚔️' },
      empoleon: { name: 'Empoleon', title: 'Emperor Hydro Trident', icon: '🐧' },
      regigigas: { name: 'Regigigas', title: 'Colossal Continent Mover', icon: '🗿' },
      koraidon: { name: 'Koraidon', title: 'Winged King Apex Rider', icon: '🦖' },
      eternatus: { name: 'Eternatus', title: 'Dynamax Core Sovereign', icon: '☄️' },
      lugia: { name: 'Lugia', title: 'Guardian of the Seas', icon: '🌊' },
      archaludon: { name: 'Archaludon', title: 'Alloy Railgun Dragon', icon: '⚡' },
      gougingfire: { name: 'Gouging Fire', title: 'Paradox Magma Sovereign', icon: '🔥' },
      greattusk: { name: 'Great Tusk', title: 'Paradox Iron-Tusk Titan', icon: '🐘' },
      kyurem: { name: 'Kyurem', title: 'Boundary Ice Dragon', icon: '❄️' },
      salamence: { name: 'Salamence', title: 'Sky Crimson Wing', icon: '🐲' },
    };

    const cleanId = id.toLowerCase().replace(/[^a-z]/g, '');
    const matchedKey = Object.keys(followersMap).find((k) => cleanId.includes(k));
    const digiMatch = !matchedKey ? getDigimonById(id) : undefined;
    if (!matchedKey && !digiMatch) return;

    const companionId = matchedKey || digiMatch!.id;
    this.pmdAnimator.preloadPokemon(companionId);
    const data = matchedKey
      ? followersMap[matchedKey]
      : {
        name: digiMatch!.name,
        title: `${digiMatch!.stage} · ${digiMatch!.attribute}`,
        icon: digiMatch!.iconEmoji,
      };
    this.activeFollower = {
      id: companionId,
      name: data.name,
      title: data.title,
      icon: data.icon,
    };
    if (digiMatch) {
      requestDigimonSprites(digiMatch.id, () => this.wake(), 'overworld');
    }

    if (this.isRidingPokemon) {
      if (this.getRideClass(companionId) === 'charge') {
        this.ensureSafeFootPosition();
      }
      this.followerPos = { ...this.playerPos };
      this.followerTarget = { ...this.playerTarget };
      this.followerTrail = [];
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:pokeride-changed', {
            detail: { active: true, follower: this.activeFollower, rideClass: this.getRideClass(companionId) },
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
      if (this.currentScene === 'digimon' || digiMatch) {
        localStorage.setItem('digimon:active_companion', companionId);
      }
      if (this.currentScene !== 'digimon' && !digiMatch) {
        setStoredActiveFollower(companionId);
      }
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
      window.dispatchEvent(
        new CustomEvent('digimon:companion-changed', {
          detail: { companion: this.activeFollower, companionId: this.activeFollower.id },
        })
      );
    }
  }

  public triggerSignatureMove(pokemonId: string, originX?: number, originY?: number) {
    triggerSignatureMoveHelper(this, pokemonId, originX, originY);
  }

  private drawFollower(ctx: CanvasRenderingContext2D) {
    drawFollowerHelper(this, ctx);
  }

  public drawGardevoirPsychicAura(
    ctx: CanvasRenderingContext2D,
    coreX: number,
    coreY: number,
    withSparkles: boolean = true
  ) {
    drawGardevoirPsychicAuraHelper(ctx, this.tick, coreX, coreY, withSparkles);
  }

  public drawCelebiForestAura(
    ctx: CanvasRenderingContext2D,
    coreX: number,
    coreY: number,
    withSparkles: boolean = true
  ) {
    drawCelebiForestAuraHelper(ctx, this.tick, coreX, coreY, withSparkles);
  }

  private spawnRideMountFX() {
    spawnRideMountFXHelper(this);
  }

  private spawnRideTrailFX(drawX: number, drawY: number) {
    spawnRideTrailFXHelper(this, drawX, drawY);
  }

  private drawPokeRide(
    ctx: CanvasRenderingContext2D,
    drawX: number,
    drawY: number,
    stepFrame: number
  ) {
    drawPokeRideHelper(this, ctx, drawX, drawY, stepFrame);
  }

  private renderMoveParticles(ctx: CanvasRenderingContext2D) {
    renderMoveParticlesHelper(this, ctx);
  }

  public getActiveResonance(): ResonanceMatch | null {
    return findActiveResonanceHelper(this);
  }

  public triggerResonanceBurst(): ResonanceMatch | null {
    const match = triggerResonanceBurstHelper(this);
    if (!match) return null;
    if (match.grantsSpeedBoost) {
      this.coffeeBoostTimer = 15;
    }
    if (match.shiftsWeather && this.weather === 'petals') {
      this.setWeather(match.shiftsWeather);
    }
    return match;
  }

  public setGhostTrainers(entries: GuestbookEntry[]) {
    this.ghostTrainers = buildGhostTrainers(entries);
    this.wake();
  }

  public setGhostTrainersEnabled(enabled: boolean) {
    this.ghostTrainersEnabled = enabled;
    this.wake();
  }

  public areGhostTrainersEnabled(): boolean {
    return this.ghostTrainersEnabled;
  }

  showGhostTrainerBubble(ghost: GhostTrainerNpc) {
    sfx.select();
    const orgLine = ghost.org ? ` (${ghost.org})` : '';
    const title = `${ghost.avatar} ${ghost.name}${orgLine} · ${ghost.badgeRole}`;
    const body = `${ghost.stamp} — "${ghost.message}"`;
    if (this.callbacks.onBubble) {
      this.callbacks.onBubble(title, body, {
        label: '📖 Sign Guestbook Board',
        onClick: () => window.dispatchEvent(new CustomEvent('town:open-guestbook')),
      });
    } else {
      this.callbacks.onDialogue(title, [body]);
    }
  }
}
