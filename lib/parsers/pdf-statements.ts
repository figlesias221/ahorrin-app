/**
 * PDF Bank Statement Parsers
 * Based on Python extraction logic from gastos-varios/extract_bank_statements.py
 * Supports: BBVA, Scotia, Itaú Master, Itaú Visa
 */

import type { ParsedTransaction, ParserResult } from './bank-statements';
import { parsePDFWithLLM } from './llm-pdf-parser';

/**
 * Parse PDF buffer and extract text using pdfjs-serverless
 * Compatible with Cloudflare Workers edge runtime
 */
async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  try {
    console.log('📄 Attempting to extract text from PDF, buffer size:', buffer.length);

    // Use pdfjs-serverless directly - designed for Workers
    const pdfjsLib = await import('pdfjs-serverless');
    console.log('✅ pdfjs-serverless module loaded successfully');

    // Convert Buffer to Uint8Array for pdfjs
    const pdfData = new Uint8Array(buffer);

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    console.log(`📄 PDF loaded: ${pdf.numPages} pages`);

    // Extract text from all pages, preserving line structure
    const textParts: string[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Group text items by Y coordinate to detect lines
      const lines: Map<number, string[]> = new Map();

      for (const item of textContent.items) {
        if ('str' in item && item.str) {
          // Round Y coordinate to group items on same line
          const y = Math.round((item as any).transform[5]);
          if (!lines.has(y)) {
            lines.set(y, []);
          }
          lines.get(y)!.push(item.str);
        }
      }

      // Sort lines by Y coordinate (top to bottom) and join
      const sortedLines = Array.from(lines.entries())
        .sort((a, b) => b[0] - a[0]) // PDF Y axis goes bottom to top, so reverse
        .map(([_, items]) => items.join(' ').trim())
        .filter(line => line.length > 0);

      textParts.push(sortedLines.join('\n'));
    }

    const text = textParts.join('\n');
    console.log('✅ Text extracted, length:', text.length);
    console.log('📝 First 200 chars:', text.substring(0, 200));

    return text;
  } catch (error) {
    console.error('❌ Error in parsePDFBuffer:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse date from DD/MM/YYYY or DD MM YY format to YYYY-MM-DD
 */
function parseDate(dateStr: string): string {
  const cleaned = dateStr.trim();

  // Format: DD/MM/YYYY
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // Format: DD MM YY (with spaces)
  const parts = cleaned.split(/\s+/);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return cleaned;
}

/**
 * Normalize vendor name for consistent matching
 * Removes branch numbers, locations, and normalizes format
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
 * Clean and convert amount to float
 * Handles both formats: 1.234,56 and 1,234.56
 * Also handles negative amounts: -44,26
 */
function cleanAmount(amountStr: string): number {
  if (!amountStr || amountStr.trim() === '') return 0.0;

  // Preserve negative sign
  const isNegative = amountStr.trim().startsWith('-');

  // Remove currency symbols, whitespace, and negative sign for processing
  let cleaned = amountStr.toString().replace(/[$\s-]/g, '').trim();

  // Handle different decimal separators
  // Uruguay format: 1.234,56 -> 1234.56
  // US format: 1,234.56 -> 1234.56

  // If has both comma and dot, determine which is decimal separator
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // If comma comes after dot, dot is thousands separator: 1.234,56
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Dot comes after comma, comma is thousands separator: 1,234.56
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Only comma - assume it's decimal separator
    cleaned = cleaned.replace(',', '.');
  }

  try {
    const result = parseFloat(cleaned);
    const finalResult = isNaN(result) ? 0.0 : result;
    return isNegative ? -finalResult : finalResult;
  } catch {
    return 0.0;
  }
}

/**
 * Parse BBVA Visa PDF statement
 * Pattern: DD/MM/YYYY DESCRIPCION $ MONTO_UYU [U$S MONTO_USD]
 */
export async function parseBBVAPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    console.log('🏦 Starting BBVA PDF parsing...');
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');
    console.log(`📋 BBVA: Processing ${lines.length} lines`);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      // Match pattern with optional currency symbols
      // Example: 10/01/2025 JUAN CONSTRUYE $ 0,00 U$S 33,00
      // Example: 10/01/2025 TIENDA 123 $ 1.234,56
      // Example: 10/01/2025 COMERCIO 456 1.234,56 33,00 (no symbols)
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(?:\$\s+)?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})(?:\s+(?:U?\$S?\s+)?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2}))?$/);

      if (match) {
        const [, date, description, amount1, amount2] = match;

        // Skip credit limit lines and payment lines
        const descUpper = description.toUpperCase();
        if (descUpper.includes('LÍMITE') || descUpper.includes('LIMITE') ||
            descUpper.includes('CRÉDITO') || descUpper.includes('CREDITO') ||
            descUpper.includes('PAGO')) {
          continue;
        }

        const amountUYU = cleanAmount(amount1);
        const amountUSD = amount2 ? cleanAmount(amount2) : 0;

        // BBVA format: First column = UYU ($), Second column = USD (U$S)
        if (amountUYU > 0) {
          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount: amountUYU,
            type: 'expense',
            currency: 'UYU',
          });
        }

        if (amountUSD > 0) {
          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount: amountUSD,
            type: 'expense',
            currency: 'USD',
          });
        }
      }
    }

    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'BBVA Visa',
      },
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF de BBVA: ${error}`],
    };
  }
}

/**
 * Parse Scotia PDF statement
 * Pattern: DD/MM/YYYY DETALLE $ IMPORTE or U$S IMPORTE
 */
export async function parseScotiaPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      // Match pattern: DD/MM/YYYY DETALLE [CURRENCY_SYMBOL] AMOUNT
      // Example: 02/12/2024 FARMASHOP $ 15.353,00
      // Example: 02/12/2024 TIENDA 123 U$S 45,00
      // Key: amounts must have format with 2 decimals
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(?:(U?\$S?)\s+)?(\d{1,3}(?:[.,\s]\d{3})*[.,]\d{2})$/);

      if (match) {
        const [, date, description, currencySymbol, amount] = match;

        // Skip payment lines (PAGO EN SCOTIABANK)
        if (description.toUpperCase().includes('PAGO')) {
          continue;
        }

        // Determine currency from symbol in THIS LINE ONLY
        // Default to UYU if no symbol found
        let currency = 'UYU';
        if (currencySymbol) {
          const symbol = currencySymbol.toUpperCase();
          // U$S, US$, U$ = USD
          // $ = UYU
          currency = (symbol.includes('U') || symbol.startsWith('US')) ? 'USD' : 'UYU';
        }

        const cleanedAmount = cleanAmount(amount);

        if (cleanedAmount > 0) {
          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount: cleanedAmount,
            type: 'expense',
            currency,
          });
        }
      }
    }

    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'Scotiabank',
      },
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF de Scotia: ${error}`],
    };
  }
}

