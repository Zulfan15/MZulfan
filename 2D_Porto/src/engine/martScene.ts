import type { Dir } from './types';
import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';

export const MART_COLS = 15;
export const MART_ROWS = 12;
export const MART_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 10, dir: 'up' };

export interface MartPropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface MartProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: MartPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
}

// Color Palette for Pokémon Mart
const C_FLOOR_A = '#f8fafc';
const C_FLOOR_B = '#e2e8f0';
const C_FLOOR_BLUE = '#dbeafe';
const C_WALL = '#1e3a8a';
const C_WALL_ACCENT = '#3b82f6';
const C_WALL_TRIM = '#94a3b8';
const C_WOOD = '#b45309';
const C_WOOD_LIGHT = '#d97706';

export const MART_PROPS: MartProp[] = [
  {
    id: 'clerk',
    kind: 'npc',
    x: 6,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'clerk' },
    label: 'Clerk Kevin',
    style: 'clerk',
    labelLift: 18,
    hint: 'Talk to Clerk Kevin 🏪',
  },
  {
    id: 'services-shelf',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'services-shelf' },
    label: 'Dev Services',
    style: 'services-shelf',
    labelLift: 12,
    hint: 'Inspect Software Services 🎒',
  },
  {
    id: 'tech-tms',
    kind: 'prop',
    x: 10,
    y: 3,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'tech-tms' },
    label: 'Tech TMs',
    style: 'tech-tms',
    labelLift: 12,
    hint: 'Browse Technical TMs 💿',
  },
  {
    id: 'potions-shelf',
    kind: 'prop',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'potions-shelf' },
    label: 'Dev Potions',
    style: 'potions-shelf',
    labelLift: 12,
    hint: 'Check Dev Potions & Perks 🧪',
  },
  {
    id: 'key-showcase',
    kind: 'prop',
    x: 10,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'key-showcase' },
    label: 'Key Items & CV',
    style: 'key-showcase',
    labelLift: 12,
    hint: 'Inspect Key Items & Download CV 🔑',
  },
  {
    id: 'drink-cooler',
    kind: 'prop',
    x: 13,
    y: 3,
    w: 1,
    h: 3,
    target: {
      type: 'note',
      text: 'POKÉ-COOLER: Chilled Fresh Water, Soda Pop, and Bandung Specialty Cold Brew to keep development productivity at maximum.',
    },
    label: 'Drink Cooler',
    style: 'drink-cooler',
    labelLift: 10,
    hint: 'Inspect Drinks 🥤',
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
export const MART_COLLISION = new Uint8Array(MART_COLS * MART_ROWS).fill(0);
const cIdx = (x: number, y: number) => y * MART_COLS + x;

// Perimeter walls
for (let x = 0; x < MART_COLS; x++) {
  MART_COLLISION[cIdx(x, 0)] = 1;
  MART_COLLISION[cIdx(x, 1)] = 1;
  MART_COLLISION[cIdx(x, 11)] = 1;
}
for (let y = 0; y < MART_ROWS; y++) {
  MART_COLLISION[cIdx(0, y)] = 1;
  MART_COLLISION[cIdx(14, y)] = 1;
}

// Doorway at (7, 11) is clear for exit
MART_COLLISION[cIdx(7, 11)] = 0;

// Main Mart Cashier Counter (x: 4..8, y: 4..5)
for (let x = 4; x <= 8; x++) {
  MART_COLLISION[cIdx(x, 4)] = 1;
  MART_COLLISION[cIdx(x, 5)] = 1;
}

// Behind counter where Clerk sits (blocked so player doesn't clip)
MART_COLLISION[cIdx(5, 3)] = 1;
MART_COLLISION[cIdx(6, 3)] = 1;
MART_COLLISION[cIdx(7, 3)] = 1;

// North-West Shelf (Services Shelf: x: 1..3, y: 3..4)
for (let x = 1; x <= 3; x++) {
  MART_COLLISION[cIdx(x, 3)] = 1;
  MART_COLLISION[cIdx(x, 4)] = 1;
}

// North-East Shelf (Tech TMs Shelf: x: 10..12, y: 3..4)
for (let x = 10; x <= 12; x++) {
  MART_COLLISION[cIdx(x, 3)] = 1;
  MART_COLLISION[cIdx(x, 4)] = 1;
}

// South-West Shelf (Potions Shelf: x: 1..3, y: 7..8)
for (let x = 1; x <= 3; x++) {
  MART_COLLISION[cIdx(x, 7)] = 1;
  MART_COLLISION[cIdx(x, 8)] = 1;
}

// South-East Shelf (Key Items Pedestal: x: 10..12, y: 7..8)
for (let x = 10; x <= 12; x++) {
  MART_COLLISION[cIdx(x, 7)] = 1;
  MART_COLLISION[cIdx(x, 8)] = 1;
}

// Drink Cooler on East Wall (x: 13, y: 3..5)
for (let y = 3; y <= 5; y++) {
  MART_COLLISION[cIdx(13, y)] = 1;
}

/**
 * Procedural static background renderer for Pokémon Mart Interior
 */
export function createMartBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = MART_COLS * TILE_SIZE;
  canvas.height = MART_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // 1. Cheerful checkered retail flooring
  for (let r = 2; r < MART_ROWS; r++) {
    for (let c = 0; c < MART_COLS; c++) {
      const isAlt = (r + c) % 2 === 0;
      const isAisle = c >= 6 && c <= 8;
      ctx.fillStyle = isAisle ? (isAlt ? C_FLOOR_BLUE : '#ffffff') : isAlt ? C_FLOOR_A : C_FLOOR_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Fine tile grid highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 1, TILE_SIZE);
    }
  }

  // 2. North Wall & Classic Poké Mart Signage
  ctx.fillStyle = C_WALL;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Blue Accent Stripe
  ctx.fillStyle = C_WALL_ACCENT;
  ctx.fillRect(0, 1.25 * TILE_SIZE, canvas.width, 6);

  // Wall Baseboard Trim
  ctx.fillStyle = C_WALL_TRIM;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 3);

  // Big Illuminated "POKÉ MART" Header Sign
  const signW = 100;
  const signH = 18;
  const signX = (canvas.width - signW) / 2;
  const signY = 6;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(signX + 2, signY + 2, signW - 4, 2);

  // Mart Pokéball Icon in Sign
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(signX + 12, signY + signH / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.arc(signX + 12, signY + signH / 2, 2, 0, Math.PI * 2);
  ctx.fill();

  drawPixelText(ctx, 'POKE MART', signX + 24, signY + 5, '#ffffff');

  // 3. Side Boundary Walls
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);

  // 4. North-West Shelf: Engineering Services
  drawRetailShelf(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 'SERVICES', '#2563eb');
  // Draw mini laptops & toolboxes on shelf
  drawShelfItems(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 'laptops');

  // 5. North-East Shelf: Technical TMs
  drawRetailShelf(ctx, 10 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 'TECH TMs', '#7c3aed');
  // Draw colorful TM optical discs
  drawShelfItems(ctx, 10 * TILE_SIZE, 3 * TILE_SIZE, 'discs');

  // 6. South-West Shelf: Dev Potions
  drawRetailShelf(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 'POTIONS', '#059669');
  // Draw colorful potions & espresso bottles
  drawShelfItems(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE, 'potions');

  // 7. South-East Pedestal: Key Items & CV Showcase
  drawPedestalShowcase(ctx, 10 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. Drink Cooler / Vending on East Wall
  drawDrinkCooler(ctx, 13 * TILE_SIZE, 3 * TILE_SIZE);

  // 9. Main Cashier Counter (x: 4..8, y: 4..5)
  drawCashierCounter(ctx, 4 * TILE_SIZE, 4 * TILE_SIZE, 5 * TILE_SIZE, 2 * TILE_SIZE);

  // 10. Entrance / Exit Welcome Mat at bottom door
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(6 * TILE_SIZE + 4, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 8, 12);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(6 * TILE_SIZE + 6, 11 * TILE_SIZE + 4, 2 * TILE_SIZE - 12, 2);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE - 8, 11 * TILE_SIZE + 6, '#ffffff');

  return canvas;
}

