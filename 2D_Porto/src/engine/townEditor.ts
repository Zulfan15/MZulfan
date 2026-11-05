import { TILE_SIZE } from './sprites';
import { Tile } from './types';
import {
  townConfig,
  type TileTypeKey,
  type BuildingLayout,
  type TownStateSnapshot,
  TILE_BRUSH_TYPES,
  SPAWNABLE_TEMPLATES,
} from './townConfig';
import type { TownEngine } from './TownEngine';

export type EditorTool =
  | 'move'
  | 'brush'
  | 'erase'
  | 'delete_object'
  | 'line'
  | 'rect'
  | 'bucket'
  | 'eyedropper'
  | 'collision'
  | 'stamp';

export interface TownEditorState {
  enabled: boolean;
  tool: EditorTool;
  brushTile: TileTypeKey;
  brushSize: 1 | 2 | 3;
  selectedBuildingIds: Set<string>;
  hoverTile: { x: number; y: number } | null;
  isMouseDown: boolean;
  isDraggingBuilding: boolean;
  dragStartMouseTile: { x: number; y: number } | null;
  buildingOriginalPositions: Map<
    string,
    {
      x: number;
      y: number;
      doorX?: number;
      doorY?: number;
      labelX?: number;
      labelY?: number;
    }
  >;
  showGrid: boolean;
  showCollisionOverlay: boolean;
  isPlaytesting: boolean;
  shapeStartTile: { x: number; y: number } | null;
  shapeCurrentTile: { x: number; y: number } | null;
  marqueeStartTile: { x: number; y: number } | null;
  marqueeCurrentTile: { x: number; y: number } | null;
  isMarqueeDragging: boolean;
  activeAlignmentGuides: { type: 'x' | 'y'; val: number }[];
  activeDistanceRulers: {
    axis: 'x' | 'y';
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    dist: number;
  }[];
  stampTemplateId: string | null;
}

/** Bresenham line algorithm between two tile coordinates */
function getBresenhamLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    if (currX >= 0 && currX < 45 && currY >= 0 && currY < 64) {
      points.push({ x: currX, y: currY });
    }
    if (currX === x1 && currY === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      currX += sx;
    }
    if (e2 < dx) {
      err += dx;
      currY += sy;
    }
  }
  return points;
}

/** Rectangle bounding-box tile generator */
function getRectPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const minX = Math.max(0, Math.min(x0, x1));
  const maxX = Math.min(44, Math.max(x0, x1));
  const minY = Math.max(0, Math.min(y0, y1));
  const maxY = Math.min(63, Math.max(y0, y1));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      points.push({ x, y });
    }
  }
  return points;
}

/** Multi-tile brush footprint centered or anchored at (cx, cy) */
function getBrushFootprint(
  cx: number,
  cy: number,
  size: 1 | 2 | 3
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  if (size === 1) {
    if (cx >= 0 && cx < 45 && cy >= 0 && cy < 64) points.push({ x: cx, y: cy });
  } else if (size === 2) {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < 45 && y >= 0 && y < 64) points.push({ x, y });
      }
    }
  } else if (size === 3) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < 45 && y >= 0 && y < 64) points.push({ x, y });
      }
    }
  }
  return points;
}

