import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';
import type { PokemonPMDAnimator } from './pokemonPMDAnimator';
import {
  DARK_INTERIOR_COLS,
  DARK_INTERIOR_ROWS,
  DARK_INTERIOR_SPAWN,
  createDarkInteriorBaseCollision,
  getAbyssalSeals,
  type DarkInteriorProp,
} from './darkInteriorShared';

export const MANOR_COLS = DARK_INTERIOR_COLS;
export const MANOR_ROWS = DARK_INTERIOR_ROWS;
export const MANOR_SPAWN = DARK_INTERIOR_SPAWN;

export const MANOR_PROPS: DarkInteriorProp[] = [
  {
    id: 'darkrai',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'darkrai' },
    label: '🌑 Darkrai',
    style: 'darkrai',
    labelLift: 20,
    hint: 'Challenge Darkrai in Shadow Logic Trial ⚔️',
  },
  {
    id: 'darkrai-throne',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'darkrai-throne' },
    label: '👑 Obsidian Throne',
    style: 'throne',
    labelLift: 22,
    hint: 'Inspect Nightmare Sovereign Throne 🩸',
  },
  {
    id: 'bug-gallery-1',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'bug-gallery-1' },
    label: '🖼️ Phantom Bug',
    style: 'portrait',
    labelLift: 12,
    hint: 'Inspect Floating-Point Phantom Exhibit 🐞',
  },
  {
    id: 'bug-gallery-2',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'bug-gallery-2' },
    label: '🖼️ Ouroboros Art',
    style: 'portrait',
    labelLift: 12,
    hint: 'Inspect Render Ouroboros Exhibit ♾️',
  },
  {
    id: 'giratina',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'giratina' },
    label: '🐉 Giratina',
    style: 'giratina',
    labelLift: 18,
    hint: 'Consult Distortion Rift Arbiter 🟣',
  },
  {
    id: 'urshifu',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'urshifu' },
    label: '🥋 Urshifu',
    style: 'urshifu',
    labelLift: 18,
    hint: 'Train with Martial Sentinel Urshifu & Cast Valor Ward 🥋',
  },
  {
    id: 'crimson-altar',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'crimson-altar' },
    label: '⚔️ Duel Altar',
    style: 'altar',
    labelLift: 16,
    hint: 'Begin Tactical Scenario Duel ⚔️',
  },
  {
    id: 'blood-fireplace',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'blood-fireplace' },
    label: '🔥 Crimson Hearth',
    style: 'fireplace',
    labelLift: 10,
    hint: 'Warm by the Demonic Blue-Crimson Hearth 🔥',
  },
  {
    id: 'demon-crenellations',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'demon-crenellations' },
    label: '🦇 Gargoyle Perch',
    style: 'gargoyle',
    labelLift: 10,
    hint: 'Inspect Valor Relic & Gargoyle Warder 🦇',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'dark-castle' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

export function createManorCollision(): Uint8Array {
  const coll = createDarkInteriorBaseCollision();
  const w = MANOR_COLS;

  // Row 2: Obsidian Tribune (x: 6..8) blocked; x=1..5 and x=9..13 remain walkable
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // NW Wing: Floating-Point Phantom Exhibit (x: 1..2, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // NE Wing: Infinite Ouroboros Exhibit (x: 12..13, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SW Wing: Crimson Hearth Fireplace (x: 1..2, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SE Wing: Gargoyle Perch & Valor Relic Strongbox (x: 12..13, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // 4 Abyssal Torch Braziers framing the Sunken Duel Pit
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  // West Plinth: Giratina (2, 6) & East Plinth: Urshifu (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Center Duel Altar (7, 6)
  coll[6 * w + 7] = 1;

  return coll;
}

export const MANOR_COLLISION = createManorCollision();

// Interactive Shadow Shockwave FX Queue
interface ManorShadowWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  text: string;
  alpha: number;
}

const activeManorWaves: ManorShadowWave[] = [];

export function triggerManorShadowWave(
  text = 'NIGHTMARE COUNTERED! ⚔️',
  color = '#ef4444'
) {
  activeManorWaves.push({
    x: 7.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    radius: 5,
    maxRadius: 72,
    color,
    text,
    alpha: 1,
  });
}

