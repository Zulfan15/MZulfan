import { TILE_SIZE, drawCharacter, drawPixelMatrix } from './sprites';
import { drawPixelText } from './devScene';
import type { Dir } from './types';

export const NEIGHBOUR_COLS = 15;
export const NEIGHBOUR_ROWS = 12;

export const NEIGHBOUR_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

export interface NeighbourProp {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  target: {
    type: 'event' | 'note' | 'place';
    name?: string;
    text?: string;
    id?: string;
  };
}

// 15x12 Collision Grid (1 = solid, 0 = walkable)
export const NEIGHBOUR_COLLISION: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // Y=0: North Cottage Timber & Hearth Wall
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // Y=1: North Wall Windows & Fireplace Chimney
  1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, // Y=2: Hearth Apron & Upper Wall Shelves
  1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, // Y=3: Guestbook Board (1..3), Maya (6,3), Eevee (8,3), Co-Op Desk (11..13)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // Y=4: Guestbook (1..3), Walkable Rug, Co-Op Desk (11..13)
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // Y=5: Open Cottage Living Room Walkway
  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // Y=6: Fireside Tea Table (4,6) & Open Rug
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // Y=7: Retro Co-Op Console (1..3), Mentorship Shelf (11..13)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // Y=8: Retro Co-Op Console (1..3), Mentorship Shelf (11..13)
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // Y=9: South Cottage Walkway
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, // Y=10: Potted Hydrangeas (1,10 & 13,10) + Spawn (7,10)
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, // Y=11: South Wall & Cottage Exit Mat at (7,11)
];

export const NEIGHBOUR_PROPS: NeighbourProp[] = [
  {
    id: 'neighbour-maya',
    x: 6,
    y: 3,
    w: 1,
    h: 1,
    label: 'Neighbour Maya · Fellow Dev 👋',
    target: { type: 'event', name: 'neighbour-maya' },
  },
  {
    id: 'eevee-companion',
    x: 8,
    y: 3,
    w: 1,
    h: 1,
    label: 'Eevee · Cottage Mascot 🦊',
    target: { type: 'event', name: 'eevee-companion' },
  },
  {
    id: 'guestbook-board',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    label: 'Neighbour Guestbook & Corkboard 📌',
    target: { type: 'event', name: 'guestbook-board' },
  },
  {
    id: 'coop-table',
    x: 11,
    y: 3,
    w: 3,
    h: 2,
    label: 'Co-Op Pair-Programming Desk 🤝',
    target: { type: 'event', name: 'coop-table' },
  },
  {
    id: 'fireplace-hearth',
    x: 4,
    y: 6,
    w: 1,
    h: 1,
    label: 'Fireside Oolong Tea Table 🍵',
    target: { type: 'event', name: 'fireplace-hearth' },
  },
  {
    id: 'retro-console',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    label: 'Co-Op Game & PR Ping-Pong Corner 🎮',
    target: { type: 'event', name: 'retro-console' },
  },
  {
    id: 'mentorship-shelf',
    x: 11,
    y: 7,
    w: 3,
    h: 2,
    label: '6× Lab Mentorship & Guild Shelf 📚',
    target: { type: 'event', name: 'mentorship-shelf' },
  },
  {
    id: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    label: 'Return to Town Square',
    target: { type: 'place', id: 'town' },
  },
];

interface NeighbourFloatingFx {
  text: string;
  color: string;
  startTick: number;
}

let activeNeighbourFx: NeighbourFloatingFx | null = null;

export function triggerNeighbourAnimation(text = 'FRIENDSHIP LEVEL UP! ♥', color = '#fbbf24') {
  activeNeighbourFx = {
    text,
    color,
    startTick: performance.now(),
  };
}

