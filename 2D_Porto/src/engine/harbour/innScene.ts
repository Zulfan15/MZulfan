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

export const INN_COLS = HARBOUR_INTERIOR_COLS;
export const INN_ROWS = HARBOUR_INTERIOR_ROWS;
export const INN_SPAWN = HARBOUR_INTERIOR_SPAWN;
export const INN_COLLISION = createStandardHarbourCollision(false);

export const INN_PROPS: HarbourInteriorProp[] = [
  {
    id: 'urshifu',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:inn:urshifu' },
    label: '🥋 Urshifu · Harbourmaster',
    style: 'harbour-inn',
    labelLift: 1.3,
    scrollTarget: 'inn-route-trial',
    hint: 'Harbourmaster Urshifu mentors fleets before departure! Plot a connected 4-waypoint sea passage across the archipelago to claim the Seal of the Navigator.',
  },
  {
    id: 'tudor-hearth',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'harbour:inn:hearth' },
    label: '🔥 Tudor Brick Hearth',
    style: 'harbour-inn',
    labelLift: 0.95,
    scrollTarget: 'inn-crew-section',
    hint: 'Roaring Tudor Hearth — fills the inn with oak warmth while sailors share stories from PT Dwi Purwa Teknologi & 6 terms of ITENAS Lab instruction.',
  },
  {
    id: 'tea-counter',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:inn:tea' },
    label: '☕ Spiced Sea-Tea Bar',
    style: 'harbour-inn',
    labelLift: 0.55,
    scrollTarget: 'inn-crew-section',
    hint: 'Spiced Harbour Tea & Bread Bar — brew a cup below once the route is charted to gain +50% Overdrive Sprint speed across Avalon!',
  },
  {
    id: 'ship-cabinet',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:inn:cabinet' },
    label: '⛵ Ship-in-Bottle Curios',
    style: 'harbour-inn',
    labelLift: 0.55,
    scrollTarget: 'inn-crew-section',
    hint: 'Glass Ship Display — commemorates the IDEA FEST 3 Bronze Medal team & Robotics Laboratory Assistant Coordinator voyage.',
  },
  {
    id: 'gardevoir',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:inn:gardevoir' },
    label: '✨ Gardevoir',
    style: 'harbour-inn',
    labelLift: 1.05,
    scrollTarget: 'inn-crew-section',
    hint: 'Gardevoir harmonizes mentorship & clarity across Database, OOP, Networking, IoT, and Robotics labs.',
  },
  {
    id: 'plesiomon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:inn:plesiomon' },
    label: '🌊 Plesiomon',
    style: 'harbour-inn',
    labelLift: 1.05,
    scrollTarget: 'inn-route-trial',
    hint: 'Plesiomon scouts sea shoals ahead of the fleet — connect the 4 safe beacons on the chart table while dodging storm reefs.',
  },
  {
    id: 'chart-table',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:inn:chart' },
    label: '🗺️ Captain Chart Table',
    style: 'harbour-inn',
    labelLift: 1.0,
    scrollTarget: 'inn-route-trial',
    hint: 'Mahogany Captain Chart Table — plot the connected 4-Waypoint Archipelago Passage below!',
  },
  {
    id: 'sailors-log',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:inn:logbook' },
    label: '📖 Sailors’ Guestbook',
    style: 'harbour-inn',
    labelLift: 0.5,
    scrollTarget: 'inn-crew-section',
    hint: 'Leather-bound Crew Ledger — records every practicals syllabus, MikroTik lab guide, and ESP32 mentoring hour.',
  },
  {
    id: 'garden-window',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:inn:window' },
    label: '🌺 Garden Bay Window',
    style: 'harbour-inn',
    labelLift: 0.5,
    scrollTarget: 'inn-seals-ledger',
    hint: 'Flowering Bay Window looking out onto Dockside Market Square and the sunlit southern shore.',
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
    style: 'harbour-inn',
    hideLabel: true,
  },
];

const GUARDIANS: HarbourGuardianPlacement[] = [
  { kind: 'pmd', id: 'urshifu', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#475569' },
  { kind: 'pmd', id: 'gardevoir', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.85, fallbackColor: '#34d399' },
  { kind: 'digimon', id: 'plesiomon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#38bdf8' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawInnDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const flicker = Math.sin(tick * 0.22) > 0;

  // Glowing Tudor Brick Hearth (6..8, 1)
  const hx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(hx, 6, 32, 16);
  ctx.fillStyle = flicker ? '#ea580c' : '#f97316';
  ctx.fillRect(hx + 6, 11, 20, 10);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(hx + 10, 14, 12, 6);

  // NW Tea & Bread Counter (1..2, 3..4)
  const tx = 1 * TILE_SIZE + 5;
  const ty = 3 * TILE_SIZE + 6;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(tx, ty, 22, 18);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(tx + 4, ty + 4, 6, 6);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(tx + 13, ty + 6, 6, 4);

  // NE Ship-in-Bottle Cabinet (12..13, 3..4)
  const cx = 12 * TILE_SIZE + 5;
  const cy = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#431407';
  ctx.fillRect(cx, cy, 22, 20);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(cx + 3, cy + 4, 16, 10);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx + 9, cy + 5, 4, 6);

  // SW Sailors Guestbook Desk (1..2, 8..9)
  const gx = 1 * TILE_SIZE + 6;
  const gy = 8 * TILE_SIZE + 8;
  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(gx, gy, 20, 14);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(gx + 3, gy + 3, 14, 8);

  // SE Blooming Garden Window Box (12..13, 8..9)
  const fx = 12 * TILE_SIZE + 5;
  const fy = 8 * TILE_SIZE + 8;
  ctx.fillStyle = '#15803d';
  ctx.fillRect(fx, fy + 4, 22, 10);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(fx + 3, fy + 6, 3, 3);
  ctx.fillRect(fx + 14, fy + 7, 3, 3);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(fx + 9, fy + 5, 3, 3);
}

export function renderInnScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildHarbourBackgroundCanvas({
      floorA: '#9a6b3e',
      floorB: '#875b32',
      pitA: '#6e4526',
      pitB: '#5c381d',
      wallBg: '#451a03',
      wallBrick: '#78350f',
      trimBrass: '#f59e0b',
      trimAccent: '#b91c1c',
      bannerColor: '#b91c1c',
      carpetColor: '#991b1b',
      isWoodDeck: true,
      lanternColor: '#fbbf24',
      windowSkyTop: '#fde68a',
      windowSeaBottom: '#0284c7',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawHarbourSeaWindowShimmer(ctx, tick);
  drawInnDetails(ctx, tick);
  drawHarbourLantern(ctx, 4, 3, tick, '#fbbf24');
  drawHarbourLantern(ctx, 10, 3, tick, '#fbbf24');
  drawHarbourLantern(ctx, 4, 9, tick, '#f97316');
  drawHarbourLantern(ctx, 10, 9, tick, '#f97316');
  drawHarbourCompassCenterpiece(ctx, tick, '#f87171');
  drawHarbourGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderHarbourWaves(ctx, 'harbour-inn');
}
