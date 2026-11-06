import type { Dir } from './types';
import { TILE_SIZE, drawCharacter } from './sprites';
import { drawPixelText } from './devScene';

export const GARDEN_COLS = 15;
export const GARDEN_ROWS = 12;

export const GARDEN_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

// 1 = blocked wall/tree/planter bed, 0 = walkable grass or garden path
// 15x12 Botanical Berry Plantation & Sakura Conservatory
export const GARDEN_COLLISION: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=0 North Glass Conservatory Wall
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=1 Trellis, Hanging Baskets & Sign
  1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, // y=2 Sakura Mother Tree Trunk & Spring (6..8, 2)
  1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, // y=3 Oran Plot (1..3,3..4), Flora(6,3), Fountain(7,3), Shaymin(8,3), Sitrus Plot (11..13,3..4)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // y=4 Oran Plot & Sitrus Plot lower rows
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=5 Main East-West Garden Stone Path
  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=6 Sprayduck Irrigation Well at (4, 6)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // y=7 Cheri Plot (1..3,7..8), Berry Blender & Apiary (11..13,7..8)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // y=8 Cheri Plot & Berry Blender lower rows
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=9 South Orchard Meadow Walk
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=10 Spawn (7, 10)
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, // y=11 South Wooden Garden Gate Exit at (7, 11)
];

