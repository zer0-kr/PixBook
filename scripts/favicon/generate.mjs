#!/usr/bin/env node

/**
 * 픽북 파비콘 원본 이미지 생성 (32x32 픽셀아트)
 * sharp로 직접 픽셀을 찍어 3색 블록 탑 + 스파클 렌더링
 * Usage: node scripts/favicon/generate.mjs
 */

import sharp from "sharp";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../../tmp/favicon-raw.png");

const W = 32;
const H = 32;

// Colors
const BG = [0xff, 0xf8, 0xe7]; // cream #FFF8E7
const BLUE = [0x34, 0x98, 0xdb]; // #3498DB
const GOLD = [0xff, 0xd7, 0x00]; // #FFD700
const BROWN = [0x3d, 0x2c, 0x2e]; // #3D2C2E
const SPARKLE = [0xff, 0xd7, 0x00]; // gold sparkle

// Create RGBA buffer
const buf = Buffer.alloc(W * H * 4);

function setPixel(x, y, [r, g, b], a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = r;
  buf[i + 1] = g;
  buf[i + 2] = b;
  buf[i + 3] = a;
}

function fillRect(x, y, w, h, color) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x + dx, y + dy, color);
    }
  }
}

// Fill background
fillRect(0, 0, W, H, BG);

// Book stack — centered, wider at bottom (tower shape)
// Brown block (bottom): 16px wide, 6px tall
const brownW = 16;
const brownH = 6;
const brownX = (W - brownW) / 2; // 8
const brownY = 24;
fillRect(brownX, brownY, brownW, brownH, BROWN);

// Gold block (middle): 14px wide, 6px tall
const goldW = 14;
const goldH = 6;
const goldX = (W - goldW) / 2; // 9
const goldY = 18;
fillRect(goldX, goldY, goldW, goldH, GOLD);

// Blue block (top): 12px wide, 6px tall
const blueW = 12;
const blueH = 6;
const blueX = (W - blueW) / 2; // 10
const blueY = 12;
fillRect(blueX, blueY, blueW, blueH, BLUE);

// Sparkle above the stack
setPixel(16, 9, SPARKLE); // center dot
setPixel(15, 9, SPARKLE); // left
setPixel(17, 9, SPARKLE); // right
setPixel(16, 8, SPARKLE); // top
setPixel(16, 10, SPARKLE); // bottom (cross shape ✦)

await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .toFile(OUT);

console.log(`Generated ${OUT} (${W}x${H})`);
