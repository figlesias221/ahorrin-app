'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getPieChartConfig,
  createPieSeries,
  getLegendConfig,
  getTooltipConfig,
} from '@/lib/charts/config';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLabels?: boolean;
  showLegend?: boolean;
  tooltipFormatter?: (value: number) => string;
  labelFormatter?: (name: string, percentage: number) => string;
  minPercentageForLabel?: number;
}

export function PieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius,
  showLabels = false,
  showLegend = false,
  tooltipFormatter,
  labelFormatter,
  minPercentageForLabel = 3,
}: PieChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Get base configuration
  const baseConfig = getPieChartConfig(theme, {
    showLabels,
    showLegend,
    innerRadius,
    outerRadius,
  });

  // Create series with theme support
  const pieSeries = createPieSeries(data, {
    theme,
    innerRadius,
    outerRadius,
    showLabels,
  });

  // Override label formatter if needed
  if (showLabels) {
    pieSeries.label = {
      ...pieSeries.label,
      position: 'outside',
      alignTo: 'edge',
      edgeDistance: '15%',
      lineHeight: 15,
      formatter: (params: unknown) => {
        const percentage = ((params.value / total) * 100).toFixed(1);
        if (parseFloat(percentage) < minPercentageForLabel) return '';
        return labelFormatter
          ? labelFormatter(params.name, parseFloat(percentage))
          : `{name|${params.name}}\n{percent|${percentage}%}`;
      },
      rich: {
        name: {
          fontSize: 11,
          fontWeight: 600,
        },
        percent: {
          fontSize: 10,
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
        },
      },
    };
    pieSeries.labelLine = {
      ...pieSeries.labelLine,
      length: 10,
      length2: 15,
      smooth: true,
    };
  }

  // Configure legend with custom formatter if needed
  const legendConfig = showLegend
    ? {
        ...getLegendConfig(theme),
        show: true,
        right: 0,
        top: 'center',
        orient: 'vertical',
        itemGap: 12,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        },
        formatter: (name: string) => {
          const item = data.find((d) => d.name === name);
          if (!item) return name;
          const percentage = ((item.value / total) * 100).toFixed(1);
          const formattedValue = tooltipFormatter
            ? tooltipFormatter(item.value)
            : item.value.toLocaleString();
          return `{name|${name}}\n{value|${formattedValue}} {percent|(${percentage}%)}`;
        },
        textStyle: {
          rich: {
            name: {
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 20,
            },
            value: {
              fontSize: 11,
              color: theme === 'dark' ? '#e2e8f0' : '#475569',
              lineHeight: 20,
            },
            percent: {
              fontSize: 10,
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
            },
          },
        },
      }
    : { show: false };

  // Configure tooltip with custom formatter
  const tooltipConfig = {
    ...getTooltipConfig(theme),
    trigger: 'item' as const,
    formatter: (params: unknown) => {
      const value = params.value;
      const percentage = ((value / total) * 100).toFixed(1);
      const formatted = tooltipFormatter
        ? tooltipFormatter(value)
        : value.toLocaleString();
      return `
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${params.name}</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${params.marker}
          <span style="font-weight: 500;">${formatted}</span>
        </div>
        <div style="margin-top: 4px; opacity: 0.8;">Porcentaje: ${percentage}%</div>
      `;
    },
  };

  const option: EChartsOption = {
    ...baseConfig,
    series: [pieSeries],
    legend: legendConfig,
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
