// Animation utilities for Framer Motion
import { Variants } from 'framer-motion';

// Easing curves
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  anticipate: [0.36, 0.66, 0.04, 1],
};

// Standard durations
export const durations = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
};

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Fade in up animation
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  }
};

// List item animation (for staggered lists)
export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  }
};

// Card hover animation
export const cardHover = {
  scale: 1.02,
  transition: { duration: durations.fast, ease: easings.easeOut }
};

// Button tap animation
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1, ease: easings.easeInOut }
};

// Ripple effect animation
export const ripple: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: easings.easeOut }
  }
};

// Skeleton pulse animation
export const skeletonPulse = {
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: easings.easeInOut
  }
};

// Toast notification animation
export const toast: Variants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.anticipate }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
};

// Modal animation
export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: durations.normal, ease: easings.easeIn }
  }
};

// Backdrop animation
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal }
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.normal }
  }
};

// Number count up animation helper
export function countUp(end: number, duration: number = 1) {
  return {
    initial: 0,
    animate: end,
    transition: { duration, ease: easings.easeOut }
  };
}

// Page transition variants
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: durations.normal, ease: easings.easeIn }
  }
};
