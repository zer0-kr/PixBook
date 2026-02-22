/**
 * DALL-E 3 prompts for 62 PixBook character sprites.
 * Theme: Height-based everyday objects & landmarks.
 *
 * Structure: STYLE_PREFIX + RARITY_MODIFIER[rarity] + character description
 */

const STYLE_PREFIX =
  "64x64 pixel art sprite, retro 8-bit game style, transparent background, " +
  "single object centered on canvas, warm cream and brown color palette, " +
  "1-2px dark brown (#3D2C2E) outline, cute kawaii face (small dot eyes and tiny smile), " +
  "chibi proportions, no text, no UI elements, clean pixel edges";

const RARITY_MODIFIER = {
  common: "simple clean design, flat colors, minimal shading",
  rare: "subtle magical sparkles, richer details, slight glow effect",
  epic: "mystical aura, glowing elements, luminous accents, ethereal atmosphere",
  legendary:
    "golden cosmic halo, maximum detail, radiant glow, divine presence, star particles",
};

/**
 * @type {Array<{ slug: string, rarity: string, prompt: string }>}
 */
export const CHARACTER_PROMPTS = [
  // ==========================================
  // COMMON (30 characters, 0–850cm)
  // ==========================================
  {
    slug: "rice-grain",
    rarity: "common",
    prompt:
      "a single tiny white rice grain character, oval shaped, cute face, sitting on a small green leaf, minimal and adorable",
  },
  {
    slug: "acorn",
    rarity: "common",
    prompt:
      "a small brown acorn character with a cute cap hat, rosy cheeks, standing on a tiny twig, autumn leaf nearby",
  },
  {
    slug: "bottle-cap",
    rarity: "common",
    prompt:
      "a shiny metal bottle cap character, circular shape, ridged edges like a crown, reflective silver surface, cute face, standing upright",
  },
  {
    slug: "macaron",
    rarity: "common",
    prompt:
      "a cute pastel pink macaron character, two round cookie halves with cream filling, small crumbs, french patisserie style",
  },
  {
    slug: "tangerine",
    rarity: "common",
    prompt:
      "a round orange tangerine character with a small green leaf on top, cute face, slightly textured skin, bright and cheerful",
  },
  {
    slug: "coffee-mug",
    rarity: "common",
    prompt:
      "a warm coffee mug character, white ceramic with a small heart on it, steam rising from top, cozy and inviting, cute face on the mug",
  },
  {
    slug: "candle",
    rarity: "common",
    prompt:
      "a small lit candle character, warm yellow flame on top, white wax body, melting slightly, warm glow, cute face on the candle body",
  },
  {
    slug: "banana",
    rarity: "common",
    prompt:
      "a bright yellow banana character, slightly curved, peeled halfway, cute face, tropical and cheerful",
  },
  {
    slug: "milk-carton",
    rarity: "common",
    prompt:
      "a small milk carton character, white and blue rectangular box, triangular roof top, cute face, straw sticking out",
  },
  {
    slug: "sneaker",
    rarity: "common",
    prompt:
      "a colorful sneaker shoe character, red and white athletic shoe, untied laces, cute face on the side, sporty and fun",
  },
  {
    slug: "sitting-cat",
    rarity: "common",
    prompt:
      "a cute orange tabby cat sitting upright, fluffy, small whiskers, curled tail, content expression, cozy domestic cat",
  },
  {
    slug: "bouquet",
    rarity: "common",
    prompt:
      "a flower bouquet character, mixed colorful flowers (pink roses, white daisies) wrapped in brown paper, tied with a ribbon, cute face peeking from flowers",
  },
  {
    slug: "teddy-bear",
    rarity: "common",
    prompt:
      "a brown teddy bear character, soft and fluffy, button eyes, small red bow tie, sitting pose, huggable and warm",
  },
  {
    slug: "cactus",
    rarity: "common",
    prompt:
      "a small green cactus character in a terracotta pot, two small arms, tiny pink flower on top, cute face, desert vibes",
  },
  {
    slug: "fire-extinguisher",
    rarity: "common",
    prompt:
      "a red fire extinguisher character, cylindrical body, black nozzle on top, cute determined face, small pressure gauge",
  },
  {
    slug: "ukulele",
    rarity: "common",
    prompt:
      "a small wooden ukulele character, light brown body, four strings, cute face on the sound hole, musical notes floating",
  },
  {
    slug: "puppy",
    rarity: "common",
    prompt:
      "a cute golden retriever puppy character, sitting with tongue out, wagging tail, floppy ears, happy and playful",
  },
  {
    slug: "globe",
    rarity: "common",
    prompt:
      "a desk globe character, blue oceans and green continents visible, on a small brown stand, cute face on the globe, spinning slightly",
  },
  {
    slug: "guitar",
    rarity: "common",
    prompt:
      "an acoustic guitar character, wooden body, six strings, cute face on the body, small musical notes around, warm brown tones",
  },
  {
    slug: "umbrella",
    rarity: "common",
    prompt:
      "a red umbrella character, open and upright, curved wooden handle, raindrops around, cute face under the canopy, cozy rainy day",
  },
  {
    slug: "telescope",
    rarity: "common",
    prompt:
      "a brass telescope character on a tripod, pointing upward, small stars visible, cute face on the eyepiece end, explorer vibes",
  },
  {
    slug: "bicycle",
    rarity: "common",
    prompt:
      "a cute bicycle character, red frame, two wheels, small basket with flowers on front, cute face on the frame, cheerful",
  },
  {
    slug: "emperor-penguin",
    rarity: "common",
    prompt:
      "an emperor penguin character, black and white with yellow chest patch, standing tall, cute round body, small flippers, Antarctic vibes",
  },
  {
    slug: "snowboard",
    rarity: "common",
    prompt:
      "a colorful snowboard character, bright blue and orange design, standing upright in snow, cute face on the board, snow particles",
  },
  {
    slug: "person",
    rarity: "common",
    prompt:
      "a cute pixel person character, simple human figure, brown hair, wearing a blue shirt and jeans, waving hand, friendly smile",
  },
  {
    slug: "refrigerator",
    rarity: "common",
    prompt:
      "a white refrigerator character, two-door style, small magnets and photos on front, cute face on upper door, slightly open with light inside",
  },
  {
    slug: "door",
    rarity: "common",
    prompt:
      "a wooden door character, brown with a golden doorknob, slightly ajar with light coming through, cute face, welcoming",
  },
  {
    slug: "piano",
    rarity: "common",
    prompt:
      "an upright piano character, black and white keys visible, wooden brown body, cute face above the keys, musical notes floating",
  },
  {
    slug: "christmas-tree",
    rarity: "common",
    prompt:
      "a decorated Christmas tree character, green with colorful ornaments and a golden star on top, string lights, cute face, festive",
  },
  {
    slug: "basketball-hoop",
    rarity: "common",
    prompt:
      "a basketball hoop character, orange rim with white net, on a tall pole, basketball bouncing nearby, cute face on the backboard",
  },

  // ==========================================
  // RARE (20 characters, 900–4500cm)
  // ==========================================
  {
    slug: "giraffe",
    rarity: "rare",
    prompt:
      "a tall giraffe character, long neck with brown spot pattern, small ossicones on head, gentle smile, standing gracefully, savanna vibes",
  },
  {
    slug: "street-lamp",
    rarity: "rare",
    prompt:
      "a vintage street lamp character, black iron post, warm glowing lantern on top, cute face on the lamp, night sky, small moths around the light",
  },
  {
    slug: "elephant",
    rarity: "rare",
    prompt:
      "a grey elephant character, large floppy ears, long trunk raised up, cute wise eyes, standing firmly, small sparkle near the trunk tip",
  },
  {
    slug: "t-rex",
    rarity: "rare",
    prompt:
      "a cute T-Rex dinosaur character, green scaly body, tiny arms, big head with sharp teeth but friendly smile, prehistoric plants around",
  },
  {
    slug: "school-bus",
    rarity: "rare",
    prompt:
      "a yellow school bus character, SCHOOL BUS sign on top, black wheels, cute face on the front grille, windows with tiny passengers visible",
  },
  {
    slug: "lighthouse",
    rarity: "rare",
    prompt:
      "a red and white striped lighthouse character, bright beam of light from top, standing on rocky shore, waves below, cute face, guiding ships",
  },
  {
    slug: "sailboat",
    rarity: "rare",
    prompt:
      "a wooden sailboat character, white billowing sails, on blue ocean waves, cute face on the hull, seagulls nearby, adventurous spirit",
  },
  {
    slug: "hot-air-balloon",
    rarity: "rare",
    prompt:
      "a colorful hot air balloon character, rainbow striped balloon, small wicker basket below, floating in blue sky, cute face on the balloon, clouds around",
  },
  {
    slug: "windmill",
    rarity: "rare",
    prompt:
      "a Dutch windmill character, white body with four spinning blades, tulips at the base, cute face on the body, pastoral setting",
  },
  {
    slug: "ferris-wheel",
    rarity: "rare",
    prompt:
      "a Ferris wheel character, colorful gondolas, large circular frame, carnival lights, cute face at the center hub, nighttime fairground",
  },
  {
    slug: "rocket",
    rarity: "rare",
    prompt:
      "a space rocket character, white body with red and blue stripes, flame exhaust at bottom, cute face on the nose cone, stars in background",
  },
  {
    slug: "apartment",
    rarity: "rare",
    prompt:
      "a multi-story apartment building character, 7 floors with lit windows, rooftop antenna, cute face on the facade, urban city vibes",
  },
  {
    slug: "palm-tree",
    rarity: "rare",
    prompt:
      "a tall palm tree character, coconuts hanging from top, large green fronds swaying, brown textured trunk, cute face, tropical beach setting",
  },
  {
    slug: "pirate-ship",
    rarity: "rare",
    prompt:
      "a pirate ship character, wooden hull, black sails with skull and crossbones, cannon ports, cute face on the bow, ocean waves, treasure vibes",
  },
  {
    slug: "castle",
    rarity: "rare",
    prompt:
      "a medieval castle character, stone walls, two towers with flags, drawbridge, cute face on the main gate, kingdom vibes, small sparkles",
  },
  {
    slug: "blue-whale",
    rarity: "rare",
    prompt:
      "a majestic blue whale character, enormous body, water spout from blowhole, gentle wise eyes, deep ocean blue, small fish swimming nearby",
  },
  {
    slug: "sphinx",
    rarity: "rare",
    prompt:
      "the Great Sphinx character, lion body with human head, ancient stone texture, desert sand, pyramids faintly in background, mysterious wise face",
  },
  {
    slug: "pagoda",
    rarity: "rare",
    prompt:
      "a five-story pagoda character, traditional East Asian architecture, curved roofs stacking upward, red and gold colors, cute face, cherry blossom petals",
  },
  {
    slug: "oil-platform",
    rarity: "rare",
    prompt:
      "an offshore oil platform character, metal structure on stilts in ocean, crane on top, industrial but cute face, waves below, seagulls",
  },
  {
    slug: "arc-de-triomphe",
    rarity: "rare",
    prompt:
      "the Arc de Triomphe character, grand stone arch, detailed relief carvings, French flag colors accent, cute face on the arch, Parisian atmosphere",
  },

  // ==========================================
  // EPIC (8 characters, 5000–9000cm)
  // ==========================================
  {
    slug: "leaning-tower",
    rarity: "epic",
    prompt:
      "the Leaning Tower of Pisa character, white marble cylindrical tower, tilting to one side, multiple colonnade levels, cute face, Italian flag, glowing aura",
  },
  {
    slug: "niagara-falls",
    rarity: "epic",
    prompt:
      "Niagara Falls character, massive waterfall cascading down, rainbow mist rising, blue-green water, cute face in the falling water, mystical glow, magical atmosphere",
  },
  {
    slug: "taj-mahal",
    rarity: "epic",
    prompt:
      "the Taj Mahal character, white marble domed palace, four minarets, reflecting pool, cute face on the main dome, ethereal moonlight glow, magical",
  },
  {
    slug: "big-ben",
    rarity: "epic",
    prompt:
      "Big Ben clock tower character, Gothic architecture, four clock faces showing different times, cute face on the main clock, golden glow, London fog, mystical",
  },
  {
    slug: "statue-of-liberty",
    rarity: "epic",
    prompt:
      "Statue of Liberty character, green copper patina, holding torch high, crown with rays, tablet in other hand, cute face, glowing torch flame, epic aura",
  },
  {
    slug: "pyramid",
    rarity: "epic",
    prompt:
      "the Great Pyramid of Giza character, massive triangular stone structure, desert sand, golden sunlight, cute face on the front, ancient glowing hieroglyphics, mystical eye",
  },
  {
    slug: "space-shuttle",
    rarity: "epic",
    prompt:
      "a space shuttle character, white orbiter with black heat tiles, in orbit above Earth, cute face on the nose, glowing engine trails, stars and nebula background",
  },
  {
    slug: "eiffel-tower",
    rarity: "epic",
    prompt:
      "the Eiffel Tower character, iconic iron lattice structure, tapering to top, sparkling lights, cute face on the middle level, Parisian night sky, glowing majestically",
  },

  // ==========================================
  // LEGENDARY (4 characters, 10000cm+)
  // ==========================================
  {
    slug: "tokyo-tower",
    rarity: "legendary",
    prompt:
      "Tokyo Tower character, red and white steel tower, glowing brilliantly against night sky, cute face, golden cosmic halo, city lights below, divine presence, star particles swirling",
  },
  {
    slug: "namsan-tower",
    rarity: "legendary",
    prompt:
      "N Seoul Tower (Namsan Tower) character, iconic observation tower on mountain, love locks at base, cute face, golden radiant glow, Seoul city panorama, divine starlight, cosmic aura",
  },
  {
    slug: "lotte-tower",
    rarity: "legendary",
    prompt:
      "Lotte World Tower character, sleek modern supertall skyscraper, glass facade reflecting sky, cute face, supreme golden glow, clouds parting around it, divine cosmic radiance, star dust",
  },
  {
    slug: "cloud-castle",
    rarity: "legendary",
    prompt:
      "a majestic castle floating above clouds, made of books and light, golden spires reaching into starry cosmos, cute face on the main tower, ultimate divine glow, galaxies swirling, rainbow bridge below",
  },
];

/**
 * Build the full DALL-E prompt for a character.
 */
export function buildPrompt({ rarity, prompt }) {
  return `${STYLE_PREFIX}, ${RARITY_MODIFIER[rarity]}, ${prompt}`;
}
