'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast as toastVariant } from '@/lib/utils/animations';
import type { ToastType } from '@/contexts/toast-context';

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-card border-success',
    iconClass: 'text-success',
    textClass: 'text-foreground',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-card border-error',
    iconClass: 'text-error',
    textClass: 'text-foreground',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-card border-warning',
    iconClass: 'text-warning',
    textClass: 'text-foreground',
  },
  info: {
    icon: Info,
    bgClass: 'bg-card border-primary',
    iconClass: 'text-primary',
    textClass: 'text-foreground',
  },
};

export function Toast({ id, title, message, type, onClose, action }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        variants={toastVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'rounded-lg border border-border border-l-4 p-4 shadow-xl',
          'flex items-start gap-3 w-full',
          config.bgClass
        )}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClass)} aria-hidden="true" />

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn('text-sm font-semibold mb-1', config.textClass)}>
              {title}
            </h3>
          )}
          <p className={cn('text-sm', config.textClass, !title && 'font-medium')}>
            {message}
          </p>

          {action && (
            <button
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={cn(
                'mt-2 text-sm font-medium underline',
                'hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2',
                config.textClass
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 rounded-md p-1',
            'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2',
            'text-muted-foreground hover:text-foreground'
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
