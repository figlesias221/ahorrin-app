'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/contexts/theme-context';
import {
  getLineChartConfig,
  createLineSeries,
  getTooltipConfig,
} from '@/lib/charts/config';

interface TrendChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const { theme } = useTheme();

  // Get base line chart configuration
  const baseConfig = getLineChartConfig(theme, { showLegend: true });

  // Create series for income and expenses
  const incomeSeries = createLineSeries(
    data.map((item) => item.income),
    {
      name: 'Ingresos',
      color: 'rgb(16, 185, 129)',
      theme,
      showSymbol: true,
    }
  );

  const expensesSeries = createLineSeries(
    data.map((item) => item.expenses),
    {
      name: 'Gastos',
      color: 'rgb(239, 68, 68)',
      theme,
      showSymbol: true,
    }
  );

  // Configure tooltip
  const tooltipConfig = {
    ...getTooltipConfig(theme),
    trigger: 'axis' as const,
    formatter: (params: unknown) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      const lines = paramsArray.map((param) => {
        const value = param.value;
        return `
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            ${param.marker}
            <span style="font-weight: 500;">${param.seriesName}:</span>
            <span style="font-weight: 600;">$${value.toLocaleString()}</span>
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
    xAxis: {
      ...baseConfig.xAxis,
      data: data.map((item) => item.month),
    },
    yAxis: {
      ...baseConfig.yAxis,
      axisLabel: {
        ...baseConfig.yAxis?.axisLabel,
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
      },
    },
    series: [incomeSeries, expensesSeries],
    tooltip: tooltipConfig,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia Mensual</CardTitle>
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
