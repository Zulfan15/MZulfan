import type { Dir } from './types';
import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';

export const CAFE_COLS = 15;
export const CAFE_ROWS = 12;
export const CAFE_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 10, dir: 'up' };

export interface CafePropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface CafeProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: CafePropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
}

// Warm Artisanal Roastery & Lounge Color Palette
const C_FLOOR_A = '#5c2d16'; // Deep walnut plank
const C_FLOOR_B = '#6e371b'; // Warm chestnut plank
const C_RUG_MAIN = '#7f1d1d'; // Cozy crimson bistro runner
const C_RUG_TRIM = '#f59e0b'; // Gold trim
const C_WALL_TOP = '#271206'; // Dark espresso timber
const C_WALL_BRICK = '#451a03'; // Exposed roasted brick
const C_WALL_TRIM = '#b45309'; // Brass/oak wainscoting
const C_COUNTER_DARK = '#3b1909';
const C_COUNTER_TOP = '#d97706';

export const CAFE_PROPS: CafeProp[] = [
  {
    id: 'barista',
    kind: 'npc',
    x: 6,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'barista' },
    label: 'Barista Rio',
    style: 'barista',
    labelLift: 18,
    hint: 'Talk to Master Barista Rio ☕',
  },
  {
    id: 'alcremie',
    kind: 'npc',
    x: 7,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'alcremie' },
    label: 'Alcremie · Pastry Chef',
    style: 'alcremie',
    labelLift: 18,
    hint: 'Say hi to Alcremie 🍰',
  },
  {
    id: 'vinyl-jukebox',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'vinyl-jukebox' },
    label: 'Lo-Fi Jukebox',
    style: 'vinyl-jukebox',
    labelLift: 12,
    hint: 'Spin Lo-Fi & Jazz Vinyls 🎵',
  },
  {
    id: 'pastry-case',
    kind: 'prop',
    x: 10,
    y: 3,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'pastry-case' },
    label: 'Castelia Cones',
    style: 'pastry-case',
    labelLift: 12,
    hint: 'Order Castelia Cones & Sweets 🍦',
  },
  {
    id: 'roast-board',
    kind: 'prop',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'roast-board' },
    label: 'Roast & Brew Lab',
    style: 'roast-board',
    labelLift: 12,
    hint: 'Custom Brew Lab & Bean Origins 🫘',
  },
  {
    id: 'vip-booth',
    kind: 'prop',
    x: 10,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'vip-booth' },
    label: 'Coffee Chat Booth',
    style: 'vip-booth',
    labelLift: 12,
    hint: 'Book a 1-on-1 Coffee Chat 🤝',
  },
  {
    id: 'craft-tap',
    kind: 'prop',
    x: 13,
    y: 3,
    w: 1,
    h: 3,
    target: {
      type: 'note',
      text: 'NITRO COLD BREW & MOCKTAIL TAP: Serving FP16 Nitrogen-Infused West Java Arabica, HCIA Yuzu Firewall Tonic, and Sparkling Sitrus Berry Spritz at 4°C.',
    },
    label: 'Nitro Tap Bar',
    style: 'craft-tap',
    labelLift: 10,
    hint: 'Inspect Nitro Cold Brew Tap 🍹',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'town' },
    label: 'Exit to Town',
    style: 'exit',
    hideLabel: true,
  },
];

// Collision matrix (0 = walkable, 1 = blocked)
export const CAFE_COLLISION = new Uint8Array(CAFE_COLS * CAFE_ROWS).fill(0);
const cIdx = (x: number, y: number) => y * CAFE_COLS + x;

// Perimeter walls
for (let x = 0; x < CAFE_COLS; x++) {
  CAFE_COLLISION[cIdx(x, 0)] = 1;
  CAFE_COLLISION[cIdx(x, 1)] = 1;
  CAFE_COLLISION[cIdx(x, 11)] = 1;
}
for (let y = 0; y < CAFE_ROWS; y++) {
  CAFE_COLLISION[cIdx(0, y)] = 1;
  CAFE_COLLISION[cIdx(14, y)] = 1;
}

