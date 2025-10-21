'use client';

import { useEffect, useRef } from 'react';
import { analytics } from './google-analytics';

/**
 * Component that tracks scroll depth for analytics
 * Fires events at 25%, 50%, 75%, and 100% scroll depth
 */
export function ScrollTracker() {
  const triggeredRef = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = ((scrollTop + windowHeight) / documentHeight) * 100;

      // Check each threshold
      ([25, 50, 75, 100] as const).forEach((threshold) => {
        if (scrollPercentage >= threshold && !triggeredRef.current[threshold]) {
          triggeredRef.current[threshold] = true;
          analytics.scrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null; // This component doesn't render anything
}
