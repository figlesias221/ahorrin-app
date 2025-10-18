-- Crear tabla categorization_rules desde cero
-- Script seguro que verifica si existe antes de crear

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,

  -- Tipo de regla
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'vendor_contains',
    'description_contains',
    'vendor_equals',
    'amount_greater',
    'amount_less'
  )),

  -- Valor a comparar
  match_value TEXT NOT NULL,

  -- Metadatos
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint
  CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id
  ON public.categorization_rules(user_id);

CREATE INDEX IF NOT EXISTS idx_categorization_rules_active
  ON public.categorization_rules(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority
  ON public.categorization_rules(priority DESC);

CREATE INDEX IF NOT EXISTS idx_categorization_rules_category_id
  ON public.categorization_rules(category_id);

-- Habilitar Row Level Security
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes (si existen)
DROP POLICY IF EXISTS "Users can view own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can create own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can update own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can delete own categorization rules" ON public.categorization_rules;

-- Crear políticas RLS
CREATE POLICY "Users can view own categorization rules"
  ON public.categorization_rules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categorization rules"
  ON public.categorization_rules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categorization rules"
  ON public.categorization_rules
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categorization rules"
  ON public.categorization_rules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Función y trigger para updated_at
CREATE OR REPLACE FUNCTION update_categorization_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categorization_rules_updated_at_trigger
  ON public.categorization_rules;

CREATE TRIGGER update_categorization_rules_updated_at_trigger
  BEFORE UPDATE ON public.categorization_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_categorization_rules_updated_at();