export interface GardenProp {
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

export const GARDEN_PROPS: GardenProp[] = [
  {
    id: 'botanist-flora',
    x: 6,
    y: 3,
    w: 1,
    h: 1,
    label: '👩‍🌾 Botanist Flora',
    labelLift: 20,
    target: { type: 'event', name: 'botanist-flora' },
  },
  {
    id: 'shaymin-npc',
    x: 8,
    y: 3,
    w: 1,
    h: 1,
    label: '🦔 Shaymin',
    labelLift: 8,
    target: { type: 'event', name: 'shaymin-npc' },
  },
  {
    id: 'plot-oran',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    label: '🍊 Oran & Pecha Bed',
    labelLift: 10,
    target: { type: 'event', name: 'plot-oran' },
  },
  {
    id: 'plot-sitrus',
    x: 11,
    y: 3,
    w: 3,
    h: 2,
    label: '🍋 Sitrus & Lum Bed',
    labelLift: 10,
    target: { type: 'event', name: 'plot-sitrus' },
  },
  {
    id: 'watering-well',
    x: 4,
    y: 6,
    w: 1,
    h: 1,
    label: '💧 Sprayduck Well',
    labelLift: 14,
    target: { type: 'event', name: 'watering-well' },
  },
  {
    id: 'plot-cheri',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    label: '🍒 Cheri & Leppa Bed',
    labelLift: 8,
    target: { type: 'event', name: 'plot-cheri' },
  },
  {
    id: 'berry-blender',
    x: 11,
    y: 7,
    w: 3,
    h: 2,
    label: '🍯 Berry Blender',
    labelLift: 8,
    target: { type: 'event', name: 'berry-blender' },
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

interface GardenBurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingGardenBanner {
  text: string;
  y: number;
  alpha: number;
  color: string;
}

const gardenParticles: GardenBurstParticle[] = [];
let floatingGardenBanner: FloatingGardenBanner | null = null;

export function triggerGardenHarvestAnimation(
  text = 'FRESH BERRIES HARVESTED! 🍇',
  color = '#fde047'
) {
  floatingGardenBanner = {
    text,
    y: 5.5 * TILE_SIZE,
    alpha: 1.3,
    color,
  };

  const palette = ['#38bdf8', '#f472b6', '#facc15', '#4ade80', '#fb7185', color];
  for (let i = 0; i < 28; i++) {
    const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.3;
    const speed = 0.6 + Math.random() * 1.8;
    gardenParticles.push({
      x: 7.5 * TILE_SIZE + (Math.random() - 0.5) * 40,
      y: 6 * TILE_SIZE + (Math.random() - 0.5) * 24,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      color: palette[i % palette.length],
      size: i % 3 === 0 ? 3 : 2,
      life: 0,
      maxLife: 38 + Math.random() * 18,
    });
  }
}

// Botanical Plantation Palette
const C_GRASS_A = '#4d8a31'; // Sunlit orchard meadow green
const C_GRASS_B = '#437c29'; // Shaded orchard meadow green
const C_PATH_A = '#d6c19e'; // Warm limestone garden paver
const C_PATH_B = '#c4ad87'; // Shaded limestone paver
const C_WOOD_DARK = '#3e210d'; // Cedar greenhouse timber
const C_WOOD_MID = '#6e3d1a'; // Raised bed oak timber
const C_WOOD_LIGHT = '#9c5a28'; // Highlighted timber
const C_SOIL_DARK = '#3b1d0c'; // Rich moist loam
const C_SOIL_FURROW = '#522912'; // Tilled soil ridge

/**
 * Procedural static pixel-art background for the Botanical Berry Plantation & Conservatory (/garden)
 */
export function createGardenBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GARDEN_COLS * TILE_SIZE;
  canvas.height = GARDEN_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // 1. Lush Orchard Meadow Lawn & Limestone Garden Walkways (r = 2..11)
  for (let r = 2; r < GARDEN_ROWS; r++) {
    for (let c = 0; c < GARDEN_COLS; c++) {
      const isAlt = (r + c) % 2 === 0;
      const isMainPath =
        (c === 7 && r >= 4) ||
        (r === 5 && c >= 2 && c <= 12) ||
        (r === 9 && c >= 2 && c <= 12) ||
        (c >= 6 && c <= 8 && r === 4);

      if (isMainPath) {
        ctx.fillStyle = isAlt ? C_PATH_A : C_PATH_B;
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        // Stone paver border & moss tufts
        ctx.fillStyle = 'rgba(62, 33, 13, 0.25)';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE + TILE_SIZE - 1, TILE_SIZE, 1);
        ctx.fillRect(c * TILE_SIZE + TILE_SIZE - 1, r * TILE_SIZE, 1, TILE_SIZE);
        ctx.fillStyle = 'rgba(255, 250, 235, 0.22)';
        ctx.fillRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, 1);
      } else {
        ctx.fillStyle = isAlt ? C_GRASS_A : C_GRASS_B;
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        // Meadow grass blades & tiny clover/sakura petals
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(c * TILE_SIZE + 3, r * TILE_SIZE + 4, 1, 3);
        ctx.fillRect(c * TILE_SIZE + 11, r * TILE_SIZE + 10, 1, 3);
        if ((r * 5 + c * 11) % 7 === 0) {
          ctx.fillStyle = '#fbcfe8'; // Fallen sakura petal on grass
          ctx.fillRect(c * TILE_SIZE + 7, r * TILE_SIZE + 6, 2, 2);
        }
      }
    }
  }

  // Sunbeams slanting from Conservatory Glass Roof
  ctx.fillStyle = 'rgba(254, 249, 195, 0.08)';
  ctx.fillRect(2 * TILE_SIZE, 2 * TILE_SIZE, 3 * TILE_SIZE, 4 * TILE_SIZE);
  ctx.fillRect(10 * TILE_SIZE, 2 * TILE_SIZE, 3 * TILE_SIZE, 4 * TILE_SIZE);

  // 2. North Botanical Glasshouse & Cedar Trellis Wall (y = 0..2)
  ctx.fillStyle = C_WOOD_DARK;
  ctx.fillRect(0, 0, canvas.width, 2 * TILE_SIZE);

  // Skylight Glass Conservatory Panels along North Wall
  for (let gx = TILE_SIZE + 4; gx < canvas.width - TILE_SIZE - 12; gx += 18) {
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(gx, 4, 14, 22);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(gx + 1, 5, 12, 20);
    // Diagonal glass reflection highlight
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(gx + 2, 6, 4, 10);
    ctx.fillRect(gx + 7, 12, 4, 8);
  }

