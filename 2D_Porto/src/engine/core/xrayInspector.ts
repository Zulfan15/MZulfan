import type { TownEngine } from '../TownEngine';
import { Tile } from '../types';
import { TILE_SIZE } from '../sprites';
import { sfx } from '../../game/sfx';
import { townConfig } from '../townConfig';

export function getTileCollisionInfoHelper(engine: TownEngine, x: number, y: number): {
    walkable: boolean;
    reason: string;
    entityId?: string;
    entityName?: string;
    override?: string;
    isBaseBlocked?: boolean;
    isHidden?: boolean;
  } {
    if (x < 0 || x >= engine.map.w || y < 0 || y >= engine.map.h) {
      return { walkable: false, reason: 'Batas Peta (Out of Bounds)' };
    }

    // 0. Check if a hidden entity is located at this tile
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden && x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        return {
          walkable: true,
          reason: `Objek Tersembunyi: ${b.name || b.id}`,
          entityId: b.id,
          entityName: b.name || b.id,
          isHidden: true,
        };
      }
    }

    // 1. Explicit tile override
    const override = townConfig.getTileOverride(x, y);
    if (override === 'walkable_override') {
      return { walkable: true, reason: 'Jalan Dibuka (Walkable Override)', override };
    }
    if (
      override === 'solid_override' ||
      override === 'water' ||
      override === 'shallow_water' ||
      override === 'cliff' ||
      override === 'ledge' ||
      override === 'hedge' ||
      override === 'fence' ||
      override === 'fence_water'
    ) {
      const label =
        override === 'solid_override'
          ? 'Tembok Kustom (Solid Override)'
          : override === 'water'
            ? 'Air Dalam / Laut'
            : override === 'shallow_water'
              ? 'Air Dangkal Karang'
              : override === 'cliff'
                ? 'Tebing Batu (Cliff)'
                : override === 'ledge'
                  ? 'Gundukan Lompat Satu Arah (Ledge ↓)'
                  : override === 'hedge'
                    ? 'Semak Pagar'
                    : override === 'fence'
                      ? 'Pagar Kayu'
                      : 'Pagar Air';
      return { walkable: false, reason: label, override };
    }

    // 2. Dynamic entities from townConfig
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden) continue;

      if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;

      if (b.kind === 'tree') {
        const trunkY = b.y + b.h - 1;
        if (x >= b.x && x < b.x + b.w && y >= trunkY && y < b.y + b.h) {
          return {
            walkable: false,
            reason: `Batang Pohon (${b.name || b.id})`,
            entityId: b.id,
            entityName: b.name || b.id,
          };
        }
        continue;
      }

      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        if (b.kind === 'building') {
          const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
          const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
          const isDoor =
            ((x === doorX || (b.w >= 6 && (x === doorX - 1 || x === doorX + 1))) &&
              (y === doorY || y === b.y + b.h - 1));
          if (isDoor) {
            return {
              walkable: true,
              reason: `Pintu Masuk (${b.name || b.id})`,
              entityId: b.id,
              entityName: b.name || b.id,
            };
          }
          return {
            walkable: false,
            reason: `Dinding Bangunan (${b.name || b.id})`,
            entityId: b.id,
            entityName: b.name || b.id,
          };
        }

        return {
          walkable: false,
          reason: `Objek / Rintangan (${b.name || b.id})`,
          entityId: b.id,
          entityName: b.name || b.id,
        };
      }
    }

    // 3. Tile override clearing base fence
    if (
      override === 'grass' ||
      override === 'cobble' ||
      override === 'lab_paver' ||
      override === 'dev_paver' ||
      override === 'tall_grass'
    ) {
      const baseGround = engine.map.ground[y * engine.map.w + x];
      if (baseGround === Tile.FENCE || ((x === 38 || x === 39) && y === 30)) {
        return { walkable: true, reason: 'Pagar Dibuka Menjadi Jalan', override };
      }
    }

    // 4. Base map terrain collision
    const isBaseBlocked = engine.map.collision[y * engine.map.w + x] !== 0;
    if (isBaseBlocked) {
      const tileType = engine.map.ground[y * engine.map.w + x];
      const groundDesc =
        tileType === Tile.WATER
          ? 'Air Dalam / Sungai'
          : tileType === Tile.SHALLOW_WATER
            ? 'Perairan Dangkal'
            : tileType === Tile.WATERFALL
              ? 'Air Terjun Deras'
              : tileType === Tile.CLIFF
                ? 'Tebing Batu Tinggi'
                : tileType === Tile.LEDGE
                  ? 'Gundukan Lompat Satu Arah (Tekan ↓ dari atas)'
                  : tileType === Tile.FENCE
                    ? 'Pagar Pembatas'
                    : tileType === Tile.TREE
                      ? 'Pohon Rindang'
                      : 'Tembok / Batas Medan Asli';
      return { walkable: false, reason: groundDesc, isBaseBlocked: true };
    }

    return { walkable: true, reason: 'Bisa Dilewati (Lantai / Jalan Bersih)' };
  }

