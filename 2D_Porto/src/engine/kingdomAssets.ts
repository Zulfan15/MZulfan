import { TILE_SIZE } from './sprites';

function hashTile(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// ═══════════════════════════════════════════════════════════════
// 1. MEDIEVAL FLOOR TILE BRUSHES (Blueprint Ashlar & Garden Palette)
// ═══════════════════════════════════════════════════════════════

export function renderCastleFlagstoneTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tx: number,
  ty: number
) {
  // Warm limestone-slate flagstones matching blueprint courtyard stones
  ctx.fillStyle = (tx + ty) % 2 === 0 ? '#a19893' : '#948b87';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#5c5450';
  ctx.fillRect(px, py + 7, TILE_SIZE, 1);
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
  const shift = ty % 2 === 0 ? 7 : 12;
  ctx.fillRect(px + shift, py, 1, 8);
  ctx.fillRect(px + ((shift + 8) % 15), py + 8, 1, 8);
  // Subtle crisp top highlight & worn center speck
  ctx.fillStyle = '#c4bbb5';
  ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
  ctx.fillRect(px + 1, py + 8, TILE_SIZE - 2, 1);
  if (hashTile(tx, ty) > 0.72) {
    ctx.fillStyle = '#7d7470';
    ctx.fillRect(px + 3, py + 10, 4, 2);
  }
}

export function renderRoyalCarpetTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tx: number,
  ty: number
) {
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(px + 2, py + 1, TILE_SIZE - 4, TILE_SIZE - 2);
  ctx.fillStyle = '#fbbf24';
  if (tx % 3 === 0 || tx === 22) {
    ctx.fillRect(px + 1, py, 2, TILE_SIZE);
    ctx.fillRect(px + TILE_SIZE - 3, py, 2, TILE_SIZE);
  }
  if ((tx + ty) % 2 === 0) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(px + 7, py + 7, 2, 2);
  }
}

export function renderTudorCobbleTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tx: number,
  ty: number
) {
  ctx.fillStyle = '#9e9189';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  const stones = [
    { x: 1, y: 1, w: 6, h: 6, c: '#bcb0a8' },
    { x: 8, y: 1, w: 7, h: 5, c: '#b0a39b' },
    { x: 1, y: 8, w: 8, h: 7, c: '#afa29a' },
    { x: 10, y: 7, w: 5, h: 8, c: '#c2b6ae' },
  ];
  for (const s of stones) {
    ctx.fillStyle = '#5e5550';
    ctx.fillRect(px + s.x, py + s.y, s.w, s.h);
    ctx.fillStyle = s.c;
    ctx.fillRect(px + s.x, py + s.y, s.w - 1, s.h - 1);
  }
  if (hashTile(tx, ty) > 0.85) {
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(px + 6, py + 13, 2, 2);
  }
}

export function renderDrawbridgeWoodTile(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tx: number,
  ty: number
) {
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  for (let p = 0; p < 4; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#85522d' : '#734524';
    ctx.fillRect(px + 1, py + p * 4 + 1, TILE_SIZE - 2, 3);
  }
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 2, py + 2, 2, 12);
  ctx.fillRect(px + TILE_SIZE - 4, py + 2, 2, 12);
  if ((tx + ty) % 2 === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + 2, py + 6, 1, 1);
    ctx.fillRect(px + TILE_SIZE - 4, py + 10, 1, 1);
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. ROYAL ARCHWAY PORTAL PAD (Swirling Sapphire North Gatehouse)
// ═══════════════════════════════════════════════════════════════

