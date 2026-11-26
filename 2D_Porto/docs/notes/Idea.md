# Role & Objective
You are a Senior Full-Stack Engineer and Creative Developer. Your task is to help me build an interactive, Pokémon-inspired 2D pixel-art town portfolio website (inspired by si-dan.com), C:\Users\ACER\Downloads\Porto web\my-portfolio\2D_Porto\CV\CV_26-10-2026.pdf, use my CV for information display in website. Create project at this folder C:\Users\ACER\Downloads\Porto web\my-portfolio\2D_Porto.

# Core Architecture & Tech Stack
1. **Single Source of Truth (`profile.yaml`)**:
   - All portfolio data (bio, work experience, education, honors, projects, tech stack, social links, and AI assistant knowledge base) MUST be stored in a single schema-validated `src/data/profile.yaml` file (validated at build time using Zod).
   - Updating `profile.yaml` must automatically update the static pages, interactive UI components, and the system prompt context for the AI chatbots.

2. **Static-First Frontend (Astro + TypeScript)**:
   - Use **Astro** to render every route/room to static HTML at build time for fast loading, SEO, and accessibility.
   - Only hydrate JavaScript (Astro Islands) for interactive elements: the 2D Town Canvas, the AI Chat interfaces, the Interactive Radar/Telemetry views, and the Arcade mini-game.
   - Every building in the 2D town corresponds to an actual static route (`/`, `/about`, `/dev`, `/lab`, `/arcade`, `/twin`, `/reception`).
   - Always provide a "Town Map" modal and quick-jump navigation menu ("Where to?") so recruiters or visitors in a hurry can browse the entire portfolio as a clean static website without having to walk around the 2D map.

3. **Custom Tiny 2D Grid Engine (Vanilla TypeScript, NO Game Framework)**:
   - Do NOT use heavy game frameworks like Phaser, PixiJS, or Kaboom.
   - Write a lightweight, modular 2D grid-based engine in pure TypeScript (~300-500 lines) using HTML5 `<canvas>`.
   - Engine features required:
     - Tile-based grid movement (WASD + Arrow keys).
     - Click/tap-to-move with A* or BFS pathfinding on walkable tiles.
     - Collision detection layer (walls, trees, water, NPCs) and interaction triggers (doors that navigate to routes, signs that open modals, NPCs that trigger dialogue).
     - Energy-efficient render loop (`requestAnimationFrame`) that automatically sleeps/pauses when the player stands still and no animations are active.

4. **Interactive Portfolio Features**:
   - **Town Square (`/`)**: Notice board with TL;DR summary, featured projects, core toolbelt, and "On Repeat" Spotify widget.
   - **Dev Center (`/dev` - Mission Control)**:
     - *Mission Timeline*: Chronological feed of Roles ("Crew Assignments"), Projects ("Launches"), Education ("Training"), and Awards ("Commendations").
     - *Stack Radar*: Interactive radar visualization where technologies are plotted as blips; the more projects/roles use a skill in `profile.yaml`, the closer it sits to the center of the radar.
     - *Telemetry Wall*: Live developer stats showing GitHub contribution count/streak, recently active repositories, and LeetCode problem-solving dials (Easy/Medium/Hard).
   - **Gamification & Easter Eggs**:
     - *Tall Grass & Critterdex*: Stepping in tall grass tiles triggers retro turn-based wild critter encounters. Visitors can catch up to 12 critters stored in `localStorage` and view a "Trainer Card" that can be exported as a PNG in the browser.
   - **Arcade (`/arcade`)**: A lightweight board/strategy mini-game running an AI bot (e.g., Alpha-Beta pruning bot compiled from Rust to WebAssembly running inside a Web Worker so it never blocks the UI thread).
   - **AI Digital Twin (`/twin` & `/reception`)**: Chat interface powered by an LLM that answers questions about me strictly grounded in the compiled `profile.yaml` data.

5. **Edge API & Hosting (Cloudflare Workers)**:
   - Deploy on Cloudflare Workers/Pages ($0 free-tier friendly).
   - Implement a daily Cron Trigger that fetches my latest GitHub, LeetCode, and Spotify stats and caches them in Cloudflare KV.
   - Implement an API endpoint `/api/chat` with IP-based rate limiting that proxies requests to an LLM API using the `profile.yaml` context.

# Coding Guidelines
- Write clean, modular, strictly-typed TypeScript.
- Prioritize keyboard accessibility (`Skip to content`, `Enter` to interact, `Esc` to close modals) and mobile responsiveness (touch tap-to-move + full fallback HTML content on every page).
- Before writing code for any phase, briefly outline the file structure you will create or modify.

Let's start with Phase 1: Project Setup, Schema-Validated `profile.yaml`, and Static Routes.

