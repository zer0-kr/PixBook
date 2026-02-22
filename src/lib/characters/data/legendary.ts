import type { CharacterDefinition } from "../milestones";
import { spriteUrl } from "../milestones";

export const LEGENDARY_CHARACTERS: CharacterDefinition[] = [
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
