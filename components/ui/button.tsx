'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { heights, iconSizes, borderRadius, transitions } from '@/lib/design-tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    // Get appropriate icon size based on button size
    const iconClass = size === 'sm' ? iconSizes.sm : size === 'lg' ? iconSizes.lg : iconSizes.md;

    const buttonContent = (
      <>
        {loading && (
          <Loader2 className={cn(iconClass, 'animate-spin')} aria-hidden="true" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn('inline-flex', iconClass)} aria-hidden="true">{icon}</span>
        )}
        {loading && loadingText ? <span>{loadingText}</span> : children}
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn('inline-flex', iconClass)} aria-hidden="true">{icon}</span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled ? { scale: 1.01 } : undefined}
        whileTap={!isDisabled ? { scale: 0.99 } : undefined}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          borderRadius.base,
          transitions.fast,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50',
          'relative',
          {
            // Variants - More subtle, refined
            'border border-border/70 bg-card text-card-foreground hover:bg-muted hover:border-border': variant === 'default',
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-success text-success-foreground hover:bg-success/90': variant === 'success',
            'bg-error text-error-foreground hover:bg-error/90': variant === 'error',
            'bg-warning text-warning-foreground hover:bg-warning/90': variant === 'warning',
            'text-foreground hover:bg-muted': variant === 'ghost',
            'border border-border/70 bg-transparent text-foreground hover:bg-muted hover:border-border': variant === 'outline',
            // Sizes - Using design tokens
            [`${heights.sm} px-3 text-xs`]: size === 'sm',
            [`${heights.md} px-4 text-sm`]: size === 'md',
            [`${heights.lg} px-6 text-base`]: size === 'lg',
          },
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
