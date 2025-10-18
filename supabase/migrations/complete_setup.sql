-- Complete Database Setup
-- Run this ONCE in Supabase SQL Editor to set up everything
-- Safe to run multiple times (idempotent)

-- ==========================================
-- PART 1: Core Tables & Columns
-- ==========================================

-- 1. Add currency to transactions (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.transactions
    ADD COLUMN currency TEXT NOT NULL DEFAULT 'UYU';
    RAISE NOTICE '✓ Added currency column to transactions';
  ELSE
    RAISE NOTICE '✓ Currency column already exists';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'transactions_currency_not_empty'
  ) THEN
    ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_currency_not_empty
    CHECK (currency IS NOT NULL AND length(TRIM(BOTH FROM currency)) > 0);
    RAISE NOTICE '✓ Added currency constraint';
  ELSE
    RAISE NOTICE '✓ Currency constraint already exists';
  END IF;
END $$;

-- 2. Create bank_statements table (if not exists)
CREATE TABLE IF NOT EXISTS public.bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  period_start DATE,
  period_end DATE,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  transactions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_statements_user_id ON public.bank_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_upload_date ON public.bank_statements(upload_date DESC);

ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own statements" ON public.bank_statements;
DROP POLICY IF EXISTS "Users can upload statements" ON public.bank_statements;
DROP POLICY IF EXISTS "Users can update their statements" ON public.bank_statements;
DROP POLICY IF EXISTS "Users can delete their statements" ON public.bank_statements;

CREATE POLICY "Users can view their own statements" ON public.bank_statements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload statements" ON public.bank_statements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their statements" ON public.bank_statements
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their statements" ON public.bank_statements
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Add format/bank/currency to bank_statements (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_statements' AND column_name = 'format') THEN
    ALTER TABLE public.bank_statements ADD COLUMN format TEXT;
    RAISE NOTICE '✓ Added format column to bank_statements';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_statements' AND column_name = 'bank') THEN
    ALTER TABLE public.bank_statements ADD COLUMN bank TEXT;
    RAISE NOTICE '✓ Added bank column to bank_statements';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_statements' AND column_name = 'currency') THEN
    ALTER TABLE public.bank_statements ADD COLUMN currency TEXT DEFAULT 'UYU';
    RAISE NOTICE '✓ Added currency column to bank_statements';
  END IF;
END $$;

-- 4. Add statement_id to transactions (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'statement_id') THEN
    ALTER TABLE public.transactions
    ADD COLUMN statement_id UUID REFERENCES public.bank_statements(id) ON DELETE SET NULL;
    RAISE NOTICE '✓ Added statement_id column to transactions';
  ELSE
    RAISE NOTICE '✓ Statement_id column already exists';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_transactions_statement_id ON public.transactions(statement_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dedup ON public.transactions(user_id, date, vendor, amount, currency);

-- 5. Create categorization_rules table (if not exists)
CREATE TABLE IF NOT EXISTS public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('vendor_contains', 'description_contains', 'vendor_equals', 'amount_greater', 'amount_less')),
  match_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value)
);

CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON public.categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON public.categorization_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority ON public.categorization_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_category_id ON public.categorization_rules(category_id);

ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can create own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can update own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can delete own categorization rules" ON public.categorization_rules;

CREATE POLICY "Users can view own categorization rules" ON public.categorization_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categorization rules" ON public.categorization_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categorization rules" ON public.categorization_rules FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own categorization rules" ON public.categorization_rules FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_categorization_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categorization_rules_updated_at_trigger ON public.categorization_rules;
CREATE TRIGGER update_categorization_rules_updated_at_trigger
  BEFORE UPDATE ON public.categorization_rules
  FOR EACH ROW EXECUTE FUNCTION update_categorization_rules_updated_at();

-- ==========================================
-- PART 2: Template Rules System
-- ==========================================

-- 6. Create template rules table
CREATE TABLE IF NOT EXISTS public.template_categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_name TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('expense', 'income')),
  rule_type TEXT NOT NULL CHECK (rule_type IN ('vendor_contains', 'description_contains', 'vendor_equals', 'amount_greater', 'amount_less')),
  match_value TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_template_rules_active ON public.template_categorization_rules(is_active) WHERE is_active = true;

