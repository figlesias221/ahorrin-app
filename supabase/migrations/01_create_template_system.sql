-- Step 1: Create Template System
-- Run this FIRST in Supabase SQL Editor
-- This creates the template rules table and populates it

BEGIN;

-- 1. Create template_categorization_rules table
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

-- 2. Create index
CREATE INDEX IF NOT EXISTS idx_template_rules_active
  ON public.template_categorization_rules(is_active)
  WHERE is_active = true;

-- 3. Insert template rules (delete old ones first to avoid duplicates)
DELETE FROM public.template_categorization_rules;

INSERT INTO public.template_categorization_rules
  (name, description, category_name, category_type, rule_type, match_value, priority)
VALUES
  -- Restaurants & Food
  ('FROG', 'Restaurante FROG', 'Restaurantes', 'expense', 'vendor_contains', 'FROG', 90),
  ('Uber Eats', 'Delivery Uber Eats', 'Restaurantes', 'expense', 'vendor_contains', 'UBER *EATS', 90),
  ('PedidosYa', 'Delivery PedidosYa', 'Restaurantes', 'expense', 'vendor_contains', 'PEDIDOSYA', 90),
  ('La Colonial', 'Cafetería La Colonial', 'Restaurantes', 'expense', 'vendor_contains', 'LA COLONIAL', 90),
  ('Cafe Paraiso', 'Café Paraíso', 'Restaurantes', 'expense', 'vendor_contains', 'CAFE PARAISO', 90),

  -- Supermarkets
  ('Devoto', 'Supermercado Devoto', 'Supermercado', 'expense', 'vendor_contains', 'DEVOTO', 85),
  ('Supermercado', 'Supermercados en general', 'Supermercado', 'expense', 'vendor_contains', 'SUPERMERCADO', 75),
  ('Carniceria', 'Carnicerías', 'Supermercado', 'expense', 'vendor_contains', 'CARNICERIA', 80),
  ('Del Campo', 'Carnicería Del Campo', 'Supermercado', 'expense', 'vendor_contains', 'DEL CAMPO', 85),

  -- Transport
  ('Uber Trip', 'Viajes Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER *TRIP', 88),
  ('Uber General', 'Cualquier servicio Uber', 'Transporte', 'expense', 'vendor_contains', 'UBER', 70),
  ('Telepeaje', 'Peajes', 'Transporte', 'expense', 'vendor_contains', 'TELEPEAJE', 88),

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

  -- Rent (by amount)
  ('Alquiler alto', 'Pagos grandes probablemente alquiler', 'Alquiler', 'expense', 'amount_greater', '20000', 95),

  -- Income
  ('Salario', 'Ingresos por salario', 'Salario', 'income', 'amount_greater', '30000', 80);

-- 4. Verify insertion
DO $$
DECLARE
  rule_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rule_count FROM public.template_categorization_rules;
  RAISE NOTICE '✅ Created template_categorization_rules table';
  RAISE NOTICE '✅ Inserted % template rules', rule_count;
END $$;

COMMIT;
