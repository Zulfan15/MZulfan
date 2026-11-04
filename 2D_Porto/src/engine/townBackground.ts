import { Tile, type TownMap } from './types';
import { TILE_SIZE } from './sprites';
import { MAP_W, MAP_H } from './map';
import { townConfig } from './townConfig';

/**
 * Procedural 2D Pixel-Art Town Map Generator.
 * Inspired by classic Pokémon Generation 4/5 (Sinnoh/Unova) towns:
 * - Mathematical urban alignment: clear zoning, straight streets, curbs, and symmetrical plazas.
 * - Buildings are neatly aligned along designated street frontages:
 *   1. North Grand Manor (Dev Center) - Centered at X: 16 with a grand symmetrical courtyard.
 *   2. North-East Technology Compound (Research Lab) - At X: 24 with satellite dish & lab glass.
 *   3. West Commercial & Residential Row (Aligned at X: 11):
 *      - Home Manor (Y: 22..28, Door at X: 15)
 *      - Pokémon Center (Y: 31..37, Door at X: 15)
 *      - Poké Mart / Depop (Y: 39..44, Door at X: 15)
 *   4. East Fountain Plaza & Arcade (X: 23..39, Y: 33..43) - Wide paved plaza, circular fountain, Charizard, and modern Arcade.
 *   5. South Outdoor Café Terrace (X: 23..33, Y: 45..53) - Symmetrical 2x2 patio with striped umbrellas for Socials.
 *   6. South-West Seaside Promenade & Garden - Overlooking the ocean with flowerbeds and park benches.
 */

export function createTownBackgroundCanvas(map: TownMap): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = MAP_W * TILE_SIZE;
  canvas.height = MAP_H * TILE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  // 1. BASE TERRAIN GRID (Grass meadow, Ocean water & coast, Forest floor, Tall grass, and Sea wall)
  renderBaseTerrain(ctx, map);
  renderSeaCoastAndPromenade(ctx);

  // 2. ROADS, PATHS, AND STONE PLAZAS (Stone aprons, Cobblestones, Fountain Plaza, Promenade, Arenas, Decks, Cycling track, Curbs)
  renderRoadsAndPlazas(ctx, map);

  // Custom painted tiles (Floor brush overrides painted by user in editor)
  renderCustomTileOverrides(ctx);

  // 3. BOUNDARY FOREST (Lush boundary canopy trees drawn on top of ground surfaces)
  renderLushBoundaryForest(ctx);

  // 4. CONNECTED FENCES (Tile-connected, override-aware, crisp Pokémon wrought-iron fences)
  renderAllConnectedFences(ctx, map);

  // 5. FOLIAGE, HEDGES, AND PLANTERS (Non-overlapping perimeter hedges, Planters, Manicured trees)
  renderFoliageFencesAndPlanters(ctx);

  // 6. BUILDINGS (All buildings, kiosks, gazebo, canopies with crisp pixel-art architecture)
  renderAllBuildings(ctx);

  // 7. DECORATIVE PROPS & ACCESSORIES (Fountain centered on X=29, Basin, Symmetrical Benches, Vending machine, Lamps, Tables, Telescopes)
  renderPropsAndStreetware(ctx);

  return canvas;
}

// ==========================================
// 1. BASE TERRAIN & WATER RENDERING
// ==========================================
function renderBaseTerrain(ctx: CanvasRenderingContext2D, map: TownMap) {
  // A. Unified warm Pokémon meadow grass base (Zero black/dark seams!)
  ctx.fillStyle = '#67b346';
  ctx.fillRect(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);

  // B. Tile-by-tile base terrain (Grass, Tall Grass, Ocean, Forest Floor)
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const tile = map.ground[y * MAP_W + x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      switch (tile) {
        case Tile.GRASS:
        case Tile.FENCE: {
          // Vibrant 2-tone Pokémon grass with subtle organic checker
          const isAlt = (x + y) % 2 === 0;
          ctx.fillStyle = isAlt ? '#67b346' : '#5da83e';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

          // Subtle grass blade tufts
          if ((x * 7 + y * 13) % 5 === 0) {
            ctx.fillStyle = '#4f9432';
            ctx.fillRect(px + 4, py + 5, 2, 3);
            ctx.fillStyle = '#78c755';
            ctx.fillRect(px + 6, py + 3, 1, 3);
          }
          // Organic wildflowers & clover dots
          if ((x * 11 + y * 17) % 19 === 0) {
            ctx.fillStyle = (x + y) % 3 === 0 ? '#ffea75' : (x + y) % 3 === 1 ? '#ff6b6b' : '#ffffff';
            ctx.fillRect(px + 5, py + 8, 2, 2);
            ctx.fillStyle = '#529b35';
            ctx.fillRect(px + 4, py + 10, 1, 1);
          }
          break;
        }

        case Tile.TREE: {
          // Lush Woodland Forest Floor: warm, harmonized shaded grass blending into the meadow
          const isAlt = (x + y) % 2 === 0;
          ctx.fillStyle = isAlt ? '#5ca339' : '#529930';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

          // Organic canopy dapple shade & moss patches
          if ((x * 7 + y * 13) % 4 === 0) {
            ctx.fillStyle = '#417d24';
            ctx.fillRect(px + 2, py + 3, 5, 4);
          }
          if ((x * 11 + y * 7) % 5 === 0) {
            ctx.fillStyle = '#6fc047';
            ctx.fillRect(px + 8, py + 5, 2, 2);
          }
          break;
        }

        case Tile.TALL: {
          // Authentic Pokémon Sinnoh/Unova swaying tall grass
          ctx.fillStyle = '#458f2f';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

          // Deep blade shadows
          ctx.fillStyle = '#2b651b';
          ctx.fillRect(px + 1, py + 3, 3, 13);
          ctx.fillRect(px + 6, py + 2, 3, 14);
          ctx.fillRect(px + 11, py + 4, 3, 12);

          // Vibrant midtone emerald blades
          ctx.fillStyle = '#55a437';
          ctx.fillRect(px + 2, py + 2, 2, 11);
          ctx.fillRect(px + 7, py + 1, 2, 12);
          ctx.fillRect(px + 12, py + 3, 2, 10);

          // Golden-green sunlit blade tips
          ctx.fillStyle = '#8ce458';
          ctx.fillRect(px + 2, py + 1, 2, 2);
          ctx.fillRect(px + 7, py, 2, 2);
          ctx.fillRect(px + 12, py + 2, 2, 2);

          // Subtle wild flower/clover speck
          if ((x * 5 + y * 11) % 7 === 0) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#ffea75' : '#ff6b6b';
            ctx.fillRect(px + 4, py + 6, 2, 2);
          }
          break;
        }

        case Tile.WATER: {
          // Ocean Coast & Shoreline (West)
          renderOceanTile(ctx, px, py, x, y);
          break;
        }
      }
    }
  }
}

// ==========================================
// 2. ROADS, PATHS & STONE PLAZAS PIPELINE
// ==========================================
function renderRoadsAndPlazas(ctx: CanvasRenderingContext2D, map: TownMap) {
  // A. Paved Roads & Cobblestone Pavers
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const tile = map.ground[y * MAP_W + x];
      if (tile === Tile.PATH) {
        renderCobbleTile(ctx, x * TILE_SIZE, y * TILE_SIZE, x, y);
      }
    }
  }

  // B. Specialized District Ground Surfaces
  renderScenicLookoutTerrace(ctx);
  // Note: renderBerryGardenGround is rendered in Step 5 (renderFoliageFencesAndPlanters) immediately beneath its foliage & planters
  renderContestStageGround(ctx);
  renderRangerCampGround(ctx);
  renderCyclingLaneGraphics(ctx);

  // C. 3D Beveled Curbs & Organic Grass Fringe Blending
  renderPathCurbsAndGrassFringe(ctx, map);
}

// ───────────────────────── Cobblestones & Specialized Plazas ─────────────────────────
// ───────────────────────── Cobblestones & Specialized Plazas ─────────────────────────
function renderCobbleTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // 1. Shifted Outdoor Café Bistro Patio (French terracotta & porcelain checkerboard at X: 34..42, Y: 48..55)
  if (x >= 34 && x <= 42 && y >= 48 && y <= 55) {
    renderCafePatioTile(ctx, px, py, x, y);
    return;
  }

  // 2. East Promenade (X: 34..35, Y: 6..47 - Unbroken straight 2-tile wide stone promenade)
  if (x >= 34 && x <= 35 && y >= 6 && y <= 54) {
    const isAlt = (x + y) % 2 === 0;
    ctx.fillStyle = isAlt ? '#e2e8f0' : '#cbd5e1';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
    ctx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(px, py, TILE_SIZE, 1);
    return;
  }

  // 3. Grand Fountain Plaza (X: 24..33, Y: 25..35 - Seamless civic flagstones centered on X=29.0, Y=31.0)
  if (x >= 24 && x <= 33 && y >= 25 && y <= 35) {
    renderFountainPlazaTile(ctx, px, py, x, y);
    return;
  }

  // 4. Dev Center Stone Apron & Ceremonial Manor Courtyard (X: 9..21, Y: 1..17)
  if (x >= 9 && x <= 21 && y >= 1 && y <= 17) {
    renderDevCourtyardTile(ctx, px, py, x, y);
    return;
  }

  // 4.5. Research Lab Stone Apron & Campus Courtyard (X: 23..34, Y: 1..12)
  if (x >= 23 && x <= 34 && y >= 1 && y <= 12) {
    renderLabCampusTile(ctx, px, py, x, y);
    return;
  }

  // 4.5. South Civic Plaza & Barista Forecourt Pavers (X: 24..33, Y: 46..55)
  if (x >= 24 && x <= 33 && y >= 46 && y <= 55) {
    renderDevCourtyardTile(ctx, px, py, x, y);
    return;
  }

  // 5. West Commercial & Tech Tower Plaza (X: 2..19, Y: 43..55)
  if (x >= 2 && x <= 19 && y >= 43 && y <= 55) {
    renderWestPlazaTile(ctx, px, py, x, y);
    return;
  }

  // 5.5. Brick Cycling & Jogging Lane (X: 3..4, Y: 27..42)
  if (x >= 3 && x <= 4 && y >= 27 && y <= 42) {
    renderCyclingTile(ctx, px, py, x, y);
    return;
  }

  // 6. Standard Streets & Boulevard (Running-bond staggered authentic cobblestone)
  renderStreetCobbleTile(ctx, px, py, x, y);
}

function renderFountainPlazaTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  const cx = 29.0 * TILE_SIZE; // 464px — aligned with Arcade double doors and Battle Arena axis
  const cy = 31.0 * TILE_SIZE; // 496px
  const midX = px + 8;
  const midY = py + 8;
  const dist = Math.hypot(midX - cx, midY - cy);

  // Concentric radial bands around the Fountain
  if (dist < 38) {
    // Inner terracotta promenade ring circling the fountain water
    ctx.fillStyle = (x + y) % 2 === 0 ? '#cb7b55' : '#be6e48';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#df936e';
    ctx.fillRect(px + 1, py + 1, 14, 14);
    ctx.fillStyle = '#b05e38';
    ctx.fillRect(px + 2, py + 2, 12, 12);
  } else if (dist < 72 && y <= 35) {
    // Grand radial ring of light limestone flagstones in fountain rotunda
    const angle = Math.atan2(midY - cy, midX - cx);
    const sector = Math.floor((angle + Math.PI) / (Math.PI / 8));
    ctx.fillStyle = sector % 2 === 0 ? '#f5eee3' : '#e8dece';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Warm soft mortar joints
    ctx.fillStyle = '#c5b8a5';
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);

    // Center rosette dot
    if ((x + y) % 3 === 0) {
      ctx.fillStyle = '#c27d53';
      ctx.fillRect(px + 6, py + 6, 4, 4);
    }
  } else {
    // Outer civic plaza warm flagstones & Arcade forecourt
    const isAlt = (x + y) % 2 === 0;
    ctx.fillStyle = isAlt ? '#eae3d5' : '#dfd7c7';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(px, py, TILE_SIZE, 1);
    ctx.fillRect(px, py, 1, TILE_SIZE);
    ctx.fillStyle = '#c8bcab';
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);

    // Subtle diamond paver accents in Arcade forecourt
    if (y >= 37 && (x * 7 + y * 13) % 4 === 0) {
      ctx.fillStyle = '#cfa276';
      ctx.fillRect(px + 6, py + 6, 4, 4);
    }
  }
}

function renderMeadowGrassTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#67b346' : '#5da83e';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  if ((x * 7 + y * 13) % 5 === 0) {
    ctx.fillStyle = '#4f9432';
    ctx.fillRect(px + 4, py + 5, 2, 3);
    ctx.fillStyle = '#78c755';
    ctx.fillRect(px + 6, py + 3, 1, 3);
  }
  if ((x * 11 + y * 17) % 19 === 0) {
    ctx.fillStyle = (x + y) % 3 === 0 ? '#ffea75' : (x + y) % 3 === 1 ? '#ff6b6b' : '#ffffff';
    ctx.fillRect(px + 5, py + 8, 2, 2);
  }
}

function renderDevCourtyardTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Palace stone plinth apron (perimeter foundation around Dev Center Manor walls at Y: 1..11)
  if (y < 12) {
    const isAlt = (x + y) % 2 === 0;
    ctx.fillStyle = isAlt ? '#d8cbba' : '#cbbea9';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(px, py, TILE_SIZE, 1);
    ctx.fillRect(px, py, 1, TILE_SIZE);
    ctx.fillStyle = '#9c8e7c';
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);
    return;
  }

  // Central royal ceremonial carpet runner (X: 15..16 centered precisely with Dev Manor door at X=16.0)
  const isCenterRunner = (x === 15 || x === 16) && y >= 12;
  if (isCenterRunner) {
    ctx.fillStyle = (x + y) % 2 === 0 ? '#fdfbf6' : '#f4eee0';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Lateral border stripes in imperial gold-bronze
    if (x === 15) {
      ctx.fillStyle = '#c29b38';
      ctx.fillRect(px, py, 2, TILE_SIZE);
    }
    if (x === 16) {
      ctx.fillStyle = '#c29b38';
      ctx.fillRect(px + 14, py, 2, TILE_SIZE);
    }

    ctx.fillStyle = '#d5caa0';
    ctx.fillRect(px + 2, py + 7, 12, 1);
    ctx.fillRect(px + 2, py + 15, 12, 1);
    return;
  }

  // Perimeter border of the courtyard
  const isBorder = x === 9 || x === 21 || y === 13 || y === 17;
  if (isBorder) {
    ctx.fillStyle = (x + y) % 2 === 0 ? '#bfae9b' : '#b2a08c';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(px, py, TILE_SIZE, 1);
    ctx.fillRect(px, py, 1, TILE_SIZE);
    ctx.fillStyle = '#9b8a78';
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);
    return;
  }

  // Palace courtyard parterre field
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#eee6d8' : '#e4dccb';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(px + 1, py + 1, 14, 1);
  ctx.fillStyle = '#c8bcab';
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
  ctx.fillRect(px + 15, py, 1, TILE_SIZE);

  // Subtle diamond accent
  if ((x + y) % 3 === 0) {
    ctx.fillStyle = '#d8cbba';
    ctx.fillRect(px + 6, py + 6, 4, 4);
  }
}

function renderLabCampusTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Clean modern high-tech stone pavers with subtle grid joints (Research Lab Apron & Campus)
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#e5e7eb' : '#d1d5db';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Clean light mortar joints
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
  ctx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);

  // Subtle highlight line on top and left
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(px, py, TILE_SIZE, 1);
  ctx.fillRect(px, py, 1, TILE_SIZE);

  // Clean center tech tile dot for campus look
  if ((x + y) % 3 === 0) {
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(px + 7, py + 7, 2, 2);
  }
}

function renderCyclingTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#b45309' : '#9a3412'; // Warm terracotta brick
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
  ctx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px, py, TILE_SIZE, 1);
  ctx.fillRect(px, py, 1, TILE_SIZE);
}

function renderCafePatioTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Symmetrical French Café bistro terracotta & porcelain tiles
  const isTileA = (x + y) % 2 === 0;
  ctx.fillStyle = isTileA ? '#e08f6b' : '#f7f0e4';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = isTileA ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(px, py, TILE_SIZE, 1);
  ctx.fillRect(px, py, 1, TILE_SIZE);

  ctx.fillStyle = isTileA ? '#b06544' : '#c8bcae';
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
  ctx.fillRect(px + 15, py, 1, TILE_SIZE);
}

function renderWestPlazaTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Mediterranean fan cobblestone around the botanical garden
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? '#e8dfd1' : '#dfd5c5';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(px, py, TILE_SIZE, 1);
  ctx.fillRect(px, py, 1, TILE_SIZE);

  ctx.fillStyle = '#c2b6a3';
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
  ctx.fillRect(px + 15, py, 1, TILE_SIZE);
}

function renderStreetCobbleTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Authentic running-bond cobblestone street with natural stone hue variations!
  const isRowEven = y % 2 === 0;
  const hash = x * 17 + y * 31;
  const palette = ['#eee6d8', '#e5dcce', '#dad1c2', '#cfc6b5'];
  ctx.fillStyle = palette[Math.abs(hash) % palette.length];
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Stone highlight top/left
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(px, py, TILE_SIZE, 1);
  ctx.fillRect(px, py + 8, TILE_SIZE, 1);

  // Soft warm mortar lines (NO BLACK STROKES!)
  ctx.fillStyle = '#baa997';
  ctx.fillRect(px, py + 7, TILE_SIZE, 1);
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);

  // Staggered vertical joints
  if (isRowEven) {
    ctx.fillRect(px + 7, py, 1, 7);
    ctx.fillRect(px + 15, py + 8, 1, 7);
  } else {
    ctx.fillRect(px + 15, py, 1, 7);
    ctx.fillRect(px + 7, py + 8, 1, 7);
  }

  // Stone surface texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  if (isRowEven) {
    ctx.fillRect(px + 1, py + 1, 6, 1);
    ctx.fillRect(px + 9, py + 9, 6, 1);
  } else {
    ctx.fillRect(px + 9, py + 1, 6, 1);
    ctx.fillRect(px + 1, py + 9, 6, 1);
  }
}

// ───────────────────────── 3D Curbs & Grass Fringe Blending ─────────────────────────
export function isTilePaved(map: TownMap, x: number, y: number): boolean {
  if (x < 0 || x >= map.w || y < 0 || y >= map.h) return false;
  // Contest stage footprint is always paved
  const contest = townConfig.getBuilding('contest');
  if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
    return true;
  }
  // Outdoor Café Bistro Patio is always paved
  if (x >= 34 && x <= 42 && y >= 48 && y <= 55) {
    return true;
  }
  // South Civic Plaza & Barista grounds are always paved
  if (x >= 24 && x <= 33 && y >= 46 && y <= 55) {
    return true;
  }
  // Custom tile overrides from editor
  const override = townConfig.getTileOverride(x, y);
  if (override === 'dev_paver' || override === 'lab_paver' || override === 'cobble' || override === 'walkable_override') {
    return true;
  }
  if (override !== null && override !== undefined) return false;
  return map.ground[y * map.w + x] === Tile.PATH;
}

export function isTileGrass(map: TownMap, x: number, y: number): boolean {
  if (x < 0 || x >= map.w || y < 0 || y >= map.h) return false;
  // Contest stage footprint is paved (never grass)
  const contest = townConfig.getBuilding('contest');
  if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
    return false;
  }
  // Outdoor Café Bistro Patio is paved (never grass)
  if (x >= 34 && x <= 42 && y >= 48 && y <= 55) {
    return false;
  }
  // South Civic Plaza & Barista grounds are paved (never grass)
  if (x >= 24 && x <= 33 && y >= 46 && y <= 55) {
    return false;
  }
  // Custom tile overrides from editor
  const override = townConfig.getTileOverride(x, y);
  if (override === 'grass' || override === 'tall_grass') return true;
  if (override !== null && override !== undefined) return false;
  return map.ground[y * map.w + x] === Tile.GRASS;
}

function renderPathCurbsAndGrassFringe(ctx: CanvasRenderingContext2D, map: TownMap) {
  const contest = townConfig.getBuilding('contest');
  ctx.save();
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      // Never draw curbs or grass fringe blades on top of Contest Stage
      if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
        continue;
      }
      // Never draw curbs or grass fringe blades on top of Café Bistro Patio
      if (x >= 34 && x <= 42 && y >= 48 && y <= 55) {
        continue;
      }

      if (!isTilePaved(map, x, y)) continue;
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      const hasGrassTop = y > 0 && isTileGrass(map, x, y - 1);
      const hasGrassBottom = y < map.h - 1 && isTileGrass(map, x, y + 1);
      const hasGrassLeft = x > 0 && isTileGrass(map, x - 1, y);
      const hasGrassRight = x < map.w - 1 && isTileGrass(map, x + 1, y);

      const curbFace = '#b8aa97';
      const curbBevel = '#ede4d4';
      const curbShadow = '#827464';

      if (hasGrassTop) {
        ctx.fillStyle = curbShadow;
        ctx.fillRect(px, py, TILE_SIZE, 2);
        ctx.fillStyle = curbFace;
        ctx.fillRect(px, py + 1, TILE_SIZE, 2);
        ctx.fillStyle = curbBevel;
        ctx.fillRect(px, py + 2, TILE_SIZE, 1);

        // Natural grass fringe serration spilling over curb
        ctx.fillStyle = '#67b346';
        for (let i = 0; i < TILE_SIZE; i += 3) {
          const bladeH = ((x * 5 + i * 3) % 3) + 1;
          ctx.fillRect(px + i, py, 2, bladeH);
        }
      }

      if (hasGrassBottom) {
        ctx.fillStyle = curbBevel;
        ctx.fillRect(px, py + 13, TILE_SIZE, 1);
        ctx.fillStyle = curbFace;
        ctx.fillRect(px, py + 14, TILE_SIZE, 2);
        ctx.fillStyle = curbShadow;
        ctx.fillRect(px, py + 15, TILE_SIZE, 1);

        ctx.fillStyle = '#5da83e';
        for (let i = 1; i < TILE_SIZE; i += 3) {
          const bladeH = ((x * 7 + i * 5) % 3) + 1;
          ctx.fillRect(px + i, py + 16 - bladeH, 2, bladeH);
        }
      }

      if (hasGrassLeft) {
        ctx.fillStyle = curbShadow;
        ctx.fillRect(px, py, 2, TILE_SIZE);
        ctx.fillStyle = curbFace;
        ctx.fillRect(px + 1, py, 2, TILE_SIZE);
        ctx.fillStyle = curbBevel;
        ctx.fillRect(px + 2, py, 1, TILE_SIZE);

        ctx.fillStyle = '#67b346';
        for (let j = 0; j < TILE_SIZE; j += 3) {
          const bladeW = ((y * 5 + j * 3) % 3) + 1;
          ctx.fillRect(px, py + j, bladeW, 2);
        }
      }

      if (hasGrassRight) {
        ctx.fillStyle = curbBevel;
        ctx.fillRect(px + 13, py, 1, TILE_SIZE);
        ctx.fillStyle = curbFace;
        ctx.fillRect(px + 14, py, 2, TILE_SIZE);
        ctx.fillStyle = curbShadow;
        ctx.fillRect(px + 15, py, 1, TILE_SIZE);

        ctx.fillStyle = '#5da83e';
        for (let j = 1; j < TILE_SIZE; j += 3) {
          const bladeW = ((y * 7 + j * 5) % 3) + 1;
          ctx.fillRect(px + 16 - bladeW, py + j, bladeW, 2);
        }
      }
    }
  }
  ctx.restore();
}

// ───────────────────────── Ocean & Coastal Promenade ─────────────────────────
function renderOceanTile(ctx: CanvasRenderingContext2D, px: number, py: number, x: number, y: number) {
  // Depth gradient: deep abyss to coastal azure
  const depth = x < 2 ? 0 : x < 4 ? 1 : x < 6 ? 2 : x < 8 ? 3 : 4;
  const colors = ['#0e385d', '#154c79', '#1e6498', '#2a7fb7', '#3d9acb'];
  ctx.fillStyle = colors[depth] || '#154c79';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Layered shimmering wave crests
  ctx.fillStyle = 'rgba(230, 250, 255, 0.28)';
  if ((x * 3 + y * 7) % 4 === 0) {
    ctx.fillRect(px + 2, py + 4, 8, 1);
    ctx.fillRect(px + 4, py + 5, 5, 1);
  }
  if ((x * 5 + y * 11) % 5 === 0) {
    ctx.fillRect(px + 6, py + 11, 7, 1);
  }

  // Tide foam near seawall
  if (x >= 7 && x <= 8) {
    ctx.fillStyle = 'rgba(235, 252, 255, 0.45)';
    ctx.fillRect(px + 8, py + 1, 6, 2);
    ctx.fillRect(px + 10, py + 7, 5, 2);
  }
}

