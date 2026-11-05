import type { Dir } from './types';
import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';

export const RECEPTION_COLS = 15;
export const RECEPTION_ROWS = 12;
export const RECEPTION_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 10, dir: 'up' };

export interface ReceptionPropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface ReceptionProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: ReceptionPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
  door?: { x: number; y: number };
}

// Color Palette for Pokémon Center Reception
const C_FLOOR_A = '#f1f5f9';
const C_FLOOR_B = '#e2e8f0';
const C_WALL = '#f8fafc';
const C_WALL_TRIM = '#cbd5e1';
const C_RED = '#ef4444';
const C_RED_DARK = '#b91c1c';

export const RECEPTION_PROPS: ReceptionProp[] = [
  {
    id: 'mira',
    kind: 'npc',
    x: 7,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'mira' },
    label: 'Mira · Front Desk',
    style: 'mira',
    labelLift: 18,
    hint: 'Talk to Mira 🎧',
  },
  {
    id: 'chansey',
    kind: 'npc',
    x: 9,
    y: 3,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'chansey' },
    label: 'Chansey · Medical Asst',
    style: 'chansey',
    labelLift: 18,
    hint: 'Say hello to Chansey 🥚',
  },
  {
    id: 'healing-machine',
    kind: 'prop',
    x: 10,
    y: 2,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'healing-machine' },
    label: 'Pokéball Station',
    style: 'healing-machine',
    labelLift: 12,
    hint: 'Refill Poké Balls & Heal ✨',
  },
  {
    id: 'pc-terminal',
    kind: 'prop',
    x: 13,
    y: 4,
    w: 1,
    h: 2,
    target: { type: 'event', name: 'pc-terminal' },
    label: 'Network PC',
    style: 'pc-terminal',
    labelLift: 8,
    hint: 'Open Trainer Card 💾',
  },
  {
    id: 'directory-board',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 1,
    target: {
      type: 'note',
      text: 'TOWN DIRECTORY: 💻 Dev Center (North) — Timeline & Tech Stack. 🔬 Research Lab (North-East) — AI & Computer Vision. 🕹️ Arcade (East) — Kalah bot. 🏠 Home (West) — Bio & CV. 🌳 South Meadow — Wild critters.',
    },
    label: 'Town Directory',
    style: 'directory-board',
    labelLift: 20,
    hint: 'Read Directory 📋',
  },
  {
    id: 'waiting-couch',
    kind: 'prop',
    x: 1,
    y: 6,
    w: 3,
    h: 2,
    target: {
      type: 'note',
      text: 'A plush leather waiting couch with ITENAS Informatics alumni brochures and computer vision journals.',
    },
    label: 'Visitor Lounge',
    style: 'waiting-couch',
    labelLift: 4,
    hint: 'Rest in the lounge 🛋️',
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
export const RECEPTION_COLLISION = new Uint8Array(RECEPTION_COLS * RECEPTION_ROWS).fill(0);
const cIdx = (x: number, y: number) => y * RECEPTION_COLS + x;

// Perimeter walls
for (let x = 0; x < RECEPTION_COLS; x++) {
  RECEPTION_COLLISION[cIdx(x, 0)] = 1;
  RECEPTION_COLLISION[cIdx(x, 1)] = 1;
  RECEPTION_COLLISION[cIdx(x, 11)] = 1;
}
for (let y = 0; y < RECEPTION_ROWS; y++) {
  RECEPTION_COLLISION[cIdx(0, y)] = 1;
  RECEPTION_COLLISION[cIdx(14, y)] = 1;
}

// Doorway at (7, 11) is clear for exit
RECEPTION_COLLISION[cIdx(7, 11)] = 0;

// Curved Reception Counter (x: 5..9, y: 4..5)
for (let x = 5; x <= 9; x++) {
  RECEPTION_COLLISION[cIdx(x, 4)] = 1;
  RECEPTION_COLLISION[cIdx(x, 5)] = 1;
}

// Behind counter where Mira & Chansey sit (blocked so player doesn't walk through them)
RECEPTION_COLLISION[cIdx(7, 3)] = 1;
RECEPTION_COLLISION[cIdx(6, 3)] = 1;
RECEPTION_COLLISION[cIdx(8, 3)] = 1;
RECEPTION_COLLISION[cIdx(9, 3)] = 1;

// Healing Machine (x: 10..12, y: 2..3)
for (let x = 10; x <= 12; x++) {
  RECEPTION_COLLISION[cIdx(x, 2)] = 1;
  RECEPTION_COLLISION[cIdx(x, 3)] = 1;
}

// PC Terminal (x: 13, y: 4..5)
RECEPTION_COLLISION[cIdx(13, 4)] = 1;
RECEPTION_COLLISION[cIdx(13, 5)] = 1;

// Waiting Lounge Couch & Table (x: 1..3, y: 6..7)
for (let x = 1; x <= 3; x++) {
  RECEPTION_COLLISION[cIdx(x, 6)] = 1;
  RECEPTION_COLLISION[cIdx(x, 7)] = 1;
}

// Corner Potted Plants
RECEPTION_COLLISION[cIdx(1, 2)] = 1;
RECEPTION_COLLISION[cIdx(13, 2)] = 1;
RECEPTION_COLLISION[cIdx(1, 10)] = 1;
RECEPTION_COLLISION[cIdx(13, 10)] = 1;

/**
 * Procedural static background renderer for Pokémon Center Reception
 */
export function createReceptionBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = RECEPTION_COLS * TILE_SIZE;
  canvas.height = RECEPTION_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  // 1. Base Flooring: Clean Checkered Ceramic Linoleum
  for (let y = 0; y < RECEPTION_ROWS; y++) {
    for (let x = 0; x < RECEPTION_COLS; x++) {
      const isAlt = (x + y) % 2 === 0;
      ctx.fillStyle = isAlt ? C_FLOOR_A : C_FLOOR_B;
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Subtle grout lines
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.strokeRect(x * TILE_SIZE + 0.5, y * TILE_SIZE + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    }
  }

  // 2. North Wall
  ctx.fillStyle = C_WALL;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);
  // Red decorative upper stripe (iconic Pokémon Center red band)
  ctx.fillStyle = C_RED;
  ctx.fillRect(0, 4, canvas.width, 6);
  ctx.fillStyle = C_RED_DARK;
  ctx.fillRect(0, 10, canvas.width, 2);
  // Wall baseboard
  ctx.fillStyle = C_WALL_TRIM;
  ctx.fillRect(0, 2 * TILE_SIZE - 4, canvas.width, 4);

  // 3. Central Grand Pokéball Carpet
  const cx = 7.5 * TILE_SIZE;
  const cy = 8.0 * TILE_SIZE;
  const carpetR = 40;

  // Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, carpetR + 2, 0, Math.PI * 2);
  ctx.fill();

  // White base
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, carpetR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Red top half
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx, cy, carpetR, Math.PI, 0);
  ctx.fill();

  // Black divider line
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - carpetR, cy - 3, carpetR * 2, 6);

  // Center button
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. Double Sliding Glass Doors & Entrance Mat (x: 6..8, y: 11)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(6 * TILE_SIZE, 11 * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = '#991b1b';
  ctx.strokeRect(6 * TILE_SIZE + 0.5, 11 * TILE_SIZE + 0.5, 3 * TILE_SIZE - 1, TILE_SIZE - 1);
  drawPixelText(ctx, 'WELCOME', 6 * TILE_SIZE + 4, 11 * TILE_SIZE + 5, '#ffffff');

  // 5. Curved Reception Counter (x: 5..9, y: 4..5)
  const cX = 5 * TILE_SIZE;
  const cY = 4 * TILE_SIZE;
  const cW = 5 * TILE_SIZE;
  const cH = 2 * TILE_SIZE;

  // Counter Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.fillRect(cX + 2, cY + cH - 2, cW - 4, 6);

  // Wooden counter body
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.roundRect(cX, cY + 8, cW, cH - 8, [6, 6, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Polished Birch Countertop
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.roundRect(cX - 2, cY + 4, cW + 4, 10, [6, 6, 2, 2]);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cX - 2, cY + 12, cW + 4, 2);

  // Front Reception Logo / Sign on Counter
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cX + cW / 2, cY + 22, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cX + cW / 2 - 5, cY + 20, 10, 4);
  ctx.fillRect(cX + cW / 2 - 2, cY + 17, 4, 10);

  // 6. Healing Machine Base (x: 10..12, y: 2..3)
  const hmX = 10 * TILE_SIZE;
  const hmY = 2 * TILE_SIZE;
  const hmW = 3 * TILE_SIZE;
  const hmH = 2 * TILE_SIZE;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.fillRect(hmX + 2, hmY + hmH - 2, hmW - 4, 4);

  // Metal Console
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(hmX, hmY, hmW, hmH);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hmX, hmY, hmW, hmH);

  // Red console header
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(hmX, hmY, hmW, 6);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HEAL & REFILL', hmX + hmW / 2, hmY + 5);

  // 6 Pokéball trays / slots
  const ballSlotPositions = [
    { x: hmX + 8, y: hmY + 12 },
    { x: hmX + 24, y: hmY + 12 },
    { x: hmX + 40, y: hmY + 12 },
    { x: hmX + 8, y: hmY + 22 },
    { x: hmX + 24, y: hmY + 22 },
    { x: hmX + 40, y: hmY + 22 },
  ];
  for (const slot of ballSlotPositions) {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();
  }

  // 7. PC Terminal on Table (x: 13, y: 4..5)
  const pcX = 13 * TILE_SIZE;
  const pcY = 4 * TILE_SIZE;
  // Desk
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(pcX, pcY + 12, TILE_SIZE, TILE_SIZE + 4);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(pcX, pcY + 12, TILE_SIZE, TILE_SIZE + 4);
  // Red PC Case
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(pcX + 2, pcY + 2, 12, 12);
  ctx.strokeStyle = '#991b1b';
  ctx.strokeRect(pcX + 2, pcY + 2, 12, 12);
  // CRT Monitor Screen
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(pcX + 4, pcY + 4, 8, 7);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(pcX + 5, pcY + 5, 6, 2);

  // 8. Waiting Lounge Couch (x: 1..3, y: 6..7)
  const sofaX = 1 * TILE_SIZE;
  const sofaY = 6 * TILE_SIZE;
  // Couch Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
  ctx.fillRect(sofaX + 2, sofaY + 2 * TILE_SIZE - 2, 3 * TILE_SIZE - 4, 4);
  // Red Plush Couch Body
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.roundRect(sofaX, sofaY, 3 * TILE_SIZE, 2 * TILE_SIZE, 6);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(sofaX + 4, sofaY + 4, 3 * TILE_SIZE - 8, 2 * TILE_SIZE - 8, 4);
  ctx.fill();
  // Coffee Table in front
  ctx.fillStyle = '#78350f';
  ctx.fillRect(sofaX + 6, sofaY + 2 * TILE_SIZE + 2, 3 * TILE_SIZE - 12, 8);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(sofaX + 5, sofaY + 2 * TILE_SIZE, 3 * TILE_SIZE - 10, 4);

  // 9. Town Directory Board on Wall (x: 1..2, y: 2)
  const dirX = 1 * TILE_SIZE;
  const dirY = 2 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(dirX, dirY, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(dirX + 2, dirY + 2, 2 * TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(dirX + 4, dirY + 5, 2 * TILE_SIZE - 8, 1);
  ctx.fillRect(dirX + 4, dirY + 8, 2 * TILE_SIZE - 8, 1);
  ctx.fillRect(dirX + 4, dirY + 11, 2 * TILE_SIZE - 8, 1);

  // 10. Potted Plants in Corners
  drawPottedPlant(ctx, 1 * TILE_SIZE, 1 * TILE_SIZE + 4);
  drawPottedPlant(ctx, 13 * TILE_SIZE, 1 * TILE_SIZE + 4);
  drawPottedPlant(ctx, 1 * TILE_SIZE, 10 * TILE_SIZE);
  drawPottedPlant(ctx, 13 * TILE_SIZE, 10 * TILE_SIZE);

  return canvas;
}

function drawPottedPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Ceramic Pot
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 4, y + 8, 8, 8);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 3, y + 6, 10, 3);

  // Lush Foliage
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(x + 8, y + 4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(x + 7, y + 2, 5, 0, Math.PI * 2);
  ctx.fill();
}

