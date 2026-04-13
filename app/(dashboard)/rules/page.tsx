'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Check, X, Zap, FileText, DollarSign, Hash, Power, PowerOff, Trash, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/contexts/toast-context';
import { InsightCard } from '@/components/ui/insight-card';
import { SkeletonTable, SkeletonMetricCard } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickCategoryModal } from '@/components/upload/QuickCategoryModal';
import { analytics } from '@/components/analytics/google-analytics';

type RuleType = 'vendor_contains' | 'description_contains' | 'vendor_equals' | 'amount_greater' | 'amount_less' | 'amount_equals';

interface CategorizationRule {
  id: string;
  category_id: string;
  rule_type: RuleType;
  match_value: string;
  is_active: boolean;
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
}

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  vendor_contains: 'Concepto contiene',
  description_contains: 'Descripción contiene',
  vendor_equals: 'Concepto exacto',
  amount_greater: 'Monto mayor a',
  amount_less: 'Monto menor a',
  amount_equals: 'Monto igual a',
};

const RULE_TYPE_ICONS: Record<RuleType, typeof Zap> = {
  vendor_contains: Zap,
  description_contains: FileText,
  vendor_equals: Hash,
  amount_greater: DollarSign,
  amount_less: DollarSign,
  amount_equals: DollarSign,
};