export function createNeighbourBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = NEIGHBOUR_COLS * TILE_SIZE;
  canvas.height = NEIGHBOUR_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  // 1. Warm Honey-Oak Herringbone Floorboards
  for (let y = 0; y < NEIGHBOUR_ROWS; y++) {
    for (let x = 0; x < NEIGHBOUR_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isAlt = (x + y) % 2 === 0;
      ctx.fillStyle = isAlt ? '#6b3e26' : '#5c341f';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Wood plank grain & bevel joints
      ctx.fillStyle = '#472615';
      ctx.fillRect(px, py + 7, TILE_SIZE, 1);
      ctx.fillRect(px, py + 15, TILE_SIZE, 1);
      ctx.fillRect(px + (isAlt ? 7 : 13), py, 1, 7);
      ctx.fillRect(px + (isAlt ? 13 : 5), py + 8, 1, 7);

      ctx.fillStyle = 'rgba(254, 243, 199, 0.06)';
      ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      ctx.fillRect(px + 1, py + 9, TILE_SIZE - 2, 1);
    }
  }

  // 2. Cozy Woven Crimson & Gold Living Room Rug (x: 4..10, y: 4..9)
  const rugX = 4 * TILE_SIZE + 2;
  const rugY = 4 * TILE_SIZE + 2;
  const rugW = 7 * TILE_SIZE - 4;
  const rugH = 5 * TILE_SIZE + 6;

  // Rug drop shadow
  ctx.fillStyle = 'rgba(20, 10, 5, 0.45)';
  ctx.fillRect(rugX + 2, rugY + 2, rugW, rugH);

  // Outer gold tassel fringe
  ctx.fillStyle = '#f59e0b';
  for (let fy = rugY + 2; fy < rugY + rugH - 2; fy += 4) {
    ctx.fillRect(rugX - 2, fy, 2, 2);
    ctx.fillRect(rugX + rugW, fy, 2, 2);
  }

  // Main crimson wool body
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(rugX, rugY, rugW, rugH);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rugX + 2.5, rugY + 2.5, rugW - 5, rugH - 5);

  // Inner warm terracotta medallion pattern
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(rugX + 6, rugY + 6, rugW - 12, rugH - 12);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1;
  ctx.strokeRect(rugX + 8.5, rugY + 8.5, rugW - 17, rugH - 17);

  // Center Poké-Hearth diamond motif on rug
  const rcx = rugX + rugW / 2;
  const rcy = rugY + rugH / 2;
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(rcx, rcy - 14);
  ctx.lineTo(rcx + 20, rcy);
  ctx.lineTo(rcx, rcy + 14);
  ctx.lineTo(rcx - 20, rcy);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(rcx, rcy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(rcx, rcy, 3, Math.PI, 0);
  ctx.fill();

  // 3. North Cottage Stucco & Cedar Timber Wall (Y=0..2)
  ctx.fillStyle = '#fef3c7'; // Warm cream stucco matching exterior cottage
  ctx.fillRect(TILE_SIZE, 4, (NEIGHBOUR_COLS - 2) * TILE_SIZE, 2 * TILE_SIZE + 8);

  // Exposed dark oak timber beams
  ctx.fillStyle = '#5c2d0c';
  ctx.fillRect(TILE_SIZE, 4, (NEIGHBOUR_COLS - 2) * TILE_SIZE, 5);
  ctx.fillRect(TILE_SIZE, 2 * TILE_SIZE + 6, (NEIGHBOUR_COLS - 2) * TILE_SIZE, 6);
  for (const bx of [1, 4, 6, 9, 11, 14]) {
    ctx.fillRect(bx * TILE_SIZE - 2, 4, 4, 2 * TILE_SIZE + 8);
  }

  // Wainscoting lower wood trim
  ctx.fillStyle = '#78350f';
  ctx.fillRect(TILE_SIZE, 2 * TILE_SIZE, (NEIGHBOUR_COLS - 2) * TILE_SIZE, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(TILE_SIZE, 2 * TILE_SIZE, (NEIGHBOUR_COLS - 2) * TILE_SIZE, 1);

  // 4. Sunlit Cottage Windows with Blue Shutters (Left: x=2..3, Right: x=11..12)
  drawCottageWindow(ctx, 2 * TILE_SIZE + 2, 10);
  drawCottageWindow(ctx, 11 * TILE_SIZE + 2, 10);

  // 5. Center Brick Hearth Fireplace (x: 6..8, y: 0..2)
  const fpX = 6 * TILE_SIZE;
  const fpY = 2;
  const fpW = 3 * TILE_SIZE;
  const fpH = 2 * TILE_SIZE + 12;

  // Cobblestone & brick chimney breast
  ctx.fillStyle = '#475569';
  ctx.fillRect(fpX - 2, fpY, fpW + 4, fpH);
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(fpX, fpY + 4, fpW, fpH - 4);

  // Brick mortar lines
  ctx.fillStyle = '#7c2d12';
  for (let by = fpY + 8; by < fpY + fpH - 6; by += 6) {
    ctx.fillRect(fpX, by, fpW, 1);
  }

  // Oak Mantelpiece shelf
  ctx.fillStyle = '#451a03';
  ctx.fillRect(fpX - 4, fpY + 15, fpW + 8, 5);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(fpX - 3, fpY + 15, fpW + 6, 1.5);

  // Framed "NEIGHBOUR GUILD" Plaque above Mantelpiece
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(fpX + 4, fpY + 3, fpW - 8, 11);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(fpX + 4.5, fpY + 3.5, fpW - 9, 10);
  drawPixelText(ctx, 'NEIGHBOUR', fpX + fpW / 2, fpY + 6, '#fef08a', 1, 'center');

  // Firebox dark arched opening
  ctx.fillStyle = '#18181b';
  ctx.fillRect(fpX + 8, fpY + 21, fpW - 16, 22);
  // Firewood logs inside hearth
  ctx.fillStyle = '#5c2d0c';
  ctx.fillRect(fpX + 12, fpY + 37, 24, 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(fpX + 15, fpY + 35, 18, 3);

  // Stone hearth floor apron
  ctx.fillStyle = '#64748b';
  ctx.fillRect(fpX - 2, fpY + fpH - 2, fpW + 4, 6);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(fpX, fpY + fpH - 1, fpW, 2);

  // 6. Station 1 (Left Top): Neighbour Guestbook & Endorsement Corkboard (x: 1..3, y: 3..4)
  drawGuestbookCorkboard(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE);

  // 7. Station 2 (Right Top): Co-Op Pair-Programming & Hackathon Desk (x: 11..13, y: 3..4)
  drawCoopWorkbench(ctx, 11 * TILE_SIZE, 3 * TILE_SIZE);

  // 8. Station 3 (Mid-Left): Fireside Oolong Tea Table & Cushions (x: 4, y: 6)
  drawFiresideTeaTable(ctx, 4 * TILE_SIZE, 6 * TILE_SIZE);

  // 9. Station 4 (Left Bottom): Retro Co-Op Console & CRT TV Lounge (x: 1..3, y: 7..8)
  drawRetroCoopCorner(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE);

  // 10. Station 5 (Right Bottom): 6× Lab Mentorship & Guild Bookshelf (x: 11..13, y: 7..8)
  drawMentorshipBookshelf(ctx, 11 * TILE_SIZE, 7 * TILE_SIZE);

  // 11. Decorative Cottage Hydrangea Planters at South Corners (x=1, y=10 & x=13, y=10)
  drawCottagePlanter(ctx, 1 * TILE_SIZE, 10 * TILE_SIZE, '#38bdf8');
  drawCottagePlanter(ctx, 13 * TILE_SIZE, 10 * TILE_SIZE, '#f472b6');

  // 12. Perimeter Timber Framing & South Exit Mat at (7, 11)
  ctx.fillStyle = '#271409';
  ctx.fillRect(0, 0, TILE_SIZE, NEIGHBOUR_ROWS * TILE_SIZE);
  ctx.fillRect((NEIGHBOUR_COLS - 1) * TILE_SIZE, 0, TILE_SIZE, NEIGHBOUR_ROWS * TILE_SIZE);
  ctx.fillRect(0, (NEIGHBOUR_ROWS - 1) * TILE_SIZE, 7 * TILE_SIZE, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE, (NEIGHBOUR_ROWS - 1) * TILE_SIZE, 7 * TILE_SIZE, TILE_SIZE);

  // Warm gold inner border trim
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  ctx.strokeRect(TILE_SIZE - 0.5, 3.5, (NEIGHBOUR_COLS - 2) * TILE_SIZE + 1, (NEIGHBOUR_ROWS - 1) * TILE_SIZE - 3);

  // Exit Welcome Mat at (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(ex - 2, ey, TILE_SIZE + 4, TILE_SIZE);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(ex, ey + 2, TILE_SIZE, TILE_SIZE - 4);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(ex + 2, ey + 4, TILE_SIZE - 4, 2);
  drawPixelText(ctx, 'EXIT', ex + 8, ey + 8, '#fffbeb', 1, 'center');

  return canvas;
}

function drawCottageWindow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 28;
  const h = 20;

  // Blue wooden shutters matching exterior cottage
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x - 5, y, 5, h);
  ctx.fillRect(x + w, y, 5, h);
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(x - 4, y + 3, 3, h - 6);
  ctx.fillRect(x + w + 1, y + 3, 3, h - 6);

  // Oak window frame
  ctx.fillStyle = '#5c2d0c';
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

  // Daylight sky & garden view outside
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(x + 2, y + 2, w - 4, 8);
  ctx.fillStyle = '#86efac';
  ctx.fillRect(x + 1, y + h - 5, w - 2, 4);

  // Window mullions
  ctx.fillStyle = '#5c2d0c';
  ctx.fillRect(x + w / 2 - 1, y, 2, h);
  ctx.fillRect(x, y + h / 2 - 1, w, 2);

  // Interior windowsill flower box
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 2, y + h, w + 4, 4);
  const colors = ['#ef4444', '#ec4899', '#fbbf24', '#ef4444'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(x + 2 + i * 6, y + h - 2, 3, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 3 + i * 6, y + h, 2, 2);
  }
}

function drawGuestbookCorkboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Floor shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 2, y + 4, w - 2, h - 2);

  // Oak easel & corkboard frame
  ctx.fillStyle = '#5c2d0c';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 6);
  ctx.fillStyle = '#d97706'; // Warm cork surface
  ctx.fillRect(x + 5, y + 5, w - 10, h - 12);

  // Pinned colorful endorsement notes & polaroids
  const notes = [
    { nx: x + 7, ny: y + 7, nw: 9, nh: 8, color: '#fef08a', pin: '#ef4444' },
    { nx: x + 19, ny: y + 6, nw: 10, nh: 9, color: '#bae6fd', pin: '#22c55e' },
    { nx: x + 31, ny: y + 7, nw: 9, nh: 8, color: '#fbcfe8', pin: '#3b82f6' },
    { nx: x + 10, ny: y + 17, nw: 11, nh: 7, color: '#bbf7d0', pin: '#f59e0b' },
    { nx: x + 25, ny: y + 17, nw: 12, nh: 7, color: '#fde68a', pin: '#ec4899' },
  ];
  for (const n of notes) {
    ctx.fillStyle = n.color;
    ctx.fillRect(n.nx, n.ny, n.nw, n.nh);
    ctx.fillStyle = '#475569';
    ctx.fillRect(n.nx + 2, n.ny + 3, n.nw - 4, 1);
    ctx.fillRect(n.nx + 2, n.ny + 5, n.nw - 5, 1);
    ctx.fillStyle = n.pin;
    ctx.fillRect(n.nx + Math.floor(n.nw / 2), n.ny + 1, 2, 2);
  }

  // Small guestbook ledger podium in front
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 14, y + h - 8, 20, 7);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 16, y + h - 7, 16, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 23, y + h - 7, 2, 4);
}

