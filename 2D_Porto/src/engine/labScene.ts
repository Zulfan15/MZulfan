import type { Dir } from './types';
import { drawPixelText } from './devScene';

export const LAB_COLS = 13;
export const LAB_ROWS = 15;
export const LAB_SPAWN: { x: number; y: number; dir: Dir } = { x: 6, y: 13, dir: 'up' };

export interface LabPropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface LabProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: LabPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
  door?: { x: number; y: number };
}

// Deterministic fast hash [0, 1)
function hashNoise(x: number, y: number, seed = 0): number {
  let r = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  r = Math.imul(r ^ (r >>> 13), 1274126177);
  return ((r ^ (r >>> 16)) >>> 0) / 4294967296;
}

// Color Palette for Lab Scene
const C_INK = '#10201b';
const C_WALL = '#d9ece6';
const C_WALL_BORDER = '#b9d6cc';
const C_WALL_DARK = '#8fbfb0';
const C_FLOOR = '#eef3f1';
const C_FLOOR_LINE = '#d3dedb';
const C_BORDER_GREY = '#a9b8bf';
const C_GREY = '#7f9099';
const C_LIGHT_GREY = '#d4dee3';
const C_DARK_GREY = '#2d3a40';
const C_MID_GREY = '#3e5059';
const C_TEAL = '#3f8f7a';
const C_GREEN = '#38c98a';
const C_BLUE = '#4a90d9';
const C_AMBER = '#f2a33a';
const C_RED = '#e2574c';
const C_PURPLE = '#8a6fbf';
const C_WHITE = '#ffffff';
const C_WOOD = '#c89a64';

export const LAB_PROPS: LabProp[] = [
  {
    id: 'lab-posters',
    kind: 'prop',
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    target: { type: 'event', name: 'lab-posters' },
    label: 'Poster wall',
    style: 'lab-posters',
    labelLift: 28,
    hint: 'Read the posters 📜',
  },
  {
    id: 'lab-whiteboard',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 5,
    h: 1,
    target: { type: 'event', name: 'lab-whiteboard' },
    label: 'Whiteboard',
    style: 'lab-whiteboard',
    labelLift: 28,
    hint: 'Read the whiteboard ✏️',
  },
  {
    id: 'lab-bench',
    kind: 'prop',
    x: 4,
    y: 7,
    w: 5,
    h: 2,
    target: { type: 'event', name: 'lab-bench' },
    label: 'Lab bench',
    style: 'lab-bench',
    labelLift: 6,
    hint: 'Look over the bench 🧪',
  },
  {
    id: 'hood',
    kind: 'prop',
    x: 11,
    y: 3,
    w: 1,
    h: 2,
    target: {
      type: 'note',
      text: 'A fume hood, humming. Nothing in it is on fire, which counts as a good day in an edge AI hardware lab.',
    },
    label: 'Fume hood',
    style: 'hood',
    hideLabel: true,
  },
  {
    id: 'fridge',
    kind: 'prop',
    x: 11,
    y: 9,
    w: 1,
    h: 2,
    target: {
      type: 'note',
      text: 'A sample fridge. The label on the door says "NOT FOR LUNCH — LIQUID COOLING CHEMICALS", underlined twice.',
    },
    label: 'Sample fridge',
    style: 'fridge',
    hideLabel: true,
  },
  {
    id: 'book-aeroscan',
    kind: 'prop',
    x: 1,
    y: 11,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: 'AeroScan: Tactical Edge AI & Aerial Surveillance. YOLOv11x + TensorRT FP16 quantization on NVIDIA Jetson Orin Nano with 99.4% mAP and 3.2ms latency.',
    },
    label: 'AeroScan Edge AI',
    style: 'book-aeroscan',
    hideLabel: true,
  },
  {
    id: 'book-spam',
    kind: 'prop',
    x: 2,
    y: 11,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: 'SMS & WhatsApp Spam Detection with Indonesian Slang Normalization. 99.56% accuracy thesis analyzing 4,000+ texts with lexical slang expansion.',
    },
    label: 'Spam Classifier Thesis',
    style: 'book-spam',
    hideLabel: true,
  },
  {
    id: 'book-omr',
    kind: 'prop',
    x: 3,
    y: 11,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: 'Automated OMR Answer Sheet Grader. Adaptive 4-point perspective transform and contour bubble detection with 99.8% grading accuracy across 100+ sheets.',
    },
    label: 'OMR Sheet Grader',
    style: 'book-omr',
    hideLabel: true,
  },
  {
    id: 'plant',
    kind: 'prop',
    x: 11,
    y: 12,
    w: 1,
    h: 1,
    target: {
      type: 'note',
      text: "A lab plant. Technically it's an uncontrolled variable, but it boosts model inference morale.",
    },
    label: 'Plant',
    style: 'plant',
    hideLabel: true,
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 6,
    y: 14,
    w: 1,
    h: 1,
    door: { x: 6, y: 14 },
    target: { type: 'place', id: 'town' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

// Lab Collision Matrix: 13 cols x 15 rows
export const LAB_COLLISION = new Uint8Array(LAB_COLS * LAB_ROWS);

for (let y = 0; y < LAB_ROWS; y++) {
  for (let x = 0; x < LAB_COLS; x++) {
    // Top walls: rows 0 & 1
    if (y < 2) LAB_COLLISION[y * LAB_COLS + x] = 1;
    // Left & Right boundary walls
    if (x === 0 || x === LAB_COLS - 1) LAB_COLLISION[y * LAB_COLS + x] = 1;
    // Bottom wall row 14 (except doorway at 6, 14)
    if (y === LAB_ROWS - 1 && x !== 6) LAB_COLLISION[y * LAB_COLS + x] = 1;
  }
}

function markLabSolid(x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const idx = (y + dy) * LAB_COLS + (x + dx);
      if (idx >= 0 && idx < LAB_COLLISION.length) {
        LAB_COLLISION[idx] = 1;
      }
    }
  }
}

