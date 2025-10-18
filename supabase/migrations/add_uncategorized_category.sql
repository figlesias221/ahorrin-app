-- Add "Sin categorizar" category as system fallback
-- This migration ensures every user has an "uncategorized" category for transactions that don't match any rules

-- Function to create uncategorized category for a user if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_uncategorized_category(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_category_id UUID;
BEGIN
  -- Check if user already has an uncategorized category
  SELECT id INTO v_category_id
  FROM categories
  WHERE user_id = p_user_id
    AND (
      LOWER(name) LIKE '%sin categorizar%'
      OR LOWER(name) LIKE '%uncategorized%'
      OR LOWER(name) LIKE '%pendiente%'
      OR LOWER(name) = 'otros'
    )
    AND is_active = true
  LIMIT 1;

  -- If not found, create it
  IF v_category_id IS NULL THEN
    INSERT INTO categories (user_id, name, color, icon, type, is_active)
    VALUES (
      p_user_id,
      'Sin categorizar',
      '#94a3b8', -- slate-400 color
      '❓',
      'expense',
      true
    )
    RETURNING id INTO v_category_id;

    RAISE NOTICE 'Created uncategorized category for user %', p_user_id;
  END IF;

  RETURN v_category_id;
END;
$$;

-- Create uncategorized category for all existing users who don't have one
DO $$
DECLARE
  v_user RECORD;
  v_category_id UUID;
BEGIN
  FOR v_user IN
    SELECT DISTINCT u.id
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1
      FROM categories c
      WHERE c.user_id = u.id
        AND (
          LOWER(c.name) LIKE '%sin categorizar%'
          OR LOWER(c.name) LIKE '%uncategorized%'
          OR LOWER(c.name) LIKE '%pendiente%'
          OR LOWER(c.name) = 'otros'
        )
        AND c.is_active = true
    )
  LOOP
    v_category_id := ensure_uncategorized_category(v_user.id);
    RAISE NOTICE 'Ensured uncategorized category for user %: %', v_user.id, v_category_id;
  END LOOP;
END;
$$;

-- Add comment
COMMENT ON FUNCTION ensure_uncategorized_category(UUID) IS
  'Ensures a user has an "uncategorized" category to use as fallback for transactions without matching rules';
