-- Add statement_id to transactions table for traceability
-- Links each transaction to its source bank statement
-- Run this in your Supabase SQL Editor

-- Add statement_id column (nullable for backward compatibility)
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS statement_id UUID REFERENCES public.bank_statements(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_transactions_statement_id ON public.transactions(statement_id);

-- Add composite index for deduplication queries
CREATE INDEX IF NOT EXISTS idx_transactions_dedup ON public.transactions(user_id, date, vendor, amount, currency);

-- Add comment
COMMENT ON COLUMN public.transactions.statement_id IS 'Reference to the bank statement that sourced this transaction';
