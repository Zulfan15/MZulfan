/**
 * Procedural Pixel-Art Biome & Landform Renderer for the 100x100 Living Pokémon World.
 * Renders:
 *  - Coastal & Lake Shallow Water + Coral Reef Caustics
 *  - Curved Golden Sand Beaches with Wet Shoreline Rims, Seashells & Starfish
 *  - Wildflower Meadows & Ancient Temple Ruin Plazas
 *  - Neighbor-Aware 2.5D Sinnoh Terraced Rock Cliffs & Carved Limestone Stairs
 *  - Wooden Sunset Piers, Timber River Bridges & Grand Stone Arch Boulevard Bridge
 *  - Classic One-Way Pokémon Jump Ledges & Cascading Waterfall Chutes
 *  - Environmental Biome Decorations & Uncollected Hidden PokéBall Items
 */
import { TILE_SIZE } from '../sprites';
import { townConfig } from '../townConfig';
import { Tile, type TownMap } from '../types';
import {
  getFoundHiddenPokeballs,
  HIDDEN_POKEBALL_ITEMS,
  SUMMIT_VISTA_POINT,
} from './townGeography';
import {
  renderCliffStairsTileV2,
  renderCliffTileV2,
  renderLedgeTileV2,
  renderWaterfallTileV2,
} from './townCliffRenderer';

export interface BiomePropDrawHelpers {
  drawOakTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawPineTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawSakuraTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawPalmTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawAutumnTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawGoldenTree: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawBoulder: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawReeds: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawToriiGate: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawAncientPillar: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawBench: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawPicnicSet: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
  drawPokeballItem: (ctx: CanvasRenderingContext2D, px: number, py: number) => void;
}

function isWaterLike(map: TownMap, x: number, y: number): boolean {
  if (x < 0 || x >= map.w || y < 0 || y >= map.h) return false;
  const ov = townConfig.getTileOverride(x, y);
  if (ov === 'water' || ov === 'shallow_water') return true;
  if (ov && ov !== 'bridge_wood') return false;
  const t = map.ground[y * map.w + x];
  return t === Tile.WATER || t === Tile.SHALLOW_WATER || t === Tile.WATERFALL || (t === Tile.BRIDGE && x < 44);
}

export function renderShallowWaterTile(
  ctx: CanvasRenderingContext2D,
  map: TownMap | null,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#38bdf8' : '#2db3ef';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Turquoise reef caustic highlights
  if ((x * 5 + y * 11) % 3 === 0) {
    ctx.fillStyle = 'rgba(224, 242, 254, 0.5)';
    ctx.fillRect(px + 2, py + 4, 6, 1);
    ctx.fillRect(px + 7, py + 11, 5, 1);
  } else if ((x * 7 + y * 3) % 4 === 0) {
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.fillRect(px + 4, py + 7, 7, 1);
  }

  // Soft white foam rim where shallow water meets non-water land (sand/grass)
  if (map) {
    ctx.fillStyle = 'rgba(240, 253, 255, 0.72)';
    if (x < map.w - 1 && !isWaterLike(map, x + 1, y)) {
      ctx.fillRect(px + 13, py + 1, 2, 6);
      ctx.fillRect(px + 14, py + 9, 2, 5);
    }
    if (x > 0 && !isWaterLike(map, x - 1, y)) {
      ctx.fillRect(px, py + 2, 2, 5);
      ctx.fillRect(px + 1, py + 9, 2, 5);
    }
    if (y > 0 && !isWaterLike(map, x, y - 1)) {
      ctx.fillRect(px + 2, py, 5, 2);
      ctx.fillRect(px + 9, py + 1, 5, 2);
    }
    if (y < map.h - 1 && !isWaterLike(map, x, y + 1)) {
      ctx.fillRect(px + 1, py + 14, 6, 2);
      ctx.fillRect(px + 9, py + 13, 5, 2);
    }
  }
}

