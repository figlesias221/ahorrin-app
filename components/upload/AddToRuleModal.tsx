'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { RuleMatchPreview } from '@/components/categorization/RuleMatchPreview';
import type { CategorizationRule } from '@/lib/categorization/rules';

interface Rule {
  id: string;
  rule_type: string;
  match_value: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface AddToRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleUpdated: () => void;
  vendor: string;
}

const RULE_TYPE_LABELS: Record<string, string> = {
  vendor_contains: 'Concepto contiene',
  vendor_equals: 'Concepto exacto',
  description_contains: 'Descripción contiene',
  amount_greater: 'Monto mayor a',
  amount_less: 'Monto menor a',
};

export function AddToRuleModal({
  isOpen,
  onClose,
  onRuleUpdated,
  vendor,
}: AddToRuleModalProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [editableVendor, setEditableVendor] = useState(vendor);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchRules();
      setEditableVendor(vendor); // Reset to original vendor when modal opens
    }
  }, [isOpen, vendor]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { data, error: fetchError } = await supabase
        .from('categorization_rules')
        .select(`
          id,
          rule_type,
          match_value,
          category:categories(id, name, color)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .in('rule_type', ['vendor_contains', 'vendor_equals'])
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setRules((data || []) as Rule[]);
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError('Error al cargar las reglas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToRule = async () => {
    if (!selectedRuleId) {
      setError('Debes seleccionar una regla');
      return;
    }

    if (!editableVendor.trim()) {
      setError('El concepto no puede estar vacío');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const selectedRule = rules.find(r => r.id === selectedRuleId);
      if (!selectedRule) throw new Error('Regla no encontrada');

      // Check if concepto already exists in the rule
      const existingValues = selectedRule.match_value.split(',').map(v => v.trim());
      if (existingValues.some(v => v.toLowerCase() === editableVendor.trim().toLowerCase())) {
        setError('Este concepto ya está en la regla seleccionada');
        return;
      }

      // Add concepto to the rule
      const newMatchValue = [...existingValues, editableVendor.trim()].join(', ');

      const { error: updateError } = await supabase
        .from('categorization_rules')
        .update({ match_value: newMatchValue })
        .eq('id', selectedRuleId);

      if (updateError) throw updateError;

      onRuleUpdated();
      onClose();
      setSelectedRuleId('');
    } catch (err) {
      console.error('Error updating rule:', err);
      const message = err instanceof Error ? err.message : 'Error al actualizar la regla';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plus className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Agregar a Regla Existente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Concepto a agregar</label>
          <input
            type="text"
            value={editableVendor}
            onChange={(e) => setEditableVendor(e.target.value)}
            placeholder="Ej: UBER"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            disabled={saving}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Puedes editar el texto para que sea más específico. Luego selecciona una regla existente para agregarlo.
          </p>
          {selectedRuleId && (
            <div className="mt-3">
              <RuleMatchPreview
                ruleType={
                  (rules.find((r) => r.id === selectedRuleId)?.rule_type ??
                    'vendor_contains') as CategorizationRule['rule_type']
                }
                matchValues={[editableVendor]}
                enabled={isOpen}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay reglas disponibles
            </h3>
            <p className="text-sm text-muted-foreground">
              Crea una nueva regla para poder agregar conceptos
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRuleId === rule.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: rule.category.color }}
                        />
                        <span className="font-semibold text-foreground">
                          {rule.category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {RULE_TYPE_LABELS[rule.rule_type]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rule.match_value.split(',').map((val, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono"
                          >
                            {val.trim()}
                          </span>
                        ))}
                        <span className="text-xs text-primary font-medium">
                          + agregar &quot;{editableVendor}&quot;
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedRuleId === rule.id && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
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
                onClick={handleAddToRule}
                disabled={!selectedRuleId || saving}
                className="flex-1"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar a Regla
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
