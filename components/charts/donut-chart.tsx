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
import {
  getEntranceAnimation,
  DURATION,
  EASING,
} from '@/lib/charts/animations';
import {
  createNeonGlow,
  GLOW_INTENSITY,
} from '@/lib/charts/effects';
import {
  createAdvancedTooltip,
  createToolbox,
} from '@/lib/charts/interactions';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  currency?: string;
}

export function DonutChart({ data, currency = 'UYU' }: DonutChartProps) {
  const { theme } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Fixed height without legend
  const chartHeight = 300;

  // Get base configuration for donut (pie with inner radius)
  const baseConfig = getPieChartConfig(theme, {
    showLabels: false,
    showLegend: false,
    innerRadius: '65%',
    outerRadius: '85%',
  });

  // Premium entrance animation
  const animations = getEntranceAnimation('pie', {
    duration: DURATION.dramatic,
    easing: EASING.bounceOut,
    stagger: true,
    dramatic: true,
  });

  // Create donut series with neon glow
  const donutSeries = createPieSeries(data, {
    theme,
    innerRadius: '65%',
    outerRadius: '85%',
    showLabels: false,
  });

  // Enhance each slice with neon glow effect
  donutSeries.data = donutSeries.data.map((item, index) => {
    const neonEffect = createNeonGlow(item.itemStyle.color, GLOW_INTENSITY.strong);

    return {
      ...item,
      itemStyle: {
        ...item.itemStyle,
        ...neonEffect.itemStyle,
      },
      emphasis: {
        ...item.emphasis,
        scale: 1.15,
        scaleSize: 15,
        itemStyle: {
          ...item.emphasis?.itemStyle,
          borderWidth: 5,
          borderColor: theme === 'dark' ? '#000000' : '#ffffff',
        },
      },
    };
  });

  // Center the donut chart slightly higher
  donutSeries.center = ['50%', '45%'];

  // Legend disabled for cleaner look
  const legendConfig = {
    show: false,
  };

  // Advanced tooltip with premium styling
  const advancedTooltip = createAdvancedTooltip(theme, {
    trigger: 'item',
    showDelay: 0,
    hideDelay: 100,
    transitionDuration: 0.3,
  });

  const tooltipConfig = {
    ...getTooltipConfig(theme),
    ...advancedTooltip,
    formatter: (params: unknown) => {
      const value = params.value;
      const percentage = ((value / total) * 100).toFixed(1);
      const color = params.color;

      return `
        <div style="
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          color: ${color};
        ">
          ${params.name}
        </div>
        <div style="
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
        ">
          <span style="
            transform: scale(1.2);
          ">${params.marker}</span>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 18px; color: ${color};">
              ${formatCurrency(value)}
            </div>
            <div style="
              font-size: 13px;
              opacity: 0.9;
              margin-top: 2px;
              font-weight: 600;
            ">
              ${percentage}% del total
            </div>
          </div>
        </div>
      `;
    },
  };

  // Toolbox for export
  const toolbox = createToolbox(theme, {
    saveAsImage: true,
    restore: false,
    dataZoom: false,
  });

  const option: EChartsOption = {
    ...baseConfig,
    ...animations,
    series: [donutSeries],
    legend: legendConfig,
    tooltip: tooltipConfig,
    toolbox,
  };

  return (
    <div className="w-full overflow-hidden">
      <ReactECharts
        option={option}
        style={{ height: `${chartHeight}px`, width: '100%' }}
        opts={{ renderer: 'canvas' }}
        theme={theme}
      />
    </div>
  );
}
