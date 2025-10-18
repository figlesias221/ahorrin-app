'use client';

import { cn } from '@/lib/utils/cn';

interface PeriodComparisonBannerProps {
  baseRangeLabel: string;
  compareRangeLabel: string;
  baseDurationLabel: string;
  compareDurationLabel: string;
  durationsMatch: boolean;
  baseDurationDays: number | null;
  compareDurationDays: number | null;
}

export function PeriodComparisonBanner({
  baseRangeLabel,
  compareRangeLabel,
  baseDurationLabel,
  compareDurationLabel,
  durationsMatch,
  baseDurationDays,
  compareDurationDays,
}: PeriodComparisonBannerProps) {
  return (
    <div className="mb-6 rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-xs sm:text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span className="font-semibold text-foreground">Período base</span>
          <span className="rounded-full border border-border/50 bg-background px-2 py-0.5 text-foreground">
            {baseRangeLabel}
          </span>
          {baseDurationLabel && (
            <span className="rounded-full bg-muted px-2 py-0.5">{baseDurationLabel}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span className="font-semibold text-foreground">Comparando con</span>
          <span className="rounded-full border border-border/50 bg-background px-2 py-0.5 text-foreground">
            {compareRangeLabel}
          </span>
          {compareDurationLabel && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-medium',
                durationsMatch ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              )}
            >
              {compareDurationLabel}
            </span>
          )}
        </div>
      </div>
      {!durationsMatch && baseDurationDays !== null && compareDurationDays !== null && (
        <p className="mt-3 text-[11px] text-warning">
          Los períodos tienen duraciones diferentes ({baseDurationDays} vs {compareDurationDays} días). 
          Considera ajustar el rango para una comparación equivalente.
        </p>
      )}
    </div>
  );
}