/** Flood Fill BFS algorithm safely capped at maxTiles */
function getFloodFillPoints(
  startX: number,
  startY: number,
  getTargetType: (x: number, y: number) => string,
  newType: string,
  maxTiles = 500
): { x: number; y: number }[] {
  const targetType = getTargetType(startX, startY);
  if (targetType === newType) return [];

  const visited = new Set<string>();
  const results: { x: number; y: number }[] = [];
  const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];
  visited.add(`${startX},${startY}`);

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  while (queue.length > 0 && results.length < maxTiles) {
    const curr = queue.shift()!;
    results.push(curr);

    for (const d of dirs) {
      const nx = curr.x + d.x;
      const ny = curr.y + d.y;
      if (nx < 0 || nx >= 45 || ny < 0 || ny >= 64) continue;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (getTargetType(nx, ny) === targetType) {
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return results;
}

export class TownEditor {
  private engine: TownEngine;
  private isPanning = false;
  private lastScreenX = 0;
  private lastScreenY = 0;
  private preActionSnapshot: TownStateSnapshot | null = null;
  private hasModifiedDuringDrag = false;
  private primaryDragBuildingId: string | null = null;

  private state: TownEditorState = {
    enabled: false,
    tool: 'move',
    brushTile: 'cobble',
    brushSize: 1,
    selectedBuildingIds: new Set<string>(),
    hoverTile: null,
    isMouseDown: false,
    isDraggingBuilding: false,
    dragStartMouseTile: null,
    buildingOriginalPositions: new Map(),
    showGrid: true,
    showCollisionOverlay: false,
    isPlaytesting: false,
    shapeStartTile: null,
    shapeCurrentTile: null,
    marqueeStartTile: null,
    marqueeCurrentTile: null,
    isMarqueeDragging: false,
    activeAlignmentGuides: [],
    activeDistanceRulers: [],
    stampTemplateId: null,
  };

  private draggingSubPin: { id: string; type: 'label' | 'door' } | null = null;
  private clipboard: { item: BuildingLayout; relX: number; relY: number }[] = [];
  private unreachableTargets: { name: string; x: number; y: number }[] = [];
  private transformSnapshots = new Map<
    string,
    {
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      orientation?: 'N' | 'E' | 'S' | 'W';
      doorX?: number;
      doorY?: number;
      labelX?: number;
      labelY?: number;
    }
  >();
  private listeners: (() => void)[] = [];

  constructor(engine: TownEngine) {
    this.engine = engine;
    this.setupKeyboardShortcuts();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    for (const cb of this.listeners) {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    }
  }

  public isEnabled(): boolean {
    return this.state.enabled;
  }

  public toggleEnabled() {
    this.state.enabled = !this.state.enabled;
    if (!this.state.enabled) {
      this.state.selectedBuildingIds.clear();
      this.state.isDraggingBuilding = false;
      this.state.isMouseDown = false;
      this.state.isMarqueeDragging = false;
      this.state.activeAlignmentGuides = [];
      this.state.activeDistanceRulers = [];
      this.draggingSubPin = null;
      this.unreachableTargets = [];
      this.state.isPlaytesting = false;
      this.isPanning = false;
    }
    this.updateCursor();
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
  }

  public isPlaytesting(): boolean {
    return this.state.isPlaytesting;
  }

  public togglePlaytest() {
    this.state.isPlaytesting = !this.state.isPlaytesting;
    if (this.state.isPlaytesting) {
      this.state.selectedBuildingIds.clear();
      this.state.isDraggingBuilding = false;
      this.state.isMarqueeDragging = false;
      this.state.activeAlignmentGuides = [];
      const target = this.state.hoverTile || this.engine.getPlayerPos();
      this.engine.setPlayerTile(target.x, target.y);
      window.dispatchEvent(
        new CustomEvent('town:playtest-toggle', { detail: true })
      );
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: '🎮 Mode Playtest aktif! Tekan P atau E untuk kembali ke editor.',
        })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent('town:playtest-toggle', { detail: false })
      );
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: '🛠️ Kembali ke Town Editor.',
        })
      );
    }
    this.updateCursor();
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
  }

  public updateCursor() {
    const canvas = this.engine.getCanvas();
    if (!this.state.enabled || this.state.isPlaytesting) {
      canvas.style.cursor = '';
      return;
    }
    if (this.isPanning) {
      canvas.style.cursor = 'grabbing';
      return;
    }
    if (this.state.tool === 'brush') {
      canvas.style.cursor = 'crosshair';
      return;
    }
    if (this.state.tool === 'erase') {
      canvas.style.cursor = 'cell';
      return;
    }
    if (this.state.tool === 'delete_object') {
      canvas.style.cursor = 'not-allowed';
      return;
    }
    if (this.state.tool === 'line' || this.state.tool === 'rect') {
      canvas.style.cursor = 'crosshair';
      return;
    }
    if (this.state.tool === 'bucket') {
      canvas.style.cursor = 'copy';
      return;
    }
    if (this.state.tool === 'eyedropper') {
      canvas.style.cursor = 'help';
      return;
    }
    if (this.state.tool === 'collision') {
      canvas.style.cursor = 'pointer';
      return;
    }
    if (this.state.tool === 'stamp') {
      canvas.style.cursor = 'crosshair';
      return;
    }
    if (this.state.tool === 'move') {
      if (this.state.isDraggingBuilding) {
        canvas.style.cursor = 'grabbing';
        return;
      }
      if (this.state.hoverTile) {
        const buildings = townConfig.getBuildings();
        const isOverBuilding = buildings.some(
          (b) =>
            this.state.hoverTile &&
            this.state.hoverTile.x >= b.x &&
            this.state.hoverTile.x < b.x + b.w &&
            this.state.hoverTile.y >= b.y &&
            this.state.hoverTile.y < b.y + b.h
        );
        if (isOverBuilding) {
          canvas.style.cursor = 'grab';
          return;
        }
      }
      canvas.style.cursor = 'default';
    }
  }

  public setTool(tool: EditorTool) {
    this.state.tool = tool;
    if (tool !== 'move') {
      this.state.selectedBuildingIds.clear();
      this.state.activeAlignmentGuides = [];
    }
    if (tool !== 'stamp') {
      this.state.stampTemplateId = null;
    }
    if (tool === 'collision') {
      this.state.showCollisionOverlay = true;
    }
    this.updateCursor();
    this.engine.wake();
    this.notify();
  }

  public setStampTemplate(templateId: string | null) {
    this.state.stampTemplateId = templateId;
    if (templateId) {
      this.setTool('stamp');
    } else if (this.state.tool === 'stamp') {
      this.setTool('move');
    }
  }

  public getStampTemplate(): string | null {
    return this.state.stampTemplateId;
  }

  public getTool(): EditorTool {
    return this.state.tool;
  }

  public setBrushSize(size: 1 | 2 | 3) {
    this.state.brushSize = size;
    this.notify();
    this.engine.wake();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `📐 Ukuran kuas: ${size}×${size}`,
      })
    );
  }

  public getBrushSize(): 1 | 2 | 3 {
    return this.state.brushSize;
  }

  public setBrushTile(tile: TileTypeKey) {
    this.state.brushTile = tile;
    if (
      this.state.tool !== 'brush' &&
      this.state.tool !== 'line' &&
      this.state.tool !== 'rect' &&
      this.state.tool !== 'bucket'
    ) {
      this.state.tool = 'brush';
    }
    this.state.selectedBuildingIds.clear();
    this.updateCursor();
    this.notify();
  }

  public getBrushTile(): TileTypeKey {
    return this.state.brushTile;
  }

  public toggleGrid() {
    this.state.showGrid = !this.state.showGrid;
    this.notify();
    this.engine.wake();
  }

  public isGridVisible(): boolean {
    return this.state.showGrid;
  }

  public toggleCollisionOverlay() {
    this.state.showCollisionOverlay = !this.state.showCollisionOverlay;
    this.notify();
    this.engine.wake();
  }

  public isCollisionOverlayVisible(): boolean {
    return this.state.showCollisionOverlay;
  }

  public getSelectedBuilding(): BuildingLayout | null {
    if (this.state.selectedBuildingIds.size === 0) return null;
    const firstId = this.state.selectedBuildingIds.values().next().value;
    return firstId ? townConfig.getBuilding(firstId) || null : null;
  }

  public getSelectedBuildings(): BuildingLayout[] {
    const list: BuildingLayout[] = [];
    for (const id of this.state.selectedBuildingIds) {
      const b = townConfig.getBuilding(id);
      if (b) list.push(b);
    }
    return list;
  }

  public syncTransformSnapshots() {
    const currentIds = this.state.selectedBuildingIds;
    for (const id of currentIds) {
      if (!this.transformSnapshots.has(id)) {
        const b = townConfig.getBuilding(id);
        if (b) {
          this.transformSnapshots.set(id, {
            id: b.id,
            x: b.x,
            y: b.y,
            w: b.w,
            h: b.h,
            orientation: b.orientation || 'N',
            doorX: b.doorX,
            doorY: b.doorY,
            labelX: b.labelX,
            labelY: b.labelY,
          });
        }
      }
    }
    for (const id of Array.from(this.transformSnapshots.keys())) {
      if (!currentIds.has(id)) {
        this.transformSnapshots.delete(id);
      }
    }
  }

  public selectBuilding(id: string | null) {
    this.state.selectedBuildingIds.clear();
    if (id) {
      this.state.selectedBuildingIds.add(id);
    }
    this.syncTransformSnapshots();
    this.notify();
    this.engine.wake();
  }

  public selectBuildings(ids: string[]) {
    this.state.selectedBuildingIds.clear();
    for (const id of ids) {
      this.state.selectedBuildingIds.add(id);
    }
    this.syncTransformSnapshots();
    this.notify();
    this.engine.wake();
  }

  public duplicateSelected(): BuildingLayout[] {
    if (this.state.selectedBuildingIds.size === 0) return [];
    const ids = Array.from(this.state.selectedBuildingIds);
    const clones = townConfig.duplicateBuildings(ids);
    this.state.selectedBuildingIds.clear();
    for (const c of clones) {
      this.state.selectedBuildingIds.add(c.id);
    }
    this.syncTransformSnapshots();
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `📑 Berhasil menduplikasi ${clones.length} objek!`,
      })
    );
    return clones;
  }

  public rotateSelected() {
    this.rotateSelectedDirection('right');
  }

  public rotateSelectedDirection(dir: 'left' | 'right') {
    if (this.state.selectedBuildingIds.size === 0) return;
    for (const id of this.state.selectedBuildingIds) {
      townConfig.rotateBuildingDirection(id, dir);
    }
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    const label = dir === 'left' ? '⬅️ Hadap Kiri (↶)' : '➡️ Hadap Kanan (↷)';
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `🔄 ${label}`,
      })
    );
  }

  public setSelectedOrientation(orient: 'N' | 'E' | 'S' | 'W') {
    if (this.state.selectedBuildingIds.size === 0) return;
    for (const id of this.state.selectedBuildingIds) {
      townConfig.setBuildingOrientation(id, orient);
    }
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    const orientNames: Record<'N' | 'E' | 'S' | 'W', string> = {
      W: '⬅️ Hadap Kiri (Barat)',
      E: '➡️ Hadap Kanan (Timur)',
      S: '⬇️ Hadap Depan (Selatan)',
      N: '⬆️ Hadap Belakang (Utara)',
    };
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `🧭 Orientasi diubah: ${orientNames[orient]}`,
      })
    );
  }

  public applySelectedTransform() {
    if (this.state.selectedBuildingIds.size === 0) return;
    const count = this.state.selectedBuildingIds.size;
    this.transformSnapshots.clear();
    townConfig.saveToStorage();
    this.state.selectedBuildingIds.clear();
    this.state.activeAlignmentGuides = [];
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `✓ Selesai! Pengaturan ${count} objek telah disimpan.`,
      })
    );
  }

  public cancelSelectedTransform() {
    if (this.state.selectedBuildingIds.size === 0 && this.transformSnapshots.size === 0) return;
    const count = this.transformSnapshots.size;
    for (const [id, snap] of this.transformSnapshots.entries()) {
      const b = townConfig.getBuilding(id);
      if (b) {
        b.x = snap.x;
        b.y = snap.y;
        b.w = snap.w;
        b.h = snap.h;
        b.orientation = snap.orientation;
        b.doorX = snap.doorX;
        b.doorY = snap.doorY;
        b.labelX = snap.labelX;
        b.labelY = snap.labelY;
      }
    }
    this.transformSnapshots.clear();
    townConfig.saveToStorage();
    this.state.selectedBuildingIds.clear();
    this.state.activeAlignmentGuides = [];
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `✕ Perubahan ${count} objek dibatalkan (kembali ke semula).`,
      })
    );
  }

  public deleteSelected() {
    if (this.state.selectedBuildingIds.size === 0) return;
    const ids = Array.from(this.state.selectedBuildingIds);
    townConfig.deleteBuildings(ids);
    this.state.selectedBuildingIds.clear();
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `🗑️ ${ids.length} objek telah dihapus (Gunakan Undo jika salah).`,
      })
    );
  }

  public isSelectedLocked(): boolean {
    if (this.state.selectedBuildingIds.size === 0) return false;
    for (const id of this.state.selectedBuildingIds) {
      const b = townConfig.getBuilding(id);
      if (b?.locked) return true;
    }
    return false;
  }

  public toggleSelectedLock(): boolean {
    if (this.state.selectedBuildingIds.size === 0) return false;
    const currentLocked = this.isSelectedLocked();
    const newLockState = !currentLocked;

    for (const id of this.state.selectedBuildingIds) {
      const b = townConfig.getBuilding(id);
      if (b && !!b.locked !== newLockState) {
        townConfig.toggleBuildingLock(id);
      }
    }

    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: newLockState
          ? '🔒 Objek berhasil DIKUNCI (Tidak dapat digeser/dihapus).'
          : '🔓 Objek berhasil DIBUKA KUNCINYA (Dapat digeser/diedit).',
      })
    );
    this.notify();
    this.engine.wake();
    return newLockState;
  }

  public adjustSelectedZIndex(delta: number) {
    if (this.state.selectedBuildingIds.size === 0) return;
    for (const id of this.state.selectedBuildingIds) {
      townConfig.setBuildingZIndex(id, delta);
    }
    const label = delta > 0 ? 'Maju ke depan (+1)' : 'Mundur ke belakang (-1)';
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `🥞 Urutan Layer diubah: ${label}`,
      })
    );
    this.engine.invalidateBackgroundCanvas();
    this.engine.wake();
    this.notify();
  }

  public validateReachability(): {
    valid: boolean;
    unreachable: { name: string; x: number; y: number }[];
  } {
    const map = this.engine.getMap();
    const spawn = { x: 18, y: 12 };

    const visited = new Set<string>();
    const queue: { x: number; y: number }[] = [spawn];
    visited.add(`${spawn.x},${spawn.y}`);

    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const d of dirs) {
        const nx = curr.x + d.x;
        const ny = curr.y + d.y;
        if (nx < 0 || nx >= map.w || ny < 0 || ny >= map.h) continue;
        const key = `${nx},${ny}`;
        if (visited.has(key)) continue;

        if (this.engine.isWalkable(nx, ny)) {
          visited.add(key);
          queue.push({ x: nx, y: ny });
        }
      }
    }

    const unreachable: { name: string; x: number; y: number }[] = [];
    const buildings = townConfig.getBuildings();

    for (const b of buildings) {
      if (b.hidden) continue;

      if (b.kind === 'building' || b.doorX !== undefined) {
        const dX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
        const dY = b.doorY !== undefined ? b.doorY : b.y + b.h;
        const reachable =
          visited.has(`${dX},${dY}`) ||
          dirs.some((d) => visited.has(`${dX + d.x},${dY + d.y}`));

        if (!reachable) {
          unreachable.push({ name: `Pintu ${b.name}`, x: dX, y: dY });
        }
      } else if (b.kind === 'npc' || b.kind === 'sign') {
        const reachable = dirs.some((d) =>
          visited.has(`${b.x + d.x},${b.y + d.y}`)
        );
        if (!reachable) {
          unreachable.push({ name: b.name, x: b.x, y: b.y });
        }
      }
    }

    this.unreachableTargets = unreachable;
    this.engine.wake();

    if (unreachable.length === 0) {
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: '✅ Semua gedung & NPC dapat dijangkau dari titik awal!',
        })
      );
    } else {
      const names = unreachable
        .map((u) => u.name)
        .slice(0, 3)
        .join(', ');
      const extra =
        unreachable.length > 3 ? ` (+${unreachable.length - 3} lainnya)` : '';
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `⚠️ Jalur Terhalang: ${names}${extra} tidak dapat dijangkau!`,
        })
      );
    }

    return { valid: unreachable.length === 0, unreachable };
  }

  public copySelected(): boolean {
    if (this.state.selectedBuildingIds.size === 0) return false;
    const items: BuildingLayout[] = [];
    let minX = Infinity;
    let minY = Infinity;

    for (const id of this.state.selectedBuildingIds) {
      const b = townConfig.getBuilding(id);
      if (b) {
        items.push({ ...b });
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
      }
    }

    if (items.length === 0) return false;

    this.clipboard = items.map((item) => ({
      item,
      relX: item.x - minX,
      relY: item.y - minY,
    }));

    window.dispatchEvent(
      new CustomEvent('town:editor-toast', {
        detail: `📋 ${items.length} objek disalin ke clipboard! (Tekan Ctrl+V untuk menempel)`,
      })
    );
    return true;
  }

  public pasteClipboard(): boolean {
    if (this.clipboard.length === 0) return false;
    const target = this.state.hoverTile || {
      x: Math.floor(this.engine.getCameraX() / TILE_SIZE),
      y: Math.floor(this.engine.getCameraY() / TILE_SIZE),
    };

    const newIds: string[] = [];
    for (const clip of this.clipboard) {
      const targetX = Math.max(
        0,
        Math.min(45 - clip.item.w, target.x + clip.relX)
      );
      const targetY = Math.max(
        0,
        Math.min(64 - clip.item.h, target.y + clip.relY)
      );

      const clone = townConfig.duplicateBuilding(clip.item.id);
      if (clone) {
        townConfig.setBuildingPos(clone.id, targetX, targetY);
        if (clip.item.doorX !== undefined && clip.item.doorY !== undefined) {
          townConfig.setBuildingDoorPos(
            clone.id,
            targetX + (clip.item.doorX - clip.item.x),
            targetY + (clip.item.doorY - clip.item.y)
          );
        }
        if (clip.item.labelX !== undefined && clip.item.labelY !== undefined) {
          townConfig.setBuildingLabelPos(
            clone.id,
            targetX + (clip.item.labelX - clip.item.x),
            targetY + (clip.item.labelY - clip.item.y)
          );
        }
        if (clip.item.zIndex !== undefined) {
          townConfig.setBuildingZIndex(clone.id, clip.item.zIndex);
        }
        newIds.push(clone.id);
      }
    }

    if (newIds.length > 0) {
      this.state.selectedBuildingIds.clear();
      for (const id of newIds) {
        this.state.selectedBuildingIds.add(id);
      }
      this.notify();
      this.engine.invalidateBackgroundCanvas();
      this.engine.wake();
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `📋 ${newIds.length} objek berhasil ditempel!`,
        })
      );
      return true;
    }
    return false;
  }

  public renderMinimap(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 2; // 45x64 tiles => 90x128 px
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const map = this.engine.getMap();
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 45; x++) {
        const override = townConfig.getTileOverride(x, y);
        let color = '#5aa33a';
        if (override) {
          switch (override) {
            case 'cobble':
            case 'lab_paver':
            case 'dev_paver':
              color = '#8b939c';
              break;
            case 'water':
              color = '#38bdf8';
              break;
            case 'hedge':
              color = '#255e2b';
              break;
            case 'fence':
              color = '#52525b';
              break;
            case 'fence_water':
              color = '#475569';
              break;
            case 'tall_grass':
              color = '#3f7c27';
              break;
            case 'solid_override':
              color = '#dc2626';
              break;
            case 'walkable_override':
              color = '#22c55e';
              break;
            default:
              color = '#5aa33a';
          }
        } else {
          const g = map.ground[y * map.w + x];
          if (g === 1 || g === 8) color = '#9ca3af';
          else if (g === 3) color = '#38bdf8';
          else if (g === 2) color = '#3f7c27';
        }
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    for (const b of townConfig.getBuildings()) {
      if (b.hidden) continue;
      if (b.kind === 'building') {
        ctx.fillStyle = '#b45309';
      } else if (b.kind === 'npc') {
        ctx.fillStyle = '#facc15';
      } else if (b.kind === 'tree' || b.kind === 'bush') {
        ctx.fillStyle = '#1e3a1f';
      } else {
        ctx.fillStyle = '#d97706';
      }
      ctx.fillRect(
        b.x * scale,
        b.y * scale,
        Math.max(1, b.w * scale),
        Math.max(1, b.h * scale)
      );
    }

    const camX = this.engine.getCameraX();
    const camY = this.engine.getCameraY();
    const zoom = this.engine.getZoom();
    const mainCanvas = this.engine.getCanvas();

    const viewWorldW = mainCanvas.width / zoom;
    const viewWorldH = mainCanvas.height / zoom;

    const vpLeft = ((camX - viewWorldW / 2) / TILE_SIZE) * scale;
    const vpTop = ((camY - viewWorldH / 2) / TILE_SIZE) * scale;
    const vpW = (viewWorldW / TILE_SIZE) * scale;
    const vpH = (viewWorldH / TILE_SIZE) * scale;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(vpLeft, vpTop, vpW, vpH);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(vpLeft, vpTop, vpW, vpH);

    // Destination marker on minimap
    const marker = this.engine.getMarker();
    if (marker) {
      const mx = marker.x * scale;
      const my = marker.y * scale;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(mx - 1, my - 1, scale + 2, scale + 2);
    }

    // Player position dot on minimap
    const playerPos = this.engine.getPlayerPos();
    const px = (playerPos.x + 0.5) * scale;
    const py = (playerPos.y + 0.5) * scale;

    // Outer pulse ring
    const pulse = (Math.sin(Date.now() * 0.008) + 1) * 0.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px, py, 3 + pulse * 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Red & white Pokéball dot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Direction indicator pip
    const dir = this.engine.getPlayerDir();
    let dx = 0;
    let dy = 0;
    if (dir === 'up') dy = -4;
    else if (dir === 'down') dy = 4;
    else if (dir === 'left') dx = -4;
    else if (dir === 'right') dx = 4;

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(px + dx, py + dy, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  public panFromMinimap(
    canvasX: number,
    canvasY: number,
    minimapWidth = 90
  ) {
    const scale = minimapWidth / 45;
    const tileX = Math.max(0, Math.min(44, canvasX / scale));
    const tileY = Math.max(0, Math.min(63, canvasY / scale));
    this.engine.setCameraPos(tileX * TILE_SIZE, tileY * TILE_SIZE);
  }

  public async save(): Promise<{ success: boolean; message: string }> {
    this.selectBuilding(null);
    const res = await townConfig.saveToDisk();
    window.dispatchEvent(
      new CustomEvent('town:editor-toast', { detail: res.message })
    );
    return res;
  }

  public getHoverTile(): { x: number; y: number } | null {
    return this.state.hoverTile;
  }

  public getEffectiveTileType(x: number, y: number): TileTypeKey {
    const override = townConfig.getTileOverride(x, y);
    if (override) return override;
    const map = this.engine.getMap();
    if (x < 0 || x >= map.w || y < 0 || y >= map.h) return 'grass';
    const baseVal = map.ground[y * map.w + x];
    if (baseVal === Tile.PATH) return 'cobble';
    if (baseVal === Tile.WATER) return 'water';
    if (baseVal === Tile.FENCE) return 'fence';
    if (baseVal === Tile.TALL) return 'tall_grass';
    return 'grass';
  }

  public eraseTilesBatch(points: { x: number; y: number }[]) {
    const map = this.engine.getMap();
    const toSetGrass: { x: number; y: number; tile: TileTypeKey }[] = [];
    const toRemove: { x: number; y: number }[] = [];

    for (const pt of points) {
      if (pt.x < 0 || pt.x >= map.w || pt.y < 0 || pt.y >= map.h) continue;
      const baseVal = map.ground[pt.y * map.w + pt.x];
      const curOverride = townConfig.getTileOverride(pt.x, pt.y);

      const isSpecialDecorativeTile =
        (pt.x === 39 && pt.y === 5) ||
        (pt.x === 38 && (pt.y === 13 || pt.y === 14 || pt.y === 15)) ||
        ((pt.x === 5 || pt.x === 6) && (pt.y === 51 || pt.y === 52)) ||
        ((pt.x === 38 || pt.x === 39) && (pt.y >= 28 && pt.y <= 32));

      // If base terrain is already natural grass (Tile.GRASS):
      if (baseVal === Tile.GRASS && !isSpecialDecorativeTile) {
        if (curOverride) {
          toRemove.push(pt);
        }
      } else {
        // Base terrain is PATH, WATER, FENCE, sand, or specialized/decorative ground.
        // Erasing floor means turning it into natural meadow grass!
        toSetGrass.push({ x: pt.x, y: pt.y, tile: 'grass' });
      }
    }

    if (toRemove.length > 0) {
      townConfig.removeTileOverridesBatch(toRemove);
    }
    if (toSetGrass.length > 0) {
      townConfig.setTileOverridesBatch(toSetGrass);
    }
  }

  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } | null {
    const canvas = this.engine.getCanvas();
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const px = (screenX - rect.left) * (canvas.width / rect.width);
    const py = (screenY - rect.top) * (canvas.height / rect.height);

    const camX = this.engine.getCameraX();
    const camY = this.engine.getCameraY();
    const zoom = this.engine.getZoom();

    const worldPixelX = (px - canvas.width / 2) / zoom + camX;
    const worldPixelY = (py - canvas.height / 2) / zoom + camY;

    return { x: worldPixelX, y: worldPixelY };
  }

  public screenToTile(
    screenX: number,
    screenY: number
  ): { x: number; y: number } | null {
    const canvas = this.engine.getCanvas();
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const px = (screenX - rect.left) * (canvas.width / rect.width);
    const py = (screenY - rect.top) * (canvas.height / rect.height);

    const camX = this.engine.getCameraX();
    const camY = this.engine.getCameraY();
    const zoom = this.engine.getZoom();

    const worldPixelX = (px - canvas.width / 2) / zoom + camX;
    const worldPixelY = (py - canvas.height / 2) / zoom + camY;

    const tileX = Math.floor(worldPixelX / TILE_SIZE);
    const tileY = Math.floor(worldPixelY / TILE_SIZE);

    if (tileX < 0 || tileX >= 45 || tileY < 0 || tileY >= 64) {
      return null;
    }
    return { x: tileX, y: tileY };
  }

  public handleMouseDown(e: MouseEvent) {
    if (!this.state.enabled || this.state.isPlaytesting) return;

    // Middle click, right click, or Shift+Click in non-move mode = Pan Camera
    if (
      e.button === 1 ||
      e.button === 2 ||
      (e.button === 0 && e.shiftKey && this.state.tool !== 'move')
    ) {
      this.isPanning = true;
      this.lastScreenX = e.clientX;
      this.lastScreenY = e.clientY;
      this.updateCursor();
      this.engine.wake();
      return;
    }

    if (e.button !== 0) return;

    const tile = this.screenToTile(e.clientX, e.clientY);
    if (!tile) return;

    this.state.isMouseDown = true;

    // Alt + Click shortcuts Eyedropper anywhere
    if (e.altKey && this.state.tool !== 'move') {
      this.handleEyedropperSample(tile);
      return;
    }

    if (this.state.tool === 'move') {
      // Check Draggable Sub-Pins (🟣 Label Pin & 🟡 Door Pin) for single selected building
      if (this.state.selectedBuildingIds.size === 1) {
        const selectedId = this.state.selectedBuildingIds.values().next().value;
        const selB = selectedId ? townConfig.getBuilding(selectedId) : null;
        if (selB && !selB.locked) {
          const worldPos = this.screenToWorld(e.clientX, e.clientY);
          if (worldPos) {
            const hasCustomLabel =
              selB.labelX !== undefined &&
              (selB.w <= 1 || Math.abs(selB.labelX - selB.x) > 0.1);
            const labelPinX =
              (hasCustomLabel
                ? selB.labelX!
                : selB.x + selB.w / 2) * TILE_SIZE;
            const labelPinY =
              (hasCustomLabel && selB.labelY !== undefined
                ? selB.labelY
                : selB.y) * TILE_SIZE;
            const distLabel = Math.hypot(
              worldPos.x - labelPinX,
              worldPos.y - labelPinY
            );

            const doorPinX =
              (selB.doorX !== undefined
                ? selB.doorX
                : selB.x + Math.floor(selB.w / 2)) *
                TILE_SIZE +
              TILE_SIZE / 2;
            const doorPinY =
              (selB.doorY !== undefined ? selB.doorY : selB.y + selB.h) *
                TILE_SIZE +
              TILE_SIZE / 2;
            const distDoor = Math.hypot(
              worldPos.x - doorPinX,
              worldPos.y - doorPinY
            );

            const hitRadius = Math.max(10, 14 / this.engine.getZoom());
            if (distLabel <= hitRadius) {
              this.draggingSubPin = { id: selB.id, type: 'label' };
              this.engine.wake();
              return;
            }
            if (distDoor <= hitRadius) {
              this.draggingSubPin = { id: selB.id, type: 'door' };
              this.engine.wake();
              return;
            }
          }
        }
      }

      const buildings = townConfig
        .getBuildings()
        .slice()
        .sort((a, b) => a.w * a.h - b.w * b.h);

      let clickedBuilding: BuildingLayout | null = null;
      for (const b of buildings) {
        if (
          tile.x >= b.x &&
          tile.x < b.x + b.w &&
          tile.y >= b.y &&
          tile.y < b.y + b.h
        ) {
          clickedBuilding = b;
          break;
        }
      }

      if (clickedBuilding) {
        if (clickedBuilding.locked) {
          if (!e.shiftKey) {
            this.state.selectedBuildingIds.clear();
          }
          this.state.selectedBuildingIds.add(clickedBuilding.id);
          this.state.isDraggingBuilding = false;
          this.notify();
          this.engine.wake();
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: `🔒 Objek "${clickedBuilding.name}" terkunci! Tekan K atau tombol Kunci untuk membuka.`,
            })
          );
          return;
        }
        // Alt + Drag: Duplicate selection immediately before moving!
        if (e.altKey) {
          if (!this.state.selectedBuildingIds.has(clickedBuilding.id)) {
            this.state.selectedBuildingIds.clear();
            this.state.selectedBuildingIds.add(clickedBuilding.id);
          }
          this.duplicateSelected();
          // Now clickedBuilding should be the newly cloned item
          clickedBuilding = this.getSelectedBuilding() || clickedBuilding;
        }

        if (e.shiftKey) {
          // Multi-selection toggle
          if (this.state.selectedBuildingIds.has(clickedBuilding.id)) {
            this.state.selectedBuildingIds.delete(clickedBuilding.id);
          } else {
            this.state.selectedBuildingIds.add(clickedBuilding.id);
          }
        } else {
          // If clicking an object that is not yet selected, clear previous and select it
          if (!this.state.selectedBuildingIds.has(clickedBuilding.id)) {
            this.state.selectedBuildingIds.clear();
            this.state.selectedBuildingIds.add(clickedBuilding.id);
          }
        }

        this.syncTransformSnapshots();
        this.primaryDragBuildingId = clickedBuilding.id;
        this.preActionSnapshot = townConfig.captureSnapshot();
        this.hasModifiedDuringDrag = false;
        this.state.isDraggingBuilding = true;
        this.state.dragStartMouseTile = { ...tile };

        // Save original positions, doors, and labels of all selected buildings for batch dragging
        this.state.buildingOriginalPositions.clear();
        for (const id of this.state.selectedBuildingIds) {
          const b = townConfig.getBuilding(id);
          if (b) {
            this.state.buildingOriginalPositions.set(id, {
              x: b.x,
              y: b.y,
              doorX:
                b.doorX !== undefined
                  ? b.doorX
                  : b.kind === 'building'
                  ? b.x + Math.floor(b.w / 2)
                  : undefined,
              doorY:
                b.doorY !== undefined
                  ? b.doorY
                  : b.kind === 'building'
                  ? b.y + b.h
                  : undefined,
              labelX: b.labelX,
              labelY: b.labelY,
            });
          }
        }
      } else {
        // Clicking on empty ground in move tool: start Marquee selection
        if (!e.shiftKey) {
          this.state.selectedBuildingIds.clear();
        }
        this.state.isMarqueeDragging = true;
        this.state.marqueeStartTile = { ...tile };
        this.state.marqueeCurrentTile = { ...tile };
        this.state.isDraggingBuilding = false;
        this.preActionSnapshot = null;
        this.hasModifiedDuringDrag = false;
        this.state.activeAlignmentGuides = [];
      }
      this.updateCursor();
      this.notify();
      this.engine.wake();
    } else if (this.state.tool === 'brush') {
      this.preActionSnapshot = townConfig.captureSnapshot();
      this.hasModifiedDuringDrag = true;
      const footprint = getBrushFootprint(tile.x, tile.y, this.state.brushSize);
      townConfig.setTileOverridesBatch(
        footprint.map((p) => ({ x: p.x, y: p.y, tile: this.state.brushTile }))
      );
      this.engine.invalidateBackgroundCanvas();
      this.engine.wake();
    } else if (this.state.tool === 'delete_object') {
      const buildings = townConfig
        .getBuildings()
        .slice()
        .sort((a, b) => a.w * a.h - b.w * b.h);

      const clickedBuilding = buildings.find(
        (b) =>
          tile.x >= b.x &&
          tile.x < b.x + b.w &&
          tile.y >= b.y &&
          tile.y < b.y + b.h
      );

      if (clickedBuilding) {
        if (clickedBuilding.locked) {
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: `🔒 Objek "${clickedBuilding.name}" terkunci! Buka kuncinya (K) terlebih dahulu untuk menghapusnya.`,
            })
          );
          return;
        }
        const name = clickedBuilding.name;
        townConfig.deleteBuildings([clickedBuilding.id]);
        this.engine.invalidateBackgroundCanvas();
        this.engine.wake();
        this.notify();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🗑️ Objek "${name}" berhasil dihapus. Tekan Undo (Ctrl+Z) untuk membatalkan.`,
          })
        );
      } else {
        // If no building is clicked, check if clicking on a fence, obstacle, road, or decorative tile!
        const curOverride = townConfig.getTileOverride(tile.x, tile.y);
        const map = this.engine.getMap();
        const baseVal =
          tile.x >= 0 && tile.x < map.w && tile.y >= 0 && tile.y < map.h
            ? map.ground[tile.y * map.w + tile.x]
            : Tile.GRASS;

        if (curOverride === 'fence' || curOverride === 'fence_water' || (!curOverride && baseVal === Tile.FENCE)) {
          this.preActionSnapshot = townConfig.captureSnapshot();
          this.eraseTilesBatch([{ x: tile.x, y: tile.y }]);
          this.engine.invalidateBackgroundCanvas();
          this.engine.wake();
          this.notify();
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: `🗑️ Pagar di (${tile.x}, ${tile.y}) berhasil dihapus.`,
            })
          );
        }
      }
      return;
    } else if (this.state.tool === 'erase') {
      this.preActionSnapshot = townConfig.captureSnapshot();
      this.hasModifiedDuringDrag = true;
      const footprint = getBrushFootprint(tile.x, tile.y, this.state.brushSize);
      this.eraseTilesBatch(footprint);
      this.engine.invalidateBackgroundCanvas();
      this.engine.wake();
    } else if (this.state.tool === 'line' || this.state.tool === 'rect') {
      this.preActionSnapshot = townConfig.captureSnapshot();
      this.state.shapeStartTile = { ...tile };
      this.state.shapeCurrentTile = { ...tile };
      this.engine.wake();
    } else if (this.state.tool === 'bucket') {
      this.preActionSnapshot = townConfig.captureSnapshot();
      const points = getFloodFillPoints(
        tile.x,
        tile.y,
        (x, y) => this.getEffectiveTileType(x, y),
        this.state.brushTile,
        500
      );
      if (points.length > 0) {
        townConfig.pushSnapshot(this.preActionSnapshot);
        if (this.state.brushTile === 'grass') {
          this.eraseTilesBatch(points);
        } else {
          townConfig.setTileOverridesBatch(
            points.map((p) => ({ x: p.x, y: p.y, tile: this.state.brushTile }))
          );
        }
        this.engine.invalidateBackgroundCanvas();
        this.engine.wake();
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🪣 Flood fill mengecat ${points.length} petak!`,
          })
        );
      }
    } else if (this.state.tool === 'eyedropper') {
      this.handleEyedropperSample(tile);
    } else if (this.state.tool === 'collision') {
      this.preActionSnapshot = townConfig.captureSnapshot();
      const currentOverride = townConfig.getTileOverride(tile.x, tile.y);
      if (
        currentOverride === 'fence' ||
        currentOverride === 'fence_water' ||
        currentOverride === 'hedge' ||
        currentOverride === 'water'
      ) {
        townConfig.removeTileOverride(tile.x, tile.y);
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🛡️ Petak (${tile.x}, ${tile.y}) diubah menjadi WALKABLE.`,
          })
        );
      } else {
        townConfig.setTileOverride(tile.x, tile.y, 'fence');
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: `🛡️ Petak (${tile.x}, ${tile.y}) diubah menjadi SOLID (Collision).`,
          })
        );
      }
      this.engine.invalidateBackgroundCanvas();
      this.engine.wake();
    } else if (this.state.tool === 'stamp' && this.state.stampTemplateId) {
      const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === this.state.stampTemplateId);
      if (tpl) {
        const newObj = townConfig.spawnObject(tpl.id, tile.x, tile.y);
        if (newObj) {
          this.engine.invalidateBackgroundCanvas();
          this.engine.wake();
          this.notify();
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: `🎯 ${newObj.name} berhasil dicap di (${newObj.x}, ${newObj.y})! Klik lagi untuk pasang lagi, atau tekan ESC / pilih alat lain.`,
            })
          );
        }
      }
    }
  }

  private handleEyedropperSample(tile: { x: number; y: number }) {
    // 1. Check if clicking on an object/building
    const buildings = townConfig
      .getBuildings()
      .slice()
      .sort((a, b) => a.w * a.h - b.w * b.h);
    const clickedBuilding = buildings.find(
      (b) =>
        tile.x >= b.x &&
        tile.x < b.x + b.w &&
        tile.y >= b.y &&
        tile.y < b.y + b.h
    );

    if (clickedBuilding) {
      this.setTool('move');
      this.selectBuilding(clickedBuilding.id);
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `💧 Pipet memilih objek: ${clickedBuilding.name}`,
        })
      );
    } else {
      const tileType = this.getEffectiveTileType(tile.x, tile.y);
      this.setBrushTile(tileType);
      this.setTool('brush');
      const tileName =
        TILE_BRUSH_TYPES.find((t) => t.id === tileType)?.name || tileType;
      window.dispatchEvent(
        new CustomEvent('town:editor-toast', {
          detail: `💧 Pipet menyalin kuas: ${tileName}`,
        })
      );
    }
  }

  public handleMouseMove(e: MouseEvent) {
    if (!this.state.enabled || this.state.isPlaytesting) return;

    if (this.isPanning) {
      const canvas = this.engine.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const zoom = this.engine.getZoom();
      const dx = ((e.clientX - this.lastScreenX) * scaleX) / zoom;
      const dy = ((e.clientY - this.lastScreenY) * scaleY) / zoom;
      this.lastScreenX = e.clientX;
      this.lastScreenY = e.clientY;
      this.engine.panCamera(-dx, -dy);
      this.engine.wake();
      return;
    }

    const tile = this.screenToTile(e.clientX, e.clientY);
    this.state.hoverTile = tile;

    // Handle Sub-Pin Dragging (🟣 Label Pin & 🟡 Door Pin)
    if (this.draggingSubPin) {
      const worldPos = this.screenToWorld(e.clientX, e.clientY);
      if (worldPos) {
        const b = townConfig.getBuilding(this.draggingSubPin.id);
        if (b && !b.locked) {
          if (this.draggingSubPin.type === 'label') {
            const lx = Number((worldPos.x / TILE_SIZE).toFixed(1));
            const ly = Number((worldPos.y / TILE_SIZE).toFixed(1));
            townConfig.setBuildingLabelPos(b.id, lx, ly);
          } else if (this.draggingSubPin.type === 'door') {
            const dx = Math.max(
              0,
              Math.min(44, Math.floor(worldPos.x / TILE_SIZE))
            );
            const dy = Math.max(
              0,
              Math.min(63, Math.floor(worldPos.y / TILE_SIZE))
            );
            townConfig.setBuildingDoorPos(b.id, dx, dy);
          }
          this.engine.wake();
        }
      }
      return;
    }

    if (this.state.isMouseDown && tile) {
      if (
        this.state.tool === 'move' &&
        this.state.isDraggingBuilding &&
        this.state.dragStartMouseTile
      ) {
        const dx = tile.x - this.state.dragStartMouseTile.x;
        const dy = tile.y - this.state.dragStartMouseTile.y;

        const moves: {
          id: string;
          x: number;
          y: number;
          doorX?: number;
          doorY?: number;
          labelX?: number;
          labelY?: number;
        }[] = [];
        for (const [id, orig] of this.state.buildingOriginalPositions) {
          const b = townConfig.getBuilding(id);
          const maxW = b ? b.w : 1;
          const maxH = b ? b.h : 1;
          const nx = Math.max(0, Math.min(45 - maxW, orig.x + dx));
          const ny = Math.max(0, Math.min(64 - maxH, orig.y + dy));
          const actualDx = nx - orig.x;
          const actualDy = ny - orig.y;

          moves.push({
            id,
            x: nx,
            y: ny,
            doorX:
              orig.doorX !== undefined ? orig.doorX + actualDx : undefined,
            doorY:
              orig.doorY !== undefined ? orig.doorY + actualDy : undefined,
            labelX:
              orig.labelX !== undefined
                ? Number((orig.labelX + actualDx).toFixed(1))
                : undefined,
            labelY:
              orig.labelY !== undefined
                ? Number((orig.labelY + actualDy).toFixed(1))
                : undefined,
          });
        }

        if (moves.length > 0) {
          this.hasModifiedDuringDrag = true;
          townConfig.moveBuildingsBatch(moves);
          this.calculateSmartAlignmentGuides();
          this.engine.invalidateBackgroundCanvas();
        }
      } else if (this.state.tool === 'move' && this.state.isMarqueeDragging) {
        this.state.marqueeCurrentTile = { ...tile };
      } else if (this.state.tool === 'brush') {
        this.hasModifiedDuringDrag = true;
        const footprint = getBrushFootprint(
          tile.x,
          tile.y,
          this.state.brushSize
        );
        townConfig.setTileOverridesBatch(
          footprint.map((p) => ({ x: p.x, y: p.y, tile: this.state.brushTile }))
        );
        this.engine.invalidateBackgroundCanvas();
      } else if (this.state.tool === 'erase') {
        this.hasModifiedDuringDrag = true;
        const footprint = getBrushFootprint(
          tile.x,
          tile.y,
          this.state.brushSize
        );
        this.eraseTilesBatch(footprint);
        this.engine.invalidateBackgroundCanvas();
      } else if (this.state.tool === 'line' || this.state.tool === 'rect') {
        this.state.shapeCurrentTile = { ...tile };
      }
    }

    this.updateCursor();
    this.engine.wake();
  }

  private calculateSmartAlignmentGuides() {
    this.state.activeAlignmentGuides = [];
    if (!this.primaryDragBuildingId) return;
    const primary = townConfig.getBuilding(this.primaryDragBuildingId);
    if (!primary) return;

    const otherBuildings = townConfig
      .getBuildings()
      .filter((b) => !this.state.selectedBuildingIds.has(b.id));

    const pLeft = primary.x;
    const pRight = primary.x + primary.w;
    const pCenterX = primary.x + primary.w / 2;
    const pTop = primary.y;
    const pBottom = primary.y + primary.h;
    const pCenterY = primary.y + primary.h / 2;

    const guidesX = new Set<number>();
    const guidesY = new Set<number>();

    for (const other of otherBuildings) {
      const oLeft = other.x;
      const oRight = other.x + other.w;
      const oCenterX = other.x + other.w / 2;
      const oTop = other.y;
      const oBottom = other.y + other.h;
      const oCenterY = other.y + other.h / 2;

      // X alignment checks (Edges and Centers)
      if (Math.abs(pLeft - oLeft) < 0.1) guidesX.add(pLeft);
      if (Math.abs(pRight - oRight) < 0.1) guidesX.add(pRight);
      if (Math.abs(pCenterX - oCenterX) < 0.1) guidesX.add(pCenterX);
      if (Math.abs(pLeft - oRight) < 0.1) guidesX.add(pLeft);
      if (Math.abs(pRight - oLeft) < 0.1) guidesX.add(pRight);

      // Y alignment checks (Edges and Centers)
      if (Math.abs(pTop - oTop) < 0.1) guidesY.add(pTop);
      if (Math.abs(pBottom - oBottom) < 0.1) guidesY.add(pBottom);
      if (Math.abs(pCenterY - oCenterY) < 0.1) guidesY.add(pCenterY);
      if (Math.abs(pTop - oBottom) < 0.1) guidesY.add(pTop);
      if (Math.abs(pBottom - oTop) < 0.1) guidesY.add(pBottom);
    }

    for (const gx of guidesX) {
      this.state.activeAlignmentGuides.push({ type: 'x', val: gx });
    }
    for (const gy of guidesY) {
      this.state.activeAlignmentGuides.push({ type: 'y', val: gy });
    }

    // Smart Distance Ruler calculation
    this.state.activeDistanceRulers = [];
    let closestRight: { dist: number; other: BuildingLayout } | null = null;
    let closestLeft: { dist: number; other: BuildingLayout } | null = null;
    let closestBottom: { dist: number; other: BuildingLayout } | null = null;
    let closestTop: { dist: number; other: BuildingLayout } | null = null;

    for (const other of otherBuildings) {
      const yOverlap =
        Math.max(pTop, other.y) < Math.min(pBottom, other.y + other.h);
      if (yOverlap) {
        if (other.x >= pRight) {
          const dist = other.x - pRight;
          if (!closestRight || dist < closestRight.dist) {
            closestRight = { dist, other };
          }
        } else if (pLeft >= other.x + other.w) {
          const dist = pLeft - (other.x + other.w);
          if (!closestLeft || dist < closestLeft.dist) {
            closestLeft = { dist, other };
          }
        }
      }

      const xOverlap =
        Math.max(pLeft, other.x) < Math.min(pRight, other.x + other.w);
      if (xOverlap) {
        if (other.y >= pBottom) {
          const dist = other.y - pBottom;
          if (!closestBottom || dist < closestBottom.dist) {
            closestBottom = { dist, other };
          }
        } else if (pTop >= other.y + other.h) {
          const dist = pTop - (other.y + other.h);
          if (!closestTop || dist < closestTop.dist) {
            closestTop = { dist, other };
          }
        }
      }
    }

    if (closestRight && closestRight.dist > 0 && closestRight.dist <= 20) {
      const midY =
        (Math.max(pTop, closestRight.other.y) +
          Math.min(pBottom, closestRight.other.y + closestRight.other.h)) /
        2;
      this.state.activeDistanceRulers.push({
        axis: 'x',
        p1: { x: pRight, y: midY },
        p2: { x: closestRight.other.x, y: midY },
        dist: closestRight.dist,
      });
    }
    if (closestLeft && closestLeft.dist > 0 && closestLeft.dist <= 20) {
      const midY =
        (Math.max(pTop, closestLeft.other.y) +
          Math.min(pBottom, closestLeft.other.y + closestLeft.other.h)) /
        2;
      this.state.activeDistanceRulers.push({
        axis: 'x',
        p1: { x: closestLeft.other.x + closestLeft.other.w, y: midY },
        p2: { x: pLeft, y: midY },
        dist: closestLeft.dist,
      });
    }
    if (closestBottom && closestBottom.dist > 0 && closestBottom.dist <= 20) {
      const midX =
        (Math.max(pLeft, closestBottom.other.x) +
          Math.min(pRight, closestBottom.other.x + closestBottom.other.w)) /
        2;
      this.state.activeDistanceRulers.push({
        axis: 'y',
        p1: { x: midX, y: pBottom },
        p2: { x: midX, y: closestBottom.other.y },
        dist: closestBottom.dist,
      });
    }
    if (closestTop && closestTop.dist > 0 && closestTop.dist <= 20) {
      const midX =
        (Math.max(pLeft, closestTop.other.x) +
          Math.min(pRight, closestTop.other.x + closestTop.other.w)) /
        2;
      this.state.activeDistanceRulers.push({
        axis: 'y',
        p1: { x: midX, y: closestTop.other.y + closestTop.other.h },
        p2: { x: midX, y: pTop },
        dist: closestTop.dist,
      });
    }
  }

  public handleMouseUp() {
    if (!this.state.enabled || this.state.isPlaytesting) return;
    if (this.draggingSubPin) {
      this.draggingSubPin = null;
      this.engine.wake();
      return;
    }
    this.isPanning = false;
    this.state.isMouseDown = false;
    this.state.isDraggingBuilding = false;
    this.state.dragStartMouseTile = null;
    this.state.buildingOriginalPositions.clear();
    this.state.activeAlignmentGuides = [];
    this.state.activeDistanceRulers = [];
    this.primaryDragBuildingId = null;

    // Finish marquee selection
    if (
      this.state.isMarqueeDragging &&
      this.state.marqueeStartTile &&
      this.state.marqueeCurrentTile
    ) {
      const minX = Math.min(
        this.state.marqueeStartTile.x,
        this.state.marqueeCurrentTile.x
      );
      const maxX = Math.max(
        this.state.marqueeStartTile.x,
        this.state.marqueeCurrentTile.x
      );
      const minY = Math.min(
        this.state.marqueeStartTile.y,
        this.state.marqueeCurrentTile.y
      );
      const maxY = Math.max(
        this.state.marqueeStartTile.y,
        this.state.marqueeCurrentTile.y
      );

      const buildings = townConfig.getBuildings();
      for (const b of buildings) {
        if (b.locked) continue;
        // Intersects check
        if (
          b.x + b.w > minX &&
          b.x <= maxX &&
          b.y + b.h > minY &&
          b.y <= maxY
        ) {
          this.state.selectedBuildingIds.add(b.id);
        }
      }
      this.state.isMarqueeDragging = false;
      this.state.marqueeStartTile = null;
      this.state.marqueeCurrentTile = null;
      this.syncTransformSnapshots();
      this.notify();
    }

    // Finish shape line / rect tools
    if (this.state.shapeStartTile && this.state.shapeCurrentTile) {
      let points: { x: number; y: number }[] = [];
      if (this.state.tool === 'line') {
        points = getBresenhamLine(
          this.state.shapeStartTile.x,
          this.state.shapeStartTile.y,
          this.state.shapeCurrentTile.x,
          this.state.shapeCurrentTile.y
        );
      } else if (this.state.tool === 'rect') {
        points = getRectPoints(
          this.state.shapeStartTile.x,
          this.state.shapeStartTile.y,
          this.state.shapeCurrentTile.x,
          this.state.shapeCurrentTile.y
        );
      }

      if (points.length > 0 && this.preActionSnapshot) {
        townConfig.pushSnapshot(this.preActionSnapshot);
        if (this.state.brushTile === 'grass') {
          this.eraseTilesBatch(points);
        } else {
          townConfig.setTileOverridesBatch(
            points.map((p) => ({ x: p.x, y: p.y, tile: this.state.brushTile }))
          );
        }
        this.engine.invalidateBackgroundCanvas();
      }
      this.state.shapeStartTile = null;
      this.state.shapeCurrentTile = null;
    }

    if (this.preActionSnapshot && this.hasModifiedDuringDrag) {
      townConfig.pushSnapshot(this.preActionSnapshot);
    }
    this.preActionSnapshot = null;
    this.hasModifiedDuringDrag = false;

    this.updateCursor();
    this.engine.wake();
  }

  public handleWheel(e: WheelEvent) {
    if (!this.state.enabled || this.state.isPlaytesting) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    this.engine.setZoom(this.engine.getZoom() * factor);
  }

  private setupKeyboardShortcuts() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Hotkey to toggle / exit playtest mode
      if (this.state.isPlaytesting) {
        if (
          e.key === 'p' ||
          e.key === 'P' ||
          e.key === 'e' ||
          e.key === 'E' ||
          e.key === 'Escape'
        ) {
          e.preventDefault();
          this.togglePlaytest();
          return;
        }
      }

      if (!this.state.enabled) return;

      // Save to disk with Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.save();
        return;
      }

      // Quick duplicate with Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        this.duplicateSelected();
        return;
      }

      // Clipboard Copy with Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        if (this.state.selectedBuildingIds.size > 0) {
          e.preventDefault();
          this.copySelected();
          return;
        }
      }

      // Clipboard Paste with Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        if (this.clipboard.length > 0) {
          e.preventDefault();
          this.pasteClipboard();
          return;
        }
      }

      // Lock / Unlock toggle with K
      if (e.key === 'k' || e.key === 'K') {
        if (this.state.selectedBuildingIds.size > 0) {
          e.preventDefault();
          this.toggleSelectedLock();
          return;
        }
      }

      // Layer ordering with [ (Send Backward) and ] (Bring Forward)
      if (e.key === '[') {
        if (this.state.selectedBuildingIds.size > 0) {
          e.preventDefault();
          this.adjustSelectedZIndex(-1);
          return;
        }
      }
      if (e.key === ']') {
        if (this.state.selectedBuildingIds.size > 0) {
          e.preventDefault();
          this.adjustSelectedZIndex(1);
          return;
        }
      }

      // Undo with Ctrl+Z / Cmd+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'z' || e.key === 'Z') &&
        !e.shiftKey
      ) {
        e.preventDefault();
        if (townConfig.undo()) {
          this.engine.invalidateBackgroundCanvas();
          this.engine.wake();
          this.notify();
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: '↩ Perubahan dibatalkan (Undo)',
            })
          );
        }
        return;
      }

      // Redo with Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        if (townConfig.redo()) {
          this.engine.invalidateBackgroundCanvas();
          this.engine.wake();
          this.notify();
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: '↪ Perubahan diterapkan kembali (Redo)',
            })
          );
        }
        return;
      }

      // Brush sizes 1, 2, 3
      if (e.key === '1') {
        this.setBrushSize(1);
        return;
      }
      if (e.key === '2') {
        this.setBrushSize(2);
        return;
      }
      if (e.key === '3') {
        this.setBrushSize(3);
        return;
      }

      // Rotate selected props with R (or switch to Rect tool if none selected)
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (this.state.selectedBuildingIds.size > 0) {
          this.rotateSelected();
        } else {
          this.setTool('rect');
          window.dispatchEvent(
            new CustomEvent('town:editor-toast', {
              detail: '⬛ Alat Kotak Fill aktif (Klik & Tarik bounding box).',
            })
          );
        }
        return;
      }

      // Line Tool with L
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        this.setTool('line');
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '📏 Alat Garis Lurus aktif (Klik & Tarik dari A ke B).',
          })
        );
        return;
      }

      // Delete Object Tool with X
      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        this.setTool('delete_object');
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '🗑️ Alat Hapus Objek (X) aktif: Klik langsung objek di peta untuk menghapusnya.',
          })
        );
        return;
      }

      // Paint Bucket Flood Fill with B
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        this.setTool('bucket');
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '🪣 Alat Ember Tumpah (Flood Fill) aktif.',
          })
        );
        return;
      }

      // Eyedropper with I
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        this.setTool('eyedropper');
        window.dispatchEvent(
          new CustomEvent('town:editor-toast', {
            detail: '💧 Pipet aktif: Klik objek atau lantai untuk menyalin.',
          })
        );
        return;
      }

      // Collision Overlay Toggle with C
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        this.toggleCollisionOverlay();
        return;
      }

      // Playtest Toggle with P
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.togglePlaytest();
        return;
      }

      // Move tool with V or M
      if (
        e.key === 'v' ||
        e.key === 'V' ||
        e.key === 'm' ||
        e.key === 'M'
      ) {
        this.setTool('move');
        return;
      }

      // Nudge selected buildings with Arrow Keys
      if (
        this.state.selectedBuildingIds.size > 0 &&
        this.state.tool === 'move'
      ) {
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -1;
        else if (e.key === 'ArrowDown') dy = 1;
        else if (e.key === 'ArrowLeft') dx = -1;
        else if (e.key === 'ArrowRight') dx = 1;

        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          const snap = townConfig.captureSnapshot();
          const moves = Array.from(this.state.selectedBuildingIds).map(
            (id) => {
              const b = townConfig.getBuilding(id)!;
              return {
                id,
                x: b.x + dx,
                y: b.y + dy,
                doorX: b.doorX !== undefined ? b.doorX + dx : undefined,
                doorY: b.doorY !== undefined ? b.doorY + dy : undefined,
                labelX:
                  b.labelX !== undefined
                    ? Number((b.labelX + dx).toFixed(1))
                    : undefined,
                labelY:
                  b.labelY !== undefined
                    ? Number((b.labelY + dy).toFixed(1))
                    : undefined,
              };
            }
          );
          townConfig.moveBuildingsBatch(moves);
          townConfig.pushSnapshot(snap);
          this.engine.invalidateBackgroundCanvas();
          this.notify();
          return;
        }
      }

      // Toggle Grid with G
      if (e.key === 'g' || e.key === 'G') {
        this.toggleGrid();
        return;
      }

      // Delete or Backspace to delete selected buildings/props
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        this.state.selectedBuildingIds.size > 0
      ) {
        e.preventDefault();
        this.deleteSelected();
        return;
      }

      // Enter commits / selesai
      if (e.key === 'Enter' && this.state.selectedBuildingIds.size > 0) {
        e.preventDefault();
        this.applySelectedTransform();
        return;
      }

      // Q or [ to Rotate Left (Hadap Kiri)
      if ((e.key === 'q' || e.key === 'Q') && this.state.selectedBuildingIds.size > 0) {
        e.preventDefault();
        this.rotateSelectedDirection('left');
        return;
      }

      // Escape cancels changes (if any active selection) or deselects
      if (e.key === 'Escape') {
        if (this.state.selectedBuildingIds.size > 0) {
          e.preventDefault();
          this.cancelSelectedTransform();
          return;
        }
        this.state.selectedBuildingIds.clear();
        this.state.activeAlignmentGuides = [];
        this.notify();
      }
    });
  }

  // Render Editor Overlays on top of the town canvas
  public renderOverlay(ctx: CanvasRenderingContext2D) {
    if (!this.state.enabled || this.state.isPlaytesting) return;

    ctx.save();

    // 1. Collision Overlay
    if (this.state.showCollisionOverlay) {
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 45; x++) {
          const isWalk = this.engine.isWalkable(x, y);
          ctx.fillStyle = isWalk
            ? 'rgba(34, 197, 94, 0.22)'
            : 'rgba(239, 68, 68, 0.35)';
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      // Landmark door markers (Yellow) - synchronized dynamically with all buildings
      for (const b of townConfig.getBuildings()) {
        if (b.hidden || b.kind !== 'building') continue;
        const dTileX =
          b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
        const dTileY = b.doorY !== undefined ? b.doorY : b.y + b.h;
        const dx = dTileX * TILE_SIZE;
        const dy = dTileY * TILE_SIZE;
        ctx.fillStyle = 'rgba(234, 179, 8, 0.85)';
        ctx.fillRect(dx + 2, dy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(dx + 2, dy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        if (b.w >= 6) {
          // Double doors (left door tile)
          const d2x = (dTileX - 1) * TILE_SIZE;
          ctx.fillStyle = 'rgba(234, 179, 8, 0.85)';
          ctx.fillRect(d2x + 2, dy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.strokeRect(d2x + 2, dy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }

      // NPC Interaction Markers (Blue)
      const map = this.engine.getMap();
      if (map && map.npcs) {
        for (const npc of map.npcs) {
          const nx = npc.x * TILE_SIZE;
          const ny = npc.y * TILE_SIZE;
          ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
          ctx.fillRect(nx + 3, ny + 3, TILE_SIZE - 6, TILE_SIZE - 6);
        }
      }

      // Custom Collision Overrides (🛑 SOLID vs 🟢 WALKABLE)
      for (const [coord, override] of townConfig.getAllTileOverrides().entries()) {
        const [xs, ys] = coord.split(',');
        const ox = parseInt(xs, 10) * TILE_SIZE;
        const oy = parseInt(ys, 10) * TILE_SIZE;
        if (override === 'solid_override') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.55)';
          ctx.fillRect(ox, oy, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ox + 1, oy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛑', ox + TILE_SIZE / 2, oy + TILE_SIZE / 2);
        } else if (override === 'walkable_override') {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
          ctx.fillRect(ox, oy, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ox + 1, oy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🟢', ox + TILE_SIZE / 2, oy + TILE_SIZE / 2);
        }
      }
    }

    // 2. Grid Lines
    if (this.state.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Vertical lines
      for (let x = 0; x <= 45; x++) {
        ctx.beginPath();
        ctx.moveTo(x * TILE_SIZE, 0);
        ctx.lineTo(x * TILE_SIZE, 64 * TILE_SIZE);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= 64; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE_SIZE);
        ctx.lineTo(45 * TILE_SIZE, y * TILE_SIZE);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 3. Smart Alignment Guidelines (Cyan Dashed Lines)
    if (this.state.activeAlignmentGuides.length > 0) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);

      for (const guide of this.state.activeAlignmentGuides) {
        ctx.beginPath();
        if (guide.type === 'x') {
          const px = guide.val * TILE_SIZE;
          ctx.moveTo(px, 0);
          ctx.lineTo(px, 64 * TILE_SIZE);
        } else {
          const py = guide.val * TILE_SIZE;
          ctx.moveTo(0, py);
          ctx.lineTo(45 * TILE_SIZE, py);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 3b. Smart Distance Ruler (Pill Badges with tile gap measurement)
    if (
      this.state.activeDistanceRulers &&
      this.state.activeDistanceRulers.length > 0
    ) {
      for (const ruler of this.state.activeDistanceRulers) {
        const x1 = ruler.p1.x * TILE_SIZE;
        const y1 = ruler.p1.y * TILE_SIZE;
        const x2 = ruler.p2.x * TILE_SIZE;
        const y2 = ruler.p2.y * TILE_SIZE;

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        if (ruler.axis === 'x') {
          ctx.moveTo(x1, y1 - 4);
          ctx.lineTo(x1, y1 + 4);
          ctx.moveTo(x2, y2 - 4);
          ctx.lineTo(x2, y2 + 4);
        } else {
          ctx.moveTo(x1 - 4, y1);
          ctx.lineTo(x1 + 4, y1);
          ctx.moveTo(x2 - 4, y2);
          ctx.lineTo(x2 + 4, y2);
        }
        ctx.stroke();

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const text =
          ruler.axis === 'x'
            ? `↔ ${ruler.dist} petak`
            : `↕ ${ruler.dist} petak`;
        ctx.font = 'bold 8px monospace';
        const tw = ctx.measureText(text).width + 8;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(midX - tw / 2, midY - 7, tw, 14, 3);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, midX, midY);
      }
    }

    // 4. Marquee Drag Box
    if (
      this.state.isMarqueeDragging &&
      this.state.marqueeStartTile &&
      this.state.marqueeCurrentTile
    ) {
      const minX = Math.min(
        this.state.marqueeStartTile.x,
        this.state.marqueeCurrentTile.x
      );
      const maxX = Math.max(
        this.state.marqueeStartTile.x,
        this.state.marqueeCurrentTile.x
      );
      const minY = Math.min(
        this.state.marqueeStartTile.y,
        this.state.marqueeCurrentTile.y
      );
      const maxY = Math.max(
        this.state.marqueeStartTile.y,
        this.state.marqueeCurrentTile.y
      );

      const mx = minX * TILE_SIZE;
      const my = minY * TILE_SIZE;
      const mw = (maxX - minX + 1) * TILE_SIZE;
      const mh = (maxY - minY + 1) * TILE_SIZE;

      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(mx, my, mw, mh);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(mx, my, mw, mh);
      ctx.setLineDash([]);
    }

    // 5. Live Shape Ghost Preview (Line or Rect)
    if (this.state.shapeStartTile && this.state.shapeCurrentTile) {
      let previewPoints: { x: number; y: number }[] = [];
      if (this.state.tool === 'line') {
        previewPoints = getBresenhamLine(
          this.state.shapeStartTile.x,
          this.state.shapeStartTile.y,
          this.state.shapeCurrentTile.x,
          this.state.shapeCurrentTile.y
        );
      } else if (this.state.tool === 'rect') {
        previewPoints = getRectPoints(
          this.state.shapeStartTile.x,
          this.state.shapeStartTile.y,
          this.state.shapeCurrentTile.x,
          this.state.shapeCurrentTile.y
        );
      }

      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      for (const p of previewPoints) {
        ctx.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // 6. Hover Tile / Multi-Tile Brush Footprint Highlight
    if (
      this.state.hoverTile &&
      !this.state.isDraggingBuilding &&
      !this.state.shapeStartTile
    ) {
      const isBrushLike =
        this.state.tool === 'brush' || this.state.tool === 'erase';
      const footprint = isBrushLike
        ? getBrushFootprint(
            this.state.hoverTile.x,
            this.state.hoverTile.y,
            this.state.brushSize
          )
        : [this.state.hoverTile];

      const isErase = this.state.tool === 'erase';
      const fillColor = isErase
        ? 'rgba(239, 68, 68, 0.35)'
        : 'rgba(56, 189, 248, 0.35)';
      const strokeColor = isErase ? '#ef4444' : '#38bdf8';

      for (const fp of footprint) {
        const hx = fp.x * TILE_SIZE;
        const hy = fp.y * TILE_SIZE;
        ctx.fillStyle = fillColor;
        ctx.fillRect(hx, hy, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(hx, hy, TILE_SIZE, TILE_SIZE);
      }
    }

    // 6b. Delete Object Tool Hover Highlight
    if (this.state.tool === 'delete_object' && this.state.hoverTile) {
      const hTile = this.state.hoverTile;
      const hoveredBuilding = townConfig.getBuildings().find(
        (b) =>
          hTile.x >= b.x &&
          hTile.x < b.x + b.w &&
          hTile.y >= b.y &&
          hTile.y < b.y + b.h
      );
      if (hoveredBuilding) {
        const bx = hoveredBuilding.x * TILE_SIZE;
        const by = hoveredBuilding.y * TILE_SIZE;
        const bw = hoveredBuilding.w * TILE_SIZE;
        const bh = hoveredBuilding.h * TILE_SIZE;

        ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.setLineDash([]);

        const badgeW = Math.max(70, hoveredBuilding.name.length * 6 + 18);
        const badgeH = 15;
        const badgeX = bx + bw / 2 - badgeW / 2;
        const badgeY = by - 18;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 3);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🗑️ Hapus: ${hoveredBuilding.name}`, bx + bw / 2, badgeY + badgeH / 2);
      } else {
        const curOverride = townConfig.getTileOverride(hTile.x, hTile.y);
        const map = this.engine.getMap();
        const baseVal =
          hTile.x >= 0 && hTile.x < map.w && hTile.y >= 0 && hTile.y < map.h
            ? map.ground[hTile.y * map.w + hTile.x]
            : Tile.GRASS;

        if (curOverride === 'fence' || curOverride === 'fence_water' || (!curOverride && baseVal === Tile.FENCE)) {
          const bx = hTile.x * TILE_SIZE;
          const by = hTile.y * TILE_SIZE;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.fillRect(bx, by, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx + 0.5, by + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          const badgeW = 66;
          const badgeH = 14;
          const badgeX = bx + TILE_SIZE / 2 - badgeW / 2;
          const badgeY = by - 16;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 3);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🗑️ Hapus Pagar', bx + TILE_SIZE / 2, badgeY + badgeH / 2);
        }
      }
    }

    // 7. Highlight All Buildings with subtle borders & Golden selection outline
    const buildings = townConfig.getBuildings();
    for (const b of buildings) {
      const isSelected = this.state.selectedBuildingIds.has(b.id);
      const bx = b.x * TILE_SIZE;
      const by = b.y * TILE_SIZE;
      const bw = b.w * TILE_SIZE;
      const bh = b.h * TILE_SIZE;

      if (isSelected) {
        // Glowing gold dashed selection outline
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(bx - 2, by - 2, bw + 4, bh + 4);
        ctx.setLineDash([]);

        // Corner handles
        ctx.fillStyle = '#f59e0b';
        const hs = 4;
        ctx.fillRect(bx - 2 - hs / 2, by - 2 - hs / 2, hs, hs);
        ctx.fillRect(bx + bw + 2 - hs / 2, by - 2 - hs / 2, hs, hs);
        ctx.fillRect(bx - 2 - hs / 2, by + bh + 2 - hs / 2, hs, hs);
        ctx.fillRect(bx + bw + 2 - hs / 2, by + bh + 2 - hs / 2, hs, hs);

        // Building Info Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        const badgeWidth = Math.max(bw, 130);
        ctx.roundRect(bx, by - 16, badgeWidth, 14, 3);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const orientLabel =
          b.orientation === 'W'
            ? ' ⬅️ Kiri'
            : b.orientation === 'E'
            ? ' ➡️ Kanan'
            : b.orientation === 'S'
            ? ' ⬇️ Depan'
            : b.orientation === 'N'
            ? ' ⬆️ Belakang'
            : '';
        const orientStr = b.orientation ? ` [${b.orientation}${orientLabel}]` : '';
        const zStr = b.zIndex ? ` (Z:${b.zIndex})` : '';
        ctx.fillText(
          `📍 ${b.name}: (${b.x}, ${b.y})${orientStr}${zStr}`,
          bx + 4,
          by - 9
        );

        // Direction facing pointer on selection box
        const orient = b.orientation || 'N';
        ctx.fillStyle = '#38bdf8';
        if (orient === 'W') {
          ctx.beginPath();
          ctx.moveTo(bx - 3, by + bh / 2);
          ctx.lineTo(bx + 4, by + bh / 2 - 4);
          ctx.lineTo(bx + 4, by + bh / 2 + 4);
          ctx.closePath();
          ctx.fill();
        } else if (orient === 'E') {
          ctx.beginPath();
          ctx.moveTo(bx + bw + 3, by + bh / 2);
          ctx.lineTo(bx + bw - 4, by + bh / 2 - 4);
          ctx.lineTo(bx + bw - 4, by + bh / 2 + 4);
          ctx.closePath();
          ctx.fill();
        } else if (orient === 'N') {
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, by - 3);
          ctx.lineTo(bx + bw / 2 - 4, by + 4);
          ctx.lineTo(bx + bw / 2 + 4, by + 4);
          ctx.closePath();
          ctx.fill();
        } else if (orient === 'S') {
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, by + bh + 3);
          ctx.lineTo(bx + bw / 2 - 4, by + bh - 4);
          ctx.lineTo(bx + bw / 2 + 4, by + bh - 4);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        const isHovered =
          this.state.hoverTile &&
          this.state.hoverTile.x >= b.x &&
          this.state.hoverTile.x < b.x + b.w &&
          this.state.hoverTile.y >= b.y &&
          this.state.hoverTile.y < b.y + b.h;

        if (b.kind === 'building' || isHovered) {
          ctx.strokeStyle = isHovered
            ? 'rgba(56, 189, 248, 0.75)'
            : 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = isHovered ? 1.5 : 1;
          ctx.strokeRect(bx, by, bw, bh);
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.fillRect(bx, by, 2, 2);
          ctx.fillRect(bx + bw - 2, by, 2, 2);
          ctx.fillRect(bx, by + bh - 2, 2, 2);
          ctx.fillRect(bx + bw - 2, by + bh - 2, 2, 2);
        }
      }

      // Lock Badge (🔒) on locked objects
      if (b.locked) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.beginPath();
        ctx.roundRect(bx + bw - 16, by - 4, 14, 14, 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', bx + bw - 9, by + 3);
      }
    }

    // 7b. Draggable Sub-Pins (🟣 Label Pin & 🟡 Door Pin) for selected building
    if (this.state.selectedBuildingIds.size === 1) {
      const selId = this.state.selectedBuildingIds.values().next().value;
      const selB = selId ? townConfig.getBuilding(selId) : null;
      if (selB && !selB.locked) {
        const bx = selB.x * TILE_SIZE;
        const by = selB.y * TILE_SIZE;
        const bw = selB.w * TILE_SIZE;
        const bh = selB.h * TILE_SIZE;

        // 🟣 Label Pin
        const hasCustomLabel =
          selB.labelX !== undefined &&
          (selB.w <= 1 || Math.abs(selB.labelX - selB.x) > 0.1);
        const lX =
          (hasCustomLabel
            ? selB.labelX!
            : selB.x + selB.w / 2) * TILE_SIZE;
        const lY =
          (hasCustomLabel && selB.labelY !== undefined
            ? selB.labelY
            : selB.y) * TILE_SIZE;

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, by);
        ctx.lineTo(lX, lY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(lX, lY, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(lX - 22, lY - 18, 44, 12, 2);
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#f3e8ff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🟣 Label', lX, lY - 12);

        // 🟡 Door Pin
        const dTileX =
          selB.doorX !== undefined
            ? selB.doorX
            : selB.x + Math.floor(selB.w / 2);
        const dTileY = selB.doorY !== undefined ? selB.doorY : selB.y + selB.h;
        const dX = dTileX * TILE_SIZE + TILE_SIZE / 2;
        const dY = dTileY * TILE_SIZE + TILE_SIZE / 2;

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, by + bh);
        ctx.lineTo(dX, dY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(dX, dY, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(dX - 22, dY + 8, 44, 12, 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🟡 Pintu', dX, dY + 14);
      }
    }

    // 7c. Reachability Validation Warnings (Pulsing Red Rings)
    if (this.unreachableTargets && this.unreachableTargets.length > 0) {
      const pulse = 9 + Math.sin(Date.now() * 0.007) * 3;
      for (const target of this.unreachableTargets) {
        const tx = target.x * TILE_SIZE + TILE_SIZE / 2;
        const ty = target.y * TILE_SIZE + TILE_SIZE / 2;

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tx, ty, pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.92)';
        const text = `⚠️ ${target.name}`;
        ctx.font = 'bold 7.5px monospace';
        const tw = ctx.measureText(text).width + 8;
        ctx.beginPath();
        ctx.roundRect(tx - tw / 2, ty - 20, tw, 13, 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, tx, ty - 13);
      }
    }

    // 7d. Continuous Stamp Preview Ghost
    if (this.state.tool === 'stamp' && this.state.stampTemplateId && this.state.hoverTile) {
      const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === this.state.stampTemplateId);
      if (tpl) {
        const sx = this.state.hoverTile.x * TILE_SIZE;
        const sy = this.state.hoverTile.y * TILE_SIZE;
        const sw = tpl.w * TILE_SIZE;
        const sh = tpl.h * TILE_SIZE;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(sx, sy, sw, sh);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(sx, sy, sw, sh);
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tpl.icon, sx + sw / 2, sy + sh / 2);
      }
    }

    // 8. Cursor Tile Coordinate Tooltip
    if (this.state.hoverTile) {
      const hx = this.state.hoverTile.x * TILE_SIZE;
      const hy = this.state.hoverTile.y * TILE_SIZE;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.beginPath();
      ctx.roundRect(hx + TILE_SIZE + 4, hy - 8, 48, 13, 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${this.state.hoverTile.x}, ${this.state.hoverTile.y}`,
        hx + TILE_SIZE + 28,
        hy - 1
      );
    }

    ctx.restore();
  }
}
