'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-semibold text-foreground">Transacciones Recientes</h3>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          <Filter className="h-3 w-3 mr-1.5" />
          <span className="text-xs">Filtrar</span>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Fecha
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Vendor
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Categoría
              </th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Monto
              </th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tipo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/50">
                <td className="py-2 px-3 text-xs text-card-foreground">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-2 px-3 text-xs font-medium text-card-foreground">
                  {transaction.vendor}
                </td>
                <td className="py-2 px-3 text-xs">
                  {transaction.category && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      />
                      <span className="text-card-foreground">
                        {transaction.category.name}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-3 text-right text-xs font-semibold">
                  <span className={transaction.type === 'income' ? 'text-success' : 'text-error'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge variant={transaction.type === 'income' ? 'success' : 'error'} className="text-[10px] px-1.5 py-0">
                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
