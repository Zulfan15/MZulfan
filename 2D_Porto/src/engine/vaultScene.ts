import { TILE_SIZE } from './sprites';
import { DIALGA_IMAGE_SRC } from './dialgaSprite';
import { drawPixelText } from './devScene';
import type { PokemonPMDAnimator } from './pokemonPMDAnimator';
import { getDigimonById } from './digimonCatalog';
import { requestDigimonSprites, selectDigimonOverworldFrame } from './digiSpriteLoader';
import {
  DARK_INTERIOR_COLS,
  DARK_INTERIOR_ROWS,
  DARK_INTERIOR_SPAWN,
  createDarkInteriorBaseCollision,
  getAbyssalSeals,
  type DarkInteriorProp,
} from './darkInteriorShared';

export const VAULT_COLS = DARK_INTERIOR_COLS;
export const VAULT_ROWS = DARK_INTERIOR_ROWS;
export const VAULT_SPAWN = DARK_INTERIOR_SPAWN;

export const VAULT_PROPS: DarkInteriorProp[] = [
  {
    id: 'dialga',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'dialga' },
    label: '👑 Dialga',
    style: 'dialga',
    labelLift: 20,
    hint: 'Commune with Time Warden Dialga 💎',
  },
  {
    id: 'clockwork-face',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'clockwork-face' },
    label: '⏳ Chronometer',
    style: 'clockwork',
    labelLift: 22,
    hint: 'Synchronize the 4 Gears ⚙️',
  },
  {
    id: 'gear-pedestal-1',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'gear-pedestal-1' },
    label: '⚙️ Sun Foundry',
    style: 'gear',
    labelLift: 12,
    hint: 'Inspect NW Sun-Gear Foundry 🧭',
  },
  {
    id: 'gear-pedestal-2',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'gear-pedestal-2' },
    label: '⏱️ Crystal Loom',
    style: 'gear',
    labelLift: 12,
    hint: 'Inspect NE Escapement Crystal Loom ⚡',
  },
  {
    id: 'celebi',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'celebi' },
    label: '🌿 Celebi',
    style: 'celebi',
    labelLift: 16,
    hint: 'Consult Time-Travel Envoy Celebi 🌿',
  },
  {
    id: 'chronomon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'chronomon' },
    label: '🕰️ Chronomon',
    style: 'chronomon',
    labelLift: 18,
    hint: 'Consult Time-Keeper Chronomon DM 🕰️',
  },
  {
    id: 'time-capsule',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'time-capsule' },
    label: '🕰️ Astral Orrery',
    style: 'capsule',
    labelLift: 16,
    hint: 'Open Portfolio Time-Machine 📜',
  },
  {
    id: 'chrono-pendulum',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'chrono-pendulum' },
    label: '🔔 Horologe',
    style: 'pendulum',
    labelLift: 10,
    hint: 'Inspect Chronicle Library & Pendulum ⌛',
  },
  {
    id: 'temporal-coffer',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'temporal-coffer' },
    label: '🔐 Vault Safe',
    style: 'safe',
    labelLift: 10,
    hint: 'Requires Seal of Eternity 🔑',
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

export function createVaultCollision(): Uint8Array {
  const coll = createDarkInteriorBaseCollision();
  const w = VAULT_COLS;

  // Row 2: Imperial Chrono Tribune at x=6..8 is blocked; x=1..5 and x=9..13 remain walkable
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // NW Sun-Gear Brass Foundry (x: 1..2, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // NE Escapement Crystal Loom (x: 12..13, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SW Chronicle Library & Grandfather Horologe (x: 1..2, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SE Imperial Adamant Vault Safe (x: 12..13, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // 4 Corner Hourglass Braziers framing the Sunken Orrery Pit
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  // West Plinth: Celebi (2, 6) & East Plinth: Chronos Archivist (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Center Celestial Orrery & Time-Capsule Pedestal (7, 6)
  coll[6 * w + 7] = 1;

  return coll;
}

export const VAULT_COLLISION = createVaultCollision();