function renderSeaCoastAndPromenade(ctx: CanvasRenderingContext2D) {
  ctx.save();
  // 1. Quayside Promenade Stone Sea-Wall (Running along X = 8, Y = 0..26, stops before West Boardwalk)
  for (let y = 0; y <= 26; y++) {
    const cx = 8 * TILE_SIZE;
    const cy = y * TILE_SIZE;

    // A. Wall Shadow cast onto coastal water
    ctx.fillStyle = 'rgba(8, 24, 42, 0.45)';
    ctx.fillRect(cx - 6, cy, 6, 16);

    // B. Sea foam along base of seawall
    ctx.fillStyle = 'rgba(230, 250, 255, 0.65)';
    if (y % 2 === 0) {
      ctx.fillRect(cx - 3, cy + 2, 4, 12);
    } else {
      ctx.fillRect(cx - 4, cy + 4, 5, 8);
    }

    // C. Heavy Granite Masonry Wall (Courses with staggered joints)
    ctx.fillStyle = '#4a4136'; // Deep shadow mortar
    ctx.fillRect(cx, cy, 14, 16);

    const isRowAlt = y % 2 === 0;
    // Block 1
    ctx.fillStyle = isRowAlt ? '#7d7061' : '#6f6355';
    ctx.fillRect(cx + 1, cy + 1, 12, 6);
    ctx.fillStyle = '#948675'; // Block highlight
    ctx.fillRect(cx + 1, cy + 1, 12, 1);

    // Block 2
    ctx.fillStyle = isRowAlt ? '#685d50' : '#766a5b';
    ctx.fillRect(cx + 1, cy + 8, 12, 7);
    ctx.fillStyle = '#8a7d6d';
    ctx.fillRect(cx + 1, cy + 8, 12, 1);

    // Waterline moss / algae tint near bottom
    ctx.fillStyle = 'rgba(50, 100, 40, 0.4)';
    ctx.fillRect(cx, cy + 12, 14, 4);

    // D. Dressed Stone Parapet Coping on top of sea wall (at X: 8.5)
    ctx.fillStyle = '#c5baaa'; // Sunny coping stone
    ctx.fillRect(cx + 10, cy, 5, 16);
    ctx.fillStyle = '#e8dfd2'; // Sunlit bevel
    ctx.fillRect(cx + 10, cy, 2, 16);
    ctx.fillStyle = '#8c7f70'; // Coping underside shadow
    ctx.fillRect(cx + 9, cy, 1, 16);

    // E. Maritime Iron Promenade Railing
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(cx + 12, cy, 2, 16); // Top rail
    ctx.fillRect(cx + 11, cy + 7, 4, 3); // Post
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx + 12, cy + 7, 2, 1); // Post cap highlight
  }

  // 1.5 Northern Seawall Coping & Railing overlooking bay along Y = 26 (X: 0..8 unbroken)
  for (let x = 0; x <= 8; x++) {
    const px = x * TILE_SIZE;
    const py = 26 * TILE_SIZE;
    drawMaritimeSeaRailing(ctx, px, py, 'N');
  }

  // 2. Coastal Granite Sea-Stacks in the Bay
  const boulderLocations = [
    { x: 3, y: 5 },
    { x: 5, y: 11 },
    { x: 2, y: 17 },
    { x: 4, y: 23 },
  ];

  for (const b of boulderLocations) {
    const bx = b.x * TILE_SIZE;
    const by = b.y * TILE_SIZE;

    // Ripple foam ring around boulder
    ctx.fillStyle = 'rgba(235, 252, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(bx + 8, by + 12, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep boulder shadow
    ctx.fillStyle = '#26201a';
    ctx.fillRect(bx + 2, by + 6, 12, 8);
    ctx.fillRect(bx + 1, by + 8, 14, 5);

    // Granite rock body
    ctx.fillStyle = '#594d40';
    ctx.fillRect(bx + 3, by + 4, 10, 8);
    ctx.fillStyle = '#7a6b5a';
    ctx.fillRect(bx + 4, by + 3, 7, 6);
    ctx.fillStyle = '#9e8c78';
    ctx.fillRect(bx + 5, by + 3, 4, 3);

    // Mossy seaweed cap
    ctx.fillStyle = '#3f7832';
    ctx.fillRect(bx + 4, by + 2, 6, 3);
    ctx.fillStyle = '#66b84d';
    ctx.fillRect(bx + 5, by + 2, 3, 1);
  }
  ctx.restore();
}

export function drawMaritimeSeaRailing(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  orientation: 'N' | 'E' | 'S' | 'W' = 'N'
) {
  if (orientation === 'E' || orientation === 'W') {
    // Vertical maritime railing (like western promenade)
    // Parapet coping stone
    ctx.fillStyle = '#c5baaa';
    ctx.fillRect(px + 10, py, 2, 16);
    ctx.fillStyle = '#8c7f70';
    ctx.fillRect(px + 9, py, 1, 16);
    // Protective maritime railing
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px + 12, py, 2, 16); // Top rail
    ctx.fillRect(px + 11, py + 7, 4, 3); // Post
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(px + 12, py + 7, 2, 1); // Post cap highlight
  } else {
    // Horizontal maritime railing (like northern seawall)
    // Parapet coping stone
    ctx.fillStyle = '#c5baaa';
    ctx.fillRect(px, py + 12, TILE_SIZE, 4);
    ctx.fillStyle = '#e8dfd2';
    ctx.fillRect(px, py + 12, TILE_SIZE, 1);
    ctx.fillStyle = '#8c7f70';
    ctx.fillRect(px, py + 15, TILE_SIZE, 1);
    // Protective maritime railing
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py + 10, TILE_SIZE, 2);
    ctx.fillRect(px + 7, py + 10, 2, 4);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(px + 7, py + 9, 2, 1);
  }
}

// ==========================================
// 2. LUSH INTERLOCKING BOUNDARY FORESTS (Authentic Pokémon Gen 4/5 Canopy Wall)
// ==========================================
function renderLushBoundaryForest(ctx: CanvasRenderingContext2D) {
  // A. Eastern Boundary — Single Column Forest Wall (X: 44, Y: 0..63)
  for (let y = 0; y <= 63; y += 2) {
    drawPokemonForestCanopyTree(ctx, 44 * TILE_SIZE - 12, y * TILE_SIZE - 6, true);
  }

  // B. Unified North Boundary Forest Row (X: 0..42, Y: 0..1, strictly 1 row)
  for (let y = 0; y <= 1; y += 2) {
    for (let x = 0; x <= 42; x += 2) {
      // Behind Dev Center, Research Lab & East Promenade (X: 9..43), canopy trees are replaced by boundary fence
      if (x >= 9 && x <= 43) continue;
      drawPokemonForestCanopyTree(ctx, Math.max(0, x * TILE_SIZE - 4), y * TILE_SIZE, y >= 0);
    }
  }

  // D. Western Boundary Forest Ridge (X: 0..1, Y: 33..60, authentic boundary border)
  for (let y = 33; y <= 60; y += 2) {
    const isAlt = Math.floor(y / 2) % 2 === 1;
    const startX = isAlt ? 1 : 0;
    for (let x = startX; x <= 1; x += 2) {
      drawPokemonForestCanopyTree(ctx, Math.max(0, x * TILE_SIZE - 4), y * TILE_SIZE - 6, true);
    }
  }

  // E. Unbroken Double-Layer South Boundary Forest Wall (Y: 61..63, strictly NO GAPS anywhere across X: 0..44!)
  // Layer 1 (Back Canopy Row): Spans full width of the town across X: 0..44
  for (let x = 0; x <= 44; x += 2) {
    drawPokemonForestCanopyTree(ctx, x * TILE_SIZE - 4, 61 * TILE_SIZE - 4, true);
  }
  // Layer 2 (Front Canopy Row): Interlocking full width across X: 1..43, perfectly closing all gaps!
  for (let x = 1; x <= 43; x += 2) {
    drawPokemonForestCanopyTree(ctx, x * TILE_SIZE - 4, 61.5 * TILE_SIZE, true);
  }
}

// ==========================================
// 3. FOLIAGE, HEDGES, MANICURED TREES & FENCES
// ==========================================
export function isTileFence(map: TownMap, x: number, y: number): boolean {
  if (x < 0 || x >= map.w || y < 0 || y >= map.h) return false;
  const override = townConfig.getTileOverride(x, y);
  if (override === 'fence') return true;
  if (override !== null && override !== undefined) return false; // Overridden with grass, floor, etc. -> NOT a fence
  return map.ground[y * map.w + x] === Tile.FENCE;
}

export function renderAllConnectedFences(ctx: CanvasRenderingContext2D, map: TownMap) {
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      if (!isTileFence(map, x, y)) continue;

      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      const hasL = isTileFence(map, x - 1, y);
      const hasR = isTileFence(map, x + 1, y);
      const hasU = isTileFence(map, x, y - 1);
      const hasD = isTileFence(map, x, y + 1);

      drawSingleConnectedFenceTile(ctx, px, py, hasL, hasR, hasU, hasD);
    }
  }
}

function drawSingleConnectedFenceTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  hasL: boolean,
  hasR: boolean,
  hasU: boolean,
  hasD: boolean
) {
  const isHoriz = hasL || hasR || (!hasU && !hasD);
  const isVert = hasU || hasD;

  // Case 1: Purely vertical segment
  if (isVert && !hasL && !hasR) {
    const y1 = hasU ? py : py + 2;
    const y2 = hasD ? py + 16 : py + 14;

    // Ground contact shadow
    if (!hasD) {
      ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
      ctx.fillRect(px + 4, py + 15, 8, 1);
    }

    // Vertical center post (3px wide: px+6..px+8)
    ctx.fillStyle = '#161722'; // shadow
    ctx.fillRect(px + 8, y1, 1, y2 - y1);
    ctx.fillStyle = '#2b2d42'; // body
    ctx.fillRect(px + 6, y1, 2, y2 - y1);
    ctx.fillStyle = '#454865'; // highlight
    ctx.fillRect(px + 6, y1, 1, y2 - y1);

    // Cross brackets at Y=4 and Y=11
    ctx.fillStyle = '#3d405b';
    ctx.fillRect(px + 4, py + 4, 8, 2);
    ctx.fillRect(px + 4, py + 11, 8, 2);
    ctx.fillStyle = '#161722';
    ctx.fillRect(px + 4, py + 5, 8, 1);
    ctx.fillRect(px + 4, py + 12, 8, 1);

    // Top post cap (if ending at top)
    if (!hasU) {
      ctx.fillStyle = '#454865';
      ctx.fillRect(px + 6, py, 3, 2);
      ctx.fillStyle = '#2b2d42';
      ctx.fillRect(px + 5, py + 1, 5, 2);
    }
    // Bottom footing (if ending at bottom)
    if (!hasD) {
      ctx.fillStyle = '#161722';
      ctx.fillRect(px + 5, py + 13, 5, 2);
    }
    return;
  }

  // Case 2: Horizontal or Junction
  if (isHoriz) {
    const rx1 = hasL ? px : px + 2;
    const rx2 = hasR ? px + 16 : px + 14;
    const rw = rx2 - rx1;

    // Top rail
    ctx.fillStyle = '#5a5e80';
    ctx.fillRect(rx1, py + 5, rw, 1);
    ctx.fillStyle = '#3d405b';
    ctx.fillRect(rx1, py + 6, rw, 1);

    // Bottom rail
    ctx.fillStyle = '#5a5e80';
    ctx.fillRect(rx1, py + 11, rw, 1);
    ctx.fillStyle = '#3d405b';
    ctx.fillRect(rx1, py + 12, rw, 1);

    if (isVert) {
      // Junction / Corner / T-Intersection: Sturdy central junction pillar
      const jy1 = hasU ? py : py + 1;
      const jy2 = hasD ? py + 16 : py + 15;

      ctx.fillStyle = '#161722';
      ctx.fillRect(px + 8, jy1, 2, jy2 - jy1);
      ctx.fillStyle = '#2b2d42';
      ctx.fillRect(px + 6, jy1, 2, jy2 - jy1);
      ctx.fillStyle = '#454865';
      ctx.fillRect(px + 6, jy1, 1, jy2 - jy1);

      if (!hasU) {
        ctx.fillStyle = '#454865';
        ctx.fillRect(px + 6, py, 3, 2);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(px + 5, py + 1, 5, 2);
      }
      if (!hasD) {
        ctx.fillStyle = '#161722';
        ctx.fillRect(px + 5, py + 14, 5, 2);
        ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
        ctx.fillRect(px + 4, py + 15, 7, 1);
      }
    } else {
      // Purely horizontal: Two standard pickets per tile (at px+4 and px+10)
      const pickets = [px + 4, px + 10];
      for (const p of pickets) {
        ctx.fillStyle = '#161722';
        ctx.fillRect(p + 1, py + 2, 1, 13);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(p, py + 2, 2, 13);
        ctx.fillStyle = '#454865';
        ctx.fillRect(p, py + 2, 1, 12);
        // Spearhead top
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(p, py + 1, 2, 1);
      }

      // If left end-cap
      if (!hasL) {
        ctx.fillStyle = '#161722';
        ctx.fillRect(px + 2, py + 1, 1, 14);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(px + 1, py + 1, 2, 14);
        ctx.fillStyle = '#454865';
        ctx.fillRect(px + 1, py + 1, 1, 13);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(px + 1, py, 3, 2);
      }
      // If right end-cap
      if (!hasR) {
        ctx.fillStyle = '#161722';
        ctx.fillRect(px + 14, py + 1, 1, 14);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(px + 13, py + 1, 2, 14);
        ctx.fillStyle = '#454865';
        ctx.fillRect(px + 13, py + 1, 1, 13);
        ctx.fillStyle = '#2b2d42';
        ctx.fillRect(px + 12, py, 3, 2);
      }
    }
  }
}

function renderFoliageFencesAndPlanters(ctx: CanvasRenderingContext2D) {
  renderFoliageAndFences(ctx);
  renderBerryGardenGround(ctx);
  renderBerryGardenFoliage(ctx);
}

function renderFoliageAndFences(ctx: CanvasRenderingContext2D) {
  // A. Symmetrical Manicured Boxwood Hedges (Connected seamlessly with full neighbor awareness):
  renderAllConnectedHedges(ctx);

  // B. Flower Beds & Planters (Managed dynamically from townConfig):
  const configuredFlowerbeds = townConfig.getBuildings().filter((b) => b.kind === 'flowerbed' && !b.hidden);
  for (const fb of configuredFlowerbeds) {
    if (fb.subType === 'sunflower_bed') {
      drawSunflowerBed(ctx, fb.x * TILE_SIZE, fb.y * TILE_SIZE, fb.w * TILE_SIZE, fb.h * TILE_SIZE);
    } else {
      drawFlowerBed(ctx, fb.x * TILE_SIZE, fb.y * TILE_SIZE, fb.w * TILE_SIZE, fb.h * TILE_SIZE);
    }
  }

  // C. Manicured Pixel-Art Town Trees (Inside Plazas, Courtyards & Avenues)
  renderManicuredTownTrees(ctx);

  // Flagstone garden path leading through the gate to Studio Villa door
  // Only draw if Studio Villa is actually located at its original site (36, 9) and path is not erased/overridden
  const villa = townConfig.getBuilding('villa');
  const isVillaAtOriginal = villa && !villa.hidden && villa.x === 36 && villa.y === 9;
  const isVillaPathOverridden =
    townConfig.getTileOverride(38, 13) !== undefined ||
    townConfig.getTileOverride(38, 14) !== undefined ||
    townConfig.getTileOverride(38, 15) !== undefined;

  if (isVillaAtOriginal && !isVillaPathOverridden) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(38 * TILE_SIZE, 13 * TILE_SIZE + 10, 16, 24);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(38 * TILE_SIZE, 15 * TILE_SIZE + 15, 16, 1);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(38 * TILE_SIZE + 1, 13 * TILE_SIZE + 11, 14, 1);
  }
}

function renderManicuredTownTrees(ctx: CanvasRenderingContext2D) {
  const configuredTrees = townConfig.getBuildings().filter((b) => b.kind === 'tree' && !b.hidden);
  if (configuredTrees.length > 0) {
    for (const t of configuredTrees) {
      if (t.subType === 'tree_sakura') {
        drawSakuraCherryTree(ctx, t.x * TILE_SIZE - 4, t.y * TILE_SIZE - 8);
      } else if (t.subType === 'tree_pine') {
        drawPineTree(ctx, t.x * TILE_SIZE, t.y * TILE_SIZE);
      } else if (t.subType === 'tree_autumn') {
        drawAutumnTree(ctx, t.x * TILE_SIZE, t.y * TILE_SIZE);
      } else if (t.subType === 'tree_berry') {
        drawBerryTree(ctx, t.x * TILE_SIZE, t.y * TILE_SIZE);
      } else {
        drawPokemonTownTree(ctx, t.x * TILE_SIZE - 4, t.y * TILE_SIZE - 8);
      }
    }
  } else {
    // Fallback default town trees
    const courtyardTrees = [
      { x: 12, y: 13 },
      { x: 12, y: 16 },
      { x: 20, y: 13 },
      { x: 20, y: 16 },
    ];
    for (const t of courtyardTrees) {
      drawPokemonTownTree(ctx, t.x * TILE_SIZE - 4, t.y * TILE_SIZE - 8);
    }
    drawPokemonTownTree(ctx, 5 * TILE_SIZE - 4, 31 * TILE_SIZE - 8);
    drawPokemonTownTree(ctx, 40 * TILE_SIZE - 4, 4 * TILE_SIZE - 8);
    drawPokemonTownTree(ctx, 10 * TILE_SIZE - 4, 28 * TILE_SIZE - 8);
    drawPokemonTownTree(ctx, 10 * TILE_SIZE - 4, 38 * TILE_SIZE - 8);
  }
}

export function isTileHedge(x: number, y: number): boolean {
  if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return false;

  // 1. Explicit tile override from editor
  const override = townConfig.getTileOverride(x, y);
  if (override === 'hedge') return true;
  if (override !== null) return false;

  // 2. Custom placed or configured bushes from townConfig
  for (const b of townConfig.getBuildings()) {
    if (b.hidden) continue;
    if (b.kind === 'bush') {
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        return true;
      }
    }
  }

  return false;
}

export function renderAllConnectedHedges(ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!isTileHedge(x, y)) continue;

      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      const hasL = isTileHedge(x - 1, y);
      const hasR = isTileHedge(x + 1, y);
      const hasU = isTileHedge(x, y - 1);
      const hasD = isTileHedge(x, y + 1);

      drawSingleConnectedHedgeTile(ctx, px, py, hasL, hasR, hasU, hasD);
    }
  }
}

export function drawSingleConnectedHedgeTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  hasL: boolean,
  hasR: boolean,
  hasU: boolean,
  hasD: boolean
) {
  const x = px;
  const y = py;

  ctx.save();

  // 1. Ground contact drop shadow (soft diffused ambient occlusion - only when NO hedge below)
  if (!hasD) {
    ctx.fillStyle = 'rgba(10, 24, 12, 0.4)';
    const shadowStart = hasL ? x : x + 1;
    const shadowEnd = hasR ? x + 16 : x + 15;
    ctx.fillRect(shadowStart, y + 14, shadowEnd - shadowStart, 4);
    const shadowInnerStart = hasL ? x : x + 2;
    const shadowInnerEnd = hasR ? x + 16 : x + 14;
    ctx.fillRect(shadowInnerStart, y + 16, shadowInnerEnd - shadowInnerStart, 3);
  }

  // 2. Deep Underbelly Shading & Organic Base Silhouette (#0f2c14)
  ctx.fillStyle = '#0f2c14';
  const baseL = hasL ? x : x;
  const baseR = hasR ? x + 16 : x + 16;
  const baseT = hasU ? y : y + 2;
  const baseB = hasD ? y + 16 : y + 16;
  ctx.fillRect(baseL, baseT, baseR - baseL, baseB - baseT);

  // 3. Dense Boxwood Shrub Body (Rich Deep Forest Green #1b4a22)
  ctx.fillStyle = '#1b4a22';
  const bodyL = hasL ? x : x + 1;
  const bodyR = hasR ? x + 16 : x + 15;
  const bodyT = hasU ? y : y + 2;
  const bodyB = hasD ? y + 16 : y + 15;
  ctx.fillRect(bodyL, bodyT, bodyR - bodyL, bodyB - bodyT);

  // 4. Midtone Emerald Foliage Mass (#266831)
  ctx.fillStyle = '#266831';
  const midL = hasL ? x : x + 1;
  const midR = hasR ? x + 16 : x + 15;
  const midT = hasU ? y : y + 1;
  const midB = hasD ? y + 16 : y + 13;
  ctx.fillRect(midL, midT, midR - midL, midB - midT);

  // 5. Sunlit Canopy / Top Scalloped Lobes (when !hasU)
  if (!hasU) {
    // Two scalloped lobes per 16px tile: Left (0..8) and Right (8..16)
    // Left Lobe:
    const l1Left = hasL ? x : x + 1;
    const l1Right = x + 8;
    ctx.fillStyle = '#3a8a47';
    ctx.fillRect(l1Left, y, l1Right - l1Left - (hasL ? 0 : 1), 4);
    ctx.fillRect(l1Left, y + 1, l1Right - l1Left, 3);

    // Right Lobe:
    const l2Left = x + 8;
    const l2Right = hasR ? x + 16 : x + 15;
    ctx.fillRect(l2Left, y, l2Right - l2Left - (hasR ? 0 : 1), 4);
    ctx.fillRect(l2Left, y + 1, l2Right - l2Left, 3);

    // Bright sunlit top edge & leaves (#57b567)
    ctx.fillStyle = '#57b567';
    ctx.fillRect(l1Left, y, Math.max(1, l1Right - l1Left - (hasL ? 1 : 2)), 1);
    ctx.fillRect(l1Left + 1, y + 1, Math.max(1, l1Right - l1Left - (hasL ? 2 : 3)), 1);
    ctx.fillRect(l2Left, y, Math.max(1, l2Right - l2Left - (hasR ? 1 : 2)), 1);
    ctx.fillRect(l2Left + 1, y + 1, Math.max(1, l2Right - l2Left - (hasR ? 2 : 3)), 1);

    // Specular leaf glints (#8ce099)
    ctx.fillStyle = '#8ce099';
    ctx.fillRect(x + 3, y, 2, 1);
    ctx.fillRect(x + 11, y, 2, 1);

    // Dapple leaf texture in crown (#4da55b)
    ctx.fillStyle = '#4da55b';
    ctx.fillRect(x + 2, y + 3, 2, 2);
    ctx.fillRect(x + 10, y + 3, 2, 2);

    // Deep leaf shadow (#163b1a)
    ctx.fillStyle = '#163b1a';
    ctx.fillRect(x + 4, y + 5, 2, 2);
    ctx.fillRect(x + 12, y + 5, 2, 2);
  } else {
    // When hasU: Vertical continuity foliage inside tile body
    ctx.fillStyle = '#3a8a47';
    ctx.fillRect(x + 2, y, 12, 16);

    ctx.fillStyle = '#4da55b';
    ctx.fillRect(x + 3, y + 2, 3, 2);
    ctx.fillRect(x + 9, y + 6, 3, 2);
    ctx.fillRect(x + 4, y + 10, 3, 2);

    ctx.fillStyle = '#163b1a';
    ctx.fillRect(x + 7, y + 3, 2, 2);
    ctx.fillRect(x + 3, y + 7, 2, 2);
    ctx.fillRect(x + 10, y + 11, 2, 2);
  }

  // 6. Left edge shading & sun highlights (when !hasL)
  if (!hasL) {
    ctx.fillStyle = '#3a8a47';
    ctx.fillRect(x + 1, y + (hasU ? 0 : 2), 2, hasD ? 16 : 13);
    ctx.fillStyle = '#57b567';
    ctx.fillRect(x + 1, y + (hasU ? 1 : 3), 1, 4);
    ctx.fillRect(x + 1, y + (hasU ? 8 : 9), 1, 3);
    ctx.fillStyle = '#8ce099';
    ctx.fillRect(x + 2, y + (hasU ? 2 : 4), 1, 2);
  }

  // 7. Right edge ambient occlusion (when !hasR)
  if (!hasR) {
    ctx.fillStyle = '#163b1a';
    ctx.fillRect(x + 13, y + (hasU ? 0 : 2), 2, hasD ? 16 : 13);
    ctx.fillStyle = '#0f2c14';
    ctx.fillRect(x + 14, y + (hasU ? 0 : 2), 1, hasD ? 16 : 14);
  }

  // 8. Terminal finials / rounded topiary endcaps
  if (!hasL && hasR && !hasU && !hasD) {
    drawHedgeTerminalFinial(ctx, x, y, 16);
  } else if (hasL && !hasR && !hasU && !hasD) {
    drawHedgeTerminalFinial(ctx, x + 8, y, 16);
  } else if (!hasU && hasD && !hasL && !hasR) {
    drawHedgeTerminalFinial(ctx, x, y, 8);
  } else if (hasU && !hasD && !hasL && !hasR) {
    drawHedgeTerminalFinial(ctx, x, y + 8, 8);
  } else if (!hasL && !hasR && !hasU && !hasD) {
    drawHedgeTerminalFinial(ctx, x, y, 16);
    drawHedgeTerminalFinial(ctx, x + 8, y, 16);
  }

  ctx.restore();
}

function drawHedgeTerminalFinial(ctx: CanvasRenderingContext2D, fx: number, fy: number, fh: number) {
  ctx.fillStyle = '#3a8a47';
  ctx.fillRect(fx + 1, fy, 6, Math.min(fh, 6));
  ctx.fillStyle = '#57b567';
  ctx.fillRect(fx + 2, fy, 4, 2);
  ctx.fillStyle = '#8ce099';
  ctx.fillRect(fx + 2, fy, 2, 1);
}

