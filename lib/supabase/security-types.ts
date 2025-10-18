/**
 * Security-focused type definitions for handling sensitive data
 *
 * This module provides type-safe wrappers for encrypted data fields
 * and utilities for working with Supabase Vault encryption
 */

import type { Database } from './database.types';

/**
 * Type for encrypted account numbers
 * Use this type when working with the encrypted view
 */
export type AccountWithDecryptedNumber = {
  id: string;
  user_id: string;
  name: string;
  bank: string;
  account_number: string | null; // Decrypted value
  currency: string;
  initial_balance: number;
  created_at: string;
  updated_at: string;
};

/**
 * Type for account without sensitive data
 * Use this for public-facing displays or logs
 */
export type AccountSanitized = Omit<
  Database['public']['Tables']['accounts']['Row'],
  'account_number'
> & {
  account_number_masked?: string; // e.g., "****1234"
};

/**
 * Branded type to prevent accidental exposure of sensitive data
 * This ensures sensitive strings are explicitly marked
 */
export type SensitiveString = string & { readonly __brand: 'sensitive' };

/**
 * Helper to mark a string as sensitive
 */
export function markSensitive(value: string): SensitiveString {
  return value as SensitiveString;
}

/**
 * Helper to extract the raw value (use with caution)
 */
export function extractSensitive(value: SensitiveString): string {
  return value as string;
}

/**
 * Type guard to check if a value contains sensitive data
 */
export function isSensitiveData(
  value: unknown
): value is { account_number: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'account_number' in value &&
    typeof (value as any).account_number === 'string'
  );
}

/**
 * Utility type for fields that should never be logged
 */
export type NoLog<T> = T & { readonly __noLog: true };

/**
 * Security annotation for account number fields
 */
export type SecureAccountNumber = NoLog<SensitiveString>;

/**
 * Extended Database type that includes the encrypted views
 */
export type SecureDatabase = Database & {
  public: Database['public'] & {
    Views: {
      accounts_with_decrypted_numbers: {
        Row: AccountWithDecryptedNumber;
        Insert: Omit<AccountWithDecryptedNumber, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AccountWithDecryptedNumber, 'id'>>;
      };
    };
  };
};

/**
 * Type for transaction data without sensitive vendor information
 * Use when displaying transactions in logs or analytics
 */
export type TransactionSanitized = Omit<
  Database['public']['Tables']['transactions']['Row'],
  'vendor' | 'description'
> & {
  vendor_masked?: string; // e.g., "AMZ****"
  description_masked?: string; // e.g., "Purchase at..."
};

/**
 * Configuration for data masking
 */
export interface MaskConfig {
  /** Number of characters to show at the start */
  prefixLength?: number;
  /** Number of characters to show at the end */
  suffixLength?: number;
  /** Character to use for masking */
  maskChar?: string;
}

/**
 * Default masking configurations for different field types
 */
export const DEFAULT_MASK_CONFIGS = {
  accountNumber: { prefixLength: 0, suffixLength: 4, maskChar: '*' } as MaskConfig,
  vendor: { prefixLength: 3, suffixLength: 0, maskChar: '*' } as MaskConfig,
  description: { prefixLength: 10, suffixLength: 0, maskChar: '*' } as MaskConfig,
} as const;
