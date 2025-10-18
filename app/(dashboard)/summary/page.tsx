'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering (skip static generation)
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import { Calendar, TrendingUp, TrendingDown, ArrowRight, Wallet, DollarSign, PiggyBank } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { convertCurrency, formatCurrencyWithSymbol } from '@/lib/utils/currency';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';

interface MonthSummary {
  month: string;
  year: number;
  month_number: number;
  categories: {
    [key: string]: {
      name: string;
      color: string;
      type: 'expense' | 'income';
      expenses: number;
      income: number;
      net: number;
      count: number;
    };
  };
  totals: {
    expenses: number;
    income: number;
    net: number;
  };
}

interface TransactionWithCurrency {
  currency?: string;
  amount: number;
  type: 'expense' | 'income';
  date: string;
  category_id: string;
  category?: {
    name: string;
    color: string;
    type: 'expense' | 'income';
  };
}

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [monthSummaries, setMonthSummaries] = useState<MonthSummary[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const supabase = createClient();
  const { displayCurrency } = useCurrency();

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('is_ignored', false)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!transactions || transactions.length === 0) {
        setMonthSummaries([]);
        setLoading(false);
        return;
      }

      const monthlyData = new Map<string, MonthSummary>();

      transactions.forEach((tx: TransactionWithCurrency) => {
        const date = new Date(tx.date);
        const year = date.getFullYear();
        const monthNumber = date.getMonth() + 1;
        const monthKey = `${year}-${String(monthNumber).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('es-ES', { month: 'long' });

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthName,
            year,
            month_number: monthNumber,
            categories: {},
            totals: { expenses: 0, income: 0, net: 0 },
          });
        }

        const monthData = monthlyData.get(monthKey)!;
        const categoryId = tx.category_id;
        const categoryName = tx.category?.name || 'Sin categoría';
        const categoryColor = tx.category?.color || '#64748b';
        const categoryType = tx.category?.type || tx.type;

        if (!monthData.categories[categoryId]) {
          monthData.categories[categoryId] = {
            name: categoryName,
            color: categoryColor,
            type: categoryType,
            expenses: 0,
            income: 0,
            net: 0,
            count: 0,
          };
        }

        const amount = Number(tx.amount);
        const convertedAmount = convertCurrency(amount, tx.currency || 'UYU', displayCurrency);
        const catData = monthData.categories[categoryId];

        if (tx.type === 'expense') {
          catData.expenses += convertedAmount;
          catData.net += convertedAmount;
          monthData.totals.expenses += convertedAmount;
          monthData.totals.net += convertedAmount;
        } else {
          catData.income += convertedAmount;
          catData.net -= convertedAmount;
          monthData.totals.income += convertedAmount;
          monthData.totals.net -= convertedAmount;
        }

        catData.count += 1;
      });

      const summaries = Array.from(monthlyData.values()).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month_number - a.month_number;
      });

      setMonthSummaries(summaries);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthKey = (summary: MonthSummary) =>
    `${summary.year}-${String(summary.month_number).padStart(2, '0')}`;

  const yearTotals = monthSummaries.reduce(
    (acc, month) => ({
      expenses: acc.expenses + month.totals.expenses,
      income: acc.income + month.totals.income,
      balance: acc.balance + (month.totals.income - month.totals.expenses),
    }),
    { expenses: 0, income: 0, balance: 0 }
  );


  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header with Year Selector */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={motionVariants.fadeIn}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Resumen {selectedYear}</h1>
          <p className="text-sm text-muted-foreground">
            Vista anual de tus finanzas en {displayCurrency}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="h-8 px-2 text-xs"
          >
            {selectedYear - 1}
          </Button>
          <div className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md font-semibold text-sm">
            {selectedYear}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedYear(selectedYear + 1)}
            disabled={selectedYear >= new Date().getFullYear()}
            className="h-8 px-2 text-xs"
          >
            {selectedYear + 1}
          </Button>
        </div>
      </motion.div>

      {monthSummaries.length === 0 ? (
        <motion.div
          initial="initial"
          animate="animate"
          variants={motionVariants.fadeIn}
        >
          <Card className="p-12 text-center border-dashed">
            <Wallet className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No hay transacciones en {selectedYear}</p>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Year Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={motionVariants.staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Total Expenses */}
            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Gastos Totales {selectedYear}</p>
                    <p className="text-3xl font-semibold text-foreground tracking-tight">
                      {formatCurrencyWithSymbol(yearTotals.expenses, displayCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatCurrencyWithSymbol(yearTotals.expenses / Math.max(monthSummaries.length, 1), displayCurrency)}/mes
                    </p>
                  </div>
                  <div className="p-2.5 bg-error/5 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-error" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Total Income */}
            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Ingresos Totales {selectedYear}</p>
                    <p className="text-3xl font-semibold text-foreground tracking-tight">
                      {formatCurrencyWithSymbol(yearTotals.income, displayCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatCurrencyWithSymbol(yearTotals.income / Math.max(monthSummaries.length, 1), displayCurrency)}/mes
                    </p>
                  </div>
                  <div className="p-2.5 bg-success/5 rounded-lg">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Balance */}
            <motion.div variants={motionVariants.staggerItem}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Balance Neto {selectedYear}</p>
                    <p className={cn(
                      "text-3xl font-semibold tracking-tight",
                      yearTotals.balance >= 0 ? "text-success" : "text-error"
                    )}>
                      {formatCurrencyWithSymbol(yearTotals.balance, displayCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {yearTotals.income > 0 ? `${((yearTotals.balance / yearTotals.income) * 100).toFixed(1)}% tasa` : '0% tasa'}
                    </p>
                  </div>
                  <div className={cn(
                    "p-2.5 rounded-lg",
                    yearTotals.balance >= 0 ? "bg-muted" : "bg-error/5"
                  )}>
                    <PiggyBank className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Monthly Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
            variants={motionVariants.staggerContainer}
            initial="initial"
            animate="animate"
          >
            {monthSummaries.map((summary, index) => {
              const monthKey = getMonthKey(summary);
              const balance = summary.totals.income - summary.totals.expenses;
              const savingsRate = summary.totals.income > 0
                ? ((balance / summary.totals.income) * 100)
                : 0;

              const topExpenseCategories = Object.entries(summary.categories)
                .filter(([_, cat]) => cat.expenses > 0)
                .sort(([_, a], [__, b]) => b.expenses - a.expenses)
                .slice(0, 3);

              return (
                <motion.div
                  key={monthKey}
                  variants={motionVariants.staggerItem}
                >
                  <Card
                    className="group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/30"
                    onClick={() => setSelectedMonth(selectedMonth === monthKey ? null : monthKey)}
                  >
                  <div className="p-3">
                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-foreground capitalize">{summary.month}</h3>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Amounts */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Gastos</span>
                        <span className="text-xs font-bold text-red-600">
                          {formatCurrencyWithSymbol(summary.totals.expenses, displayCurrency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Ingresos</span>
                        <span className="text-xs font-bold text-green-600">
                          {formatCurrencyWithSymbol(summary.totals.income, displayCurrency)}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground">Balance</span>
                          <span className={cn(
                            "text-sm font-bold",
                            balance >= 0 ? "text-blue-600" : "text-orange-600"
                          )}>
                            {balance >= 0 ? '+' : ''}
                            {formatCurrencyWithSymbol(balance, displayCurrency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Savings Rate Bar */}
                    {summary.totals.income > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Ahorro</span>
                          <span className="text-xs font-semibold text-foreground">
                            {savingsRate.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              savingsRate >= 0 ? "bg-blue-500" : "bg-orange-500"
                            )}
                            style={{ width: `${Math.min(Math.abs(savingsRate), 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Top Categories Preview */}
                    {selectedMonth === monthKey && topExpenseCategories.length > 0 && (
                      <div className="pt-2 border-t border-border space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Top 3
                        </p>
                        {topExpenseCategories.map(([id, cat]) => (
                          <div key={id} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-xs text-foreground truncate">
                                {cat.name}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {formatCurrencyWithSymbol(cat.expenses, displayCurrency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
