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

export const ABBEY_COLS = KINGDOM_INTERIOR_COLS;
export const ABBEY_ROWS = KINGDOM_INTERIOR_ROWS;
export const ABBEY_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const ABBEY_COLLISION = createStandardKingdomCollision(false);

export const ABBEY_PROPS: KingdomInteriorProp[] = [
  {
    id: 'lugia',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'lugia' },
    label: '🕊️ Lugia',
    style: 'lugia',
    labelLift: 20,
    hint: 'Commune with Guardian Lugia · Play 3-Round Bell Hymn 🕊️',
    scrollTarget: 'cha-bell-game',
  },
  {
    id: 'rose-stained-glass',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'rose-stained-glass' },
    label: '🪟 Rose Window',
    style: 'rose-glass',
    labelLift: 22,
    hint: 'Inspect Stained-Glass Core Engineering Values 🪟',
    scrollTarget: 'cha-values-section',
  },
  {
    id: 'bell-carillon',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'bell-carillon' },
    label: '🔔 Bronze Bells',
    style: 'bells',
    labelLift: 12,
    hint: 'Ring the 4 Tuned Sanctuary Bells 🔔',
    scrollTarget: 'cha-bell-game',
  },
  {
    id: 'contact-scroll',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'contact-scroll' },
    label: '📜 Envoy Scroll',
    style: 'scroll',
    labelLift: 12,
    hint: 'Inspect Direct Contact Links & Socials 📜',
    scrollTarget: 'cha-values-section',
  },
  {
    id: 'seraphimon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'seraphimon' },
    label: '👼 Seraphimon',
    style: 'seraphimon',
    labelLift: 18,
    hint: 'Choir Seraph Seraphimon · Listen to Bell Harmonics 👼',
    scrollTarget: 'cha-bell-game',
  },
  {
    id: 'guardiangemon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'guardiangemon' },
    label: '⚔️ GuardiAngemon',
    style: 'guardiangemon',
    labelLift: 18,
    hint: 'Abbey Warden GuardiAngemon · Check 7 Crests Progress ⚔️',
    scrollTarget: 'cha-relic-section',
  },
  {
    id: 'grace-altar',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'grace-altar' },
    label: '🕯️ Grace Altar',
    style: 'pedestal',
    labelLift: 16,
    hint: 'Claim Sanctuary Grace (+50% Speed) at the Central Altar 🕯️',
    scrollTarget: 'cha-relic-section',
  },
  {
    id: 'chapel-pews',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'chapel-pews' },
    label: '🪑 Choir Pews',
    style: 'pews',
    labelLift: 12,
    hint: 'Carved Oak Abbey Pews & Ethics Hymnals 🪑',
    scrollTarget: 'cha-values-section',
  },
  {
    id: 'blessing-font',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'blessing-font' },
    label: '⛲ Grace Font',
    style: 'font',
    labelLift: 12,
    hint: 'Open Sanctuary Vault & Crest of Grace Registry ⛲',
    scrollTarget: 'cha-relic-section',
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
  { kind: 'pmd', id: 'lugia', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.72, fallbackColor: '#e0f2fe' },
  { kind: 'digimon', id: 'seraphimon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.82, fallbackColor: '#fbbf24' },
  { kind: 'digimon', id: 'guardiangemon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.82, fallbackColor: '#93c5fd' },
];

const ABBEY_MOTES = Array.from({ length: 14 }, (_, i) => ({
  x: 18 + ((i * 37) % 204),
  y: 36 + ((i * 29) % 136),
  speed: 0.14 + (i % 4) * 0.04,
  phase: i * 1.15,
  color: i % 3 === 0 ? '#bae6fd' : i % 3 === 1 ? '#fef08a' : '#e0e7ff',
}));

let cachedBg: HTMLCanvasElement | null = null;

function createAbbeyBackground(): HTMLCanvasElement {
  const width = ABBEY_COLS * TILE_SIZE;
  const height = ABBEY_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Sunlit Pale Sandstone & Cream Abbey Flagstones
  for (let y = 2; y < ABBEY_ROWS; y++) {
    for (let x = 0; x < ABBEY_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === ABBEY_COLS - 1 || y === ABBEY_ROWS - 1;
      if (isBorder) {
        octx.fillStyle = '#334155';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#475569';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        continue;
      }

      const alt = (x + y) % 2 === 0;
      octx.fillStyle = alt ? '#eae1d2' : '#ded2c0';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = '#f8f3ea';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#bfb19b';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
    }
  }

  // 2. North Gothic Masonry & Lancet Arches
  octx.fillStyle = '#334155';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#475569' : '#3d4d63';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
    }
  }
  octx.fillStyle = '#38bdf8';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Side Lancet Windows
  for (const wx of [2, 11]) {
    const px = wx * TILE_SIZE + 4;
    octx.fillStyle = '#0f172a';
    octx.fillRect(px, 4, 22, 22);
    octx.fillStyle = '#0284c7';
    octx.fillRect(px + 2, 6, 18, 18);
    octx.fillStyle = '#bae6fd';
    octx.fillRect(px + 5, 8, 5, 14);
    octx.fillStyle = '#fde047';
    octx.fillRect(px + 11, 10, 6, 6);
  }

  // 3. Central Sanctuary Azure Nave (4..10, 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      octx.fillStyle = (px + py) % 2 === 0 ? '#1e3a8a' : '#2447a6';
      octx.fillRect(px * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1.5, pitY + 1.5, pitW - 3, pitH - 3);

  // Royal Blue aisle carpet (col 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#1d4ed8';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);

  // Corner Pedestals
  const drawPedestal = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#475569';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#93c5fd';
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
  octx.fillStyle = '#1e3a8a';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#93c5fd';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#f8fafc', 1, 'center');

  return off;
}

