# Jesmon (X Antibody) Character Module

Modular, engine-agnostic 8-directional character built from all 5 source assets (`idle.jpg`, `walk-cycle.jpg`, `battle.jpg`, `jesmon-x.jpg`, `jesmon-x-ds.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Jesmon (X Antibody) in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/jesmon_x/` (without `adapters/`)
3. `public/assets/characters/jesmon_x/`

Then import from `src/characters/jesmon_x`:

```ts
import {
  loadJesmonX,
  createJesmonXAnimator,
  directionFromVector,
} from './characters/jesmon_x';

const sprites = await loadJesmonX('/assets/characters/jesmon_x');
const animator = createJesmonXAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('tekkenSeibai');
```
