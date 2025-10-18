'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getBarChartConfig,
  createBarSeries,
  getTooltipConfig,
  getChartColors,
} from '@/lib/charts/config';
import {
  getEntranceAnimation,
  DURATION,
  EASING,
} from '@/lib/charts/animations';
import {
  create3DEffect,
} from '@/lib/charts/effects';
import {
  createAdvancedTooltip,
  createToolbox,
  createClickConfig,
} from '@/lib/charts/interactions';

interface DataPoint {
  [key: string]: string | number;
}

interface Dataset {
  key: string;
  label?: string;
  color: string | ((index: number) => string);
  radius?: number[];
}

interface BarChartProps {
  data: DataPoint[];
  xKey: string;
  datasets: Dataset[];
  height?: number;
  horizontal?: boolean;
  yAxisFormatter?: (value: number) => string;
  xAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  showLegend?: boolean;
}

export function BarChart({
  data,
  xKey,
  datasets,
  height = 180,
  horizontal = false,
  yAxisFormatter,
  xAxisFormatter,
  tooltipFormatter,
  showLegend = false,
}: BarChartProps) {
  const { theme } = useTheme();
  const labels = data.map((item) => item[xKey] as string);
  const colors = getChartColors(theme);

  // Get base configuration
  const baseConfig = getBarChartConfig(theme, { horizontal, showLegend });

  // Subtle entrance animations with stagger
  const animations = getEntranceAnimation('bar', {
    duration: DURATION.normal,
    easing: EASING.smooth,
    stagger: true,
    dramatic: false,
  });

  // Create series for each dataset with clean styling
  const series = datasets.map((dataset) => {
    const isColorFunction = typeof dataset.color === 'function';
    const colorFunction = isColorFunction
      ? (dataset.color as (index: number) => string)
      : () => dataset.color as string;

    // Map data to proper format
    const barData = data.map((item, index) => ({
      value: item[dataset.key] as number,
      colorIndex: index,
    }));

    const barSeries = createBarSeries(barData, {
      name: dataset.label || '',
      colorFunction,
      theme,
      horizontal,
      radius: dataset.radius,
    });

    // Clean minimal styling
    return {
      ...barSeries,
      // Click interaction
      ...createClickConfig('select'),
      // Subtle emphasis
      emphasis: {
        ...barSeries.emphasis,
        scale: 2.05,
        itemStyle: {
          ...barSeries.emphasis?.itemStyle,
          borderWidth: 0,
        },
      },
    };
  });

  // Apply custom axis formatters
  const xAxisConfig = {
    ...baseConfig.xAxis,
    data: horizontal ? undefined : labels,
    axisLabel: {
      ...baseConfig.xAxis?.axisLabel,
      formatter: horizontal
        ? (value: number) => xAxisFormatter?.(value) ?? value.toString()
        : undefined,
    },
  };

  const yAxisConfig = {
    ...baseConfig.yAxis,
    data: horizontal ? labels : undefined,
    axisLabel: {
      ...baseConfig.yAxis?.axisLabel,
      formatter: horizontal
        ? undefined
        : (value: number) => yAxisFormatter?.(value) ?? value.toString(),
    },
  };

  // Premium tooltip with advanced effects
  const advancedTooltip = createAdvancedTooltip(theme, {
    trigger: 'axis',
    axisPointerType: 'shadow',
    showDelay: 0,
    hideDelay: 50,
    transitionDuration: 0.2,
  });

  const tooltipConfig = {
    ...getTooltipConfig(theme),
    ...advancedTooltip,
    formatter: (params: unknown) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      const lines = paramsArray.map((param) => {
        const value = param.value?.value ?? param.value;
        const formatted = tooltipFormatter
          ? tooltipFormatter(value)
          : value.toLocaleString();

        // Clean minimal tooltip
        return param.seriesName
          ? `<div style="
               display: flex;
               align-items: center;
               gap: 10px;
               margin-top: 6px;
               padding: 4px 0;
             ">
               <span>${param.marker}</span>
               <span style="font-weight: 500; opacity: 0.8;">${param.seriesName}:</span>
               <span style="font-weight: 600; color: ${param.color};">${formatted}</span>
             </div>`
          : `<div style="
               display: flex;
               align-items: center;
               gap: 10px;
               margin-top: 6px;
               padding: 4px 0;
             ">
               <span>${param.marker}</span>
               <span style="font-weight: 600; color: ${param.color};">${formatted}</span>
             </div>`;
      });
      return `
        <div style="
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 12px;
          letter-spacing: -0.03em;
        ">
          ${paramsArray[0].name}
        </div>
        ${lines.join('')}
      `;
    },
  };

  // Toolbox disabled for cleaner look
  const toolbox = { show: false };

  const option: EChartsOption = {
    ...baseConfig,
    ...animations,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series,
    tooltip: tooltipConfig,
    toolbox,
    // Performance optimization
    progressive: 400,
    progressiveThreshold: 1000,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      theme={theme}
    />
  );
}
