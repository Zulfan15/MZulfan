# Task: Master Town Grid Alignment & Overlap Fixes (3-Corridor Urban Plan)

Look at the current town rendering across `src/engine/map.ts`, `src/engine/townBackground.ts`, and `src/engine/TownEngine.ts`. While the new districts exist, several buildings, fences, benches, and floating DOM labels overlap or lack street buffers.

Please reorganize the town into a clean **3-Zone Urban Grid** separated by two straight North–South avenues (`Central Boulevard` at `X: 21..23` and `East Promenade` at `X: 34..35`). Execute all 5 steps below and verify with `npx astro check`.

---

## STEP 1: Align West Wing Buildings to Center Axis `X = 15` & Add Street Buffers
1. **Shorten Dev Center Courtyard (`X: 9..20, Y: 13..17`)**:
   - Currently, the Dev Center courtyard hedge extends down to `Y: 18..19`, touching the roof and chimney of `Home Manor` (`Y: 20`).
   - Move the south hedge of the Dev Center courtyard up by 1–2 tiles so it ends cleanly at `Y: 17`, leaving `Y: 18..19` as a clean 2-tile paved street above `Home Manor`.
   - Place the `🏠 Home` DOM label at `(15, 19.5)` so it sits nicely above Home Manor's roof without overlapping the Dev Center hedge.
2. **Align Poké Center & Poké Mart to Door Axis `X = 15`**:
   - Shift `Poké Center` 1 tile left to `x: 12, y: 29, w: 7, h: 6` with its door at `(15, 34)` (matching Dev Center's door at `X = 15` and Home Manor's door at `X = 15`).
   - Shift `Poké Mart` 2 tiles left to `x: 12, y: 37, w: 6, h: 6` with its door at `(15, 42)`.
   - Ensure a clean 2-tile paved cross-street separates Home Manor (`Y: 20..26`), Poké Center (`Y: 29..34`), and Poké Mart (`Y: 37..42`).

---

## STEP 2: Fix Center Wing Alignment (`X: 24..33`, Center Axis `X = 28.5`)
Keep all Center Wing buildings strictly inside `X: 24..33` so `X: 34..35` remains an unbroken 2-tile North–South avenue (`East Promenade`):

1. **Shift Research Lab + Observatory Annex Slightly North & West (`X: 24..33, Y: 4..13`)**:
   - Place `Research Lab` at `x: 24, y: 5, w: 7, h: 6` (Door at `(27, 10)`) and `Observatory Annex` right next to it at `x: 31, y: 6, w: 3, h: 5` (Door at `(32, 10)`), so the entire Lab compound + eastern hedge stays strictly within `X: 24..33` (never crossing into `X: 34+`!).
   - Place the Lab's south hedge along `Y: 13` with a 2-tile entrance gap at `X: 28..29`.
   - Leave `Y: 14..15` as a clean 2-tile horizontal street between the Lab compound and the Battle Arena.
   - Move the `🔬 Research Lab` DOM label to `(27.5, 4.5)` — shifting it left to `X = 27.5` prevents it from being covered by the top-right `Badges` HUD button!
2. **Clean Up Battle Arena (`X: 24..33, Y: 16..24`)**:
   - Remove the two wooden benches that are currently drawn *inside* or on top of the Battle Arena's white boundary lines at `X: 25` and `X: 33`. The sand court (`X: 24..33, Y: 16..24`) must be completely free of obstacles.
   - Place the `⚡ Ace Trainer` DOM label at `(28.5, 16.2)` and the `⚔️ Arena` DOM label over the center Poké Ball at `(28.5, 20.5)` so it does not cover the bottom red standing pad.
3. **Create a Clean Plaza for Digital Twin & Fountain (`X: 24..33, Y: 25..34`)**:
   - Leave `Y: 25..27` as an open paved promenade below the Battle Arena.
   - Position the `🤖 Digital Twin` (Lucario NPC) cleanly at `(25, 26)` with its DOM label at `(25, 25.2)` so it is no longer squished against the corner of the Arena.
   - Center the `Fountain` at `(28.5, 31)` inside `X: 25..32, Y: 28..34`, with `Charizard` at `(25, 33)`.
4. **Center the Arcade Below the Fountain (`X: 25..32, Y: 36..42`)**:
   - Shift the `Arcade` building left from `X: 31..38` to `x: 25, y: 36, w: 8, h: 7` (Doors at `(28, 42)` and `(29, 42)`).
   - This aligns the Arcade on the exact same vertical axis (`X = 28.5`) as the Research Lab, Battle Arena, and Fountain, and frees up `X: 34..42` in the south-east!

