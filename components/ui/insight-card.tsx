'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { borderRadius, typography, transitions, motionVariants } from '@/lib/design-tokens';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Info, CheckCircle, ArrowRight } from 'lucide-react';

export type InsightType = 'success' | 'warning' | 'info' | 'tip' | 'trend-up' | 'trend-down';

interface InsightCardProps {
  /** Type of insight - determines icon and color scheme */
  type: InsightType;
  /** Main title/heading of the insight */
  title: string;
  /** Detailed description or recommendation */
  description: string;
  /** Optional metric or data point to highlight */
  metric?: string;
  /** Optional action button text */
  actionLabel?: string;
  /** Optional action handler */
  onAction?: () => void;
  /** Additional custom className */
  className?: string;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Dismiss handler */
  onDismiss?: () => void;
}

const insightConfig: Record<InsightType, {
  icon: React.ElementType;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconClass: string;
  textClass: string;
}> = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-success/5',
    borderClass: 'border-success/20',
    iconBgClass: 'bg-success/10',
    iconClass: 'text-success',
    textClass: 'text-success-600',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-warning/5',
    borderClass: 'border-warning/20',
    iconBgClass: 'bg-warning/10',
    iconClass: 'text-warning',
    textClass: 'text-warning-600',
  },
  info: {
    icon: Info,
    bgClass: 'bg-primary/5',
    borderClass: 'border-primary/20',
    iconBgClass: 'bg-primary/10',
    iconClass: 'text-primary',
    textClass: 'text-primary',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-accent-purple/5',
    borderClass: 'border-accent-purple/20',
    iconBgClass: 'bg-accent-purple/10',
    iconClass: 'text-accent-purple',
    textClass: 'text-accent-purple',
  },
  'trend-up': {
    icon: TrendingUp,
    bgClass: 'bg-success/5',
    borderClass: 'border-success/20',
    iconBgClass: 'bg-success/10',
    iconClass: 'text-success',
    textClass: 'text-success',
  },
  'trend-down': {
    icon: TrendingDown,
    bgClass: 'bg-error/5',
    borderClass: 'border-error/20',
    iconBgClass: 'bg-error/10',
    iconClass: 'text-error',
    textClass: 'text-error',
  },
};

export function InsightCard({
  type,
  title,
  description,
  metric,
  actionLabel,
  onAction,
  className,
  dismissible = false,
  onDismiss,
}: InsightCardProps) {
  const config = insightConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={motionVariants.slideUp}
      className={cn(
        'relative overflow-hidden border',
        borderRadius.card,
        config.bgClass,
        config.borderClass,
        transitions.fast,
        'hover:shadow-md',
        className
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 p-2.5 rounded-lg',
            config.iconBgClass
          )}>
            <Icon className={cn('h-5 w-5', config.iconClass)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className={cn(typography.h5, 'mb-1.5')}>{title}</h4>
                <p className={cn(typography.bodySmall, 'text-muted-foreground')}>
                  {description}
                </p>
              </div>

              {/* Metric */}
              {metric && (
                <div className="flex-shrink-0">
                  <span className={cn(typography.metricSm, config.textClass)}>
                    {metric}
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className={cn(
                  'mt-3 inline-flex items-center gap-1.5 text-sm font-medium',
                  config.textClass,
                  transitions.fast,
                  'hover:gap-2'
                )}
              >
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className={cn(
                'flex-shrink-0 p-1 rounded hover:bg-muted/50',
                transitions.fast
              )}
              aria-label="Dismiss insight"
            >
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * InsightCardGroup - Display multiple insights in a grid
 */
interface InsightCardGroupProps {
  children: ReactNode;
  className?: string;
}

export function InsightCardGroup({ children, className }: InsightCardGroupProps) {
  return (
    <motion.div
      variants={motionVariants.staggerContainer}
      initial="initial"
      animate="animate"
      className={cn('grid gap-4 md:grid-cols-2', className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * CompactInsightCard - Smaller version for sidebar or condensed layouts
 */
interface CompactInsightCardProps {
  type: InsightType;
  title: string;
  metric?: string;
  className?: string;
}

export function CompactInsightCard({
  type,
  title,
  metric,
  className,
}: CompactInsightCardProps) {
  const config = insightConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 border rounded-lg',
        config.bgClass,
        config.borderClass,
        transitions.fast,
        'hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn('p-1.5 rounded', config.iconBgClass)}>
          <Icon className={cn('h-4 w-4', config.iconClass)} />
        </div>
        <span className={cn(typography.bodySmall, 'font-medium truncate')}>{title}</span>
      </div>
      {metric && (
        <span className={cn(typography.bodySmall, 'font-bold', config.textClass, 'ml-2')}>
          {metric}
        </span>
      )}
    </div>
  );
}
