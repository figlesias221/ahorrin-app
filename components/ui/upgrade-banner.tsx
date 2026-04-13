'use client';

import Link from 'next/link';
import { Zap, X } from 'lucide-react';
import { useState } from 'react';

interface UpgradeBannerProps {
  message: string;
  current?: number;
  limit?: number;
  feature?: string;
  compact?: boolean;
}

export function UpgradeBanner({ message, current, limit, feature, compact = false }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm">
        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-muted-foreground">{message}</span>
        <Link
          href="/pricing"
          className="ml-auto text-primary hover:text-primary/80 font-medium whitespace-nowrap"
        >
          Ver Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 text-muted-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{message}</p>
        {current !== undefined && limit !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Usado: {current}/{limit}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Zap className="w-3.5 h-3.5" />
          Pasate a Pro - $99/mes
        </Link>
      </div>
    </div>
  );
}
