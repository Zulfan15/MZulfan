import type { Dir } from './types';
import { TILE_SIZE, drawCharacter, drawLucario } from './sprites';
import { drawPixelText } from './devScene';

export const ARENA_COLS = 15;
export const ARENA_ROWS = 12;

export const ARENA_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

const MEWTWO_SPRITE_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwBAMAAAA0zul4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEUAAAD4+Pjg4PC4sMi4iMCYiJh4gHiIWJBQWFBAQEAAAABuf+WbAAAAAXRSTlMAQObYZgAAAWxJREFUeNrt2DGtJDEQRdGi8Ck8Co+CKRSFT8EUmkJRuChX7vGMg81Wqk52bmjpSC+wHDi+ffv27dsz8TTEPAvxhvAgXASJp+CvBEg+MIBGqNWvfCCMMWmC6G/HWDVBtHvB4ybRDfWGzDGA6IHoZLPhntkNbXNcI7S82OUDiUYY3LCuHx9YdMJAyoufn+1u2QpJSYzlKs8F6ISSvILMa8sx6IOB064igkziyDYYVJXzNfXAQQ88Y6WrktjRDiVd3u5s7YJkZUp52WfqHLMNkllSpsHmuNEEwS5LEhFY3GdzLtcCKVd5zqkXUQHzrgdil1RjjCUJpJpv1wFxvtySKVEfSPTA5TYsSSq9JEQPDD6wrC1rsx4Y3NvGmKU3NBGNMJBdc25YSmUzDMisDV2iD54+0jZOoh9WJuDlAqIbcruIKNtFRDcklzsvJf3wdjvsfhhAPAtPID0KKaX0KJRSxIMwQI/BQ+Nf4f/7/fYHGujw6q4E2bwAAAAASUVORK5CYII=';

let mewtwoSpriteImg: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
  mewtwoSpriteImg = new Image();
  mewtwoSpriteImg.src = MEWTWO_SPRITE_SRC;
}

// 1 = blocked wall/prop, 0 = walkable Roman stone or gladiator sand
// 15x12 Roman Gladiator Colosseum
export const ARENA_COLLISION: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=0 North Colosseum Arches
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=1 North Imperial Wall & Banners
  1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, // y=2 Imperial Dais (x=6..8 blocked, Mewtwo at 7,2)
  1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, // y=3 Armory (1..2,3..4), North Braziers (4,3 & 10,3), Trial Gate (12..13,3..4)
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, // y=4 North Gladiator Sand Pit
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=5 Open Walkway & Sand Pit
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, // y=6 Lanista Lucario (2,6), Center Sand Pit, Arbiter (12,6)
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=7 Open Walkway & Sand Pit
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, // y=8 Victors Pedestal (1..2,8..9), Runes Obelisk (12..13,8..9)
  1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, // y=9 South Braziers (4,9 & 10,9)
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=10 South Colonnade & Spawn (7,10)
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, // y=11 Grand South Gate Exit at (7,11)
];

export interface ArenaProp {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  labelLift?: number;
  target: {
    type: 'event' | 'place' | 'note';
    name?: string;
    id?: string;
    text?: string;
  };
}

export const ARENA_PROPS: ArenaProp[] = [
  {
    id: 'mewtwo-boss',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    label: '👑 Champion Mewtwo',
    labelLift: 20,
    target: { type: 'event', name: 'mewtwo-boss' },
  },
  {
    id: 'battle-terminal',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    label: '⚔️ Armory',
    labelLift: 10,
    target: { type: 'event', name: 'battle-terminal' },
  },
  {
    id: 'algorithm-dojo',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    label: '🦁 Trial Gate',
    labelLift: 10,
    target: { type: 'event', name: 'algorithm-dojo' },
  },
  {
    id: 'lucario-coach',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    label: '🥊 Lucario',
    labelLift: 16,
    target: { type: 'event', name: 'lucario-coach' },
  },
  {
    id: 'referee-dan',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    label: '📯 Arbiter',
    labelLift: 16,
    target: { type: 'event', name: 'referee-dan' },
  },
  {
    id: 'trophy-vault',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    label: '🏆 Victors',
    labelLift: 6,
    target: { type: 'event', name: 'trophy-vault' },
  },
  {
    id: 'stat-radar',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    label: '🛡️ Runes',
    labelLift: 6,
    target: { type: 'event', name: 'stat-radar' },
  },
  {
    id: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'town' },
  },
];

