'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  X,
  Check,
  Clock,
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Calendar } from './calendar';
import { Card } from './card';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';
import { DateRange } from 'react-day-picker';
import { format, differenceInDays, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export type PeriodType =
  | 'last7days'
  | 'last30days'
  | 'last3months'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'lastYear'
  | 'allTime'
  | 'custom';

interface PeriodPreset {
  id: PeriodType;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'days' | 'months' | 'years' | 'custom';
}

const getCurrentYear = () => new Date().getFullYear();
const getLastYear = () => new Date().getFullYear() - 1;
const getCurrentMonth = () => new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
const getLastMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

const PERIOD_PRESETS: PeriodPreset[] = [
  // Períodos rápidos
  { id: 'last7days', label: 'Últimos 7 días', description: 'Última semana', icon: <Clock className="h-4 w-4" />, category: 'days' },
  { id: 'last30days', label: 'Últimos 30 días', description: 'Último mes', icon: <CalendarDays className="h-4 w-4" />, category: 'days' },

  // Meses
  { id: 'thisMonth', label: 'Este mes', description: getCurrentMonth(), icon: <CalendarIcon className="h-4 w-4" />, category: 'months' },
  { id: 'lastMonth', label: 'Mes pasado', description: getLastMonth(), icon: <CalendarIcon className="h-4 w-4" />, category: 'months' },
  { id: 'last3months', label: 'Últimos 3 meses', description: 'Trimestre móvil', icon: <TrendingUp className="h-4 w-4" />, category: 'months' },

  // Años
  { id: 'thisYear', label: 'Este año', description: `Año ${getCurrentYear()}`, icon: <CalendarIcon className="h-4 w-4" />, category: 'years' },
  { id: 'lastYear', label: 'Año pasado', description: `Año ${getLastYear()}`, icon: <CalendarIcon className="h-4 w-4" />, category: 'years' },
  { id: 'allTime', label: 'Todos los años', description: 'Historial completo', icon: <CalendarRange className="h-4 w-4" />, category: 'years' },

  // Personalizado
  { id: 'custom', label: 'Personalizado', description: 'Elegir fechas', icon: <Sparkles className="h-4 w-4" />, category: 'custom' },
];

interface QuickPick {
  label: string;
  getRange: () => DateRange;
}

const QUICK_PICKS: QuickPick[] = [
  {
    label: 'Esta semana',
    getRange: () => ({
      from: startOfWeek(new Date(), { locale: es }),
      to: endOfWeek(new Date(), { locale: es })
    })
  },
  {
    label: 'Semana pasada',
    getRange: () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return {
        from: startOfWeek(lastWeek, { locale: es }),
        to: endOfWeek(lastWeek, { locale: es })
      };
    }
  },
  {
    label: 'Este mes',
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: 'Mes pasado',
    getRange: () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    }
  },
  {
    label: 'Este trimestre',
    getRange: () => ({
      from: startOfQuarter(new Date()),
      to: endOfQuarter(new Date())
    })
  },
  {
    label: 'Últimos 30 días',
    getRange: () => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 29);
      return { from: thirtyDaysAgo, to: today };
    }
  },
];

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  onCustomRangeChange?: (startDate: string, endDate: string) => void;
  customStartDate?: string;
  customEndDate?: string;
  className?: string;
}

// Helper function to calculate period duration badge
function getPeriodDuration(periodType: PeriodType, customStart?: string, customEnd?: string): string {
  if (periodType === 'custom' && customStart && customEnd) {
    const days = differenceInDays(new Date(customEnd), new Date(customStart)) + 1;
    if (days === 1) return '1 día';
    if (days < 7) return `${days} días`;
    if (days === 7) return '1 semana';
    if (days < 30) return `${Math.floor(days / 7)} semanas`;
    if (days < 365) return `${Math.floor(days / 30)} meses`;
    return `${Math.floor(days / 365)} año${days >= 730 ? 's' : ''}`;
  }

  const durationMap: Record<string, string> = {
    'last7days': '7 días',
    'last30days': '30 días',
    'thisMonth': '1 mes',
    'lastMonth': '1 mes',
    'last3months': '3 meses',
    'thisYear': '1 año',
    'lastYear': '1 año',
    'allTime': 'Todo',
  };

  return durationMap[periodType] || '';
}

// Group presets by category
const groupedPresets = PERIOD_PRESETS.reduce((acc, preset) => {
  if (!acc[preset.category]) {
    acc[preset.category] = [];
  }
  acc[preset.category].push(preset);
  return acc;
}, {} as Record<string, PeriodPreset[]>);

const categoryLabels: Record<string, string> = {
  days: 'Períodos Rápidos',
  months: 'Meses',
  years: 'Año',
  custom: 'Personalizado',
};

