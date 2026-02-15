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
 * 60+ characters across 4 rarity tiers, sorted by unlock_height_cm ASC.
 */
export const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  // ==========================================
  // COMMON (~30 characters): 0cm to 300cm
  // ==========================================
  {
    name: "아기 책벌레",
    description: "막 태어난 꼬마 책벌레. 책 냄새를 맡으면 행복해해요.",
    sprite_url: spriteUrl("baby-bookworm"),
    unlock_height_cm: 0,
    rarity: "common",
  },
  {
    name: "호기심 고양이",
    description: "모든 책의 첫 페이지를 열어보는 호기심 많은 고양이.",
    sprite_url: spriteUrl("curious-cat"),
    unlock_height_cm: 10,
    rarity: "common",
  },
  {
    name: "독서 토끼",
    description: "당근 대신 책을 좋아하는 귀여운 토끼.",
    sprite_url: spriteUrl("reading-rabbit"),
    unlock_height_cm: 30,
    rarity: "common",
  },
  {
    name: "필기 다람쥐",
    description: "도토리 대신 메모를 모으는 부지런한 다람쥐.",
    sprite_url: spriteUrl("note-squirrel"),
    unlock_height_cm: 50,
    rarity: "common",
  },
  {
    name: "꿈꾸는 구름",
    description: "이야기를 들으면 색깔이 변하는 작은 구름.",
    sprite_url: spriteUrl("dreaming-cloud"),
    unlock_height_cm: 70,
    rarity: "common",
  },
  {
    name: "책갈피 요정",
    description: "항상 읽던 페이지를 기억해주는 요정.",
    sprite_url: spriteUrl("bookmark-fairy"),
    unlock_height_cm: 100,
    rarity: "common",
  },
  {
    name: "글자 반딧불",
    description: "어두운 밤에도 책을 읽을 수 있게 빛을 내는 반딧불.",
    sprite_url: spriteUrl("letter-firefly"),
    unlock_height_cm: 120,
    rarity: "common",
  },
  {
    name: "이야기 달팽이",
    description: "느리지만 끝까지 읽는 끈기의 달팽이.",
    sprite_url: spriteUrl("story-snail"),
    unlock_height_cm: 150,
    rarity: "common",
  },
  {
    name: "종이접기 학",
    description: "다 읽은 책으로 종이학을 접는 작은 새.",
    sprite_url: spriteUrl("origami-crane"),
    unlock_height_cm: 170,
    rarity: "common",
  },
  {
    name: "잉크 문어",
    description: "여덟 개 다리로 동시에 여러 책을 넘기는 문어.",
    sprite_url: spriteUrl("ink-octopus"),
    unlock_height_cm: 200,
    rarity: "common",
  },
  {
    name: "졸린 곰돌이",
    description: "자장가 책만 읽으면 스르르 잠이 드는 곰.",
    sprite_url: spriteUrl("sleepy-bear"),
    unlock_height_cm: 220,
    rarity: "common",
  },
  {
    name: "모험 거북이",
    description: "등껍질에 세계 지도가 그려진 탐험가 거북이.",
    sprite_url: spriteUrl("adventure-turtle"),
    unlock_height_cm: 250,
    rarity: "common",
  },
  {
    name: "무지개 앵무새",
    description: "책을 소리 내어 읽어주는 다정한 앵무새.",
    sprite_url: spriteUrl("rainbow-parrot"),
    unlock_height_cm: 280,
    rarity: "common",
  },
  {
    name: "별똥별 햄스터",
    description: "밤하늘 그림책을 좋아하는 작은 햄스터.",
    sprite_url: spriteUrl("shooting-star-hamster"),
    unlock_height_cm: 300,
    rarity: "common",
  },
  {
    name: "노래하는 귀뚜라미",
    description: "시를 읽으면 아름다운 노래를 부르는 귀뚜라미.",
    sprite_url: spriteUrl("singing-cricket"),
    unlock_height_cm: 330,
    rarity: "common",
  },
  {
    name: "수집가 까치",
    description: "반짝이는 문장을 모으는 까치.",
    sprite_url: spriteUrl("collector-magpie"),
    unlock_height_cm: 360,
    rarity: "common",
  },
  {
    name: "요리사 너구리",
    description: "요리책 레시피를 완벽히 외우는 너구리 셰프.",
    sprite_url: spriteUrl("chef-raccoon"),
    unlock_height_cm: 390,
    rarity: "common",
  },
  {
    name: "탐정 고슴도치",
    description: "추리소설의 범인을 항상 맞추는 꼼꼼한 고슴도치.",
    sprite_url: spriteUrl("detective-hedgehog"),
    unlock_height_cm: 420,
    rarity: "common",
  },
  {
    name: "화가 카멜레온",
    description: "그림책을 보면 같은 색으로 변하는 카멜레온.",
    sprite_url: spriteUrl("artist-chameleon"),
    unlock_height_cm: 450,
    rarity: "common",
  },
  {
    name: "우편배달 비둘기",
    description: "좋아하는 책을 친구들에게 추천해주는 비둘기.",
    sprite_url: spriteUrl("mailbird-pigeon"),
    unlock_height_cm: 480,
    rarity: "common",
  },
  {
    name: "음악가 개구리",
    description: "동시를 읽으며 리듬을 만드는 개구리.",
    sprite_url: spriteUrl("musician-frog"),
    unlock_height_cm: 510,
    rarity: "common",
  },
  {
    name: "정원사 두더지",
    description: "이야기의 씨앗을 심어 꽃을 피우는 두더지.",
    sprite_url: spriteUrl("gardener-mole"),
    unlock_height_cm: 540,
    rarity: "common",
  },
  {
    name: "수학자 개미",
    description: "책의 페이지 수를 정확히 세는 똑똑한 개미.",
    sprite_url: spriteUrl("math-ant"),
    unlock_height_cm: 570,
    rarity: "common",
  },
  {
    name: "발명가 쥐",
    description: "책에서 읽은 아이디어로 발명품을 만드는 쥐.",
    sprite_url: spriteUrl("inventor-mouse"),
    unlock_height_cm: 600,
    rarity: "common",
  },
  {
    name: "서핑 수달",
    description: "파도 위에서도 책을 놓지 않는 수달.",
    sprite_url: spriteUrl("surfing-otter"),
    unlock_height_cm: 640,
    rarity: "common",
  },
  {
    name: "사진사 미어캣",
    description: "인상 깊은 장면을 마음 카메라로 찍는 미어캣.",
    sprite_url: spriteUrl("photographer-meerkat"),
    unlock_height_cm: 680,
    rarity: "common",
  },
  {
    name: "철학자 올빼미",
    description: "밤새 생각에 잠기는 사색하는 올빼미.",
    sprite_url: spriteUrl("philosopher-owl"),
    unlock_height_cm: 720,
    rarity: "common",
  },
  {
    name: "조각가 비버",
    description: "나무로 책 속 장면을 조각하는 예술가 비버.",
    sprite_url: spriteUrl("sculptor-beaver"),
    unlock_height_cm: 760,
    rarity: "common",
  },
  {
    name: "천문학자 부엉이",
    description: "별자리 도감을 외우고 있는 지식인 부엉이.",
    sprite_url: spriteUrl("astronomer-owl"),
    unlock_height_cm: 800,
    rarity: "common",
  },
  {
    name: "마라톤 치타",
    description: "속독의 달인! 빠르게 읽고 정확히 이해하는 치타.",
    sprite_url: spriteUrl("marathon-cheetah"),
    unlock_height_cm: 850,
    rarity: "common",
  },

  // ==========================================
  // RARE (~20 characters): 500cm to 2000cm
  // ==========================================
  {
    name: "지혜 부엉이",
    description: "천 년의 지혜를 품은 현명한 부엉이 학자.",
    sprite_url: spriteUrl("wise-owl"),
    unlock_height_cm: 900,
    rarity: "rare",
  },
  {
    name: "마법 여우",
    description: "책에서 읽은 주문을 실제로 쓸 수 있는 신비한 여우.",
    sprite_url: spriteUrl("magic-fox"),
    unlock_height_cm: 1000,
    rarity: "rare",
  },
  {
    name: "탐험 펭귄",
    description: "남극에서 온 여행기 전문가 펭귄.",
    sprite_url: spriteUrl("explorer-penguin"),
    unlock_height_cm: 1100,
    rarity: "rare",
  },
  {
    name: "바다 해마",
    description: "심해 도서관을 지키는 수중 사서 해마.",
    sprite_url: spriteUrl("sea-seahorse"),
    unlock_height_cm: 1200,
    rarity: "rare",
  },
  {
    name: "번개 토끼",
    description: "한 시간에 책 한 권을 읽는 초고속 토끼.",
    sprite_url: spriteUrl("lightning-rabbit"),
    unlock_height_cm: 1300,
    rarity: "rare",
  },
  {
    name: "바람 매",
    description: "높은 하늘에서 세상의 이야기를 내려다보는 매.",
    sprite_url: spriteUrl("wind-hawk"),
    unlock_height_cm: 1400,
    rarity: "rare",
  },
  {
    name: "용 사서",
    description: "거대한 동굴 도서관을 지키는 용의 사서.",
    sprite_url: spriteUrl("dragon-librarian"),
    unlock_height_cm: 1500,
    rarity: "rare",
  },
  {
    name: "달빛 늑대",
    description: "보름달 밤에 시를 읊는 낭만적인 늑대.",
    sprite_url: spriteUrl("moonlight-wolf"),
    unlock_height_cm: 1600,
    rarity: "rare",
  },
  {
    name: "수정 사슴",
    description: "뿔에 지식의 결정이 자라는 신성한 사슴.",
    sprite_url: spriteUrl("crystal-deer"),
    unlock_height_cm: 1700,
    rarity: "rare",
  },
  {
    name: "무지개 뱀",
    description: "비가 온 뒤 나타나는 일곱 빛깔 지식의 뱀.",
    sprite_url: spriteUrl("rainbow-snake"),
    unlock_height_cm: 1800,
    rarity: "rare",
  },
  {
    name: "시간 두루미",
    description: "옛이야기와 전설을 기억하는 장수 두루미.",
    sprite_url: spriteUrl("time-crane"),
    unlock_height_cm: 1900,
    rarity: "rare",
  },
  {
    name: "꽃잎 나비",
    description: "시집을 읽으면 날개에 새로운 무늬가 피어나는 나비.",
    sprite_url: spriteUrl("petal-butterfly"),
    unlock_height_cm: 2000,
    rarity: "rare",
  },
  {
    name: "별자리 고래",
    description: "바다 위로 별의 이야기를 뿜어내는 신비한 고래.",
    sprite_url: spriteUrl("constellation-whale"),
    unlock_height_cm: 2200,
    rarity: "rare",
  },
  {
    name: "안개 기린",
    description: "구름 위 도서관에 닿을 수 있는 긴 목의 기린.",
    sprite_url: spriteUrl("mist-giraffe"),
    unlock_height_cm: 2400,
    rarity: "rare",
  },
  {
    name: "화산 도롱뇽",
    description: "열정이 넘쳐 몸에서 불꽃이 튀는 독서가.",
    sprite_url: spriteUrl("volcano-salamander"),
    unlock_height_cm: 2600,
    rarity: "rare",
  },
  {
    name: "눈꽃 북극곰",
    description: "겨울 이야기를 읽으면 눈을 내리게 하는 곰.",
    sprite_url: spriteUrl("snowflake-polarbear"),
    unlock_height_cm: 2800,
    rarity: "rare",
  },
  {
    name: "황금 독수리",
    description: "지식의 봉우리에서 세상을 바라보는 독수리.",
    sprite_url: spriteUrl("golden-eagle"),
    unlock_height_cm: 3000,
    rarity: "rare",
  },
  {
    name: "오로라 순록",
    description: "북극의 오로라 아래에서 동화를 읽는 순록.",
    sprite_url: spriteUrl("aurora-reindeer"),
    unlock_height_cm: 3500,
    rarity: "rare",
  },
  {
    name: "산호 거북",
    description: "바다 밑 도서관의 수천 년 된 현자 거북.",
    sprite_url: spriteUrl("coral-turtle"),
    unlock_height_cm: 4000,
    rarity: "rare",
  },
  {
    name: "은하 돌고래",
    description: "은하수를 헤엄치며 우주의 이야기를 전하는 돌고래.",
    sprite_url: spriteUrl("galaxy-dolphin"),
    unlock_height_cm: 4500,
    rarity: "rare",
  },

  // ==========================================
  // EPIC (~8 characters): 3000cm to 8000cm
  // ==========================================
  {
    name: "불사조 독서가",
    description: "재에서 되살아나 영원히 읽는 불사조. 지식은 불멸이다.",
    sprite_url: spriteUrl("phoenix-reader"),
    unlock_height_cm: 5000,
    rarity: "epic",
  },
  {
    name: "유니콘 시인",
    description: "뿔에서 영감의 빛이 나오는 전설의 시인 유니콘.",
    sprite_url: spriteUrl("unicorn-poet"),
    unlock_height_cm: 5500,
    rarity: "epic",
  },
  {
    name: "번개 그리핀",
    description: "하늘의 도서관을 지키는 반사자반독수리 수호자.",
    sprite_url: spriteUrl("lightning-griffin"),
    unlock_height_cm: 6000,
    rarity: "epic",
  },
  {
    name: "크리스탈 드래곤",
    description: "수정 비늘에 읽은 모든 책의 내용을 저장하는 드래곤.",
    sprite_url: spriteUrl("crystal-dragon"),
    unlock_height_cm: 6500,
    rarity: "epic",
  },
  {
    name: "오딘의 까마귀",
    description: "세상의 모든 지식을 모아 전하는 신화 속 까마귀.",
    sprite_url: spriteUrl("odin-raven"),
    unlock_height_cm: 7000,
    rarity: "epic",
  },
  {
    name: "심해 크라켄",
    description: "바다 가장 깊은 곳에서 금서를 지키는 전설의 크라켄.",
    sprite_url: spriteUrl("deep-kraken"),
    unlock_height_cm: 7500,
    rarity: "epic",
  },
  {
    name: "세계수 정령",
    description: "세계수에 깃든 모든 이야기의 수호 정령.",
    sprite_url: spriteUrl("world-tree-spirit"),
    unlock_height_cm: 8000,
    rarity: "epic",
  },
  {
    name: "시공간 스핑크스",
    description: "수수께끼로 시간을 다스리는 고대의 스핑크스.",
    sprite_url: spriteUrl("spacetime-sphinx"),
    unlock_height_cm: 9000,
    rarity: "epic",
  },

  // ==========================================
  // LEGENDARY (~4 characters): 10000cm+
  // ==========================================
  {
    name: "하늘 고래",
    description: "구름 바다를 헤엄치는 거대한 하늘 고래. 등 위에 도서관이 있다.",
    sprite_url: spriteUrl("sky-whale"),
    unlock_height_cm: 10000,
    rarity: "legendary",
  },
  {
    name: "별빛 독서가",
    description: "남산타워만큼 쌓은 책의 탑 위에서 별을 읽는 전설의 독서가.",
    sprite_url: spriteUrl("starlight-reader"),
    unlock_height_cm: 33300,
    rarity: "legendary",
  },
  {
    name: "시간의 현자",
    description: "롯데월드타워 높이의 지식을 지닌 시간을 초월한 현자.",
    sprite_url: spriteUrl("sage-of-time"),
    unlock_height_cm: 55500,
    rarity: "legendary",
  },
  {
    name: "우주 독서가",
    description: "1km 높이의 책탑 위에서 우주의 진리를 읽는 궁극의 독서가.",
    sprite_url: spriteUrl("cosmic-reader"),
    unlock_height_cm: 100000,
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