interface ArenaWaveEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  text: string;
  alpha: number;
}

const activeArenaWaves: ArenaWaveEffect[] = [];

export function triggerArenaBattleAnimation(
  text = 'GLADIATOR CLASH! ⚔️',
  color = '#d97706'
) {
  activeArenaWaves.push({
    x: 7.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    radius: 4,
    maxRadius: 68,
    color,
    text,
    alpha: 1,
  });
}

// Roman Colosseum Palette
const C_STONE_A = '#b8976c'; // Warm Roman travertine flagstone
const C_STONE_B = '#aa885d'; // Shaded travertine flagstone
const C_SAND_MAIN = '#e2be86'; // Sunlit gladiator sand
const C_SAND_ALT = '#d9b277'; // Textured arena sand
const C_WALL_DARK = '#3b2412'; // Deep Roman arch stone
const C_WALL_MID = '#6b4726'; // Carved stone block
const C_WALL_LIGHT = '#8f6339'; // Highlighted stone block
const C_GOLD = '#f59e0b'; // Imperial Caesar gold
const C_GOLD_LIGHT = '#fde68a';
const C_CRIMSON = '#991b1b'; // Imperial banner red
const C_CRIMSON_DARK = '#7f1d1d';

/**
 * Procedural static pixel-art background for the Roman Gladiator Colosseum (/arena)
 */