export function renderSandBeachTile(
  ctx: CanvasRenderingContext2D,
  map: TownMap | null,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#f4dc9c' : '#ecd18e';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Subtle wind-rippled sand grain stipples
  const h = Math.abs(x * 19 + y * 37);
  ctx.fillStyle = '#dfc078';
  ctx.fillRect(px + (h % 11) + 2, py + ((h >> 2) % 11) + 2, 2, 1);
  ctx.fillStyle = '#fbf0cb';
  ctx.fillRect(px + ((h + 5) % 12) + 1, py + ((h + 7) % 12) + 1, 2, 1);

  // Wet golden-brown shoreline damp band adjacent to water
  if (map) {
    ctx.fillStyle = '#cfa963';
    if (x > 0 && isWaterLike(map, x - 1, y)) {
      ctx.fillRect(px, py, 3, TILE_SIZE);
    }
    if (x < map.w - 1 && isWaterLike(map, x + 1, y)) {
      ctx.fillRect(px + 13, py, 3, TILE_SIZE);
    }
    if (y > 0 && isWaterLike(map, x, y - 1)) {
      ctx.fillRect(px, py, TILE_SIZE, 3);
    }
    if (y < map.h - 1 && isWaterLike(map, x, y + 1)) {
      ctx.fillRect(px, py + 13, TILE_SIZE, 3);
    }

    // Soft grass tufts where beach blends into inland grass
    ctx.fillStyle = '#67b346';
    if (x < map.w - 1 && map.ground[y * map.w + (x + 1)] === Tile.GRASS) {
      ctx.fillRect(px + 14, py + 3, 2, 3);
      ctx.fillRect(px + 13, py + 10, 3, 2);
    }
  }

  // Occasional pixel seashells & coral starfish on the beach
  if (h % 23 === 0) {
    // Pink coral starfish
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(px + 6, py + 7, 3, 3);
    ctx.fillRect(px + 7, py + 6, 1, 5);
    ctx.fillRect(px + 5, py + 8, 5, 1);
    ctx.fillStyle = '#ffe4e6';
    ctx.fillRect(px + 7, py + 8, 1, 1);
  } else if (h % 17 === 0) {
    // Ivory spiral seashell
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(px + 8, py + 9, 3, 2);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(px + 9, py + 10, 1, 1);
  }
}

export function renderFlowerMeadowTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#67b346' : '#5da83e';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Soft clover leaf bed
  ctx.fillStyle = '#48912d';
  ctx.fillRect(px + 2, py + 4, 4, 3);
  ctx.fillRect(px + 9, py + 10, 5, 3);

  const palettes = [
    { petal: '#fb7185', center: '#fef08a' }, // Gracidea Pink
    { petal: '#fde047', center: '#ea580c' }, // Sinnoh Dandelion
    { petal: '#60a5fa', center: '#ffffff' }, // Azure Bluebell
    { petal: '#ffffff', center: '#facc15' }, // Meadow Daisy
  ];
  const p1 = palettes[Math.abs(x * 7 + y * 13) % palettes.length];
  const p2 = palettes[Math.abs(x * 11 + y * 5 + 1) % palettes.length];

  // Blossom 1 (top-left)
  ctx.fillStyle = p1.petal;
  ctx.fillRect(px + 3, py + 2, 2, 4);
  ctx.fillRect(px + 2, py + 3, 4, 2);
  ctx.fillStyle = p1.center;
  ctx.fillRect(px + 3, py + 3, 2, 2);

  // Blossom 2 (bottom-right)
  ctx.fillStyle = p2.petal;
  ctx.fillRect(px + 10, py + 8, 2, 4);
  ctx.fillRect(px + 9, py + 9, 4, 2);
  ctx.fillStyle = p2.center;
  ctx.fillRect(px + 10, py + 9, 2, 2);
}

export function renderPlazaRuinsTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#dfd8c8' : '#d4ccb9';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Sunlit carved limestone bevel
  ctx.fillStyle = '#f5f0e6';
  ctx.fillRect(px, py, TILE_SIZE - 1, 1);
  ctx.fillRect(px, py, 1, TILE_SIZE - 1);

  // Ancient weathered stone joints
  ctx.fillStyle = '#9c927e';
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
  ctx.fillRect(px + 15, py, 1, TILE_SIZE);

  // Subtle moss or ancient cyan/gold rune inlay on alternate slabs
  if ((x + y) % 4 === 0) {
    ctx.fillStyle = y >= 85 ? 'rgba(6, 182, 212, 0.42)' : 'rgba(217, 119, 6, 0.35)';
    ctx.fillRect(px + 6, py + 6, 4, 4);
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(px + 7, py + 7, 2, 2);
  } else if ((x * 5 + y * 9) % 7 === 0) {
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(px + 1, py + 13, 3, 2);
  }
}

export function renderAutoCliffTile(
  ctx: CanvasRenderingContext2D,
  map: TownMap | null,
  px: number,
  py: number,
  x: number,
  y: number
) {
  renderCliffTileV2(ctx, map, px, py, x, y);
}

