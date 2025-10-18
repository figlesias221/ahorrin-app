'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Transaction, Category, TransactionFilters, BankStatement } from '@/types';
import { Plus, Filter, Search, Download, Eye, EyeOff, X, Edit2, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { TransactionsTableEnhanced } from '@/components/tables/transactions-table-enhanced';
import { TransactionModal } from '@/components/modals/transaction-modal';
import { TransactionFiltersPanel } from '@/components/filters/transaction-filters';
import { SkeletonTable } from '@/components/ui/skeleton';
import { useCurrency } from '@/contexts/currency-context';
import { convertCurrency, formatCurrencyWithSymbol } from '@/lib/utils/currency';
import { exportTransactionsToExcel } from '@/lib/utils/export';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<(Transaction & { category?: Category })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showIgnored, setShowIgnored] = useState(false);
  const [showUncategorized, setShowUncategorized] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'error' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Edit mode state for rendering button
  const [editModeState, setEditModeState] = useState<{
    isEditMode: boolean;
    editedCount: number;
    onToggleEditMode: () => void;
    onCancelAllChanges: () => void;
    onSaveAllChanges: () => void;
  } | null>(null);

  const handleEditModeChange = (props: {
    isEditMode: boolean;
    editedCount: number;
    onToggleEditMode: () => void;
    onCancelAllChanges: () => void;
    onSaveAllChanges: () => void;
  }) => {
    setEditModeState(props);
  };

  const supabase = createClient();
  const { displayCurrency } = useCurrency();

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  useEffect(() => {
    fetchCategories();
    fetchStatements();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, showIgnored, showUncategorized, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStatements = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_statements')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setStatements(data || []);
    } catch (error) {
      console.error('Error fetching statements:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // Get count of uncategorized transactions (independent of filters)
      const { count: uncatCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .is('category_id', null)
        .eq('is_ignored', false);

      setUncategorizedCount(uncatCount || 0);

      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: true });

      // Filter based on ignored status
      query = query.eq('is_ignored', showIgnored);

      // Filter uncategorized transactions
      if (showUncategorized) {
        query = query.is('category_id', null);
      }

      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom.toISOString().split('T')[0]);
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo.toISOString().split('T')[0]);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        query = query.in('category_id', filters.categoryIds);
      }
      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount);
      }
      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount);
      }
      if (filters.currencies && filters.currencies.length > 0) {
        query = query.in('currency', filters.currencies);
      }
      if (filters.statementId) {
        query = query.eq('statement_id', filters.statementId);
      }
      if (filters.banks && filters.banks.length > 0) {
        query = query.in('bank', filters.banks);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Apply search filter client-side
      let filtered = data || [];
      if (searchTerm) {
        filtered = filtered.filter((tx: any) =>
          tx.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTransactions(filtered);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', deleteTarget);

      if (error) throw error;

      setDeleteTarget(null);
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showAlert('Error al eliminar', 'Error al eliminar la transacción');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!deleting) {
      setDeleteTarget(null);
    }
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setShowDeleteAllModal(false);
      await fetchTransactions();
      showAlert('Éxito', 'Todas las transacciones han sido eliminadas', 'success');
    } catch (error) {
      console.error('Error deleting all transactions:', error);
      showAlert('Error al eliminar', 'No se pudieron eliminar todas las transacciones');
    } finally {
      setDeletingAll(false);
    }
  };

  const handleCancelDeleteAll = () => {
    if (!deletingAll) {
      setShowDeleteAllModal(false);
    }
  };

  const handleSave = async () => {
    setShowModal(false);
    await fetchTransactions();
  };

  const handleTransactionUpdate = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(tx =>
        tx.id === id ? { ...tx, ...updates } : tx
      )
    );
  };

  const handleExport = () => {
    try {
      exportTransactionsToExcel(transactions, 'transacciones_gasty');
      showAlert('Exportación exitosa', 'Las transacciones se han exportado correctamente', 'success');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      showAlert('Error al exportar', 'No se pudieron exportar las transacciones');
    }
  };

  // Calculate totals excluding ignored transactions with currency conversion
  const activeTransactions = transactions.filter((tx: any) => !tx.is_ignored);

  const totalIncome = activeTransactions
    .filter((tx: any) => tx.type === 'income')
    .reduce((sum, tx: any) => sum + convertCurrency(tx.amount, tx.currency || 'UYU', displayCurrency), 0);

  const totalExpenses = activeTransactions
    .filter((tx: any) => tx.type === 'expense')
    .reduce((sum, tx: any) => sum + convertCurrency(tx.amount, tx.currency || 'UYU', displayCurrency), 0);

  const ignoredCount = transactions.filter((tx: any) => tx.is_ignored).length;

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, showIgnored, showUncategorized, searchTerm]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between gap-4"
        initial="initial"
        animate="animate"
        variants={motionVariants.fadeIn}
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">Transacciones</h1>
          <p className="mt-1 text-sm text-muted-foreground hidden sm:block">
            Gestiona todas tus transacciones
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva Transacción</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </motion.div>

      {/* Search and Filters Bar */}
      <div className="bg-gradient-to-r from-card via-card/95 to-muted/10 rounded-xl border border-border/50 p-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap">
          {/* Search Input */}
          <div className="w-full sm:w-auto sm:flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por vendor o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border/50 bg-background/60 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all"
            />
          </div>

          {/* Separator */}
          <div className="hidden xl:block h-8 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

          {/* Filter Buttons Group */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {/* Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 h-9 px-3 relative transition-all ${
                showFilters ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold">Filtros</span>
              {Object.keys(filters).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
                  {Object.keys(filters).filter(key => {
                    const value = filters[key as keyof TransactionFilters];
                    return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);
                  }).length}
                </span>
              )}
            </Button>

            {/* Uncategorized Filter */}
            <Button
              variant={showUncategorized ? 'error' : 'outline'}
              size="sm"
              onClick={() => {
                setShowUncategorized(!showUncategorized);
                if (!showUncategorized) {
                  setFilters({});
                }
              }}
              className="flex items-center gap-1.5 h-9 px-2.5"
              title={showUncategorized ? 'Mostrar todas' : 'Sin categoría'}
            >
              <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
              <span className="text-xs font-semibold hidden sm:inline">Sin Categoría</span>
              <span className="text-xs font-semibold sm:hidden">Sin Cat.</span>
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-[10px] font-bold">
                {uncategorizedCount}
              </span>
            </Button>

            {/* Ignored Filter */}
            <Button
              variant={showIgnored ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowIgnored(!showIgnored)}
              className="flex items-center gap-1.5 h-9 px-2.5"
              title={showIgnored ? 'Ocultar ignorados' : 'Mostrar ignorados'}
            >
              {showIgnored ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="text-xs font-semibold hidden sm:inline">Ignorados</span>
              <span className="text-xs font-semibold sm:hidden">Ignor.</span>
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-[10px] font-bold">
                {ignoredCount}
              </span>
            </Button>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2 h-9 px-3"
              title="Exportar a Excel"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs font-semibold">Exportar</span>
            </Button>

            {/* Delete All Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAllClick}
              className="flex items-center gap-2 h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
              title="Eliminar todas las transacciones"
              disabled={transactions.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-xs font-semibold hidden lg:inline">Eliminar Todas</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="hidden xl:block h-8 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

          {/* Transaction Count */}
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-foreground/60">
              {transactions.length} <span className="font-medium">transacciones</span>
            </div>
          </div>

          {/* Spacer for alignment */}
          <div className="flex-1 hidden xl:block" />

          {/* Edit Mode Button */}
          {editModeState && (
            <div className="flex items-center gap-2">
              {editModeState.isEditMode ? (
                <>
                  <span className="text-xs font-semibold text-blue-600">
                    Editando {editModeState.editedCount > 0 && `(${editModeState.editedCount})`}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={editModeState.onCancelAllChanges}
                    className="h-9 px-3"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                    <span className="ml-1 text-xs">Cancelar</span>
                  </Button>
                  <Button
                    onClick={editModeState.onSaveAllChanges}
                    disabled={editModeState.editedCount === 0}
                    className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Check className="h-4 w-4" />
                    <span className="ml-1 text-xs">Guardar</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={editModeState.onToggleEditMode}
                  className="h-9 px-3"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="ml-2 text-xs font-semibold">Edición Masiva</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel with Animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'visible' }}
          >
            <TransactionFiltersPanel
              filters={filters}
              categories={categories}
              statements={statements}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Transactions Table */}
      <motion.div
        className="overflow-x-auto rounded-lg border border-border bg-card"
        initial="initial"
        animate="animate"
        variants={motionVariants.slideUp}
      >
        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={8} columns={7} />
          </div>
        ) : (
          <TransactionsTableEnhanced
            transactions={paginatedTransactions as any}
            categories={categories}
            onUpdate={fetchTransactions}
            onTransactionUpdate={handleTransactionUpdate as any}
            onEdit={handleEdit as any}
            onDelete={handleDeleteClick}
            showIgnored={showIgnored}
            onEditModeChange={handleEditModeChange}
          />
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <motion.div
          className="flex items-center justify-between gap-4 px-4 py-3 bg-card rounded-lg border border-border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {startIndex + 1}-{Math.min(endIndex, transactions.length)}
            </span>
            <span>de</span>
            <span className="font-medium text-foreground">{transactions.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                title="Primera página"
              >
                <span className="sr-only">Primera página</span>
                <span className="text-xs">‹‹</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                title="Página anterior"
              >
                <span className="sr-only">Página anterior</span>
                <span className="text-xs">‹</span>
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="h-8 w-8 p-0 hidden sm:flex"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {/* Current page indicator for mobile */}
                <div className="sm:hidden px-3 py-1 text-sm font-medium text-foreground">
                  {currentPage} / {totalPages}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                title="Página siguiente"
              >
                <span className="sr-only">Página siguiente</span>
                <span className="text-xs">›</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                title="Última página"
              >
                <span className="sr-only">Última página</span>
                <span className="text-xs">››</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar transacción"
        message="¿Estás seguro de eliminar esta transacción?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
      />

      {/* Delete All Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteAllModal}
        onClose={handleCancelDeleteAll}
        onConfirm={handleConfirmDeleteAll}
        title="Eliminar TODAS las transacciones"
        message={`⚠️ Esta acción eliminará permanentemente todas tus ${transactions.length} transacciones. Esta acción NO se puede deshacer. ¿Estás completamente seguro?`}
        confirmText="Sí, eliminar todas"
        cancelText="Cancelar"
        variant="danger"
        loading={deletingAll}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}