/**
 * Authentic Pokémon Gen 4/5 Lush Forest Canopy Tree
 * Multi-lobed rounded canopy tree with rich warm emerald greens,
 * sturdy oak trunk, organic berry shrubs on edge trees, and soft ground contact shadow.
 * Size: 32px wide x 36px tall (occupies 2x2 tiles).
 */
function drawPokemonForestCanopyTree(ctx: CanvasRenderingContext2D, x: number, y: number, isEdge: boolean) {
  // 1. Soft Oval Ground Contact Shadow
  ctx.fillStyle = 'rgba(20, 50, 18, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 31, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sturdy Oak Trunk (visible on edge or lower trees)
  // Shadow side (right)
  ctx.fillStyle = '#381e0e';
  ctx.fillRect(x + 12, y + 20, 8, 12);
  // Mid bark tone
  ctx.fillStyle = '#563017';
  ctx.fillRect(x + 12, y + 20, 5, 12);
  // Sunlit bark ridge (left)
  ctx.fillStyle = '#784624';
  ctx.fillRect(x + 12, y + 21, 2, 10);
  // Root flares
  ctx.fillStyle = '#381e0e';
  ctx.fillRect(x + 10, y + 30, 3, 3);
  ctx.fillRect(x + 19, y + 30, 3, 3);
  ctx.fillStyle = '#563017';
  ctx.fillRect(x + 10, y + 30, 2, 2);

  // 3. Multi-Lobed Scalloped Canopy (Classic Pokémon Gen 4/5 style)
  // Layer A: Deep Silhouette & Underbelly Shadow (#184513)
  ctx.fillStyle = '#184513';
  ctx.fillRect(x + 2, y + 14, 14, 12);
  ctx.fillRect(x + 16, y + 14, 14, 12);
  ctx.fillRect(x + 1, y + 16, 30, 9);
  ctx.fillRect(x + 8, y + 3, 16, 14);
  ctx.fillRect(x + 6, y + 5, 20, 11);
  ctx.fillRect(x + 11, y + 1, 10, 4);

  // Layer B: Core Woodland Emerald Body (#2b6e1e)
  ctx.fillStyle = '#2b6e1e';
  ctx.fillRect(x + 3, y + 14, 12, 10);
  ctx.fillRect(x + 17, y + 14, 12, 10);
  ctx.fillRect(x + 2, y + 16, 28, 7);
  ctx.fillRect(x + 9, y + 4, 14, 12);
  ctx.fillRect(x + 7, y + 6, 18, 9);
  ctx.fillRect(x + 12, y + 2, 8, 3);

  // Layer C: Mid-Tone Warm Pokémon Green (#3f8e29)
  ctx.fillStyle = '#3f8e29';
  ctx.fillRect(x + 3, y + 14, 11, 9);
  ctx.fillRect(x + 5, y + 12, 8, 4);
  ctx.fillRect(x + 17, y + 14, 10, 8);
  ctx.fillRect(x + 9, y + 4, 13, 10);
  ctx.fillRect(x + 12, y + 3, 7, 3);

  // Layer D: Sunlit Foliage Clusters (#59b53a) - Facing top-left sun
  ctx.fillStyle = '#59b53a';
  ctx.fillRect(x + 10, y + 3, 8, 6);
  ctx.fillRect(x + 8, y + 5, 10, 5);
  ctx.fillRect(x + 12, y + 2, 5, 2);
  ctx.fillRect(x + 4, y + 13, 8, 6);
  ctx.fillRect(x + 3, y + 15, 6, 4);
  ctx.fillRect(x + 18, y + 13, 6, 4);

  // Layer E: Bright Sunlit Crest Highlights (#7cd94c)
  ctx.fillStyle = '#7cd94c';
  ctx.fillRect(x + 11, y + 2, 6, 2);
  ctx.fillRect(x + 9, y + 4, 5, 3);
  ctx.fillRect(x + 4, y + 13, 5, 3);
  ctx.fillRect(x + 6, y + 12, 4, 2);
  ctx.fillRect(x + 19, y + 13, 4, 2);

  // Layer F: Specular Golden-Green Dapples (#b4f78d)
  ctx.fillStyle = '#b4f78d';
  ctx.fillRect(x + 13, y + 2, 3, 1);
  ctx.fillRect(x + 11, y + 3, 2, 1);
  ctx.fillRect(x + 5, y + 13, 3, 1);
  ctx.fillRect(x + 20, y + 13, 2, 1);

  // Layer G: Organic Edge Underbrush (Only for trees on town boundary)
  if (isEdge) {
    // Underbrush bush at tree base left
    ctx.fillStyle = '#1c4a16';
    ctx.fillRect(x + 1, y + 26, 8, 6);
    ctx.fillRect(x + 2, y + 25, 6, 8);
    ctx.fillStyle = '#3f8e29';
    ctx.fillRect(x + 2, y + 26, 6, 5);
    ctx.fillStyle = '#67c94a';
    ctx.fillRect(x + 3, y + 25, 4, 3);
    ctx.fillStyle = '#9ef56b';
    ctx.fillRect(x + 4, y + 25, 2, 1);
    // Wild red berries
    ctx.fillStyle = '#f44336';
    ctx.fillRect(x + 3, y + 27, 2, 2);
    ctx.fillRect(x + 6, y + 29, 2, 2);
    ctx.fillStyle = '#ffcdd2';
    ctx.fillRect(x + 3, y + 27, 1, 1);

    // Underbrush bush at tree base right
    ctx.fillStyle = '#1c4a16';
    ctx.fillRect(x + 23, y + 27, 8, 5);
    ctx.fillRect(x + 24, y + 26, 6, 7);
    ctx.fillStyle = '#3f8e29';
    ctx.fillRect(x + 24, y + 27, 6, 4);
    ctx.fillStyle = '#67c94a';
    ctx.fillRect(x + 25, y + 26, 4, 3);
    ctx.fillStyle = '#9ef56b';
    ctx.fillRect(x + 26, y + 26, 2, 1);
    // Wild golden berries
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x + 25, y + 28, 2, 2);
    ctx.fillRect(x + 28, y + 29, 2, 2);
    ctx.fillStyle = '#fff9c4';
    ctx.fillRect(x + 25, y + 28, 1, 1);
  }
}

/**
 * Authentic Pokémon Gen 4/5 Manicured Deciduous Town Tree
 * Features multi-lobed spherical canopy with organic dapple highlights,
 * deep shade underbelly, and a sturdy grounded wooden trunk.
 * Harmonized with warm town grass and hedge palette!
 * Size: 24px wide, 28px tall.
 */
function drawPokemonTownTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Ground Shadow (oval on ground)
  ctx.fillStyle = 'rgba(20, 50, 15, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 24, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sturdy Wooden Trunk with root flare
  ctx.fillStyle = '#3a2010'; // Shadow bark
  ctx.fillRect(x + 9, y + 16, 6, 9);
  ctx.fillRect(x + 8, y + 22, 8, 3); // Root base
  ctx.fillStyle = '#5c381f'; // Mid bark
  ctx.fillRect(x + 9, y + 16, 4, 9);
  ctx.fillRect(x + 8, y + 22, 5, 2);
  ctx.fillStyle = '#784c2a'; // Sunlit bark ridge
  ctx.fillRect(x + 9, y + 17, 2, 8);

  // --- Canopy Multi-Lobed Sphere ---
  // 1. Deep Outline & Underbelly Shadow
  ctx.fillStyle = '#1d4a19';
  ctx.fillRect(x + 4, y + 1, 16, 19);
  ctx.fillRect(x + 2, y + 4, 20, 14);
  ctx.fillRect(x + 1, y + 6, 22, 10);
  ctx.fillRect(x, y + 8, 24, 6);

  // 2. Primary Leaf Green Body
  ctx.fillStyle = '#337e24';
  ctx.fillRect(x + 4, y + 2, 15, 17);
  ctx.fillRect(x + 2, y + 5, 19, 12);
  ctx.fillRect(x + 1, y + 7, 21, 8);

  // 3. Lower Shaded Clump (Bottom-Right Sphere)
  ctx.fillStyle = '#246119';
  ctx.fillRect(x + 11, y + 11, 10, 7);
  ctx.fillRect(x + 13, y + 9, 8, 8);
  ctx.fillRect(x + 10, y + 14, 8, 4);

  // 4. Mid-Tone Emerald Leaf Clumps (Center & Left)
  ctx.fillStyle = '#4aa634';
  ctx.fillRect(x + 3, y + 4, 14, 12);
  ctx.fillRect(x + 5, y + 2, 12, 13);
  ctx.fillRect(x + 8, y + 5, 10, 8);
  ctx.fillRect(x + 2, y + 8, 8, 7);

  // 5. Sunlit Foliage (Top-Left & Crown Lobes)
  ctx.fillStyle = '#67c94a';
  ctx.fillRect(x + 4, y + 3, 9, 8);
  ctx.fillRect(x + 3, y + 5, 8, 6);
  ctx.fillRect(x + 6, y + 2, 7, 4);
  ctx.fillRect(x + 8, y + 4, 6, 5);

  // 6. Specular Sunlight Highlights (Top-Left Rim)
  ctx.fillStyle = '#92e86d';
  ctx.fillRect(x + 5, y + 4, 5, 4);
  ctx.fillRect(x + 6, y + 3, 4, 2);
  ctx.fillRect(x + 4, y + 6, 3, 3);
  ctx.fillRect(x + 9, y + 4, 3, 2);

  // 7. Bright Golden Sunlight Dapple
  ctx.fillStyle = '#bbf69b';
  ctx.fillRect(x + 6, y + 4, 2, 2);
  ctx.fillRect(x + 7, y + 3, 1, 1);
  ctx.fillRect(x + 5, y + 7, 1, 1);
}

function drawFlowerBed(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();

  // 1. Ground contact drop shadow under the raised stone planter
  ctx.fillStyle = 'rgba(15, 20, 15, 0.4)';
  ctx.fillRect(x + 2, y + h, w - 2, 3);
  ctx.fillRect(x + w, y + 2, 3, h);

  // 2. Dressed Sandstone Retaining Wall Rim (outer stone curb)
  // Shadowed bottom/right stone face
  ctx.fillStyle = '#786852';
  ctx.fillRect(x, y, w, h);
  // Main sandstone body
  ctx.fillStyle = '#bfae96';
  ctx.fillRect(x, y, w - 1, h - 1);
  // Sunlit top and left stone coping
  ctx.fillStyle = '#f0e6d5';
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x, y, 2, h);
  // Beveled inner rim shadow
  ctx.fillStyle = '#9c8b75';
  ctx.fillRect(x + 2, y + 2, w - 4, 1);
  ctx.fillRect(x + 2, y + 2, 1, h - 4);

  // Decorative Corner Pyramid Capstones
  const corners = [
    [x, y],
    [x + w - 4, y],
    [x, y + h - 4],
    [x + w - 4, y + h - 4],
  ];
  for (const [cx, cy] of corners) {
    ctx.fillStyle = '#e8decb';
    ctx.fillRect(cx, cy, 4, 4);
    ctx.fillStyle = '#fff9ef';
    ctx.fillRect(cx + 1, cy + 1, 2, 2);
    ctx.fillStyle = '#82715d';
    ctx.fillRect(cx + 3, cy, 1, 4);
    ctx.fillRect(cx, cy + 3, 4, 1);
  }

  // 3. Rich, Organic Loamy Humus Garden Soil Bed
  const soilX = x + 3;
  const soilY = y + 3;
  const soilW = w - 6;
  const soilH = h - 6;

  ctx.fillStyle = '#3a2315';
  ctx.fillRect(soilX, soilY, soilW, soilH);

  // Organic compost mulch texture & moisture gradients
  for (let sx = soilX; sx < soilX + soilW; sx += 4) {
    for (let sy = soilY; sy < soilY + soilH; sy += 4) {
      const hash = (sx * 13 + sy * 29) % 7;
      if (hash === 0) {
        ctx.fillStyle = '#27170c'; // Moist deep peat
        ctx.fillRect(sx, sy, 3, 2);
      } else if (hash === 1) {
        ctx.fillStyle = '#4d3320'; // Warm dried mulch
        ctx.fillRect(sx + 1, sy + 1, 2, 2);
      }
    }
  }

  // 4. Studio-Grade Layered Botanical Flower Clumps (Roses, Marigolds, Lavender, Daisies)
  const flowerTypes = [
    {
      // Velvet Crimson Rose
      leaf: '#1e4324',
      base: '#9f1239',
      petals: '#e11d48',
      highlight: '#fb7185',
      center: '#ffe4e6',
    },
    {
      // Golden French Marigold
      leaf: '#26532b',
      base: '#b45309',
      petals: '#f59e0b',
      highlight: '#fde047',
      center: '#78350f',
    },
    {
      // Royal Lavender / Salvia
      leaf: '#1f4825',
      base: '#6d28d9',
      petals: '#9333ea',
      highlight: '#c084fc',
      center: '#f3e8ff',
    },
    {
      // Pure White Daisy with Golden Stamen
      leaf: '#225228',
      base: '#cbd5e1',
      petals: '#ffffff',
      highlight: '#ffffff',
      center: '#f59e0b',
    },
    {
      // Azure Bluebell
      leaf: '#1b4422',
      base: '#0369a1',
      petals: '#0ea5e9',
      highlight: '#7dd3fc',
      center: '#e0f2fe',
    },
  ];

  // Distribute botanical flower bushes across the bed with organic jitter
  const stepX = 7;
  const stepY = 7;
  const maxFy = Math.max(soilY + 1, soilY + soilH - 5);
  for (let fx = soilX + 1; fx <= soilX + soilW - 5; fx += stepX) {
    for (let fy = soilY + 1; fy <= maxFy; fy += stepY) {
      const jx = fx + ((fx * 7 + fy * 11) % 3) - 1;
      const jy = soilH <= 8 ? soilY + Math.max(0, Math.floor((soilH - 5) / 2)) : fy + ((fx * 13 + fy * 5) % 3) - 1;

      const speciesIdx = Math.abs(Math.floor((Math.sin(jx * 0.3) + Math.cos(jy * 0.3) + 2) * 1.5)) % flowerTypes.length;
      const fl = flowerTypes[speciesIdx];

      // A. Lush Leaf Skirt Base
      ctx.fillStyle = fl.leaf;
      ctx.fillRect(jx, jy + 2, 6, 4);
      ctx.fillRect(jx + 1, jy + 1, 4, 6);
      ctx.fillStyle = '#398242';
      ctx.fillRect(jx + 2, jy + 3, 2, 2);

      // B. Flower Blossom Petals
      ctx.fillStyle = fl.base;
      ctx.fillRect(jx + 1, jy + 1, 4, 4);

      ctx.fillStyle = fl.petals;
      ctx.fillRect(jx + 2, jy, 2, 2);
      ctx.fillRect(jx, jy + 2, 2, 2);
      ctx.fillRect(jx + 4, jy + 2, 2, 2);
      ctx.fillRect(jx + 2, jy + 3, 2, 2);

      // C. Petal Sunlit Highlights
      ctx.fillStyle = fl.highlight;
      ctx.fillRect(jx + 2, jy + 1, 1, 2);
      ctx.fillRect(jx + 1, jy + 2, 2, 1);

      // D. Radiant Pistil / Pollen Center
      ctx.fillStyle = fl.center;
      ctx.fillRect(jx + 2, jy + 2, 2, 2);
    }
  }

  ctx.restore();
}

function drawFence(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, isWhite: boolean) {
  const postColor = isWhite ? '#e2e8f0' : '#2b2d42';
  const postShadow = isWhite ? '#94a3b8' : '#1e1f2b';
  const railColor = isWhite ? '#cbd5e1' : '#3d405b';

  ctx.fillStyle = railColor;
  ctx.fillRect(x, y + 4, w, 2);
  ctx.fillRect(x, y + 10, w, 2);

  for (let i = 0; i <= w; i += 8) {
    ctx.fillStyle = postShadow;
    ctx.fillRect(x + i + 1, y, 2, 14);
    ctx.fillStyle = postColor;
    ctx.fillRect(x + i, y, 2, 14);
    ctx.fillRect(x + i, y - 2, 2, 2);
  }
}

function drawVerticalFence(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, isWhite: boolean) {
  const postColor = isWhite ? '#e2e8f0' : '#2b2d42';
  const postShadow = isWhite ? '#94a3b8' : '#1e1f2b';
  const railColor = isWhite ? '#cbd5e1' : '#3d405b';

  ctx.fillStyle = railColor;
  ctx.fillRect(x + 2, y, 2, h);

  for (let j = 0; j <= h; j += 10) {
    ctx.fillStyle = postShadow;
    ctx.fillRect(x + 1, y + j, 4, 3);
    ctx.fillStyle = postColor;
    ctx.fillRect(x, y + j, 4, 3);
  }
}

// ==========================================
// 3. BUILDINGS PIXEL ART
// ==========================================
function renderCustomTileOverrides(ctx: CanvasRenderingContext2D) {
  const garden = townConfig.getBuilding('garden') || townConfig.getBuilding('berry');
  const contest = townConfig.getBuilding('contest');
  for (const [coord, tileKey] of townConfig.getAllTileOverrides().entries()) {
    const [xs, ys] = coord.split(',');
    const x = parseInt(xs, 10);
    const y = parseInt(ys, 10);
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;

    // Skip floor tile overrides that fall within the active Berry Garden footprint so its soil is never erased
    if (garden && !garden.hidden && x >= garden.x && x < garden.x + garden.w && y >= garden.y && y < garden.y + garden.h) {
      if (['grass', 'cobble', 'lab_paver', 'dev_paver'].includes(tileKey)) {
        continue;
      }
    }

    // Skip floor tile overrides that fall within the active Contest Stage footprint so its stage decking is never erased
    if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
      if (['grass', 'cobble', 'lab_paver', 'dev_paver'].includes(tileKey)) {
        continue;
      }
    }

    // Skip floor tile overrides that fall within the Outdoor Café Bistro Patio (X: 34..42, Y: 48..55)
    if (x >= 34 && x <= 42 && y >= 48 && y <= 55) {
      if (['grass', 'cobble', 'lab_paver', 'dev_paver'].includes(tileKey)) {
        continue;
      }
    }

    // Skip grass tile overrides that fall within the South Civic Plaza (X: 24..33, Y: 46..55)
    if (x >= 24 && x <= 33 && y >= 46 && y <= 55 && tileKey === 'grass') {
      continue;
    }

    if (tileKey === 'grass') {
      renderMeadowGrassTile(ctx, px, py, x, y);
    } else if (tileKey === 'cobble') {
      renderStreetCobbleTile(ctx, px, py, x, y);
    } else if (tileKey === 'lab_paver') {
      renderLabCampusTile(ctx, px, py, x, y);
    } else if (tileKey === 'dev_paver') {
      renderDevCourtyardTile(ctx, px, py, x, y);
    } else if (tileKey === 'water') {
      renderOceanTile(ctx, px, py, x, y);
    } else if (tileKey === 'hedge') {
      // Handled cleanly by renderAllConnectedHedges with full neighbor connections
    } else if (tileKey === 'fence') {
      // Handled cleanly by renderAllConnectedFences with full neighbor connections
    } else if (tileKey === 'fence_water') {
      drawMaritimeSeaRailing(ctx, px, py, 'N');
    } else if (tileKey === 'tall_grass') {
      ctx.fillStyle = '#458f2f';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#2b651b';
      ctx.fillRect(px + 2, py + 8, 3, 6);
      ctx.fillRect(px + 8, py + 6, 3, 8);
      ctx.fillRect(px + 12, py + 9, 2, 5);
      ctx.fillStyle = '#6ab84b';
      ctx.fillRect(px + 3, py + 6, 2, 3);
      ctx.fillRect(px + 9, py + 4, 2, 3);
    }
  }
}

function renderAllBuildings(ctx: CanvasRenderingContext2D) {
  const dev = townConfig.getBuilding('dev');
  if (dev && !dev.hidden) renderDevCenterManor(ctx, dev.x * TILE_SIZE, dev.y * TILE_SIZE);

  const lab = townConfig.getBuilding('lab');
  if (lab && !lab.hidden) renderResearchLab(ctx, lab.x * TILE_SIZE, lab.y * TILE_SIZE);

  const annex = townConfig.getBuilding('annex');
  if (annex && !annex.hidden) renderLabObservatoryAnnex(ctx, annex.x * TILE_SIZE, annex.y * TILE_SIZE);

  const home = townConfig.getBuilding('home');
  if (home && !home.hidden) renderHomeManor(ctx, home.x * TILE_SIZE, home.y * TILE_SIZE);

  const reception = townConfig.getBuilding('reception');
  if (reception && !reception.hidden) renderPokemonCenter(ctx, reception.x * TILE_SIZE, reception.y * TILE_SIZE);

  const shop = townConfig.getBuilding('shop');
  if (shop && !shop.hidden) renderPokeMart(ctx, shop.x * TILE_SIZE, shop.y * TILE_SIZE);

  const villa = townConfig.getBuilding('villa');
  if (villa && !villa.hidden) renderPokemonCottage(ctx, villa.x * TILE_SIZE, villa.y * TILE_SIZE);

  const arcade = townConfig.getBuilding('arcade');
  if (arcade && !arcade.hidden) renderArcadeBuilding(ctx, arcade.x * TILE_SIZE, arcade.y * TILE_SIZE);

  const office = townConfig.getBuilding('office');
  if (office && !office.hidden) renderTallOfficeBuilding(ctx, office.x * TILE_SIZE, office.y * TILE_SIZE);

  renderDevCafeBaristaKiosk(ctx);
  renderWestSeasideGazebo(ctx);
  renderRangerShelter(ctx);

  // Battle Arena — Dynamic Stadium Building
  renderTrainingField(ctx);
}

/**
 * 1. Dev Center — Grand Neo-Classical Executive Palace
 * Studio-Grade 2.5D Architecture:
 * - Multi-tiered mansard slate roof with gilded copper cresting, finials & dormer windows
 * - Grand neoclassical pediment with gold-rimmed clock tower and illuminated < DEV /> marquee
 * - Fluted marble pilasters, rusticated stone quoins, and ashlar masonry
 * - Arched double mahogany entryway with glowing amber fanlight, brass hardware & crimson velvet runner
 * - Multi-pane baroque windows with alternating pediments and warm interior chandelier reflections
 */
