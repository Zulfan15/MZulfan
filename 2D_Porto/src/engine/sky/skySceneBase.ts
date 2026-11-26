import { TILE_SIZE } from '../sprites';
import { drawPixelText } from '../devScene';
import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import { getDigimonById } from '../digimonCatalog';
import { requestDigimonSprites, selectDigimonOverworldFrame } from '../digiSpriteLoader';
import {
  SKY_INTERIOR_COLS,
  SKY_INTERIOR_ROWS,
  createSkyInteriorBaseCollision,
} from '../skyInteriorShared';

export interface SkyGuardianPlacement {
  kind: 'pmd' | 'digimon';
  id: string;
  tx: number;
  ty: number;
  facing?: 'down' | 'left' | 'right' | 'up';
  scaleFactor?: number;
  fallbackColor: string;
}

export interface SkyRoomPalette {
  floorA: string;
  floorB: string;
  pitA: string;
  pitB: string;
  wallBg: string;
  wallBrick: string;
  trimGold: string;
  trimAccent: string;
  bannerColor: string;
  carpetColor: string;
  pedestalOuter?: string;
  pedestalInner?: string;
  isWoodDeck?: boolean;
  lanternColor: string;
  windowSkyTop: string;
  windowCloudBottom: string;
}

export interface SkyWave {
  sceneId: string;
  text: string;
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const activeSkyWaves: SkyWave[] = [];

export function triggerSkyWave(sceneId: string, text = 'CELESTIAL RESONANCE!', color = '#38bdf8'): void {
  activeSkyWaves.push({
    sceneId,
    text,
    color,
    radius: 6,
    maxRadius: 72,
    alpha: 1,
  });
}

export function createStandardSkyCollision(openCenterPit = false): Uint8Array {
  const coll = createSkyInteriorBaseCollision();
  const w = SKY_INTERIOR_COLS;

  // North Dais (x: 6..8, y: 2)
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // Four corner 2x2 station plinths
  for (let y = 3; y <= 4; y++) {
    coll[y * w + 1] = 1;
    coll[y * w + 2] = 1;
    coll[y * w + 12] = 1;
    coll[y * w + 13] = 1;
  }
  for (let y = 8; y <= 9; y++) {
    coll[y * w + 1] = 1;
    coll[y * w + 2] = 1;
    coll[y * w + 12] = 1;
    coll[y * w + 13] = 1;
  }

  // Flank Guardian Plinths (2, 6) & (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Centerpiece Pedestal (7, 6)
  if (!openCenterPit) {
    coll[6 * w + 7] = 1;
  }

  // Four celestial lanterns framing central chamber
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  return coll;
}

export function buildSkyBackgroundCanvas(palette: SkyRoomPalette): HTMLCanvasElement {
  const width = SKY_INTERIOR_COLS * TILE_SIZE;
  const height = SKY_INTERIOR_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  const pedOuter = palette.pedestalOuter || '#0f2942';
  const pedInner = palette.pedestalInner || '#1e3a5f';

  // 1. Floor Grid (y >= 2)
  for (let y = 2; y < SKY_INTERIOR_ROWS; y++) {
    for (let x = 0; x < SKY_INTERIOR_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === SKY_INTERIOR_COLS - 1 || y === SKY_INTERIOR_ROWS - 1;

      if (isBorder) {
        octx.fillStyle = palette.wallBg;
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = palette.wallBrick;
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        octx.fillStyle = palette.trimGold;
        octx.fillRect(px + 2, py + 2, 1, 1);
        octx.fillRect(px + TILE_SIZE - 3, py + TILE_SIZE - 3, 1, 1);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? palette.floorA : palette.floorB;
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      if (palette.isWoodDeck) {
        octx.fillStyle = 'rgba(15, 23, 42, 0.24)';
        octx.fillRect(px, py + 5, TILE_SIZE, 1);
        octx.fillRect(px, py + 11, TILE_SIZE, 1);
        octx.fillRect(px + (x % 2 === 0 ? 6 : 11), py, 1, TILE_SIZE);
        octx.fillStyle = 'rgba(251, 191, 36, 0.22)';
        octx.fillRect(px + 2, py + 2, 1, 1);
        octx.fillRect(px + 13, py + 8, 1, 1);
      } else {
        // Polished white marble sky tiles
        octx.fillStyle = 'rgba(255, 255, 255, 0.32)';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
        octx.fillStyle = 'rgba(30, 58, 138, 0.14)';
        octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
        octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
      }
    }
  }

  // 2. North Cloud Citadel Masonry / Timber Wall (Rows 0..1)
  octx.fillStyle = palette.wallBg;
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? palette.wallBrick : palette.wallBg;
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
      octx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      octx.fillRect(bx + offset + 1, by + 1, 14, 1);
    }
  }
  octx.fillStyle = palette.trimAccent;
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = palette.trimGold;
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Arched Sky-View Windows + Celestial Banners
  for (const wx of [2, 11]) {
    const px = wx * TILE_SIZE + 4;
    octx.fillStyle = '#0f172a';
    octx.fillRect(px, 4, 24, 22);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(px + 1, 5, 22, 20);
    octx.fillStyle = palette.windowSkyTop;
    octx.fillRect(px + 3, 7, 18, 10);
    octx.fillStyle = palette.windowCloudBottom;
    octx.fillRect(px + 3, 17, 18, 6);
    // Winged mullion crossbars
    octx.fillStyle = palette.trimGold;
    octx.fillRect(px + 11, 7, 2, 16);
    octx.fillRect(px + 3, 15, 18, 1);
  }
  for (const bx of [5, 9]) {
    const px = bx * TILE_SIZE + 3;
    octx.fillStyle = palette.bannerColor;
    octx.fillRect(px, 4, 10, 22);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(px, 4, 10, 2);
    // Star/plume emblem pixel accent
    octx.fillRect(px + 4, 9, 2, 9);
    octx.fillRect(px + 2, 12, 6, 2);
  }

