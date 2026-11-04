import type { Dir } from './types';
import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';
import { XURKITREE_IMAGE_SRC } from './xurkitreeSprite';

let xurkitreeImg: HTMLImageElement | null = null;
if (typeof Image !== 'undefined') {
  xurkitreeImg = new Image();
  xurkitreeImg.src = XURKITREE_IMAGE_SRC;
}

export const TOWER_COLS = 15;
export const TOWER_ROWS = 12;
export const TOWER_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 10, dir: 'up' };

export interface TowerPropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface TowerProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: TowerPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
}

// Modern High-Tech Corporate Color Palette
const C_FLOOR_DARK = '#0f172a';
const C_FLOOR_TILES = '#1e293b';
const C_FLOOR_ACCENT = '#0284c7';
const C_WALL = '#090d16';
const C_WALL_PANEL = '#1e293b';
const C_WALL_CYAN = '#38bdf8';
const C_CYAN_GLOW = 'rgba(56, 189, 248, 0.35)';

export const TOWER_PROPS: TowerProp[] = [
  {
    id: 'xurkitree',
    kind: 'npc',
    x: 7,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'xurkitree' },
    label: 'Xurkitree AI Host',
    style: 'xurkitree',
    labelLift: 20,
    hint: 'Talk to Xurkitree (Ultra Beast AI Host) ⚡',
  },
  {
    id: 'robotics-bay',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'robotics-bay' },
    label: 'Robotics & IoT Bay',
    style: 'robotics-bay',
    labelLift: 12,
    hint: 'Inspect Robotics Workshop & IoT Prototypes 🤖',
  },
  {
    id: 'server-rack',
    kind: 'prop',
    x: 11,
    y: 3,
    w: 3,
    h: 3,
    target: { type: 'event', name: 'server-rack' },
    label: 'Cloud & Network NOC',
    style: 'server-rack',
    labelLift: 14,
    hint: 'Monitor Server Racks & Network Security 🖧',
  },
  {
    id: 'career-terminal',
    kind: 'prop',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'career-terminal' },
    label: 'Experience Terminal',
    style: 'career-terminal',
    labelLift: 12,
    hint: 'Explore Career Log & 6x Lab Assistantships 💼',
  },
  {
    id: 'elevator',
    kind: 'prop',
    x: 8,
    y: 7,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'elevator' },
    label: 'Executive Elevator',
    style: 'elevator',
    labelLift: 12,
    hint: 'Select Tech Tower Floor (1F - 4F) 🛗',
  },
  {
    id: 'lounge',
    kind: 'prop',
    x: 13,
    y: 7,
    w: 1,
    h: 3,
    target: {
      type: 'note',
      text: 'EXECUTIVE TECH LOUNGE: Where engineers and lab assistants discuss system architecture, enjoy cold brew coffee, and review pull requests.',
    },
    label: 'Executive Lounge',
    style: 'lounge',
    labelLift: 10,
    hint: 'Relax at the Tech Lounge ☕',
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

// Collision Matrix (0 = walkable, 1 = blocked)
export const TOWER_COLLISION = new Uint8Array(TOWER_COLS * TOWER_ROWS).fill(0);
const cIdx = (x: number, y: number) => y * TOWER_COLS + x;

// Perimeter walls
for (let x = 0; x < TOWER_COLS; x++) {
  TOWER_COLLISION[cIdx(x, 0)] = 1;
  TOWER_COLLISION[cIdx(x, 1)] = 1;
  TOWER_COLLISION[cIdx(x, 11)] = 1;
}
for (let y = 0; y < TOWER_ROWS; y++) {
  TOWER_COLLISION[cIdx(0, y)] = 1;
  TOWER_COLLISION[cIdx(14, y)] = 1;
}

// Exit doorway at (7, 11) is clear
TOWER_COLLISION[cIdx(7, 11)] = 0;

// Central Holographic Reception Counter (x: 5..9, y: 4..5)
for (let x = 5; x <= 9; x++) {
  TOWER_COLLISION[cIdx(x, 4)] = 1;
  TOWER_COLLISION[cIdx(x, 5)] = 1;
}
// Behind counter where Porygon hovers
TOWER_COLLISION[cIdx(6, 3)] = 1;
TOWER_COLLISION[cIdx(7, 3)] = 1;
TOWER_COLLISION[cIdx(8, 3)] = 1;

// North-West Station: Robotics & IoT Bay (x: 1..3, y: 3..4)
for (let x = 1; x <= 3; x++) {
  TOWER_COLLISION[cIdx(x, 3)] = 1;
  TOWER_COLLISION[cIdx(x, 4)] = 1;
}

// North-East Station: Server Racks (x: 11..13, y: 3..5)
for (let x = 11; x <= 13; x++) {
  for (let y = 3; y <= 5; y++) {
    TOWER_COLLISION[cIdx(x, y)] = 1;
  }
}

// South-West Station: Experience Terminal (x: 1..3, y: 7..8)
for (let x = 1; x <= 3; x++) {
  TOWER_COLLISION[cIdx(x, 7)] = 1;
  TOWER_COLLISION[cIdx(x, 8)] = 1;
}

// South-East Station: Executive Elevator (x: 8..10, y: 7..8)
for (let x = 8; x <= 10; x++) {
  TOWER_COLLISION[cIdx(x, 7)] = 1;
  TOWER_COLLISION[cIdx(x, 8)] = 1;
}

// Lounge on Far East Wall (x: 13, y: 7..9)
for (let y = 7; y <= 9; y++) {
  TOWER_COLLISION[cIdx(13, y)] = 1;
}

/**
 * Procedural static background renderer for Tech Tower Corporate Lobby
 */
export function createTowerBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TOWER_COLS * TILE_SIZE;
  canvas.height = TOWER_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // 1. Sleek corporate slate tile flooring with cyan neon bus lines
  for (let r = 2; r < TOWER_ROWS; r++) {
    for (let c = 0; c < TOWER_COLS; c++) {
      const isAlt = (r + c) % 2 === 0;
      const isAisle = c >= 6 && c <= 8;
      ctx.fillStyle = isAisle
        ? isAlt
          ? '#1e293b'
          : '#0f172a'
        : isAlt
        ? C_FLOOR_TILES
        : C_FLOOR_DARK;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Fine grid borders
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 1, TILE_SIZE);
    }
  }

  // Cyan Floor Circuit Lines leading from entrance to reception
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.fillRect(7 * TILE_SIZE + 7, 5 * TILE_SIZE, 2, 6 * TILE_SIZE);
  ctx.fillRect(3 * TILE_SIZE, 6 * TILE_SIZE, 9 * TILE_SIZE, 1);

  // 2. High-Tech North Wall
  ctx.fillStyle = C_WALL;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Structural carbon fibre wall panels
  for (let c = 1; c < TOWER_COLS - 1; c += 2) {
    ctx.fillStyle = C_WALL_PANEL;
    ctx.fillRect(c * TILE_SIZE + 2, 4, 2 * TILE_SIZE - 4, 2 * TILE_SIZE - 8);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(c * TILE_SIZE + 2.5, 4.5, 2 * TILE_SIZE - 5, 2 * TILE_SIZE - 9);
  }

  // Cyan Wall Laser Strip
  ctx.fillStyle = C_WALL_CYAN;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 2);

  // "TECH TOWER · INNOVATION HQ" Corporate Illuminated Sign
  const signW = 120;
  const signH = 18;
  const signX = (canvas.width - signW) / 2;
  const signY = 6;
  ctx.fillStyle = '#020617';
  ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.fillStyle = C_WALL_CYAN;
  ctx.fillRect(signX, signY, signW, 2);
  drawPixelText(ctx, 'TECH TOWER HQ', signX + 16, signY + 5, '#f8fafc');

  // Mini rotating icon / diamond
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(signX + 6, signY + 5, 5, 5);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(signX + 7, signY + 6, 3, 3);

  // 3. Side Boundary Columns
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(TILE_SIZE - 1, 0, 1, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, 1, canvas.height);

  // 4. North-West: Robotics & IoT Lab Bay
  drawRoboticsBay(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 5. North-East: Cloud & Network Server Racks
  drawServerRacks(ctx, 11 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE);

  // 6. South-West: Corporate Experience Terminal
  drawCareerTerminal(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 7. South-East: Executive Glass Elevator
  drawElevator(ctx, 8 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. Far East: Executive Lounge & Coffee Bar
  drawLounge(ctx, 13 * TILE_SIZE, 7 * TILE_SIZE);

  // 9. Central Reception Desk (x: 5..9, y: 4..5)
  drawReceptionDesk(ctx, 5 * TILE_SIZE, 4 * TILE_SIZE, 5 * TILE_SIZE, 2 * TILE_SIZE);

  // 10. Exit Glass Sliding Doors & Mat at bottom
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(6 * TILE_SIZE + 4, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 8, 12);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(6 * TILE_SIZE + 6, 11 * TILE_SIZE + 4, 2 * TILE_SIZE - 12, 2);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE - 8, 11 * TILE_SIZE + 6, '#ffffff');

  return canvas;
}

function drawRoboticsBay(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Workbench frame
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Header
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 2, y + 2, w - 4, 7);
  drawPixelText(ctx, 'ROBOTICS & IOT', x + 4, y + 3, '#ffffff');

  // Robotic Arm Prototype (Yellow & Black)
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x + 8, y + 12, 6, 12);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 10, y + 10, 8, 3);
  ctx.fillRect(x + 16, y + 12, 4, 8); // Gripper claw
  ctx.fillStyle = '#38bdf8'; // Optical sensor
  ctx.fillRect(x + 18, y + 14, 2, 2);

  // ESP32 Microcontroller Board with antennas
  ctx.fillStyle = '#059669'; // Green PCB
  ctx.fillRect(x + 26, y + 14, 12, 8);
  ctx.fillStyle = '#94a3b8'; // ESP32 metal shield
  ctx.fillRect(x + 28, y + 15, 6, 6);
  ctx.fillStyle = '#ef4444'; // Power LED
  ctx.fillRect(x + 35, y + 16, 2, 2);
}

