'use client';

/**
 * Chart Configuration Utility
 *
 * Provides standardized, theme-aware configurations for all chart types.
 * Ensures consistency and pixel-perfect styling across the application.
 */

import type { EChartsOption } from 'echarts';
import {
  type ChartTheme,
  getChartColors,
  getTooltipConfig,
  getAxisConfig,
  getLegendConfig,
  getGridConfig,
  createGradient,
  createAreaGradient,
  createShadow,
  getEmphasisStyle,
  getAnimationConfig,
  getEChartsTheme,
} from './theme';

/**
 * Base configuration for all charts
 */
export function getBaseChartConfig(theme: ChartTheme): Partial<EChartsOption> {
  const themeConfig = getEChartsTheme(theme);
  const animationConfig = getAnimationConfig();

  return {
    ...themeConfig,
    ...animationConfig,
  };
}

/**
 * Configuration for line charts
 */
export function getLineChartConfig(
  theme: ChartTheme,
  options: {
    smooth?: boolean;
    showSymbol?: boolean;
    showLegend?: boolean;
  } = {}
): Partial<EChartsOption> {
  const { showLegend = false } = options;
  const colors = getChartColors(theme);

  return {
    ...getBaseChartConfig(theme),
    grid: getGridConfig(showLegend),
    xAxis: {
      type: 'category',
      boundaryGap: false,
      ...getAxisConfig(theme),
    },
    yAxis: {
      type: 'value',
      ...getAxisConfig(theme),
      splitLine: {
        show: true,
        lineStyle: {
          color: colors.border.splitLine,
          width: 1,
        },
      },
    },
    tooltip: {
      ...getTooltipConfig(theme),
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: colors.text.muted,
          width: 1,
          type: 'dashed',
        },
        lineStyle: {
          color: colors.text.muted,
          width: 1,
          type: 'dashed',
        },
      },
    },
    legend: showLegend
      ? {
          ...getLegendConfig(theme),
          show: true,
          bottom: 0,
        }
      : { show: false },
  };
}

/**
 * Configuration for area charts
 */
export function getAreaChartConfig(
  theme: ChartTheme,
  options: {
    showLegend?: boolean;
  } = {}
): Partial<EChartsOption> {
  const { showLegend = true } = options;

  return {
    ...getLineChartConfig(theme, { smooth: true, showSymbol: false, showLegend }),
  };
}

/**
 * Configuration for bar charts
 */
export function getBarChartConfig(
  theme: ChartTheme,
  options: {
    horizontal?: boolean;
    showLegend?: boolean;
  } = {}
): Partial<EChartsOption> {
  const { horizontal = false, showLegend = false } = options;
  const colors = getChartColors(theme);
  const axisConfig = getAxisConfig(theme);

  const categoryAxis = {
    type: 'category' as const,
    ...axisConfig,
    splitLine: { show: false },
    axisLabel: {
      ...axisConfig.axisLabel,
      interval: 0,
      overflow: 'truncate' as const,
      width: horizontal ? 120 : undefined,
    },
  };

  const valueAxis = {
    type: 'value' as const,
    ...axisConfig,
    splitLine: {
      show: true,
      lineStyle: {
        color: colors.border.splitLine,
        width: 1,
      },
    },
  };

  return {
    ...getBaseChartConfig(theme),
    grid: horizontal
      ? { left: 140, right: '4%', bottom: showLegend ? '18%' : '8%', top: '5%', containLabel: false }
      : getGridConfig(showLegend),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    tooltip: {
      ...getTooltipConfig(theme),
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: colors.interactive.hover,
        },
      },
    },
    legend: showLegend
      ? {
          ...getLegendConfig(theme),
          show: true,
          bottom: 0,
        }
      : { show: false },
  };
}

/**
 * Configuration for pie/donut charts
 */
export function getPieChartConfig(
  theme: ChartTheme,
  options: {
    showLabels?: boolean;
    showLegend?: boolean;
    innerRadius?: string | number;
    outerRadius?: string | number;
  } = {}
): Partial<EChartsOption> {
  const { showLegend = false } = options;

  return {
    ...getBaseChartConfig(theme),
    tooltip: {
      ...getTooltipConfig(theme),
      trigger: 'item',
    },
    legend: showLegend
      ? {
          ...getLegendConfig(theme),
          show: true,
          bottom: 0,
        }
      : { show: false },
  };
}

/**
 * Configuration for radar charts
 */
export function getRadarChartConfig(
  theme: ChartTheme,
  options: {
    showLegend?: boolean;
  } = {}
): Partial<EChartsOption> {
  const { showLegend = true } = options;
  const colors = getChartColors(theme);
  const isDark = theme === 'dark';

  return {
    ...getBaseChartConfig(theme),
    radar: {
      shape: 'polygon',
      center: ['50%', '50%'],
      radius: '70%',
      splitNumber: 4,
      name: {
        textStyle: {
          color: colors.text.primary,
          fontSize: 12,
          fontWeight: '600',
          fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        },
      },
      splitLine: {
        lineStyle: {
          color: colors.border.splitLine,
          width: 1,
        },
      },
      splitArea: {
        areaStyle: {
          color: isDark
            ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
            : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.01)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: colors.border.primary,
          width: 1,
        },
      },
    },
    tooltip: {
      ...getTooltipConfig(theme),
      trigger: 'item',
    },
    legend: showLegend
      ? {
          ...getLegendConfig(theme),
          show: true,
          bottom: 10,
        }
      : { show: false },
  };
}

