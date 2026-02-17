-- Remove active character system (representative character selection)
-- Character collection/unlock system remains intact

-- Drop RPC function
DROP FUNCTION IF EXISTS set_active_character(UUID, UUID);

-- Drop FK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_active_character_id_fkey;

-- Drop columns
ALTER TABLE profiles DROP COLUMN IF EXISTS active_character_id;
ALTER TABLE user_characters DROP COLUMN IF EXISTS is_active;
