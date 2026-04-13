'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export function AdSense({ slot, format = 'auto', className }: AdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded or blocked by ad blocker
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        className={`bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm p-4 ${className ?? ''}`}
      >
        Ad Placeholder (slot: {slot}, format: {format})
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
