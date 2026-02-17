#!/usr/bin/env node

/**
 * DALL-E 3로 픽북 파비콘 원본 이미지 생성
 * Usage: OPENAI_API_KEY=... node scripts/favicon/generate.mjs
 */

import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = `${__dirname}/../../tmp/favicon-raw.png`;

const PROMPT = `A 32x32 pixel art icon on a solid cream (#FFF8E7) background.
The design shows a small stack of 3 colorful books (brown #3D2C2E spines, gold #FFD700 pages)
forming a tiny tower, with a single bright pixel star on top.
Clean, minimal, retro game style.
No text, no border, perfectly centered.
Sharp pixel edges, no anti-aliasing, no gradients.`;

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("Error: OPENAI_API_KEY is required");
    process.exit(1);
  }

  console.log("Generating favicon with DALL-E 3...");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: PROMPT,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`DALL-E API error (${res.status}):`, err);
    process.exit(1);
  }

  const { data } = await res.json();
  const buf = Buffer.from(data[0].b64_json, "base64");
  await writeFile(OUT, buf);
  console.log(`Saved raw image to ${OUT} (${buf.length} bytes)`);
}

main();
