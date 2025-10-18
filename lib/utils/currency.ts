// Currency conversion utilities
export const EXCHANGE_RATES = {
  USD_TO_UYU: 40,
  UYU_TO_USD: 1 / 40,
} as const;

export type Currency = 'USD' | 'UYU';

export interface ConvertedAmount {
  amount: number;
  currency: Currency;
  originalAmount: number;
  originalCurrency: string;
}

/**
 * Convert an amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: Currency
): number {
  // If same currency or no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Normalize currency codes
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  // Convert to UYU first (base currency)
  let amountInUYU = amount;
  if (from === 'USD') {
    amountInUYU = amount * EXCHANGE_RATES.USD_TO_UYU;
  } else if (from !== 'UYU') {
    // For other currencies, assume UYU for now
    amountInUYU = amount;
  }

  // Convert from UYU to target currency
  if (to === 'USD') {
    return amountInUYU * EXCHANGE_RATES.UYU_TO_USD;
  }

  return amountInUYU;
}

/**
 * Convert an array of transactions to a specific currency
 */
export function convertTransactionAmount(
  amount: number,
  currency: string,
  targetCurrency: Currency
): ConvertedAmount {
  const convertedAmount = convertCurrency(amount, currency, targetCurrency);

  return {
    amount: convertedAmount,
    currency: targetCurrency,
    originalAmount: amount,
    originalCurrency: currency,
  };
}

/**
 * Format currency with symbol
 */
export function formatCurrencyWithSymbol(amount: number, currency: Currency): string {
  const symbol = currency === 'USD' ? '$' : '$U';
  return `${symbol} ${amount.toLocaleString('es-UY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : '$U';
}
