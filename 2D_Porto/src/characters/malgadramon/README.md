# Malgadramon Character Module

Standalone, framework-agnostic sprite & animation module for **Malgadramon**.

## Assets (`public/assets/characters/malgadramon/`)
- `malgadramon.webp` — Active reference sheet (icon, 8 HD poses, 8 mini sprites).
- `idle-cycle.webp` — *(Pending Nano Banana quota reset)* 4×4 idle sheet; enable in `malgadramon.assets.ts`.
- `walk-cycle.webp` — *(Pending Nano Banana quota reset)* 4×4 walk sheet; enable in `malgadramon.assets.ts`.
- `battle.webp` — *(Pending Nano Banana quota reset)* Bio-Rail Laceration battle/action sheet; enable in `malgadramon.assets.ts`.

When the 3 sheets are null, `loadMalgadramon()` derives clean 8-directional frames from `malgadramon.webp` while preserving the final `[0..31]` idle, `[32..63]` walk, and `[64..71]` battle index layout.
