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

export const CATHEDRAL_COLS = DARK_INTERIOR_COLS;
export const CATHEDRAL_ROWS = DARK_INTERIOR_ROWS;
export const CATHEDRAL_SPAWN = DARK_INTERIOR_SPAWN;

export const CATHEDRAL_PROPS: DarkInteriorProp[] = [
  {
    id: 'lunala',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'lunala' },
    label: '🌙 Lunala',
    style: 'lunala',
    labelLift: 20,
    hint: 'Commune with Choir Matriarch Lunala 🌙',
  },
  {
    id: 'pipe-organ',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'pipe-organ' },
    label: '🎹 Echo Organ',
    style: 'pipe-organ',
    labelLift: 22,
    hint: 'Play Echo Organ Harmonic Puzzle 🎶',
  },
  {
    id: 'war-stories-grimoire',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'war-stories-grimoire' },
    label: '📖 Grimoire',
    style: 'grimoire',
    labelLift: 12,
    hint: 'Read Obsidian Grimoire War Stories 📜',
  },
  {
    id: 'confession-shrine',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'confession-shrine' },
    label: '🕯️ Spirit Shrine',
    style: 'shrine',
    labelLift: 12,
    hint: 'Cleanse Spirit & Cast Speed Buff ✨',
  },
  {
    id: 'necrozma',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'necrozma' },
    label: '💠 Necrozma',
    style: 'necrozma',
    labelLift: 18,
    hint: 'Challenge Prism Necrozma 🎶',
  },
  {
    id: 'gardevoir',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'gardevoir' },
    label: '✨ Gardevoir',
    style: 'gardevoir',
    labelLift: 18,
    hint: 'Listen to Cantor Gardevoir 📖',
  },
  {
    id: 'stained-rose',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'stained-rose' },
    label: '🔮 Rose Altar',
    style: 'stained-rose',
    labelLift: 16,
    hint: 'Inspect Harmonic Rose Resonance Orb 🟣',
  },
  {
    id: 'west-pews',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: {
      type: 'note',
      text: 'Carved dark-oak choir pews inlaid with amethyst hymnals tuned to 432 Hz.',
    },
    label: '🪑 Choir Pews',
    style: 'pews',
    labelLift: 10,
  },
  {
    id: 'east-pews',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: {
      type: 'event',
      name: 'east-pews',
    },
    label: '🔔 Bell Chimes',
    style: 'chimes',
    labelLift: 10,
    hint: 'Inspect Harmonic Chimes & Cathedral Relics 🟣',
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

export function createCathedralCollision(): Uint8Array {
  const coll = createDarkInteriorBaseCollision();
  const w = CATHEDRAL_COLS;

  // Row 2: Choir Organ Tribune (x: 6..8) blocked; x=1..5 and x=9..13 walkable
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // NW Scriptorium & Grimoire Lectern (x: 1..2, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // NE Confession & Cleanse Shrine (x: 12..13, y: 3..4)
  for (let y = 3; y <= 4; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SW Carved Choir Pews (x: 1..2, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 1; x <= 2; x++) {
      coll[y * w + x] = 1;
    }
  }

  // SE Cathedral Bell Chimes & Relic Chest (x: 12..13, y: 8..9)
  for (let y = 8; y <= 9; y++) {
    for (let x = 12; x <= 13; x++) {
      coll[y * w + x] = 1;
    }
  }

  // 4 Amethyst Candelabra Braziers framing the Sunken Choir Nave
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  // West Plinth: Necrozma (2, 6) & East Plinth: Gardevoir (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Center Rose Resonance Altar (7, 6)
  coll[6 * w + 7] = 1;

  return coll;
}

export const CATHEDRAL_COLLISION = createCathedralCollision();

interface CathedralEchoWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  text: string;
  alpha: number;
}

const activeCathedralWaves: CathedralEchoWave[] = [];

export function triggerCathedralEchoWave(
  text = 'ECHO HARMONY! 🎶',
  color = '#c084fc'
) {
  activeCathedralWaves.push({
    x: 7.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    radius: 5,
    maxRadius: 72,
    color,
    text,
    alpha: 1,
  });
}

