-- Export User Rules to Templates
-- This script exports categorization rules from user figlesias221
-- and converts them into selectable template packages

-- Step 1: Get user ID for figlesias221
DO $$
DECLARE
  v_user_id UUID;
  v_rule RECORD;
  v_category RECORD;
  v_inserted_count INTEGER := 0;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email LIKE '%figlesias221%' OR email LIKE '%federico%iglesias%'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ User not found. Please update the email filter in the script.';
    RAISE NOTICE '';
    RAISE NOTICE 'To find your user:';
    RAISE NOTICE 'SELECT id, email FROM auth.users;';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Found user: %', v_user_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Exporting rules from this user...';
  RAISE NOTICE '';

  -- Clear existing "User Package" templates (if any)
  DELETE FROM public.template_categorization_rules
  WHERE description LIKE '%figlesias221%' OR name LIKE 'User:%';

  -- Export user's rules to templates
  FOR v_rule IN
    SELECT
      cr.id,
      cr.rule_type,
      cr.match_value,
      cr.priority,
      c.name as category_name,
      c.type as category_type
    FROM public.categorization_rules cr
    JOIN public.categories c ON cr.category_id = c.id
    WHERE cr.user_id = v_user_id
      AND cr.is_active = true
    ORDER BY cr.priority DESC, c.name
  LOOP
    -- Insert as template rule
    INSERT INTO public.template_categorization_rules
      (name, description, category_name, category_type, rule_type, match_value, priority)
    VALUES (
      'User: ' || v_rule.match_value,
      'From user figlesias221 - ' || v_rule.category_name,
      v_rule.category_name,
      v_rule.category_type,
      v_rule.rule_type,
      v_rule.match_value,
      v_rule.priority
    )
    ON CONFLICT DO NOTHING;

    v_inserted_count := v_inserted_count + 1;
  END LOOP;

  RAISE NOTICE '✅ Exported % rules from user to templates', v_inserted_count;
  RAISE NOTICE '';

  -- Show summary
  RAISE NOTICE 'Summary by category:';
  FOR v_category IN
    SELECT category_name, category_type, COUNT(*) as count
    FROM public.template_categorization_rules
    WHERE description LIKE '%figlesias221%'
    GROUP BY category_name, category_type
    ORDER BY count DESC
  LOOP
    RAISE NOTICE '  • % (%) - % rules', v_category.category_name, v_category.category_type, v_category.count;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 User rules exported successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Update onboarding to offer these as a package option.';
END $$;

-- Verify export
SELECT
  category_name,
  category_type,
  COUNT(*) as rule_count
FROM public.template_categorization_rules
WHERE description LIKE '%figlesias221%'
GROUP BY category_name, category_type
ORDER BY rule_count DESC;
