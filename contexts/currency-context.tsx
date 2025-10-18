'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '@/lib/utils/currency';

interface CurrencyContextType {
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'gasty_display_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = useState<Currency>('UYU');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored === 'USD' || stored === 'UYU') {
      setDisplayCurrencyState(stored);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const setDisplayCurrency = (currency: Currency) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  };

  // Don't render until loaded to avoid hydration mismatch
  if (!isLoaded) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ displayCurrency, setDisplayCurrency }}>
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