function renderDevCenterManor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 12 * TILE_SIZE; // 192px
  const h = 11 * TILE_SIZE; // 176px

  // Ground Ambient Drop Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 8, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Foundation Plinth (Dressed Sandstone & Polished Granite)
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 2, y + h - 10, w + 4, 10);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x - 2, y + h - 10, w + 4, 2);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 2, y + h - 1, w + 4, 1);

  // Main Ashlar Sandstone Wall Body
  ctx.fillStyle = '#d8cbba';
  ctx.fillRect(x, y + 40, w, h - 50);

  // Ashlar masonry block joints
  ctx.fillStyle = 'rgba(120, 104, 82, 0.25)';
  for (let gy = y + 48; gy < y + h - 12; gy += 12) {
    ctx.fillRect(x, gy, w, 1);
    const rowIdx = Math.floor((gy - y) / 12);
    const offset = rowIdx % 2 === 0 ? 0 : 16;
    for (let gx = x + offset; gx < x + w; gx += 32) {
      ctx.fillRect(gx, gy, 1, 12);
    }
  }

  // Rusticated Corner Quoins
  drawQuoins(ctx, x, y + 40, 12, h - 50);
  drawQuoins(ctx, x + w - 12, y + 40, 12, h - 50);

  // Architectural Cornice band under the roof
  ctx.fillStyle = '#bfae9c';
  ctx.fillRect(x - 4, y + 36, w + 8, 5);
  ctx.fillStyle = '#f5ede2';
  ctx.fillRect(x - 4, y + 36, w + 8, 1.5);
  ctx.fillStyle = '#786852';
  ctx.fillRect(x - 4, y + 40, w + 8, 1);

  // Mansard Slate Roof with 3D depth
  ctx.fillStyle = '#1e293b'; // Deep slate shadow
  ctx.fillRect(x - 6, y + 14, w + 12, 24);
  ctx.fillStyle = '#334155'; // Main slate body
  ctx.fillRect(x - 4, y + 16, w + 8, 20);

  // Slate Shingle texture
  ctx.fillStyle = '#475569';
  for (let row = 0; row < 3; row++) {
    const ry = y + 18 + row * 6;
    ctx.fillRect(x - 4, ry, w + 8, 1);
    const xShift = row % 2 === 0 ? 0 : 8;
    for (let sx = x - 2 + xShift; sx < x + w + 4; sx += 16) {
      ctx.fillRect(sx, ry, 1, 5);
    }
  }

  // Gilded Copper Cresting & Finials along the roof ridge
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x - 4, y + 13, w + 8, 2);
  for (let fx = x; fx <= x + w - 4; fx += 12) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(fx + 1, y + 9, 2, 4);
    ctx.fillRect(fx, y + 8, 4, 1.5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(fx + 1.5, y + 7, 1, 1);
  }

  // Central Grand Pediment & Clock Tower
  const twX = x + Math.floor(w / 2) - 34;
  const twW = 68;
  // Tower body
  ctx.fillStyle = '#d8cbba';
  ctx.fillRect(twX, y - 2, twW, 38);
  ctx.fillStyle = '#bfae9c';
  ctx.strokeRect(twX + 0.5, y - 1.5, twW - 1, 37);

  // Tower classical pediment (triangular gable)
  ctx.fillStyle = '#786852';
  ctx.beginPath();
  ctx.moveTo(twX - 4, y + 6);
  ctx.lineTo(twX + twW / 2, y - 10);
  ctx.lineTo(twX + twW + 4, y + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#d8cbba';
  ctx.beginPath();
  ctx.moveTo(twX - 2, y + 5);
  ctx.lineTo(twX + twW / 2, y - 8);
  ctx.lineTo(twX + twW + 2, y + 5);
  ctx.closePath();
  ctx.fill();

  // Gilded pediment cornices
  ctx.fillStyle = '#eab308';
  ctx.fillRect(twX - 3, y + 5, twW + 6, 2);
  ctx.fillRect(twX + twW / 2 - 2, y - 13, 4, 4);

  // Gilded Clock Bezel
  const clockX = twX + twW / 2;
  const clockY = y + 7;
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(clockX, clockY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(clockX, clockY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.arc(clockX, clockY, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Clock hands & hour marks
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(clockX, clockY - 4, 1.5, 4.5);
  ctx.fillRect(clockX, clockY - 0.5, 3.5, 1.5);
  ctx.fillRect(clockX - 0.5, clockY - 5.5, 1, 1);
  ctx.fillRect(clockX + 4.5, clockY - 0.5, 1, 1);
  ctx.fillRect(clockX - 0.5, clockY + 4.5, 1, 1);
  ctx.fillRect(clockX - 5.5, clockY - 0.5, 1, 1);

  // Center Dev Monogram Banner with Golden Studs
  const bannerW = 60;
  const bannerH = 14;
  const bannerX = x + Math.floor(w / 2) - bannerW / 2;
  const bannerY = y + 42;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(bannerX - 1, bannerY - 1, bannerW + 2, bannerH + 2);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bannerX + 0.5, bannerY + 0.5, bannerW - 1, bannerH - 1);

  // Illuminated studs
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(bannerX + 2, bannerY + 2, 2, 2);
  ctx.fillRect(bannerX + bannerW - 4, bannerY + 2, 2, 2);
  ctx.fillRect(bannerX + 2, bannerY + bannerH - 4, 2, 2);
  ctx.fillRect(bannerX + bannerW - 4, bannerY + bannerH - 4, 2, 2);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('< DEV />', x + w / 2, bannerY + bannerH / 2);

  // Fluted Classical Pilasters flanking the facade
  const pilasters = [x + 14, x + 46, x + w - 48, x + w - 16];
  for (const px of pilasters) {
    // Capital
    ctx.fillStyle = '#f5ede2';
    ctx.fillRect(px - 2, y + 40, 8, 3);
    // Shaft with vertical fluting
    ctx.fillStyle = '#e8decb';
    ctx.fillRect(px, y + 43, 4, h - 54);
    ctx.fillStyle = '#c5b6a0';
    ctx.fillRect(px + 1, y + 43, 1, h - 54);
    ctx.fillRect(px + 3, y + 43, 1, h - 54);
    // Base plinth
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px - 2, y + h - 12, 8, 3);
  }

  // Baroque Windows (Upper Floor: Y+62, Ground Floor: Y+96)
  const winCols = [x + 24, x + 58, x + 82, x + 106, x + 130, x + 158];
  for (const wx of winCols) {
    drawLuxuryBaroqueWindow(ctx, wx - 6, y + 62, 14, 20, true);
    drawLuxuryBaroqueWindow(ctx, wx - 6, y + 96, 14, 22, false);
  }

  // Grand Arched Portico & Double Mahogany Doors
  const doorW = 44;
  const doorH = 50;
  const doorX = x + Math.floor(w / 2) - doorW / 2;
  const doorY = y + h - 54;

  // Portico outer stone archway
  ctx.fillStyle = '#786852';
  ctx.fillRect(doorX - 4, doorY - 4, doorW + 8, doorH + 4);
  ctx.fillStyle = '#bfae9c';
  ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 2);

  // Door recess shadow
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(doorX + doorW / 2, doorY + 16, 16, Math.PI, 0);
  ctx.lineTo(doorX + doorW - 4, doorY + doorH);
  ctx.lineTo(doorX + 4, doorY + doorH);
  ctx.closePath();
  ctx.fill();

  // Amber Transom Fanlight (Stained Glass)
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(doorX + doorW / 2, doorY + 16, 14, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX + doorW / 2 - 1, doorY + 2, 2, 14);
  ctx.fillRect(doorX + doorW / 2 - 10, doorY + 14, 20, 2);

  // Mahogany Double Doors
  const leafW = 16;
  const leafH = 34;
  const leafY = doorY + 16;

  // Left leaf
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(doorX + 5, leafY, leafW, leafH);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX + 7, leafY + 3, leafW - 4, 12);
  ctx.fillRect(doorX + 7, leafY + 18, leafW - 4, 13);
  // Right leaf
  ctx.fillStyle = '#451a03';
  ctx.fillRect(doorX + 5 + leafW + 2, leafY, leafW, leafH);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX + 7 + leafW + 2, leafY + 3, leafW - 4, 12);
  ctx.fillRect(doorX + 7 + leafW + 2, leafY + 18, leafW - 4, 13);

  // Polished Brass Door Pull Handles
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorX + 5 + leafW - 3, leafY + 16, 2, 6);
  ctx.fillRect(doorX + 5 + leafW + 3, leafY + 16, 2, 6);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(doorX + 5 + leafW - 3, leafY + 17, 1, 2);
  ctx.fillRect(doorX + 5 + leafW + 3, leafY + 17, 1, 2);

  // Polished Brass Carriage Sconces flanking the entryway
  const sconces = [doorX - 6, doorX + doorW + 2];
  for (const sx of sconces) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(sx, doorY + 18, 3, 8);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(sx - 1, doorY + 14, 5, 5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(sx, doorY + 15, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 1, doorY + 16, 1, 1);
  }

  // Grand Velvet Entrance Runner (Crimson with Gold Border)
  const runnerW = 22;
  const runnerX = x + Math.floor(w / 2) - runnerW / 2;
  const runnerY = doorY + doorH - 4;
  ctx.fillStyle = '#b45309'; // Gold fringe
  ctx.fillRect(runnerX - 1, runnerY, runnerW + 2, 10);
  ctx.fillStyle = '#991b1b'; // Crimson carpet
  ctx.fillRect(runnerX, runnerY, runnerW, 10);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(runnerX + 2, runnerY, runnerW - 4, 9);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(runnerX + 1, runnerY, 1, 9);
  ctx.fillRect(runnerX + runnerW - 2, runnerY, 1, 9);
}

function drawLuxuryBaroqueWindow(
  ctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  ww: number,
  wh: number,
  triangularPediment: boolean
) {
  // Pediment above window
  ctx.fillStyle = '#bfae9c';
  if (triangularPediment) {
    ctx.beginPath();
    ctx.moveTo(wx - 2, wy);
    ctx.lineTo(wx + ww / 2, wy - 4);
    ctx.lineTo(wx + ww + 2, wy);
    ctx.closePath();
    ctx.fill();
  } else {
    // Segmental curved pediment
    ctx.fillRect(wx - 2, wy - 3, ww + 4, 3);
    ctx.fillStyle = '#f5ede2';
    ctx.fillRect(wx - 1, wy - 3, ww + 2, 1);
  }

  // Deep window sill
  ctx.fillStyle = '#9c8b75';
  ctx.fillRect(wx - 2, wy + wh, ww + 4, 3);
  ctx.fillStyle = '#f5ede2';
  ctx.fillRect(wx - 2, wy + wh, ww + 4, 1);

  // Outer stone frame
  ctx.fillStyle = '#332314';
  ctx.fillRect(wx, wy, ww, wh);

  // Warm interior chandelier light & curtains
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);

  // Velvet drapery on window sides
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(wx + 1, wy + 1, 2.5, wh - 2);
  ctx.fillRect(wx + ww - 3.5, wy + 1, 2.5, wh - 2);

  // White glazing bars (mullions)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(wx + Math.floor(ww / 2), wy + 1, 1, wh - 2);
  ctx.fillRect(wx + 1, wy + Math.floor(wh / 2), ww - 2, 1);

  // Diagonal Specular Reflection (Glass Glint)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.moveTo(wx + 3, wy + 2);
  ctx.lineTo(wx + ww - 3, wy + wh - 4);
  ctx.lineTo(wx + ww - 3, wy + wh - 7);
  ctx.lineTo(wx + 5, wy + 2);
  ctx.closePath();
  ctx.fill();
}

function drawQuoins(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#bfae9c';
  let isWide = true;
  for (let gy = y; gy < y + h - 8; gy += 10) {
    const qW = isWide ? w : w - 4;
    ctx.fillRect(x, gy, qW, 8);
    ctx.fillStyle = '#f5ede2';
    ctx.fillRect(x, gy, qW, 1.5);
    ctx.fillStyle = '#786852';
    ctx.fillRect(x, gy + 7, qW, 1);
    ctx.fillStyle = '#bfae9c';
    isWide = !isWide;
  }
}

/**
 * 2. Research Lab — High-Tech AI & Robotics Campus
 * 2.5D Futuristic Pixel-Art:
 * - Clean titanium white facade with slate chamfers and emerald reveals
 * - Aerodynamic hip roof with multi-tone emerald shingles & solar photovoltaic array
 * - Glowing green telemetry beacon & high-gain satellite dish
 * - Illuminated neon < RESEARCH LAB > acrylic fascia sign
 * - Panoramic observation windows with diagonal glass reflections and server rack silhouettes
 * - Dual cyan sliding security doors with digital biometric panel
 */
function renderResearchLab(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 7 * TILE_SIZE; // 112px
  const h = 6 * TILE_SIZE; // 96px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 2, y + h - 4, w + 8, 8);

  // Foundation Plinth (Brushed Dark Steel)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + h - 6, w, 6);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x, y + h - 6, w, 1); // Neon cyan baseline strip

  // Titanium Composite Wall Facade
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, y + 34, w, h - 40);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y + 34, w, h - 40);

  // Panel seam grooves (Modern architectural cladding)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 28, y + 34, 1, h - 40);
  ctx.fillRect(x + w - 28, y + 34, 1, h - 40);
  ctx.fillRect(x, y + 54, w, 1);

  // Aerodynamic Emerald Green Hip Roof
  ctx.fillStyle = '#064e3b'; // Under-eave shadow
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 34);
  ctx.lineTo(x + 16, y + 6);
  ctx.lineTo(x + w - 16, y + 6);
  ctx.lineTo(x + w + 6, y + 34);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#047857'; // Main emerald roof plane
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 32);
  ctx.lineTo(x + 18, y + 8);
  ctx.lineTo(x + w - 18, y + 8);
  ctx.lineTo(x + w + 4, y + 32);
  ctx.closePath();
  ctx.fill();

  // Roof Shading & Solar Photovoltaic Panels
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 30);
  ctx.lineTo(x + 20, y + 10);
  ctx.lineTo(x + w - 20, y + 10);
  ctx.lineTo(x + w + 2, y + 30);
  ctx.closePath();
  ctx.fill();

  // Dark Blue Photovoltaic Solar Arrays on roof
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 24, y + 12, w - 48, 14);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x + 25, y + 13, w - 50, 12);
  // Grid lines on solar cells
  ctx.fillStyle = '#38bdf8';
  for (let sx = x + 33; sx < x + w - 26; sx += 9) {
    ctx.fillRect(sx, y + 13, 1, 12);
  }
  ctx.fillRect(x + 25, y + 18, w - 50, 1);

  // Roof Ridge Cap (Metallic emerald highlight)
  ctx.fillStyle = '#34d399';
  ctx.fillRect(x + 18, y + 6, w - 36, 3);
  ctx.fillStyle = '#a7f3d0';
  ctx.fillRect(x + 20, y + 6, w - 40, 1);

  // High-Gain Satellite Dish on Left
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 12, y - 6, 3, 14);
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(x + 13, y - 8, 8, 0, Math.PI, true);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 12.5, y - 10, 1.5, 3);

  // Telemetry Beacon Antenna on Right with Pulsing Red Beacon
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w - 15, y - 4, 2, 12);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + w - 16, y - 7, 4, 3);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(x + w - 15, y - 6, 2, 1);

  // Center Fascia Signboard: < RESEARCH LAB >
  const signW = 84;
  const signH = 13;
  const signX = x + Math.floor((w - signW) / 2);
  const signY = y + 36;
  ctx.fillStyle = '#022c22';
  ctx.fillRect(signX - 1, signY - 1, signW + 2, signH + 2);
  ctx.fillStyle = '#065f46';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.strokeRect(signX + 0.5, signY + 0.5, signW - 1, signH - 1);

  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('< RESEARCH LAB >', x + w / 2, signY + signH / 2);

  // Panoramic Observation Windows (Left & Right)
  const winW = 28;
  const winH = 20;
  const winY = y + 54;
  const winPositions = [x + 8, x + w - 36];
  for (const wx of winPositions) {
    // Window frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(wx - 1, winY - 1, winW + 2, winH + 2);
    // Interior cyber cyan ambience
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(wx, winY, winW, winH);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(wx + 1, winY + 1, winW - 2, winH - 2);

    // Computer racks / terminal silhouettes inside
    ctx.fillStyle = '#082f49';
    ctx.fillRect(wx + 3, winY + 6, 8, winH - 6);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(wx + 5, winY + 9, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(wx + 5, winY + 13, 2, 2);

    // Diagonal Glass Specular Reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(wx + 4, winY + 1);
    ctx.lineTo(wx + winW - 2, winY + winH - 3);
    ctx.lineTo(wx + winW - 5, winY + winH - 1);
    ctx.lineTo(wx + 1, winY + 3);
    ctx.closePath();
    ctx.fill();
  }

  // Automatic Cyan Glass Sliding Doors (Center)
  const doorW = 28;
  const doorH = 34;
  const doorX = x + Math.floor((w - doorW) / 2);
  const doorY = y + h - doorH - 4;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 2);

  // Glass panels
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(doorX + 2, doorY + 2, doorW / 2 - 3, doorH - 3);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + 2, doorW / 2 - 3, doorH - 3);

  // Center vertical seam & handle bars
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX + doorW / 2 - 1, doorY, 2, doorH);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(doorX + doorW / 2 - 4, doorY + 14, 2, 10);
  ctx.fillRect(doorX + doorW / 2 + 2, doorY + 14, 2, 10);

  // Keypad terminal on right wall
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX + doorW + 3, doorY + 12, 4, 8);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(doorX + doorW + 4, doorY + 13, 2, 2);
}

/**
 * 3. Home Manor — Boutique Tudor / Modern Luxury Residence
 * 2.5D Architecture:
 * - Steep textured slate shingle gable roof with dual dormer windows
 * - Fieldstone chimney with red brick cap & animated smoke puffs
 * - Dark chocolate oak timber framing over warm ivory stucco
 * - 2nd-floor wrought-iron Juliet balcony with blooming flower boxes & French doors
 * - Deep arched front door with brass carriage lantern & leaded glass windows with flower boxes
 */
function renderHomeManor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 10 * TILE_SIZE; // 160px
  const h = 7 * TILE_SIZE; // 112px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 4, y + h - 4, w + 6, 8);

  // Foundation Plinth (Cobblestone / Fieldstone)
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + h - 12, w, 12);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y + h - 12, w, 2);
  for (let cx = x + 8; cx < x + w; cx += 16) {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx, y + h - 10, 1, 8);
  }

  // Warm Ivory / Cream Stucco Wall Base
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x, y + 36, w, h - 48);

  // Half-Timber Dark Oak Framing (Tudor Style)
  ctx.fillStyle = '#451a03';
  // Vertical corner posts
  ctx.fillRect(x, y + 36, 4, h - 48);
  ctx.fillRect(x + w - 4, y + 36, 4, h - 48);
  // Horizontal dividing band between floors
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x, y + 60, w, 4);
  // Diagonal braces
  ctx.fillRect(x + 4, y + 64, 12, 2);
  ctx.fillRect(x + w - 16, y + 64, 12, 2);

  // Fieldstone & Brick Chimney on Left
  const chX = x + 16;
  const chY = y + 2;
  ctx.fillStyle = '#475569';
  ctx.fillRect(chX, chY + 8, 12, 26);
  ctx.fillStyle = '#991b1b'; // Red brick upper section
  ctx.fillRect(chX - 1, chY, 14, 8);
  ctx.fillStyle = '#1e293b'; // Chimney cap
  ctx.fillRect(chX - 2, chY - 2, 16, 2);

  // Chimney smoke puffs (pixel-art)
  ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
  ctx.fillRect(chX + 2, chY - 6, 5, 4);
  ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
  ctx.fillRect(chX + 5, chY - 12, 7, 5);
  ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
  ctx.fillRect(chX + 9, chY - 18, 8, 5);

  // Steep Mansard Slate Roof
  ctx.fillStyle = '#1e1b2e'; // Deep roof under-shadow
  ctx.fillRect(x - 5, y + 16, w + 10, 24);
  ctx.fillStyle = '#2b2d42'; // Slate roof body
  ctx.fillRect(x - 4, y + 18, w + 8, 20);

  // Shingles texture
  ctx.fillStyle = '#3a3d54';
  ctx.fillRect(x - 4, y + 18, w + 8, 2);
  for (let row = 0; row < 3; row++) {
    const sy = y + 22 + row * 6;
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(x - 4, sy, w + 8, 1);
    const xShift = row % 2 === 0 ? 0 : 8;
    for (let sx = x - 2 + xShift; sx < x + w + 4; sx += 14) {
      ctx.fillRect(sx, sy, 1, 5);
    }
  }

  // Roof Eaves Fascia & Gutter
  ctx.fillStyle = '#1d1e2c';
  ctx.fillRect(x - 6, y + 36, w + 12, 4);
  ctx.fillStyle = '#d4af37'; // Subtle gold gutter trim
  ctx.fillRect(x - 6, y + 36, w + 12, 1);

  // Dual Roof Dormer Windows
  const dormers = [x + 28, x + w - 44];
  for (const dx of dormers) {
    // Dormer peak
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(dx - 1, y + 18);
    ctx.lineTo(dx + 7, y + 8);
    ctx.lineTo(dx + 15, y + 18);
    ctx.closePath();
    ctx.fill();

    // Dormer body
    ctx.fillStyle = '#78350f';
    ctx.fillRect(dx, y + 18, 14, 16);
    // Lit glass
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(dx + 2, y + 14, 10, 10);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(dx + 6, y + 14, 2, 10);
    ctx.fillRect(dx + 2, y + 18, 10, 1.5);
  }

  // 2nd-Floor Wrought-Iron Juliet Balcony (Center)
  const balW = 44;
  const balX = x + Math.floor(w / 2) - balW / 2;
  const balY = y + 40;

  // Glazed French Doors behind balcony
  ctx.fillStyle = '#331e0f';
  ctx.fillRect(balX + 8, balY - 4, balW - 16, 22);
  ctx.fillStyle = '#fef08a'; // Warm interior light
  ctx.fillRect(balX + 10, balY - 2, balW - 20, 18);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(balX + balW / 2 - 1, balY - 2, 2, 18);
  ctx.fillRect(balX + 10, balY + 6, balW - 20, 1.5);

  // Wrought-iron railing
  ctx.fillStyle = '#1c1726';
  ctx.fillRect(balX, balY + 12, balW, 8);
  ctx.fillStyle = '#fbbf24'; // Brass railing handrail
  ctx.fillRect(balX - 1, balY + 11, balW + 2, 2);
  // Railing balusters
  for (let bx = balX + 2; bx < balX + balW - 2; bx += 4) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(bx, balY + 13, 1.5, 7);
  }

  // Blooming Balcony Flower Box (Roses & Geraniums)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(balX + 2, balY + 18, balW - 4, 4);
  // Flowers
  const flColors = ['#ef4444', '#f43f5e', '#fbbf24', '#a855f7'];
  for (let fx = balX + 4; fx < balX + balW - 4; fx += 5) {
    ctx.fillStyle = flColors[(fx * 7) % flColors.length];
    ctx.fillRect(fx, balY + 16, 3, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(fx + 1, balY + 18, 2, 2);
  }

  // Front Door aligned at X: 15 (x + 76)
  const doorW = 20;
  const doorH = 34;
  const doorX = x + 76;
  const doorY = y + h - doorH - 4;

  // Arched Stone Portal
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(doorX + doorW / 2, doorY + 8, 12, Math.PI, 0);
  ctx.lineTo(doorX + doorW + 2, doorY + doorH);
  ctx.lineTo(doorX - 2, doorY + doorH);
  ctx.closePath();
  ctx.fill();

  // Solid Oak Door Body
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX, doorY + 6, doorW, doorH - 6);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(doorX + 2, doorY + 8, doorW - 4, 10);
  ctx.fillRect(doorX + 2, doorY + 20, doorW - 4, 11);

  // Polished Brass Door Knocker & Handle
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorX + doorW - 5, doorY + 18, 2, 4);
  ctx.beginPath();
  ctx.arc(doorX + doorW / 2, doorY + 13, 2, 0, Math.PI * 2);
  ctx.fill();

  // Brass Welcome Lantern on Left
  ctx.fillStyle = '#b45309';
  ctx.fillRect(doorX - 7, doorY + 12, 3, 6);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(doorX - 6, doorY + 13, 2, 3);

  // Ground floor windows with shutters & flower boxes
  drawLuxuryWindowWithBox(ctx, x + 16, y + 68);
  drawLuxuryWindowWithBox(ctx, x + w - 40, y + 68);
}

