/**
 * Auto-fix utilities for common data issues
 */

/**
 * Auto-fix date formats
 */
export function autoFixDate(dateStr: string): { fixed: string; changed: boolean } {
  const cleaned = dateStr.trim();

  // Already in ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return { fixed: cleaned, changed: false };
  }

  // DD/MM/YYYY or DD-MM-YYYY (4-digit year)
  const match1 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match1) {
    const [, day, month, year] = match1;
    const fixed = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return { fixed, changed: true };
  }

  // DD/MM/YY or DD-MM-YY (2-digit year)
  const match2 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
  if (match2) {
    const [, day, month, yearShort] = match2;
    const year = parseInt(yearShort);
    const fullYear = year <= 50 ? 2000 + year : 1900 + year;
    const fixed = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return { fixed, changed: true };
  }

  // Excel serial date (5 digit number like 45292 for 2023-12-01)
  if (/^\d{5}$/.test(cleaned)) {
    const serial = parseInt(cleaned);
    const excelEpoch = new Date(1899, 11, 30); // Excel's base date
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const fixed = date.toISOString().split('T')[0];
    return { fixed, changed: true };
  }

  // MM/DD/YYYY (US format)
  const match3 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match3) {
    const [, month, day, year] = match3;
    // Check if it looks like US format (month > 12 would indicate DD/MM)
    if (parseInt(month) <= 12 && parseInt(day) <= 31) {
      const fixed = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return { fixed, changed: true };
    }
  }

  return { fixed: cleaned, changed: false };
}

/**
 * Auto-fix amount formats
 */
export function autoFixAmount(amountStr: string): { fixed: number; changed: boolean; original: string } {
  if (!amountStr || amountStr.trim() === '') {
    return { fixed: 0, changed: false, original: amountStr };
  }

  const original = amountStr;
  let cleaned = amountStr.toString().trim();

  // Remove currency symbols and whitespace
  const currencyPattern = /[$\sUYUUSDEUR€£ARS]/gi;
  cleaned = cleaned.replace(currencyPattern, '');

  // Handle negative amounts (preserve sign)
  const isNegative = cleaned.startsWith('-') || cleaned.startsWith('(') || cleaned.endsWith(')');
  cleaned = cleaned.replace(/[()-]/g, '');

  // Handle different decimal separators
  let decimal = 0;

  // European format: 1.234,56 (dot as thousands, comma as decimal)
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    decimal = parseFloat(cleaned);
  }
  // US format: 1,234.56 (comma as thousands, dot as decimal)
  else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})$/.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, '');
    decimal = parseFloat(cleaned);
  }
  // Simple comma as decimal: 123,45
  else if (/^\d+,\d+$/.test(cleaned)) {
    cleaned = cleaned.replace(',', '.');
    decimal = parseFloat(cleaned);
  }
  // Already in standard format
  else {
    decimal = parseFloat(cleaned);
  }

  if (isNaN(decimal)) {
    return { fixed: 0, changed: false, original };
  }

  const result = isNegative ? -decimal : decimal;
  const changed = original !== result.toString();

  return { fixed: result, changed, original };
}

/**
 * Auto-detect and fix transaction type
 */
export function autoFixType(
  typeStr: string | undefined,
  amount: number
): { fixed: 'income' | 'expense'; changed: boolean } {
  // If type is explicitly provided
  if (typeStr) {
    const lower = typeStr.toLowerCase().trim();
    if (lower.includes('ingreso') || lower.includes('income') || lower.includes('credit') || lower.includes('credito') || lower === 'c' || lower === 'h') {
      return { fixed: 'income', changed: false };
    }
    if (lower.includes('egreso') || lower.includes('expense') || lower.includes('debit') || lower.includes('debito') || lower === 'd') {
      return { fixed: 'expense', changed: false };
    }
  }

  // Infer from amount sign
  const inferred: 'income' | 'expense' = amount >= 0 ? 'income' : 'expense';
  return { fixed: inferred, changed: !typeStr };
}

/**
 * Auto-fix vendor name (normalize)
 */
