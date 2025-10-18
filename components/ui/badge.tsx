import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-muted text-foreground border border-border': variant === 'default',
          'bg-success/10 text-success dark:bg-success/20': variant === 'success',
          'bg-error/10 text-error dark:bg-error/20': variant === 'error',
          'bg-warning/10 text-warning dark:bg-warning/20': variant === 'warning',
          'bg-primary/10 text-primary dark:bg-primary/20': variant === 'info',
          'bg-destructive/10 text-destructive dark:bg-destructive/20': variant === 'destructive',
          'bg-secondary/10 text-secondary-foreground dark:bg-secondary/20': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
