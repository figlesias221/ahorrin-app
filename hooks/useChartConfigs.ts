'use client';

import { useState } from 'react';
import type { ChartType, CategoryViewType } from '@/types/dashboard';

export function useChartConfigs() {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [flujoChartType, setFlujoChartType] = useState<ChartType>('area');
  const [categoryViewType, setCategoryViewType] = useState<CategoryViewType>('pie');
  const [monthlyEvolutionViewType, setMonthlyEvolutionViewType] = useState<ChartType>('area');
  const [trendChartType, setTrendChartType] = useState<ChartType>('line');

  return {
    chartType, setChartType,
    flujoChartType, setFlujoChartType,
    categoryViewType, setCategoryViewType,
    monthlyEvolutionViewType, setMonthlyEvolutionViewType,
    trendChartType, setTrendChartType,
  };
}
