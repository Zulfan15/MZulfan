import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;

interface OgCardSpec {
  filename: string;
  bgTop: [number, number, number];
  bgBottom: [number, number, number];
  accent: [number, number, number];
  badgeColor: [number, number, number];
  kicker: string;
  title: string;
  subtitle: string;
  stats: string[];
  routeTag: string;
}

const CARDS: OgCardSpec[] = [
  {
    filename: 'town.png',
    bgTop: [22, 34, 62],
    bgBottom: [15, 23, 42],
    accent: [250, 204, 21],
    badgeColor: [16, 185, 129],
    kicker: 'INTERACTIVE 2D PIXEL PORTFOLIO',
    title: 'ZULFANS TOWN // MUHAMMAD ZULFAN',
    subtitle: 'AI ENGINEER  |  CLOUD ARCHITECT  |  BACKEND & CV',
    stats: ['35+ POKEMON', '40 DIGIMON', '16 INTERACTIVE ROOMS'],
    routeTag: 'ZULFAN-TOWN /',
  },
  {
    filename: 'dev.png',
    bgTop: [17, 24, 52],
    bgBottom: [10, 14, 32],
    accent: [56, 189, 248],
    badgeColor: [59, 130, 246],
    kicker: 'DEV CENTER // MISSION CONTROL',
    title: 'CLOUD, AI & DISTRIBUTED SYSTEMS',
    subtitle: 'AEROSCAN YOLOV11  |  FOODLINK KAFKA + K8S  |  SPAM 99.56%',
    stats: ['7 PROJECTS', 'LIVE KUDOS', 'SYSTEM ARCHITECTURE'],
    routeTag: 'ZULFAN-TOWN /DEV',
  },
  {
    filename: 'lab.png',
    bgTop: [38, 22, 68],
    bgBottom: [17, 12, 36],
    accent: [192, 132, 252],
    badgeColor: [168, 85, 247],
    kicker: 'RESEARCH LAB // EXPERIMENTS',
    title: 'COMPUTER VISION & THESIS SANDBOX',
    subtitle: 'TF-IDF SPAM DETECTOR  |  INCEPTIONV3  |  AUTO OMR GRADER',
    stats: ['99.56% F1', 'TENSORRT FP16', 'LIVE SANDBOXES'],
    routeTag: 'ZULFAN-TOWN /LAB',
  },
  {
    filename: 'digimon.png',
    bgTop: [12, 42, 64],
    bgBottom: [8, 20, 38],
    accent: [34, 211, 238],
    badgeColor: [6, 182, 212],
    kicker: 'DIGI-SANCTUARY // CYBER WORLD',
    title: '40 DIGIMON DS PARTNERS & DIGIDEX',
    subtitle: 'CYBER PORTAL  |  PATROL AI  |  EVOLUTION TREE',
    stats: ['40 DIGIMON', 'PIXEL SPRITES', 'POKESNAP READY'],
    routeTag: 'ZULFAN-TOWN /DIGIMON',
  },
];

// Compact 5x7 pixel font for crisp bitmap headers
const FONT_5X7: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10011', '10101', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ',': ['00000', '00000', '00000', '00000', '00110', '00100', '01000'],
  ':': ['00000', '01100', '01100', '00000', '01100', '01100', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '|': ['00100', '00100', '00100', '00100', '00100', '00100', '00100'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
};

function setPx(buf: Buffer, x: number, y: number, r: number, g: number, b: number) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const idx = (y * WIDTH + x) * 4;
  buf[idx] = r;
  buf[idx + 1] = g;
  buf[idx + 2] = b;
  buf[idx + 3] = 255;
}

function fillRect(buf: Buffer, x: number, y: number, w: number, h: number, rgb: [number, number, number]) {
  const [r, g, b] = rgb;
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPx(buf, px, py, r, g, b);
    }
  }
}

function drawText(buf: Buffer, text: string, x: number, y: number, scale: number, rgb: [number, number, number]) {
  const upper = text.toUpperCase();
  let cursorX = x;
  for (const ch of upper) {
    const glyph = FONT_5X7[ch] || FONT_5X7[' '];
    for (let row = 0; row < 7; row++) {
      const line = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (line[col] === '1') {
          fillRect(buf, cursorX + col * scale, y + row * scale, scale, scale, rgb);
        }
      }
    }
    cursorX += 6 * scale;
  }
}

