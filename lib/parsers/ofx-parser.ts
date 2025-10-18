/**
 * OFX/QFX Parser
 * Parses Open Financial Exchange format (used by most banks)
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
 * Parse OFX date format (YYYYMMDD or YYYYMMDDHHMMSS) to YYYY-MM-DD
 */
function parseOFXDate(dateStr: string): string {
  if (!dateStr) return '';

  // Remove timezone info if present ([...])
  const cleaned = dateStr.split('[')[0].trim();

  // Extract YYYYMMDD
  if (cleaned.length >= 8) {
    const year = cleaned.substring(0, 4);
    const month = cleaned.substring(4, 6);
    const day = cleaned.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  return cleaned;
}

/**
 * Parse OFX/QFX file
 */
export async function parseOFX(file: File): Promise<ParserResult> {
  try {
    // Dynamic import to avoid bundling ofx-js in server
    const ofx = await import('ofx-js');

    const text = await file.text();
    const ofxData = await ofx.parse(text);

    if (!ofxData) {
      return {
        success: false,
        transactions: [],
        errors: ['No se pudo parsear el archivo OFX'],
      };
    }

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    // Extract account information
    let accountName: string | undefined;
    let accountNumber: string | undefined;
    let currency = 'UYU';

    // OFX can contain multiple accounts
    const accounts = Array.isArray(ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS)
      ? ofxData.OFX.BANKMSGSRSV1.STMTTRNRS
      : ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS
      ? [ofxData.OFX.BANKMSGSRSV1.STMTTRNRS]
      : [];

    // Also check for credit card accounts
    const ccAccounts = Array.isArray(ofxData.OFX?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS)
      ? ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS
      : ofxData.OFX?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS
      ? [ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS]
      : [];

    const allAccounts = [...accounts, ...ccAccounts];

    if (allAccounts.length === 0) {
      return {
        success: false,
        transactions: [],
        errors: ['No se encontraron cuentas en el archivo OFX'],
      };
    }

    // Process each account
    allAccounts.forEach((account: unknown) => {
      try {
        // Get account info
        const stmt = account.STMTRS || account.CCSTMTRS;
        if (!stmt) return;

        // Extract currency
        if (stmt.CURDEF) {
          currency = stmt.CURDEF;
        }

        // Extract account details
        const acctFrom = stmt.BANKACCTFROM || stmt.CCACCTFROM;
        if (acctFrom) {
          accountNumber = acctFrom.ACCTID;
          accountName = acctFrom.BANKID || acctFrom.ACCTTYPE;
        }

        // Get transaction list
        const tranList = stmt.BANKTRANLIST || stmt.BANKTRANLIST;
        if (!tranList || !tranList.STMTTRN) return;

        const stmtTrns = Array.isArray(tranList.STMTTRN)
          ? tranList.STMTTRN
          : [tranList.STMTTRN];

        // Process each transaction
        stmtTrns.forEach((trn: Record<string, unknown>, idx: number) => {
          try {
            const date = parseOFXDate(trn.DTPOSTED);
            const amount = Math.abs(parseFloat(trn.TRNAMT || '0'));
            const vendor = trn.NAME || trn.MEMO || 'Desconocido';

            // Determine type based on amount sign
            const type: 'expense' | 'income' = parseFloat(trn.TRNAMT || '0') < 0 ? 'expense' : 'income';

            if (!date || !amount || amount === 0) {
              return; // Skip invalid transactions
            }

            transactions.push({
              date,
              vendor: normalizeVendor(vendor),
              amount,
              type,
              currency,
              reference: trn.FITID || trn.CHECKNUM || undefined,
            });
          } catch (error) {
            errors.push(`Error en transacción ${idx + 1}: ${error}`);
          }
        });
      } catch (error) {
        errors.push(`Error al procesar cuenta: ${error}`);
      }
    });

    if (transactions.length === 0) {
      return {
        success: false,
        transactions: [],
        errors: ['No se encontraron transacciones en el archivo OFX'],
      };
    }

    return {
      success: true,
      transactions,
      errors,
      metadata: {
        accountName,
        accountNumber,
        currency,
      },
    };
  } catch (error) {
    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar archivo OFX: ${error}`],
    };
  }
}

/**
 * Parse QFX file (same as OFX, just Quicken's version)
 */
export async function parseQFX(file: File): Promise<ParserResult> {
  // QFX is the same format as OFX
  return parseOFX(file);
}
