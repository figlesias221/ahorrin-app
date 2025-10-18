-- Migration: Add bank field to transactions table
-- Purpose: Track the bank/source of each transaction for analytics

-- Add bank column to transactions (nullable for backwards compatibility)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS bank TEXT;

-- Add comment
COMMENT ON COLUMN transactions.bank IS 'Bank or source of the transaction (BBVA, Scotia, Itaú, etc.)';

-- Optional: Create index for faster queries by bank
CREATE INDEX IF NOT EXISTS idx_transactions_bank ON transactions(bank);
