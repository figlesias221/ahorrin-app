/**
 * Enhanced CSV Parser using PapaParse
 * Replaces manual CSV parsing with robust library
 */

import type { ParsedTransaction, ParserResult } from './bank-statements';

/**
 * Normalize vendor name for consistent matching
 */
function normalizeVendor(vendor: string): string {
  let normalized = vendor.trim().toUpperCase();

  // Remove branch/location patterns
  normalized = normalized
    .replace(/\s+N[ºO°]?\s*\d+/gi, '')
    .replace(/\s+#\s*\d+/g, '')
    .replace(/\s+SUC(?:URSAL)?\s*\d+/gi, '')
    .replace(/\s+LOCAL\s*\d+/gi, '')
    .replace(/\s+TIENDA\s*\d+/gi, '')
    .replace(/\s+SHOPPING\s+.*/gi, '')
    .replace(/\s+\d+\s*$/g, '');

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Detect column mapping from headers
 */
function detectColumnMapping(headers: string[]): {
  dateCol: number;
  vendorCol: number;
  amountCol: number;
  typeCol: number;
  categoryCol?: number;
  currencyCol?: number;
  referenceCol?: number;
} | null {
  const lower = headers.map(h => h.toLowerCase());

  // Find date column
  const dateCol = lower.findIndex(h =>
    h.includes('fecha') || h.includes('date') || h.includes('data')
  );

  // Find vendor/description column
  const vendorCol = lower.findIndex(h =>
    h.includes('vendor') || h.includes('comercio') || h.includes('descripcion') ||
    h.includes('description') || h.includes('concepto') || h.includes('detalle')
  );

  // Find amount column
  const amountCol = lower.findIndex(h =>
    h.includes('amount') || h.includes('monto') || h.includes('importe') ||
    h.includes('valor') || h.includes('total')
  );

  // Find type column (optional)
  const typeCol = lower.findIndex(h =>
    h.includes('type') || h.includes('tipo') || h.includes('credit') ||
    h.includes('debit') || h.includes('ingreso') || h.includes('egreso')
  );

  // Find category column (optional)
  const categoryCol = lower.findIndex(h =>
    h.includes('category') || h.includes('categoria') || h.includes('categoría')
  );

  // Find currency column (optional)
  const currencyCol = lower.findIndex(h =>
    h.includes('currency') || h.includes('moneda')
  );

  // Find reference column (optional)
  const referenceCol = lower.findIndex(h =>
    h.includes('reference') || h.includes('referencia') || h.includes('nota') ||
    h.includes('note')
  );

  // Validate required columns
  if (dateCol === -1 || vendorCol === -1 || amountCol === -1) {
    return null;
  }

  return {
    dateCol,
    vendorCol,
    amountCol,
    typeCol: typeCol !== -1 ? typeCol : -1,
    categoryCol: categoryCol !== -1 ? categoryCol : undefined,
    currencyCol: currencyCol !== -1 ? currencyCol : undefined,
    referenceCol: referenceCol !== -1 ? referenceCol : undefined,
  };
}

/**
 * Parse date from various formats to YYYY-MM-DD
 */
function parseDate(dateStr: string): string {
  const cleaned = dateStr.trim();

  // ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // DD/MM/YYYY or DD-MM-YYYY (4-digit year)
  const match1 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match1) {
    const [, day, month, year] = match1;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // DD/MM/YY or DD-MM-YY (2-digit year)
  const match2 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
  if (match2) {
    const [, day, month, yearShort] = match2;
    const year = parseInt(yearShort);
    // Assume years 00-50 are 2000-2050, 51-99 are 1951-1999
    const fullYear = year <= 50 ? 2000 + year : 1900 + year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // DD/MM (no year - assume current year)
  const match3 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (match3) {
    const [, day, month] = match3;
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Return as-is if can't parse
  return cleaned;
}

/**
 * Parse amount from string
 */
function parseAmount(amountStr: string): number {
  if (!amountStr || amountStr.trim() === '') return 0;

  // Remove currency symbols and whitespace
  let cleaned = amountStr.toString().replace(/[$\sUYUUSD€£]/gi, '').trim();

  // Handle negative amounts
  const isNegative = cleaned.startsWith('-') || cleaned.startsWith('(');
  cleaned = cleaned.replace(/[()-]/g, '');

  // Handle different decimal separators
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Determine which is decimal separator
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // Comma is decimal: 1.234,56
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Dot is decimal: 1,234.56
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Only comma - assume decimal
    cleaned = cleaned.replace(',', '.');
  }

  const result = parseFloat(cleaned);
  return isNegative ? -result : result;
}

/**
 * Parse CSV file using PapaParse
 */
export async function parseCSVEnhanced(file: File): Promise<ParserResult> {
  try {
    // Dynamic import to avoid bundling papaparse in server
    const Papa = await import('papaparse');

    const text = await file.text();

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        delimiter: '', // Auto-detect
        complete: (results) => {
          try {
            const rows = results.data as string[][];

            if (rows.length === 0) {
              resolve({
                success: false,
                transactions: [],
                errors: ['El archivo CSV está vacío'],
              });
              return;
            }

            // Detect if first row is header
            const firstRow = rows[0];
            const hasHeader = firstRow.some((cell: string) =>
              cell && /fecha|date|vendor|amount|monto/i.test(cell)
            );

            let mapping;
            let dataRows;

            if (hasHeader) {
              mapping = detectColumnMapping(firstRow);
              dataRows = rows.slice(1);
            } else {
              // Assume standard order: Date, Vendor, Amount, Type, Category
              mapping = {
                dateCol: 0,
                vendorCol: 1,
                amountCol: 2,
                typeCol: 3,
                categoryCol: 4,
              };
              dataRows = rows;
            }

            if (!mapping) {
              resolve({
                success: false,
                transactions: [],
                errors: ['No se pudieron detectar las columnas requeridas (fecha, vendor, monto)'],
              });
              return;
            }

            const transactions: ParsedTransaction[] = [];
            const errors: string[] = [];

            dataRows.forEach((row: string[], idx: number) => {
              try {
                // Skip rows that don't have enough columns
                if (!row || row.length < 3) return;

                const dateStr = row[mapping.dateCol]?.toString() || '';
                const vendor = row[mapping.vendorCol]?.toString() || 'Desconocido';
                const amountStr = row[mapping.amountCol]?.toString() || '0';

                const date = parseDate(dateStr);
                const amount = Math.abs(parseAmount(amountStr));

                if (!date || !amount || amount === 0) {
                  return; // Skip invalid rows
                }

                // Determine type
                let type: 'expense' | 'income' = 'expense';

                if (mapping.typeCol >= 0 && row[mapping.typeCol]) {
                  const typeStr = row[mapping.typeCol].toString().toLowerCase();
                  type = (typeStr.includes('ingreso') ||
                         typeStr.includes('income') ||
                         typeStr.includes('credit') ||
                         typeStr.includes('credito'))
                         ? 'income' : 'expense';
                } else if (parseAmount(amountStr) < 0) {
                  // Negative amount = expense (or income if already negative in data)
                  type = 'expense';
                }

                // Get currency
                let currency = 'UYU';
                if (mapping.currencyCol !== undefined && row[mapping.currencyCol]) {
                  const currStr = row[mapping.currencyCol].toString().toUpperCase();
                  if (['USD', 'EUR', 'ARS', 'BRL'].includes(currStr)) {
                    currency = currStr;
                  }
                }

                transactions.push({
                  date,
                  vendor: normalizeVendor(vendor),
                  amount,
                  type,
                  currency,
                  category: mapping.categoryCol !== undefined ? row[mapping.categoryCol] : undefined,
                  reference: mapping.referenceCol !== undefined ? row[mapping.referenceCol] : undefined,
                });
              } catch (error) {
                errors.push(`Error en fila ${idx + 1}: ${error}`);
              }
            });

            resolve({
              success: true,
              transactions,
              errors,
            });
          } catch (error) {
            resolve({
              success: false,
              transactions: [],
              errors: [`Error al procesar datos CSV: ${error}`],
            });
          }
        },
        error: (error) => {
          resolve({
            success: false,
            transactions: [],
            errors: [`Error al parsear CSV: ${error.message}`],
          });
        },
      });
    });
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al leer archivo CSV: ${error}`],
    };
  }
}