function drawCoopWorkbench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 2, y + 4, w - 2, h - 2);

  // Solid walnut butcher-block desk
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 2, y + 4, w - 4, h - 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 4, y + 6, w - 8, h - 12);

  // Dual Pair-Programming Monitors
  for (const mx of [x + 7, x + 26]) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mx, y + 7, 14, 10);
    ctx.fillStyle = mx === x + 7 ? '#0284c7' : '#059669';
    ctx.fillRect(mx + 1, y + 8, 12, 8);
    // Code lines on screen
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(mx + 2, y + 10, 6, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mx + 2, y + 12, 9, 1);
    ctx.fillRect(mx + 2, y + 14, 5, 1);
    // Stand
    ctx.fillStyle = '#475569';
    ctx.fillRect(mx + 5, y + 17, 4, 2);
  }

  // Mechanical keyboards & coffee mugs
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 8, y + 20, 11, 3);
  ctx.fillRect(x + 27, y + 20, 11, 3);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(x + 21, y + 19, 4, 4);
}

function drawFiresideTeaTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Round carved oak tea table
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 12, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5c2d0c';
  ctx.beginPath();
  ctx.arc(x + 8, y + 8, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.arc(x + 8, y + 7.5, 6, 0, Math.PI * 2);
  ctx.fill();

  // Emerald ceramic teapot & two teacups
  ctx.fillStyle = '#0d9488';
  ctx.fillRect(x + 5, y + 4, 5, 5);
  ctx.fillStyle = '#99f6e4';
  ctx.fillRect(x + 6, y + 5, 2, 2);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 11, y + 6, 3, 3);
  ctx.fillRect(x + 3, y + 9, 3, 3);
}

