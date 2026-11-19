import { TILE_SIZE } from './sprites';
import { townConfig, type TileTypeKey } from './townConfig';
import {
  renderAllConnectedFences,
  renderAllConnectedHedges,
  renderConfiguredBenchesAndLamps,
  renderConfiguredExtraEntities,
  renderConfiguredFlowerBeds,
  renderManicuredTownTrees,
  renderTileOverrideByKey,
} from './townBackground';
import { KINGDOM_IMAGE_SRC } from './kingdomMap';
import type { TownMap } from './types';

let cachedKingdomImg: HTMLImageElement | null = null;
let cachedKingdomLoaded = false;

/**
 * Renders the 45x60 (720x960 px) Royal Kingdom canvas backed by the bespoke
 * pixel-art Royal Kingdom citadel illustration, plus Town Editor overrides & entities.
 */
export function createKingdomBackgroundCanvas(
  map: TownMap,
  onImageReady?: () => void
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = map.w * TILE_SIZE;
  canvas.height = map.h * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Fallback black backdrop while artwork finishes decoding
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (typeof Image !== 'undefined') {
    if (!cachedKingdomImg) {
      cachedKingdomImg = new Image();
      cachedKingdomImg.onload = () => {
        cachedKingdomLoaded = true;
        onImageReady?.();
      };
      cachedKingdomImg.src = KINGDOM_IMAGE_SRC;
    }

    if (cachedKingdomLoaded && cachedKingdomImg.complete && cachedKingdomImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cachedKingdomImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (onImageReady) {
      const prevOnload = cachedKingdomImg.onload;
      cachedKingdomImg.onload = (ev) => {
        cachedKingdomLoaded = true;
        if (typeof prevOnload === 'function') {
          prevOnload.call(cachedKingdomImg!, ev);
        }
        onImageReady();
      };
    }
  }

  // Optional Town Editor 5.0 tile overrides & dynamic entities
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
  // Fences are omitted so no iron bar artifacts render over bespoke Kingdom artwork
  renderConfiguredFlowerBeds(ctx);
  renderManicuredTownTrees(ctx, false);
  renderConfiguredBenchesAndLamps(ctx, false);
  renderConfiguredExtraEntities(ctx);

  return canvas;
}
