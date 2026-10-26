import { Tile, type Building, type Lamp, type Prop, type Sign, type TownMap } from './types';
import { TILE_SIZE } from './sprites';

// Helper to draw clean retro floating pill badges
export function drawPillBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  bottomY: number,
  bgColor = '#ffffff',
  textColor = '#1c1726'
) {
  ctx.save();
  ctx.font = 'bold 9px "Pixelify Sans", "Press Start 2P", monospace';
  const textMetrics = ctx.measureText(text);
  const paddingX = 6;
  const boxW = Math.max(textMetrics.width + paddingX * 2, 28);
  const boxH = 15;
  const boxX = centerX - boxW / 2;
  const boxY = bottomY - boxH;

  // Drop shadow
  ctx.fillStyle = 'rgba(28, 23, 38, 0.45)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY + 1.5, boxW, boxH, 4);
  ctx.fill();

  // Pill Background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 4);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#1c1726';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, centerX, boxY + boxH / 2);
  ctx.restore();
}

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
          ctx.fillStyle = (x + y) % 2 === 0 ? '#82cb62' : '#7bc45c';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // subtle grass texture
          if ((x * 5 + y * 13) % 9 === 0) {
            ctx.fillStyle = '#6fb851';
            ctx.fillRect(px + 3, py + 4, 2, 3);
          }
          break;

        case Tile.PATH:
          ctx.fillStyle = '#f5eedb';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // dirt speckles
          if ((x * 7 + y * 11) % 6 === 0) {
            ctx.fillStyle = '#e5dcbe';
            ctx.fillRect(px + 4, py + 5, 2, 2);
          }
          break;

        case Tile.TALL:
          ctx.fillStyle = '#599c42';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#3f782c';
          ctx.fillRect(px + 2, py + 3, 3, 11);
          ctx.fillRect(px + 7, py + 1, 3, 13);
          ctx.fillRect(px + 12, py + 4, 3, 10);
          break;

        case Tile.WATER: {
          const shimmer = Math.sin(tick * 0.05 + x * 0.8 + y * 0.5);
          ctx.fillStyle = shimmer > 0.3 ? '#4ca5e6' : '#3d94cc';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // Stone rim border around pond
          ctx.strokeStyle = '#8a7e6b';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          if ((x + y + Math.floor(tick / 15)) % 4 === 0) {
            ctx.fillRect(px + 4, py + 6, 7, 2);
          }
          break;
        }

        case Tile.TREE:
          // Forest tree background
          ctx.fillStyle = '#162e1d';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // Round bushy tree crown
          ctx.fillStyle = '#1c4224';
          ctx.beginPath();
          ctx.arc(px + 8, py + 8, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#265430';
          ctx.beginPath();
          ctx.arc(px + 7, py + 7, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#377344';
          ctx.beginPath();
          ctx.arc(px + 6, py + 6, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }
  }
}

