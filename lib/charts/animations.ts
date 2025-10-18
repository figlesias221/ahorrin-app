'use client';

/**
 * Advanced Animation System for Charts
 *
 * Provides sophisticated entrance animations, transitions, and micro-interactions
 * for world-class chart experiences.
 */

import type { EChartsOption } from 'echarts';

/**
 * Animation timing functions (easing curves)
 */
export const EASING = {
  // Entrance animations
  bounceOut: 'elasticOut',
  slideIn: 'cubicOut',
  fadeIn: 'quadInOut',

  // Smooth transitions
  smooth: 'cubicInOut',
  buttery: 'quintInOut',

  // Dramatic effects
  dramatic: 'backOut',
  energetic: 'elasticOut',

  // Subtle movements
  gentle: 'sineInOut',
  whisper: 'quadOut',
} as const;

/**
 * Animation durations in milliseconds
 */
export const DURATION = {
  instant: 200,
  fast: 400,
  normal: 800,
  slow: 1200,
  dramatic: 1800,
  cinematic: 2400,
} as const;

/**
 * Stagger delay calculator for sequential animations
 */
export function createStaggerDelay(baseDelay: number = 50, multiplier: number = 1) {
  return (dataIndex: number) => dataIndex * baseDelay * multiplier;
}

/**
 * Wave effect delay for smooth cascading animations
 */
export function createWaveDelay(baseDelay: number = 30, amplitude: number = 1) {
  return (dataIndex: number, total?: number) => {
    if (!total) return dataIndex * baseDelay;
    const progress = dataIndex / total;
    const wave = Math.sin(progress * Math.PI) * amplitude;
    return dataIndex * baseDelay + wave * baseDelay;
  };
}

/**
 * Get entrance animation configuration for different chart types
 */
export function getEntranceAnimation(
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'scatter',
  options: {
    duration?: number;
    easing?: string;
    stagger?: boolean;
    dramatic?: boolean;
  } = {}
): Partial<EChartsOption> {
  const {
    duration = DURATION.normal,
    easing = EASING.smooth,
    stagger = true,
    dramatic = false,
  } = options;

  const baseDuration = dramatic ? duration * 1.5 : duration;

  const animations: Record<string, Partial<EChartsOption>> = {
    bar: {
      animation: true,
      animationDuration: baseDuration,
      animationEasing: dramatic ? EASING.dramatic : easing,
      animationDelay: stagger ? createStaggerDelay(60) : 0,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.6,
      animationEasingUpdate: EASING.smooth,
      animationDelayUpdate: stagger ? createStaggerDelay(30) : 0,
    },
    line: {
      animation: true,
      animationDuration: baseDuration,
      animationEasing: dramatic ? EASING.energetic : EASING.smooth,
      animationDelay: 0,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.5,
      animationEasingUpdate: EASING.buttery,
    },
    area: {
      animation: true,
      animationDuration: baseDuration * 1.2,
      animationEasing: EASING.smooth,
      animationDelay: 100,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.6,
      animationEasingUpdate: EASING.gentle,
    },
    pie: {
      animation: true,
      animationDuration: baseDuration,
      animationEasing: dramatic ? EASING.bounceOut : EASING.smooth,
      animationDelay: stagger ? createStaggerDelay(80) : 0,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.7,
      animationEasingUpdate: EASING.smooth,
      animationDelayUpdate: stagger ? createStaggerDelay(40) : 0,
    },
    radar: {
      animation: true,
      animationDuration: baseDuration * 1.3,
      animationEasing: EASING.energetic,
      animationDelay: 150,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.6,
      animationEasingUpdate: EASING.smooth,
    },
    scatter: {
      animation: true,
      animationDuration: baseDuration,
      animationEasing: EASING.bounceOut,
      animationDelay: stagger ? createWaveDelay(20, 1.5) : 0,
      animationThreshold: 2000,
      animationDurationUpdate: duration * 0.4,
      animationEasingUpdate: EASING.smooth,
    },
  };

  return animations[type] || animations.line;
}

/**
 * Create loading animation configuration
 */
export function getLoadingAnimation(): Partial<EChartsOption> {
  return {
    animation: true,
    animationDuration: DURATION.slow,
    animationEasing: EASING.gentle,
    animationDelay: 0,
  };
}

