'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';

interface UpgradeBannerProps {
  message: string;
  current?: number;
  limit?: number;
  feature?: string;
  compact?: boolean;
}

export function UpgradeBanner({ message, current, limit, compact = false }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background text-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Plan
        </span>
        <span className="text-muted-foreground flex-1">{message}</span>
        <Link
          href="/pricing"
          className="text-primary hover:text-primary/80 font-medium whitespace-nowrap"
        >
          Ver Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border bg-background p-6">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 text-muted-foreground"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
        Plan
      </p>
      <p className="text-foreground font-medium">{message}</p>
      {current !== undefined && limit !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-mono tabular-nums">
              {current}/{limit}
            </span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      <Link
        href="/pricing"
        className="inline-flex items-center mt-4 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Pasate a Pro - $99/mes
      </Link>
    </div>
  );
}
