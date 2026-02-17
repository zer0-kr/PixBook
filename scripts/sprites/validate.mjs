#!/usr/bin/env node
/**
 * Validate that all 62 character sprites exist and meet specifications.
 *
 * Usage:
 *   node scripts/sprites/validate.mjs
 */

import { access, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const SPRITES_DIR = resolve(ROOT, "public/sprites/characters");

// All 62 character slugs from milestones.ts
const ALL_SLUGS = [
  // Common (30)
  "baby-bookworm", "curious-cat", "reading-rabbit", "note-squirrel",
  "dreaming-cloud", "bookmark-fairy", "letter-firefly", "story-snail",
  "origami-crane", "ink-octopus", "sleepy-bear", "adventure-turtle",
  "rainbow-parrot", "shooting-star-hamster", "singing-cricket",
  "collector-magpie", "chef-raccoon", "detective-hedgehog",
  "artist-chameleon", "mailbird-pigeon", "musician-frog", "gardener-mole",
  "math-ant", "inventor-mouse", "surfing-otter", "photographer-meerkat",
  "philosopher-owl", "sculptor-beaver", "astronomer-owl", "marathon-cheetah",
  // Rare (20)
  "wise-owl", "magic-fox", "explorer-penguin", "sea-seahorse",
  "lightning-rabbit", "wind-hawk", "dragon-librarian", "moonlight-wolf",
  "crystal-deer", "rainbow-snake", "time-crane", "petal-butterfly",
  "constellation-whale", "mist-giraffe", "volcano-salamander",
  "snowflake-polarbear", "golden-eagle", "aurora-reindeer", "coral-turtle",
  "galaxy-dolphin",
  // Epic (8)
  "phoenix-reader", "unicorn-poet", "lightning-griffin", "crystal-dragon",
  "odin-raven", "deep-kraken", "world-tree-spirit", "spacetime-sphinx",
  // Legendary (4)
  "sky-whale", "starlight-reader", "sage-of-time", "cosmic-reader",
];

const TARGET_SIZE = 64;
const SIZE_WARN_KB = 10;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
async function validateSprite(slug) {
  const filePath = resolve(SPRITES_DIR, `${slug}.png`);
  const issues = [];

  // 1. File existence
  try {
    await access(filePath);
  } catch {
    return { slug, exists: false, issues: ["FILE MISSING"] };
  }

  // 2. File size (warning only, not a hard failure)
  const fileStat = await stat(filePath);
  const sizeKB = fileStat.size / 1024;

  // 3. Image metadata
  try {
    const meta = await sharp(filePath).metadata();

    // Check dimensions
    if (meta.width !== TARGET_SIZE || meta.height !== TARGET_SIZE) {
      issues.push(`Dimensions ${meta.width}x${meta.height} (expected ${TARGET_SIZE}x${TARGET_SIZE})`);
    }

    // Check format
    if (meta.format !== "png") {
      issues.push(`Format "${meta.format}" (expected "png")`);
    }

    // Check alpha channel
    if (!meta.hasAlpha) {
      issues.push("No alpha channel");
    }

    return {
      slug,
      exists: true,
      width: meta.width,
      height: meta.height,
      format: meta.format,
      hasAlpha: meta.hasAlpha,
      sizeKB,
      issues,
      sizeWarning: sizeKB > SIZE_WARN_KB,
    };
  } catch (err) {
    issues.push(`Cannot read image: ${err.message}`);
    return { slug, exists: true, sizeKB, issues };
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n🔍 Validating ${ALL_SLUGS.length} character sprites...\n`);

  const results = await Promise.all(ALL_SLUGS.map(validateSprite));

  const missing = results.filter((r) => !r.exists);
  const withIssues = results.filter((r) => r.exists && r.issues.length > 0);
  const valid = results.filter((r) => r.exists && r.issues.length === 0);
  const sizeWarnings = results.filter((r) => r.sizeWarning);

  // Report valid sprites
  const allPresent = results.filter((r) => r.exists);
  if (allPresent.length > 0) {
    console.log(`✓ Valid sprites: ${valid.length}/${ALL_SLUGS.length}`);
    const totalSize = allPresent.reduce((sum, r) => sum + (r.sizeKB || 0), 0);
    console.log(`  Total size: ${totalSize.toFixed(1)} KB (avg ${(totalSize / allPresent.length).toFixed(1)} KB each)`);
  }

  // Report size warnings (non-blocking)
  if (sizeWarnings.length > 0) {
    console.log(`\n⚠ Size warnings (> ${SIZE_WARN_KB} KB): ${sizeWarnings.length}`);
    for (const r of sizeWarnings) {
      console.log(`  - ${r.slug}: ${r.sizeKB.toFixed(1)} KB`);
    }
  }

  // Report hard issues
  if (withIssues.length > 0) {
    console.log(`\n✗ Sprites with errors: ${withIssues.length}`);
    for (const r of withIssues) {
      console.log(`  ${r.slug}:`);
      for (const issue of r.issues) {
        console.log(`    - ${issue}`);
      }
    }
  }

  // Report missing
  if (missing.length > 0) {
    console.log(`\n✗ Missing sprites: ${missing.length}`);
    for (const r of missing) {
      console.log(`  - ${r.slug}`);
    }
  }

  // Summary
  console.log("\n─────────────────────────────────");
  console.log(`Total:   ${ALL_SLUGS.length}`);
  console.log(`Valid:   ${valid.length}`);
  console.log(`Issues:  ${withIssues.length}`);
  console.log(`Missing: ${missing.length}`);
  console.log("─────────────────────────────────\n");

  if (missing.length > 0 || withIssues.length > 0) {
    process.exit(1);
  }

  console.log("All sprites valid! ✓\n");
}

main();
