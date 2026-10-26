import { Tile, type Building, type Sign, type TownMap } from './types';
import { TILE_SIZE } from './sprites';

export function renderGround(
  ctx: CanvasRenderingContext2D,
  map: TownMap,
  tick: number,
  viewX: number,
  viewY: number,
  viewW: number,
  viewH: number
) {
  const minTileX = Math.max(0, Math.floor(viewX / TILE_SIZE));
  const maxTileX = Math.min(map.w - 1, Math.ceil((viewX + viewW) / TILE_SIZE));
  const minTileY = Math.max(0, Math.floor(viewY / TILE_SIZE));
  const maxTileY = Math.min(map.h - 1, Math.ceil((viewY + viewH) / TILE_SIZE));

  for (let y = minTileY; y <= maxTileY; y++) {
    for (let x = minTileX; x <= maxTileX; x++) {
      const tile = map.ground[y * map.w + x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      switch (tile) {
        case Tile.GRASS:
          ctx.fillStyle = (x + y) % 2 === 0 ? '#8bd16a' : '#82ca61';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          break;

        case Tile.PATH:
          ctx.fillStyle = '#f6ecd2';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#e8d5a3';
          if ((x * 3 + y * 7) % 5 === 0) ctx.fillRect(px + 3, py + 4, 3, 2);
          if ((x * 11 + y * 5) % 7 === 0) ctx.fillRect(px + 9, py + 10, 4, 2);
          break;

        case Tile.PLAZA:
          ctx.fillStyle = '#e5d7bd';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#cbbb9e';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
          break;

        case Tile.SAND:
          ctx.fillStyle = '#f3e5ab';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          break;

        case Tile.WATER: {
          const shimmer = Math.sin(tick * 0.05 + x * 0.8 + y * 0.5) * 5;
          ctx.fillStyle = shimmer > 2 ? '#4ba7e3' : '#3d94cc';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          if ((x + y + Math.floor(tick / 20)) % 4 === 0) {
            ctx.fillRect(px + 4, py + 6, 8, 2);
          }
          break;
        }

        case Tile.TALL:
          ctx.fillStyle = '#7ac459';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // blades of grass
          ctx.fillStyle = '#4f9a3e';
          ctx.fillRect(px + 2, py + 4, 3, 10);
          ctx.fillRect(px + 7, py + 2, 3, 12);
          ctx.fillRect(px + 12, py + 6, 3, 8);
          break;

        case Tile.TREE:
          ctx.fillStyle = '#8bd16a';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // tree canopy base
          ctx.fillStyle = '#2f6b3a';
          ctx.fillRect(px + 1, py + 1, 14, 14);
          ctx.fillStyle = '#3e844a';
          ctx.fillRect(px + 3, py + 3, 10, 8);
          ctx.fillStyle = '#1c1726';
          ctx.strokeRect(px + 1, py + 1, 14, 14);
          break;

        case Tile.FLOWER:
          ctx.fillStyle = '#8bd16a';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = (x * 7 + y) % 3 === 0 ? '#ff5d5d' : '#f7c948';
          ctx.fillRect(px + 6, py + 6, 4, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px + 7, py + 7, 2, 2);
          break;

        case Tile.FENCE:
          ctx.fillStyle = '#8bd16a';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#8a5a34';
          ctx.fillRect(px + 6, py + 2, 4, 14);
          ctx.fillRect(px, py + 5, 16, 3);
          ctx.fillRect(px, py + 10, 16, 3);
          break;
      }
    }
  }
}

export function renderBuildings(ctx: CanvasRenderingContext2D, buildings: Building[]) {
  for (const b of buildings) {
    const bx = b.x * TILE_SIZE;
    const by = b.y * TILE_SIZE;
    const bw = b.w * TILE_SIZE;
    const bh = b.h * TILE_SIZE;

    // Shadow
    ctx.fillStyle = 'rgba(28, 23, 38, 0.25)';
    ctx.fillRect(bx + 4, by + bh - 4, bw + 6, 8);

    // Wall
    ctx.fillStyle = b.wall;
    ctx.fillRect(bx, by + 24, bw, bh - 24);
    ctx.strokeStyle = '#1c1726';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by + 24, bw, bh - 24);

    // Roof
    ctx.fillStyle = b.roof;
    ctx.beginPath();
    ctx.moveTo(bx - 4, by + 24);
    ctx.lineTo(bx + bw / 2, by);
    ctx.lineTo(bx + bw + 4, by + 24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1c1726';
    ctx.stroke();

    // Roof trim
    ctx.fillStyle = b.roofDark;
    ctx.fillRect(bx - 4, by + 22, bw + 8, 4);
    ctx.strokeRect(bx - 4, by + 22, bw + 8, 4);

    // Sign banner
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(bx + bw / 2 - 28, by + 12, 56, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.sign, bx + bw / 2, by + 18);

    // Windows
    ctx.fillStyle = '#4cc9f0';
    ctx.fillRect(bx + 12, by + 34, 16, 14);
    ctx.strokeRect(bx + 12, by + 34, 16, 14);
    ctx.fillRect(bx + bw - 28, by + 34, 16, 14);
    ctx.strokeRect(bx + bw - 28, by + 34, 16, 14);

    // Doors
    for (const d of b.doors) {
      const dx = d.x * TILE_SIZE;
      const dy = d.y * TILE_SIZE;
      ctx.fillStyle = '#8a5a34';
      ctx.fillRect(dx + 1, dy - 6, 14, 22);
      ctx.strokeRect(dx + 1, dy - 6, 14, 22);
      ctx.fillStyle = '#f7c948';
      ctx.fillRect(dx + 11, dy + 5, 2, 3);
      // Welcome mat
      ctx.fillStyle = '#e8473f';
      ctx.fillRect(dx + 2, dy + 13, 12, 3);
    }
  }
}

export function renderSigns(ctx: CanvasRenderingContext2D, signs: Sign[]) {
  for (const s of signs) {
    const sx = s.x * TILE_SIZE;
    const sy = s.y * TILE_SIZE;

    if (s.style === 'board') {
      // Notice Board
      ctx.fillStyle = '#8a5a34';
      ctx.fillRect(sx + 2, sy + 10, 3, 6);
      ctx.fillRect(sx + 11, sy + 10, 3, 6);
      ctx.fillStyle = '#fff3d6';
      ctx.fillRect(sx, sy, 16, 12);
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx, sy, 16, 12);
      ctx.fillStyle = '#e8473f';
      ctx.fillRect(sx + 7, sy + 2, 2, 2);
    } else if (s.style === 'mailbox') {
      ctx.fillStyle = '#1c1726';
      ctx.fillRect(sx + 6, sy + 8, 4, 8);
      ctx.fillStyle = '#3b6fd8';
      ctx.fillRect(sx + 3, sy + 2, 10, 8);
      ctx.fillStyle = '#ff5d5d';
      ctx.fillRect(sx + 10, sy + 4, 3, 2);
    } else {
      // Wood post
      ctx.fillStyle = '#8a5a34';
      ctx.fillRect(sx + 6, sy + 7, 4, 9);
      ctx.fillStyle = '#e5d7bd';
      ctx.fillRect(sx + 1, sy + 2, 14, 7);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(sx + 1, sy + 2, 14, 7);
    }
  }
}
