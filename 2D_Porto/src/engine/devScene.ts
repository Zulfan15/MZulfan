import type { Dir } from './types';

export const DEV_COLS = 15;
export const DEV_ROWS = 19;
export const DEV_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 17, dir: 'up' };

export interface DevPropTarget {
  type: 'event' | 'note' | 'place';
  name?: string;
  text?: string;
  id?: string;
}

export interface DevProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: DevPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
  door?: { x: number; y: number };
}

// 5x3 Pixel Bitmap Font
const FONT: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  K: ['#.#', '#.#', '##.', '#.#', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#.#', '###', '###', '#.#', '#.#'],
  N: ['##.', '#.#', '#.#', '#.#', '#.#'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'],
  Q: ['.#.', '#.#', '#.#', '##.', '.##'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#.#', '#.#', '###', '###', '#.#'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'],
  0: ['###', '#.#', '#.#', '#.#', '###'],
  1: ['.#.', '##.', '.#.', '.#.', '###'],
  2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'],
  4: ['#.#', '#.#', '###', '..#', '..#'],
  5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
  8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  ':': ['...', '.#.', '...', '.#.', '...'],
  '-': ['...', '...', '###', '...', '...'],
  '.': ['...', '...', '...', '...', '.#.'],
  '/': ['..#', '..#', '.#.', '#..', '#..'],
  '&': ['.#.', '#.#', '.#.', '#.#', '.##'],
  '+': ['...', '.#.', '###', '.#.', '...'],
  ' ': ['...', '...', '...', '...', '...'],
};

export function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  const upper = text.toUpperCase();
  for (let s = 0; s < upper.length; s++) {
    const char = upper[s];
    const glyph = FONT[char];
    if (glyph) {
      for (let row = 0; row < glyph.length; row++) {
        const line = glyph[row];
        for (let col = 0; col < line.length; col++) {
          if (line[col] === '#') {
            ctx.fillStyle = color;
            ctx.fillRect(x + s * 4 + col, y + row, 1, 1);
          }
        }
      }
    }
  }
}

export function textPixelWidth(text: string): number {
  return Math.max(0, text.length * 4 - 1);
}

// Deterministic fast hash [0, 1)
function hashNoise(x: number, y: number, seed = 0): number {
  let r = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  r = Math.imul(r ^ (r >>> 13), 1274126177);
  return ((r ^ (r >>> 16)) >>> 0) / 4294967296;
}

// Draw pixel sprite grid
function drawSpriteMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  x: number,
  y: number,
  palette: Record<string, string>
) {
  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      const color = palette[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + c, y + r, 1, 1);
      }
    }
  }
}

// Midpoint circle fill
function fillCircle(
  ctx: CanvasRenderingContext2D,
  color: string,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.fillStyle = color;
  for (let dy = -radius; dy <= radius; dy++) {
    const dx = Math.floor(Math.sqrt(radius * radius - dy * dy));
    ctx.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
  }
}

