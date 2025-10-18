'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getLineChartConfig,
  createLineSeries,
  getTooltipConfig,
  getChartColors,
} from '@/lib/charts/config';

interface DataPoint {
  [key: string]: string | number;
}

interface Dataset {
  key: string;
  label: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

interface LineChartProps {
  data: DataPoint[];
  xKey: string;
  datasets: Dataset[];
  height?: number;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  showLegend?: boolean;
}

export function LineChart({
  data,
  xKey,
  datasets,
  height = 180,
  yAxisFormatter,
  tooltipFormatter,
  showLegend = false,
}: LineChartProps) {
  const { theme } = useTheme();
  const labels = data.map((item) => item[xKey] as string);
  const colors = getChartColors(theme);

  // Get base configuration
  const baseConfig = getLineChartConfig(theme, { showLegend });

  // Create series for each dataset
  const series = datasets.map((dataset) => {
    const seriesData = data.map((item) => item[dataset.key] as number);

    return createLineSeries(seriesData, {
      name: dataset.label,
      color: dataset.color,
      theme,
      strokeWidth: dataset.strokeWidth,
      strokeDasharray: dataset.strokeDasharray,
      showSymbol: false,
    });
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

  // Configure tooltip
  const tooltipConfig = {
    ...getTooltipConfig(theme),
    trigger: 'axis' as const,
    axisPointer: {
      type: 'cross' as const,
      crossStyle: {
        color: colors.text.muted,
        width: 1,
        type: 'dashed' as const,
      },
      lineStyle: {
        color: colors.text.muted,
        width: 1,
        type: 'dashed' as const,
      },
    },
    formatter: (params: unknown) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      const lines = paramsArray.map((param) => {
        const value = param.value;
        const formatted = tooltipFormatter
          ? tooltipFormatter(value)
          : value.toLocaleString();
        return `
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            ${param.marker}
            <span style="font-weight: 500;">${param.seriesName}:</span>
            <span style="font-weight: 600;">${formatted}</span>
          </div>
        `;
      });
      return `
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${paramsArray[0].name}</div>
        ${lines.join('')}
      `;
    },
  };

  const option: EChartsOption = {
    ...baseConfig,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series,
    tooltip: tooltipConfig,
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
