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

export const BARRACKS_COLS = KINGDOM_INTERIOR_COLS;
export const BARRACKS_ROWS = KINGDOM_INTERIOR_ROWS;
export const BARRACKS_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const BARRACKS_COLLISION = createStandardKingdomCollision(false);

export const BARRACKS_PROPS: KingdomInteriorProp[] = [
  {
    id: 'lucario',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'lucario' },
    label: '🛡️ Lucario',
    style: 'lucario',
    labelLift: 20,
    hint: 'Train with Drill Commander Lucario 🛡️',
    scrollTarget: 'bar-archery-game',
  },
  {
    id: 'war-map',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'war-map' },
    label: '🗺️ War Table',
    style: 'war-map',
    labelLift: 20,
    hint: 'Inspect Tactical Garrison Campaign Map 🗺️',
    scrollTarget: 'bar-valor-section',
  },
  {
    id: 'honors-banner',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'honors-banner' },
    label: '🏆 Hall of Valor',
    style: 'honors',
    labelLift: 12,
    hint: 'Inspect Honors & 6 Laboratory/Intern Campaigns 🏆',
    scrollTarget: 'bar-valor-section',
  },
  {
    id: 'archery-rack',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'archery-rack' },
    label: '🎯 Archery Range',
    style: 'archery',
    labelLift: 12,
    hint: 'Enter Lucario’s 15-Second Bullseye Drill 🎯',
    scrollTarget: 'bar-archery-game',
  },
  {
    id: 'kentaurosmon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'kentaurosmon' },
    label: '🐎 Kentaurosmon',
    style: 'kentaurosmon',
    labelLift: 18,
    hint: 'Consult Royal Vanguard Kentaurosmon 🐎',
    scrollTarget: 'bar-valor-section',
  },
  {
    id: 'salamence',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'salamence' },
    label: '🐲 Salamence',
    style: 'salamence',
    labelLift: 18,
    hint: 'Consult Sky Patrol Drake Salamence 🐲',
    scrollTarget: 'bar-archery-game',
  },
  {
    id: 'vanguard-crest',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'vanguard-crest' },
    label: '⚔️ Honor Plinth',
    style: 'pedestal',
    labelLift: 16,
    hint: 'Inspect Vanguard Plinth & +50% Sprint Buff ⚔️',
    scrollTarget: 'bar-relic-section',
  },
  {
    id: 'training-dummy',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'training-dummy' },
    label: '🥋 Sparring Post',
    style: 'dummy',
    labelLift: 12,
    hint: 'Warm Up Reflexes on the Garrison Post 🥋',
    scrollTarget: 'bar-archery-game',
  },
  {
    id: 'quarters-trunk',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'quarters-trunk' },
    label: '📦 Valor Coffer',
    style: 'trunk',
    labelLift: 12,
    hint: 'Open Garrison Relic Coffer & 7 Crests Registry 📦',
    scrollTarget: 'bar-relic-section',
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
  { kind: 'pmd', id: 'lucario', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.92, fallbackColor: '#2563eb' },
  { kind: 'digimon', id: 'kentaurosmon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.82, fallbackColor: '#f59e0b' },
  { kind: 'pmd', id: 'salamence', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.82, fallbackColor: '#1d4ed8' },
];

let cachedBg: HTMLCanvasElement | null = null;

function createBarracksBackground(): HTMLCanvasElement {
  const width = BARRACKS_COLS * TILE_SIZE;
  const height = BARRACKS_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Cut Blue-Grey Granite Garrison Tiles
  for (let y = 2; y < BARRACKS_ROWS; y++) {
    for (let x = 0; x < BARRACKS_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === BARRACKS_COLS - 1 || y === BARRACKS_ROWS - 1;
      if (isBorder) {
        octx.fillStyle = '#1e293b';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#334155';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? '#cbd5e1' : '#b8c4d4';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = checker ? '#e2e8f0' : '#cbd5e1';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#64748b';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
    }
  }

  // 2. North Granite Battlement Wall with Cobalt Shield Banners
  octx.fillStyle = '#1e293b';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#334155' : '#263347';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
    }
  }
  octx.fillStyle = '#0284c7';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  for (const bx of [3, 11]) {
    octx.fillStyle = '#1e40af';
    octx.fillRect(bx * TILE_SIZE + 2, 4, 14, 22);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(bx * TILE_SIZE + 6, 8, 6, 9);
  }

  // 3. Sunken Tactical Drill Yard (4..10, 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      octx.fillStyle = (px + py) % 2 === 0 ? '#334155' : '#3e4f66';
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    }
  }
  // Tactical Crosshair Lines
  octx.fillStyle = '#0ea5e9';
  octx.fillRect(pitX + 4, 6 * TILE_SIZE + 7, pitW - 8, 2);
  octx.fillRect(7 * TILE_SIZE + 7, pitY + 4, 2, pitH - 8);
  octx.strokeStyle = '#0284c7';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // 4. Cobalt Garrison Runner Carpet (col 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#1d4ed8';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);

  // Corner Pedestals
  const drawBase = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#334155';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#38bdf8';
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, 27, 27);
  };
  drawBase(1, 3);
  drawBase(12, 3);
  drawBase(1, 8);
  drawBase(12, 8);

  // Exit Archway (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#0f172a';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#38bdf8';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#f8fafc', 1, 'center');

  return off;
}

function drawWarTable(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 6 * TILE_SIZE;
  const y = 0 * TILE_SIZE + 8;
  const w = 3 * TILE_SIZE;
  // Oak Tactical Table
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 6, y + 6, w - 12, 16);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 9, y + 8, w - 18, 11);
  // Animated Route Pin Marker
  ctx.fillStyle = tick % 24 < 12 ? '#ef4444' : '#3b82f6';
  ctx.fillRect(x + w / 2 - 2, y + 12, 3, 3);
}

function drawHonorsCase(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 7, 22, 17);
  // Trophy Medals
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 8, y + 10, 5, 8);
  ctx.fillRect(x + 18, y + 10, 5, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 14, y + 12, 3, 6);
}

function drawArcheryTargetRack(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 2);
  // Bullseye Straw Target
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(x + 16 + bob, y + 15, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(x + 16 + bob, y + 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 15 + bob, y + 14, 2, 2);
}

function drawTrainingDummy(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const sway = Math.round(Math.sin(tick * 0.09));
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 14, y + 11, 4, 14);
  ctx.fillRect(x + 9 + sway, y + 12, 14, 3);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 12 + sway, y + 6, 8, 7);
}

function drawValorTrunk(ctx: CanvasRenderingContext2D): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const ok = Boolean(getRoyalCrests().valor);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x + 6, y + 10, 20, 13);
  ctx.strokeStyle = ok ? '#4ade80' : '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 6.5, y + 10.5, 19, 12);
  ctx.fillStyle = ok ? '#4ade80' : '#fbbf24';
  ctx.fillRect(x + 15, y + 14, 2, 4);
}

function drawHonorPlinth(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 8, 10, 7);
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + bob + 1);
  ctx.lineTo(px + 12, py + bob + 5);
  ctx.lineTo(px + 8, py + bob + 9);
  ctx.lineTo(px + 4, py + bob + 5);
  ctx.closePath();
  ctx.fill();
}

export function renderBarracksScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createBarracksBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#38bdf8');
  }

  drawWarTable(ctx, tick);
  drawHonorsCase(ctx);
  drawArcheryTargetRack(ctx, tick);
  drawTrainingDummy(ctx, tick);
  drawValorTrunk(ctx);
  drawHonorPlinth(ctx, tick);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderKingdomWaves(ctx, 'kingdom-barracks');
}
