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
 * @param customRates Optional custom exchange rates to use instead of defaults
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: Currency,
  customRates?: {
    USD_TO_UYU?: number;
  }
): number {
  // If same currency or no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Use custom rates if provided, otherwise use defaults
  const rates = {
    USD_TO_UYU: customRates?.USD_TO_UYU ?? EXCHANGE_RATES.USD_TO_UYU,
    UYU_TO_USD: customRates?.USD_TO_UYU ? 1 / customRates.USD_TO_UYU : EXCHANGE_RATES.UYU_TO_USD,
  };

  // Normalize currency codes
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  // Convert to UYU first (base currency)
  let amountInUYU = amount;
  if (from === 'USD') {
    amountInUYU = amount * rates.USD_TO_UYU;
  } else if (from !== 'UYU') {
    // For other currencies, assume UYU for now
    amountInUYU = amount;
  }

  // Convert from UYU to target currency
  if (to === 'USD') {
    return amountInUYU * rates.UYU_TO_USD;
  }

  return amountInUYU;
}

/**
 * Convert an array of transactions to a specific currency
 */
export function convertTransactionAmount(
  amount: number,
  currency: string,
  targetCurrency: Currency,
  customRates?: {
    USD_TO_UYU?: number;
  }
): ConvertedAmount {
  const convertedAmount = convertCurrency(amount, currency, targetCurrency, customRates);

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
  const symbol = getCurrencySymbol(currency);
  const locale = 'es-UY';
  return `${symbol} ${amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'UYU':
      return '$U';
    default:
      return '$';
  }
}