// Mark solid obstacles
markLabSolid(4, 7, 5, 2);   // Lab bench
markLabSolid(11, 3, 1, 2);  // Fume hood
markLabSolid(11, 9, 1, 2);  // Sample fridge
markLabSolid(1, 11, 3, 1);  // Bookshelf / papers
markLabSolid(11, 12, 1, 1); // Plant

// Floor tile rendering
function renderFloorTile(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const rx = col * 16;
  const ry = row * 16;
  ctx.fillStyle = C_FLOOR;
  ctx.fillRect(rx, ry, 16, 16);
  ctx.fillStyle = C_FLOOR_LINE;
  ctx.fillRect(rx, ry, 16, 1);
  ctx.fillRect(rx, ry, 1, 16);
  ctx.fillRect(rx + 8, ry, 1, 16);
  ctx.fillRect(rx, ry + 8, 16, 1);
  if (hashNoise(col, row, 17) < 0.08) {
    ctx.fillStyle = '#dce8e4';
    ctx.fillRect(rx + 2, ry + 2, 5, 5);
  }
}

// Lab walls rendering
function renderLabWalls(ctx: CanvasRenderingContext2D) {
  const totalW = LAB_COLS * 16;
  // Top wall
  ctx.fillStyle = C_WALL;
  ctx.fillRect(0, 0, totalW, 32);
  ctx.fillStyle = C_WALL_BORDER;
  ctx.fillRect(0, 0, totalW, 3);
  ctx.fillRect(0, 26, totalW, 6);
  ctx.fillStyle = C_TEAL;
  ctx.fillRect(0, 25, totalW, 1);

  // Side walls
  for (let n = 2; n < LAB_ROWS; n++) {
    ctx.fillStyle = C_WALL_BORDER;
    ctx.fillRect(0, n * 16, 16, 16);
    ctx.fillRect(totalW - 16, n * 16, 16, 16);
  }
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(15, 32, 1, (LAB_ROWS - 3) * 16);
  ctx.fillRect(totalW - 16, 32, 1, (LAB_ROWS - 3) * 16);

  // Bottom wall
  const bottomY = (LAB_ROWS - 1) * 16;
  ctx.fillStyle = C_WALL_BORDER;
  ctx.fillRect(0, bottomY, totalW, 16);
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, bottomY, totalW, 1);
}

