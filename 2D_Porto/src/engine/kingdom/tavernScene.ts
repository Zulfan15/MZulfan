import { TILE_SIZE } from '../sprites';
import { drawPixelText } from '../devScene';
import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  KINGDOM_INTERIOR_COLS,
  KINGDOM_INTERIOR_ROWS,
  KINGDOM_INTERIOR_SPAWN,
  getRoyalCrests,
  type KingdomInteriorProp,
} from '../kingdomInteriorShared';
import {
  createStandardKingdomCollision,
  drawKingdomGuardians,
  drawKingdomTorch,
  renderKingdomWaves,
  type GuardianPlacement,
} from './kingdomSceneBase';

export const TAVERN_COLS = KINGDOM_INTERIOR_COLS;
export const TAVERN_ROWS = KINGDOM_INTERIOR_ROWS;
export const TAVERN_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const TAVERN_COLLISION = createStandardKingdomCollision(false);

export const TAVERN_PROPS: KingdomInteriorProp[] = [
  {
    id: 'empoleon',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'empoleon' },
    label: '🍺 Empoleon',
    style: 'empoleon',
    labelLift: 18,
    hint: 'Tavern Keeper Empoleon · Order Royal Feast & Speed Boost 🍺',
    scrollTarget: 'tav-feast-section',
  },
  {
    id: 'oak-bar',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'oak-bar' },
    label: '🪵 Tavern Counter',
    style: 'bar',
    labelLift: 20,
    hint: 'Browse Drinks, Meals & Crest of Fellowship 🪵',
    scrollTarget: 'tav-feast-section',
  },
  {
    id: 'quest-board',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'quest-board' },
    label: '📋 Quest Board',
    style: 'quest-board',
    labelLift: 12,
    hint: 'Inspect Production Missions Quest Board 📋',
    scrollTarget: 'tav-quest-section',
  },
  {
    id: 'ale-barrels',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'ale-barrels' },
    label: '🛢️ Spiced Casks',
    style: 'barrels',
    labelLift: 12,
    hint: 'Pour Spiced Cider & Activate +50% Speed Buff 🛢️',
    scrollTarget: 'tav-relic-section',
  },
  {
    id: 'snorlax',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'snorlax' },
    label: '🍖 Snorlax',
    style: 'snorlax',
    labelLift: 18,
    hint: 'Share Royal Feast beside Snorlax 🍖',
    scrollTarget: 'tav-feast-section',
  },
  {
    id: 'samurott',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'samurott' },
    label: '⚔️ Samurott',
    style: 'samurott',
    labelLift: 18,
    hint: 'Hear Bardic Project Tales from Samurott ⚔️',
    scrollTarget: 'tav-feast-section',
  },
  {
    id: 'banquet-table',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'banquet-table' },
    label: '🕯️ Banquet Table',
    style: 'banquet',
    labelLift: 16,
    hint: 'Golden Griffin Candelabra & Quest Registry 🕯️',
    scrollTarget: 'tav-quest-section',
  },
  {
    id: 'hearth-fireplace',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'hearth-fireplace' },
    label: '🔥 Tavern Hearth',
    style: 'fireplace',
    labelLift: 12,
    hint: 'Warm Up Beside the Blazing Oak Hearth 🔥',
    scrollTarget: 'tav-feast-section',
  },
  {
    id: 'bard-stage',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'bard-stage' },
    label: '🪕 Bard Corner',
    style: 'lute',
    labelLift: 12,
    hint: 'Listen to Bardic Chronicles & Check 7 Crests 🪕',
    scrollTarget: 'tav-relic-section',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'kingdom' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

