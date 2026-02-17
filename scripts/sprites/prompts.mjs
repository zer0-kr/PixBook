/**
 * DALL-E 3 prompts for 62 PickBook character sprites.
 *
 * Structure: STYLE_PREFIX + RARITY_MODIFIER[rarity] + character description
 */

const STYLE_PREFIX =
  "64x64 pixel art sprite, retro 8-bit game style, transparent background, " +
  "single character centered on canvas, warm cream and brown color palette, " +
  "1-2px dark brown (#3D2C2E) outline, cute expressive face, chibi proportions, " +
  "no text, no UI elements, clean pixel edges";

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
  // COMMON (30 characters)
  // ==========================================
  {
    slug: "baby-bookworm",
    rarity: "common",
    prompt:
      "a tiny baby bookworm character, small green caterpillar wearing round glasses, sitting on an open book, happy smile, rosy cheeks",
  },
  {
    slug: "curious-cat",
    rarity: "common",
    prompt:
      "a curious orange tabby cat, standing on hind legs, one paw reaching to open a book, big round eyes full of wonder, small whiskers",
  },
  {
    slug: "reading-rabbit",
    rarity: "common",
    prompt:
      "a cute white rabbit sitting and reading a small book, long floppy ears, holding the book with both paws, content expression",
  },
  {
    slug: "note-squirrel",
    rarity: "common",
    prompt:
      "a brown squirrel holding a tiny notepad and pencil, bushy tail curled up, studious look, small acorn-shaped eraser nearby",
  },
  {
    slug: "dreaming-cloud",
    rarity: "common",
    prompt:
      "a small fluffy cloud character with a sleepy happy face, pastel colored, tiny closed eyes, floating above an open storybook",
  },
  {
    slug: "bookmark-fairy",
    rarity: "common",
    prompt:
      "a tiny fairy with translucent wings shaped like bookmarks, wearing a brown dress, holding a ribbon bookmark, gentle smile",
  },
  {
    slug: "letter-firefly",
    rarity: "common",
    prompt:
      "a glowing firefly character with letters floating in its light, warm yellow glow, tiny wings, reading in the dark",
  },
  {
    slug: "story-snail",
    rarity: "common",
    prompt:
      "a determined snail with a shell decorated like a book spine, carrying a tiny book on its back, slow but steady expression",
  },
  {
    slug: "origami-crane",
    rarity: "common",
    prompt:
      "a small origami paper crane character, folded from book pages with visible text, delicate paper wings spread",
  },
  {
    slug: "ink-octopus",
    rarity: "common",
    prompt:
      "a small purple octopus holding multiple books with different tentacles, ink-stained, wearing tiny reading glasses, cheerful",
  },
  {
    slug: "sleepy-bear",
    rarity: "common",
    prompt:
      "a drowsy brown bear cub in pajamas, yawning while holding a bedtime storybook, small nightcap, cozy pose",
  },
  {
    slug: "adventure-turtle",
    rarity: "common",
    prompt:
      "a green turtle with a world map pattern on its shell, wearing a tiny explorer hat, holding a compass and adventure book",
  },
  {
    slug: "rainbow-parrot",
    rarity: "common",
    prompt:
      "a colorful parrot with rainbow feathers, perched on a book, beak open as if reading aloud, vibrant but warm tones",
  },
  {
    slug: "shooting-star-hamster",
    rarity: "common",
    prompt:
      "a chubby hamster holding a star-themed picture book, tiny star decorations around it, round cheeks, amazed expression",
  },
  {
    slug: "singing-cricket",
    rarity: "common",
    prompt:
      "a green cricket standing upright holding a poetry book, musical notes floating nearby, one leg tapping rhythm",
  },
  {
    slug: "collector-magpie",
    rarity: "common",
    prompt:
      "a black and white magpie bird collecting shiny bookmarks and quotes, holding a sparkling sentence in its beak",
  },
  {
    slug: "chef-raccoon",
    rarity: "common",
    prompt:
      "a raccoon wearing a chef hat and apron, holding a cookbook, small whisk in other paw, focused expression",
  },
  {
    slug: "detective-hedgehog",
    rarity: "common",
    prompt:
      "a hedgehog wearing a deerstalker detective hat, holding a magnifying glass over a mystery book, sharp attentive eyes",
  },
  {
    slug: "artist-chameleon",
    rarity: "common",
    prompt:
      "a chameleon changing colors to match an art book it is holding, paintbrush in tail, palette of warm colors",
  },
  {
    slug: "mailbird-pigeon",
    rarity: "common",
    prompt:
      "a carrier pigeon wearing a mailbag, delivering a book recommendation letter, small envelope in beak, friendly face",
  },
  {
    slug: "musician-frog",
    rarity: "common",
    prompt:
      "a green frog sitting on a lily pad reading a poetry book, tiny musical notes around, one foot tapping, cheerful",
  },
  {
    slug: "gardener-mole",
    rarity: "common",
    prompt:
      "a brown mole wearing a gardening hat, planting book-shaped seeds, small sprouts with page-shaped leaves",
  },
  {
    slug: "math-ant",
    rarity: "common",
    prompt:
      "a tiny red ant wearing miniature glasses, carrying a book much bigger than itself, numbers floating above its head",
  },
  {
    slug: "inventor-mouse",
    rarity: "common",
    prompt:
      "a grey mouse wearing goggles on its head, building a tiny contraption from book instructions, gears and tools nearby",
  },
  {
    slug: "surfing-otter",
    rarity: "common",
    prompt:
      "a brown otter floating on its back in water, holding a book above the surface, relaxed happy expression, small waves",
  },
  {
    slug: "photographer-meerkat",
    rarity: "common",
    prompt:
      "a meerkat standing tall holding a tiny camera, a photo album at its feet, alert and observant pose",
  },
  {
    slug: "philosopher-owl",
    rarity: "common",
    prompt:
      "a brown owl with deep thoughtful eyes, perched on a stack of philosophy books, one wing on chin in thinking pose",
  },
  {
    slug: "sculptor-beaver",
    rarity: "common",
    prompt:
      "a beaver carving a tiny wooden book sculpture with its teeth, wood chips around, proud artistic expression",
  },
  {
    slug: "astronomer-owl",
    rarity: "common",
    prompt:
      "a grey owl wearing a small telescope around its neck, holding a star chart book, night sky theme, wise expression",
  },
  {
    slug: "marathon-cheetah",
    rarity: "common",
    prompt:
      "a cheetah in a running pose holding a book, speed lines behind it, wearing a headband, determined fast expression",
  },

  // ==========================================
  // RARE (20 characters)
  // ==========================================
  {
    slug: "wise-owl",
    rarity: "rare",
    prompt:
      "an ancient wise owl scholar with small round spectacles, long white eyebrow feathers, surrounded by floating ancient scrolls, holding a golden quill",
  },
  {
    slug: "magic-fox",
    rarity: "rare",
    prompt:
      "a mystical nine-tailed fox with soft orange fur, each tail tip glowing faintly, casting a spell from a magic book, arcane symbols floating",
  },
  {
    slug: "explorer-penguin",
    rarity: "rare",
    prompt:
      "an adventurous penguin wearing a tiny parka and backpack, holding a travel journal, snowflakes around, determined explorer pose",
  },
  {
    slug: "sea-seahorse",
    rarity: "rare",
    prompt:
      "an elegant seahorse librarian with small reading glasses, surrounded by floating underwater books, coral bookshelf nearby, gentle blue glow",
  },
  {
    slug: "lightning-rabbit",
    rarity: "rare",
    prompt:
      "a fast white rabbit crackling with small lightning bolts, speed-reading a book, pages flipping rapidly, electric blue accents",
  },
  {
    slug: "wind-hawk",
    rarity: "rare",
    prompt:
      "a majestic hawk soaring with a book in its talons, wind currents visible, looking down at the world, feathers ruffling",
  },
  {
    slug: "dragon-librarian",
    rarity: "rare",
    prompt:
      "a small friendly dragon wearing librarian glasses, sitting in a cave full of book piles, tiny flame for reading light, green scales",
  },
  {
    slug: "moonlight-wolf",
    rarity: "rare",
    prompt:
      "a silver wolf howling at the moon with a poetry book at its feet, moonbeams illuminating the scene, romantic atmosphere",
  },
  {
    slug: "crystal-deer",
    rarity: "rare",
    prompt:
      "a noble deer with crystalline antlers that have tiny books growing from them, glowing crystal formations, serene woodland pose",
  },
  {
    slug: "rainbow-snake",
    rarity: "rare",
    prompt:
      "a coiled serpent with iridescent rainbow scales, wrapped around an ancient tome, seven colors shimmering along its body",
  },
  {
    slug: "time-crane",
    rarity: "rare",
    prompt:
      "a tall elegant crane with clock patterns on its wings, holding an hourglass and an ancient scroll, timeless wise expression",
  },
  {
    slug: "petal-butterfly",
    rarity: "rare",
    prompt:
      "a delicate butterfly with wings made of flower petals and book pages, sitting on a poetry book, new petal patterns forming",
  },
  {
    slug: "constellation-whale",
    rarity: "rare",
    prompt:
      "a small whale breaching with star constellations on its body, spouting stardust instead of water, cosmic ocean setting",
  },
  {
    slug: "mist-giraffe",
    rarity: "rare",
    prompt:
      "a tall giraffe with its head reaching into clouds, neck spotted with book patterns, reaching a floating cloud library above",
  },
  {
    slug: "volcano-salamander",
    rarity: "rare",
    prompt:
      "a fiery salamander with small flames on its back, reading passionately, ember particles floating upward, warm red-orange tones",
  },
  {
    slug: "snowflake-polarbear",
    rarity: "rare",
    prompt:
      "a white polar bear cub creating snowflakes while reading a winter story, each snowflake unique, ice crystal patterns, cozy scarf",
  },
  {
    slug: "golden-eagle",
    rarity: "rare",
    prompt:
      "a proud golden eagle perched on a mountain peak of books, golden feathers gleaming, surveying knowledge below, majestic pose",
  },
  {
    slug: "aurora-reindeer",
    rarity: "rare",
    prompt:
      "a reindeer with aurora borealis flowing from its antlers, reading a fairy tale book under northern lights, green and purple glow",
  },
  {
    slug: "coral-turtle",
    rarity: "rare",
    prompt:
      "an ancient sea turtle with coral and anemones growing on its shell, holding a weathered book, deep ocean sage, barnacle details",
  },
  {
    slug: "galaxy-dolphin",
    rarity: "rare",
    prompt:
      "a dolphin leaping through a milky way of stars, cosmic dust trail, carrying a book of universe stories, galactic blue and purple",
  },

  // ==========================================
  // EPIC (8 characters)
  // ==========================================
  {
    slug: "phoenix-reader",
    rarity: "epic",
    prompt:
      "a majestic phoenix rising from ashes made of book pages, fiery wings spread wide, holding an immortal tome, flames of knowledge, rebirth symbolism",
  },
  {
    slug: "unicorn-poet",
    rarity: "epic",
    prompt:
      "a noble unicorn with a horn radiating beams of inspiration light, mane flowing with poetry verses, quill pen floating, rainbow prismatic accents",
  },
  {
    slug: "lightning-griffin",
    rarity: "epic",
    prompt:
      "a fierce griffin (half eagle half lion) guardian of a sky library, lightning crackling around it, powerful wings, book clutched in talons",
  },
  {
    slug: "crystal-dragon",
    rarity: "epic",
    prompt:
      "a dragon made of crystal and gems, each scale storing a book, prismatic light refracting through its body, ancient library guardian",
  },
  {
    slug: "odin-raven",
    rarity: "epic",
    prompt:
      "a mythical raven with one glowing eye of knowledge, Norse rune patterns on feathers, perched on an ancient runic book, dark and mystical",
  },
  {
    slug: "deep-kraken",
    rarity: "epic",
    prompt:
      "a kraken from the deepest ocean depths, tentacles wrapped around forbidden books, bioluminescent glow, mysterious deep sea ambiance",
  },
  {
    slug: "world-tree-spirit",
    rarity: "epic",
    prompt:
      "a spirit of the world tree (Yggdrasil), made of leaves and bark, books growing like fruit from branches, nature and magic intertwined",
  },
  {
    slug: "spacetime-sphinx",
    rarity: "epic",
    prompt:
      "an ancient sphinx with hieroglyphic patterns, riddle symbols floating around it, hourglass embedded in chest, guardian of time and knowledge",
  },

  // ==========================================
  // LEGENDARY (4 characters)
  // ==========================================
  {
    slug: "sky-whale",
    rarity: "legendary",
    prompt:
      "a colossal sky whale swimming through clouds, a tiny library built on its back, bookshelves visible, golden light streaming through clouds, majestic and serene, cosmic scale",
  },
  {
    slug: "starlight-reader",
    rarity: "legendary",
    prompt:
      "a legendary reader sitting atop an impossibly tall tower of books reaching the stars, reading by starlight, cosmic backdrop, golden halo of knowledge, ultimate scholar figure",
  },
  {
    slug: "sage-of-time",
    rarity: "legendary",
    prompt:
      "an immortal sage transcending time, cloaked in flowing robes made of book pages from every era, hourglasses orbiting, past present future merging, divine wisdom aura",
  },
  {
    slug: "cosmic-reader",
    rarity: "legendary",
    prompt:
      "the ultimate cosmic reader floating in deep space, surrounded by orbiting books forming a solar system, galaxies in the background, reading the book of the universe, supreme golden glow",
  },
];

/**
 * Build the full DALL-E prompt for a character.
 */
export function buildPrompt({ rarity, prompt }) {
  return `${STYLE_PREFIX}, ${RARITY_MODIFIER[rarity]}, ${prompt}`;
}
