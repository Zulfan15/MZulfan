# Task: Visual Polish, Layout Rebalancing, and Interactive Portfolio Upgrades (Idea 3.0)

Based on the visual inspection of the current build after executing `Idea_2.md`, there are several layout cramping issues, visual clippings, and missed opportunities that need to be fixed across `src/engine/map.ts`, `src/engine/townBackground.ts`, `src/engine/TownEngine.ts`, and `src/components/TownCanvas.astro`.

Please execute the following 6 phases step-by-step. Verify with `npx astro check` after each phase.

---

## PHASE 1: Fix Visual Bugs (Research Lab Sign, HUD Label Overlap, & Ranger Sprite)
1. **Fix "ESEARCH LA" Text Clipping (`townBackground.ts`)**:
   - On the Research Lab building facade (`x: 25, y: 9`), the sign text currently clips at the edges and reads `ESEARCH LA`.
   - Widen the sign plaque background by 12–16px or slightly reduce the font size / letter-spacing so the full text **`RESEARCH LAB`** renders cleanly with padding on both sides.
2. **Fix `🔭 Lookout` Label Hidden Under Top-Right HUD (`TownEngine.ts` & `TownCanvas.astro`)**:
   - The `lookout` floating DOM label at the top-right is currently obscured by the fixed top-right HUD buttons (`Badges`, `Recenter`, `Guide`).
   - Shift the `lookout` label anchor coordinates down and slightly left to tile `(34, 6.5)` (below the telescope patio, clearly visible below the top HUD bar) and ensure its z-index does not clash with HUD controls.
3. **Fix NPC Ranger Alex Sprite (`TownEngine.ts` / `townBackground.ts`)**:
   - At the bottom-right Ranger Camp (`(39, 43)`), NPC Ranger Alex is currently rendering with a Charizard/monster sprite (duplicating the Charizard near the Fountain).
   - Replace Ranger Alex's sprite with a proper pixel-art human Ranger NPC sprite (red/green ranger uniform with a field hat) so there is only ONE Charizard in town (at the Fountain Plaza).

---

## PHASE 2: Widen & Rebalance the East Quarter (Stop Cramping in `X: 39..42`)
Currently, the 4 eastern districts (`Arena`, `Berry Garden`, `Contest`, `Ranger`) are squeezed into a narrow 3-tile vertical strip (`X: 39..42`), causing their right edges to be clipped by the eastern tree canopy (`X: 43`) and colliding with the right wall of the Arcade (`X: 31..38`).

1. **Shift Eastern Boundary Trees Outward (`map.ts` & `townBackground.ts`)**:
   - Move the single-column eastern tree canopy border 1 tile further right to the very edge of the canvas (`X: 44`, drawing canopy centered at `44 * TILE_SIZE - 4`) so `X: 38..43` (6 full tiles = 96px) is completely clear of overhanging tree leaves.
2. **Re-layout Battle Arena (`X: 38..43, Y: 8..16`)**:
   - Expand the Battle Arena horizontally to 6 tiles wide (`X: 38..43, Y: 8..16`) so the regulation sand court, white boundary lines, and center Poké Ball emblem are fully visible and centered with a 1-tile stone margin before the eastern fence/trees.
   - Move the `⚔️ Arena` label to `(40.5, 9.5)` so it sits cleanly at the top edge of the court without covering the center Poké Ball.
3. **Re-layout Berry Garden & Sakura Grove (`X: 25..31, Y: 19..25` + `X: 38..43, Y: 18..26`)**:
   - Instead of cramming the Berry Garden into a narrow dark-brown strip on the far right, expand the garden into a proper L-shaped or wide botanical courtyard (`X: 38..43, Y: 18..26`) AND add a matching **Sakura Blossom Park** in the empty grass patch west of Studio Villa (`X: 26..31, Y: 19..25`).
   - Render a large, lush pink pixel-art **Sakura Tree** prominently at `(28, 21)` and `(40, 20)` with falling petal particles, surrounded by white picket fencing and horizontal rows of Oran (blue), Sitrus (yellow), and Cheri (red) berry planters.
   - Reposition the `🌸 Berry Garden` label to `(40.5, 18.2)` so it never covers the Sakura tree canopy or berry pots.
4. **Re-layout Contest Stage & Amphitheater (`X: 38..43, Y: 27..34`)**:
   - Move the Contest Stage slightly north (`Y: 27..34`) so it sits completely above the Arcade building (`Y: 36..42`).
   - Widen the stage to 5 tiles (`X: 38..43`) with a wide red velvet carpet, gold trim, colorful footlights, and horizontal spectator benches facing the stage.
