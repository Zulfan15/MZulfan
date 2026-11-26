# Task: Upgrade Town Editor to 2.0 (Direct Source-File Saving + Power Level-Design Tools)

This is a personal portfolio website where ONLY I (the developer/owner) use the Town Editor during development to design the canonical town map for all visitors. 

Using `localStorage` as the primary storage is problematic because changes only stay in my local browser and require manual copy-pasting into the codebase. Please upgrade the Town Editor across `src/engine/townConfig.ts`, `src/engine/townEditor.ts`, `src/engine/townBackground.ts`, `src/engine/TownEngine.ts`, and `src/components/TownCanvas.astro` in 4 phases:

---

## PHASE 1: Replace `localStorage` with Direct-to-Source-File Saving (Dev Disk Write)
1. **Single Canonical Layout File (`src/data/townLayout.json`)**:
   - Extract the default buildings/objects list and custom tile overrides from `src/engine/townConfig.ts` into a clean JSON file: `src/data/townLayout.json`.
   - Have `townConfig.ts` import `src/data/townLayout.json` directly as the single source of truth so both development and production builds always render the exact same canonical layout.
2. **Direct File Write Endpoint for Local Dev (`src/pages/api/dev/save-town.ts`)**:
   - Create an Astro dev API endpoint (or Vite dev server middleware plugin in `astro.config.mjs` if building in `static` output mode) that accepts `POST /api/dev/save-town` containing `{ buildings, tiles }`.
   - When running in development (`import.meta.env.DEV`), this endpoint uses `node:fs/promises` (`writeFile`) to write the formatted JSON directly to `src/data/townLayout.json` on disk!
3. **Update Save Button (`💾 Simpan` & `Ctrl+S`)**:
   - Clicking `💾 Simpan` (or pressing `Ctrl+S` / `Cmd+S`) in the Town Editor must call `/api/dev/save-town` to permanently save the layout directly into `src/data/townLayout.json` on disk and show a toast: `"✅ Tersimpan permanen ke src/data/townLayout.json!"`.
   - Remove automatic `localStorage` overrides on startup so the browser never gets out of sync with the actual source code.
4. **Owner-Only Access Guard**:
   - Only enable the Town Editor (`E` key and editor UI) when `import.meta.env.DEV === true` OR when the URL contains `?editor=1`, so normal portfolio visitors never accidentally trigger the editor.

---

## PHASE 2: Advanced Tile Brush & Shape Tools
Upgrade the floor painting system (`#town-editor-palette` & `townEditor.ts`) so I don't have to click tiles one by one:
1. **Brush Size Selector (`1×1`, `2×2`, `3×3`)**:
   - Add brush size toggle buttons in the palette bar and shortcuts (`1`, `2`, `3`) to paint 1×1, 2×2, or 3×3 tile areas at once, with a matching multi-tile cursor hover preview.
2. **Shape & Fill Tools**:
   - **📏 Line Tool (`L`)**: Click and drag from tile A to tile B to draw a straight orthogonal or Bresenham line of tiles (great for roads, fences, and hedges) with a live ghost preview before releasing the mouse.
   - **⬛ Rectangle Fill Tool (`R` in brush mode)**: Click and drag a bounding box to fill an entire rectangular plaza or lawn area at once.
   - **🪣 Paint Bucket / Flood Fill (`B`)**: Click any contiguous tile region to flood-fill connected tiles of the same type (capped at a safe max tile limit).
   - **💧 Eyedropper (`I` or `Alt + Click`)**: Sample the tile or object under the cursor to immediately select that brush or object template.

---

## PHASE 3: Faster Object Manipulation & Layering
Upgrade object editing in `townEditor.ts` and `townConfig.ts`:
1. **Quick Duplicate (`Ctrl+D` and `Alt + Drag`)**:
   - Pressing `Ctrl+D` with an object selected (or holding `Alt` while dragging an object) immediately clones the selected tree, lamp, bench, bush, or flowerbed with a new unique ID.
2. **Multi-Selection & Box Drag (`Shift + Click` / Marquee Select)**:
   - Hold `Shift + Click` to select multiple objects at once, or drag a selection box on empty ground to select all decorations inside the box, allowing batch move (`Drag` or `Arrow Keys`) and batch delete (`Delete`).
3. **Object Rotation / Orientation (`R` key when an object is selected)**:
   - Add an `orientation?: 'N' | 'E' | 'S' | 'W'` property to `BuildingLayout`.
   - Pressing `R` rotates supported props (benches, lamps, telescopes, signs) through 90° orientations.
4. **Smart Alignment Guides & Snap**:
   - When dragging a building or prop, render subtle cyan alignment guide lines on the canvas whenever its center or edge aligns horizontally or vertically with another building's center/edge or door axis!

---

## PHASE 4: Collision Inspector & Instant Playtest Mode
1. **Collision & Walkability Overlay (`C` key / `🛡️ Collision` button)**:
   - Add a toggle in the toolbar that renders a semi-transparent overlay on the grid:
     - **Red tiles**: Solid collision (`collision = 1` or blocked by building/water/hedge/fence).
     - **Green tiles**: Walkable path/grass (`collision = 0`).
     - **Yellow/Blue markers**: Building door triggers and NPC interaction tiles.
   - Allow toggling custom collision overrides on individual tiles while in Collision Inspector mode.
2. **Instant Playtest Toggle (`P` key / `🎮 Playtest` button)**:
   - Clicking `🎮 Playtest` temporarily hides the editor grid/toolbar, teleports the player character directly to the current mouse cursor tile, and lets me walk around to test collisions and pathfinding immediately, then press `P` or `E` to return to the exact same editor state.

---

## Verification
- Run `npx astro check` and `npm run build` — ensure **0 errors and 0 warnings**.
- Test that saving in the editor writes directly to `src/data/townLayout.json` and persists cleanly after a hard refresh with empty `localStorage`.