export function renderCliffStairsTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  renderCliffStairsTileV2(ctx, px, py, x, y);
}

export function renderBridgeTile(
  ctx: CanvasRenderingContext2D,
  map: TownMap | null,
  px: number,
  py: number,
  x: number,
  y: number
) {
  // Draw water shimmer base underneath bridge edges
  ctx.fillStyle = '#1e78b4';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Grand Central Boulevard Stone Arch Bridge (X: 45..50)
  if (x >= 45 && x <= 50) {
    const isLeftEdge = x === 46;
    const isRightEdge = x === 49;
    const isAlt = (x + y) % 2 === 0;
    ctx.fillStyle = isAlt ? '#e7dfd1' : '#dcd2c0';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Mortar courses
    ctx.fillStyle = '#b5a793';
    ctx.fillRect(px, py + 7, TILE_SIZE, 1);
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);

    // Ornate carved stone bridge parapets on West & East sides
    if (isLeftEdge) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px, py, 3, TILE_SIZE);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px + 1, py, 2, TILE_SIZE);
      ctx.fillStyle = '#fbbf24';
      if (y % 2 === 0) ctx.fillRect(px + 1, py + 6, 2, 3);
    } else if (isRightEdge) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 13, py, 3, TILE_SIZE);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px + 13, py, 2, TILE_SIZE);
      ctx.fillStyle = '#fbbf24';
      if (y % 2 === 0) ctx.fillRect(px + 13, py + 6, 2, 3);
    }
    return;
  }

  // Determine whether this timber bridge runs Horizontally (Pier / Mirror Lake / Highland) or Vertically (West & East River Bridges)
  const hasBridgeLeft =
    map && x > 0
      ? map.ground[y * map.w + (x - 1)] === Tile.BRIDGE ||
        townConfig.getTileOverride(x - 1, y) === 'bridge_wood'
      : false;
  const hasBridgeRight =
    map && x < map.w - 1
      ? map.ground[y * map.w + (x + 1)] === Tile.BRIDGE ||
        townConfig.getTileOverride(x + 1, y) === 'bridge_wood'
      : false;
  const hasBridgeUp =
    map && y > 0
      ? map.ground[(y - 1) * map.w + x] === Tile.BRIDGE ||
        townConfig.getTileOverride(x, y - 1) === 'bridge_wood'
      : false;
  const hasBridgeDown =
    map && y < map.h - 1
      ? map.ground[(y + 1) * map.w + x] === Tile.BRIDGE ||
        townConfig.getTileOverride(x, y + 1) === 'bridge_wood'
      : false;

  // Vertical river bridges at X=21..23 & X=63..65 have horizontal planks + side rails
  const isVerticalSpan = (x >= 20 && x <= 24 && y >= 65) || (x >= 62 && x <= 66 && y >= 65);

  if (isVerticalSpan) {
    for (let dy = 0; dy < TILE_SIZE; dy += 4) {
      ctx.fillStyle = (dy / 4) % 2 === 0 ? '#b4692c' : '#9c5620';
      ctx.fillRect(px + 1, py + dy, TILE_SIZE - 2, 3);
      ctx.fillStyle = '#5c3110';
      ctx.fillRect(px + 1, py + dy + 3, TILE_SIZE - 2, 1);
    }
    if (!hasBridgeLeft) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px, py, 2, TILE_SIZE);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 1, py, 1, TILE_SIZE);
    }
    if (!hasBridgeRight) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px + 14, py, 2, TILE_SIZE);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 14, py, 1, TILE_SIZE);
    }
  } else {
    // Horizontal Pier / Mirror Lake Footbridge (vertical timber planks + top/bottom handrails & water pilings)
    for (let dx = 0; dx < TILE_SIZE; dx += 4) {
      ctx.fillStyle = (dx / 4) % 2 === 0 ? '#b4692c' : '#9c5620';
      ctx.fillRect(px + dx, py + 1, 3, TILE_SIZE - 2);
      ctx.fillStyle = '#5c3110';
      ctx.fillRect(px + dx + 3, py + 1, 1, TILE_SIZE - 2);
    }
    if (!hasBridgeUp) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px, py, TILE_SIZE, 2);
      ctx.fillStyle = '#eab308';
      if (x % 3 === 0) ctx.fillRect(px + 6, py, 3, 3); // Bollard post cap
    }
    if (!hasBridgeDown) {
      ctx.fillStyle = '#3b1806';
      ctx.fillRect(px, py + 13, TILE_SIZE, 3);
      // Timber support pilings dipping into water
      if (x % 2 === 0) {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 6, py + 14, 3, 2);
      }
    }
  }
}