export function drawRoyalArchwayPortal(
  ctx: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
  label: string
) {
  const px = tileX * TILE_SIZE;
  const py = tileY * TILE_SIZE;
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;
  const cx = px + w / 2;
  const cy = py + h / 2 - 2;
  const isSapphire = label === 'DIGI GATE';

  ctx.save();
  // Heavy Stone Gatehouse Platform
  ctx.fillStyle = '#334155';
  ctx.fillRect(px - 3, py - 4, w + 6, h + 6);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px - 1, py - 2, w + 2, h + 2);

  // Curved Arched Stone Masonry Frame
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 21, Math.PI, 0);
  ctx.lineTo(cx + 21, py + h);
  ctx.lineTo(cx - 21, py + h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner Swirling Vortex (Sapphire-Cyan for Digi-World Return, Mystic Indigo-Gold on Digimon side)
  const grad = ctx.createRadialGradient(cx, cy + 2, 2, cx, cy + 2, 17);
  if (isSapphire) {
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.35, '#38bdf8');
    grad.addColorStop(0.75, '#0284c7');
    grad.addColorStop(1, '#0c4a6e');
  } else {
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.45, '#a855f7');
    grad.addColorStop(1, '#1e1b4b');
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy + 2, 16, 0, Math.PI * 2);
  ctx.fill();

  // Crisp pixel spiral swirl highlights
  ctx.strokeStyle = isSapphire ? 'rgba(224, 242, 254, 0.85)' : 'rgba(253, 224, 71, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy + 2, 9, 0.3, Math.PI * 1.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + 2, 5, Math.PI * 0.9, Math.PI * 2.1);
  ctx.stroke();

  // Plaque
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5, py + h - 7, w - 10, 7);
  ctx.fillStyle = isSapphire ? '#7dd3fc' : '#fde047';
  ctx.font = 'bold 4.8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, py + h - 2);
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 3. SEVEN MEDIEVAL BUILDINGS (Blueprint Pixel-Art Detail)
// ═══════════════════════════════════════════════════════════════

function drawShingledRoofSpire(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  w: number,
  h: number,
  mainColor: string,
  darkColor: string,
  bannerColor = '#dc2626'
) {
  // Base cone shadow
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx - w / 2, topY + h);
  ctx.lineTo(cx + w / 2, topY + h);
  ctx.closePath();
  ctx.fill();

  // Lit left slate face
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(cx, topY + 2);
  ctx.lineTo(cx - w / 2 + 2, topY + h);
  ctx.lineTo(cx + 1, topY + h);
  ctx.closePath();
  ctx.fill();

  // Tile horizontal courses
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  for (let ry = topY + 6; ry < topY + h - 2; ry += 4) {
    const ratio = (ry - topY) / h;
    const hw = Math.floor((w / 2) * ratio) - 1;
    if (hw > 1) ctx.fillRect(cx - hw, ry, hw * 2, 1);
  }

  // Flagpole & Triangular Pennant
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx, topY - 9, 1.5, 9);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx, topY - 10, 2, 2);
  ctx.fillStyle = bannerColor;
  ctx.beginPath();
  ctx.moveTo(cx + 1.5, topY - 9);
  ctx.lineTo(cx + 10, topY - 7);
  ctx.lineTo(cx + 1.5, topY - 5);
  ctx.closePath();
  ctx.fill();
}

function drawPortcullisDoor(ctx: CanvasRenderingContext2D, dx: number, dy: number, dw = 18, dh = 22) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(dx - 2, dy - 2, dw + 4, dh + 2);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(dx - 1, dy - 1, dw + 2, 3);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(dx, dy, dw, dh);
  // Twin plank doors + iron hinge straps
  ctx.fillStyle = '#78350f';
  ctx.fillRect(dx + 1, dy + 1, Math.floor(dw / 2) - 1, dh - 2);
  ctx.fillRect(dx + Math.floor(dw / 2) + 1, dy + 1, Math.floor(dw / 2) - 2, dh - 2);
  ctx.fillStyle = '#334155';
  ctx.fillRect(dx + 1, dy + 5, dw - 2, 1.5);
  ctx.fillRect(dx + 1, dy + dh - 6, dw - 2, 1.5);
  // Golden ring handles
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(dx + Math.floor(dw / 2) - 3, dy + Math.floor(dh * 0.55), 2, 2);
  ctx.fillRect(dx + Math.floor(dw / 2) + 1, dy + Math.floor(dh * 0.55), 2, 2);
}