export const DEV_PROPS: DevProp[] = [
  {
    id: 'timeline',
    kind: 'prop',
    x: 4,
    y: 1,
    w: 7,
    h: 1,
    target: { type: 'event', name: 'timeline' },
    label: 'Viewscreen',
    style: 'timeline',
    labelLift: 28,
    hint: 'Open the mission timeline ▶',
  },
  {
    id: 'dev-clock',
    kind: 'prop',
    x: 12,
    y: 1,
    w: 2,
    h: 1,
    target: { type: 'event', name: 'dev-clock' },
    label: 'Mission clock',
    style: 'dev-clock',
    hideLabel: true,
  },
  {
    id: 'radar',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'radar' },
    label: 'Stack radar',
    style: 'radar',
    labelLift: 0,
    hint: 'Scan the stack ◎',
  },
  {
    id: 'telemetry',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 3,
    target: { type: 'event', name: 'telemetry' },
    label: 'Telemetry',
    style: 'telemetry',
    labelLift: -6,
    hint: 'Read the telemetry 📈',
  },
  {
    id: 'console-wasm',
    kind: 'prop',
    x: 2,
    y: 8,
    w: 3,
    h: 1,
    target: {
      type: 'note',
      text: "Edge AI & TensorRT. Zulfan's YOLOv11s model, optimized with TensorRT 10: ~1.8 ms/frame (>500 FPS) on an RTX 4060. Real-time tactical reconnaissance and military aircraft classification.",
    },
    label: 'AI Inference Console',
    style: 'console-wasm',
    hideLabel: true,
  },
  {
    id: 'console-edge',
    kind: 'prop',
    x: 6,
    y: 8,
    w: 3,
    h: 1,
    target: {
      type: 'note',
      text: 'FoodLink Distributed Edge. High-concurrency event-driven architecture on Laravel 12, PostgreSQL 16 row locks, PostGIS, Redis 7 Lua mutexes, and Apache Kafka transactional outbox.',
    },
    label: 'Distributed Systems Console',
    style: 'console-edge',
    hideLabel: true,
  },
  {
    id: 'console-static',
    kind: 'prop',
    x: 10,
    y: 8,
    w: 3,
    h: 1,
    target: {
      type: 'note',
      text: 'Static First Architecture. Astro renders every page to lightweight static HTML at build time; responsive pixel-art engine and AI Twin run with zero bloat and buttery 60 FPS.',
    },
    label: 'Static Console',
    style: 'console-static',
    hideLabel: true,
  },
  {
    id: 'whiteboard',
    kind: 'prop',
    x: 1,
    y: 11,
    w: 1,
    h: 2,
    target: {
      type: 'note',
      text: 'Architecture Diagram: profile.yaml → static pages, 2D engine, AI Digital Twin and front desk knowledge base. Type-safe build-time generation with Zod schema validation.',
    },
    label: 'Whiteboard',
    style: 'whiteboard',
    hideLabel: true,
  },
  {
    id: 'rack',
    kind: 'prop',
    x: 13,
    y: 11,
    w: 1,
    h: 2,
    target: {
      type: 'note',
      text: 'Server Rack: High-performance compute node for model training, TensorRT FP16 quantization, and continuous deployment pipeline.',
    },
    label: 'Server rack',
    style: 'rack',
    hideLabel: true,
  },
  {
    id: 'coffee',
    kind: 'prop',
    x: 13,
    y: 14,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: 'Launch fuel: Hot Indonesian robusta coffee to fuel late-night model training and algorithm optimization.',
    },
    label: 'Coffee machine',
    style: 'coffee',
    hideLabel: true,
  },
  {
    id: 'plant',
    kind: 'prop',
    x: 1,
    y: 16,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: 'Mission Control Plant: A desk succulent thriving under LED grow lights, present through every successful deployment.',
    },
    label: 'Plant',
    style: 'plant',
    hideLabel: true,
  },
  {
    id: 'lebronette',
    kind: 'npc',
    x: 6,
    y: 13,
    w: 3,
    h: 2,
    target: { type: 'place', id: 'reception' },
    label: 'LeBronette',
    style: 'lebronette',
    labelLift: -2,
    hint: 'Talk to LeBronette 🎧',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 18,
    w: 1,
    h: 1,
    door: { x: 7, y: 18 },
    target: { type: 'place', id: 'town' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

// Collision Map (15x19)
export const DEV_COLLISION: Uint8Array = new Uint8Array(DEV_COLS * DEV_ROWS);

// Initialize walls & borders
for (let y = 0; y < DEV_ROWS; y++) {
  for (let x = 0; x < DEV_COLS; x++) {
    // Back wall rows 0 & 1
    if (y < 2) DEV_COLLISION[y * DEV_COLS + x] = 1;
    // Left & Right walls
    if (x === 0 || x === DEV_COLS - 1) DEV_COLLISION[y * DEV_COLS + x] = 1;
    // Bottom wall row 18 (except exit mat at 7, 18)
    if (y === DEV_ROWS - 1 && x !== 7) DEV_COLLISION[y * DEV_COLS + x] = 1;
  }
}

function markDevSolid(x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const idx = (y + dy) * DEV_COLS + (x + dx);
      if (idx >= 0 && idx < DEV_COLLISION.length) {
        DEV_COLLISION[idx] = 1;
      }
    }
  }
}

// Mark solid interior props
markDevSolid(1, 3, 2, 2);   // Stack radar
markDevSolid(12, 3, 2, 3);  // Telemetry wall
markDevSolid(2, 8, 3, 1);   // Console WASM
markDevSolid(6, 8, 3, 1);   // Console Edge
markDevSolid(10, 8, 3, 1);  // Console Static
markDevSolid(1, 11, 1, 2);  // Whiteboard
markDevSolid(13, 11, 1, 2); // Server rack
markDevSolid(13, 14, 1, 1); // Coffee machine
markDevSolid(1, 16, 1, 1);  // Plant
markDevSolid(6, 13, 3, 2);  // LeBronette desk

