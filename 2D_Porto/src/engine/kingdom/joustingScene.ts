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

export const JOUSTING_COLS = KINGDOM_INTERIOR_COLS;
export const JOUSTING_ROWS = KINGDOM_INTERIOR_ROWS;
export const JOUSTING_SPAWN = KINGDOM_INTERIOR_SPAWN;
// Center (4..10, 4..9) Golden Sand Lists Pit stays fully walkable!
export const JOUSTING_COLLISION = createStandardKingdomCollision(true);

export const JOUSTING_PROPS: KingdomInteriorProp[] = [
  {
    id: 'koraidon',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'koraidon' },
    label: '🐎 Koraidon',
    style: 'koraidon',
    labelLift: 20,
    hint: 'Challenge Steed Knight Koraidon in the Jousting Lists 🐎',
    scrollTarget: 'jou-duel-game',
  },
  {
    id: 'royal-pavilion',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'royal-pavilion' },
    label: '🏟️ Stone Pavilion',
    style: 'pavilion',
    labelLift: 22,
    hint: 'Inspect Royal Limestone Castle Tournament Box 🏟️',
    scrollTarget: 'jou-duel-game',
  },
  {
    id: 'lance-rack',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'lance-rack' },
    label: '🔱 Lance Rack',
    style: 'lances',
    labelLift: 12,
    hint: 'Select Tournament Lances & Begin Clash Timing Trial 🔱',
    scrollTarget: 'jou-duel-game',
  },
  {
    id: 'herald-drum',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'herald-drum' },
    label: '🥁 War Drums',
    style: 'drums',
    labelLift: 12,
    hint: 'Sound War Drums (+50% Cavalry Sprint) & Check Crest Vault 🥁',
    scrollTarget: 'jou-relic-section',
  },
  {
    id: 'blackwargreymon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'blackwargreymon' },
    label: '⚔️ BlackWarGreymon',
    style: 'blackwargreymon',
    labelLift: 18,
    hint: 'Spar with Abyssal Striker BlackWarGreymon ⚔️',
    scrollTarget: 'jou-duel-game',
  },
  {
    id: 'imp_fighter',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'imp_fighter' },
    label: '🛡️ Imperialdramon',
    style: 'imp_fighter',
    labelLift: 18,
    hint: 'Inspect Live Game Engines & Arena Labs with Imperialdramon 🛡️',
    scrollTarget: 'jou-showcase-section',
  },
  {
    id: 'sand-stable',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sand-stable' },
    label: '🐴 Cavalry Tack',
    style: 'stable',
    labelLift: 12,
    hint: 'Polish Spurs & Inspect Interactive Game Showcase 🐴',
    scrollTarget: 'jou-showcase-section',
  },
  {
    id: 'arena-scoreboard',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'arena-scoreboard' },
    label: '🏆 Tourney Board',
    style: 'scoreboard',
    labelLift: 12,
    hint: 'Inspect Crest of Chivalry & Excalibur Progress 🏆',
    scrollTarget: 'jou-relic-section',
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
  { kind: 'pmd', id: 'koraidon', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.72, fallbackColor: '#dc2626' },
  { kind: 'digimon', id: 'blackwargreymon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.82, fallbackColor: '#1f2937' },
  { kind: 'digimon', id: 'imp_fighter', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.82, fallbackColor: '#1d4ed8' },
];

const SAND_DUST = Array.from({ length: 14 }, (_, i) => ({
  x: 68 + ((i * 23) % 104),
  y: 68 + ((i * 19) % 88),
  speed: 0.14 + (i % 3) * 0.05,
  phase: i * 1.1,
}));

let cachedBg: HTMLCanvasElement | null = null;