export function drawRoyalCastleBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 11,
  hTiles = 9
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  // Drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.36)';
  ctx.fillRect(px - 3, py + H - 5, W + 6, 8);

  // Main Keep Lower Curtain Facade
  const keepY = py + Math.floor(H * 0.38);
  const keepH = H - Math.floor(H * 0.38);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 14, keepY - 2, W - 28, keepH + 2);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 16, keepY, W - 32, keepH - 2);

  // Crisp ashlar stone masonry seams
  ctx.fillStyle = '#64748b';
  for (let sy = keepY + 8; sy < py + H - 6; sy += 8) {
    ctx.fillRect(px + 16, sy, W - 32, 1);
  }

  // Central Upper Royal Keep Hall + Sloped Blue Hip Roof
  const hallW = Math.floor(W * 0.44);
  const hallX = px + Math.floor((W - hallW) / 2);
  const hallY = py + 16;
  ctx.fillStyle = '#475569';
  ctx.fillRect(hallX, hallY, hallW, keepY - hallY + 6);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(hallX + 2, hallY + 2, hallW - 4, keepY - hallY + 4);

  // Blueprint pitched slate-blue upper roof with tiled horizontal seams
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(hallX - 4, hallY + 8);
  ctx.lineTo(hallX + 12, py - 8);
  ctx.lineTo(hallX + hallW - 12, py - 8);
  ctx.lineTo(hallX + hallW + 4, hallY + 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(hallX + 8, py - 2, hallW - 16, 10);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(hallX + 4, py + 4, hallW - 8, 5);

  // Small arched gallery windows on upper hall
  for (const wx of [hallX + 12, hallX + Math.floor(hallW / 2) - 4, hallX + hallW - 20]) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx, hallY + 12, 8, 10);
    ctx.fillStyle = '#475569';
    ctx.fillRect(wx + 2, hallY + 14, 4, 6);
  }

  // Crenellated Merlons across Keep Wall
  for (let bx = px + 34; bx < px + W - 36; bx += 8) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx, keepY - 6, 6, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx + 1, keepY - 5, 4, 4);
  }

  // Twin Cylindrical Flanking Turrets with Red Pennants
  const turW = 30;
  for (const tx of [px + 4, px + W - turW - 4]) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(tx - 1, py + 22, turW + 2, H - 22);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(tx + 1, py + 24, turW - 2, H - 26);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(tx + 3, py + 24, 8, H - 26); // vertical cylinder highlight
    ctx.fillStyle = '#64748b';
    for (let sy = py + 34; sy < py + H - 6; sy += 8) {
      ctx.fillRect(tx + 1, sy, turW - 2, 1);
    }
    for (let cx = tx; cx < tx + turW; cx += 6) {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx, py + 19, 4, 4);
    }
    drawShingledRoofSpire(ctx, tx + turW / 2, py - 4, turW + 8, 25, '#2563eb', '#1e3a8a', '#dc2626');
    // Narrow arrow slit
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tx + turW / 2 - 2, py + 44, 4, 13);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(tx + turW / 2 - 1, py + 46, 2, 9);
  }

  // Twin Red Banners + Royal Blue Shield Crest (matching blueprint facade!)
  for (const bx of [px + Math.floor(W * 0.37), px + Math.floor(W * 0.63) - 8]) {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(bx, keepY + 6, 8, 22);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(bx + 2, keepY + 8, 4, 16);
  }
  // Royal Blue Crown Medallion
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(px + W / 2, keepY + 14, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(px + W / 2, keepY + 14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + W / 2 - 3, keepY + 12, 6, 4);

  // Twin Lion Shield Plaques beside Grand Doors
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + Math.floor(W / 2) - 24, py + H - 24, 10, 12);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + Math.floor(W / 2) + 14, py + H - 24, 10, 12);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + Math.floor(W / 2) - 21, py + H - 21, 4, 6);
  ctx.fillRect(px + Math.floor(W / 2) + 17, py + H - 21, 4, 6);

  // Grand Arched Oak Doors
  drawPortcullisDoor(ctx, px + Math.floor(W / 2) - 12, py + H - 28, 24, 28);
  ctx.restore();
}

