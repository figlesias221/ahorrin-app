'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getAreaChartConfig,
  createAreaSeries,
  getTooltipConfig,
  getChartColors,
} from '@/lib/charts/config';
import {
  getEntranceAnimation,
  createHoverAnimation,
  getUpdateTransition,
  DURATION,
  EASING,
} from '@/lib/charts/animations';
import {
  createGlowEffect,
  GLOW_INTENSITY,
} from '@/lib/charts/effects';
import {
  createAdvancedTooltip,
  createDataZoom,
  createToolbox,
  createFocusConfig,
} from '@/lib/charts/interactions';

interface DataPoint {
  [key: string]: string | number;
}

interface Dataset {
  key: string;
  label: string;
  color: string;
  fillOpacity?: number;
}

interface AreaChartProps {
  data: DataPoint[];
  xKey: string;
  datasets: Dataset[];
  height?: number;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
}

export function AreaChart({
  data,
  xKey,
  datasets,
  height = 180,
  yAxisFormatter,
  tooltipFormatter,
}: AreaChartProps) {
  const { theme } = useTheme();
  const labels = data.map((item) => item[xKey] as string);

  // Get base configuration with legend
  const baseConfig = getAreaChartConfig(theme, { showLegend: true });

  // Subtle animations
  const animations = getEntranceAnimation('area', {
    duration: DURATION.normal,
    easing: EASING.smooth,
    stagger: false,
    dramatic: false,
  });

  // Create series for each dataset with clean styling
  const series = datasets.map((dataset, index) => {
    const seriesData = data.map((item) => item[dataset.key] as number);
    const areaSeries = createAreaSeries(seriesData, {
      name: dataset.label,
      color: dataset.color,
      theme,
      fillOpacity: dataset.fillOpacity,
    });

    // Add focus config for better accessibility
    const focusConfig = createFocusConfig();

    // Clean minimal styling
    return {
      ...areaSeries,
      ...focusConfig,
      animationDelay: index * 100,
      animationDuration: DURATION.normal,
      animationEasing: EASING.smooth,
      lineStyle: {
        ...areaSeries.lineStyle,
        cap: 'round',
        join: 'round',
      },
    };
  });

  // Apply custom axis formatters
  const xAxisConfig = {
    ...baseConfig.xAxis,
    data: labels,
  };

  const yAxisConfig = {
    ...baseConfig.yAxis,
    axisLabel: {
      ...baseConfig.yAxis?.axisLabel,
      formatter: (value: number) => yAxisFormatter?.(value) ?? value.toString(),
    },
  };

  // Advanced tooltip with smooth transitions
  const advancedTooltip = createAdvancedTooltip(theme, {
    trigger: 'axis',
    axisPointerType: 'cross',
    showDelay: 0,
    hideDelay: 100,
    transitionDuration: 0.3,
    confine: true,
  });

  const tooltipConfig = {
    ...getTooltipConfig(theme),
    ...advancedTooltip,
    formatter: (params: unknown) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      const lines = paramsArray.map((param) => {
        const value = param.value;
        const formatted = tooltipFormatter
          ? tooltipFormatter(value)
          : value.toLocaleString();

        // Clean minimal tooltip
        return `
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px; padding: 4px 0;">
            <span>${param.marker}</span>
            <span style="font-weight: 500; opacity: 0.8;">${param.seriesName}:</span>
            <span style="font-weight: 600; color: ${param.color};">${formatted}</span>
          </div>
        `;
      });
      return `
        <div style="font-weight: 700; font-size: 15px; margin-bottom: 10px; letter-spacing: -0.02em;">
          ${paramsArray[0].name}
        </div>
        ${lines.join('')}
      `;
    },
  };

  // Data zoom for interactive exploration
  const dataZoom = createDataZoom({
    type: 'inside',
    start: 0,
    end: 100,
    minSpan: 10,
  });

  // Toolbox disabled for cleaner look
  const toolbox = { show: false };

  // Update transitions
  const updateTransition = getUpdateTransition(true);

  const option: EChartsOption = {
    ...baseConfig,
    ...animations,
    ...updateTransition,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series,
    tooltip: tooltipConfig,
    dataZoom,
    toolbox,
    // Add smooth rendering
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