// Render warm glowing radial light cones from street lamps
export function renderLighting(ctx: CanvasRenderingContext2D, lamps: Lamp[]) {
  ctx.save();
  for (const l of lamps) {
    const lx = l.x * TILE_SIZE + 8;
    const ly = l.y * TILE_SIZE + 6;
    const radius = l.radius || 48;

    const grad = ctx.createRadialGradient(lx, ly, 3, lx, ly, radius);
    grad.addColorStop(0, 'rgba(255, 238, 140, 0.55)');
    grad.addColorStop(0.35, 'rgba(255, 230, 110, 0.32)');
    grad.addColorStop(0.7, 'rgba(255, 220, 90, 0.12)');
    grad.addColorStop(1, 'rgba(255, 220, 90, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function renderLamps(ctx: CanvasRenderingContext2D, lamps: Lamp[]) {
  for (const l of lamps) {
    const lx = l.x * TILE_SIZE;
    const ly = l.y * TILE_SIZE;

    // Post
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(lx + 7, ly + 6, 2, 10);
    // Lantern head
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(lx + 5, ly + 1, 6, 6);
    // Yellow bulb
    ctx.fillStyle = '#ffef85';
    ctx.fillRect(lx + 6, ly + 2, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lx + 7, ly + 3, 2, 2);
  }
}

export function renderBuildings(ctx: CanvasRenderingContext2D, buildings: Building[]) {
  for (const b of buildings) {
    const bx = b.x * TILE_SIZE;
    const by = b.y * TILE_SIZE;
    const bw = b.w * TILE_SIZE;
    const bh = b.h * TILE_SIZE;

    // Drop Shadow
    ctx.fillStyle = 'rgba(28, 23, 38, 0.3)';
    ctx.fillRect(bx + 4, by + bh - 4, bw + 6, 8);

    if (b.style === 'mansion') {
      // 2-Story Home
      ctx.fillStyle = b.wall;
      ctx.fillRect(bx, by + 26, bw, bh - 26);
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by + 26, bw, bh - 26);

      // Roof (Dark 2-story roof)
      ctx.fillStyle = b.roof;
      ctx.fillRect(bx - 3, by, bw + 6, 26);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(bx - 3, by, bw + 6, 26);
      ctx.fillStyle = b.roofDark;
      ctx.fillRect(bx - 3, by + 24, bw + 6, 4);

      // Balcony Railing (Upper floor)
      ctx.fillStyle = '#d9b35b';
      ctx.fillRect(bx + 6, by + 28, bw - 12, 14);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(bx + 6, by + 28, bw - 12, 14);

      // Upper glowing windows (3 windows)
      for (let i = 0; i < 3; i++) {
        const wx = bx + 16 + i * 36;
        ctx.fillStyle = '#ffea75';
        ctx.fillRect(wx, by + 10, 16, 12);
        ctx.strokeStyle = '#1c1726';
        ctx.strokeRect(wx, by + 10, 16, 12);
        // cross divider
        ctx.beginPath();
        ctx.moveTo(wx + 8, by + 10);
        ctx.lineTo(wx + 8, by + 22);
        ctx.moveTo(wx, by + 16);
        ctx.lineTo(wx + 16, by + 16);
        ctx.stroke();
      }

      // Ground floor windows (2 windows)
      const w1 = bx + 14;
      const w2 = bx + bw - 30;
      [w1, w2].forEach((wx) => {
        ctx.fillStyle = '#ffea75';
        ctx.fillRect(wx, by + 48, 16, 14);
        ctx.strokeStyle = '#1c1726';
        ctx.strokeRect(wx, by + 48, 16, 14);
      });

      // Ground floor door in center
      const dx = bx + bw / 2 - 8;
      ctx.fillStyle = '#8a5a34';
      ctx.fillRect(dx, by + 46, 16, 24);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(dx, by + 46, 16, 24);
    } else if (b.style === 'shop') {
      // Striped Awning Shop
      ctx.fillStyle = b.wall;
      ctx.fillRect(bx, by + 18, bw, bh - 18);
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by + 18, bw, bh - 18);

      // Red and White Striped Awning
      const stripeW = 8;
      const stripeCount = Math.floor(bw / stripeW);
      for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#e8473f' : '#ffffff';
        ctx.fillRect(bx + i * stripeW, by + 6, stripeW, 14);
        ctx.strokeStyle = '#1c1726';
        ctx.strokeRect(bx + i * stripeW, by + 6, stripeW, 14);
      }

      // Storefront display windows with colorful goods
      ctx.fillStyle = '#ffea75';
      ctx.fillRect(bx + 8, by + 24, 20, 14);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(bx + 8, by + 24, 20, 14);
      ctx.fillStyle = '#ff5d5d';
      ctx.fillRect(bx + 12, by + 28, 6, 6);
      ctx.fillStyle = '#4cc9f0';
      ctx.fillRect(bx + 20, by + 30, 5, 5);

      // Door
      const dx = bx + bw - 24;
      ctx.fillStyle = '#8a5a34';
      ctx.fillRect(dx, by + 22, 14, 18);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(dx, by + 22, 14, 18);
    } else {
      // Standard / Lab Building
      ctx.fillStyle = b.wall;
      ctx.fillRect(bx, by + 20, bw, bh - 20);
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by + 20, bw, bh - 20);

      // Roof
      ctx.fillStyle = b.roof;
      ctx.fillRect(bx - 3, by, bw + 6, 20);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(bx - 3, by, bw + 6, 20);
      ctx.fillStyle = b.roofDark;
      ctx.fillRect(bx - 3, by + 18, bw + 6, 3);

      // Satellite dish if Lab
      if (b.style === 'lab') {
        ctx.fillStyle = '#1c1726';
        ctx.fillRect(bx + 12, by - 8, 3, 8);
        ctx.fillStyle = '#e5eef7';
        ctx.beginPath();
        ctx.arc(bx + 13, by - 8, 7, 0, Math.PI, true);
        ctx.fill();
        ctx.strokeStyle = '#1c1726';
        ctx.stroke();
      }

      // Center </> banner if Dev Center
      if (b.id === 'dev') {
        ctx.fillStyle = '#173678';
        ctx.fillRect(bx + bw / 2 - 16, by + 4, 32, 12);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(bx + bw / 2 - 16, by + 4, 32, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('</>', bx + bw / 2, by + 13);
      }

      // Glowing Windows
      const winCount = b.w >= 10 ? 4 : 2;
      const spacing = bw / (winCount + 1);
      for (let i = 1; i <= winCount; i++) {
        const wx = bx + spacing * i - 8;
        ctx.fillStyle = '#ffea75';
        ctx.fillRect(wx, by + 26, 16, 14);
        ctx.strokeStyle = '#1c1726';
        ctx.strokeRect(wx, by + 26, 16, 14);
      }

      // Doors
      for (const d of b.doors) {
        const dx = d.x * TILE_SIZE;
        const dy = d.y * TILE_SIZE;
        ctx.fillStyle = '#8a5a34';
        ctx.fillRect(dx + 1, dy - 6, 14, 22);
        ctx.strokeStyle = '#1c1726';
        ctx.strokeRect(dx + 1, dy - 6, 14, 22);
        ctx.fillStyle = '#f7c948';
        ctx.fillRect(dx + 11, dy + 5, 2, 3);
      }
    }

    // Floating Pill Badge above building roof!
    drawPillBadge(ctx, b.badge, bx + bw / 2, by - 4);
  }
}