function drawRoseStainedWindow(ctx: CanvasRenderingContext2D, tick: number): void {
  const cx = 7.5 * TILE_SIZE;
  const cy = 15;
  const glow = 0.22 + 0.1 * Math.sin(tick * 0.06);
  ctx.fillStyle = `rgba(147, 197, 253, ${glow})`;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 2, cy - 8, 4, 16);
  ctx.fillRect(cx - 8, cy - 2, 16, 4);
}

function drawBellCarillon(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const sway = Math.round(Math.sin(tick * 0.08));
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 6, 22, 17);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 8 + sway, y + 10, 6, 8);
  ctx.fillRect(x + 17 - sway, y + 10, 6, 8);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 10 + sway, y + 18, 2, 2);
  ctx.fillRect(x + 19 - sway, y + 18, 2, 2);
}

function drawContactScroll(ctx: CanvasRenderingContext2D): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 6, y + 8, 20, 15);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 8, y + 10, 16, 10);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x + 10, y + 12, 10, 1);
  ctx.fillRect(x + 10, y + 15, 8, 1);
}

function drawChapelPews(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 6, y + 8, 20, 6);
  ctx.fillRect(x + 6, y + 17, 20, 6);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 8, y + 9, 16, 3);
  ctx.fillRect(x + 8, y + 18, 16, 3);
}

function drawBlessingFont(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const ok = Boolean(getRoyalCrests().grace);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 7, y + 9, 18, 14);
  ctx.fillStyle = ok ? '#4ade80' : '#38bdf8';
  ctx.fillRect(x + 9, y + 11, 14, 9);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 11 + (tick % 6), y + 13, 2, 2);
}

function drawGraceAltar(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 8, 10, 7);
  ctx.fillStyle = '#93c5fd';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + bob + 1);
  ctx.lineTo(px + 12, py + bob + 5);
  ctx.lineTo(px + 8, py + bob + 9);
  ctx.lineTo(px + 4, py + bob + 5);
  ctx.closePath();
  ctx.fill();
}

export function renderAbbeyScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createAbbeyBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#93c5fd');
  }

  drawRoseStainedWindow(ctx, tick);
  drawBellCarillon(ctx, tick);
  drawContactScroll(ctx);
  drawChapelPews(ctx);
  drawBlessingFont(ctx, tick);
  drawGraceAltar(ctx, tick);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);

  ctx.save();
  for (const m of ABBEY_MOTES) {
    const py = (m.y - tick * m.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = m.x + Math.sin(tick * 0.04 + m.phase) * 3;
    ctx.fillStyle = m.color;
    ctx.globalAlpha = 0.35 + 0.25 * Math.sin(tick * 0.09 + m.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 1.5, 1.5);
  }
  ctx.restore();

  renderKingdomWaves(ctx, 'kingdom-chapel');
}