// Color Constants
const C_BG = '#070a14';
const C_WALL = '#151c33';
const C_WALL_DARK = '#0e1324';
const C_WALL_LINE = '#26325c';
const C_FLOOR = '#18203a';
const C_GROUT = '#111830';
const C_FLOOR_ACCENT = '#202a4a';
const C_FRAME = '#3a4670';
const C_DESK_BODY = '#2b3556';
const C_DESK_TOP = '#56659a';
const C_SCREEN_BG = '#041320';
const C_CYAN = '#3ee6ff';
const C_CYAN_DIM = '#1d6f86';
const C_GREEN = '#7dffb0';
const C_AMBER = '#ffc857';
const C_RED = '#ff5a6a';
const C_WHITE = '#f4f7ff';
const C_PURPLE = '#552583';
const C_GOLD = '#fdb927';

// Floor Tile
function drawFloorTile(ctx: CanvasRenderingContext2D, tx: number, ty: number) {
  const x = tx * 16;
  const y = ty * 16;
  ctx.fillStyle = C_FLOOR;
  ctx.fillRect(x, y, 16, 16);
  ctx.fillStyle = C_GROUT;
  ctx.fillRect(x, y, 16, 1);
  ctx.fillRect(x, y, 1, 16);
  ctx.fillStyle = C_FLOOR_ACCENT;
  ctx.fillRect(x + 2, y + 2, 1, 1);
  ctx.fillRect(x + 13, y + 13, 1, 1);
  if (hashNoise(tx, ty, 41) < 0.12) {
    ctx.fillStyle = C_GROUT;
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 4, y + 4 + i * 2, 8, 1);
    }
  }
}

// Mission Log Ticker Area
const VIEWSCREEN = { x: 67, y: 5, w: 106, h: 23 };
// Clock Area
const CLOCK = { x: 194, y: 10, w: 28, h: 11 };
// Radar Circle
const RADAR = { cx: 32, cy: 57, r: 11 };
// Telemetry Box
const TELEM = { x: 192, y: 40, w: 32, h: 52 };

// LeBronette Avatar Sprite (Receptionist)
const LEBRONETTE_SPRITE = [
  '...oooooo...',
  '..ohhhhhho..',
  '.ohhhhhhhho.',
  'bohhssssshob',
  'bohsesseshob',
  'gohsssssshob',
  '.gghsmmsshh.',
  '.ohhossoohho',
  'ohcccyycccho',
  'occcccycccco',
  'occcccccccco',
];

const LEBRONETTE_PALETTE: Record<string, string> = {
  o: '#1a1420',
  h: '#3a2418',
  s: '#c68a5e',
  e: '#1a1420',
  m: '#c23b52',
  c: C_PURPLE,
  y: C_GOLD,
  b: '#141218',
  g: '#8d8a99',
};

// Static Prop Drawers
function drawRadarHousing(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16;
  const ry = p.y * 16 - 6;
  const rw = p.w * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(rx + 2, ry + 38, rw - 2, 3);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx, ry, rw, 38);
  ctx.fillStyle = C_FRAME;
  ctx.fillRect(rx + 1, ry + 1, rw - 2, 36);
  ctx.fillStyle = C_DESK_TOP;
  ctx.fillRect(rx + 1, ry + 1, rw - 2, 1);
  fillCircle(ctx, C_BG, RADAR.cx, RADAR.cy, RADAR.r + 2);
  fillCircle(ctx, C_SCREEN_BG, RADAR.cx, RADAR.cy, RADAR.r);
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(rx + 2, ry + 28, rw - 4, 8);
  ctx.fillStyle = C_AMBER;
  ctx.fillRect(rx + 5, ry + 30, 2, 2);
  ctx.fillStyle = C_GREEN;
  ctx.fillRect(rx + 10, ry + 30, 2, 2);
  ctx.fillStyle = C_RED;
  ctx.fillRect(rx + 15, ry + 30, 2, 2);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx + 21, ry + 30, 6, 4);
  ctx.fillStyle = C_CYAN_DIM;
  ctx.fillRect(rx + 22, ry + 31, 4, 2);
}

function drawTelemetryHousing(ctx: CanvasRenderingContext2D) {
  const { x, y, w, h } = TELEM;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 2, y + h, w - 2, 3);
  ctx.fillStyle = C_BG;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(x + 1, y + 2, w - 2, 23);
  ctx.fillRect(x + 1, y + 27, w - 2, 9);
  ctx.fillRect(x + 1, y + 38, w - 2, h - 40);
  drawPixelText(ctx, 'LC', x + 2, y + 40, C_CYAN_DIM);
}