/**
 * Hover animation enhancement
 */
export interface HoverAnimationConfig {
  scale?: number;
  shadowBlur?: number;
  shadowOffsetY?: number;
  borderWidth?: number;
  duration?: number;
}

export function createHoverAnimation(config: HoverAnimationConfig = {}) {
  const {
    scale = 1.05,
    borderWidth = 3,
    duration = DURATION.fast,
  } = config;

  return {
    emphasis: {
      scale,
      focus: 'series' as const,
      itemStyle: {
        borderWidth,
      },
    },
    blur: {
      itemStyle: {
        opacity: 0.3,
      },
      lineStyle: {
        opacity: 0.3,
      },
    },
    select: {
      itemStyle: {
        borderWidth: borderWidth + 1,
      },
    },
  };
}

/**
 * Data update transition configuration
 */
export function getUpdateTransition(smooth: boolean = true): Partial<EChartsOption> {
  return {
    animationDurationUpdate: smooth ? DURATION.normal : DURATION.fast,
    animationEasingUpdate: smooth ? EASING.buttery : EASING.smooth,
    animationDelayUpdate: 0,
    universalTransition: {
      enabled: true,
      delay: 0,
      divideShape: 'clone',
    },
  };
}

/**
 * Sequential reveal animation for multiple series
 */
export function createSequentialReveal(seriesCount: number, baseDelay: number = 200) {
  return Array.from({ length: seriesCount }, (_, index) => ({
    animationDelay: index * baseDelay,
    animationDuration: DURATION.normal,
    animationEasing: EASING.smooth,
  }));
}

/**
 * Pulsating glow effect for emphasis
 */
export function createPulseEffect(color: string, intensity: number = 0.6) {
  // Shadow effects disabled for cleaner visuals
  return {};
}

/**
 * Morphing animation between chart states
 */
export function getMorphTransition(): Partial<EChartsOption> {
  return {
    animationDurationUpdate: DURATION.dramatic,
    animationEasingUpdate: EASING.dramatic,
    universalTransition: {
      enabled: true,
      seriesKey: 'morph',
      divideShape: 'clone',
    },
  };
}

/**
 * Particle-like scatter effect configuration
 */
export function getParticleEffect() {
  return {
    symbolSize: (value: number) => {
      const base = Math.sqrt(value) * 0.5;
      return base + Math.random() * 3;
    },
    itemStyle: {
      opacity: 0.8,
    },
    emphasis: {
      scale: true,
      itemStyle: {
        opacity: 1,
      },
    },
  };
}

/**
 * Smooth number counter animation
 */
export function createCounterAnimation(
  from: number,
  to: number,
  animationDuration: number = DURATION.normal,
  easing: string = EASING.smooth
) {
  return {
    duration: animationDuration,
    easing,
    from,
    to,
  };
}

/**
 * Orchestrated multi-element animation
 */
export interface AnimationSequence {
  elements: Array<{
    delay: number;
    duration: number;
    easing: string;
  }>;
}

export function createAnimationSequence(
  elementCount: number,
  options: {
    totalDuration?: number;
    overlap?: number; // 0-1, how much animations overlap
    easing?: string;
  } = {}
): AnimationSequence {
  const {
    totalDuration = DURATION.dramatic,
    overlap = 0.3,
    easing = EASING.smooth,
  } = options;

  const elementDuration = totalDuration / (elementCount - overlap * (elementCount - 1));
  const delayStep = elementDuration * (1 - overlap);

  const elements = Array.from({ length: elementCount }, (_, index) => ({
    delay: index * delayStep,
    duration: elementDuration,
    easing,
  }));

  return { elements };
}

/**
 * Breathing animation for idle state
 */
export function getBreathingEffect(baseOpacity: number = 0.8) {
  return {
    itemStyle: {
      opacity: baseOpacity,
    },
    // This would be applied via external animation loop
    breathing: {
      duration: 3000,
      minOpacity: baseOpacity * 0.7,
      maxOpacity: baseOpacity,
    },
  };
}

/**
 * Ripple effect on click/tap
 */
export function getRippleEffect(color: string) {
  return {
    rippleEffect: {
      period: 4,
      scale: 2.5,
      brushType: 'fill',
      color: color.replace(')', ', 0.3)').replace('rgb', 'rgba'),
    },
  };
}