// Poster Wall rendering
function renderPosterWall(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16 + 2;
  const w = prop.w * 16 - 4;
  ctx.fillStyle = C_INK;
  ctx.fillRect(x - 1, 3, w + 2, 25);
  ctx.fillStyle = C_WOOD;
  ctx.fillRect(x, 4, w, 23);

  const colors = [C_BLUE, C_GREEN, C_PURPLE];
  for (let t = 0; t < 3; t++) {
    const px = x + 3 + t * 20;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(px + 1, 7, 16, 18);
    ctx.fillStyle = C_WHITE;
    ctx.fillRect(px, 6, 16, 18);
    ctx.fillStyle = colors[t];
    ctx.fillRect(px, 6, 16, 3);
    for (let l = 0; l < 3; l++) {
      ctx.fillStyle = '#b8c4cc';
      ctx.fillRect(px + 2, 11 + l * 2, 5, 1);
    }
    if (t === 1) {
      for (let n = 0; n < 3; n++) {
        ctx.fillStyle = colors[t];
        ctx.fillRect(px + 9 + n * 2, 16 - n * 2, 1, 2 + n * 2);
      }
    } else {
      ctx.fillStyle = colors[t];
      ctx.fillRect(px + 9, 11, 5, 5);
      ctx.fillStyle = C_WHITE;
      ctx.fillRect(px + 10, 12, 3, 3);
    }
    for (let l = 0; l < 2; l++) {
      ctx.fillStyle = '#b8c4cc';
      ctx.fillRect(px + 2, 18 + l * 2, 12, 1);
    }
    ctx.fillStyle = C_RED;
    ctx.fillRect(px + 7, 6, 2, 1);
  }
}

// Whiteboard rendering
function renderWhiteboard(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16 + 2;
  const w = prop.w * 16 - 4;
  ctx.fillStyle = C_INK;
  ctx.fillRect(x - 1, 3, w + 2, 25);
  ctx.fillStyle = C_GREY;
  ctx.fillRect(x, 4, w, 23);
  ctx.fillStyle = C_WHITE;
  ctx.fillRect(x + 1, 5, w - 2, 20);

  // Pen tray & markers
  ctx.fillStyle = C_BORDER_GREY;
  ctx.fillRect(x + 6, 25, 20, 2);
  ctx.fillStyle = C_RED;
  ctx.fillRect(x + 9, 25, 3, 1);
  ctx.fillStyle = C_BLUE;
  ctx.fillRect(x + 14, 25, 3, 1);

  // Header "NEXT:"
  drawPixelText(ctx, 'NEXT:', x + 4, 8, C_BLUE);

  // Todo items
  for (let t = 0; t < 3; t++) {
    ctx.fillStyle = C_BLUE;
    ctx.fillRect(x + 4, 15 + t * 3, 1, 1);
    ctx.fillStyle = '#5a6d78';
    ctx.fillRect(x + 6, 15 + t * 3, 14 + Math.floor(hashNoise(t, 2, 5) * 12), 1);
  }

  // Exponential growth curve
  const gx = x + w - 30;
  ctx.fillStyle = C_INK;
  ctx.fillRect(gx, 8, 1, 14);
  ctx.fillRect(gx, 21, 26, 1);
  for (let t = 0; t < 24; t++) {
    ctx.fillStyle = C_RED;
    ctx.fillRect(gx + 1 + t, 20 - Math.round((t * t) / 48), 1, 1);
  }
  for (let t = 0; t < 6; t++) {
    ctx.fillStyle = C_GREEN;
    ctx.fillRect(gx + 3 + t * 4, 19 - Math.round(hashNoise(t, 1, 9) * 8), 1, 1);
  }
}

