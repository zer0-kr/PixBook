-- ============================================================
-- 00001_initial_schema.sql
-- Initial database schema for the reading log web service
-- ============================================================

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE reading_status AS ENUM (
  'want_to_read',
  'reading',
  'completed',
  'dropped'
);

CREATE TYPE character_rarity AS ENUM (
  'common',
  'rare',
  'epic',
  'legendary'
);

-- ============================================================
-- 2. PROFILES TABLE
-- ============================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nickname        TEXT,
  avatar_url      TEXT,
  tower_height_cm NUMERIC DEFAULT 0,
  total_books_completed INTEGER DEFAULT 0,
  total_pages_read      INTEGER DEFAULT 0,
  active_character_id   UUID,  -- FK added later via ALTER TABLE
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. BOOKS TABLE
-- ============================================================

CREATE TABLE books (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  isbn13      TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  publisher   TEXT,
  pub_date    TEXT,
  cover_url   TEXT,
  page_count  INTEGER NOT NULL DEFAULT 200,
  category    TEXT,
  description TEXT,
  aladin_link TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. USER_BOOKS TABLE
-- ============================================================

CREATE TABLE user_books (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book_id         UUID NOT NULL REFERENCES books ON DELETE CASCADE,
  reading_status  reading_status NOT NULL DEFAULT 'want_to_read',
  rating          SMALLINT CHECK (rating >= 1 AND rating <= 5),
  one_line_review TEXT,
  spine_color     TEXT DEFAULT '#3498DB',
  start_date      DATE,
  end_date        DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- ============================================================
-- 5. READING_NOTES TABLE
-- ============================================================

CREATE TABLE reading_notes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_book_id UUID NOT NULL REFERENCES user_books ON DELETE CASCADE,
  content      TEXT NOT NULL,
  page_number  INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. CHARACTERS TABLE
-- ============================================================

CREATE TABLE characters (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  sprite_url      TEXT NOT NULL,
  unlock_height_cm NUMERIC NOT NULL,
  rarity          character_rarity NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. USER_CHARACTERS TABLE
-- ============================================================

CREATE TABLE user_characters (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  character_id  UUID NOT NULL REFERENCES characters ON DELETE CASCADE,
  is_active     BOOLEAN DEFAULT false,
  unlocked_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, character_id)
);

-- ============================================================
-- 8. READING_SESSIONS TABLE
-- ============================================================

CREATE TABLE reading_sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  user_book_id UUID NOT NULL REFERENCES user_books ON DELETE CASCADE,
  date         DATE NOT NULL,
  pages_read   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, user_book_id, date)
);

-- ============================================================
-- 9. ALTER TABLE: Add FK for active_character_id
-- ============================================================

ALTER TABLE profiles
  ADD CONSTRAINT fk_active_character
  FOREIGN KEY (active_character_id) REFERENCES characters(id);

-- ============================================================
-- 10. UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to user_books
CREATE TRIGGER set_user_books_updated_at
  BEFORE UPDATE ON user_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to reading_notes
CREATE TRIGGER set_reading_notes_updated_at
  BEFORE UPDATE ON reading_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 11. AUTO-CREATE PROFILE ON AUTH.USERS INSERT
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- --- profiles ---
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT is handled by the trigger, no direct INSERT policy needed for users

-- --- books ---
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- No UPDATE policy for books – updates are handled server-side only

-- --- characters ---
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all characters"
  ON characters FOR SELECT
  TO authenticated
  USING (true);

-- --- user_books ---
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user_books"
  ON user_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user_books"
  ON user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user_books"
  ON user_books FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_books"
  ON user_books FOR DELETE
  USING (auth.uid() = user_id);

-- --- reading_notes ---
ALTER TABLE reading_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading_notes"
  ON reading_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.id = reading_notes.user_book_id
        AND user_books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own reading_notes"
  ON reading_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.id = reading_notes.user_book_id
        AND user_books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reading_notes"
  ON reading_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.id = reading_notes.user_book_id
        AND user_books.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.id = reading_notes.user_book_id
        AND user_books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own reading_notes"
  ON reading_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.id = reading_notes.user_book_id
        AND user_books.user_id = auth.uid()
    )
  );

-- --- user_characters ---
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user_characters"
  ON user_characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user_characters"
  ON user_characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user_characters"
  ON user_characters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_characters"
  ON user_characters FOR DELETE
  USING (auth.uid() = user_id);

-- --- reading_sessions ---
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading_sessions"
  ON reading_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading_sessions"
  ON reading_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading_sessions"
  ON reading_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading_sessions"
  ON reading_sessions FOR DELETE
  USING (auth.uid() = user_id);