export function drawBlacksmithForgeBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 7,
  hTiles = 6
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
  ctx.fillRect(px - 2, py + H - 5, W + 4, 7);

  // Masonry Stone Chimney on Left with Brick Cap
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 10, py - 8, 16, 42);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 12, py - 6, 12, 36);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 9, py - 9, 18, 3);

  // Shingled Slate-Grey Pitched Roof
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(px + 4, py + 32);
  ctx.lineTo(px + 16, py + 6);
  ctx.lineTo(px + W - 12, py + 6);
  ctx.lineTo(px + W - 2, py + 32);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 10, py + 12, W - 20, 18);
  ctx.fillStyle = '#1e293b';
  for (let ry = py + 14; ry < py + 30; ry += 5) {
    ctx.fillRect(px + 8, ry, W - 16, 1);
  }

  // Dark Timber & Stone Forge Body
  const wallY = py + 32;
  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(px + 6, wallY, W - 12, H - 32);
  ctx.fillStyle = '#71717a';
  ctx.fillRect(px + 8, wallY + 2, W - 16, H - 36);

  // Open Arched Hearth glowing bright molten orange/gold
  ctx.fillStyle = '#18181b';
  ctx.fillRect(px + 12, wallY + 12, 20, 20);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 14, wallY + 16, 16, 14);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 17, wallY + 20, 10, 9);

  // Stacked Logs / Iron Bars at Left Front + Wooden Quench Barrel at Right Front
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 6, py + H - 14, 14, 10);
  ctx.fillStyle = '#92400e';
  for (let lx = 0; lx < 3; lx++) {
    ctx.fillRect(px + 7 + lx * 4, py + H - 13, 3, 8);
  }
  // Right Anvil & Quench Tub
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + W - 22, py + H - 12, 12, 8);
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(px + W - 20, py + H - 11, 8, 3);

  // Door
  drawPortcullisDoor(ctx, px + Math.floor(W / 2) - 6, py + H - 22, 16, 22);
  ctx.restore();
}

export function drawMedievalTavernBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 8,
  hTiles = 6
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
  ctx.fillRect(px - 2, py + H - 5, W + 4, 7);

  // Golden Straw-Ochre Tudor Roof (matching blueprint!)
  ctx.fillStyle = '#a16207';
  ctx.beginPath();
  ctx.moveTo(px + 2, py + 34);
  ctx.lineTo(px + 14, py + 4);
  ctx.lineTo(px + W - 14, py + 4);
  ctx.lineTo(px + W - 2, py + 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(px + 10, py + 12, W - 20, 20);
  // Roof wood ridge
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 14, py + 4, W - 28, 3);

  // Cream Plaster Half-Timbered Walls
  const wallY = py + 34;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 4, wallY, W - 8, H - 34);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(px + 7, wallY + 2, W - 14, H - 38);

  // Crisp Dark Timber Beams + Cross Braces
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 6, wallY + 2, W - 12, 3);
  ctx.fillRect(px + 6, wallY + 20, W - 12, 3);
  for (let bx = px + 24; bx < px + W - 10; bx += 22) {
    ctx.fillRect(bx, wallY + 2, 3, H - 38);
  }

  // Warm Glowing Window & Golden Crested Inn Sign
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 12, wallY + 8, 12, 10);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 14, wallY + 9, 8, 8);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px + W - 28, wallY + 12, 14, 9);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + W - 26, wallY + 14, 10, 5);

  // Wooden Ale Barrel on Left Patio
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 6, py + H - 14, 10, 11);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 7, py + H - 13, 8, 9);
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 6, py + H - 11, 10, 1.5);
  ctx.fillRect(px + 6, py + H - 6, 10, 1.5);

  // Oak Inn Door
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + Math.floor(W / 2) - 8, py + H - 22, 16, 22);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(px + Math.floor(W / 2) - 6, py + H - 20, 12, 20);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + Math.floor(W / 2) + 2, py + H - 10, 2, 2);
  ctx.restore();
}