// Cached Dialga fallback image before PMD sprite finishes loading
let cachedDialgaImg: HTMLImageElement | null = null;
function getDialgaFallbackSprite(): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null;
  if (!cachedDialgaImg) {
    cachedDialgaImg = new Image();
    cachedDialgaImg.src = DIALGA_IMAGE_SRC;
  }
  return cachedDialgaImg.complete && cachedDialgaImg.naturalWidth > 0 ? cachedDialgaImg : null;
}

// Interactive Chrono Wave FX queue (triggered by clockwork shifts, unlocks & era warps)
interface VaultChronoWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  text: string;
  alpha: number;
}

const activeVaultWaves: VaultChronoWave[] = [];

export function triggerVaultChronoWave(
  text = 'TEMPORAL SHIFT +90° ⚙️',
  color = '#fbbf24'
) {
  activeVaultWaves.push({
    x: 7.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    radius: 5,
    maxRadius: 72,
    color,
    text,
    alpha: 1,
  });
}

// Royal Astral Sapphire & Antique Brass Palette
const C_MARBLE_A = '#1c273e';     // Polished Astral Slate-Sapphire
const C_MARBLE_B = '#23314d';     // Warm Sapphire-Cobalt Tile
const C_PIT_FLOOR_A = '#131d33';  // Deep Lapis-Lazuli Pit Tile
const C_PIT_FLOOR_B = '#17243f';  // Shimmer Lapis Pit Tile
const C_WALL_DARK = '#0d1322';    // Carved Midnight Stone
const C_WALL_MID = '#1e293b';     // Ashlar Masonry Slate
const C_WALL_LIGHT = '#334155';   // Bevel Highlight
const C_BRASS_DARK = '#78350f';   // Aged Bronze
const C_BRASS_MID = '#b45309';    // Antique Brass
const C_GOLD = '#f59e0b';         // Royal Gold
const C_GOLD_LIGHT = '#fef08a';   // Sunlit Gold
const C_RUNNER = '#31102f';       // Imperial Royal Plum-Indigo Velvet
const C_RUNNER_ALT = '#45123f';

let cachedVaultBg: HTMLCanvasElement | null = null;

function createVaultBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = VAULT_COLS * TILE_SIZE;  // 240 px
  canvas.height = VAULT_ROWS * TILE_SIZE; // 192 px
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const w = VAULT_COLS;
  const h = VAULT_ROWS;

  // 1. ROYAL ASTRAL SAPPHIRE MARBLE COLONNADE FLOOR (Rows 2..11)
  for (let r = 2; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? C_MARBLE_A : C_MARBLE_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Subtle gilded marble bevel & dark mortar seam
      ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 1, TILE_SIZE);
      ctx.fillStyle = 'rgba(7, 10, 20, 0.55)';
      ctx.fillRect(c * TILE_SIZE, (r + 1) * TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect((c + 1) * TILE_SIZE - 1, r * TILE_SIZE, 1, TILE_SIZE);

      // Mineral fleck
      if ((r * 7 + c * 11) % 6 === 0) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.09)';
        ctx.fillRect(c * TILE_SIZE + 5, r * TILE_SIZE + 7, 2, 2);
      }
    }
  }

  // 2. ROYAL IMPERIAL VELVET RUNNER FROM SOUTH ARCH (x: 6..8, y: 9..11)
  for (let r = 9; r < h; r++) {
    for (let c = 6; c <= 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_RUNNER : C_RUNNER_ALT;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      // Diamond velvet weave
      ctx.fillStyle = 'rgba(254, 240, 138, 0.07)';
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

  // 3. CENTRAL SUNKEN CELESTIAL ORRERY PIT (x: 4..10, y: 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;

  // Chiseled Bronze & Limestone Parapet Curb surrounding the Sunken Arena
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(pitX - 4, pitY - 4, pitW + 8, pitH + 8);
  ctx.fillStyle = C_BRASS_MID;
  ctx.fillRect(pitX - 3, pitY - 3, pitW + 6, pitH + 6);
  ctx.fillStyle = '#d6c29f'; // Carved marble rim
  ctx.fillRect(pitX - 1, pitY - 1, pitW + 2, pitH + 2);

  // Inside Pit: Lapis Lazuli Stone Tiles
  for (let r = 4; r <= 9; r++) {
    for (let c = 4; c <= 10; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_PIT_FLOOR_A : C_PIT_FLOOR_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 2, 3, 1);
    }
  }

  // Recessed shadow along N/W parapet edge
  ctx.fillStyle = 'rgba(5, 8, 18, 0.45)';
  ctx.fillRect(pitX, pitY, pitW, 3);
  ctx.fillRect(pitX, pitY, 3, pitH);

  // Orthogonal Brass Conduit Tracks (Clean N-S and E-W channels — zero diagonal lines!)
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(cx - 2, pitY + 2, 4, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 2, pitW - 4, 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(cx - 1, pitY + 2, 2, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 1, pitW - 4, 2);

  // Subtle Orthogonal Branch Channels to the 4 Station Quadrants
  ctx.fillStyle = C_BRASS_MID;
  ctx.fillRect(2 * TILE_SIZE, 4 * TILE_SIZE - 1, 2 * TILE_SIZE, 2); // NW Foundry feed
  ctx.fillRect(11 * TILE_SIZE, 4 * TILE_SIZE - 1, 2 * TILE_SIZE, 2); // NE Loom feed
  ctx.fillRect(2 * TILE_SIZE, 8 * TILE_SIZE + 8, 2 * TILE_SIZE, 2); // SW Horologe feed
  ctx.fillRect(11 * TILE_SIZE, 8 * TILE_SIZE + 8, 2 * TILE_SIZE, 2); // SE Vault Safe feed

  // Inlaid Golden Astrolabe Sundial Ring inside the Sunken Pit
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 34, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6;
    ctx.strokeStyle = i % 3 === 0 ? C_GOLD : '#475569';
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * 31, cy + Math.sin(ang) * 31);
    ctx.lineTo(cx + Math.cos(ang) * 35, cy + Math.sin(ang) * 35);
    ctx.stroke();
  }

  // Center Carved Brass & Sapphire Pedestal Ring under the Orrery (x=7, y=6)
  ctx.fillStyle = C_BRASS_DARK;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. NORTH IMPERIAL STONE WALL & ROSE WINDOWS (y = 0..1)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Ashlar Masonry Blocks
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

  // Twin Stained-Glass Astronomical Rose Alcoves (Cols 2 & 12)
  for (const ax of [2 * TILE_SIZE, 12 * TILE_SIZE]) {
    ctx.fillStyle = '#090d1a';
    ctx.fillRect(ax + 1, 6, 14, 22);
    ctx.beginPath();
    ctx.arc(ax + 8, 9, 7, Math.PI, 0, false);
    ctx.fill();

    // Glowing Sapphire & Amethyst Glass Tracery
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(ax + 3, 9, 10, 17);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ax + 7, 10, 2, 14);
    ctx.fillRect(ax + 4, 15, 8, 2);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(ax + 7, 2, 2, 3);
  }

  // Twin Imperial Sapphire & Gold Banners (Cols 4 & 10)
  for (const bx of [3 * TILE_SIZE + 12, 10 * TILE_SIZE + 6]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx - 1, 4, 12, 2);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(bx, 6, 10, 18);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx + 1, 6, 1, 18);
    ctx.fillRect(bx + 8, 6, 1, 18);
    // Hourglass crest inside banner
    ctx.fillRect(bx + 3, 10, 4, 2);
    ctx.fillRect(bx + 4, 12, 2, 2);
    ctx.fillRect(bx + 3, 14, 4, 2);
    // Fringe
    ctx.fillRect(bx, 24, 3, 2);
    ctx.fillRect(bx + 7, 24, 3, 2);
  }

  // Four Fluted Corinthian Brass Columns along North Wall
  for (const px of [1 * TILE_SIZE + 2, 5 * TILE_SIZE + 2, 9 * TILE_SIZE + 2, 13 * TILE_SIZE + 2]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 2, 12, 3);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px, 5, 10, 23);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px + 2, 5, 1.5, 23);
    ctx.fillRect(px + 5, 5, 2, 23);
    ctx.fillRect(px + 8, 5, 1, 23);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 28, 12, 3);
  }

  // North Cornice Trim
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 3);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 1);

  // 5. NORTH IMPERIAL CHRONO TRIBUNE FOR DIALGA (x: 6..8, y: 2)
  drawChronoTribune(ctx, 6 * TILE_SIZE, 2 * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE);

  // 6. PERIMETER STONE WALLS (West, East, South)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(0, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE + 8, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);

  // Chiseled Stone Wall Battlements on West & East Edges
  for (let y = 2; y < 11; y++) {
    ctx.fillStyle = y % 2 === 0 ? C_WALL_MID : C_WALL_LIGHT;
    ctx.fillRect(2, y * TILE_SIZE + 2, 12, 12);
    ctx.fillRect(canvas.width - 14, y * TILE_SIZE + 2, 12, 12);
    ctx.fillStyle = C_BRASS_MID;
    ctx.fillRect(14, y * TILE_SIZE, 1, TILE_SIZE);
    ctx.fillRect(canvas.width - 15, y * TILE_SIZE, 1, TILE_SIZE);
  }

  // 7. FOUR ORTHOGONAL HOROLOGICAL WORKSTATIONS IN CORNERS
  drawSunGearFoundry(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawEscapementLoom(ctx, 12 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawChronicleHorologe(ctx, 1 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawAdamantVaultSafe(ctx, 12 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. PIT-SIDE STONE PLINTHS FOR CELEBI (2,6) & CHRONOS ARCHIVIST (12,6)
  drawCharacterPlinth(ctx, 2 * TILE_SIZE, 6 * TILE_SIZE, '#10b981');
  drawCharacterPlinth(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, '#38bdf8');

  // 9. FOUR HOURGLASS BRAZIER BASES AT THE CORNERS OF THE SUNKEN ARENA
  for (const b of [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ]) {
    drawHourglassBrazierBase(ctx, b.x, b.y);
  }

  // 10. GRAND SOUTH ARCHWAY EXIT THRESHOLD (x: 6..8, y: 11)
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(6 * TILE_SIZE + 8, 11 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = C_RUNNER;
  ctx.fillRect(6 * TILE_SIZE + 10, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 4, 12);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 12, 11 * TILE_SIZE + 3, 2 * TILE_SIZE - 8, 1);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE + 8, 11 * TILE_SIZE + 6, C_GOLD_LIGHT, 1, 'center');

  return canvas;
}

function drawChronoTribune(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x, y + 3, w, h);

  // Stepped Sapphire-Marble Dais
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 2, y + h - 3, w - 4, 3);

  // Central Royal Sapphire Carpet
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x + 7, y, w - 14, h - 2);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 7, y, 2, h - 2);
  ctx.fillRect(x + w - 9, y, 2, h - 2);
  ctx.fillRect(x + 7, y + h - 3, w - 14, 2);

  // Flanking Small Brass Pedestal Columns on Tribune
  for (const px of [x + 1, x + w - 6]) {
    ctx.fillStyle = C_BRASS_MID;
    ctx.fillRect(px, y + 2, 5, 11);
    ctx.fillStyle = C_GOLD_LIGHT;
    ctx.fillRect(px + 1, y + 3, 3, 2);
  }
}

