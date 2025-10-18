-- Step 2: Create SQL Functions
-- Run this AFTER 01_create_template_system.sql
-- This creates the RPC functions for the onboarding flow

BEGIN;

-- 1. Drop old functions if they exist
DROP FUNCTION IF EXISTS copy_template_rules_to_user(UUID, JSONB);
DROP FUNCTION IF EXISTS copy_template_rules_to_user(UUID);
DROP FUNCTION IF EXISTS get_template_rules_summary();

-- 2. Create function to get template rules summary
CREATE FUNCTION public.get_template_rules_summary()
RETURNS TABLE (
  total_rules BIGINT,
  rules_by_category JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    COUNT(*) AS total_rules,
    jsonb_object_agg(
      category_name,
      jsonb_build_object('count', count, 'type', category_type)
    ) AS rules_by_category
  FROM (
    SELECT
      category_name,
      category_type,
      COUNT(*) AS count
    FROM public.template_categorization_rules
    WHERE is_active = true
    GROUP BY category_name, category_type
    ORDER BY count DESC
  ) summary;
$$;

-- 3. Create function to copy template rules to user
CREATE FUNCTION public.copy_template_rules_to_user(p_user_id UUID)
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
  v_inserted BOOLEAN;
BEGIN
  -- Loop through each active template rule
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
          ELSE '#3b82f6'
        END
      )
      RETURNING id INTO v_category_id;

      v_categories_created := v_categories_created + 1;
    END IF;

    -- Try to insert the rule (skip if duplicate)
    BEGIN
      INSERT INTO public.categorization_rules (
        user_id, category_id, rule_type, match_value, priority, is_active
      )
      VALUES (
        p_user_id, v_category_id, v_template_rule.rule_type,
        v_template_rule.match_value, v_template_rule.priority, true
      );

      v_rules_copied := v_rules_copied + 1;

    EXCEPTION WHEN unique_violation THEN
      -- Rule already exists, skip
      NULL;
    END;
  END LOOP;

  RETURN QUERY
  SELECT
    v_rules_copied,
    v_categories_created,
    true AS success,
    format('✅ Creadas %s categorías y copiadas %s reglas de auto-categorización',
           v_categories_created, v_rules_copied) AS message;
END;
$$;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_template_rules_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_template_rules_summary() TO anon;
GRANT EXECUTE ON FUNCTION public.copy_template_rules_to_user(UUID) TO authenticated;

-- 5. Add comments
COMMENT ON FUNCTION public.get_template_rules_summary() IS 'Returns summary of available template categorization rules';
COMMENT ON FUNCTION public.copy_template_rules_to_user(UUID) IS 'Copies template rules to a user account, creating categories as needed';

-- 6. Verify functions were created
DO $$
DECLARE
  func_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO func_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
    AND p.proname IN ('get_template_rules_summary', 'copy_template_rules_to_user');

  IF func_count = 2 THEN
    RAISE NOTICE '✅ Created 2 SQL functions successfully';
    RAISE NOTICE '';
    RAISE NOTICE 'Available functions:';
    RAISE NOTICE '  • get_template_rules_summary()';
    RAISE NOTICE '  • copy_template_rules_to_user(p_user_id UUID)';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Setup complete! Restart your Next.js app and try the onboarding.';
  ELSE
    RAISE EXCEPTION 'Failed to create functions';
  END IF;
END $$;

COMMIT;
