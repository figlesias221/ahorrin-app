'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { heights, borderRadius, transitions, typography, iconSizes, zIndex } from '@/lib/design-tokens';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  disabled = false,
  className,
  label,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top?: number; bottom?: number; left: number; width: number }>({ left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchText.toLowerCase()) ||
    opt.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 320; // max-h-80 = 320px
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const padding = 8;

      // Determine if dropdown should open upwards or downwards
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      // Calculate left position, ensuring it doesn't overflow right edge
      let left = rect.left;
      const maxWidth = Math.min(rect.width, window.innerWidth - left - 16);

      if (left + rect.width > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - rect.width - 16);
      }

      setDropdownPosition({
        ...(shouldOpenUpward
          ? { bottom: window.innerHeight - rect.top + padding }
          : { top: rect.bottom + padding }
        ),
        left,
        width: maxWidth,
      });
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className={cn('block mb-2 text-foreground', typography.label)}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-4 border-2 border-border bg-background text-foreground text-left',
          heights.input,
          borderRadius.base,
          transitions.normal,
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'flex items-center justify-between gap-3',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error focus:ring-error',
          isOpen && 'ring-2 ring-primary border-primary'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption ? (
            <>
              {selectedOption.color && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-foreground font-medium truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.description && (
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedOption.description}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            iconSizes.sm,
            'text-muted-foreground transition-transform flex-shrink-0',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && isMounted && createPortal(
        <div
          ref={dropdownRef}
          className={cn('fixed bg-card text-card-foreground border-2 border-border shadow-xl overflow-hidden flex flex-col', borderRadius.base, zIndex.dropdown)}
          style={{
            top: dropdownPosition.top !== undefined ? `${dropdownPosition.top}px` : undefined,
            bottom: dropdownPosition.bottom !== undefined ? `${dropdownPosition.bottom}px` : undefined,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: '320px',
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 && !searchText ? (
              <div className="px-4 py-4 text-sm text-muted-foreground text-center">
                No hay opciones disponibles
              </div>
            ) : searchText && filteredOptions.length === 0 ? (
              <div className="px-4 py-4 text-sm text-muted-foreground text-center">
                No se encontraron opciones
              </div>
            ) : (
              <div className="py-2">
                {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center gap-3',
                    'hover:bg-muted hover:text-foreground transition-colors',
                    value === option.value && 'bg-muted text-foreground'
                  )}
                >
                  {option.color && (
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-foreground font-medium truncate">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className={cn(iconSizes.sm, 'text-primary flex-shrink-0')} />
                  )}
                </button>
              ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