-- 7. Insert template rules (only if table is empty)
INSERT INTO public.template_categorization_rules (name, description, category_name, category_type, rule_type, match_value, priority)
SELECT * FROM (VALUES
  ('FROG', 'Restaurante FROG', 'Restaurantes', 'expense', 'vendor_contains', 'FROG', 90),
  ('Uber Eats', 'Delivery Uber Eats', 'Restaurantes', 'expense', 'vendor_contains', 'UBER *EATS', 90),
  ('PedidosYa', 'Delivery PedidosYa', 'Restaurantes', 'expense', 'vendor_contains', 'PEDIDOSYA', 90),
  ('La Colonial', 'Cafetería La Colonial', 'Restaurantes', 'expense', 'vendor_contains', 'LA COLONIAL', 90),
  ('Cafe Paraiso', 'Café Paraíso', 'Restaurantes', 'expense', 'vendor_contains', 'CAFE PARAISO', 90),
  ('Devoto', 'Supermercado Devoto', 'Supermercado', 'expense', 'vendor_contains', 'DEVOTO', 85),
  ('Uber', 'Viajes Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER *TRIP', 88),
  ('Uber general', 'Cualquier servicio Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER', 70),
  ('Telepeaje', 'Peajes', 'Transporte', 'expense', 'vendor_contains', 'TELEPEAJE', 88),
  ('Supermercado', 'Supermercados en general', 'Supermercado', 'expense', 'vendor_contains', 'SUPERMERCADO', 75),
  ('Carniceria', 'Carnicerías', 'Supermercado', 'expense', 'vendor_contains', 'CARNICERIA', 80),
  ('Del Campo', 'Carnicería Del Campo', 'Supermercado', 'expense', 'vendor_contains', 'DEL CAMPO', 85),
  ('Farmashop', 'Farmacia Farmashop', 'Salud', 'expense', 'vendor_contains', 'FARMASHOP', 88),
  ('Farmacia', 'Farmacias en general', 'Salud', 'expense', 'vendor_contains', 'FARMACIA', 75),
  ('Clinica', 'Clínicas médicas', 'Salud', 'expense', 'vendor_contains', 'CLINICA', 85),
  ('Hospital', 'Hospitales', 'Salud', 'expense', 'vendor_contains', 'HOSPITAL', 85),
  ('Decathlon', 'Tienda deportiva', 'Compras', 'expense', 'vendor_contains', 'DECATHLON', 85),
  ('Zara', 'Ropa Zara', 'Compras', 'expense', 'vendor_contains', 'ZARA', 85),
  ('Netflix', 'Streaming Netflix', 'Servicios', 'expense', 'vendor_contains', 'NETFLIX', 90),
  ('Spotify', 'Música Spotify', 'Servicios', 'expense', 'vendor_contains', 'SPOTIFY', 90),
  ('Alquiler alto', 'Pagos grandes probablemente alquiler', 'Alquiler', 'expense', 'amount_greater', '20000', 95),
  ('Salario', 'Ingresos por salario', 'Salario', 'income', 'amount_greater', '30000', 80)
) AS v(name, description, category_name, category_type, rule_type, match_value, priority)
WHERE NOT EXISTS (SELECT 1 FROM public.template_categorization_rules LIMIT 1);

-- 8. Create function to copy template rules to user
CREATE OR REPLACE FUNCTION copy_template_rules_to_user(p_user_id UUID, p_category_mappings JSONB DEFAULT NULL)
RETURNS TABLE (rules_copied INTEGER, categories_created INTEGER, success BOOLEAN, message TEXT) AS $$
DECLARE
  v_rules_copied INTEGER := 0;
  v_categories_created INTEGER := 0;
  v_category_id UUID;
  v_template_rule RECORD;
BEGIN
  FOR v_template_rule IN SELECT * FROM public.template_categorization_rules WHERE is_active = true ORDER BY priority DESC
  LOOP
    SELECT id INTO v_category_id FROM public.categories WHERE user_id = p_user_id AND name = v_template_rule.category_name AND type = v_template_rule.category_type LIMIT 1;

    IF v_category_id IS NULL THEN
      INSERT INTO public.categories (user_id, name, type, color)
      VALUES (p_user_id, v_template_rule.category_name, v_template_rule.category_type,
        CASE v_template_rule.category_type WHEN 'expense' THEN '#ef4444' WHEN 'income' THEN '#10b981' END)
      RETURNING id INTO v_category_id;
      v_categories_created := v_categories_created + 1;
    END IF;

    INSERT INTO public.categorization_rules (user_id, category_id, rule_type, match_value, priority, is_active)
    VALUES (p_user_id, v_category_id, v_template_rule.rule_type, v_template_rule.match_value, v_template_rule.priority, true)
    ON CONFLICT (user_id, rule_type, match_value) DO NOTHING;

    IF FOUND THEN v_rules_copied := v_rules_copied + 1; END IF;
  END LOOP;

  RETURN QUERY SELECT v_rules_copied, v_categories_created, true, format('Creadas %s categorías y copiadas %s reglas', v_categories_created, v_rules_copied)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to get template rules summary
CREATE OR REPLACE FUNCTION get_template_rules_summary()
RETURNS TABLE (total_rules INTEGER, rules_by_category JSONB) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_rules,
    jsonb_object_agg(category_name, jsonb_build_object('count', count, 'type', category_type)) as rules_by_category
  FROM (
    SELECT category_name, category_type, COUNT(*)::INTEGER as count
    FROM public.template_categorization_rules WHERE is_active = true
    GROUP BY category_name, category_type ORDER BY count DESC
  ) summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant permissions
GRANT EXECUTE ON FUNCTION copy_template_rules_to_user(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_rules_summary() TO authenticated;

-- ==========================================
-- Final Verification
-- ==========================================
DO $$
DECLARE
  tables_count INT;
  template_rules_count INT;
BEGIN
  SELECT COUNT(*) INTO tables_count FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN ('categories', 'transactions', 'bank_statements', 'categorization_rules', 'template_categorization_rules');

  SELECT COUNT(*) INTO template_rules_count FROM public.template_categorization_rules;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables: % of 5 created', tables_count;
  RAISE NOTICE 'Template rules: % loaded', template_rules_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Reload your Next.js app';
  RAISE NOTICE '2. Create a new account or login';
  RAISE NOTICE '3. You will see the onboarding screen';
  RAISE NOTICE '========================================';
END $$;