function drawServerRacks(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Dark Server Cabinet
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  // Header Banner
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(x + 2, y + 2, w - 4, 7);
  drawPixelText(ctx, 'CLOUD & NOC', x + 4, y + 3, '#ffffff');

  // 3 Server Units with Ventilation Grilles & Static LEDs
  for (let i = 0; i < 3; i++) {
    const sy = y + 12 + i * 11;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 4, sy, w - 8, 9);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 6, sy + 2, w - 24, 5); // Grille

    // Activity LEDs (Static slots, animated later)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + w - 14, sy + 3, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + w - 10, sy + 3, 2, 2);
  }
}

function drawCareerTerminal(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Modern Glass Kiosk Base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Header Banner
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(x + 2, y + 2, w - 4, 7);
  drawPixelText(ctx, 'EXPERIENCE', x + 4, y + 3, '#ffffff');

  // Touchscreen Display showing graph & certificates
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 6, y + 12, w - 12, 14);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x + 8, y + 14, w - 16, 10);

  // Bar charts on screen
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x + 10, y + 18, 4, 5);
  ctx.fillRect(x + 16, y + 16, 4, 7);
  ctx.fillRect(x + 22, y + 15, 4, 8);
  ctx.fillRect(x + 28, y + 17, 4, 6);
}

