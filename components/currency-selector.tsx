'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { Currency } from '@/lib/utils/currency';

const CURRENCIES = [
  { value: 'UYU' as Currency, label: 'UYU', symbol: '$U', flag: '🇺🇾' },
  { value: 'USD' as Currency, label: 'USD', symbol: '$', flag: '🇺🇸' },
  { value: 'ARS' as Currency, label: 'ARS', symbol: '$', flag: '🇦🇷' },
];

export function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency, enabledCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter to show only enabled currencies
  const availableCurrencies = CURRENCIES.filter(c => enabledCurrencies.includes(c.value));
  const selectedCurrency = availableCurrencies.find(c => c.value === displayCurrency) || availableCurrencies[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (currency: Currency) => {
    setDisplayCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Simplified */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all text-sm
          ${isOpen
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50'
          }
        `}
      >
        <span className="text-base leading-none">{selectedCurrency.flag}</span>
        <span className="font-medium text-foreground">
          {selectedCurrency.label}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu - Simplified */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 min-w-[100px] bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden py-1">
          {availableCurrencies.map((currency) => {
            const isSelected = currency.value === displayCurrency;

            return (
              <button
                key={currency.value}
                onClick={() => handleSelect(currency.value)}
                className={`
                  w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors
                  ${isSelected
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted/50 text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{currency.flag}</span>
                  <span className="text-sm">
                    {currency.label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