export function drawMageTowerBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 6,
  hTiles = 8
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  const cx = px + W / 2;
  ctx.save();

  // Subtle Arcane Violet Aura mist around tower base & body (from blueprint!)
  const aura = ctx.createRadialGradient(cx, py + Math.floor(H * 0.62), 6, cx, py + Math.floor(H * 0.62), W * 0.56);
  aura.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
  aura.addColorStop(0.7, 'rgba(139, 92, 246, 0.14)');
  aura.addColorStop(1, 'rgba(139, 92, 246, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(cx, py + H - 10, W * 0.62, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tall Cylindrical Grey-Stone Tower
  const towW = W - 18;
  const towX = px + 9;
  const wallY = py + 40;
  ctx.fillStyle = '#334155';
  ctx.fillRect(towX - 2, wallY, towW + 4, H - 40);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(towX, wallY, towW, H - 42);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(towX + 3, wallY, Math.floor(towW * 0.42), H - 42);
  // Cylindrical stone courses
  ctx.fillStyle = '#475569';
  for (let sy = wallY + 10; sy < py + H - 8; sy += 10) {
    ctx.fillRect(towX, sy, towW, 1);
  }

  // Faceted Violet Shingle Conical Spire (no banner; crowned with glowing amethyst tip)
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.moveTo(cx, py - 10);
  ctx.lineTo(px + 2, py + 40);
  ctx.lineTo(px + W - 2, py + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9333ea';
  ctx.beginPath();
  ctx.moveTo(cx, py - 8);
  ctx.lineTo(px + 5, py + 40);
  ctx.lineTo(cx + 2, py + 40);
  ctx.closePath();
  ctx.fill();

  // Crown of Floating Glowing Purple Mana Crystals around Eaves (exact blueprint signature!)
  const crystalPositions = [
    [px + 10, py + 36],
    [px + 22, py + 39],
    [cx - 1, py + 40],
    [px + W - 25, py + 39],
    [px + W - 13, py + 36],
  ];
  for (const [mx, my] of crystalPositions) {
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(mx, my - 5, 4, 8);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(mx + 1, my - 7, 2, 10);
  }

  // Central Glowing Stained-Violet Arcane Window
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(cx - 7, wallY + 18, 14, 18);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(cx - 5, wallY + 20, 10, 14);
  ctx.fillStyle = '#f5d0fe';
  ctx.fillRect(cx - 2, wallY + 23, 4, 8);

  drawPortcullisDoor(ctx, cx - 8, py + H - 22, 16, 22);
  ctx.restore();
}

export function drawKnightsBarracksBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 7,
  hTiles = 7
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  // Sand Training Apron in South Half of Footprint (door & yard matching blueprint!)
  ctx.fillStyle = '#c2a477';
  ctx.fillRect(px + 8, py + H - 36, W - 16, 36);
  ctx.fillStyle = '#a88a5d';
  ctx.fillRect(px + 8, py + H - 36, W - 16, 2);

  // Garrison Hall occupying upper 58% of footprint
  const wallY = py + 24;
  const hallH = H - 56;
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 4, wallY, W - 8, hallH);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 6, wallY + 2, W - 12, hallH - 3);

  // Horizontal Steel-Blue Pitched Roof (matching blueprint!)
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(px + 2, wallY + 2);
  ctx.lineTo(px + 12, py + 4);
  ctx.lineTo(px + W - 12, py + 4);
  ctx.lineTo(px + W - 2, wallY + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + 10, py + 8, W - 20, 14);

  // Small Shield Emblems flanking Arched Door
  drawPortcullisDoor(ctx, px + Math.floor(W / 2) - 8, wallY + hallH - 20, 16, 20);

  // Front Yard Archery Target Bulls-Eye (Left) & Weapon Stand (Right)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(px + 18, py + H - 22, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(px + 18, py + H - 22, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(px + 18, py + H - 22, 2, 0, Math.PI * 2);
  ctx.fill();

  // Spears & Rack on Right Yard
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + W - 26, py + H - 26, 18, 3);
  for (let sx = 0; sx < 4; sx++) {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + W - 24 + sx * 4, py + H - 30, 1.5, 16);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(px + W - 24 + sx * 4, py + H - 33, 2, 3);
  }
  ctx.restore();
}