function drawRetailShelf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  accentColor: string
) {
  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Wood / Steel Frame
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Shelving Rows
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 2, y + 14, w - 4, 3);
  ctx.fillRect(x + 2, y + 26, w - 4, 3);

  // Header Banner
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 2, y + 2, w - 4, 8);
  drawPixelText(ctx, title, x + 4, y + 3, '#ffffff');
}

function drawShelfItems(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'laptops' | 'discs' | 'potions'
) {
  if (type === 'laptops') {
    // Top row: Blue & silver mini laptops
    for (let i = 0; i < 3; i++) {
      const ix = x + 6 + i * 14;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(ix, y + 10, 10, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ix + 1, y + 8, 8, 3);
    }
    // Bottom row: Toolboxes / AI chips
    for (let i = 0; i < 3; i++) {
      const ix = x + 6 + i * 14;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(ix, y + 21, 10, 5);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(ix + 3, y + 19, 4, 2);
    }
  } else if (type === 'discs') {
    // TM Discs: Rainbow colored jewel cases
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 3; i++) {
      const ix = x + 6 + i * 14;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(ix, y + 9, 8, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ix + 2, y + 11, 4, 2);
    }
    for (let i = 0; i < 3; i++) {
      const ix = x + 6 + i * 14;
      ctx.fillStyle = colors[(i + 3) % colors.length];
      ctx.fillRect(ix, y + 21, 8, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ix + 2, y + 23, 4, 2);
    }
  } else if (type === 'potions') {
    // Potions & Bandung Espresso Flasks
    const potColors = ['#9333ea', '#2563eb', '#e11d48', '#78350f', '#059669', '#d97706'];
    for (let i = 0; i < 4; i++) {
      const ix = x + 5 + i * 10;
      ctx.fillStyle = potColors[i];
      ctx.fillRect(ix, y + 9, 6, 5);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ix + 2, y + 7, 2, 2); // Cap
    }
    for (let i = 0; i < 4; i++) {
      const ix = x + 5 + i * 10;
      ctx.fillStyle = potColors[(i + 2) % potColors.length];
      ctx.fillRect(ix, y + 21, 6, 5);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ix + 2, y + 19, 2, 2);
    }
  }
}

