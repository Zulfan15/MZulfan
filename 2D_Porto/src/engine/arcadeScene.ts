import type { Dir } from './types';

export const ARCADE_COLS = 19;
export const ARCADE_ROWS = 14;
export const ARCADE_SPAWN: { x: number; y: number; dir: Dir } = { x: 9, y: 12, dir: 'up' };

export interface ArcadePropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
}

export interface ArcadeProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: ArcadePropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
  door?: { x: number; y: number };
}

// Pseudo-random fast deterministic hash [0, 1)
function hashNoise(x: number, y: number, seed = 0): number {
  let r = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  r = Math.imul(r ^ (r >>> 13), 1274126177);
  return ((r ^ (r >>> 16)) >>> 0) / 4294967296;
}

function fill(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Pixel font lookup for ARCADE letters
const PIXEL_LETTERS: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
};

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  startY: number,
  color: string,
  scale = 1
) {
  [...text].forEach((char, charIdx) => {
    const matrix = PIXEL_LETTERS[char];
    if (!matrix) return;
    matrix.forEach((row, rowIdx) => {
      [...row].forEach((px, colIdx) => {
        if (px === '#') {
          fill(ctx, color, startX + (charIdx * 4 + colIdx) * scale, startY + rowIdx * scale, scale, scale);
        }
      });
    });
  });
}

// Color Palette for Arcade
const C_DARK = '#1b1530';
const C_WALL_BG = '#3a3160';
const C_WALL_PANEL = '#251d40';
const C_FLOOR_TILE = '#2a2147';
const CONFETTI_COLORS = ['#59f0d0', '#ff7a59', '#ffd166', '#c49bff'];
const C_ROBOT_BODY = '#d5dde8';
const C_ROBOT_SHADOW = '#9aa8b8';
const C_ROBOT_CYAN = '#7df9ff';