let healEffectTimer = 0;

/**
 * Trigger dynamic heal particles & light sequencer on canvas 2D
 */
export function triggerHealAnimation() {
  healEffectTimer = 60;
}

/**
 * Animated elements:
 * - Nurse Mira avatar sprite behind counter with breathing idle
 * - Companion Chansey avatar sprite with Lucky Egg
 * - Healing machine 6 Pokéballs light sequencer
 * - PC CRT screen flicker
 */
export function renderReceptionAnimations(ctx: CanvasRenderingContext2D, now: number) {
  const tick = Math.floor(now / 100);

  // 1. Nurse Mira Avatar Sprite at (x: 7, y: 3)
  const mx = 7 * TILE_SIZE;
  const my = 3 * TILE_SIZE;
  const breathe = Math.sin(now * 0.004) * 1.0;

  // Mira Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(mx + 2, my + 13, 12, 3);

  // White Nurse Uniform Body
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(mx + 3, my + 8 + breathe, 10, 8);
  // Red Cross on apron
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(mx + 6, my + 10 + breathe, 4, 1.5);
  ctx.fillRect(mx + 7.2, my + 9 + breathe, 1.5, 3.5);

  // Head & Skin
  ctx.fillStyle = '#fedbb7';
  ctx.fillRect(mx + 4, my + 2 + breathe, 8, 7);

  // Cute Pink Hair (Classic Nurse Joy style)
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(mx + 2, my + 1 + breathe, 12, 4);
  ctx.fillRect(mx + 2, my + 5 + breathe, 3, 5);
  ctx.fillRect(mx + 11, my + 5 + breathe, 3, 5);

  // Nurse Cap with Red Emblem
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mx + 4, my - 2 + breathe, 8, 4);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(mx + 7, my - 1 + breathe, 2, 2);

  // Eyes & Smile
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(mx + 5, my + 5 + breathe, 1.5, 2);
  ctx.fillRect(mx + 9, my + 5 + breathe, 1.5, 2);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(mx + 7, my + 8 + breathe, 2, 1);

  // Headset microphone
  ctx.fillStyle = '#334155';
  ctx.fillRect(mx + 2, my + 4 + breathe, 2, 4);
  ctx.fillRect(mx + 3, my + 8 + breathe, 3, 1);

  // 2. Companion Chansey Avatar Sprite at (x: 9, y: 3)
  const cx = 9 * TILE_SIZE;
  const cy = 3 * TILE_SIZE;
  const chanseyBob = Math.sin(now * 0.005) * 1.0;

  // Chansey Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(cx + 1, cy + 13, 14, 3);

  // Rounded Egg Body in soft pink
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(cx + 8, cy + 8 + chanseyBob, 6.5, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#db2777';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Head tufts/appendages (left & right)
  ctx.fillStyle = '#db2777';
  ctx.fillRect(cx + 1, cy + 2 + chanseyBob, 2, 2);
  ctx.fillRect(cx - 1, cy + 4 + chanseyBob, 2, 2);
  ctx.fillRect(cx + 13, cy + 2 + chanseyBob, 2, 2);
  ctx.fillRect(cx + 15, cy + 4 + chanseyBob, 2, 2);

  // Belly Pouch (soft cream-pink)
  ctx.fillStyle = '#fce7f3';
  ctx.beginPath();
  ctx.arc(cx + 8, cy + 10 + chanseyBob, 4, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#db2777';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Lucky Egg in Pouch
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx + 8, cy + 8.5 + chanseyBob, 3, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Cheerful Eyes & Rosy Cheeks
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx + 5, cy + 5 + chanseyBob, 2, 1);
  ctx.fillRect(cx + 9, cy + 5 + chanseyBob, 2, 1);
  ctx.fillStyle = '#fb7185';
  ctx.fillRect(cx + 4, cy + 6 + chanseyBob, 2, 1);
  ctx.fillRect(cx + 10, cy + 6 + chanseyBob, 2, 1);
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(cx + 7, cy + 7 + chanseyBob, 2, 1);

  // Stubby Arms & Feet
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(cx + 1, cy + 8 + chanseyBob, 2, 2);
  ctx.fillRect(cx + 13, cy + 8 + chanseyBob, 2, 2);
  ctx.fillRect(cx + 4, cy + 14, 3, 2);
  ctx.fillRect(cx + 9, cy + 14, 3, 2);

  // If healing is active, Chansey sparkles!
  if (healEffectTimer > 0) {
    ctx.fillStyle = (tick % 4 < 2) ? '#fde047' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx + 8, cy + 2 + chanseyBob, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Healing Machine 6-Pokéball Light Sequencer
  const hmX = 10 * TILE_SIZE;
  const hmY = 2 * TILE_SIZE;
  const ballSlotPositions = [
    { x: hmX + 8, y: hmY + 12 },
    { x: hmX + 24, y: hmY + 12 },
    { x: hmX + 40, y: hmY + 12 },
    { x: hmX + 8, y: hmY + 22 },
    { x: hmX + 24, y: hmY + 22 },
    { x: hmX + 40, y: hmY + 22 },
  ];

  const isHealBurst = healEffectTimer > 0;
  const activeSlot = isHealBurst ? Math.floor((60 - healEffectTimer) / 10) : tick % 8;

  for (let i = 0; i < ballSlotPositions.length; i++) {
    const slot = ballSlotPositions[i];
    const isLit = isHealBurst ? true : (i <= activeSlot && activeSlot < 6);

    // Pokéball sphere
    ctx.fillStyle = isLit ? (isHealBurst ? '#fde047' : '#ef4444') : '#94a3b8';
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 4, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = isLit ? '#ffffff' : '#cbd5e1';
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 4, 0, Math.PI);
    ctx.fill();

    // Center glowing ring
    ctx.fillStyle = isLit ? '#38bdf8' : '#334155';
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 1.5, 0, Math.PI * 2);
    ctx.fill();

    if (isLit) {
      // Glow aura
      ctx.fillStyle = isHealBurst ? 'rgba(253, 224, 71, 0.45)' : 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, isHealBurst ? 8 : 6.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Floating Heart & Sparkle Particles during heal burst
  if (healEffectTimer > 0) {
    const healProgress = (60 - healEffectTimer) / 60;
    const alpha = Math.max(0, 1 - healProgress);

    // Heart particle 1
    const p1Y = hmY + 10 - healProgress * 24;
    const p1X = hmX + 16 + Math.sin(healProgress * 6) * 6;
    ctx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p1X - 2, p1Y, 3, 0, Math.PI * 2);
    ctx.arc(p1X + 2, p1Y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Star sparkle 2
    const p2Y = hmY + 12 - healProgress * 28;
    const p2X = hmX + 32 + Math.cos(healProgress * 6) * 6;
    ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
    ctx.fillRect(p2X - 2, p2Y - 2, 4, 4);

    // Floating text banner
    drawPixelText(ctx, 'HEALED! 10 BALLS', hmX + 2, hmY - 6, '#22c55e');

    healEffectTimer--;
  }

  // 4. PC CRT Monitor Screen Flicker & Scanline
  const pcX = 13 * TILE_SIZE;
  const pcY = 4 * TILE_SIZE;
  const pcFlicker = (tick % 4 === 0) ? 'rgba(56, 189, 248, 0.95)' : 'rgba(2, 132, 199, 0.9)';
  ctx.fillStyle = pcFlicker;
  ctx.fillRect(pcX + 4, pcY + 4, 8, 7);
  // Scanline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  const scanY = pcY + 4 + (tick % 6);
  ctx.fillRect(pcX + 4, scanY, 8, 1);
}