function drawLuxuryWindowWithBox(ctx: CanvasRenderingContext2D, wx: number, wy: number) {
  const winW = 22;
  const winH = 20;

  // Shutters (Deep navy/slate)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(wx - 5, wy, 4, winH);
  ctx.fillRect(wx + winW + 1, wy, 4, winH);

  // Outer frame
  ctx.fillStyle = '#451a03';
  ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);

  // Warm interior light
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(wx, wy, winW, winH);

  // Curtains
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(wx, wy, 3, winH);
  ctx.fillRect(wx + winW - 3, wy, 3, winH);

  // Leaded glass cross mullions
  ctx.fillStyle = '#451a03';
  ctx.fillRect(wx + Math.floor(winW / 2), wy, 1.5, winH);
  ctx.fillRect(wx, wy + Math.floor(winH / 2), winW, 1.5);

  // Flower Box
  ctx.fillStyle = '#78350f';
  ctx.fillRect(wx - 3, wy + winH, winW + 6, 5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(wx - 3, wy + winH + 4, winW + 6, 1);

  // Blooming flowers
  const colors = ['#ef4444', '#ec4899', '#f59e0b', '#3b82f6'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(wx + i * 5 + 1, wy + winH - 2, 3, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(wx + i * 5 + 2, wy + winH - 1, 2, 2);
  }
}

/**
 * 4. Pokémon Center — Flagship Curved Crimson Medical Hub
 * Gen 5 Castelia / Jubilife Luxury Aesthetic:
 * - Curved 3D metallic crimson roof with specular highlight band
 * - Recessed glowing 3D Poké Ball crest at the center
 * - Composite white facade with horizontal aluminum seams & polished granite plinth
 * - Automatic cyan energy glass sliding doors with crimson canopy
 * - Waiting room showcase windows & manicured topiary planters
 */
function renderPokemonCenter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 7 * TILE_SIZE; // 112px
  const h = 6 * TILE_SIZE; // 96px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 2, y + h - 4, w + 8, 8);

  // Granite Foundation Plinth
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + h - 6, w, 6);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x, y + h - 6, w, 1);

  // Clean Composite White Wall Facade
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, y + 36, w, h - 42);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y + 36, w, h - 42);

  // Aluminum panel reveal lines
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x, y + 54, w, 1);
  ctx.fillRect(x + 24, y + 36, 1, h - 42);
  ctx.fillRect(x + w - 24, y + 36, 1, h - 42);

  // Curved Metallic Crimson Roof (3D Aerodynamic Dome)
  ctx.fillStyle = '#7f1d1d'; // Under-roof shadow
  ctx.beginPath();
  ctx.roundRect(x - 5, y + 8, w + 10, 32, [14, 14, 2, 2]);
  ctx.fill();

  ctx.fillStyle = '#b91c1c'; // Main crimson roof body
  ctx.beginPath();
  ctx.roundRect(x - 4, y + 8, w + 8, 30, [12, 12, 2, 2]);
  ctx.fill();

  ctx.fillStyle = '#dc2626'; // Vibrant upper curve
  ctx.beginPath();
  ctx.roundRect(x - 3, y + 9, w + 6, 22, [10, 10, 2, 2]);
  ctx.fill();

  // Specular Highlight Curved Band (Glass/Metallic Shine)
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 10, w - 4, 6, [6, 6, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 8, y + 11, w - 24, 2);

  // Roof Eaves Trim
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 5, y + 36, w + 10, 3);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x - 4, y + 36, w + 8, 1);

  // Iconic 3D Glowing Poké Ball Crest (Centered)
  const pbx = x + Math.floor(w / 2);
  const pby = y + 23;
  const pbr = 12;

  // Chrome outer bezel
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(pbx, pby, pbr + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(pbx, pby, pbr + 1, 0, Math.PI * 2);
  ctx.fill();

  // Top half: Brilliant Red
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(pbx, pby, pbr, Math.PI, 0);
  ctx.fill();

  // Bottom half: Pure White
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(pbx, pby, pbr, 0, Math.PI);
  ctx.fill();

  // Dividing Black Belt
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(pbx - pbr, pby - 1.5, pbr * 2, 3);

  // Center Button
  ctx.beginPath();
  ctx.arc(pbx, pby, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(pbx, pby, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8'; // Glowing center LED
  ctx.beginPath();
  ctx.arc(pbx, pby, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Automatic Cyan Glass Sliding Doors (Center, aligned at X: 17)
  const doorW = 28;
  const doorH = 34;
  const doorX = x + Math.floor((w - doorW) / 2);
  const doorY = y + h - doorH - 4;

  // Door canopy
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(doorX - 2, doorY - 3, doorW + 4, 4);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(doorX - 2, doorY - 3, doorW + 4, 1);

  // Door surround
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 1, doorY, doorW + 2, doorH);

  // Energy cyan glass
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(doorX, doorY + 1, doorW, doorH - 1);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(doorX + 2, doorY + 3, doorW / 2 - 3, doorH - 4);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + 3, doorW / 2 - 3, doorH - 4);

  // Vertical center divide & red cross/heal emblem
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX + doorW / 2 - 1, doorY + 1, 2, doorH - 1);
  ctx.fillStyle = '#ef233c';
  ctx.fillRect(doorX + doorW / 2 - 3, doorY + 10, 6, 2);
  ctx.fillRect(doorX + doorW / 2 - 1, doorY + 8, 2, 6);

  // Waiting Room Windows (Left & Right)
  const winW = 24;
  const winH = 22;
  const winY = y + 46;
  const winPositions = [x + 6, x + w - 30];
  for (const wx of winPositions) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(wx - 1, winY - 1, winW + 2, winH + 2);
    ctx.fillStyle = '#ffea75'; // Warm interior lobby illumination
    ctx.fillRect(wx, winY, winW, winH);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(wx + Math.floor(winW / 2), winY, 1.5, winH);
    ctx.fillRect(wx, winY + Math.floor(winH / 2), winW, 1.5);

    // Specular diagonal glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(wx + 3, winY + 2);
    ctx.lineTo(wx + winW - 3, winY + winH - 4);
    ctx.lineTo(wx + winW - 6, winY + winH - 2);
    ctx.lineTo(wx + 1, winY + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Potted Topiary Plants flanking the entrance
  drawTopiaryPot(ctx, doorX - 8, y + h - 16);
  drawTopiaryPot(ctx, doorX + doorW + 2, y + h - 16);
}

function drawTopiaryPot(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Ceramic pot
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px, py + 6, 6, 8);
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 1, py + 7, 4, 6);
  // Spherical clipped green bush
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.arc(px + 3, py + 4, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(px + 2.5, py + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#86efac';
  ctx.fillRect(px + 1.5, py + 2, 2, 2);
}

/**
 * 5. Poké Mart / Depop — Boutique Cobalt & Gold Commercial Emporium
 * 2.5D Architecture:
 * - Multi-tiered royal cobalt blue roof with polished gold trim
 * - Striped boutique retractable fabric awning (navy & ivory)
 * - Large showcase bay window displaying potions, Poké Balls & TMs on lit shelves
 * - Illuminated gold POKÉ MART marquee
 * - Welcoming glazed shop door with polished brass handle
 */
function renderPokeMart(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 6 * TILE_SIZE; // 96px
  const h = 6 * TILE_SIZE; // 96px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 2, y + h - 4, w + 8, 8);

  // Foundation Plinth
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y + h - 6, w, 6);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x, y + h - 6, w, 1);

  // Clean White / Ivory Wall Facade
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, y + 30, w, h - 36);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y + 30, w, h - 36);

  // Tiered Royal Cobalt Roof
  ctx.fillStyle = '#0f172a'; // Under-roof shadow
  ctx.fillRect(x - 5, y + 6, w + 10, 24);
  ctx.fillStyle = '#1e3a8a'; // Main cobalt body
  ctx.fillRect(x - 4, y + 6, w + 8, 22);
  ctx.fillStyle = '#2563eb'; // Upper highlight plane
  ctx.fillRect(x - 4, y + 6, w + 8, 8);

  // Gold Coping & Ridge Trim
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x - 5, y + 5, w + 10, 2);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(x - 4, y + 5, w + 8, 1);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x - 5, y + 28, w + 10, 2);

  // Illuminated POKÉ MART Marquee Signboard
  const signW = 54;
  const signH = 13;
  const signX = x + Math.floor((w - signW) / 2);
  const signY = y + 11;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(signX - 1, signY - 1, signW + 2, signH + 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.strokeRect(signX + 0.5, signY + 0.5, signW - 1, signH - 1);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POKÉ MART', x + w / 2, signY + signH / 2);

  // Striped Boutique Awning over Showcase Window (Left)
  const awnW = 44;
  const awnX = x + 6;
  const awnY = y + 32;
  const awnH = 8;
  const stripeW = 6;
  for (let i = 0; i < Math.floor(awnW / stripeW); i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1e3a8a' : '#f8fafc';
    ctx.fillRect(awnX + i * stripeW, awnY, stripeW, awnH);
  }
  // Awning scalloped valence fringe
  for (let i = 0; i < Math.floor(awnW / stripeW); i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1e3a8a' : '#f8fafc';
    ctx.beginPath();
    ctx.arc(awnX + i * stripeW + stripeW / 2, awnY + awnH, stripeW / 2, 0, Math.PI);
    ctx.fill();
  }

  // Showcase Bay Display Window (under awning)
  const winX = x + 6;
  const winY = awnY + awnH + 2;
  const winW = 44;
  const winH = 34;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(winX - 1, winY - 1, winW + 2, winH + 2);
  ctx.fillStyle = '#0284c7'; // Illuminated store interior
  ctx.fillRect(winX, winY, winW, winH);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(winX + 1, winY + 1, winW - 2, winH - 2);

  // Illuminated merchandise display shelves
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(winX + 2, winY + 12, winW - 4, 2);
  ctx.fillRect(winX + 2, winY + 23, winW - 4, 2);

  // Products on shelf:
  // Top shelf: Potions & Pokéballs
  ctx.fillStyle = '#a855f7'; // Potion
  ctx.fillRect(winX + 5, winY + 5, 4, 7);
  ctx.fillStyle = '#ef4444'; // Pokéball
  ctx.fillRect(winX + 13, winY + 6, 5, 5);
  ctx.fillStyle = '#3b82f6'; // Super Potion
  ctx.fillRect(winX + 22, winY + 5, 4, 7);
  ctx.fillStyle = '#f59e0b'; // Ultra Ball
  ctx.fillRect(winX + 30, winY + 6, 5, 5);

  // Bottom shelf: TM Discs & Revival Herb
  ctx.fillStyle = '#10b981'; // Green TM
  ctx.fillRect(winX + 6, winY + 16, 6, 6);
  ctx.fillStyle = '#e11d48'; // Red TM
  ctx.fillRect(winX + 16, winY + 16, 6, 6);
  ctx.fillStyle = '#6366f1'; // Purple TM
  ctx.fillRect(winX + 26, winY + 16, 6, 6);

  // Diagonal Specular Reflection (Glass Glint)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.moveTo(winX + 4, winY + 2);
  ctx.lineTo(winX + winW - 4, winY + winH - 6);
  ctx.lineTo(winX + winW - 8, winY + winH - 2);
  ctx.lineTo(winX + 1, winY + 5);
  ctx.closePath();
  ctx.fill();

  // Entrance Door (aligned at X = 15, doorX: x + 56)
  const doorX = x + 56;
  const doorY = y + h - 38;
  const doorW = 22;
  const doorH = 32;

  // Door surround
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 1, doorY - 1, doorW + 2, doorH + 2);

  // Glazed door with teak frame
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = '#bae6fd'; // Window on door
  ctx.fillRect(doorX + 3, doorY + 3, doorW - 6, 16);

  // Polished brass handle
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorX + doorW - 4, doorY + 16, 2, 5);

  // Welcome Doormat
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(doorX - 2, doorY + doorH - 2, doorW + 4, 4);
}

/**
 * 6. Retro Arcade — Cyberpunk Neon Entertainment Center
 * 2.5D Architecture:
 * - Matte obsidian-anthracite facade with structural chamfered corner pilasters
 * - Multi-colored neon edge strips (magenta, electric cyan, gold) along roof and portals
 * - 3D pixel-art golden arcade crown & joystick rooftop marquee
 * - Tinted panoramic floor-to-ceiling windows with retro arcade cabinet silhouettes and glowing CRT screens
 * - Illuminated turquoise neon floor entrance runner & polished chrome bollards
 */
function renderArcadeBuilding(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 8 * TILE_SIZE; // 128px
  const h = 7 * TILE_SIZE; // 112px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 4, y + h - 4, w + 8, 8);

  // Obsidian Facade Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y + 22, w, h - 22);
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y + 22, w, h - 22);

  // Parapet Roof with Cyberpunk Chamfered Corners
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 3, y + 6, w + 6, 18);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 3, y + 6, w + 6, 3);

  // Multi-Color Neon Roof Edge Strips (Electric Cyan & Magenta)
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x - 3, y + 8, w + 6, 1.5);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(x - 3, y + 22, w + 6, 1.5);

  // Rooftop Golden Arcade Crown & Pixel Joystick Sculptures
  const jX = x + 14;
  ctx.fillStyle = '#334155';
  ctx.fillRect(jX, y - 4, 12, 10);
  ctx.fillStyle = '#ef4444'; // Red joystick ball
  ctx.beginPath();
  ctx.arc(jX + 6, y - 6, 4, 0, Math.PI * 2);
  ctx.fill();

  const jX2 = x + w - 26;
  ctx.fillStyle = '#334155';
  ctx.fillRect(jX2, y - 4, 12, 10);
  ctx.fillStyle = '#3b82f6'; // Blue joystick ball
  ctx.beginPath();
  ctx.arc(jX2 + 6, y - 6, 4, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Neon ARCADE Marquee Signboard
  const signW = 74;
  const signH = 16;
  const signX = x + Math.floor((w - signW) / 2);
  const signY = y + 26;
  ctx.fillStyle = '#020617';
  ctx.fillRect(signX - 1, signY - 1, signW + 2, signH + 2);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(signX, signY, signW, signH);

  // Dual Neon Border (Turquoise & Magenta)
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(signX + 0.5, signY + 0.5, signW - 1, signH - 1);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(signX + 2, signY + 2, signW - 4, signH - 4);

  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ ARCADE ⚡', x + w / 2, signY + signH / 2);

  // Floor-to-Ceiling Tinted Glass Windows with Arcade Cabinet Silhouettes
  const winCols = [x + 10, x + 38, x + 72, x + 100];
  for (const wx of winCols) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(wx - 1, y + 50, 20, 20);
    // Dark glass
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(wx, y + 51, 18, 18);

    // Glowing arcade cabinet CRT monitor inside
    ctx.fillStyle = (wx % 2 === 0) ? '#06b6d4' : '#f43f5e';
    ctx.fillRect(wx + 3, y + 55, 12, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(wx + 5, y + 57, 4, 4);

    // Diagonal glass glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(wx + 2, y + 52);
    ctx.lineTo(wx + 16, y + 66);
    ctx.lineTo(wx + 13, y + 68);
    ctx.lineTo(wx + 1, y + 55);
    ctx.closePath();
    ctx.fill();
  }

  // Double Glass Doors facing the Fountain Plaza (Center)
  const doorW = 38;
  const doorH = 38;
  const doorX = x + Math.floor((w - doorW) / 2);
  const doorY = y + h - doorH - 4;

  ctx.fillStyle = '#020617';
  ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 2);

  // Cyan tinted glass
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(doorX + 2, doorY + 2, doorW / 2 - 3, doorH - 4);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + 2, doorW / 2 - 3, doorH - 4);

  // Vertical center divide & chrome vertical handles
  ctx.fillStyle = '#020617';
  ctx.fillRect(doorX + doorW / 2 - 1, doorY, 2, doorH);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(doorX + doorW / 2 - 4, doorY + 14, 2, 10);
  ctx.fillRect(doorX + doorW / 2 + 2, doorY + 14, 2, 10);

  // Illuminated Turquoise Neon Floor Apron & Runner
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 4, doorY + doorH - 2, doorW + 8, 8);
  ctx.fillStyle = '#06d6a0'; // Glowing runner
  ctx.fillRect(doorX - 2, doorY + doorH, doorW + 4, 3);

  // Chrome Entryway Bollards flanking the entrance
  const bollards = [doorX - 6, doorX + doorW + 3];
  for (const bx of bollards) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx, doorY + doorH - 6, 3, 10);
    ctx.fillStyle = '#38bdf8'; // Glowing LED tip
    ctx.fillRect(bx, doorY + doorH - 8, 3, 2);
  }
}

/**
 * 7. Tech Tower — Executive Glass Curtain-Wall Skyscraper
 * Modern Corporate Architecture:
 * - Rooftop communication mast, satellite antenna & red aviation beacon
 * - Multi-story blue curtain-wall glass facade with structural vertical steel mullions
 * - Realistic illuminated office floor variations with diagonal sky specular reflections
 * - Double-height ground floor executive lobby with modern entrance canopy & reception
 */
function renderTallOfficeBuilding(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 6 * TILE_SIZE; // 96px
  const h = 8 * TILE_SIZE; // 128px

  // Ground drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x + 2, y + h - 4, w + 6, 8);

  // Structural Steel Building Core
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 16, w, h - 16);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y + 16, w, h - 16);

  // Multi-Tiered Rooftop Parapet
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 3, y + 8, w + 6, 12);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 3, y + 8, w + 6, 2);

  // Communications Spire with Aviation Warning Beacon
  const spireX = x + Math.floor(w / 2);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(spireX - 1, y - 10, 2, 18);
  ctx.fillStyle = '#ef4444'; // Flashing red beacon
  ctx.fillRect(spireX - 2, y - 13, 4, 3);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(spireX - 1, y - 12, 2, 1);

  // Rooftop Satellite Dish
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(x + 14, y + 4, 5, Math.PI * 0.7, Math.PI * 1.8);
  ctx.stroke();

  // 4 Floors of Curtain-Wall Office Windows
  for (let floor = 0; floor < 4; floor++) {
    const fy = y + 22 + floor * 22;

    // Horizontal Spandrel Beam (Dark Steel)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, fy + 15, w - 8, 3);

    // Office window banks across the floor
    for (let wx = x + 8; wx < x + w - 12; wx += 20) {
      // Window frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx - 1, fy - 1, 18, 15);

      // Lit Office Window (Alternating between cyan executive daylight and warm desk lamp)
      const isWarm = (floor + wx) % 2 === 0;
      ctx.fillStyle = isWarm ? '#fef08a' : '#93c5fd';
      ctx.fillRect(wx, fy, 16, 13);

      // Steel mullion in center
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wx + 7.5, fy, 1, 13);

      // Office desk silhouette inside
      ctx.fillStyle = isWarm ? '#78350f' : '#1e3a8a';
      ctx.fillRect(wx + 2, fy + 8, 12, 5);

      // Diagonal Sky Specular Glass Reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(wx + 2, fy + 1);
      ctx.lineTo(wx + 14, fy + 10);
      ctx.lineTo(wx + 11, fy + 12);
      ctx.lineTo(wx + 1, fy + 3);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Double-Height Ground Floor Executive Lobby
  const doorW = 28;
  const doorH = 26;
  const doorX = x + Math.floor((w - doorW) / 2);
  const doorY = y + h - doorH - 2;

  // Modern Cantilevered Entrance Canopy
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 4, doorY - 4, doorW + 8, 4);
  ctx.fillStyle = '#38bdf8'; // Glowing cyan LED edge line
  ctx.fillRect(doorX - 4, doorY - 1, doorW + 8, 1);

  // Lobby Glass Vestibule
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 1, doorY, doorW + 2, doorH);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(doorX, doorY + 1, doorW, doorH - 1);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(doorX + 2, doorY + 2, doorW - 4, doorH - 3);

  // Revolving Door Central Axis
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX + doorW / 2 - 1, doorY + 2, 2, doorH - 3);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(doorX + doorW / 2 - 6, doorY + 6, 12, 1);
  ctx.fillRect(doorX + doorW / 2 - 6, doorY + 16, 12, 1);
}

/**
 * 7. Storybook Pokémon Villa (East Residential Garden)
 * Authentic Gen 4/5 aesthetic: steep terracotta shingled roof, cobblestone chimney,
 * half-timbered stucco walls, dormer window, shutters, flower boxes, and brass-lantern entry.
 */
function renderPokemonCottage(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 6 * TILE_SIZE; // 96px (X: 36..41)
  const h = 5 * TILE_SIZE; // 80px (Y: 9..13)

  // Ground drop shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.fillRect(x + 4, y + h - 6, w + 6, 8);

  // Cobblestone foundation plinth
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x, y + h - 14, w, 14);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + h - 14, w, 2);
  for (let sx = x + 8; sx < x + w; sx += 16) {
    ctx.fillRect(sx, y + h - 12, 1, 10);
  }

  // Warm stucco facade
  ctx.fillStyle = '#fef3c7'; // warm cream ivory
  ctx.fillRect(x + 2, y + 26, w - 4, h - 40);

  // Half-timbered Tudor/Pokemon wood framing
  ctx.fillStyle = '#78350f';
  // Vertical corner posts
  ctx.fillRect(x + 2, y + 26, 4, h - 40);
  ctx.fillRect(x + w - 6, y + 26, 4, h - 40);
  // Horizontal band
  ctx.fillRect(x + 2, y + 42, w - 4, 3);

  // Cobblestone Chimney (Right side)
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w - 18, y + 4, 12, 26);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + w - 20, y + 2, 16, 4);
  // Chimney smoke puffs (pixel art)
  ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.fillRect(x + w - 14, y - 4, 6, 5);
  ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
  ctx.fillRect(x + w - 10, y - 10, 8, 5);
  ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
  ctx.fillRect(x + w - 6, y - 16, 6, 4);

  // Steep Terracotta Gable Roof
  ctx.fillStyle = '#c2410c'; // rich terracotta
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 28);
  ctx.lineTo(x + w / 2, y + 2);
  ctx.lineTo(x + w + 4, y + 28);
  ctx.closePath();
  ctx.fill();

  // Roof eaves shadow & ridge trim
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 28);
  ctx.lineTo(x + w / 2, y + 5);
  ctx.lineTo(x + w + 4, y + 28);
  ctx.lineTo(x + w + 4, y + 31);
  ctx.lineTo(x - 4, y + 31);
  ctx.closePath();
  ctx.fill();

  // Roof shingles texture
  ctx.fillStyle = '#ea580c';
  for (let row = 0; row < 4; row++) {
    const ry = y + 8 + row * 5;
    const rSpread = (row + 1) * 8;
    ctx.fillRect(x + w / 2 - rSpread, ry, rSpread * 2, 1);
  }

  // Roof Dormer Window (Centered)
  const dX = x + w / 2 - 8;
  const dY = y + 10;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(dX, dY, 16, 14);
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(dX - 2, dY - 2, 20, 3);
  ctx.fillStyle = '#fef08a'; // illuminated glass
  ctx.fillRect(dX + 2, dY + 2, 12, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(dX + 7, dY + 2, 2, 10);
  ctx.fillRect(dX + 2, dY + 6, 12, 1);

  // Arched Front Door at (38, 13)
  const doorX = x + 32;
  const doorY = y + h - 34;
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.arc(doorX + 9, doorY + 8, 9, Math.PI, 0);
  ctx.lineTo(doorX + 18, doorY + 34);
  ctx.lineTo(doorX, doorY + 34);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Door vertical planks & brass handle
  ctx.fillStyle = '#78350f';
  ctx.fillRect(doorX + 8, doorY + 6, 2, 28);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorX + 13, doorY + 20, 2, 3);

  // Left Ground Floor Window with shutters & flower box
  const winLX = x + 10;
  const winY = y + 48;
  // Shutters (Deep blue/teal)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(winLX - 5, winY, 4, 16);
  ctx.fillRect(winLX + 15, winY, 4, 16);
  // Glass
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(winLX, winY, 14, 15);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(winLX + 6, winY, 2, 15);
  ctx.fillRect(winLX, winY + 7, 14, 1);
  // Flower box
  ctx.fillStyle = '#78350f';
  ctx.fillRect(winLX - 2, winY + 14, 18, 4);
  // Blooming flowers (Red & pink geraniums)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(winLX, winY + 12, 3, 3);
  ctx.fillRect(winLX + 7, winY + 12, 3, 3);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(winLX + 13, winY + 12, 3, 3);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(winLX + 3, winY + 13, 2, 2);
  ctx.fillRect(winLX + 10, winY + 13, 2, 2);

  // Right Ground Floor Window with shutters & flower box
  const winRX = x + w - 24;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(winRX - 5, winY, 4, 16);
  ctx.fillRect(winRX + 15, winY, 4, 16);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(winRX, winY, 14, 15);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(winRX + 6, winY, 2, 15);
  ctx.fillRect(winRX, winY + 7, 14, 1);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(winRX - 2, winY + 14, 18, 4);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(winRX, winY + 12, 3, 3);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(winRX + 8, winY + 12, 3, 3);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(winRX + 13, winY + 12, 3, 3);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(winRX + 4, winY + 13, 2, 2);

  // Welcome brass lantern
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(doorX - 5, doorY + 10, 3, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(doorX - 4, doorY + 11, 2, 2);
}

/**
 * 3. High-Tech AI & Satellite Observatory Annex (Lab Compound)
 */
function renderLabObservatoryAnnex(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE; // 48px (X: 31..33)
  const h = 5 * TILE_SIZE; // 80px (Y: 6..10)

  // Shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.fillRect(x + 4, y + h - 4, w + 4, 6);

  // Clean titanium body
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 20, w, h - 20);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y + 20, w, h - 20);

  // Brushed steel panels
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 3, y + 24, w - 6, h - 28);

  // Observatory Dome on roof
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 20, 14, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Dome observation slit
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x + w / 2 - 2, y + 7, 4, 13);
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(x + w / 2 - 1, y + 8, 2, 11);

  // AI Satellite Communications Mast
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x + 6, y - 6, 2, 26);
  // Blinking green LED beacon
  ctx.fillStyle = '#10b981';
  ctx.fillRect(x + 5, y - 8, 4, 3);
  // Parabolic dish
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(x + 7, y - 2, 5, Math.PI * 0.7, Math.PI * 1.8);
  ctx.stroke();

  // Cyan fiber-optic server ventilation louvers
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 4, y + 28, 10, 16);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(x + 5, y + 30 + i * 3.5, 8, 2);
  }

  // High-tech glass sliding door at (32, 10)
  const doorX = x + 16;
  const doorY = y + h - 24;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(doorX, doorY, 16, 24);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(doorX + 2, doorY + 2, 5, 20);
  ctx.fillRect(doorX + 9, doorY + 2, 5, 20);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX + 7, doorY, 2, 24);

  // Digital status terminal light
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(doorX - 4, doorY + 8, 2, 4);
}

