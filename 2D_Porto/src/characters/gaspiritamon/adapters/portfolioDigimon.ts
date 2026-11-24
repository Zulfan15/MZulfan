import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadGaspiritamon } from '../gaspiritamon.loader';
import { GASPIRITAMON_META } from '../gaspiritamon.meta';

/**
 * Layout inside `adaptGaspiritamonForPortfolio().overworld`:
 * - [0..31]  : walk (`S(0..3), SW(4..7), W(8..11), NW(12..15), N(16..19), NE(20..23), E(24..27), SE(28..31)`) from `walk-cycle.jpg`
 * - [32..39] : Fenrir Maelstrom hammer & spectral wolf battle frames (`0..7`) from `battle.jpg`
 */
export const GASPIRITAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
  back: [16, 17, 18, 19],
  front: [0, 1, 2, 3],
  side: [8, 9, 10, 11],
  west: [8, 9, 10, 11],
  east: [24, 25, 26, 27],
  idle: {
    front: [0],
    west: [8],
    back: [16],
    east: [24],
  },
  action: [32, 33, 34, 35],
  nativeFacing: 'left',
};

export const GASPIRITAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...GASPIRITAMON_META,
  spriteSheetUrl: '/assets/characters/gaspiritamon/gaspiritamon.webp',
  overworldPoseMap: GASPIRITAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `gaspiritamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptGaspiritamonForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadGaspiritamon(undefined, tier);
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle showcases South & South-West HD portraits,
    // while Signature Attack unleashes Fenrir Maelstrom hammer arcs and glacial wolf lunge from `battle.jpg`.
    const largeIdle = [hd[0], hd[1]].filter(Boolean);
    const largeAttack = battleLarge.slice(0, 4);
    const overworld = [...walk, ...battle];

    return {
      id: GASPIRITAMON_META.id,
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