function drawRetroCoopCorner(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // TV cabinet shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 2, y + 4, w - 2, h - 2);

  // Vintage media credenza
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 2, y + 4, w - 4, 18);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 4, y + 6, w - 8, 14);

  // Retro CRT TV with split-screen Co-Op game
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 8, y + 2, 22, 15);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 10, y + 4, 18, 11);
  // Split screen left (blue) & right (amber)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 11, y + 5, 8, 9);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 19, y + 5, 8, 9);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 13, y + 8, 3, 3);
  ctx.fillRect(x + 22, y + 8, 3, 3);

  // Super NES / GameCube Console & 2 Controllers on floor mat
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(x + 33, y + 8, 9, 8);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 12, y + 24, 7, 4);
  ctx.fillRect(x + 25, y + 24, 7, 4);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 16, y + 25, 2, 2);
  ctx.fillRect(x + 29, y + 25, 2, 2);
}

function drawMentorshipBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 2, y + 4, w - 2, h - 2);

  // Oak bookcase body
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

  // 3 rows of colorful textbooks (6x Lab Assistant manuals)
  const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4'];
  for (let row = 0; row < 2; row++) {
    const sy = y + 6 + row * 10;
    ctx.fillStyle = '#271409';
    ctx.fillRect(x + 6, sy, w - 12, 8);
    for (let bx = x + 7; bx < x + w - 9; bx += 4) {
      ctx.fillStyle = bookColors[(bx + row * 3) % bookColors.length];
      ctx.fillRect(bx, sy + 1, 3, 7);
    }
  }

  // Golden Trophy & Framed Mentorship Photo on top
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 10, y - 1, 6, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 26, y - 1, 10, 4);
}

