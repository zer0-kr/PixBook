-- 00009_performance_indexes.sql
-- Add indexes on frequently queried columns to improve query performance.
-- These are additive-only changes — no schema or data modifications.

-- user_books: filtered by (user_id, reading_status) on library, stats, tower, characters pages
CREATE INDEX IF NOT EXISTS idx_user_books_user_status
  ON user_books(user_id, reading_status);

-- reading_sessions: filtered by (user_id, date) on stats calendar
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_date
  ON reading_sessions(user_id, date);

-- reading_notes: joined via user_book_id on book detail page
CREATE INDEX IF NOT EXISTS idx_reading_notes_user_book_id
  ON reading_notes(user_book_id);

-- user_characters: filtered by user_id on characters page
CREATE INDEX IF NOT EXISTS idx_user_characters_user_id
  ON user_characters(user_id);
