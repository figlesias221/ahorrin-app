'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'thisYear'
  | 'custom';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateFilterEnhancedProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onClear?: () => void;
}

const presetConfigs: Array<{
  id: DatePreset;
  label: string;
  shortLabel?: string;
}> = [
  { id: 'today', label: 'Hoy', shortLabel: 'Hoy' },
  { id: 'yesterday', label: 'Ayer', shortLabel: 'Ayer' },
  { id: 'last7', label: 'Últimos 7 días', shortLabel: '7d' },
  { id: 'last30', label: 'Últimos 30 días', shortLabel: '30d' },
  { id: 'thisMonth', label: 'Este mes', shortLabel: 'Este mes' },
  { id: 'lastMonth', label: 'Mes anterior', shortLabel: 'Mes ant.' },
  { id: 'last3Months', label: 'Últimos 3 meses', shortLabel: '3m' },
  { id: 'thisYear', label: 'Este año', shortLabel: 'Este año' },
];

export function DateFilterEnhanced({ value, onChange, onClear }: DateFilterEnhancedProps) {
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const getDateRange = (preset: DatePreset): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    const from = new Date();
    from.setHours(0, 0, 0, 0); // Start of day

    switch (preset) {
      case 'today':
        return { from, to: today };

      case 'yesterday':
        const yesterday = new Date(from);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return { from: yesterday, to: yesterdayEnd };

      case 'last7':
        const last7 = new Date(from);
        last7.setDate(last7.getDate() - 6);
        return { from: last7, to: today };

      case 'last30':
        const last30 = new Date(from);
        last30.setDate(last30.getDate() - 29);
        return { from: last30, to: today };

      case 'thisMonth':
        const thisMonth = new Date(from);
        thisMonth.setDate(1);
        return { from: thisMonth, to: today };

      case 'lastMonth':
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
        return { from: lastMonthStart, to: lastMonthEnd };

      case 'last3Months':
        const last3Months = new Date(from);
        last3Months.setMonth(last3Months.getMonth() - 3);
        last3Months.setDate(1);
        return { from: last3Months, to: today };

      case 'thisYear':
        const thisYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        return { from: thisYear, to: today };

      default:
        return { from: undefined, to: undefined };
    }
  };

  const handlePresetClick = (preset: DatePreset) => {
    const range = getDateRange(preset);
    setActivePreset(preset);
    setShowCustom(false);
    onChange(range);
  };

  const handleCustomClick = () => {
    setShowCustom(!showCustom);
    setActivePreset('custom');
  };

  const handleCustomFromChange = (date: string) => {
    const newFrom = date ? new Date(date) : undefined;
    if (newFrom) {
      newFrom.setHours(0, 0, 0, 0);
    }
    onChange({ from: newFrom, to: value.to });
  };

  const handleCustomToChange = (date: string) => {
    const newTo = date ? new Date(date) : undefined;
    if (newTo) {
      newTo.setHours(23, 59, 59, 999);
    }
    onChange({ from: value.from, to: newTo });
  };

  const handleClear = () => {
    setActivePreset(null);
    setShowCustom(false);
    onChange({ from: undefined, to: undefined });
    onClear?.();
  };

  const hasActiveFilter = value.from || value.to;

  return (
    <div className="space-y-4">
      {/* Preset Pills - Desktop */}
      <div className="hidden lg:flex items-center gap-2 flex-wrap overflow-visible">
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />

        {presetConfigs.map((preset) => (
          <motion.button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${activePreset === preset.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-foreground hover:bg-muted border border-transparent hover:border-border'
              }
            `}
          >
            {preset.label}
          </motion.button>
        ))}

        {/* Custom Button */}
        <motion.button
          onClick={handleCustomClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5
            ${activePreset === 'custom' && showCustom
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/50 text-foreground hover:bg-muted border border-transparent hover:border-border'
            }
          `}
        >
          <Calendar className="h-3 w-3" />
          Personalizado
        </motion.button>

        {/* Clear Button */}
        <AnimatePresence>
          {hasActiveFilter && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-red-500/10 text-red-600 hover:bg-red-500/20
                border border-red-500/20 hover:border-red-500/30
                transition-all flex items-center gap-1.5
              "
            >
              <X className="h-3 w-3" />
              Limpiar
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Preset Pills - Mobile (Horizontal Scroll) */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />

        {presetConfigs.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 whitespace-nowrap
              ${activePreset === preset.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-foreground hover:bg-muted border border-transparent hover:border-border'
              }
            `}
          >
            {preset.shortLabel || preset.label}
          </button>
        ))}

        <button
          onClick={handleCustomClick}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0
            ${activePreset === 'custom' && showCustom
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/50 text-foreground hover:bg-muted border border-transparent hover:border-border'
            }
          `}
        >
          <Calendar className="h-3 w-3" />
          Custom
        </button>

        {hasActiveFilter && (
          <button
            onClick={handleClear}
            className="
              px-3 py-1.5 rounded-full text-xs font-medium shrink-0
              bg-red-500/10 text-red-600 hover:bg-red-500/20
              border border-red-500/20 hover:border-red-500/30
              transition-all flex items-center gap-1.5
            "
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Custom Date Inputs */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-visible"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pl-0 sm:pl-8">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs text-muted-foreground font-medium whitespace-nowrap">Desde:</label>
                <input
                  type="date"
                  value={value.from ? value.from.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleCustomFromChange(e.target.value)}
                  className="
                    flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all
                  "
                />
              </div>

              <span className="hidden sm:inline text-xs text-muted-foreground">→</span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs text-muted-foreground font-medium whitespace-nowrap">Hasta:</label>
                <input
                  type="date"
                  value={value.to ? value.to.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleCustomToChange(e.target.value)}
                  className="
                    flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all
                  "
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Range Indicator */}
      <AnimatePresence>
        {hasActiveFilter && value.from && value.to && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-primary/5 border border-primary/10
              text-xs text-muted-foreground
            "
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>
              Mostrando transacciones desde{' '}
              <span className="font-semibold text-foreground">
                {value.from.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: value.from.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                })}
              </span>
              {' '}hasta{' '}
              <span className="font-semibold text-foreground">
                {value.to.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: value.to.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                })}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
