-- Issue 1: Atomic set_active_character
-- Replaces non-atomic 3-step client-side operation (deactivate → activate → profile update)
CREATE OR REPLACE FUNCTION public.set_active_character(
  p_user_id UUID, p_character_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  UPDATE public.user_characters SET is_active = false
    WHERE user_id = p_user_id AND is_active = true;
  UPDATE public.user_characters SET is_active = true
    WHERE user_id = p_user_id AND character_id = p_character_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character not found';
  END IF;
  UPDATE public.profiles SET active_character_id = p_character_id
    WHERE id = p_user_id;
  RETURN true;
END; $$;

-- Issue 2: Atomic recalculate_tower_height
-- Replaces non-atomic client-side fetch→compute→update pattern
CREATE OR REPLACE FUNCTION public.recalculate_tower_height(p_user_id UUID)
RETURNS TABLE(tower_height NUMERIC, books_completed INTEGER, pages_read INTEGER)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_pages INT; v_books INT; v_height NUMERIC;
BEGIN
  SELECT COALESCE(COUNT(*),0), COALESCE(SUM(b.page_count),0)
    INTO v_books, v_pages
    FROM public.user_books ub JOIN public.books b ON b.id = ub.book_id
    WHERE ub.user_id = p_user_id AND ub.reading_status = 'completed';
  v_height := v_pages * 0.06;
  UPDATE public.profiles
    SET tower_height_cm = v_height,
        total_books_completed = v_books,
        total_pages_read = v_pages
    WHERE id = p_user_id;
  RETURN QUERY SELECT v_height, v_books, v_pages;
END; $$;