function drawConsole(
  ctx: CanvasRenderingContext2D,
  p: DevProp,
  kind: 'wasm' | 'edge' | 'static'
) {
  const cx = p.x * 16 + 1;
  const cw = p.w * 16 - 2;
  const cy = p.y * 16 - 14;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(cx + 2, p.y * 16 + 15, cw, 3);

  for (const mx of [cx + 4, cx + cw / 2 + 2]) {
    ctx.fillStyle = C_BG;
    ctx.fillRect(mx, cy, cw / 2 - 6, 13);
    ctx.fillStyle = C_SCREEN_BG;
    ctx.fillRect(mx + 1, cy + 1, cw / 2 - 8, 10);
    ctx.fillStyle = C_BG;
    ctx.fillRect(mx + cw / 4 - 4, cy + 13, 2, 3);
  }

  const leftMon = cx + 5;
  const rightMon = cx + cw / 2 + 3;
  const topMon = cy + 2;

  if (kind === 'wasm') {
    drawSpriteMatrix(
      ctx,
      ['r.r..r.r', '.rrrrrr.', 'rrwrrwrr', '.rrrrrr.', 'r.r..r.r'],
      leftMon + 4,
      topMon + 2,
      { r: '#f74c00', w: C_WHITE }
    );
    ctx.fillStyle = '#654ff0';
    ctx.fillRect(rightMon + 5, topMon + 1, 8, 8);
    drawPixelText(ctx, 'WA', rightMon + 6, topMon + 3, C_WHITE);
  } else if (kind === 'edge') {
    ctx.fillStyle = '#f38020';
    ctx.fillRect(leftMon + 3, topMon + 4, 11, 4);
    ctx.fillRect(leftMon + 5, topMon + 2, 5, 2);
    ctx.fillStyle = '#fbad41';
    ctx.fillRect(leftMon + 9, topMon + 3, 4, 2);
    for (let r = 0; r < 6; r++) {
      ctx.fillStyle = C_GREEN;
      ctx.fillRect(
        rightMon + 2 + r * 3,
        topMon + 8 - Math.floor(hashNoise(r, 3, 9) * 6),
        2,
        1 + Math.floor(hashNoise(r, 3, 9) * 6)
      );
    }
  } else {
    for (let r = 0; r < 4; r++) {
      ctx.fillStyle = r % 2 ? C_CYAN_DIM : C_CYAN;
      ctx.fillRect(
        leftMon + 2 + (r % 2) * 2,
        topMon + 1 + r * 2,
        8 + Math.floor(hashNoise(r, 7, 2) * 5),
        1
      );
    }
    drawSpriteMatrix(
      ctx,
      ['..w..', '.www.', '.wcw.', '.www.', 'ww.ww', '.o.o.'],
      rightMon + 6,
      topMon + 2,
      { w: C_WHITE, c: C_CYAN, o: C_AMBER }
    );
  }

  // Desk surface & front
  ctx.fillStyle = C_BG;
  ctx.fillRect(cx, p.y * 16, cw, 16);
  ctx.fillStyle = C_FRAME;
  ctx.fillRect(cx + 1, p.y * 16 + 1, cw - 2, 5);
  ctx.fillStyle = C_DESK_TOP;
  ctx.fillRect(cx + 1, p.y * 16 + 1, cw - 2, 1);
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(cx + 1, p.y * 16 + 6, cw - 2, 9);
  for (let n = 0; n < 6; n++) {
    ctx.fillStyle = [C_AMBER, C_GREEN, C_CYAN, C_RED][n % 4];
    ctx.fillRect(cx + 5 + n * 6, p.y * 16 + 3, 2, 1);
  }
}

function drawWhiteboard(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16 + 1;
  const ry = p.y * 16 - 6;
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx, ry, 14, 34);
  ctx.fillStyle = '#e8ecf6';
  ctx.fillRect(rx + 1, ry + 1, 12, 32);
  ctx.fillStyle = C_RED;
  ctx.fillRect(rx + 3, ry + 3, 8, 4);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx + 6, ry + 7, 1, 6);
  ctx.fillRect(rx + 3, ry + 12, 7, 1);
  const colors = [C_CYAN_DIM, C_GREEN, C_AMBER];
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(rx + 2, ry + 15 + i * 6, 10, 4);
  }
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(rx + 1, ry + 33, 12, 2);
}

function drawServerRack(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16 + 1;
  const ry = p.y * 16 - 8;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(rx + 2, ry + 40, 14, 3);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx, ry, 14, 40);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = '#1d2340';
    ctx.fillRect(rx + 1, ry + 2 + i * 6, 12, 5);
    ctx.fillStyle = '#2a3256';
    ctx.fillRect(rx + 1, ry + 2 + i * 6, 12, 1);
  }
  ctx.fillStyle = '#f38020';
  ctx.fillRect(rx + 2, ry + 37, 10, 1);
}