export default function RulesPage() {
  const [rules, setRules] = useState<CategorizationRule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<CategorizationRule | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryDropdownPosition, setCategoryDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [categorySearchText, setCategorySearchText] = useState('');
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category_id: '',
    rule_type: 'vendor_contains' as RuleType,
    match_value: '',
  });

  // Multi-value state
  const [matchValues, setMatchValues] = useState<string[]>(['']);

  const supabase = createClient();
  const toast = useToast();
  const categoryDropdownButtonRef = useRef<HTMLButtonElement>(null);

  const handleCategoryDropdownToggle = () => {
    if (!showCategoryDropdown && categoryDropdownButtonRef.current) {
      const rect = categoryDropdownButtonRef.current.getBoundingClientRect();
      setCategoryDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
    setShowCategoryDropdown(!showCategoryDropdown);
    setCategorySearchText('');
  };

  const handleCategoryCreated = (category: { id: string; name: string; color: string }) => {
    // Add the new category to the list
    setCategories(prev => [...prev, category]);
    // Select the newly created category
    setFormData(prev => ({ ...prev, category_id: category.id }));
    // Close the dropdown
    setShowCategoryDropdown(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      setCategories(categoriesData || []);

      // Fetch rules with category info
      const { data: rulesData } = await supabase
        .from('categorization_rules')
        .select(`
          *,
          category:categories(id, name, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      setRules(rulesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('No hay usuario autenticado');
        return;
      }

      // Validate form data
      if (!formData.category_id) {
        toast.warning('Por favor selecciona una categoría');
        return;
      }

      // Combine match values into comma-separated string
      const combinedMatchValue = matchValues
        .map(v => v.trim())
        .filter(v => v)
        .join(',');

      if (!combinedMatchValue) {
        toast.warning('Por favor ingresa al menos un valor para la regla');
        return;
      }

      if (editingRule) {
        // Update existing rule
        const { error } = await supabase
          .from('categorization_rules')
          .update({
            category_id: formData.category_id,
            rule_type: formData.rule_type,
            match_value: combinedMatchValue,
          })
          .eq('id', editingRule.id);

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Error al actualizar: ${error.message || JSON.stringify(error)}`);
        }
      } else {
        // Create new rule
        const { error } = await supabase
          .from('categorization_rules')
          .insert({
            user_id: user.id,
            category_id: formData.category_id,
            rule_type: formData.rule_type,
            match_value: combinedMatchValue,
            is_active: true,
          });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Error al crear: ${error.message || JSON.stringify(error)}`);
        }

        const ruleType = formData.rule_type.startsWith('amount') ? 'amount' :
                         formData.rule_type.includes('vendor') ? 'vendor' : 'combined';
        analytics.createRule(ruleType as 'vendor' | 'amount' | 'combined');
      }

      // Reset form
      setFormData({
        category_id: '',
        rule_type: 'vendor_contains',
        match_value: '',
      });
      setMatchValues(['']);
      setShowForm(false);
      setEditingRule(null);
      fetchData();

      toast.success(
        editingRule ? 'Regla actualizada correctamente' : 'Regla creada correctamente',
        editingRule ? 'Actualización exitosa' : 'Regla creada'
      );
    } catch (error) {
      console.error('Error saving rule:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar la regla';
      toast.error(errorMessage, 'Error al guardar');
    }
  };

  const handleEdit = (rule: CategorizationRule) => {
    setEditingRule(rule);
    setFormData({
      category_id: rule.category_id,
      rule_type: rule.rule_type,
      match_value: rule.match_value,
    });
    // Split match_value into array for multi-value editing
    const values = rule.match_value.split(',').map(v => v.trim()).filter(v => v);
    setMatchValues(values.length > 0 ? values : ['']);
    setShowForm(true);
  };

  const addMatchValue = () => {
    setMatchValues([...matchValues, '']);
  };

  const removeMatchValue = (index: number) => {
    if (matchValues.length > 1) {
      setMatchValues(matchValues.filter((_, i) => i !== index));
    }
  };

  const updateMatchValue = (index: number, value: string) => {
    const updated = [...matchValues];
    updated[index] = value;
    setMatchValues(updated);
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;

    try {
      const { error } = await supabase
        .from('categorization_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      fetchData();
      toast.success('Regla eliminada correctamente');
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Error al eliminar la regla');
    }
  };

  const handleDeleteAll = async () => {
    if (deleteAllConfirm !== 'ELIMINAR') {
      toast.warning('Por favor escribe "ELIMINAR" para confirmar');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('categorization_rules')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setShowDeleteAllModal(false);
      setDeleteAllConfirm('');
      fetchData();
      toast.success(`Se eliminaron ${rules.length} reglas correctamente`, 'Reglas eliminadas');
    } catch (error) {
      console.error('Error deleting all rules:', error);
      toast.error('Error al eliminar las reglas');
    }
  };

  const toggleActive = async (rule: CategorizationRule) => {
    try {
      const { error } = await supabase
        .from('categorization_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', rule.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingRule(null);
    setFormData({
      category_id: '',
      rule_type: 'vendor_contains',
      match_value: '',
    });
    setMatchValues(['']);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted skeleton-pulse rounded" />
            <div className="h-4 w-96 bg-muted skeleton-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted skeleton-pulse rounded" />
            <div className="h-10 w-32 bg-muted skeleton-pulse rounded" />
          </div>
        </div>

        {/* Info card skeleton */}
        <SkeletonMetricCard />

        {/* Rules table skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-muted skeleton-pulse rounded" />
          <SkeletonTable rows={5} columns={5} />
        </div>
      </div>
    );
  }

  // Calculate insights
  const activeRulesCount = rules.filter(r => r.is_active).length;
  const inactiveRulesCount = rules.length - activeRulesCount;
  const categoriesWithRules = new Set(rules.map(r => r.category_id)).size;
  const coveragePercentage = categories.length > 0
    ? Math.round((categoriesWithRules / categories.length) * 100)
    : 0;
  const inactivePercentage = rules.length > 0
    ? Math.round((inactiveRulesCount / rules.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reglas de Categorización</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define reglas automáticas para categorizar transacciones sin usar IA
          </p>
        </div>
        <div className="flex gap-2">
          {rules.length > 0 && (
            <Button
              onClick={() => setShowDeleteAllModal(true)}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
            >
              <Trash className="h-4 w-4" />
              Eliminar Todas
            </Button>
          )}
          <Button
            onClick={() => {
              setMatchValues(['']);
              setShowForm(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Regla
          </Button>
        </div>
      </div>

      {/* Insight Cards */}
      {rules.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Inactive Rules Warning */}
          {inactivePercentage > 30 && (
            <InsightCard
              type="warning"
              title="Reglas inactivas detectadas"
              description={`Tienes ${inactiveRulesCount} reglas inactivas (${inactivePercentage}%). Considera activarlas o eliminarlas.`}
              metric={`${inactiveRulesCount}`}
            />
          )}
        </div>
      )}

      {/* No rules tip */}
      {rules.length === 0 && (
        <InsightCard
          type="info"
          title="Comienza con reglas automáticas"
          description="Las reglas te permiten categorizar transacciones automáticamente sin usar IA. Por ejemplo, todas las transacciones que contengan 'UBER' pueden ir a la categoría 'Transporte'."
          actionLabel="Crear primera regla"
          onAction={() => {
            setMatchValues(['']);
            setShowForm(true);
          }}
        />
      )}

      {/* Info Card - Compact */}
      <Card className="p-3 bg-muted/50 border-2">
        <div className="flex items-start gap-2 mb-2">
          <div className="p-1 bg-primary/10 rounded">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-xs">Cómo funcionan</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Automatiza la categorización
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex gap-1.5 items-start">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">1</span>
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Múltiples valores (OR):</span> Usa <strong>&quot;+&quot;</strong> para agregar más valores
              </p>
              <code className="inline-block mt-1 px-1.5 py-0.5 bg-muted border-2 border-border text-foreground rounded text-[9px] font-mono font-semibold shadow-sm">
                UBER + CABIFY + 99
              </code>
            </div>
          </div>

          <div className="flex gap-1.5 items-start">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">2</span>
            </span>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-foreground">Ejemplos:</p>
              <div className="flex flex-wrap gap-1 text-[9px]">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted border-2 border-border text-foreground rounded font-semibold shadow-sm">
                  UBER → Transporte
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted border-2 border-border text-foreground rounded font-semibold shadow-sm">
                  NETFLIX → Streaming
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted border-2 border-border text-foreground rounded font-semibold shadow-sm">
                  {'>'}50000 → Alquiler
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingRule ? 'Editar Regla' : 'Nueva Regla de Categorización'}
                </h2>
                <button
                  onClick={cancelForm}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tipo de regla */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Tipo de Regla
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(RULE_TYPE_LABELS).map(([value, label]) => {
                      const Icon = RULE_TYPE_ICONS[value as RuleType];
                      const isSelected = formData.rule_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, rule_type: value as RuleType })}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Valor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold">
                      Valor{matchValues.length > 1 ? 'es' : ''} de búsqueda
                    </label>
                    {!formData.rule_type.includes('amount') && matchValues.length > 1 && (
                      <span className="text-xs text-primary font-medium flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {matchValues.length} valores (OR)
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {matchValues.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateMatchValue(index, e.target.value)}
                          placeholder={
                            formData.rule_type.includes('amount')
                              ? 'Ej: 1000'
                              : index === 0 ? 'Ej: UBER' : 'Ej: CABIFY'
                          }
                          className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {matchValues.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMatchValue(index)}
                            className="px-3 hover:bg-error/10 hover:text-error hover:border-error"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {!formData.rule_type.includes('amount') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMatchValue}
                      className="mt-2 w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar otro valor (OR)
                    </Button>
                  )}

                  {!formData.rule_type.includes('amount') && matchValues.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1">
                      <Zap className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                      <span>La regla coincidirá si contiene <strong>cualquiera</strong> de estos valores</span>
                    </p>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Categoría de destino
                  </label>
                  <div className="relative">
                    <button
                      ref={categoryDropdownButtonRef}
                      type="button"
                      onClick={handleCategoryDropdownToggle}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all flex items-center justify-between hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-2">
                        {formData.category_id ? (
                          <>
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: categories.find(c => c.id === formData.category_id)?.color || '#8b5cf6'
                              }}
                            />
                            <span className="text-sm font-medium">
                              {categories.find(c => c.id === formData.category_id)?.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Seleccionar categoría...</span>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {showCategoryDropdown && categoryDropdownPosition && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowCategoryDropdown(false)}
                        />

                        {/* Dropdown content */}
                        <div
                          className="fixed bg-card border border-border rounded-lg shadow-xl z-50 p-2"
                          style={{
                            top: `${categoryDropdownPosition.top}px`,
                            left: `${categoryDropdownPosition.left}px`,
                            width: `${categoryDropdownPosition.width}px`
                          }}
                        >
                          {/* Search input */}
                          <div className="relative mb-2">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <input
                              type="text"
                              value={categorySearchText}
                              onChange={(e) => setCategorySearchText(e.target.value)}
                              placeholder="Buscar categoría..."
                              className="w-full pl-7 pr-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                          </div>

                          {/* Categories list */}
                          <div className="max-h-56 overflow-y-auto">
                            {(() => {
                              const filteredCategories = categories.filter(cat =>
                                cat.name.toLowerCase().includes(categorySearchText.toLowerCase())
                              );

                              if (filteredCategories.length === 0) {
                                return (
                                  <div className="px-4 py-3 text-center">
                                    <p className="text-xs text-muted-foreground">
                                      No se encontraron categorías
                                    </p>
                                  </div>
                                );
                              }

                              return filteredCategories.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, category_id: cat.id });
                                    setShowCategoryDropdown(false);
                                    setCategorySearchText('');
                                  }}
                                  className={`w-full px-2 py-1 flex items-center gap-2 hover:bg-muted/50 transition-colors text-left rounded ${
                                    formData.category_id === cat.id ? 'bg-primary/10' : ''
                                  }`}
                                >
                                  <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  <div className="flex-1">
                                    <div className="text-xs font-medium">{cat.name}</div>
                                  </div>
                                  {formData.category_id === cat.id && (
                                    <Check className="h-3 w-3 text-primary" />
                                  )}
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={cancelForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="min-w-[120px]">
                    <Check className="h-4 w-4 mr-2" />
                    {editingRule ? 'Actualizar' : 'Crear Regla'}
                  </Button>
                </div>
              </form>
            </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete All Modal */}
      <AnimatePresence>
        {showDeleteAllModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteAllModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-950 rounded-full">
                  <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Eliminar Todas las Reglas
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Estás a punto de eliminar <strong>{rules.length} reglas</strong>. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Escribe &ldquo;ELIMINAR&rdquo; para confirmar
                  </label>
                  <input
                    type="text"
                    value={deleteAllConfirm}
                    onChange={(e) => setDeleteAllConfirm(e.target.value)}
                    placeholder="ELIMINAR"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteAllModal(false);
                      setDeleteAllConfirm('');
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleDeleteAll}
                    disabled={deleteAllConfirm !== 'ELIMINAR'}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Eliminar Todo
                  </Button>
                </div>
              </div>
            </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Tus Reglas {rules.length > 0 && `(${rules.filter(r => r.is_active).length} activas)`}
          </h3>
          {rules.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {rules.length} {rules.length === 1 ? 'regla' : 'reglas'} en total
            </p>
          )}
        </div>

        {rules.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="inline-flex w-16 h-16 rounded-xl bg-primary/10 mb-4 items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tienes reglas aún
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Crea tu primera regla para automatizar la categorización de transacciones
              </p>
              <Button onClick={() => {
                setMatchValues(['']);
                setShowForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Regla
              </Button>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Tipo
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Condiciones
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Categoría
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rules.map((rule) => {
                  const RuleIcon = RULE_TYPE_ICONS[rule.rule_type];

                  return (
                    <tr
                      key={rule.id}
                      className={`group transition-colors ${
                        rule.is_active
                          ? 'hover:bg-accent/5'
                          : 'opacity-60 bg-muted/20'
                      }`}
                    >
                      {/* Tipo */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1 rounded-lg shrink-0"
                            style={{
                              backgroundColor: rule.category ? `${rule.category.color}15` : '#f3f4f6'
                            }}
                          >
                            <RuleIcon
                              className="h-3.5 w-3.5"
                              style={{ color: rule.category?.color || '#6b7280' }}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {RULE_TYPE_LABELS[rule.rule_type]}
                            </p>
                            {rule.match_value.includes(',') && (
                              <span className="text-[10px] text-primary font-medium">
                                {rule.match_value.split(',').length} valores
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Condiciones */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {rule.match_value.split(',').slice(0, 3).map((val, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono font-medium text-foreground"
                            >
                              {val.trim()}
                            </span>
                          ))}
                          {rule.match_value.split(',').length > 3 && (
                            <span className="text-[10px] text-muted-foreground font-medium">
                              +{rule.match_value.split(',').length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-2 px-3">
                        {rule.category && (
                          <div
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: `${rule.category.color}08`,
                              borderColor: `${rule.category.color}40`
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: rule.category.color }}
                            />
                            <span className="text-xs font-medium text-foreground">
                              {rule.category.name}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => toggleActive(rule)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                            rule.is_active
                              ? 'text-green-700 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-900/30 border border-green-500/30'
                              : 'text-gray-700 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-700/30 border border-gray-500/30'
                          }`}
                          title={rule.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {rule.is_active ? (
                            <>
                              <Power className="h-2.5 w-2.5" />
                              Activa
                            </>
                          ) : (
                            <>
                              <PowerOff className="h-2.5 w-2.5" />
                              Inactiva
                            </>
                          )}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                            className="h-6 w-6 p-0 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rule.id)}
                            className="h-6 w-6 p-0 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Category Modal */}
      <QuickCategoryModal
        isOpen={showQuickCategoryModal}
        onClose={() => setShowQuickCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
}
