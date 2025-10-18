'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './card';
import { iconSizes, typography, transitions } from '@/lib/design-tokens';

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: 'up' | 'down';
    /** Comparison text, e.g., "vs last month" */
    comparison?: string;
  };
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  hoverable?: boolean;
  /** Optional sparkline data for mini trend chart */
  sparklineData?: number[];
  /** Optional progress value (0-100) */
  progress?: number;
  /** Variant for different styling */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Simple SVG sparkline component
 */
function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn('w-full h-full', className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const variantStyles = {
  default: {
    border: 'border-border',
    iconBg: 'bg-muted',
  },
  success: {
    border: 'border-success/20',
    iconBg: 'bg-success/10',
  },
  warning: {
    border: 'border-warning/20',
    iconBg: 'bg-warning/10',
  },
  error: {
    border: 'border-error/20',
    iconBg: 'bg-error/10',
  },
};

export function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  className,
  hoverable = true,
  sparklineData,
  progress,
  variant = 'default',
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <Card className={cn('h-full', styles.border, hoverable && 'hover:shadow-lg', transitions.normal, className)}>
        <CardContent>
          <div className="flex flex-col h-full">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className={cn(typography.label, 'text-muted-foreground')}>{title}</p>
              </div>
              {Icon && (
                <motion.div
                  className={cn('rounded-lg p-2.5', styles.iconBg, iconColor)}
                  whileHover={hoverable ? { scale: 1.1, rotate: 5 } : undefined}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={iconSizes.md} aria-hidden="true" />
                </motion.div>
              )}
            </div>

            {/* Value Row */}
            <div className="flex items-end justify-between gap-3 mb-2">
              <motion.div
                className="flex-1"
                initial={{ scale: 1 }}
                whileHover={hoverable ? { scale: 1.02 } : undefined}
                transition={{ duration: 0.2 }}
              >
                <h3 className={cn(typography.metric, 'text-foreground')}>
                  {value}
                </h3>
              </motion.div>

              {/* Sparkline */}
              {sparklineData && sparklineData.length > 0 && (
                <div className="w-24 h-10 text-primary/60">
                  <Sparkline data={sparklineData} />
                </div>
              )}
            </div>

            {/* Change/Description Row */}
            {change && (
              <div className="flex items-center gap-2 mt-1">
                <motion.div
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    change.trend === 'up'
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {change.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{change.value}</span>
                </motion.div>
                {change.comparison && (
                  <span className={cn(typography.caption, 'text-muted-foreground')}>
                    {change.comparison}
                  </span>
                )}
              </div>
            )}

            {description && !change && (
              <p className={cn(typography.bodySmall, 'text-muted-foreground mt-1')}>
                {description}
              </p>
            )}

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      variant === 'success' ? 'bg-success' :
                      variant === 'warning' ? 'bg-warning' :
                      variant === 'error' ? 'bg-error' : 'bg-primary'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <p className={cn(typography.caption, 'text-muted-foreground text-right mt-1')}>
                  {progress.toFixed(0)}% of goal
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
