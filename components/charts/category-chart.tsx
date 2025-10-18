'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import { useMemo, useCallback } from 'react';
import {
  getBarChartConfig,
  getTooltipConfig,
  getChartColors,
  createGradient,
} from '@/lib/charts/config';

interface CategoryChartProps {
  data: {
    category: string;
    amount: number;
    color: string;
  }[];
  onCategoryClick?: (category: string) => void;
  groupSmallCategories?: boolean;
  smallCategoryThreshold?: number;
}

export function CategoryChart({
  data,
  onCategoryClick,
  groupSmallCategories = true,
  smallCategoryThreshold = 0.02
}: CategoryChartProps) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);

  // Get base bar chart configuration
  const baseConfig = getBarChartConfig(theme, { horizontal: false, showLegend: false });

  // Customize x-axis with rotation
  const xAxisConfig = {
    ...baseConfig.xAxis,
    data: data.map((item) => item.category),
    axisLabel: {
      ...baseConfig.xAxis?.axisLabel,
      rotate: 45,
    },
  };

  // Customize y-axis with formatter
  const yAxisConfig = {
    ...baseConfig.yAxis,
    axisLabel: {
      ...baseConfig.yAxis?.axisLabel,
      formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
    },
  };

  // Configure tooltip
  const tooltipConfig = {
    ...getTooltipConfig(theme),
    trigger: 'axis' as const,
    axisPointer: {
      type: 'shadow' as const,
      shadowStyle: {
        color: colors.interactive.hover,
      },
    },
    formatter: (params: unknown) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      const value = paramsArray[0].value?.value ?? paramsArray[0].value;
      return `
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${paramsArray[0].name}</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600;">$${value.toLocaleString()}</span>
        </div>
      `;
    },
  };

  const option: EChartsOption = {
    ...baseConfig,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '10%',
      containLabel: true,
    },
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series: [
      {
        name: 'Monto',
        type: 'bar',
        data: data.map((item) => ({
          value: item.amount,
          itemStyle: {
            color: item.color,
            borderRadius: [8, 8, 0, 0],
          },
        })),
      },
    ],
    tooltip: tooltipConfig,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ReactECharts
          option={option}
          style={{ height: '350px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          theme={theme}
        />
      </CardContent>
    </Card>
  );
}
