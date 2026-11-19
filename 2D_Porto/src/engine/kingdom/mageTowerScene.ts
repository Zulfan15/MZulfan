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

export const MAGE_COLS = KINGDOM_INTERIOR_COLS;
export const MAGE_ROWS = KINGDOM_INTERIOR_ROWS;
export const MAGE_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const MAGE_COLLISION = createStandardKingdomCollision(false);

export const MAGE_PROPS: KingdomInteriorProp[] = [
  {
    id: 'mewtwo',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'mewtwo' },
    label: '🔮 Mewtwo',
    style: 'mewtwo',
    labelLift: 20,
    hint: 'Consult Archmage Mewtwo · ML Rune Constellation Puzzle 🔮',
    scrollTarget: 'mage-rune-game',
  },
  {
    id: 'astral-telescope',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'astral-telescope' },
    label: '🔭 Observatory',
    style: 'telescope',
    labelLift: 22,
    hint: 'Peer Through the Celestial Observatory 🔭',
    scrollTarget: 'mage-rune-game',
  },
  {
    id: 'arcana-grimoire',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'arcana-grimoire' },
    label: '📖 Research Codex',
    style: 'codex',
    labelLift: 12,
    hint: 'Study YOLOv11, InceptionV3 & Thesis Research Papers 📖',
    scrollTarget: 'mage-grimoire-section',
  },
  {
    id: 'ley-crystal',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'ley-crystal' },
    label: '✨ Mana Prism',
    style: 'prism',
    labelLift: 12,
    hint: 'Channel Arcane Haste Buff & Check 7 Crests ✨',
    scrollTarget: 'mage-relic-section',
  },
  {
    id: 'latias',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'latias' },
    label: '❤️ Latias',
    style: 'latias',
    labelLift: 18,
    hint: 'Consult Dataset & Feature Strategist Latias ❤️',
    scrollTarget: 'mage-grimoire-section',
  },
  {
    id: 'latios',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'latios' },
    label: '💙 Latios',
    style: 'latios',
    labelLift: 18,
    hint: 'Consult TensorRT Jet-Inference Guide Latios 💙',
    scrollTarget: 'mage-rune-game',
  },
  {
    id: 'rune-circle',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'rune-circle' },
    label: '🌟 Rune Nexus',
    style: 'nexus',
    labelLift: 16,
    hint: 'Align the Central Arcane Pipeline Nexus 🌟',
    scrollTarget: 'mage-rune-game',
  },
  {
    id: 'alchemy-alembic',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'alchemy-alembic' },
    label: '⚗️ Alembic',
    style: 'alembic',
    labelLift: 12,
    hint: 'Distill Clean Datasets & Synthetic Augmentation ⚗️',
    scrollTarget: 'mage-grimoire-section',
  },
  {
    id: 'star-orrery',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'star-orrery' },
    label: '🌌 Orrery',
    style: 'orrery',
    labelLift: 12,
    hint: 'Inspect Future R&D Roadmap & Arcane Coffer 🌌',
    scrollTarget: 'mage-relic-section',
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
  { kind: 'pmd', id: 'mewtwo', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.78, fallbackColor: '#a855f7' },
  { kind: 'pmd', id: 'latias', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.85, fallbackColor: '#f43f5e' },
  { kind: 'pmd', id: 'latios', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.85, fallbackColor: '#38bdf8' },
];

const STARLIGHT_MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: 16 + ((i * 39) % 208),
  y: 36 + ((i * 23) % 136),
  speed: 0.16 + (i % 4) * 0.05,
  phase: i * 1.1,
  color: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#fde047' : '#38bdf8',
}));

let cachedBg: HTMLCanvasElement | null = null;

