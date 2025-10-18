/**
 * Design System Tokens
 *
 * Centralized design tokens for consistent spacing, typography, and sizing
 * across the entire application. Use these constants instead of hardcoded values.
 */

/**
 * SPACING SCALE
 *
 * Use these for padding, margins, and gaps throughout the app.
 * Each level has a clear semantic purpose.
 * Increased for more breathing room and cleaner aesthetic.
 */
export const spacing = {
  /** 4px - Minimal spacing between tightly related items */
  xs: '1',
  /** 8px - Small spacing between related elements */
  sm: '2',
  /** 16px - Default spacing between elements */
  md: '4',
  /** 24px - Standard spacing between components */
  lg: '6',
  /** 32px - Large spacing between sections */
  xl: '8',
  /** 48px - Extra large spacing for major sections */
  '2xl': '12',
  /** 64px - Maximum spacing for page-level sections */
  '3xl': '16',
} as const;

/**
 * TYPOGRAPHY SCALE
 *
 * Professional typography hierarchy with clear semantic purpose.
 * Enhanced with display sizes for hero sections and data emphasis.
 */
export const typography = {
  /** Hero/Display titles - 36px, bold */
  display: 'text-4xl font-bold tracking-tight',
  /** Large display - 48px, bold (for key metrics) */
  displayLg: 'text-5xl font-bold tracking-tight',
  /** Page titles - 30px, semibold */
  h1: 'text-3xl font-semibold tracking-tight',
  /** Section titles - 24px, semibold */
  h2: 'text-2xl font-semibold tracking-tight',
  /** Subsection titles - 20px, semibold */
  h3: 'text-xl font-semibold',
  /** Card/Component titles - 18px, medium */
  h4: 'text-lg font-medium',
  /** Small headings - 16px, medium */
  h5: 'text-base font-medium',
  /** Regular body text - 16px */
  body: 'text-base leading-relaxed',
  /** Small body text - 14px */
  bodySmall: 'text-sm leading-relaxed',
  /** Extra small text (captions, metadata) - 12px */
  caption: 'text-xs leading-relaxed',
  /** Micro text - 11px (for dense data tables) */
  micro: 'text-[11px] leading-tight',
  /** Form labels - 14px, medium */
  label: 'text-sm font-medium',
  /** Help text - 12px, muted */
  helpText: 'text-xs text-muted-foreground',
  /** Metric value - 32px, bold (for dashboard metrics) */
  metric: 'text-[32px] font-bold tracking-tight tabular-nums',
  /** Metric small - 24px, semibold */
  metricSm: 'text-2xl font-semibold tracking-tight tabular-nums',
} as const;

/**
 * COMPONENT HEIGHTS
 *
 * Standard heights for interactive components.
 */
export const heights = {
  /** Small buttons and inputs - 32px */
  sm: 'h-8',
  /** Medium buttons and inputs (default) - 40px */
  md: 'h-10',
  /** Large buttons and inputs - 48px */
  lg: 'h-12',
  /** Form inputs standard height - 44px */
  input: 'h-11',
  /** Header height - 64px */
  header: 'h-16',
} as const;

/**
 * ICON SIZES
 *
 * Consistent icon sizing across the app.
 * Updated: Action button icons are slightly larger for better visibility
 */
export const iconSizes = {
  /** Extra small icons - 14px */
  xs: 'h-3.5 w-3.5',
  /** Small icons (in small buttons) - 18px */
  sm: 'h-[18px] w-[18px]',
  /** Medium icons (in buttons, navigation) - 20px */
  md: 'h-5 w-5',
  /** Large icons (in large buttons, headers) - 22px */
  lg: 'h-[22px] w-[22px]',
  /** Extra large icons (in features) - 24px */
  xl: 'h-6 w-6',
  /** 2XL icons (in empty states) - 48px */
  '2xl': 'h-12 w-12',
} as const;

/**
 * BORDER RADIUS
 *
 * Consistent rounding across components.
 * More subtle, refined corners for modern aesthetic.
 */
export const borderRadius = {
  /** Small elements (chips, badges) - 4px */
  sm: 'rounded',
  /** Buttons, inputs, dropdowns - 6px */
  base: 'rounded-md',
  /** Cards and major containers - 8px */
  card: 'rounded-lg',
  /** Large cards and panels - 12px */
  large: 'rounded-xl',
  /** Full circle */
  full: 'rounded-full',
} as const;

