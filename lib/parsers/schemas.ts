/**
 * Zod Schemas for Transaction Data Validation
 */

import { z } from 'zod';

/**
 * Schema for a single transaction
 */
export const TransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  vendor: z.string().min(1, 'Vendor is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['expense', 'income']),
  currency: z.string().length(3, 'Currency must be 3-letter code').default('UYU'),
  category: z.string().optional(),
  reference: z.string().optional(),
  isRefund: z.boolean().optional(),
});

/**
 * Schema for batch transaction import
 */
export const TransactionBatchSchema = z.object({
  version: z.string().optional(),
  metadata: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    currency: z.string().optional(),
    accountType: z.string().optional(),
    exportDate: z.string().optional(),
  }).optional(),
  transactions: z.array(TransactionSchema).min(1, 'At least one transaction is required'),
});

/**
 * Type inference from schemas
 */
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type TransactionBatchInput = z.infer<typeof TransactionBatchSchema>;
