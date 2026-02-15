-- ============================================================
-- 00002_security_hardening.sql
-- Security hardening: revoke excessive privileges, fix SECURITY
-- DEFINER function, drop overly permissive UPDATE policy.
-- ============================================================

-- 1. Drop overly permissive books UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update books" ON books;

-- 2. Revoke TRUNCATE/TRIGGER/REFERENCES from both anon and authenticated
REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- 3. Revoke all write privileges from anon (should only have SELECT)
REVOKE DELETE, INSERT, UPDATE ON books FROM anon;
REVOKE DELETE, INSERT, UPDATE ON characters FROM anon;
REVOKE DELETE, INSERT, UPDATE ON profiles FROM anon;
REVOKE DELETE, INSERT, UPDATE ON reading_notes FROM anon;
REVOKE DELETE, INSERT, UPDATE ON reading_sessions FROM anon;
REVOKE DELETE, INSERT, UPDATE ON user_books FROM anon;
REVOKE DELETE, INSERT, UPDATE ON user_characters FROM anon;

-- 4. Fix SECURITY DEFINER function with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
