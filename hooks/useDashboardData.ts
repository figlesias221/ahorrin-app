'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCurrency } from '@/contexts/currency-context';
import { Transaction, Category } from '@/types';
import {
  calculateDateRange,
  convertCurrency,
} from '@/lib/dashboard/utils';
import type {
  MonthlyData,
  CategoryAnalysis,
  ParentCategoryAnalysis,
  SourceAnalysis,
  PeriodStats,
  PeriodType,
} from '@/types/dashboard';

// Extended Category type matching the Supabase columns the dashboard uses
// (parentId, icon, type exist in DB but are missing from the base Category interface)
interface DashboardCategory extends Category {
  parentId?: string | null;
  icon?: string | null;
  type?: string;
}

interface UseDashboardDataParams {
  periodType: PeriodType;
  startDate: string;
  endDate: string;
  comparePeriodType: PeriodType;
  compareStartDate: string;
  compareEndDate: string;
}

interface UseDashboardDataReturn {
  loading: boolean;
  monthlyData: MonthlyData[];
  expenseCategories: CategoryAnalysis[];
  incomeCategories: CategoryAnalysis[];
  periodStats: PeriodStats | null;
  compareMonthlyData: MonthlyData[];
  compareExpenseCategories: CategoryAnalysis[];
  comparePeriodStats: PeriodStats | null;
  sourceData: SourceAnalysis[];
  categoryMonthlyData: Record<string, MonthlyData[]>;
  allCategories: Category[];
  currentDateRange: { start: string; end: string } | null;
  loadData: () => Promise<void>;
}

export function useDashboardData({
  periodType,
  startDate,
  endDate,
  comparePeriodType,
  compareStartDate,
  compareEndDate,
}: UseDashboardDataParams): UseDashboardDataReturn {
  const { displayCurrency } = useCurrency();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryAnalysis[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryAnalysis[]>([]);
  const [periodStats, setPeriodStats] = useState<PeriodStats | null>(null);
  const [compareMonthlyData, setCompareMonthlyData] = useState<MonthlyData[]>([]);
  const [compareExpenseCategories, setCompareExpenseCategories] = useState<CategoryAnalysis[]>([]);
  const [comparePeriodStats, setComparePeriodStats] = useState<PeriodStats | null>(null);
  const [sourceData, setSourceData] = useState<SourceAnalysis[]>([]);
  const [categoryMonthlyData, setCategoryMonthlyData] = useState<Record<string, MonthlyData[]>>({});
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentDateRange, setCurrentDateRange] = useState<{ start: string; end: string } | null>(null);

  const loadData = useCallback(async function loadData() {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          adjustedStartDate = (oldestTransaction as any).date;
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedCategories: DashboardCategory[] = ((categoriesData || []) as any[]).map(cat => ({
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedTransactions: Transaction[] = ((transactionsData || []) as any[]).map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        categoryId: tx.category_id,
        date: new Date(tx.date),
        vendor: tx.vendor,
        amount: convertCurrency(tx.amount, tx.currency, displayCurrency as 'USD' | 'UYU'),
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedCompareTransactions: Transaction[] = ((compareTransactionsData || []) as any[]).map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        categoryId: tx.category_id,
        date: new Date(tx.date),
        vendor: tx.vendor,
        amount: convertCurrency(tx.amount, tx.currency, displayCurrency as 'USD' | 'UYU'),
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

        if ((category as DashboardCategory).parentId) {
          const parentCat = mappedCategories.find(c => c.id === (category as DashboardCategory).parentId);
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
        .filter(([, data]) => data.total > 0)
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
        .filter(([, data]) => data.total > 0)
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
        if ((tx.category as unknown as DashboardCategory).parentId) {
          const parentCat = mappedCategories.find(c => c.id === (tx.category as unknown as DashboardCategory).parentId);
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
        if ((tx.category as unknown as DashboardCategory).parentId) {
          const parentCat = mappedCategories.find(c => c.id === (tx.category as unknown as DashboardCategory).parentId);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, startDate, endDate, comparePeriodType, compareStartDate, compareEndDate, displayCurrency]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
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
  };
}
