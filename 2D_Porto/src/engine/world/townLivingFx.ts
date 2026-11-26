/**
 * Viewport-culled Real-Time Water & Wildlife Ambient Renderer for Zulfan's Town (100x100).
 * Brings the outer Pokémon biomes to life at 60fps with minimal CPU cost:
 *  - Animated cascading foam & rising mist spray on Highland Twin Waterfalls
 *  - Rhythmic coastal surf foam washing onto the curved West Golden Beach
 *  - Downstream current sparkles on the Winding Southern Crystal River
 *  - Swimming fish silhouettes near the Sunset Pier & Mirror Lake Footbridge
 *  - Gliding pixel Wingull seabirds over Crescent Coral Bay & fluttering meadow butterflies
 */
import type { TownEngine } from '../TownEngine';
import { getSouthRiverCenterY, getWestCoastWaterEdgeX } from './townGeography';
import { TILE_SIZE } from '../sprites';
import { Tile } from '../types';

const WATERFALL_CHUTES = [
  { x: 80, y: 19, w: 2, h: 2 },
  { x: 89, y: 19, w: 2, h: 2 },
  { x: 80, y: 41, w: 2, h: 2 },
  { x: 89, y: 41, w: 2, h: 2 },
];

const FISH_SPOTS = [
  { cx: 10.5, cy: 34.2, rx: 2.2, ry: 1.1, speed: 0.022, phase: 0.4 },
  { cx: 12.0, cy: 39.2, rx: 2.5, ry: 1.0, speed: -0.019, phase: 2.1 },
  { cx: 6.2, cy: 43.5, rx: 1.8, ry: 1.4, speed: 0.017, phase: 4.0 },
  { cx: 76.5, cy: 57.8, rx: 2.1, ry: 1.2, speed: 0.021, phase: 1.3 },
  { cx: 87.2, cy: 63.0, rx: 1.9, ry: 1.3, speed: -0.018, phase: 3.5 },
];

const SEABIRD_FLOCK = [
  { cx: 7.5, cy: 14.0, rx: 4.5, ry: 3.2, speed: 0.012, phase: 0 },
  { cx: 9.0, cy: 29.0, rx: 5.0, ry: 3.6, speed: -0.010, phase: 1.9 },
  { cx: 6.5, cy: 49.0, rx: 4.2, ry: 2.8, speed: 0.014, phase: 3.7 },
];

const BUTTERFLY_SPOTS = [
  { cx: 23.5, cy: 10.2, color: '#fef08a', phase: 0.2 },
  { cx: 76.2, cy: 14.2, color: '#fbcfe8', phase: 1.7 },
  { cx: 68.4, cy: 64.0, color: '#7dd3fc', phase: 3.1 },
  { cx: 90.0, cy: 74.0, color: '#fde047', phase: 4.4 },
  { cx: 25.2, cy: 90.0, color: '#fda4af', phase: 5.3 },
  { cx: 72.2, cy: 92.0, color: '#c4b5fd', phase: 2.6 },
];

