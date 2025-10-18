-- Migration: Allow null category_id in transactions table
-- This allows transactions to be imported without a category assigned
-- Users can categorize them manually later

-- Remove NOT NULL constraint from category_id column
ALTER TABLE transactions
ALTER COLUMN category_id DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON COLUMN transactions.category_id IS
'Category ID - can be null for uncategorized transactions';

-- Optional: Create an index for faster queries on uncategorized transactions
CREATE INDEX IF NOT EXISTS idx_transactions_null_category
ON transactions(user_id)
WHERE category_id IS NULL;