// ==========================================
// 4. PROPS, FOUNTAIN & STREETWARE
// ==========================================
function renderPropsAndStreetware(ctx: CanvasRenderingContext2D) {
  // A. Plaza Circular Water Fountain
  const fountain = townConfig.getBuilding('fountain');
  if (fountain && !fountain.hidden) {
    renderPlazaFountain(ctx, (fountain.x + 2) * TILE_SIZE, (fountain.y + 2) * TILE_SIZE);
  }

  // B. Grand Manor Courtyard Basin
  const basin = townConfig.getBuilding('basin');
  if (basin && !basin.hidden) {
    renderCourtyardBasin(ctx, (basin.x + 1) * TILE_SIZE, (basin.y + 1) * TILE_SIZE);
  }

  // C. Outdoor Café Terrace Tables & Umbrellas (X: 34..42, Y: 48..55)
  renderCafePatio(ctx);

  // D. Street Lamp Posts & Park Benches
  renderStreetLampsAndBenches(ctx);

  // E. Lookout Telescope & Direction Plaque
  const telescope = townConfig.getBuilding('telescope');
  if (telescope && !telescope.hidden) {
    drawNorthFacingTelescope(ctx, telescope.x * TILE_SIZE + 4, telescope.y * TILE_SIZE + 4);
    drawLookoutPlaque(ctx);
  }

  // F. Contest Stage Star Podium & Audience Benches
  renderContestProps(ctx);

  // G. Ranger Campfire & Log Benches
  const campfire = townConfig.getBuilding('campfire');
  if (campfire && !campfire.hidden) {
    renderRangerCampfireAndBenches(ctx);
  }

  // H. Hero Statue
  const statue = townConfig.getBuilding('statue');
  if (statue && !statue.hidden) {
    drawHeroStatue(ctx, statue.x * TILE_SIZE, statue.y * TILE_SIZE);
  }

  // I. Dynamically Spawned Extra Entities (Objects, Signs, NPCs)
  const extraEntities = townConfig.getBuildings().filter(
    (b) => (b.kind === 'object' || b.kind === 'sign' || b.kind === 'npc') && !b.hidden
  );
  for (const obj of extraEntities) {
    if (['fountain', 'basin', 'kiosk', 'gazebo', 'camp', 'campfire', 'podium', 'telescope', 'vending', 'statue', 'garden', 'contest'].includes(obj.id)) {
      continue;
    }
    const px = obj.x * TILE_SIZE;
    const py = obj.y * TILE_SIZE;

    // Special handling for maritime railing
    if (obj.subType === 'fence_water') {
      drawMaritimeSeaRailing(ctx, px, py, obj.orientation || 'N');
      continue;
    }

    const isFlipped = obj.orientation === 'W';
    if (isFlipped) {
      ctx.save();
      const cx = px + (obj.w * TILE_SIZE) / 2;
      ctx.translate(cx, 0);
      ctx.scale(-1, 1);
      ctx.translate(-cx, 0);
    }

    if (obj.kind === 'sign' || obj.subType === 'sign') {
      drawSingleSignBoard(ctx, px, py);
    } else if (obj.kind === 'npc' || obj.subType === 'npc') {
      drawWanderingTrainerNpc(ctx, px, py);
    } else {
      switch (obj.subType) {
        case 'berry_pot': drawBerryPot(ctx, px + 2, py + 2, '#3b82f6', '#1d4ed8'); break;
        case 'statue': drawHeroStatue(ctx, px, py); break;
        case 'vending': drawArcadeVendingMachine(ctx, px, py); break;
        case 'telescope': drawNorthFacingTelescope(ctx, px + 4, py + 4); break;
        case 'campfire': drawSingleCampfire(ctx, px, py); break;
        case 'tent': drawSingleTent(ctx, px, py); break;

        // 1. Nature & Flora
        case 'rock_boulder': drawRockBoulder(ctx, px, py); break;
        case 'lily_pond': drawLilyPond(ctx, px, py); break;

        // 2. Streetscape & Furniture
        case 'cafe_table': drawCafeBistroTable(ctx, px, py); break;
        case 'picnic_set': drawPicnicSet(ctx, px, py); break;
        case 'mailbox_red': drawRedMailbox(ctx, px, py); break;
        case 'trash_bin': drawTrashBins(ctx, px, py); break;

        // 3. Pokémon Overworld
        case 'pokeball_item': drawPokeballItem(ctx, px, py); break;
        case 'pokestop': drawPokestop(ctx, px, py); break;
        case 'snorlax': drawSnorlax(ctx, px, py); break;
        case 'pikachu': drawPikachu(ctx, px, py); break;
        case 'sub_doll': drawSubstituteDoll(ctx, px, py); break;
        case 'egg_incubator': drawEggIncubator(ctx, px, py); break;
        case 'pc_terminal': drawPCTerminal(ctx, px, py); break;
        case 'poke_house': drawPokeHouse(ctx, px, py); break;

        // 4. Tech & AI
        case 'server_rack': drawServerRack(ctx, px, py); break;
        case 'solar_panel': drawSolarPanel(ctx, px, py); break;
        case 'drone_pad': drawDronePad(ctx, px, py); break;
        case 'holo_projector': drawHoloProjector(ctx, px, py); break;
        case 'bike_rack': drawBikeRack(ctx, px, py); break;
        case 'sat_dish': drawSatelliteDish(ctx, px, py); break;
        case 'rover_bot': drawRoverBot(ctx, px, py); break;

        // 5. Civic & Landmarks
        case 'torii_gate': drawToriiGate(ctx, px, py); break;
        case 'jukebox': drawJukebox(ctx, px, py); break;
        case 'notice_board': drawNoticeBoard(ctx, px, py); break;
      }
    }

    if (isFlipped) {
      ctx.restore();
    }
  }
}

function drawHeroStatue(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Stone Pedestal
  ctx.fillStyle = '#8a7e6b';
  ctx.fillRect(px + 1, py + 8, 14, 8);
  ctx.strokeStyle = '#1c1726';
  ctx.strokeRect(px + 1, py + 8, 14, 8);

  // Bronze Trophy / Hero Statue
  ctx.fillStyle = '#c79248';
  ctx.fillRect(px + 4, py - 4, 8, 12);
  ctx.beginPath();
  ctx.arc(px + 8, py - 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1c1726';
  ctx.stroke();
}

function drawSingleCampfire(ctx: CanvasRenderingContext2D, px: number, py: number) {
  const fireX = px + 4;
  const fireY = py + 2;

  // Ground soot & ash
  ctx.fillStyle = 'rgba(20, 20, 20, 0.45)';
  ctx.beginPath();
  ctx.ellipse(fireX + 4, fireY + 4, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Natural stone ring (8 stones)
  const stoneColors = ['#64748b', '#475569', '#94a3b8', '#334155'];
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI * 2) / 8;
    const sx = fireX + 4 + Math.cos(angle) * 7 - 2;
    const sy = fireY + 4 + Math.sin(angle) * 4 - 2;
    ctx.fillStyle = stoneColors[a % 4];
    ctx.fillRect(sx, sy, 4, 3);
  }

  // Crossed burning logs in center
  ctx.fillStyle = '#451a03';
  ctx.fillRect(fireX + 1, fireY + 3, 7, 2);
  ctx.fillRect(fireX + 3, fireY + 1, 2, 7);

  // Cozy campfire flame & embers
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(fireX + 2, fireY + 2, 5, 4);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(fireX + 3, fireY + 1, 3, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(fireX + 4, fireY, 1, 3);
}

function drawSingleTent(ctx: CanvasRenderingContext2D, px: number, py: number) {
  const kw = 3.5 * TILE_SIZE;
  // Wooden support posts
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(px + 2, py + 4, 2, 14);
  ctx.fillRect(px + kw - 4, py + 4, 2, 14);
  // Forest Ranger Green Canopy
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(px, py, kw, 8);
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(px + 1, py + 1, kw - 2, 4);
  // Khaki accent stripe
  ctx.fillStyle = '#d4c79e';
  ctx.fillRect(px + 4, py + 1, 4, 6);
  ctx.fillRect(px + 16, py + 1, 4, 6);
  ctx.fillRect(px + 28, py + 1, 4, 6);
  // Scalloped bottom fringe
  ctx.fillStyle = '#1b4332';
  for (let fx = 0; fx < kw; fx += 4) {
    ctx.fillRect(px + fx, py + 8, 3, 2);
  }
}

function renderCourtyardBasin(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const radius = 14;
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, radius + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx - 1, cy - 1, radius - 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
}

function renderPlazaFountain(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const radius = 28;

  ctx.fillStyle = 'rgba(20, 25, 20, 0.45)';
  ctx.beginPath();
  ctx.arc(cx, cy + 3, radius + 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d1d5db';
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 2, radius - 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#6b7280';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 2, radius - 8, 0, Math.PI * 2);
  ctx.fill();

  // 2-tier center fountain pillar
  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
}

function renderCafePatio(ctx: CanvasRenderingContext2D) {
  // 4 Symmetrical Café Tables with Green & White striped canvas umbrellas (Shifted to East Terrace X: 34..42):
  // Table 1 (North-West, LinkedIn): x: 36.5, y: 49.5
  drawCafeTable(ctx, 36.5 * TILE_SIZE, 49.5 * TILE_SIZE);

  // Table 2 (North-East, Résumé): x: 40.5, y: 49.5
  drawCafeTable(ctx, 40.5 * TILE_SIZE, 49.5 * TILE_SIZE);

  // Table 3 (South-West, GitHub): x: 36.5, y: 53.5
  drawCafeTable(ctx, 36.5 * TILE_SIZE, 53.5 * TILE_SIZE);

  // Table 4 (South-East, Email): x: 40.5, y: 53.5
  drawCafeTable(ctx, 40.5 * TILE_SIZE, 53.5 * TILE_SIZE);
}

function drawCafeTable(ctx: CanvasRenderingContext2D, tx: number, ty: number) {
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.beginPath();
  ctx.arc(tx, ty + 12, 14, 0, Math.PI * 2);
  ctx.fill();

  // 4 Wooden Chairs around table
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(tx - 12, ty - 2, 5, 5);
  ctx.fillRect(tx + 8, ty - 2, 5, 5);
  ctx.fillRect(tx - 2, ty - 12, 5, 5);
  ctx.fillRect(tx - 2, ty + 8, 5, 5);

  // Pole & Table Top
  ctx.fillStyle = '#334155';
  ctx.fillRect(tx - 1, ty - 6, 2, 18);
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(tx, ty + 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.stroke();

  // Striped Parasol (Green & White)
  const uRadius = 14;
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.arc(tx, ty - 6, uRadius, 0, Math.PI * 2);
  ctx.fill();

  const wedges = 8;
  for (let i = 0; i < wedges; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(tx, ty - 6);
      ctx.arc(tx, ty - 6, uRadius, (i * Math.PI * 2) / wedges, ((i + 1) * Math.PI * 2) / wedges);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(tx, ty - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function renderStreetLampsAndBenches(ctx: CanvasRenderingContext2D) {
  // A. Harbor Observation Telescopes overlooking the ocean (at Y: 22 and Y: 25, clear of boardwalk)
  drawHarborTelescope(ctx, 8.5 * TILE_SIZE, 22 * TILE_SIZE);
  drawHarborTelescope(ctx, 8.5 * TILE_SIZE, 25 * TILE_SIZE);

  // B. Retro Pokémon Drink Vending Machine
  const vm = townConfig.getBuilding('vending');
  if (vm && !vm.hidden) {
    drawArcadeVendingMachine(ctx, vm.x * TILE_SIZE, vm.y * TILE_SIZE);
  }

  // C. Master-planned Park Benches (Dynamic & Configurable!)
  const configuredBenches = townConfig.getBuildings().filter((b) => b.kind === 'bench' && !b.hidden);
  if (configuredBenches.length > 0) {
    for (const bn of configuredBenches) {
      drawParkBench(ctx, bn.x * TILE_SIZE, bn.y * TILE_SIZE, bn.orientation || 'N', bn.w, bn.h);
    }
  } else {
    drawParkBench(ctx, 12 * TILE_SIZE, 18 * TILE_SIZE); // Courtyard west garden bench
    drawParkBench(ctx, 9.5 * TILE_SIZE, 25 * TILE_SIZE); // Oceanview harbor promenade bench
    drawParkBench(ctx, 26 * TILE_SIZE, 28.5 * TILE_SIZE); // Plaza north-west bench (symmetric, 48px from center 29.0)
    drawParkBench(ctx, 32 * TILE_SIZE, 28.5 * TILE_SIZE); // Plaza north-east bench (symmetric, 48px from center 29.0)
    drawParkBench(ctx, 24 * TILE_SIZE, 43.5 * TILE_SIZE); // Arcade forecourt bench
    drawParkBench(ctx, 27 * TILE_SIZE, 53.5 * TILE_SIZE); // Poké-Café Barista forecourt bench
    drawParkBench(ctx, 38 * TILE_SIZE, 5 * TILE_SIZE); // Scenic Lookout vista bench
    drawParkBench(ctx, 6.5 * TILE_SIZE, 31 * TILE_SIZE); // Seaside Boardwalk north garden bench
    drawParkBench(ctx, 6.5 * TILE_SIZE, 36.5 * TILE_SIZE); // Seaside Boardwalk south garden bench
  }

  // D. Symmetrical Master-planned Street Lamps (Dynamic & Configurable!)
  const allBuildings = townConfig.getBuildings(true);
  if (allBuildings.length > 0) {
    const configuredLamps = townConfig.getBuildings().filter((b) => b.kind === 'lamp' && !b.hidden);
    for (const lp of configuredLamps) {
      if (lp.subType === 'stone_lantern') {
        drawStoneLantern(ctx, lp.x * TILE_SIZE, lp.y * TILE_SIZE);
      } else if (lp.subType === 'lamp_cyber') {
        drawCyberLamp(ctx, lp.x * TILE_SIZE, lp.y * TILE_SIZE);
      } else {
        drawSingleStreetLamp(ctx, lp.x * TILE_SIZE, lp.y * TILE_SIZE);
      }
    }
  } else {
    // Default fallback lamp positions (Note: { x: 24, y: 20 } removed so no lamp invades Battle Arena!)
    const defaultLampPositions = [
      // Manor Courtyard
      { x: 12, y: 14 },
      { x: 20, y: 14 },
      { x: 12, y: 18 },
      { x: 20, y: 18 },

      // Central Boulevard Symmetrical Colonnade
      { x: 19, y: 20 },
      { x: 19, y: 26 },
      { x: 24, y: 26 },
      { x: 19, y: 34 },
      { x: 19, y: 42 },
      { x: 24, y: 42 },
      { x: 19, y: 50 },
      { x: 25, y: 50 },
      { x: 19, y: 56 },
      { x: 25, y: 56 },
      { x: 31, y: 49 },
      { x: 31, y: 54 },
      { x: 42, y: 49 },
      { x: 42, y: 54 },

      // West Promenade & Tech Tower Corporate Plaza
      { x: 10, y: 28 },
      { x: 11, y: 35 },
      { x: 9, y: 44 },
      { x: 14, y: 44 },
      { x: 9, y: 52 },
      { x: 15, y: 52 },

      // Grand Civic Plaza & Arcade Promenade
      { x: 25, y: 29 },
      { x: 25, y: 44 },

      // Unbroken East Promenade (X: 34..35, Y: 6..54)
      { x: 34, y: 8 },
      { x: 34, y: 16 },
      { x: 34, y: 26 },
      { x: 34, y: 35 },
      { x: 34, y: 44 },

      // West Seaside Boardwalk & Rest Plaza
      { x: 5, y: 28 },
      { x: 5, y: 35 },
      { x: 5, y: 42 },
      { x: 10, y: 34 },

      // South Promenade & Café Terrace
      { x: 38, y: 49 },
      { x: 38, y: 55 },
      { x: 25, y: 48 },
      { x: 33, y: 48 },
      { x: 25, y: 55 },
      { x: 33, y: 55 },
    ];
    for (const lp of defaultLampPositions) {
      drawSingleStreetLamp(ctx, lp.x * TILE_SIZE, lp.y * TILE_SIZE);
    }
  }
}

function drawSingleStreetLamp(ctx: CanvasRenderingContext2D, lx: number, ly: number) {
  // Ground glow and post shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.fillRect(lx + 8, ly + 14, 4, 2);

  // Cast-iron pole
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(lx + 7, ly + 5, 2, 11);
  ctx.fillRect(lx + 6, ly + 14, 4, 2);

  // Lantern fixture
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(lx + 5, ly, 6, 2);
  ctx.fillRect(lx + 5, ly + 5, 6, 1);

  // Warm luminescent core
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(lx + 6, ly + 2, 4, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(lx + 7, ly + 2, 2, 2);
}

function drawParkBench(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  orientation: 'N' | 'E' | 'S' | 'W' = 'N',
  w = 2,
  h = 1
) {
  const isVertical = orientation === 'E' || orientation === 'W' || (w === 1 && h === 2);
  if (isVertical) {
    // Vertical bench (1x2 tiles = 16x32px)
    const px = bx + 2;
    const py = by + 4;
    // Shadow
    ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
    ctx.fillRect(px + 1, py + 21, 10, 4);

    // Cast iron legs / crossbeams
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 1, py + 3, 10, 3);
    ctx.fillRect(px + 1, py + 17, 10, 3);

    // Polished teak wood slats (vertical)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 1, py, 3, 22);
    ctx.fillRect(px + 8, py, 3, 22);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px + 4, py, 3, 22);
  } else {
    // Shadow
    ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
    ctx.fillRect(bx - 10, by + 10, 22, 3);

    // Cast iron legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx - 8, by + 4, 3, 8);
    ctx.fillRect(bx + 6, by + 4, 3, 8);

    // Polished teak wood slats
    ctx.fillStyle = '#b45309';
    ctx.fillRect(bx - 10, by, 22, 4);
    ctx.fillRect(bx - 10, by + 6, 22, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx - 10, by + 4, 22, 1);
  }
}

function drawArcadeVendingMachine(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.fillRect(px + 2, py + 26, 20, 4);

  // Machine body (Retro red Pokémon Vending Machine)
  ctx.fillStyle = '#dc2626'; // Poké red
  ctx.fillRect(px, py, 20, 28);
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1;
  ctx.strokeRect(px, py, 20, 28);

  // Top header illuminated panel
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 2, py + 2, 16, 5);
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DRINKS', px + 10, py + 6);

  // Drink display window with 3 glowing bottle slots (Water, Soda, Lemonade)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 2, py + 8, 16, 9);
  // Blue bottle (Fresh Water)
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 4, py + 9, 3, 5);
  // Green bottle (Soda Pop)
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 8.5, py + 9, 3, 5);
  // Yellow bottle (Lemonade)
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 13, py + 9, 3, 5);

  // Coin insert & buttons
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(px + 2, py + 18, 16, 3);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 14, py + 18, 2, 3); // coin slot

  // Dispenser tray flap
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 22, 12, 4);
}

function drawHarborTelescope(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 4, py + 16, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy steel pedestal base
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 1, py + 13, 6, 4);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 2, py + 6, 4, 8);

  // Coin box
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 1, py + 8, 3, 4);

  // Polished brass swivel mount & telescope barrel (pointing west toward ocean)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px, py + 3, 6, 4);
  // Telescope barrel angled west (pointing left)
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px - 5, py + 1, 10, 4);
  // Lens hood
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px - 7, py, 3, 6);
  // Glass lens (facing sea)
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(px - 7, py + 1, 1, 4);
  // Eyepiece
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 5, py + 2, 2, 2);
}

// ==========================================
// 5. EAST QUARTER & LOOKOUT CREATIVE DISTRICTS
// ==========================================
function renderScenicLookoutTerrace(ctx: CanvasRenderingContext2D) {
  // Paved Observation Terrace at North-East Summit (X: 36..42, Y: 2..7)
  const tx = 36 * TILE_SIZE;
  const ty = 2 * TILE_SIZE;
  const tw = 7 * TILE_SIZE;
  const th = 6 * TILE_SIZE;

  // Terrace base stone pavers (light granite flagstones)
  for (let y = 2; y <= 7; y++) {
    for (let x = 36; x <= 42; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isAlt = (x + y) % 2 === 0;
      ctx.fillStyle = isAlt ? '#e2e8f0' : '#cbd5e1';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px, py, TILE_SIZE, 1);
      ctx.fillRect(px, py, 1, TILE_SIZE);
    }
  }

  // Stone border trim around terrace (North, East, West)
  ctx.fillStyle = '#64748b';
  ctx.fillRect(tx, ty, tw, 2);
  ctx.fillRect(tx, ty, 2, th);
  ctx.fillRect(tx + tw - 2, ty, 2, th);
}

function drawLookoutPlaque(ctx: CanvasRenderingContext2D) {
  // If the user has overridden or erased the tile at (39, 5), do not draw the plaque!
  if (townConfig.getTileOverride(39, 5) !== undefined) return;

  // Check if telescope is still at its original lookout spot (x: 37, y: 3)
  const telescope = townConfig.getBuilding('telescope');
  if (!telescope || telescope.hidden || telescope.x !== 37 || telescope.y !== 3) {
    return;
  }

  // Vista direction marker plaque in the center floor (39, 5)
  ctx.fillStyle = '#475569';
  ctx.fillRect(39 * TILE_SIZE + 2, 5 * TILE_SIZE + 2, 12, 12);
  ctx.fillStyle = '#f59e0b';
  // Compass rose / star
  ctx.fillRect(39 * TILE_SIZE + 7, 5 * TILE_SIZE + 4, 2, 8);
  ctx.fillRect(39 * TILE_SIZE + 4, 5 * TILE_SIZE + 7, 8, 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(39 * TILE_SIZE + 6, 5 * TILE_SIZE + 6, 4, 4);
}

function drawNorthFacingTelescope(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 4, py + 12, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Steel tripod base
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 1, py + 8, 6, 3);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 2, py + 3, 4, 6);

  // Swivel mount
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 1, py + 1, 6, 3);

  // Telescope barrel pointing North/Upward
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 2, py - 5, 4, 7);
  // Lens hood flared at top
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 1, py - 7, 6, 2);
  // Cyan glass lens pointing north towards horizon
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(px + 2, py - 7, 4, 1);
  // Eyepiece at bottom
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 3, py + 4, 2, 2);
}

function renderTrainingField(ctx: CanvasRenderingContext2D) {
  const arena = townConfig.getBuilding('arena');
  if (arena?.hidden) return;
  const ax = (arena ? arena.x : 24) * TILE_SIZE;
  const ay = (arena ? arena.y : 16) * TILE_SIZE;
  const aw = (arena ? arena.w : 10) * TILE_SIZE;
  const ah = (arena ? arena.h : 9) * TILE_SIZE;

  // Clay / Sand ground base
  ctx.fillStyle = '#dfb48c';
  ctx.fillRect(ax, ay, aw, ah);

  // Stippled sand grain texture
  ctx.fillStyle = '#cca078';
  for (let dy = 2; dy < ah - 2; dy += 4) {
    for (let dx = 2; dx < aw - 2; dx += 4) {
      if ((dx * 3 + dy * 7) % 5 === 0) {
        ctx.fillRect(ax + dx, ay + dy, 2, 1);
      }
    }
  }

  // Arena curb border
  ctx.fillStyle = '#785338';
  ctx.strokeRect(ax + 0.5, ay + 0.5, aw - 1, ah - 1);

  // Bold & Crisp White Regulation Boundary Lines (2px thick, inset 5px from curb!)
  const inset = 5;
  ctx.fillStyle = '#ffffff';
  // Top regulation line
  ctx.fillRect(ax + inset, ay + inset, aw - inset * 2, 2);
  // Bottom regulation line
  ctx.fillRect(ax + inset, ay + ah - inset - 2, aw - inset * 2, 2);
  // Left regulation line
  ctx.fillRect(ax + inset, ay + inset, 2, ah - inset * 2);
  // Right regulation line
  ctx.fillRect(ax + aw - inset - 2, ay + inset, 2, ah - inset * 2);

  // Center dividing line (2px thick)
  const midY = ay + Math.floor(ah / 2);
  ctx.fillRect(ax + inset, midY - 1, aw - inset * 2, 2);

  // Center Poké Ball Emblem
  const centerX = ax + Math.floor(aw / 2);
  const radius = 10;

  // Outer dark ring
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(centerX, midY, radius + 1, 0, Math.PI * 2);
  ctx.fill();

  // Top half: Red
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(centerX, midY, radius, Math.PI, 0);
  ctx.fill();

  // Bottom half: White
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(centerX, midY, radius, 0, Math.PI);
  ctx.fill();

  // Center black horizontal line
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(centerX - radius, midY - 1, radius * 2, 2);

  // Center button: black ring + white circle
  ctx.beginPath();
  ctx.arc(centerX, midY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(centerX, midY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // North Player Standing Pad (Blue) - Ace Trainer Ray stands here
  const padW = 20;
  const padH = 8;
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(centerX - padW / 2 - 1, ay + 10 - 1, padW + 2, padH + 2);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(centerX - padW / 2, ay + 10, padW, padH);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(centerX - padW / 2 + 1, ay + 11, padW - 2, 1);

  // South Player Standing Pad (Red) - Challenger standing pad
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(centerX - padW / 2 - 1, ay + ah - 18 - 1, padW + 2, padH + 2);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(centerX - padW / 2, ay + ah - 18, padW, padH);
  ctx.fillStyle = '#f87171';
  ctx.fillRect(centerX - padW / 2 + 1, ay + ah - 17, padW - 2, 1);

  // Corner Stadium Pylons with glow tops
  const corners = [
    { x: ax + 1, y: ay + 1 },
    { x: ax + aw - 5, y: ay + 1 },
    { x: ax + 1, y: ay + ah - 5 },
    { x: ax + aw - 5, y: ay + ah - 5 },
  ];
  for (const c of corners) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(c.x, c.y + 1, 4, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(c.x + 1, c.y, 2, 2);
  }
}

function renderBerryGardenGround(ctx: CanvasRenderingContext2D) {
  const garden = townConfig.getBuilding('garden') || townConfig.getBuilding('berry');
  if (garden?.hidden) return;
  const bx = (garden ? garden.x : 36) * TILE_SIZE;
  const by = (garden ? garden.y : 17) * TILE_SIZE;
  const bw = (garden ? garden.w : 7) * TILE_SIZE;
  const bh = (garden ? garden.h : 9) * TILE_SIZE;

  // 1. Dressed Sandstone Garden Retaining Wall Rim
  ctx.fillStyle = '#bfae9c';
  ctx.fillRect(bx + 2, by + 4, bw - 4, bh - 8);
  ctx.fillStyle = '#786852';
  ctx.fillRect(bx + 3, by + 5, bw - 6, bh - 10);

  // 2. Rich Warm Tilled Botanical Garden Loam (Zero dark voids!)
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(bx + 4, by + 6, bw - 8, bh - 12);

  // Warm tilled soil furrows with moisture depth
  for (let y = by + 9; y < by + bh - 9; y += 8) {
    ctx.fillStyle = '#5c3315';
    ctx.fillRect(bx + 5, y, bw - 10, 1);
    ctx.fillStyle = '#a16207';
    ctx.fillRect(bx + 5, y + 1, bw - 10, 1);
  }

  // Sprouting green berry runners and seedlings
  for (let x = bx + 6; x < bx + bw - 14; x += 10) {
    for (let y = by + 10; y < by + bh - 12; y += 8) {
      if ((x * 5 + y * 11) % 3 === 0) {
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(x, y, 3, 2);
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(x + 1, y - 1, 2, 2);
      }
    }
  }

  // 3. Flagstone Garden Stepping Path (from entrance on left at bx, by + 4 tiles)
  for (let dx = 0; dx <= 28; dx += 14) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx + dx, by + 4 * TILE_SIZE + 4, 12, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + dx, by + 4 * TILE_SIZE + 11, 12, 1);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx + dx, by + 4 * TILE_SIZE + 4, 12, 1);
  }
}

