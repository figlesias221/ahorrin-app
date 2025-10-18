-- Add currency column to transactions table
-- Run this in your Supabase SQL Editor

-- Drop constraint if it exists
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_currency_check;

-- Add or update currency column
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'UYU';

-- Update existing rows to have default currency
UPDATE public.transactions
SET currency = 'UYU'
WHERE currency IS NULL OR currency = '';

-- Add index for currency queries
CREATE INDEX IF NOT EXISTS idx_transactions_currency ON public.transactions(currency);

-- Add flexible check constraint (not empty)
ALTER TABLE public.transactions
ADD CONSTRAINT transactions_currency_not_empty
CHECK (currency IS NOT NULL AND length(trim(currency)) > 0);

COMMENT ON COLUMN public.transactions.currency IS 'Transaction currency code (UYU, USD, EUR, etc.)';
