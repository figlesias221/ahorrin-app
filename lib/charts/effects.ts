'use client';

/**
 * Premium Visual Effects for Charts
 *
 * Advanced visual effects including glow, blur, particles, and more
 * for creating stunning, professional chart visualizations.
 */

import type { ChartTheme } from './theme';

/**
 * Glow effect levels
 */
export const GLOW_INTENSITY = {
  subtle: 0.2,
  moderate: 0.4,
  strong: 0.6,
  intense: 0.8,
  extreme: 1.0,
} as const;

/**
 * Create multi-layered glow effect
 */
export function createGlowEffect(
  baseColor: string,
  intensity: number = GLOW_INTENSITY.moderate,
  theme: ChartTheme = 'light'
) {
  // Shadow effects disabled for cleaner visuals
  return {};
}

/**
 * Create multi-layer shadow for depth
 */
export function createLayeredShadow(
  baseColor: string,
  layers: number = 3,
  theme: ChartTheme = 'light'
) {
  // Shadow effects disabled for cleaner visuals
  return {};
}

/**
 * Glassmorphism effect for modern UI
 */
export function createGlassmorphism(theme: ChartTheme = 'light') {
  const isDark = theme === 'dark';

  return {
    backgroundColor: isDark
      ? 'rgba(23, 23, 23, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '16px',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  };
}

/**
 * Neon glow effect for vibrant charts
 */
export function createNeonGlow(color: string, intensity: number = 0.8) {
  return {
    itemStyle: {
      color: color,
    },
  };
}

/**
 * Gradient with shimmer effect
 */
export function createShimmerGradient(
  baseColor: string,
  direction: 'vertical' | 'horizontal' | 'radial' = 'vertical'
) {
  if (direction === 'radial') {
    return {
      type: 'radial',
      x: 0.5,
      y: 0.5,
      r: 0.5,
      colorStops: [
        { offset: 0, color: baseColor },
        { offset: 0.5, color: lightenColor(baseColor, 20) },
        { offset: 1, color: baseColor },
      ],
    };
  }

  return {
    type: 'linear',
    x: direction === 'horizontal' ? 0 : 0,
    y: direction === 'horizontal' ? 0 : 0,
    x2: direction === 'horizontal' ? 1 : 0,
    y2: direction === 'horizontal' ? 0 : 1,
    colorStops: [
      { offset: 0, color: baseColor },
      { offset: 0.3, color: lightenColor(baseColor, 15) },
      { offset: 0.7, color: baseColor },
      { offset: 1, color: darkenColor(baseColor, 10) },
    ],
  };
}

/**
 * Holographic gradient effect
 */
export function createHolographicGradient(theme: ChartTheme = 'light') {
  const isDark = theme === 'dark';

  if (isDark) {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
        { offset: 0.25, color: 'rgba(59, 130, 246, 0.3)' },
        { offset: 0.5, color: 'rgba(34, 211, 238, 0.3)' },
        { offset: 0.75, color: 'rgba(16, 185, 129, 0.3)' },
        { offset: 1, color: 'rgba(139, 92, 246, 0.3)' },
      ],
    };
  }

  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(139, 92, 246, 0.15)' },
      { offset: 0.25, color: 'rgba(59, 130, 246, 0.15)' },
      { offset: 0.5, color: 'rgba(34, 211, 238, 0.15)' },
      { offset: 0.75, color: 'rgba(16, 185, 129, 0.15)' },
      { offset: 1, color: 'rgba(139, 92, 246, 0.15)' },
    ],
  };
}

/**
 * Aurora borealis gradient effect
 */
export function createAuroraGradient(colors: string[]) {
  const stops = colors.map((color, index) => ({
    offset: index / (colors.length - 1),
    color: color.replace(')', ', 0.4)').replace('rgb', 'rgba'),
  }));

  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: stops,
  };
}

/**
 * Metallic sheen effect
 */
export function createMetallicEffect(
  baseColor: string,
  metalType: 'gold' | 'silver' | 'bronze' | 'copper' = 'silver'
) {
  const metallicColors = {
    gold: ['#FFD700', '#FFA500', '#FFD700', '#FFED4E'],
    silver: ['#C0C0C0', '#E8E8E8', '#A8A8A8', '#D3D3D3'],
    bronze: ['#CD7F32', '#B87333', '#CD7F32', '#E9967A'],
    copper: ['#B87333', '#DA8A67', '#B87333', '#F4A460'],
  };

  const colors = metallicColors[metalType];

  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: colors[0] },
      { offset: 0.3, color: colors[1] },
      { offset: 0.6, color: colors[2] },
      { offset: 1, color: colors[3] },
    ],
  };
}

/**
 * Particle scatter effect configuration
 */
export function createParticleScatter() {
  return {
    symbolSize: () => {
      return Math.random() * 8 + 2;
    },
    itemStyle: {
      opacity: 0.6 + Math.random() * 0.3,
    },
  };
}

/**
 * Depth of field effect (blur background elements)
 */
export function createDepthOfField(focusIndex: number, totalItems: number) {
  return (dataIndex: number) => {
    const distance = Math.abs(dataIndex - focusIndex);
    const maxDistance = Math.max(focusIndex, totalItems - focusIndex);

    return {
      itemStyle: {
        opacity: 1 - (distance / maxDistance) * 0.7,
      },
    };
  };
}

/**
 * Frosted glass effect
 */
export function createFrostedGlass(theme: ChartTheme = 'light') {
  const isDark = theme === 'dark';

  return {
    backgroundColor: isDark
      ? 'rgba(10, 10, 10, 0.7)'
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px) saturate(120%)',
    borderRadius: '12px',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(0, 0, 0, 0.06)',
  };
}

/**
 * Helper: Lighten a color
 */
function lightenColor(color: string, percent: number): string {
  // Simple lightening - in production, use a proper color library
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `rgb(${Math.min(255, R)}, ${Math.min(255, G)}, ${Math.min(255, B)})`;
}

/**
 * Helper: Darken a color
 */
function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return `rgb(${Math.max(0, R)}, ${Math.max(0, G)}, ${Math.max(0, B)})`;
}

/**
 * Create 3D extrusion effect (simulated)
 */
export function create3DEffect(color: string, depth: number = 4) {
  return {
    itemStyle: {
      color: color,
    },
  };
}

/**
 * Chromatic aberration effect
 */
export function createChromaticAberration(color: string) {
  // Shadow effects disabled for cleaner visuals
  return {};
}

/**
 * Liquid/fluid motion effect configuration
 */
export function createFluidEffect() {
  return {
    smooth: true,
    smoothMonotone: 'x',
    showSymbol: false,
    lineStyle: {
      width: 4,
      cap: 'round',
      join: 'round',
    },
  };
}