export function drawJoustingArenaBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 11,
  hTiles = 9
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  // Golden Sand Tournament Lists Yard
  ctx.fillStyle = '#d4b483';
  ctx.fillRect(px + 6, py + 24, W - 12, H - 26);
  ctx.fillStyle = '#c4a26f';
  ctx.fillRect(px + 10, py + 28, W - 20, H - 34);

  // Crimson & Gold Striped Tournament Tent Pavilion across North Edge
  const pavW = W - 28;
  const pavX = px + 14;
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(pavX, py + 4, pavW, 24);
  for (let s = 0; s < pavW; s += 10) {
    ctx.fillStyle = (s / 10) % 2 === 0 ? '#dc2626' : '#fef08a';
    ctx.fillRect(pavX + s, py + 6, Math.min(10, pavW - s), 18);
  }
  // Wooden Pavilion Posts
  ctx.fillStyle = '#78350f';
  ctx.fillRect(pavX + 4, py + 24, 3, 12);
  ctx.fillRect(pavX + Math.floor(pavW / 2), py + 24, 3, 12);
  ctx.fillRect(pavX + pavW - 7, py + 24, 3, 12);

  // Blueprint Prop Details inside Sand Pit: Training Straw Dummy (Left) & Wooden Hobby Horse (Right)
  // Training Dummy
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 34, py + 58, 3, 22);
  ctx.fillRect(px + 28, py + 64, 15, 3);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(px + 31, py + 52, 9, 10);
  // Wooden Jousting Horse on Right
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + W - 48, py + 64, 16, 8);
  ctx.fillRect(px + W - 36, py + 56, 5, 10);
  ctx.fillRect(px + W - 46, py + 72, 2, 9);
  ctx.fillRect(px + W - 36, py + 72, 2, 9);

  // Perimeter Wooden Corral Fence with South Opening
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 4, py + 22, 4, H - 22);
  ctx.fillRect(px + W - 8, py + 22, 4, H - 22);
  ctx.fillRect(px + 4, py + H - 5, Math.floor(W / 2) - 20, 4);
  ctx.fillRect(px + Math.floor(W / 2) + 16, py + H - 5, Math.floor(W / 2) - 20, 4);
  // Fence rail posts
  ctx.fillStyle = '#a16207';
  for (let fy = py + 26; fy < py + H - 6; fy += 12) {
    ctx.fillRect(px + 3, fy, 6, 4);
    ctx.fillRect(px + W - 9, fy, 6, 4);
  }
  ctx.restore();
}

export function drawRoyalChapelBuilding(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  wTiles = 10,
  hTiles = 9
) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
  ctx.fillRect(px - 2, py + H - 5, W + 4, 7);

  // Side Stone Belltower on Left (exact blueprint!)
  const bellW = 30;
  const bellX = px + 6;
  ctx.fillStyle = '#475569';
  ctx.fillRect(bellX, py + 24, bellW, H - 24);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(bellX + 2, py + 26, bellW - 4, H - 28);
  // Open Belfry + Gleaming Golden Bell
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bellX + 7, py + 30, 16, 16);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(bellX + 15, py + 38, 6, Math.PI, 0);
  ctx.lineTo(bellX + 22, py + 44);
  ctx.lineTo(bellX + 8, py + 44);
  ctx.closePath();
  ctx.fill();
  drawShingledRoofSpire(ctx, bellX + bellW / 2, py - 2, bellW + 6, 28, '#2563eb', '#1e3a8a', '#fbbf24');

  // Main Limestone Cathedral Nave (Right 72%)
  const naveX = px + 34;
  const naveW = W - 38;
  const wallY = py + 44;
  ctx.fillStyle = '#64748b';
  ctx.fillRect(naveX, wallY, naveW, H - 44);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(naveX + 2, wallY + 2, naveW - 4, H - 48);

  // Steep Royal-Blue Sanctuary Roof + Golden Cross
  const naveCx = naveX + Math.floor(naveW / 2);
  drawShingledRoofSpire(ctx, naveCx, py - 6, naveW + 6, 52, '#2563eb', '#1e3a8a', '#fbbf24');
  // Golden Cross at Spire Peak
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(naveCx - 1, py - 16, 2, 10);
  ctx.fillRect(naveCx - 4, py - 13, 8, 2);

  // Central Rose Stained-Glass Window
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(naveCx, wallY + 20, 12, 0, Math.PI * 2);
  ctx.fill();
  const roseSlices = ['#ef4444', '#f59e0b', '#38bdf8', '#a855f7'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = roseSlices[i];
    ctx.beginPath();
    ctx.moveTo(naveCx, wallY + 20);
    ctx.arc(naveCx, wallY + 20, 9.5, (i * Math.PI) / 2, ((i + 1) * Math.PI) / 2);
    ctx.closePath();
    ctx.fill();
  }

  // Twin Stained-Glass Lancet Windows flanking Oak Cathedral Doors
  for (const wx of [naveX + 8, naveX + naveW - 18]) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx, py + H - 34, 10, 22);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(wx + 2, py + H - 32, 6, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(wx + 2, py + H - 23, 6, 9);
  }

  drawPortcullisDoor(ctx, naveCx - 10, py + H - 28, 20, 28);
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 4. EIGHT MEDIEVAL PROPS & NPC GUARDIANS
// ═══════════════════════════════════════════════════════════════

