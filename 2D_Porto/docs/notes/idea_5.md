# Task: Upgrade Town Editor to 3.0 (Interactive Pin/Door/NPC Editing, Lock & Layering, Distance Rulers, and Pathfinding Validator)

Based on `Informasi_Editor ke 2.md` (Town Editor 2.0), the core editor with direct disk saving (`src/data/townLayout.json`), shape tools, multi-select, rotation, and collision overlay is working great. Now let's upgrade it to **Town Editor 3.0** so I have 100% visual control over doors, DOM labels, NPCs, object locking, distance measurements, and map validation without touching hardcoded coordinates.

Please implement the following 5 phases across `src/engine/townConfig.ts`, `src/engine/townEditor.ts`, `src/engine/townBackground.ts`, `src/engine/TownEngine.ts`, and `src/components/TownCanvas.astro`:

---

## PHASE 1: Interactive Sub-Pins for DOM Labels, Doors, & NPCs
1. **Extend `BuildingLayout` in `townConfig.ts`**:
   - Add optional properties:
     - `doorX?: number; doorY?: number;` (entry/interaction tile coordinates)
     - `locked?: boolean;` (prevents accidental dragging/deletion)
     - `zIndex?: number;` (custom render order adjustment)
     - `dialogue?: string; link?: string;` (for NPCs and interactive signs)
   - Include `kind: 'npc' | 'sign'` so all town NPCs (Digital Twin, Charizard, Ace Trainer, Ranger Alex) and Signs can be managed and dragged directly inside `townLayout.json`.
2. **Draggable Label & Door Handles (`townEditor.ts`)**:
   - When a building or POI is selected in the editor, render two distinct sub-handles on the canvas:
     - **🟣 Label Pin (`labelX, labelY`)**: Dragging this small badge handle moves the floating DOM label's exact anchor point in real time!
     - **🟡 Door / Target Pin (`doorX, doorY`)**: Dragging this marker moves the building's door trigger / `walkTo` target tile. Moving a building automatically shifts its door pin by the same delta (`dx, dy`).

---

## PHASE 2: Object Locking (`L`), Z-Index Layering (`[` / `]`), & Distance Rulers
1. **Object Lock Toggle (`🔒 Lock` button & `K` shortcut)**:
   - Add a `🔒 Lock / Unlock` button in the toolbar when an object is selected.
   - Locked objects render with a subtle lock icon badge in editor mode and are ignored by click-drag, marquee box selection, and `Delete` until unlocked.
2. **Layer Ordering (`[` and `]`)**:
   - Pressing `[` (Send Backward) or `]` (Bring Forward) adjusts `zIndex` on the selected object so overlapping decorations render in the exact desired order.
3. **Smart Distance Ruler on Alignment Guides (`townEditor.ts`)**:
   - Enhance the existing cyan Smart Alignment Guides: when dragging an object, calculate the tile gap between the selected object's bounding box and the nearest neighboring building/object along the X and Y axes, and render a pill badge on the guide line showing the exact distance (e.g., `↔ 3 tiles`, `↕ 2 tiles`).

---

## PHASE 3: Custom Collision Painting, Tall Grass Brush, & Reachability Validator
1. **Expand `TileTypeKey` (`townConfig.ts`)**:
   - Add `'tall_grass'` (triggers Critterdex encounters), `'solid_override'` (invisible collision wall), and `'walkable_override'` (forces a blocked tile to be walkable).
2. **Interactive Collision Painting**:
   - When `Collision Inspector (C)` is active, clicking or dragging on tiles toggles custom collision overrides (`solid_override` vs `walkable_override`) and saves them to `townLayout.json`.
3. **Automated Map Reachability Validator (`🔍 Validate` button)**:
   - Add a `🔍 Cek Jalur` button in the editor toolbar.
   - When clicked, run BFS/A* from the player's default spawn tile to every building's `(doorX, doorY)` and every NPC's interaction tile.
   - If any building door or NPC is unreachable (blocked by fences, hedges, or buildings), highlight the unreachable target with a pulsing red warning ring on the canvas and show a toast listing the blocked POI names; otherwise show `"✅ Semua gedung & NPC dapat dijangkau!"`.

---

## PHASE 4: Copy-Paste Selection (`Ctrl+C` / `Ctrl+V`) & Interactive Mini-Map
1. **Clipboard Copy-Paste (`Ctrl+C` / `Ctrl+V`)**:
   - Allow copying (`Ctrl+C`) any single or multi-selected group of objects and pasting (`Ctrl+V`) them centered at the current mouse cursor tile with new unique IDs.
2. **Interactive Mini-Map Widget (`townEditor.ts` / `TownCanvas.astro`)**:
   - Render a compact `90×128px` live mini-map in the bottom-right corner when the editor is active, showing terrain colors, building footprints, and a white viewport rectangle for the current camera view.
   - Clicking or dragging inside the mini-map immediately pans the editor camera to that location.

---

## PHASE 5: Update Documentation & Verify
1. Update `Informasi_Editor ke 2.md` so Sections 1, 2, 11, and 12 reflect the unified `src/data/townLayout.json` workflow and the new Town Editor 3.0 features.
2. Run `npx astro check` and `npm run build` — ensure **0 errors and 0 warnings**.