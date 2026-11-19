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
import { HARBOUR_IMAGE_SRC } from './harbourMap';
import type { TownMap } from './types';

let cachedHarbourImg: HTMLImageElement | null = null;
let cachedHarbourLoaded = false;

/**
 * Renders the 45x60 (720x960 px) Harbour Town canvas backed by the bespoke
 * pixel-art harbour illustration, plus Town Editor overrides & entities.
 */
export function createHarbourBackgroundCanvas(
  map: TownMap,
  onImageReady?: () => void
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = map.w * TILE_SIZE;
  canvas.height = map.h * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Fallback ocean blue backdrop while image loads
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (typeof Image !== 'undefined') {
    if (!cachedHarbourImg) {
      cachedHarbourImg = new Image();
      cachedHarbourImg.onload = () => {
        cachedHarbourLoaded = true;
        onImageReady?.();
      };
      cachedHarbourImg.src = HARBOUR_IMAGE_SRC;
    }

    if (cachedHarbourLoaded && cachedHarbourImg.complete && cachedHarbourImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cachedHarbourImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (onImageReady) {
      const prevOnload = cachedHarbourImg.onload;
      cachedHarbourImg.onload = (ev) => {
        cachedHarbourLoaded = true;
        if (typeof prevOnload === 'function') {
          prevOnload.call(cachedHarbourImg!, ev);
        }
        onImageReady();
      };
    }
  }

  // Optional Town Editor tile overrides & entities
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
  // Fences omitted so no iron bar artifacts render over bespoke Harbour artwork
  renderConfiguredFlowerBeds(ctx);
  renderManicuredTownTrees(ctx, false);
  renderConfiguredBenchesAndLamps(ctx, false);
  renderConfiguredExtraEntities(ctx);

  return canvas;
}
