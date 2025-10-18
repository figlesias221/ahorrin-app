-- Add format, bank, and currency fields to bank_statements table
-- Run this migration in your Supabase SQL Editor

ALTER TABLE public.bank_statements
ADD COLUMN IF NOT EXISTS format TEXT,
ADD COLUMN IF NOT EXISTS bank TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'UYU';

-- Add indexes for performance if needed
CREATE INDEX IF NOT EXISTS idx_bank_statements_bank ON public.bank_statements(bank);
CREATE INDEX IF NOT EXISTS idx_bank_statements_currency ON public.bank_statements(currency);

-- Add comments
COMMENT ON COLUMN public.bank_statements.format IS 'File format of the bank statement (e.g., PDF, Excel, CSV)';
COMMENT ON COLUMN public.bank_statements.bank IS 'Name of the bank that issued the statement';
COMMENT ON COLUMN public.bank_statements.currency IS 'Currency of the statement (e.g., UYU, USD, ARS)';
