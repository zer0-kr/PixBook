-- 00008_realistic_tower_height.sql
-- Fix tower height calculation to use realistic book thickness.
-- Old: 0.06 cm/page (10x over-estimated). New: 0.006 cm/page (~0.06mm real paper thickness).
-- Example: 300 pages → old 18cm → new 1.8cm (realistic book spine).

-- 1) Update RPC function: 0.06 → 0.006
CREATE OR REPLACE FUNCTION public.recalculate_tower_height(p_user_id UUID)
RETURNS TABLE(tower_height NUMERIC, books_completed INTEGER, pages_read INTEGER)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_pages INT; v_books INT; v_height NUMERIC;
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  SELECT COUNT(*)::INT, COALESCE(SUM(b.page_count), 0)::INT
    INTO v_books, v_pages
    FROM public.user_books ub JOIN public.books b ON b.id = ub.book_id
    WHERE ub.user_id = p_user_id AND ub.reading_status = 'completed';
  v_height := v_pages * 0.006;
  UPDATE public.profiles
    SET tower_height_cm = v_height,
        total_books_completed = v_books,
        total_pages_read = v_pages
    WHERE id = p_user_id;
  RETURN QUERY SELECT v_height, v_books, v_pages;
END; $$;

-- 2) Recalculate existing profile tower heights from source data
UPDATE profiles p
SET tower_height_cm = sub.new_height
FROM (
  SELECT ub.user_id,
         COALESCE(SUM(b.page_count), 0) * 0.006 AS new_height
  FROM user_books ub
  JOIN books b ON b.id = ub.book_id
  WHERE ub.reading_status = 'completed'
  GROUP BY ub.user_id
) sub
WHERE p.id = sub.user_id;

-- 3) Scale down character unlock heights by 10x
UPDATE characters SET unlock_height_cm = unlock_height_cm / 10;
