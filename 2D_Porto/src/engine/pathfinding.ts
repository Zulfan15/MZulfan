import type { Vec } from './types';

export function findPath(
  start: Vec,
  target: Vec,
  collision: Uint8Array,
  mapW: number,
  mapH: number
): Vec[] | null {
  if (start.x === target.x && start.y === target.y) return [];
  
  // If target itself is blocked, check adjacent walkable neighbors of target
  const idx = (x: number, y: number) => y * mapW + x;
  let actualTarget = target;
  
  if (collision[idx(target.x, target.y)] === 1) {
    const neighbors = [
      { x: target.x, y: target.y + 1 },
      { x: target.x, y: target.y - 1 },
      { x: target.x + 1, y: target.y },
      { x: target.x - 1, y: target.y },
    ].filter(n => n.x >= 0 && n.x < mapW && n.y >= 0 && n.y < mapH && collision[idx(n.x, n.y)] === 0);

    if (neighbors.length === 0) return null;
    // pick closest neighbor to start
    neighbors.sort((a, b) => 
      (Math.abs(a.x - start.x) + Math.abs(a.y - start.y)) - (Math.abs(b.x - start.x) + Math.abs(b.y - start.y))
    );
    actualTarget = neighbors[0];
  }

  // BFS search
  const queue: Vec[] = [start];
  const cameFrom = new Int32Array(mapW * mapH).fill(-1);
  const startIdx = idx(start.x, start.y);
  cameFrom[startIdx] = startIdx;

  const targetIdx = idx(actualTarget.x, actualTarget.y);
  let reached = false;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const curIdx = idx(current.x, current.y);

    if (curIdx === targetIdx) {
      reached = true;
      break;
    }

    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const d of dirs) {
      const nx = current.x + d.x;
      const ny = current.y + d.y;
      if (nx < 0 || nx >= mapW || ny < 0 || ny >= mapH) continue;
      const nIdx = idx(nx, ny);
      if (collision[nIdx] === 1 && nIdx !== targetIdx) continue;
      if (cameFrom[nIdx] !== -1) continue;

      cameFrom[nIdx] = curIdx;
      queue.push({ x: nx, y: ny });
    }
  }

  if (!reached) return null;

  // Reconstruct path
  const path: Vec[] = [];
  let curr = targetIdx;
  while (curr !== startIdx) {
    path.push({ x: curr % mapW, y: Math.floor(curr / mapW) });
    curr = cameFrom[curr];
  }
  path.reverse();
  return path;
}