  // Cedar Trellis Crossbeams & Ivy Vines on North Wall
  ctx.fillStyle = C_WOOD_MID;
  ctx.fillRect(0, 14, canvas.width, 2);
  ctx.fillRect(0, 2 * TILE_SIZE - 4, canvas.width, 4);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, 2 * TILE_SIZE - 4, canvas.width, 1);

  // Hanging Sakura & Berry Flower Baskets along North Wall
  const basketCols = [2 * TILE_SIZE, 4 * TILE_SIZE + 4, 10 * TILE_SIZE - 4, 12 * TILE_SIZE];
  for (const bx of basketCols) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx + 4, 16, 8, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(bx + 2, 13, 12, 4);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(bx + 3, 12, 3, 3);
    ctx.fillRect(bx + 9, 13, 3, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(bx + 6, 14, 2, 2);
  }

  // Carved Cedar Sign Plaque at Top Center ("BERRY GARDEN")
  const signW = 92;
  const signH = 14;
  const signX = Math.floor((canvas.width - signW) / 2);
  const signY = 3;
  ctx.fillStyle = '#271206';
  ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
  ctx.fillStyle = '#65a30d';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(signX + 1, signY + 1, signW - 2, 1);
  ctx.fillRect(signX + 1, signY + signH - 2, signW - 2, 1);
  drawPixelText(ctx, 'BERRY GARDEN', signX + 10, signY + 4, '#fefce8');

  // 3. Center North: Ancient Sakura Mother Tree & Spring Fountain (x = 6..8, y = 2..3)
  drawSakuraSpringSanctuary(ctx, 6 * TILE_SIZE, 2 * TILE_SIZE);

  // 4. Perimeter White Picket & Hedgerow Fence (West, East, South)
  ctx.fillStyle = '#14532d'; // Deep hedge base
  ctx.fillRect(0, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(canvas.width - TILE_SIZE, 0, TILE_SIZE, canvas.height);
  ctx.fillRect(0, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE + 8, 11 * TILE_SIZE, 6 * TILE_SIZE + 8, TILE_SIZE);

  // Leafy hedge shrubs with pink & yellow blossoms along West, East & South borders
  for (let y = 2; y < 11; y++) {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(2, y * TILE_SIZE + 2, 12, 12);
    ctx.fillRect(canvas.width - 14, y * TILE_SIZE + 2, 12, 12);
    ctx.fillStyle = y % 2 === 0 ? '#f472b6' : '#facc15';
    ctx.fillRect(5, y * TILE_SIZE + 5, 3, 3);
    ctx.fillRect(canvas.width - 10, y * TILE_SIZE + 6, 3, 3);
  }

  // 5. Four Cultivated Plantation Plots & Stations
  // North-West Plot (x = 1..3, y = 3..4): Oran (Blue) & Pecha (Pink) Berry Bed
  drawBerryPlanterBed(
    ctx,
    1 * TILE_SIZE,
    3 * TILE_SIZE,
    3 * TILE_SIZE,
    2 * TILE_SIZE,
    '#38bdf8', // Cobalt Blue Oran Berry
    '#f472b6', // Sweet Pink Pecha Berry
    'ORAN'
  );

  // North-East Plot (x = 11..13, y = 3..4): Sitrus (Gold) & Lum (Emerald) Berry Bed
  drawBerryPlanterBed(
    ctx,
    11 * TILE_SIZE,
    3 * TILE_SIZE,
    3 * TILE_SIZE,
    2 * TILE_SIZE,
    '#facc15', // Golden Sitrus Berry
    '#4ade80', // Miracle Emerald Lum Berry
    'SITRUS'
  );

  // South-West Plot (x = 1..3, y = 7..8): Cheri (Ruby Red) & Leppa (Orange) Berry Bed
  drawBerryPlanterBed(
    ctx,
    1 * TILE_SIZE,
    7 * TILE_SIZE,
    3 * TILE_SIZE,
    2 * TILE_SIZE,
    '#ef4444', // Ruby Cheri Berry
    '#fb923c', // Sunset Orange Leppa Berry
    'CHERI'
  );

  // South-East Station (x = 11..13, y = 7..8): Copper Berry Blender & Honey Apiary
  drawBerryBlenderApiary(ctx, 11 * TILE_SIZE, 7 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

  // 6. Sprayduck Irrigation Well at (x = 4, y = 6)
  drawSprayduckWell(ctx, 4 * TILE_SIZE, 6 * TILE_SIZE);

  // 7. South Wooden Garden Gate Exit (x = 6..8, y = 11)
  ctx.fillStyle = C_WOOD_MID;
  ctx.fillRect(6 * TILE_SIZE + 8, 11 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#84cc16';
  ctx.fillRect(6 * TILE_SIZE + 10, 11 * TILE_SIZE + 2, 2 * TILE_SIZE - 4, 12);
  drawPixelText(ctx, 'EXIT', 7 * TILE_SIZE - 3, 11 * TILE_SIZE + 6, '#fefce8');

  return canvas;
}

function drawSakuraSpringSanctuary(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Mossy Stone Sanctuary Platform (3x2 tiles)
  ctx.fillStyle = '#57534e';
  ctx.fillRect(x, y, 3 * TILE_SIZE, 2 * TILE_SIZE);
  ctx.fillStyle = '#a8a29e';
  ctx.fillRect(x + 2, y + 2, 3 * TILE_SIZE - 4, 2 * TILE_SIZE - 4);

  // Ancient Sakura Tree Trunk at top center (x + 18..30, y + 2..18)
  ctx.fillStyle = '#5c2d16';
  ctx.fillRect(x + 19, y + 4, 10, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 21, y + 4, 4, 14);

  // Lush Pink Cherry Blossom Canopy Crown
  ctx.fillStyle = '#db2777';
  ctx.fillRect(x + 6, y - 4, 36, 12);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(x + 8, y - 6, 32, 11);
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(x + 12, y - 5, 10, 5);
  ctx.fillRect(x + 26, y - 4, 10, 5);

  // Crystal Spring Water Basin in front of tree (x + 16..32, y + 18..30)
  ctx.fillStyle = '#78716c';
  ctx.fillRect(x + 15, y + 17, 18, 13);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 17, y + 19, 14, 9);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 18, y + 20, 12, 7);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(x + 20, y + 22, 4, 2);
}

