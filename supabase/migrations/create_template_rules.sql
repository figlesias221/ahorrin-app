-- Create template categorization rules for new users to inherit
-- These are predefined rules that can be copied to a user's account

-- 1. Create template rules table
CREATE TABLE IF NOT EXISTS public.template_categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template metadata
  name TEXT NOT NULL,
  description TEXT,
  category_name TEXT NOT NULL, -- Name of category this rule should map to
  category_type TEXT NOT NULL CHECK (category_type IN ('expense', 'income')),

  -- Rule definition (same as user rules)
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'vendor_contains',
    'description_contains',
    'vendor_equals',
    'amount_greater',
    'amount_less'
  )),
  match_value TEXT NOT NULL,

  -- Metadata
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add index
CREATE INDEX IF NOT EXISTS idx_template_rules_active
  ON public.template_categorization_rules(is_active)
  WHERE is_active = true;

-- 3. Insert common template rules
INSERT INTO public.template_categorization_rules
  (name, description, category_name, category_type, rule_type, match_value, priority)
VALUES
  -- Restaurants & Food
  ('FROG', 'Restaurante FROG', 'Restaurantes', 'expense', 'vendor_contains', 'FROG', 90),
  ('Uber Eats', 'Delivery Uber Eats', 'Restaurantes', 'expense', 'vendor_contains', 'UBER *EATS', 90),
  ('PedidosYa', 'Delivery PedidosYa', 'Restaurantes', 'expense', 'vendor_contains', 'PEDIDOSYA', 90),
  ('La Colonial', 'Cafetería La Colonial', 'Restaurantes', 'expense', 'vendor_contains', 'LA COLONIAL', 90),
  ('Cafe Paraiso', 'Café Paraíso', 'Restaurantes', 'expense', 'vendor_contains', 'CAFE PARAISO', 90),
  ('Devoto', 'Supermercado Devoto', 'Supermercado', 'expense', 'vendor_contains', 'DEVOTO', 85),

  -- Transport
  ('Uber', 'Viajes Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER *TRIP', 88),
  ('Uber general', 'Cualquier servicio Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER', 70),
  ('Telepeaje', 'Peajes', 'Transporte', 'expense', 'vendor_contains', 'TELEPEAJE', 88),

  -- Supermarket & Groceries
  ('Supermercado', 'Supermercados en general', 'Supermercado', 'expense', 'vendor_contains', 'SUPERMERCADO', 75),
  ('Carniceria', 'Carnicerías', 'Supermercado', 'expense', 'vendor_contains', 'CARNICERIA', 80),
  ('Del Campo', 'Carnicería Del Campo', 'Supermercado', 'expense', 'vendor_contains', 'DEL CAMPO', 85),

  -- Health
  ('Farmashop', 'Farmacia Farmashop', 'Salud', 'expense', 'vendor_contains', 'FARMASHOP', 88),
  ('Farmacia', 'Farmacias en general', 'Salud', 'expense', 'vendor_contains', 'FARMACIA', 75),
  ('Clinica', 'Clínicas médicas', 'Salud', 'expense', 'vendor_contains', 'CLINICA', 85),
  ('Hospital', 'Hospitales', 'Salud', 'expense', 'vendor_contains', 'HOSPITAL', 85),

  -- Shopping
  ('Decathlon', 'Tienda deportiva', 'Compras', 'expense', 'vendor_contains', 'DECATHLON', 85),
  ('Zara', 'Ropa Zara', 'Compras', 'expense', 'vendor_contains', 'ZARA', 85),

  -- Services
  ('Netflix', 'Streaming Netflix', 'Servicios', 'expense', 'vendor_contains', 'NETFLIX', 90),
  ('Spotify', 'Música Spotify', 'Servicios', 'expense', 'vendor_contains', 'SPOTIFY', 90),

  -- Utilities (by amount - usually high)
  ('Alquiler alto', 'Pagos grandes probablemente alquiler', 'Alquiler', 'expense', 'amount_greater', '20000', 95),

  -- Income
  ('Salario', 'Ingresos por salario', 'Salario', 'income', 'amount_greater', '30000', 80)
ON CONFLICT DO NOTHING;

-- 4. Create function to copy template rules to a user
CREATE OR REPLACE FUNCTION copy_template_rules_to_user(
  p_user_id UUID,
  p_category_mappings JSONB DEFAULT NULL -- Optional: map template categories to user's categories
)
RETURNS TABLE (
  rules_copied INTEGER,
  categories_created INTEGER,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_rules_copied INTEGER := 0;
  v_categories_created INTEGER := 0;
  v_category_id UUID;
  v_template_rule RECORD;
  v_category_mapping JSONB;
BEGIN
  -- For each template rule
  FOR v_template_rule IN
    SELECT * FROM public.template_categorization_rules
    WHERE is_active = true
    ORDER BY priority DESC
  LOOP
    -- Check if user already has a category with this name
    SELECT id INTO v_category_id
    FROM public.categories
    WHERE user_id = p_user_id
      AND name = v_template_rule.category_name
      AND type = v_template_rule.category_type
    LIMIT 1;

    -- If category doesn't exist, create it
    IF v_category_id IS NULL THEN
      INSERT INTO public.categories (user_id, name, type, color)
      VALUES (
        p_user_id,
        v_template_rule.category_name,
        v_template_rule.category_type,
        -- Assign a default color based on type
        CASE v_template_rule.category_type
          WHEN 'expense' THEN '#ef4444' -- red
          WHEN 'income' THEN '#10b981' -- green
        END
      )
      RETURNING id INTO v_category_id;

      v_categories_created := v_categories_created + 1;
    END IF;

    -- Copy the rule to user (skip if already exists)
    INSERT INTO public.categorization_rules (
      user_id,
      category_id,
      rule_type,
      match_value,
      priority,
      is_active
    )
    VALUES (
      p_user_id,
      v_category_id,
      v_template_rule.rule_type,
      v_template_rule.match_value,
      v_template_rule.priority,
      true
    )
    ON CONFLICT (user_id, rule_type, match_value) DO NOTHING;

    -- Check if rule was inserted
    IF FOUND THEN
      v_rules_copied := v_rules_copied + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT
    v_rules_copied,
    v_categories_created,
    true,
    format('Creadas %s categorías y copiadas %s reglas de auto-categorización',
           v_categories_created, v_rules_copied)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to get template rules summary
CREATE OR REPLACE FUNCTION get_template_rules_summary()
RETURNS TABLE (
  total_rules INTEGER,
  rules_by_category JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_rules,
    jsonb_object_agg(
      category_name,
      jsonb_build_object(
        'count', count,
        'type', category_type
      )
    ) as rules_by_category
  FROM (
    SELECT
      category_name,
      category_type,
      COUNT(*)::INTEGER as count
    FROM public.template_categorization_rules
    WHERE is_active = true
    GROUP BY category_name, category_type
    ORDER BY count DESC
  ) summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant execute permissions
GRANT EXECUTE ON FUNCTION copy_template_rules_to_user(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_rules_summary() TO authenticated;

-- Comments
COMMENT ON TABLE public.template_categorization_rules IS 'Template rules that new users can inherit';
COMMENT ON FUNCTION copy_template_rules_to_user IS 'Copies template rules to a user account, creating categories as needed';
COMMENT ON FUNCTION get_template_rules_summary IS 'Returns a summary of available template rules';