export const ARCADE_PROPS: ArcadeProp[] = [
  {
    id: 'robot',
    kind: 'npc',
    x: 8,
    y: 4,
    w: 3,
    h: 3,
    target: { type: 'event', name: 'mancala' },
    label: 'Mancala Robot',
    style: 'robot',
    labelLift: 22,
    hint: 'Challenge the robot to Mancala 🕹️',
  },
  {
    id: 'Stone Muncher',
    kind: 'prop',
    x: 2,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'High score: 48, set by ROBOT. Suspicious.' },
    label: 'Stone Muncher',
    style: '#ff7a59',
    hideLabel: true,
  },
  {
    id: 'Kalah Kart',
    kind: 'prop',
    x: 4,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'Out of order. The robot says it “calculated too hard.”' },
    label: 'Kalah Kart',
    style: '#59f0d0',
    hideLabel: true,
  },
  {
    id: 'Mega Mancala III',
    kind: 'prop',
    x: 6,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: "Insert coin. You don't have a coin." },
    label: 'Mega Mancala III',
    style: '#c49bff',
    hideLabel: true,
  },
  {
    id: 'Pit Fighter',
    kind: 'prop',
    x: 12,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'Every round so far has ended in a draw.' },
    label: 'Pit Fighter',
    style: '#ffd166',
    hideLabel: true,
  },
  {
    id: 'Alpha-Beta Blasters',
    kind: 'prop',
    x: 14,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'Prunes most enemies before they even spawn.' },
    label: 'Alpha-Beta Blasters',
    style: '#7cc8f2',
    hideLabel: true,
  },
  {
    id: 'Space Seeders',
    kind: 'prop',
    x: 16,
    y: 2,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'Sow your stones, save the galaxy.' },
    label: 'Space Seeders',
    style: '#ff8fab',
    hideLabel: true,
  },
  {
    id: 'scoreboard',
    kind: 'prop',
    x: 13,
    y: 1,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'scoreboard' },
    label: 'Scoreboard',
    style: 'scoreboard',
    labelLift: 18,
    hint: 'Check the robot score records 🏆',
    hideLabel: false,
  },
  {
    id: 'vending',
    kind: 'prop',
    x: 1,
    y: 6,
    w: 1,
    h: 2,
    target: { type: 'note', text: 'Snacks: sold out. Bits: one left.' },
    label: 'Vending machine',
    style: 'vending',
    hideLabel: true,
  },
  {
    id: 'claw',
    kind: 'prop',
    x: 15,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'note', text: 'A claw machine. The plush robot inside looks smug.' },
    label: 'Claw machine',
    style: 'claw',
    hideLabel: true,
  },
  {
    id: 'plant-l',
    kind: 'prop',
    x: 1,
    y: 12,
    w: 1,
    h: 1,
    target: { type: 'note', text: 'A plastic plant. Low maintenance, like a good heuristic.' },
    label: 'Plant',
    style: 'plant',
    hideLabel: true,
  },
  {
    id: 'plant-r',
    kind: 'prop',
    x: 17,
    y: 12,
    w: 1,
    h: 1,
    target: { type: 'note', text: 'Another plastic plant. It has seen many rematches.' },
    label: 'Plant',
    style: 'plant',
    hideLabel: true,
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 9,
    y: 13,
    w: 1,
    h: 1,
    door: { x: 9, y: 13 },
    target: { type: 'place', id: 'town' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

// Base map grid: 14 rows, 19 cols
const ARCADE_GRID = [
  '###################',
  '###################',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#.................#',
  '#########.#########'
];

export const ARCADE_COLLISION: Uint8Array = new Uint8Array(ARCADE_COLS * ARCADE_ROWS);

// Initialize collision matrix from base grid
for (let y = 0; y < ARCADE_ROWS; y++) {
  for (let x = 0; x < ARCADE_COLS; x++) {
    if (ARCADE_GRID[y][x] === '#') {
      ARCADE_COLLISION[y * ARCADE_COLS + x] = 1;
    }
  }
}

// Mark props as solid
ARCADE_PROPS.forEach((prop) => {
  if (prop.kind === 'exit') return;
  for (let dy = 0; dy < prop.h; dy++) {
    for (let dx = 0; dx < prop.w; dx++) {
      const tx = prop.x + dx;
      const ty = prop.y + dy;
      if (tx >= 0 && tx < ARCADE_COLS && ty >= 0 && ty < ARCADE_ROWS) {
        ARCADE_COLLISION[ty * ARCADE_COLS + tx] = 1;
      }
    }
  }
});

// Render floor tile with subtle retro confetti specks
function renderFloorTile(ctx: CanvasRenderingContext2D, tileX: number, tileY: number) {
  const px = tileX * 16;
  const py = tileY * 16;
  fill(ctx, C_FLOOR_TILE, px, py, 16, 16);

  for (let i = 0; i < 2; i++) {
    if (hashNoise(tileX, tileY, i + 7) < 0.45) continue;
    const color = CONFETTI_COLORS[Math.floor(hashNoise(tileX, tileY, i + 5) * CONFETTI_COLORS.length)];
    const cx = px + 1 + Math.floor(hashNoise(tileX, tileY, i) * 13);
    const cy = py + 1 + Math.floor(hashNoise(tileX, tileY, i + 9) * 13);
    if (hashNoise(tileX, tileY, i + 2) > 0.5) {
      fill(ctx, color, cx, cy, 2, 1);
    } else {
      fill(ctx, color, cx, cy, 1, 2);
    }
  }
}

// Render neon arcade marquee on back wall
function renderArcadeWall(ctx: CanvasRenderingContext2D) {
  const totalW = ARCADE_COLS * 16;
  fill(ctx, C_WALL_BG, 0, 0, totalW, 32);
  fill(ctx, C_WALL_PANEL, 0, 22, totalW, 10);
  fill(ctx, '#59f0d0', 0, 21, totalW, 1);

  // Bulbs running across wall top
  for (let x = 4; x < totalW; x += 8) {
    fill(ctx, (x / 8) % 2 ? '#ffd166' : '#ff7a59', x, 2, 2, 2);
  }

  // Neon "ARCADE" sign centered
  const signX = Math.round((totalW - 50) / 2);
  fill(ctx, C_DARK, signX - 3, 4, 52, 16);
  fill(ctx, 'rgba(255, 79, 184, 0.35)', signX - 2, 5, 50, 14);
  drawPixelText(ctx, 'ARCADE', signX, 7, '#ffd6f0', 2);

  // Neon side accents
  for (const [nx, col] of [
    [34, '#ffd166'],
    [totalW - 46, '#59f0d0'],
  ] as [number, string][]) {
    fill(ctx, C_DARK, nx, 5, 12, 14);
    fill(ctx, col, nx + 1, 6, 10, 12);
    fill(ctx, C_DARK, nx + 3, 9, 6, 1);
    fill(ctx, C_DARK, nx + 4, 12, 4, 4);
  }

  // Side pillars
  for (let y = 2; y < ARCADE_ROWS; y++) {
    fill(ctx, C_WALL_PANEL, 0, y * 16, 16, 16);
    fill(ctx, C_WALL_PANEL, totalW - 16, y * 16, 16, 16);
  }
  fill(ctx, '#4b3f78', 15, 32, 1, (ARCADE_ROWS - 3) * 16);
  fill(ctx, '#4b3f78', totalW - 16, 32, 1, (ARCADE_ROWS - 3) * 16);

  // Bottom edge wall
  const bottomY = (ARCADE_ROWS - 1) * 16;
  fill(ctx, C_WALL_PANEL, 0, bottomY, totalW, 16);
  fill(ctx, '#4b3f78', 0, bottomY, totalW, 1);
}

// Exit doorway mat
function renderExitMat(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16;
  const py = prop.y * 16;
  fill(ctx, C_FLOOR_TILE, px, py, 16, 16);
  fill(ctx, '#c4472a', px + 1, py + 1, 14, 13);
  fill(ctx, '#ff7a59', px + 2, py + 2, 12, 11);
  for (let i = 0; i < 4; i++) {
    fill(ctx, '#ffd166', px + 4 + i, py + 4 + i, 1, 2);
    fill(ctx, '#ffd166', px + 11 - i, py + 4 + i, 1, 2);
  }
}

// Center retro patterned carpet/rug
function renderCenterRug(ctx: CanvasRenderingContext2D) {
  fill(ctx, '#ffd166', 112, 60, 80, 80);
  fill(ctx, '#b8405e', 114, 62, 76, 76);
  fill(ctx, '#d65a78', 118, 66, 68, 68);
  for (let x = 116; x < 188; x += 6) {
    fill(ctx, '#ffd166', x, 63, 2, 1);
    fill(ctx, '#ffd166', x, 136, 2, 1);
  }
}

// Arcade cabinet
function renderArcadeCabinet(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16;
  const py = prop.y * 16 - 10;
  const h = prop.h * 16 + 10;

  fill(ctx, 'rgba(0,0,0,0.35)', px + 2, py + h - 2, 14, 3);
  fill(ctx, C_DARK, px + 1, py, 14, h);
  fill(ctx, prop.style, px + 2, py + 1, 12, h - 2);
  fill(ctx, 'rgba(0,0,0,0.25)', px + 12, py + 1, 2, h - 2);

  // Marquee
  fill(ctx, '#fff8ee', px + 3, py + 2, 10, 3);
  fill(ctx, prop.style, px + 5, py + 3, 6, 1);

  // CRT Screen
  fill(ctx, C_DARK, px + 3, py + 7, 10, 10);
  fill(ctx, '#14202c', px + 4, py + 8, 8, 8);
  for (let i = 0; i < 4; i++) {
    const col = CONFETTI_COLORS[Math.floor(hashNoise(prop.x, i, 3) * CONFETTI_COLORS.length)];
    fill(
      ctx,
      col,
      px + 5 + Math.floor(hashNoise(prop.x, i, 1) * 6),
      py + 9 + Math.floor(hashNoise(prop.x, i, 2) * 6),
      1,
      1
    );
  }
  fill(ctx, '#ffffff', px + 5, py + 9, 1, 1);

  // Control panel
  fill(ctx, C_DARK, px + 1, py + 18, 14, 5);
  fill(ctx, C_ROBOT_SHADOW, px + 2, py + 19, 12, 3);
  fill(ctx, '#e63946', px + 4, py + 18, 2, 2);
  fill(ctx, C_DARK, px + 5, py + 20, 1, 1);
  fill(ctx, '#ffd166', px + 8, py + 20, 2, 1);
  fill(ctx, '#59f0d0', px + 11, py + 20, 2, 1);

  // Coin slot door
  fill(ctx, C_DARK, px + 5, py + 27, 6, 5);
  fill(ctx, '#ff7a59', px + 7, py + 28, 2, 1);
}

// Vending Machine
function renderVendingMachine(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16;
  const py = prop.y * 16 - 8;
  const h = prop.h * 16 + 8;

  fill(ctx, C_DARK, px, py, 16, h);
  fill(ctx, '#e63946', px + 1, py + 1, 14, h - 2);
  fill(ctx, C_DARK, px + 2, py + 3, 9, 26);
  fill(ctx, '#bfe6ff', px + 3, py + 4, 7, 24);

  for (let i = 0; i < 4; i++) {
    fill(ctx, i === 1 ? '#bfe6ff' : CONFETTI_COLORS[i % CONFETTI_COLORS.length], px + 4, py + 5 + i * 6, 5, 3);
  }
  fill(ctx, '#ffd166', px + 12, py + 6, 2, 4);
  fill(ctx, C_DARK, px + 3, py + 32, 8, 4);
}

// Claw Machine
function renderClawMachine(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16;
  const py = prop.y * 16 - 10;
  const w = prop.w * 16;
  const h = prop.h * 16 + 10;

  fill(ctx, 'rgba(0,0,0,0.35)', px + 2, py + h - 2, w, 3);
  fill(ctx, C_DARK, px, py, w, h);
  fill(ctx, '#ffd166', px + 1, py + 1, w - 2, 4);
  fill(ctx, '#bfe6ff', px + 2, py + 6, w - 4, 20);
  fill(ctx, '#e8f6ff', px + 3, py + 7, 2, 18);

  // The metal claw
  fill(ctx, C_ROBOT_SHADOW, px + 14, py + 6, 1, 7);
  fill(ctx, C_ROBOT_SHADOW, px + 12, py + 13, 5, 1);
  fill(ctx, C_ROBOT_SHADOW, px + 12, py + 14, 1, 2);
  fill(ctx, C_ROBOT_SHADOW, px + 16, py + 14, 1, 2);

  // Plush toys inside
  ['#ff8fab', '#59f0d0', '#c49bff', '#ffd166', '#ff7a59'].forEach((col, idx) => {
    fill(ctx, col, px + 4 + idx * 5, py + 21 + (idx % 2), 4, 5 - (idx % 2));
  });

  // Plush robot
  fill(ctx, C_ROBOT_BODY, px + 19, py + 18, 4, 4);
  fill(ctx, C_ROBOT_CYAN, px + 20, py + 19, 1, 1);
  fill(ctx, C_ROBOT_CYAN, px + 22, py + 19, 1, 1);

  // Base panel and prize shoot
  fill(ctx, '#ff8fab', px + 1, py + 27, w - 2, h - 28);
  fill(ctx, C_DARK, px + 12, py + 31, 8, 3);
}

// Plastic potted plant
function renderArcadePlant(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16;
  const py = prop.y * 16;
  fill(ctx, '#4f9d4a', px + 3, py - 4, 10, 8);
  fill(ctx, '#6dbb5b', px + 5, py - 6, 6, 6);
  fill(ctx, '#3a7a3a', px + 2, py + 1, 3, 3);
  fill(ctx, '#3a7a3a', px + 11, py + 1, 3, 3);
  fill(ctx, C_DARK, px + 4, py + 6, 8, 9);
  fill(ctx, '#c98f5c', px + 5, py + 7, 6, 7);
}

// Retro digital scoreboard
function renderScoreboard(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const px = prop.x * 16 - 5;
  const py = prop.y * 16 - 13;
  fill(ctx, C_DARK, px, py, 26, 18);
  fill(ctx, '#0b0d14', px + 1, py + 1, 24, 16);

  // Scoreboard green/red tallies
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 4; i++) {
      fill(ctx, '#7dffb0', px + 3 + i * 2, py + 3 + row * 4, 1, 2);
    }
    for (let i = 0; i < 3; i++) {
      fill(ctx, '#ff6b6b', px + 14 + i * 2, py + 3 + row * 4, 1, 2);
    }
  }
  fill(ctx, '#ffd166', px + 11, py + 18, 4, 2);
}