// Doorway at (7, 11) is walkable for exit
CAFE_COLLISION[cIdx(7, 11)] = 0;

// Main Espresso Bar Counter (x: 4..8, y: 4..5)
for (let x = 4; x <= 8; x++) {
  CAFE_COLLISION[cIdx(x, 4)] = 1;
  CAFE_COLLISION[cIdx(x, 5)] = 1;
}

// Behind counter where Barista Rio & Alcremie stand
CAFE_COLLISION[cIdx(5, 3)] = 1;
CAFE_COLLISION[cIdx(6, 3)] = 1;
CAFE_COLLISION[cIdx(7, 3)] = 1;

// North-West Vinyl Jukebox & Acoustic Corner (x: 1..3, y: 3..4)
for (let x = 1; x <= 3; x++) {
  CAFE_COLLISION[cIdx(x, 3)] = 1;
  CAFE_COLLISION[cIdx(x, 4)] = 1;
}

// North-East Pastry & Castelia Cone Display (x: 10..12, y: 3..4)
for (let x = 10; x <= 12; x++) {
  CAFE_COLLISION[cIdx(x, 3)] = 1;
  CAFE_COLLISION[cIdx(x, 4)] = 1;
}

// South-West Custom Brew Lab & Roastery Board (x: 1..3, y: 7..8)
for (let x = 1; x <= 3; x++) {
  CAFE_COLLISION[cIdx(x, 7)] = 1;
  CAFE_COLLISION[cIdx(x, 8)] = 1;
}

// South-East VIP Coffee Chat Booth (x: 10..12, y: 7..8)
for (let x = 10; x <= 12; x++) {
  CAFE_COLLISION[cIdx(x, 7)] = 1;
  CAFE_COLLISION[cIdx(x, 8)] = 1;
}

// Nitro Tap Bar on East Wall (x: 13, y: 3..5)
for (let y = 3; y <= 5; y++) {
  CAFE_COLLISION[cIdx(13, y)] = 1;
}

/**
 * Procedural static background renderer for Poké-Café & Developer Roastery Bar Interior
 */
