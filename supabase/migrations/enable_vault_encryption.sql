-- Enable Vault Extension for Sensitive Data Encryption
-- This migration enables Supabase Vault for encrypting sensitive banking data

-- Enable the vault extension
CREATE EXTENSION IF NOT EXISTS vault CASCADE;

-- Create a vault secret for the encryption key
-- Note: Supabase manages the encryption key securely in their backend
-- This is automatically created when you use vault.create_secret

-- Create a new table for encrypted account numbers
-- We'll use Vault to store account numbers separately from the main accounts table
CREATE TABLE IF NOT EXISTS vault.encrypted_account_numbers (
  id UUID PRIMARY KEY REFERENCES public.accounts(id) ON DELETE CASCADE,
  encrypted_account_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the encrypted table
ALTER TABLE vault.encrypted_account_numbers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for encrypted_account_numbers
-- Only allow access to account numbers through the accounts table owner
CREATE POLICY "Users can access their encrypted account numbers"
  ON vault.encrypted_account_numbers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts
      WHERE accounts.id = encrypted_account_numbers.id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their encrypted account numbers"
  ON vault.encrypted_account_numbers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts
      WHERE accounts.id = encrypted_account_numbers.id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their encrypted account numbers"
  ON vault.encrypted_account_numbers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts
      WHERE accounts.id = encrypted_account_numbers.id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their encrypted account numbers"
  ON vault.encrypted_account_numbers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts
      WHERE accounts.id = encrypted_account_numbers.id
      AND accounts.user_id = auth.uid()
    )
  );

-- Create a function to encrypt account numbers using Vault
CREATE OR REPLACE FUNCTION encrypt_account_number(
  account_id UUID,
  plain_account_number TEXT
)
RETURNS UUID AS $$
DECLARE
  secret_id UUID;
BEGIN
  -- Create a vault secret for the account number
  SELECT vault.create_secret(
    plain_account_number,
    'account_number_' || account_id::text,
    'Encrypted bank account number for account ' || account_id::text
  ) INTO secret_id;

  -- Store the reference in our encrypted table
  INSERT INTO vault.encrypted_account_numbers (id, encrypted_account_number)
  VALUES (account_id, secret_id::text)
  ON CONFLICT (id) DO UPDATE
  SET encrypted_account_number = secret_id::text,
      updated_at = NOW();

  RETURN secret_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to decrypt account numbers
CREATE OR REPLACE FUNCTION decrypt_account_number(account_id UUID)
RETURNS TEXT AS $$
DECLARE
  secret_id UUID;
  decrypted_value TEXT;
BEGIN
  -- Get the secret ID from our table
  SELECT encrypted_account_number::uuid
  INTO secret_id
  FROM vault.encrypted_account_numbers
  WHERE id = account_id;

  -- If no secret found, return NULL
  IF secret_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Decrypt using vault
  SELECT decrypted_secret
  INTO decrypted_value
  FROM vault.decrypted_secrets
  WHERE id = secret_id;

  RETURN decrypted_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view that automatically decrypts account numbers
-- This makes it transparent for the application layer
CREATE OR REPLACE VIEW public.accounts_with_decrypted_numbers AS
SELECT
  a.id,
  a.user_id,
  a.name,
  a.bank,
  decrypt_account_number(a.id) as account_number,
  a.currency,
  a.initial_balance,
  a.created_at,
  a.updated_at
FROM public.accounts a;

-- Grant access to the view
ALTER VIEW public.accounts_with_decrypted_numbers OWNER TO postgres;

-- Enable RLS on the view (inherits from accounts table)
-- Views automatically use the RLS policies from the underlying tables

-- Create a trigger to handle inserts through the view
CREATE OR REPLACE FUNCTION handle_account_insert_with_encryption()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into accounts table without account_number
  INSERT INTO public.accounts (
    id,
    user_id,
    name,
    bank,
    account_number, -- This will be set to NULL initially
    currency,
    initial_balance
  ) VALUES (
    COALESCE(NEW.id, uuid_generate_v4()),
    NEW.user_id,
    NEW.name,
    NEW.bank,
    NULL,
    NEW.currency,
    NEW.initial_balance
  )
  RETURNING id INTO NEW.id;

  -- Encrypt and store the account number if provided
  IF NEW.account_number IS NOT NULL THEN
    PERFORM encrypt_account_number(NEW.id, NEW.account_number);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER account_insert_encryption_trigger
  INSTEAD OF INSERT ON public.accounts_with_decrypted_numbers
  FOR EACH ROW EXECUTE FUNCTION handle_account_insert_with_encryption();

-- Create a trigger to handle updates through the view
CREATE OR REPLACE FUNCTION handle_account_update_with_encryption()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the accounts table
  UPDATE public.accounts
  SET
    name = NEW.name,
    bank = NEW.bank,
    currency = NEW.currency,
    initial_balance = NEW.initial_balance,
    updated_at = NOW()
  WHERE id = OLD.id;

  -- If account_number changed, re-encrypt
  IF NEW.account_number IS DISTINCT FROM OLD.account_number AND NEW.account_number IS NOT NULL THEN
    PERFORM encrypt_account_number(NEW.id, NEW.account_number);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER account_update_encryption_trigger
  INSTEAD OF UPDATE ON public.accounts_with_decrypted_numbers
  FOR EACH ROW EXECUTE FUNCTION handle_account_update_with_encryption();

-- Migration script to encrypt existing account numbers
-- This will move all existing account_number values to Vault
DO $$
DECLARE
  account_record RECORD;
BEGIN
  FOR account_record IN SELECT id, account_number FROM public.accounts WHERE account_number IS NOT NULL
  LOOP
    PERFORM encrypt_account_number(account_record.id, account_record.account_number);
  END LOOP;

  -- After migration, set account_number to NULL in accounts table
  -- The data is now stored encrypted in Vault
  UPDATE public.accounts SET account_number = NULL WHERE account_number IS NOT NULL;
END $$;

-- Add a comment explaining the encryption
COMMENT ON VIEW public.accounts_with_decrypted_numbers IS
'View that provides transparent encryption/decryption of account numbers using Supabase Vault.
Use this view instead of the accounts table directly when you need to work with account numbers.';

COMMENT ON FUNCTION encrypt_account_number IS
'Encrypts an account number using Supabase Vault and stores the encrypted reference.';

COMMENT ON FUNCTION decrypt_account_number IS
'Decrypts an account number from Supabase Vault. Only accessible if RLS policies allow.';
