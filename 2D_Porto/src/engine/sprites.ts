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
      const pixelSize = scale >= 1 ? scale : 1;
      ctx.fillRect(Math.round(x), Math.round(y), pixelSize, pixelSize);
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

export const ASH_PALETTE: Record<string, string> = {
  b: '#000000', // Black outline, hair, eyes, black undershirt, shoes
  w: '#ffffff', // White cap front & collar & socks
  r: '#de1e1b', // Red cap visor & Pikachu cheeks
  g: '#00b23a', // Green cap emblem & fingerless gloves
  s: '#fecda5', // Skin tone
  u: '#0665d9', // Blue vest & pants
  y: '#fed700', // Yellow Pikachu body & tail
  o: '#feb800', // Golden yellow belt & buckle
  d: '#8b4513', // Brown Pikachu back stripes
};

export const ASH_SPRITES = {
  down_idle: [
    "....bbbbbb........",
    "...bwwwwwbb..bb...",
    "..bwwggwwwb.byb...",
    "..bwggwwwwbbyybbbb",
    "..brrrrr..byyyyyb.",
    ".brrrrrrrbyybyyb..",
    "bbbsbbsbsbbyyryb.b",
    ".bbsbssbssbbyyybbb",
    "..bssssssbyyyybbyb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "...bwwbbwwb.......",
    "..bbbb.bbbb.......",
    "..bbbb.bbbb.......",
  ],
  down_step1: [
    "....bbbbbb........",
    "...bwwwwwbb..bb...",
    "..bwwggwwwb.byb...",
    "..bwggwwwwbbyybbbb",
    "..brrrrr..byyyyyb.",
    ".brrrrrrrbyybyyb..",
    "bbbsbbsbsbbyyryb.b",
    ".bbsbssbssbbyyybbb",
    "..bssssssbyyyybbyb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "..bwwb.bwwb.......",
    ".bbbb...bbbb......",
    ".bbbb.............",
  ],
  down_step2: [
    "....bbbbbb........",
    "...bwwwwwbb..bb...",
    "..bwwggwwwb.byb...",
    "..bwggwwwwbbyybbbb",
    "..brrrrr..byyyyyb.",
    ".brrrrrrrbyybyyb..",
    "bbbsbbsbsbbyyryb.b",
    ".bbsbssbssbbyyybbb",
    "..bssssssbyyyybbyb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "...bwwb.bwwb......",
    "....bbbb.bbbb.....",
    ".........bbbb.....",
  ],
  up_idle: [
    "....bbbbbb........",
    "...brrrrrrbb..bb..",
    "..brrrrrrrrb.byb..",
    "..brrrrrrrrbbyybbb",
    "..brrrrrrrbyyyyyb.",
    ".bbbbbbbbbbyyyyb..",
    "bbbbbbbbbbbyydyb.b",
    ".bbbbbbbbbbbyyybbb",
    "..bbbbbbbbbyydyybb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "...bwwbbwwb.......",
    "..bbbb.bbbb.......",
    "..bbbb.bbbb.......",
  ],
  up_step1: [
    "....bbbbbb........",
    "...brrrrrrbb..bb..",
    "..brrrrrrrrb.byb..",
    "..brrrrrrrrbbyybbb",
    "..brrrrrrrbyyyyyb.",
    ".bbbbbbbbbbyyyyb..",
    "bbbbbbbbbbbyydyb.b",
    ".bbbbbbbbbbbyyybbb",
    "..bbbbbbbbbyydyybb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "..bwwb.bwwb.......",
    ".bbbb...bbbb......",
    ".bbbb.............",
  ],
  up_step2: [
    "....bbbbbb........",
    "...brrrrrrbb..bb..",
    "..brrrrrrrrb.byb..",
    "..brrrrrrrrbbyybbb",
    "..brrrrrrrbyyyyyb.",
    ".bbbbbbbbbbyyyyb..",
    "bbbbbbbbbbbyydyb.b",
    ".bbbbbbbbbbbyyybbb",
    "..bbbbbbbbbyydyybb",
    "...bssssbbbyybryb.",
    "..buwbbbwubbyybb..",
    ".bwbubbuuuw.bb....",
    ".bsbubbuub.sb.....",
    ".bgbubbuuubgb.....",
    ".bgbubbuuubgb.....",
    "..bbouuooobb......",
    "...buubbuub.......",
    "...bwwb.bwwb......",
    "....bbbb.bbbb.....",
    ".........bbbb.....",
  ],
  side_idle: [
    ".....bbbbbb.......",
    "....bwwwwwb..bb...",
    "...bwwggwwb.byb...",
    "...bwggwwwbbyybbbb",
    "...bwwwwbrrrrrrb..",
    "..bbbbbbbrrrrrrb..",
    ".bbbbbbbbsbsbyyyyb",
    ".bbbbbbbbssssyyryb",
    "..bbbbbbsssssyyybb",
    "...bbbbbssssbbyb..",
    "....buwwbbubbyyb..",
    "...bwwubbuuubbb...",
    "...bswubbuub......",
    "...bgubuuuugb.....",
    "...bgubuuuugb.....",
    "....bbouoobb......",
    "....buu.uub.......",
    "....bww.wwb.......",
    "...bbbb.bbbb......",
    "...bbbb.bbbb......",
  ],
  side_step1: [
    ".....bbbbbb.......",
    "....bwwwwwb..bb...",
    "...bwwggwwb.byb...",
    "...bwggwwwbbyybbbb",
    "...bwwwwbrrrrrrb..",
    "..bbbbbbbrrrrrrb..",
    ".bbbbbbbbsbsbyyyyb",
    ".bbbbbbbbssssyyryb",
    "..bbbbbbsssssyyybb",
    "...bbbbbssssbbyb..",
    "....buwwbbubbyyb..",
    "...bwwubbuuubbb...",
    "...bswubbuub......",
    "...bgubuuuugb.....",
    "...bgubuuuugb.....",
    "....bbouoobb......",
    "...buu...uub......",
    "...bww...wwb......",
    "..bbbb...bbbb.....",
    "..bbbb............",
  ],
  side_step2: [
    ".....bbbbbb.......",
    "....bwwwwwb..bb...",
    "...bwwggwwb.byb...",
    "...bwggwwwbbyybbbb",
    "...bwwwwbrrrrrrb..",
    "..bbbbbbbrrrrrrb..",
    ".bbbbbbbbsbsbyyyyb",
    ".bbbbbbbbssssyyryb",
    "..bbbbbbsssssyyybb",
    "...bbbbbssssbbyb..",
    "....buwwbbubbyyb..",
    "...bwwubbuuubbb...",
    "...bswubbuub......",
    "...bgubuuuugb.....",
    "...bgubuuuugb.....",
    "....bbouoobb......",
    "....buu.uub.......",
    "....bww.wwb.......",
    ".....bbbb.bbbb....",
    "..........bbbb....",
  ],
};

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  palette: CharacterPalette,
  dir: Dir,
  stepFrame: number,
  x: number,
  y: number,
  scale = 1,
  noShadow = false
) {
  if (palette.isAsh) {
    let matrix = ASH_SPRITES.down_idle;
    let flip = false;

    const walkCycle = stepFrame % 4;
    if (dir === 'down') {
      matrix =
        walkCycle === 1
          ? ASH_SPRITES.down_step1
          : walkCycle === 3
            ? ASH_SPRITES.down_step2
            : ASH_SPRITES.down_idle;
    } else if (dir === 'up') {
      matrix =
        walkCycle === 1
          ? ASH_SPRITES.up_step1
          : walkCycle === 3
            ? ASH_SPRITES.up_step2
            : ASH_SPRITES.up_idle;
    } else if (dir === 'right') {
      matrix =
        walkCycle === 1
          ? ASH_SPRITES.side_step1
          : walkCycle === 3
            ? ASH_SPRITES.side_step2
            : ASH_SPRITES.side_idle;
      flip = false;
    } else if (dir === 'left') {
      matrix =
        walkCycle === 1
          ? ASH_SPRITES.side_step1
          : walkCycle === 3
            ? ASH_SPRITES.side_step2
            : ASH_SPRITES.side_idle;
      flip = true;
    }

    if (palette.holo) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = '#4cc9f0';
      ctx.shadowBlur = 6;
    }

    if (!noShadow) {
      // Oval ground shadow centered under Ash's feet
      ctx.fillStyle = 'rgba(28, 23, 38, 0.35)';
      ctx.beginPath();
      ctx.ellipse(x + 7 * scale, y + 15 * scale, 7 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawPixelMatrix(ctx, matrix, ASH_PALETTE, x - 1 * scale, y - 4 * scale, scale, flip);

    if (palette.holo) {
      ctx.restore();
    }
    return;
  }

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

  if (!noShadow) {
    // Draw shadow
    ctx.fillStyle = 'rgba(28, 23, 38, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 8 * scale, y + 15 * scale, 6 * scale, 3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPixelMatrix(ctx, matrix, pMap, x + 3 * scale, y + 1 * scale, scale, flip);

  if (palette.holo) {
    ctx.restore();
  }
}

/**
 * Draw the rider character on a Poké Ride mount using the authentic Ash / player sprite (no ground shadow).
 * Accurately centers the rider horizontally on targetCenterX and vertically at targetSeatY.
 * Scaled down to realistic mount proportion (0.40x) with softened opacity (alpha ~0.82) so the mount remains the focus.
 */
export function drawRiderCharacter(
  ctx: CanvasRenderingContext2D,
  palette: CharacterPalette,
  dir: Dir,
  stepFrame: number,
  targetCenterX: number,
  targetSeatY: number,
  scale = 0.40,
  alpha = 0.82
) {
  let riderX: number;
  let riderY: number;

  if (palette.isAsh) {
    const isLeft = dir === 'left';
    riderX = isLeft
      ? Math.round(targetCenterX - 10 * scale)
      : Math.round(targetCenterX - 5 * scale);
    riderY = Math.round(targetSeatY - 14 * scale);
  } else {
    riderX = Math.round(targetCenterX - 8 * scale);
    riderY = Math.round(targetSeatY - 13 * scale);
  }

  ctx.save();
  ctx.globalAlpha = (ctx.globalAlpha ?? 1) * alpha;
  drawCharacter(ctx, palette, dir, stepFrame, riderX, riderY, scale, true);
  ctx.restore();
}


// ==========================================
// LUCARIO (DIGITAL TWIN AURA GUARDIAN)
// ==========================================
export const LUCARIO_PALETTE: Record<string, string> = {
  b: '#0e0c0b', // Black outline
  k: '#333431', // Dark charcoal gray (mask, paws, tail tip, legs)
  u: '#276cbd', // Steel blue / cyan fur (ears, muzzle, arms, hips, thighs)
  c: '#feedd0', // Cream / pale yellow chest fur
  r: '#e02424', // Red eye
  w: '#c8d0d8', // Silver / white metallic spikes (chest & paws)
};

export const LUCARIO_SPRITE: string[] = [
  ".........b.....bb.........",
  "........bub...bub.........",
  "........bub...bub.........",
  "........buub.buub.........",
  "........buubbbuub.........",
  "........bukkkuuub.........",
  ".......buukkuuuukb........",
  ".......buukkuukkkbbb......",
  ".......brkkkkb.kkbkkb.....",
  "......bbrkkkrb.kubkkkb....",
  "......bkkkkkkkkubbbkkb....",
  "..bb..bkkuuuuuubbkbbkb....",
  ".bkkb..bbbuukubbb.bbb.....",
  "bkkkb...bbbbbbckb.........",
  "bkkbubbbuubcccckub....bb..",
  "bbbuuuuuubbccccbuubbbbwb..",
  "..bbbuuubbccwcbbbuuubwwbb.",
  ".....bbb..bcwcb..buuukkkkb",
  ".........bcccccb..bbbkkkkb",
  ".......bbkkccckkb.buubkkb.",
  "......buuukkckkuubuuuubb..",
  ".....buuuuukkkuuuubuubub..",
  ".....buuuuubkuuuuubbb.bb..",
  "......buuub..buuuub.......",
  "......bkkb....bbbbkb......",
  ".....bbkb........bkkb.....",
  "...bbkkkb.........bkkb....",
  "..bkkkkb..........bkkkb...",
  "..bbbbb...........bbkkb...",
];

export function drawLucario(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tick: number,
  scale = 1
) {
  ctx.save();

  // 1. Aura glow ground shadow
  ctx.fillStyle = 'rgba(15, 30, 45, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 8 * scale, y + 15 * scale, 10 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Expanding Aura Pulse Wave (Aura Pokémon Lore)
  const auraPulse = (tick % 100) / 100;
  const auraRadius = 11 + auraPulse * 10;
  const auraAlpha = (1 - auraPulse) * 0.4;
  ctx.strokeStyle = `rgba(56, 189, 248, ${auraAlpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + 8 * scale, y + 2 * scale, auraRadius * scale, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Gentle Breathing Bob
  const bob = Math.sin(tick * 0.06) * 1;

  // 4. Holographic Digital Twin Cyan Glow
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 8;

  // 5. Draw Lucario Pixel Matrix (26x29)
  drawPixelMatrix(
    ctx,
    LUCARIO_SPRITE,
    LUCARIO_PALETTE,
    Math.round(x - 5 * scale),
    Math.round(y - 13 * scale + bob),
    scale
  );

  // 6. Floating Aura Particles (AI Twin energy)
  for (let i = 0; i < 3; i++) {
    const angle = (tick * 0.04 + i * 2.09) % (Math.PI * 2);
    const mx = x + 8 * scale + Math.cos(angle) * 13 * scale;
    const my = y + 2 * scale + Math.sin(angle * 1.4) * 12 * scale;
    const mAlpha = 0.4 + Math.sin(tick * 0.1 + i) * 0.35;
    ctx.fillStyle = `rgba(125, 211, 252, ${mAlpha})`;
    ctx.fillRect(Math.round(mx), Math.round(my), 1.5 * scale, 1.5 * scale);
  }

  ctx.restore();
}