function drawBerryPlanterBed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  berryColorA: string,
  berryColorB: string,
  signLabel: string
) {
  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Cedar Timber Raised Planter Frame
  ctx.fillStyle = C_WOOD_DARK;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C_WOOD_MID;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = C_WOOD_LIGHT;
  ctx.fillRect(x + 2, y + 2, w - 4, 2);

  // Rich Irrigated Dark Soil Bed
  ctx.fillStyle = C_SOIL_DARK;
  ctx.fillRect(x + 3, y + 4, w - 6, h - 7);

  // Tilled Soil Furrow Ridges
  ctx.fillStyle = C_SOIL_FURROW;
  for (let fy = y + 6; fy < y + h - 5; fy += 5) {
    ctx.fillRect(x + 5, fy, w - 10, 2);
  }

  // 6 Lush Berry Bushes (3 columns x 2 rows) inside the planter bed
  const cols = [x + 6, x + 19, x + 32];
  const rows = [y + 5, y + 16];

  rows.forEach((by, rIdx) => {
    cols.forEach((bx, cIdx) => {
      const isSecond = (rIdx + cIdx) % 2 === 1;
      const bColor = isSecond ? berryColorB : berryColorA;

      // Bush shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(bx + 1, by + 9, 8, 2);

      // Emerald foliage crown
      ctx.fillStyle = '#15803d';
      ctx.fillRect(bx, by + 2, 10, 8);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(bx + 1, by + 1, 8, 6);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(bx + 2, by + 2, 3, 2);

      // Ripe Colorful Berries hanging on bush
      ctx.fillStyle = bColor;
      ctx.fillRect(bx + 1, by + 5, 3, 3);
      ctx.fillRect(bx + 6, by + 4, 3, 3);
      ctx.fillRect(bx + 4, by + 7, 2, 2);

      // Tiny white specular shine on berry
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx + 1, by + 5, 1, 1);
      ctx.fillRect(bx + 6, by + 4, 1, 1);
    });
  });

  // Mini wooden crop sign at bottom-left corner of bed
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 2, y + h - 5, 10, 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 3, y + h - 4, 8, 2);
  void signLabel;
}

