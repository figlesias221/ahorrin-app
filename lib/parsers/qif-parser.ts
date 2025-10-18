/**
 * QIF Parser
 * Parses Quicken Interchange Format
 */

import type { ParsedTransaction, ParserResult } from './bank-statements';

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
 * Parse QIF date format to YYYY-MM-DD
 * QIF dates can be: MM/DD/YYYY, DD/MM/YYYY, M/D/YY, etc.
 */
function parseQIFDate(dateStr: string): string {
  if (!dateStr) return '';

  const cleaned = dateStr.trim();

  // Try MM/DD/YYYY or DD/MM/YYYY
  const match = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (match) {
    let [, part1, part2, year] = match;

    // Convert 2-digit year to 4-digit
    if (year.length === 2) {
      const yearNum = parseInt(year);
      // Assume years 00-50 are 2000-2050, 51-99 are 1951-1999
      year = yearNum <= 50 ? `20${year}` : `19${year}`;
    }

    // Determine if DD/MM or MM/DD
    // If first part > 12, it must be day
    if (parseInt(part1) > 12) {
      // DD/MM/YYYY
      return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
    } else if (parseInt(part2) > 12) {
      // MM/DD/YYYY
      return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
    } else {
      // Ambiguous - assume DD/MM/YYYY for Latin America
      return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
    }
  }

  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Parse QIF file
 */
export async function parseQIF(file: File): Promise<ParserResult> {
  try {
    // Dynamic import to avoid bundling qif2json in server
    const qif2json = (await import('qif2json')).default;

    const text = await file.text();

    return new Promise((resolve) => {
      qif2json.parse(text, (error: Error | null, qifData: Record<string, unknown>) => {
        if (error) {
          resolve({
            success: false,
            transactions: [],
            errors: [`Error al parsear QIF: ${error.message}`],
          });
          return;
        }

        try {
          const transactions: ParsedTransaction[] = [];
          const errors: string[] = [];

          // QIF can contain multiple transaction types
          const txTypes = ['transactions', 'investments', 'bank', 'cash', 'creditCard'];
          const currency = 'UYU';
          let accountName: string | undefined;

          // Process each transaction type
          txTypes.forEach(txType => {
            const txList = qifData[txType] as unknown;
            if (!txList || !Array.isArray(txList)) return;

            txList.forEach((tx: Record<string, unknown>, idx: number) => {
              try {
                // QIF fields:
                // D = Date
                // T = Amount
                // P = Payee
                // M = Memo
                // C = Cleared status
                // N = Number (check number)
                // L = Category

                const date = parseQIFDate(tx.date);
                const rawAmount = parseFloat(tx.amount?.toString().replace(/,/g, '') || '0');
                const amount = Math.abs(rawAmount);
                const vendor = tx.payee || tx.memo || 'Desconocido';

                if (!date || !amount || amount === 0) {
                  return; // Skip invalid transactions
                }

                // Determine type based on amount sign
                // In QIF: negative = payment/expense, positive = deposit/income
                const type: 'expense' | 'income' = rawAmount < 0 ? 'expense' : 'income';

                transactions.push({
                  date,
                  vendor: normalizeVendor(vendor),
                  amount,
                  type,
                  currency,
                  category: tx.category || undefined,
                  reference: tx.number || tx.memo || undefined,
                });
              } catch (error) {
                errors.push(`Error en transacción ${idx + 1}: ${error}`);
              }
            });
          });

          // Extract account name if available
          if (qifData.account) {
            accountName = qifData.account.name;
          }

          if (transactions.length === 0) {
            resolve({
              success: false,
              transactions: [],
              errors: ['No se encontraron transacciones en el archivo QIF'],
            });
            return;
          }

          resolve({
            success: true,
            transactions,
            errors,
            metadata: {
              accountName,
              currency,
            },
          });
        } catch (error) {
          resolve({
            success: false,
            transactions: [],
            errors: [`Error al procesar datos QIF: ${error}`],
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al leer archivo QIF: ${error}`],
    };
  }
}