// Lab Bench base
function renderLabBench(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16;
  const y = prop.y * 16;
  const w = prop.w * 16;
  const h = prop.h * 16;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x + 2, y + h, w, 3);

  // Bench table body
  ctx.fillStyle = C_INK;
  ctx.fillRect(x, y + 4, w, h - 4);
  ctx.fillStyle = C_MID_GREY;
  ctx.fillRect(x + 1, y + 5, w - 2, 12);
  ctx.fillStyle = '#4d6470';
  ctx.fillRect(x + 1, y + 5, w - 2, 1);
  ctx.fillStyle = C_DARK_GREY;
  ctx.fillRect(x + 1, y + 17, w - 2, h - 18);

  // Drawer handle lines
  for (let t = 0; t < 3; t++) {
    ctx.fillStyle = '#4d6470';
    ctx.fillRect(x + 8 + t * 26, y + 21, 10, 1);
  }

  // Microscope on left side
  const microPalette: Record<string, string> = { k: '#3a4448', s: C_LIGHT_GREY };
  const microSprite = [
    '..kk..',
    '..kk..',
    '.kkkk.',
    '..kk.k',
    '..kkkk',
    '.ssss.',
    'kkkkkk',
  ];
  for (let r = 0; r < microSprite.length; r++) {
    for (let c = 0; c < microSprite[r].length; c++) {
      const color = microPalette[microSprite[r][c]];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6 + c, y - 2 + r, 1, 1);
      }
    }
  }

  // Computer monitor stand & screen frame
  ctx.fillStyle = C_INK;
  ctx.fillRect(x + 22, y - 3, 18, 11);
  ctx.fillStyle = '#203038';
  ctx.fillRect(x + 23, y - 2, 16, 9);
  ctx.fillStyle = C_BORDER_GREY;
  ctx.fillRect(x + 20, y + 8, 22, 3);

  // Beaker with blue liquid
  ctx.fillStyle = C_INK;
  ctx.fillRect(x + 56, y + 2, 7, 9);
  ctx.fillStyle = '#cfe9f5';
  ctx.fillRect(x + 57, y + 3, 5, 7);
  ctx.fillStyle = C_BLUE;
  ctx.fillRect(x + 57, y + 6, 5, 4);

  // Test tube rack with colorful test tubes
  ctx.fillStyle = C_GREY;
  ctx.fillRect(x + 66, y + 6, 10, 2);
  const tubeColors = [C_RED, C_AMBER, C_GREEN];
  for (let t = 0; t < 3; t++) {
    ctx.fillStyle = C_INK;
    ctx.fillRect(x + 67 + t * 3, y - 1, 2, 8);
    ctx.fillStyle = tubeColors[t];
    ctx.fillRect(x + 67 + t * 3, y + 3, 2, 4);
  }
}

// Fume Hood
function renderFumeHood(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16;
  const y = prop.y * 16 - 8;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x + 2, y + 40, 14, 3);
  ctx.fillStyle = C_INK;
  ctx.fillRect(x, y, 16, 40);
  ctx.fillStyle = C_BORDER_GREY;
  ctx.fillRect(x + 1, y + 1, 14, 38);
  ctx.fillStyle = C_LIGHT_GREY;
  ctx.fillRect(x + 1, y + 1, 14, 2);
  // Glass chamber
  ctx.fillStyle = '#bfe3ee';
  ctx.fillRect(x + 2, y + 8, 12, 16);
  ctx.fillStyle = '#e6f6fb';
  ctx.fillRect(x + 3, y + 9, 3, 6);
  // Controls & lower cabinet
  ctx.fillStyle = C_GREY;
  ctx.fillRect(x + 2, y + 25, 12, 2);
  ctx.fillRect(x + 2, y + 30, 12, 8);
}

// Sample Fridge
function renderSampleFridge(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16 + 1;
  const y = prop.y * 16 - 6;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x + 2, y + 38, 14, 3);
  ctx.fillStyle = C_INK;
  ctx.fillRect(x, y, 14, 38);
  ctx.fillStyle = '#e9eef0';
  ctx.fillRect(x + 1, y + 1, 12, 36);
  ctx.fillStyle = C_BORDER_GREY;
  ctx.fillRect(x + 1, y + 14, 12, 1);
  // Handles
  ctx.fillStyle = C_GREY;
  ctx.fillRect(x + 10, y + 5, 1, 6);
  ctx.fillRect(x + 10, y + 18, 1, 8);
  // Warning label
  ctx.fillStyle = '#ffd23f';
  ctx.fillRect(x + 3, y + 4, 5, 4);
}

