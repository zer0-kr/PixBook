-- ============================================================
-- 00002_drop_books_update_policy.sql
-- Remove overly permissive UPDATE policy on books table.
-- Book metadata updates should only happen server-side.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can update books" ON books;