function createMageTowerBackground(): HTMLCanvasElement {
  const width = MAGE_COLS * TILE_SIZE;
  const height = MAGE_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Enchanted Indigo Mosaic Observatory Floor
  for (let y = 2; y < MAGE_ROWS; y++) {
    for (let x = 0; x < MAGE_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === MAGE_COLS - 1 || y === MAGE_ROWS - 1;
      if (isBorder) {
        octx.fillStyle = '#1e1b4b';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#312e81';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        continue;
      }

      const alt = (x + y) % 2 === 0;
      octx.fillStyle = alt ? '#36326b' : '#403b7d';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = 'rgba(255,255,255,0.08)';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
    }
  }

  // 2. North Celestial Library & Starry Wall
  octx.fillStyle = '#1e1b4b';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  octx.fillStyle = '#6366f1';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Bookshelves flanking North Observatory
  for (const bx of [2, 11]) {
    octx.fillStyle = '#78350f';
    octx.fillRect(bx * TILE_SIZE + 2, 4, 24, 22);
    for (let shelf = 7; shelf <= 20; shelf += 6) {
      octx.fillStyle = '#c084fc';
      octx.fillRect(bx * TILE_SIZE + 4, shelf, 6, 4);
      octx.fillStyle = '#38bdf8';
      octx.fillRect(bx * TILE_SIZE + 11, shelf, 5, 4);
      octx.fillStyle = '#fbbf24';
      octx.fillRect(bx * TILE_SIZE + 17, shelf, 6, 4);
    }
  }

  // 3. Sunken Ritual Astrolabe Pit (4..10, 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      octx.fillStyle = (px + py) % 2 === 0 ? '#1e1b4b' : '#26215c';
      octx.fillRect(px * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  octx.strokeStyle = '#a855f7';
  octx.lineWidth = 1.5;
  octx.beginPath();
  octx.arc(cx, cy, 34, 0, Math.PI * 2);
  octx.stroke();
  octx.strokeStyle = '#fbbf24';
  octx.beginPath();
  octx.arc(cx, cy, 22, 0, Math.PI * 2);
  octx.stroke();

  octx.strokeStyle = '#6366f1';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // Violet carpet runner
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#6d28d9';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#fde047';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);

  // Corner Pedestals
  const drawPedestal = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#312e81';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#c084fc';
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
  octx.fillStyle = '#1e1b4b';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#c084fc';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#f3e8ff', 1, 'center');

  return off;
}

function drawTelescope(ctx: CanvasRenderingContext2D): void {
  const x = 6 * TILE_SIZE;
  const y = 0 * TILE_SIZE + 6;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 20, y + 14, 8, 10);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 12, y + 6, 22, 6);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 33, y + 5, 3, 8);
}

function drawArcanaCodex(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const hover = Math.round(Math.sin(tick * 0.08));
  ctx.fillStyle = '#312e81';
  ctx.fillRect(x + 7, y + 13, 18, 10);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 9, y + 7 + hover, 14, 9);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(x + 15, y + 7 + hover, 2, 9);
}

function drawLeyCrystal(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const ok = Boolean(getRoyalCrests().arcana);
  const pulse = Math.sin(tick * 0.1) * 1.5;
  ctx.fillStyle = ok ? '#4ade80' : '#c084fc';
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 5 + pulse);
  ctx.lineTo(x + 22, y + 15 + pulse);
  ctx.lineTo(x + 16, y + 24 + pulse);
  ctx.lineTo(x + 10, y + 15 + pulse);
  ctx.closePath();
  ctx.fill();
}

function drawAlchemyAlembic(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x + 16, y + 17, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = tick % 20 < 10 ? '#c084fc' : '#f472b6';
  ctx.fillRect(x + 14, y + 14, 4, 4);
}

function drawStarOrrery(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + 16, y + 15, 7, 0, Math.PI * 2);
  ctx.stroke();
  const ang = tick * 0.07;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(Math.round(x + 15 + Math.cos(ang) * 7), Math.round(y + 14 + Math.sin(ang) * 7), 2, 2);
}

function drawRuneNexus(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(px + 3, py + 8, 10, 7);
  ctx.fillStyle = '#c084fc';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + bob + 1);
  ctx.lineTo(px + 12, py + bob + 5);
  ctx.lineTo(px + 8, py + bob + 9);
  ctx.lineTo(px + 4, py + bob + 5);
  ctx.closePath();
  ctx.fill();
}

export function renderMageTowerScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createMageTowerBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#c084fc');
  }

  drawTelescope(ctx);
  drawArcanaCodex(ctx, tick);
  drawLeyCrystal(ctx, tick);
  drawAlchemyAlembic(ctx, tick);
  drawStarOrrery(ctx, tick);
  drawRuneNexus(ctx, tick);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);

  ctx.save();
  for (const m of STARLIGHT_MOTES) {
    const py = (m.y - tick * m.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = m.x + Math.sin(tick * 0.04 + m.phase) * 3;
    ctx.fillStyle = m.color;
    ctx.globalAlpha = 0.35 + 0.3 * Math.sin(tick * 0.09 + m.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 1.5, 1.5);
  }
  ctx.restore();

  renderKingdomWaves(ctx, 'kingdom-mage-tower');
}
