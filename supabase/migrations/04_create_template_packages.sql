-- Create Template Packages System
-- Allows users to choose between different rule packages during onboarding

BEGIN;

-- 1. Add package_id to template rules
ALTER TABLE public.template_categorization_rules
ADD COLUMN IF NOT EXISTS package_id TEXT DEFAULT 'default';

-- 2. Create template_packages table
CREATE TABLE IF NOT EXISTS public.template_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  author TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Insert package definitions
INSERT INTO public.template_packages (id, name, description, icon, author, sort_order)
VALUES
  ('default', 'Paquete Base Uruguay', 'Reglas predefinidas para lugares comunes en Uruguay (supermercados, restaurantes, transporte)', '🇺🇾', 'Ahorrín', 1),
  ('figlesias221', 'Mis Reglas Personales', 'Reglas personalizadas basadas en tus hábitos de consumo', '⭐', 'figlesias221', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  author = EXCLUDED.author,
  sort_order = EXCLUDED.sort_order;

-- 4. Update existing default rules with package_id
UPDATE public.template_categorization_rules
SET package_id = 'default'
WHERE description NOT LIKE '%figlesias221%' OR description IS NULL;

-- 5. Update user rules with figlesias221 package_id
UPDATE public.template_categorization_rules
SET package_id = 'figlesias221'
WHERE description LIKE '%figlesias221%';

-- 6. Create function to get available packages
CREATE OR REPLACE FUNCTION public.get_template_packages()
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  icon TEXT,
  author TEXT,
  rule_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    p.id,
    p.name,
    p.description,
    p.icon,
    p.author,
    COUNT(r.id) as rule_count
  FROM public.template_packages p
  LEFT JOIN public.template_categorization_rules r ON r.package_id = p.id AND r.is_active = true
  WHERE p.is_active = true
  GROUP BY p.id, p.name, p.description, p.icon, p.author, p.sort_order
  ORDER BY p.sort_order;
$$;

-- 7. Update get_template_rules_summary to support package_id
CREATE OR REPLACE FUNCTION public.get_template_rules_summary(p_package_id TEXT DEFAULT 'default')
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
      AND package_id = p_package_id
    GROUP BY category_name, category_type
    ORDER BY count DESC
  ) summary;
$$;

-- 8. Update copy_template_rules_to_user to support package_id
CREATE OR REPLACE FUNCTION public.copy_template_rules_to_user(
  p_user_id UUID,
  p_package_id TEXT DEFAULT 'default'
)
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
  -- Loop through template rules for this package
  FOR v_template_rule IN
    SELECT * FROM public.template_categorization_rules
    WHERE is_active = true
      AND package_id = p_package_id
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
      NULL;
    END;
  END LOOP;

  RETURN QUERY
  SELECT
    v_rules_copied,
    v_categories_created,
    true AS success,
    format('✅ Creadas %s categorías y copiadas %s reglas del paquete "%s"',
           v_categories_created, v_rules_copied, p_package_id) AS message;
END;
$$;

-- 9. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_template_packages() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_template_packages() TO anon;
GRANT SELECT ON public.template_packages TO authenticated;
GRANT SELECT ON public.template_packages TO anon;

-- 10. Verify setup
DO $$
DECLARE
  pkg_count INTEGER;
  default_rules INTEGER;
  user_rules INTEGER;
BEGIN
  SELECT COUNT(*) INTO pkg_count FROM public.template_packages WHERE is_active = true;
  SELECT COUNT(*) INTO default_rules FROM public.template_categorization_rules WHERE package_id = 'default' AND is_active = true;
  SELECT COUNT(*) INTO user_rules FROM public.template_categorization_rules WHERE package_id = 'figlesias221' AND is_active = true;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ TEMPLATE PACKAGES CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Packages available: %', pkg_count;
  RAISE NOTICE '  • default (Uruguay Base): % rules', default_rules;
  RAISE NOTICE '  • figlesias221 (Personal): % rules', user_rules;
  RAISE NOTICE '';
  RAISE NOTICE 'Functions updated:';
  RAISE NOTICE '  • get_template_packages()';
  RAISE NOTICE '  • get_template_rules_summary(package_id)';
  RAISE NOTICE '  • copy_template_rules_to_user(user_id, package_id)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Users can now choose between packages!';
  RAISE NOTICE '========================================';
END $$;

COMMIT;
