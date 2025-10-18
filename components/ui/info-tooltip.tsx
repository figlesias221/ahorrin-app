'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block group">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onBlur={() => setIsOpen(false)}
        className={cn(
          "text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-help focus:outline-none",
          className
        )}
        aria-label="Más información"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop - closes on click */}
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Tooltip content */}
          <div className="absolute z-[101] bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 pointer-events-none">
            <div className="bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900 text-xs p-3 rounded-lg shadow-xl border border-slate-700 dark:border-slate-300">
              {content}
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-50 border-r border-b border-slate-700 dark:border-slate-300 rotate-45" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
