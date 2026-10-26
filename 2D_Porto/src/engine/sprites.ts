import type { CharacterPalette, Dir } from './types';

export const TILE_SIZE = 16;

export function drawPixelMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  palette: Record<string, string>,
  destX: number,
  destY: number,
  scale = 1,
  flipX = false
) {
  const h = matrix.length;
  const w = matrix[0].length;

  for (let r = 0; r < h; r++) {
    const row = matrix[r];
    for (let c = 0; c < w; c++) {
      const char = row[c];
      if (char === '.' || char === ' ') continue;
      const color = palette[char];
      if (!color) continue;

      ctx.fillStyle = color;
      const x = flipX ? destX + (w - 1 - c) * scale : destX + c * scale;
      const y = destY + r * scale;
      ctx.fillRect(Math.round(x), Math.round(y), scale, scale);
    }
  }
}

// 16x16 Character sprite matrix patterns
export const CHAR_SPRITES = {
  down_idle: [
    "..bbbbbb..",
    ".bssssssb.",
    ".bseeeesb.",
    ".bseeeesb.",
    ".bssssssb.",
    ".bhhsshsb.",
    "..bssssb..",
    "..baccab..",
    ".baacccab.",
    ".baacccab.",
    "..bccccb..",
    "..bppppb..",
    "..bppppb..",
    "..bssssb..",
  ],
  down_step1: [
    "..bbbbbb..",
    ".bssssssb.",
    ".bseeeesb.",
    ".bseeeesb.",
    ".bssssssb.",
    ".bhhsshsb.",
    "..bssssb..",
    "..baccab..",
    ".baacccab.",
    ".baacccab.",
    "..bccccb..",
    "..bpp..b..",
    "..bpp.pb..",
    "..bss.sb..",
  ],
  up_idle: [
    "..bbbbbb..",
    ".bhhhhhhb.",
    ".bhhhhhhb.",
    ".bhhhhhhb.",
    ".bhhhhhhb.",
    ".bhhhhhhb.",
    "..bssssb..",
    "..bacccb..",
    ".baacccab.",
    ".baacccab.",
    "..bccccb..",
    "..bppppb..",
    "..bppppb..",
    "..bssssb..",
  ],
  side_idle: [
    "..bbbbbb..",
    ".bhhhhssb.",
    ".bhhhessb.",
    ".bhhhsssb.",
    ".bhhhsssb.",
    ".bhhhsssb.",
    "..bssssb..",
    "..baaccb..",
    ".baacccb..",
    ".baacccb..",
    "..bccccb..",
    "..bppppb..",
    "..bppppb..",
    "..bssssb..",
  ],
};

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  palette: CharacterPalette,
  dir: Dir,
  stepFrame: number,
  x: number,
  y: number,
  scale = 1
) {
  const pMap: Record<string, string> = {
    b: '#1c1726',
    s: palette.skin,
    h: palette.hair,
    c: palette.shirt,
    p: palette.pants,
    a: palette.shoes,
    e: palette.accent || palette.hair,
  };

  let matrix = CHAR_SPRITES.down_idle;
  let flip = false;

  if (dir === 'down') {
    matrix = stepFrame % 2 === 0 ? CHAR_SPRITES.down_idle : CHAR_SPRITES.down_step1;
  } else if (dir === 'up') {
    matrix = CHAR_SPRITES.up_idle;
  } else if (dir === 'left') {
    matrix = CHAR_SPRITES.side_idle;
    flip = true;
  } else if (dir === 'right') {
    matrix = CHAR_SPRITES.side_idle;
    flip = false;
  }

  if (palette.holo) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = '#4cc9f0';
    ctx.shadowBlur = 6;
  }

  // Draw shadow
  ctx.fillStyle = 'rgba(28, 23, 38, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 8 * scale, y + 15 * scale, 6 * scale, 3 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  drawPixelMatrix(ctx, matrix, pMap, x + 3 * scale, y + 1 * scale, scale, flip);

  if (palette.holo) {
    ctx.restore();
  }
}
