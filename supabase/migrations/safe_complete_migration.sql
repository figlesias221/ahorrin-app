-- Safe Complete Migration - Checks before creating
-- This script is idempotent - safe to run multiple times
-- Run this in Supabase SQL Editor

-- ====================
-- 1. Add currency to transactions (if not exists)
-- ====================
DO $$
BEGIN
  -- Add column if doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.transactions
    ADD COLUMN currency TEXT NOT NULL DEFAULT 'UYU';

    RAISE NOTICE 'Added currency column to transactions';
  ELSE
    RAISE NOTICE 'Currency column already exists';
  END IF;

  -- Add constraint if doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'transactions_currency_not_empty'
  ) THEN
    ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_currency_not_empty
    CHECK (currency IS NOT NULL AND length(TRIM(BOTH FROM currency)) > 0);

    RAISE NOTICE 'Added currency constraint to transactions';
  ELSE
    RAISE NOTICE 'Currency constraint already exists';
  END IF;
END $$;

-- ====================
-- 2. Create bank_statements table (if not exists)
-- ====================
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bank_statements_user_id ON public.bank_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_upload_date ON public.bank_statements(upload_date DESC);

-- RLS
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
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

-- ====================
-- 3. Add format/bank/currency to bank_statements (if not exists)
-- ====================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bank_statements' AND column_name = 'format'
  ) THEN
    ALTER TABLE public.bank_statements ADD COLUMN format TEXT;
    RAISE NOTICE 'Added format column to bank_statements';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bank_statements' AND column_name = 'bank'
  ) THEN
    ALTER TABLE public.bank_statements ADD COLUMN bank TEXT;
    RAISE NOTICE 'Added bank column to bank_statements';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bank_statements' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.bank_statements ADD COLUMN currency TEXT DEFAULT 'UYU';
    RAISE NOTICE 'Added currency column to bank_statements';
  END IF;
END $$;

-- ====================
-- 4. Add statement_id to transactions (if not exists)
-- ====================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'statement_id'
  ) THEN
    ALTER TABLE public.transactions
    ADD COLUMN statement_id UUID REFERENCES public.bank_statements(id) ON DELETE SET NULL;

    RAISE NOTICE 'Added statement_id column to transactions';
  ELSE
    RAISE NOTICE 'Statement_id column already exists';
  END IF;
END $$;

-- Indexes for statement_id
CREATE INDEX IF NOT EXISTS idx_transactions_statement_id ON public.transactions(statement_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dedup ON public.transactions(user_id, date, vendor, amount, currency);

-- ====================
-- 5. Create categorization_rules table (if not exists)
-- ====================
CREATE TABLE IF NOT EXISTS public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,

  -- Rule type
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'vendor_contains',
    'description_contains',
    'vendor_equals',
    'amount_greater',
    'amount_less'
  )),

  -- Match value
  match_value TEXT NOT NULL,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint
  CONSTRAINT unique_user_rule UNIQUE (user_id, rule_type, match_value)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON public.categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON public.categorization_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_priority ON public.categorization_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_category_id ON public.categorization_rules(category_id);

-- RLS
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "Users can view own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can create own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can update own categorization rules" ON public.categorization_rules;
DROP POLICY IF EXISTS "Users can delete own categorization rules" ON public.categorization_rules;

CREATE POLICY "Users can view own categorization rules" ON public.categorization_rules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categorization rules" ON public.categorization_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categorization rules" ON public.categorization_rules
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categorization rules" ON public.categorization_rules
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
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

-- ====================
-- Final verification
-- ====================
DO $$
DECLARE
  tables_count INT;
  transactions_cols_count INT;
  statements_cols_count INT;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('categories', 'transactions', 'bank_statements', 'categorization_rules');

  -- Count transactions columns
  SELECT COUNT(*) INTO transactions_cols_count
  FROM information_schema.columns
  WHERE table_name = 'transactions'
    AND column_name IN ('currency', 'statement_id');

  -- Count bank_statements columns
  SELECT COUNT(*) INTO statements_cols_count
  FROM information_schema.columns
  WHERE table_name = 'bank_statements'
    AND column_name IN ('format', 'bank', 'currency');

  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE 'Tables created: % of 4', tables_count;
  RAISE NOTICE 'Transactions columns: % of 2 (currency, statement_id)', transactions_cols_count;
  RAISE NOTICE 'Bank statements columns: % of 3 (format, bank, currency)', statements_cols_count;
END $$;
