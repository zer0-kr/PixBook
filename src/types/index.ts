export type ReadingStatus = "want_to_read" | "reading" | "completed" | "dropped";
export type CharacterRarity = "common" | "rare" | "epic" | "legendary";

export interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  tower_height_cm: number;
  total_books_completed: number;
  total_pages_read: number;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  pub_date: string | null;
  cover_url: string | null;
  page_count: number;
  category: string | null;
  description: string | null;
  aladin_link: string | null;
  created_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  reading_status: ReadingStatus;
  rating: number | null;
  one_line_review: string | null;
  spine_color: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  book?: Book;
}

export interface ReadingNote {
  id: string;
  user_book_id: string;
  content: string;
  page_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  sprite_url: string;
  unlock_height_cm: number;
  rarity: CharacterRarity;
  created_at: string;
}

export interface UserCharacter {
  id: string;
  user_id: string;
  character_id: string;
  unlocked_at: string;
  character?: Character;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  user_book_id: string;
  date: string;
  pages_read: number;
  created_at: string;
}

export interface TowerMilestone {
  height_cm: number;
  label: string;
  description: string;
}