// Sacred Amethyst Obsidian & Cathedral Gold Palette
const C_FLOOR_A = '#1c1230';     // Deep Amethyst Flagstone
const C_FLOOR_B = '#23173b';     // Satin Indigo Tile
const C_NAVE_A = '#130b24';      // Sunken Choir Sanctuary Tile
const C_NAVE_B = '#19102e';
const C_WALL_DARK = '#0c0618';   // Midnight Gothic Basilica Stone
const C_WALL_MID = '#20133a';
const C_WALL_LIGHT = '#36205c';
const C_GOLD_DARK = '#78350f';
const C_GOLD = '#f59e0b';
const C_GOLD_LIGHT = '#fef08a';
const C_RUNNER = '#3b0764';      // Royal Violet Choir Carpet
const C_RUNNER_ALT = '#4c1d95';

let cachedCathedralBg: HTMLCanvasElement | null = null;

function createCathedralBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CATHEDRAL_COLS * TILE_SIZE;  // 240 px
  canvas.height = CATHEDRAL_ROWS * TILE_SIZE; // 192 px
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const w = CATHEDRAL_COLS;
  const h = CATHEDRAL_ROWS;

  // 1. AMETHYST-OBSIDIAN MARBLE FLOORING (Rows 2..11)
  for (let r = 2; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? C_FLOOR_A : C_FLOOR_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      ctx.fillStyle = 'rgba(216, 180, 254, 0.08)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, 1, TILE_SIZE);
      ctx.fillStyle = 'rgba(5, 2, 12, 0.55)';
      ctx.fillRect(c * TILE_SIZE, (r + 1) * TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect((c + 1) * TILE_SIZE - 1, r * TILE_SIZE, 1, TILE_SIZE);

      if ((r * 7 + c * 11) % 6 === 0) {
        ctx.fillStyle = 'rgba(192, 132, 252, 0.08)';
        ctx.fillRect(c * TILE_SIZE + 5, r * TILE_SIZE + 7, 2, 2);
      }
    }
  }

  // 2. ROYAL VIOLET VELVET RUNNER FROM SOUTH ARCH (x: 6..8, y: 9..11)
  for (let r = 9; r < h; r++) {
    for (let c = 6; c <= 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_RUNNER : C_RUNNER_ALT;
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

  // 3. CENTRAL SUNKEN CHOIR NAVE (x: 4..10, y: 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;

  // Chiseled Amethyst-Bronze Parapet Curb
  ctx.fillStyle = '#3b0764';
  ctx.fillRect(pitX - 4, pitY - 4, pitW + 8, pitH + 8);
  ctx.fillStyle = '#7e22ce';
  ctx.fillRect(pitX - 3, pitY - 3, pitW + 6, pitH + 6);
  ctx.fillStyle = '#d8b4fe';
  ctx.fillRect(pitX - 1, pitY - 1, pitW + 2, pitH + 2);

  for (let r = 4; r <= 9; r++) {
    for (let c = 4; c <= 10; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_NAVE_A : C_NAVE_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'rgba(192, 132, 252, 0.06)';
      ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 3, 4, 1);
    }
  }

  // Recessed shadow along N/W parapet edge
  ctx.fillStyle = 'rgba(5, 2, 12, 0.45)';
  ctx.fillRect(pitX, pitY, pitW, 3);
  ctx.fillRect(pitX, pitY, 3, pitH);

  // Orthogonal Acoustic Gold Channels & Sacred Rose Circle
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  ctx.fillStyle = '#3b0764';
  ctx.fillRect(cx - 2, pitY + 2, 4, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 2, pitW - 4, 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(cx - 1, pitY + 2, 2, pitH - 4);
  ctx.fillRect(pitX + 2, cy - 1, pitW - 4, 2);

  ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 34, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.stroke();

  // Center Rose Resonance Altar Base (x=7, y=6)
  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C_GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. NORTH BASILICA STONE WALL, STAINED GLASS WINDOWS & BANNERS (y: 0..1)
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

  // Twin Stained-Glass Gothic Windows (Cols 2 & 12)
  for (const wx of [2 * TILE_SIZE, 12 * TILE_SIZE]) {
    ctx.fillStyle = '#07030f';
    ctx.fillRect(wx + 1, 6, 14, 22);
    ctx.beginPath();
    ctx.arc(wx + 8, 9, 7, Math.PI, 0, false);
    ctx.fill();
    ctx.fillStyle = '#581c87';
    ctx.fillRect(wx + 3, 9, 10, 17);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(wx + 7, 10, 2, 14);
    ctx.fillRect(wx + 4, 15, 8, 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(wx + 4, 10, 3, 4);
    ctx.fillRect(wx + 9, 10, 3, 4);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(wx + 7, 2, 2, 3);
  }

  // Twin Cathedral Velvet Banners (Cols 4 & 10)
  for (const bx of [3 * TILE_SIZE + 12, 10 * TILE_SIZE + 6]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx - 1, 4, 12, 2);
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(bx, 6, 10, 18);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx + 1, 6, 1, 18);
    ctx.fillRect(bx + 8, 6, 1, 18);
    // Musical note / diamond emblem
    ctx.fillRect(bx + 3, 10, 4, 3);
    ctx.fillRect(bx + 5, 13, 2, 5);
    ctx.fillRect(bx + 3, 16, 3, 3);
    ctx.fillRect(bx, 24, 3, 2);
    ctx.fillRect(bx + 7, 24, 3, 2);
  }

  // Four Fluted Obsidian & Cathedral Gold Columns along North Wall
  for (const px of [1 * TILE_SIZE + 2, 5 * TILE_SIZE + 2, 9 * TILE_SIZE + 2, 13 * TILE_SIZE + 2]) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 2, 12, 3);
    ctx.fillStyle = '#24143e';
    ctx.fillRect(px, 5, 10, 23);
    ctx.fillStyle = '#6b21a8';
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

  // 5. GRAND PIPE ORGAN WALL & CHOIR TRIBUNE (x: 6..8, y: 1..2)
  drawPipeOrganAndTribune(ctx, 6 * TILE_SIZE, 1 * TILE_SIZE);

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
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(14, y * TILE_SIZE, 1, TILE_SIZE);
    ctx.fillRect(canvas.width - 15, y * TILE_SIZE, 1, TILE_SIZE);
  }

  // 7. FOUR CORNER SCRIPTORIUM & SANCTUARY INSTALLATIONS
  drawGrimoireLectern(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawConfessionShrineBase(ctx, 12 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawChoirPewsStation(ctx, 1 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);
  drawBellChimesStation(ctx, 12 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // 8. PIT-SIDE CANTOR PLINTHS: GENGAR (2,6) & DUSKNOIR (12,6)
  drawCantorPlinth(ctx, 2 * TILE_SIZE, 6 * TILE_SIZE, '#c084fc');
  drawCantorPlinth(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, '#fbbf24');

  // 9. FOUR AMETHYST CANDELABRA BASES
  for (const b of [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ]) {
    drawCandelabraBase(ctx, b.x, b.y);
  }

  // 10. GRAND SOUTH ARCHWAY EXIT THRESHOLD
  ctx.fillStyle = C_GOLD_DARK;
  ctx.fillRect(6 * TILE_SIZE + 8, 11 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = C_RUNNER;
  ctx.fillRect(6 * TILE_SIZE + 10, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 4, 12);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 12, 11 * TILE_SIZE + 3, 2 * TILE_SIZE - 8, 1);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE + 8, 11 * TILE_SIZE + 6, C_GOLD_LIGHT, 1, 'center');

  return canvas;
}

function drawPipeOrganAndTribune(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Golden cathedral organ pipes spanning top wall above tribune
  ctx.fillStyle = '#24143e';
  ctx.fillRect(x + 4, 2, 3 * TILE_SIZE - 8, 26);
  const heights = [16, 20, 23, 25, 23, 20, 16];
  heights.forEach((h, i) => {
    const px = x + 6 + i * 5;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px, 26 - h, 3, h);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 2, 26 - h, 1, h);
  });
  // White organ keyboard console
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x + 10, 24, 28, 3);
  ctx.fillStyle = '#0f172a';
  for (let k = 0; k < 6; k++) {
    ctx.fillRect(x + 12 + k * 4, 24, 2, 2);
  }

  // Stepped Choir Tribune Platform at y=2 (row 2)
  const ty = y + TILE_SIZE;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(x, ty + 3, 3 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x, ty, 3 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#4c1d95';
  ctx.fillRect(x + 8, ty, 3 * TILE_SIZE - 16, TILE_SIZE - 2);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 8, ty, 2, TILE_SIZE - 2);
  ctx.fillRect(x + 3 * TILE_SIZE - 10, ty, 2, TILE_SIZE - 2);
  ctx.fillRect(x + 8, ty + TILE_SIZE - 3, 3 * TILE_SIZE - 16, 2);
}

