'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Category, Transaction } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Hash } from 'lucide-react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Dynamic import for chart to exclude from server bundle
const AreaChart = nextDynamic(() => import('@/components/charts/area-chart').then(mod => ({ default: mod.AreaChart })), { ssr: false });

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'3m' | '6m' | '1y' | 'all'>('6m');

  const supabase = createClient();

  useEffect(() => {
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, period]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case '3m':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case '6m':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          break;
        case '1y':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
          break;
        case 'all':
        default:
          startDate = new Date(2000, 0, 1);
      }

      // Fetch transactions for this category
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('category_id', categoryId)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    balance: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
             transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    count: transactions.length,
  };

  // Prepare monthly data for line chart
  const monthMap = new Map<string, MonthlyData>();

  transactions.forEach(transaction => {
    const monthKey = format(parseISO(transaction.date), 'yyyy-MM');
    const monthLabel = format(parseISO(transaction.date), 'MMM yyyy', { locale: es });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        month: monthLabel,
        income: 0,
        expenses: 0,
        net: 0,
      });
    }

    const data = monthMap.get(monthKey)!;
    if (transaction.type === 'income') {
      data.income += transaction.amount;
      data.net += transaction.amount;
    } else if (transaction.type === 'expense') {
      data.expenses += transaction.amount;
      data.net -= transaction.amount;
    }
  });

  // Sort by month
  const sortedMonths = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, data]) => data);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Card className="p-6">
          <p className="text-muted-foreground">Categoría no encontrada</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            </div>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            )}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['3m', '6m', '1y', 'all'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p === '3m' && '3 meses'}
              {p === '6m' && '6 meses'}
              {p === '1y' && '1 año'}
              {p === 'all' && 'Todo'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalIncome.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Egresos</p>
              <p className="text-2xl font-bold text-red-600">
                ${stats.totalExpenses.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(stats.balance).toLocaleString('es-UY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transacciones</p>
              <p className="text-2xl font-bold text-foreground">{stats.count}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Hash className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart - Gastos e Ingresos */}
      {sortedMonths.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Evolución Mensual</h3>
          <div className="h-[400px]">
            <AreaChart
              data={sortedMonths}
              xKey="month"
              datasets={[
                { key: 'income', label: 'Ingresos', color: '#10b981' },
                { key: 'expenses', label: 'Egresos', color: '#ef4444' },
              ]}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
