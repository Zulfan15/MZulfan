import { TILE_SIZE } from './sprites';
import { townConfig, type TileTypeKey } from './townConfig';
import {
    renderAllConnectedHedges,
  renderConfiguredBenchesAndLamps,
  renderConfiguredExtraEntities,
  renderConfiguredFlowerBeds,
  renderManicuredTownTrees,
  renderTileOverrideByKey,
} from './townBackground';
import { DARK_CASTLE_IMAGE_SRC } from './darkCastleMap';
import type { TownMap } from './types';

let cachedCastleImg: HTMLImageElement | null = null;
let cachedCastleLoaded = false;

/**
 * Renders the 45x64 (720x1024 px) Dark Castle map backed by the bespoke
 * pixel-art Dark Castle citadel artwork, plus any Town Editor overlays/entities.
 */
export function createDarkCastleBackgroundCanvas(
  map: TownMap,
  onImageReady?: () => void
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = map.w * TILE_SIZE;
  canvas.height = map.h * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Fallback obsidian backdrop while image loads
  ctx.fillStyle = '#090512';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (typeof Image !== 'undefined') {
    if (!cachedCastleImg) {
      cachedCastleImg = new Image();
      cachedCastleImg.onload = () => {
        cachedCastleLoaded = true;
        onImageReady?.();
      };
      cachedCastleImg.src = DARK_CASTLE_IMAGE_SRC;
    }

    if (cachedCastleLoaded && cachedCastleImg.complete && cachedCastleImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cachedCastleImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (onImageReady) {
      const prevOnload = cachedCastleImg.onload;
      cachedCastleImg.onload = (ev) => {
        cachedCastleLoaded = true;
        if (typeof prevOnload === 'function') {
          prevOnload.call(cachedCastleImg!, ev);
        }
        onImageReady();
      };
    }
  }

  // Optional Town Editor floor overrides
  ctx.imageSmoothingEnabled = false;
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const override = townConfig.getTileOverride(x, y);
      if (!override || override === 'hedge' || override === 'fence' || override === 'fence_water') continue;
      if (override === 'solid_override' || override === 'walkable_override') continue;
      renderTileOverrideByKey(ctx, x * TILE_SIZE, y * TILE_SIZE, x, y, override as TileTypeKey);
    }
  }

  renderAllConnectedHedges(ctx, map.w, map.h);
  // Fences omitted so no iron bar artifacts render over bespoke Dark Castle artwork
  renderConfiguredFlowerBeds(ctx);
  renderManicuredTownTrees(ctx, false);
  renderConfiguredBenchesAndLamps(ctx, false);
  renderConfiguredExtraEntities(ctx);

  return canvas;
}