function renderBerryGardenFoliage(ctx: CanvasRenderingContext2D) {
  const garden = townConfig.getBuilding('garden') || townConfig.getBuilding('berry');
  if (garden?.hidden) return;
  const bx = (garden ? garden.x : 36) * TILE_SIZE;
  const by = (garden ? garden.y : 17) * TILE_SIZE;
  const bw = (garden ? garden.w : 7) * TILE_SIZE;
  const bh = (garden ? garden.h : 9) * TILE_SIZE;

  // 1. Majestic East Sakura Cherry Tree in Botanical Grove
  const sakura = townConfig.getBuilding('tree_sakura');
  if (!sakura || sakura.hidden) {
    drawSakuraCherryTree(ctx, bx + 3 * TILE_SIZE - 4, by + 1.5 * TILE_SIZE);
  }

  // 2. Flower planter borders framing top and bottom
  drawFlowerBed(ctx, bx + 2, by + 4, bw - 4, 12);
  drawFlowerBed(ctx, bx + 2, by + bh - 16, bw - 4, 12);

  // 3. Four Master Artisan Ceramic Berry Planters in 2x2 symmetrical grid
  // (bx + 2, by + 5), (bx + 5, by + 5), (bx + 2, by + 7), (bx + 5, by + 7)
  // 1. Oran Berry Pot (Blue - Restores HP)
  drawBerryPot(ctx, bx + 2 * TILE_SIZE + 2, by + 5 * TILE_SIZE + 2, '#3b82f6', '#1d4ed8');
  // 2. Sitrus Berry Pot (Yellow - Restores 25% HP)
  drawBerryPot(ctx, bx + 5 * TILE_SIZE + 2, by + 5 * TILE_SIZE + 2, '#eab308', '#ca8a04');
  // 3. Cheri Berry Pot (Red - Cures Paralysis)
  drawBerryPot(ctx, bx + 2 * TILE_SIZE + 2, by + 7 * TILE_SIZE + 2, '#ef4444', '#b91c1c');
  // 4. Pecha Berry Pot (Pink - Cures Poison)
  drawBerryPot(ctx, bx + 5 * TILE_SIZE + 2, by + 7 * TILE_SIZE + 2, '#ec4899', '#be185d');
}

function drawBerryPot(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  berryColor: string,
  berryDark: string
) {
  // Shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 6, py + 12, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Terracotta pot
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(px + 2, py + 6, 8, 7);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(px + 1, py + 5, 10, 2); // Rim
  ctx.fillRect(px + 3, py + 7, 6, 5);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 3, py + 7, 2, 5); // Highlight
  ctx.fillStyle = '#2e1c10';
  ctx.fillRect(px + 2, py + 5, 8, 1); // Pot soil inside rim

  // Berry Shrub Foliage
  ctx.fillStyle = '#166534';
  ctx.fillRect(px, py, 12, 6);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 1, py - 1, 10, 5);
  ctx.fillStyle = '#86efac';
  ctx.fillRect(px + 2, py - 2, 8, 2);

  // Berries clusters (3-4 pixel berries)
  ctx.fillStyle = berryDark;
  ctx.fillRect(px + 2, py + 1, 3, 3);
  ctx.fillRect(px + 7, py + 2, 3, 3);
  ctx.fillRect(px + 4, py - 1, 3, 3);

  ctx.fillStyle = berryColor;
  ctx.fillRect(px + 2, py + 1, 2, 2);
  ctx.fillRect(px + 7, py + 2, 2, 2);
  ctx.fillRect(px + 4, py - 1, 2, 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 2, py + 1, 1, 1);
  ctx.fillRect(px + 7, py + 2, 1, 1);
  ctx.fillRect(px + 4, py - 1, 1, 1);
}

function drawSakuraCherryTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Ground Shadow (oval on ground)
  ctx.fillStyle = 'rgba(20, 50, 15, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 24, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Warm trunk with root flare
  ctx.fillStyle = '#3a2010'; // Shadow bark
  ctx.fillRect(x + 9, y + 16, 6, 9);
  ctx.fillRect(x + 8, y + 22, 8, 3); // Root base
  ctx.fillStyle = '#5c381f'; // Mid bark
  ctx.fillRect(x + 9, y + 16, 4, 9);
  ctx.fillRect(x + 8, y + 22, 5, 2);
  ctx.fillStyle = '#784c2a'; // Sunlit bark ridge
  ctx.fillRect(x + 9, y + 17, 2, 8);

  // --- Sakura Blossom Canopy Multi-Lobed Sphere ---
  // 1. Deep Outline & Underbelly Shadow (Deep plum / berry)
  ctx.fillStyle = '#831843';
  ctx.fillRect(x + 4, y + 1, 16, 19);
  ctx.fillRect(x + 2, y + 4, 20, 14);
  ctx.fillRect(x + 1, y + 6, 22, 10);
  ctx.fillRect(x, y + 8, 24, 6);

  // 2. Primary Sakura Pink Body
  ctx.fillStyle = '#db2777';
  ctx.fillRect(x + 4, y + 2, 15, 17);
  ctx.fillRect(x + 2, y + 5, 19, 12);
  ctx.fillRect(x + 1, y + 7, 21, 8);

  // 3. Lower Shaded Clump (Bottom-Right Sphere)
  ctx.fillStyle = '#be185d';
  ctx.fillRect(x + 11, y + 11, 10, 7);
  ctx.fillRect(x + 13, y + 9, 8, 8);
  ctx.fillRect(x + 10, y + 14, 8, 4);

  // 4. Mid-Tone Blossom Pink Clumps (Center & Left)
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(x + 3, y + 4, 14, 12);
  ctx.fillRect(x + 5, y + 2, 12, 13);
  ctx.fillRect(x + 8, y + 5, 10, 8);
  ctx.fillRect(x + 2, y + 8, 8, 7);

  // 5. Sunlit Petals (Top-Left & Crown Lobes - light soft pink & white)
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(x + 4, y + 3, 9, 8);
  ctx.fillStyle = '#fdf2f8';
  ctx.fillRect(x + 5, y + 2, 6, 3);
  ctx.fillRect(x + 8, y + 4, 3, 2);

  // 6. Falling cherry blossom petals floating gently around tree base
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(x + 2, y + 22, 2, 1);
  ctx.fillRect(x + 21, y + 20, 2, 1);
  ctx.fillRect(x + 18, y + 25, 2, 1);
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(x - 2, y + 18, 1, 1);
  ctx.fillRect(x + 24, y + 16, 1, 1);
}

function renderContestStageGround(ctx: CanvasRenderingContext2D) {
  const contest = townConfig.getBuilding('contest');
  if (!contest || contest.hidden) return;
  const cx = contest.x * TILE_SIZE;
  const cy = contest.y * TILE_SIZE;
  const cw = contest.w * TILE_SIZE;

  // Polished Stage Wood Decking (Y: cy..cy + 4.5 tiles)
  const stageH = 4.5 * TILE_SIZE;
  // Stage Drop Shadow & Elevated Riser Step
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(cx - 3, cy + stageH + 2, cw + 6, 4);

  // Outer polished mahogany stage border
  ctx.fillStyle = '#451a03';
  ctx.fillRect(cx - 2, cy - 1, cw + 4, stageH + 3);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 1, cy, cw + 2, stageH + 1);

  // Horizontal polished wood floorboards
  for (let dy = 0; dy < stageH; dy += 4) {
    const isAlt = (dy / 4) % 2 === 0;
    ctx.fillStyle = isAlt ? '#b45309' : '#d97706';
    ctx.fillRect(cx + 1, cy + dy + 1, cw - 2, 3);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx + 1, cy + dy + 3, cw - 2, 1); // Plank groove
  }

  // Brass corner protector caps
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx - 1, cy, 3, 3);
  ctx.fillRect(cx + cw - 2, cy, 3, 3);
  ctx.fillRect(cx - 1, cy + stageH - 2, 3, 3);
  ctx.fillRect(cx + cw - 2, cy + stageH - 2, 3, 3);

  // Red Runner Carpet down center (centered on stage: cx + 2 tiles)
  const carpetX = cx + 2 * TILE_SIZE;
  const carpetW = 3 * TILE_SIZE;
  ctx.fillStyle = '#7f1d1d'; // Deep shadow border
  ctx.fillRect(carpetX - 1, cy, carpetW + 2, stageH);
  ctx.fillStyle = '#dc2626'; // Vivid red velvet
  ctx.fillRect(carpetX, cy, carpetW, stageH);
  // Gold braided trim on runner edges
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(carpetX, cy, 1, stageH);
  ctx.fillRect(carpetX + carpetW - 1, cy, 1, stageH);
  // Gold embroidery fleur patterns along runner edges
  for (let ey = cy + 6; ey < cy + stageH - 4; ey += 10) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(carpetX + 2, ey, 2, 2);
    ctx.fillRect(carpetX + carpetW - 4, ey, 2, 2);
  }

  // Stage Footlights (sparkling spotlights along front lip at cy + stageH - 2)
  const lipY = cy + stageH - 2;
  const lightColors = ['#f43f5e', '#06b6d4', '#eab308', '#a855f7', '#10b981', '#f97316', '#38bdf8'];
  for (let i = 0; i < 7; i++) {
    const lx = cx + 8 + i * 14;
    // Fixture base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx - 2, lipY - 1, 5, 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(lx - 1, lipY, 3, 2);
    // Glowing lamp jewel
    ctx.fillStyle = lightColors[i % lightColors.length];
    ctx.fillRect(lx, lipY, 2, 2);
    // Upward beam aura
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(lx, lipY - 3, 2, 3);
  }
}

function renderContestProps(ctx: CanvasRenderingContext2D) {
  const contest = townConfig.getBuilding('contest');
  if (!contest || contest.hidden) return;

  const cx = contest.x * TILE_SIZE;
  const cy = contest.y * TILE_SIZE;
  const cw = contest.w * TILE_SIZE;

  // 1. Festive Pokémon Contest Stage Drapery Backdrop / Canopy Arch
  // Left Gilded Pillar
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx + 2, cy - 2, 6, 26);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx + 3, cy - 1, 4, 24);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx + 1, cy - 4, 8, 3); // Capital
  ctx.fillRect(cx + 1, cy + 22, 8, 3); // Base

  // Right Gilded Pillar
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx + cw - 8, cy - 2, 6, 26);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx + cw - 7, cy - 1, 4, 24);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx + cw - 9, cy - 4, 8, 3); // Capital
  ctx.fillRect(cx + cw - 9, cy + 22, 8, 3); // Base

  // Velvet Scalloped Arch Valance across back of stage
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(cx + 8, cy - 3, cw - 16, 12);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx + 9, cy - 2, cw - 18, 9);
  // Gold bullion fringe along bottom of valance
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx + 8, cy + 8, cw - 16, 2);
  for (let fx = cx + 10; fx < cx + cw - 10; fx += 5) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(fx, cy + 9, 2, 2);
  }

  // Grand Contest Star Medallion in center of valance
  const midX = cx + cw / 2;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(midX, cy + 3, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(midX, cy + 3, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444'; // Ruby center jewel
  ctx.fillRect(midX - 1.5, cy + 1.5, 3, 3);

  // 2. Center Gold Star Podium & Vintage Chrome Microphone
  const pod = townConfig.getBuilding('podium');
  const podX = pod ? pod.x * TILE_SIZE : (contest.x + 3) * TILE_SIZE - 2;
  const podY = pod ? pod.y * TILE_SIZE : (contest.y + 2) * TILE_SIZE;

  // Podium base shadow
  ctx.fillStyle = 'rgba(20, 25, 20, 0.45)';
  ctx.fillRect(podX - 3, podY + 12, 22, 4);
  // Tiered gold pedestal
  ctx.fillStyle = '#b45309';
  ctx.fillRect(podX - 1, podY + 6, 18, 7);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(podX, podY + 7, 16, 5);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(podX + 1, podY + 7, 14, 2); // Highlight
  // Star emblem on podium front
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(podX + 7, podY + 8, 2, 3);
  ctx.fillRect(podX + 6, podY + 9, 4, 1);

  // Vintage Stage Chrome Microphone
  const micX = podX + 8;
  const micY = podY + 3;
  ctx.fillStyle = '#64748b';
  ctx.fillRect(micX - 0.5, micY - 7, 1, 8); // Stand pole
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(micX - 1.5, micY - 10, 3, 3); // Chrome mic head
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(micX - 0.5, micY - 9, 1, 1); // Blue indicator light

  // 3. Symmetrical Amphitheater Audience Benches (facing stage)
  drawParkBench(ctx, cx + 1.2 * TILE_SIZE, cy + 5.5 * TILE_SIZE);
  drawParkBench(ctx, cx + 4.2 * TILE_SIZE, cy + 5.5 * TILE_SIZE);
}

function renderRangerCampGround(ctx: CanvasRenderingContext2D) {
  // Ranger Camp & Rest Area Clearing (X: 36..42, Y: 38..45)
  const rx = 36 * TILE_SIZE;
  const ry = 38 * TILE_SIZE;
  const rw = 7 * TILE_SIZE;
  const rh = 7.5 * TILE_SIZE;

  // Soft, organic woodland clearing floor (curved natural clearing)
  ctx.fillStyle = 'rgba(20, 25, 20, 0.25)';
  ctx.beginPath();
  ctx.roundRect(rx + 4, ry + 2, rw - 6, rh - 4, 12);
  ctx.fill();

  ctx.fillStyle = '#78350f'; // Warm pine needle forest floor
  ctx.beginPath();
  ctx.roundRect(rx + 5, ry + 3, rw - 8, rh - 6, 10);
  ctx.fill();

  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(rx + 7, ry + 5, rw - 12, rh - 10, 8);
  ctx.fill();

  // Organic grass tufts and woodland texture
  ctx.fillStyle = '#529930';
  for (let i = 0; i < 8; i++) {
    const gx = rx + 8 + ((i * 17) % Math.floor(rw - 16));
    const gy = ry + 6 + ((i * 13) % Math.floor(rh - 12));
    ctx.fillRect(gx, gy, 2, 2);
    ctx.fillStyle = '#67b346';
    ctx.fillRect(gx + 1, gy - 1, 1, 2);
    ctx.fillStyle = '#529930';
  }
}

function renderRangerShelter(ctx: CanvasRenderingContext2D) {
  const shelter = townConfig.getBuilding('camp');
  if (!shelter || shelter.hidden) return;
  const kx = shelter.x * TILE_SIZE;
  const ky = shelter.y * TILE_SIZE;
  const kw = 3.5 * TILE_SIZE;
  // Wooden support posts
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(kx + 2, ky + 4, 2, 14);
  ctx.fillRect(kx + kw - 4, ky + 4, 2, 14);
  // Forest Ranger Green Canopy (angled striped awning)
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(kx, ky, kw, 8);
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(kx + 1, ky + 1, kw - 2, 4);
  // Khaki accent stripe
  ctx.fillStyle = '#d4c79e';
  ctx.fillRect(kx + 4, ky + 1, 4, 6);
  ctx.fillRect(kx + 16, ky + 1, 4, 6);
  ctx.fillRect(kx + 28, ky + 1, 4, 6);
  // Scalloped bottom fringe
  ctx.fillStyle = '#1b4332';
  for (let fx = 0; fx < kw; fx += 4) {
    ctx.fillRect(kx + fx, ky + 8, 3, 2);
  }
}

function renderRangerCampfireAndBenches(ctx: CanvasRenderingContext2D) {
  const cf = townConfig.getBuilding('campfire');
  if (!cf || cf.hidden) return;
  const fireX = cf.x * TILE_SIZE + 4;
  const fireY = cf.y * TILE_SIZE + 2;

  // Ground soot & ash
  ctx.fillStyle = 'rgba(20, 20, 20, 0.45)';
  ctx.beginPath();
  ctx.ellipse(fireX + 4, fireY + 4, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Natural stone ring (8 stones)
  const stoneColors = ['#64748b', '#475569', '#94a3b8', '#334155'];
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI * 2) / 8;
    const sx = fireX + 4 + Math.cos(angle) * 7 - 2;
    const sy = fireY + 4 + Math.sin(angle) * 4 - 2;
    ctx.fillStyle = stoneColors[a % 4];
    ctx.fillRect(sx, sy, 4, 3);
  }

  // Crossed burning logs in center
  ctx.fillStyle = '#451a03';
  ctx.fillRect(fireX + 1, fireY + 3, 7, 2);
  ctx.fillRect(fireX + 3, fireY + 1, 2, 7);

  // Cozy campfire flame & embers
  ctx.fillStyle = '#ea580c'; // Red-orange base
  ctx.fillRect(fireX + 2, fireY + 2, 5, 4);
  ctx.fillStyle = '#f97316'; // Vivid orange core
  ctx.fillRect(fireX + 3, fireY + 1, 3, 4);
  ctx.fillStyle = '#fef08a'; // Golden-white hot tip
  ctx.fillRect(fireX + 4, fireY, 1, 3);

  // Split-Log Benches around campfire
  drawLogBench(ctx, fireX - 10, fireY + 9, 16, true);  // South bench
  drawLogBench(ctx, fireX + 14, fireY - 2, 14, false); // East bench
}

function renderDevCafeBaristaKiosk(ctx: CanvasRenderingContext2D) {
  const kiosk = townConfig.getBuilding('kiosk');
  if (!kiosk || kiosk.hidden) return;
  ctx.save();
  const kx = kiosk.x * TILE_SIZE;
  const ky = kiosk.y * TILE_SIZE;
  const kw = 4.5 * TILE_SIZE;
  const kh = 3.5 * TILE_SIZE;

  // 1. Drop shadow under kiosk
  ctx.fillStyle = 'rgba(20, 25, 20, 0.4)';
  ctx.fillRect(kx - 2, ky + kh - 4, kw + 4, 8);

  // 2. Warm Cedar Timber Wall Body
  ctx.fillStyle = '#451a03';
  ctx.fillRect(kx, ky + 12, kw, kh - 12);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(kx + 1, ky + 13, kw - 2, kh - 14);

  // Staggered vertical timber siding planks
  ctx.fillStyle = '#92400e';
  for (let px = kx + 4; px < kx + kw - 4; px += 8) {
    ctx.fillRect(px, ky + 14, 6, kh - 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 1, ky + 14, 2, kh - 16);
    ctx.fillStyle = '#92400e';
  }

  // 3. Polished Oak Service Counter
  const cy = ky + 30;
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(kx + 2, cy + 8, kw - 4, 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(kx + 1, cy, kw - 2, 8);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(kx + 1, cy, kw - 2, 2);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(kx + 2, cy + 1, kw - 4, 1);

  // 4. Equipment on Counter
  // Chrome & Brass Espresso Machine (Left)
  const emX = kx + 8;
  const emY = cy - 10;
  ctx.fillStyle = '#334155';
  ctx.fillRect(emX, emY, 12, 10);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(emX + 1, emY + 1, 10, 8);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(emX + 2, emY + 1, 3, 7);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(emX + 7, emY + 3, 2, 2);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(emX + 7, emY + 6, 2, 2);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(emX + 11, emY + 5, 3, 2);

  // Glass Display Cloche with Pastries / Castelia Cones (Right)
  const dcX = kx + kw - 20;
  const dcY = cy - 9;
  ctx.fillStyle = 'rgba(200, 240, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(dcX + 6, dcY + 4, 6, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(dcX + 3, dcY + 5, 2, 3);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(dcX + 6, dcY + 4, 2, 4);

  // 5. Scalloped Striped Awning Canopy (Mocha / Terracotta & Cream stripes)
  const ay = ky;
  const aw = kw + 8;
  const ax = kx - 4;
  const ah = 18;

  ctx.fillStyle = 'rgba(25, 20, 15, 0.35)';
  ctx.fillRect(ax - 1, ay + ah - 2, aw + 2, 4);

  const stripeW = 8;
  for (let sx = 0; sx < aw; sx += stripeW) {
    const isCream = (sx / stripeW) % 2 === 1;
    ctx.fillStyle = isCream ? '#fef3c7' : '#9a3412';
    ctx.fillRect(ax + sx, ay, stripeW, ah);
    ctx.fillStyle = isCream ? '#ffffff' : '#b45309';
    ctx.fillRect(ax + sx, ay, stripeW, 3);
    ctx.fillStyle = isCream ? '#fde68a' : '#78350f';
    ctx.fillRect(ax + sx, ay + ah - 3, stripeW, 3);
  }

  // Scalloped decorative fringe valance at awning edge
  for (let sx = 0; sx < aw; sx += 8) {
    const isCream = (sx / 8) % 2 === 1;
    ctx.fillStyle = isCream ? '#fef3c7' : '#9a3412';
    ctx.beginPath();
    ctx.arc(ax + sx + 4, ay + ah, 4, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = isCream ? '#fde68a' : '#78350f';
    ctx.fillRect(ax + sx + 3, ay + ah + 2, 2, 2);
  }

  // 6. Hanging Warm Glowing Lantern under awning center
  const lx = kx + kw / 2;
  const ly = ay + ah + 3;
  ctx.fillStyle = '#475569';
  ctx.fillRect(lx - 0.5, ay + ah, 1, 4);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(lx, ly + 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // 7. Chalkboard Menu Easel beside counter
  const mx = kx - 0.8 * TILE_SIZE;
  const my = ky + kh - 1.5 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(mx + 1, my, 2, 16);
  ctx.fillRect(mx + 11, my, 2, 16);
  ctx.fillRect(mx + 6, my - 2, 2, 4);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(mx + 2, my + 2, 10, 11);
  ctx.strokeStyle = '#92400e';
  ctx.strokeRect(mx + 1.5, my + 1.5, 11, 12);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(mx + 4, my + 4, 6, 1);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(mx + 4, my + 7, 5, 1);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(mx + 4, my + 10, 4, 1);

  // 8. Flanking Planter Box at East side of Kiosk
  drawFlowerBed(ctx, kx + kw + 0.1 * TILE_SIZE, ky + kh - 1.8 * TILE_SIZE, 1.8 * TILE_SIZE, 1.5 * TILE_SIZE);

  ctx.restore();
}

function renderCyclingLaneGraphics(ctx: CanvasRenderingContext2D) {
  // Raised stone dividing curbs framing both sides of the cycling track
  for (let y = 27; y <= 42; y++) {
    const py = y * TILE_SIZE;
    // Left curb (separating bike lane from western fence)
    ctx.fillStyle = '#71717a';
    ctx.fillRect(3 * TILE_SIZE, py, 1, TILE_SIZE);
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(3 * TILE_SIZE + 1, py, 1, TILE_SIZE);
    // Right curb (separating bike lane from pedestrian promenade)
    ctx.fillStyle = '#b8aa97';
    ctx.fillRect(5 * TILE_SIZE - 2, py, 2, TILE_SIZE);
    ctx.fillStyle = '#ede4d4';
    ctx.fillRect(5 * TILE_SIZE - 2, py, 1, TILE_SIZE);
    ctx.fillStyle = '#827464';
    ctx.fillRect(5 * TILE_SIZE - 1, py, 1, TILE_SIZE);
  }

  // Crisp white dashed lane divider along X: 4
  for (let y = 27; y <= 42; y += 2) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4 * TILE_SIZE - 1, y * TILE_SIZE + 4, 2, 8);
  }

  // White bike icon stenciled at Y: 29 and Y: 40 on lane (unobscured!)
  drawBikeStencil(ctx, 3.5 * TILE_SIZE, 29 * TILE_SIZE);
  drawBikeStencil(ctx, 3.5 * TILE_SIZE, 40 * TILE_SIZE);
}

function renderWestSeasideGazebo(ctx: CanvasRenderingContext2D) {
  const gazebo = townConfig.getBuilding('gazebo');
  if (!gazebo || gazebo.hidden) return;
  const gx = gazebo.x * TILE_SIZE;
  const gy = gazebo.y * TILE_SIZE;
  const gw = 2.5 * TILE_SIZE;
  const gh = 2.5 * TILE_SIZE;

  // Pergola stone base platform
  ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
  ctx.fillRect(gx - 2, gy + gh - 4, gw + 4, 6);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(gx, gy, gw, gh);
  ctx.fillStyle = '#94a3b8';
  ctx.strokeRect(gx + 0.5, gy + 0.5, gw - 1, gh - 1);

  // Timber corner posts
  ctx.fillStyle = '#451a03';
  ctx.fillRect(gx + 2, gy + 2, 3, gh - 4);
  ctx.fillRect(gx + gw - 5, gy + 2, 3, gh - 4);

  // Slate-blue Pergola Shingle Roof
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(gx - 3, gy - 4, gw + 6, 8);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(gx - 2, gy - 3, gw + 4, 5);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(gx - 1, gy - 3, gw + 2, 1);

  // Notice board inside gazebo
  ctx.fillStyle = '#78350f';
  ctx.fillRect(gx + 8, gy + 6, 16, 12);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(gx + 9, gy + 7, 14, 10);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(gx + 11, gy + 9, 10, 1);
  ctx.fillRect(gx + 11, gy + 11, 8, 1);
  ctx.fillRect(gx + 11, gy + 13, 9, 1);
}

function drawBikeStencil(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  // Front wheel
  ctx.fillRect(px - 4, py + 4, 3, 3);
  // Rear wheel
  ctx.fillRect(px + 4, py + 4, 3, 3);
  // Frame
  ctx.fillRect(px - 2, py + 3, 6, 1);
  ctx.fillRect(px - 1, py + 1, 1, 3);
  // Handlebars
  ctx.fillRect(px - 3, py + 1, 3, 1);
}

function drawLogBench(ctx: CanvasRenderingContext2D, px: number, py: number, len: number, horizontal: boolean) {
  ctx.fillStyle = 'rgba(20, 25, 20, 0.35)';
  if (horizontal) {
    ctx.fillRect(px, py + 4, len, 2);
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(px, py, len, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px + 1, py + 1, len - 2, 2);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 2, py + 1, len - 4, 1);
  } else {
    ctx.fillRect(px + 3, py, 2, len);
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(px, py, 4, len);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px + 1, py + 1, 2, len - 2);
  }
}