function drawGrimoireLectern(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  ctx.fillStyle = '#2d1847';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e0f33';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 2, w - 4, 2);

  // Ancient Tome Stack on Left
  ctx.fillStyle = '#7e22ce';
  ctx.fillRect(x + 4, y + 18, 9, 9);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(x + 5, y + 12, 8, 6);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 5, y + 15, 8, 1);

  // Open Illuminated Grimoire on Carved Brass Lectern (Right)
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 15, y + 6, 13, 18);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 16, y + 7, 5, 11);
  ctx.fillRect(x + 22, y + 7, 5, 11);
  ctx.fillStyle = '#9333ea';
  ctx.fillRect(x + 17, y + 9, 3, 2);
  ctx.fillRect(x + 23, y + 9, 3, 2);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 17, y + 13, 3, 2);
  ctx.fillRect(x + 23, y + 13, 3, 2);
}

function drawConfessionShrineBase(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  ctx.fillStyle = '#2e1065';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#140826';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

  // Velvet Prayer Kneeler Cushion at Front
  ctx.fillStyle = '#6b21a8';
  ctx.fillRect(x + 5, y + h - 8, w - 10, 5);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 5, y + h - 8, w - 10, 1);

  // Golden Spirit Chalice in Center
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 12, y + 10, 8, 5);
  ctx.fillRect(x + 15, y + 15, 2, 4);
  ctx.fillRect(x + 13, y + 19, 6, 2);
}