// Bookshelf & Papers
function renderBookshelf(ctx: CanvasRenderingContext2D, books: LabProp[]) {
  const minX = Math.min(...books.map((b) => b.x)) * 16;
  const y = books[0].y * 16;
  const w = books.length * 16;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(minX + 3, y + 14, w - 2, 2);

  // Shelf cabinet
  ctx.fillStyle = C_INK;
  ctx.fillRect(minX + 1, y - 26, w - 2, 41);
  ctx.fillStyle = '#c4dcd4';
  ctx.fillRect(minX + 2, y - 25, w - 4, 39);
  ctx.fillStyle = C_GREY;
  ctx.fillRect(minX + 2, y - 25, 2, 39);
  ctx.fillRect(minX + w - 4, y - 25, 2, 39);

  const shelves = [y - 23, y - 10, y + 3];
  for (const s of shelves) {
    ctx.fillStyle = C_BORDER_GREY;
    ctx.fillRect(minX + 2, s + 10, w - 4, 2);
    ctx.fillStyle = C_LIGHT_GREY;
    ctx.fillRect(minX + 2, s + 10, w - 4, 1);
  }

  // Top shelf binders
  const binderColors = [C_BLUE, C_TEAL, C_PURPLE, C_AMBER, C_RED, C_GREEN];
  binderColors.forEach((color, r) => {
    const bx = minX + 5 + r * 4;
    ctx.fillStyle = color;
    ctx.fillRect(bx, shelves[0], 3, 10);
    ctx.fillStyle = C_WHITE;
    ctx.fillRect(bx, shelves[0] + 2, 3, 2);
    ctx.fillStyle = C_INK;
    ctx.fillRect(bx + 1, shelves[0] + 6, 1, 1);
  });
  const bookStrips = [C_RED, C_WHITE, C_BLUE, C_AMBER];
  bookStrips.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(minX + w - 17, shelves[0] + 8 - idx * 2, 12, 2);
  });

  // Middle shelf research papers
  const paperColors = [C_BLUE, C_GREEN, C_PURPLE];
  books.forEach((b, idx) => {
    const px = b.x * 16 + 8;
    const py = shelves[1];
    ctx.fillStyle = C_INK;
    ctx.fillRect(px - 4, py - 1, 9, 11);
    ctx.fillStyle = C_WHITE;
    ctx.fillRect(px - 3, py, 7, 10);
    ctx.fillStyle = paperColors[idx % paperColors.length];
    ctx.fillRect(px - 3, py, 7, 3);
    ctx.fillStyle = '#b8c4cc';
    ctx.fillRect(px - 2, py + 5, 5, 1);
    ctx.fillRect(px - 2, py + 7, 3, 1);
    for (let t = 0; t < 4; t++) {
      ctx.fillStyle = C_GREY;
      ctx.fillRect(px - 4, py + 1 + t * 2, 1, 1);
    }
  });

  // Bottom shelf "DATA" box
  ctx.fillStyle = C_INK;
  ctx.fillRect(minX + 5, shelves[2] + 1, 21, 9);
  ctx.fillStyle = C_WOOD;
  ctx.fillRect(minX + 6, shelves[2] + 2, 19, 8);
  drawPixelText(ctx, 'DATA', minX + 8, shelves[2] + 3, C_INK);

  const bottomBinders = [C_GREEN, C_PURPLE, C_WHITE];
  bottomBinders.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(minX + w - 18 + idx * 4, shelves[2] + 2, 3, 8);
  });

  // Top "PAPERS" Header Badge
  const badgeX = minX + Math.floor(w / 2);
  ctx.fillStyle = C_INK;
  ctx.fillRect(badgeX - 14, y - 31, 29, 8);
  ctx.fillStyle = C_TEAL;
  ctx.fillRect(badgeX - 13, y - 30, 27, 6);
  drawPixelText(ctx, 'PAPERS', badgeX - 11, y - 30, C_WHITE);
}

// Potted Plant
function renderPlant(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16;
  const y = prop.y * 16;
  ctx.fillStyle = '#2f8a55';
  ctx.fillRect(x + 3, y - 4, 10, 8);
  ctx.fillStyle = '#47b06f';
  ctx.fillRect(x + 5, y - 6, 6, 6);
  ctx.fillStyle = '#236b42';
  ctx.fillRect(x + 2, y + 1, 3, 3);
  ctx.fillRect(x + 11, y + 1, 3, 3);
  // Pot
  ctx.fillStyle = C_INK;
  ctx.fillRect(x + 4, y + 6, 8, 9);
  ctx.fillStyle = '#c98f5c';
  ctx.fillRect(x + 5, y + 7, 6, 7);
}

