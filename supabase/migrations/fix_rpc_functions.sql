-- Fix RPC Functions - Ensure they're properly registered
-- Run this in Supabase SQL Editor

-- Drop and recreate functions to refresh schema cache

-- 1. Drop existing functions
DROP FUNCTION IF EXISTS copy_template_rules_to_user(UUID, JSONB);
DROP FUNCTION IF EXISTS get_template_rules_summary();

-- 2. Create copy_template_rules_to_user function
CREATE FUNCTION copy_template_rules_to_user(p_user_id UUID)
RETURNS TABLE (
  rules_copied INTEGER,
  categories_created INTEGER,
  success BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rules_copied INTEGER := 0;
  v_categories_created INTEGER := 0;
  v_category_id UUID;
  v_template_rule RECORD;
BEGIN
  -- For each active template rule
  FOR v_template_rule IN
    SELECT * FROM public.template_categorization_rules
    WHERE is_active = true
    ORDER BY priority DESC
  LOOP
    -- Check if user already has this category
    SELECT id INTO v_category_id
    FROM public.categories
    WHERE user_id = p_user_id
      AND name = v_template_rule.category_name
      AND type = v_template_rule.category_type
    LIMIT 1;

    -- Create category if it doesn't exist
    IF v_category_id IS NULL THEN
      INSERT INTO public.categories (user_id, name, type, color)
      VALUES (
        p_user_id,
        v_template_rule.category_name,
        v_template_rule.category_type,
        CASE v_template_rule.category_type
          WHEN 'expense' THEN '#ef4444'
          WHEN 'income' THEN '#10b981'
        END
      )
      RETURNING id INTO v_category_id;

      v_categories_created := v_categories_created + 1;
    END IF;

    -- Copy the rule (skip duplicates)
    INSERT INTO public.categorization_rules (
      user_id, category_id, rule_type, match_value, priority, is_active
    )
    VALUES (
      p_user_id, v_category_id, v_template_rule.rule_type,
      v_template_rule.match_value, v_template_rule.priority, true
    )
    ON CONFLICT (user_id, rule_type, match_value) DO NOTHING;

    GET DIAGNOSTICS v_rules_copied = ROW_COUNT;
    IF v_rules_copied > 0 THEN
      v_rules_copied := v_rules_copied + 1;
    END IF;
  END LOOP;

  RETURN QUERY
  SELECT
    v_rules_copied,
    v_categories_created,
    true AS success,
    format('Creadas %s categorías y copiadas %s reglas', v_categories_created, v_rules_copied)::TEXT AS message;
END;
$$;

-- 3. Create get_template_rules_summary function
CREATE FUNCTION get_template_rules_summary()
RETURNS TABLE (
  total_rules INTEGER,
  rules_by_category JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_rules,
    jsonb_object_agg(
      category_name,
      jsonb_build_object('count', count, 'type', category_type)
    ) AS rules_by_category
  FROM (
    SELECT
      category_name,
      category_type,
      COUNT(*)::INTEGER AS count
    FROM public.template_categorization_rules
    WHERE is_active = true
    GROUP BY category_name, category_type
    ORDER BY count DESC
  ) summary;
END;
$$;

-- 4. Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION copy_template_rules_to_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_rules_summary() TO authenticated;

-- 5. Add comments
COMMENT ON FUNCTION copy_template_rules_to_user(UUID) IS 'Copies template rules to user account';
COMMENT ON FUNCTION get_template_rules_summary() IS 'Returns summary of template rules';

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Functions created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '  - copy_template_rules_to_user(p_user_id UUID)';
  RAISE NOTICE '  - get_template_rules_summary()';
  RAISE NOTICE '';
  RAISE NOTICE 'Restart your Next.js app and try again.';
END $$;