function drawCoffeeMachine(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16 + 2;
  const ry = p.y * 16 - 6;
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx, ry, 12, 20);
  ctx.fillStyle = '#8a8fa8';
  ctx.fillRect(rx + 1, ry + 1, 10, 18);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx + 3, ry + 3, 6, 3);
  ctx.fillStyle = C_GREEN;
  ctx.fillRect(rx + 4, ry + 4, 1, 1);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx + 3, ry + 9, 6, 7);
  ctx.fillStyle = C_WHITE;
  ctx.fillRect(rx + 4, ry + 12, 4, 4);
  ctx.fillStyle = '#6b3e1e';
  ctx.fillRect(rx + 5, ry + 12, 2, 1);
}

function drawPlant(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16;
  const ry = p.y * 16;
  ctx.fillStyle = '#2f8a55';
  ctx.fillRect(rx + 3, ry - 4, 10, 8);
  ctx.fillStyle = '#47b06f';
  ctx.fillRect(rx + 5, ry - 6, 6, 6);
  ctx.fillStyle = '#236b42';
  ctx.fillRect(rx + 2, ry + 1, 3, 3);
  ctx.fillRect(rx + 11, ry + 1, 3, 3);
  ctx.fillStyle = C_BG;
  ctx.fillRect(rx + 4, ry + 6, 8, 9);
  ctx.fillStyle = C_DESK_TOP;
  ctx.fillRect(rx + 5, ry + 7, 6, 7);
}

function drawLeBronetteDesk(ctx: CanvasRenderingContext2D, p: DevProp) {
  const cx = (p.x + p.w / 2) * 16;
  const cy = (p.y + 1) * 16 - 4;

  // LeBronette avatar
  drawSpriteMatrix(
    ctx,
    LEBRONETTE_SPRITE,
    cx - 6,
    cy - LEBRONETTE_SPRITE.length,
    LEBRONETTE_PALETTE
  );
  ctx.fillStyle = C_BG;
  ctx.fillRect(cx - 8, cy - 6, 2, 6);
  ctx.fillRect(cx + 6, cy - 6, 2, 6);

  // Front desk
  const dx = p.x * 16 - 2;
  const dw = p.w * 16 + 4;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(dx + 2, cy + 20, dw, 3);
  ctx.fillStyle = C_BG;
  ctx.fillRect(dx, cy, dw, 20);
  ctx.fillStyle = C_DESK_TOP;
  ctx.fillRect(dx + 1, cy + 1, dw - 2, 3);
  ctx.fillStyle = C_FRAME;
  ctx.fillRect(dx + 1, cy + 4, dw - 2, 15);
  ctx.fillStyle = C_BG;
  ctx.fillRect(dx + 4, cy - 9, 10, 9);
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(dx + 5, cy - 8, 8, 7);
  ctx.fillStyle = C_BG;
  ctx.fillRect(dx + dw - 12, cy - 3, 8, 3);

  // "LEBRONETTE" Nameplate
  const name = 'LEBRONETTE';
  const nw = textPixelWidth(name);
  ctx.fillStyle = C_BG;
  ctx.fillRect(cx - nw / 2 - 2, cy + 7, nw + 4, 9);
  drawPixelText(ctx, name, Math.round(cx - nw / 2), cy + 9, C_GOLD);
}

function drawExitMat(ctx: CanvasRenderingContext2D, p: DevProp) {
  const rx = p.x * 16;
  const ry = p.y * 16;
  ctx.fillStyle = C_FLOOR;
  ctx.fillRect(rx, ry, 16, 16);
  ctx.fillStyle = '#0a3a48';
  ctx.fillRect(rx + 1, ry + 1, 14, 13);
  ctx.fillStyle = '#0f5266';
  ctx.fillRect(rx + 2, ry + 2, 12, 11);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = C_CYAN;
    ctx.fillRect(rx + 4 + i, ry + 4 + i, 1, 2);
    ctx.fillRect(rx + 11 - i, ry + 4 + i, 1, 2);
  }
}

/**
 * Creates the static pre-rendered background canvas for Dev Center interior.
 */
