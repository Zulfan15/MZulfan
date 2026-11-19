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

export const BLACKSMITH_COLS = KINGDOM_INTERIOR_COLS;
export const BLACKSMITH_ROWS = KINGDOM_INTERIOR_ROWS;
export const BLACKSMITH_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const BLACKSMITH_COLLISION = createStandardKingdomCollision(false);

export const BLACKSMITH_PROPS: KingdomInteriorProp[] = [
  {
    id: 'archaludon',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'archaludon' },
    label: '⚒️ Archaludon',
    style: 'archaludon',
    labelLift: 20,
    hint: 'Consult Master Smith Archaludon · Start Forge Timing Trial ⚒️',
    scrollTarget: 'bs-forge-game',
  },
  {
    id: 'dragon-hearth',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'dragon-hearth' },
    label: '🔥 Blast Hearth',
    style: 'hearth',
    labelLift: 22,
    hint: 'Inspect the Roaring Dragonflame Blast Hearth 🔥',
    scrollTarget: 'bs-forge-game',
  },
  {
    id: 'armory-rack',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'armory-rack' },
    label: '🗡️ Stack Armory',
    style: 'armory',
    labelLift: 12,
    hint: 'Inspect Weaponized Tech Stack Armory 🗡️',
    scrollTarget: 'bs-armory-section',
  },
  {
    id: 'quench-trough',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'quench-trough' },
    label: '💧 Quench Bath',
    style: 'trough',
    labelLift: 12,
    hint: 'Cool Tempered Blades, Claim Speed Buff & Crest 💧',
    scrollTarget: 'bs-relic-section',
  },
  {
    id: 'tyranitar',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'tyranitar' },
    label: '🦖 Tyranitar',
    style: 'tyranitar',
    labelLift: 18,
    hint: 'Heavy Plate Guardian Tyranitar 🦖',
    scrollTarget: 'bs-armory-section',
  },
  {
    id: 'cannondramon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'cannondramon' },
    label: '🔩 Cannondramon',
    style: 'cannondramon',
    labelLift: 18,
    hint: 'Artillery Forgemaster Cannondramon 🔩',
    scrollTarget: 'bs-forge-game',
  },
  {
    id: 'master-anvil',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'master-anvil' },
    label: '🔨 Royal Anvil',
    style: 'anvil',
    labelLift: 16,
    hint: 'Strike the Central Royal Anvil for Crest of Steel 🔨',
    scrollTarget: 'bs-forge-game',
  },
  {
    id: 'smelting-bellows',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'smelting-bellows' },
    label: '💨 Forge Bellows',
    style: 'bellows',
    labelLift: 12,
    hint: 'Stoke Airflow into the Dragonflame Furnace 💨',
    scrollTarget: 'bs-forge-game',
  },
  {
    id: 'grindstone-bench',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'grindstone-bench' },
    label: '🪨 Whetstone',
    style: 'grindstone',
    labelLift: 12,
    hint: 'Sharpen Backend & AI Stack Edges 🪨',
    scrollTarget: 'bs-armory-section',
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
  { kind: 'pmd', id: 'archaludon', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.76, fallbackColor: '#94a3b8' },
  { kind: 'pmd', id: 'tyranitar', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.72, fallbackColor: '#4d7c0f' },
  { kind: 'digimon', id: 'cannondramon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.82, fallbackColor: '#ea580c' },
];

const FORGE_SPARKS = Array.from({ length: 16 }, (_, i) => ({
  x: 18 + ((i * 33) % 204),
  y: 36 + ((i * 27) % 136),
  speed: 0.22 + (i % 4) * 0.07,
  phase: i * 1.2,
  color: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#fb923c' : '#ef4444',
}));

let cachedBg: HTMLCanvasElement | null = null;

