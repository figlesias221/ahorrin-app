'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit2, Eye, EyeOff, Trash2, Trash, StickyNote, Check, X, ChevronDown, Tag, ArrowUpDown, ArrowUp, ArrowDown, Plus, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { QuickCategoryModal } from '@/components/upload/QuickCategoryModal';
import { formatCurrency } from '@/lib/utils/formatters';
import { createClient } from '@/lib/supabase/client';
import { useCurrency } from '@/contexts/currency-context';
import { convertCurrency, formatCurrencyWithSymbol } from '@/lib/utils/currency';

interface Transaction {
  id: string;
  date: string;
  vendor: string;
  amount: number;
  type: 'expense' | 'income';
  currency: string;
  category_id: string;
  is_ignored: boolean;
  is_manually_verified: boolean;
  notes?: string;
  confidence_score?: number;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  type: 'expense' | 'income';
}

interface TransactionsTableEnhancedProps {
  transactions: Transaction[];
  categories: Category[];
  onUpdate: () => void;
  onTransactionUpdate?: (id: string, updates: Partial<Transaction>) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  showIgnored?: boolean;
  onEditModeChange?: (props: {
    isEditMode: boolean;
    editedCount: number;
    onToggleEditMode: () => void;
    onCancelAllChanges: () => void;
    onSaveAllChanges: () => void;
  }) => void;
}