export function createArenaBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ARENA_COLS * TILE_SIZE;
  canvas.height = ARENA_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // 1. Outer Colonnade Travertine Flagstone Floor (r = 2..11, c = 0..14)
  for (let r = 2; r < ARENA_ROWS; r++) {
    for (let c = 0; c < ARENA_COLS; c++) {
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? C_STONE_A : C_STONE_B;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Stone flagstone mortar joints & bevel highlights
      ctx.fillStyle = 'rgba(59, 36, 18, 0.35)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE + TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect(c * TILE_SIZE + TILE_SIZE - 1, r * TILE_SIZE, 1, TILE_SIZE);
      ctx.fillStyle = 'rgba(255, 244, 224, 0.18)';
      ctx.fillRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, 1);

      // Subtle stone crack/grain
      if ((r * 7 + c * 13) % 5 === 0) {
        ctx.fillStyle = 'rgba(59, 36, 18, 0.2)';
        ctx.fillRect(c * TILE_SIZE + 5, r * TILE_SIZE + 7, 4, 1);
      }
    }
  }

  // Imperial Red Carpet Runner from South Gate (c = 6..8, r = 9..11)
  for (let r = 9; r < ARENA_ROWS; r++) {
    for (let c = 6; c <= 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_CRIMSON : C_CRIMSON_DARK;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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

  // 2. Central Sandy Gladiator Combat Pit (x = 4..10, y = 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;

  // Outer Chiseled Stone Parapet Curb around the Sand Pit
  ctx.fillStyle = '#52361c';
  ctx.fillRect(pitX - 4, pitY - 4, pitW + 8, pitH + 8);
  ctx.fillStyle = '#8c6640';
  ctx.fillRect(pitX - 3, pitY - 3, pitW + 6, pitH + 6);
  ctx.fillStyle = '#d6be9c'; // Marble inner rim
  ctx.fillRect(pitX - 1, pitY - 1, pitW + 2, pitH + 2);

  // Golden-Ochre Gladiator Sand Fill
  for (let r = 4; r <= 9; r++) {
    for (let c = 4; c <= 10; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? C_SAND_MAIN : C_SAND_ALT;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Raked sand ripples & pebble speckles
      ctx.fillStyle = 'rgba(161, 114, 58, 0.28)';
      ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 4, 5, 1);
      ctx.fillRect(c * TILE_SIZE + 9, r * TILE_SIZE + 11, 5, 1);
      ctx.fillStyle = 'rgba(255, 248, 231, 0.35)';
      ctx.fillRect(c * TILE_SIZE + 3, r * TILE_SIZE + 5, 4, 1);
    }
  }

  // Inner Sand Pit Shadow along North & West Stone Parapet
  ctx.fillStyle = 'rgba(82, 54, 28, 0.25)';
  ctx.fillRect(pitX, pitY, pitW, 3);
  ctx.fillRect(pitX, pitY, 3, pitH);

  // Gladiator Combat Ring Markings in the Sand
  const centerX = 7.5 * TILE_SIZE;
  const centerY = 7 * TILE_SIZE;

  // Outer Crimson & Ochre Gladiator Circle
  ctx.strokeStyle = 'rgba(153, 27, 27, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 36, 0, Math.PI * 2);
  ctx.stroke();

  // Horizontal Dividing Line across the Pit
  ctx.fillStyle = 'rgba(153, 27, 27, 0.4)';
  ctx.fillRect(pitX + 6, centerY - 1, pitW - 12, 2);

  // Central Chiseled Sandstone & Gold Poké-Gladiator Medallion
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 17, 0, Math.PI * 2);
  ctx.fill();

  // Top half (Imperial Crimson)
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, Math.PI, 0, false);
  ctx.fill();

  // Bottom half (Travertine Ivory)
  ctx.fillStyle = '#f5ebe0';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI, false);
  ctx.fill();

  // Center bronze crossbar & boss
  ctx.fillStyle = '#78350f';
  ctx.fillRect(centerX - 15, centerY - 2, 30, 4);
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();

  // North Champion's Stone Combat Slab (y = 4.3)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(6 * TILE_SIZE + 6, 4 * TILE_SIZE + 5, 2 * TILE_SIZE + 4, 10);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(6 * TILE_SIZE + 7, 4 * TILE_SIZE + 6, 2 * TILE_SIZE + 2, 8);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 6, 4 * TILE_SIZE + 5, 2 * TILE_SIZE + 4, 1);

  // South Challenger's Stone Combat Slab (y = 9.1)
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(6 * TILE_SIZE + 6, 9 * TILE_SIZE + 1, 2 * TILE_SIZE + 4, 10);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(6 * TILE_SIZE + 7, 9 * TILE_SIZE + 2, 2 * TILE_SIZE + 2, 8);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 6, 9 * TILE_SIZE + 1, 2 * TILE_SIZE + 4, 1);

  // 3. North Imperial Colosseum Wall & Arches (y = 0..2)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Ashlar Roman Stone Blocks on North Wall
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

  // Roman Colosseum Arched Alcoves along North Wall
  const archPositions = [2 * TILE_SIZE, 5 * TILE_SIZE, 9 * TILE_SIZE, 12 * TILE_SIZE];
  for (const ax of archPositions) {
    ctx.fillStyle = '#231409';
    ctx.fillRect(ax + 2, 8, 12, 20);
    ctx.beginPath();
    ctx.arc(ax + 8, 10, 6, Math.PI, 0, false);
    ctx.fill();
    // Golden keystone at top of arch
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(ax + 7, 3, 2, 3);
  }

  // Imperial Crimson & Gold Velvet Banners on North Wall
  const bannerCols = [3 * TILE_SIZE + 3, 11 * TILE_SIZE + 3];
  for (const bx of bannerCols) {
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx - 1, 4, 12, 2);
    ctx.fillStyle = C_CRIMSON;
    ctx.fillRect(bx, 6, 10, 18);
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx + 1, 6, 1, 18);
    ctx.fillRect(bx + 8, 6, 1, 18);
    // Golden wreath emblem in center of banner
    ctx.fillRect(bx + 3, 11, 4, 4);
    ctx.fillStyle = C_CRIMSON;
    ctx.fillRect(bx + 4, 12, 2, 2);
    // Banner swallowtail fringe
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(bx, 24, 3, 2);
    ctx.fillRect(bx + 7, 24, 3, 2);
  }

  // 4 Fluted Corinthian Marble Columns along North Wall
  const pillarCols = [1 * TILE_SIZE + 2, 4 * TILE_SIZE + 2, 10 * TILE_SIZE + 2, 13 * TILE_SIZE + 2];
  for (const px of pillarCols) {
    // Gilded Capital
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 2, 12, 3);
    // Fluted Marble Shaft
    ctx.fillStyle = '#f5ebe0';
    ctx.fillRect(px, 5, 10, 23);
    ctx.fillStyle = '#cbb69b';
    ctx.fillRect(px + 2, 5, 1, 23);
    ctx.fillRect(px + 5, 5, 1, 23);
    ctx.fillRect(px + 8, 5, 1, 23);
    // Gilded Base
    ctx.fillStyle = C_GOLD;
    ctx.fillRect(px - 1, 28, 12, 3);
  }

  // Golden Cornice Moulding along bottom of North Wall
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 3);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(0, 2 * TILE_SIZE - 3, canvas.width, 1);

  // Chiseled Marble Plaque at Center of North Arch ("COLOSSEUM")
  const signW = 78;
  const signH = 14;
  const signX = Math.floor((canvas.width - signW) / 2);
  const signY = 4;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(signX + 1, signY + 1, signW - 2, 1);
  ctx.fillRect(signX + 1, signY + signH - 2, signW - 2, 1);
  drawPixelText(ctx, 'COLOSSEUM', signX + 12, signY + 4, C_GOLD_LIGHT);

  // 4. Center North Imperial Tribune / Champion's Podium (x = 6..8, y = 2)
  drawImperialTribune(ctx, 6 * TILE_SIZE, 2 * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE);

  // 5. Perimeter Stone Walls (West, East, and South)
  ctx.fillStyle = C_WALL_DARK;
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(0, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE + 8, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);

  // Carved stone crenellations along West & East perimeter walls
  for (let y = 2; y < 11; y++) {
    ctx.fillStyle = y % 2 === 0 ? C_WALL_MID : C_WALL_LIGHT;
    ctx.fillRect(2, y * TILE_SIZE + 2, 12, 12);
    ctx.fillRect(canvas.width - 14, y * TILE_SIZE + 2, 12, 12);
  }

  // 6. Four Gladiator Stations in the 4 Corners of the Colonnade
  // North-West: Gladiator Armory & Weapon Rack (x = 1..2, y = 3..4)
  drawGladiatorArmory(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // North-East: Iron Beast Portcullis & Trial Tablet (x = 12..13, y = 3..4)
  drawTrialPortcullis(ctx, 12 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // South-West: Hall of Victors Marble Pedestals (x = 1..2, y = 8..9)
  drawVictorsPedestals(ctx, 1 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // South-East: Obelisk of Mars & Combat Runes (x = 12..13, y = 8..9)
  drawRunicObelisk(ctx, 12 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE);

  // 7. Pit-Side Stone Plinths for Lanista Lucario (2,6) & Legatus Arbiter (12,6)
  drawTrainerPlinth(ctx, 2 * TILE_SIZE, 6 * TILE_SIZE, '#1d4ed8');
  drawTrainerPlinth(ctx, 12 * TILE_SIZE, 6 * TILE_SIZE, '#b91c1c');

  // 8. Four Iron Brazier Pedestals at the 4 Corners of the Sand Pit
  const brazierCoords = [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ];
  for (const b of brazierCoords) {
    drawBrazierBase(ctx, b.x, b.y);
  }

  // 9. Grand South Archway Exit Threshold (x = 6..8, y = 11)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(6 * TILE_SIZE + 8, 11 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = C_CRIMSON;
  ctx.fillRect(6 * TILE_SIZE + 10, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 4, 12);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(6 * TILE_SIZE + 12, 11 * TILE_SIZE + 3, 2 * TILE_SIZE - 8, 1);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE - 3, 11 * TILE_SIZE + 6, C_GOLD_LIGHT);

  return canvas;
}

function drawImperialTribune(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Raised Marble Balcony Platform
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x, y + 3, w, h);

  ctx.fillStyle = '#e7d8c1'; // Travertine marble steps
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#cbb69b';
  ctx.fillRect(x + 2, y + h - 3, w - 4, 3);

  // Imperial Crimson Throne Carpet
  ctx.fillStyle = C_CRIMSON;
  ctx.fillRect(x + 6, y, w - 12, h - 2);
  ctx.fillStyle = C_GOLD;
  ctx.fillRect(x + 6, y, 2, h - 2);
  ctx.fillRect(x + w - 8, y, 2, h - 2);
  ctx.fillRect(x + 6, y + h - 3, w - 12, 2);
}

