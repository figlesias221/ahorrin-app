'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with undefined to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Force light mode on landing page
    const isLandingPage = window.location.pathname === '/' && !window.location.search;

    if (isLandingPage) {
      setTheme('light');
    } else {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) {
        setTheme(stored);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || !theme) return;

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    // Don't allow theme toggle on landing page
    const isLandingPage = window.location.pathname === '/' && !window.location.search;
    if (isLandingPage) return;

    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Always provide context so children server-render; default to light
  // until the real preference loads on mount.
  return (
    <ThemeContext.Provider value={{ theme: theme ?? 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
