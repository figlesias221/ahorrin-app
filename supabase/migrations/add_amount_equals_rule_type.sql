-- Agregar tipo de regla 'amount_equals' al constraint CHECK
-- Esta migración permite usar reglas que coincidan con montos exactos

-- Primero, eliminar el constraint existente
ALTER TABLE public.categorization_rules
DROP CONSTRAINT IF EXISTS categorization_rules_rule_type_check;

-- Crear nuevo constraint con el tipo adicional
ALTER TABLE public.categorization_rules
ADD CONSTRAINT categorization_rules_rule_type_check
CHECK (rule_type IN (
  'vendor_contains',
  'description_contains',
  'vendor_equals',
  'amount_greater',
  'amount_less',
  'amount_equals'
));
