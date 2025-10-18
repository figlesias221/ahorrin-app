'use client';

import { useState } from 'react';
import { Plus, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/contexts/toast-context';

interface SuggestedBank {
  name: string;
  displayName: string;
  color: string;
}

const SUGGESTED_BANKS: SuggestedBank[] = [
  { name: 'bbva', displayName: 'BBVA', color: '#004481' },
  { name: 'scotia', displayName: 'Scotiabank', color: '#ed1c24' },
  { name: 'itau', displayName: 'Itaú', color: '#ec7000' },
  { name: 'itau_master', displayName: 'Itaú Mastercard', color: '#eb6c00' },
  { name: 'itau_visa', displayName: 'Itaú Visa', color: '#ff8200' },
  { name: 'brou', displayName: 'Banco República', color: '#009639' },
  { name: 'santander', displayName: 'Santander', color: '#ec0000' },
  { name: 'heritage', displayName: 'Heritage', color: '#1e3a8a' },
];

interface SuggestedBanksProps {
  onBankCreated: (bank: { id: string; name: string; displayName: string; color: string }) => void;
  existingBanks: Array<{ name: string }>;
}

export function SuggestedBanks({ onBankCreated, existingBanks }: SuggestedBanksProps) {
  const [adding, setAdding] = useState<string | null>(null);
  const supabase = createClient();
  const toast = useToast();

  const handleAddBank = async (bank: SuggestedBank) => {
    setAdding(bank.name);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión para crear bancos.', 'Error de autenticación');
        return;
      }

      const { data, error } = await supabase
        .from('custom_banks')
        .insert({
          user_id: user.id,
          name: bank.name,
          display_name: bank.displayName,
          color: bank.color,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Banco "${bank.displayName}" agregado exitosamente.`, 'Banco creado');
      onBankCreated({
        id: data.id,
        name: data.name,
        displayName: data.display_name,
        color: data.color,
      });
    } catch (error: any) {
      console.error('Error creating bank:', error);
      toast.error(error.message || 'Error al crear el banco.', 'Error');
    } finally {
      setAdding(null);
    }
  };

  // Filter out banks that already exist
  const availableBanks = SUGGESTED_BANKS.filter(
    bank => !existingBanks.some(existing => existing.name === bank.name)
  );

  if (availableBanks.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 mt-0.5">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Bancos sugeridos
          </h3>
          <p className="text-xs text-muted-foreground">
            Agrega rápidamente bancos comunes con un click. También puedes crear bancos personalizados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {availableBanks.map((bank) => (
          <Button
            key={bank.name}
            variant="outline"
            size="sm"
            onClick={() => handleAddBank(bank)}
            disabled={adding === bank.name}
            className="h-auto py-2 px-3 flex flex-col items-center gap-1.5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bank.color }}
            >
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {bank.displayName}
            </span>
            {adding === bank.name ? (
              <span className="text-xs text-muted-foreground">Agregando...</span>
            ) : (
              <Plus className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
}
