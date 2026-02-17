#!/usr/bin/env node

/**
 * 파비콘 원본 이미지를 멀티 포맷으로 변환
 * Usage: node scripts/favicon/process.mjs [input-path]
 * Default input: tmp/favicon-raw.png
 */

import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const INPUT = process.argv[2] || resolve(ROOT, "tmp/favicon-raw.png");
const APP_DIR = resolve(ROOT, "src/app");

/** ICO 파일 생성 (16x16 + 32x32) */
async function createIco(img) {
  const sizes = [16, 32];
  const images = await Promise.all(
    sizes.map((s) =>
      img.clone().resize(s, s, { kernel: "nearest" }).ensureAlpha().png().toBuffer()
    )
  );

  // ICO format: header + directory entries + image data
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * images.length;
  let offset = headerSize + dirSize;

  // ICO header
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count

  // Directory entries
  const entries = Buffer.alloc(dirSize);
  for (let i = 0; i < images.length; i++) {
    const s = sizes[i];
    const pos = i * dirEntrySize;
    entries.writeUInt8(s < 256 ? s : 0, pos); // width
    entries.writeUInt8(s < 256 ? s : 0, pos + 1); // height
    entries.writeUInt8(0, pos + 2); // color palette
    entries.writeUInt8(0, pos + 3); // reserved
    entries.writeUInt16LE(1, pos + 4); // color planes
    entries.writeUInt16LE(32, pos + 6); // bits per pixel
    entries.writeUInt32LE(images[i].length, pos + 8); // size
    entries.writeUInt32LE(offset, pos + 12); // offset
    offset += images[i].length;
  }

  return Buffer.concat([header, entries, ...images]);
}

async function main() {
  console.log(`Processing: ${INPUT}`);
  const img = sharp(INPUT);

  // favicon.ico (16x16 + 32x32)
  const ico = await createIco(img);
  const icoPath = resolve(APP_DIR, "favicon.ico");
  await writeFile(icoPath, ico);
  console.log(`  favicon.ico: ${ico.length} bytes`);

  // icon.png (192x192)
  const iconPath = resolve(APP_DIR, "icon.png");
  await img
    .clone()
    .resize(192, 192, { kernel: "nearest" })
    .png()
    .toFile(iconPath);
  console.log(`  icon.png: 192x192`);

  // apple-icon.png (180x180)
  const applePath = resolve(APP_DIR, "apple-icon.png");
  await img
    .clone()
    .resize(180, 180, { kernel: "nearest" })
    .png()
    .toFile(applePath);
  console.log(`  apple-icon.png: 180x180`);

  console.log("Done!");
}

main();
