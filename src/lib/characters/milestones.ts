import type { CharacterRarity } from "@/types";

export interface CharacterDefinition {
  name: string;
  description: string;
  sprite_url: string;
  unlock_height_cm: number;
  rarity: CharacterRarity;
}

/**
 * Helper to generate a sprite URL slug from a Korean character name.
 * The slug is a romanized/simplified version for the file path.
 */
function spriteUrl(slug: string): string {
  return `/sprites/characters/${slug}.png`;
}

/**
 * All character definitions for the reading log app.
 * Theme: Height-based everyday objects & landmarks.
 * 62 characters across 4 rarity tiers, sorted by unlock_height_cm ASC.
 * Heights based on realistic book thickness (~0.006 cm/page).
 */
export const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  // ==========================================
  // COMMON (30 characters): 0cm to 85cm
  // ==========================================
  {
    name: "쌀알",
    description: "모든 여정은 한 알의 쌀에서 시작돼요.",
    sprite_url: spriteUrl("rice-grain"),
    unlock_height_cm: 0,
    rarity: "common",
  },
  {
    name: "도토리",
    description: "작지만 커다란 나무가 될 씨앗.",
    sprite_url: spriteUrl("acorn"),
    unlock_height_cm: 1,
    rarity: "common",
  },
  {
    name: "병뚜껑",
    description: "반짝이는 작은 왕관.",
    sprite_url: spriteUrl("bottle-cap"),
    unlock_height_cm: 3,
    rarity: "common",
  },
  {
    name: "마카롱",
    description: "달콤한 독서의 보상.",
    sprite_url: spriteUrl("macaron"),
    unlock_height_cm: 5,
    rarity: "common",
  },
  {
    name: "귤",
    description: "겨울 독서의 단짝 친구.",
    sprite_url: spriteUrl("tangerine"),
    unlock_height_cm: 7,
    rarity: "common",
  },
  {
    name: "머그컵",
    description: "따뜻한 한 잔과 함께하는 독서.",
    sprite_url: spriteUrl("coffee-mug"),
    unlock_height_cm: 10,
    rarity: "common",
  },
  {
    name: "양초",
    description: "은은한 불빛 아래 책 읽기.",
    sprite_url: spriteUrl("candle"),
    unlock_height_cm: 12,
    rarity: "common",
  },
  {
    name: "바나나",
    description: "에너지 충전! 한 권 더.",
    sprite_url: spriteUrl("banana"),
    unlock_height_cm: 15,
    rarity: "common",
  },
  {
    name: "우유팩",
    description: "지식을 쑥쑥 키우는 우유.",
    sprite_url: spriteUrl("milk-carton"),
    unlock_height_cm: 17,
    rarity: "common",
  },
  {
    name: "운동화",
    description: "다음 책을 향해 달려가는 발걸음.",
    sprite_url: spriteUrl("sneaker"),
    unlock_height_cm: 20,
    rarity: "common",
  },
  {
    name: "고양이",
    description: "무릎 위에서 함께 읽는 친구.",
    sprite_url: spriteUrl("sitting-cat"),
    unlock_height_cm: 22,
    rarity: "common",
  },
  {
    name: "꽃다발",
    description: "독서 25cm 달성 축하!",
    sprite_url: spriteUrl("bouquet"),
    unlock_height_cm: 25,
    rarity: "common",
  },
  {
    name: "곰인형",
    description: "포근한 독서 메이트.",
    sprite_url: spriteUrl("teddy-bear"),
    unlock_height_cm: 28,
    rarity: "common",
  },
  {
    name: "선인장",
    description: "꾸준히 자라는 독서 습관.",
    sprite_url: spriteUrl("cactus"),
    unlock_height_cm: 30,
    rarity: "common",
  },
  {
    name: "소화기",
    description: "불타는 독서 열정을 진화하지 마세요!",
    sprite_url: spriteUrl("fire-extinguisher"),
    unlock_height_cm: 33,
    rarity: "common",
  },
  {
    name: "우쿨렐레",
    description: "책 속의 작은 세레나데.",
    sprite_url: spriteUrl("ukulele"),
    unlock_height_cm: 36,
    rarity: "common",
  },
  {
    name: "강아지",
    description: "충실한 독서견이 응원해요.",
    sprite_url: spriteUrl("puppy"),
    unlock_height_cm: 39,
    rarity: "common",
  },
  {
    name: "지구본",
    description: "책으로 세계를 탐험.",
    sprite_url: spriteUrl("globe"),
    unlock_height_cm: 42,
    rarity: "common",
  },
  {
    name: "기타",
    description: "이야기가 만드는 멜로디.",
    sprite_url: spriteUrl("guitar"),
    unlock_height_cm: 45,
    rarity: "common",
  },
  {
    name: "우산",
    description: "비 오는 날 최고의 독서.",
    sprite_url: spriteUrl("umbrella"),
    unlock_height_cm: 48,
    rarity: "common",
  },
  {
    name: "망원경",
    description: "더 넓은 세계를 바라보는 눈.",
    sprite_url: spriteUrl("telescope"),
    unlock_height_cm: 51,
    rarity: "common",
  },
  {
    name: "자전거",
    description: "다음 이야기로 페달을 밟아요.",
    sprite_url: spriteUrl("bicycle"),
    unlock_height_cm: 54,
    rarity: "common",
  },
  {
    name: "황제펭귄",
    description: "남극에서 온 독서 친구.",
    sprite_url: spriteUrl("emperor-penguin"),
    unlock_height_cm: 57,
    rarity: "common",
  },
  {
    name: "스노보드",
    description: "이야기의 슬로프를 질주!",
    sprite_url: spriteUrl("snowboard"),
    unlock_height_cm: 60,
    rarity: "common",
  },
  {
    name: "사람",
    description: "드디어 나만큼 자란 탑!",
    sprite_url: spriteUrl("person"),
    unlock_height_cm: 64,
    rarity: "common",
  },
  {
    name: "냉장고",
    description: "지식으로 꽉 찬 냉장고.",
    sprite_url: spriteUrl("refrigerator"),
    unlock_height_cm: 68,
    rarity: "common",
  },
  {
    name: "문",
    description: "새로운 세계로 열리는 문.",
    sprite_url: spriteUrl("door"),
    unlock_height_cm: 72,
    rarity: "common",
  },
  {
    name: "피아노",
    description: "독서의 하모니가 울려 퍼져요.",
    sprite_url: spriteUrl("piano"),
    unlock_height_cm: 76,
    rarity: "common",
  },
  {
    name: "크리스마스트리",
    description: "반짝이는 성과로 장식된 나무.",
    sprite_url: spriteUrl("christmas-tree"),
    unlock_height_cm: 80,
    rarity: "common",
  },
  {
    name: "농구골대",
    description: "슛! 목표를 향해 점프!",
    sprite_url: spriteUrl("basketball-hoop"),
    unlock_height_cm: 85,
    rarity: "common",
  },

  // ==========================================
  // RARE (20 characters): 90cm to 450cm
  // ==========================================
  {
    name: "기린",
    description: "높이높이 자라는 독서 타워.",
    sprite_url: spriteUrl("giraffe"),
    unlock_height_cm: 90,
    rarity: "rare",
  },
  {
    name: "가로등",
    description: "밤길을 밝히는 지식의 빛.",
    sprite_url: spriteUrl("street-lamp"),
    unlock_height_cm: 100,
    rarity: "rare",
  },
  {
    name: "코끼리",
    description: "코끼리만큼 무거운 지식.",
    sprite_url: spriteUrl("elephant"),
    unlock_height_cm: 110,
    rarity: "rare",
  },
  {
    name: "공룡",
    description: "시간을 초월하는 독서.",
    sprite_url: spriteUrl("t-rex"),
    unlock_height_cm: 120,
    rarity: "rare",
  },
  {
    name: "스쿨버스",
    description: "지식으로 가는 통학 버스.",
    sprite_url: spriteUrl("school-bus"),
    unlock_height_cm: 130,
    rarity: "rare",
  },
  {
    name: "등대",
    description: "바다 위 지식의 길잡이.",
    sprite_url: spriteUrl("lighthouse"),
    unlock_height_cm: 140,
    rarity: "rare",
  },
  {
    name: "범선",
    description: "이야기의 바다를 항해.",
    sprite_url: spriteUrl("sailboat"),
    unlock_height_cm: 150,
    rarity: "rare",
  },
  {
    name: "열기구",
    description: "하늘 높이 떠오르는 상상력.",
    sprite_url: spriteUrl("hot-air-balloon"),
    unlock_height_cm: 160,
    rarity: "rare",
  },
  {
    name: "풍차",
    description: "바람과 함께 도는 이야기.",
    sprite_url: spriteUrl("windmill"),
    unlock_height_cm: 170,
    rarity: "rare",
  },
  {
    name: "대관람차",
    description: "높이 올라 세상을 내려다봐요.",
    sprite_url: spriteUrl("ferris-wheel"),
    unlock_height_cm: 180,
    rarity: "rare",
  },
  {
    name: "로켓",
    description: "지식의 우주로 발사!",
    sprite_url: spriteUrl("rocket"),
    unlock_height_cm: 190,
    rarity: "rare",
  },
  {
    name: "아파트",
    description: "아파트 높이 돌파!",
    sprite_url: spriteUrl("apartment"),
    unlock_height_cm: 200,
    rarity: "rare",
  },
  {
    name: "야자수",
    description: "열대의 높이에 도달.",
    sprite_url: spriteUrl("palm-tree"),
    unlock_height_cm: 220,
    rarity: "rare",
  },
  {
    name: "해적선",
    description: "보물을 찾아 모험의 바다로.",
    sprite_url: spriteUrl("pirate-ship"),
    unlock_height_cm: 240,
    rarity: "rare",
  },
  {
    name: "성",
    description: "지식의 왕국을 세웠어요.",
    sprite_url: spriteUrl("castle"),
    unlock_height_cm: 260,
    rarity: "rare",
  },
  {
    name: "대왕고래",
    description: "바다에서 가장 큰 친구.",
    sprite_url: spriteUrl("blue-whale"),
    unlock_height_cm: 280,
    rarity: "rare",
  },
  {
    name: "스핑크스",
    description: "고대 지혜의 수호자.",
    sprite_url: spriteUrl("sphinx"),
    unlock_height_cm: 300,
    rarity: "rare",
  },
  {
    name: "탑",
    description: "지식이 겹겹이 쌓인 탑.",
    sprite_url: spriteUrl("pagoda"),
    unlock_height_cm: 350,
    rarity: "rare",
  },
  {
    name: "석유시추선",
    description: "깊은 지식을 시추 중.",
    sprite_url: spriteUrl("oil-platform"),
    unlock_height_cm: 400,
    rarity: "rare",
  },
  {
    name: "개선문",
    description: "독서의 승리를 기념하며.",
    sprite_url: spriteUrl("arc-de-triomphe"),
    unlock_height_cm: 450,
    rarity: "rare",
  },

  // ==========================================
  // EPIC (8 characters): 500cm to 900cm
  // ==========================================
  {
    name: "피사의 사탑",
    description: "기울어도 무너지지 않는 독서탑.",
    sprite_url: spriteUrl("leaning-tower"),
    unlock_height_cm: 500,
    rarity: "epic",
  },
  {
    name: "나이아가라 폭포",
    description: "쏟아지는 지식의 폭포.",
    sprite_url: spriteUrl("niagara-falls"),
    unlock_height_cm: 550,
    rarity: "epic",
  },
  {
    name: "타지마할",
    description: "아름다운 지식의 궁전.",
    sprite_url: spriteUrl("taj-mahal"),
    unlock_height_cm: 600,
    rarity: "epic",
  },
  {
    name: "빅벤",
    description: "시간이 말해주는 이야기.",
    sprite_url: spriteUrl("big-ben"),
    unlock_height_cm: 650,
    rarity: "epic",
  },
  {
    name: "자유의 여신상",
    description: "지식의 횃불을 높이 들고.",
    sprite_url: spriteUrl("statue-of-liberty"),
    unlock_height_cm: 700,
    rarity: "epic",
  },
  {
    name: "피라미드",
    description: "수천 년의 지식이 쌓인 곳.",
    sprite_url: spriteUrl("pyramid"),
    unlock_height_cm: 750,
    rarity: "epic",
  },
  {
    name: "우주왕복선",
    description: "대기권 밖으로 날아올라.",
    sprite_url: spriteUrl("space-shuttle"),
    unlock_height_cm: 800,
    rarity: "epic",
  },
  {
    name: "에펠탑",
    description: "파리의 별을 향해!",
    sprite_url: spriteUrl("eiffel-tower"),
    unlock_height_cm: 900,
    rarity: "epic",
  },

  // ==========================================
  // LEGENDARY (4 characters): 1000cm+
  // ==========================================
  {
    name: "도쿄타워",
    description: "10미터, 도시를 내려다보며.",
    sprite_url: spriteUrl("tokyo-tower"),
    unlock_height_cm: 1000,
    rarity: "legendary",
  },
  {
    name: "N서울타워",
    description: "남산타워만큼 쌓은 책의 탑!",
    sprite_url: spriteUrl("namsan-tower"),
    unlock_height_cm: 3330,
    rarity: "legendary",
  },
  {
    name: "롯데월드타워",
    description: "대한민국 최고봉의 독서가.",
    sprite_url: spriteUrl("lotte-tower"),
    unlock_height_cm: 5550,
    rarity: "legendary",
  },
  {
    name: "구름 위 성",
    description: "100m — 구름 위의 독서 왕국.",
    sprite_url: spriteUrl("cloud-castle"),
    unlock_height_cm: 10000,
    rarity: "legendary",
  },
];

/**
 * Get characters filtered by rarity.
 */
export function getCharactersByRarity(rarity: CharacterRarity): CharacterDefinition[] {
  return CHARACTER_DEFINITIONS.filter((c) => c.rarity === rarity);
}

/**
 * Get characters that would be unlocked at a given height.
 */
export function getUnlockableCharacters(heightCm: number): CharacterDefinition[] {
  return CHARACTER_DEFINITIONS.filter((c) => c.unlock_height_cm <= heightCm);
}
