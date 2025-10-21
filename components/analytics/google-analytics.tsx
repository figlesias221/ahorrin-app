'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Get from environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Google Analytics component
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Track pageview
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  // Don't load GA in development
  if (process.env.NODE_ENV === 'development' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Helper functions for event tracking
export const analytics = {
  // Track custom events
  event: (eventName: string, parameters?: Record<string, unknown>) => {
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('event', eventName, parameters);
    }
  },

  // Track signup conversions
  signup: (method: 'email' | 'google') => {
    analytics.event('sign_up', {
      method,
    });
  },

  // Track login
  login: (method: 'email' | 'google') => {
    analytics.event('login', {
      method,
    });
  },

  // Track file uploads
  uploadFile: (fileType: 'pdf' | 'excel' | 'csv', bank?: string) => {
    analytics.event('file_upload', {
      file_type: fileType,
      bank_name: bank,
    });
  },

  // Track bank selection
  selectBank: (bank: 'bbva' | 'scotiabank' | 'itau' | 'brou' | 'other') => {
    analytics.event('select_bank', {
      bank_name: bank,
    });
  },

  // Track feature usage
  useFeature: (featureName: string) => {
    analytics.event('feature_use', {
      feature_name: featureName,
    });
  },

  // Track rule creation
  createRule: (ruleType: 'vendor' | 'amount' | 'combined') => {
    analytics.event('create_rule', {
      rule_type: ruleType,
    });
  },

  // Track category creation
  createCategory: () => {
    analytics.event('create_category');
  },

  // Track export actions
  exportData: (format: 'excel' | 'pdf' | 'csv') => {
    analytics.event('export_data', {
      export_format: format,
    });
  },

  // Track scroll depth
  scrollDepth: (percentage: 25 | 50 | 75 | 100) => {
    analytics.event('scroll', {
      percent_scrolled: percentage,
    });
  },

  // Track button clicks
  clickButton: (buttonName: string, location: string) => {
    analytics.event('button_click', {
      button_name: buttonName,
      click_location: location,
    });
  },

  // Track search
  search: (searchTerm: string) => {
    analytics.event('search', {
      search_term: searchTerm,
    });
  },

  // Track AI usage
  useAI: (action: 'categorize' | 'chat' | 'analyze') => {
    analytics.event('ai_interaction', {
      ai_action: action,
    });
  },

  // Track conversion funnel steps
  funnelStep: (step: string, value?: string) => {
    analytics.event('funnel_progress', {
      funnel_step: step,
      step_value: value,
    });
  },
};