5. **Re-route East Promenade & Fix Ranger Camp (`X: 39..43, Y: 36..46`)**:
   - Because the Arcade occupies `X: 31..38, Y: 36..42`, leave `X: 39` as a clean 1-tile paved walkway buffer alongside the Arcade's right wall.
   - Place the **Ranger Camp** cleanly in `X: 40..43, Y: 40..46` (south-east of the Arcade) with the khaki ranger kiosk tent, stone campfire ring at `(41, 43)`, and log benches, ensuring zero visual overlap with the Arcade roof or walls.

---

## PHASE 3: Fill the Empty Southwest / West Plaza (`X: 2..12, Y: 27..43`)
The large grey paved area on the left side of the map (west of Poké Center `X: 13..19` and Poké Mart `X: 14..19`, above Tech Tower `Y: 44`) looks barren and unfinished.

1. **Create "Seaside Boardwalk & Trainer Rest Plaza" (`X: 2..11, Y: 27..42`)**:
   - Break up the monotonous grey concrete in `X: 2..11, Y: 27..42` by adding:
     - **Brick Cycling & Jogging Lane** (`X: 3..5, Y: 27..42`) with warm terracotta/red-brick tiles and subtle lane markings.
     - **Seaside Flower Beds & Palm/Pine Planters** (`X: 6..10, Y: 28..31` and `Y: 36..39`) using manicured planters, wooden benches facing the ocean, and warm street lamps.
     - **Trainer Notice & Hobby Kiosk (`X: 7..9, Y: 33..35`)**: A small wooden pergola/gazebo with a blue roof and an interactive sign/board (`"Zulfan's Off-Duty Log — Music, Hobbies & Fun Facts"`).
2. Add a walkable path connecting the Seaside Boardwalk directly to Poké Center, Poké Mart, and Tech Tower.

---

## PHASE 4: Upgrade New POIs from Static Props to Interactive Portfolio Features
Make the new areas genuinely rewarding for portfolio visitors and recruiters:

1. **🔭 Scenic Lookout — Day / Sunset / Night Atmosphere Toggle (`(35, 3)`)**:
   - When the player interacts with the Lookout Telescope (or clicks the `Lookout` action), open a dialogue offering a panoramic description of Zulfan's Town PLUS an interactive toggle button: **`🌅 Cycle Town Time (Day / Sunset / Night)`**.
   - Implement a lightweight canvas overlay/filter in `TownEngine.ts`:
     - **Day**: Default crisp pixel rendering.
     - **Sunset**: Warm golden-amber tint (`rgba(255, 140, 60, 0.14)`) with soft lamp glow.
     - **Night**: Deep indigo evening tint (`rgba(15, 25, 65, 0.35)`) where all street lamps, building windows, Arcade neon signs, and the Ranger campfire emit warm radial light halos!
2. **⚔️ Battle Arena — Interactive "Tech Gym Challenge" Quiz**:
   - Place an **Ace Trainer NPC** at the north pad of the Battle Arena `(40, 11)`.
   - Interacting with the Ace Trainer triggers a fun 3-question multiple-choice Pokémon-style battle quiz about Zulfan's core tech stack, projects, and background.
   - Winning the quiz awards a special **"Arena Frontier Badge"** saved in `localStorage` and increments the user's badge/achievement progress.
3. **🌸 Berry Garden — Interactive Berry Harvest (`localStorage`)**:
   - Allow players to interact with the Oran, Sitrus, and Cheri Berry pots in the Berry Garden.
   - Harvesting berries gives the player **+3 Poké Balls** (or rare bait) for the Critterdex / Dex Meadow encounters, with a visual toast notification (`"You picked an Oran Berry! +3 Poké Balls added to your bag."`).
4. **🎪 Contest Stage — Creative & UI/UX Showcase Modal**:
   - Interacting with the Contest Stage podium at `(40, 29)` opens a spotlight dialogue highlighting Zulfan's design sensibility, frontend architecture (this custom 2D TypeScript engine!), and top achievements, with quick links to view source code or project demos.

---

## PHASE 5: Final Verification & Polish
1. Run `npx astro check` and `npm run build` — ensure **0 errors and 0 warnings**.
2. Verify all collision tiles (`collision[]` in `map.ts`) match the updated coordinates for the widened Arena, Berry Garden, Contest Stage, Ranger Camp, and West Seaside Plaza.
3. Ensure clicking any of the floating DOM labels (`Lookout`, `Arena`, `Berry Garden`, `Contest`, `Ranger`) smoothly pathfinds the player to the exact entrance/interaction tile without getting stuck on fences or building corners.