---

## STEP 3: Create the Unbroken East Promenade (`X: 34..35, Y: 6..54`)
1. Set `X: 34..35` from `Y: 6` to `Y: 54` as a straight, unobstructed 2-tile wide stone path (`Tile.PATH`, `collision = 0`).
2. Ensure NO hedges, fences, building walls, or benches encroach on `X: 34..35`.
3. Place street lamps neatly along the promenade edge at `X: 34, Y: 8, 16, 26, 35, 44`.

---

## STEP 4: Stack the 5 East Wing Districts Cleanly in `X: 36..42`
With `X: 34..35` acting as a clean street separator, align all 5 eastern districts in a neat vertical column inside `X: 36..42` with clear 1–2 tile gaps between every district:

1. **🔭 Scenic Lookout (`X: 36..42, Y: 2..7`)**:
   - Stone terrace at `X: 36..42, Y: 2..7`, telescope at `(39, 3)`, bench at `(38, 5)`.
   - **Critical HUD Fix**: Position the `🔭 Lookout` DOM label at `(39, 6.8)` (at the southern entrance of the terrace) so it is 100% visible below the fixed top-right `Recenter` and `Guide` HUD buttons!
2. **🏡 Studio Villa (`X: 36..41, Y: 9..14`)**:
   - Leave `Y: 8` as a 1-tile grass/stone buffer below Scenic Lookout.
   - Render `Studio Villa` at `x: 36, y: 9, w: 6, h: 5` (Door at `(38, 13)`). Because the Observatory Annex ends at `X: 33` and the East Promenade is at `X: 34..35`, Studio Villa now has a full 2-tile street gap on its left and will NOT touch the Observatory Annex!
   - Place its front black iron fence along `Y: 15` (`X: 36..41`) with a gate opening at `(38, 15)` and add a `🏡 Villa` or `🎨 Studio` DOM label at `(39, 8.8)`.
3. **🌸 Berry Garden (`X: 36..42, Y: 17..25`)**:
   - Leave `Y: 16` as a clean 1-tile walkway below Studio Villa's fence (`Y: 15`) so the two fences never touch.
   - Enclose `X: 36..42, Y: 17..25` with a neat border, entrance on the left at `(36, 21)` from the East Promenade, a larger lush pink **Sakura Tree** centered at `(39, 20)`, and 4 berry pots arranged symmetrically in a 2×2 grid at `(38, 22), (41, 22), (38, 24), (41, 24)`.
   - Place the `🌸 Berry Garden` DOM label at `(39.5, 17.2)`.
4. **🎪 Contest Stage (`X: 36..42, Y: 28..35`)**:
   - Leave `Y: 26..27` as a 2-tile walkway below Berry Garden.
   - Render the Contest Stage neatly in `X: 36..42, Y: 28..35` with the red carpet centered at `X: 38..40`, gold star podium at `(39, 30)`, and spectator benches at `Y: 33..34`.
   - Place the `🎪 Contest` DOM label at `(39.5, 28.2)`.
5. **🏕️ Ranger Camp (`X: 36..42, Y: 38..45`)**:
   - Leave `Y: 36..37` as a 2-tile walkway below Contest Stage.
   - Because the Arcade was moved to `X: 25..32`, Ranger Camp at `X: 36..42, Y: 38..45` now has plenty of room! Render the Ranger Kiosk tent at `X: 38..41, Y: 38..40`, campfire at `(39, 42)`, log benches around it, and NPC Ranger Alex at `(37, 42)`.
   - Place the `🏕️ Ranger` DOM label at `(39.5, 38.2)`.

---

## STEP 5: Synchronize Collisions, Doors, & Pathfinding Targets
1. Update all building footprints, door triggers, and collision boxes in `src/engine/map.ts` to match the new aligned coordinates for `Poké Center`, `Poké Mart`, `Research Lab`, `Observatory Annex`, `Battle Arena`, `Arcade`, `Studio Villa`, `Berry Garden`, `Contest Stage`, and `Ranger Camp`.
2. Update all `walkTo` / `onLabelClick` target coordinates and `labelDefs` in `src/engine/TownEngine.ts`.
3. Run `npx astro check` and `npm run build` to ensure 0 errors and 0 warnings.