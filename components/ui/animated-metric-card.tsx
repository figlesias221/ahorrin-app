'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from './card';

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  delay?: number;
  format?: (value: number) => string;
}

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  format,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const springValue = useSpring(0, { duration: 1500, bounce: 0 });
  const display = useTransform(springValue, (latest) => {
    if (format) {
      return format(latest);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export function AnimatedMetricCard({
  title,
  value,
  prefix,
  suffix,
  change,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  className,
  delay = 0,
  format,
}: AnimatedMetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className={cn('relative overflow-hidden', className)}>
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
          animate={hasAnimated ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, delay: delay + 0.3 }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            {/* Title */}
            <motion.p
              className="text-sm font-medium text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
            >
              {title}
            </motion.p>

            {/* Animated Value */}
            <motion.h3
              className="mt-2 text-3xl font-bold text-card-foreground"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={hasAnimated ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.2, type: 'spring', stiffness: 200 }}
            >
              {hasAnimated ? (
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix} format={format} />
              ) : (
                <span className="opacity-0">0</span>
              )}
            </motion.h3>

            {/* Change Indicator */}
            {change && (
              <motion.div
                className="mt-2 flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: delay + 0.4 }}
              >
                <span className={cn('text-sm font-medium flex items-center', trendColors[change.trend])}>
                  <span aria-hidden="true">{trendIcons[change.trend]}</span>
                  <span className="ml-1">
                    {Math.abs(change.value).toFixed(1)}%
                  </span>
                </span>
                {change.label && (
                  <span className="text-sm text-muted-foreground">{change.label}</span>
                )}
              </motion.div>
            )}

            {/* Description */}
            {description && !change && (
              <motion.p
                className="mt-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: delay + 0.4 }}
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Animated Icon */}
          {Icon && (
            <motion.div
              className={cn('rounded-full bg-muted p-3', iconColor)}
              initial={{ scale: 0, rotate: -180 }}
              animate={hasAnimated ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{
                duration: 0.6,
                delay: delay + 0.3,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