export function drawMarketStall(ctx: CanvasRenderingContext2D, px: number, py: number, wTiles = 3, hTiles = 2, orientation = 'S') {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  const isBlue = orientation === 'W' || orientation === 'E';
  const c1 = isBlue ? '#1d4ed8' : '#b91c1c';
  const c2 = '#fef3c7';
  ctx.save();
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(px + 2, py + 4, W - 4, H - 5);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(px + 4, py + H - 12, W - 8, 9);
  // Display wares
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 8, py + H - 14, 5, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(px + 18, py + H - 14, 5, 3);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 28, py + H - 14, 5, 3);
  // Striped canopy awning
  for (let sx = 0; sx < W - 4; sx += 8) {
    ctx.fillStyle = (sx / 8) % 2 === 0 ? c1 : c2;
    ctx.fillRect(px + 2 + sx, py + 1, Math.min(8, W - 4 - sx), 12);
  }
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 1, py + 12, W - 2, 2);
  ctx.restore();
}

export function drawWatchtower(ctx: CanvasRenderingContext2D, px: number, py: number, wTiles = 3, hTiles = 4) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(px, py + H - 5, W, 6);
  ctx.fillStyle = '#475569';
  ctx.fillRect(px + 3, py + 14, W - 6, H - 14);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 5, py + 16, W - 10, H - 18);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 7, py + 16, 10, H - 18);
  for (let bx = px + 2; bx < px + W - 4; bx += 7) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx, py + 10, 5, 6);
  }
  // Conical Steel-Blue Turret with Red Pennant (exact blueprint!)
  drawShingledRoofSpire(ctx, px + W / 2, py - 4, W - 2, 16, '#2563eb', '#1e3a8a', '#dc2626');
  // Arrow slit window
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + W / 2 - 2, py + 28, 4, 10);
  ctx.fillStyle = '#fb923c';
  ctx.fillRect(px + W / 2 - 1, py + 31, 2, 5);
  ctx.restore();
}

export function drawExcaliburShrine(ctx: CanvasRenderingContext2D, px: number, py: number, wTiles = 2, hTiles = 2) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  const cx = px + W / 2;
  const cy = py + H / 2;
  ctx.save();
  // Round Sapphire Stone Fountain Basin
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, W * 0.56, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, W * 0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, W * 0.34, 0, Math.PI * 2);
  ctx.fill();

  // Central Pedestal Rock + Legendary Sword in the Stone
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(cx - 8, cy - 4, 16, 11);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx - 10, cy + 3, 20, 5);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(cx - 1, cy - 17, 3, 15);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 5, cy - 16, 11, 2);
  ctx.fillRect(cx - 1, cy - 20, 3, 4);

  // Carved Stone Knight Statue on Northeast Plinth Rim (blueprint homage!)
  const stX = cx + 22;
  const stY = cy - 10;
  ctx.fillStyle = '#64748b';
  ctx.fillRect(stX - 5, stY + 7, 10, 6);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(stX - 3, stY - 4, 6, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(stX - 2, stY - 8, 5, 4);
  ctx.fillRect(stX + 3, stY - 2, 3, 8);
  ctx.restore();
}

export function drawRoyalBanner(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 7, py + 2, 2, 28);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 6, py + 1, 4, 3);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 4, py + 5, 8, 16);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 6, py + 8, 4, 8);
  ctx.restore();
}