export function createDevBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = DEV_COLS * 16;
  canvas.height = DEV_ROWS * 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Draw floor tiles
  for (let y = 2; y < DEV_ROWS - 1; y++) {
    for (let x = 1; x < DEV_COLS - 1; x++) {
      drawFloorTile(ctx, x, y);
    }
  }

  // 2. Draw walls & borders
  const totalW = DEV_COLS * 16;
  ctx.fillStyle = C_WALL;
  ctx.fillRect(0, 0, totalW, 32);
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, totalW, 3);
  ctx.fillRect(0, 26, totalW, 6);
  ctx.fillStyle = C_CYAN_DIM;
  ctx.fillRect(0, 25, totalW, 1);

  for (let r = 6; r < totalW; r += 10) {
    ctx.fillStyle = r % 30 === 16 ? C_AMBER : C_CYAN_DIM;
    ctx.fillRect(r, 4, 2, 1);
  }

  drawPixelText(ctx, 'MISSION', 22, 9, C_CYAN);
  drawPixelText(ctx, 'CONTROL', 22, 16, C_CYAN);
  ctx.fillStyle = C_CYAN_DIM;
  ctx.fillRect(20, 22, 31, 1);

  // Side borders
  for (let r = 2; r < DEV_ROWS; r++) {
    ctx.fillStyle = C_WALL_DARK;
    ctx.fillRect(0, r * 16, 16, 16);
    ctx.fillRect(totalW - 16, r * 16, 16, 16);
  }
  ctx.fillStyle = C_WALL_LINE;
  ctx.fillRect(15, 32, 1, (DEV_ROWS - 3) * 16);
  ctx.fillRect(totalW - 16, 32, 1, (DEV_ROWS - 3) * 16);

  // Bottom wall
  const bottomY = (DEV_ROWS - 1) * 16;
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, bottomY, totalW, 16);
  ctx.fillStyle = C_WALL_LINE;
  ctx.fillRect(0, bottomY, totalW, 1);

  // 3. Ambient blue-cyan lighting
  ctx.fillStyle = 'rgba(62, 230, 255, 0.07)';
  ctx.fillRect(48, 32, 144, 16);
  ctx.fillStyle = 'rgba(62, 230, 255, 0.05)';
  ctx.fillRect(64, 48, 112, 16);

  // 4. Viewscreen housing
  ctx.fillStyle = C_BG;
  ctx.fillRect(VIEWSCREEN.x - 3, VIEWSCREEN.y - 3, VIEWSCREEN.w + 6, VIEWSCREEN.h + 6);
  ctx.fillStyle = C_FRAME;
  ctx.fillRect(VIEWSCREEN.x - 2, VIEWSCREEN.y - 2, VIEWSCREEN.w + 4, VIEWSCREEN.h + 4);
  ctx.fillStyle = C_DESK_TOP;
  ctx.fillRect(VIEWSCREEN.x - 2, VIEWSCREEN.y - 2, VIEWSCREEN.w + 4, 1);
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(VIEWSCREEN.x, VIEWSCREEN.y, VIEWSCREEN.w, VIEWSCREEN.h);
  ctx.fillStyle = C_DESK_BODY;
  ctx.fillRect(VIEWSCREEN.x + 10, VIEWSCREEN.y + VIEWSCREEN.h + 3, 4, 2);
  ctx.fillRect(VIEWSCREEN.x + VIEWSCREEN.w - 14, VIEWSCREEN.y + VIEWSCREEN.h + 3, 4, 2);

  // 5. Clock housing
  ctx.fillStyle = C_BG;
  ctx.fillRect(CLOCK.x - 1, CLOCK.y - 1, CLOCK.w + 2, CLOCK.h + 2);
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(CLOCK.x, CLOCK.y, CLOCK.w, CLOCK.h);
  drawPixelText(ctx, 'ET', CLOCK.x + 10, CLOCK.y - 7, C_CYAN_DIM);

  // 6. Draw Props
  for (const prop of DEV_PROPS) {
    switch (prop.style) {
      case 'radar':
        drawRadarHousing(ctx, prop);
        break;
      case 'telemetry':
        drawTelemetryHousing(ctx);
        break;
      case 'console-wasm':
        drawConsole(ctx, prop, 'wasm');
        break;
      case 'console-edge':
        drawConsole(ctx, prop, 'edge');
        break;
      case 'console-static':
        drawConsole(ctx, prop, 'static');
        break;
      case 'whiteboard':
        drawWhiteboard(ctx, prop);
        break;
      case 'rack':
        drawServerRack(ctx, prop);
        break;
      case 'coffee':
        drawCoffeeMachine(ctx, prop);
        break;
      case 'plant':
        drawPlant(ctx, prop);
        break;
      case 'lebronette':
        drawLeBronetteDesk(ctx, prop);
        break;
      case 'exit':
        drawExitMat(ctx, prop);
        break;
    }
  }

  return canvas;
}

// Dynamic Animated Data State
export interface DevTimelineItem {
  label: string;
  kind: 'project' | 'role' | 'school' | 'honor';
  year: string;
  t: number;
}