/**
 * Z-INDEX SCALE
 *
 * Layering system for overlapping elements.
 * Use these instead of arbitrary z-index values.
 */
export const zIndex = {
  /** Base content */
  base: 'z-0',
  /** Sticky headers, sidebars */
  sticky: 'z-10',
  /** Floating elements (tooltips) */
  floating: 'z-20',
  /** Dropdown menus */
  dropdown: 'z-[120]',
  /** Modals and overlays */
  modal: 'z-40',
  /** Toast notifications */
  toast: 'z-50',
} as const;

/**
 * SHADOW SCALE
 *
 * Elevation system for visual hierarchy.
 */
export const shadows = {
  /** Subtle shadow for cards */
  sm: 'shadow-sm',
  /** Medium shadow for hover states */
  md: 'shadow-md',
  /** Large shadow for dropdowns */
  lg: 'shadow-lg',
  /** Extra large for modals */
  xl: 'shadow-xl',
  /** Maximum shadow for emphasis */
  '2xl': 'shadow-2xl',
  /** Colored shadow for primary elements */
  colored: 'shadow-colored',
} as const;

/**
 * GAP SCALE
 *
 * Standard gaps for flex and grid layouts.
 */
export const gaps = {
  /** Minimal gap - 4px */
  xs: 'gap-1',
  /** Small gap - 8px */
  sm: 'gap-2',
  /** Medium gap (related items) - 12px */
  md: 'gap-3',
  /** Default gap - 16px */
  lg: 'gap-4',
  /** Large gap (sections) - 24px */
  xl: 'gap-6',
  /** Extra large gap - 32px */
  '2xl': 'gap-8',
} as const;

/**
 * OPACITY SCALE
 *
 * Standard opacity values for backgrounds and overlays.
 */
export const opacity = {
  /** Very subtle - 5% */
  subtle: 'bg-opacity-5',
  /** Light - 10% */
  light: 'bg-opacity-10',
  /** Medium - 30% */
  medium: 'bg-opacity-30',
  /** Strong - 50% */
  strong: 'bg-opacity-50',
  /** Very strong - 80% */
  veryStrong: 'bg-opacity-80',
} as const;

/**
 * TRANSITIONS
 *
 * Standard transition durations and easings.
 */
export const transitions = {
  /** Fast transitions (hovers) - 150ms */
  fast: 'transition-all duration-150 ease-out',
  /** Normal transitions - 200ms */
  normal: 'transition-all duration-200 ease-out',
  /** Slow transitions (page changes) - 300ms */
  slow: 'transition-all duration-300 ease-out',
  /** Spring-like easing for smooth feel */
  spring: 'transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * FRAMER MOTION VARIANTS
 *
 * Reusable animation variants for Framer Motion components.
 * Professional-grade animations for modern UX.
 */
export const motionVariants = {
  /** Fade in from opacity 0 to 1 */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  /** Slide up with fade */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  /** Slide down with fade */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  /** Scale in (subtle) */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  /** Stagger children animation */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  /** Stagger item */
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  /** Card hover lift */
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.01,
      y: -2,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
    },
  },
} as const;

/**
 * ACCESSIBILITY
 *
 * WCAG 2.1 AA compliant focus and interaction states.
 */
export const accessibility = {
  /** Standard focus ring */
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  /** Focus ring for dark backgrounds */
  focusRingDark: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
  /** Skip to main content link */
  skipLink: 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg',
  /** Screen reader only text */
  srOnly: 'sr-only',
} as const;

/**
 * HELPER FUNCTIONS
 */

/**
 * Get consistent padding classes for cards
 */
export function getCardPadding(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  return paddingMap[size];
}

/**
 * Get consistent container max-width
 */
export function getContainerClasses(): string {
  return 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
}

/**
 * Get form input classes
 */
export function getInputClasses(hasError?: boolean): string {
  return `${heights.input} w-full px-4 py-2 ${borderRadius.base} border bg-background text-foreground
    ${transitions.normal} focus:outline-none focus:ring-2
    ${hasError ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`;
}

/**
 * Get button size classes
 */
export function getButtonSizeClasses(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizeMap = {
    sm: `${heights.sm} px-3 ${typography.caption}`,
    md: `${heights.md} px-4 ${typography.bodySmall}`,
    lg: `${heights.lg} px-6 ${typography.body}`,
  };
  return sizeMap[size];
}
