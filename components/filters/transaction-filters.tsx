'use client';

import { useState, useRef } from 'react';
import { TransactionFilters, Category, BankStatement } from '@/types';
import { X, TrendingUp, TrendingDown, DollarSign, Tag, Banknote, ChevronDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateFilterEnhanced } from './date-filter-enhanced';

interface TransactionFiltersPanelProps {
  filters: TransactionFilters;
  categories: Category[];
  statements: BankStatement[];
  onFiltersChange: (filters: TransactionFilters) => void;
  onClose: () => void;
}

export function TransactionFiltersPanel({
  filters,
  categories,
  statements,
  onFiltersChange,
  onClose,
}: TransactionFiltersPanelProps) {
  const [showCategories, setShowCategories] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [showBanks, setShowBanks] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [statementsDropdownPosition, setStatementsDropdownPosition] = useState({ top: 0, left: 0 });
  const [banksDropdownPosition, setBanksDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const statementsButtonRef = useRef<HTMLButtonElement>(null);
  const banksButtonRef = useRef<HTMLButtonElement>(null);

  const handleReset = () => {
    onFiltersChange({});
  };

  const handleToggleCategories = () => {
    if (!showCategories && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setShowCategories(!showCategories);
  };

  const handleToggleStatements = () => {
    if (!showStatements && statementsButtonRef.current) {
      const rect = statementsButtonRef.current.getBoundingClientRect();
      setStatementsDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setShowStatements(!showStatements);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    onFiltersChange({
      ...filters,
      dateFrom: range.from,
      dateTo: range.to,
    });
  };

  const handleClearDateFilter = () => {
    onFiltersChange({
      ...filters,
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value ? (value as 'expense' | 'income') : undefined,
    });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = filters.categoryIds || [];
    const newCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter(id => id !== categoryId);

    onFiltersChange({
      ...filters,
      categoryIds: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleMinAmountChange = (value: string) => {
    onFiltersChange({
      ...filters,
      minAmount: value ? parseFloat(value) : undefined,
    });
  };

  const handleMaxAmountChange = (value: string) => {
    onFiltersChange({
      ...filters,
      maxAmount: value ? parseFloat(value) : undefined,
    });
  };

  const handleCurrencyChange = (currency: string, checked: boolean) => {
    const currentCurrencies = filters.currencies || [];
    const newCurrencies = checked
      ? [...currentCurrencies, currency]
      : currentCurrencies.filter(c => c !== currency);

    onFiltersChange({
      ...filters,
      currencies: newCurrencies.length > 0 ? newCurrencies : undefined,
    });
  };

  const handleStatementChange = (statementId: string) => {
    onFiltersChange({
      ...filters,
      statementId: statementId || undefined,
    });
    setShowStatements(false);
  };

  const handleToggleBanks = () => {
    if (!showBanks && banksButtonRef.current) {
      const rect = banksButtonRef.current.getBoundingClientRect();
      setBanksDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setShowBanks(!showBanks);
  };

  const handleBankChange = (bank: string, checked: boolean) => {
    const currentBanks = filters.banks || [];
    const newBanks = checked
      ? [...currentBanks, bank]
      : currentBanks.filter(b => b !== bank);

    onFiltersChange({
      ...filters,
      banks: newBanks.length > 0 ? newBanks : undefined,
    });
  };

  // Get unique banks from statements
  const uniqueBanks = Array.from(new Set(statements.map(s => s.bank).filter(Boolean))) as string[];

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof TransactionFilters];
    return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);
  }).length;

  return (
    <Card className="p-5 space-y-5 bg-gradient-to-br from-card via-card/95 to-muted/10 shadow-lg border-border/50">
      {/* Enhanced Date Filter */}
      <DateFilterEnhanced
        value={{ from: filters.dateFrom, to: filters.dateTo }}
        onChange={handleDateRangeChange}
        onClear={handleClearDateFilter}
      />

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* Other Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type Buttons */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Tipo:</label>
          <div className="flex items-center gap-1.5 bg-muted/30 rounded-full p-0.5">
            <button
              onClick={() => handleTypeChange('')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                !filters.type
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              Todos
            </button>
            <button
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filters.type === 'expense'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              Gastos
            </button>
            <button
              onClick={() => handleTypeChange('income')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filters.type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Ingresos
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

        {/* Amount Range */}
        <div className="flex items-center gap-2.5">
          <Banknote className="h-4 w-4 text-primary/60 flex-shrink-0" />
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Monto:</label>
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">$</span>
              <input
                type="number"
                step="0.01"
                value={filters.minAmount || ''}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                placeholder="Min"
                className="w-24 pl-7 pr-2 py-2 rounded-md border border-transparent bg-background/60 text-foreground text-xs font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all"
              />
            </div>
            <span className="text-xs text-muted-foreground font-bold">→</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">$</span>
              <input
                type="number"
                step="0.01"
                value={filters.maxAmount || ''}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                placeholder="Max"
                className="w-24 pl-7 pr-2 py-2 rounded-md border border-transparent bg-background/60 text-foreground text-xs font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all"
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

        {/* Currency Buttons */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Moneda:</label>
          <div className="flex items-center gap-1.5">
            {['UYU', 'USD', 'EUR'].map((currency) => {
              const isSelected = filters.currencies?.includes(currency) || false;
              return (
                <label
                  key={currency}
                  className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                      : 'bg-muted/40 text-foreground/60 hover:bg-muted/60 hover:text-foreground border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCurrencyChange(currency, e.target.checked)}
                    className="sr-only"
                  />
                  {currency}
                </label>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

        {/* Statements Dropdown */}
        <div className="relative flex items-center gap-2.5">
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Extracto:</label>
          <button
            ref={statementsButtonRef}
            onClick={handleToggleStatements}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-semibold whitespace-nowrap ${
              showStatements
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                : 'bg-muted/40 text-foreground hover:bg-muted/60 border border-transparent hover:border-border/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            {filters.statementId ? (
              <>
                Seleccionado
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">1</span>
              </>
            ) : (
              'Todos'
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showStatements ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showStatements && (
            <>
              {/* Backdrop to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowStatements(false)}
              />

              {/* Dropdown content */}
              <div
                className="fixed w-64 max-h-80 overflow-y-auto bg-card text-card-foreground border border-border rounded-lg shadow-xl z-50 p-3"
                style={{
                  top: `${statementsDropdownPosition.top}px`,
                  left: `${statementsDropdownPosition.left}px`,
                }}
              >
                {/* All option */}
                <button
                  onClick={() => handleStatementChange('')}
                  className={`w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded transition-all text-left ${
                    !filters.statementId ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
                  }`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-xs flex-1 font-semibold">Todos los extractos</span>
                </button>

                {statements.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No hay extractos
                  </p>
                ) : (
                  statements.map((statement: any) => {
                    const isSelected = filters.statementId === statement.id;
                    const date = new Date(statement.upload_date);
                    return (
                      <button
                        key={statement.id}
                        onClick={() => handleStatementChange(statement.id)}
                        className={`w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded transition-all text-left ${
                          isSelected ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
                        }`}
                      >
                        <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs font-medium truncate">{statement.file_name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {date.toLocaleDateString()} · {statement.transactions_count} trans.
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

        {/* Banks Dropdown */}
        <div className="relative flex items-center gap-2.5">
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Banco:</label>
          <button
            ref={banksButtonRef}
            onClick={handleToggleBanks}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-semibold whitespace-nowrap ${
              showBanks
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                : 'bg-muted/40 text-foreground hover:bg-muted/60 border border-transparent hover:border-border/50'
            }`}
          >
            <Banknote className="h-4 w-4" />
            {filters.banks && filters.banks.length > 0 ? (
              <>
                Seleccionados
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
                  {filters.banks.length}
                </span>
              </>
            ) : (
              'Todos'
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showBanks ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showBanks && (
            <>
              {/* Backdrop to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowBanks(false)}
              />

              {/* Dropdown content */}
              <div
                className="fixed w-56 max-h-80 overflow-y-auto bg-card text-card-foreground border border-border rounded-lg shadow-xl z-50 p-3"
                style={{
                  top: `${banksDropdownPosition.top}px`,
                  left: `${banksDropdownPosition.left}px`,
                }}
              >
                {uniqueBanks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No hay bancos disponibles
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {uniqueBanks.sort().map((bank) => {
                      const isChecked = filters.banks?.includes(bank) || false;
                      return (
                        <label
                          key={bank}
                          className="flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleBankChange(bank, e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 transition-all"
                          />
                          <div className="flex flex-col flex-1">
                            <span className="text-xs font-medium">{bank}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

        {/* Categories Dropdown */}
        <div className="relative flex items-center gap-2.5">
          <label className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Categorías:</label>
          <button
            ref={buttonRef}
            onClick={handleToggleCategories}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-semibold whitespace-nowrap ${
              showCategories
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                : 'bg-muted/40 text-foreground hover:bg-muted/60 border border-transparent hover:border-border/50'
            }`}
          >
            <Tag className="h-4 w-4" />
            {filters.categoryIds && filters.categoryIds.length > 0 ? (
              <>
                Seleccionadas
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
                  {filters.categoryIds.length}
                </span>
              </>
            ) : (
              'Todas'
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showCategories && (
            <>
              {/* Backdrop to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCategories(false)}
              />

              {/* Dropdown content */}
              <div
                className="fixed w-56 max-h-80 overflow-y-auto bg-card text-card-foreground border border-border rounded-lg shadow-xl z-50 p-3"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                {categories.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No hay categorías
                  </p>
                ) : (
                  categories.map(category => {
                    const isSelected = filters.categoryIds?.includes(category.id) || false;
                    return (
                      <label
                        key={category.id}
                        className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded transition-all ${
                          isSelected ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs flex-1">{category.name}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                          className="h-3 w-3 rounded border-border"
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-600 hover:from-red-500/20 hover:to-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all text-xs font-semibold whitespace-nowrap"
            >
              <X className="h-4 w-4" />
              Limpiar Todo
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 transition-all text-xs font-bold whitespace-nowrap shadow-lg"
          >
            Aplicar Filtros
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-white/25 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