function drawElevator(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Brushed steel elevator frame
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Elevator Indicator Display
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 4, y + 3, w - 8, 7);
  drawPixelText(ctx, 'ELEVATOR 1F-4F', x + 6, y + 4, '#38bdf8');

  // Double Sliding Steel Doors
  const doorMid = x + Math.floor(w / 2);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 6, y + 12, w - 12, h - 14);
  // Center seam
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorMid - 1, y + 12, 2, h - 14);
  // Floor Call Button Panel
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x + w - 5, y + 18, 2, 4);
}

function drawLounge(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Water cooler & coffee station
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x, y, TILE_SIZE, 3 * TILE_SIZE);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 3 * TILE_SIZE - 4);

  // Water bottle on top
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x + 3, y + 4, 10, 10);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 5, y + 16, 6, 4); // dispenser taps

  // Coffee cups below
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 4, y + 28, 4, 5);
  ctx.fillRect(x + 9, y + 28, 4, 5);
}

function drawReceptionDesk(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(x + 2, y + 4, w, h);

  // Modern Curved Glass Counter
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y + 4, w, h - 4);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 6, w - 4, h - 8);

  // Counter Top
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, w, 5);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x, y, w, 1); // Neon edge line

  // Corporate Tech Logo Hologram in front of counter
  const logoX = x + Math.floor(w / 2);
  const logoY = y + 14;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(logoX, logoY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(logoX, logoY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Terminal screen on desk
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 12, y - 4, 12, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 13, y - 3, 10, 6);
}