export function renderProps(ctx: CanvasRenderingContext2D, props: Prop[]) {
  for (const p of props) {
    const px = p.x * TILE_SIZE;
    const py = p.y * TILE_SIZE;

    if (p.type === 'statue') {
      // Stone Pedestal
      ctx.fillStyle = '#8a7e6b';
      ctx.fillRect(px + 1, py + 8, 14, 8);
      ctx.strokeStyle = '#1c1726';
      ctx.strokeRect(px + 1, py + 8, 14, 8);

      // Bronze Trophy / Statue
      ctx.fillStyle = '#c79248';
      ctx.fillRect(px + 4, py - 4, 8, 12);
      ctx.beginPath();
      ctx.arc(px + 8, py - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1c1726';
      ctx.stroke();

      if (p.badge) {
        drawPillBadge(ctx, p.badge, px + 8, py - 14);
      }
    }
  }
}

export function renderSigns(ctx: CanvasRenderingContext2D, signs: Sign[]) {
  for (const s of signs) {
    const sx = s.x * TILE_SIZE;
    const sy = s.y * TILE_SIZE;

    // Wood post
    ctx.fillStyle = '#8a5a34';
    ctx.fillRect(sx + 6, sy + 7, 4, 9);
    ctx.fillStyle = '#e5d7bd';
    ctx.fillRect(sx + 1, sy + 2, 14, 7);
    ctx.strokeStyle = '#1c1726';
    ctx.strokeRect(sx + 1, sy + 2, 14, 7);

    // Floating Pill Badge above signpost!
    drawPillBadge(ctx, s.name, sx + 8, sy - 3);
  }
}