export function PeriodSelector({
  value,
  onChange,
  onCustomRangeChange,
  customStartDate = '',
  customEndDate = '',
  className
}: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (customStartDate && customEndDate) {
      return {
        from: new Date(customStartDate),
        to: new Date(customEndDate)
      };
    }
    return undefined;
  });

  const selectedPreset = PERIOD_PRESETS.find(p => p.id === value);
  const durationBadge = getPeriodDuration(value, customStartDate, customEndDate);

  // Format custom description
  const getDescription = () => {
    if (value === 'custom' && customStartDate && customEndDate) {
      const from = new Date(customStartDate);
      const to = new Date(customEndDate);
      return `${format(from, 'd MMM yyyy', { locale: es })} - ${format(to, 'd MMM yyyy', { locale: es })}`;
    }
    return selectedPreset?.description || 'Elegir rango de fechas';
  };

  // Detect screen size for responsive calendar
  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Adjust width based on whether custom calendar is shown
      const dropdownWidth = window.innerWidth < 640
        ? window.innerWidth - 32
        : showCustomCalendar
          ? Math.min(850, window.innerWidth - 32) // Wider for calendar
          : 650;

      let left = rect.left;
      // Check if dropdown would overflow right side
      if (left + dropdownWidth > window.innerWidth) {
        // Align to right edge of trigger button
        left = rect.right - dropdownWidth;
      }
      // Ensure minimum left margin
      if (left < 16) {
        left = 16;
      }

      setDropdownPosition({
        top: rect.bottom + 8,
        left: left,
        width: dropdownWidth
      });
    }
  }, [isOpen, showCustomCalendar]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, PERIOD_PRESETS.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && document.activeElement === dropdownRef.current) {
        e.preventDefault();
        const preset = PERIOD_PRESETS[focusedIndex];
        if (preset) {
          handlePresetClick(preset.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex]);

  const handlePresetClick = (presetId: PeriodType) => {
    if (presetId === 'custom') {
      // Solo mostrar el calendario, no activar el período aún
      setShowCustomCalendar(true);
    } else {
      // Para presets normales, activar inmediatamente
      onChange(presetId);
      setShowCustomCalendar(false);
      setIsOpen(false);
    }
  };

  const handleQuickPick = (quickPick: QuickPick) => {
    const range = quickPick.getRange();
    setDateRange(range);
  };

  const handleApplyCustomRange = () => {
    if (dateRange?.from && dateRange?.to && onCustomRangeChange) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      // Ahora sí activar el período custom con las fechas
      onChange('custom');
      onCustomRangeChange(startDate, endDate);
      setShowCustomCalendar(false);
      setIsOpen(false);
    }
  };

  const handleCancelCustomRange = () => {
    setShowCustomCalendar(false);
    setDateRange(undefined);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-card border-2 border-border rounded-xl hover:border-primary hover:bg-accent/5 transition-all group w-full sm:w-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Seleccionar período de tiempo"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {selectedPreset?.label || 'Seleccionar período'}
              </p>
              {durationBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {durationBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getDescription()}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="fixed z-[110]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            role="dialog"
            aria-label="Selector de período"
            tabIndex={-1}
          >
            <Card className="p-6 shadow-2xl border-2 overflow-visible max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Seleccionar Período</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Cerrar selector"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Presets Grid by Category */}
              <div className="space-y-5 mb-6">
                {Object.entries(groupedPresets).map(([category, presets]) => (
                  <div key={category}>
                    {/* Category Label */}
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>{categoryLabels[category]}</span>
                      <div className="flex-1 h-px bg-border" />
                    </h4>

                    {/* Presets for this category */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {presets.map((preset, index) => {
                        const isSelected = value === preset.id && preset.id !== 'custom';
                        const isCustomActive = preset.id === 'custom' && showCustomCalendar;
                        const globalIndex = PERIOD_PRESETS.indexOf(preset);
                        const isFocused = focusedIndex === globalIndex;

                        return (
                          <motion.button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset.id)}
                            className={cn(
                              'flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all relative',
                              isSelected || isCustomActive
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-primary/50 hover:bg-accent/5',
                              isFocused && 'ring-2 ring-primary/30'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`${preset.label}: ${preset.description}`}
                            aria-pressed={isSelected || isCustomActive}
                          >
                            {(isSelected || isCustomActive) && (
                              <motion.div
                                className="absolute top-2 right-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              >
                                <div className="p-0.5 bg-primary rounded-full">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              </motion.div>
                            )}
                            <div className="flex-shrink-0 text-primary">
                              {preset.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm font-semibold truncate',
                                (isSelected || isCustomActive) ? 'text-primary' : 'text-foreground'
                              )}>
                                {preset.label}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {preset.description}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Date Range with Calendar */}
              <AnimatePresence>
                {showCustomCalendar && (
                  <motion.div
                    className="pt-6 border-t border-border overflow-visible"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground">Rango Personalizado</h4>
                      {dateRange?.from && dateRange?.to && (
                        <span className="text-xs text-muted-foreground">
                          {format(dateRange.from, 'd MMM', { locale: es })} - {format(dateRange.to, 'd MMM yyyy', { locale: es })}
                        </span>
                      )}
                    </div>

                    {/* Quick Picks */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Accesos Rápidos</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_PICKS.map((quickPick) => (
                          <motion.button
                            key={quickPick.label}
                            onClick={() => handleQuickPick(quickPick)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                          >
                            {quickPick.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center overflow-x-auto pb-2">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={numberOfMonths}
                        locale={es}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-2">
                      <div className="text-xs text-muted-foreground">
                        {dateRange?.from && dateRange?.to ? (
                          <span>
                            {differenceInDays(dateRange.to, dateRange.from) + 1} días seleccionados
                          </span>
                        ) : (
                          <span>Selecciona un rango de fechas</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelCustomRange}
                        >
                          Cancelar
                        </Button>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            onClick={handleApplyCustomRange}
                            disabled={!dateRange?.from || !dateRange?.to}
                            className="gap-2"
                            variant="primary"
                          >
                            <Check className="h-4 w-4" />
                            Aplicar
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