function drawCottagePlanter(ctx: CanvasRenderingContext2D, x: number, y: number, bloomColor: string) {
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(x + 3, y + 8, 10, 7);
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(x + 8, y + 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bloomColor;
  ctx.fillRect(x + 4, y + 3, 3, 3);
  ctx.fillRect(x + 9, y + 4, 3, 3);
  ctx.fillRect(x + 6, y + 6, 3, 3);
}

function drawEeveeCompanion(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  const bob = Math.sin(tick * 0.1) * 1.2;
  const tailWag = Math.sin(tick * 0.22) * 1.8;

  // Plush crimson velvet cushion under Eevee
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 14, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 13, 6.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy tail (warm brown with cream tip)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 11 + tailWag * 0.5, y + 6 + bob, 4, 4);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 13 + tailWag * 0.7, y + 5 + bob, 3, 3);

  // Eevee Body (warm chestnut brown)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 4, y + 7 + bob, 8, 6);

  // Signature fluffy cream neck ruff / mane
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 3, y + 6 + bob, 10, 4);
  ctx.fillRect(x + 4, y + 9 + bob, 8, 2);

  // Eevee Head
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 4, y + 2 + bob, 8, 6);

  // Long pointed ears
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 2, y - 2 + bob, 3, 5);
  ctx.fillRect(x + 11, y - 2 + bob, 3, 5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 3, y - 1 + bob, 1.5, 3);
  ctx.fillRect(x + 11.5, y - 1 + bob, 1.5, 3);

  // Expressive dark eyes with white shine
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(x + 5, y + 4 + bob, 2, 2);
  ctx.fillRect(x + 9, y + 4 + bob, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 5, y + 4 + bob, 1, 1);
  ctx.fillRect(x + 9, y + 4 + bob, 1, 1);

  // Cute nose
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 7.5, y + 5.5 + bob, 1.5, 1);

  // Floating friendship heart above Eevee
  const heartY = y - 6 + Math.sin(tick * 0.08) * 2;
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(x + 6, heartY, 2, 2);
  ctx.fillRect(x + 9, heartY, 2, 2);
  ctx.fillRect(x + 5, heartY + 1, 7, 2);
  ctx.fillRect(x + 6, heartY + 3, 5, 1);
  ctx.fillRect(x + 7.5, heartY + 4, 2, 1);
}

// Authentic Dawn / Maya Pixel Sprite Palette & Matrix (Gen 4 Pokémon Trainer & Fellow Dev)
export const MAYA_PALETTE: Record<string, string> = {
  A: '#ada5ce', // beanie shaded rim / hair clip
  B: '#39638c', // navy blue hair
  C: '#efefff', // white knit beanie & white scarf
  D: '#000000', // crisp outline, eyes, boots
  E: '#cecede', // beanie rim fold & scarf shade
  F: '#394252', // deep navy hair shading
  G: '#ef94c6', // pink Pokéball emblem on beanie
  H: '#c66b9c', // dark pink emblem shadow
  I: '#dea57b', // warm skin tone shading
  J: '#ffd6bd', // bright skin tone
  K: '#7b4242', // dress neckline / shadow
  L: '#c63942', // red dress / vest
  M: '#ef6b6b', // bright red pleated skirt
};

export const MAYA_SPRITE_MATRIX: string[] = [
  '.......AAA.......', // 0
  '......BCCCB......', // 1
  '...BBACCCCCABB...', // 2
  '..BACCCCCCCCCAB..', // 3
  '..DCCCCCCCCCCCD..', // 4
  '.DECCCCCCCCCCCED.', // 5
  '.FECCCCCCCCCCCEF.', // 6
  'DFEECCCCCCCCCEEFD', // 7
  'DFAEEECGGGCEEEAFD', // 8
  'DFAEEEHEEEHEEEAFD', // 9
  'DIFECEAAAAAECEDID', // 10
  'DIFAAEECECEEAAFID', // 11
  'DFFGFABIIIBAFGFFD', // 12
  'DFBDICDJJJDCIDBFD', // 13
  'DDBDIJJJJJJJIDBDD', // 14
  '.DBDAIJJIJJIKDBD.', // 15
  '.DDLEDKIIIKDLDD..', // 16
  'DJJDBACEEECDLLDD.', // 17
  'DIIBEFCALACADLEJK', // 18
  '.DDCCBALLLADLDJJD', // 19
  '..DAADGLLLGMKDDD.', // 20
  '...DDDMMMMMDDD...', // 21
  '...DHHDDDDDHHD...', // 22
  '....DD.....DD....', // 23
];

