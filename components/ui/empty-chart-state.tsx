'use client';

import { BarChart3, FileX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface EmptyChartStateProps {
  height?: number;
  message?: string;
  subMessage?: string;
  className?: string;
  borderColor?: string;
  iconColor?: string;
}

export function EmptyChartState({
  height = 300,
  message = 'No hay datos',
  subMessage = 'No hay datos disponibles para el período seleccionado',
  className,
  borderColor,
  iconColor,
}: EmptyChartStateProps) {
  // Default colors with theme support
  const defaultBorderColor = 'border-muted-foreground/20';
  const defaultIconColor = 'text-muted-foreground/30';
  const secondaryIconColor = 'text-muted-foreground/50';

  // Build border class with color
  const borderClass = borderColor
    ? `border-2 border-dashed`
    : `border-2 border-dashed ${defaultBorderColor}`;

  // Build icon classes
  const mainIconClass = cn(
    'h-12 w-12',
    iconColor || defaultIconColor
  );

  const overlayIconClass = cn(
    'h-6 w-6 absolute -bottom-1 -right-1',
    iconColor ? `${iconColor} opacity-70` : secondaryIconColor
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gradient-to-br from-muted/5 via-muted/10 to-muted/5 rounded-xl',
        borderClass,
        className
      )}
      style={{
        height: `${height}px`,
        ...(borderColor ? { borderColor } : {})
      }}
    >
      <div className="text-center space-y-4 px-6">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
          <div className="relative p-4 bg-background/50 backdrop-blur-sm rounded-full border-2 border-dashed border-muted-foreground/20">
            <BarChart3 className={mainIconClass} />
            <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border border-border">
              <FileX className={overlayIconClass} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground/80">
            {message}
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            {subMessage}
          </p>
        </div>
      </div>
    </div>
  );
}