function drawBerryBlenderApiary(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(x + 2, y + 3, w, h);

  // Warm Oak Artisanal Deck
  ctx.fillStyle = C_WOOD_DARK;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Left: Hoenn/Sinnoh Copper Berry Blender Machine (x + 5..21, y + 5..25)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 5, y + 6, 16, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 7, y + 8, 12, 12);
  // Spinning rotor cross in center of blender
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 12, y + 9, 2, 10);
  ctx.fillRect(x + 8, y + 13, 10, 2);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 12, y + 13, 2, 2);

  // Right: Golden Combee Honey Apiary Hive & Berry Jam Jars (x + 25..42)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 27, y + 5, 14, 12);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 28, y + 6, 12, 3);
  ctx.fillRect(x + 28, y + 10, 12, 3);
  ctx.fillStyle = '#451a03'; // Hive entrance hole
  ctx.fillRect(x + 33, y + 13, 3, 3);

  // 3 Colorful Berry Jam Jars on bottom shelf
  const jarColors = ['#38bdf8', '#f472b6', '#4ade80'];
  jarColors.forEach((jc, idx) => {
    const jx = x + 26 + idx * 6;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(jx, y + 20, 4, 2);
    ctx.fillStyle = jc;
    ctx.fillRect(jx, y + 22, 4, 5);
  });
}

function drawSprayduckWell(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Stone well rim
  ctx.fillStyle = '#57534e';
  ctx.fillRect(x + 1, y + 3, 14, 12);
  ctx.fillStyle = '#a8a29e';
  ctx.fillRect(x + 2, y + 4, 12, 10);
  // Fresh blue water inside well
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 4, y + 6, 8, 6);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(x + 5, y + 7, 4, 2);

  // Iconic Yellow Sprayduck Watering Can perched on well edge
  ctx.fillStyle = '#facc15';
  ctx.fillRect(x + 9, y + 1, 5, 5);
  ctx.fillStyle = '#fb923c'; // Duck bill spout
  ctx.fillRect(x + 14, y + 2, 2, 2);
  ctx.fillStyle = '#1e293b'; // Eye
  ctx.fillRect(x + 11, y + 2, 1, 1);
}

/**
 * Dynamic frame-by-frame animations for the Botanical Berry Plantation (/garden)
 */