function drawGladiatorArmory(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Heavy Oak & Forged Iron Armory Platform
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 2, y + 2, w - 4, 2);

  // Weapon Rack Crossbar (Top half)
  ctx.fillStyle = '#271206';
  ctx.fillRect(x + 4, y + 4, w - 8, 12);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 4, y + 8, w - 8, 2);

  // Silver Gladius Blades hanging on rack
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 7, y + 5, 2, 9);
  ctx.fillRect(x + 13, y + 5, 2, 9);
  ctx.fillStyle = '#fbbf24'; // Gold hilts
  ctx.fillRect(x + 6, y + 5, 4, 2);
  ctx.fillRect(x + 12, y + 5, 4, 2);

  // Golden Gladiator Trident on right of rack
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 21, y + 4, 2, 11);
  ctx.fillRect(x + 19, y + 4, 6, 2);
  ctx.fillRect(x + 19, y + 2, 1, 3);
  ctx.fillRect(x + 22, y + 2, 1, 3);
  ctx.fillRect(x + 24, y + 2, 1, 3);

  // Roman Scutum Shield (Bottom left: Crimson with Gold Wing Boss)
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 4, y + 17, 11, 12);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(x + 5, y + 18, 9, 10);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x + 8, y + 21, 3, 4);

  // Centurion Galea Helmet with Red Crest (Bottom right)
  ctx.fillStyle = '#dc2626'; // Red horsehair plume
  ctx.fillRect(x + 18, y + 17, 8, 3);
  ctx.fillStyle = '#d97706'; // Bronze helmet dome
  ctx.fillRect(x + 19, y + 20, 7, 7);
  ctx.fillStyle = '#1e293b'; // Visor slits
  ctx.fillRect(x + 20, y + 23, 2, 2);
  ctx.fillRect(x + 23, y + 23, 2, 2);
}

