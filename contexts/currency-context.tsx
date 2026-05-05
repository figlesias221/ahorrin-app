'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, EXCHANGE_RATES } from '@/lib/utils/currency';
import { createClient } from '@/lib/supabase/client';

export interface ExchangeRates {
  USD_TO_UYU: number;
}

interface CurrencyContextType {
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
  enabledCurrencies: Currency[];
  setEnabledCurrencies: (currencies: Currency[]) => void;
  exchangeRates: ExchangeRates;
  setExchangeRates: (rates: ExchangeRates) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'ahorrin_display_currency';
const DEFAULT_ENABLED_CURRENCIES: Currency[] = ['UYU', 'USD'];
const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  USD_TO_UYU: EXCHANGE_RATES.USD_TO_UYU,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = useState<Currency>('UYU');
  const [enabledCurrencies, setEnabledCurrenciesState] = useState<Currency[]>(DEFAULT_ENABLED_CURRENCIES);
  const [exchangeRates, setExchangeRatesState] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // Load preferences from user metadata and localStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load enabled currencies from user metadata
        const { data: { user } } = await supabase.auth.getUser();

        // Load exchange rates from user metadata
        if (user?.user_metadata?.exchange_rates) {
          setExchangeRatesState(user.user_metadata.exchange_rates as ExchangeRates);
        }

        if (user?.user_metadata?.enabled_currencies) {
          const enabled = user.user_metadata.enabled_currencies as Currency[];
          setEnabledCurrenciesState(enabled);

          // Load display currency from localStorage
          const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
          if (stored && (stored === 'USD' || stored === 'UYU')) {
            // Only set if the stored currency is enabled
            if (enabled.includes(stored as Currency)) {
              setDisplayCurrencyState(stored as Currency);
            } else if (enabled.length > 0) {
              // Otherwise use the first enabled currency
              setDisplayCurrencyState(enabled[0]);
            }
          } else if (enabled.length > 0) {
            setDisplayCurrencyState(enabled[0]);
          }
        } else {
          // No preferences saved, use defaults
          const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
          if (stored === 'USD' || stored === 'UYU') {
            setDisplayCurrencyState(stored);
          }
        }
      } catch (error) {
        console.error('Error loading currency preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreferences();
  }, [supabase]);

  // Save to localStorage when changed
  const setDisplayCurrency = (currency: Currency) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  };

  // Save enabled currencies to user metadata
  const setEnabledCurrencies = async (currencies: Currency[]) => {
    if (currencies.length === 0) {
      console.warn('Cannot disable all currencies');
      return;
    }

    setEnabledCurrenciesState(currencies);

    try {
      await supabase.auth.updateUser({
        data: { enabled_currencies: currencies }
      });

      // If current display currency is not in enabled list, switch to first enabled
      if (!currencies.includes(displayCurrency)) {
        setDisplayCurrency(currencies[0]);
      }
    } catch (error) {
      console.error('Error saving currency preferences:', error);
    }
  };

  // Save exchange rates to user metadata
  const setExchangeRates = async (rates: ExchangeRates) => {
    setExchangeRatesState(rates);

    try {
      await supabase.auth.updateUser({
        data: { exchange_rates: rates }
      });
    } catch (error) {
      console.error('Error saving exchange rates:', error);
    }
  };

  // Don't render until loaded to avoid hydration mismatch
  if (!isLoaded) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{
      displayCurrency,
      setDisplayCurrency,
      enabledCurrencies,
      setEnabledCurrencies,
      exchangeRates,
      setExchangeRates,
      isLoading: !isLoaded
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
