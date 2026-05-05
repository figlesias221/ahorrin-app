'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
        SUGERIDOS
      </h3>

      <ul className="grid gap-0 sm:grid-cols-2 sm:gap-x-6 divide-y divide-border sm:divide-y-0">
        {availableBanks.map((bank) => (
          <li key={bank.name} className="sm:border-b sm:border-border sm:[&:nth-last-child(-n+2)]:border-b-0">
            <button
              type="button"
              onClick={() => handleAddBank(bank)}
              disabled={adding === bank.name}
              className="w-full flex items-center gap-3 p-3 text-left transition-colors hover:text-primary disabled:opacity-50 group"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: bank.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-sm font-medium truncate">
                {bank.displayName}
              </span>
              {adding === bank.name ? (
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  AGREGANDO
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
