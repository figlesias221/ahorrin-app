-- Migración SEGURA para actualizar el esquema de categorization_rules
-- Verifica qué columnas existen antes de hacer cambios
-- ⚠️ PRESERVA DATOS EXISTENTES

-- Paso 1: Agregar nuevas columnas SOLO si no existen
DO $$
BEGIN
  -- Agregar rule_type si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'rule_type'
  ) THEN
    ALTER TABLE public.categorization_rules ADD COLUMN rule_type TEXT;
  END IF;

  -- Agregar match_value si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'match_value'
  ) THEN
    ALTER TABLE public.categorization_rules ADD COLUMN match_value TEXT;
  END IF;
END $$;

-- Paso 2: Migrar datos SOLO si existen las columnas viejas
DO $$
BEGIN
  -- Migrar vendor_pattern si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'vendor_pattern'
  ) THEN
    UPDATE public.categorization_rules
    SET rule_type = 'vendor_contains', match_value = vendor_pattern
    WHERE vendor_pattern IS NOT NULL AND rule_type IS NULL;
  END IF;

  -- Migrar amount_min si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'amount_min'
  ) THEN
    UPDATE public.categorization_rules
    SET rule_type = 'amount_greater', match_value = amount_min::TEXT
    WHERE amount_min IS NOT NULL AND rule_type IS NULL;
  END IF;

  -- Migrar amount_max si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categorization_rules' AND column_name = 'amount_max'
  ) THEN
    UPDATE public.categorization_rules
    SET rule_type = 'amount_less', match_value = amount_max::TEXT
    WHERE amount_max IS NOT NULL AND rule_type IS NULL;
  END IF;
END $$;

-- Paso 3: Eliminar columnas viejas (solo si existen)
ALTER TABLE public.categorization_rules
  DROP COLUMN IF EXISTS vendor_pattern,
  DROP COLUMN IF EXISTS amount_min,
  DROP COLUMN IF EXISTS amount_max;

-- Paso 4: Hacer las nuevas columnas NOT NULL (solo si tienen valores)
DO $$
BEGIN
  -- Solo hacer NOT NULL si no hay valores nulos
  IF NOT EXISTS (
    SELECT 1 FROM public.categorization_rules WHERE rule_type IS NULL
  ) THEN
    ALTER TABLE public.categorization_rules ALTER COLUMN rule_type SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.categorization_rules WHERE match_value IS NULL
  ) THEN
    ALTER TABLE public.categorization_rules ALTER COLUMN match_value SET NOT NULL;
  END IF;
END $$;

-- Paso 7: Agregar constraint de tipo de regla
ALTER TABLE public.categorization_rules
  DROP CONSTRAINT IF EXISTS categorization_rules_rule_type_check;

ALTER TABLE public.categorization_rules
  ADD CONSTRAINT categorization_rules_rule_type_check
  CHECK (rule_type IN ('vendor_contains', 'description_contains', 'vendor_equals', 'amount_greater', 'amount_less'));

-- Paso 8: Agregar unique constraint (drop primero si existe)
ALTER TABLE public.categorization_rules
  DROP CONSTRAINT IF EXISTS unique_user_rule;

ALTER TABLE public.categorization_rules
  ADD CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON public.categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON public.categorization_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority ON public.categorization_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_category_id ON public.categorization_rules(category_id);

-- RLS Policies
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver sus propias reglas
CREATE POLICY "Users can view own categorization rules"
  ON public.categorization_rules
  FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear sus propias reglas
CREATE POLICY "Users can create own categorization rules"
  ON public.categorization_rules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias reglas
CREATE POLICY "Users can update own categorization rules"
  ON public.categorization_rules
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propias reglas
CREATE POLICY "Users can delete own categorization rules"
  ON public.categorization_rules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_categorization_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_categorization_rules_updated_at_trigger ON public.categorization_rules;
CREATE TRIGGER update_categorization_rules_updated_at_trigger
  BEFORE UPDATE ON public.categorization_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_categorization_rules_updated_at();