// Crimson Gothic & Imperial Onyx Palette
const C_FLOOR_A = '#27121a';     // Burgundy-Obsidian Flagstone
const C_FLOOR_B = '#301721';     // Warm Crimson-Slate Tile
const C_PIT_A = '#180a10';       // Deep Sunken Duel Slate
const C_PIT_B = '#200e16';       // Shaded Sunken Duel Tile
const C_WALL_DARK = '#11060b';   // Midnight Crimson Stone
const C_WALL_MID = '#2a121b';    // Ashlar Gothic Masonry
const C_WALL_LIGHT = '#451a27';  // Bevel Highlight
const C_GOLD_DARK = '#78350f';   // Aged Bronze
const C_GOLD = '#f59e0b';        // Imperial Gold
const C_GOLD_LIGHT = '#fef08a';
const C_CRIMSON = '#7f1d1d';     // Scarlet Velvet Runner
const C_CRIMSON_ALT = '#991b1b';

let cachedManorBg: HTMLCanvasElement | null = null;

function createManorBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = MANOR_COLS * TILE_SIZE;  // 240 px
  canvas.height = MANOR_ROWS * TILE_SIZE; // 192 px
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const w = MANOR_COLS;
  const h = MANOR_ROWS;

  // 1. BURGUNDY-OBSIDIAN MARBLE FLOORING (Rows 2..11)
  for (let r = 2; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? C_FLOOR_A : C_FLOOR_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Stone bevel & dark mortar seams
      ctx.fillStyle = 'rgba(252, 165, 165, 0.08)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 1, TILE_SIZE);
      ctx.fillStyle = 'rgba(7, 2, 5, 0.55)';
      ctx.fillRect(c * TILE_SIZE, (r + 1) * TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect((c + 1) * TILE_SIZE - 1, r * TILE_SIZE, 1, TILE_SIZE);

      if ((r * 5 + c * 13) % 7 === 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.fillRect(c * TILE_SIZE + 5, r * TILE_SIZE + 6, 3, 1);
      }
    }
  }

  // 2. IMPERIAL SCARLET VELVET RUNNER FROM SOUTH ARCH (x: 6..8, y: 9..11)
  for (let r = 9; r < h; r++) {
    for (let c = 6; c <= 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_CRIMSON : C_CRIMSON_ALT;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      ctx.fillRect(c * TILE_SIZE + 6, r * TILE_SIZE + 6, 4, 4);
      if (c === 6) {
        ctx.fillStyle = C_GOLD;
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 2, TILE_SIZE);
      }
      if (c === 8) {
        ctx.fillStyle = C_GOLD;
        ctx.fillRect((c + 1) * TILE_SIZE - 2, r * TILE_SIZE, 2, TILE_SIZE);
      }
    }
  }

  // 3. CENTRAL SUNKEN NIGHTMARE DUEL PIT (x: 4..10, y: 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;

  // Chiseled Obsidian & Crimson-Gold Parapet Curb
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(pitX - 4, pitY - 4, pitW + 8, pitH + 8);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(pitX - 3, pitY - 3, pitW + 6, pitH + 6);
  ctx.fillStyle = '#d6b68a'; // Polished marble edge trim
  ctx.fillRect(pitX - 1, pitY - 1, pitW + 2, pitH + 2);

  for (let r = 4; r <= 9; r++) {
    for (let c = 4; c <= 10; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_PIT_A : C_PIT_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.06)';
      ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 3, 4, 1);
    }
  }

  // Inner sunken curb shadow
  ctx.fillStyle = 'rgba(5, 2, 4, 0.48)';
  ctx.fillRect(pitX, pitY, pitW, 3);
  ctx.fillRect(pitX, pitY, 3, pitH);

  // Orthogonal Blood-Gold Duel Conduits & Nightmare Sigil Ring
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(cx - 2, pitY + 2, 4, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 2, pitW - 4, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx - 1, pitY + 2, 2, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 1, pitW - 4, 2);

  // Engraved Crimson & Violet Duel Circle
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 34, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(168, 85, 247, 0.32)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 23, 0, Math.PI * 2);
  ctx.stroke();

  // Center Duel Altar Medallion Base (x=7, y=6)
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. NORTH GOTHIC CITADEL WALL, ROSE WINDOWS & BANNERS (y: 0..1)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  ctx.fillStyle = C_WALL_MID;
  for (let wy = 2; wy < 2 * TILE_SIZE - 4; wy += 6) {
    const shift = (wy / 6) % 2 === 0 ? 0 : 7;
    for (let wx = TILE_SIZE + shift; wx < canvas.width - TILE_SIZE - 8; wx += 14) {
      ctx.fillRect(wx, wy, 12, 5);
      ctx.fillStyle = C_WALL_LIGHT;
      ctx.fillRect(wx, wy, 12, 1);
      ctx.fillStyle = C_WALL_MID;
    }
  }

  // Twin Gothic Crimson Stained-Glass Lancet Windows (Cols 2 & 12)
  for (const wx of [2 * TILE_SIZE, 12 * TILE_SIZE]) {
    ctx.fillStyle = '#090306';
    ctx.fillRect(wx + 1, 6, 14, 22);
    ctx.beginPath();
    ctx.arc(wx + 8, 9, 7, Math.PI, 0, false);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(wx + 3, 9, 10, 17);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(wx + 7, 10, 2, 14);
    ctx.fillRect(wx + 4, 15, 8, 2);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(wx + 7, 2, 2, 3);
  }

  // Twin Scarlet Imperial Coat-of-Arms Banners (Cols 4 & 10)
  for (const bx of [3 * TILE_SIZE + 12, 10 * TILE_SIZE + 6]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx - 1, 4, 12, 2);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(bx, 6, 10, 18);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx + 1, 6, 1, 18);
    ctx.fillRect(bx + 8, 6, 1, 18);
    // Sword crest inside banner
    ctx.fillRect(bx + 4, 9, 2, 10);
    ctx.fillRect(bx + 2, 15, 6, 2);
    // Fringe
    ctx.fillRect(bx, 24, 3, 2);
    ctx.fillRect(bx + 7, 24, 3, 2);
  }

  // Four Fluted Obsidian & Gold Columns along North Wall
  for (const px of [1 * TILE_SIZE + 2, 5 * TILE_SIZE + 2, 9 * TILE_SIZE + 2, 13 * TILE_SIZE + 2]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 2, 12, 3);
    ctx.fillStyle = '#331520';
    ctx.fillRect(px, 5, 10, 23);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(px + 2, 5, 1.5, 23);
    ctx.fillRect(px + 5, 5, 2, 23);
    ctx.fillRect(px + 8, 5, 1, 23);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 28, 12, 3);
  }

  // North Cornice Moulding
  ctx.fillStyle = C_GOLD_DARK;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 3);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 1);

  // 5. OBSIDIAN NIGHTMARE THRONE & IMPERIAL TRIBUNE (x: 6..8, y: 1..2)
  drawNightmareThroneAndTribune(ctx, 6 * TILE_SIZE, 1 * TILE_SIZE);

  // 6. PERIMETER WALLS (West, East, South)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(0, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE + 8, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);

  for (let y = 2; y < 11; y++) {
    ctx.fillStyle = y % 2 === 0 ? C_WALL_MID : C_WALL_LIGHT;
    ctx.fillRect(2, y * TILE_SIZE + 2, 12, 12);
    ctx.fillRect(canvas.width - 14, y * TILE_SIZE + 2, 12, 12);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(14, y * TILE_SIZE, 1, TILE_SIZE);
    ctx.fillRect(canvas.width - 15, y * TILE_SIZE, 1, TILE_SIZE);
  }

  // 7. FOUR GOTHIC CORNER INSTALLATIONS
  drawPhantomExhibit(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawOuroborosExhibit(ctx, 12 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawCrimsonHearthBase(ctx, 1 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawGargoylePerchBase(ctx, 12 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. PIT-SIDE SENTINEL PLINTHS: GIRATINA (2,6) & SHADOW UMBREON (12,6)
  drawSentinelPlinth(ctx, 2 * TILE_SIZE, 6 * TILE_SIZE, '#a855f7');
  drawSentinelPlinth(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, '#f59e0b');

  // 9. FOUR ABYSSAL TORCH BRAZIER BASES
  for (const b of [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ]) {
    drawAbyssalBrazierBase(ctx, b.x, b.y);
  }

  // 10. GRAND SOUTH ARCHWAY EXIT THRESHOLD (x: 6..8, y: 11)
  ctx.fillStyle = C_GOLD_DARK;
  ctx.fillRect(6 * TILE_SIZE + 8, 11 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = C_CRIMSON;
  ctx.fillRect(6 * TILE_SIZE + 10, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 4, 12);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 12, 11 * TILE_SIZE + 3, 2 * TILE_SIZE - 8, 1);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE + 8, 11 * TILE_SIZE + 6, C_GOLD_LIGHT, 1, 'center');

  return canvas;
}

function drawNightmareThroneAndTribune(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Jagged obsidian spiked backrest spanning y=1..2
  ctx.fillStyle = '#07030a';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 26);
  ctx.lineTo(x + 8, y + 4);
  ctx.lineTo(x + 15, y);
  ctx.lineTo(x + 24, y + 5);
  ctx.lineTo(x + 33, y);
  ctx.lineTo(x + 40, y + 4);
  ctx.lineTo(x + 40, y + 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Crimson diamond crest in throne center
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 22, y + 7, 4, 5);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(x + 23, y + 8, 2, 2);

  // Stepped Tribune Platform at y=2 (row 2 = y + 16)
  const ty = y + TILE_SIZE;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(x, ty + 3, 3 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#331c24';
  ctx.fillRect(x, ty, 3 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 8, ty, 3 * TILE_SIZE - 16, TILE_SIZE - 2);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 8, ty, 2, TILE_SIZE - 2);
  ctx.fillRect(x + 3 * TILE_SIZE - 10, ty, 2, TILE_SIZE - 2);
  ctx.fillRect(x + 8, ty + TILE_SIZE - 3, 3 * TILE_SIZE - 16, 2);
}

function drawPhantomExhibit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Museum Plinth & Carved Red Velvet Frame
  ctx.fillStyle = '#27121a';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 3, y + 3, w - 6, h - 10);

  // Inside Painting: Phantom IEEE 754 Bug Bars
  ctx.fillStyle = '#09040b';
  ctx.fillRect(x + 4, y + 4, w - 8, h - 12);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(x + 6, y + 8, 6, 2);
  ctx.fillRect(x + 14, y + 8, 4, 2);
  ctx.fillStyle = '#f87171';
  ctx.fillRect(x + 20, y + 8, 6, 2);
  ctx.fillRect(x + 8, y + 13, 16, 2);

  // Brass Stanchion Plaque at Bottom
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 6, y + h - 6, w - 12, 4);
  ctx.fillStyle = C_GOLD_LIGHT;
  ctx.fillRect(x + 8, y + h - 5, w - 16, 2);
}