// Mancala Robot seated at physical Mancala board table
function renderMancalaRobot(ctx: CanvasRenderingContext2D, prop: ArcadeProp) {
  const centerX = (prop.x + prop.w / 2) * 16;
  const py = prop.y * 16;

  // Antenna & bulb
  fill(ctx, C_DARK, centerX - 1, py - 20, 2, 7);
  fill(ctx, C_DARK, centerX - 3, py - 24, 6, 5);
  fill(ctx, '#7dffb0', centerX - 2, py - 23, 4, 3);

  // Robot Head
  fill(ctx, C_DARK, centerX - 12, py - 14, 24, 19);
  fill(ctx, C_ROBOT_BODY, centerX - 11, py - 13, 22, 17);
  fill(ctx, C_DARK, centerX - 14, py - 9, 3, 8);
  fill(ctx, C_DARK, centerX + 11, py - 9, 3, 8);

  // Screen & Face
  fill(ctx, '#14202c', centerX - 8, py - 10, 16, 11);
  fill(ctx, C_ROBOT_CYAN, centerX - 5, py - 7, 2, 3);
  fill(ctx, C_ROBOT_CYAN, centerX + 3, py - 7, 2, 3);
  fill(ctx, C_ROBOT_CYAN, centerX - 3, py - 2, 6, 1);
  fill(ctx, C_ROBOT_CYAN, centerX - 4, py - 3, 1, 1);
  fill(ctx, C_ROBOT_CYAN, centerX + 3, py - 3, 1, 1);

  // Neck & Torso
  fill(ctx, C_DARK, centerX - 4, py + 5, 8, 4);
  fill(ctx, C_DARK, centerX - 10, py + 8, 20, 10);
  fill(ctx, C_ROBOT_BODY, centerX - 9, py + 9, 18, 9);
  fill(ctx, '#ff7a59', centerX - 5, py + 11, 2, 2);
  fill(ctx, '#ffd166', centerX - 1, py + 11, 2, 2);
  fill(ctx, '#59f0d0', centerX + 3, py + 11, 2, 2);

  // Arms
  fill(ctx, C_DARK, centerX - 15, py + 9, 5, 10);
  fill(ctx, C_ROBOT_SHADOW, centerX - 14, py + 10, 3, 9);
  fill(ctx, C_DARK, centerX + 10, py + 9, 5, 10);
  fill(ctx, C_ROBOT_SHADOW, centerX + 11, py + 10, 3, 9);

  // Wooden Mancala Table
  const tableX = prop.x * 16 + 1;
  const tableY = (prop.y + 1) * 16;
  const tableW = prop.w * 16 - 2;

  fill(ctx, 'rgba(0,0,0,0.35)', tableX + 2, tableY + 30, tableW, 3);
  fill(ctx, C_DARK, tableX, tableY, tableW, 24);
  fill(ctx, '#c98f5c', tableX + 1, tableY + 1, tableW - 2, 18);
  fill(ctx, '#9c6a3f', tableX + 1, tableY + 19, tableW - 2, 4);
  fill(ctx, C_DARK, tableX + 3, tableY + 23, 3, 9);
  fill(ctx, C_DARK, tableX + tableW - 6, tableY + 23, 3, 9);

  // Physical Mancala Board on the table
  const boardX = tableX + 4;
  const boardY = tableY + 3;
  const boardW = tableW - 8;

  fill(ctx, C_DARK, boardX, boardY, boardW, 14);
  fill(ctx, '#8a5a3b', boardX + 1, boardY + 1, boardW - 2, 12);
  fill(ctx, '#5e3a22', boardX + 2, boardY + 3, 4, 8);
  fill(ctx, '#5e3a22', boardX + boardW - 6, boardY + 3, 4, 8);

  // Mancala pits with colorful little stones
  for (let pitIdx = 0; pitIdx < 6; pitIdx++) {
    const pitX = boardX + 9 + pitIdx * 4;
    for (const pitRow of [boardY + 3, boardY + 8]) {
      fill(ctx, '#5e3a22', pitX, pitRow, 3, 3);
      fill(ctx, CONFETTI_COLORS[(pitIdx + pitRow) % CONFETTI_COLORS.length], pitX + 1, pitRow + 1, 1, 1);
    }
  }
}