export function renderGardenAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Master Botanist Flora at (6, 3) beside the Sakura Spring
  const floraX = 6 * TILE_SIZE;
  const floraY = 3 * TILE_SIZE - 2;
  drawCharacter(
    ctx,
    {
      skin: '#fed7aa',
      hair: '#9a3412', // Auburn hair
      shirt: '#15803d', // Botanical green apron/tunic
      pants: '#fef3c7', // Cream trousers
      shoes: '#78350f', // Garden boots
      accent: '#f472b6', // Sakura hair blossom
    },
    'down',
    Math.floor(tick / 28) % 2,
    floraX,
    floraY,
    1
  );

  // 2. Shaymin (Gratitude Hedge Guardian) at (8, 3)
  const shX = 8 * TILE_SIZE;
  const shY = 3 * TILE_SIZE;
  const shBob = Math.round(Math.sin(tick * 0.08) * 1.2);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(shX + 8, shY + 14, 5, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // White body & lush green grass-hedge back
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(shX + 4, shY + 8 + shBob, 8, 5);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(shX + 4, shY + 4 + shBob, 8, 5);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(shX + 5, shY + 3 + shBob, 6, 3);

  // Pink Gracidea Flower on side of Shaymin's head
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(shX + 3, shY + 4 + shBob, 3, 3);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(shX + 4, shY + 5 + shBob, 1, 1);

  // Eyes
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(shX + 6, shY + 9 + shBob, 1, 2);
  ctx.fillRect(shX + 9, shY + 9 + shBob, 1, 2);

  // 3. Sparkling Spring Water Ripple at (7, 3)
  const rippleR = 3 + ((tick % 40) / 40) * 5;
  const rippleAlpha = (1 - (tick % 40) / 40) * 0.65;
  ctx.strokeStyle = `rgba(224, 242, 254, ${rippleAlpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(7 * TILE_SIZE + 8, 3 * TILE_SIZE + 8, rippleR, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Twinkling Dewdrop Sparkles on the 4 Berry Beds
  const bedSparkles = [
    { x: 2 * TILE_SIZE + 4, y: 3 * TILE_SIZE + 8 },
    { x: 12 * TILE_SIZE + 6, y: 3 * TILE_SIZE + 10 },
    { x: 2 * TILE_SIZE + 10, y: 7 * TILE_SIZE + 8 },
    { x: 12 * TILE_SIZE + 4, y: 7 * TILE_SIZE + 12 },
  ];
  bedSparkles.forEach((sp, idx) => {
    const phase = (tick + idx * 15) % 45;
    if (phase < 16) {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sp.x, sp.y - 1, 1, 3);
      ctx.fillRect(sp.x - 1, sp.y, 3, 1);
    }
  });

  // 5. Drifting Pink Sakura Petals & Golden Pollinator Butterflies
  for (let i = 0; i < 6; i++) {
    const px = ((tick * 0.45 + i * 42) % (13 * TILE_SIZE)) + TILE_SIZE;
    const py = ((tick * 0.3 + i * 31) % (9 * TILE_SIZE)) + 2 * TILE_SIZE;
    const sway = Math.sin(tick * 0.06 + i) * 3;
    ctx.fillStyle = i % 2 === 0 ? '#fbcfe8' : '#f472b6';
    ctx.fillRect(Math.round(px + sway), Math.round(py), 2, 2);
  }

  // Two fluttering golden Combee/butterflies near the beds
  for (let b = 0; b < 2; b++) {
    const cx = (b === 0 ? 3.2 : 11.5) * TILE_SIZE + Math.cos(tick * 0.05 + b * 2) * 10;
    const cy = (b === 0 ? 4.2 : 4.5) * TILE_SIZE + Math.sin(tick * 0.08 + b) * 6;
    const wing = tick % 6 < 3 ? -1 : 1;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(Math.round(cx), Math.round(cy), 3, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(Math.round(cx + 1), Math.round(cy + wing), 1, 2);
  }

  // 6. Active Harvest / Watering Particle Burst
  for (let i = gardenParticles.length - 1; i >= 0; i--) {
    const p = gardenParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life += 1;
    const alpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    if (p.life >= p.maxLife) {
      gardenParticles.splice(i, 1);
    }
  }
  ctx.globalAlpha = 1;

  if (floatingGardenBanner) {
    floatingGardenBanner.y -= 0.35;
    floatingGardenBanner.alpha -= 0.02;
    if (floatingGardenBanner.alpha <= 0) {
      floatingGardenBanner = null;
    } else {
      ctx.save();
      ctx.globalAlpha = Math.min(1, floatingGardenBanner.alpha);
      drawPixelText(
        ctx,
        floatingGardenBanner.text,
        Math.max(10, Math.floor(7.5 * TILE_SIZE - floatingGardenBanner.text.length * 2.5)),
        Math.floor(floatingGardenBanner.y),
        floatingGardenBanner.color
      );
      ctx.restore();
    }
  }

  ctx.restore();
}