export function drawMayaCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  const bob = Math.sin(tick * 0.08) * 0.7;
  const destX = x;
  const destY = Math.round(y - 8 + bob);

  // Soft oval ground shadow beneath Maya
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + 8.5, y + 15, 8.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw authentic Dawn / Maya 17x24 pixel sprite
  drawPixelMatrix(ctx, MAYA_SPRITE_MATRIX, MAYA_PALETTE, destX, destY, 1, false);

  // Cute developer twinkle / sparkle above her knit hat
  if (Math.floor(tick / 50) % 3 === 0) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(destX + 17, destY - 2, 2, 2);
    ctx.fillRect(destX + 18, destY - 3, 1, 4);
    ctx.fillRect(destX + 16, destY - 1, 5, 1);
  }
}

export function renderNeighbourAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  // 1. Crackling Animated Hearth Fire & Warm Radial Glow (x: 6..8, y: 1..2)
  const fireX = 7.5 * TILE_SIZE;
  const fireY = 2 * TILE_SIZE + 2;
  const flicker = Math.sin(tick * 0.22) * 3;

  const hearthGlow = ctx.createRadialGradient(fireX, fireY + 8, 2, fireX, fireY + 16, 62 + flicker);
  hearthGlow.addColorStop(0, 'rgba(251, 191, 36, 0.34)');
  hearthGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.14)');
  hearthGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = hearthGlow;
  ctx.beginPath();
  ctx.arc(fireX, fireY + 16, 62 + flicker, 0, Math.PI * 2);
  ctx.fill();

  // Animated pixel flames inside firebox
  const fBaseX = 6 * TILE_SIZE + 14;
  const fBaseY = 34;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(fBaseX, fBaseY - 6 + Math.sin(tick * 0.3) * 1.5, 20, 7);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(fBaseX + 3, fBaseY - 9 + Math.cos(tick * 0.25) * 2, 14, 7);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(fBaseX + 6, fBaseY - 5 + Math.sin(tick * 0.4) * 1.5, 8, 4);

  // Rising fireplace sparks
  const sparkY = fBaseY - 6 - ((tick * 0.35) % 12);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(fBaseX + 5 + Math.sin(tick * 0.2) * 4, sparkY, 1.5, 1.5);
  ctx.fillRect(fBaseX + 13 + Math.cos(tick * 0.25) * 3, sparkY - 2, 1.5, 1.5);

  // 2. Neighbour Maya · Fellow Developer & Co-Op Partner at (6, 3)
  drawMayaCharacter(ctx, 6 * TILE_SIZE, 3 * TILE_SIZE, tick);

  // 3. Eevee · Cottage Mascot at (8, 3)
  drawEeveeCompanion(ctx, 8 * TILE_SIZE, 3 * TILE_SIZE, tick);

  // 4. Steaming Jasmine Oolong Tea at (4, 6)
  const steamOffset = (tick * 0.25) % 8;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.55 - steamOffset * 0.06})`;
  ctx.fillRect(4 * TILE_SIZE + 7 + Math.sin(tick * 0.15) * 1.2, 6 * TILE_SIZE + 2 - steamOffset, 1.5, 2.5);

  // 5. Animated Co-Op Monitor & Retro TV Screen Glint
  if (Math.floor(tick / 20) % 2 === 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(11 * TILE_SIZE + 9, 3 * TILE_SIZE + 10, 4, 1);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(11 * TILE_SIZE + 28, 3 * TILE_SIZE + 10, 5, 1);
  }

  // 6. Floating Celebration / Friendship Text FX
  if (activeNeighbourFx) {
    const elapsed = performance.now() - activeNeighbourFx.startTick;
    if (elapsed < 2400) {
      const progress = elapsed / 2400;
      const floatY = 3.2 * TILE_SIZE - progress * 20;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress * 0.85);
      drawPixelText(ctx, activeNeighbourFx.text, 7.5 * TILE_SIZE, floatY, activeNeighbourFx.color, 1, 'center');
      ctx.restore();
    } else {
      activeNeighbourFx = null;
    }
  }
}