/**
 * Create line series with theme-aware styling
 */
export function createLineSeries(
  data: number[],
  options: {
    name: string;
    color: string;
    theme: ChartTheme;
    strokeWidth?: number;
    strokeDasharray?: string;
    showSymbol?: boolean;
  }
) {
  const { name, color, theme, strokeWidth = 2, strokeDasharray, showSymbol = false } = options;
  const colors = getChartColors(theme);

  const lineStyle: {
    width: number;
    color: string;
    type?: 'solid' | 'dashed';
  } = {
    width: strokeWidth,
    color: color,
  };

  if (strokeDasharray) {
    const dashArray = strokeDasharray.split(' ').map(Number);
    lineStyle.type = dashArray.length > 1 ? 'dashed' : 'solid';
  }

  return {
    name,
    type: 'line' as const,
    data,
    smooth: true,
    smoothMonotone: 'x',
    lineStyle,
    itemStyle: {
      color,
      borderColor: colors.background.card,
      borderWidth: 1,
    },
    symbolSize: showSymbol ? 4 : 0,
    showSymbol,
    emphasis: {
      focus: 'series',
      symbolSize: 8,
      itemStyle: {
        color: colors.background.card,
        borderColor: color,
        borderWidth: 2,
      },
    },
  };
}

/**
 * Create area series with theme-aware styling
 */
export function createAreaSeries(
  data: number[],
  options: {
    name: string;
    color: string;
    theme: ChartTheme;
    fillOpacity?: number;
  }
) {
  const { name, color, theme, fillOpacity = 0.2 } = options;
  const colors = getChartColors(theme);

  // Convert color to rgba with opacity
  const areaColor = color.includes('rgba')
    ? color.replace(/[\d.]+\)$/g, `${fillOpacity})`)
    : color.replace('rgb', 'rgba').replace(')', `, ${fillOpacity})`);

  return {
    name,
    type: 'line' as const,
    data,
    smooth: true,
    smoothMonotone: 'x',
    lineStyle: {
      width: 2,
      color,
    },
    areaStyle: {
      color: areaColor,
    },
    symbolSize: 0,
    showSymbol: false,
    emphasis: {
      focus: 'series',
      symbolSize: 6,
      itemStyle: {
        color: colors.background.card,
        borderColor: color,
        borderWidth: 2,
      },
    },
  };
}

/**
 * Create bar series with theme-aware styling
 */
export function createBarSeries(
  data: Array<{ value: number; colorIndex?: number }>,
  options: {
    name?: string;
    colorFunction: (index: number) => string;
    theme: ChartTheme;
    horizontal?: boolean;
    radius?: number[];
  }
) {
  const { name = '', colorFunction, theme, horizontal = false, radius = [0, 0, 0, 0] } = options;

  return {
    name,
    type: 'bar' as const,
    data: data.map((item, index) => {
      const baseColor = colorFunction(index);

      return {
        value: typeof item === 'object' ? item.value : item,
        itemStyle: {
          color: baseColor,
          borderRadius: horizontal ? [0, ...radius.slice(1, 3), 0] : radius,
        },
      };
    }),
    barMaxWidth: horizontal ? 32 : undefined,
    emphasis: {
      scale: true,
    },
  };
}

/**
 * Create pie/donut series with theme-aware styling
 */
export function createPieSeries(
  data: Array<{ name: string; value: number; color: string }>,
  options: {
    theme: ChartTheme;
    innerRadius?: string | number;
    outerRadius?: string | number;
    showLabels?: boolean;
  }
) {
  const { theme, innerRadius = 0, outerRadius = '75%', showLabels = false } = options;
  const colors = getChartColors(theme);

  const radiusConfig = (() => {
    if (typeof innerRadius === 'string' || typeof outerRadius === 'string') {
      return [innerRadius || '0%', outerRadius || '75%'];
    }
    const inner = typeof innerRadius === 'number' ? `${innerRadius}%` : '0%';
    const outer = typeof outerRadius === 'number' ? `${outerRadius}%` : '75%';
    return [inner, outer];
  })();

  return {
    type: 'pie' as const,
    radius: radiusConfig,
    center: ['50%', '50%'],
    data: data.map((item) => ({
      name: item.name,
      value: item.value,
      itemStyle: {
        color: item.color,
        borderColor: colors.background.card,
        borderWidth: 2,
      },
      emphasis: {
        itemStyle: {
          borderWidth: 3,
        },
        scale: true,
        scaleSize: 5,
      },
    })),
    label: {
      show: showLabels,
      fontSize: 11,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      fontWeight: 500,
      color: colors.text.primary,
    },
    labelLine: {
      show: showLabels,
      lineStyle: {
        color: colors.border.primary,
      },
    },
    animationType: 'scale',
    animationEasing: 'cubicInOut',
    animationDuration: 800,
  };
}

// Export all utilities
export {
  getChartColors,
  getTooltipConfig,
  getAxisConfig,
  getLegendConfig,
  getGridConfig,
  createGradient,
  createAreaGradient,
  createShadow,
  getEmphasisStyle,
  getAnimationConfig,
  getEChartsTheme,
};