export function TransactionsTableEnhanced({
  transactions,
  categories,
  onUpdate,
  onTransactionUpdate,
  onEdit,
  onDelete,
  showIgnored = false,
  onEditModeChange,
}: TransactionsTableEnhancedProps) {
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState<string>('');
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownSearchText, setDropdownSearchText] = useState('');
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);
  const categoryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Sorting state
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Global edit mode state (Excel-like)
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Map<string, { category_id?: string; notes?: string }>>(new Map());
  const [categorySearchText, setCategorySearchText] = useState<Map<string, string>>(new Map());
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'error' });
  const supabase = createClient();
  const { displayCurrency } = useCurrency();

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Notify parent of edit mode changes
  useEffect(() => {
    if (onEditModeChange) {
      onEditModeChange({
        isEditMode,
        editedCount: editedData.size,
        onToggleEditMode: handleToggleEditMode,
        onCancelAllChanges: handleCancelAllChanges,
        onSaveAllChanges: handleSaveAllChanges,
      });
    }
  }, [isEditMode, editedData.size]);

  const handleToggleSort = () => {
    setSortOrder(prev => {
      if (prev === 'none') return 'desc'; // Mayor a menor
      if (prev === 'desc') return 'asc';  // Menor a mayor
      return 'none';                       // Sin ordenamiento
    });
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Cancel edit mode
      setEditedData(new Map());
      setCategorySearchText(new Map());
    }
    setIsEditMode(!isEditMode);
  };

  const handleCategoryChange = (transactionId: string, categoryId: string) => {
    setEditedData(prev => {
      const next = new Map(prev);
      const existing = next.get(transactionId) || {};
      next.set(transactionId, { ...existing, category_id: categoryId });
      return next;
    });
  };

  const handleNotesChange = (transactionId: string, notes: string) => {
    setEditedData(prev => {
      const next = new Map(prev);
      const existing = next.get(transactionId) || {};
      next.set(transactionId, { ...existing, notes });
      return next;
    });
  };

  const handleCategoryTextChange = (transactionId: string, text: string) => {
    setCategorySearchText(prev => {
      const next = new Map(prev);
      next.set(transactionId, text);
      return next;
    });

    // Try to find exact match when user types/pastes
    const matchingCategory = categories.find(c =>
      c.name.toLowerCase() === text.toLowerCase()
    );

    if (matchingCategory) {
      handleCategoryChange(transactionId, matchingCategory.id);
    }
  };

  const handleCancelAllChanges = () => {
    setEditedData(new Map());
    setCategorySearchText(new Map());
    setIsEditMode(false);
  };

  const handleSaveAllChanges = async () => {
    if (editedData.size === 0) {
      setIsEditMode(false);
      return;
    }

    const updates: Array<{ id: string; changes: Partial<Transaction> }> = [];

    // Build updates array
    editedData.forEach((changes, transactionId) => {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const updateData: Partial<Transaction> = {};
      let hasChanges = false;

      if (changes.category_id !== undefined && changes.category_id !== transaction.category_id) {
        updateData.category_id = changes.category_id;
        hasChanges = true;
      }

      if (changes.notes !== undefined && changes.notes !== (transaction.notes || '')) {
        updateData.notes = changes.notes || null;
        hasChanges = true;
      }

      if (hasChanges) {
        updates.push({ id: transactionId, changes: updateData });
      }
    });

    if (updates.length === 0) {
      setIsEditMode(false);
      setEditedData(new Map());
      return;
    }

    // Mark all as updating
    updates.forEach(({ id }) => {
      setUpdatingIds(prev => new Set(prev).add(id));
    });

    try {
      // Execute all updates in parallel
      const promises = updates.map(({ id, changes }) =>
        supabase.from('transactions').update(changes).eq('id', id)
      );

      const results = await Promise.all(promises);

      // Check for errors
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error(`${errors.length} actualizaciones fallaron`);
      }

      // Success - clear state and refresh
      setEditedData(new Map());
      setCategorySearchText(new Map());
      setIsEditMode(false);
      onUpdate();
      showAlert('Éxito', `${updates.length} transacciones actualizadas correctamente`, 'success');
    } catch (error) {
      console.error('Error saving changes:', error);
      showAlert('Error', 'Error al guardar algunos cambios');
    } finally {
      // Clear all updating states
      setUpdatingIds(new Set());
    }
  };

  const handleToggleCategoryDropdown = (transactionId: string) => {
    if (openCategoryDropdown === transactionId) {
      setOpenCategoryDropdown(null);
      setDropdownSearchText('');
      return;
    }

    const button = categoryButtonRefs.current.get(transactionId);
    if (button) {
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setOpenCategoryDropdown(transactionId);
    setDropdownSearchText('');
  };

  const handleCategoryCreated = (category: { id: string; name: string; color: string; type: 'income' | 'expense' }) => {
    // Refresh the data to include the new category
    onUpdate();
    setOpenCategoryDropdown(null);
  };

  const handleToggleIgnore = async (transaction: Transaction) => {
    const transactionId = transaction.id;
    if (updatingIds.has(transactionId)) return;

    const newIsIgnored = !transaction.is_ignored;

    // Optimistic update
    if (onTransactionUpdate) {
      onTransactionUpdate(transactionId, { is_ignored: newIsIgnored });
    }

    setUpdatingIds(prev => new Set(prev).add(transactionId));

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ is_ignored: newIsIgnored })
        .eq('id', transactionId);

      if (error) throw error;

      // Only fetch if no optimistic update
      if (!onTransactionUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error toggling ignore:', error);
      showAlert('Error', 'Error al actualizar la transacción');
      // Revert optimistic update on error
      if (onTransactionUpdate) {
        onTransactionUpdate(transactionId, { is_ignored: transaction.is_ignored });
      }
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(transactionId);
        return next;
      });
    }
  };

  const handleQuickCategoryChange = async (transactionId: string, newCategoryId: string) => {
    if (updatingIds.has(transactionId)) return;

    const oldCategoryId = transactions.find(t => t.id === transactionId)?.category_id;

    // Close dropdown immediately
    setOpenCategoryDropdown(null);

    // Optimistic update
    if (onTransactionUpdate) {
      onTransactionUpdate(transactionId, { category_id: newCategoryId });
    }

    setUpdatingIds(prev => new Set(prev).add(transactionId));

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ category_id: newCategoryId })
        .eq('id', transactionId);

      if (error) throw error;

      // Always refresh to apply filters and remove if needed
      onUpdate();
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert('Error', 'Error al cambiar la categoría');
      // Revert optimistic update on error
      if (onTransactionUpdate && oldCategoryId) {
        onTransactionUpdate(transactionId, { category_id: oldCategoryId });
      }
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(transactionId);
        return next;
      });
    }
  };

  const handleEditNote = (transaction: Transaction) => {
    setEditingNoteId(transaction.id);
    setEditingNoteValue(transaction.notes || '');
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setEditingNoteValue('');
  };

  const handleSaveNote = async (transactionId: string) => {
    if (updatingIds.has(transactionId)) return;

    const oldNote = transactions.find(t => t.id === transactionId)?.notes;
    const newNote = editingNoteValue || null;

    // Optimistic update
    if (onTransactionUpdate) {
      onTransactionUpdate(transactionId, { notes: newNote });
    }

    setUpdatingIds(prev => new Set(prev).add(transactionId));

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ notes: newNote })
        .eq('id', transactionId);

      if (error) throw error;

      setEditingNoteId(null);
      setEditingNoteValue('');

      // Only fetch if no optimistic update
      if (!onTransactionUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating note:', error);
      showAlert('Error', 'Error al actualizar la nota');
      // Revert optimistic update on error
      if (onTransactionUpdate) {
        onTransactionUpdate(transactionId, { notes: oldNote });
      }
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(transactionId);
        return next;
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(displayedTransactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = async () => {
    setShowBulkDeleteConfirm(false);
    setIsDeleting(true);

    try {
      if (selectedIds.size === 0) {
        throw new Error('No hay transacciones seleccionadas');
      }

      const idsToDelete = Array.from(selectedIds);

      // Try bulk delete with Promise.all for parallel execution
      const deletePromises = idsToDelete.map(id =>
        supabase
          .from('transactions')
          .delete()
          .eq('id', id)
      );

      const results = await Promise.all(deletePromises);

      // Check for errors
      const errors = results.filter(r => r.error);
      const successCount = results.length - errors.length;

      if (errors.length > 0) {
        console.error('Some deletes failed:', errors);
      }

      // Success
      setSelectedIds(new Set());

      if (errors.length > 0) {
        showAlert(
          'Eliminación parcial',
          `${successCount} eliminadas correctamente, ${errors.length} fallaron`,
          'info'
        );
      } else {
        showAlert('Éxito', `${successCount} transacción(es) eliminada(s) correctamente`, 'success');
      }

      onUpdate();
    } catch (error) {
      console.error('Error deleting transactions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar las transacciones';
      showAlert('Error al eliminar', errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkHide = async () => {
    if (selectedIds.size === 0) return;

    try {
      const idsToHide = Array.from(selectedIds);

      // Update all selected transactions to is_ignored = true
      const hidePromises = idsToHide.map(id =>
        supabase
          .from('transactions')
          .update({ is_ignored: true })
          .eq('id', id)
      );

      const results = await Promise.all(hidePromises);

      // Check for errors
      const errors = results.filter(r => r.error);
      const successCount = results.length - errors.length;

      if (errors.length > 0) {
        console.error('Some hides failed:', errors);
      }

      // Success
      setSelectedIds(new Set());

      if (errors.length > 0) {
        showAlert(
          'Ocultación parcial',
          `${successCount} ocultadas correctamente, ${errors.length} fallaron`,
          'info'
        );
      } else {
        showAlert('Éxito', `${successCount} transacción(es) ocultada(s) correctamente`, 'success');
      }

      onUpdate();
    } catch (error) {
      console.error('Error hiding transactions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al ocultar las transacciones';
      showAlert('Error al ocultar', errorMessage);
    }
  };

  const handleBulkShow = async () => {
    if (selectedIds.size === 0) return;

    try {
      const idsToShow = Array.from(selectedIds);

      // Update all selected transactions to is_ignored = false
      const showPromises = idsToShow.map(id =>
        supabase
          .from('transactions')
          .update({ is_ignored: false })
          .eq('id', id)
      );

      const results = await Promise.all(showPromises);

      // Check for errors
      const errors = results.filter(r => r.error);
      const successCount = results.length - errors.length;

      if (errors.length > 0) {
        console.error('Some shows failed:', errors);
      }

      // Success
      setSelectedIds(new Set());

      if (errors.length > 0) {
        showAlert(
          'Mostrar parcial',
          `${successCount} mostradas correctamente, ${errors.length} fallaron`,
          'info'
        );
      } else {
        showAlert('Éxito', `${successCount} transacción(es) mostrada(s) correctamente`, 'success');
      }

      onUpdate();
    } catch (error) {
      console.error('Error showing transactions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al mostrar las transacciones';
      showAlert('Error al mostrar', errorMessage);
    }
  };

  let displayedTransactions = showIgnored
    ? transactions
    : transactions.filter(t => !t.is_ignored);

  // Apply sorting if active
  if (sortOrder !== 'none') {
    displayedTransactions = [...displayedTransactions].sort((a, b) => {
      const amountA = convertCurrency(a.amount, a.currency, displayCurrency);
      const amountB = convertCurrency(b.amount, b.currency, displayCurrency);
      return sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
    });
  }

  if (displayedTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium mb-1">
          {showIgnored ? 'No hay transacciones ignoradas' : 'No hay transacciones para mostrar'}
        </p>
        <p className="text-xs text-muted-foreground">
          {showIgnored ? 'Las transacciones ignoradas apareceran aqui' : 'Importa un extracto bancario para comenzar'}
        </p>
      </div>
    );
  }

  const allSelected = displayedTransactions.length > 0 && selectedIds.size === displayedTransactions.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < displayedTransactions.length;

  return (
    <div className="space-y-2">
      {/* Premium Bulk Action Bar */}
      {selectedIds.size > 0 && !isEditMode && (
        <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 border border-primary/20 shrink-0">
            <Check className="h-3 w-3 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-foreground">
              {selectedIds.size} seleccionada{selectedIds.size !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Hide/Show Button */}
          {showIgnored ? (
            <Button
              variant="outline"
              onClick={handleBulkShow}
              size="sm"
              className="h-6 px-2 flex items-center gap-1 shrink-0 text-[10px] border-success/50 text-success hover:bg-success/10"
            >
              <Eye className="h-3 w-3" />
              Mostrar
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleBulkHide}
              size="sm"
              className="h-6 px-2 flex items-center gap-1 shrink-0 text-[10px] border-warning/50 text-warning hover:bg-warning/10"
            >
              <EyeOff className="h-3 w-3" />
              Ocultar
            </Button>
          )}

          {/* Delete Button */}
          <Button
            variant="error"
            onClick={handleBulkDeleteClick}
            disabled={isDeleting}
            size="sm"
            className="h-6 px-2 flex items-center gap-1 shrink-0 text-[10px]"
          >
            <Trash className="h-3 w-3" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {displayedTransactions.map((tx) => {
          const isUpdating = updatingIds.has(tx.id);
          const isSelected = selectedIds.has(tx.id);

          return (
            <div
              key={tx.id}
              className={`
                rounded-lg border transition-all p-4 space-y-3
                ${tx.is_ignored ? 'opacity-60 border-border/50' : 'border-border'}
                ${isSelected ? 'bg-primary/5 border-primary' : 'bg-card'}
              `}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">{tx.vendor}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrencyWithSymbol(
                      convertCurrency(tx.amount, tx.currency, displayCurrency),
                      displayCurrency
                    )}
                  </div>
                  <Badge variant={tx.type === 'income' ? 'success' : 'error'} className="text-[10px]">
                    {tx.type === 'income' ? '↑' : '↓'}
                  </Badge>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                {isEditMode ? (
                  <input
                    type="text"
                    list={`categories-datalist-${tx.id}`}
                    value={
                      categorySearchText.get(tx.id) !== undefined
                        ? categorySearchText.get(tx.id)
                        : editedData.get(tx.id)?.category_id
                          ? categories.find(c => c.id === editedData.get(tx.id)?.category_id)?.name || ''
                          : tx.category?.name || ''
                    }
                    onChange={(e) => handleCategoryTextChange(tx.id, e.target.value)}
                    className="flex-1 px-2 py-1 rounded border border-blue-500 bg-blue-500/5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Categoría..."
                  />
                ) : (
                  <button
                    ref={(el) => {
                      if (el) categoryButtonRefs.current.set(tx.id, el);
                      else categoryButtonRefs.current.delete(tx.id);
                    }}
                    onClick={() => handleToggleCategoryDropdown(tx.id)}
                    disabled={isUpdating}
                    className="flex-1 flex items-center gap-2 px-2 py-1 rounded border border-border hover:border-primary/50 transition-all text-xs"
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: tx.category?.color || '#64748b' }} />
                    <span className="flex-1 text-left" style={{ color: tx.category?.color || '#64748b' }}>
                      {tx.category?.name || 'Sin categoría'}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Notes */}
              {(tx.notes || isEditMode) && (
                <div className="flex items-start gap-2 text-xs">
                  <StickyNote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedData.get(tx.id)?.notes !== undefined ? editedData.get(tx.id)?.notes : (tx.notes || '')}
                      onChange={(e) => handleNotesChange(tx.id, e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-blue-500 bg-blue-500/5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Nota..."
                    />
                  ) : (
                    <span className="flex-1 text-muted-foreground">{tx.notes}</span>
                  )}
                </div>
              )}

              {/* Actions */}
              {!isEditMode && (
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectOne(tx.id, e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleIgnore(tx)}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0"
                    >
                      {tx.is_ignored ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tx)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tx.id)}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border/50 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-muted/50 via-muted/30 to-transparent border-b border-border">
              <th className="text-center py-2.5 px-2 w-[35px]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={isEditMode}
                  className="h-3 w-3 rounded border-border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </th>
              <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                Fecha
              </th>
              <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                Vendor
              </th>
              <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider min-w-[110px]">
                Categoría
              </th>
              <th className="text-left py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider min-w-[140px]">
                Notas
              </th>
              <th className="text-right py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                <button
                  onClick={handleToggleSort}
                  className="flex items-center gap-0.5 ml-auto cursor-pointer hover:text-foreground transition-colors"
                  title="Ordenar por monto"
                >
                  Monto
                  {sortOrder === 'none' && <ArrowUpDown className="h-2.5 w-2.5" />}
                  {sortOrder === 'desc' && <ArrowDown className="h-2.5 w-2.5 text-primary" />}
                  {sortOrder === 'asc' && <ArrowUp className="h-2.5 w-2.5 text-primary" />}
                </button>
              </th>
              <th className="text-center py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider w-[60px]">
                Tipo
              </th>
              <th className="text-center py-2.5 px-3 text-[10px] font-bold text-foreground/70 uppercase tracking-wider w-[90px]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((tx) => {
              const isUpdating = updatingIds.has(tx.id);
              const txCategories = categories;
              const isSelected = selectedIds.has(tx.id);

              return (
                <tr
                  key={tx.id}
                  className={`
                    group border-b border-border/30 transition-all duration-200
                    ${tx.is_ignored ? 'opacity-50' : ''}
                    ${isSelected
                      ? 'bg-gradient-to-r from-primary/15 via-primary/5 to-transparent'
                      : 'hover:bg-gradient-to-r hover:from-muted/40 hover:via-muted/20 hover:to-transparent'
                    }
                  `}
                >
                  <td className="py-2 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(tx.id, e.target.checked)}
                      disabled={isEditMode}
                      className="h-3 w-3 rounded border-border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <div className="text-[11px] font-medium text-foreground">
                      {new Date(tx.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <div className="text-[11px] font-semibold text-foreground break-words max-w-[200px]">
                      {tx.vendor}
                    </div>
                  </td>

                  <td className="py-2 px-3 relative">
                    {isEditMode ? (
                      <>
                        <input
                          type="text"
                          list={`categories-datalist-${tx.id}`}
                          value={
                            categorySearchText.get(tx.id) !== undefined
                              ? categorySearchText.get(tx.id)
                              : editedData.get(tx.id)?.category_id
                                ? categories.find(c => c.id === editedData.get(tx.id)?.category_id)?.name || ''
                                : tx.category?.name || ''
                          }
                          onChange={(e) => handleCategoryTextChange(tx.id, e.target.value)}
                          className="w-full px-1.5 py-0.5 rounded border border-blue-500 bg-blue-500/5 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Categoría..."
                          autoComplete="off"
                        />
                        <datalist id={`categories-datalist-${tx.id}`}>
                          {txCategories.map(category => (
                            <option key={category.id} value={category.name} />
                          ))}
                        </datalist>
                      </>
                    ) : (
                      <>
                        <button
                          ref={(el) => {
                            if (el) categoryButtonRefs.current.set(tx.id, el);
                            else categoryButtonRefs.current.delete(tx.id);
                          }}
                          onClick={() => handleToggleCategoryDropdown(tx.id)}
                          disabled={isUpdating}
                          className={`flex items-center justify-between w-full px-1.5 py-0.5 rounded border transition-all text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                            openCategoryDropdown === tx.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-background/50 hover:bg-background hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className="h-2 w-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: tx.category?.color || '#64748b' }}
                            />
                            <span className="text-[11px] truncate" style={{ color: tx.category?.color || '#64748b' }}>
                              {tx.category?.name || 'Sin cat.'}
                            </span>
                          </div>
                          <ChevronDown className={`h-2.5 w-2.5 text-muted-foreground transition-transform ${openCategoryDropdown === tx.id ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {openCategoryDropdown === tx.id && (
                          <>
                            {/* Backdrop to close */}
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenCategoryDropdown(null)}
                            />

                            {/* Dropdown content */}
                            <div
                              className="fixed w-56 bg-card border border-border rounded-lg shadow-xl z-50 p-2"
                              style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                              }}
                            >
                              {/* Search input */}
                              <div className="relative mb-2">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <input
                                  type="text"
                                  value={dropdownSearchText}
                                  onChange={(e) => setDropdownSearchText(e.target.value)}
                                  placeholder="Buscar categoría..."
                                  className="w-full pl-7 pr-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                  autoFocus
                                />
                              </div>

                              {/* Categories list */}
                              <div className="max-h-64 overflow-y-auto">
                                {(() => {
                                  const filteredCategories = txCategories.filter(category =>
                                    category.name.toLowerCase().includes(dropdownSearchText.toLowerCase())
                                  );

                                  if (filteredCategories.length === 0) {
                                    return (
                                      <p className="text-xs text-muted-foreground text-center py-3">
                                        No se encontraron categorías
                                      </p>
                                    );
                                  }

                                  return filteredCategories.map(category => (
                                    <button
                                      key={category.id}
                                      onClick={() => handleQuickCategoryChange(tx.id, category.id)}
                                      className={`w-full flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-all text-left ${
                                        tx.category_id === category.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                                      }`}
                                    >
                                      <div
                                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: category.color }}
                                      />
                                      <span className="text-xs flex-1 truncate">{category.name}</span>
                                      {tx.category_id === category.id && (
                                        <Check className="h-3 w-3 text-primary" />
                                      )}
                                    </button>
                                  ));
                                })()}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </td>

                  <td className="py-2 px-3">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedData.get(tx.id)?.notes !== undefined ? editedData.get(tx.id)?.notes : (tx.notes || '')}
                        onChange={(e) => handleNotesChange(tx.id, e.target.value)}
                        className="w-full text-[11px] px-1.5 py-0.5 rounded border border-blue-500 bg-blue-500/5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Nota..."
                      />
                    ) : editingNoteId === tx.id ? (
                      <div className="flex items-center gap-0.5">
                        <input
                          type="text"
                          value={editingNoteValue}
                          onChange={(e) => setEditingNoteValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveNote(tx.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEditNote();
                            }
                          }}
                          className="flex-1 text-[11px] px-1.5 py-0.5 rounded border border-primary bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Nota..."
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          className="h-5 w-5 p-0 hover:bg-green-500/10"
                          onClick={() => handleSaveNote(tx.id)}
                          disabled={isUpdating}
                        >
                          <Check className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-5 w-5 p-0 hover:bg-red-500/10"
                          onClick={handleCancelEditNote}
                          disabled={isUpdating}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 group/note">
                        <div
                          className="flex-1 text-[11px] text-foreground break-words min-h-[16px] cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
                          onDoubleClick={() => handleEditNote(tx)}
                          title="Doble clic para editar"
                        >
                          {tx.notes || <span className="text-muted-foreground italic text-[10px]">-</span>}
                        </div>
                        <Button
                          variant="ghost"
                          className="h-5 w-5 p-0 opacity-0 group-hover/note:opacity-100 hover:bg-blue-500/10 transition-all"
                          onClick={() => handleEditNote(tx)}
                          title="Editar nota"
                        >
                          <StickyNote className="h-2.5 w-2.5 text-blue-600" />
                        </Button>
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-3 text-right">
                    <div className={`text-[11px] font-bold ${
                      tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrencyWithSymbol(
                        convertCurrency(tx.amount, tx.currency, displayCurrency),
                        displayCurrency
                      )}
                    </div>
                    {tx.currency !== displayCurrency && (
                      <div className="text-[9px] text-muted-foreground">
                        {formatCurrency(tx.amount)} {tx.currency}
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Badge
                        variant={tx.type === 'income' ? 'success' : 'error'}
                        className="text-[9px] font-semibold px-1 py-0"
                      >
                        {tx.type === 'income' ? '↑' : '↓'}
                      </Badge>
                      {tx.is_manually_verified && (
                        <span className="text-green-600 dark:text-green-400 text-[10px] font-bold" title="Verificado">✓</span>
                      )}
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex items-center justify-center gap-1">
                      {isEditMode ? (
                        <div className="text-[9px] text-muted-foreground italic">
                          Editando
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleIgnore(tx)}
                            disabled={isUpdating}
                            title={tx.is_ignored ? 'Incluir' : 'Ignorar'}
                            className="h-6 w-6 p-0 hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-600"
                          >
                            {tx.is_ignored ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(tx)}
                            title="Editar"
                            className="h-6 w-6 p-0 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(tx.id)}
                            title="Eliminar"
                            className="h-6 w-6 p-0 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Eliminar transacciones"
        message={`¿Estás seguro de eliminar ${selectedIds.size} transacciones?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Quick Category Modal */}
      <QuickCategoryModal
        isOpen={showQuickCategoryModal}
        onClose={() => setShowQuickCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
        initialType="expense"
      />
    </div>
  );
}