function drawOuroborosExhibit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  ctx.fillStyle = '#27121a';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 3, y + 3, w - 6, h - 10);

  // Dark Canvas Backdrop
  ctx.fillStyle = '#09040b';
  ctx.fillRect(x + 4, y + 4, w - 8, h - 12);

  // Brass Archive Plaque at Bottom
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 6, y + h - 6, w - 12, 4);
  ctx.fillStyle = C_GOLD_LIGHT;
  ctx.fillRect(x + 8, y + h - 5, w - 16, 2);
}

function drawCrimsonHearthBase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Gothic Carved Stone Fireplace Mantle
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 1, y, w - 2, h);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 3, y + 2, w - 6, h - 4);

  // Mantle Crown & Crimson Crest
  ctx.fillStyle = C_GOLD_DARK;
  ctx.fillRect(x + 2, y + 2, w - 4, 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 13, y + 2, 6, 3);

  // Dark Hearth Firebox
  ctx.fillStyle = '#050205';
  ctx.fillRect(x + 6, y + 9, w - 12, h - 13);

  // Firewood Logs inside Hearth
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 8, y + h - 7, 16, 3);
  ctx.fillRect(x + 10, y + h - 9, 12, 2);
}

function drawGargoylePerchBase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Granite Citadel Pedestal
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 2, y + 2, w - 4, 2);

  // Chiseled Stone Winged Gargoyle Silhouette
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 9, y + 6, 14, 14);
  // Crown horns
  ctx.fillRect(x + 8, y + 3, 3, 4);
  ctx.fillRect(x + 21, y + 3, 3, 4);
  // Folded jagged bat-wings
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(x + 9, y + 10);
  ctx.lineTo(x + 2, y + 4);
  ctx.lineTo(x + 6, y + 15);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 23, y + 10);
  ctx.lineTo(x + 30, y + 4);
  ctx.lineTo(x + 26, y + 15);
  ctx.closePath();
  ctx.fill();

  // Crimson Valor Chest Strip below Gargoyle
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x + 5, y + 22, w - 10, 7);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 14, y + 23, 4, 4);
}