function crc32(data: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c ^= data[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(rgba: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = WIDTH * 4;
  const raw = Buffer.alloc((stride + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    raw[y * (stride + 1)] = 0; // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 6 });

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function renderCard(spec: OgCardSpec): Buffer {
  const buf = Buffer.alloc(WIDTH * HEIGHT * 4);

  // Gradient + subtle pixel grid
  for (let y = 0; y < HEIGHT; y++) {
    const t = y / HEIGHT;
    const baseR = Math.round(spec.bgTop[0] + (spec.bgBottom[0] - spec.bgTop[0]) * t);
    const baseG = Math.round(spec.bgTop[1] + (spec.bgBottom[1] - spec.bgTop[1]) * t);
    const baseB = Math.round(spec.bgTop[2] + (spec.bgBottom[2] - spec.bgTop[2]) * t);
    for (let x = 0; x < WIDTH; x++) {
      const gridLine = x % 40 === 0 || y % 40 === 0;
      const r = gridLine ? Math.min(255, baseR + 10) : baseR;
      const g = gridLine ? Math.min(255, baseG + 12) : baseG;
      const b = gridLine ? Math.min(255, baseB + 16) : baseB;
      setPx(buf, x, y, r, g, b);
    }
  }

  // Retro Outer Frame
  fillRect(buf, 36, 36, WIDTH - 72, HEIGHT - 72, [28, 23, 38]);
  fillRect(buf, 44, 44, WIDTH - 88, HEIGHT - 88, spec.accent);
  fillRect(buf, 52, 52, WIDTH - 104, HEIGHT - 104, [15, 23, 42]);

  // Top Header Strip
  fillRect(buf, 52, 52, WIDTH - 104, 72, spec.bgTop);
  fillRect(buf, 78, 72, 26, 26, spec.badgeColor);
  fillRect(buf, 84, 78, 14, 14, spec.accent);
  drawText(buf, spec.kicker, 122, 74, 4, spec.accent);
  drawText(buf, spec.routeTag, WIDTH - 78 - spec.routeTag.length * 18, 78, 3, [203, 213, 225]);

  // Main Headline & Subtitle
  drawText(buf, spec.title, 78, 175, 5, [248, 250, 252]);
  drawText(buf, spec.subtitle, 78, 245, 3, [148, 163, 184]);

  // Pixel Divider Line
  fillRect(buf, 78, 305, WIDTH - 156, 6, spec.accent);

  // Decorative Pokeball Pixel Badge on bottom-right
  const cx = WIDTH - 155;
  const cy = 445;
  fillRect(buf, cx - 54, cy - 54, 108, 108, [255, 255, 255]);
  fillRect(buf, cx - 54, cy - 54, 108, 52, spec.badgeColor);
  fillRect(buf, cx - 54, cy - 6, 108, 14, [15, 23, 42]);
  fillRect(buf, cx - 18, cy - 18, 36, 36, [15, 23, 42]);
  fillRect(buf, cx - 11, cy - 11, 22, 22, [255, 255, 255]);

  // 3 Highlight Stat Pills
  let sx = 78;
  for (const stat of spec.stats) {
    const pw = stat.length * 18 + 38;
    fillRect(buf, sx, 360, pw, 62, [30, 41, 59]);
    fillRect(buf, sx, 360, pw, 6, spec.badgeColor);
    drawText(buf, stat, sx + 18, 381, 3, [241, 245, 249]);
    sx += pw + 22;
  }

  // Footer
  drawText(buf, 'EXPLORE LIVE: ZULFAN-TOWN INTERACTIVE PORTFOLIO', 78, 505, 3, spec.accent);

  return encodePng(buf);
}

const outDir = path.resolve(process.cwd(), 'public', 'og');
fs.mkdirSync(outDir, { recursive: true });

for (const spec of CARDS) {
  const png = renderCard(spec);
  fs.writeFileSync(path.join(outDir, spec.filename), png);
  console.log(`Generated ${path.join('public', 'og', spec.filename)} (${png.length} bytes)`);
}