function drawTrialPortcullis(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Carved Stone Gatehouse Base
  ctx.fillStyle = '#44403c';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78716c';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Dark Arched Beast Gate Recess
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(x + 5, y + 5, w - 10, h - 8);

  // Forged Iron Portcullis Bars
  ctx.fillStyle = '#a8a29e';
  for (let bx = x + 7; bx <= x + w - 7; bx += 4) {
    ctx.fillRect(bx, y + 5, 2, h - 8);
  }
  ctx.fillRect(x + 5, y + 10, w - 10, 2);
  ctx.fillRect(x + 5, y + 18, w - 10, 2);

  // Golden Lion Keystone Crest at top of Gate
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 11, y + 2, 10, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 13, y + 3, 6, 3);
}

function drawVictorsPedestals(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Marble Sanctuary Base with Crimson Carpet
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 2, y + 2, w - 4, 1);
  ctx.fillRect(x + 2, y + h - 3, w - 4, 1);

  // Three White Marble Pedestals
  const pCols = [x + 4, x + 13, x + 22];
  for (let i = 0; i < pCols.length; i++) {
    const px = pCols[i];
    // Marble column
    ctx.fillStyle = '#f5ebe0';
    ctx.fillRect(px, y + 14, 6, 12);
    ctx.fillStyle = '#d6c2a8';
    ctx.fillRect(px + 4, y + 14, 2, 12);

    // Trophy atop pedestal
    if (i === 0) {
      // Bronze Chalice
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 1, y + 7, 4, 5);
      ctx.fillRect(px, y + 12, 6, 2);
    } else if (i === 1) {
      // Golden Laurel Crown / Grand Cup
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px, y + 5, 6, 6);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(px + 1, y + 6, 4, 3);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 1, y + 11, 4, 3);
    } else {
      // Silver & Sapphire Praetorian Shield
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px, y + 7, 6, 6);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(px + 2, y + 8, 2, 4);
    }
  }
}

