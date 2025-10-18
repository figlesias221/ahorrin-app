'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/formatters';
import type { ComparisonMetric } from '@/types/dashboard';

interface ComparisonMetricCardProps {
  metric: ComparisonMetric;
  displayCurrency: 'USD' | 'UYU';
}

export function ComparisonMetricCard({ metric, displayCurrency }: ComparisonMetricCardProps) {
  const value = metric.value;
  const compareValue = metric.compareValue ?? 0;
  const hasCompare = metric.compareValue !== null;
  const maxValue = Math.max(value, hasCompare ? compareValue : 0, 1);
  const delta = hasCompare ? value - compareValue : 0;
  const deltaPercent = hasCompare && compareValue !== 0
    ? ((value - compareValue) / Math.abs(compareValue)) * 100
    : null;
  const deltaIsPositive = delta >= 0;
  const arrowIcon = deltaIsPositive ? (
    <ArrowUpRight className="h-3.5 w-3.5" />
  ) : (
    <ArrowDownRight className="h-3.5 w-3.5" />
  );
  const valueClass = metric.key === 'savings'
    ? (value >= 0 ? 'text-success' : 'text-error')
    : metric.valueClassName;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {metric.title}
          </p>
          <p className={cn('mt-2 text-2xl font-semibold', valueClass)}>
            {formatCurrency(value, displayCurrency)}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {metric.icon}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          {hasCompare && (
            <div
              className="absolute inset-y-0 left-0 rounded-full opacity-60"
              style={{
                width: `${Math.min(100, (compareValue / maxValue) * 100)}%`,
                backgroundColor: metric.comparisonColor,
              }}
            />
          )}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${Math.min(100, (value / maxValue) * 100)}%`,
              backgroundColor: metric.accentColor,
            }}
          />
        </div>

        {hasCompare && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>vs {formatCurrency(compareValue, displayCurrency)}</span>
            {deltaPercent !== null && compareValue !== 0 && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
                  deltaIsPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                )}
              >
                {arrowIcon}
                {Math.abs(deltaPercent).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