export function renderTownLivingWaterAndWildlife(
  engine: TownEngine,
  ctx: CanvasRenderingContext2D
): void {
  const halfW = engine.canvas.width / engine.zoom / 2 + 48;
  const halfH = engine.canvas.height / engine.zoom / 2 + 48;
  const minPx = engine.cameraX - halfW;
  const maxPx = engine.cameraX + halfW;
  const minPy = engine.cameraY - halfH;
  const maxPy = engine.cameraY + halfH;

  const minTileX = Math.max(0, Math.floor(minPx / TILE_SIZE));
  const maxTileX = Math.min(engine.map.w - 1, Math.ceil(maxPx / TILE_SIZE));
  const minTileY = Math.max(0, Math.floor(minPy / TILE_SIZE));
  const maxTileY = Math.min(engine.map.h - 1, Math.ceil(maxPy / TILE_SIZE));

  const tick = engine.tick;
  ctx.save();

  // 1. Animated Highland Twin Waterfalls (Cascading white foam bands + rising mist rings)
  for (const wf of WATERFALL_CHUTES) {
    const wx = wf.x * TILE_SIZE;
    const wy = wf.y * TILE_SIZE;
    const ww = wf.w * TILE_SIZE;
    const wh = wf.h * TILE_SIZE;
    if (wx + ww < minPx || wx > maxPx || wy + wh + 24 < minPy || wy - 12 > maxPy) continue;

    // Scrolling vertical foam ribbons
    const scroll = (tick * 1.4) % 8;
    for (let row = -8; row < wh; row += 8) {
      const fy = wy + row + scroll;
      if (fy < wy || fy > wy + wh - 3) continue;
      ctx.fillStyle = 'rgba(240, 253, 255, 0.78)';
      ctx.fillRect(wx + 2, Math.round(fy), 6, 3);
      ctx.fillRect(wx + 12, Math.round(fy + 2) % (wh - 2) + wy, 6, 3);
      ctx.fillRect(wx + 22, Math.round(fy), 6, 3);
    }

    // Boiling white plunge foam & mist puffs at base of waterfall
    const foamPulse = Math.sin(tick * 0.14 + wf.x) * 1.8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.beginPath();
    ctx.ellipse(wx + ww / 2, wy + wh + 2, ww / 2 + 2, 4 + foamPulse * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Expanding concentric ripple in plunge pool below
    const rippleT = ((tick * 0.035 + wf.y * 0.2) % 1);
    ctx.strokeStyle = `rgba(224, 242, 254, ${(1 - rippleT) * 0.65})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(wx + ww / 2, wy + wh + 8, 8 + rippleT * 14, 3 + rippleT * 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Curved West Coastline Surf Waves & Deep-Bay Sparkles
  if (minTileX <= 16 && minTileY <= 64) {
    const startY = Math.max(2, minTileY);
    const endY = Math.min(62, maxTileY);
    for (let y = startY; y <= endY; y++) {
      const shallowEdgeX = getWestCoastWaterEdgeX(y) + 2;
      if (shallowEdgeX < minTileX - 1 || shallowEdgeX > maxTileX + 1) continue;

      const waveCycle = Math.sin(tick * 0.06 + y * 0.35);
      const foamAlpha = 0.28 + (waveCycle + 1) * 0.24;
      const surgePx = Math.round((waveCycle + 1) * 2.5);
      const sx = shallowEdgeX * TILE_SIZE + 10 + surgePx;
      const sy = y * TILE_SIZE;

      ctx.fillStyle = `rgba(245, 254, 255, ${foamAlpha.toFixed(2)})`;
      ctx.fillRect(sx, sy + 2, 3, 5);
      ctx.fillRect(sx + 1, sy + 9, 3, 5);

      // Sunlit ocean crest glints offshore
      if (y % 3 === 0) {
        const ox = Math.max(1, shallowEdgeX - 4 - ((y * 5 + Math.floor(tick / 22)) % 5));
        ctx.fillStyle = `rgba(224, 242, 254, ${(0.22 + Math.sin(tick * 0.08 + y) * 0.1).toFixed(2)})`;
        ctx.fillRect(ox * TILE_SIZE + 2, sy + 6, 10, 2);
      }
    }
  }

  // 3. Winding Southern River Downstream Current Sparkles
  if (maxTileY >= 66 && minTileY <= 77 && maxTileX >= 8 && minTileX <= 75) {
    const rx0 = Math.max(8, minTileX);
    const rx1 = Math.min(75, maxTileX);
    const drift = (tick * 0.65) % 16;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.52)';
    for (let x = rx0; x <= rx1; x += 2) {
      const cy = getSouthRiverCenterY(x);
      if (engine.map.ground[cy * engine.map.w + x] !== Tile.WATER) continue; // Skip under bridges
      const px = x * TILE_SIZE - drift;
      const py = cy * TILE_SIZE + ((x * 7) % 10) + 2;
      ctx.fillRect(Math.round(px), py, 6, 1.5);
    }
  }

  // 4. Swimming Fish Silhouettes under Crystal Water (Pier & Mirror Lake)
  for (const fish of FISH_SPOTS) {
    const angle = tick * fish.speed + fish.phase;
    const fx = (fish.cx + Math.cos(angle) * fish.rx) * TILE_SIZE;
    const fy = (fish.cy + Math.sin(angle * 1.3) * fish.ry) * TILE_SIZE;
    if (fx < minPx || fx > maxPx || fy < minPy || fy > maxPy) continue;

    const dirX = -Math.sin(angle) * fish.speed >= 0 ? 1 : -1;
    ctx.fillStyle = 'rgba(12, 54, 92, 0.48)';
    ctx.beginPath();
    ctx.ellipse(fx, fy, 3.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail fin
    ctx.fillRect(dirX > 0 ? fx - 5 : fx + 3, fy - 1.2, 2, 2.4);
  }

  // 5. Daytime / Sunset Wildlife: Gliding Wingull Seabirds & Meadow Butterflies
  if (engine.townAtmosphere !== 'night') {
    for (const bird of SEABIRD_FLOCK) {
      const t = tick * bird.speed + bird.phase;
      const bx = (bird.cx + Math.cos(t) * bird.rx) * TILE_SIZE;
      const by = (bird.cy + Math.sin(t * 0.8) * bird.ry) * TILE_SIZE;
      if (bx < minPx || bx > maxPx || by < minPy || by > maxPy) continue;

      const flap = Math.sin(tick * 0.18 + bird.phase) > 0 ? -2 : 1;
      // Soft shadow on ocean surface below Wingull
      ctx.fillStyle = 'rgba(8, 30, 56, 0.25)';
      ctx.fillRect(Math.round(bx - 3), Math.round(by + 12), 6, 2);

      // Crisp white & sky-blue pixel Wingull silhouette
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(bx - 2), Math.round(by), 5, 2);
      ctx.fillRect(Math.round(bx - 6), Math.round(by + flap), 4, 1.5);
      ctx.fillRect(Math.round(bx + 3), Math.round(by + flap), 4, 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(Math.round(bx - 5), Math.round(by + flap), 2, 1);
      ctx.fillRect(Math.round(bx + 4), Math.round(by + flap), 2, 1);
    }

    for (const bf of BUTTERFLY_SPOTS) {
      const bx = (bf.cx + Math.sin(tick * 0.04 + bf.phase) * 1.4) * TILE_SIZE;
      const by = (bf.cy + Math.cos(tick * 0.055 + bf.phase) * 1.1) * TILE_SIZE;
      if (bx < minPx || bx > maxPx || by < minPy || by > maxPy) continue;

      const wingOpen = Math.sin(tick * 0.35 + bf.phase) > -0.2;
      ctx.fillStyle = bf.color;
      if (wingOpen) {
        ctx.fillRect(Math.round(bx - 2), Math.round(by - 1), 2, 3);
        ctx.fillRect(Math.round(bx + 1), Math.round(by - 1), 2, 3);
      } else {
        ctx.fillRect(Math.round(bx), Math.round(by - 1), 1.5, 3);
      }
    }
  }

  ctx.restore();
}