function drawSentinelPlinth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x, y + 3, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#331520';
  ctx.fillRect(x + 1, y + 2, TILE_SIZE - 2, TILE_SIZE - 3);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 2, y + 3, TILE_SIZE - 4, TILE_SIZE - 5);
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 3, y + 4, TILE_SIZE - 6, 2);
}

function drawAbyssalBrazierBase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 14, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 4, y + 9, 8, 5);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(x + 2, y + 6, 12, 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 6, 12, 1);
}

function drawUrshifuLoadingFallback(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  const bob = Math.sin(tick * 0.1) * 1;
  const py = Math.round(y + bob);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 3, y + 13, 10, 2);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 4, py + 4, 8, 9);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 5, py + 2, 6, 2);
}

const SHADOW_EMBERS = Array.from({ length: 14 }, (_, i) => ({
  x: 16 + ((i * 31) % 208),
  y: 36 + ((i * 23) % 136),
  speed: 0.16 + (i % 4) * 0.05,
  phase: i * 1.2,
  color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#fbbf24' : '#c084fc',
}));

export function renderManorScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator
) {
  if (!cachedManorBg && typeof document !== 'undefined') {
    cachedManorBg = createManorBackgroundCanvas();
  }

  if (cachedManorBg) {
    ctx.drawImage(cachedManorBg, 0, 0);
  }

  const seals = getAbyssalSeals();
  const isUnlocked = seals.valor;

  // 1. ANIMATED NE OUROBOROS CANVAS SYMBOL (x: 12..13, y: 3..4)
  const oX = 12 * TILE_SIZE + 16;
  const oY = 3 * TILE_SIZE + 12;
  ctx.save();
  ctx.translate(oX, oY);
  ctx.rotate(tick * 0.04);
  ctx.strokeStyle = isUnlocked ? '#4ade80' : '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-3.5, 0, 3.2, 0, Math.PI * 2);
  ctx.arc(3.5, 0, 3.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. SW DEMONIC CRIMSON-BLUE HEARTH FLAMES (x: 1..2, y: 8..9)
  const fx = 1 * TILE_SIZE;
  const fy = 8 * TILE_SIZE;
  const hearthGlow = ctx.createRadialGradient(fx + 16, fy + 20, 2, fx + 16, fy + 20, 22);
  hearthGlow.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
  hearthGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = hearthGlow;
  ctx.beginPath();
  ctx.arc(fx + 16, fy + 20, 22, 0, Math.PI * 2);
  ctx.fill();

  const flickerH = Math.sin(tick * 0.22) * 1.5;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(fx + 10, fy + 16 + Math.round(flickerH), 12, 7);
  ctx.fillStyle = '#38bdf8'; // Spectral blue core
  ctx.fillRect(fx + 13, fy + 18, 6, 5);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(fx + 14, fy + 20, 4, 3);

  // 3. SE GARGOYLE GLOWING RUBY EYES (x: 12..13, y: 8..9)
  const gx = 12 * TILE_SIZE;
  const gy = 8 * TILE_SIZE;
  ctx.fillStyle = isUnlocked ? '#22c55e' : tick % 20 < 14 ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(gx + 12, gy + 11, 2, 2);
  ctx.fillRect(gx + 18, gy + 11, 2, 2);

  // 4. FOUR FLICKERING ABYSSAL TORCH BRAZIERS
  const braziers = [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ];
  braziers.forEach((b, idx) => {
    const flicker = Math.sin(tick * 0.24 + idx * 1.5) * 1.5;
    const glowR = 16 + Math.sin(tick * 0.14 + idx) * 3;
    const grad = ctx.createRadialGradient(b.x + 8, b.y + 5, 2, b.x + 8, b.y + 5, glowR);
    grad.addColorStop(0, isUnlocked ? 'rgba(251, 191, 36, 0.42)' : 'rgba(239, 68, 68, 0.42)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x + 8, b.y + 5, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isUnlocked ? '#d97706' : '#dc2626';
    ctx.fillRect(b.x + 4, b.y + 2 + Math.round(flicker * 0.4), 8, 4);
    ctx.fillRect(b.x + 5, b.y + Math.round(flicker * 0.6), 6, 3);
    ctx.fillStyle = isUnlocked ? '#fef08a' : '#f97316';
    ctx.fillRect(b.x + 5, b.y + 3, 6, 3);
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(b.x + 6, b.y + 2 + Math.round(flicker * 0.3), 4, 2);
  });

  // 5. CENTERPIECE DUEL ALTAR (x: 7, y: 6)
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  const bladeBob = Math.sin(tick * 0.08) * 1.5;

  const altGlow = ctx.createRadialGradient(cx, cy - 2, 2, cx, cy - 2, 16);
  altGlow.addColorStop(0, isUnlocked ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.38)');
  altGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = altGlow;
  ctx.beginPath();
  ctx.arc(cx, cy - 2, 16, 0, Math.PI * 2);
  ctx.fill();

  // Floating crossed crimson blades or emerald Seal of Valor gem
  ctx.save();
  ctx.translate(cx, cy - 3 + bladeBob);
  ctx.strokeStyle = isUnlocked ? '#4ade80' : '#f87171';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-5, -5);
  ctx.lineTo(5, 5);
  ctx.moveTo(5, -5);
  ctx.lineTo(-5, 5);
  ctx.stroke();
  ctx.fillStyle = isUnlocked ? '#fde047' : '#ef4444';
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();

  // 6. THREE GUARDIAN SENTINELS (Darkrai PMD, Giratina PMD & Shadow Umbreon)
  // A) Sovereign Darkrai on North Imperial Tribune (7, 2)
  const dX = 7 * TILE_SIZE + 8;
  const dY = 2 * TILE_SIZE + 14;
  const dHover = Math.sin(tick * 0.06) * 1.5;

  const dAura = 12 + Math.sin(tick * 0.08) * 2;
  ctx.strokeStyle = isUnlocked ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dX, dY - 6 + dHover, dAura, 0, Math.PI * 2);
  ctx.stroke();

  const darkraiPmd = pmdAnimator?.draw(ctx, 'darkrai', 'idle', 'down', dX, dY + dHover * 0.5, tick, 0.95);
  if (!darkraiPmd) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(dX - 6, dY - 14 + dHover, 12, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(dX - 4, dY - 10 + dHover, 8, 2);
  }

  // Orbiting Nightmare Orbs
  for (let i = 0; i < 3; i++) {
    const ang = tick * 0.055 + (i * Math.PI * 2) / 3;
    ctx.fillStyle = isUnlocked ? '#4ade80' : i % 2 === 0 ? '#ef4444' : '#a855f7';
    ctx.fillRect(
      Math.round(dX + Math.cos(ang) * 13 - 1),
      Math.round(dY - 6 + dHover + Math.sin(ang) * 5 - 1),
      2,
      2
    );
  }

  // B) Distortion Rift Guardian Giratina on West Plinth (2, 6)
  const gX = 2 * TILE_SIZE + 8;
  const gY = 6 * TILE_SIZE + 14;
  const gHover = Math.sin(tick * 0.07) * 1.5;

  const giratinaPmd = pmdAnimator?.draw(ctx, 'giratina', 'idle', 'right', gX, gY + gHover * 0.4, tick, 0.85);
  if (!giratinaPmd) {
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(gX - 6, gY - 14 + gHover, 12, 12);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(gX - 4, gY - 12 + gHover, 8, 2);
  }

  // C) Martial Sentinel Urshifu on East Plinth (12, 6)
  const urshifuPmd = pmdAnimator?.draw(
    ctx,
    'urshifu',
    'idle',
    'down',
    12 * TILE_SIZE + 8,
    6 * TILE_SIZE + 14,
    tick,
    0.78
  );
  if (!urshifuPmd) {
    drawUrshifuLoadingFallback(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, tick);
  }

  // 7. FLOATING CRIMSON-VIOLET SHADOW EMBERS
  ctx.save();
  for (const p of SHADOW_EMBERS) {
    const py = (p.y - tick * p.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = p.x + Math.sin(tick * 0.045 + p.phase) * 4;
    const alpha = 0.28 + 0.3 * Math.sin(tick * 0.09 + p.phase);

    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 2, 2);
  }
  ctx.restore();

  // 8. ACTIVE SHADOW DUEL SHOCKWAVES
  ctx.save();
  for (let i = activeManorWaves.length - 1; i >= 0; i--) {
    const wave = activeManorWaves[i];
    wave.radius += 2.4;
    wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

    ctx.strokeStyle = wave.color;
    ctx.globalAlpha = wave.alpha;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, Math.max(1, wave.radius * 0.65), 0, Math.PI * 2);
    ctx.stroke();

    if (wave.alpha > 0.2) {
      drawPixelText(
        ctx,
        wave.text,
        Math.floor(wave.x),
        Math.floor(wave.y - 18 - (1 - wave.alpha) * 14),
        '#fef08a',
        1,
        'center'
      );
    }

    if (wave.radius >= wave.maxRadius) {
      activeManorWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
