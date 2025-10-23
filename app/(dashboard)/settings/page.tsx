'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/contexts/toast-context';
import { User, Lock, Trash2, Save, Building2, Edit, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useCurrency, ExchangeRates } from '@/contexts/currency-context';
import { Currency } from '@/lib/utils/currency';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface CustomBank {
  id: string;
  name: string;
  display_name: string;
  color: string;
  created_at: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDoubleDeleteConfirm, setShowDoubleDeleteConfirm] = useState(false);

  // Custom banks state
  const [customBanks, setCustomBanks] = useState<CustomBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [editingBank, setEditingBank] = useState<CustomBank | null>(null);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    name: '',
    displayName: '',
    color: '#004481',
  });

  const supabase = createClient();
  const toast = useToast();
  const { enabledCurrencies, setEnabledCurrencies, exchangeRates, setExchangeRates } = useCurrency();

  const [ratesFormData, setRatesFormData] = useState({
    USD_TO_UYU: exchangeRates.USD_TO_UYU.toString(),
    USD_TO_ARS: exchangeRates.USD_TO_ARS.toString(),
    UYU_TO_ARS: exchangeRates.UYU_TO_ARS.toString(),
  });

  const AVAILABLE_CURRENCIES = [
    { code: 'UYU' as Currency, name: 'Peso Uruguayo', flag: '🇺🇾', symbol: '$U' },
    { code: 'USD' as Currency, name: 'Dólar Estadounidense', flag: '🇺🇸', symbol: '$' },
    { code: 'ARS' as Currency, name: 'Peso Argentino', flag: '🇦🇷', symbol: '$' },
  ];

  useEffect(() => {
    fetchUserData();
    loadCustomBanks();
  }, []);

  // Update rates form when exchangeRates change
  useEffect(() => {
    setRatesFormData({
      USD_TO_UYU: exchangeRates.USD_TO_UYU.toString(),
      USD_TO_ARS: exchangeRates.USD_TO_ARS.toString(),
      UYU_TO_ARS: exchangeRates.UYU_TO_ARS.toString(),
    });
  }, [exchangeRates]);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error('Error fetching user:', authError);
        return;
      }

      const userData: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || '',
        created_at: authUser.created_at,
      };

      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: formData.name },
      });

      if (error) throw error;

      toast.success('Perfil actualizado correctamente', 'Perfil actualizado');
      await fetchUserData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error al actualizar el perfil', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden', 'Error de validación');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres', 'Error de validación');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success('Contraseña actualizada correctamente', 'Contraseña actualizada');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Error al cambiar la contraseña', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleFirstConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDoubleDeleteConfirm(true);
  };

  const handleFinalDeleteAccount = async () => {
    setShowDoubleDeleteConfirm(false);

    try {
      // Delete all user data
      await supabase.from('transactions').delete().eq('user_id', user?.id);
      await supabase.from('categories').delete().eq('user_id', user?.id);

      // Sign out
      await supabase.auth.signOut();

      toast.success('Cuenta eliminada correctamente', 'Cuenta eliminada');

      // Wait a bit for the user to see the message before redirecting
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta', 'Error');
    }
  };

  const loadCustomBanks = async () => {
    try {
      setLoadingBanks(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data, error } = await supabase
        .from('custom_banks')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomBanks(data || []);
    } catch (err) {
      console.error('Error loading custom banks:', err);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankFormData.name.trim() || !bankFormData.displayName.trim()) {
      toast.error('Por favor completa todos los campos', 'Error');
      return;
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No hay usuario autenticado');

      const { data, error } = await supabase
        .from('custom_banks')
        .insert({
          user_id: authUser.id,
          name: bankFormData.name.trim(),
          display_name: bankFormData.displayName.trim(),
          color: bankFormData.color,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ya existe un banco con ese nombre');
        }
        throw error;
      }

      toast.success(`Banco "${data.display_name}" creado exitosamente`, 'Banco creado');

      setCustomBanks(prev => [data, ...prev]);
      setBankFormData({ name: '', displayName: '', color: '#004481' });
      setShowBankForm(false);
    } catch (err: any) {
      console.error('Error creating bank:', err);
      toast.error(err.message || 'Error al crear el banco', 'Error');
    }
  };

  const handleUpdateBank = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBank || !bankFormData.name.trim() || !bankFormData.displayName.trim()) {
      toast.error('Por favor completa todos los campos', 'Error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_banks')
        .update({
          name: bankFormData.name.trim(),
          display_name: bankFormData.displayName.trim(),
          color: bankFormData.color,
        })
        .eq('id', editingBank.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ya existe un banco con ese nombre');
        }
        throw error;
      }

      toast.success(`Banco actualizado exitosamente`, 'Banco actualizado');

      setCustomBanks(prev => prev.map(b => b.id === data.id ? data : b));
      setBankFormData({ name: '', displayName: '', color: '#004481' });
      setEditingBank(null);
    } catch (err: any) {
      console.error('Error updating bank:', err);
      toast.error(err.message || 'Error al actualizar el banco', 'Error');
    }
  };

  const handleDeleteBank = async () => {
    if (!deletingBankId) return;

    try {
      const { error } = await supabase
        .from('custom_banks')
        .delete()
        .eq('id', deletingBankId);

      if (error) throw error;

      toast.success('Banco eliminado exitosamente', 'Banco eliminado');

      setCustomBanks(prev => prev.filter(b => b.id !== deletingBankId));
      setDeletingBankId(null);
    } catch (err: any) {
      console.error('Error deleting bank:', err);
      toast.error(err.message || 'Error al eliminar el banco', 'Error');
    }
  };

  const startEditBank = (bank: CustomBank) => {
    setEditingBank(bank);
    setBankFormData({
      name: bank.name,
      displayName: bank.display_name,
      color: bank.color,
    });
    setShowBankForm(true);
  };

  const cancelBankForm = () => {
    setShowBankForm(false);
    setEditingBank(null);
    setBankFormData({ name: '', displayName: '', color: '#004481' });
  };

  const handleToggleCurrency = async (currency: Currency) => {
    const isEnabled = enabledCurrencies.includes(currency);
    let newEnabledCurrencies: Currency[];

    if (isEnabled) {
      // Disable currency
      if (enabledCurrencies.length <= 1) {
        toast.error('Debes tener al menos una moneda activa', 'Error');
        return;
      }
      newEnabledCurrencies = enabledCurrencies.filter(c => c !== currency);
    } else {
      // Enable currency
      newEnabledCurrencies = [...enabledCurrencies, currency];
    }

    await setEnabledCurrencies(newEnabledCurrencies);
    toast.success(
      isEnabled ? `${currency} desactivada` : `${currency} activada`,
      'Preferencias actualizadas'
    );
  };

  const handleSaveExchangeRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newRates: ExchangeRates = {
        USD_TO_UYU: parseFloat(ratesFormData.USD_TO_UYU),
        USD_TO_ARS: parseFloat(ratesFormData.USD_TO_ARS),
        UYU_TO_ARS: parseFloat(ratesFormData.UYU_TO_ARS),
      };

      // Validate all rates are positive numbers
      if (newRates.USD_TO_UYU <= 0 || newRates.USD_TO_ARS <= 0 || newRates.UYU_TO_ARS <= 0) {
        toast.error('Las tasas deben ser números positivos', 'Error de validación');
        return;
      }

      await setExchangeRates(newRates);
      toast.success('Tasas de cambio actualizadas correctamente', 'Tasas actualizadas');
    } catch (error) {
      console.error('Error saving exchange rates:', error);
      toast.error('Error al guardar las tasas de cambio', 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <Skeleton variant="text" width="30%" height={36} className="mb-2" />
          <Skeleton variant="text" width="50%" height={20} />
        </div>

        {/* Settings Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={20} className="mb-2" />
                  <Skeleton variant="text" width="60%" height={16} />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton variant="text" width="100%" height={44} />
                <Skeleton variant="text" width="100%" height={44} />
                <Skeleton variant="rounded" width={150} height={40} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Información del Perfil</h2>
            <p className="text-sm text-muted-foreground">Actualiza tu información personal</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              El email no se puede cambiar por razones de seguridad
            </p>
          </div>

          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </Card>

      {/* Currency Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Monedas</h2>
            <p className="text-sm text-muted-foreground">
              Activa o desactiva las monedas que quieres ver en el selector
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {AVAILABLE_CURRENCIES.map((currency) => {
            const isEnabled = enabledCurrencies.includes(currency.code);
            const isOnlyEnabled = enabledCurrencies.length === 1 && isEnabled;

            return (
              <div
                key={currency.code}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isEnabled
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.flag}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {currency.name} ({currency.code})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Símbolo: {currency.symbol}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCurrency(currency.code)}
                  disabled={isOnlyEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isEnabled ? 'bg-primary' : 'bg-muted'
                  } ${isOnlyEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-info/10 border border-info/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-info">
            Las monedas activas aparecerán en el selector del header. Debes tener al menos una moneda activa.
          </p>
        </div>
      </Card>

      {/* Exchange Rates Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tasas de Cambio</h2>
            <p className="text-sm text-muted-foreground">
              Configura las tasas de conversión entre monedas
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveExchangeRates} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                1 USD = ? UYU
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={ratesFormData.USD_TO_UYU}
                  onChange={(e) => setRatesFormData({ ...ratesFormData, USD_TO_UYU: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="40"
                  required
                />
                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">$U</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                1 UYU = ${(1 / parseFloat(ratesFormData.USD_TO_UYU || '1')).toFixed(4)} USD
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                1 USD = ? ARS
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={ratesFormData.USD_TO_ARS}
                  onChange={(e) => setRatesFormData({ ...ratesFormData, USD_TO_ARS: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1000"
                  required
                />
                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">$ ARS</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                1 ARS = ${(1 / parseFloat(ratesFormData.USD_TO_ARS || '1')).toFixed(6)} USD
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                1 UYU = ? ARS
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={ratesFormData.UYU_TO_ARS}
                  onChange={(e) => setRatesFormData({ ...ratesFormData, UYU_TO_ARS: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="25"
                  required
                />
                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">$ ARS</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                1 ARS = $U {(1 / parseFloat(ratesFormData.UYU_TO_ARS || '1')).toFixed(4)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-xs text-warning">
              <p className="font-medium mb-1">Actualiza estas tasas regularmente</p>
              <p>Para Argentina, considera usar el tipo de cambio oficial o blue según tu preferencia.</p>
            </div>
          </div>

          <Button type="submit" variant="warning" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Tasas'}
          </Button>
        </form>
      </Card>

      {/* Password Change */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Cambiar Contraseña</h2>
            <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Repite la contraseña"
              minLength={6}
            />
          </div>

          <Button type="submit" variant="warning" disabled={saving}>
            <Lock className="h-4 w-4 mr-2" />
            {saving ? 'Actualizando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </Card>

      {/* Custom Banks Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Bancos Personalizados</h2>
              <p className="text-sm text-muted-foreground">Gestiona tus bancos personalizados para asignar a extractos</p>
            </div>
          </div>
          {!showBankForm && (
            <Button onClick={() => setShowBankForm(true)} variant="primary" size="sm">
              <Building2 className="h-4 w-4 mr-2" />
              Nuevo Banco
            </Button>
          )}
        </div>

        {/* Bank Form (Create/Edit) */}
        {showBankForm && (
          <form onSubmit={editingBank ? handleUpdateBank : handleCreateBank} className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {editingBank ? 'Editar Banco' : 'Nuevo Banco'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre interno *
                </label>
                <input
                  type="text"
                  value={bankFormData.name}
                  onChange={(e) => setBankFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ej: mi-banco"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre para mostrar *
                </label>
                <input
                  type="text"
                  value={bankFormData.displayName}
                  onChange={(e) => setBankFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="ej: Mi Banco S.A."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {['#004481', '#ed1c24', '#ec7000', '#009639', '#ec0000', '#1e3a8a', '#6b7280', '#8b5cf6'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBankFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg transition-all ${bankFormData.color === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {editingBank ? 'Actualizar' : 'Crear'} Banco
              </Button>
              <Button type="button" variant="outline" onClick={cancelBankForm}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Banks List */}
        {loadingBanks ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : customBanks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tienes bancos personalizados aún</p>
            <p className="text-xs mt-2">Crea tu primer banco para asignarlo a tus extractos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customBanks.map(bank => (
              <div key={bank.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: bank.color }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {bank.display_name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {bank.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEditBank(bank)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setDeletingBankId(bank.id)}
                    variant="ghost"
                    size="sm"
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-2 border-error">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-error">Zona de Peligro</h2>
            <p className="text-sm text-muted-foreground">Acciones irreversibles en tu cuenta</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Al eliminar tu cuenta, se eliminarán permanentemente todos tus datos,
            incluyendo transacciones, categorías y configuración. Esta acción no
            se puede deshacer.
          </p>

          <Button onClick={handleDeleteAccountClick} variant="error">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Cuenta
          </Button>
        </div>
      </Card>

      {/* Account Info */}
      {user && (
        <Card className="p-6 bg-muted/30">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Información de la Cuenta
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ID de Usuario:</span>
              <span className="text-xs font-mono bg-background px-2 py-1 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cuenta creada:</span>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* First Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleFirstConfirmDelete}
        title="Eliminar cuenta"
        message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y se eliminarán todos tus datos."
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Double Delete Confirmation */}
      <ConfirmModal
        isOpen={showDoubleDeleteConfirm}
        onClose={() => setShowDoubleDeleteConfirm(false)}
        onConfirm={handleFinalDeleteAccount}
        title="ÚLTIMA ADVERTENCIA"
        message="¿Realmente quieres eliminar tu cuenta permanentemente? Esta acción es irreversible y todos tus datos serán eliminados."
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Delete Bank Confirmation */}
      <ConfirmModal
        isOpen={!!deletingBankId}
        onClose={() => setDeletingBankId(null)}
        onConfirm={handleDeleteBank}
        title="Eliminar banco"
        message="¿Estás seguro de que quieres eliminar este banco? Los extractos asociados no se eliminarán."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