function drawChoirPewsStation(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  ctx.fillStyle = '#24143b';
  ctx.fillRect(x, y, w, h);
  // Two carved dark-oak cathedral benches
  for (const rowY of [y + 4, y + 18]) {
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(x + 3, rowY, w - 6, 10);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(x + 3, rowY, w - 6, 3);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(x + 3, rowY, w - 6, 1);
  }
}

function drawBellChimesStation(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 2, y + 3, w, h);

  ctx.fillStyle = '#24143b';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#140826';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 4, y + 4, w - 8, 2);

  // 4 Hanging Tubular Brass Cathedral Chimes
  const heights = [18, 15, 12, 9];
  heights.forEach((ch, i) => {
    const cx = x + 6 + i * 5;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx, y + 6, 3, ch);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx, y + 6, 1, ch);
  });
}

function drawCantorPlinth(ctx: CanvasRenderingContext2D, x: number, y: number, accentColor: string) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x, y + 3, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#24143e';
  ctx.fillRect(x + 1, y + 2, TILE_SIZE - 2, TILE_SIZE - 3);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 2, y + 3, TILE_SIZE - 4, TILE_SIZE - 5);
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 3, y + 4, TILE_SIZE - 6, 2);
}

function drawCandelabraBase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 14, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3b0764';
  ctx.fillRect(x + 5, y + 8, 6, 6);
  ctx.fillStyle = C_GOLD_DARK;
  ctx.fillRect(x + 2, y + 6, 12, 3);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 2, y + 6, 12, 1);
}

