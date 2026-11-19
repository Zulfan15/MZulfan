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
import { SKY_CASTLE_IMAGE_SRC } from './skyCastleMap';
import type { TownMap } from './types';

let cachedSkyImg: HTMLImageElement | null = null;
let cachedSkyLoaded = false;

/**
 * Renders the 45x60 (720x960 px) Sky Castle floating citadel canvas backed by
 * the bespoke cloud-kingdom illustration, plus Town Editor overrides & entities.
 */
export function createSkyCastleBackgroundCanvas(
  map: TownMap,
  onImageReady?: () => void
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = map.w * TILE_SIZE;
  canvas.height = map.h * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Fallback black backdrop while image decodes
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (typeof Image !== 'undefined') {
    if (!cachedSkyImg) {
      cachedSkyImg = new Image();
      cachedSkyImg.onload = () => {
        cachedSkyLoaded = true;
        onImageReady?.();
      };
      cachedSkyImg.src = SKY_CASTLE_IMAGE_SRC;
    }

    if (cachedSkyLoaded && cachedSkyImg.complete && cachedSkyImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cachedSkyImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (onImageReady) {
      const prevOnload = cachedSkyImg.onload;
      cachedSkyImg.onload = (ev) => {
        cachedSkyLoaded = true;
        if (typeof prevOnload === 'function') {
          prevOnload.call(cachedSkyImg!, ev);
        }
        onImageReady();
      };
    }
  }

  // Optional Town Editor floor overrides & custom entities
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
  // Fences omitted so no iron bar artifacts render over bespoke Sky Castle artwork
  renderConfiguredFlowerBeds(ctx);
  renderManicuredTownTrees(ctx, false);
  renderConfiguredBenchesAndLamps(ctx, false);
  renderConfiguredExtraEntities(ctx);

  return canvas;
}