  // 3. Central Sanctuary Chamber Pit (x: 4..10, y: 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      const alt = (px + py) % 2 === 0;
      octx.fillStyle = alt ? palette.pitA : palette.pitB;
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    }
  }
  octx.strokeStyle = palette.trimAccent;
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = palette.trimGold;
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // 4. Celestial Runner Carpet (column 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = palette.carpetColor;
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = palette.trimGold;
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);

  // 5. Four Corner Pedestals + North Sovereign Dais
  const drawPedestal = (tx: number, ty: number, tw: number, th: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    const pw = tw * TILE_SIZE - 4;
    const ph = th * TILE_SIZE - 4;
    octx.fillStyle = pedOuter;
    octx.fillRect(px, py, pw, ph);
    octx.fillStyle = pedInner;
    octx.fillRect(px + 1, py + 1, pw - 2, ph - 4);
    octx.strokeStyle = palette.trimGold;
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
  };
  drawPedestal(1, 3, 2, 2);
  drawPedestal(12, 3, 2, 2);
  drawPedestal(1, 8, 2, 2);
  drawPedestal(12, 8, 2, 2);
  drawPedestal(6, 1, 3, 2);

  // 6. South Skyway Exit Archway (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#0369a1';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = palette.trimGold;
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#f8fafc', 1, 'center');

  return off;
}

export function drawSkyLantern(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  tick: number,
  glowColor: string,
): void {
  const px = bx * TILE_SIZE;
  const py = by * TILE_SIZE;
  const shimmer = 0.74 + 0.26 * Math.sin(tick * 0.14 + bx * 1.7 + by);

  ctx.fillStyle = glowColor;
  ctx.globalAlpha = 0.22 * shimmer;
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Marble & brass sky sconce
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 5, py + 9, 6, 5);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(px + 4, py + 8, 8, 2);
  ctx.fillRect(px + 5, py + 3, 6, 1);

  ctx.fillStyle = glowColor;
  ctx.fillRect(px + 6, py + 4, 4, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 7, py + 5, 2, 2);
}

