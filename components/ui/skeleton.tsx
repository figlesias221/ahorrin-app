import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-muted';

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'skeleton-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Preset skeleton components for common use cases

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card p-6', className)}>
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" height={200} />
        <div className="space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMetricCard({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card px-6 py-5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="50%" height={14} />
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height={16} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height={20} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton
      variant="rounded"
      height={40}
      width={100}
      className={className}
    />
  );
}

export function SkeletonChartCard({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rounded" width={80} height={28} />
        </div>
        <Skeleton variant="rectangular" height={300} className="rounded-lg" />
        <div className="flex gap-4">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Metric cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonChartCard />
        <SkeletonChartCard />
      </div>

      {/* Table */}
      <SkeletonCard>
        <SkeletonTable rows={8} columns={5} />
      </SkeletonCard>
    </div>
  );
}