function drawRunicObelisk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Chiseled Stone Sanctuary Platform
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#a8875e';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Engraved Bronze Astrolabe Ring on Platform
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2 + 2, 10, 0, Math.PI * 2);
  ctx.stroke();

  // Tall Carved Sandstone Obelisk in Center
  ctx.fillStyle = '#573b1a';
  ctx.fillRect(x + 11, y + 4, 10, 22);
  ctx.fillStyle = '#d6b68a';
  ctx.fillRect(x + 12, y + 5, 8, 20);
  // Golden Pyramidion Cap
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 13, y + 2, 6, 3);
  ctx.fillRect(x + 14, y + 1, 4, 2);

  // Glowing Amber & Crimson Gladiator Runes etched vertically
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 15, y + 8, 2, 3);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 14, y + 13, 4, 2);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x + 15, y + 17, 2, 3);
}

function drawTrainerPlinth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  trimColor: string
) {
  ctx.fillStyle = '#573b1a';
  ctx.fillRect(x + 1, y + 3, TILE_SIZE - 2, TILE_SIZE - 4);
  ctx.fillStyle = '#e7d8c1';
  ctx.fillRect(x + 2, y + 4, TILE_SIZE - 4, TILE_SIZE - 6);
  ctx.fillStyle = trimColor;
  ctx.fillRect(x + 3, y + 5, TILE_SIZE - 6, 2);
}

function drawBrazierBase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Stone pedestal
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 14, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#57534e';
  ctx.fillRect(x + 4, y + 9, 8, 5);
  // Forged Iron Fire Bowl
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(x + 2, y + 6, 12, 4);
  ctx.fillStyle = '#b45309'; // Bronze rim
  ctx.fillRect(x + 2, y + 6, 12, 1);
}

/**
 * Dynamic frame-by-frame animations for the Roman Gladiator Colosseum
 */