export interface DevRadarBlip {
  hex: string;
  r: number;
  a: number;
}

export interface DevLeetCodeStats {
  easy: number;
  medium: number;
  hard: number;
  totals: { easy: number; medium: number; hard: number; all?: number };
}

export interface DevFeedState {
  timeline: DevTimelineItem[];
  blips: DevRadarBlip[];
  heat: number[] | null;
  streak: number | null;
  leet: DevLeetCodeStats | null;
}

const KIND_COLORS: Record<string, [string, string]> = {
  project: ['#3ee6ff', '#1d6f86'],
  role: ['#ffc857', '#8a6a2a'],
  school: ['#7dffb0', '#2f8a5a'],
  honor: ['#fdb927', '#8a6a1a'],
};

const devFeed: DevFeedState = {
  timeline: [],
  blips: [],
  heat: null,
  streak: null,
  leet: null,
};

export function setDevFeed(feed: Partial<DevFeedState>) {
  Object.assign(devFeed, feed);
}

// 1. Animate Mission Log Viewscreen
function renderViewscreen(ctx: CanvasRenderingContext2D, now: number) {
  const { x, y, w, h } = VIEWSCREEN;
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(x, y, w, h);
  drawPixelText(ctx, 'MISSION LOG', x + 3, y + 3, C_CYAN_DIM);

  const list = devFeed.timeline;
  if (!list || list.length === 0) {
    const blink = Math.floor(now / 600) % 2 === 0;
    drawPixelText(ctx, 'STANDBY', x + 3, y + 10, blink ? C_CYAN : C_CYAN_DIM);
    return;
  }

  const cycleMs = 2500;
  const idx = Math.floor(now / cycleMs) % list.length;
  const mission = list[idx];

  const counter = `${String(idx + 1).padStart(2, '0')}/${String(list.length).padStart(2, '0')}`;
  drawPixelText(ctx, counter, x + w - textPixelWidth(counter) - 3, y + 3, C_CYAN_DIM);

  const colors = KIND_COLORS[mission.kind] || KIND_COLORS.project;
  drawPixelText(ctx, mission.label.slice(0, 18), x + 3, y + 10, colors[0]);
  drawPixelText(ctx, mission.year, x + w - textPixelWidth(mission.year) - 3, y + 10, C_WHITE);

  // Progress track
  const trackX = x + 4;
  const trackW = w - 8;
  const trackY = y + 19;
  ctx.fillStyle = C_CYAN_DIM;
  ctx.fillRect(trackX, trackY, trackW, 1);

  const t0 = list[0].t;
  const tRange = Math.max(1, list[list.length - 1].t - t0);

  list.forEach((m, i) => {
    const px = trackX + Math.round(((m.t - t0) / tRange) * (trackW - 1));
    const active = i === idx;
    const mColors = KIND_COLORS[m.kind] || KIND_COLORS.project;
    ctx.fillStyle = active ? C_WHITE : mColors[1];
    ctx.fillRect(px, trackY - (active ? 3 : 1), 1, active ? 4 : 2);
  });
}

// 2. Animate Stack Radar
function renderRadar(ctx: CanvasRenderingContext2D, now: number) {
  const { cx, cy, r } = RADAR;
  fillCircle(ctx, C_SCREEN_BG, cx, cy, r);

  // Dashed range ring
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    ctx.fillStyle = '#0b3240';
    ctx.fillRect(
      cx + Math.round((r / 2) * Math.cos(angle)),
      cy + Math.round((r / 2) * Math.sin(angle)),
      1,
      1
    );
  }
  ctx.fillStyle = '#0b3240';
  ctx.fillRect(cx - r, cy, r * 2 + 1, 1);
  ctx.fillRect(cx, cy - r, 1, r * 2 + 1);

  // Sweeping ray
  const sweepAngle = ((now / 8000) % 1) * Math.PI * 2;
  ctx.fillStyle = C_GREEN;
  for (let d = 0; d <= r; d++) {
    ctx.fillRect(
      cx + Math.round(Math.cos(sweepAngle) * d),
      cy + Math.round(Math.sin(sweepAngle) * d),
      1,
      1
    );
  }

  // Radar Blips
  for (const blip of devFeed.blips) {
    const bx = cx + Math.round(Math.cos(blip.a) * blip.r * (r - 1));
    const by = cy + Math.round(Math.sin(blip.a) * blip.r * (r - 1));
    const diff = (sweepAngle - blip.a + Math.PI * 4) % (Math.PI * 2);
    ctx.fillStyle = diff < 1.6 ? blip.hex : '#1e5a52';
    ctx.fillRect(bx, by, 1, 1);
  }
}

