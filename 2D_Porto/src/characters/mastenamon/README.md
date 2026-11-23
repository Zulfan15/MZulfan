# Mastenamon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `mastenamon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Mastenamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/mastenamon/` (without `adapters/`)
3. `public/assets/characters/mastenamon/`

Then import from `src/characters/mastenamon`:

```ts
import {
  loadMastenamon,
  createMastenamonAnimator,
  directionFromVector,
} from './characters/mastenamon';

const sprites = await loadMastenamon('/assets/characters/mastenamon');
const animator = createMastenamonAnimator(sprites);

// Inside your game loop:
animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, playerX, playerFootY, { height: 48 });

// Trigger a special ability:
animator.playAction('chaosDegradation');
```

## Updating Artwork

Coordinate tables live strictly as plain data in `mastenamon.frames.ts`, and clip timings live in `mastenamon.animations.ts`. Replace or tweak numbers there without touching any slicer or animation code.
