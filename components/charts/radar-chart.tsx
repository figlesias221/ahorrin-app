'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getRadarChartConfig,
  getTooltipConfig,
  createShadow,
} from '@/lib/charts/config';

interface RadarIndicator {
  name: string;
  max: number;
}

interface RadarDataset {
  name: string;
  values: number[];
  color: string;
}

interface RadarChartProps {
  indicators: RadarIndicator[];
  datasets: RadarDataset[];
  height?: number;
  showLegend?: boolean;
}

export function RadarChart({
  indicators,
  datasets,
  height = 400,
  showLegend = true,
}: RadarChartProps) {
  const { theme } = useTheme();

  // Get base radar configuration
  const baseConfig = getRadarChartConfig(theme, { showLegend });

  // Create series data with theme-aware styling
  const series = datasets.map((dataset) => ({
    name: dataset.name,
    value: dataset.values,
    itemStyle: {
      color: dataset.color,
    },
    lineStyle: {
      width: 3,
      color: dataset.color,
    },
    areaStyle: {
      color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [
          {
            offset: 0,
            color: createShadow(dataset.color, 0.4),
          },
          {
            offset: 1,
            color: createShadow(dataset.color, 0.1),
          },
        ],
      },
    },
    symbol: 'circle',
    symbolSize: 8,
    emphasis: {
      symbolSize: 12,
      lineStyle: {
        width: 4,
      },
    },
  }));

  // Configure tooltip
  const tooltipConfig = {
    ...getTooltipConfig(theme),
    trigger: 'item' as const,
    formatter: (params: unknown) => {
      const { name, value } = params as { name: string; value: number[] };
      const lines = indicators.map((indicator, idx) => {
        const percentage = ((value[idx] / indicator.max) * 100).toFixed(0);
        return `
          <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px;">
            <span style="font-weight: 500;">${indicator.name}:</span>
            <span style="font-weight: 600;">${value[idx]} <span style="opacity: 0.7;">(${percentage}%)</span></span>
          </div>
        `;
      });
      return `
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${name}</div>
        ${lines.join('')}
      `;
    },
  };

  // Update radar configuration with indicators
  const radarConfig = {
    ...baseConfig.radar,
    indicator: indicators,
  };

  const option: EChartsOption = {
    ...baseConfig,
    radar: radarConfig,
    series: [
      {
        type: 'radar',
        data: series,
        emphasis: {
          focus: 'series',
        },
      },
    ],
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