function drawSunGearFoundry(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Heavy Brass-Bound Oak Workbench Platform
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 2, w - 4, 2);

  // Copper Steam Boiler & Pressure Gauge (Top Right)
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(x + 19, y + 5, 9, 12);
  ctx.fillStyle = '#fb923c';
  ctx.fillRect(x + 21, y + 7, 5, 8);
  ctx.fillStyle = '#e0f2fe'; // Pressure dial glass
  ctx.fillRect(x + 21, y + 8, 5, 4);

  // Tool Rack & Precision Calipers (Bottom Right)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 19, y + 20, 8, 2);
  ctx.fillRect(x + 21, y + 22, 2, 6);
  ctx.fillRect(x + 25, y + 22, 2, 6);
}

function drawEscapementLoom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Carved Cobalt-Steel Chronograph Cabinet
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 2, y + 2, w - 4, 1);

  // Twin Crystal Oscillator Conduits on Top
  for (const cx of [x + 6, x + 22]) {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx, y + 5, 4, 18);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(cx + 1, y + 6, 2, 16);
  }
}

function drawChronicleHorologe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Stone Library Base
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#271206';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Left half: Mahogany Grandfather Clock Frame
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 3, y + 3, 13, h - 6);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 4, y + 3, 11, 2);

  // Right half: Stacked Chronicle Bookshelf & Scrolls
  ctx.fillStyle = '#1c1008';
  ctx.fillRect(x + 17, y + 4, 11, h - 8);
  // Colored leather tomes
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 18, y + 6, 2, 7);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x + 21, y + 6, 2, 7);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x + 24, y + 6, 3, 7);
  // Second shelf parchment scrolls
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 18, y + 17, 8, 3);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 19, y + 22, 7, 3);
}