export function renderArenaAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Roaring Fire Braziers at the 4 Corners of the Sand Pit
  const braziers = [
    { x: 4 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 3 * TILE_SIZE },
    { x: 4 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 9 * TILE_SIZE },
  ];

  braziers.forEach((b, idx) => {
    const flicker = Math.sin(tick * 0.22 + idx * 1.7) * 1.5;
    const glowR = 16 + Math.sin(tick * 0.15 + idx) * 3;

    // Warm firelight glow on surrounding sand & stone
    const grad = ctx.createRadialGradient(
      b.x + 8,
      b.y + 5,
      2,
      b.x + 8,
      b.y + 5,
      glowR
    );
    grad.addColorStop(0, 'rgba(251, 146, 60, 0.38)');
    grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x + 8, b.y + 5, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Outer crimson/orange flame tongue
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(b.x + 4, b.y + 2 + Math.round(flicker * 0.4), 8, 4);
    ctx.fillRect(b.x + 5, b.y + Math.round(flicker * 0.6), 6, 3);

    // Inner golden-yellow flame core
    ctx.fillStyle = '#facc15';
    ctx.fillRect(b.x + 5, b.y + 3, 6, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(b.x + 6, b.y + 2 + Math.round(flicker * 0.3), 4, 2);

    // Rising fire ember spark
    const sparkY = (tick + idx * 13) % 24;
    if (sparkY < 16) {
      ctx.fillStyle = sparkY < 8 ? '#fde047' : '#f97316';
      ctx.fillRect(
        b.x + 7 + Math.round(Math.sin(tick * 0.2 + idx) * 2),
        b.y + 2 - Math.floor(sparkY * 0.45),
        1.5,
        1.5
      );
    }
  });

  // 2. Grand Champion Mewtwo on North Imperial Tribune (x = 7, y = 2)
  const mX = 7 * TILE_SIZE;
  const mY = 2 * TILE_SIZE;
  const levitate = Math.sin(tick * 0.05) * 2;

  // Golden & Psychic Champion Aura Ring beneath Mewtwo
  const auraR = 13 + Math.sin(tick * 0.07) * 2;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(mX + 8, mY + 6 + levitate, auraR, 0, Math.PI * 2);
  ctx.stroke();

  if (mewtwoSpriteImg && mewtwoSpriteImg.complete && mewtwoSpriteImg.naturalWidth > 0) {
    ctx.drawImage(mewtwoSpriteImg, mX - 9, mY - 12 + levitate, 34, 34);
  } else {
    // Fallback pixel silhouette while image loads
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(mX + 4, mY + 2 + levitate, 8, 12);
  }

  // Orbiting Golden Laurel Sparks around Champion Mewtwo
  for (let i = 0; i < 3; i++) {
    const angle = tick * 0.045 + (i * Math.PI * 2) / 3;
    const ox = mX + 8 + Math.cos(angle) * 12;
    const oy = mY + 6 + levitate + Math.sin(angle) * 6;
    ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#e9d5ff';
    ctx.fillRect(Math.round(ox), Math.round(oy), 2, 2);
  }

  // 3. Lanista Lucario on West Pit-Side Plinth (x = 2, y = 6)
  drawLucario(ctx, 2 * TILE_SIZE + 1, 6 * TILE_SIZE - 1, tick, 0.85);

  // 4. Legatus Arbiter (Roman Centurion Referee) on East Pit-Side Plinth (x = 12, y = 6)
  const arbX = 12 * TILE_SIZE;
  const arbY = 6 * TILE_SIZE - 2;
  drawCharacter(
    ctx,
    {
      skin: '#fed7aa',
      hair: '#78350f',
      shirt: '#b91c1c', // Imperial crimson tunic
      pants: '#fef3c7', // Roman toga trim
      shoes: '#92400e', // Leather caligae sandals
      accent: '#fbbf24', // Golden laurel wreath
    },
    'left',
    Math.floor(tick / 24) % 2,
    arbX,
    arbY,
    1
  );
  // Golden Arbiter Staff held beside Legatus
  const flagBob = Math.round(Math.sin(tick * 0.08));
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(arbX + 2, arbY + 3 + flagBob, 2, 11);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(arbX - 1, arbY + 3 + flagBob, 3, 4);

  // 5. Active Gladiator Clash Shockwaves (triggered by 1v1 Duel or NPC interactions)
  for (let i = activeArenaWaves.length - 1; i >= 0; i--) {
    const wave = activeArenaWaves[i];
    wave.radius += 2.2;
    wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

    ctx.strokeStyle = wave.color;
    ctx.globalAlpha = wave.alpha;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (wave.alpha > 0.25) {
      drawPixelText(
        ctx,
        wave.text,
        Math.max(12, Math.floor(wave.x - wave.text.length * 2.5)),
        Math.floor(wave.y - 12 - (1 - wave.alpha) * 16),
        '#fef08a'
      );
    }

    if (wave.radius >= wave.maxRadius) {
      activeArenaWaves.splice(i, 1);
    }
  }

  ctx.restore();
}