// 3. Animate Telemetry Wall
function renderTelemetry(ctx: CanvasRenderingContext2D, now: number) {
  const { x, y, w, h } = TELEM;
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(x + 1, y + 2, w - 2, 23);
  ctx.fillRect(x + 1, y + 27, w - 2, 9);
  ctx.fillRect(x + 12, y + 38, w - 13, h - 40);

  // Heat map grid (10 cols x 7 rows)
  const greenShades = ['#0d2a22', '#1b6b45', '#2fa765', '#5fe08e', '#b6ffcf'];
  const heat = devFeed.heat;
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 7; row++) {
      const heatIdx = heat ? heat.length - (10 - col) * 7 + row : -1;
      const val =
        heat && heatIdx >= 0
          ? heat[heatIdx]
          : Math.floor(hashNoise(col, row, Math.floor(now / 4000)) * 2);
      ctx.fillStyle = greenShades[val] ?? greenShades[0];
      ctx.fillRect(x + 2 + col * 3, y + 3 + row * 3, 2, 2);
    }
  }

  // Streak counter (e.g. 15D)
  const streakText = devFeed.streak === null ? '--' : `${devFeed.streak}D`;
  const blink = Math.floor(now / 1000) % 2 === 0 || devFeed.streak === null;
  drawPixelText(
    ctx,
    streakText,
    x + Math.round((w - textPixelWidth(streakText)) / 2),
    y + 29,
    blink ? C_GREEN : '#3fbf7a'
  );

  // LeetCode dials
  const leet = devFeed.leet;
  const bars: [number, string][] = leet
    ? [
        [leet.easy / Math.max(1, leet.totals.easy), '#00b8a3'],
        [leet.medium / Math.max(1, leet.totals.medium), '#ffc01e'],
        [leet.hard / Math.max(1, leet.totals.hard), '#ff375f'],
      ]
    : [
        [0.4, '#00b8a3'],
        [0.25, '#ffc01e'],
        [0.1, '#ff375f'],
      ];

  bars.forEach(([ratio, color], i) => {
    const barX = x + 12 + i * 6;
    const barY = y + 39;
    ctx.fillStyle = '#10213a';
    ctx.fillRect(barX, barY, 4, 12);
    const height = Math.max(1, Math.min(12, Math.round(Math.sqrt(ratio) * 12)));
    ctx.fillStyle = color;
    ctx.fillRect(barX, barY + 12 - height, 4, height);
  });
}

// 4. Server Rack Blinking LEDs
function renderRackLights(ctx: CanvasRenderingContext2D, now: number) {
  const rack = DEV_PROPS.find((p) => p.id === 'rack');
  if (!rack) return;
  const rx = rack.x * 16 + 1;
  const ry = rack.y * 16 - 8;
  const step = Math.floor(now / 700);

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 3; c++) {
      const active = hashNoise(r, c, step) < 0.55;
      ctx.fillStyle = active ? (c === 2 ? C_AMBER : C_GREEN) : '#0e1a14';
      ctx.fillRect(rx + 3 + c * 3, ry + 4 + r * 6, 1, 1);
    }
  }
}

// 5. Mission Clock
function renderClock(ctx: CanvasRenderingContext2D) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  ctx.fillStyle = C_SCREEN_BG;
  ctx.fillRect(CLOCK.x, CLOCK.y, CLOCK.w, CLOCK.h);
  drawPixelText(
    ctx,
    timeStr,
    CLOCK.x + Math.round((CLOCK.w - textPixelWidth(timeStr)) / 2),
    CLOCK.y + 3,
    C_RED
  );
}

// 6. LeBronette Headset Blinking Light
function renderLeBronetteLight(ctx: CanvasRenderingContext2D, now: number) {
  const npc = DEV_PROPS.find((p) => p.id === 'lebronette');
  if (!npc) return;
  const cx = (npc.x + npc.w / 2) * 16;
  const cy = (npc.y + 1) * 16 - 4;
  const blink = Math.floor(now / 900) % 2 === 0;
  ctx.fillStyle = blink ? C_RED : '#5a1a22';
  ctx.fillRect(cx - 5, cy - LEBRONETTE_SPRITE.length + 6, 1, 1);
}

/**
 * Call in requestAnimationFrame to render all live dynamic instrumentation in Mission Control.
 */
export function renderDevAnimations(ctx: CanvasRenderingContext2D, now: number) {
  renderViewscreen(ctx, now);
  renderRadar(ctx, now);
  renderTelemetry(ctx, now);
  renderRackLights(ctx, now);
  renderClock(ctx);
  renderLeBronetteLight(ctx, now);
}
