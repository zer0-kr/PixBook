import type { CharacterDefinition } from "../milestones";
import { spriteUrl } from "../milestones";

export const EPIC_CHARACTERS: CharacterDefinition[] = [
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
];