// ==========================================
// EXPANDED 30 CUSTOM PIXEL-ART OBJECT RENDERERS
// ==========================================

export function drawPineTree(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 24, 12, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 28, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3e2723';
  ctx.fillRect(px + 12, py + 18, 8, 12);
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(px + 14, py + 18, 4, 11);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(px + 15, py + 20, 2, 7);

  // Bottom Tier
  ctx.fillStyle = '#0f3319';
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 2);
  ctx.lineTo(px + 31, py + 22);
  ctx.lineTo(px + 1, py + 22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#1b5229';
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 4);
  ctx.lineTo(px + 29, py + 21);
  ctx.lineTo(px + 3, py + 21);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2e7d3e';
  ctx.fillRect(px + 6, py + 16, 20, 3);
  ctx.fillStyle = '#52a865';
  ctx.fillRect(px + 10, py + 17, 12, 1);

  // Mid Tier
  ctx.fillStyle = '#143d1f';
  ctx.beginPath();
  ctx.moveTo(px + 16, py - 6);
  ctx.lineTo(px + 28, py + 12);
  ctx.lineTo(px + 4, py + 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#246b35';
  ctx.beginPath();
  ctx.moveTo(px + 16, py - 4);
  ctx.lineTo(px + 26, py + 11);
  ctx.lineTo(px + 6, py + 11);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#388e4c';
  ctx.fillRect(px + 9, py + 7, 14, 3);

  // Top Tier
  ctx.fillStyle = '#1b5229';
  ctx.beginPath();
  ctx.moveTo(px + 16, py - 15);
  ctx.lineTo(px + 24, py + 2);
  ctx.lineTo(px + 8, py + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2e7d3e';
  ctx.beginPath();
  ctx.moveTo(px + 16, py - 13);
  ctx.lineTo(px + 22, py + 1);
  ctx.lineTo(px + 10, py + 1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#81c784';
  ctx.fillRect(px + 15, py - 15, 2, 4);

  // Pinecone accents
  ctx.fillStyle = '#795548';
  ctx.fillRect(px + 7, py + 19, 3, 3);
  ctx.fillRect(px + 22, py + 19, 3, 3);
  ctx.fillRect(px + 11, py + 9, 2, 3);
  ctx.restore();
}

export function drawAutumnTree(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 24, 12, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 28, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#422006';
  ctx.fillRect(px + 12, py + 16, 8, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 14, py + 16, 4, 13);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(px + 15, py + 18, 2, 8);

  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(px + 16, py + 6, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.arc(px + 12, py + 4, 12, 0, Math.PI * 2);
  ctx.arc(px + 20, py + 4, 12, 0, Math.PI * 2);
  ctx.arc(px + 16, py - 2, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(px + 11, py + 1, 9, 0, Math.PI * 2);
  ctx.arc(px + 21, py + 1, 9, 0, Math.PI * 2);
  ctx.arc(px + 16, py - 4, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(px + 10, py - 2, 6, 0, Math.PI * 2);
  ctx.arc(px + 21, py - 2, 6, 0, Math.PI * 2);
  ctx.arc(px + 16, py - 7, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 15, py - 9, 3, 2);
  ctx.fillRect(px + 9, py - 4, 2, 2);
  ctx.fillRect(px + 21, py - 4, 2, 2);

  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 4, py + 27, 2, 2);
  ctx.fillRect(px + 27, py + 26, 2, 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px + 25, py + 29, 2, 1);
  ctx.fillRect(px + 7, py + 29, 2, 1);
  ctx.restore();
}

export function drawBerryTree(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 24, 12, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 28, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 12, py + 16, 8, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 14, py + 16, 4, 13);

  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.arc(px + 16, py + 6, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(px + 11, py + 3, 11, 0, Math.PI * 2);
  ctx.arc(px + 21, py + 3, 11, 0, Math.PI * 2);
  ctx.arc(px + 16, py - 3, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(px + 10, py, 6, 0, Math.PI * 2);
  ctx.arc(px + 21, py, 6, 0, Math.PI * 2);
  ctx.arc(px + 16, py - 6, 7, 0, Math.PI * 2);
  ctx.fill();

  const drawBerry = (bx: number, by: number, color: string, hi: string) => {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(bx + 1, by - 1, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(bx, by, 3, 3);
    ctx.fillStyle = hi;
    ctx.fillRect(bx + 1, by, 1, 1);
  };

  drawBerry(px + 6, py + 4, '#2563eb', '#93c5fd');
  drawBerry(px + 14, py + 11, '#2563eb', '#93c5fd');
  drawBerry(px + 23, py + 6, '#2563eb', '#93c5fd');

  drawBerry(px + 9, py - 2, '#eab308', '#fef08a');
  drawBerry(px + 19, py + 11, '#eab308', '#fef08a');
  drawBerry(px + 17, py - 4, '#eab308', '#fef08a');

  drawBerry(px + 13, py + 3, '#ec4899', '#fbcfe8');
  drawBerry(px + 22, py - 1, '#ec4899', '#fbcfe8');
  ctx.restore();
}

export function drawSunflowerBed(ctx: CanvasRenderingContext2D, px: number, py: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.fillRect(px, py, w, h);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 1, py + 1, w - 2, 2);
  ctx.fillRect(px + 1, py + 1, 2, h - 2);

  ctx.fillStyle = '#3b2314';
  ctx.fillRect(px + 2, py + 2, w - 4, h - 4);
  ctx.fillStyle = '#543824';
  ctx.fillRect(px + 3, py + 3, w - 6, h - 6);

  const sunflowers = [
    { x: px + 6, y: py + 8 },
    { x: px + 16, y: py + 7 },
    { x: px + 25, y: py + 8 },
    { x: px + 8, y: py + 20 },
    { x: px + 17, y: py + 21 },
    { x: px + 24, y: py + 19 },
  ];

  for (const sf of sunflowers) {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(sf.x, sf.y + 2, 2, 6);
    ctx.fillRect(sf.x - 2, sf.y + 4, 2, 2);
    ctx.fillRect(sf.x + 2, sf.y + 5, 2, 2);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(sf.x - 3, sf.y - 2, 8, 6);
    ctx.fillRect(sf.x - 2, sf.y - 3, 6, 8);

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(sf.x - 2, sf.y - 2, 2, 1);
    ctx.fillRect(sf.x + 2, sf.y - 2, 2, 1);

    ctx.fillStyle = '#451a03';
    ctx.fillRect(sf.x - 1, sf.y - 1, 4, 4);
    ctx.fillStyle = '#713f12';
    ctx.fillRect(sf.x, sf.y, 2, 2);
  }
  ctx.restore();
}

export function drawRockBoulder(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 13, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 2, py + 3, 12, 11);
  ctx.fillRect(px + 3, py + 2, 10, 13);

  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 3, 10, 11);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 4, py + 4, 8, 9);
  ctx.fillRect(px + 3, py + 5, 9, 7);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 4, py + 3, 6, 3);
  ctx.fillRect(px + 3, py + 4, 4, 3);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 5, py + 3, 3, 1);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 7, py + 5, 1, 4);
  ctx.fillRect(px + 8, py + 8, 2, 1);
  ctx.fillRect(px + 9, py + 9, 1, 2);
  ctx.restore();
}

export function drawLilyPond(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(px + 16, py + 16, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(px + 16, py + 16, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.arc(px + 16, py + 16, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(px + 16, py + 16, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(125, 211, 252, 0.45)';
  ctx.fillRect(px + 8, py + 10, 6, 1);
  ctx.fillRect(px + 17, py + 12, 8, 1);
  ctx.fillRect(px + 11, py + 21, 9, 1);

  ctx.fillStyle = '#f97316';
  ctx.fillRect(px + 18, py + 17, 5, 2);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 20, py + 16, 2, 1);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 23, py + 16, 2, 3);

  const drawLilyPad = (lx: number, ly: number) => {
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0.3, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(lx - 2, ly - 2, 2, 2);
  };

  drawLilyPad(px + 11, py + 14);
  drawLilyPad(px + 14, py + 21);
  drawLilyPad(px + 21, py + 11);

  ctx.fillStyle = '#f472b6';
  ctx.fillRect(px + 10, py + 12, 3, 3);
  ctx.fillStyle = '#fdf2f8';
  ctx.fillRect(px + 11, py + 11, 2, 2);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 11, py + 12, 1, 1);
  ctx.restore();
}

export function drawStoneLantern(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 30, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 27, 10, 4);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 4, py + 27, 8, 2);

  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 6, py + 19, 4, 8);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 7, py + 19, 2, 8);

  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 4, py + 17, 8, 2);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px + 4, py + 10, 8, 7);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 5, py + 11, 6, 5);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 4, py + 10, 1, 7);
  ctx.fillRect(px + 11, py + 10, 1, 7);
  ctx.fillRect(px + 7, py + 10, 2, 7);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 4);
  ctx.lineTo(px + 15, py + 9);
  ctx.lineTo(px + 1, py + 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 5);
  ctx.lineTo(px + 14, py + 9);
  ctx.lineTo(px + 2, py + 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 6, py + 6, 4, 2);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 7, py + 2, 2, 2);
  ctx.restore();
}

export function drawCyberLamp(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 30, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + 27, 6, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 6, py + 28, 4, 1);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 6, py + 6, 4, 21);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 6, py + 6, 1, 21);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 7, py + 8, 2, 17);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 7, py + 9, 2, 15);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(px + 8, py + 10, 1, 13);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 4, 8, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 5, py + 4, 6, 1);
  ctx.restore();
}

export function drawCafeBistroTable(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 26, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left Chair
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 3, py + 19, 6, 6);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 4, py + 20, 4, 4);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 16, 2, 6);

  // Right Chair
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 23, py + 19, 6, 6);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 24, py + 20, 4, 4);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 27, py + 16, 2, 6);

  // Table Pole
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 13, py + 24, 6, 3);
  ctx.fillRect(px + 15, py + 12, 2, 12);

  // Round Parasol
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 8, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const colors = ['#ea580c', '#fef3c7', '#ea580c', '#fef3c7', '#ea580c', '#fef3c7', '#ea580c', '#fef3c7'];
  for (let i = 0; i < 8; i++) {
    const a1 = (i * Math.PI) / 4;
    const a2 = ((i + 1) * Math.PI) / 4;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(px + 16, py + 8);
    ctx.arc(px + 16, py + 8, 13, a1, a2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 15, py + 6, 2, 3);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 15, py + 5, 2, 2);
  ctx.restore();
}

export function drawPicnicSet(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(px + 4, py + 8, 26, 22);

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#dc2626' : '#ffffff';
      ctx.fillRect(px + 4 + c * 6, py + 8 + r * 5, 6, 5);
    }
  }

  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(px + 3, py + 8, 1, 20);
  ctx.fillRect(px + 28, py + 8, 1, 20);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 6, py + 12, 10, 8);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 7, py + 13, 8, 6);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 8, py + 14, 6, 1);
  ctx.fillRect(px + 8, py + 16, 6, 1);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 9, py + 9, 4, 4);

  ctx.fillStyle = '#0d9488';
  ctx.fillRect(px + 18, py + 11, 4, 7);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 19, py + 9, 2, 2);

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(px + 21, py + 22, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(px + 18, py + 20, 4, 4);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(px + 19, py + 21, 3, 1);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 19, py + 22, 2, 1);
  ctx.restore();
}

export function drawRedMailbox(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#991b1b';
  ctx.fillRect(px + 4, py + 4, 8, 10);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 5, py + 4, 6, 9);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 5, py + 4, 2, 8);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(px + 8, py + 4, 4, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + 6, 6, 1);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 7, py + 8, 2, 2);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 6, py + 11, 4, 2);
  ctx.restore();
}

export function drawTrashBins(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 7, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Green Compost Bin
  ctx.fillStyle = '#14532d';
  ctx.fillRect(px + 2, py + 5, 5, 9);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(px + 3, py + 5, 3, 8);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(px + 1, py + 3, 7, 2);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(px + 4, py + 8, 1, 2);

  // Blue Recycle Bin
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(px + 9, py + 5, 5, 9);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + 10, py + 5, 3, 8);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(px + 8, py + 3, 7, 2);
  ctx.fillStyle = '#93c5fd';
  ctx.fillRect(px + 11, py + 8, 1, 2);
  ctx.restore();
}

export function drawPokeballItem(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 13, 6, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 5, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(px + 6, py + 6, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 5, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.fillRect(px + 3, py + 7, 10, 2);

  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawPokestop(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + 26, 6, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 6, py + 27, 4, 1);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 7, py + 12, 2, 14);

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px + 8, py + 9, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px + 8, py + 9, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(px + 8, py + 9, 4, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(px + 8, py + 9, 4, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 8, 8, 1);
  ctx.beginPath();
  ctx.arc(px + 8, py + 8.5, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawSnorlax(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 24, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f4c5c';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 17, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f4c5c';
  ctx.beginPath();
  ctx.moveTo(px + 7, py + 8);
  ctx.lineTo(px + 5, py + 4);
  ctx.lineTo(px + 10, py + 7);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(px + 22, py + 7);
  ctx.lineTo(px + 27, py + 4);
  ctx.lineTo(px + 25, py + 8);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(px + 16, py + 11, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 18, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(px + 16, py + 12, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 13, py + 11, 2, 1);
  ctx.fillRect(px + 17, py + 11, 2, 1);

  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 5, py + 21, 4, 3);
  ctx.fillRect(px + 23, py + 21, 4, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 4, py + 22, 1, 2);
  ctx.fillRect(px + 27, py + 22, 1, 2);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('z', px + 23, py + 6);
  ctx.font = 'bold 11px monospace';
  ctx.fillText('Z', px + 26, py - 1);
  ctx.restore();
}

export function drawPikachu(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#92400e';
  ctx.fillRect(px + 11, py + 10, 2, 2);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 12, py + 7, 3, 3);
  ctx.fillRect(px + 10, py + 5, 3, 2);
  ctx.fillRect(px + 12, py + 2, 3, 3);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 4, py + 1, 2, 5);
  ctx.fillRect(px + 10, py + 1, 2, 5);
  ctx.fillStyle = '#18181b';
  ctx.fillRect(px + 4, py, 2, 2);
  ctx.fillRect(px + 10, py, 2, 2);

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 10, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 8, py + 7, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 4, py + 8, 2, 2);
  ctx.fillRect(px + 10, py + 8, 2, 2);

  ctx.fillStyle = '#18181b';
  ctx.fillRect(px + 6, py + 6, 1, 2);
  ctx.fillRect(px + 9, py + 6, 1, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 6, py + 6, 1, 1);
  ctx.restore();
}

export function drawSubstituteDoll(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#15803d';
  ctx.fillRect(px + 3, py + 5, 10, 9);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 4, py + 5, 8, 8);

  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 2, py + 6, 3, 4);
  ctx.fillStyle = '#166534';
  ctx.fillRect(px + 11, py + 4, 2, 2);
  ctx.fillRect(px + 12, py + 7, 2, 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 4, py + 5, 3, 3);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + 6, 1, 1);

  ctx.fillStyle = '#86efac';
  ctx.fillRect(px + 6, py + 9, 3, 3);
  ctx.restore();
}

export function drawEggIncubator(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 3, py + 25, 10, 5);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 4, py + 26, 8, 3);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 5, py + 27, 2, 1);

  ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
  ctx.fillRect(px + 4, py + 8, 8, 17);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(px + 4, py + 8, 8, 17);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(px + 5, py + 9, 1, 14);

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 16, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 7, py + 15, 1, 1);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(px + 8, py + 17, 1, 1);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 3, py + 5, 10, 3);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 6, py + 4, 4, 1);
  ctx.restore();
}

export function drawPCTerminal(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 3, py + 20, 10, 9);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 4, py + 21, 8, 7);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 2, py + 18, 12, 2);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 18, 8, 1);

  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 2, py + 6, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 3, py + 7, 10, 10);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 4, py + 8, 8, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 5, py + 9, 6, 6);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(px + 6, py + 10, 2, 1);
  ctx.fillRect(px + 8, py + 12, 2, 1);
  ctx.restore();
}

export function drawPokeHouse(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(px + 3, py + 24, 26, 6);

  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 4, py + 12, 24, 16);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 5, py + 13, 22, 14);

  ctx.fillStyle = '#92400e';
  ctx.fillRect(px + 5, py + 17, 22, 1);
  ctx.fillRect(px + 5, py + 21, 22, 1);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 12, py + 17, 8, 10);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 18, py + 22, 1, 1);

  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 1);
  ctx.lineTo(px + 31, py + 13);
  ctx.lineTo(px + 1, py + 13);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 2);
  ctx.lineTo(px + 29, py + 12);
  ctx.lineTo(px + 3, py + 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 15, py + 1, 2, 2);
  ctx.fillRect(px + 1, py + 12, 30, 2);

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(px + 16, py + 8, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

export function drawServerRack(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 2, py + 4, 12, 26);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 3, py + 5, 10, 24);

  for (let i = 0; i < 5; i++) {
    const sy = py + 6 + i * 4;
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 4, sy, 8, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 4, sy, 8, 1);

    ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#06b6d4';
    ctx.fillRect(px + 5, sy + 1, 1, 1);
    ctx.fillStyle = i === 1 ? '#f59e0b' : '#38bdf8';
    ctx.fillRect(px + 7, sy + 1, 1, 1);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(px + 9, sy + 1, 1, 1);
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 26, 8, 2);
  ctx.restore();
}

export function drawSolarPanel(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(px + 4, py + 22, 24, 7);

  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 6, py + 12, 2, 12);
  ctx.fillRect(px + 24, py + 12, 2, 12);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 2, py + 6, 28, 18);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 3, py + 6, 26, 1);

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(px + 4 + c * 8, py + 8 + r * 7, 7, 6);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(px + 5 + c * 8, py + 9 + r * 7, 5, 4);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(px + 7 + c * 8, py + 8 + r * 7, 1, 6);
    }
  }

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 22, py + 20, 5, 5);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(px + 23, py + 21, 1, 1);
  ctx.restore();
}

export function drawDronePad(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(px + 2, py + 2, 28, 28);

  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 2, py + 2, 28, 28);
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 3, py + 3, 26, 26);

  ctx.fillStyle = '#eab308';
  ctx.fillRect(px + 2, py + 2, 4, 2);
  ctx.fillRect(px + 26, py + 2, 4, 2);
  ctx.fillRect(px + 2, py + 28, 4, 2);
  ctx.fillRect(px + 26, py + 28, 4, 2);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px + 16, py + 16, 9, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 12, py + 12, 2, 8);
  ctx.fillRect(px + 18, py + 12, 2, 8);
  ctx.fillRect(px + 13, py + 15, 6, 2);

  // AI Quadcopter Drone
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 10, py + 10, 12, 2);
  ctx.fillRect(px + 10, py + 20, 12, 2);
  ctx.fillRect(px + 15, py + 11, 2, 10);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 8, py + 9, 4, 4);
  ctx.fillRect(px + 20, py + 9, 4, 4);
  ctx.fillRect(px + 8, py + 19, 4, 4);
  ctx.fillRect(px + 20, py + 19, 4, 4);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 14, py + 14, 4, 4);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(px + 15, py + 15, 2, 2);
  ctx.restore();
}

export function drawHoloProjector(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 24, 8, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 5, py + 22, 6, 4);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 4, py + 20, 8, 2);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 5, py + 20, 6, 1);

  const hx = px + 8;
  const hy = py + 10;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(hx, hy - 5);
  ctx.lineTo(hx + 5, hy - 2);
  ctx.lineTo(hx, hy + 1);
  ctx.lineTo(hx - 5, hy - 2);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(hx - 5, hy - 2);
  ctx.lineTo(hx - 5, hy + 4);
  ctx.moveTo(hx + 5, hy - 2);
  ctx.lineTo(hx + 5, hy + 4);
  ctx.moveTo(hx, hy + 1);
  ctx.lineTo(hx, hy + 7);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(hx - 5, hy + 4);
  ctx.lineTo(hx, hy + 7);
  ctx.lineTo(hx + 5, hy + 4);
  ctx.stroke();

  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(hx - 1, hy, 2, 2);
  ctx.restore();
}

export function drawBikeRack(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(px + 2, py + 12, 28, 3);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 2, py + 13, 28, 2);
  for (let b = 0; b < 4; b++) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 4 + b * 7, py + 5, 4, 8);
  }

  // Red Mach Bike
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 8, 3, 5);
  ctx.fillRect(px + 11, py + 8, 3, 5);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 6, py + 7, 5, 2);
  ctx.fillRect(px + 9, py + 4, 1, 3);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 8, py + 3, 3, 1);

  // Blue Acro Bike
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 18, py + 8, 3, 5);
  ctx.fillRect(px + 25, py + 8, 3, 5);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + 20, py + 7, 5, 2);
  ctx.fillRect(px + 23, py + 4, 1, 3);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 22, py + 3, 3, 1);
  ctx.restore();
}

export function drawSatelliteDish(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 26, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 15, py + 16, 2, 10);
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 20);
  ctx.lineTo(px + 8, py + 27);
  ctx.lineTo(px + 24, py + 27);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 11, 12, 8, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 11, 10, 7, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px + 15, py + 12);
  ctx.lineTo(px + 21, py + 4);
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px + 20, py + 3, 3, 3);
  ctx.restore();
}

export function drawRoverBot(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 2, py + 10, 2, 4);
  ctx.fillRect(px + 7, py + 11, 2, 4);
  ctx.fillRect(px + 12, py + 10, 2, 4);

  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(px + 3, py + 6, 10, 5);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 4, py + 6, 8, 4);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 6, py + 3, 4, 3);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(px + 7, py + 4, 2, 1);
  ctx.restore();
}

export function drawToriiGate(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 6, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(px + 40, py + 29, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + 26, 6, 4);
  ctx.fillRect(px + 37, py + 26, 6, 4);

  ctx.fillStyle = '#991b1b';
  ctx.fillRect(px + 6, py + 5, 4, 22);
  ctx.fillRect(px + 38, py + 5, 4, 22);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 7, py + 5, 2, 22);

  ctx.fillStyle = '#991b1b';
  ctx.fillRect(px + 2, py + 10, 44, 3);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 3, py + 10, 42, 1);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 22, py + 5, 4, 6);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 23, py + 6, 2, 4);

  ctx.fillStyle = '#991b1b';
  ctx.fillRect(px, py + 3, 48, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 1, py + 3, 46, 2);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px - 1, py + 1, 50, 2);
  ctx.restore();
}

export function drawJukebox(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 29, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 2, py + 12, 12, 17);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(px + 8, py + 12, 6, Math.PI, 0);
  ctx.fill();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 2, py + 12, 12, 16);
  ctx.beginPath();
  ctx.arc(px + 8, py + 12, 5.5, Math.PI, 0);
  ctx.stroke();

  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px + 8, py + 12, 4, Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 14, 8, 7);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(px + 8, py + 17, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 4, py + 23, 8, 4);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(px + 5, py + 24, 6, 1);

  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('♪', px + 12, py + 6);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('♫', px + 1, py + 9);
  ctx.restore();
}

export function drawNoticeBoard(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(px + 4, py + 13, 24, 2);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 4, py + 4, 3, 11);
  ctx.fillRect(px + 25, py + 4, 3, 11);

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(px + 16, py);
  ctx.lineTo(px + 30, py + 4);
  ctx.lineTo(px + 2, py + 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 5, py + 4, 22, 9);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 6, py + 5, 20, 7);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 7, py + 6, 5, 5);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 9, py + 6, 1, 1);

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 13, py + 6, 5, 5);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + 15, py + 6, 1, 1);

  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(px + 19, py + 6, 6, 5);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(px + 21, py + 6, 1, 1);
  ctx.restore();
}

export function drawSingleSignBoard(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(px + 6, py + 13, 4, 2);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 7, py + 7, 2, 7);

  ctx.fillStyle = '#92400e';
  ctx.fillRect(px + 2, py + 3, 12, 7);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 3, py + 4, 10, 5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 4, py + 5, 6, 1);
  ctx.fillRect(px + 4, py + 7, 8, 1);
  ctx.restore();
}

export function drawWanderingTrainerNpc(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 14, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(px + 5, py + 11, 2, 3);
  ctx.fillRect(px + 9, py + 11, 2, 3);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 4, py + 6, 8, 5);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 7, py + 6, 2, 5);

  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(px + 5, py + 3, 6, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 4, py + 1, 8, 3);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 3, py + 3, 4, 1);
  ctx.restore();
}
