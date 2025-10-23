-- Add installments support to transactions table
-- This allows tracking credit card installments and recurring subscriptions

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS installment_group_id UUID,
ADD COLUMN IF NOT EXISTS installment_number INTEGER,
ADD COLUMN IF NOT EXISTS installment_total INTEGER,
ADD COLUMN IF NOT EXISTS original_amount NUMERIC(15, 2);

-- Add index for faster lookups of installment groups
CREATE INDEX IF NOT EXISTS idx_transactions_installment_group
ON transactions(installment_group_id)
WHERE installment_group_id IS NOT NULL;

-- Add check constraint to ensure installment_number is valid
ALTER TABLE transactions
ADD CONSTRAINT check_installment_number
CHECK (
  (installment_number IS NULL AND installment_total IS NULL AND installment_group_id IS NULL)
  OR
  (installment_number > 0 AND installment_number <= installment_total)
);

-- Add comment for documentation
COMMENT ON COLUMN transactions.installment_group_id IS 'UUID linking related installment transactions together';
COMMENT ON COLUMN transactions.installment_number IS 'Current installment number (1, 2, 3, etc.)';
COMMENT ON COLUMN transactions.installment_total IS 'Total number of installments';
COMMENT ON COLUMN transactions.original_amount IS 'Original total amount before splitting into installments';