/**
 * Animated dynamic layer (Xurkitree AI floating animation, electric aura, lightning sparks, blinking server LEDs)
 */
export function renderTowerAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Xurkitree Ultra Beast (UB-03 Lighting) AI Mascot at (7, 3) behind the counter
  const cx = 7 * TILE_SIZE + 8;
  const floatY = Math.floor(Math.sin(tick / 12) * 2.5);
  const cy = 3 * TILE_SIZE + 7 + floatY;

  // High-voltage electric aura & glow
  const auraAlpha = 0.22 + Math.sin(tick / 10) * 0.12;
  const radGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 26);
  radGrad.addColorStop(0, `rgba(250, 204, 21, ${auraAlpha + 0.15})`);
  radGrad.addColorStop(0.45, `rgba(56, 189, 248, ${auraAlpha})`);
  radGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fill();

  // Draw Xurkitree authentic Sun & Moon sprite
  if (xurkitreeImg && xurkitreeImg.complete && xurkitreeImg.naturalWidth > 0) {
    ctx.drawImage(xurkitreeImg, cx - 19, cy - 19, 38, 38);
  } else {
    // Fallback pixel art electric core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3, cy - 8, 6, 6);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(cx - 5, cy - 10, 10, 2);
    ctx.fillRect(cx - 5, cy - 2, 10, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 2, cy - 2, 4, 12);
  }

  // Dynamic lightning spark discharges
  const sparkPhase = Math.floor(tick / 4) % 4;
  ctx.fillStyle = sparkPhase % 2 === 0 ? '#fde047' : '#38bdf8';
  const sparks = [
    { dx: -14 + ((tick * 3) % 28), dy: -12 + ((tick * 2) % 20) },
    { dx: 12 - ((tick * 4) % 24), dy: -8 + ((tick * 3) % 18) },
    { dx: -15 + ((tick * 5) % 30), dy: 6 - ((tick * 2) % 15) },
    { dx: 10 + ((tick * 2) % 20), dy: 8 + ((tick * 3) % 14) },
  ];
  for (const sp of sparks) {
    ctx.fillRect(cx + sp.dx, cy + sp.dy, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + sp.dx + 1, cy + sp.dy - 1, 1, 1);
    ctx.fillStyle = sparkPhase % 2 === 0 ? '#fde047' : '#38bdf8';
  }

  // 2. Server Rack Activity LED Blinking
  const ledBlink1 = Math.floor(tick / 10) % 2 === 0;
  const ledBlink2 = Math.floor(tick / 16) % 3 === 0;
  const ledBlink3 = Math.floor(tick / 8) % 2 === 0;

  ctx.fillStyle = ledBlink1 ? '#10b981' : '#059669';
  ctx.fillRect(11 * TILE_SIZE + 40, 3 * TILE_SIZE + 15, 2, 2);
  ctx.fillStyle = ledBlink2 ? '#f43f5e' : '#38bdf8';
  ctx.fillRect(11 * TILE_SIZE + 40, 3 * TILE_SIZE + 26, 2, 2);
  ctx.fillStyle = ledBlink3 ? '#38bdf8' : '#1e293b';
  ctx.fillRect(11 * TILE_SIZE + 40, 3 * TILE_SIZE + 37, 2, 2);

  // 3. Elevator Call Panel Indicator (Shifted to x = 8)
  const arrowLit = Math.floor(tick / 20) % 2 === 0;
  ctx.fillStyle = arrowLit ? '#38bdf8' : '#0284c7';
  ctx.fillRect(8 * TILE_SIZE + 44, 7 * TILE_SIZE + 15, 2, 2);

  ctx.restore();
}

