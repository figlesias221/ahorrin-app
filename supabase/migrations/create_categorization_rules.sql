-- Tabla para reglas de categorización automática
CREATE TABLE IF NOT EXISTS categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

  -- Tipo de regla
  rule_type TEXT NOT NULL CHECK (rule_type IN ('vendor_contains', 'description_contains', 'vendor_equals', 'amount_greater', 'amount_less')),

  -- Valor a comparar
  match_value TEXT NOT NULL,

  -- Metadatos
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- Mayor prioridad se aplica primero

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Índices para búsqueda rápida
  CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON categorization_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority ON categorization_rules(priority DESC);

-- RLS Policies
ALTER TABLE categorization_rules ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver sus propias reglas
CREATE POLICY "Users can view own categorization rules"
  ON categorization_rules
  FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear sus propias reglas
CREATE POLICY "Users can create own categorization rules"
  ON categorization_rules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias reglas
CREATE POLICY "Users can update own categorization rules"
  ON categorization_rules
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propias reglas
CREATE POLICY "Users can delete own categorization rules"
  ON categorization_rules
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
DROP TRIGGER IF EXISTS update_categorization_rules_updated_at_trigger ON categorization_rules;
CREATE TRIGGER update_categorization_rules_updated_at_trigger
  BEFORE UPDATE ON categorization_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_categorization_rules_updated_at();
