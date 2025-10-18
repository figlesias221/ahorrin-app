import { PeriodType as PeriodSelectorType } from '@/components/ui/period-selector';

export interface MonthlyData {
  month: string;
  monthKey?: string; // ISO key YYYY-MM for ordering
  income: number;
  expenses: number;
  savings: number;
  cumulativeSavings: number;
}

export interface CategoryAnalysis {
  name: string;
  total: number;
  average: number;
  percentage: number;
  color: string;
}

export interface ParentCategoryAnalysis extends CategoryAnalysis {
  subcategoryCount: number;
  subcategories: CategoryAnalysis[];
}

export interface SourceAnalysis {
  source: string;
  count: number;
  amount: number;
  color: string;
}

export interface PeriodStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  avgMonthlyIncome: number;
  avgMonthlyExpenses: number;
  avgMonthlySavings: number;
  incomePercentage: number;
  expensesPercentage: number;
  savingsPercentage: number;
  monthOverMonthChange: number;
  expenseTrend: 'up' | 'down' | 'stable';
  sparklineData: number[];
}

export type PeriodType = PeriodSelectorType;
export type ViewType = 'resumen' | 'analisis' | 'temporal' | 'categoria-detalle';
export type ChartType = 'area' | 'line' | 'bar';
export type CategoryViewType = 'pie' | 'treemap' | 'bar';

export interface ComparisonMetric {
  key: 'income' | 'expenses' | 'savings';
  title: string;
  value: number;
  compareValue: number | null;
  icon: React.ReactNode;
  accentColor: string;
  comparisonColor: string;
  valueClassName?: string;
}
