import type { BuildingLayout } from './townConfig';
import type { Dir } from './types';

export interface PatrolState {
  id: string;
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  moveProgress: number;
  isWalking: boolean;
  orientation: 'N' | 'S' | 'E' | 'W';
  pauseTimer: number;
}

export interface DigimonRenderPose {
  tileX: number;
  tileY: number;
  orientation: 'N' | 'S' | 'E' | 'W';
  isWalking: boolean;
}

const PATROL_STORAGE_KEY = 'digimon:patrol_enabled';

const DIR_CANDIDATES: { dir: Dir; orient: 'N' | 'S' | 'E' | 'W'; dx: number; dy: number }[] = [
  { dir: 'up', orient: 'N', dx: 0, dy: -1 },
  { dir: 'down', orient: 'S', dx: 0, dy: 1 },
  { dir: 'left', orient: 'W', dx: -1, dy: 0 },
  { dir: 'right', orient: 'E', dx: 1, dy: 0 },
];

/**
 * Autonomous 4-direction roaming controller for placed Digimon on /digimon.
 * Stays within a 2-tile habitat radius, avoids portals/players, and snaps cleanly back
 * to canonical Town Editor coordinates whenever Town Editor is active.
 */
export class DigimonPatrolController {
  private states = new Map<string, PatrolState>();
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(PATROL_STORAGE_KEY);
      if (saved === 'false') {
        this.enabled = false;
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean) {
    this.enabled = next;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(PATROL_STORAGE_KEY, next ? 'true' : 'false');
    }
    if (!next) {
      for (const st of this.states.values()) {
        st.x = st.anchorX;
        st.y = st.anchorY;
        st.targetX = st.anchorX;
        st.targetY = st.anchorY;
        st.moveProgress = 0;
        st.isWalking = false;
      }
    }
  }

  public update(
    dt: number,
    entities: BuildingLayout[],
    playerX: number,
    playerY: number,
    editorActive: boolean,
    isBaseTerrainWalkable: (tx: number, ty: number) => boolean
  ): boolean {
    const activeIds = new Set<string>();
    let anyMoving = false;

    for (let idx = 0; idx < entities.length; idx++) {
      const b = entities[idx];
      if (b.kind !== 'digimon' || b.hidden) continue;
      activeIds.add(b.id);

      let st = this.states.get(b.id);
      if (!st || st.anchorX !== b.x || st.anchorY !== b.y) {
        st = {
          id: b.id,
          anchorX: b.x,
          anchorY: b.y,
          x: b.x,
          y: b.y,
          targetX: b.x,
          targetY: b.y,
          moveProgress: 0,
          isWalking: false,
          orientation: b.orientation || 'S',
          pauseTimer: 0.8 + ((idx * 0.7) % 2.4),
        };
        this.states.set(b.id, st);
      }

      if (editorActive || !this.enabled) {
        st.x = b.x;
        st.y = b.y;
        st.targetX = b.x;
        st.targetY = b.y;
        st.moveProgress = 0;
        st.isWalking = false;
        st.orientation = b.orientation || 'S';
        continue;
      }

      if (st.isWalking) {
        anyMoving = true;
        st.moveProgress += dt * 1.55;
        if (st.moveProgress >= 1) {
          st.x = st.targetX;
          st.y = st.targetY;
          st.moveProgress = 0;
          st.isWalking = false;
          st.pauseTimer = 1.6 + Math.random() * 2.4;
        }
        continue;
      }

      st.pauseTimer -= dt;
      if (st.pauseTimer > 0) continue;

      const bw = Math.max(1, b.w || 2);
      const bh = Math.max(1, b.h || 2);

      // Shuffle candidate directions
      const shuffled = [...DIR_CANDIDATES].sort(() => Math.random() - 0.5);
      let moved = false;

      for (const cand of shuffled) {
        const nx = st.x + cand.dx;
        const ny = st.y + cand.dy;
        if (Math.abs(nx - b.x) > 2 || Math.abs(ny - b.y) > 2) continue;

        let footprintClear = true;
        for (let oy = 0; oy < bh && footprintClear; oy++) {
          for (let ox = 0; ox < bw && footprintClear; ox++) {
            const tx = nx + ox;
            const ty = ny + oy;
            // Avoid North Return Gate pad (19..21, 3..5) and Digidex Console (19..20, 20..21)
            if (tx >= 19 && tx <= 21 && ty >= 3 && ty <= 5) {
              footprintClear = false;
              break;
            }
            if (tx === playerX && ty === playerY) {
              footprintClear = false;
              break;
            }
            if (!isBaseTerrainWalkable(tx, ty)) {
              footprintClear = false;
              break;
            }
          }
        }

        if (!footprintClear) continue;

        // Avoid stepping onto other Digimon patrol footprints
        for (const [otherId, otherSt] of this.states.entries()) {
          if (otherId === b.id) continue;
          const ox = otherSt.isWalking ? otherSt.targetX : otherSt.x;
          const oy = otherSt.isWalking ? otherSt.targetY : otherSt.y;
          if (Math.abs(nx - ox) < bw && Math.abs(ny - oy) < bh) {
            footprintClear = false;
            break;
          }
        }

        if (footprintClear) {
          st.orientation = cand.orient;
          st.targetX = nx;
          st.targetY = ny;
          st.moveProgress = 0;
          st.isWalking = true;
          anyMoving = true;
          moved = true;
          break;
        }
      }

      if (!moved) {
        // Look around peacefully when enclosed or next to neighbor
        st.orientation = shuffled[0].orient;
        st.pauseTimer = 1.4 + Math.random() * 1.8;
      }
    }

    for (const id of Array.from(this.states.keys())) {
      if (!activeIds.has(id)) {
        this.states.delete(id);
      }
    }

    return anyMoving;
  }

  public getRenderPose(b: BuildingLayout): DigimonRenderPose {
    const st = this.states.get(b.id);
    if (!st || !this.enabled) {
      return {
        tileX: b.x,
        tileY: b.y,
        orientation: b.orientation || 'S',
        isWalking: false,
      };
    }

    const tileX = st.isWalking
      ? st.x + (st.targetX - st.x) * st.moveProgress
      : st.x;
    const tileY = st.isWalking
      ? st.y + (st.targetY - st.y) * st.moveProgress
      : st.y;

    return {
      tileX,
      tileY,
      orientation: st.orientation,
      isWalking: st.isWalking,
    };
  }

  public getInteractAnchor(b: BuildingLayout): { x: number; y: number; w: number; h: number } {
    const st = this.states.get(b.id);
    if (!st || !this.enabled) {
      return { x: b.x, y: b.y, w: b.w || 2, h: b.h || 2 };
    }
    return {
      x: st.isWalking ? st.targetX : st.x,
      y: st.isWalking ? st.targetY : st.y,
      w: b.w || 2,
      h: b.h || 2,
    };
  }
}

