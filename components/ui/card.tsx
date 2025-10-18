'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { borderRadius, spacing, shadows, transitions, typography } from '@/lib/design-tokens';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'elevated' | 'flat';
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = 'default',
  hoverable = false,
  onClick
}: CardProps) {
  const isInteractive = hoverable || !!onClick;

  const variantStyles = {
    default: `border border-border/50 bg-card`,
    minimal: `border border-border/30 bg-card`,
    elevated: `border border-border/50 bg-card ${shadows.sm}`,
    flat: 'bg-card',
  };

  const Component = isInteractive ? motion.div : 'div';
  const motionProps = isInteractive ? {
    whileHover: { y: -2, boxShadow: 'var(--shadow-md)' },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
  } : {};

  return (
    <Component
      className={cn(
        'overflow-hidden',
        borderRadius.card,
        `p-${spacing.lg}`,
        transitions.fast,
        variantStyles[variant],
        isInteractive && 'cursor-pointer hover:border-border/70',
        className
      )}
      onClick={onClick}
      {...(isInteractive ? motionProps : {})}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn(`flex items-center justify-between mb-${spacing.lg}`, className)}>
      {children}
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(typography.h4, 'text-card-foreground', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
