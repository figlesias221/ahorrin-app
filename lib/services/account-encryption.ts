/**
 * Account Encryption Service
 *
 * High-level service for encrypting/decrypting account data
 * Handles the bridge between Supabase and the encryption utilities
 */

import { encrypt, decrypt, encryptAccountNumber, decryptAccountNumber, hash } from '../utils/encryption';
import type { Database } from '../supabase/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Account with decrypted account number
 */
export interface DecryptedAccount extends Omit<Account, 'account_number_encrypted' | 'account_number_hash'> {
  account_number: string | null;
}

/**
 * Prepare account data for insertion with encryption
 *
 * @example
 * const preparedData = prepareAccountForInsert({
 *   user_id: userId,
 *   name: "Checking Account",
 *   bank: "Itaú",
 *   account_number: "1234567890",
 *   currency: "UYU"
 * })
 *
 * const { data } = await supabase
 *   .from('accounts')
 *   .insert(preparedData)
 */
export function prepareAccountForInsert(
  account: AccountInsert & { account_number?: string | null }
): AccountInsert {
  const { account_number, ...rest } = account;

  // If no account number, return as-is
  if (!account_number) {
    return rest;
  }

  // Encrypt account number
  const encrypted = encryptAccountNumber(account_number);

  return {
    ...rest,
    account_number: null, // Clear plaintext
    account_number_encrypted: encrypted.encrypted,
    account_number_hash: encrypted.hash,
    account_number_last4: encrypted.last4,
  };
}

/**
 * Prepare account data for update with encryption
 *
 * @example
 * const preparedData = prepareAccountForUpdate({
 *   name: "Updated Name",
 *   account_number: "9876543210" // Will be encrypted
 * })
 *
 * const { data } = await supabase
 *   .from('accounts')
 *   .update(preparedData)
 *   .eq('id', accountId)
 */
export function prepareAccountForUpdate(
  account: AccountUpdate & { account_number?: string | null }
): AccountUpdate {
  const { account_number, ...rest } = account;

  // If account_number not being updated, return as-is
  if (account_number === undefined) {
    return rest;
  }

  // If setting to null, clear all encrypted fields
  if (account_number === null) {
    return {
      ...rest,
      account_number: null,
      account_number_encrypted: null,
      account_number_hash: null,
      account_number_last4: null,
    };
  }

  // Encrypt the new account number
  const encrypted = encryptAccountNumber(account_number);

  return {
    ...rest,
    account_number: null,
    account_number_encrypted: encrypted.encrypted,
    account_number_hash: encrypted.hash,
    account_number_last4: encrypted.last4,
  };
}

/**
 * Decrypt account data for display/use
 *
 * @example
 * const { data: accounts } = await supabase
 *   .from('accounts')
 *   .select('*')
 *
 * const decrypted = accounts.map(decryptAccount)
 * console.log(decrypted[0].account_number) // Decrypted value
 */
export function decryptAccount(account: Account): DecryptedAccount {
  const {
    account_number_encrypted,
    account_number_hash,
    ...rest
  } = account;

  let account_number: string | null = null;

  // Try to decrypt if encrypted data exists
  if (account_number_encrypted) {
    try {
      account_number = decryptAccountNumber(account_number_encrypted);
    } catch (error) {
      console.error('Failed to decrypt account number:', error);
      // Fall back to last4 for display if decryption fails
      account_number = null;
    }
  }

  return {
    ...rest,
    account_number,
  };
}

/**
 * Decrypt multiple accounts
 */
export function decryptAccounts(accounts: Account[]): DecryptedAccount[] {
  return accounts.map(decryptAccount);
}

/**
 * Find account by exact account number match
 * Uses hash to search without decrypting all records
 *
 * @param accountNumber - The account number to search for
 * @returns Hash value to use in database query
 *
 * @example
 * const searchHash = getAccountNumberHash("1234567890")
 * const { data } = await supabase
 *   .from('accounts')
 *   .select('*')
 *   .eq('account_number_hash', searchHash)
 *   .single()
 */
export function getAccountNumberHash(accountNumber: string): string {
  return hash(accountNumber);
}

/**
 * Safely get last 4 digits for display
 * Uses the stored last4 field when available
 */
export function getAccountNumberLast4(account: Account): string {
  return account.account_number_last4 || '****';
}

/**
 * Check if an account has encrypted data
 */
export function hasEncryptedAccountNumber(account: Account): boolean {
  return !!account.account_number_encrypted;
}

/**
 * Validate that an account number can be decrypted
 */
export function validateAccountEncryption(account: Account): boolean {
  if (!account.account_number_encrypted) {
    return true; // No encryption, nothing to validate
  }

  try {
    const decrypted = decryptAccountNumber(account.account_number_encrypted);
    return !!decrypted;
  } catch (error) {
    return false;
  }
}