export function renderLedgeTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  renderLedgeTileV2(ctx, px, py, x, y);
}

export function renderWaterfallChuteTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  renderWaterfallTileV2(ctx, px, py, x, y);
}

function drawSeaStackRock(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(235, 252, 255, 0.62)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 12, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#26201a';
  ctx.fillRect(px + 2, py + 6, 12, 8);
  ctx.fillStyle = '#594d40';
  ctx.fillRect(px + 3, py + 4, 10, 8);
  ctx.fillStyle = '#8a7967';
  ctx.fillRect(px + 4, py + 3, 6, 5);
  ctx.fillStyle = '#4d9438';
  ctx.fillRect(px + 4, py + 2, 5, 2);
  ctx.restore();
}

function drawWaterLilyPadCluster(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(px + 6, py + 7, 4.5, 0.35, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 4, py + 5, 3, 2);

  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.arc(px + 12, py + 12, 3.5, 0.2, Math.PI * 1.9);
  ctx.fill();

  // Blooming pink lotus on primary pad
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(px + 5, py + 4, 3, 3);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 6, py + 5, 1, 1);
  ctx.restore();
}

function drawSummitVistaMedallion(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 1, py + 1, 14, 14);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 2, py + 2, 12, 12);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 4, py + 4, 8, 8);
  // Golden compass star
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 7, py + 3, 2, 10);
  ctx.fillRect(px + 3, py + 7, 10, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 7, py + 7, 2, 2);
  ctx.restore();
}

export function renderWorldBiomeDecorations(
  ctx: CanvasRenderingContext2D,
  map: TownMap,
  helpers: BiomePropDrawHelpers
) {
  // 1. Summit Vista Compass Medallion on Highland Tier 2 Overlook (85, 8)
  drawSummitVistaMedallion(
    ctx,
    SUMMIT_VISTA_POINT.x * TILE_SIZE,
    SUMMIT_VISTA_POINT.y * TILE_SIZE
  );

  // 2. Sort environmental decorations by Y so overlapping canopies layer naturally
  const list = (map.decorations || []).slice().sort((a, b) => a.y - b.y);
  for (const dec of list) {
    const px = dec.x * TILE_SIZE;
    const py = dec.y * TILE_SIZE;
    switch (dec.kind) {
      case 'tree_oak':
        helpers.drawOakTree(ctx, px - 4, py - 8);
        break;
      case 'tree_pine':
        helpers.drawPineTree(ctx, px, py);
        break;
      case 'tree_sakura':
        helpers.drawSakuraTree(ctx, px - 4, py - 8);
        break;
      case 'tree_palm':
        helpers.drawPalmTree(ctx, px, py);
        break;
      case 'tree_autumn':
        helpers.drawAutumnTree(ctx, px, py);
        break;
      case 'tree_golden':
        helpers.drawGoldenTree(ctx, px, py);
        break;
      case 'boulder':
        helpers.drawBoulder(ctx, px, py);
        break;
      case 'sea_stack':
        drawSeaStackRock(ctx, px, py);
        break;
      case 'lily_pad':
        drawWaterLilyPadCluster(ctx, px, py);
        break;
      case 'reeds':
        helpers.drawReeds(ctx, px, py);
        break;
      case 'torii':
        helpers.drawToriiGate(ctx, (dec.x - 1) * TILE_SIZE, (dec.y - 1) * TILE_SIZE);
        break;
      case 'ruin_pillar':
        helpers.drawAncientPillar(ctx, px, py - TILE_SIZE);
        break;
      case 'bench':
        helpers.drawBench(ctx, px + 8, py + 2);
        break;
      case 'picnic':
        helpers.drawPicnicSet(ctx, px, py);
        break;
    }
  }

  // 3. Uncollected Hidden PokéBall Items across the 4 outer biomes
  const found = getFoundHiddenPokeballs();
  for (const item of HIDDEN_POKEBALL_ITEMS) {
    if (found.has(item.id)) continue;
    helpers.drawPokeballItem(ctx, item.x * TILE_SIZE, item.y * TILE_SIZE);
  }
}