function drawCathedralGuardianFallback(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number, color: string) {
  const bob = Math.sin(tick * 0.08) * 1.5;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 3, y + 13, 10, 2);
  ctx.fillStyle = color;
  ctx.fillRect(x + 4, Math.round(y + bob + 3), 8, 9);
}

const CHOIR_MOTES = Array.from({ length: 14 }, (_, i) => ({
  x: 16 + ((i * 33) % 208),
  y: 36 + ((i * 27) % 136),
  speed: 0.14 + (i % 4) * 0.05,
  phase: i * 1.1,
  color: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#fde047' : '#f472b6',
}));

export function renderCathedralScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator
) {
  if (!cachedCathedralBg && typeof document !== 'undefined') {
    cachedCathedralBg = createCathedralBackgroundCanvas();
  }

  if (cachedCathedralBg) {
    ctx.drawImage(cachedCathedralBg, 0, 0);
  }

  const seals = getAbyssalSeals();
  const isUnlocked = seals.echoes;

  // 1. ANIMATED STAINED-GLASS CATHEDRAL LIGHT BEAM CONE
  const lightAlpha = (isUnlocked ? 0.18 : 0.11) + 0.05 * Math.sin(tick * 0.06);
  const shaftGrad = ctx.createRadialGradient(7.5 * TILE_SIZE, 1.5 * TILE_SIZE, 5, 7.5 * TILE_SIZE, 6.5 * TILE_SIZE, 95);
  shaftGrad.addColorStop(0, `rgba(192, 132, 252, ${lightAlpha + 0.14})`);
  shaftGrad.addColorStop(0.6, `rgba(147, 51, 234, ${lightAlpha * 0.65})`);
  shaftGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shaftGrad;
  ctx.beginPath();
  ctx.moveTo(6 * TILE_SIZE, 1.5 * TILE_SIZE);
  ctx.lineTo(9 * TILE_SIZE, 1.5 * TILE_SIZE);
  ctx.lineTo(10.5 * TILE_SIZE, 9.5 * TILE_SIZE);
  ctx.lineTo(4.5 * TILE_SIZE, 9.5 * TILE_SIZE);
  ctx.closePath();
  ctx.fill();

  // 2. NE CONFESSION SHRINE TWIN FLICKERING TAPER CANDLES (x: 12..13, y: 3..4)
  const shX = 12 * TILE_SIZE;
  const shY = 3 * TILE_SIZE;
  for (const cx of [shX + 7, shX + 23]) {
    const fl = (tick + cx) % 10 < 5 ? 0 : 1;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx, shY + 12, 2, 7);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx, shY + 9 - fl, 2, 3);
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(cx, shY + 10, 1, 2);
  }

  // 3. FOUR FLICKERING AMETHYST CANDELABRA BRAZIERS
  const braziers = [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ];
  braziers.forEach((b, idx) => {
    const flicker = Math.sin(tick * 0.22 + idx * 1.5) * 1.5;
    const glowR = 16 + Math.sin(tick * 0.14 + idx) * 3;
    const grad = ctx.createRadialGradient(b.x + 8, b.y + 5, 2, b.x + 8, b.y + 5, glowR);
    grad.addColorStop(0, isUnlocked ? 'rgba(192, 132, 252, 0.45)' : 'rgba(244, 114, 182, 0.36)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x + 8, b.y + 5, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isUnlocked ? '#a855f7' : '#e11d48';
    ctx.fillRect(b.x + 4, b.y + 2 + Math.round(flicker * 0.4), 8, 4);
    ctx.fillRect(b.x + 5, b.y + Math.round(flicker * 0.6), 6, 3);
    ctx.fillStyle = isUnlocked ? '#e9d5ff' : '#fbbf24';
    ctx.fillRect(b.x + 5, b.y + 3, 6, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.x + 6, b.y + 2 + Math.round(flicker * 0.3), 4, 2);
  });

  // 4. CENTERPIECE HARMONIC ROSE RESONANCE ORB (x: 7, y: 6)
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  const orbBob = Math.sin(tick * 0.08) * 1.5;
  const orbGlow = ctx.createRadialGradient(cx, cy - 2, 2, cx, cy - 2, 17);
  orbGlow.addColorStop(0, isUnlocked ? 'rgba(192, 132, 252, 0.55)' : 'rgba(168, 85, 247, 0.35)');
  orbGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = orbGlow;
  ctx.beginPath();
  ctx.arc(cx, cy - 2, 17, 0, Math.PI * 2);
  ctx.fill();

  // 4 Petals of Cathedral Resonance revolving inside Rose Orb
  const petals = ['#c084fc', '#f43f5e', '#fbbf24', '#38bdf8'];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + tick * (isUnlocked ? 0.045 : 0.02);
    ctx.fillStyle = petals[i];
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * 4.5, cy - 2 + orbBob + Math.sin(a) * 4.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath();
  ctx.arc(cx, cy - 2 + orbBob, 2, 0, Math.PI * 2);
  ctx.fill();

  // 5. THREE CATHEDRAL GUARDIAN CANTORS (Lunala PMD, Gengar & Dusknoir)
  // A) Choir Matriarch Lunala on North Imperial Tribune (7, 2)
  const lX = 7 * TILE_SIZE + 8;
  const lY = 2 * TILE_SIZE + 14;
  const lHover = Math.sin(tick * 0.05) * 1.5;

  const lAura = 12 + Math.sin(tick * 0.07) * 2;
  ctx.strokeStyle = isUnlocked ? 'rgba(192, 132, 252, 0.7)' : 'rgba(244, 114, 182, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(lX, lY - 6 + lHover, lAura, 0, Math.PI * 2);
  ctx.stroke();

  const lunalaPmd = pmdAnimator?.draw(ctx, 'lunala', 'idle', 'down', lX, lY + lHover * 0.5, tick, 0.92);
  if (!lunalaPmd) {
    ctx.fillStyle = '#312e81';
    ctx.fillRect(lX - 6, lY - 14 + lHover, 12, 12);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(lX - 4, lY - 12 + lHover, 8, 3);
  }

  // Orbiting Crescent Harmonic Orbs
  for (let i = 0; i < 3; i++) {
    const ang = tick * 0.05 + (i * Math.PI * 2) / 3;
    ctx.fillStyle = i % 2 === 0 ? '#c084fc' : '#fde047';
    ctx.fillRect(
      Math.round(lX + Math.cos(ang) * 13 - 1),
      Math.round(lY - 6 + lHover + Math.sin(ang) * 5 - 1),
      2,
      2
    );
  }

  // B) Prism Necrozma on West Plinth (2, 6)
  const necroPmd = pmdAnimator?.draw(
    ctx,
    'necrozma',
    'idle',
    'down',
    2 * TILE_SIZE + 8,
    6 * TILE_SIZE + 14,
    tick,
    0.58
  );
  if (!necroPmd) {
    drawCathedralGuardianFallback(ctx, 2 * TILE_SIZE, 6 * TILE_SIZE, tick, '#581c87');
  }

  // C) Cantor Gardevoir on East Plinth (12, 6)
  const gardPmd = pmdAnimator?.draw(
    ctx,
    'gardevoir',
    'idle',
    'down',
    12 * TILE_SIZE + 8,
    6 * TILE_SIZE + 14,
    tick,
    0.82
  );
  if (!gardPmd) {
    drawCathedralGuardianFallback(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, tick, '#a7f3d0');
  }

  // 6. FLOATING AMETHYST CHOIR MOTES
  ctx.save();
  for (const p of CHOIR_MOTES) {
    const py = (p.y - tick * p.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = p.x + Math.sin(tick * 0.045 + p.phase) * 4;
    const alpha = 0.25 + 0.3 * Math.sin(tick * 0.09 + p.phase);

    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 2, 2);
  }
  ctx.restore();

  // 7. ACTIVE ECHO ORGAN HARMONIC SHOCKWAVES
  ctx.save();
  for (let i = activeCathedralWaves.length - 1; i >= 0; i--) {
    const wave = activeCathedralWaves[i];
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
      activeCathedralWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
