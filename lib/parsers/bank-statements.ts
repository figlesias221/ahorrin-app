/**
 * Normalize vendor name for consistent matching
 * - Removes branch/location numbers (Nº 1, N° 9, #1, SUC 1, etc.)
 * - Removes common suffixes (SUCURSAL, LOCAL, TIENDA)
 * - Trims and normalizes whitespace
 */
function normalizeVendor(vendor: string): string {
  let normalized = vendor.trim().toUpperCase();

  // Remove branch/location patterns
  // Patterns: Nº 1, N° 9, No 1, # 1, SUC 1, SUCURSAL 1, LOCAL 1, etc.
  normalized = normalized
    .replace(/\s+N[ºO°]?\s*\d+/gi, '')           // Nº 1, No 1, N° 1
    .replace(/\s+#\s*\d+/g, '')                   // #1, # 1
    .replace(/\s+SUC(?:URSAL)?\s*\d+/gi, '')     // SUC 1, SUCURSAL 1
    .replace(/\s+LOCAL\s*\d+/gi, '')              // LOCAL 1
    .replace(/\s+TIENDA\s*\d+/gi, '')             // TIENDA 1
    .replace(/\s+SHOPPING\s+.*/gi, '')            // SHOPPING NOMBRE
    .replace(/\s+\d+\s*$/g, '');                  // Trailing numbers

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

export interface ParsedTransaction {
  date: string;
  vendor: string;
  amount: number;
  type: 'expense' | 'income';
  currency: string;
  category?: string;
  reference?: string;
  isRefund?: boolean; // Marca si es una devolución
}

export interface ParserResult {
  success: boolean;
  transactions: ParsedTransaction[];
  errors: string[];
  metadata?: {
    accountName?: string;
    accountNumber?: string;
    currency?: string;
    accountType?: string;
  };
}

/**
 * Parse CSV file with flexible format detection
 */
export async function parseCSV(file: File): Promise<ParserResult> {
  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return {
        success: false,
        transactions: [],
        errors: ['El archivo está vacío'],
      };
    }

    // Detect header
    const hasHeader = lines[0].toLowerCase().includes('fecha') ||
                     lines[0].toLowerCase().includes('date') ||
                     lines[0].toLowerCase().includes('concepto') ||
                     lines[0].toLowerCase().includes('vendor');

    const dataLines = hasHeader ? lines.slice(1) : lines;

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    dataLines.forEach((line, idx) => {
      try {
        const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));

        // Expected format: Date, Concepto, Amount, Type, [Category]
        const date = values[0] || '';
        const vendor = values[1] || 'Desconocido';
        const amountStr = values[2]?.replace(/[^0-9.-]/g, '') || '0';
        const amount = Math.abs(parseFloat(amountStr));

        if (!date || !amount || amount === 0) {
          return; // Skip invalid rows
        }

        // Determine type
        let type: 'expense' | 'income' = 'expense';
        if (values[3]) {
          type = (values[3].toLowerCase().includes('ingreso') ||
                 values[3].toLowerCase().includes('income') ||
                 values[3].toLowerCase().includes('credit'))
                 ? 'income' : 'expense';
        } else if (parseFloat(amountStr) > 0) {
          type = 'income';
        }

        transactions.push({
          date,
          vendor: normalizeVendor(vendor),
          amount,
          type,
          currency: 'UYU', // Default for CSV
          category: values[4] || undefined,
        });
      } catch (error) {
        errors.push(`Error en línea ${idx + 1}: ${error}`);
      }
    });

    return {
      success: true,
      transactions,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar CSV: ${error}`],
    };
  }
}

/**
 * Parse Itaú Link Statement XLS file
 */
export async function parseItauXLS(file: File): Promise<ParserResult> {
  try {
    // Dynamic import to avoid bundling XLSX in server
    const XLSX = await import('xlsx');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get first sheet (Estado de Cuenta)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with header at row 6 (0-indexed)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Extract account metadata from row 4
    const accountDataRow = jsonData[4] as unknown[];

    // Extract and normalize currency
    let currency = (accountDataRow[5] as string)?.toString().trim().toUpperCase() || 'UYU';

    // Map common currency variations to standard codes
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
    };

    // Normalize currency
    if (currencyMap[currency]) {
      currency = currencyMap[currency];
    }

    // Default to UYU if not recognized
    if (!['UYU', 'USD', 'EUR', 'ARS', 'BRL'].includes(currency)) {
      console.warn(`Moneda no reconocida: "${currency}", usando UYU por defecto`);
      currency = 'UYU';
    }

    const metadata = {
      accountName: accountDataRow[1] as string || undefined,
      accountType: accountDataRow[4] as string || undefined,
      currency,
      accountNumber: accountDataRow[6]?.toString() || undefined,
    };

    // Parse transactions starting from row 7 (skip SALDO ANTERIOR)
    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    for (let i = 7; i < jsonData.length; i++) {
      const row = jsonData[i] as unknown[];

      if (!row || row.length < 7) continue;

      const fecha = row[1];
      const concepto = row[2];
      const debito = row[4];
      const credito = row[5];
      const referencia = row[7];

      // Skip SALDO ANTERIOR and empty rows
      if (!fecha || !concepto || concepto.toString().includes('SALDO ANTERIOR')) {
        continue;
      }

      try {
        // Parse date (DD/MM/YYYY to YYYY-MM-DD)
        const dateStr = fecha.toString().trim();
        const [day, month, year] = dateStr.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        // Determine type and amount
        let type: 'expense' | 'income';
        let amount: number;

        if (debito && parseFloat(debito) > 0) {
          type = 'expense';
          amount = parseFloat(debito);
        } else if (credito && parseFloat(credito) > 0) {
          type = 'income';
          amount = parseFloat(credito);
        } else {
          continue; // Skip if no amount
        }

        // Clean up vendor name
        let vendor = concepto.toString().trim();

        // Extract meaningful name from concept
        // Examples: "COMPRA      SP SHOKZ.COM" -> "SP SHOKZ.COM"
        //          "TRASPASO A  8517879ILINK" -> "TRASPASO 8517879ILINK"
        vendor = vendor.replace(/\s+/g, ' ').trim();

        transactions.push({
          date: isoDate,
          vendor: normalizeVendor(vendor),
          amount,
          type,
          currency,
          reference: referencia?.toString() || undefined,
        });
      } catch (error) {
        errors.push(`Error en fila ${i + 1}: ${error}`);
      }
    }

    return {
      success: true,
      transactions,
      errors,
      metadata,
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar archivo de Itaú: ${error}`],
    };
  }
}

