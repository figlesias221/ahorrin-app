'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { getNextAvailableColor } from '@/lib/category-suggestions';

interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: { id: string; name: string; color: string }) => void;
  vendor?: string;
}

export function QuickCategoryModal({ isOpen, onClose, onCategoryCreated, vendor }: QuickCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#ff6b35',
  });
  const [createRule, setCreateRule] = useState(!!vendor); // Auto-check if vendor is provided
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Load existing categories and set next available color when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategoriesAndSetColor();
    }
  }, [isOpen]);

  const loadCategoriesAndSetColor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: categories } = await supabase
        .from('categories')
        .select('color')
        .eq('user_id', user.id);

      const usedColors = categories?.map(c => c.color) || [];
      const nextColor = getNextAvailableColor(usedColors);

      setFormData(prev => ({ ...prev, color: nextColor }));
    } catch (err) {
      console.error('Error loading categories:', err);
      // Fallback to default color
      setFormData(prev => ({ ...prev, color: '#ff6b35' }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          color: formData.color,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating category:', insertError);
        if (insertError.code === '23505') {
          throw new Error('Ya existe una categoría con ese nombre');
        }
        throw insertError;
      }

      if (data) {
        // Create categorization rule if checkbox is checked and vendor is provided
        if (createRule && vendor) {
          try {
            const { error: ruleError } = await supabase
              .from('categorization_rules')
              .insert({
                user_id: user.id,
                category_id: data.id,
                rule_type: 'vendor_contains',
                match_value: vendor.trim(),
                is_active: true,
              });

            if (ruleError) {
              console.error('Error creating rule:', ruleError);
              // Don't fail the whole operation, just log it
            }
          } catch (ruleErr) {
            console.error('Error creating automatic rule:', ruleErr);
          }
        }

        onCategoryCreated({
          id: data.id,
          name: data.name,
          color: data.color,
        });

        // Reset form
        setFormData({ name: '', description: '', color: '#ff6b35' });
        setCreateRule(!!vendor);
        onClose();
      }
    } catch (err) {
      console.error('Error saving category:', err);
      const message = err instanceof Error ? err.message : 'Error al guardar categoría';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Nueva Categoría Rápida
          </h2>
          <button
            onClick={onClose}
            className="p-0.5 text-foreground hover:bg-muted rounded transition-colors"
            disabled={saving}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-error/10 border border-error/30 rounded-md">
            <p className="text-xs text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Transporte, Comida..."
              className="w-full px-2.5 py-1 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Descripción <span className="text-muted-foreground">(opcional)</span></label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Uber, taxi, colectivo..."
              className="w-full px-2.5 py-1 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Color</label>
            <div className="flex gap-1.5 items-center">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-8 h-6 rounded border border-border cursor-pointer"
                disabled={saving}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#000000"
                className="flex-1 px-2 py-0.5 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                disabled={saving}
              />
            </div>
          </div>

          {vendor && (
            <div className="p-1.5 bg-primary/5 border border-primary/20 rounded">
              <div className="flex items-start gap-1">
                <input
                  type="checkbox"
                  id="createRule"
                  checked={createRule}
                  onChange={(e) => setCreateRule(e.target.checked)}
                  className="mt-0.5 h-3 w-3 rounded border-border"
                  disabled={saving}
                />
                <label htmlFor="createRule" className="text-[10px] flex-1">
                  <span className="font-medium text-foreground">Regla automática</span>
                  <span className="text-muted-foreground"> - Auto-categorizar "{vendor}"</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 h-8 text-sm"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || saving}
              className="flex-1 h-8 text-sm"
            >
              {saving ? (
                <div className="h-3 w-3 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Crear
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