function createBlacksmithBackground(): HTMLCanvasElement {
  const width = BLACKSMITH_COLS * TILE_SIZE;
  const height = BLACKSMITH_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Warm Cut Basalt & Sandstone Armory Floor
  for (let y = 2; y < BLACKSMITH_ROWS; y++) {
    for (let x = 0; x < BLACKSMITH_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === BLACKSMITH_COLS - 1 || y === BLACKSMITH_ROWS - 1;
      if (isBorder) {
        octx.fillStyle = '#29221d';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#4a3d34';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? '#9e8f7f' : '#8e7f70';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = checker ? '#b3a392' : '#a19181';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#5c5045';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
    }
  }

  // 2. North Fieldstone Wall with Chimney Flue & Weapon Crests
  octx.fillStyle = '#292524';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#44403c' : '#3a3430';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
    }
  }
  octx.fillStyle = '#b45309';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#f59e0b';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Iron Tool Windows & Orange Banners
  for (const bx of [3, 11]) {
    octx.fillStyle = '#451a03';
    octx.fillRect(bx * TILE_SIZE + 2, 4, 14, 22);
    octx.fillStyle = '#c2410c';
    octx.fillRect(bx * TILE_SIZE + 4, 6, 10, 18);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(bx * TILE_SIZE + 8, 9, 2, 10);
  }

  // 3. Sunken Forge Ember Courtyard Pit (4..10, 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      octx.fillStyle = (px + py) % 2 === 0 ? '#473e38' : '#3d3530';
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    }
  }
  // Glowing iron quench channels crossing under Anvil (7, 6)
  octx.fillStyle = '#7c2d12';
  octx.fillRect(pitX + 4, 6 * TILE_SIZE + 6, pitW - 8, 4);
  octx.fillRect(7 * TILE_SIZE + 6, pitY + 4, 4, pitH - 8);
  octx.fillStyle = '#ea580c';
  octx.fillRect(pitX + 6, 6 * TILE_SIZE + 7, pitW - 12, 2);
  octx.fillRect(7 * TILE_SIZE + 7, pitY + 6, 2, pitH - 12);

  octx.strokeStyle = '#92400e';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#f59e0b';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // 4. Leather-Crimson Smithy Walkway Runner (col 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#9a3412';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);

  // 5. Four Corner Stone Bases
  const drawBase = (tx: number, ty: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    octx.fillStyle = '#44403c';
    octx.fillRect(px, py, 28, 28);
    octx.strokeStyle = '#d97706';
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
  octx.fillStyle = '#451a03';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#fb923c';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

function drawDragonHearth(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 6 * TILE_SIZE;
  const y = 0 * TILE_SIZE + 6;
  const w = 3 * TILE_SIZE;
  const glow = 0.25 + 0.14 * Math.sin(tick * 0.11);

  ctx.fillStyle = `rgba(249, 115, 22, ${glow})`;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + 24, 24, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Stone Chimney Hearth
  ctx.fillStyle = '#292524';
  ctx.fillRect(x + 4, y, w - 8, 25);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4.5, y + 0.5, w - 9, 24);
  // Roaring dragonfire maw
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x + 11, y + 8, w - 22, 14);
  ctx.fillStyle = tick % 14 < 7 ? '#f97316' : '#fb923c';
  ctx.fillRect(x + 13, y + 11, w - 26, 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 16, y + 14, w - 32, 6);
}

function drawArmoryRack(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  // Wooden Weapon Rack
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 6, 22, 18);
  // Twin Tempered Broadswords + Shield
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 8, y + 7, 2, 13);
  ctx.fillRect(x + 13, y + 7, 2, 13);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 7, y + 18, 4, 2);
  ctx.fillRect(x + 12, y + 18, 4, 2);
  // Royal heater shield
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x + 18, y + 9, 7, 10);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 20, y + 12, 3, 4);
}

function drawQuenchTrough(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const claimed = Boolean(getRoyalCrests().steel);

  // Oak & iron water trough
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 9, 22, 14);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 7, y + 11, 18, 10);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x + 9 + (tick % 8), y + 13, 3, 2);
  // Crest badge front
  ctx.fillStyle = claimed ? '#4ade80' : '#fbbf24';
  ctx.fillRect(x + 14, y + 20, 4, 3);
}

function drawSmeltingBellows(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const pump = Math.round(Math.sin(tick * 0.12) * 1.5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 6, y + 9 + pump, 18, 12 - pump);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 8, y + 11 + pump, 14, 7);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 22, y + 14, 5, 3);
}

function drawGrindstoneBench(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 6, y + 14, 20, 9);
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(x + 16, y + 13, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = tick % 10 < 5 ? '#fef08a' : '#fb923c';
  ctx.fillRect(x + 15, y + 12, 2, 2);
}

function drawRoyalAnvilPedestal(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 3, py + 9, 10, 6);
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 3, py + 4, 10, 5);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 4, py + 4, 8, 2);
  // Hot glowing ingot atop anvil
  ctx.fillStyle = tick % 24 < 12 ? '#fb923c' : '#fde047';
  ctx.fillRect(px + 6, py + 2, 4, 2);
}

export function renderBlacksmithScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedBg) {
    cachedBg = createBlacksmithBackground();
  }
  ctx.drawImage(cachedBg, 0, 0);

  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#fb923c');
  }

  drawDragonHearth(ctx, tick);
  drawArmoryRack(ctx);
  drawQuenchTrough(ctx, tick);
  drawSmeltingBellows(ctx, tick);
  drawGrindstoneBench(ctx, tick);
  drawRoyalAnvilPedestal(ctx, tick);

  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);

  ctx.save();
  for (const s of FORGE_SPARKS) {
    const py = (s.y - tick * s.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = s.x + Math.sin(tick * 0.06 + s.phase) * 3;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.4 + 0.35 * Math.sin(tick * 0.14 + s.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 1.5, 1.5);
  }
  ctx.restore();

  renderKingdomWaves(ctx, 'kingdom-blacksmith');
}
