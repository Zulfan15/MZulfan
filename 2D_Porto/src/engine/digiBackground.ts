import { TILE_SIZE } from './sprites';
import { townConfig, type TileTypeKey } from './townConfig';
import {
  drawDigitalWarpPad,
  renderAllConnectedFences,
  renderAllConnectedHedges,
  renderConfiguredBenchesAndLamps,
  renderConfiguredExtraEntities,
  renderConfiguredFlowerBeds,
  renderManicuredTownTrees,
  renderTileOverrideByKey,
} from './townBackground';
import {
  DIGI_COLS,
  DIGI_ROWS,
  DIGI_PLAZA_CONSOLE,
  DIGI_RETURN_GATE,
  DIGI_ZONES,
} from './digiMap';
import { Tile, type TownMap } from './types';

function hashTile(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Renders the 40x45 (640x720 px) Digi-Sanctuary Island terrain, 4 themed Habitat Zones,
 * Central Digi-Plaza, Cyber Bridges, North Return Gate, and dynamic Town Editor layers.
 */
export function createDigiBackgroundCanvas(map: TownMap): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = map.w * TILE_SIZE;
  canvas.height = map.h * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Digital Data Ocean backdrop (deep cyber navy + cyan circuit matrix)
  drawDigitalOceanBackdrop(ctx, map);

  // 2. Glowing Island / Bridge Underglow Shadows where land meets Digital Ocean
  drawIslandCoastlines(ctx, map);

  // 3. Base Walkable Zone Surfaces & Bridges
  drawDigiTerrainZones(ctx, map);

  // 4. North Data Cliffs / Crystal Pines
  drawNorthDataCliffs(ctx, map);

  // 5. Central Digi-Plaza Hex Crest & Zone Altar Details
  drawZoneDecorDetails(ctx);

  // 6. North Return Gate Pad (X: 19..21, Y: 3..4)
  drawDigitalWarpPad(ctx, DIGI_RETURN_GATE.xMin, DIGI_RETURN_GATE.yMin, 'TOWN GATE');

  // 7. DigiDex Master Console (2x2 at X: 19..20, Y: 20..21) + Zone Info Terminals
  drawDigiDexMasterConsole(ctx, DIGI_PLAZA_CONSOLE.x * TILE_SIZE, DIGI_PLAZA_CONSOLE.y * TILE_SIZE);
  for (const s of map.signs) {
    if (s.id === DIGI_PLAZA_CONSOLE.id) continue;
    drawHoloInfoTerminal(ctx, s.x * TILE_SIZE, s.y * TILE_SIZE, s.id);
  }

  // 8. Dynamic Town Editor 2.0 Custom Tile Overrides (read from digimonLayout via active townConfig)
  for (const [key, tileKey] of townConfig.getAllTileOverrides().entries()) {
    const [tx, ty] = key.split(',').map(Number);
    if (isNaN(tx) || isNaN(ty) || tx < 0 || tx >= map.w || ty < 0 || ty >= map.h) continue;
    renderTileOverrideByKey(ctx, tx * TILE_SIZE, ty * TILE_SIZE, tx, ty, tileKey as TileTypeKey);
  }

  // 9. Connected Hedges, Fences, Flowers, Custom Trees, Extra Entities & Lamps (no Town fallbacks)
  renderAllConnectedHedges(ctx, DIGI_COLS, DIGI_ROWS);
  renderAllConnectedFences(ctx, map);
  renderConfiguredFlowerBeds(ctx);
  renderManicuredTownTrees(ctx, false);
  renderConfiguredExtraEntities(ctx);
  renderConfiguredBenchesAndLamps(ctx, false);

  return canvas;
}

