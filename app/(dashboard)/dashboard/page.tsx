'use client';

import { useEffect, useState, Fragment, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';
import { differenceInCalendarDays } from 'date-fns';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { PeriodSelector } from '@/components/ui/period-selector';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  TrendingUp, TrendingDown, PiggyBank,
  BarChart3, PieChart as PieChartIcon,
  Activity, GitBranch, BarChartIcon, ChevronDown,
  Plus, Search, Check, X, Upload
} from 'lucide-react';
import Link from 'next/link';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useCurrency } from '@/contexts/currency-context';
import { EmptyChartState } from '@/components/ui/empty-chart-state';
import { motion } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';
import { cn } from '@/lib/utils/cn';
import { QuickCategoryModal } from '@/components/upload/QuickCategoryModal';
import { CategoryDetailView } from '@/components/category/category-detail-view';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useChartConfigs } from '@/hooks/useChartConfigs';
import { useComparisonState } from '@/hooks/useComparisonState';

// Dynamic imports for charts to exclude from server bundle
const AreaChart = dynamic(() => import('@/components/charts/area-chart').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const LineChart = dynamic(() => import('@/components/charts/line-chart').then(mod => ({ default: mod.LineChart })), { ssr: false });
const BarChart = dynamic(() => import('@/components/charts/bar-chart').then(mod => ({ default: mod.BarChart })), { ssr: false });
const PieChart = dynamic(() => import('@/components/charts/pie-chart').then(mod => ({ default: mod.PieChart })), { ssr: false });
const DonutChart = dynamic(() => import('@/components/charts/donut-chart').then(mod => ({ default: mod.DonutChart })), { ssr: false });
const TreemapChart = dynamic(() => import('@/components/charts/treemap-chart').then(mod => ({ default: mod.TreemapChart })), { ssr: false });
const Sparkline = dynamic(() => import('@/components/charts/sparkline').then(mod => ({ default: mod.Sparkline })), { ssr: false });
import {
  calculateDateRange,
} from '@/lib/dashboard/utils';
import type {
  PeriodType,
  ViewType,
  ChartType,
  CategoryViewType,
} from '@/types/dashboard';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [periodType, setPeriodType] = useState<PeriodType>('thisYear');
  const [viewType, setViewType] = useState<ViewType>('resumen');
  const {
    chartType, setChartType,
    flujoChartType, setFlujoChartType,
    categoryViewType, setCategoryViewType,
    monthlyEvolutionViewType, setMonthlyEvolutionViewType,
    trendChartType, setTrendChartType,
  } = useChartConfigs();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [categoryTransactionType, setCategoryTransactionType] = useState<'expense' | 'income'>('expense');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryDropdownPosition, setCategoryDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [categorySearchText, setCategorySearchText] = useState('');
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);

  // Category detail view states
  const [selectedCategoryIdForDetail, setSelectedCategoryIdForDetail] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const {
    comparePeriodType, setComparePeriodType,
    compareStartDate, setCompareStartDate,
    compareEndDate, setCompareEndDate,
    showCompareSelector, setShowCompareSelector,
    showCompareIncome, setShowCompareIncome,
    showCompareExpenses, setShowCompareExpenses,
    showCompareSavings, setShowCompareSavings,
    comparePreset, setComparePreset,
  } = useComparisonState();

  // Data fetching hook
  const {
    loading,
    monthlyData,
    expenseCategories,
    incomeCategories,
    periodStats,
    compareMonthlyData,
    compareExpenseCategories,
    comparePeriodStats,
    sourceData,
    categoryMonthlyData,
    allCategories,
    currentDateRange,
    loadData,
  } = useDashboardData({
    periodType,
    startDate,
    endDate,
    comparePeriodType,
    compareStartDate,
    compareEndDate,
  });

  const formatRangeLabel = (start: string | undefined, end: string | undefined) => {
    if (!start || !end) return '—';
    const formatter = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${formatter.format(new Date(start))} → ${formatter.format(new Date(end))}`;
  };

  const formatDurationLabel = (start: string | undefined, end: string | undefined) => {
    if (!start || !end) return '';
    const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)) + 1);
    if (days === 1) return '1 día';
    if (days < 30) return `${days} días`;
    if (days < 45) return '≈ 1 mes';
    if (days < 365) return `≈ ${Math.round(days / 30)} meses`;
    if (days < 540) return '≈ 1 año';
    return `≈ ${(days / 365).toFixed(1)} años`;
  };

  const comparisonMetrics = [
    {
      key: 'income' as const,
      title: 'Total Ingresos',
      value: periodStats?.totalIncome ?? 0,
      compareValue: comparePeriodStats ? comparePeriodStats.totalIncome : null,
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      accentColor: '#10b981',
      comparisonColor: '#34d399',
      valueClassName: 'text-success',
    },
    {
      key: 'expenses' as const,
      title: 'Total Gastos',
      value: periodStats?.totalExpenses ?? 0,
      compareValue: comparePeriodStats ? comparePeriodStats.totalExpenses : null,
      icon: <TrendingDown className="h-5 w-5 text-error" />,
      accentColor: '#ef4444',
      comparisonColor: '#f87171',
      valueClassName: 'text-error',
    },
    {
      key: 'savings' as const,
      title: 'Total Ahorros',
      value: periodStats?.totalSavings ?? 0,
      compareValue: comparePeriodStats ? comparePeriodStats.totalSavings : null,
      icon: <PiggyBank className="h-5 w-5 text-primary" />,
      accentColor: '#8b5cf6',
      comparisonColor: '#c4b5fd',
      valueClassName: undefined,
    },
  ];

  const baseRange = calculateDateRange(periodType, startDate, endDate);
  const compareRange = calculateDateRange(comparePeriodType, compareStartDate, compareEndDate);
  const baseDurationDays = baseRange.start && baseRange.end
    ? Math.max(1, differenceInCalendarDays(new Date(baseRange.end), new Date(baseRange.start)) + 1)
    : null;
  const compareDurationDays = compareRange.start && compareRange.end
    ? Math.max(1, differenceInCalendarDays(new Date(compareRange.end), new Date(compareRange.start)) + 1)
    : null;
  const durationsMatch = baseDurationDays !== null && compareDurationDays !== null
    ? baseDurationDays === compareDurationDays
    : true;
  const baseRangeLabel = formatRangeLabel(baseRange.start, baseRange.end);
  const compareRangeLabel = formatRangeLabel(compareRange.start, compareRange.end);
  const baseDurationLabel = formatDurationLabel(baseRange.start, baseRange.end);
  const compareDurationLabel = formatDurationLabel(compareRange.start, compareRange.end);

  const { displayCurrency } = useCurrency();
  const categoryDropdownButtonRef = useRef<HTMLButtonElement>(null);

  const handleCategoryDropdownToggle = () => {
    if (!showCategoryDropdown && categoryDropdownButtonRef.current) {
      const rect = categoryDropdownButtonRef.current.getBoundingClientRect();
      setCategoryDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
    setShowCategoryDropdown(!showCategoryDropdown);
    setCategorySearchText('');
  };

  const handleCategoryCreated = (category: { id: string; name: string; color: string; type: 'income' | 'expense' }) => {
    // Reload data to include the new category
    loadData();
    // Close the dropdown
    setShowCategoryDropdown(false);
  };

  const setCompareRangeFromDates = (
    start: Date,
    end: Date,
    preset: 'previous-period' | 'previous-year' | 'custom' | null = null
  ) => {
    const startIso = start.toISOString().split('T')[0];
    const endIso = end.toISOString().split('T')[0];
    setComparePeriodType('custom');
    setCompareStartDate(startIso);
    setCompareEndDate(endIso);
    setComparePreset(preset ?? 'custom');
    setShowCompareSelector(false);
  };

  const handleComparePreviousPeriod = () => {
    const baseRange = calculateDateRange(periodType, startDate, endDate);
    const baseStart = new Date(baseRange.start);
    const baseEnd = new Date(baseRange.end);
    if (baseEnd < baseStart) return;

    let compareStart: Date;
    let compareEnd: Date;

    switch (periodType) {
      case 'lastMonth':
      case 'thisMonth':
        compareStart = new Date(baseStart);
        compareStart.setMonth(compareStart.getMonth() - 1);
        compareEnd = new Date(baseEnd);
        compareEnd.setMonth(compareEnd.getMonth() - 1);
        break;
      case 'last3months':
        compareStart = new Date(baseStart);
        compareStart.setMonth(compareStart.getMonth() - 3);
        compareEnd = new Date(baseEnd);
        compareEnd.setMonth(compareEnd.getMonth() - 3);
        break;
      case 'thisYear':
        compareStart = new Date(baseStart);
        compareStart.setFullYear(compareStart.getFullYear() - 1);
        compareEnd = new Date(baseEnd);
        compareEnd.setFullYear(compareEnd.getFullYear() - 1);
        break;
      case 'last7days':
      case 'last30days':
      default: {
        const days = Math.max(1, differenceInCalendarDays(baseEnd, baseStart) + 1);
        compareEnd = new Date(baseStart);
        compareEnd.setDate(compareEnd.getDate() - 1);
        compareStart = new Date(compareEnd);
        compareStart.setDate(compareStart.getDate() - (days - 1));
        break;
      }
    }

    setCompareRangeFromDates(compareStart, compareEnd, 'previous-period');
  };

  const handleComparePreviousYear = () => {
    const baseRange = calculateDateRange(periodType, startDate, endDate);
    const baseStart = new Date(baseRange.start);
    const baseEnd = new Date(baseRange.end);
    const prevYearStart = new Date(baseStart);
    const prevYearEnd = new Date(baseEnd);
    prevYearStart.setFullYear(prevYearStart.getFullYear() - 1);
    prevYearEnd.setFullYear(prevYearEnd.getFullYear() - 1);

    setCompareRangeFromDates(prevYearStart, prevYearEnd, 'previous-year');
  };

  // Show upgrade success toast
  useEffect(() => {
    if (searchParams.get('upgrade') === 'success') {
      showToast('Bienvenido a Pro! Tu suscripción está activa.', 'success');
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, showToast]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Select the correct categories based on transaction type
  const currentCategories = categoryTransactionType === 'expense' ? expenseCategories : incomeCategories;
  // currentParentCategories removed - parent category feature removed

  return (
    <div className="space-y-6 pb-10">
      {/* Header with Period Selector - Compact */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={motionVariants.fadeIn}
        className="flex flex-row items-center justify-between gap-3"
      >
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <span className="text-xs text-muted-foreground">
            · {displayCurrency}
          </span>
        </div>

        <PeriodSelector
          value={periodType}
          onChange={setPeriodType}
          onCustomRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          customStartDate={startDate}
          customEndDate={endDate}
          className="w-auto"
        />
      </motion.div>

      {!loading && monthlyData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenido a Ahorrin</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Subi tu primer extracto bancario para ver tus finanzas en graficas claras y simples.
          </p>
          <div className="flex gap-4">
            <Link href="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              <Upload className="h-5 w-5" />
              Subir Extracto
            </Link>
          </div>
        </div>
      ) : (
      <>
      {/* Enhanced Tab Navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        <button
          onClick={() => setViewType('resumen')}
          className={cn(
            "px-3 py-2 text-xs font-medium transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap",
            viewType === 'resumen'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Resumen
        </button>
        <button
          onClick={() => setViewType('analisis')}
          className={cn(
            "px-3 py-2 text-xs font-medium transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap",
            viewType === 'analisis'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <PieChartIcon className="h-3.5 w-3.5" />
          Categorías
        </button>
        <button
          onClick={() => setViewType('temporal')}
          className={cn(
            "px-3 py-2 text-xs font-medium transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap",
            viewType === 'temporal'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Activity className="h-3.5 w-3.5" />
          Análisis Temporal
        </button>
        <button
          onClick={() => setViewType('categoria-detalle')}
          className={cn(
            "px-3 py-2 text-xs font-medium transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap",
            viewType === 'categoria-detalle'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Detalle Categoría
        </button>
      </div>

      {/* VIEW: RESUMEN - Simplified Overview */}
      {viewType === 'resumen' && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={motionVariants.staggerContainer}
          className="space-y-6"
        >
          {/* Enhanced Key Metrics Cards with Sparklines */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <p className="text-xs font-medium text-muted-foreground">Ingresos Totales</p>
                      <InfoTooltip content="Cálculo: Se suman TODOS los ingresos del período. Ejemplo: Si tienes $100 de Salario y $50 de Freelance, el total es $150. No se restan gastos de la misma categoría." />
                    </div>
                    <p className="text-3xl font-semibold text-foreground tracking-tight">
                      {formatCurrency(periodStats?.totalIncome || 0, displayCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatCurrency(periodStats?.avgMonthlyIncome || 0, displayCurrency)}/mes
                    </p>
                    {/* Add Sparkline */}
                    {periodStats?.sparklineData && periodStats.sparklineData.length > 0 && (
                      <div className="mt-3">
                        <Sparkline
                          data={monthlyData.map(m => m.income)}
                          height={30}
                          color="#10b981"
                          strokeWidth={2}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-success/5 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <p className="text-xs font-medium text-muted-foreground">Gastos Totales</p>
                      <InfoTooltip content="Cálculo: Se suman TODOS los gastos del período. Ejemplo: Si gastaste $200 en Comida y $100 en Transporte, el total es $300. No se descuentan ingresos de la misma categoría." />
                    </div>
                    <p className="text-3xl font-semibold text-foreground tracking-tight">
                      {formatCurrency(periodStats?.totalExpenses || 0, displayCurrency)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(periodStats?.avgMonthlyExpenses || 0, displayCurrency)}/mes
                      </p>
                      {periodStats && periodStats.expenseTrend !== 'stable' && (
                        <span className={cn(
                          "text-xs font-medium flex items-center",
                          periodStats.expenseTrend === 'up' ? 'text-error' : 'text-success'
                        )}>
                          {periodStats.expenseTrend === 'up' ? '↑' : '↓'}
                          {Math.abs(periodStats.monthOverMonthChange).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {/* Add Sparkline */}
                    {periodStats?.sparklineData && periodStats.sparklineData.length > 0 && (
                      <div className="mt-3">
                        <Sparkline
                          data={periodStats.sparklineData}
                          height={30}
                          color="#ef4444"
                          strokeWidth={2}
                          trend={periodStats.expenseTrend}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-error/5 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-error" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Ahorro Neto</p>
                    <p className={cn(
                      "text-3xl font-semibold tracking-tight mt-0",
                      (periodStats?.totalSavings || 0) >= 0 ? 'text-success' : 'text-error'
                    )}>
                      {formatCurrency(periodStats?.totalSavings || 0, displayCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {periodStats?.savingsPercentage.toFixed(1)}% tasa
                    </p>
                    {/* Add Sparkline */}
                    {monthlyData.length > 0 && (
                      <div className="mt-3">
                        <Sparkline
                          data={monthlyData.map(m => m.savings)}
                          height={30}
                          color="#8b5cf6"
                          strokeWidth={2}
                        />
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "p-2.5 rounded-lg",
                    (periodStats?.totalSavings || 0) >= 0 ? 'bg-muted' : 'bg-error/5'
                  )}>
                    <PiggyBank className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Flujo Financiero - With Chart Type Options */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-foreground">Flujo Financiero</h2>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setFlujoChartType('area')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    flujoChartType === 'area' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Área
                </button>
                <button
                  onClick={() => setFlujoChartType('line')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    flujoChartType === 'line' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Línea
                </button>
                <button
                  onClick={() => setFlujoChartType('bar')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    flujoChartType === 'bar' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <BarChartIcon className="h-3.5 w-3.5" />
                  Barras
                </button>
              </div>
            </div>

            {/* Dynamic Chart Rendering with Empty State */}
            {monthlyData.length === 0 ? (
              <EmptyChartState
                height={300}
                message="No hay datos"
                subMessage="No hay transacciones para el período seleccionado"
                borderColor="#8b5cf6"
                iconColor="text-primary"
              />
            ) : (
              <>
                {flujoChartType === 'area' && (
                  <AreaChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981', fillOpacity: 0.3 },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444', fillOpacity: 0.3 },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6', fillOpacity: 0.2 },
                    ]}
                    height={300}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                )}
                {flujoChartType === 'line' && (
                  <LineChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981' },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6' },
                    ]}
                    height={300}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                )}
                {flujoChartType === 'bar' && (
                  <BarChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981' },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6' },
                    ]}
                    height={300}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    showLegend={true}
                  />
                )}
              </>
            )}
          </Card>

          {/* Top 5 Categories Summary */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Top 5 Gastos */}
            <Card className="p-6">
              <h2 className="text-base font-semibold mb-4">
                Principales Categorías de Gastos
              </h2>

              {/* Pie Chart */}
              {expenseCategories.length > 0 && (
                <div className="mb-6">
                  <PieChart
                    data={expenseCategories.slice(0, 5).map(cat => ({
                      name: cat.name,
                      value: cat.total,
                      color: cat.color
                    }))}
                    height={240}
                    showLegend={false}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                </div>
              )}

              {/* List View */}
              <div className="space-y-3">
                {expenseCategories.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(cat.total, displayCurrency)}
                      </span>
                      <div className="w-20">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: cat.color,
                              width: `${cat.percentage}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top 5 Ingresos */}
            <Card className="p-6">
              <h2 className="text-base font-semibold mb-4">
                Principales Categorías de Ingresos
              </h2>

              {/* Pie Chart */}
              {incomeCategories.length > 0 && (
                <div className="mb-6">
                  <PieChart
                    data={incomeCategories.slice(0, 5).map(cat => ({
                      name: cat.name,
                      value: cat.total,
                      color: cat.color
                    }))}
                    height={240}
                    showLegend={false}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                </div>
              )}

              {/* List View */}
              <div className="space-y-3">
                {incomeCategories.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(cat.total, displayCurrency)}
                      </span>
                      <div className="w-20">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: cat.color,
                              width: `${cat.percentage}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Source Distribution - Moved from Análisis */}
            {sourceData.length > 0 && (
              <Card className="p-6">
                <h2 className="text-base font-semibold mb-4">Distribución por Entidad Bancaria</h2>
                
                {/* Donut Chart */}
                <div className="mb-6">
                  <DonutChart 
                    data={sourceData.map(s => ({
                      name: s.source,
                      value: s.amount,
                      color: s.color
                    }))}
                    currency={displayCurrency}
                  />
                </div>

                {/* List View */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {sourceData.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-sm font-medium text-foreground">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(source.amount, displayCurrency)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {source.count} tx
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Total</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-foreground">
                        {formatCurrency(sourceData.reduce((sum, s) => sum + s.amount, 0), displayCurrency)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {sourceData.reduce((sum, s) => sum + s.count, 0)} tx
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {/* VIEW: ANÁLISIS - Enhanced Category Analysis */}
      {viewType === 'analisis' && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={motionVariants.staggerContainer}
          className="space-y-6"
        >
          {/* Category Distribution with Type Switcher */}
          <Card className="p-6">
            {/* Dynamic Chart Rendering with Empty State */}
              {(() => {
                // Show distribution charts for both expenses and income
                const expenseCats = expenseCategories;
                const incomeCats = incomeCategories;

                // Use totals from periodStats to match Resumen section
                const totalExpenses = periodStats?.totalExpenses ?? 0;
                const totalIncome = periodStats?.totalIncome ?? 0;

                return (
                <>
                  {/* Nota explicativa */}
                  <div className="mb-4 px-3 py-2 bg-muted/30 border-l-2 border-primary/50 rounded">
                    <p className="text-xs text-muted-foreground">
                      Los totales son montos brutos que incluyen todas las fuentes y coinciden con la sección Resumen.
                    </p>
                  </div>

                  {/* Summary Stats */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                      {/* Gastos */}
                      <div className="flex items-center gap-4 flex-1">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <p className="text-xs font-medium text-muted-foreground">Total en Gastos</p>
                            <InfoTooltip content="Coincide con Resumen. Se suman TODOS los gastos sin netear por categoría. Si una categoría tiene gastos e ingresos, ambos cuentan por separado." />
                          </div>
                          <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses, displayCurrency)}</p>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-border" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Categorías</p>
                          <p className="text-xl font-bold text-primary">{expenseCats.length}</p>
                        </div>
                      </div>

                      {/* Divider vertical solo en desktop */}
                      <div className="hidden sm:block h-12 w-px bg-border" />

                      {/* Ingresos */}
                      <div className="flex items-center gap-4 flex-1">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <p className="text-xs font-medium text-muted-foreground">Total en Ingresos</p>
                            <InfoTooltip content="Coincide con Resumen. Se suman TODOS los ingresos sin netear por categoría. Si una categoría tiene ingresos y gastos, ambos cuentan por separado." />
                          </div>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome, displayCurrency)}</p>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-border" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Categorías</p>
                          <p className="text-xl font-bold text-primary">{incomeCats.length}</p>
                        </div>
                      </div>

                      {/* Divider vertical solo en desktop */}
                      <div className="hidden lg:block h-12 w-px bg-border" />

                      {/* Chart Type Switcher */}
                      <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <span className="text-xs font-medium text-muted-foreground">Vista:</span>
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => setCategoryViewType('pie')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              categoryViewType === 'pie'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <PieChartIcon className="h-3.5 w-3.5" />
                            Circular
                          </button>
                          <button
                            onClick={() => setCategoryViewType('treemap')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              categoryViewType === 'treemap'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            Treemap
                          </button>
                          <button
                            onClick={() => setCategoryViewType('bar')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              categoryViewType === 'bar'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <BarChartIcon className="h-3.5 w-3.5" />
                            Barras
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts - Two Columns */}
                  <div className="mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expenses Column */}
                    <div className="space-y-4 p-6 bg-card rounded-xl border border-border shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">Categorías de Gastos</h3>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{expenseCats.length} categorías</span>
                      </div>
                      {expenseCats.length === 0 ? (
                        <EmptyChartState
                          height={300}
                          message="No hay gastos"
                          subMessage="No hay categorías de gastos en este período"
                        />
                      ) : (
                        <>
                          {categoryViewType === 'pie' && (
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <PieChart
                                  data={expenseCats.map(cat => ({
                                    name: cat.name,
                                    value: cat.total,
                                    color: cat.color,
                                  }))}
                                  height={350}
                                  innerRadius="40%"
                                  outerRadius="65%"
                                  showLabels={false}
                                  showLegend={false}
                                  tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                                />
                              </div>
                              <div className="w-48 flex-shrink-0">
                                <div className="h-[350px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                  {expenseCats.map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors">
                                      <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                      />
                                      <p className="text-xs font-medium text-foreground truncate flex-1" title={cat.name}>
                                        {cat.name}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {categoryViewType === 'treemap' && (
                            <TreemapChart
                              data={expenseCats.map(cat => ({
                                name: cat.name,
                                size: cat.total,
                                color: cat.color,
                              }))}
                              height={350}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          )}
                          {categoryViewType === 'bar' && (
                            <BarChart
                              data={expenseCats.map(cat => ({
                                name: cat.name,
                                value: cat.total,
                              }))}
                              xKey="name"
                              datasets={[
                                { key: 'value', label: 'Total', color: '#ef4444' }
                              ]}
                              height={350}
                              horizontal={true}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                              xAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Income Column */}
                    <div className="space-y-4 p-6 bg-card rounded-xl border border-border shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">Categorías de Ingresos</h3>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{incomeCats.length} categorías</span>
                      </div>
                      {incomeCats.length === 0 ? (
                        <EmptyChartState
                          height={300}
                          message="No hay ingresos"
                          subMessage="No hay categorías de ingresos en este período"
                        />
                      ) : (
                        <>
                          {categoryViewType === 'pie' && (
                            <div className="flex gap-4">
                              <div className="w-48 flex-shrink-0">
                                <div className="h-[350px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                  {incomeCats.map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors">
                                      <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                      />
                                      <p className="text-xs font-medium text-foreground truncate flex-1" title={cat.name}>
                                        {cat.name}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex-1">
                                <PieChart
                                  data={incomeCats.map(cat => ({
                                    name: cat.name,
                                    value: cat.total,
                                    color: cat.color,
                                  }))}
                                  height={350}
                                  innerRadius="40%"
                                  outerRadius="65%"
                                  showLabels={false}
                                  showLegend={false}
                                  tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                                />
                              </div>
                            </div>
                          )}
                          {categoryViewType === 'treemap' && (
                            <TreemapChart
                              data={incomeCats.map(cat => ({
                                name: cat.name,
                                size: cat.total,
                                color: cat.color,
                              }))}
                              height={350}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          )}
                          {categoryViewType === 'bar' && (
                            <BarChart
                              data={incomeCats.map(cat => ({
                                name: cat.name,
                                value: cat.total,
                              }))}
                              xKey="name"
                              datasets={[
                                { key: 'value', label: 'Total', color: '#10b981' }
                              ]}
                              height={350}
                              horizontal={true}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                              xAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  </div>

                  {/* Evolución Mensual por Categorías */}
                  <div className="mb-8">
                    <div className="flex items-center justify-end mb-4">
                      {/* View Type Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Vista:</span>
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => setMonthlyEvolutionViewType('area')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              monthlyEvolutionViewType === 'area'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <Activity className="h-3.5 w-3.5" />
                            Área
                          </button>
                          <button
                            onClick={() => setMonthlyEvolutionViewType('line')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              monthlyEvolutionViewType === 'line'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <TrendingUp className="h-3.5 w-3.5" />
                            Línea
                          </button>
                          <button
                            onClick={() => setMonthlyEvolutionViewType('bar')}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                              monthlyEvolutionViewType === 'bar'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <BarChartIcon className="h-3.5 w-3.5" />
                            Barras
                          </button>
                        </div>
                      </div>
                    </div>
                  <div className={cn(
                    "grid grid-cols-1 gap-6",
                    (expenseCats.length + incomeCats.length) <= 20 && "lg:grid-cols-2"
                  )}>
                    {/* Expenses Evolution */}
                    {expenseCats.length > 0 && (() => {
                      const baseMonthly = categoryMonthlyData[expenseCats[0].name] || [];

                      const monthlyDataMatrix = baseMonthly.map((m) => {
                        const row: Record<string, string | number> = { month: m.month };
                        expenseCats.forEach((cat) => {
                          const catMonthly = categoryMonthlyData[cat.name] || [];
                          const match = catMonthly.find((x) => x.monthKey === m.monthKey);
                          row[cat.name] = match ? match.expenses : 0;
                        });
                        return row;
                      });

                      const datasets = expenseCats.map((cat) => ({
                        key: cat.name,
                        label: cat.name,
                        color: cat.color,
                      }));

                      // Adjust height based on number of categories to prevent legend overlap
                      const chartHeight = 450;

                      return monthlyDataMatrix.length > 0 ? (
                        <div className={cn("p-6 bg-card rounded-xl border border-border shadow-sm", expenseCats.length > 6 ? "space-y-8" : "space-y-4")}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-foreground">Evolución de Gastos</h3>
                            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{expenseCats.length} categorías</span>
                          </div>
                          {monthlyEvolutionViewType === 'bar' ? (
                            <BarChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              showLegend={true}
                            />
                          ) : monthlyEvolutionViewType === 'area' ? (
                            <AreaChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              showLegend={true}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          ) : (
                            <LineChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              showLegend={true}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          )}
                        </div>
                      ) : null;
                    })()}

                    {/* Income Evolution */}
                    {incomeCats.length > 0 && (() => {
                      const baseMonthly = categoryMonthlyData[incomeCats[0].name] || [];

                      const monthlyDataMatrix = baseMonthly.map((m) => {
                        const row: Record<string, string | number> = { month: m.month };
                        incomeCats.forEach((cat) => {
                          const catMonthly = categoryMonthlyData[cat.name] || [];
                          const match = catMonthly.find((x) => x.monthKey === m.monthKey);
                          row[cat.name] = match ? match.income : 0;
                        });
                        return row;
                      });

                      const datasets = incomeCats.map((cat) => ({
                        key: cat.name,
                        label: cat.name,
                        color: cat.color,
                      }));

                      // Adjust height based on number of categories to prevent legend overlap
                      const chartHeight = 450;

                      return monthlyDataMatrix.length > 0 ? (
                        <div className={cn("p-6 bg-card rounded-xl border border-border shadow-sm", incomeCats.length > 6 ? "space-y-8" : "space-y-4")}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-foreground">Evolución de Ingresos</h3>
                            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{incomeCats.length} categorías</span>
                          </div>
                          {monthlyEvolutionViewType === 'bar' ? (
                            <BarChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              showLegend={true}
                            />
                          ) : monthlyEvolutionViewType === 'area' ? (
                            <AreaChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              showLegend={true}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          ) : (
                            <LineChart
                              data={monthlyDataMatrix}
                              xKey="month"
                              datasets={datasets}
                              height={chartHeight}
                              showLegend={true}
                              yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                              tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                            />
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                  </div>
                </>
                );
              })()}
          </Card>

        </motion.div>
      )}

      {/* VIEW: ANÁLISIS TEMPORAL - Focus on Trends */}
      {viewType === 'temporal' && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={motionVariants.staggerContainer}
          className="space-y-6"
        >
          {/* Main Evolution Chart */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Evolución Mensual</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ingresos, gastos y ahorro en el tiempo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setChartType('area')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    chartType === 'area' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Área
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    chartType === 'line' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Línea
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                    chartType === 'bar' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <BarChartIcon className="h-3.5 w-3.5" />
                  Barras
                </button>
              </div>
            </div>

            {/* Dynamic Chart Rendering with Empty State */}
            {monthlyData.length === 0 ? (
              <EmptyChartState
                height={400}
                message="No hay datos"
                subMessage="No hay transacciones para el período seleccionado"
              />
            ) : (
              <>
                {chartType === 'area' && (
                  <AreaChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981', fillOpacity: 0.3 },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444', fillOpacity: 0.3 },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6', fillOpacity: 0.2 },
                    ]}
                    height={400}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                )}
                {chartType === 'line' && (
                  <LineChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981' },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6' },
                    ]}
                    height={400}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                  />
                )}
                {chartType === 'bar' && (
                  <BarChart
                    data={monthlyData}
                    xKey="month"
                    datasets={[
                      { key: 'income', label: 'Ingresos', color: '#10b981' },
                      { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      { key: 'savings', label: 'Ahorro', color: '#8b5cf6' },
                    ]}
                    height={400}
                    tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                    showLegend={true}
                  />
                )}
              </>
            )}
          </Card>

          {/* Income vs Expenses Trend */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Tendencia de Ingresos</h3>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setTrendChartType('area')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'area' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    Área
                  </button>
                  <button
                    onClick={() => setTrendChartType('line')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'line' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Línea
                  </button>
                  <button
                    onClick={() => setTrendChartType('bar')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'bar' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <BarChartIcon className="h-3.5 w-3.5" />
                    Barras
                  </button>
                </div>
              </div>
              {monthlyData.length === 0 ? (
                <EmptyChartState
                  height={300}
                  message="No hay datos"
                  subMessage="No hay ingresos registrados"
                />
              ) : (
                <>
                  {trendChartType === 'area' && (
                    <AreaChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'income', label: 'Ingresos', color: '#10b981', fillOpacity: 0.3 },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                  {trendChartType === 'line' && (
                    <LineChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'income', label: 'Ingresos', color: '#10b981' },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                  {trendChartType === 'bar' && (
                    <BarChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'income', label: 'Ingresos', color: '#10b981' },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                </>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Promedio mensual</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(periodStats?.avgMonthlyIncome || 0, displayCurrency)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Total período</p>
                  <p className="text-lg font-semibold text-success">
                    {formatCurrency(periodStats?.totalIncome || 0, displayCurrency)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Tendencia de Gastos</h3>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setTrendChartType('area')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'area' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    Área
                  </button>
                  <button
                    onClick={() => setTrendChartType('line')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'line' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Línea
                  </button>
                  <button
                    onClick={() => setTrendChartType('bar')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2",
                      trendChartType === 'bar' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <BarChartIcon className="h-3.5 w-3.5" />
                    Barras
                  </button>
                </div>
              </div>
              {monthlyData.length === 0 ? (
                <EmptyChartState
                  height={300}
                  message="No hay datos"
                  subMessage="No hay gastos registrados"
                />
              ) : (
                <>
                  {trendChartType === 'area' && (
                    <AreaChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'expenses', label: 'Gastos', color: '#ef4444', fillOpacity: 0.3 },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                  {trendChartType === 'line' && (
                    <LineChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                  {trendChartType === 'bar' && (
                    <BarChart
                      data={monthlyData}
                      xKey="month"
                      datasets={[
                        { key: 'expenses', label: 'Gastos', color: '#ef4444' },
                      ]}
                      height={300}
                      showLegend={false}
                      yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                      tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
                    />
                  )}
                </>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Promedio mensual</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(periodStats?.avgMonthlyExpenses || 0, displayCurrency)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Total período</p>
                  <p className="text-lg font-semibold text-error">
                    {formatCurrency(periodStats?.totalExpenses || 0, displayCurrency)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cumulative Savings */}
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-6">Ahorro Acumulado</h3>
            {monthlyData.length === 0 ? (
              <EmptyChartState
                height={300}
                message="No hay datos"
                subMessage="No hay datos de ahorro para mostrar"
              />
            ) : (
              <AreaChart
                data={monthlyData}
                xKey="month"
                datasets={[
                  { key: 'cumulativeSavings', label: 'Ahorro Acumulado', color: '#8b5cf6', fillOpacity: 0.3 },
                ]}
                height={300}
                yAxisFormatter={(value) => `${displayCurrency === 'USD' ? '$' : '$'}${(value / 1000).toFixed(0)}k`}
                tooltipFormatter={(value) => formatCurrency(value, displayCurrency)}
              />
            )}
          </Card>

          {/* Key Financial Insights */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Promedio Mensual</p>
                  <p className="text-lg font-bold text-success">
                    {formatCurrency(periodStats?.avgMonthlyIncome || 0, displayCurrency)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total de Ingresos</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(periodStats?.totalIncome || 0, displayCurrency)}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-error" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Promedio Mensual</p>
                  <p className="text-lg font-bold text-error">
                    {formatCurrency(periodStats?.avgMonthlyExpenses || 0, displayCurrency)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total de Gastos</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(periodStats?.totalExpenses || 0, displayCurrency)}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tasa de Ahorro</p>
                  <p className="text-lg font-bold text-primary">
                    {periodStats?.totalIncome && periodStats.totalIncome > 0
                      ? `${((periodStats.totalSavings / periodStats.totalIncome) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Ahorrado</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(periodStats?.totalSavings || 0, displayCurrency)}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* VIEW: CATEGORIA-DETALLE - Category Detail Analysis */}
      {viewType === 'categoria-detalle' && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={motionVariants.staggerContainer}
          className="space-y-6"
        >
          {/* Category Selector */}
          <Card className="p-6">
            <div className="max-w-md">
              <Select
                value={selectedCategoryIdForDetail || ''}
                onChange={(value) => setSelectedCategoryIdForDetail(value || null)}
                placeholder="Seleccionar categoría..."
                options={[
                  { value: '', label: 'Todas las categorías' },
                  ...allCategories
                    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
                    .map((category) => ({
                      value: category.id,
                      label: category.name,
                      color: category.color,
                    }))
                ]}
              />
            </div>
          </Card>

          {/* Category Detail View */}
          {selectedCategoryIdForDetail && currentDateRange && (
            <CategoryDetailView
              categoryId={selectedCategoryIdForDetail}
              startDate={currentDateRange.start}
              endDate={currentDateRange.end}
            />
          )}

          {/* Empty State */}
          {!selectedCategoryIdForDetail && (
            <Card className="p-12">
              <EmptyChartState
                icon={BarChart3}
                title="Selecciona una categoría"
                description="Elige una categoría del selector para ver su análisis detallado con estadísticas y gráficos de evolución."
              />
            </Card>
          )}
        </motion.div>
      )}

      {/* Old COMPARATIVO section removed - now integrated into TEMPORAL view above */}
      </>
      )}

      {/* Quick Category Modal */}
      <QuickCategoryModal
        isOpen={showQuickCategoryModal}
        onClose={() => setShowQuickCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
        initialType="expense"
      />
    </div>
  );
}
