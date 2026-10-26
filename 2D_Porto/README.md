# 🏡 Zulfan's Town — 2D Pixel-Art Portfolio Website

An interactive, Pokémon-inspired 2D pixel-art town portfolio website built with **Astro 7**, **TypeScript**, **Tailwind CSS v4**, a **custom lightweight 2D canvas engine** (no heavy game framework), and **Cloudflare Workers**.

All portfolio information is strictly grounded in [`src/data/profile.yaml`](./src/data/profile.yaml) (from Zulfan's CV).

---

## 🎮 Features

1. **Custom Tiny 2D Grid Engine** (`src/engine/`):
   - Tile-based grid movement (WASD, Arrow keys, or point-and-click / tap-to-walk).
   - BFS pathfinding on walkable tiles.
   - Building door triggers leading to static Astro routes.
   - Interactive NPC & sign dialogue system.
   - Energy-efficient `requestAnimationFrame` render loop that automatically goes to sleep when idle.

2. **Town Square (`/`)**:
   - Notice board with summary, current focus, featured builds, and core toolbelt.

3. **Dev Center — Mission Control (`/dev`)**:
   - **Mission Timeline**: Filterable chronological feed of Launches (projects), Crew Assignments (work roles), Training (education), and Commendations (awards).
   - **Stack Radar**: Interactive SVG radar chart with 4 quadrants and 4 concentric rings (Core, Go-to, Regular, Flown once) based on skill frequency across missions.
   - **Telemetry Wall**: Live metrics showing GitHub streak, annual contributions, LeetCode problem-solving dials, and active repositories.

4. **Research Lab (`/lab`)**:
   - Undergraduate thesis on detecting obfuscated gambling spam comments (99.56% F1).
   - AeroScan edge AI military aircraft detection (~1.8 ms/frame with TensorRT on RTX 4060).
   - InceptionV3 transfer learning and methodology.

5. **Arcade (`/arcade`)**:
   - Playable **Kalah (Mancala)** board game against an AI bot using **Alpha-Beta minimax search** running inside a **Web Worker** so the main thread never freezes.

6. **Critterdex & Tall Grass Encounters**:
   - Walking in tall grass triggers retro turn-based wild encounters.
   - Catch up to 12 collectible procedural critters stored in `localStorage`.
   - Custom **Trainer Card** generator exportable directly as PNG.

7. **AI Digital Twin & Front Desk (`/twin` & `/reception`)**:
   - Chat interface grounded in `profile.yaml`.
   - Powered by Cloudflare Workers AI with fallback for local preview.

8. **Sound Synthesizer (`src/game/sfx.ts`)**:
   - Pure Web Audio API chiptune audio synthesizer (zero heavy audio files).

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 22.23.4 (currently running v22.23.4)

### Development
```bash
# Navigate to the project folder
cd 2D_Porto

# Install dependencies (if needed)
npm install

# Start local dev server
npm run dev
```

### Production Build & Preview
```bash
# Build static site and generate assistant knowledge
npm run build

# Preview with Wrangler (Cloudflare Worker environment)
npm run preview
```

### Deploy to Cloudflare Workers
```bash
npm run deploy
```
