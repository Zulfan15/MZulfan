import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  HARBOUR_INTERIOR_COLS,
  HARBOUR_INTERIOR_ROWS,
  HARBOUR_INTERIOR_SPAWN,
  type HarbourInteriorProp,
} from '../harbourInteriorShared';
import {
  buildHarbourBackgroundCanvas,
  createStandardHarbourCollision,
  drawHarbourCompassCenterpiece,
  drawHarbourGuardians,
  drawHarbourLantern,
  drawHarbourSeaWindowShimmer,
  renderHarbourWaves,
  type HarbourGuardianPlacement,
} from './harbourSceneBase';
import { TILE_SIZE } from '../sprites';

export const GALLEON_COLS = HARBOUR_INTERIOR_COLS;
export const GALLEON_ROWS = HARBOUR_INTERIOR_ROWS;
export const GALLEON_SPAWN = HARBOUR_INTERIOR_SPAWN;
export const GALLEON_COLLISION = createStandardHarbourCollision(false);

export const GALLEON_PROPS: HarbourInteriorProp[] = [
  {
    id: 'neptunemon',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:galleon:neptunemon' },
    label: '🔱 Neptunemon · Lord Admiral',
    style: 'harbour-galleon',
    labelLift: 1.3,
    scrollTarget: 'gal-helm-trial',
    hint: 'Lord Admiral Neptunemon commands the Sovereign Brigantine! Lock the Brass Ship’s Helm 3× in the gold wave zone to earn the Seal of the Armada.',
  },
  {
    id: 'admiral-window',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'harbour:galleon:stern' },
    label: '🪟 Great Stern Gallery',
    style: 'harbour-galleon',
    labelLift: 0.95,
    scrollTarget: 'gal-flagship-section',
    hint: 'Stained-Glass Captain’s Stern Gallery — panoramic view over Avalon Bay and the twin flagship oak piers.',
  },
  {
    id: 'port-cannons',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:galleon:cannons' },
    label: '💣 Bronze Broadside Guns',
    style: 'harbour-galleon',
    labelLift: 0.55,
    scrollTarget: 'gal-helm-trial',
    hint: 'Heavy Cast-Bronze Broadside Battery — fires ceremonial golden salvos whenever the Admiral’s helm trial succeeds!',
  },
  {
    id: 'war-map',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:galleon:warmap' },
    label: '🗺️ Admiral War-Map Table',
    style: 'harbour-galleon',
    labelLift: 0.55,
    scrollTarget: 'gal-flagship-section',
    hint: 'Flagship War-Map Table — inspect deep architectural blueprints of AeroScan, FoodLink, OMR Grading & the 2D Portfolio Engine.',
  },
  {
    id: 'garchomp',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:galleon:garchomp' },
    label: '🦈 Garchomp',
    style: 'harbour-galleon',
    labelLift: 1.05,
    scrollTarget: 'gal-flagship-section',
    hint: 'Garchomp slices through heavy workloads at supersonic speed — benchmarked at >500 FPS on AeroScan TensorRT!',
  },
  {
    id: 'metalseadramon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:galleon:metalseadramon' },
    label: '🐉 MetalSeadramon',
    style: 'harbour-galleon',
    labelLift: 1.05,
    scrollTarget: 'gal-helm-trial',
    hint: 'MetalSeadramon patrols the Chrome Digizoid hull: "Steer through the Azure swells cleanly below to unleash a Royal Salvo!"',
  },
  {
    id: 'brass-helm',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:galleon:helm' },
    label: '☸️ Sovereign Ship’s Helm',
    style: 'harbour-galleon',
    labelLift: 1.0,
    scrollTarget: 'gal-helm-trial',
    hint: 'The Great Brass Ship’s Helm — time your rudder command on the Helm Trial Gauge below!',
  },
  {
    id: 'treasure-chest',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:galleon:chest' },
    label: '💎 Armada Strongbox',
    style: 'harbour-galleon',
    labelLift: 0.5,
    scrollTarget: 'gal-flagship-section',
    hint: 'Iron-Bound Flagship Vault — houses verified production weights, CI/CD release logs, and battle-tested artifacts.',
  },
  {
    id: 'ship-bell',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:galleon:bell' },
    label: '🔔 Brass Quarterdeck Bell',
    style: 'harbour-galleon',
    labelLift: 0.5,
    scrollTarget: 'gal-seals-ledger',
    hint: 'Cast Brass Quarterdeck Bell — tolls across both twin oak piers when all 5 Maritime Seals are united!',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'harbour' },
    label: 'Exit',
    style: 'harbour-galleon',
    hideLabel: true,
  },
];

