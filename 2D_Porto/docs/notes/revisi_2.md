# Task: Final Surgical Visual Polish (Fix 7 Remaining Rendering & Label Glitches)

The 3-corridor town layout is now in place and looks great, but inspecting the rendered canvas reveals 7 specific visual glitches across `src/engine/townBackground.ts`, `src/engine/map.ts`, and `src/engine/TownEngine.ts`. 

Do NOT move the main building footprints—only apply the 7 targeted fixes below and verify with `npx astro check`.

---

## 1. Remove the Ghost White/Grey Plaza Patch Overlapping Battle Arena (`townBackground.ts` & `map.ts`)
- **Bug**: A light-grey/white tiled rectangular patch (` around X: 26..31, Y: 21..25`) is rendering on top of the bottom half of the Battle Arena sand court, hiding the bottom white court line and the red challenger standing pad.
- **Fix**:
  1. Check `map.ts` inside the Battle Arena footprint (`X: 24..33, Y: 16..24`) and ensure no `Tile.PLAZA` or `Tile.PATH` rectangles overwrite the arena tiles (`Y: 16..24`).
  2. Check `townBackground.ts` for any leftover plaza/patio/gazebo floor rendering (e.g., around the old Villa/Fountain/Digital Twin area at `X: 25..32, Y: 21..26`) or ensure `renderTrainingField(ctx)` is called AFTER ground/plaza tile loops so the full Battle Arena court (including its south white border line and bottom red standing pad at `Y: 22..23`) is 100% visible and unobstructed.

## 2. Move `⚔️ Arena` Label Below the Center Poké Ball (`TownEngine.ts`)
- **Bug**: The floating `⚔️ Arena` DOM label currently sits right on top of the center Poké Ball emblem, hiding its red top half.
- **Fix**: Move the `arena` label anchor in `labelDefs` down to the bottom edge of the court at `(28.5, 23.5)` (just below the red challenger pad) so the center Poké Ball emblem is completely uncovered.

## 3. Fix Top Labels Clipping Under HUD (`🔬 Research Lab`, `🔭 Lookout`, & `🏡 Villa`) (`TownEngine.ts`)
- **Bug**:
  - The `🔬 Research Lab` label is pushed off the top edge of the screen because the Lab moved up to `Y: 5`.
  - The `🔭 Lookout` label at the top-right is STILL hidden directly underneath the fixed `Recenter` HUD pill button (only the last letter `t` peeks out).
- **Fix**:
  1. Place the `🔬 Research Lab` label over the lower eaves/doorway of the Research Lab at `(27.5, 7.2)` so it is always visible inside the viewport below the top HUD bar.
  2. Move the `🔭 Lookout` label down to `(39, 7.8)` (at the path just above Studio Villa's roof) OR to `(35, 7.2)` so it sits cleanly below the `Badges / Recenter / Guide` HUD buttons.
  3. Ensure `🏡 Studio Villa` (if defined in `labelDefs`) is positioned cleanly at `(39, 13.8)` near its front gate so it never collides with `🔭 Lookout`.

## 4. Fix Studio Villa Side Fence Clipping Through the Roof (`townBackground.ts`)
- **Bug**: On `Studio Villa` (`X: 36..41, Y: 9..14`), the black iron fence runs vertically up the left (`X: 36`) and right (`X: 41`) sides of the house all the way to `Y: 9`, cutting straight through the red roof eaves.
- **Fix**: Only render the black iron fence around the front yard (`Y: 13..15`, from `X: 36` to `X: 41`, with the gate opening at `X: 38..39`). Remove the vertical fence segments along the upper walls/roof (`Y: 9..12`).

## 5. Remove Clipped Flower Patch Under Digital Twin (`townBackground.ts`)
- **Bug**: Directly underneath the Digital Twin (Lucario at `(25, 26)`), there is a small 2-tile flower bed at `(25..26, 26)` that looks clipped and squished against the bench and street lamp.
- **Fix**: Remove that stray flower bed right below Lucario so the plaza between the Battle Arena and Fountain has clean stone paving. Keep only the symmetrical benches flanking the Fountain.

## 6. Tuck the Arcade Red Vending Machine Next to the Arcade Wall (`townBackground.ts` & `map.ts`)
- **Bug**: When the Arcade moved left to `X: 25..32`, the red drink vending machine stayed out at `X: 23, Y: 42` in the middle of the street.
- **Fix**: Move the vending machine 1 tile right to `(24, 41)` so it sits neatly on the sidewalk right against the left wall of the Arcade (`X: 25`), leaving `Central Boulevard` (`X: 21..23`) completely clear.

## 7. Narrow the West Boardwalk (`🚲 Off-Duty`) Flower Beds by 1 Tile (`townBackground.ts` & `map.ts`)
- **Bug**: In the West Plaza (`X: 6..10, Y: 28..41`), the top and bottom flower beds extend slightly too far right (`X: 10`), touching the decorative tree at `(11, 28)` and the green lawn border of Poké Center and Poké Mart.
- **Fix**: Constrain the West Plaza flower beds and `🚲 Off-Duty` kiosk strictly to `X: 6..9` (4 tiles wide), leaving `X: 10..11` as a clean 2-tile paved walkway buffer along the left side of Poké Center and Poké Mart.