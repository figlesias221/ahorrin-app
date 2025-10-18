'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { fadeInUp } from '@/lib/utils/animations';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-4 rounded-full bg-muted p-6"
        >
          <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground max-w-md mb-6"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Illustration-based empty states
export function EmptyStateIllustration({
  illustration,
  title,
  description,
  action,
  className,
}: Omit<EmptyStateProps, 'icon'> & { illustration: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
        className="mb-6 w-full max-w-xs"
      >
        {illustration}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground max-w-md mb-6"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Preset empty state illustrations using SVG
export function NoDataIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="100" cy="100" r="80" fill="var(--muted)" opacity="0.5" />
      <rect x="60" y="70" width="80" height="60" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <line x1="70" y1="85" x2="110" y2="85" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="100" x2="130" y2="100" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="115" x2="100" y2="115" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function NoTransactionsIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="100" cy="100" r="80" fill="var(--primary)" opacity="0.1" />
      <rect x="50" y="80" width="100" height="70" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <circle cx="100" cy="105" r="15" fill="var(--primary)" opacity="0.2" />
      <path d="M95 105 L98 108 L105 101" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="60" y="125" width="80" height="4" rx="2" fill="var(--muted)" />
      <rect x="60" y="135" width="60" height="4" rx="2" fill="var(--muted)" />
    </svg>
  );
}

export function NoResultsIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="100" cy="100" r="80" fill="var(--warning)" opacity="0.1" />
      <circle cx="85" cy="85" r="35" fill="none" stroke="var(--muted-foreground)" strokeWidth="3" />
      <line x1="110" y1="110" x2="130" y2="130" stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="130" x2="130" y2="120" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="120" x2="130" y2="130" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
