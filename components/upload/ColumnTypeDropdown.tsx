'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { ColumnType } from '@/lib/parsers/preview-types';

interface ColumnTypeOption {
  value: ColumnType;
  label: string;
}

const COLUMN_TYPE_OPTIONS: ColumnTypeOption[] = [
  { value: 'date', label: 'Fecha' },
  { value: 'vendor', label: 'Concepto' },
  { value: 'reference', label: 'Referencia' },
  { value: 'amount_usd', label: 'Monto USD' },
  { value: 'amount_uyu', label: 'Monto UYU' },
  { value: 'category', label: 'Categoría' },
  { value: 'unknown', label: 'Ignorar' },
];

interface ColumnTypeDropdownProps {
  value: ColumnType;
  onChange: (value: ColumnType) => void;
  columnName: string;
}

export function ColumnTypeDropdown({ value, onChange, columnName }: ColumnTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = COLUMN_TYPE_OPTIONS.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: ColumnTypeOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const getButtonColor = () => {
    switch (value) {
      case 'date':
      case 'amount':
      case 'amount_usd':
      case 'amount_uyu':
      case 'vendor':
      case 'reference':
        return 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100';
      case 'category':
        return 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100';
      case 'unknown':
        return 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200';
      default:
        return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium border rounded-lg transition-all ${getButtonColor()} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <span className="truncate">
          {selectedOption?.label || 'Seleccionar'}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
          {/* Column name header */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-700 truncate" title={columnName}>
              Columna: {columnName}
            </p>
          </div>

          {/* Options */}
          <div className="py-1">
            {COLUMN_TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors ${
                  option.value === value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="h-3.5 w-3.5 text-blue-700" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