const GUARDIANS: HarbourGuardianPlacement[] = [
  { kind: 'digimon', id: 'neptunemon', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.84, fallbackColor: '#0284c7' },
  { kind: 'pmd', id: 'garchomp', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.85, fallbackColor: '#1d4ed8' },
  { kind: 'digimon', id: 'metalseadramon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#fbbf24' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawGalleonDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const shimmer = Math.sin(tick * 0.1) > 0;

  // Admiral Great Stern Gallery Window (6..8, 1)
  const gx = 6 * TILE_SIZE + 6;
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(gx, 6, 36, 16);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(gx + 0.5, 6.5, 35, 15);
  ctx.fillStyle = shimmer ? '#7dd3fc' : '#38bdf8';
  ctx.fillRect(gx + 4, 9, 8, 10);
  ctx.fillRect(gx + 14, 9, 8, 10);
  ctx.fillRect(gx + 24, 9, 8, 10);

  // NW Bronze Broadside Guns (1..2, 3..4)
  const cx = 1 * TILE_SIZE + 5;
  const cy = 3 * TILE_SIZE + 6;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx, cy + 4, 20, 14);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx + 2, cy + 7, 16, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx + 16, cy + 8, 4, 4);

  // NE Admiral War-Map Table (12..13, 3..4)
  const wx = 12 * TILE_SIZE + 5;
  const wy = 3 * TILE_SIZE + 6;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(wx, wy, 22, 18);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(wx + 3, wy + 3, 16, 12);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(wx + 5, wy + 5, 12, 8);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(wx + 9, wy + 8, 3, 3);

  // SW Armada Strongbox (1..2, 8..9)
  const vx = 1 * TILE_SIZE + 6;
  const vy = 8 * TILE_SIZE + 7;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(vx, vy, 20, 15);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(vx, vy + 4, 20, 2);
  ctx.fillRect(vx + 8, vy + 6, 4, 4);

  // SE Brass Quarterdeck Bell (12..13, 8..9)
  const bx = 13 * TILE_SIZE;
  const by = 9 * TILE_SIZE;
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(bx - 5, by - 7, 10, 9);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(bx - 3, by - 5, 6, 5);
}

export function renderGalleonScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildHarbourBackgroundCanvas({
      floorA: '#7c5130',
      floorB: '#6b4426',
      pitA: '#0b2545',
      pitB: '#0f3057',
      wallBg: '#271911',
      wallBrick: '#432818',
      trimBrass: '#fbbf24',
      trimAccent: '#0284c7',
      bannerColor: '#1e3a8a',
      carpetColor: '#0c4a6e',
      isWoodDeck: true,
      lanternColor: '#38bdf8',
      windowSkyTop: '#38bdf8',
      windowSeaBottom: '#0c4a6e',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawHarbourSeaWindowShimmer(ctx, tick);
  drawGalleonDetails(ctx, tick);
  drawHarbourLantern(ctx, 4, 3, tick, '#fbbf24');
  drawHarbourLantern(ctx, 10, 3, tick, '#fbbf24');
  drawHarbourLantern(ctx, 4, 9, tick, '#38bdf8');
  drawHarbourLantern(ctx, 10, 9, tick, '#38bdf8');
  drawHarbourCompassCenterpiece(ctx, tick, '#38bdf8');
  drawHarbourGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderHarbourWaves(ctx, 'harbour-galleon');
}