export function createCafeBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CAFE_COLS * TILE_SIZE;
  canvas.height = CAFE_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // 1. Warm Hardwood Flooring & Bistro Runner Rug
  for (let r = 2; r < CAFE_ROWS; r++) {
    for (let c = 0; c < CAFE_COLS; c++) {
      const isAlt = (r + c) % 2 === 0;
      const isRunner = c >= 6 && c <= 8 && r >= 6;
      if (isRunner) {
        ctx.fillStyle = isAlt ? C_RUG_MAIN : '#991b1b';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        // Gold border along runner edges
        if (c === 6) {
          ctx.fillStyle = C_RUG_TRIM;
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 2, TILE_SIZE);
        }
        if (c === 8) {
          ctx.fillStyle = C_RUG_TRIM;
          ctx.fillRect((c + 1) * TILE_SIZE - 2, r * TILE_SIZE, 2, TILE_SIZE);
        }
      } else {
        ctx.fillStyle = isAlt ? C_FLOOR_A : C_FLOOR_B;
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        // Wood plank grain lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE + 7, TILE_SIZE, 1);
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE + 15, TILE_SIZE, 1);
        ctx.fillStyle = 'rgba(255, 210, 150, 0.06)';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      }
    }
  }

  // Warm sunbeams across floor from windows
  ctx.fillStyle = 'rgba(251, 191, 36, 0.05)';
  ctx.fillRect(2 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE, 4 * TILE_SIZE);
  ctx.fillRect(10 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE, 4 * TILE_SIZE);

  // 2. North Wall (Exposed Brick & Roasted Timber Paneling)
  ctx.fillStyle = C_WALL_TOP;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Brick texture pattern on upper wall
  ctx.fillStyle = C_WALL_BRICK;
  for (let wy = 4; wy < 2 * TILE_SIZE - 6; wy += 6) {
    const offset = (wy / 6) % 2 === 0 ? 0 : 6;
    for (let wx = TILE_SIZE + offset; wx < canvas.width - TILE_SIZE - 8; wx += 12) {
      ctx.fillRect(wx, wy, 10, 4);
    }
  }

  // Brass & Oak Wainscoting Trim
  ctx.fillStyle = C_WALL_TRIM;
  ctx.fillRect(0, 2 * TILE_SIZE - 4, canvas.width, 4);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(0, 2 * TILE_SIZE - 4, canvas.width, 1);

  // Illuminated "POKE-CAFE & BAR" Neon Sign on North Wall
  const signW = 108;
  const signH = 18;
  const signX = (canvas.width - signW) / 2;
  const signY = 6;
  ctx.fillStyle = '#1c0d06';
  ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(signX + 1, signY + 1, signW - 2, 1);
  ctx.fillRect(signX + 1, signY + signH - 2, signW - 2, 1);

  // Steaming Coffee Cup Icon on Sign
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(signX + 6, signY + 6, 7, 6);
  ctx.fillRect(signX + 13, signY + 7, 2, 3);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(signX + 5, signY + 12, 9, 2);

  drawPixelText(ctx, 'POKE-CAFE BAR', signX + 19, signY + 5, '#fef3c7');

  // 3. Side Boundary Walls
  ctx.fillStyle = '#1c0d06';
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);

  // 4. North-West Corner: Retro Vinyl Jukebox & Lo-Fi Station (x: 1..3, y: 3..4)
  drawVinylJukeboxArea(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 5. North-East Corner: Castelia Cone & Poké Puff Showcase (x: 10..12, y: 3..4)
  drawPastryShowcase(ctx, 10 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 6. South-West Corner: Custom Brew Lab & Roastery Board (x: 1..3, y: 7..8)
  drawRoasteryLabStation(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 7. South-East Corner: VIP Coffee Chat Booth (x: 10..12, y: 7..8)
  drawVipCoffeeBooth(ctx, 10 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. East Wall: Nitro Cold Brew & Mocktail Tap Tower (x: 13, y: 3..5)
  drawNitroTapTower(ctx, 13 * TILE_SIZE, 3 * TILE_SIZE);

  // 9. Centerpiece: La Marzocco Brass Espresso Bar Counter (x: 4..8, y: 4..5)
  drawEspressoBarCounter(ctx, 4 * TILE_SIZE, 4 * TILE_SIZE, 5 * TILE_SIZE, 2 * TILE_SIZE);

  // 10. Entrance / Exit Welcome Mat at bottom door (x: 7, y: 11)
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(6 * TILE_SIZE + 4, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 8, 12);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(6 * TILE_SIZE + 6, 11 * TILE_SIZE + 4, 2 * TILE_SIZE - 12, 2);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE - 8, 11 * TILE_SIZE + 6, '#fef3c7');

  return canvas;
}

function drawVinylJukeboxArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Wooden Acoustic Stage Deck
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Classic Wurlitzer Neon Jukebox on left (x + 4, y + 2)
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(x + 4, y + 3, 18, 24);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 5, y + 4, 16, 3);
  // Glowing arch tube
  ctx.fillStyle = '#fde047';
  ctx.fillRect(x + 7, y + 8, 12, 8);
  // Spinning Vinyl Platter inside
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + 13, y + 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 12, y + 11, 2, 2);

  // Speaker Grille
  ctx.fillStyle = '#271206';
  ctx.fillRect(x + 7, y + 18, 12, 7);
  ctx.fillStyle = '#d97706';
  for (let sy = y + 19; sy < y + 24; sy += 2) {
    ctx.fillRect(x + 8, sy, 10, 1);
  }

  // Vinyl Record Crates on right side of deck
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 26, y + 10, 18, 16);
  const sleeveColors = ['#38bdf8', '#f43f5e', '#10b981', '#eab308'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = sleeveColors[i];
    ctx.fillRect(x + 28 + i * 3, y + 7, 3, 6);
  }

  drawPixelText(ctx, 'LO-FI DECK', x + 4, y + h - 7, '#fef3c7');
}

