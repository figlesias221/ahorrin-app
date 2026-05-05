'use client';

import { useState, useEffect } from 'react';
import { X, Building2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/contexts/toast-context';

interface CustomBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBankCreated: (bank: { id: string; name: string; displayName: string; color: string }) => void;
  bank?: { id: string; name: string; displayName: string; color: string } | null;
  existingBanks?: Array<{ id: string; name: string; displayName: string; color: string }>;
}

const DEFAULT_COLORS = [
  '#004481', // BBVA Blue
  '#ed1c24', // Scotia Red
  '#ec7000', // Itau Orange
  '#009639', // BROU Green
  '#ec0000', // Santander Red
  '#1e3a8a', // Heritage Blue
  '#6b7280', // Gray
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Green
];

export function CustomBankModal({ isOpen, onClose, onBankCreated, bank, existingBanks = [] }: CustomBankModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    color: DEFAULT_COLORS[0],
  });
  const [creating, setCreating] = useState(false);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const supabase = createClient();
  const toast = useToast();

  // Update form when bank prop changes
  useEffect(() => {
    if (bank) {
      setFormData({
        name: bank.name,
        displayName: bank.displayName,
        color: bank.color,
      });
    } else {
      setFormData({
        name: '',
        displayName: '',
        color: DEFAULT_COLORS[0],
      });
    }
  }, [bank]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.displayName.trim()) {
      toast.error('Por favor completa todos los campos', 'Error');
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      if (bank) {
        // Update existing bank
        const { error } = await supabase
          .from('custom_banks')
          .update({
            name: formData.name.trim(),
            display_name: formData.displayName.trim(),
            color: formData.color,
          })
          .eq('id', bank.id);

        if (error) {
          if (error.code === '23505') {
            throw new Error('Ya existe un banco con ese nombre');
          }
          throw error;
        }

        toast.success(`Banco "${formData.displayName}" actualizado exitosamente`, 'Banco actualizado');

        onBankCreated({
          id: bank.id,
          name: formData.name.trim(),
          displayName: formData.displayName.trim(),
          color: formData.color,
        });
      } else {
        // Create custom bank
        const { data: newBank, error } = await supabase
          .from('custom_banks')
          .insert({
            user_id: user.id,
            name: formData.name.trim(),
            display_name: formData.displayName.trim(),
            color: formData.color,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            throw new Error('Ya existe un banco con ese nombre');
          }
          throw error;
        }

        toast.success(`Banco "${newBank.display_name}" creado exitosamente`, 'Banco creado');

        onBankCreated({
          id: newBank.id,
          name: newBank.name,
          displayName: newBank.display_name,
          color: newBank.color,
        });
      }

      // Reset form and close
      setFormData({
        name: '',
        displayName: '',
        color: DEFAULT_COLORS[0],
      });
      onClose();
    } catch (error) {
      console.error('Error saving custom bank:', error);
      const message = error instanceof Error ? error.message : 'Error al guardar el banco';
      toast.error(message, 'Error');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectExistingBank = (selectedBank: { id: string; name: string; displayName: string; color: string }) => {
    setFormData({
      name: selectedBank.name,
      displayName: selectedBank.displayName,
      color: selectedBank.color,
    });
    setShowBankSelector(false);
  };

  const handleClose = () => {
    if (!creating) {
      setFormData({
        name: '',
        displayName: '',
        color: DEFAULT_COLORS[0],
      });
      setShowBankSelector(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {bank ? 'Editar Banco' : 'Agregar Banco Personalizado'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={creating}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing Banks Selector */}
          {existingBanks.length > 0 && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                COPIAR DE
              </label>
              <button
                type="button"
                onClick={() => setShowBankSelector(!showBankSelector)}
                className="w-full flex items-center justify-between px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                disabled={creating}
              >
                <span className="text-muted-foreground">Copiar datos de banco existente</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showBankSelector ? 'rotate-180' : ''}`} />
              </button>

              {showBankSelector && (
                <div className="mt-2 max-h-48 overflow-y-auto border border-border rounded-lg bg-background divide-y divide-border">
                  {existingBanks
                    .filter(existingBank => !bank || existingBank.id !== bank.id) // Filter out current bank when editing
                    .map((existingBank) => (
                      <button
                        key={existingBank.id}
                        type="button"
                        onClick={() => handleSelectExistingBank(existingBank)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                        disabled={creating}
                      >
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: existingBank.color }}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{existingBank.displayName}</p>
                          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground truncate">{existingBank.name}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Opcional: Copia los datos de un banco ya creado
              </p>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              NOMBRE
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ej: Mi Banco"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={creating}
              autoFocus
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Nombre interno (debe ser único)
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              NOMBRE PARA MOSTRAR
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="ej: Mi Banco S.A."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={creating}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Nombre que aparecerá en el selector
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              COLOR
            </label>
            <div className="flex flex-wrap gap-3">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  disabled={creating}
                  aria-label={`Color ${color}`}
                  className={`
                    h-6 w-6 rounded-full transition-all
                    ${formData.color === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    disabled:opacity-50
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={creating || !formData.name.trim() || !formData.displayName.trim()}
              className="flex-1"
            >
              {creating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  {bank ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  {bank ? 'Guardar Cambios' : 'Crear Banco'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
