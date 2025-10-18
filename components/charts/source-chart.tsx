'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getBaseChartConfig,
  getGridConfig,
  getAxisConfig,
  getLegendConfig,
  getTooltipConfig,
  getChartColors,
} from '@/lib/charts/config';

interface SourceData {
  source: string;
  count: number;
  amount: number;
  color: string;
}

interface SourceChartProps {
  data: SourceData[];
  height?: number;
  valueFormatter?: (value: number) => string;
  showAmount?: boolean;
}

export function SourceChart({
  data,
  height = 300,
  valueFormatter,
  showAmount = true,
}: SourceChartProps) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  // Get base configuration
  const baseConfig = getBaseChartConfig(theme);
  const axisConfig = getAxisConfig(theme);

  const option: EChartsOption = {
    ...baseConfig,
    grid: getGridConfig(true),
    xAxis: {
      type: 'category',
      data: sortedData.map((item) => item.source),
      ...axisConfig,
      splitLine: { show: false },
      axisLabel: {
        ...axisConfig.axisLabel,
        fontSize: 12,
        fontWeight: 500,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: showAmount ? 'Monto Total' : 'Cantidad',
        nameTextStyle: {
          fontSize: 11,
          color: colors.text.muted,
          fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        },
        ...axisConfig,
        axisLabel: {
          ...axisConfig.axisLabel,
          formatter: (value: number) => {
            if (showAmount && valueFormatter) {
              return valueFormatter(value);
            }
            return value.toString();
          },
        },
      },
      {
        type: 'value',
        name: 'Transacciones',
        nameTextStyle: {
          fontSize: 11,
          color: colors.text.muted,
          fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          ...axisConfig.axisLabel,
        },
      },
    ],
    series: [
      {
        name: showAmount ? 'Monto Total' : 'Cantidad',
        type: 'bar',
        yAxisIndex: 0,
        data: sortedData.map((item) => ({
          value: showAmount ? item.amount : item.count,
          itemStyle: {
            color: item.color,
            borderRadius: [8, 8, 0, 0],
          },
        })),
        barMaxWidth: 60,
      },
      {
        name: 'Transacciones',
        type: 'line',
        yAxisIndex: 1,
        data: sortedData.map((item) => item.count),
        lineStyle: {
          color: '#8b5cf6',
          width: 3,
        },
        itemStyle: {
          color: '#8b5cf6',
          borderColor: colors.background.card,
          borderWidth: 2,
        },
        symbol: 'circle',
        symbolSize: 8,
        smooth: true,
        emphasis: {
          symbolSize: 12,
        },
      },
    ],
    legend: {
      ...getLegendConfig(theme),
      show: true,
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 14,
    },
    tooltip: {
      ...getTooltipConfig(theme),
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: colors.interactive.hover,
        },
      },
      formatter: (params: unknown) => {
        if (!Array.isArray(params)) params = [params];

        const sourceName = params[0].name;
        const sourceData = sortedData.find((d) => d.source === sourceName);

        if (!sourceData) return '';

        const lines = [];
        lines.push(
          `<div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${sourceName}</div>`
        );

        if (showAmount && valueFormatter) {
          lines.push(`
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              ${params[0].marker}
              <span style="font-weight: 500;">Monto Total:</span>
              <span style="font-weight: 600;">${valueFormatter(sourceData.amount)}</span>
            </div>
          `);
        } else {
          lines.push(`
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              ${params[0].marker}
              <span style="font-weight: 500;">Cantidad:</span>
              <span style="font-weight: 600;">${sourceData.count}</span>
            </div>
          `);
        }

        lines.push(`
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            ${params[1]?.marker || '●'}
            <span style="font-weight: 500;">Transacciones:</span>
            <span style="font-weight: 600;">${sourceData.count}</span>
          </div>
        `);

        return lines.join('');
      },
    },
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
