import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  SKY_INTERIOR_COLS,
  SKY_INTERIOR_ROWS,
  SKY_INTERIOR_SPAWN,
  type SkyInteriorProp,
} from '../skyInteriorShared';
import {
  buildSkyBackgroundCanvas,
  createStandardSkyCollision,
  drawSkyCloudWindowDrift,
  drawSkyCrystalCenterpiece,
  drawSkyGuardians,
  drawSkyLantern,
  renderSkyWaves,
  type SkyGuardianPlacement,
} from './skySceneBase';
import { TILE_SIZE } from '../sprites';

export const INN_COLS = SKY_INTERIOR_COLS;
export const INN_ROWS = SKY_INTERIOR_ROWS;
export const INN_SPAWN = SKY_INTERIOR_SPAWN;
export const INN_COLLISION = createStandardSkyCollision(false);

export const INN_PROPS: SkyInteriorProp[] = [
  {
    id: 'latias',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:inn:latias' },
    label: '💖 Latias · Hearth Host',
    style: 'sky-inn',
    labelLift: 1.3,
    scrollTarget: 'inn-trial',
    hint: 'Latias welcomes travellers across the clouds! Serve all 3 Fellowship & Lab Mentoring Orders below to claim the Plume of Hearth.',
  },
  {
    id: 'hearth-fireplace',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:inn:hearth' },
    label: '🔥 Oak Hearth & Sky-Kettle',
    style: 'sky-inn',
    labelLift: 0.95,
    scrollTarget: 'inn-trial',
    hint: 'Crackling amber hearth warming spiced sky-berry tea and cloud pastries beside Avalon’s southwest waterfall.',
  },
  {
    id: 'tea-counter',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:inn:tea' },
    label: '🍵 Sky-Berry Tea Bar',
    style: 'sky-inn',
    labelLift: 0.55,
    scrollTarget: 'inn-trial',
    hint: 'Steeping aromatic sky-berry infusions that recharge exhausted engineers to 100% stamina.',
  },
  {
    id: 'mentoring-board',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:inn:mentoring' },
    label: '📋 Mentoring & Practicum Board',
    style: 'sky-inn',
    labelLift: 0.55,
    scrollTarget: 'inn-mentoring',
    hint: 'Chronicles Zulfan’s ITENAS teaching practicums across Computer Networks, OOP Java & Database Systems.',
  },
  {
    id: 'phoenixmon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:inn:phoenixmon' },
    label: '🦅 Phoenixmon · Mentor Spirit',
    style: 'sky-inn',
    labelLift: 1.05,
    scrollTarget: 'inn-mentoring',
    hint: 'Four golden wings of patience — guiding practicum students from fundamentals to reliable systems.',
  },
  {
    id: 'zhuqiaomon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:inn:zhuqiaomon' },
    label: '🔥 Zhuqiaomon · Crimson Host',
    style: 'sky-inn',
    labelLift: 1.05,
    scrollTarget: 'inn-community',
    hint: 'Sovereign Crimson Bird celebrating community initiatives like FoodLink & FoodRescue that bridge technology with human empathy.',
  },
  {
    id: 'tea-kettle-pedestal',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:inn:kettle' },
    label: '🫖 Golden Fellowship Samovar',
    style: 'sky-inn',
    labelLift: 1.0,
    scrollTarget: 'inn-trial',
    hint: 'Serve every fellowship tray in sequence (01 → 03) to warm the inn’s heart and unlock the Plume of Hearth.',
  },
  {
    id: 'fellowship-table',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:inn:table' },
    label: '🥐 Cloud Pastry Table',
    style: 'sky-inn',
    labelLift: 0.5,
    scrollTarget: 'inn-community',
    hint: 'Where FoodLink builders, interns & lab assistants share design notes over toasted brioche.',
  },
  {
    id: 'inn-guestbook',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:inn:guestbook' },
    label: '📖 Avalon Guestbook',
    style: 'sky-inn',
    labelLift: 0.5,
    scrollTarget: 'inn-plumes-ledger',
    hint: 'Tracks all 6 Celestial Plumes earned across Sky Castle Avalon.',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'sky-castle' },
    label: 'Exit',
    style: 'sky-inn',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'latias', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#f43f5e' },
  { kind: 'digimon', id: 'phoenixmon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#fbbf24' },
  { kind: 'digimon', id: 'zhuqiaomon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#ef4444' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = Math.sin(tick * 0.14) > 0;

  // North Hearth Fireplace (6..8, 1)
  const fx = 6 * TILE_SIZE + 6;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(fx, 4, 36, 18);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(fx + 5, 8, 26, 14);
  ctx.fillStyle = pulse ? '#f97316' : '#fbbf24';
  ctx.fillRect(fx + 10, 12, 16, 8);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(fx + 14, 14, 8, 5);

  // NW Sky-Berry Tea Bar (1..2, 3..4)
  const tx = 1 * TILE_SIZE + 5;
  const ty = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(tx, ty, 22, 20);
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(tx + 3, ty + 3, 6, 6);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(tx + 12, ty + 4, 6, 6);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(tx + 4, ty + 13, 14, 4);

  // NE Mentoring Board (12..13, 3..4)
  const mx = 12 * TILE_SIZE + 5;
  const my = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(mx, my, 22, 20);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(mx + 3, my + 3, 16, 14);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(mx + 5, my + 5, 12, 2);
  ctx.fillRect(mx + 5, my + 9, 10, 2);
  ctx.fillRect(mx + 5, my + 13, 11, 2);

  // SW Cloud Pastry Table (1..2, 8..9)
  const px = 1 * TILE_SIZE + 6;
  const py = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px, py, 20, 18);
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(px + 3, py + 4, 6, 4);
  ctx.fillRect(px + 11, py + 4, 6, 4);
  ctx.fillStyle = '#fb7185';
  ctx.fillRect(px + 7, py + 11, 6, 4);

  // SE Avalon Guestbook (12..13, 8..9)
  const gx = 12 * TILE_SIZE + 6;
  const gy = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(gx, gy, 20, 18);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(gx + 3, gy + 3, 14, 12);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(gx + 9, gy + 3, 2, 12);
}

export function renderInnScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#fef3c7',
      floorB: '#fde68a',
      pitA: '#ffedd5',
      pitB: '#fed7aa',
      wallBg: '#451a03',
      wallBrick: '#78350f',
      trimGold: '#f59e0b',
      trimAccent: '#d97706',
      bannerColor: '#b45309',
      carpetColor: '#b45309',
      pedestalOuter: '#451a03',
      pedestalInner: '#92400e',
      lanternColor: '#fbbf24',
      windowSkyTop: '#f59e0b',
      windowCloudBottom: '#fef3c7',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawSkyCloudWindowDrift(ctx, tick);
  drawStationDetails(ctx, tick);

  for (const [lx, ly] of [
    [4, 3],
    [10, 3],
    [4, 9],
    [10, 9],
  ]) {
    drawSkyLantern(ctx, lx, ly, tick, '#fbbf24');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#f59e0b');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-inn');
}