function drawPastryShowcase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Marble & Brass Base
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x, y + 12, w, h - 12);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 2, y + 12, w - 4, 4);

  // Illuminated Glass Cloche Display
  ctx.fillStyle = 'rgba(224, 242, 254, 0.32)';
  ctx.fillRect(x + 2, y + 2, w - 4, 14);
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 2.5, y + 2.5, w - 5, 13);

  // Castelia Cones & Alcremie Sweets inside
  const coneX = [x + 8, x + 18, x + 28, x + 38];
  const scoopColors = ['#fef08a', '#f472b6', '#34d399', '#60a5fa'];
  for (let i = 0; i < 4; i++) {
    // Waffle cone
    ctx.fillStyle = '#d97706';
    ctx.fillRect(coneX[i], y + 10, 4, 4);
    // Swirl Ice Cream Scoop
    ctx.fillStyle = scoopColors[i];
    ctx.fillRect(coneX[i] - 1, y + 6, 6, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coneX[i] + 1, y + 5, 2, 2);
  }

  drawPixelText(ctx, 'CONES & SWEETS', x + 2, y + h - 8, '#fde68a');
}

function drawRoasteryLabStation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Artisan Copper Roaster & V60 Brew Table
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Copper Coffee Bean Roaster Drum on left
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 5, y + 4, 14, 16);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 7, y + 6, 10, 8);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 9, y + 8, 6, 4); // Roaster sight glass

  // V60 Glass Pour-Over Carafes on right
  for (let i = 0; i < 2; i++) {
    const vx = x + 24 + i * 11;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(vx, y + 10, 7, 8);
    ctx.fillStyle = '#451a03'; // Dark brewed coffee inside
    ctx.fillRect(vx + 1, y + 13, 5, 4);
    ctx.fillStyle = '#f8fafc'; // Ceramic V60 cone on top
    ctx.fillRect(vx + 1, y + 6, 5, 4);
  }

  drawPixelText(ctx, 'BREW LAB', x + 8, y + h - 7, '#fef3c7');
}

function drawVipCoffeeBooth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Tufted Burgundy Leather Sofas (Left & Right benches)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x, y + 2, 10, h - 4);
  ctx.fillRect(x + w - 10, y + 2, 10, h - 4);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 2, y + 4, 6, h - 8);
  ctx.fillRect(x + w - 8, y + 4, 6, h - 8);

  // Walnut Booth Table in center
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 11, y + 4, w - 22, h - 8);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 12, y + 5, w - 24, h - 10);

  // Open Laptop & Two Steaming Coffee Mugs on Table
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 15, y + 7, 10, 6);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 16, y + 8, 8, 3);

  // Coffee Mug 1 & 2
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 16, y + 16, 4, 4);
  ctx.fillRect(x + 26, y + 15, 4, 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 17, y + 17, 2, 2);
  ctx.fillRect(x + 27, y + 16, 2, 2);

  drawPixelText(ctx, 'COFFEE CHAT', x + 4, y + h - 7, '#fde68a');
}

function drawNitroTapTower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#3b1909';
  ctx.fillRect(x, y, TILE_SIZE, 3 * TILE_SIZE);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 1, y + 2, TILE_SIZE - 2, 3 * TILE_SIZE - 4);

  // Gleaming Brass Tap Handles
  const tapColors = ['#f59e0b', '#38bdf8', '#ec4899', '#10b981'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 3, y + 8 + i * 9, 10, 4);
    ctx.fillStyle = tapColors[i];
    ctx.fillRect(x + 5, y + 6 + i * 9, 4, 4);
  }
}

function drawEspressoBarCounter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Counter Dark Roasted Body
  ctx.fillStyle = C_COUNTER_DARK;
  ctx.fillRect(x, y + 6, w, h - 6);
  // Polished Amber Oak Countertop
  ctx.fillStyle = C_COUNTER_TOP;
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 1, y + 1, w - 2, 1);

  // Warm Terracotta & Brass Front Paneling
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(x + 3, y + 9, w - 6, 12);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 3, y + 9, w - 6, 2);

  // La Marzocco Brass & Chrome Espresso Machine on Left (x + 8, y - 5)
  const emX = x + 8;
  const emY = y - 5;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(emX, emY, 18, 10);
  ctx.fillStyle = '#f59e0b'; // Brass body
  ctx.fillRect(emX + 1, emY + 1, 16, 8);
  ctx.fillStyle = '#fef08a'; // Top cup warmer rail
  ctx.fillRect(emX + 2, emY - 1, 14, 2);
  // Group heads
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(emX + 4, emY + 5, 3, 3);
  ctx.fillRect(emX + 11, emY + 5, 3, 3);

  // Glass Syrup Bottles & Ceramic Cups on Right of Counter
  const syColors = ['#f59e0b', '#ec4899', '#10b981'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = syColors[i];
    ctx.fillRect(x + w - 24 + i * 6, y - 3, 4, 6);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x + w - 23 + i * 6, y - 5, 2, 2);
  }
}

