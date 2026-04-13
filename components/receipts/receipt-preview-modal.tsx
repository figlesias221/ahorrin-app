'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, AlertCircle, CheckCircle, AlertTriangle, Save, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { ReceiptParseResult } from '@/types';
import { useToast } from '@/contexts/toast-context';

interface ReceiptPreviewModalProps {
  result: ReceiptParseResult;
  imageUrl: string;
  categories: Array<{ id: string; name: string; color: string }>;
  onClose: () => void;
  onSave: () => void;
  onRetry?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export function ReceiptPreviewModal({
  result,
  imageUrl,
  categories,
  onClose,
  onSave,
  onRetry,
  currentIndex,
  totalCount,
}: ReceiptPreviewModalProps) {
  const [formData, setFormData] = useState({
    date: result.transaction?.date || new Date().toISOString().split('T')[0],
    vendor: result.transaction?.vendor || '',
    amount: result.transaction?.amount || 0,
    currency: result.transaction?.currency || 'UYU',
    description: result.transaction?.description || '',
    categoryId: '',
  });
  const [createPerItem, setCreatePerItem] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();
  const toast = useToast();

  // Auto-select category if suggested
  useEffect(() => {
    if (result.transaction?.suggestedCategory && categories.length > 0) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === result.transaction?.suggestedCategory?.toLowerCase()
      );
      if (matchedCategory) {
        setFormData(prev => ({ ...prev, categoryId: matchedCategory.id }));
      }
    }
  }, [result.transaction?.suggestedCategory, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (!formData.categoryId) {
        throw new Error('Debes seleccionar una categoría');
      }

      if (createPerItem && result.transaction?.items && result.transaction.items.length > 0) {
        // Create one transaction per item
        const transactionsToInsert = result.transaction.items.map(item => ({
          user_id: user.id,
          date: formData.date,
          vendor: formData.vendor,
          description: item.name,
          amount: item.amount,
          type: 'expense' as const,
          currency: formData.currency,
          category_id: formData.categoryId,
          notes: 'Creado desde escaneo de ticket (ítem individual)',
          is_manually_verified: true,
          confidence_score: result.confidence,
        }));

        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert);

        if (insertError) throw insertError;

        toast.success(`${transactionsToInsert.length} transacciones creadas exitosamente`);
      } else {
        // Create single transaction with total amount
        const transactionData = {
          user_id: user.id,
          date: formData.date,
          vendor: formData.vendor,
          description: formData.description || null,
          amount: formData.amount,
          type: 'expense' as const,
          currency: formData.currency,
          category_id: formData.categoryId,
          notes: 'Creado desde escaneo de ticket',
          is_manually_verified: true,
          confidence_score: result.confidence,
        };

        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionData);

        if (insertError) throw insertError;

        toast.success('Transacción creada exitosamente');
      }

      onSave();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error al guardar la transacción');
      toast.error(error.message || 'Error al guardar la transacción');
    } finally {
      setSaving(false);
    }
  };

  const confidenceBadge = () => {
    if (result.confidence >= 0.8) {
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          Alta confianza ({(result.confidence * 100).toFixed(0)}%)
        </Badge>
      );
    } else if (result.confidence >= 0.6) {
      return (
        <Badge variant="default" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Revisar datos ({(result.confidence * 100).toFixed(0)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Baja confianza ({(result.confidence * 100).toFixed(0)}%)
        </Badge>
      );
    }
  };

  // Categories are already filtered as active in the upload page, no need to filter again
  const filteredCategories = categories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="w-full max-w-6xl rounded-lg bg-card text-card-foreground shadow-xl my-8">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">
              Confirmar Datos del Ticket
              {totalCount && totalCount > 1 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({(currentIndex ?? 0) + 1} de {totalCount})
                </span>
              )}
            </h2>
            {confidenceBadge()}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Two columns */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left: Image Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imagen del Ticket</h3>
            <Card className="overflow-hidden bg-muted">
              <div className="relative aspect-[3/4] max-h-[600px]">
                <Image
                  src={imageUrl}
                  alt="Ticket escaneado"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Card>

            {result.transaction?.items && result.transaction.items.length > 0 && (
              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-2">Items detectados:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {result.transaction.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{formData.currency} {item.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Right: Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Datos Extraídos</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
                  {error}
                </div>
              )}

              {result.confidence < 0.8 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-sm">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Revisa cuidadosamente los datos antes de guardar
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground"
                  required
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comercio
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground"
                  placeholder="Ej: Devoto"
                  required
                />
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Moneda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground"
                  >
                    <option value="UYU">UYU ($)</option>
                    <option value="USD">USD (U$S)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoría * {categories.length > 0 && `(${categories.length} disponibles)`}
                </label>
                {categories.length === 0 ? (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm">
                    ⚠️ No tienes categorías creadas. <a href="/categories" className="underline font-semibold">Crea una categoría primero</a>.
                  </div>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onChange={(value) => setFormData({ ...formData, categoryId: value })}
                    placeholder="Selecciona una categoría"
                    options={filteredCategories.map(cat => ({
                      value: cat.id,
                      label: cat.name,
                      color: cat.color,
                    }))}
                  />
                )}
              </div>

              {/* Create per item option */}
              {result.transaction?.items && result.transaction.items.length > 1 && (
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createPerItem}
                      onChange={(e) => setCreatePerItem(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-muted-foreground/25 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Crear una transacción por cada ítem
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Se crearán {result.transaction.items.length} transacciones separadas en lugar de una sola con el total ({formData.currency} {formData.amount.toFixed(2)})
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground resize-none"
                  rows={3}
                  placeholder="Detalles adicionales..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>Guardando...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Transacción
                    </>
                  )}
                </Button>

                {onRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onRetry}
                    disabled={saving}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
