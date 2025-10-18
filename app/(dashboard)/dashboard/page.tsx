'use client';

import { useEffect, useState, Fragment, useRef } from 'react';
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
  Plus, Search, Check, X
} from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { createClient } from '@/lib/supabase/client';
import { Transaction, Category } from '@/types';
import { useCurrency } from '@/contexts/currency-context';
import { EmptyChartState } from '@/components/ui/empty-chart-state';
import { motion } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';
import { cn } from '@/lib/utils/cn';
import { QuickCategoryModal } from '@/components/upload/QuickCategoryModal';
import { CategoryDetailView } from '@/components/category/category-detail-view';

// Dynamic imports for charts to exclude from server bundle
const AreaChart = dynamic(() => import('@/components/charts/area-chart').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const LineChart = dynamic(() => import('@/components/charts/line-chart').then(mod => ({ default: mod.LineChart })), { ssr: false });
const BarChart = dynamic(() => import('@/components/charts/bar-chart').then(mod => ({ default: mod.BarChart })), { ssr: false });
const PieChart = dynamic(() => import('@/components/charts/pie-chart').then(mod => ({ default: mod.PieChart })), { ssr: false });
const DonutChart = dynamic(() => import('@/components/charts/donut-chart').then(mod => ({ default: mod.DonutChart })), { ssr: false });
const TreemapChart = dynamic(() => import('@/components/charts/treemap-chart').then(mod => ({ default: mod.TreemapChart })), { ssr: false });
const Sparkline = dynamic(() => import('@/components/charts/sparkline').then(mod => ({ default: mod.Sparkline })), { ssr: false });
import {
  ComparisonMetricCard,
  TemporalAnalysisHeader,
  PeriodComparisonBanner,
} from '@/components/dashboard';
import {
  calculateDateRange,
  convertCurrency,
  formatRangeLabel,
  formatDurationLabel,
  calculatePreviousPeriod,
  calculatePreviousYearPeriod,
  UNCATEGORIZED_ID,
} from '@/lib/dashboard/utils';
import type {
  MonthlyData,
  CategoryAnalysis,
  ParentCategoryAnalysis,
  SourceAnalysis,
  PeriodStats,
  PeriodType,
  ViewType,
  ChartType,
  CategoryViewType,
  ComparisonMetric,
} from '@/types/dashboard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<PeriodType>('thisYear');
  const [viewType, setViewType] = useState<ViewType>('resumen');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [flujoChartType, setFlujoChartType] = useState<ChartType>('area');
  const [categoryViewType, setCategoryViewType] = useState<CategoryViewType>('pie');
  const [monthlyEvolutionViewType, setMonthlyEvolutionViewType] = useState<ChartType>('area');
  const [trendChartType, setTrendChartType] = useState<ChartType>('line');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [categoryTransactionType, setCategoryTransactionType] = useState<'expense' | 'income'>('expense');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryDropdownPosition, setCategoryDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [categorySearchText, setCategorySearchText] = useState('');
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);

  // Category detail view states
  const [selectedCategoryIdForDetail, setSelectedCategoryIdForDetail] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentDateRange, setCurrentDateRange] = useState<{ start: string; end: string } | null>(null);
  // Compare period selection
  const [comparePeriodType, setComparePeriodType] = useState<PeriodType>('lastMonth');
  const [compareStartDate, setCompareStartDate] = useState('');
  const [compareEndDate, setCompareEndDate] = useState('');
  const [showCompareSelector, setShowCompareSelector] = useState(false);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryAnalysis[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryAnalysis[]>([]);
  const [periodStats, setPeriodStats] = useState<PeriodStats | null>(null);
  // Compare datasets
  const [compareMonthlyData, setCompareMonthlyData] = useState<MonthlyData[]>([]);
  const [compareExpenseCategories, setCompareExpenseCategories] = useState<CategoryAnalysis[]>([]);
  const [comparePeriodStats, setComparePeriodStats] = useState<PeriodStats | null>(null);
  const [sourceData, setSourceData] = useState<SourceAnalysis[]>([]);
  const [categoryMonthlyData, setCategoryMonthlyData] = useState<Record<string, MonthlyData[]>>({});
  // Compare chart toggles
  const [showCompareIncome, setShowCompareIncome] = useState(false);
  const [showCompareExpenses, setShowCompareExpenses] = useState(true);
  const [showCompareSavings, setShowCompareSavings] = useState(false);
  const [comparePreset, setComparePreset] = useState<'previous-period' | 'previous-year' | 'custom' | null>(null);

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
  const supabase = createClient();
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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, startDate, endDate, comparePeriodType, compareStartDate, compareEndDate, displayCurrency]);

  async function loadData() {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For 'allTime', get the oldest transaction date
      let adjustedStartDate = startDate;
      if (periodType === 'allTime') {
        const { data: oldestTransaction } = await supabase
          .from('transactions')
          .select('date')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(1)
          .single();

        if (oldestTransaction) {
          adjustedStartDate = oldestTransaction.date;
        }
      }

      const dateRange = calculateDateRange(periodType, adjustedStartDate, endDate);
      const compareRange = calculateDateRange(comparePeriodType, compareStartDate, compareEndDate);

      // Store current date range for CategoryDetailView
      setCurrentDateRange({ start: dateRange.start, end: dateRange.end });

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const mappedCategories: Category[] = (categoriesData || []).map(cat => ({
        id: cat.id,
        userId: cat.user_id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: cat.type,
        isActive: cat.is_active,
        parentId: cat.parent_id,
        createdAt: new Date(cat.created_at),
        updatedAt: new Date(cat.updated_at),
      }));

      // Store raw categories for category detail view
      setAllCategories(mappedCategories);

      // Fetch transactions (excluding ignored)
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_ignored', false)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: true });

      // Fetch comparison transactions
      const { data: compareTransactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_ignored', false)
        .gte('date', compareRange.start)
        .lte('date', compareRange.end)
        .order('date', { ascending: true });

      const mappedTransactions: Transaction[] = (transactionsData || []).map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        categoryId: tx.category_id,
        date: new Date(tx.date),
        vendor: tx.vendor,
        amount: convertCurrency(tx.amount, tx.currency, displayCurrency),
        type: tx.type,
        currency: tx.currency,
        bank: tx.bank,
        isManuallyVerified: tx.is_manually_verified,
        isIgnored: tx.is_ignored,
        confidenceScore: tx.confidence_score,
        notes: tx.notes,
        createdAt: new Date(tx.created_at),
        updatedAt: new Date(tx.updated_at),
        category: mappedCategories.find(c => c.id === tx.category_id),
      }));

      const mappedCompareTransactions: Transaction[] = (compareTransactionsData || []).map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        categoryId: tx.category_id,
        date: new Date(tx.date),
        vendor: tx.vendor,
        amount: convertCurrency(tx.amount, tx.currency, displayCurrency),
        type: tx.type,
        currency: tx.currency,
        bank: tx.bank,
        isManuallyVerified: tx.is_manually_verified,
        isIgnored: tx.is_ignored,
        confidenceScore: tx.confidence_score,
        notes: tx.notes,
        createdAt: new Date(tx.created_at),
        updatedAt: new Date(tx.updated_at),
        category: mappedCategories.find(c => c.id === tx.category_id),
      }));

      // Calculate monthly data
      const monthlyMap = new Map<string, { income: number; expenses: number }>();
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);

      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(key, { income: 0, expenses: 0 });
      }

      let totalIncome = 0;
      let totalExpenses = 0;

      mappedTransactions.forEach(tx => {
        const monthKey = tx.date.toISOString().substring(0, 7);
        const current = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };

        if (tx.type === 'income') {
          current.income += tx.amount;
          totalIncome += tx.amount;
        } else {
          current.expenses += tx.amount;
          totalExpenses += tx.amount;
        }

        monthlyMap.set(monthKey, current);
      });

      let cumulativeSavings = 0;
      const monthlyDataArray: MonthlyData[] = Array.from(monthlyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => {
          const savings = data.income - data.expenses;
          cumulativeSavings += savings;
          return {
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            monthKey: month,
            income: data.income,
            expenses: data.expenses,
            savings,
            cumulativeSavings,
          };
        });

      setMonthlyData(monthlyDataArray);

      // Calculate month-over-month change
      let monthOverMonthChange = 0;
      if (monthlyDataArray.length >= 2) {
        const lastMonth = monthlyDataArray[monthlyDataArray.length - 1];
        const prevMonth = monthlyDataArray[monthlyDataArray.length - 2];
        if (prevMonth.expenses > 0) {
          monthOverMonthChange = ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100;
        }
      }

      // Determine expense trend
      let expenseTrend: 'up' | 'down' | 'stable' = 'stable';
      if (monthOverMonthChange > 5) expenseTrend = 'up';
      else if (monthOverMonthChange < -5) expenseTrend = 'down';

      // Generate sparkline data (last 12 data points)
      const sparklineData = monthlyDataArray
        .slice(-12)
        .map(m => m.expenses);

      // Calculate category breakdown - inferred by dominant transaction type
      const categoryTotalsMap = new Map<string, {
        expenseTotal: number;
        incomeTotal: number;
        color: string;
      }>();

      mappedTransactions.forEach(tx => {
        if (!tx.category) return;

        const categoryName = tx.category.name;
        const categoryColor = tx.category.color;

        const current = categoryTotalsMap.get(categoryName) || {
          expenseTotal: 0,
          incomeTotal: 0,
          color: categoryColor
        };

        if (tx.type === 'expense') {
          current.expenseTotal += tx.amount;
        } else {
          current.incomeTotal += tx.amount;
        }

        categoryTotalsMap.set(categoryName, current);
      });

      // Now classify categories by net amount (income - expense)
      const expenseCategoryMap = new Map<string, { total: number; color: string }>();
      const incomeCategoryMap = new Map<string, { total: number; color: string }>();

      categoryTotalsMap.forEach((data, categoryName) => {
        const netAmount = data.incomeTotal - data.expenseTotal;

        if (netAmount > 0) {
          // Net income (positive balance)
          incomeCategoryMap.set(categoryName, {
            total: netAmount,
            color: data.color
          });
        } else if (netAmount < 0) {
          // Net expense (negative balance)
          expenseCategoryMap.set(categoryName, {
            total: Math.abs(netAmount),
            color: data.color
          });
        }
        // If netAmount === 0, category is not shown in either section
      });

      const monthCount = dateRange.months;
      const compareMonthCount = compareRange.months;

      // Calculate totals for categorized transactions
      const categorizedExpenses = Array.from(expenseCategoryMap.values()).reduce((sum, cat) => sum + cat.total, 0);
      const categorizedIncome = Array.from(incomeCategoryMap.values()).reduce((sum, cat) => sum + cat.total, 0);

      const expenseCategoriesArray: CategoryAnalysis[] = Array.from(expenseCategoryMap.entries())
        .map(([name, data]) => ({
          name,
          total: data.total,
          average: data.total / monthCount,
          percentage: categorizedExpenses > 0 ? (data.total / categorizedExpenses) * 100 : 0,
          color: data.color,
        }))
        .sort((a, b) => b.total - a.total);

      const incomeCategoriesArray: CategoryAnalysis[] = Array.from(incomeCategoryMap.entries())
        .map(([name, data]) => ({
          name,
          total: data.total,
          average: data.total / monthCount,
          percentage: categorizedIncome > 0 ? (data.total / categorizedIncome) * 100 : 0,
          color: data.color,
        }))
        .sort((a, b) => b.total - a.total);

      setExpenseCategories(expenseCategoriesArray);
      setIncomeCategories(incomeCategoriesArray);

      // Calculate parent category aggregations - inferred by dominant transaction type
      const parentTotalsMap = new Map<string, {
        expenseTotal: number;
        incomeTotal: number;
        color: string;
        expenseSubcategories: Map<string, { total: number; color: string }>;
        incomeSubcategories: Map<string, { total: number; color: string }>;
        expenseParentDirectTotal: number;
        incomeParentDirectTotal: number;
        hasChildren: boolean;
      }>();

      // Initialize all parent categories
      const allParentCategories = mappedCategories.filter(cat => !cat.parentId);

      allParentCategories.forEach(parent => {
        const hasChildren = mappedCategories.some(c => c.parentId === parent.id);
        parentTotalsMap.set(parent.name, {
          expenseTotal: 0,
          incomeTotal: 0,
          color: parent.color,
          expenseSubcategories: new Map(),
          incomeSubcategories: new Map(),
          expenseParentDirectTotal: 0,
          incomeParentDirectTotal: 0,
          hasChildren
        });
      });

      // Process all transactions
      mappedTransactions.forEach(tx => {
        if (!tx.category) return;

        const category = tx.category;

        if (category.parentId) {
          const parentCat = mappedCategories.find(c => c.id === category.parentId);
          if (parentCat && parentTotalsMap.has(parentCat.name)) {
            const parentData = parentTotalsMap.get(parentCat.name)!;

            if (tx.type === 'expense') {
              parentData.expenseTotal += tx.amount;
              const subData = parentData.expenseSubcategories.get(category.name) || { total: 0, color: category.color };
              subData.total += tx.amount;
              parentData.expenseSubcategories.set(category.name, subData);
            } else {
              parentData.incomeTotal += tx.amount;
              const subData = parentData.incomeSubcategories.get(category.name) || { total: 0, color: category.color };
              subData.total += tx.amount;
              parentData.incomeSubcategories.set(category.name, subData);
            }
          }
        }
        else if (parentTotalsMap.has(category.name)) {
          const parentData = parentTotalsMap.get(category.name)!;
          if (tx.type === 'expense') {
            parentData.expenseTotal += tx.amount;
            parentData.expenseParentDirectTotal += tx.amount;
          } else {
            parentData.incomeTotal += tx.amount;
            parentData.incomeParentDirectTotal += tx.amount;
          }
        }
      });

      // Now classify parent categories by dominant type
      const parentExpenseMap = new Map<string, {
        total: number;
        color: string;
        subcategories: Map<string, { total: number; color: string }>;
        parentDirectTotal: number;
        hasChildren: boolean;
      }>();

      const parentIncomeMap = new Map<string, {
        total: number;
        color: string;
        subcategories: Map<string, { total: number; color: string }>;
        parentDirectTotal: number;
        hasChildren: boolean;
      }>();

      parentTotalsMap.forEach((data, parentName) => {
        const netAmount = data.incomeTotal - data.expenseTotal;

        if (netAmount > 0) {
          // Net income (positive balance)
          parentIncomeMap.set(parentName, {
            total: netAmount,
            color: data.color,
            subcategories: data.incomeSubcategories,
            parentDirectTotal: data.incomeParentDirectTotal,
            hasChildren: data.hasChildren
          });
        } else if (netAmount < 0) {
          // Net expense (negative balance)
          parentExpenseMap.set(parentName, {
            total: Math.abs(netAmount),
            color: data.color,
            subcategories: data.expenseSubcategories,
            parentDirectTotal: data.expenseParentDirectTotal,
            hasChildren: data.hasChildren
          });
        }
        // If netAmount === 0, category is not shown in either section
      });

      const totalParentExpenses = Array.from(parentExpenseMap.values())
        .reduce((sum, data) => sum + data.total, 0);

      const parentExpenseCategoriesArray: ParentCategoryAnalysis[] = Array.from(parentExpenseMap.entries())
        .filter(([name, data]) => data.total > 0)
        .map(([name, data]) => {
          const subcategoriesArray: CategoryAnalysis[] = [];

          data.subcategories.forEach((subData, subName) => {
            subcategoriesArray.push({
              name: subName,
              total: subData.total,
              average: subData.total / monthCount,
              percentage: data.total > 0 ? (subData.total / data.total) * 100 : 0,
              color: subData.color,
            });
          });

          if (data.parentDirectTotal > 0) {
            subcategoriesArray.push({
              name: `${name} (directo)`,
              total: data.parentDirectTotal,
              average: data.parentDirectTotal / monthCount,
              percentage: data.total > 0 ? (data.parentDirectTotal / data.total) * 100 : 0,
              color: data.color,
            });
          }

          subcategoriesArray.sort((a, b) => b.total - a.total);

          return {
            name,
            total: data.total,
            average: data.total / monthCount,
            percentage: totalParentExpenses > 0 ? (data.total / totalParentExpenses) * 100 : 0,
            color: data.color,
            subcategoryCount: subcategoriesArray.length,
            subcategories: subcategoriesArray,
          };
        })
        .sort((a, b) => b.total - a.total);

      // setParentExpenseCategories removed - parent category feature removed

      const totalParentIncome = Array.from(parentIncomeMap.values())
        .reduce((sum, data) => sum + data.total, 0);

      const parentIncomeCategoriesArray: ParentCategoryAnalysis[] = Array.from(parentIncomeMap.entries())
        .filter(([name, data]) => data.total > 0)
        .map(([name, data]) => {
          const subcategoriesArray: CategoryAnalysis[] = [];

          data.subcategories.forEach((subData, subName) => {
            subcategoriesArray.push({
              name: subName,
              total: subData.total,
              average: subData.total / monthCount,
              percentage: data.total > 0 ? (subData.total / data.total) * 100 : 0,
              color: subData.color,
            });
          });

          if (data.parentDirectTotal > 0) {
            subcategoriesArray.push({
              name: `${name} (directo)`,
              total: data.parentDirectTotal,
              average: data.parentDirectTotal / monthCount,
              percentage: data.total > 0 ? (data.parentDirectTotal / data.total) * 100 : 0,
              color: data.color,
            });
          }

          subcategoriesArray.sort((a, b) => b.total - a.total);

          return {
            name,
            total: data.total,
            average: data.total / monthCount,
            percentage: totalParentIncome > 0 ? (data.total / totalParentIncome) * 100 : 0,
            color: data.color,
            subcategoryCount: subcategoriesArray.length,
            subcategories: subcategoriesArray,
          };
        })
        .sort((a, b) => b.total - a.total);

      // setParentIncomeCategories removed - parent category feature removed

      // Calculate monthly data by category
      const categoryMonthlyMap = new Map<string, Map<string, number>>();

      // Initialize all categories with all months
      expenseCategoriesArray.forEach(cat => {
        const monthMap = new Map<string, number>();
        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthMap.set(key, 0);
        }
        categoryMonthlyMap.set(cat.name, monthMap);
      });

      // Fill in actual values
      mappedTransactions.forEach(tx => {
        if (!tx.category || tx.type !== 'expense') return;
        const categoryName = tx.category.name;
        const monthKey = tx.date.toISOString().substring(0, 7);

        if (categoryMonthlyMap.has(categoryName)) {
          const monthMap = categoryMonthlyMap.get(categoryName)!;
          const current = monthMap.get(monthKey) || 0;
          monthMap.set(monthKey, current + tx.amount);
        }
      });

      // Convert to array format
      const categoryMonthlyDataObj: Record<string, MonthlyData[]> = {};
      categoryMonthlyMap.forEach((monthMap, categoryName) => {
        const monthlyArray = Array.from(monthMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, expenses]) => ({
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
            monthKey: month,
            income: 0,
            expenses,
            savings: -expenses,
            cumulativeSavings: 0,
          }));
        categoryMonthlyDataObj[categoryName] = monthlyArray;
      });

      // Build monthly data for parent categories (so charts respect same filters)
      const parentCategoryMonthlyMap = new Map<string, Map<string, number>>();
      // Initialize all parent categories (with totals > 0) with all months
      parentExpenseCategoriesArray.forEach(parent => {
        const monthMap = new Map<string, number>();
        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthMap.set(key, 0);
        }
        parentCategoryMonthlyMap.set(parent.name, monthMap);
      });

      // Fill parent monthly values from transactions
      mappedTransactions.forEach(tx => {
        if (!tx.category || tx.type !== 'expense') return;
        const monthKey = tx.date.toISOString().substring(0, 7);
        let parentName: string | null = null;
        if (tx.category.parentId) {
          const parentCat = mappedCategories.find(c => c.id === tx.category!.parentId);
          parentName = parentCat ? parentCat.name : null;
        } else {
          // Transaction directly tagged with a parent category
          parentName = tx.category.name;
        }
        if (parentName && parentCategoryMonthlyMap.has(parentName)) {
          const monthMap = parentCategoryMonthlyMap.get(parentName)!;
          const current = monthMap.get(monthKey) || 0;
          monthMap.set(monthKey, current + tx.amount);
        }
      });

      // Convert parent map to array format
      const parentCategoryMonthlyDataObj: Record<string, MonthlyData[]> = {};
      parentCategoryMonthlyMap.forEach((monthMap, parentName) => {
        const monthlyArray = Array.from(monthMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, expenses]) => ({
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
            monthKey: month,
            income: 0,
            expenses,
            savings: -expenses,
            cumulativeSavings: 0,
          }));
        parentCategoryMonthlyDataObj[parentName] = monthlyArray;
      });

      // Calculate monthly data for INCOME categories
      const incomeCategoryMonthlyMap = new Map<string, Map<string, number>>();

      // Initialize all income categories with all months
      incomeCategoriesArray.forEach(cat => {
        const monthMap = new Map<string, number>();
        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthMap.set(key, 0);
        }
        incomeCategoryMonthlyMap.set(cat.name, monthMap);
      });

      // Fill in actual income values
      mappedTransactions.forEach(tx => {
        if (!tx.category || tx.type !== 'income') return;
        const categoryName = tx.category.name;
        const monthKey = tx.date.toISOString().substring(0, 7);

        if (incomeCategoryMonthlyMap.has(categoryName)) {
          const monthMap = incomeCategoryMonthlyMap.get(categoryName)!;
          const current = monthMap.get(monthKey) || 0;
          monthMap.set(monthKey, current + tx.amount);
        }
      });

      // Convert income categories to array format
      const incomeCategoryMonthlyDataObj: Record<string, MonthlyData[]> = {};
      incomeCategoryMonthlyMap.forEach((monthMap, categoryName) => {
        const monthlyArray = Array.from(monthMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, income]) => ({
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
            monthKey: month,
            income,
            expenses: 0,
            savings: income,
            cumulativeSavings: 0,
          }));
        incomeCategoryMonthlyDataObj[categoryName] = monthlyArray;
      });

      // Build monthly data for parent INCOME categories
      const parentIncomeCategoryMonthlyMap = new Map<string, Map<string, number>>();
      parentIncomeCategoriesArray.forEach(parent => {
        const monthMap = new Map<string, number>();
        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthMap.set(key, 0);
        }
        parentIncomeCategoryMonthlyMap.set(parent.name, monthMap);
      });

      // Fill parent income monthly values from transactions
      mappedTransactions.forEach(tx => {
        if (!tx.category || tx.type !== 'income') return;
        const monthKey = tx.date.toISOString().substring(0, 7);
        let parentName: string | null = null;
        if (tx.category.parentId) {
          const parentCat = mappedCategories.find(c => c.id === tx.category!.parentId);
          parentName = parentCat ? parentCat.name : null;
        } else {
          parentName = tx.category.name;
        }
        if (parentName && parentIncomeCategoryMonthlyMap.has(parentName)) {
          const monthMap = parentIncomeCategoryMonthlyMap.get(parentName)!;
          const current = monthMap.get(monthKey) || 0;
          monthMap.set(monthKey, current + tx.amount);
        }
      });

      // Convert parent income map to array format
      const parentIncomeCategoryMonthlyDataObj: Record<string, MonthlyData[]> = {};
      parentIncomeCategoryMonthlyMap.forEach((monthMap, parentName) => {
        const monthlyArray = Array.from(monthMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, income]) => ({
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
            monthKey: month,
            income,
            expenses: 0,
            savings: income,
            cumulativeSavings: 0,
          }));
        parentIncomeCategoryMonthlyDataObj[parentName] = monthlyArray;
      });

      // Merge child and parent monthly datasets so charts honor same filters/configs
      setCategoryMonthlyData({
        ...categoryMonthlyDataObj,
        ...parentCategoryMonthlyDataObj,
        ...incomeCategoryMonthlyDataObj,
        ...parentIncomeCategoryMonthlyDataObj,
      });

      // Calculate source data (by bank)
      const sourceMap = new Map<string, { count: number; amount: number }>();

      const bankColors: Record<string, string> = {
        'BBVA': '#004481',
        'Scotia': '#ed1c24',
        'Itaú': '#ec7000',
        'Itaú Master': '#eb6c00',
        'Itaú Visa': '#ff8200',
        'Auto': '#6b7280',
      };

      mappedTransactions.forEach(tx => {
        const bank = tx.bank || 'Sin banco';
        const current = sourceMap.get(bank) || { count: 0, amount: 0 };
        current.count += 1;
        current.amount += tx.amount;
        sourceMap.set(bank, current);
      });

      const sourceDataArray: SourceAnalysis[] = Array.from(sourceMap.entries())
        .map(([bank, data]) => ({
          source: bank,
          count: data.count,
          amount: data.amount,
          color: bankColors[bank] || '#8b5cf6',
        }))
        .sort((a, b) => b.amount - a.amount);

      setSourceData(sourceDataArray);

      // Calculate period stats
      const totalSavings = totalIncome - totalExpenses;
      const baseAmount = totalIncome > 0 ? totalIncome : Math.abs(totalSavings);

      setPeriodStats({
        totalIncome,
        totalExpenses,
        totalSavings,
        avgMonthlyIncome: totalIncome / monthCount,
        avgMonthlyExpenses: totalExpenses / monthCount,
        avgMonthlySavings: totalSavings / monthCount,
        incomePercentage: baseAmount > 0 ? (totalIncome / baseAmount) * 100 : 0,
        expensesPercentage: baseAmount > 0 ? (totalExpenses / baseAmount) * 100 : 0,
        savingsPercentage: totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0,
        monthOverMonthChange,
        expenseTrend,
        sparklineData,
      });

      // ===== Comparison calculations =====
      // Monthly aggregation for comparison
      const compareMonthlyMap = new Map<string, { income: number; expenses: number }>();
      const cStart = new Date(compareRange.start);
      const cEnd = new Date(compareRange.end);
      for (let d = new Date(cStart); d <= cEnd; d.setMonth(d.getMonth() + 1)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        compareMonthlyMap.set(key, { income: 0, expenses: 0 });
      }
      let cTotalIncome = 0;
      let cTotalExpenses = 0;
      mappedCompareTransactions.forEach(tx => {
        const monthKey = tx.date.toISOString().substring(0, 7);
        const current = compareMonthlyMap.get(monthKey) || { income: 0, expenses: 0 };
        if (tx.type === 'income') {
          current.income += tx.amount;
          cTotalIncome += tx.amount;
        } else {
          current.expenses += tx.amount;
          cTotalExpenses += tx.amount;
        }
        compareMonthlyMap.set(monthKey, current);
      });
      let cCumulativeSavings = 0;
      const compareMonthlyDataArray: MonthlyData[] = Array.from(compareMonthlyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => {
          const savings = data.income - data.expenses;
          cCumulativeSavings += savings;
          return {
            month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            monthKey: month,
            income: data.income,
            expenses: data.expenses,
            savings,
            cumulativeSavings: cCumulativeSavings,
          };
        });
      setCompareMonthlyData(compareMonthlyDataArray);

      // Comparison categories (expenses only for parity with base chart)
      const cExpenseCategoryMap = new Map<string, { total: number; color: string }>();
      mappedCompareTransactions.forEach(tx => {
        if (!tx.category) return;
        const categoryName = tx.category.name;
        const categoryColor = tx.category.color;
        if (tx.type === 'expense') {
          const current = cExpenseCategoryMap.get(categoryName) || { total: 0, color: categoryColor };
          current.total += tx.amount;
          cExpenseCategoryMap.set(categoryName, current);
        }
      });
      const cCategorizedExpenses = Array.from(cExpenseCategoryMap.values()).reduce((sum, cat) => sum + cat.total, 0);
      const compareExpenseCategoriesArray: CategoryAnalysis[] = Array.from(cExpenseCategoryMap.entries())
        .map(([name, data]) => ({
          name,
          total: data.total,
          average: data.total / compareMonthCount,
          percentage: cCategorizedExpenses > 0 ? (data.total / cCategorizedExpenses) * 100 : 0,
          color: data.color,
        }))
        .sort((a, b) => b.total - a.total);
      setCompareExpenseCategories(compareExpenseCategoriesArray);

      const cTotalSavings = cTotalIncome - cTotalExpenses;
      const cBaseAmount = cTotalIncome > 0 ? cTotalIncome : Math.abs(cTotalSavings);
      setComparePeriodStats({
        totalIncome: cTotalIncome,
        totalExpenses: cTotalExpenses,
        totalSavings: cTotalSavings,
        avgMonthlyIncome: cTotalIncome / compareMonthCount,
        avgMonthlyExpenses: cTotalExpenses / compareMonthCount,
        avgMonthlySavings: cTotalSavings / compareMonthCount,
        incomePercentage: cBaseAmount > 0 ? (cTotalIncome / cBaseAmount) * 100 : 0,
        expensesPercentage: cBaseAmount > 0 ? (cTotalExpenses / cBaseAmount) * 100 : 0,
        savingsPercentage: cTotalIncome > 0 ? (cTotalSavings / cTotalIncome) * 100 : 0,
        monthOverMonthChange: 0,
        expenseTrend: 'stable',
        sparklineData: compareMonthlyDataArray.slice(-12).map(m => m.expenses),
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

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
    <div className="space-y-4 pb-10">
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
          <div className="grid gap-6 md:grid-cols-3">
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
          <div className="grid gap-6 md:grid-cols-3">
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
