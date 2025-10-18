'use client';

import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { PeriodSelector } from '@/components/ui/period-selector';
import type { PeriodType } from '@/types/dashboard';

interface TemporalAnalysisHeaderProps {
  comparePreset: 'previous-period' | 'previous-year' | 'custom' | null;
  showCompareSelector: boolean;
  comparePeriodType: PeriodType;
  compareStartDate: string;
  compareEndDate: string;
  onComparePreviousPeriod: () => void;
  onComparePreviousYear: () => void;
  onToggleCustomSelector: () => void;
  onComparePeriodChange: (period: PeriodType) => void;
  onCompareRangeChange: (start: string, end: string) => void;
}

export function TemporalAnalysisHeader({
  comparePreset,
  showCompareSelector,
  comparePeriodType,
  compareStartDate,
  compareEndDate,
  onComparePreviousPeriod,
  onComparePreviousYear,
  onToggleCustomSelector,
  onComparePeriodChange,
  onCompareRangeChange,
}: TemporalAnalysisHeaderProps) {
  return (
    <Card className="p-5 border-2 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Análisis Temporal</h2>
            <p className="text-xs text-muted-foreground">Evolución y comparación de tus finanzas</p>
          </div>
        </div>
        
        {/* Quick Compare Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Comparar:</span>
          <button
            type="button"
            onClick={onComparePreviousPeriod}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              comparePreset === 'previous-period'
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background hover:bg-muted/50'
            )}
          >
            Período anterior
          </button>
          <button
            type="button"
            onClick={onComparePreviousYear}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              comparePreset === 'previous-year'
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background hover:bg-muted/50'
            )}
          >
            Año anterior
          </button>
          <button
            type="button"
            onClick={onToggleCustomSelector}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              comparePreset === 'custom' || showCompareSelector
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background hover:bg-muted/50'
            )}
          >
            Personalizado
          </button>
        </div>
      </div>
      
      {/* Custom Period Selector */}
      {showCompareSelector && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <PeriodSelector
            value={comparePeriodType}
            onChange={(period) => {
              onComparePeriodChange(period);
            }}
            onCustomRangeChange={onCompareRangeChange}
            customStartDate={compareStartDate}
            customEndDate={compareEndDate}
            className="w-full"
          />
        </div>
      )}
    </Card>
  );
}