interface BrewParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

let brewParticles: BrewParticle[] = [];
let floatingBrewText: { text: string; alpha: number; y: number } | null = null;
let machineGlowTimer = 0;

export function triggerCafeBrewAnimation(text = 'BREWED! +100 FOCUS ☕') {
  machineGlowTimer = 40;
  floatingBrewText = {
    text: `[${text}]`,
    alpha: 1,
    y: 4 * TILE_SIZE - 8,
  };

  const barCenterX = 5 * TILE_SIZE;
  const barCenterY = 4 * TILE_SIZE - 2;

  // Spawn 20 warm golden & berry-pink aroma particles
  const colors = ['#fde047', '#f59e0b', '#f472b6', '#ffffff', '#34d399'];
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 1.5;
    brewParticles.push({
      x: barCenterX + (Math.random() - 0.5) * 16,
      y: barCenterY,
      vx: Math.cos(angle) * speed,
      vy: -0.9 - Math.random() * 1.2,
      alpha: 1,
      life: 0,
      maxLife: 0.7 + Math.random() * 0.4,
      size: Math.random() > 0.4 ? 3 : 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

/**
 * Animated dynamic layer for Poké-Café & Bar (Barista Rio, Alcremie, steam wisps, musical notes, fairy lights)
 */
export function renderCafeAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Warm Twinkling Fairy String Lights along North Wall
  for (let i = 0; i < 11; i++) {
    const lx = 2 * TILE_SIZE + i * 18;
    const ly = 2 * TILE_SIZE - 3 + Math.sin(i * 0.9) * 2;
    const pulse = 0.55 + Math.sin(tick / 12 + i) * 0.35;
    ctx.fillStyle = `rgba(254, 240, 138, ${pulse})`;
    ctx.fillRect(lx, ly, 2, 2);
  }

  // 2. Master Barista Rio Sprite at (6, 3) behind the Espresso Counter
  const rioX = 6 * TILE_SIZE;
  const rioY = 3 * TILE_SIZE;
  const bob = Math.floor(Math.sin(tick / 15) * 1.2);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(rioX + 8, rioY + 15, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Burgundy Barista Beret / Cap
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(rioX + 4, rioY + 1 + bob, 8, 3);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(rioX + 4, rioY + 3 + bob, 8, 1);

  // Hair & Face
  ctx.fillStyle = '#271206';
  ctx.fillRect(rioX + 3, rioY + 4 + bob, 2, 3);
  ctx.fillRect(rioX + 11, rioY + 4 + bob, 2, 3);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(rioX + 5, rioY + 4 + bob, 6, 5);

  // Eyes & Warm Smile
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(rioX + 6, rioY + 5 + bob, 1, 2);
  ctx.fillRect(rioX + 9, rioY + 5 + bob, 1, 2);
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(rioX + 7, rioY + 7 + bob, 2, 1);

  // Crisp Shirt & Leather Roaster Apron
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(rioX + 4, rioY + 9 + bob, 8, 6);
  ctx.fillStyle = '#78350f'; // Leather apron
  ctx.fillRect(rioX + 5, rioY + 10 + bob, 6, 5);
  ctx.fillStyle = '#f59e0b'; // Golden coffee pin
  ctx.fillRect(rioX + 8, rioY + 11 + bob, 2, 2);

  // 3. Alcremie (Whipped Cream Fairy Mascot) at (7, 3) next to Barista Rio
  const alcX = 7 * TILE_SIZE;
  const alcY = 3 * TILE_SIZE;
  const alcBob = Math.floor(Math.sin((tick + 8) / 12) * 1.4);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(alcX + 8, alcY + 15, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy Whipped Cream Body (Vanilla & Strawberry Pink Swirl)
  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(alcX + 4, alcY + 8 + alcBob, 8, 6);
  ctx.fillStyle = '#fecdd3';
  ctx.fillRect(alcX + 3, alcY + 10 + alcBob, 10, 4);

  // Cream Swirl Head
  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(alcX + 4, alcY + 3 + alcBob, 8, 6);
  ctx.fillStyle = '#fda4af'; // Side cream curls
  ctx.fillRect(alcX + 3, alcY + 4 + alcBob, 2, 4);
  ctx.fillRect(alcX + 11, alcY + 4 + alcBob, 2, 4);

  // Red Sweet Berries on Top of Head
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(alcX + 5, alcY + 1 + alcBob, 2, 2);
  ctx.fillRect(alcX + 9, alcY + 1 + alcBob, 2, 2);
  ctx.fillStyle = '#10b981'; // Tiny leaf
  ctx.fillRect(alcX + 7, alcY + 1 + alcBob, 2, 1);

  // Ruby Eyes & Happy Expression
  ctx.fillStyle = '#be123c';
  ctx.fillRect(alcX + 6, alcY + 5 + alcBob, 1, 2);
  ctx.fillRect(alcX + 9, alcY + 5 + alcBob, 1, 2);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(alcX + 7, alcY + 7 + alcBob, 2, 1);

  // Sweet Sparkles around Alcremie every 40 ticks
  if (tick % 40 < 15) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(alcX + 2, alcY + 2 + alcBob, 1, 1);
    ctx.fillRect(alcX + 13, alcY + 6 + alcBob, 1, 1);
  }

  // 4. Gentle Rising Coffee Steam Wisps above Espresso Machine & VIP Booth
  const steamOffset = (tick % 48) / 48;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * (1 - steamOffset)})`;
  const steamY = 4 * TILE_SIZE - 6 - steamOffset * 10;
  ctx.fillRect(4 * TILE_SIZE + 14 + Math.sin(tick / 8) * 1.5, steamY, 2, 3);
  ctx.fillRect(10 * TILE_SIZE + 18 + Math.cos(tick / 8) * 1.5, 7 * TILE_SIZE + 12 - steamOffset * 8, 2, 2);

  // 5. Floating Musical Notes from Lo-Fi Vinyl Jukebox (x: 1.5, y: 3)
  const noteOffset = ((tick + 20) % 60) / 60;
  ctx.fillStyle = `rgba(251, 191, 36, ${0.75 * (1 - noteOffset)})`;
  const noteX = 1 * TILE_SIZE + 14 + Math.sin(tick / 10) * 3;
  const noteY = 3 * TILE_SIZE - noteOffset * 12;
  ctx.fillRect(noteX, noteY, 3, 2);
  ctx.fillRect(noteX + 2, noteY - 3, 1, 3);

  // 6. Active Brew Flash & Aroma Particle Burst
  if (machineGlowTimer > 0) {
    machineGlowTimer--;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(4 * TILE_SIZE + 18, 4 * TILE_SIZE, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  if (floatingBrewText) {
    floatingBrewText.y -= 0.35;
    floatingBrewText.alpha -= 0.018;
    if (floatingBrewText.alpha <= 0) {
      floatingBrewText = null;
    } else {
      ctx.save();
      ctx.globalAlpha = Math.max(0, floatingBrewText.alpha);
      drawPixelText(ctx, floatingBrewText.text, 4 * TILE_SIZE - 8, Math.floor(floatingBrewText.y), '#fef08a');
      ctx.restore();
    }
  }

  for (let i = brewParticles.length - 1; i >= 0; i--) {
    const p = brewParticles[i];
    p.life += 0.02;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = 1 - p.life / p.maxLife;
    if (p.life >= p.maxLife || p.alpha <= 0) {
      brewParticles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    ctx.restore();
  }

  ctx.restore();
}
