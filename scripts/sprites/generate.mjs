#!/usr/bin/env node
/**
 * Generate character sprites using DALL-E 3.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/sprites/generate.mjs
 *
 * Options:
 *   --only <slug>      Generate only one character
 *   --rarity <tier>    Generate only a specific rarity tier
 *   --skip-existing    Skip characters that already have raw images
 */

import { writeFile, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { CHARACTER_PROMPTS, buildPrompt } from "./prompts.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const RAW_DIR = resolve(ROOT, "tmp/sprites-raw");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}
const onlySlug = getArg("only");
const onlyRarity = getArg("rarity");
const skipExisting = args.includes("--skip-existing");

// ---------------------------------------------------------------------------
// OpenAI client
// ---------------------------------------------------------------------------
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required.");
  process.exit(1);
}
const openai = new OpenAI({ apiKey });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateSprite(character, retries = 3) {
  const fullPrompt = buildPrompt(character);
  const outPath = resolve(RAW_DIR, `${character.slug}.png`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `  [${attempt}/${retries}] Calling DALL-E 3 for "${character.slug}"...`
      );

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
      });

      const b64 = response.data[0].b64_json;
      const buffer = Buffer.from(b64, "base64");
      await writeFile(outPath, buffer);

      console.log(`  ✓ Saved ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
      return true;
    } catch (err) {
      const isRateLimit =
        err?.status === 429 || err?.code === "rate_limit_exceeded";

      if (isRateLimit && attempt < retries) {
        const wait = 15000 * attempt;
        console.warn(
          `  ⚠ Rate limited. Waiting ${wait / 1000}s before retry...`
        );
        await sleep(wait);
        continue;
      }

      if (attempt < retries) {
        console.warn(
          `  ⚠ Attempt ${attempt} failed: ${err.message}. Retrying...`
        );
        await sleep(3000);
        continue;
      }

      console.error(`  ✗ Failed after ${retries} attempts: ${err.message}`);
      return false;
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  await mkdir(RAW_DIR, { recursive: true });

  // Filter characters
  let characters = CHARACTER_PROMPTS;
  if (onlySlug) {
    characters = characters.filter((c) => c.slug === onlySlug);
    if (characters.length === 0) {
      console.error(`No character found with slug "${onlySlug}"`);
      process.exit(1);
    }
  }
  if (onlyRarity) {
    characters = characters.filter((c) => c.rarity === onlyRarity);
    if (characters.length === 0) {
      console.error(`No characters found with rarity "${onlyRarity}"`);
      process.exit(1);
    }
  }

  console.log(`\n🎨 Generating ${characters.length} character sprites...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const outPath = resolve(RAW_DIR, `${char.slug}.png`);

    console.log(
      `[${i + 1}/${characters.length}] ${char.slug} (${char.rarity})`
    );

    if (skipExisting && (await fileExists(outPath))) {
      console.log("  → Skipping (already exists)");
      skipped++;
      continue;
    }

    const ok = await generateSprite(char);
    if (ok) {
      success++;
    } else {
      failed++;
    }

    // Delay between requests to avoid rate limiting
    if (i < characters.length - 1) {
      await sleep(2000);
    }
  }

  console.log("\n─────────────────────────────────");
  console.log(`✓ Success: ${success}`);
  if (skipped) console.log(`→ Skipped: ${skipped}`);
  if (failed) console.log(`✗ Failed:  ${failed}`);
  console.log("─────────────────────────────────\n");

  if (failed > 0) {
    console.log("Re-run with --skip-existing to retry only failed ones.");
    process.exit(1);
  }
}

main();
