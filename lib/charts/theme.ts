'use client';

/**
 * Chart Theme Configuration
 * Provides theme-aware styling for ECharts components
 */

import type { EChartsOption } from 'echarts';

export type ChartTheme = 'light' | 'dark';

interface ChartColors {
  primary: string[];
  background: {
    card: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    primary: string;
    splitLine: string;
  };
  interactive: {
    hover: string;
  };
}

export function getChartColors(theme: ChartTheme): ChartColors {
  const isDark = theme === 'dark';

  return {
    primary: isDark
      ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#14b8a6']
      : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#ec4899', '#06b6d4'],
    background: {
      card: isDark ? '#1e293b' : '#ffffff',
      hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    },
    text: {
      primary: isDark ? '#f1f5f9' : '#1e293b',
      secondary: isDark ? '#cbd5e1' : '#475569',
      muted: isDark ? '#64748b' : '#94a3b8',
    },
    border: {
      primary: isDark ? '#334155' : '#e2e8f0',
      splitLine: isDark ? '#334155' : '#f1f5f9',
    },
    interactive: {
      hover: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
    },
  };
}

export function getTooltipConfig(theme: ChartTheme): NonNullable<EChartsOption['tooltip']> {
  const colors = getChartColors(theme);
  const isDark = theme === 'dark';

  return {
    backgroundColor: colors.background.card,
    borderColor: colors.border.primary,
    borderWidth: 1,
    textStyle: {
      color: colors.text.primary,
      fontSize: 12,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    padding: [8, 12],
    extraCssText: isDark
      ? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);'
      : 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);',
  };
}

export function getAxisConfig(theme: ChartTheme) {
  const colors = getChartColors(theme);

  return {
    axisLine: {
      lineStyle: {
        color: colors.border.primary,
        width: 1,
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: colors.text.secondary,
      fontSize: 11,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      margin: 8,
    },
  };
}

export function getLegendConfig(theme: ChartTheme): NonNullable<EChartsOption['legend']> {
  const colors = getChartColors(theme);

  return {
    textStyle: {
      color: colors.text.primary,
      fontSize: 12,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 16,
    icon: 'circle',
  };
}

export function getGridConfig(hasLegend: boolean = false) {
  return {
    left: '3%',
    right: '4%',
    bottom: hasLegend ? '18%' : '8%',
    top: '5%',
    containLabel: true,
  };
}

export function createGradient(color: string, direction: 'vertical' | 'horizontal' = 'vertical') {
  const opacity1 = 0.8;
  const opacity2 = 0.2;

  if (direction === 'vertical') {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: color.replace(/[\d.]+\)$/g, `${opacity1})`) },
        { offset: 1, color: color.replace(/[\d.]+\)$/g, `${opacity2})`) },
      ],
    };
  }

  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      { offset: 0, color: color.replace(/[\d.]+\)$/g, `${opacity1})`) },
      { offset: 1, color: color.replace(/[\d.]+\)$/g, `${opacity2})`) },
    ],
  };
}

export function createAreaGradient(color: string) {
  return createGradient(color, 'vertical');
}

export function createShadow(color: string = '#000000', opacity: number = 0.1) {
  return {
    shadowColor: color,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowOpacity: opacity,
  };
}

export function getEmphasisStyle() {
  return {
    focus: 'series',
    blurScope: 'coordinateSystem',
  };
}

export function getAnimationConfig() {
  return {
    animation: true,
    animationDuration: 750,
    animationEasing: 'cubicOut',
    animationDelay: 0,
  };
}

export function getEChartsTheme(theme: ChartTheme): Partial<EChartsOption> {
  const colors = getChartColors(theme);

  return {
    color: colors.primary,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      fontSize: 12,
      color: colors.text.primary,
    },
  };
}
