'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Transaction, Category } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { TrendingUp, TrendingDown, DollarSign, Hash, Activity, BarChart as BarChartIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface CategoryDetailViewProps {
  categoryId: string;
  startDate: string;
  endDate: string;
}

export function CategoryDetailView({ categoryId, startDate, endDate }: CategoryDetailViewProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('bar');

  const supabase = createClient();

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, startDate, endDate]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate dates
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) {
        console.error('Category fetch error:', {
          message: categoryError.message,
          code: categoryError.code,
          details: categoryError.details,
          hint: categoryError.hint,
          categoryId,
        });
        throw new Error(`Failed to fetch category: ${categoryError.message}`);
      }
      setCategory(categoryData);

      // Fetch transactions for this category in the selected date range
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('category_id', categoryId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (transactionsError) {
        console.error('Transactions fetch error:', {
          message: transactionsError.message,
          code: transactionsError.code,
          details: transactionsError.details,
          hint: transactionsError.hint,
          categoryId,
          startDate,
          endDate,
        });
        throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
      }
      setTransactions(transactionsData || []);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching category data:', {
        message: errorMessage,
        error,
        categoryId,
        startDate,
        endDate,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Calculate number of months with transactions
  const uniqueMonths = new Set(
    transactions.map(t => format(parseISO(t.date), 'yyyy-MM'))
  );
  const monthCount = uniqueMonths.size || 1;

  const stats = {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    count: transactions.length,
    avgMonthlyExpenses: totalExpenses / monthCount,
  };

  // Prepare monthly data for chart - separate income and expenses
  const monthMap = new Map<string, { month: string; income: number; expenses: number; count: number }>();

  transactions.forEach(transaction => {
    const monthKey = format(parseISO(transaction.date), 'yyyy-MM');
    const monthLabel = format(parseISO(transaction.date), 'MMM yyyy', { locale: es });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        month: monthLabel,
        income: 0,
        expenses: 0,
        count: 0,
      });
    }

    const data = monthMap.get(monthKey)!;
    if (transaction.type === 'income') {
      data.income += transaction.amount;
    } else {
      data.expenses += transaction.amount;
    }
    data.count += 1;
  });

  // Sort by month
  const sortedMonths = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, data]) => data);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-red-600 font-medium">Error al cargar la categoría</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={fetchCategoryData} variant="outline" size="sm">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (!category) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Selecciona una categoría para ver su análisis detallado</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalIncome.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
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
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
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
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Promedio Mensual</p>
              <p className="text-2xl font-bold text-orange-600">
                ${stats.avgMonthlyExpenses.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transacciones</p>
              <p className="text-2xl font-bold text-foreground">{stats.count}</p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Hash className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart - Evolución de la Categoría */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Evolución Mensual</h3>
            <p className="text-sm text-muted-foreground">
              Ingresos y gastos de {category.name} por mes
            </p>
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50">
            <button
              onClick={() => setChartType('area')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                chartType === 'area' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Gráfico de área"
            >
              <Activity className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                chartType === 'line' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Gráfico de línea"
            >
              <TrendingUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                chartType === 'bar' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Gráfico de barras"
            >
              <BarChartIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {sortedMonths.length > 0 ? (
          <>
            {chartType === 'area' && (
              <AreaChart
                data={sortedMonths}
                xKey="month"
                datasets={[
                  {
                    key: 'income',
                    label: 'Ingresos',
                    color: '#10b981',
                    fillOpacity: 0.3
                  },
                  {
                    key: 'expenses',
                    label: 'Gastos',
                    color: '#ef4444',
                    fillOpacity: 0.3
                  }
                ]}
                height={400}
                yAxisFormatter={(value) => `$${value.toLocaleString('es-UY', { maximumFractionDigits: 0 })}`}
                tooltipFormatter={(value) => `$${value.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`}
                showLegend={true}
              />
            )}
            {chartType === 'line' && (
              <LineChart
                data={sortedMonths}
                xKey="month"
                datasets={[
                  {
                    key: 'income',
                    label: 'Ingresos',
                    color: '#10b981'
                  },
                  {
                    key: 'expenses',
                    label: 'Gastos',
                    color: '#ef4444'
                  }
                ]}
                height={400}
                yAxisFormatter={(value) => `$${value.toLocaleString('es-UY', { maximumFractionDigits: 0 })}`}
                tooltipFormatter={(value) => `$${value.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`}
                showLegend={true}
              />
            )}
            {chartType === 'bar' && (
              <BarChart
                data={sortedMonths}
                xKey="month"
                datasets={[
                  {
                    key: 'income',
                    label: 'Ingresos',
                    color: '#10b981'
                  },
                  {
                    key: 'expenses',
                    label: 'Gastos',
                    color: '#ef4444'
                  }
                ]}
                height={400}
                yAxisFormatter={(value) => `$${value.toLocaleString('es-UY', { maximumFractionDigits: 0 })}`}
                tooltipFormatter={(value) => `$${value.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`}
                showLegend={true}
              />
            )}
          </>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No hay transacciones en el período seleccionado
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Transactions Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transacciones ({transactions.length})</h3>

        {transactions.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border/50 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-muted/50 via-muted/30 to-transparent border-b border-border">
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="text-right py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="text-center py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider w-[60px]">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="group border-b border-border/30 transition-all duration-200 hover:bg-gradient-to-r hover:from-muted/40 hover:via-muted/20 hover:to-transparent"
                  >
                    <td className="py-2 px-3">
                      <div className="text-[11px] font-medium text-foreground">
                        {format(parseISO(transaction.date), 'dd MMM yyyy', { locale: es })}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="text-[11px] font-semibold text-foreground break-words max-w-[200px]">
                        {transaction.vendor || 'Sin especificar'}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category?.color || '#64748b' }}
                        />
                        <span className="text-[11px] truncate" style={{ color: category?.color || '#64748b' }}>
                          {category?.name || 'Sin cat.'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="text-[11px] text-foreground break-words">
                        {transaction.notes || <span className="text-muted-foreground italic text-[10px]">-</span>}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className={`text-[11px] font-bold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${transaction.amount.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge
                          variant={transaction.type === 'income' ? 'success' : 'error'}
                          className="text-[9px] font-semibold px-1 py-0"
                        >
                          {transaction.type === 'income' ? '↑' : '↓'}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No hay transacciones para mostrar
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