export function autoFixVendor(vendorStr: string): { fixed: string; changed: boolean } {
  if (!vendorStr || vendorStr.trim() === '') {
    return { fixed: 'Desconocido', changed: true };
  }

  let fixed = vendorStr.trim();

  // Convert to uppercase for consistency
  fixed = fixed.toUpperCase();

  // Remove branch/location patterns
  const original = fixed;
  fixed = fixed
    .replace(/\s+N[ºO°]?\s*\d+/gi, '')           // Nº 1, No 1, N° 1
    .replace(/\s+#\s*\d+/g, '')                   // #1, # 1
    .replace(/\s+SUC(?:URSAL)?\s*\d+/gi, '')     // SUC 1, SUCURSAL 1
    .replace(/\s+LOCAL\s*\d+/gi, '')              // LOCAL 1
    .replace(/\s+TIENDA\s*\d+/gi, '')             // TIENDA 1
    .replace(/\s+SHOPPING\s+.*/gi, '')            // SHOPPING NOMBRE
    .replace(/\s+\d+\s*$/g, '');                  // Trailing numbers

  // Remove extra whitespace
  fixed = fixed.replace(/\s+/g, ' ').trim();

  return { fixed, changed: fixed !== original };
}

/**
 * Auto-fix currency code
 */
export function autoFixCurrency(currencyStr: string | undefined): { fixed: string; changed: boolean } {
  if (!currencyStr) {
    return { fixed: 'UYU', changed: true };
  }

  const upper = currencyStr.toUpperCase().trim();

  // Map common variations
  const currencyMap: Record<string, string> = {
    'PESOS': 'UYU',
    'PESO': 'UYU',
    'DOLARES': 'USD',
    'DOLAR': 'USD',
    'DÓLARES': 'USD',
    'DÓLAR': 'USD',
    'U$S': 'USD',
    'US$': 'USD',
    '$U': 'UYU',
    'DOLLAR': 'USD',
    'DOLLARS': 'USD',
    'EURO': 'EUR',
    'EUROS': 'EUR',
  };

  const mapped = currencyMap[upper];
  if (mapped) {
    return { fixed: mapped, changed: mapped !== upper };
  }

  // Validate standard ISO codes
  const validCodes = ['UYU', 'USD', 'EUR', 'ARS', 'BRL', 'GBP', 'JPY', 'CNY'];
  if (validCodes.includes(upper)) {
    return { fixed: upper, changed: false };
  }

  // Default to UYU if invalid
  return { fixed: 'UYU', changed: true };
}

/**
 * Auto-fix all fields in a row
 */
export interface AutoFixResult {
  fixed: string[];
  changes: {
    [columnIndex: number]: {
      original: string;
      fixed: string;
      reason: string;
    };
  };
  hasChanges: boolean;
}

export function autoFixRow(
  row: string[],
  columnMapping: { [index: number]: string }
): AutoFixResult {
  const fixed: string[] = [...row];
  const changes: AutoFixResult['changes'] = {};
  let hasChanges = false;

  Object.entries(columnMapping).forEach(([colIdx, colType]) => {
    const index = parseInt(colIdx);
    const value = row[index];

    switch (colType) {
      case 'date': {
        const result = autoFixDate(value);
        if (result.changed) {
          fixed[index] = result.fixed;
          changes[index] = {
            original: value,
            fixed: result.fixed,
            reason: 'Fecha normalizada a formato ISO',
          };
          hasChanges = true;
        }
        break;
      }

      case 'amount':
      case 'amount_usd':
      case 'amount_uyu': {
        const result = autoFixAmount(value);
        if (result.changed) {
          fixed[index] = Math.abs(result.fixed).toString();
          changes[index] = {
            original: value,
            fixed: fixed[index],
            reason: 'Monto normalizado',
          };
          hasChanges = true;
        }
        break;
      }

      case 'vendor': {
        const result = autoFixVendor(value);
        if (result.changed) {
          fixed[index] = result.fixed;
          changes[index] = {
            original: value,
            fixed: result.fixed,
            reason: 'Vendor normalizado',
          };
          hasChanges = true;
        }
        break;
      }

      case 'currency': {
        const result = autoFixCurrency(value);
        if (result.changed) {
          fixed[index] = result.fixed;
          changes[index] = {
            original: value,
            fixed: result.fixed,
            reason: 'Código de moneda estandarizado',
          };
          hasChanges = true;
        }
        break;
      }
    }
  });

  return { fixed, changes, hasChanges };
}