export function handleXrayClickHelper(engine: TownEngine, tileX: number, tileY: number, forceDelete = false): void {
    if (tileX < 0 || tileX >= engine.map.w || tileY < 0 || tileY >= engine.map.h) return;

    // 1. Check if user clicked on a hidden entity -> permanently delete it!
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden && tileX >= b.x && tileX < b.x + b.w && tileY >= b.y && tileY < b.y + b.h) {
        townConfig.purgeBuilding(b.id);
        engine.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🗑️ Objek tersembunyi "${b.name || b.id}" berhasil dihapus permanen!`,
          })
        );
        engine.wake();
        return;
      }
    }

    // 2. Check if an active obstacle entity covers this tile
    let obstacleEntity: any = null;
    for (const b of townConfig.getBuildings(true)) {
      if (b.hidden) continue;
      if (b.id === 'arena' || b.id === 'garden' || b.id === 'contest') continue;
      if (tileX >= b.x && tileX < b.x + b.w && tileY >= b.y && tileY < b.y + b.h) {
        obstacleEntity = b;
        break;
      }
    }

    // If obstacle entity found
    if (obstacleEntity) {
      const isLandmark = obstacleEntity.kind === 'building';
      if (!isLandmark || forceDelete) {
        obstacleEntity.locked = false;
        // Purge permanently so it doesn't leave a ghost hidden box!
        townConfig.purgeBuilding(obstacleEntity.id);
        townConfig.setTileOverride(tileX, tileY, 'walkable_override');
        engine.map.collision[tileY * engine.map.w + tileX] = 0;
        engine.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🗑️ Rintangan "${obstacleEntity.name || obstacleEntity.id}" berhasil dihapus & jalan dibuka!`,
          })
        );
        engine.wake();
        return;
      } else {
        // For landmark building wall, open passage on this tile
        townConfig.setTileOverride(tileX, tileY, 'walkable_override');
        engine.map.collision[tileY * engine.map.w + tileX] = 0;
        engine.townBackgroundCanvas = null;
        sfx.confirm();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🟢 Dinding "${obstacleEntity.name || obstacleEntity.id}" di (${tileX}, ${tileY}) dibuka! Sekarang dapat dilewati.`,
          })
        );
        engine.wake();
        return;
      }
    }

    // If no obstacle entity, check current collision override
    const curOverride = townConfig.getTileOverride(tileX, tileY);
    if (curOverride === 'walkable_override') {
      townConfig.removeTileOverride(tileX, tileY);
      engine.townBackgroundCanvas = null;
      sfx.select();
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `🔄 Koordinat (${tileX}, ${tileY}) dikembalikan ke kondisi awal.`,
        })
      );
      engine.wake();
      return;
    }

    // If tile is blocked by terrain / fence / water / solid override
    if (!engine.isTileWalkable(tileX, tileY)) {
      townConfig.setTileOverride(tileX, tileY, 'walkable_override');
      engine.map.collision[tileY * engine.map.w + tileX] = 0;
      engine.townBackgroundCanvas = null;
      sfx.confirm();
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `🟢 Koordinat (${tileX}, ${tileY}) dibuka! Sekarang dapat dilewati.`,
        })
      );
      engine.wake();
      return;
    }

    // If tile is clean, user can ensure it stays permanently walkable
    townConfig.setTileOverride(tileX, tileY, 'walkable_override');
    sfx.select();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `✅ Koordinat (${tileX}, ${tileY}) ditandai selalu bisa dilewati (Walkable Override).`,
      })
    );
    engine.wake();
  }

export function renderXrayOverlayHelper(engine: TownEngine, ctx: CanvasRenderingContext2D): void {
    if (!engine.isWorldScene()) return;

    // Viewport bounds calculation in world tiles
    const viewW = engine.canvas.width / engine.zoom;
    const viewH = engine.canvas.height / engine.zoom;
    const left = engine.cameraX - viewW / 2;
    const right = engine.cameraX + viewW / 2;
    const top = engine.cameraY - viewH / 2;
    const bottom = engine.cameraY + viewH / 2;

    const minX = Math.max(0, Math.floor(left / TILE_SIZE) - 1);
    const maxX = Math.min(engine.map.w - 1, Math.ceil(right / TILE_SIZE) + 1);
    const minY = Math.max(0, Math.floor(top / TILE_SIZE) - 1);
    const maxY = Math.min(engine.map.h - 1, Math.ceil(bottom / TILE_SIZE) + 1);

    ctx.save();

    // 1. Subtle cyber grid lines across visible viewport
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = minX; x <= maxX + 1; x++) {
      ctx.moveTo(x * TILE_SIZE, minY * TILE_SIZE);
      ctx.lineTo(x * TILE_SIZE, (maxY + 1) * TILE_SIZE);
    }
    for (let y = minY; y <= maxY + 1; y++) {
      ctx.moveTo(minX * TILE_SIZE, y * TILE_SIZE);
      ctx.lineTo((maxX + 1) * TILE_SIZE, y * TILE_SIZE);
    }
    ctx.stroke();

    // 2. Collision tiles overlay (Solid = Red, Walkable Override = Green)
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const override = townConfig.getTileOverride(x, y);
        const walkable = engine.isTileWalkable(x, y);
        const tx = x * TILE_SIZE;
        const ty = y * TILE_SIZE;

        if (override === 'walkable_override') {
          // Explicitly unblocked / opened path
          ctx.fillStyle = 'rgba(16, 185, 129, 0.38)';
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Small checkmark
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(tx + 4, ty + 8);
          ctx.lineTo(tx + 7, ty + 12);
          ctx.lineTo(tx + 12, ty + 4);
          ctx.stroke();
        } else if (!walkable) {
          // Blocked obstacle or solid collision
          ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Diagonal hatch mark
          ctx.beginPath();
          ctx.moveTo(tx + 3, ty + 3);
          ctx.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 3);
          ctx.stroke();
        }
      }
    }

    // 3. Entity wireframes & hidden object highlights
    const allEntities = townConfig.getBuildings(true);
    for (const b of allEntities) {
      if (b.x + b.w < minX || b.x > maxX || b.y + b.h < minY || b.y > maxY) continue;

      const bx = b.x * TILE_SIZE;
      const by = b.y * TILE_SIZE;
      const bw = b.w * TILE_SIZE;
      const bh = b.h * TILE_SIZE;

      if (b.hidden) {
        // Invisible / Hidden Object revealed by X-Ray!
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        ctx.fillStyle = '#f3e8ff';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`👻 [HIDDEN] ${b.name || b.id}`, bx + 2, by + 2);
      } else {
        // Normal entity footprint
        ctx.strokeStyle = b.kind === 'building' ? 'rgba(56, 189, 248, 0.75)' : 'rgba(251, 146, 60, 0.75)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
        ctx.setLineDash([]);

        // Highlight doors if building
        if (b.kind === 'building') {
          const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
          const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h - 1;
          ctx.fillStyle = 'rgba(34, 197, 94, 0.65)';
          ctx.fillRect(doorX * TILE_SIZE + 2, doorY * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1;
          ctx.strokeRect(doorX * TILE_SIZE + 2, doorY * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }
    }

    // 4. Hover tile indicator & floating inspector tooltip card
    if (
      engine.xrayHoverTile &&
      engine.xrayHoverTile.x >= 0 &&
      engine.xrayHoverTile.x < engine.map.w &&
      engine.xrayHoverTile.y >= 0 &&
      engine.xrayHoverTile.y < engine.map.h
    ) {
      const hx = engine.xrayHoverTile.x;
      const hy = engine.xrayHoverTile.y;
      const info = engine.getTileCollisionInfo(hx, hy);

      const hxWorld = hx * TILE_SIZE;
      const hyWorld = hy * TILE_SIZE;

      // Pulsing cursor frame in world coords
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.008);
      ctx.strokeStyle = info.walkable
        ? `rgba(52, 211, 153, ${0.7 + pulse * 0.3})`
        : `rgba(248, 113, 113, ${0.7 + pulse * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(hxWorld, hyWorld, TILE_SIZE, TILE_SIZE);

      // Reset transform to screen/canvas physical coordinates for crystal-clear tooltip rendering
      ctx.restore();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasX = engine.canvas.width / 2 + ((hx + 0.5) * TILE_SIZE - engine.cameraX) * engine.zoom;
      const canvasY = engine.canvas.height / 2 + (hy * TILE_SIZE - engine.cameraY) * engine.zoom;

      const cardW = Math.round(240 * dpr);
      const cardH = Math.round(76 * dpr);
      let cardX = canvasX + 16 * dpr;
      let cardY = canvasY - cardH - 12 * dpr;

      if (cardX + cardW > engine.canvas.width - 12 * dpr) {
        cardX = canvasX - cardW - 16 * dpr;
      }
      if (cardX < 12 * dpr) {
        cardX = 12 * dpr;
      }
      if (cardY < 12 * dpr) {
        cardY = canvasY + 28 * dpr;
      }
      if (cardY + cardH > engine.canvas.height - 12 * dpr) {
        cardY = engine.canvas.height - cardH - 12 * dpr;
      }

      // Rounded tooltip background
      const radius = 8 * dpr;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.94)';
      ctx.strokeStyle = info.isHidden
        ? 'rgba(192, 132, 252, 0.9)'
        : info.walkable
          ? 'rgba(52, 211, 153, 0.8)'
          : 'rgba(248, 113, 113, 0.8)';
      ctx.lineWidth = 1.5 * dpr;

      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + radius, radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH, radius);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - radius, radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.arcTo(cardX, cardY, cardX + radius, cardY, radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tooltip Text Lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Line 1: Header / Coordinate
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(11 * dpr)}px monospace`;
      ctx.fillText(`🔬 X-RAY [${hx}, ${hy}]`, cardX + 10 * dpr, cardY + 8 * dpr);

      // Line 1 Right: Status
      ctx.textAlign = 'right';
      ctx.fillStyle = info.isHidden ? '#c084fc' : info.walkable ? '#34d399' : '#f87171';
      ctx.font = `bold ${Math.round(10 * dpr)}px sans-serif`;
      ctx.fillText(
        info.isHidden ? '👻 TERSEMBUNYI' : info.walkable ? '🟢 BISA DILEWATI' : '⛔ TERHALANG',
        cardX + cardW - 10 * dpr,
        cardY + 9 * dpr
      );

      // Line 2: Reason / Object detail
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f1f5f9';
      ctx.font = `${Math.round(10.5 * dpr)}px sans-serif`;
      const truncatedReason = info.reason.length > 28 ? info.reason.slice(0, 26) + '...' : info.reason;
      ctx.fillText(`Objek: ${truncatedReason}`, cardX + 10 * dpr, cardY + 28 * dpr);

      // Line 3: Action hint
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.round(9.5 * dpr)}px sans-serif`;
      const hint = info.isHidden
        ? '👉 Klik untuk HAPUS PERMANEN objek ini'
        : !info.walkable
          ? '👉 Klik untuk HAPUS / BUKA JALAN'
          : info.override === 'walkable_override'
            ? '👉 Klik untuk reset kondisi asli'
            : '👉 Koordinat bebas halangan';
      ctx.fillText(hint, cardX + 10 * dpr, cardY + 48 * dpr);
    }

    ctx.restore();
  }