export function drawSkyCloudWindowDrift(ctx: CanvasRenderingContext2D, tick: number): void {
  const drift = Math.round(Math.sin(tick * 0.04) * 3);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (const wx of [2, 11]) {
    const px = wx * TILE_SIZE + 8;
    ctx.fillRect(px + drift, 10, 5, 2);
    ctx.fillRect(px + 7 - drift, 19, 6, 2);
  }
}

export function drawSkyCrystalCenterpiece(
  ctx: CanvasRenderingContext2D,
  tick: number,
  color = '#38bdf8',
): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const pulse = Math.round(Math.sin(tick * 0.08) * 1.2);

  // Marble & gold celestial plinth
  ctx.fillStyle = '#0f2942';
  ctx.fillRect(px + 2, py + 8, 12, 7);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 2.5, py + 8.5, 11, 6);

  // Floating sky-crystal diamond
  const cx = px + 8;
  const cy = py + 5 + pulse;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx + 4, cy);
  ctx.lineTo(cx, cy + 5);
  ctx.lineTo(cx - 4, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(cx - 1, cy - 2, 2, 3);
}

export function drawSkyGuardians(
  ctx: CanvasRenderingContext2D,
  guardians: SkyGuardianPlacement[],
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  for (const g of guardians) {
    const cx = g.tx * TILE_SIZE + 8;
    const fy = g.ty * TILE_SIZE + 14;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, fy, 7.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    let drawn = false;
    if (g.kind === 'pmd') {
      drawn = Boolean(
        pmdAnimator?.draw(
          ctx,
          g.id,
          'idle',
          g.facing || 'down',
          cx,
          fy,
          tick,
          g.scaleFactor ?? 0.85,
        ),
      );
    } else {
      const entry = getDigimonById(g.id);
      const sprites = entry ? requestDigimonSprites(g.id, undefined, 'overworld') : null;
      if (entry && sprites) {
        const { frame, flipX } = selectDigimonOverworldFrame(
          entry,
          sprites,
          g.facing === 'right' ? 'E' : g.facing === 'left' ? 'W' : 'S',
          tick,
          false,
          false,
        );
        if (frame) {
          const targetH = Math.round((entry.overworldTargetHeight || 34) * (g.scaleFactor ?? 0.78));
          const scale = targetH / frame.height;
          const drawW = Math.max(12, Math.round(frame.width * scale));
          const drawH = Math.max(12, Math.round(frame.height * scale));
          ctx.save();
          ctx.translate(Math.round(cx), Math.round(fy));
          if (flipX) ctx.scale(-1, 1);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(frame.canvas, -Math.round(drawW / 2), -drawH, drawW, drawH);
          ctx.restore();
          drawn = true;
        }
      }
    }

    if (!drawn) {
      const bob = Math.round(Math.sin(tick * 0.09 + g.tx));
      ctx.fillStyle = g.fallbackColor;
      ctx.fillRect(cx - 4, fy - 11 + bob, 8, 9);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx - 2, fy - 9 + bob, 4, 3);
    }
  }
}

export function renderSkyWaves(ctx: CanvasRenderingContext2D, sceneId: string): void {
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  ctx.save();
  for (let i = activeSkyWaves.length - 1; i >= 0; i--) {
    const wave = activeSkyWaves[i];
    if (wave.sceneId !== sceneId) continue;

    wave.radius += 2.4;
    wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

    ctx.strokeStyle = wave.color;
    ctx.globalAlpha = wave.alpha;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (wave.alpha > 0.2) {
      drawPixelText(
        ctx,
        wave.text,
        Math.floor(cx),
        Math.floor(cy - 18 - (1 - wave.alpha) * 14),
        wave.color,
        1,
        'center',
      );
    }

    if (wave.radius >= wave.maxRadius) {
      activeSkyWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
