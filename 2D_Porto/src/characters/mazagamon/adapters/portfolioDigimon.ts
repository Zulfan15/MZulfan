import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadMazagamon } from '../mazagamon.loader';
import { MAZAGAMON_META } from '../mazagamon.meta';

/**
 * Layout inside `adaptMazagamonForPortfolio().overworld`:
 * - [0..7]   : idle (`S, SW, W, NW, N, NE, E, SE`) from `idle.png`
 * - [8..15]  : high-res combat stride (`S..SE`) from `walk-cycle.jpg`
 * - [16..23] : battle slashes (`0..7`) from `battle.jpg`
 */
export const MAZAGAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
  back: [12, 4],
  front: [8, 0],
  side: [10, 2],
  west: [10, 2],
  east: [14, 6],
  idle: {
    front: [0],
    west: [2],
    back: [4],
    east: [6],
  },
  action: [17, 18, 21, 22],
  nativeFacing: 'left',
};

export const MAZAGAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...MAZAGAMON_META,
  spriteSheetUrl: '/assets/characters/mazagamon/mazagamon.jpg',
  overworldPoseMap: MAZAGAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `mazagamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptMazagamonForPortfolio(): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadMazagamon();
    const idle = set.groups.idle ?? [];
    const walkPose = set.groups.walkPose ?? [];
    const walkLarge = set.groups.walkLarge ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle uses boxed South & South-West sprites from `walk-cycle.jpg`
    // (100% complete wings with zero overlap vs raw mazagamon.jpg), while Signature Attack
    // unleashes the crimson-cyan energy scythe slash from `battle.jpg`.
    const largeIdle =
      walkLarge.length >= 2 ? [walkLarge[0], walkLarge[1]] : [hd[0], hd[1]].filter(Boolean);
    const largeAttack = [battleLarge[1], battleLarge[2], battleLarge[5], battleLarge[6]].filter(
      Boolean
    );
    const overworld = [...idle, ...walkPose, ...battle];

    return {
      id: MAZAGAMON_META.id,
      icon: set.icon,
      iconDataUrl: set.iconDataUrl,
      largeIdle: largeIdle.length > 0 ? largeIdle : overworld.slice(0, 1),
      largeAttack: largeAttack.length > 0 ? largeAttack : battle.slice(0, 2),
      overworld,
      loadedAt: set.loadedAt,
    };
  } catch {
    return null;
  }
}
