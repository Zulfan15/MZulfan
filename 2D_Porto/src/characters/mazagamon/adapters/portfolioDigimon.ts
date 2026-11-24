import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadMazagamon } from '../mazagamon.loader';
import { MAZAGAMON_META } from '../mazagamon.meta';

/**
 * Layout inside `adaptMazagamonForPortfolio().overworld`:
 * - [0..7]   : idle (`S, SW, W, NW, N, NE, E, SE`) from `idle.png`
 * - [8..39]  : 4-step walk (`S(8..11), SW(12..15), W(16..19), NW(20..23), N(24..27), NE(28..31), E(32..35), SE(36..39)`) from `walk-cycle.jpg`
 * - [40..47] : battle slashes (`0..7`) from `battle.jpg`
 */
export const MAZAGAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
  front: [8, 9, 10, 11],
  west: [16, 17, 18, 19],
  side: [16, 17, 18, 19],
  back: [24, 25, 26, 27],
  east: [32, 33, 34, 35],
  idle: {
    front: [0],
    west: [2],
    back: [4],
    east: [6],
  },
  action: [41, 42, 45, 46],
  nativeFacing: 'left',
};

export const MAZAGAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...MAZAGAMON_META,
  spriteSheetUrl: '/assets/characters/mazagamon/mazagamon.webp',
  overworldPoseMap: MAZAGAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `mazagamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptMazagamonForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadMazagamon(undefined, tier);
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const walkLarge = set.groups.walkLarge ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle loops the South walk stride from `walk-cycle.jpg`,
    // while Signature Attack unleashes the crimson-cyan energy scythe slash from `battle.jpg`.
    const largeIdle =
      walkLarge.length >= 4 ? walkLarge.slice(0, 4) : [hd[0], hd[1]].filter(Boolean);
    const largeAttack = [battleLarge[1], battleLarge[2], battleLarge[5], battleLarge[6]].filter(
      Boolean
    );
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: MAZAGAMON_META.id,
      tier,
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
