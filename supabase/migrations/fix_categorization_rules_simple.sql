-- Script simple para verificar y arreglar la tabla categorization_rules
-- Si ya tienes rule_type y match_value, solo agrega los constraints faltantes

-- 1. Asegurar que las columnas existan
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'rule_type'
  ) THEN
    ALTER TABLE public.categorization_rules ADD COLUMN rule_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'match_value'
  ) THEN
    ALTER TABLE public.categorization_rules ADD COLUMN match_value TEXT;
  END IF;
END $$;

-- 2. Asegurar constraints (drop primero si existen)
ALTER TABLE public.categorization_rules
  DROP CONSTRAINT IF EXISTS categorization_rules_rule_type_check;

ALTER TABLE public.categorization_rules
  ADD CONSTRAINT categorization_rules_rule_type_check
  CHECK (rule_type IN ('vendor_contains', 'description_contains', 'vendor_equals', 'amount_greater', 'amount_less'));

ALTER TABLE public.categorization_rules
  DROP CONSTRAINT IF EXISTS unique_user_rule;

-- Solo agregar unique constraint si no hay duplicados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT user_id, rule_type, match_value, COUNT(*)
    FROM public.categorization_rules
    GROUP BY user_id, rule_type, match_value
    HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.categorization_rules
      ADD CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value);
  END IF;
END $$;

-- 3. Asegurar índices
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON public.categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON public.categorization_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority ON public.categorization_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_category_id ON public.categorization_rules(category_id);

-- 4. Asegurar RLS
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes
DROP POLICY IF EXISTS "Users can view own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can create own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can update own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can delete own categorization rules" ON public.categorization_rules;

-- Crear políticas
CREATE POLICY "Users can view own categorization rules"
  ON public.categorization_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categorization rules"
  ON public.categorization_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categorization rules"
  ON public.categorization_rules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categorization rules"
  ON public.categorization_rules FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Trigger para updated_at
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
  FOR EACH ROW
  EXECUTE FUNCTION update_categorization_rules_updated_at();
