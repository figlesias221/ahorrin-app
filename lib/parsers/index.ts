/**
 * Unified Parser Facade
 * Single entry point for all transaction file parsing
 */

import { detectFormat, type SupportedFormat } from './format-detector';
import { parseCSVEnhanced } from './csv-parser';
import { parseOFX, parseQFX } from './ofx-parser';
import { parseQIF } from './qif-parser';
import { parseJSON } from './json-parser';
import { parseAnyPDF } from './pdf-statements';
import { parseStatement as parseExcel } from './bank-statements';
import type { ParserResult } from './bank-statements';

export interface UnifiedParserOptions {
  /**
   * Optional bank type hint for PDF parsing
   */
  bankType?: 'bbva' | 'scotia' | 'itau-master' | 'itau-visa';

  /**
   * Optional format override (skips auto-detection)
   */
  format?: SupportedFormat;

  /**
   * Force use of LLM parser for PDFs (bypasses specific parsers)
   * Useful for unknown banks, tickets, receipts, invoices
   */
  forceLLM?: boolean;
}

/**
 * Parse any supported file format
 * Auto-detects format and routes to appropriate parser
 */
export async function parseTransactionFile(
  file: File,
  options: UnifiedParserOptions = {}
): Promise<ParserResult & { detectedFormat?: SupportedFormat }> {
  try {
    // Detect format if not provided
    let format = options.format;
    let detectedFormat: SupportedFormat | undefined;

    if (!format) {
      const detection = await detectFormat(file);

      if (!detection.format) {
        return {
          success: false,
          transactions: [],
          errors: [`No se pudo detectar el formato del archivo: ${detection.reason}`],
        };
      }

      format = detection.format;
      detectedFormat = format;
      console.log(`📊 Auto-detected format: ${format} (${detection.confidence} confidence)`);
    }

    // Route to appropriate parser
    let result: ParserResult;

    switch (format) {
      case 'csv':
        result = await parseCSVEnhanced(file);
        break;

      case 'pdf':
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        result = await parseAnyPDF(buffer, {
          bankType: options.bankType,
          forceLLM: options.forceLLM,
        });
        break;

      case 'xls':
      case 'xlsx':
        result = await parseExcel(file);
        break;

      case 'ofx':
        result = await parseOFX(file);
        break;

      case 'qfx':
        result = await parseQFX(file);
        break;

      case 'qif':
        result = await parseQIF(file);
        break;

      case 'json':
        result = await parseJSON(file);
        break;

      default:
        return {
          success: false,
          transactions: [],
          errors: [`Formato no soportado: ${format}`],
        };
    }

    // Add detected format to result
    return {
      ...result,
      detectedFormat: detectedFormat || format,
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar archivo: ${error}`],
    };
  }
}

/**
 * Get supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return ['.pdf', '.csv', '.xls', '.xlsx', '.ofx', '.qfx', '.qif', '.json'];
}

/**
 * Check if a file extension is supported
 */
export function isSupportedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return getSupportedExtensions().some(ext => lower.endsWith(ext));
}

// Re-export types and utilities
export type { ParsedTransaction, ParserResult } from './bank-statements';
export { validateTransactions, deduplicateTransactions, isRefundTransaction } from './bank-statements';
export { exportToJSON } from './json-parser';
export type { SupportedFormat } from './format-detector';
