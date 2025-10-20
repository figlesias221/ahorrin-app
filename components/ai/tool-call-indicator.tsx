'use client';

import { motion } from 'framer-motion';
import { Wrench, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { typography } from '@/lib/design-tokens';
import { useState } from 'react';

interface ToolCallIndicatorProps {
  toolName: string;
  status: 'loading' | 'complete';
  result?: any;
}

const toolDescriptions: Record<string, string> = {
  getTransactionsByCategory: 'Obteniendo transacciones por categoría',
  getTransactionsByDateRange: 'Consultando transacciones del período',
  getCategorySummary: 'Analizando gastos por categoría',
  getTrendAnalysis: 'Analizando tendencias mes a mes',
  getSpendingByVendor: 'Identificando gastos por comercio',
  getBudgetAnalysis: 'Comparando presupuestos vs gastos',
  getAccountsSummary: 'Revisando balance de cuentas',
  searchTransactions: 'Buscando transacciones',
  getRecurringTransactions: 'Detectando gastos recurrentes',
  comparePeriodsAnalysis: 'Comparando períodos',
  getPredictionsInsights: 'Generando predicciones e insights',
};

export function ToolCallIndicator({ toolName, status, result }: ToolCallIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = toolDescriptions[toolName] || 'Procesando datos';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="my-2 overflow-hidden"
    >
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        ${status === 'loading'
          ? 'bg-primary/10 ring-1 ring-primary/20'
          : 'bg-muted ring-1 ring-border'
        }
      `}>
        <div className="shrink-0">
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
            <p className={`${typography.bodySmall} text-foreground`}>
              {description}
            </p>
          </div>
        </div>

        {status === 'complete' && result && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {isExpanded && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 p-4 rounded-xl bg-surface ring-1 ring-border space-y-2"
        >
          {/* Show summary for category data */}
          {result.categorySummary && (
            <div className="space-y-2">
              <p className={`${typography.bodySmall} font-medium`}>Top Categorías:</p>
              {result.categorySummary.slice(0, 5).map((cat: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-medium">${cat.amount.toFixed(2)}</span>
                </div>
              ))}
              {result.total && (
                <div className="pt-2 border-t border-border flex justify-between text-sm font-medium">
                  <span>Total:</span>
                  <span>${result.total.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Fallback to JSON for other data */}
          {!result.categorySummary && (
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