export function drawMedievalBrazier(ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px + 4, py + 7, 8, 8);
  ctx.fillStyle = '#334155';
  ctx.fillRect(px + 3, py + 6, 10, 3);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 4, py + 2, 8, 5);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 6, py + 1, 4, 5);
  ctx.restore();
}

export function drawWeaponRack(ctx: CanvasRenderingContext2D, px: number, py: number, wTiles = 2) {
  const W = wTiles * TILE_SIZE;
  ctx.save();
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(px + 2, py + 4, W - 4, 3);
  ctx.fillRect(px + 3, py + 4, 2, 11);
  ctx.fillRect(px + W - 5, py + 4, 2, 11);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 7, py + 1, 2, 12);
  ctx.fillRect(px + 14, py + 2, 2, 11);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 20, py + 5, 7, 8);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(px + 22, py + 7, 3, 4);
  ctx.restore();
}

export function drawWoodenCart(ctx: CanvasRenderingContext2D, px: number, py: number, wTiles = 2, hTiles = 2) {
  const W = wTiles * TILE_SIZE;
  const H = hTiles * TILE_SIZE;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(px + 2, py + H - 4, W - 4, 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 3, py + 8, W - 6, 14);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 5, py + 10, W - 10, 10);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 6, py + 5, 10, 7);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(px + 18, py + 6, 7, 8);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 5, py + 20, 6, 6);
  ctx.fillRect(px + W - 11, py + 20, 6, 6);
  ctx.restore();
}

export function drawRoyalKnightNpc(ctx: CanvasRenderingContext2D, px: number, py: number, tick = 0) {
  const bob = Math.sin(tick * 0.08) > 0.5 ? -0.5 : 0;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 15, 5.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px + 12, py - 4, 1.5, 19);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(px + 11.5, py - 7, 2.5, 4);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 5, py + 11, 2.5, 4);
  ctx.fillRect(px + 8.5, py + 11, 2.5, 4);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px + 4, py + 5 + bob, 8, 7);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 6, py + 6 + bob, 4, 5);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px + 4.5, py + bob, 7, 5);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 5.5, py + 2 + bob, 5, 1.5);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 7, py - 3 + bob, 2.5, 3);
  ctx.restore();
}

export function renderMedievalBuildingByType(
  ctx: CanvasRenderingContext2D,
  subType: string | undefined,
  px: number,
  py: number,
  wTiles: number,
  hTiles: number
): boolean {
  switch (subType) {
    case 'royal_castle':
      drawRoyalCastleBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'blacksmith_forge':
      drawBlacksmithForgeBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'medieval_tavern':
      drawMedievalTavernBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'mage_tower':
      drawMageTowerBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'knights_barracks':
      drawKnightsBarracksBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'jousting_arena':
      drawJoustingArenaBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    case 'royal_chapel':
      drawRoyalChapelBuilding(ctx, px, py, wTiles, hTiles);
      return true;
    default:
      return false;
  }
}

export function renderMedievalPropByType(
  ctx: CanvasRenderingContext2D,
  subType: string | undefined,
  px: number,
  py: number,
  wTiles: number,
  hTiles: number,
  orientation?: string,
  tick = 0
): boolean {
  switch (subType) {
    case 'market_stall':
      drawMarketStall(ctx, px, py, wTiles, hTiles, orientation);
      return true;
    case 'watchtower':
      drawWatchtower(ctx, px, py, wTiles, hTiles);
      return true;
    case 'excalibur_shrine':
      drawExcaliburShrine(ctx, px, py, wTiles, hTiles);
      return true;
    case 'royal_banner':
      drawRoyalBanner(ctx, px, py);
      return true;
    case 'medieval_brazier':
      drawMedievalBrazier(ctx, px, py);
      return true;
    case 'weapon_rack':
      drawWeaponRack(ctx, px, py, wTiles);
      return true;
    case 'wooden_cart':
      drawWoodenCart(ctx, px, py, wTiles, hTiles);
      return true;
    case 'royal_knight':
      drawRoyalKnightNpc(ctx, px, py, tick);
      return true;
    default:
      return false;
  }
}
