'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Category, CategoryFormData } from '@/types';
import { Plus, Edit, Trash2, X, TrendingUp, DollarSign, Package, Sparkles, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { Select } from '@/components/ui/select';
import { SkeletonTable, SkeletonMetricCard } from '@/components/ui/skeleton';
import { getNextAvailableColor, getCategorySuggestions, type CategorySuggestion } from '@/lib/category-suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';

interface CategoryWithStats extends Category {
  transactionCount?: number;
  totalAmount?: number;
  expenseAmount?: number;
  incomeAmount?: number;
  inferredType?: 'expense' | 'income' | null;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3b82f6',
    isActive: true,
  });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'error' });
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const supabase = createClient();

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  useEffect(() => {
    fetchCategoriesWithStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategoriesWithStats = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch transaction stats for each category
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: stats } = await supabase
        .from('transactions')
        .select('category_id, amount, type')
        .eq('user_id', user.id)
        .eq('is_ignored', false);

      // Calculate stats per category
      const statsMap = new Map<string, { count: number; total: number; expense: number; income: number }>();
      (stats || []).forEach(t => {
        if (!t.category_id) return;
        const current = statsMap.get(t.category_id) || { count: 0, total: 0, expense: 0, income: 0 };
        current.count++;
        current.total += Number(t.amount);
        if (t.type === 'expense') current.expense += Number(t.amount);
        if (t.type === 'income') current.income += Number(t.amount);
        statsMap.set(t.category_id, current);
      });

      const categoriesWithStats = (categoriesData || []).map(cat => {
        const catStats = statsMap.get(cat.id) || { count: 0, total: 0, expense: 0, income: 0 };
        return {
          id: cat.id,
          userId: cat.user_id,
          name: cat.name,
          description: cat.description || undefined,
          color: cat.color,
          isActive: cat.is_active,
          createdAt: new Date(cat.created_at),
          updatedAt: new Date(cat.updated_at),
          transactionCount: catStats.count,
          totalAmount: catStats.total,
          expenseAmount: catStats.expense,
          incomeAmount: catStats.income,
          inferredType: catStats.expense > catStats.income ? 'expense' as const : catStats.income > 0 ? 'income' as const : null,
        };
      });

      setCategories(categoriesWithStats);
    } catch (error) {
      console.error('Error fetching categories:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      // Editing existing category
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
        isActive: category.isActive,
      });
      setShowSuggestions(false);
    } else {
      // Creating new category - get next available color
      setEditingCategory(null);
      const usedColors = categories.map(c => c.color);
      const nextColor = getNextAvailableColor(usedColors);

      setFormData({
        name: '',
        description: '',
        color: nextColor,
        isActive: true,
      });
      setSuggestions([...getCategorySuggestions('expense'), ...getCategorySuggestions('income')]);
      setShowSuggestions(true);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3b82f6', isActive: true });
    setShowSuggestions(true);
    setShowAllSuggestions(false);
  };


  const handleSuggestionClick = (suggestion: CategorySuggestion) => {
    setFormData(prev => ({ ...prev, name: suggestion.name }));
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No hay usuario autenticado');

      if (!formData.name.trim()) {
        showAlert('Campo requerido', 'El nombre de la categoría es obligatorio');
        return;
      }

      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name.trim(),
            description: formData.description?.trim() || null,
            color: formData.color,
            is_active: formData.isActive,
          })
          .eq('id', editingCategory.id);

        if (error) {
          console.error('Error updating category:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          if (error.code === '23505') {
            throw new Error('Ya existe una categoría con ese nombre dentro de esta categoría padre');
          }
          throw new Error(error.message || 'Error al actualizar categoría');
        }
      } else {
        // Create
        const { error } = await supabase.from('categories').insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description?.trim() || null,
          color: formData.color,
          is_active: formData.isActive,
        });

        if (error) {
          console.error('Error creating category:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          if (error.code === '23505') {
            throw new Error('Ya existe una categoría con ese nombre dentro de esta categoría padre');
          }
          throw new Error(error.message || 'Error al crear categoría');
        }
      }

      handleCloseModal();
      await fetchCategoriesWithStats();
    } catch (error) {
      console.error('Error saving category:', error);
      const message = error instanceof Error ? error.message : 'Error al guardar categoría';
      showAlert('Error', message);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        console.error('Error deleting category:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(error.message || 'Error al eliminar categoría');
      }

      setDeleteTarget(null);
      await fetchCategoriesWithStats();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar categoría';
      showAlert('Error al eliminar', message);
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

  const activeCategories = categories;
  const totalTransactions = activeCategories.reduce((sum, cat) => sum + (cat.transactionCount || 0), 0);
  const totalAmount = activeCategories.reduce((sum, cat) => sum + (cat.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organiza y gestiona tus categorías de transacciones
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonMetricCard />
          <SkeletonMetricCard />
          <SkeletonMetricCard />
        </div>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={motionVariants.staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={motionVariants.staggerItem}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Categorías</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={motionVariants.staggerItem}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Transacciones</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={motionVariants.staggerItem}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Monto Total</p>
                  <p className="text-2xl font-bold">${totalAmount.toLocaleString('es-UY')}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}


      {/* Categories Table */}
      {loading ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border bg-card p-4">
            <SkeletonTable rows={8} columns={6} />
          </div>
        </div>
      ) : activeCategories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera categoría para organizar tus transacciones
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Categoría
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          className="overflow-x-auto rounded-lg border border-border bg-card"
          initial="initial"
          animate="animate"
          variants={motionVariants.fadeIn}
        >
          <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Categoría
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[250px]">
                    Descripción
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[90px]">
                    Estado
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[100px]">
                    Transacciones
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[130px]">
                    Total
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[90px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={motionVariants.staggerContainer}
                initial="initial"
                animate="animate"
              >
                {activeCategories.map((category) => (
                  <motion.tr
                    key={category.id}
                    variants={motionVariants.staggerItem}
                    className="group border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    {/* Category Name with Color Indicator */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 border-2"
                          style={{
                            backgroundColor: `${category.color}20`,
                            borderColor: category.color,
                          }}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {category.name}
                          </span>
                          {category.inferredType && category.transactionCount > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              category.inferredType === 'expense'
                                ? 'bg-red-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {category.inferredType === 'expense' ? 'Gasto' : 'Ingreso'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                      {/* Description */}
                      <td className="py-2 px-3">
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {category.description || <span className="italic">—</span>}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 text-center">
                        <Badge
                          variant={category.isActive ? 'success' : 'default'}
                          className="text-[10px] font-medium px-2 py-0.5"
                        >
                          {category.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>

                      {/* Transaction Count */}
                      <td className="py-2 px-3 text-right">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {category.transactionCount || 0}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-2 px-3 text-right">
                        <span className="text-sm font-bold text-foreground">
                          ${(category.totalAmount || 0).toLocaleString('es-UY')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/categories/${category.id}`)}
                            className="h-7 w-7 p-0 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600"
                            title="Ver detalle"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(category)}
                            className="h-7 w-7 p-0 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(category.id, category.name)}
                            className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                }
              </motion.tbody>
            </table>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              // Close modal if clicking the backdrop
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg max-h-[calc(100vh-8rem)] overflow-y-auto"
            >
              <Card className="p-5 shadow-2xl backdrop-blur-sm bg-card/95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  {editingCategory ? (
                    <Edit className="h-5 w-5 text-foreground" />
                  ) : (
                    <Plus className="h-5 w-5 text-foreground" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (!e.target.value && !showSuggestions) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Ej: Supermercado, Salario, etc."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  autoFocus
                />

                {/* Category Suggestions */}
                {showSuggestions && !formData.name && !editingCategory && suggestions.length > 0 && (
                  <div className="mt-3 bg-gradient-to-br from-muted/50 via-muted/30 to-transparent rounded-lg border border-border/50 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                      className="w-full p-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                          Categorías Sugeridas
                        </span>
                      </div>
                      {suggestionsExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {suggestionsExpanded && (
                      <div className="px-3 pb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(showAllSuggestions ? suggestions : suggestions.slice(0, 12)).map((suggestion) => (
                            <button
                              key={suggestion.name}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-background/80 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all border border-border/50 shadow-sm"
                              title={suggestion.description}
                            >
                              {suggestion.name}
                            </button>
                          ))}
                        </div>
                        {suggestions.length > 12 && (
                          <button
                            type="button"
                            onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                            className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            {showAllSuggestions ? (
                              <>Mostrar menos</>
                            ) : (
                              <>Mostrar {suggestions.length - 12} más</>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Descripción (opcional)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Gastos relacionados con el supermercado, comida y productos del hogar"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <div
                    className="w-10 h-10 rounded-md border-2 flex items-center justify-center shadow-sm flex-shrink-0"
                    style={{
                      backgroundColor: `${formData.color}20`,
                      borderColor: formData.color
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: formData.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                size="lg"
                className="flex-1 h-10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                variant="primary"
                size="lg"
                className="flex-1 h-10"
              >
                {editingCategory ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Categoría
                  </>
                )}
              </Button>
            </div>
          </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoría"
        message={`¿Estás seguro de eliminar la categoría "${deleteTarget?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
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