function drawDigitalOceanBackdrop(ctx: CanvasRenderingContext2D, map: TownMap) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight(map));
  grad.addColorStop(0, '#040a18');
  grad.addColorStop(0.5, '#071428');
  grad.addColorStop(1, '#040b1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, map.w * TILE_SIZE, map.h * TILE_SIZE);

  // Subtle cyan circuit sea grid
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.04)';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      }
      ctx.fillStyle = 'rgba(0, 240, 255, 0.09)';
      ctx.fillRect(px, py, TILE_SIZE, 1);
      ctx.fillRect(px, py, 1, TILE_SIZE);

      const h = hashTile(x, y);
      if (h > 0.87) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(px + 5, py + 7, 6, 1);
        ctx.fillRect(px + 9, py + 7, 1, 4);
      } else if (h < 0.09) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
        ctx.fillRect(px + 7, py + 7, 2, 2);
      }
    }
  }
}

function canvasHeight(map: TownMap) {
  return map.h * TILE_SIZE;
}

function drawIslandCoastlines(ctx: CanvasRenderingContext2D, map: TownMap) {
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const idx = y * map.w + x;
      if (map.ground[idx] === Tile.WATER || map.ground[idx] === Tile.TREE) continue;
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      const isWater = (nx: number, ny: number) =>
        nx < 0 || ny < 0 || nx >= map.w || ny >= map.h || map.ground[ny * map.w + nx] === Tile.WATER;

      // Drop cliff wall & neon water edge glow on Southern coastlines
      if (isWater(x, y + 1)) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px, py + TILE_SIZE, TILE_SIZE, 5);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.fillRect(px, py + TILE_SIZE + 5, TILE_SIZE, 2);
      }
      if (isWater(x, y - 1)) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.32)';
        ctx.fillRect(px, py - 2, TILE_SIZE, 2);
      }
      if (isWater(x - 1, y)) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
        ctx.fillRect(px - 2, py, 2, TILE_SIZE);
      }
      if (isWater(x + 1, y)) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
        ctx.fillRect(px + TILE_SIZE, py, 2, TILE_SIZE);
      }
    }
  }
}

function inZone(x: number, y: number, z: { xMin: number; xMax: number; yMin: number; yMax: number }) {
  return x >= z.xMin && x <= z.xMax && y >= z.yMin && y <= z.yMax;
}

function drawDigiTerrainZones(ctx: CanvasRenderingContext2D, map: TownMap) {
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const g = map.ground[y * map.w + x];
      if (g === Tile.WATER || g === Tile.TREE) continue;

      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      if (inZone(x, y, DIGI_ZONES.flameDragon)) {
        renderTileOverrideByKey(ctx, px, py, x, y, 'lava_rock');
        // Warm basalt edge frame
        if (x === DIGI_ZONES.flameDragon.xMin || x === DIGI_ZONES.flameDragon.xMax ||
            y === DIGI_ZONES.flameDragon.yMin || y === DIGI_ZONES.flameDragon.yMax) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.22)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      } else if (inZone(x, y, DIGI_ZONES.cyberSteel)) {
        renderTileOverrideByKey(ctx, px, py, x, y, 'cyber_grid');
      } else if (inZone(x, y, DIGI_ZONES.aquaCryo)) {
        // Outer sandy frost rim + frosty cryo interior
        if (x === DIGI_ZONES.aquaCryo.xMin || x === DIGI_ZONES.aquaCryo.xMax ||
            y === DIGI_ZONES.aquaCryo.yMin || y === DIGI_ZONES.aquaCryo.yMax) {
          ctx.fillStyle = '#93c5fd';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = 'rgba(255,255,255,0.28)';
          ctx.fillRect(px + 2, py + 2, 12, 2);
        } else {
          renderTileOverrideByKey(ctx, px, py, x, y, 'cryo_ice');
        }
      } else if (inZone(x, y, DIGI_ZONES.verdantHoly)) {
        // Central Holy Marble altar diamond inside Verdant meadow
        const dx = Math.abs(x - 30);
        const dy = Math.abs(y - 32.5);
        if (dx + dy <= 3.5) {
          renderTileOverrideByKey(ctx, px, py, x, y, 'holy_marble');
        } else {
          renderTileOverrideByKey(ctx, px, py, x, y, 'grass');
        }
      } else if (g === Tile.PATH) {
        // Metallic Cyber Bridge deck
        ctx.fillStyle = (x + y) % 2 === 0 ? '#18263e' : '#1e304d';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        ctx.fillStyle = '#142033';
        ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        // Cyber bridge guide stripes
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.fillRect(px + 6, py + 6, 4, 4);
      } else {
        // North Gate Terrace & Central Digi-Plaza sleek slate floor
        ctx.fillStyle = (x + y) % 2 === 0 ? '#162338' : '#1b2b44';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
        ctx.fillRect(px, py, TILE_SIZE, 1);
        ctx.fillRect(px, py, 1, TILE_SIZE);
      }
    }
  }
}