1. Initialize an Astro project with TypeScript and Tailwind CSS (styled with a retro pixel-art / clean mission-control aesthetic).
2. Create `src/data/profile.yaml` containing sample data structured for:
   - Personal info (name, title, tagline, current role, education, honors, social links).
   - `missions`: A unified list of projects ("launches") and work experiences ("crew_assignments") with dates, objectives, bullet results, links (demo, code, paper), and an array of tech `payload` tags.
   - `stack`: Categorized skills (Languages & Frameworks, AI/ML, Data, Tools & Cloud).
   - `critters`: 12 collectible pixel critters for the Critterdex.
3. Create a Zod schema loader in `src/lib/profile.ts` that parses and validates `profile.yaml` at build time, and automatically calculates skill frequency across `missions` (to be used later for the Stack Radar).
4. Create the static layout with a persistent top HUD navigation bar (`Town`, `Map` modal trigger, `Critterdex 0/12` modal trigger, and `Skip to content`) and scaffold the pages: `/`, `/about`, `/dev`, `/lab`, `/arcade`, `/twin`.

Now let's build Phase 2: The Custom Tiny 2D Grid Engine in pure TypeScript.

1. Create `src/engine/TownEngine.ts` using HTML5 `<canvas>` with zero external game libraries.
2. Implement a tilemap system (e.g., 16x16 or 32x32 pixel tiles) with layers:
   - Ground/Terrain layer
   - Collision layer (0 = walkable, 1 = blocked)
   - Interactive/Trigger layer (doors leading to `/dev`, `/lab`, `/about`, `/arcade`, NPCs, notice boards, and "tall grass" encounter tiles).
   - Placeholder procedural pixel-art tile rendering (so it works immediately before I swap in my custom PNG spritesheets).
3. Implement movement & controls:
   - Smooth grid-to-grid interpolation for WASD and Arrow keys.
   - Click/Tap-to-move with BFS/A* pathfinding on the collision grid so clicking anywhere walks the character there.
   - Pressing `Enter` or tapping an adjacent NPC/sign opens an interaction dialogue box; stepping on a building door navigates to the corresponding Astro route.
4. Optimize the loop: The `requestAnimationFrame` render loop MUST go to sleep (stop ticking) when the player is idle and no tile/movement animation is running, waking up immediately on input events.

Let's build Phase 3: The `/dev` (Dev Center / Mission Control) interactive views.

Using the validated data from `src/lib/profile.ts`, build the `/dev` page with three interactive tabs/panels:
1. **Mission Timeline**: A chronological timeline and filterable list of all launches (projects), crew assignments (work roles), training (education), and commendations (awards).
2. **Stack Radar**: An interactive circular radar chart component in TypeScript/SVG. Plot every skill from `profile.yaml` as an interactive blip. Skills used in more missions must be positioned closer to the center ("Core"), followed by outer rings ("Go-to", "Regular", "Flown once"). Clicking a blip displays which specific projects/roles used that technology.
3. **Telemetry Wall**: A dashboard UI showing:
   - GitHub daily streak, annual contributions count, and recently active repositories.
   - LeetCode progress dials showing total solved and share of Easy, Medium, and Hard problems.
   - Connect this UI to a mock JSON endpoint first so we can wire it to the Cloudflare Worker in the next phase.

   Let's build Phase 4: Gamification (Tall Grass Encounters, Critterdex, Trainer Card PNG export) and the Arcade.

1. **Tall Grass & Encounter Modal**: When the player walks over "tall grass" tiles in the Town Engine, trigger a random encounter modal styled like a classic handheld RPG battle. Allow the player to throw a Poké Ball to catch the critter or Run.
2. **Critterdex & Trainer Card**:
   - Store caught critters in `localStorage` (saved in the browser only, never uploaded).
   - Build the `Critterdex` modal showing caught vs. uncaught critters (0/12).
   - Build a `Trainer Card` generator where the user can type their name, view their badges/caught count, and click "Save card as PNG" (rendered via HTML5 `<canvas>` `toDataURL`).
3. **Arcade (`/arcade`)**:
   - Set up a classic board game (e.g., Mancala / Kalah) where the user plays against an AI bot.
   - Implement the AI bot using Alpha-Beta pruning inside a Web Worker (provide a clean TypeScript worker setup and optional Rust-to-WASM build script) so the AI calculation never freezes the UI.

   Let's build Phase 5: Cloudflare Worker Edge API, Telemetry Cron, and AI Digital Twin Chat.

1. Set up Cloudflare Worker configuration (`wrangler.toml`) to serve the static Astro build and handle `/api/*` routes.
2. **Daily Telemetry Cron (`/api/telemetry`)**:
   - Create a scheduled Worker handler (`scheduled` event) that runs daily to fetch my public GitHub contributions/repos, LeetCode stats, and Spotify top track/artist, storing the result in Cloudflare KV.
3. **AI Digital Twin & Receptionist (`/api/chat`)**:
   - Create a build script that compiles `profile.yaml` into a concise system prompt knowledge base.
   - Build a POST `/api/chat` Worker endpoint with rate limiting that proxies user messages to an LLM API (OpenAI / Groq / Cloudflare AI) using the compiled `profile.yaml` persona.
   - Connect this endpoint to the chat UI on `/twin` and `/reception`.