function createJoustingBackground(): HTMLCanvasElement {
  const width = JOUSTING_COLS * TILE_SIZE;
  const height = JOUSTING_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Stone Castle Flagstone Concourse Around the Arena
  for (let y = 2; y < JOUSTING_ROWS; y++) {
    for (let x = 0; x < JOUSTING_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === JOUSTING_COLS - 1 || y === JOUSTING_ROWS - 1;
      if (isBorder) {
        // Thick Stone Castle Outer Battlement Wall
        octx.fillStyle = '#334155';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#64748b';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        octx.fillStyle = '#94a3b8';
        octx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 2);
        continue;
      }

      const alt = (x + y) % 2 === 0;
      octx.fillStyle = alt ? '#a8b1bd' : '#949eab';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = '#cbd5e1';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#64748b';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
    }
  }

  // 2. North Stone Castle Battlement Wall with Crimson-Gold Heraldry
  octx.fillStyle = '#334155';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#64748b' : '#525e70';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
      octx.fillStyle = '#94a3b8';
      octx.fillRect(bx + offset + 1, by + 1, 14, 1);
    }
  }
  octx.fillStyle = '#991b1b';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Crimson-Gold Castle Tournament Banners on North Wall
  for (const bx of [3, 11]) {
    octx.fillStyle = '#b91c1c';
    octx.fillRect(bx * TILE_SIZE + 2, 4, 12, 22);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(bx * TILE_SIZE + 2, 4, 12, 2);
    octx.fillRect(bx * TILE_SIZE + 6, 11, 4, 8);
  }

  // 3. CENTRAL GOLDEN SAND ARENA PIT (x: 4..10, y: 4..9) surrounded by stone fortress curbs!
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      const alt = (px + py) % 2 === 0;
      octx.fillStyle = alt ? '#ebbb71' : '#dfa857';
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
      // Warm golden sand speckles & hoof grooves
      octx.fillStyle = 'rgba(146, 64, 14, 0.24)';
      octx.fillRect(tx + 3, ty + 4, 2, 1);
      octx.fillRect(tx + 10, ty + 11, 3, 1);
    }
  }

  // Jousting Chalk Lines & Wooden Central Tilting Divider Line (walkable sand surface)
  octx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  octx.fillRect(pitX + 10, 6 * TILE_SIZE + 7, pitW - 20, 2);
  octx.fillStyle = '#78350f';
  octx.fillRect(pitX + 14, 6 * TILE_SIZE + 6, pitW - 28, 3);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(pitX + 14, 6 * TILE_SIZE + 6, pitW - 28, 1);

  // Heavy Stone Arena Retaining Curb around the Sand Pit
  octx.strokeStyle = '#475569';
  octx.lineWidth = 3;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 3, pitY + 3, pitW - 6, pitH - 6);

  // Crimson Tournament Approach Carpets at South Gate & North Stand
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#b91c1c';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, TILE_SIZE);
  octx.fillRect(carpX, 10 * TILE_SIZE, TILE_SIZE - 6, TILE_SIZE);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, TILE_SIZE);

  // Corner Stone Plinths
  const drawPlinth = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#475569';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#fbbf24';
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, 27, 27);
  };
  drawPlinth(1, 3);
  drawPlinth(12, 3);
  drawPlinth(1, 8);
  drawPlinth(12, 8);

  // Exit Archway (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#7f1d1d';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

function drawStonePavilionBox(ctx: CanvasRenderingContext2D): void {
  const x = 6 * TILE_SIZE;
  const y = 0 * TILE_SIZE + 4;
  const w = 3 * TILE_SIZE;
  // Stone Arch & Crimson Canopy
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 4, y, w - 8, 26);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 6, y + 2, 12, 6);
  ctx.fillRect(x + 30, y + 2, 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 18, y + 2, 12, 6);
}

function drawLanceRack(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 7, 22, 16);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 8, y + 5, 2, 16);
  ctx.fillRect(x + 14, y + 5, 2, 16);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 19, y + 10, 6, 9);
}

function drawHeraldDrum(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const ok = Boolean(getRoyalCrests().chivalry);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(x + 6, y + 9, 20, 14);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 8, y + 7, 16, 4);
  if (tick % 20 < 10) {
    ctx.fillStyle = ok ? '#4ade80' : '#fbbf24';
    ctx.fillRect(x + 14, y + 4, 4, 2);
  }
}

function drawSandStable(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 6, y + 8, 20, 15);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 9, y + 12, 14, 7);
}

function drawTourneyBoard(ctx: CanvasRenderingContext2D): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 6, y + 8, 20, 15);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 9, y + 11, 14, 2);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 9, y + 15, 10, 2);
}

export function renderJoustingScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createJoustingBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#fb923c');
  }

  drawStonePavilionBox(ctx);
  drawLanceRack(ctx);
  drawHeraldDrum(ctx, tick);
  drawSandStable(ctx);
  drawTourneyBoard(ctx);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);

  // Subtle sun-lit sand motes drifting above the central lists
  ctx.save();
  for (const d of SAND_DUST) {
    const floatX = d.x + Math.sin(tick * 0.04 + d.phase) * 5;
    const floatY = d.y + Math.cos(tick * 0.03 + d.phase) * 2;
    ctx.fillStyle = '#fde68a';
    ctx.globalAlpha = 0.28 + 0.2 * Math.sin(tick * 0.08 + d.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(floatY), 1.5, 1.5);
  }
  ctx.restore();

  renderKingdomWaves(ctx, 'kingdom-jousting');
}