/**
 * Auto-detect file type and parse accordingly
 */
export async function parseStatement(file: File): Promise<ParserResult> {
  const fileName = file.name.toLowerCase();

  // Detect file type
  if (fileName.endsWith('.csv')) {
    return parseCSV(file);
  } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
    // Check if it's an Itaú statement
    if (fileName.includes('itaú') || fileName.includes('itau') || fileName.includes('link statement')) {
      return parseItauXLS(file);
    }

    // Try parsing as Itaú format (most common)
    return parseItauXLS(file);
  }

  return {
    success: false,
    transactions: [],
    errors: ['Formato de archivo no soportado. Use CSV o XLS de Itaú.'],
  };
}

/**
 * Check if transaction is a refund/reversal based on vendor/description
 */
export function isRefundTransaction(vendor: string, reference?: string): boolean {
  const text = `${vendor} ${reference || ''}`.toUpperCase();

  const refundKeywords = [
    'DEVOLUCION',
    'DEVOLUCIÓN',
    'REVERSO',
    'REVERSAL',
    'ANULACION',
    'ANULACIÓN',
    'REFUND',
    'REINTEGRO',
    'CANCELACION',
    'CANCELACIÓN',
    'EXTORNO',
    'ESTORNO',
  ];

  return refundKeywords.some(keyword => text.includes(keyword));
}

/**
 * Remove duplicate transactions
 * A duplicate is defined as:
 * 1. Exact duplicate: same date, vendor, amount, currency
 * 2. Cross-currency duplicate: same date, vendor, same amount value but different currency
 *    (likely a parsing error when both columns have the same number)
 */
export function deduplicateTransactions(transactions: ParsedTransaction[]): {
  unique: ParsedTransaction[];
  duplicates: ParsedTransaction[];
} {
  const seen = new Map<string, ParsedTransaction>();
  const duplicates: ParsedTransaction[] = [];

  transactions.forEach(tx => {
    // Create a unique key based on date, vendor, amount, and currency
    const exactKey = `${tx.date}|${tx.vendor.trim().toLowerCase()}|${tx.amount.toFixed(2)}|${tx.currency}`;

    // Check for exact duplicates first
    if (seen.has(exactKey)) {
      duplicates.push(tx);
      return;
    }

    // Check for cross-currency duplicates (same amount, same date, same vendor, different currency)
    // This handles cases where PDF has "$ 11,99 U$S 11,99" which shouldn't be two separate transactions
    const crossCurrencyKey = `${tx.date}|${tx.vendor.trim().toLowerCase()}|${tx.amount.toFixed(2)}`;

    // Look for existing transaction with same date, vendor, and amount but different currency
    let foundCrossCurrency = false;
    for (const [key, existingTx] of Array.from(seen.entries())) {
      const existingCrossKey = `${existingTx.date}|${existingTx.vendor.trim().toLowerCase()}|${existingTx.amount.toFixed(2)}`;

      if (existingCrossKey === crossCurrencyKey && existingTx.currency !== tx.currency) {
        // Found a cross-currency duplicate
        // Keep USD version if available, otherwise keep the first one
        if (tx.currency === 'USD' && existingTx.currency !== 'USD') {
          // Replace UYU with USD
          duplicates.push(existingTx);
          seen.delete(key);
          seen.set(exactKey, tx);
        } else {
          // Keep existing, discard new one
          duplicates.push(tx);
        }
        foundCrossCurrency = true;
        break;
      }
    }

    if (!foundCrossCurrency) {
      // First occurrence
      seen.set(exactKey, tx);
    }
  });

  return {
    unique: [...Array.from(seen.values())],
    duplicates,
  };
}

/**
 * Validate and clean transactions
 */
export function validateTransactions(transactions: ParsedTransaction[]): {
  valid: ParsedTransaction[];
  invalid: Array<{ transaction: ParsedTransaction; reason: string }>;
} {
  const valid: ParsedTransaction[] = [];
  const invalid: Array<{ transaction: ParsedTransaction; reason: string }> = [];

  transactions.forEach(tx => {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
      invalid.push({ transaction: tx, reason: 'Formato de fecha inválido' });
      return;
    }

    // Validate amount
    if (!tx.amount || tx.amount <= 0 || isNaN(tx.amount)) {
      invalid.push({ transaction: tx, reason: 'Monto inválido' });
      return;
    }

    // Validate vendor
    if (!tx.vendor || tx.vendor.trim().length === 0) {
      invalid.push({ transaction: tx, reason: 'Concepto vacío' });
      return;
    }

    // Check if it's a refund
    tx.isRefund = isRefundTransaction(tx.vendor, tx.reference);

    valid.push(tx);
  });

  return { valid, invalid };
}
