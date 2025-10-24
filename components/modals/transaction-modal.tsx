'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Transaction, Category, TransactionFormData } from '@/types';
import { X, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { QuickRuleModal } from '@/components/upload/QuickRuleModal';
import { AddToRuleModal } from '@/components/upload/AddToRuleModal';
import { useToast } from '@/contexts/toast-context';

interface TransactionModalProps {
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export function TransactionModal({ transaction, categories, onClose, onSave }: TransactionModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    vendor: transaction?.vendor || '',
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    type: transaction?.type || 'expense',
    currency: transaction?.currency || 'UYU',
    categoryId: transaction?.categoryId || null, // Use null instead of '' to avoid UUID errors
    notes: transaction?.notes || '',
    isInstallment: false,
    installmentTotal: 1,
    installmentAmount: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [showQuickRuleModal, setShowQuickRuleModal] = useState(false);
  const [showAddToRuleModal, setShowAddToRuleModal] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setCreatingCategory(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: newCategoryName.trim(),
          color: newCategoryColor,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ya existe una categoría con ese nombre');
        }
        throw error;
      }

      // Add new category to local list and select it
      const categoryObj: Category = {
        id: newCategory.id,
        userId: newCategory.user_id,
        name: newCategory.name,
        color: newCategory.color,
        isActive: newCategory.is_active,
        createdAt: new Date(newCategory.created_at),
        updatedAt: new Date(newCategory.updated_at),
      };

      setLocalCategories([...localCategories, categoryObj]);
      setFormData({ ...formData, categoryId: newCategory.id });
      setShowNewCategory(false);
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (transaction) {
        // Update existing transaction (don't allow changing to installment mode)
        const transactionData = {
          user_id: user.id,
          date: formData.date,
          vendor: formData.vendor,
          description: formData.description || null,
          amount: formData.amount,
          type: formData.type,
          currency: formData.currency,
          category_id: formData.categoryId || null,
          notes: formData.notes || null,
          is_manually_verified: true,
          confidence_score: 1.0,
        };

        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id);

        if (error) throw error;
      } else {
        // Create new transaction(s)
        if (formData.isInstallment && formData.installmentTotal && formData.installmentTotal > 1) {
          // Create multiple installment transactions
          const installmentGroupId = crypto.randomUUID();
          const baseDate = new Date(formData.date);
          const transactions = [];

          for (let i = 0; i < formData.installmentTotal; i++) {
            // Calculate date for this installment (add i months)
            const installmentDate = new Date(baseDate);
            installmentDate.setMonth(installmentDate.getMonth() + i);

            const installmentDescription = formData.description
              ? `${formData.description} (Cuota ${i + 1}/${formData.installmentTotal})`
              : `(Cuota ${i + 1}/${formData.installmentTotal})`;

            transactions.push({
              user_id: user.id,
              date: installmentDate.toISOString().split('T')[0],
              vendor: formData.vendor,
              description: installmentDescription,
              amount: formData.installmentAmount || 0,
              type: formData.type,
              currency: formData.currency,
              category_id: formData.categoryId || null,
              notes: formData.notes || null,
              installment_group_id: installmentGroupId,
              installment_number: i + 1,
              installment_total: formData.installmentTotal,
              original_amount: formData.amount,
              is_manually_verified: true,
              confidence_score: 1.0,
            });
          }

          const { error } = await supabase
            .from('transactions')
            .insert(transactions);

          if (error) throw error;
        } else {
          // Create single transaction
          const transactionData = {
            user_id: user.id,
            date: formData.date,
            vendor: formData.vendor,
            description: formData.description || null,
            amount: formData.amount,
            type: formData.type,
            currency: formData.currency,
            category_id: formData.categoryId || null,
            notes: formData.notes || null,
            is_manually_verified: true,
            confidence_score: 1.0,
          };

          const { error } = await supabase
            .from('transactions')
            .insert(transactionData);

          if (error) throw error;
        }
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la transacción');
    } finally {
      setSaving(false);
    }
  };

  // Show all active categories (type is no longer a category property)
  const filteredCategories = localCategories.filter(cat => cat.isActive !== false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
      <div className="w-full max-w-2xl rounded-lg bg-card text-card-foreground p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value as 'expense' | 'income' });
                  }}
                  className="h-4 w-4"
                />
                <span>Gasto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value as 'expense' | 'income' });
                  }}
                  className="h-4 w-4"
                />
                <span>Ingreso</span>
              </label>
            </div>
          </div>

          {/* Installment Mode Toggle (only for new transactions) */}
          {!transaction && (
            <div className="p-3 rounded-lg border border-border bg-muted/30">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={formData.isInstallment}
                  onChange={(e) => {
                    const isInstallment = e.target.checked;
                    setFormData({
                      ...formData,
                      isInstallment,
                      installmentTotal: isInstallment ? formData.installmentTotal || 2 : 1,
                    });
                  }}
                  className="h-4 w-4"
                />
                <span className="font-medium text-sm">En Cuotas / Suscripción Recurrente</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                Divide el monto total en pagos mensuales automáticos
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                {formData.isInstallment ? 'Fecha Primera Cuota *' : 'Fecha *'}
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Amount with Currency Toggle */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                {formData.isInstallment ? 'Monto Total *' : 'Monto *'}
              </label>
              <div className="flex gap-2">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const installmentAmount = formData.isInstallment && formData.installmentTotal
                      ? amount / formData.installmentTotal
                      : amount;
                    setFormData({ ...formData, amount, installmentAmount });
                  }}
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {/* Currency Toggle */}
                <div className="flex rounded-lg border border-border bg-background overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: 'UYU' })}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      formData.currency === 'UYU'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    $U
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: 'USD' })}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-l border-border ${
                      formData.currency === 'USD'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    US$
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Installment-specific fields */}
          {formData.isInstallment && (
            <div className="space-y-3 p-3 rounded-lg border border-border bg-primary/5">
              <div className="grid grid-cols-2 gap-3">
                {/* Number of installments */}
                <div>
                  <label htmlFor="installmentTotal" className="block text-sm font-medium text-foreground mb-2">
                    Número de Cuotas *
                  </label>
                  <input
                    id="installmentTotal"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.installmentTotal || 1}
                    onChange={(e) => {
                      const installmentTotal = parseInt(e.target.value) || 1;
                      const installmentAmount = formData.amount / installmentTotal;
                      setFormData({ ...formData, installmentTotal, installmentAmount });
                    }}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: 6, 12, 24"
                  />
                </div>

                {/* Calculated amount per installment */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monto por Cuota
                  </label>
                  <div className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground font-medium text-sm">
                    {formData.currency === 'USD' ? 'US$' : '$U'} {formData.installmentAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Se crearán {formData.installmentTotal || 1} transacciones de {formData.currency === 'USD' ? 'US$' : '$U'}{formData.installmentAmount?.toFixed(2) || '0.00'} cada una, una por mes durante {formData.installmentTotal || 1} meses.
              </div>
            </div>
          )}

          {/* Vendor */}
          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-foreground mb-2">
              Vendor / Origen *
            </label>
            <input
              id="vendor"
              type="text"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: ANTEL, Del Campo, etc."
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategory(!showNewCategory);
                  setError('');
                }}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                {showNewCategory ? 'Seleccionar existente' : 'Nueva Categoría'}
              </button>
            </div>

            {showNewCategory ? (
              <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Supermercado, Salario, etc."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-10 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName('');
                      setNewCategoryColor('#3b82f6');
                      setError('');
                    }}
                    className="flex-1 text-xs h-7"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="flex-1 text-xs h-7"
                  >
                    {creatingCategory ? 'Creando...' : 'Crear'}
                  </Button>
                </div>
              </div>
            ) : (
              <Select
                label="Categoría de destino"
                value={formData.categoryId || ''}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
                placeholder="Seleccionar categoría..."
                options={filteredCategories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(cat => ({
                    value: cat.id,
                    label: cat.name,
                    color: cat.color,
                  }))}
              />
            )}
          </div>

          {/* Optional Fields Section - Collapsible */}
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <span>{showOptionalFields ? '▼' : '▶'}</span>
              <span className="font-medium">Detalles opcionales</span>
              <span className="text-xs">(Descripción, Notas, Automatización)</span>
            </button>

            {showOptionalFields && (
              <div className="space-y-3">
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Descripción
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descripción adicional (opcional)"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                    Notas
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Notas adicionales (opcional)"
                  />
                </div>

                {/* Automation Actions */}
                {formData.vendor && (
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-xs font-medium text-foreground mb-2">
                      Acciones de automatización:
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Abriendo QuickRuleModal con vendor:', formData.vendor);
                          setShowQuickRuleModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors"
                        title="Crear una nueva regla para auto-categorizar"
                      >
                        <Zap className="h-3 w-3" />
                        Crear Regla
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Abriendo AddToRuleModal con vendor:', formData.vendor);
                          setShowAddToRuleModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded transition-colors"
                        title="Agregar a una regla existente"
                      >
                        <Plus className="h-3 w-3" />
                        Extender Regla
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex-1"
            >
              {saving
                ? (formData.isInstallment ? `Creando ${formData.installmentTotal} cuotas...` : 'Guardando...')
                : (formData.isInstallment ? `Crear ${formData.installmentTotal} Cuotas` : 'Guardar')
              }
            </Button>
          </div>
        </form>
      </div>

      {/* Quick Rule Modal */}
      <QuickRuleModal
        isOpen={showQuickRuleModal}
        onClose={() => setShowQuickRuleModal(false)}
        onRuleCreated={() => {
          setShowQuickRuleModal(false);
          toast.success('Regla creada correctamente', 'Las transacciones futuras con este vendor se categorizarán automáticamente');
        }}
        vendor={formData.vendor}
        categories={localCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color
        }))}
        selectedCategoryId={formData.categoryId}
      />

      {/* Add To Rule Modal */}
      <AddToRuleModal
        isOpen={showAddToRuleModal}
        onClose={() => setShowAddToRuleModal(false)}
        onRuleUpdated={() => {
          setShowAddToRuleModal(false);
          toast.success('Regla actualizada correctamente', 'El vendor fue agregado a la regla existente');
        }}
        vendor={formData.vendor}
      />
    </div>
  );
}