/**
 * Parse Itaú Mastercard PDF statement
 * Pattern: DD MM YY CARD_DIGITS DESCRIPCION MONTO [MONTO]
 *
 * IMPORTANTE: El PDF de Itaú tiene 3 columnas de importes:
 * 1. "Importe origen" - IGNORADO (no aparece en texto extraído)
 * 2. "Importe $" (UYU) - Aparece cuando la transacción es en pesos
 * 3. "Importe US$" (USD) - Aparece cuando la transacción es en dólares
 *
 * Currency detection logic (basado en texto extraído):
 * - Si aparecen DOS montos IGUALES: Transacción en USD (el monto se duplica)
 * - Si aparece UN SOLO monto: Transacción en UYU
 *
 * Ejemplos del texto extraído:
 * - UYU: "04 12 24 8746 FROG SUCURSAL 1 294,00" (1 monto)
 * - USD: "08 12 24 8746 SPOTIFY P322DB0745 11,99 11,99" (2 montos iguales)
 */
export async function parseItauMasterPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    console.log('🏦 Starting Itaú Mastercard PDF parsing...');
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');
    console.log(`📋 Itaú Master: Processing ${lines.length} lines`);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      // Match pattern: DD MM YY CARD_DIGITS DESCRIPCION AMOUNT1 [AMOUNT2]
      // Example (UYU): 02 07 25 8746 FROG SUCURSAL 1 250,00
      // Example (UYU): 07 12 24 8746 FROG SUCURSAL 1 1524,70 (4 digits, no thousands separator)
      // Example (USD): 05 07 25 8746 GOOGLE *YOUTUBE 10,32 10,32
      // Example (credit): 14 12 24 8746 REDUC. IVA LEY 17934 -44,26
      // Improved regex to capture:
      // - Amounts with or without thousands separator (1524,70 or 1.524,70)
      // - Negative amounts (-44,26)
      const match = line.match(/(\d{2}\s+\d{2}\s+\d{2})\s+(\d{4})\s+(.+?)\s+(-?\d{1,}(?:[.,]\d{3})*[.,]\d{2})(?:\s+(-?\d{1,}(?:[.,]\d{3})*[.,]\d{2}))?$/);

      if (match) {
        const [, date, , description, amount1, amount2] = match;

        // Skip payment lines
        const descUpper = description.toUpperCase();
        if (descUpper.includes('PAGO')) {
          continue;
        }

        const firstAmount = cleanAmount(amount1);
        const secondAmount = amount2 ? cleanAmount(amount2) : 0;

        // Currency detection:
        // - If two amounts exist and are equal (or very close): USD transaction
        // - If only one amount: UYU transaction
        let currency: string;
        let amount: number;

        if (secondAmount > 0 && Math.abs(firstAmount - secondAmount) < 0.01) {
          // Two equal amounts = USD transaction
          currency = 'USD';
          amount = firstAmount; // Use the first amount (they're the same)
        } else {
          // Single amount = UYU transaction
          currency = 'UYU';
          amount = Math.abs(firstAmount); // Use absolute value (for credits like IVA reduction)
        }

        if (amount > 0) {
          // Determine transaction type based on amount sign
          const type = firstAmount < 0 ? 'income' : 'expense';

          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount,
            type,
            currency,
          });
        }
      }
    }

    console.log(`✅ Itaú Master: Found ${transactions.length} transactions`);
    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'Itaú Mastercard',
      },
    };
  } catch (error) {
    console.error('❌ Itaú Master parsing error:', error);
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF de Itaú Master: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Parse Itaú Visa PDF statement
 * Pattern: DD MM YY CARD_DIGITS DESCRIPCION MONTO_UYU [MONTO_USD]
 *
 * IMPORTANTE: Itaú Visa tiene un formato DIFERENTE a Mastercard:
 * - Mastercard: 2 montos iguales = 1 transacción USD (monto duplicado)
 * - Visa: 2 montos diferentes = 2 transacciones (UYU convertido + USD original)
 *
 * Columns in PDF:
 * - "Importe origen" (original amount in original currency) - NOT extracted by parser
 * - "Importe $" (UYU - converted amount) - Shows when transaction is in pesos OR converted from USD
 * - "Importe U$S" (USD - original amount) - Shows when transaction is originally in USD
 *
 * Examples:
 * - Only UYU: "14 12 24 0044 TELEPEAJE 14/12 150,01" (1 amount = UYU only)
 * - UYU + USD: "21 12 24 0069 CABIFY 12966,07 12,33" (2 different amounts = UYU converted + USD original)
 *   This creates TWO transactions: 12966.07 UYU + 12.33 USD
 */
export async function parseItauVisaPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    console.log('🏦 Starting Itaú Visa PDF parsing...');
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');
    console.log(`📋 Itaú Visa: Processing ${lines.length} lines`);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      // Match pattern: DD MM YY CARD_DIGITS DESCRIPCION AMOUNT1 [AMOUNT2]
      const match = line.match(/(\d{2}\s+\d{2}\s+\d{2})\s+(\d{4})\s+(.+?)\s+(-?\d{1,}(?:[.,]\d{3})*[.,]\d{2})(?:\s+(-?\d{1,}(?:[.,]\d{3})*[.,]\d{2}))?$/);

      if (match) {
        const [, date, , description, amount1, amount2] = match;

        // Skip payment lines
        const descUpper = description.toUpperCase();
        if (descUpper.includes('PAGO')) {
          continue;
        }

        const amountUYU = cleanAmount(amount1);
        const amountUSD = amount2 ? cleanAmount(amount2) : 0;

        // For Itaú Visa with 2 amounts:
        // - Amount 1 = UYU converted (ignore this, it's just the conversion)
        // - Amount 2 = USD original (use this)
        // For Itaú Visa with 1 amount:
        // - Amount 1 = UYU only (use this)

        if (Math.abs(amountUSD) > 0) {
          // Has 2 amounts: Transaction is in USD (ignore UYU conversion)
          const type = amountUSD < 0 ? 'income' : 'expense';
          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount: Math.abs(amountUSD),
            type,
            currency: 'USD',
          });
        } else if (Math.abs(amountUYU) > 0) {
          // Has 1 amount: Transaction is in UYU
          const type = amountUYU < 0 ? 'income' : 'expense';
          transactions.push({
            date: parseDate(date),
            vendor: normalizeVendor(description),
            amount: Math.abs(amountUYU),
            type,
            currency: 'UYU',
          });
        }
      }
    }

    console.log(`✅ Itaú Visa: Found ${transactions.length} transactions`);
    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'Itaú Visa',
      },
    };
  } catch (error) {
    console.error('❌ Itaú Visa parsing error:', error);
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF de Itaú Visa: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Parse Itaú Bank Account PDF statement (Itaú Link)
 * Pattern: DD-MM-YY CONCEPT DEBIT CREDIT BALANCE
 * Table format with clear columns
 */
export async function parseItauBankAccountPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    console.log('🏦 Starting Itaú Bank Account PDF parsing...');
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');
    console.log(`📋 Itaú Account: Processing ${lines.length} lines`);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    // Pattern: DD-MM-YY at beginning (Itaú bank account format)
    const datePattern = /^(\d{2}-\d{2}-\d{2,4})\s+(.+)/;

    for (const line of lines) {
      const match = line.match(datePattern);

      if (match) {
        const [, date, rest] = match;

        // Skip "Saldo anterior" and "Saldo final" lines
        if (rest.includes('Saldo anterior') || rest.includes('Saldo final')) {
          continue;
        }

        // Find amounts: format X.XXX,XX or XXX,XX
        const amountMatches = rest.match(/(\d{1,3}(?:\.\d{3})*,\d{2})/g);

        if (amountMatches && amountMatches.length >= 1) {
          // In Itaú bank account:
          // - First amount could be debit or credit
          // - Last amount is always balance
          // - Need to check if it's in "Débito" or "Crédito" column based on position

          const concept = rest.replace(/\d{1,3}(?:\.\d{3})*,\d{2}/g, '').trim();

          // Get first amount (the transaction amount)
          const firstAmount = cleanAmount(amountMatches[0]);

          // Determine if it's debit or credit based on concept
          // Credits: CRED.DIRECTO, TRASPASO DE
          // Debits: TRASPASO A, DEBITO
          let type: 'expense' | 'income' = 'expense';
          if (concept.includes('CRED.DIRECTO') || concept.includes('TRASPASO DE')) {
            type = 'income';
          }

          if (firstAmount > 0 && concept.length > 3) {
            transactions.push({
              date: parseDate(date.replace(/-/g, '/')), // Convert DD-MM-YY to DD/MM/YY
              vendor: normalizeVendor(concept),
              amount: firstAmount,
              type,
              currency: 'UYU', // Itaú Link accounts typically in UYU
            });
          }
        }
      }
    }

    console.log(`✅ Itaú Account: Found ${transactions.length} transactions`);
    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'Itaú Cuenta',
      },
    };
  } catch (error) {
    console.error('❌ Itaú Account parsing error:', error);
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar cuenta de Itaú: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Parse Santander PDF statement
 * Pattern: DD/MM/YY REFERENCE TYPE DESCRIPTION DEBIT/CREDIT BALANCE
 * Multi-line descriptions
 */
export async function parseSantanderPDF(buffer: Buffer): Promise<ParserResult> {
  try {
    console.log('🏦 Starting Santander PDF parsing...');
    const text = await parsePDFBuffer(buffer);
    const lines = text.split('\n');
    console.log(`📋 Santander: Processing ${lines.length} lines`);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    // Pattern to detect transaction start: DD/MM/YY at beginning
    const datePattern = /^(\d{2}\/\d{2}\/\d{2,4})\s+/;

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      const match = line.match(datePattern);

      if (match) {
        const date = match[1];

        // Find amounts in this line (format: -10,65 or 111,11 or 9.972,93)
        // Look for numbers with comma as decimal separator
        const amountMatches = line.match(/(-?\d{1,3}(?:[.,]\d{3})*,\d{2})/g);

        if (amountMatches && amountMatches.length >= 1) {
          // Last number before end is usually the balance, second-to-last is the transaction amount
          const transactionAmount = amountMatches.length >= 2 ? amountMatches[amountMatches.length - 2] : amountMatches[0];

          // Clean amount
          const amount = Math.abs(cleanAmount(transactionAmount));

          // Determine type: negative = expense, positive = income
          const type: 'expense' | 'income' = transactionAmount.startsWith('-') ? 'expense' : 'income';

          // Get description from remaining text
          let description = line.replace(datePattern, '').trim();

          // Collect description from next lines until next transaction or empty line
          let j = i + 1;
          while (j < lines.length) {
            const nextLine = lines[j].trim();
            // Stop if next line starts with date or is empty
            if (datePattern.test(nextLine) || nextLine.length === 0) {
              break;
            }
            // Avoid adding lines that are just numbers or special chars
            if (nextLine && !/^[\d\s\-,\.#]+$/.test(nextLine)) {
              description += ' ' + nextLine;
            }
            j++;
          }

          // Clean description - remove reference numbers, amounts, and extra info
          description = description
            .replace(/\d{6,}/g, '') // Remove long numbers (references)
            .replace(/(-?\d{1,3}(?:[.,]\d{3})*,\d{2})/g, '') // Remove amounts
            .replace(/TARJ:\s*#+\d+/g, '') // Remove card numbers
            .replace(/\s+/g, ' ')
            .trim();

          // Skip if no meaningful description
          if (description.length < 3) {
            i = j;
            continue;
          }

          if (amount > 0) {
            transactions.push({
              date: parseDate(date),
              vendor: normalizeVendor(description),
              amount,
              type,
              currency: 'USD', // Santander Uruguay typically uses USD
            });
          }

          i = j;
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    console.log(`✅ Santander: Found ${transactions.length} transactions`);
    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountType: 'Santander',
      },
    };
  } catch (error) {
    console.error('❌ Santander parsing error:', error);
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF de Santander: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Detect bank type from PDF content
 */
export async function detectBankFromPDF(buffer: Buffer): Promise<{
  bankType: 'bbva' | 'scotia' | 'itau-master' | 'itau-visa' | 'itau-account' | 'santander' | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}> {
  try {
    const text = await parsePDFBuffer(buffer);
    const upperText = text.toUpperCase();

    // BBVA Detection - Look for BBVA branding and date format
    if (upperText.includes('BBVA') || upperText.includes('BANCO BILBAO')) {
      return {
        bankType: 'bbva',
        confidence: 'high',
        reason: 'Detectado "BBVA" en el documento'
      };
    }

    // Scotia Detection - Look for Scotia/Scotiabank branding
    if (upperText.includes('SCOTIABANK') || upperText.includes('SCOTIA BANK')) {
      return {
        bankType: 'scotia',
        confidence: 'high',
        reason: 'Detectado "Scotiabank" en el documento'
      };
    }

    // Santander Detection
    if (upperText.includes('SANTANDER') || upperText.includes('BANCO SANTANDER')) {
      return {
        bankType: 'santander',
        confidence: 'high',
        reason: 'Detectado "Santander" en el documento'
      };
    }

    // Itaú Detection - Distinguish between bank account and credit cards
    if (upperText.includes('ITAU') || upperText.includes('ITAÚ')) {
      // Check if it's a bank account (Itaú Link)
      const isItauLink = upperText.includes('ITAULINK') || upperText.includes('ITAU LINK');
      const hasAccountPattern = /CUENTA\s+\d{7}/.test(upperText);

      if (isItauLink || hasAccountPattern) {
        return {
          bankType: 'itau-account',
          confidence: 'high',
          reason: 'Detectado "Itaú Link" - extracto de cuenta bancaria'
        };
      }

      // Look for card type indicators
      const hasMastercard = upperText.includes('MASTERCARD') || upperText.includes('MASTER CARD');
      const hasVisa = upperText.includes('VISA');

      // Check for card number patterns in content
      const lines = text.split('\n');
      let has8746Pattern = false; // Itaú Master pattern
      let has0044Pattern = false; // Itaú Visa pattern

      for (const line of lines.slice(0, 50)) { // Check first 50 lines
        if (line.includes('8746') && /\d{2}\s+\d{2}\s+\d{2}/.test(line)) {
          has8746Pattern = true;
        }
        if ((line.includes('0044') || line.includes('0069')) && /\d{2}\s+\d{2}\s+\d{2}/.test(line)) {
          has0044Pattern = true;
        }
      }

      // Determine card type based on indicators
      if (hasMastercard || has8746Pattern) {
        return {
          bankType: 'itau-master',
          confidence: hasMastercard ? 'high' : 'medium',
          reason: hasMastercard
            ? 'Detectado "Itaú Mastercard" en el documento'
            : 'Detectado patrón de tarjeta Itaú Mastercard (8746)'
        };
      }

      if (hasVisa || has0044Pattern) {
        return {
          bankType: 'itau-visa',
          confidence: hasVisa ? 'high' : 'medium',
          reason: hasVisa
            ? 'Detectado "Itaú Visa" en el documento'
            : 'Detectado patrón de tarjeta Itaú Visa (0044/0069)'
        };
      }

      // Found Itaú but couldn't determine type - default to bank account
      return {
        bankType: 'itau-account',
        confidence: 'low',
        reason: 'Detectado "Itaú" pero no se pudo determinar el tipo específico'
      };
    }

    // No bank detected
    return {
      bankType: null,
      confidence: 'low',
      reason: 'No se pudo detectar el banco automáticamente'
    };
  } catch (error) {
    return {
      bankType: null,
      confidence: 'low',
      reason: `Error al detectar banco: ${error}`
    };
  }
}

/**
 * Auto-detect bank and parse PDF accordingly
 */
export async function parsePDFStatement(
  buffer: Buffer,
  bankType?: 'bbva' | 'scotia' | 'itau-master' | 'itau-visa' | 'itau-account' | 'santander'
): Promise<ParserResult & { detectedBank?: string; detectionConfidence?: string }> {
  let finalBankType = bankType;
  let detectionInfo: { detectedBank?: string; detectionConfidence?: string } = {};

  // If no bank type specified, try auto-detection
  if (!finalBankType) {
    const detection = await detectBankFromPDF(buffer);
    if (detection.bankType) {
      finalBankType = detection.bankType;
      detectionInfo = {
        detectedBank: detection.bankType,
        detectionConfidence: detection.confidence
      };
      console.log(`📊 Auto-detected bank: ${detection.bankType} (${detection.confidence} confidence) - ${detection.reason}`);
    } else {
      return {
        success: false,
        transactions: [],
        errors: ['No se pudo detectar el tipo de banco automáticamente. Por favor selecciona el banco manualmente.'],
      };
    }
  }

  // Parse based on detected or specified bank type
  let result: ParserResult;
  switch (finalBankType) {
    case 'bbva':
      result = await parseBBVAPDF(buffer);
      break;
    case 'scotia':
      result = await parseScotiaPDF(buffer);
      break;
    case 'itau-master':
      result = await parseItauMasterPDF(buffer);
      break;
    case 'itau-visa':
      result = await parseItauVisaPDF(buffer);
      break;
    case 'itau-account':
      result = await parseItauBankAccountPDF(buffer);
      break;
    case 'santander':
      result = await parseSantanderPDF(buffer);
      break;
    default:
      return {
        success: false,
        transactions: [],
        errors: ['Tipo de banco no soportado'],
      };
  }

  // Add detection info to result
  return {
    ...result,
    ...detectionInfo
  };
}

/**
 * Universal PDF Parser with AI Fallback
 * Strategy:
 * 1. If forceLLM=true, use LLM parser directly
 * 2. Try specific parser if bank is known (free + fast)
 * 3. If specific parser fails or returns 0 transactions, fallback to LLM
 * 4. If bank cannot be detected, use LLM parser (supports any format)
 *
 * Supported banks (specific parsers): BBVA, Scotia, Itaú Mastercard, Itaú Visa, Santander
 * Fallback: GPT-5-mini for unknown banks, tickets, receipts, invoices (~$0.005-0.01 per doc)
 */
export async function parseAnyPDF(
  buffer: Buffer,
  options?: {
    bankType?: 'bbva' | 'scotia' | 'itau-master' | 'itau-visa' | 'itau-account' | 'santander';
    forceLLM?: boolean;
  }
): Promise<ParserResult & { detectedBank?: string; detectionConfidence?: string; usedLLM?: boolean }> {
  const { bankType, forceLLM = false } = options || {};

  // Option 1: User explicitly requests LLM parser
  if (forceLLM) {
    console.log('🤖 Usuario solicitó parser LLM explícitamente');
    return await parsePDFWithLLM(buffer);
  }

  // Option 2: User specified bank type - use specific parser
  if (bankType) {
    console.log(`📊 Usando parser específico: ${bankType}`);
    const result = await parsePDFStatement(buffer, bankType);

    // If specific parser succeeded, return result
    if (result.success && result.transactions.length > 0) {
      return { ...result, usedLLM: false };
    }

    // If specific parser failed or returned 0 transactions, fallback to LLM
    console.log('⚠️ Parser específico no encontró transacciones, usando LLM como fallback...');
    return await parsePDFWithLLM(buffer);
  }

  // Option 3: Try auto-detection
  console.log('🔍 Intentando detectar banco automáticamente...');
  const detection = await detectBankFromPDF(buffer);

  if (detection.bankType && detection.confidence !== 'low') {
    // High/medium confidence - use specific parser
    console.log(`✅ Banco detectado: ${detection.bankType} (confianza: ${detection.confidence})`);
    const result = await parsePDFStatement(buffer, detection.bankType);

    // If specific parser succeeded, return result
    if (result.success && result.transactions.length > 0) {
      return { ...result, usedLLM: false };
    }

    // If specific parser failed or returned 0 transactions, fallback to LLM
    console.log('⚠️ Parser específico no encontró transacciones, usando LLM como fallback...');
    return await parsePDFWithLLM(buffer);
  }

  // Option 4: Unknown bank - use LLM as fallback
  console.log('🤖 Banco desconocido, usando parser LLM...');
  return await parsePDFWithLLM(buffer);
}