function drawAdamantVaultSafe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Polished Onyx & Brass Relic Platform
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 2, w - 4, 1);

  // Corner brass rivets
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 3, y + 3, 2, 2);
  ctx.fillRect(x + w - 5, y + 3, 2, 2);
  ctx.fillRect(x + 3, y + h - 5, 2, 2);
  ctx.fillRect(x + w - 5, y + h - 5, 2, 2);
}

function drawCharacterPlinth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x, y + 3, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(x + 1, y + 2, TILE_SIZE - 2, TILE_SIZE - 3);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 2, y + 3, TILE_SIZE - 4, TILE_SIZE - 5);
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 3, y + 4, TILE_SIZE - 6, 2);
}

function drawHourglassBrazierBase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 14, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 4, y + 9, 8, 5);
  ctx.fillStyle = C_BRASS_DARK;
  ctx.fillRect(x + 2, y + 6, 12, 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 6, 12, 1);
}

const TIME_SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  x: 16 + ((i * 37) % 208),
  y: 36 + ((i * 29) % 136),
  speed: 0.14 + (i % 4) * 0.05,
  phase: i * 1.1,
  color: i % 3 === 0 ? '#7dd3fc' : i % 3 === 1 ? '#fde047' : '#a78bfa',
}));

export function renderVaultScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator
) {
  if (!cachedVaultBg && typeof document !== 'undefined') {
    cachedVaultBg = createVaultBackgroundCanvas();
  }

  if (cachedVaultBg) {
    ctx.drawImage(cachedVaultBg, 0, 0);
  }

  const seals = getAbyssalSeals();
  const isUnlocked = seals.eternity;

  // 1. GRAND WALL ASTRONOMICAL CHRONOMETER (Centered at North Wall: cx=120, cy=14)
  const clockX = 7.5 * TILE_SIZE;
  const clockY = 14;
  const clockR = 13;

  // Unlocked Celestial Halo
  if (isUnlocked) {
    const halo = ctx.createRadialGradient(clockX, clockY, 6, clockX, clockY, 26);
    halo.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(clockX, clockY, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer Forged Brass & Obsidian Face
  ctx.fillStyle = C_BRASS_DARK;
  ctx.beginPath();
  ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isUnlocked ? '#38bdf8' : C_GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#070a14';
  ctx.beginPath();
  ctx.arc(clockX, clockY, clockR - 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Animated Inner Skeleton Gear Teeth
  ctx.save();
  ctx.translate(clockX, clockY);
  ctx.rotate(isUnlocked ? tick * 0.04 : tick * 0.012);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.moveTo(-6, 0);
  ctx.lineTo(6, 0);
  ctx.moveTo(0, -6);
  ctx.lineTo(0, 6);
  ctx.stroke();
  ctx.restore();

  // Hour Ticks & Hands
  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6;
    ctx.fillStyle = i % 3 === 0 ? C_GOLD_LIGHT : '#64748b';
    ctx.fillRect(
      Math.round(clockX + Math.cos(ang) * 9 - 0.5),
      Math.round(clockY + Math.sin(ang) * 9 - 0.5),
      1.5,
      1.5
    );
  }
  const minAng = isUnlocked ? -Math.PI / 2 : -Math.PI / 2 + tick * 0.045;
  const hourAng = isUnlocked ? -Math.PI / 2 : -Math.PI / 2 + tick * 0.008;
  ctx.strokeStyle = isUnlocked ? '#38bdf8' : C_GOLD_LIGHT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(minAng) * 8, clockY + Math.sin(minAng) * 8);
  ctx.stroke();

  ctx.strokeStyle = '#fb923c';
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(hourAng) * 5.5, clockY + Math.sin(hourAng) * 5.5);
  ctx.stroke();

  // Adamant Diamond Crest at 12 o'clock
  ctx.fillStyle = isUnlocked ? '#7dd3fc' : '#38bdf8';
  ctx.fillRect(clockX - 1.5, clockY - 12, 3, 3);

  // 2. FOUR ANIMATED CORNER CLOCKWORK STATIONS
  // NW: Spinning 10-Tooth Brass Sun Gear on Foundry Bench (x: 1.5*16 + 2 = 25, y: 4*16 = 64)
  const nwX = 1 * TILE_SIZE + 9;
  const nwY = 4 * TILE_SIZE;
  ctx.save();
  ctx.translate(nwX, nwY);
  ctx.rotate(isUnlocked ? 0 : tick * 0.03);
  ctx.fillStyle = '#d97706';
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.fillRect(-1.5, -8, 3, 3);
    ctx.restore();
  }
  ctx.fillStyle = C_BRASS_DARK;
  ctx.beginPath();
  ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = isUnlocked ? '#38bdf8' : C_GOLD_LIGHT;
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // NE: Oscillating Sapphire Escapement Wheel (center x: 13*16, y: 4*16)
  const neX = 13 * TILE_SIZE;
  const neY = 4 * TILE_SIZE;
  ctx.save();
  ctx.translate(neX, neY);
  ctx.rotate(isUnlocked ? 0 : -tick * 0.045);
  ctx.strokeStyle = isUnlocked ? '#38bdf8' : '#7dd3fc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 7, Math.sin(a) * 7);
    ctx.stroke();
  }
  ctx.fillStyle = isUnlocked ? '#38bdf8' : '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // SW: Swinging Gold Grandfather Clock Pendulum (x: 1*16 + 9.5, y: 8*16 + 6)
  const swX = 1 * TILE_SIZE + 9;
  const swY = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#070a14';
  ctx.fillRect(swX - 5, swY, 10, 19);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  ctx.strokeRect(swX - 5, swY, 10, 19);
  const swing = Math.sin(tick * 0.07) * 3.5;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(swX, swY + 1);
  ctx.lineTo(swX + swing, swY + 14);
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(swX + swing, swY + 14.5, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // SE: Adamant Vault Safe Locking Dial & Status Gem (x: 13*16, y: 9*16)
  const seX = 13 * TILE_SIZE;
  const seY = 9 * TILE_SIZE;
  ctx.fillStyle = '#090d1a';
  ctx.beginPath();
  ctx.arc(seX, seY, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isUnlocked ? '#10b981' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(seX - 6, seY);
  ctx.lineTo(seX + 6, seY);
  ctx.moveTo(seX, seY - 6);
  ctx.lineTo(seX, seY + 6);
  ctx.stroke();
  ctx.fillStyle = isUnlocked ? '#22c55e' : '#ef4444';
  ctx.beginPath();
  ctx.arc(seX, seY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. FOUR FLICKERING SAPPHIRE-GOLD HOURGLASS BRAZIERS AROUND SUNKEN PIT
  const braziers = [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ];

  braziers.forEach((b, idx) => {
    const flicker = Math.sin(tick * 0.22 + idx * 1.7) * 1.5;
    const glowR = 16 + Math.sin(tick * 0.14 + idx) * 3;

    const grad = ctx.createRadialGradient(b.x + 8, b.y + 5, 2, b.x + 8, b.y + 5, glowR);
    grad.addColorStop(0, isUnlocked ? 'rgba(56, 189, 248, 0.42)' : 'rgba(251, 191, 36, 0.38)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x + 8, b.y + 5, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Flame body (sapphire-gold if unlocked, warm amber-orange flame normally)
    ctx.fillStyle = isUnlocked ? '#0284c7' : '#ea580c';
    ctx.fillRect(b.x + 4, b.y + 2 + Math.round(flicker * 0.4), 8, 4);
    ctx.fillRect(b.x + 5, b.y + Math.round(flicker * 0.6), 6, 3);

    ctx.fillStyle = isUnlocked ? '#7dd3fc' : '#facc15';
    ctx.fillRect(b.x + 5, b.y + 3, 6, 3);
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(b.x + 6, b.y + 2 + Math.round(flicker * 0.3), 4, 2);

    // Rising spark
    const sparkY = (tick + idx * 11) % 22;
    if (sparkY < 15) {
      ctx.fillStyle = isUnlocked ? '#bae6fd' : '#fde047';
      ctx.fillRect(
        b.x + 7 + Math.round(Math.sin(tick * 0.2 + idx) * 2),
        b.y + 2 - Math.floor(sparkY * 0.45),
        1.5,
        1.5
      );
    }
  });

  // 4. ORTHOGONAL CONDUIT ENERGY PULSES WHEN SEAL OF ETERNITY UNLOCKED
  if (isUnlocked) {
    const pulse = (tick % 40) / 40;
    const glowAlpha = 0.55 + 0.35 * Math.sin(tick * 0.12);
    const ox = 7.5 * TILE_SIZE;
    const oy = 6.5 * TILE_SIZE;
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${glowAlpha})`;
    // Flowing light beads traveling along orthogonal N-S & E-W tracks into Orrery
    ctx.fillRect(ox - 1.5, 4 * TILE_SIZE + pulse * 40, 3, 3);
    ctx.fillRect(ox - 1.5, 9 * TILE_SIZE - pulse * 40, 3, 3);
    ctx.fillRect(4 * TILE_SIZE + pulse * 52, oy - 1.5, 3, 3);
    ctx.fillRect(10 * TILE_SIZE + 12 - pulse * 52, oy - 1.5, 3, 3);
    ctx.restore();
  }

  // 5. CENTRAL CELESTIAL ORRERY & EPOCH TIME-CAPSULE (x=7, y=6)
  const capX = 7.5 * TILE_SIZE;
  const capY = 6.5 * TILE_SIZE;
  const floatOff = Math.sin(tick * 0.08) * 1.5;

  // Translucent Crystal Dome
  const capGlow = ctx.createRadialGradient(capX, capY - 2, 2, capX, capY - 2, 16);
  capGlow.addColorStop(0, isUnlocked ? 'rgba(56, 189, 248, 0.48)' : 'rgba(251, 191, 36, 0.32)');
  capGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = capGlow;
  ctx.beginPath();
  ctx.arc(capX, capY - 2, 16, 0, Math.PI * 2);
  ctx.fill();

  // Floating Rotating Brass Armillary Sphere & Golden Hourglass
  ctx.save();
  ctx.translate(capX, capY - 2 + floatOff);
  ctx.strokeStyle = isUnlocked ? '#7dd3fc' : '#fbbf24';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 3.5, tick * 0.03, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.fillRect(-3.5, -5, 7, 1.5);
  ctx.fillRect(-3.5, 3.5, 7, 1.5);
  ctx.fillStyle = isUnlocked ? '#38bdf8' : '#7dd3fc';
  ctx.beginPath();
  ctx.moveTo(-2.5, -3.5);
  ctx.lineTo(2.5, -3.5);
  ctx.lineTo(0, 0);
  ctx.lineTo(2.5, 3.5);
  ctx.lineTo(-2.5, 3.5);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. THREE ANIMATED GUARDIAN CHARACTERS (Dialga, Celebi & Chronos Archivist)
  // A) Grand Chrono Warden Dialga on North Imperial Tribune (7, 2)
  const dX = 7 * TILE_SIZE + 8;
  const dY = 2 * TILE_SIZE + 14;
  const dHover = Math.sin(tick * 0.05) * 1.5;

  // Sacred Celestial Aura under Dialga
  const dAura = 12 + Math.sin(tick * 0.07) * 2;
  ctx.strokeStyle = isUnlocked ? 'rgba(56, 189, 248, 0.65)' : 'rgba(251, 191, 36, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dX, dY - 6 + dHover, dAura, 0, Math.PI * 2);
  ctx.stroke();

  const dialgaPmd = pmdAnimator?.draw(ctx, 'dialga', 'idle', 'down', dX, dY + dHover * 0.5, tick, 0.92);
  if (!dialgaPmd) {
    const fb = getDialgaFallbackSprite();
    if (fb) {
      ctx.drawImage(fb, dX - 18, dY - 26 + dHover, 36, 36);
    } else {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(dX - 6, dY - 14 + dHover, 12, 12);
    }
  }

  // Orbiting Adamant Crystals around Dialga
  for (let i = 0; i < 3; i++) {
    const ang = tick * 0.05 + (i * Math.PI * 2) / 3;
    const ox = dX + Math.cos(ang) * 13;
    const oy = dY - 6 + dHover + Math.sin(ang) * 5;
    ctx.fillStyle = i % 2 === 0 ? '#7dd3fc' : '#fde047';
    ctx.fillRect(Math.round(ox - 1), Math.round(oy - 1), 2, 2);
  }

  // B) Time-Travel Envoy Celebi on West Plinth (2, 6)
  const cX = 2 * TILE_SIZE + 8;
  const cY = 6 * TILE_SIZE + 13;
  const cHover = Math.sin(tick * 0.09) * 2;

  const celebiPmd = pmdAnimator?.draw(ctx, 'celebi', 'idle', 'right', cX, cY + cHover * 0.4, tick, 1.0);
  if (!celebiPmd) {
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(cX, cY - 7 + cHover, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Subtle Emerald Time Sparkles orbiting Celebi
  const celAngle = tick * 0.06;
  ctx.fillStyle = '#6ee7b7';
  ctx.fillRect(Math.round(cX + Math.cos(celAngle) * 8), Math.round(cY - 6 + Math.sin(celAngle) * 4), 2, 2);

  // C) Legendary Time-Keeper Chronomon DM (Digimon World DS) on East Plinth (12, 6)
  const chX = 12 * TILE_SIZE + 8;
  const chY = 6 * TILE_SIZE + 14;
  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  ctx.beginPath();
  ctx.ellipse(chX, chY, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const chEntry = getDigimonById('chronomon_dm');
  const chSprites = chEntry ? requestDigimonSprites('chronomon_dm') : null;
  let drewChronomon = false;
  if (chEntry && chSprites) {
    const { frame, flipX } = selectDigimonOverworldFrame(chEntry, chSprites, 'S', tick, false, false);
    if (frame) {
      const targetH = Math.round((chEntry.overworldTargetHeight || 36) * 0.78);
      const scale = targetH / frame.height;
      const drawW = Math.max(14, Math.round(frame.width * scale));
      const drawH = Math.max(14, Math.round(frame.height * scale));
      ctx.save();
      ctx.translate(Math.round(chX), Math.round(chY));
      if (flipX) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(frame.canvas, -Math.round(drawW / 2), -drawH, drawW, drawH);
      ctx.restore();
      drewChronomon = true;
    }
  }
  if (!drewChronomon) {
    const chHover = Math.round(Math.sin(tick * 0.08));
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(chX - 5, chY - 12 + chHover, 10, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(chX - 3, chY - 9 + chHover, 6, 3);
  }

  // 7. FLOATING TEMPORAL STARLIGHT MOTES
  ctx.save();
  for (const p of TIME_SPARKLES) {
    const py = (p.y - tick * p.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = p.x + Math.sin(tick * 0.04 + p.phase) * 4;
    const alpha = 0.25 + 0.3 * Math.sin(tick * 0.08 + p.phase);

    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 2, 2);
  }
  ctx.restore();

  // 8. ACTIVE CHRONO SHOCKWAVES (Gear turns, Unlocks, Era Warps)
  ctx.save();
  for (let i = activeVaultWaves.length - 1; i >= 0; i--) {
    const wave = activeVaultWaves[i];
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
      activeVaultWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