const GUARDIANS: GuardianPlacement[] = [
  { kind: 'pmd', id: 'empoleon', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.9, fallbackColor: '#1d4ed8' },
  { kind: 'pmd', id: 'snorlax', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.85, fallbackColor: '#1e3a8a' },
  { kind: 'pmd', id: 'samurott', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#0284c7' },
];

let cachedBg: HTMLCanvasElement | null = null;

function createTavernBackground(): HTMLCanvasElement {
  const width = TAVERN_COLS * TILE_SIZE;
  const height = TAVERN_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Warm Oak Plank Floor
  for (let y = 2; y < TAVERN_ROWS; y++) {
    for (let x = 0; x < TAVERN_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === TAVERN_COLS - 1 || y === TAVERN_ROWS - 1;
      if (isBorder) {
        octx.fillStyle = '#451a03';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#6b3e1b';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        continue;
      }

      const alt = (x + y) % 2 === 0;
      octx.fillStyle = alt ? '#a16b3b' : '#925e32';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = '#71431f';
      octx.fillRect(px, py + 5, TILE_SIZE, 1);
      octx.fillRect(px, py + 11, TILE_SIZE, 1);
      octx.fillRect(px + (x % 2 === 0 ? 7 : 11), py, 1, TILE_SIZE);
    }
  }

  // 2. Half-Timber Tudor Wall (Rows 0..1)
  octx.fillStyle = '#f5e6c8';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  octx.fillStyle = '#5c3415';
  octx.fillRect(0, 0, width, 4);
  octx.fillRect(0, TILE_SIZE * 2 - 4, width, 4);
  for (let x = 0; x < width; x += 24) {
    octx.fillRect(x, 0, 3, TILE_SIZE * 2);
  }
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Amber-Glowing Leaded Glass Tavern Windows
  for (const wx of [2, 11]) {
    octx.fillStyle = '#451a03';
    octx.fillRect(wx * TILE_SIZE + 3, 6, 22, 18);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(wx * TILE_SIZE + 5, 8, 18, 14);
    octx.fillStyle = '#fef08a';
    octx.fillRect(wx * TILE_SIZE + 7, 10, 6, 10);
    octx.fillStyle = '#78350f';
    octx.fillRect(wx * TILE_SIZE + 13, 8, 2, 14);
  }

  // 3. Central Woven Tavern Rug Pit (4..10, 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      octx.fillStyle = (px + py) % 2 === 0 ? '#7c2d12' : '#9a3412';
      octx.fillRect(px * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1.5, pitY + 1.5, pitW - 3, pitH - 3);

  // Runner carpet
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#b45309';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#fde68a';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);

  // Corner Pedestals
  const drawPedestal = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#5c3415';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#f59e0b';
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, 27, 27);
  };
  drawPedestal(1, 3);
  drawPedestal(12, 3);
  drawPedestal(1, 8);
  drawPedestal(12, 8);

  // Exit Archway
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#451a03';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

function drawOakBarCounter(ctx: CanvasRenderingContext2D): void {
  const x = 6 * TILE_SIZE;
  const y = 1 * TILE_SIZE + 2;
  const w = 3 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 2, y, w - 4, 24);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 4, y + 2, w - 8, 6);
  // Frothy ale mugs
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 9, y + 4, 3, 4);
  ctx.fillRect(x + w - 12, y + 4, 3, 4);
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(x + 9, y + 3, 3, 1);
  ctx.fillRect(x + w - 12, y + 3, 3, 1);
}

function drawQuestBoard(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 5, y + 6, 22, 18);
  // Pinned colorful parchment mission notices
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 7, y + 8, 6, 7);
  ctx.fillRect(x + 15, y + 9, 8, 6);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 10, y + 16, 10, 6);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 9, y + 8, 2, 2);
  ctx.fillRect(x + 18, y + 9, 2, 2);
}

function drawAleBarrels(ctx: CanvasRenderingContext2D): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const ok = Boolean(getRoyalCrests().fellowship);
  for (const ox of [6, 17]) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + ox, y + 8, 9, 14);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + ox, y + 11, 9, 2);
    ctx.fillRect(x + ox, y + 18, 9, 2);
  }
  ctx.fillStyle = ok ? '#4ade80' : '#fbbf24';
  ctx.fillRect(x + 15, y + 21, 3, 2);
}

function drawTavernFireplace(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#44403c';
  ctx.fillRect(x + 5, y + 6, 22, 18);
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(x + 9, y + 12, 14, 11);
  ctx.fillStyle = tick % 14 < 7 ? '#ea580c' : '#f97316';
  ctx.fillRect(x + 11, y + 14, 10, 8);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 13, y + 16, 6, 5);
}

function drawBardStage(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  // Wooden Acoustic Lute
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(x + 16, y + 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 15, y + 7, 2, 7);
  if (tick % 32 < 16) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 21, y + 8, 2, 3);
  }
}

function drawBanquetTable(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 2, py + 6, 12, 9);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(px + 4, py + 7, 8, 5);
  ctx.fillStyle = tick % 16 < 8 ? '#fbbf24' : '#fde047';
  ctx.fillRect(px + 7, py + 4, 2, 3);
}

export function renderTavernScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createTavernBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#fbbf24');
  }

  drawOakBarCounter(ctx);
  drawQuestBoard(ctx);
  drawAleBarrels(ctx);
  drawTavernFireplace(ctx, tick);
  drawBardStage(ctx, tick);
  drawBanquetTable(ctx, tick);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderKingdomWaves(ctx, 'kingdom-tavern');
}
