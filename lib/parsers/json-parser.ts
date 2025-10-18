/**
 * JSON Parser
 * Parses JSON transaction files with schema validation
 */

import { TransactionBatchSchema, TransactionSchema } from './schemas';
import type { ParsedTransaction, ParserResult } from './bank-statements';
import { z } from 'zod';

/**
 * Normalize vendor name
 */
function normalizeVendor(vendor: string): string {
  let normalized = vendor.trim().toUpperCase();

  normalized = normalized
    .replace(/\s+N[ºO°]?\s*\d+/gi, '')
    .replace(/\s+#\s*\d+/g, '')
    .replace(/\s+SUC(?:URSAL)?\s*\d+/gi, '')
    .replace(/\s+LOCAL\s*\d+/gi, '')
    .replace(/\s+TIENDA\s*\d+/gi, '')
    .replace(/\s+SHOPPING\s+.*/gi, '')
    .replace(/\s+\d+\s*$/g, '');

  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Parse JSON file
 * Supports both single transaction and batch format
 */
export async function parseJSON(file: File): Promise<ParserResult> {
  try {
    const text = await file.text();
    const jsonData = JSON.parse(text);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];
    let metadata;

    // Detect format: single transaction, array, or batch
    if (Array.isArray(jsonData)) {
      // Array of transactions
      jsonData.forEach((item, idx) => {
        try {
          const validated = TransactionSchema.parse(item);
          transactions.push({
            ...validated,
            vendor: normalizeVendor(validated.vendor),
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push(`Transacción ${idx + 1}: ${error.issues.map(e => e.message).join(', ')}`);
          } else {
            errors.push(`Transacción ${idx + 1}: ${error}`);
          }
        }
      });
    } else if (jsonData.transactions && Array.isArray(jsonData.transactions)) {
      // Batch format with metadata
      try {
        const validated = TransactionBatchSchema.parse(jsonData);
        metadata = validated.metadata;

        validated.transactions.forEach((tx, idx) => {
          try {
            transactions.push({
              ...tx,
              vendor: normalizeVendor(tx.vendor),
            });
          } catch (error) {
            errors.push(`Transacción ${idx + 1}: ${error}`);
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            transactions: [],
            errors: error.issues.map(e => `${e.path.join('.')}: ${e.message}`),
          };
        }
        return {
          success: false,
          transactions: [],
          errors: [`Error de validación: ${error}`],
        };
      }
    } else {
      // Single transaction
      try {
        const validated = TransactionSchema.parse(jsonData);
        transactions.push({
          ...validated,
          vendor: normalizeVendor(validated.vendor),
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            transactions: [],
            errors: error.issues.map(e => `${e.path.join('.')}: ${e.message}`),
          };
        }
        return {
          success: false,
          transactions: [],
          errors: [`Error de validación: ${error}`],
        };
      }
    }

    if (transactions.length === 0 && errors.length > 0) {
      return {
        success: false,
        transactions: [],
        errors,
      };
    }

    return {
      success: true,
      transactions,
      errors,
      metadata,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        transactions: [],
        errors: ['Archivo JSON inválido: ' + error.message],
      };
    }
    return {
      success: false,
      transactions: [],
      errors: [`Error al leer archivo JSON: ${error}`],
    };
  }
}

/**
 * Export transactions to JSON format
 */
export function exportToJSON(
  transactions: ParsedTransaction[],
  metadata?: {
    accountName?: string;
    accountNumber?: string;
    currency?: string;
    accountType?: string;
  }
): string {
  const batch = {
    version: '1.0',
    metadata: {
      ...metadata,
      exportDate: new Date().toISOString(),
    },
    transactions,
  };

  return JSON.stringify(batch, null, 2);
}
