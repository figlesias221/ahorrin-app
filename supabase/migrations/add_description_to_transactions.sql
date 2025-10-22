-- Add description column to transactions table
-- This column stores optional additional details about the transaction
-- Different from 'vendor' which is the merchant/store name

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN transactions.description IS 'Optional additional details or notes about the transaction, separate from vendor name';
