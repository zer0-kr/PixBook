#!/usr/bin/env node
/**
 * Post-process raw DALL-E sprites into 64x64 pixel art PNGs.
 *
 * Usage:
 *   node scripts/sprites/post-process.mjs
 *   node scripts/sprites/post-process.mjs --only baby-bookworm
 */

import { readdir, mkdir } from "node:fs/promises";
import { resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const RAW_DIR = resolve(ROOT, "tmp/sprites-raw");
const OUT_DIR = resolve(ROOT, "public/sprites/characters");

const TARGET_SIZE = 64;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const onlySlug = args.indexOf("--only") !== -1 ? args[args.indexOf("--only") + 1] : undefined;

// ---------------------------------------------------------------------------
// Processing pipeline
// ---------------------------------------------------------------------------
async function processSprite(inputPath, outputPath) {
  const filename = basename(inputPath, ".png");

  try {
    // Step 1: Load image and get metadata
    let img = sharp(inputPath);
    const meta = await img.metadata();
    console.log(`  Input: ${meta.width}x${meta.height}, ${meta.channels}ch`);

    // Step 2: Trim transparent/white background and get PNG buffer
    const trimmedBuf = await sharp(inputPath)
      .trim({ threshold: 30 })
      .ensureAlpha()
      .png()
      .toBuffer();

    const trimMeta = await sharp(trimmedBuf).metadata();
    console.log(`  After trim: ${trimMeta.width}x${trimMeta.height}`);

    // Step 3: Normalize to square canvas (add padding to make square)
    const maxDim = Math.max(trimMeta.width, trimMeta.height);
    const padX = Math.floor((maxDim - trimMeta.width) / 2);
    const padY = Math.floor((maxDim - trimMeta.height) / 2);

    let squareBuffer = await sharp(trimmedBuf)
      .extend({
        top: padY,
        bottom: maxDim - trimMeta.height - padY,
        left: padX,
        right: maxDim - trimMeta.width - padX,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // Step 4: Resize to 64x64 with nearest-neighbor (critical for pixel art)
    let resizedBuffer = await sharp(squareBuffer)
      .resize(TARGET_SIZE, TARGET_SIZE, {
        kernel: sharp.kernel.nearest,
        fit: "fill",
      })
      .png()
      .toBuffer();

    // Step 5: Clean up alpha channel — threshold at 128
    const resizedMeta = await sharp(resizedBuffer).metadata();
    const rawPixels = await sharp(resizedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer();

    const cleanedPixels = Buffer.from(rawPixels);
    for (let i = 3; i < cleanedPixels.length; i += 4) {
      cleanedPixels[i] = cleanedPixels[i] < 128 ? 0 : 255;
    }

    // Step 6: Save as PNG with alpha channel preserved
    await sharp(cleanedPixels, {
      raw: {
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        channels: 4,
      },
    })
      .png({
        compressionLevel: 9,
      })
      .toFile(outputPath);

    const { stat: fsStat } = await import("node:fs/promises");
    const stats = await fsStat(outputPath);
    console.log(
      `  ✓ Output: ${TARGET_SIZE}x${TARGET_SIZE}, ${(stats.size / 1024).toFixed(1)} KB → ${outputPath}`
    );

    return true;
  } catch (err) {
    console.error(`  ✗ Failed to process ${filename}: ${err.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Get all raw PNG files
  let files;
  try {
    files = (await readdir(RAW_DIR)).filter((f) => f.endsWith(".png"));
  } catch {
    console.error(`ERROR: Raw sprites directory not found: ${RAW_DIR}`);
    console.error("Run generate.mjs first.");
    process.exit(1);
  }

  if (onlySlug) {
    files = files.filter((f) => basename(f, ".png") === onlySlug);
  }

  if (files.length === 0) {
    console.error("No raw sprite files found to process.");
    process.exit(1);
  }

  console.log(`\n🔧 Post-processing ${files.length} sprites...\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const slug = basename(file, ".png");
    console.log(`[${success + failed + 1}/${files.length}] ${slug}`);

    const inputPath = resolve(RAW_DIR, file);
    const outputPath = resolve(OUT_DIR, file);

    const ok = await processSprite(inputPath, outputPath);
    if (ok) success++;
    else failed++;
  }

  console.log("\n─────────────────────────────────");
  console.log(`✓ Success: ${success}`);
  if (failed) console.log(`✗ Failed:  ${failed}`);
  console.log("─────────────────────────────────\n");

  if (failed > 0) process.exit(1);
}

main();
