import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { messages, conversationId, mode = 'adaptive' } = await request.json();
    const supabase = await createClient();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, mode })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = newConv.id;
    }

    // System prompt based on mode
    const systemPrompts = {
      quick: `Eres un asistente financiero experto. Proporciona respuestas rápidas y concisas (máximo 2-3 oraciones).
Usa las herramientas solo cuando sean estrictamente necesarias. Responde en español.`,

      deep: `Eres un asistente financiero experto con análisis profundo. Proporciona insights detallados, tendencias,
patrones y recomendaciones personalizadas. Usa múltiples herramientas para análisis completos. Responde en español.`,

      adaptive: `Eres un asistente financiero experto. Adapta tu nivel de detalle según la pregunta:
- Preguntas simples (ej: "cuánto gasté"): Respuesta directa y concisa
- Preguntas analíticas (ej: "cómo puedo ahorrar"): Análisis profundo con insights y recomendaciones
Usa las herramientas disponibles inteligentemente. Responde en español.`
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.adaptive;

    // Convert messages
    const conversationMessages = messages.filter((m: any) => m.role !== 'system');
    const coreMessages = convertToCoreMessages(conversationMessages);

    // Configuration based on mode
    const modeConfig = {
      quick: { maxTokens: 300, temperature: 0.3 },
      deep: { maxTokens: 1000, temperature: 0.7 },
      adaptive: { maxTokens: 600, temperature: 0.5 },
    };

    const config = modeConfig[mode as keyof typeof modeConfig] || modeConfig.adaptive;

    // Define all tools
    const tools = {
      // EXISTING TOOLS (improved)
      getTransactionsByCategory: tool({
        description: 'Obtiene transacciones filtradas por categoría específica',
        parameters: z.object({
          categoryName: z.string().describe('Nombre de la categoría'),
          limit: z.number().optional().default(20).describe('Número de transacciones a retornar'),
        }),
        execute: async ({ categoryName, limit }) => {
          const { data, error } = await supabase
            .from('transactions')
            .select('*, categories(name, type, color)')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .ilike('categories.name', `%${categoryName}%`)
            .order('date', { ascending: false })
            .limit(limit);

          if (error) return { error: error.message };

          const total = data?.reduce((sum, t) => sum + t.amount, 0) || 0;
          return {
            transactions: data,
            summary: {
              count: data?.length || 0,
              total,
              average: data?.length ? total / data.length : 0
            }
          };
        },
      }),

      getTransactionsByDateRange: tool({
        description: 'Obtiene transacciones en un rango de fechas específico',
        parameters: z.object({
          startDate: z.string().describe('Fecha inicial (YYYY-MM-DD)'),
          endDate: z.string().describe('Fecha final (YYYY-MM-DD)'),
          type: z.enum(['expense', 'income', 'all']).optional().default('all'),
        }),
        execute: async ({ startDate, endDate, type }) => {
          let query = supabase
            .from('transactions')
            .select('*, categories(name, type, color)')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })
            .limit(100);

          if (type !== 'all') {
            query = query.eq('type', type);
          }

          const { data, error } = await query;
          if (error) return { error: error.message };

          const total = data?.reduce((sum, t) => sum + t.amount, 0) || 0;
          const expenses = data?.filter(t => t.type === 'expense') || [];
          const income = data?.filter(t => t.type === 'income') || [];

          return {
            transactions: data,
            summary: {
              count: data?.length || 0,
              totalExpenses: expenses.reduce((s, t) => s + t.amount, 0),
              totalIncome: income.reduce((s, t) => s + t.amount, 0),
              balance: income.reduce((s, t) => s + t.amount, 0) - expenses.reduce((s, t) => s + t.amount, 0),
            }
          };
        },
      }),

      getCategorySummary: tool({
        description: 'Obtiene resumen de gastos agrupados por categoría con totales',
        parameters: z.object({
          startDate: z.string().optional().describe('Fecha inicial opcional'),
          endDate: z.string().optional().describe('Fecha final opcional'),
          type: z.enum(['expense', 'income', 'all']).optional().default('expense'),
        }),
        execute: async ({ startDate, endDate, type }) => {
          let query = supabase
            .from('transactions')
            .select('amount, type, categories(name, color)')
            .eq('user_id', user.id)
            .eq('is_ignored', false);

          if (startDate) query = query.gte('date', startDate);
          if (endDate) query = query.lte('date', endDate);
          if (type !== 'all') query = query.eq('type', type);

          const { data, error } = await query;
          if (error) return { error: error.message };

          // Group by category
          const summary: Record<string, { amount: number; color: string; count: number }> = {};
          data?.forEach((t: any) => {
            if (t.categories?.name) {
              if (!summary[t.categories.name]) {
                summary[t.categories.name] = { amount: 0, color: t.categories.color, count: 0 };
              }
              summary[t.categories.name].amount += t.amount;
              summary[t.categories.name].count += 1;
            }
          });

          // Sort by amount descending
          const sorted = Object.entries(summary)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.amount - a.amount);

          return {
            categorySummary: sorted,
            total: sorted.reduce((sum, cat) => sum + cat.amount, 0),
            categoryCount: sorted.length,
          };
        },
      }),

      // NEW TOOLS
      getTrendAnalysis: tool({
        description: 'Analiza tendencias de gastos e ingresos mes a mes con comparaciones',
        parameters: z.object({
          months: z.number().optional().default(6).describe('Número de meses a analizar'),
          type: z.enum(['expense', 'income', 'both']).optional().default('both'),
        }),
        execute: async ({ months, type }) => {
          const monthlyData = [];

          for (let i = 0; i < months; i++) {
            const monthStart = startOfMonth(subMonths(new Date(), i));
            const monthEnd = endOfMonth(subMonths(new Date(), i));

            let query = supabase
              .from('transactions')
              .select('amount, type, date')
              .eq('user_id', user.id)
              .eq('is_ignored', false)
              .gte('date', format(monthStart, 'yyyy-MM-dd'))
              .lte('date', format(monthEnd, 'yyyy-MM-dd'));

            const { data } = await query;

            const expenses = data?.filter(t => t.type === 'expense') || [];
            const income = data?.filter(t => t.type === 'income') || [];

            monthlyData.unshift({
              month: format(monthStart, 'MMM yyyy'),
              expenses: expenses.reduce((sum, t) => sum + t.amount, 0),
              income: income.reduce((sum, t) => sum + t.amount, 0),
              balance: income.reduce((sum, t) => sum + t.amount, 0) - expenses.reduce((sum, t) => sum + t.amount, 0),
              transactionCount: data?.length || 0,
            });
          }

          // Calculate trends
          const avgExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0) / months;
          const avgIncome = monthlyData.reduce((sum, m) => sum + m.income, 0) / months;
          const currentMonth = monthlyData[monthlyData.length - 1];
          const previousMonth = monthlyData[monthlyData.length - 2];

          return {
            monthlyData,
            trends: {
              averageExpenses: avgExpenses,
              averageIncome: avgIncome,
              currentVsPrevious: previousMonth ? {
                expenseChange: ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100),
                incomeChange: ((currentMonth.income - previousMonth.income) / previousMonth.income * 100),
              } : null,
            }
          };
        },
      }),

      getSpendingByVendor: tool({
        description: 'Analiza gastos agrupados por vendor/comercio con frecuencia',
        parameters: z.object({
          limit: z.number().optional().default(10).describe('Top N vendors'),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
        execute: async ({ limit, startDate, endDate }) => {
          let query = supabase
            .from('transactions')
            .select('vendor, amount, date')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .eq('type', 'expense');

          if (startDate) query = query.gte('date', startDate);
          if (endDate) query = query.lte('date', endDate);

          const { data, error } = await query;
          if (error) return { error: error.message };

          // Group by vendor
          const vendorStats: Record<string, { total: number; count: number; lastDate: string }> = {};
          data?.forEach((t: any) => {
            if (!vendorStats[t.vendor]) {
              vendorStats[t.vendor] = { total: 0, count: 0, lastDate: t.date };
            }
            vendorStats[t.vendor].total += t.amount;
            vendorStats[t.vendor].count += 1;
            if (t.date > vendorStats[t.vendor].lastDate) {
              vendorStats[t.vendor].lastDate = t.date;
            }
          });

          const sorted = Object.entries(vendorStats)
            .map(([vendor, stats]) => ({
              vendor,
              ...stats,
              average: stats.total / stats.count,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);

          return {
            topVendors: sorted,
            totalVendors: Object.keys(vendorStats).length,
          };
        },
      }),

      getBudgetAnalysis: tool({
        description: 'Compara presupuestos establecidos vs gastos reales por categoría',
        parameters: z.object({
          period: z.enum(['monthly', 'yearly']).optional().default('monthly'),
        }),
        execute: async ({ period }) => {
          // Get budgets
          const { data: budgets } = await supabase
            .from('budgets')
            .select('*, categories(name, color)')
            .eq('user_id', user.id)
            .eq('period', period);

          if (!budgets || budgets.length === 0) {
            return { message: 'No hay presupuestos configurados', budgets: [] };
          }

          // Get current period transactions
          const now = new Date();
          const periodStart = period === 'monthly' ? startOfMonth(now) : new Date(now.getFullYear(), 0, 1);
          const periodEnd = period === 'monthly' ? endOfMonth(now) : new Date(now.getFullYear(), 11, 31);

          const analysis = [];

          for (const budget of budgets) {
            const { data: transactions } = await supabase
              .from('transactions')
              .select('amount')
              .eq('user_id', user.id)
              .eq('category_id', budget.category_id)
              .eq('is_ignored', false)
              .gte('date', format(periodStart, 'yyyy-MM-dd'))
              .lte('date', format(periodEnd, 'yyyy-MM-dd'));

            const spent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
            const remaining = budget.amount - spent;
            const percentageUsed = (spent / budget.amount) * 100;

            analysis.push({
              category: budget.categories.name,
              budgeted: budget.amount,
              spent,
              remaining,
              percentageUsed,
              status: percentageUsed > 100 ? 'exceeded' : percentageUsed > 80 ? 'warning' : 'ok',
            });
          }

          return {
            period,
            analysis,
            summary: {
              totalBudgeted: analysis.reduce((sum, a) => sum + a.budgeted, 0),
              totalSpent: analysis.reduce((sum, a) => sum + a.spent, 0),
              categoriesExceeded: analysis.filter(a => a.status === 'exceeded').length,
            }
          };
        },
      }),

      getAccountsSummary: tool({
        description: 'Obtiene resumen de balance y actividad por cuenta bancaria',
        parameters: z.object({}),
        execute: async () => {
          const { data: accounts } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', user.id);

          if (!accounts || accounts.length === 0) {
            return { message: 'No hay cuentas registradas', accounts: [] };
          }

          const accountSummaries = [];

          for (const account of accounts) {
            const { data: transactions } = await supabase
              .from('transactions')
              .select('amount, type')
              .eq('user_id', user.id)
              .eq('account_id', account.id)
              .eq('is_ignored', false);

            const income = transactions?.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 0;
            const expenses = transactions?.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) || 0;
            const currentBalance = account.initial_balance + income - expenses;

            accountSummaries.push({
              name: account.name,
              bank: account.bank,
              initialBalance: account.initial_balance,
              currentBalance,
              totalIncome: income,
              totalExpenses: expenses,
              transactionCount: transactions?.length || 0,
            });
          }

          return {
            accounts: accountSummaries,
            totalBalance: accountSummaries.reduce((sum, a) => sum + a.currentBalance, 0),
          };
        },
      }),

      searchTransactions: tool({
        description: 'Búsqueda avanzada de transacciones por texto, monto o vendor',
        parameters: z.object({
          query: z.string().describe('Texto a buscar en vendor o description'),
          minAmount: z.number().optional().describe('Monto mínimo'),
          maxAmount: z.number().optional().describe('Monto máximo'),
          limit: z.number().optional().default(20),
        }),
        execute: async ({ query, minAmount, maxAmount, limit }) => {
          let dbQuery = supabase
            .from('transactions')
            .select('*, categories(name, type, color)')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .or(`vendor.ilike.%${query}%,description.ilike.%${query}%`)
            .order('date', { ascending: false })
            .limit(limit);

          if (minAmount !== undefined) dbQuery = dbQuery.gte('amount', minAmount);
          if (maxAmount !== undefined) dbQuery = dbQuery.lte('amount', maxAmount);

          const { data, error } = await dbQuery;
          if (error) return { error: error.message };

          return {
            results: data,
            count: data?.length || 0,
          };
        },
      }),

      getRecurringTransactions: tool({
        description: 'Detecta gastos recurrentes (subscripciones, servicios fijos)',
        parameters: z.object({
          minOccurrences: z.number().optional().default(3).describe('Mínimo de ocurrencias para considerar recurrente'),
        }),
        execute: async ({ minOccurrences }) => {
          const { data: transactions } = await supabase
            .from('transactions')
            .select('vendor, amount, date')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .eq('type', 'expense')
            .order('date', { ascending: false });

          // Group by vendor and similar amounts
          const vendorGroups: Record<string, any[]> = {};
          transactions?.forEach(t => {
            if (!vendorGroups[t.vendor]) vendorGroups[t.vendor] = [];
            vendorGroups[t.vendor].push(t);
          });

          const recurring = [];

          for (const [vendor, txs] of Object.entries(vendorGroups)) {
            if (txs.length >= minOccurrences) {
              // Check if amounts are similar (within 10%)
              const amounts = txs.map(t => t.amount);
              const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
              const allSimilar = amounts.every(amt => Math.abs(amt - avgAmount) / avgAmount < 0.1);

              if (allSimilar) {
                recurring.push({
                  vendor,
                  amount: avgAmount,
                  frequency: txs.length,
                  lastDate: txs[0].date,
                  estimatedMonthly: avgAmount, // Simplified
                });
              }
            }
          }

          return {
            recurringTransactions: recurring.sort((a, b) => b.amount - a.amount),
            totalMonthlyEstimate: recurring.reduce((sum, r) => sum + r.estimatedMonthly, 0),
          };
        },
      }),

      comparePeriodsAnalysis: tool({
        description: 'Compara gastos/ingresos entre diferentes períodos de tiempo',
        parameters: z.object({
          comparison: z.enum(['month-vs-previous', 'month-vs-year-ago', 'year-vs-previous']).describe('Tipo de comparación'),
        }),
        execute: async ({ comparison }) => {
          const now = new Date();
          let period1Start, period1End, period2Start, period2End, label1, label2;

          switch (comparison) {
            case 'month-vs-previous':
              period1Start = startOfMonth(now);
              period1End = endOfMonth(now);
              period2Start = startOfMonth(subMonths(now, 1));
              period2End = endOfMonth(subMonths(now, 1));
              label1 = 'Mes actual';
              label2 = 'Mes anterior';
              break;
            case 'month-vs-year-ago':
              period1Start = startOfMonth(now);
              period1End = endOfMonth(now);
              period2Start = startOfMonth(subMonths(now, 12));
              period2End = endOfMonth(subMonths(now, 12));
              label1 = 'Mes actual';
              label2 = 'Mismo mes año pasado';
              break;
            case 'year-vs-previous':
              period1Start = new Date(now.getFullYear(), 0, 1);
              period1End = new Date(now.getFullYear(), 11, 31);
              period2Start = new Date(now.getFullYear() - 1, 0, 1);
              period2End = new Date(now.getFullYear() - 1, 11, 31);
              label1 = 'Este año';
              label2 = 'Año anterior';
              break;
          }

          const getPeriodData = async (start: Date, end: Date) => {
            const { data } = await supabase
              .from('transactions')
              .select('amount, type, categories(name)')
              .eq('user_id', user.id)
              .eq('is_ignored', false)
              .gte('date', format(start, 'yyyy-MM-dd'))
              .lte('date', format(end, 'yyyy-MM-dd'));

            const expenses = data?.filter(t => t.type === 'expense') || [];
            const income = data?.filter(t => t.type === 'income') || [];

            return {
              totalExpenses: expenses.reduce((s, t) => s + t.amount, 0),
              totalIncome: income.reduce((s, t) => s + t.amount, 0),
              transactionCount: data?.length || 0,
            };
          };

          const period1Data = await getPeriodData(period1Start, period1End);
          const period2Data = await getPeriodData(period2Start, period2End);

          return {
            comparison,
            period1: { label: label1, ...period1Data },
            period2: { label: label2, ...period2Data },
            changes: {
              expensesChange: period2Data.totalExpenses ?
                ((period1Data.totalExpenses - period2Data.totalExpenses) / period2Data.totalExpenses * 100) : 0,
              incomeChange: period2Data.totalIncome ?
                ((period1Data.totalIncome - period2Data.totalIncome) / period2Data.totalIncome * 100) : 0,
            }
          };
        },
      }),

      getPredictionsInsights: tool({
        description: 'Genera predicciones e insights basados en patrones de gasto',
        parameters: z.object({}),
        execute: async () => {
          // Get last 3 months data for predictions
          const threeMonthsAgo = subMonths(new Date(), 3);
          const { data: recentTransactions } = await supabase
            .from('transactions')
            .select('amount, type, date, categories(name)')
            .eq('user_id', user.id)
            .eq('is_ignored', false)
            .gte('date', format(threeMonthsAgo, 'yyyy-MM-dd'))
            .order('date', { ascending: false });

          const expenses = recentTransactions?.filter(t => t.type === 'expense') || [];
          const avgMonthlyExpenses = expenses.reduce((s, t) => s + t.amount, 0) / 3;

          // Category insights
          const categoryTotals: Record<string, number> = {};
          expenses.forEach(t => {
            const catName = t.categories?.name || 'Sin categoría';
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
          });

          const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

          // Simple insights
          const insights = [
            `Tu gasto mensual promedio es ${avgMonthlyExpenses.toFixed(2)}`,
            topCategory ? `Tu categoría con mayor gasto es "${topCategory[0]}" con ${topCategory[1].toFixed(2)}` : '',
          ].filter(Boolean);

          return {
            predictions: {
              nextMonthExpenses: avgMonthlyExpenses,
              trend: 'stable', // Simplified
            },
            insights,
            recommendations: [
              avgMonthlyExpenses > 50000 ? 'Considera revisar tus gastos más grandes' : '',
              topCategory && topCategory[1] > avgMonthlyExpenses * 0.4 ? `El gasto en ${topCategory[0]} representa más del 40% de tus gastos` : '',
            ].filter(Boolean),
          };
        },
      }),
    };

    // Stream response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: coreMessages,
      tools,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      maxSteps: mode === 'deep' ? 5 : 3,
      onFinish: async ({ text, toolCalls }) => {
        // Save assistant message
        await supabase.from('chat_messages').insert({
          conversation_id: currentConversationId,
          role: 'assistant',
          content: text,
          tool_calls_metadata: toolCalls ? JSON.stringify(toolCalls) : null,
        });
      },
    });

    // Save user message before streaming
    const lastUserMessage = conversationMessages[conversationMessages.length - 1];
    if (lastUserMessage) {
      await supabase.from('chat_messages').insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: lastUserMessage.content,
      });
    }

    return result.toDataStreamResponse({
      headers: {
        'X-Conversation-Id': currentConversationId,
      }
    });

  } catch (error: any) {
    console.error('AI API error:', error);

    if (error?.status === 401) {
      return new Response(
        JSON.stringify({ error: 'API key inválida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Error procesando solicitud', details: error?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