// Exit Mat (doorway)
function renderExitMat(ctx: CanvasRenderingContext2D, prop: LabProp) {
  const x = prop.x * 16;
  const y = prop.y * 16;
  ctx.fillStyle = C_FLOOR;
  ctx.fillRect(x, y, 16, 16);
  ctx.fillStyle = '#2d6b5b';
  ctx.fillRect(x + 1, y + 1, 14, 13);
  ctx.fillStyle = C_TEAL;
  ctx.fillRect(x + 2, y + 2, 12, 11);
  // Down chevron arrows
  for (let t = 0; t < 4; t++) {
    ctx.fillStyle = C_WHITE;
    ctx.fillRect(x + 4 + t, y + 4 + t, 1, 2);
    ctx.fillRect(x + 11 - t, y + 4 + t, 1, 2);
  }
}

/**
 * Creates static background offscreen canvas for the Research Lab.
 */
export function createLabBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = LAB_COLS * 16;
  canvas.height = LAB_ROWS * 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Draw tiled laboratory floor
  for (let r = 2; r < LAB_ROWS - 1; r++) {
    for (let c = 1; c < LAB_COLS - 1; c++) {
      renderFloorTile(ctx, c, r);
    }
  }

  // 2. Draw surrounding teal walls and borders
  renderLabWalls(ctx);

  // 3. Render Bookshelf
  const books = LAB_PROPS.filter((p) => p.id.startsWith('book-'));
  if (books.length > 0) {
    renderBookshelf(ctx, books);
  }

  // 4. Render all props
  for (const prop of LAB_PROPS) {
    switch (prop.style) {
      case 'lab-posters':
        renderPosterWall(ctx, prop);
        break;
      case 'lab-whiteboard':
        renderWhiteboard(ctx, prop);
        break;
      case 'lab-bench':
        renderLabBench(ctx, prop);
        break;
      case 'hood':
        renderFumeHood(ctx, prop);
        break;
      case 'fridge':
        renderSampleFridge(ctx, prop);
        break;
      case 'plant':
        renderPlant(ctx, prop);
        break;
      case 'exit':
        renderExitMat(ctx, prop);
        break;
    }
  }

  return canvas;
}

/**
 * Renders dynamic animations on the Lab bench (pulsing chart + bubbling flask).
 */
export function renderLabAnimations(ctx: CanvasRenderingContext2D, now: number) {
  const bench = LAB_PROPS.find((p) => p.id === 'lab-bench');
  if (!bench) return;

  const bx = bench.x * 16;
  const by = bench.y * 16;
  const sec = Math.floor(now / 1000);

  // 1. Bubbling Erlenmeyer flask
  const flaskX = bx + 48;
  const flaskY = by - 1;

  // Flask matrix
  const flaskPalette: Record<string, string> = { o: C_INK, g: C_GREEN };
  const flaskSprite = [
    '..oo..',
    '..oo..',
    '.o..o.',
    'oggggo',
    'oggggo',
    '.oooo.',
  ];
  for (let r = 0; r < flaskSprite.length; r++) {
    for (let c = 0; c < flaskSprite[r].length; c++) {
      const color = flaskPalette[flaskSprite[r][c]];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(flaskX - 2 + c, flaskY + r, 1, 1);
      }
    }
  }

  // Bubbles rising from flask
  for (let t = 0; t < 2; t++) {
    const offset = (sec + t * 2) % 4;
    ctx.fillStyle = '#9ff0c6';
    ctx.fillRect(flaskX + (t ? 1 : 0), flaskY - 1 - offset, 1, 1);
  }

  // 2. Animated computer screen waveform on bench
  ctx.fillStyle = '#203038';
  ctx.fillRect(bx + 23, by - 2, 16, 9);
  const chartLength = (sec % 8) + 1;
  for (let t = 0; t < chartLength; t++) {
    ctx.fillStyle = C_GREEN;
    ctx.fillRect(
      bx + 24 + t * 2,
      by + 5 - Math.round(hashNoise(t, 4, 2) * 2 + t * 0.5),
      2,
      1
    );
  }
}
