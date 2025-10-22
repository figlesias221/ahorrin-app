'use client';

import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

interface QuickRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleCreated: () => void;
  vendor: string;
  categories: Array<{ id: string; name: string; color: string; parentId?: string | null }>;
  selectedCategoryId?: string | null;
}

export function QuickRuleModal({
  isOpen,
  onClose,
  onRuleCreated,
  vendor,
  categories,
  selectedCategoryId,
}: QuickRuleModalProps) {
  const [formData, setFormData] = useState<{
    category_id: string;
    rule_type: 'vendor_contains' | 'description_contains' | 'vendor_equals' | 'amount_greater' | 'amount_less' | 'amount_equals';
    match_value: string;
  }>({
    category_id: selectedCategoryId || '',
    rule_type: 'vendor_contains',
    match_value: vendor,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Update form data when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      console.log('QuickRuleModal abierto con:', { vendor, selectedCategoryId, categoriesCount: categories.length });
      setFormData({
        category_id: selectedCategoryId || '',
        rule_type: 'vendor_contains',
        match_value: vendor,
      });
      setError(null);
    }
  }, [isOpen, vendor, selectedCategoryId, categories.length]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('Intentando guardar regla:', formData);

    if (!formData.category_id) {
      setError('Debes seleccionar una categoría');
      return;
    }

    if (!formData.match_value.trim()) {
      setError('El valor de búsqueda es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const insertData = {
        user_id: user.id,
        category_id: formData.category_id,
        rule_type: formData.rule_type,
        match_value: formData.match_value.trim(),
        is_active: true,
      };
      
      console.log('Insertando regla en DB:', insertData);

      const { error: insertError } = await supabase
        .from('categorization_rules')
        .insert(insertData);

      if (insertError) {
        console.error('Error creating rule:', insertError);
        throw insertError;
      }

      console.log('Regla creada exitosamente!');
      onRuleCreated();
      onClose();
    } catch (err) {
      console.error('Error saving rule:', err);
      const message = err instanceof Error ? err.message : 'Error al guardar regla';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    console.log('QuickRuleModal: Modal cerrado, isOpen =', isOpen);
    return null;
  }

  console.log('QuickRuleModal: Renderizando modal con:', { vendor, selectedCategoryId, categoriesCount: categories.length, formData });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Crear Regla Automática
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-foreground hover:bg-muted rounded transition-colors"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {vendor && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Concepto:</strong> <code className="font-mono bg-muted px-1 py-0.5 rounded">{vendor}</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Crea una regla automática para categorizar transacciones según el tipo de regla seleccionado
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de Regla</label>
            <select
              value={formData.rule_type}
              onChange={(e) => setFormData({ ...formData, rule_type: e.target.value as typeof formData.rule_type })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={saving}
            >
              <option value="vendor_contains">Concepto contiene</option>
              <option value="vendor_equals">Concepto exacto</option>
              <option value="description_contains">Descripción contiene</option>
              <option value="amount_equals">Monto exacto</option>
              <option value="amount_greater">Monto mayor a</option>
              <option value="amount_less">Monto menor a</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.rule_type === 'vendor_contains' && 'Coincide si el concepto contiene el texto (recomendado)'}
              {formData.rule_type === 'vendor_equals' && 'Coincide solo si el concepto es exactamente igual'}
              {formData.rule_type === 'description_contains' && 'Coincide si la descripción contiene el texto'}
              {formData.rule_type === 'amount_equals' && 'Coincide si el monto es exactamente igual al valor especificado'}
              {formData.rule_type === 'amount_greater' && 'Coincide si el monto es mayor al valor especificado'}
              {formData.rule_type === 'amount_less' && 'Coincide si el monto es menor al valor especificado'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {formData.rule_type === 'amount_greater' || formData.rule_type === 'amount_less' || formData.rule_type === 'amount_equals'
                ? 'Monto'
                : 'Valor de búsqueda'}
            </label>
            <input
              type={formData.rule_type === 'amount_greater' || formData.rule_type === 'amount_less' || formData.rule_type === 'amount_equals' ? 'number' : 'text'}
              value={formData.match_value}
              onChange={(e) => setFormData({ ...formData, match_value: e.target.value })}
              placeholder={
                formData.rule_type === 'amount_greater' || formData.rule_type === 'amount_less' || formData.rule_type === 'amount_equals'
                  ? 'Ej: 10000'
                  : formData.rule_type === 'description_contains'
                  ? 'Ej: SALARIO'
                  : 'Ej: UBER'
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.rule_type === 'amount_greater' || formData.rule_type === 'amount_less' || formData.rule_type === 'amount_equals'
                ? 'Ingresa el monto numérico de referencia'
                : 'Puedes editar el texto para que la regla sea más específica'}
            </p>
          </div>

          <Select
            label="Categoría de destino"
            value={formData.category_id}
            onChange={(value) => setFormData({ ...formData, category_id: value })}
            placeholder="Seleccionar categoría..."
            disabled={saving}
            options={categories
              .sort((a, b) => {
                if (!a.parentId && b.parentId) return -1;
                if (a.parentId && !b.parentId) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((cat) => {
                const parent = cat.parentId ? categories.find(c => c.id === cat.parentId) : null;
                return {
                  value: cat.id,
                  label: cat.name,
                  description: parent ? `↳ ${parent.name}` : undefined,
                  color: cat.color,
                };
              })}
          />

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!formData.category_id || !formData.match_value.trim() || saving}
              className="flex-1"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Crear Regla
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