// Create an offscreen pre-baked canvas for the arcade interior
export function createArcadeBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ARCADE_COLS * 16;
  canvas.height = ARCADE_ROWS * 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  // 1. Draw checkered confetti floor
  for (let y = 2; y < ARCADE_ROWS - 1; y++) {
    for (let x = 1; x < ARCADE_COLS - 1; x++) {
      renderFloorTile(ctx, x, y);
    }
  }

  // 2. Draw wall marquee and framing
  renderArcadeWall(ctx);

  // 3. Draw center rug
  renderCenterRug(ctx);

  // 4. Draw props sorted by Y-depth
  const sorted = [...ARCADE_PROPS].sort((a, b) => a.y + a.h - (b.y + b.h));
  sorted.forEach((prop) => {
    switch (prop.style) {
      case 'exit':
        renderExitMat(ctx, prop);
        break;
      case 'robot':
        renderMancalaRobot(ctx, prop);
        break;
      case 'vending':
        renderVendingMachine(ctx, prop);
        break;
      case 'claw':
        renderClawMachine(ctx, prop);
        break;
      case 'plant':
        renderArcadePlant(ctx, prop);
        break;
      case 'scoreboard':
        renderScoreboard(ctx, prop);
        break;
      default:
        renderArcadeCabinet(ctx, prop);
        break;
    }
  });

  return canvas;
}