function drawNorthDataCliffs(ctx: CanvasRenderingContext2D, map: TownMap) {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < map.w; x++) {
      if (map.ground[y * map.w + x] !== Tile.TREE) continue;
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      // Cyber crystal monolith trees along northern island crest
      ctx.fillStyle = '#091526';
      ctx.fillRect(px + 2, py + 3, 12, 12);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(px + 5, py + 1, 6, 10);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(px + 7, py + 2, 2, 7);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 3, py + 6, 3, 6);
      ctx.fillRect(px + 10, py + 6, 3, 6);
    }
  }
}

function drawZoneDecorDetails(ctx: CanvasRenderingContext2D) {
  ctx.save();

  // Central Digi-Plaza Digital Emblem Ring (centered around console 19..20, 20..21)
  const plazaCx = 20 * TILE_SIZE;
  const plazaCy = 21 * TILE_SIZE;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(plazaCx, plazaCy, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(plazaCx, plazaCy, 32, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle Zone Labels Painted Into Plaza Edges / Habitat Overlays
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';

  const drawPlaque = (cx: number, cy: number, title: string, accent: string) => {
    const w = title.length * 4.1 + 10;
    ctx.fillStyle = 'rgba(9, 17, 34, 0.85)';
    ctx.fillRect(cx - w / 2, cy - 5, w, 10);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - w / 2, cy - 5, w, 10);
    ctx.fillStyle = accent;
    ctx.fillText(title, cx, cy + 2);
  };

  drawPlaque(10.5 * TILE_SIZE, 8 * TILE_SIZE, 'FLAME CANYON', '#fb923c');
  drawPlaque(30.5 * TILE_SIZE, 8 * TILE_SIZE, 'CYBER DOME', '#38bdf8');
  drawPlaque(10.5 * TILE_SIZE, 28 * TILE_SIZE, 'CRYO BAY', '#67e8f9');
  drawPlaque(30.5 * TILE_SIZE, 28 * TILE_SIZE, 'HOLY SANCTUARY', '#fde047');

  ctx.restore();
}

function drawDigiDexMasterConsole(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();

  // Metallic Pedestal Base (32x32)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 2, py + 10, 28, 20);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 4, py + 12, 24, 16);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 6, py + 18, 20, 9);

  // Holographic Dual Display Terminal
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 4, py + 2, 24, 15);
  ctx.fillStyle = '#091a32';
  ctx.fillRect(px + 6, py + 4, 20, 11);

  // Glowing Cyan Crest & Scanlines
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(px + 8, py + 6, 16, 2);
  ctx.fillRect(px + 8, py + 10, 10, 1);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 20, py + 10, 4, 3);

  // Keyboard Console Trim
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 8, py + 19, 16, 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 13, py + 23, 6, 2);

  ctx.restore();
}

function drawHoloInfoTerminal(ctx: CanvasRenderingContext2D, px: number, py: number, id: string) {
  const accent =
    id.includes('flame') ? '#fb923c' :
    id.includes('cyber') ? '#38bdf8' :
    id.includes('aqua') ? '#67e8f9' : '#fde047';

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 6, 8, 9);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 5, py + 2, 6, 8);
  ctx.fillStyle = accent;
  ctx.fillRect(px + 6, py + 3, 4, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 7, py + 4, 2, 1);
}