function drawPedestalShowcase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Polished Stone Pedestal
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + 10, w, h - 10);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 2, y + 12, w - 4, h - 14);

  // Glass Case
  ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
  ctx.fillRect(x + 2, y, w - 4, 12);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 2.5, y + 0.5, w - 5, 11);

  // Golden Certificate & CV Roll inside
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 8, y + 4, 10, 6);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 10, y + 5, 6, 4);

  // Key Item Emblem
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + w - 18, y + 4, 8, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + w - 16, y + 6, 4, 2);

  // Header Banner
  drawPixelText(ctx, 'KEY ITEMS & CV', x + 4, y + 14, '#f8fafc');
}

function drawDrinkCooler(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x, y, TILE_SIZE, 3 * TILE_SIZE);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 1, y + 2, TILE_SIZE - 2, 3 * TILE_SIZE - 4);

  // Glass door with drinks visible inside
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(x + 2, y + 6, TILE_SIZE - 4, 3 * TILE_SIZE - 10);

  // Glowing beverage cans
  const canColors = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = canColors[i];
    ctx.fillRect(x + 4, y + 8 + i * 8, 8, 5);
  }
}

function drawCashierCounter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Counter Wooden Body
  ctx.fillStyle = C_WOOD;
  ctx.fillRect(x, y + 6, w, h - 6);
  ctx.fillStyle = C_WOOD_LIGHT;
  ctx.fillRect(x, y, w, 6);

  // Blue Mart Facade Strip
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x + 2, y + 8, w - 4, 10);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(x + 2, y + 8, w - 4, 2);

  // Cash Register on counter top (x + 8, y - 6)
  const regX = x + 12;
  const regY = y - 4;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(regX, regY, 14, 10);
  ctx.fillStyle = '#334155';
  ctx.fillRect(regX + 1, regY + 1, 12, 8);
  // Green Screen
  ctx.fillStyle = '#10b981';
  ctx.fillRect(regX + 3, regY + 2, 8, 3);
  // Barcode scanner
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(regX + 10, regY + 6, 2, 2);

  // Small Pokéball Item Bell
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x + w - 16, y + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + w - 18, y + 3, 4, 1);
}

/**
 * Animated dynamic layer (Clerk Kevin idle animation, blinking lights)
 */
export function renderMartAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Clerk Kevin Sprite at (6, 3) behind the counter
  const clerkX = 6 * TILE_SIZE;
  const clerkY = 3 * TILE_SIZE;
  const bob = Math.floor(Math.sin(tick / 16) * 1.2);

  // Clerk Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
  ctx.beginPath();
  ctx.ellipse(clerkX + 8, clerkY + 15, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Clerk Blue Cap
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(clerkX + 4, clerkY + 1 + bob, 8, 4);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(clerkX + 3, clerkY + 3 + bob, 10, 2); // Visor

  // Clerk Face & Hair
  ctx.fillStyle = '#1e293b'; // Dark brown hair
  ctx.fillRect(clerkX + 3, clerkY + 4 + bob, 2, 3);
  ctx.fillRect(clerkX + 11, clerkY + 4 + bob, 2, 3);
  ctx.fillStyle = '#fed7aa'; // Skin tone
  ctx.fillRect(clerkX + 5, clerkY + 4 + bob, 6, 5);

  // Friendly Eyes & Smile
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(clerkX + 6, clerkY + 5 + bob, 1, 2);
  ctx.fillRect(clerkX + 9, clerkY + 5 + bob, 1, 2);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(clerkX + 7, clerkY + 7 + bob, 2, 1);

  // White Shirt & Blue Mart Apron
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(clerkX + 4, clerkY + 9 + bob, 8, 6);
  ctx.fillStyle = '#1e40af'; // Apron
  ctx.fillRect(clerkX + 5, clerkY + 10 + bob, 6, 5);
  ctx.fillStyle = '#f59e0b'; // Name badge
  ctx.fillRect(clerkX + 8, clerkY + 11 + bob, 2, 2);

  // 2. Glowing Pedestal Spotlight Animation
  const glowAlpha = 0.15 + Math.sin(tick / 20) * 0.08;
  const pedCenterX = 11.5 * TILE_SIZE;
  const pedCenterY = 7.5 * TILE_SIZE;
  const radGrad = ctx.createRadialGradient(pedCenterX, pedCenterY, 4, pedCenterX, pedCenterY, 28);
  radGrad.addColorStop(0, `rgba(56, 189, 248, ${glowAlpha})`);
  radGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(pedCenterX, pedCenterY, 28, 0, Math.PI * 2);
  ctx.fill();

  // 3. Cash Register LED Blinking
  const blink = (Math.floor(tick / 24) % 2 === 0);
  ctx.fillStyle = blink ? '#34d399' : '#059669';
  ctx.fillRect(4 * TILE_SIZE + 15, 4 * TILE_SIZE - 2, 4, 1);

  ctx.restore();
}

