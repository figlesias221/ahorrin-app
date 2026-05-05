/**
 * Currency detection helpers (Uruguay-focused).
 *
 * The Ahorrin app supports two currencies for the foreseeable future:
 *   - UYU (peso uruguayo)
 *   - USD (dólar estadounidense)
 *
 * Bank statements rarely state the currency in a single canonical field, so
 * we have to scan the surrounding text for markers. These helpers centralize
 * that logic so every parser (PDF, CSV, QIF, LLM fallback) uses the same
 * heuristic and we get consistent per-row currency assignment.
 */

export type DetectedCurrency = 'USD' | 'UYU';

// USD markers — case-insensitive, word-boundary aware where possible.
// `\$` doesn't sit on a word boundary because `$` is not a word char in JS,
// so we hand-roll the boundaries (^|[^A-Za-z0-9$]) for the symbol-led tokens.
const USD_PATTERNS: RegExp[] = [
  /\bUSD\b/i,
  /(^|[^A-Za-z0-9$])US\$/i,
  /(^|[^A-Za-z0-9$])U\$S(?![A-Za-z0-9])/i,
  /\bD[ÓO]LAR(?:ES)?\b/i, // DÓLAR, DOLAR, DÓLARES, DOLARES
];

// UYU markers — note PESOS is matched separately so we can guard against
// "DÓLARES estadounidenses (pesos uruguayos equivalentes)" style mentions.
const UYU_PATTERNS: RegExp[] = [
  /\bUYU\b/i,
  /(^|[^A-Za-z0-9$])\$U(?![A-Za-z0-9])/i,
  /\bMONEDA\s+NACIONAL\b/i,
];

const PESOS_PATTERN = /\bPESOS?\b/i;

/**
 * Detect currency from a free-text blob (PDF page, CSV header dump, QIF body).
 *
 * Returns:
 *   - 'USD' if USD markers are present and no strong UYU markers
 *   - 'UYU' if UYU markers are present and no strong USD markers
 *   - null  if both or neither are found (caller should fall back)
 */
export function detectCurrencyFromText(text: string): DetectedCurrency | null {
  if (!text) return null;

  const hasUSD = USD_PATTERNS.some((rx) => rx.test(text));

  // PESOS only counts as UYU when it isn't immediately preceded by DÓLAR/DOLAR
  // (e.g. avoid "DÓLARES expresados en pesos uruguayos" tripping UYU when the
  // section is really USD). We approximate "preceded by" with a 20-char window.
  let hasPesos = false;
  if (PESOS_PATTERN.test(text)) {
    hasPesos = !/D[ÓO]LAR(?:ES)?[^.\n]{0,40}\bPESOS?\b/i.test(text);
  }

  const hasUYU = UYU_PATTERNS.some((rx) => rx.test(text)) || hasPesos;

  if (hasUSD && !hasUYU) return 'USD';
  if (hasUYU && !hasUSD) return 'UYU';
  return null;
}

/**
 * Detect currency from an inline amount string like "U$S 1.234,50" or
 * "$ 500,00". Used when a row carries the currency right next to the amount.
 *
 * Falls back to detectCurrencyFromText for the broader patterns; the only
 * extra rule here is that a bare "$" prefix (without "U") is treated as UYU,
 * which mirrors how Uruguayan statements typically print local currency.
 */
export function detectCurrencyFromAmount(amountStr: string): DetectedCurrency | null {
  if (!amountStr) return null;
  const fromText = detectCurrencyFromText(amountStr);
  if (fromText) return fromText;

  // Bare "$" without "U" => UYU (Uruguayan convention for local currency).
  // Reject "$U" (already handled above) and "U$S" / "US$" (USD).
  if (/(^|\s)\$\s*\d/.test(amountStr) && !/U\$|\$U/i.test(amountStr)) {
    return 'UYU';
  }

  return null;
}
