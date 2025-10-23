-- Ahorrin Database Migration - From Complex to Simple Schema
-- This script migrates existing data to the simplified 2-table schema
-- Run this ONLY if you have existing data you want to preserve

-- ========================================
-- STEP 1: Backup existing data
-- ========================================

-- Create temporary backup tables
CREATE TEMP TABLE temp_categories AS
SELECT * FROM public.categories WHERE EXISTS (SELECT 1 FROM public.categories);

CREATE TEMP TABLE temp_transactions AS
SELECT * FROM public.transactions WHERE EXISTS (SELECT 1 FROM public.transactions);

-- ========================================
-- STEP 2: Drop old schema
-- ========================================
DROP VIEW IF EXISTS public.monthly_category_summary CASCADE;
DROP FUNCTION IF EXISTS public.get_category_summary(DATE, DATE) CASCADE;
DROP TABLE IF EXISTS public.bank_statements CASCADE;
DROP TABLE IF EXISTS public.categorization_rules CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop old functions (this will cascade and drop triggers automatically)
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop trigger on auth.users safely
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
END $$;

-- ========================================
-- STEP 3: Create new simplified schema
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE 1: Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

-- TABLE 2: Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL NOT NULL,
  date DATE NOT NULL,
  vendor TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  notes TEXT,
  is_ignored BOOLEAN DEFAULT false,
  is_manually_verified BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_category ON public.transactions(user_id, category_id);
CREATE INDEX idx_transactions_ignored ON public.transactions(user_id, is_ignored);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions RLS
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_transactions
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- View
CREATE OR REPLACE VIEW public.monthly_category_summary AS
SELECT
  t.user_id,
  c.id as category_id,
  c.name as category_name,
  c.color as category_color,
  c.type as category_type,
  DATE_TRUNC('month', t.date) as month,
  EXTRACT(YEAR FROM t.date) as year,
  EXTRACT(MONTH FROM t.date) as month_number,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE -t.amount END) as net_amount,
  COUNT(*) as transaction_count
FROM public.transactions t
INNER JOIN public.categories c ON t.category_id = c.id
WHERE t.is_ignored = false
GROUP BY t.user_id, c.id, c.name, c.color, c.type, DATE_TRUNC('month', t.date), EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)
ORDER BY month DESC, net_amount DESC;

ALTER VIEW public.monthly_category_summary SET (security_invoker = on);
GRANT SELECT ON public.monthly_category_summary TO authenticated;

-- Function
CREATE OR REPLACE FUNCTION public.get_category_summary(
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_color TEXT,
  category_type TEXT,
  total_expenses DECIMAL,
  total_income DECIMAL,
  net_amount DECIMAL,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.color,
    c.type,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)::DECIMAL as total_expenses,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)::DECIMAL as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE -t.amount END)::DECIMAL as net_amount,
    COUNT(*)::BIGINT as transaction_count
  FROM public.transactions t
  INNER JOIN public.categories c ON t.category_id = c.id
  WHERE t.user_id = auth.uid()
    AND t.is_ignored = false
    AND (start_date IS NULL OR t.date >= start_date)
    AND (end_date IS NULL OR t.date <= end_date)
  GROUP BY c.id, c.name, c.color, c.type
  ORDER BY net_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 4: Restore data from backup
-- ========================================

-- Restore categories (if they exist)
INSERT INTO public.categories (id, user_id, name, color, type, is_active, created_at, updated_at)
SELECT
  id,
  user_id,
  name,
  color,
  type,
  is_active,
  created_at,
  updated_at
FROM temp_categories
ON CONFLICT (user_id, name, type) DO UPDATE
SET
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

-- Restore transactions (if they exist)
-- Note: is_ignored will default to false for old transactions
INSERT INTO public.transactions (
  id,
  user_id,
  category_id,
  date,
  vendor,
  amount,
  type,
  notes,
  is_ignored,
  is_manually_verified,
  confidence_score,
  created_at,
  updated_at
)
SELECT
  id,
  user_id,
  category_id,
  date,
  vendor,
  amount,
  type,
  notes,
  false, -- Default all old transactions to not ignored
  COALESCE(is_manually_verified, false),
  COALESCE(confidence_score, 1.0),
  created_at,
  updated_at
FROM temp_transactions
ON CONFLICT (id) DO NOTHING;

-- Drop temp tables
DROP TABLE IF EXISTS temp_categories;
DROP TABLE IF EXISTS temp_transactions;

-- ========================================
-- STEP 5: Verify migration
-- ========================================

DO $$
DECLARE
  cat_count INTEGER;
  tx_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO cat_count FROM public.categories;
  SELECT COUNT(*) INTO tx_count FROM public.transactions;

  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE '   - Categories: %', cat_count;
  RAISE NOTICE '   - Transactions: %', tx_count;
END $$;
