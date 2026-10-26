import type { Critter } from '../lib/schema';

export function renderCritterOnCanvas(
  canvas: HTMLCanvasElement,
  critter: Critter,
  size = 64
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const c1 = critter.colors[0];
  const c2 = critter.colors[1];
  const scale = size / 16;

  // Background glow
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, c1 + '44');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Shadow
  ctx.fillStyle = 'rgba(28, 23, 38, 0.4)';
  ctx.beginPath();
  ctx.ellipse(size / 2, size - 8, size / 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Procedural Pixel Art Monster silhouette based on type
  const px = (x: number, y: number, w: number, h: number, col: string) => {
    ctx.fillStyle = col;
    ctx.fillRect(Math.round(x * scale), Math.round(y * scale), Math.round(w * scale), Math.round(h * scale));
  };

  // Base Body
  px(4, 5, 8, 7, c1);
  px(3, 7, 10, 4, c1);

  // Secondary highlights / belly / markings
  px(5, 8, 6, 3, c2);

  // Ears / Horns / Wings depending on ID
  if (critter.id === 'sparkbit' || critter.id === 'yolowl') {
    // pointed ears
    px(3, 3, 2, 3, c2);
    px(11, 3, 2, 3, c2);
    // lightning / psychic crest
    px(7, 2, 2, 3, '#fff');
  } else if (critter.id === 'pythorn' || critter.id === 'postgrub') {
    // segmented body
    px(2, 9, 3, 3, c2);
    px(11, 9, 3, 3, c2);
    px(5, 3, 2, 2, c2);
    px(9, 3, 2, 2, c2);
  } else if (critter.id === 'delphino' || critter.id === 'kafkoi') {
    // fins / tail
    px(1, 7, 2, 3, c2);
    px(13, 7, 2, 3, c2);
    px(7, 2, 2, 3, c2);
  } else if (critter.id === 'garudrake') {
    // legendary wings & crown
    px(1, 4, 3, 6, c1);
    px(12, 4, 3, 6, c1);
    px(6, 1, 4, 3, '#ff0');
    px(5, 7, 6, 4, c2);
  } else {
    // standard cute ears
    px(4, 3, 2, 3, c2);
    px(10, 3, 2, 3, c2);
  }

  // Eyes (Classic GameBoy 2x2 pupils)
  px(5, 6, 2, 2, '#1c1726');
  px(9, 6, 2, 2, '#1c1726');
  px(5, 6, 1, 1, '#fff');
  px(9, 6, 1, 1, '#fff');

  // Cute cheeks
  px(3, 8, 1, 1, '#ff5d5d');
  px(12, 8, 1, 1, '#ff5d5d');

  // Feet
  px(4, 12, 3, 2, '#1c1726');
  px(9, 12, 3, 2, '#1c1726');
}
