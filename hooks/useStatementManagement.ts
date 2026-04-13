'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/contexts/toast-context';
import type { Database } from '@/lib/supabase/database.types';
import type { CustomBank } from './useUploadData';

type BankStatement = Database['public']['Tables']['bank_statements']['Row'];

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').trim().slice(0, 255);
}

export function useStatementManagement(
  statements: BankStatement[],
  setStatements: (s: BankStatement[]) => void,
  customBanks: CustomBank[],
) {
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; fileName: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editingBankValue, setEditingBankValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
  const [deletingAll, setDeletingAll] = useState(false);
  const [showHistoryDetails, setShowHistoryDetails] = useState(false);
  const [selectedStatements, setSelectedStatements] = useState<Set<string>>(new Set());
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditBank, setBulkEditBank] = useState('');

  const supabase = createClient();
  const toast = useToast();

  const handleDeleteClick = (id: string, fileName: string) => {
    setDeleteTarget({ id, fileName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('bank_statements')
        .delete()
        .eq('id', deleteTarget.id);
      if (error) throw error;
      setStatements(statements.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting statement:', error);
      toast.error('Error al eliminar el extracto. Por favor intenta nuevamente.', 'Error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!deleting) setDeleteTarget(null);
  };

  const handleEditClick = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    setSaving(true);
    try {
      const sanitizedName = sanitizeFileName(editingName);
      const statement = statements.find(s => s.id === editingId);
      if (!statement) throw new Error('Extracto no encontrado');

      const pathParts = statement.file_path.split('/');
      pathParts[pathParts.length - 1] = sanitizedName;
      const newPath = pathParts.join('/');

      const { error } = await supabase
        .from('bank_statements')
        .update({ file_name: sanitizedName, file_path: newPath })
        .eq('id', editingId);
      if (error) throw error;

      setStatements(statements.map(s =>
        s.id === editingId ? { ...s, file_name: sanitizedName, file_path: newPath } : s
      ));
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating statement name:', error);
      toast.error('Error al actualizar el nombre. Por favor intenta nuevamente.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleBankEditClick = (id: string, currentBank: string | null) => {
    setEditingBankId(id);
    const customBank = customBanks.find(b => b.displayName === currentBank || b.name === currentBank);
    setEditingBankValue(customBank ? `custom_${customBank.id}` : '');
  };

  const handleCancelBankEdit = () => {
    setEditingBankId(null);
    setEditingBankValue('');
  };

  const handleSaveBankEdit = async () => {
    if (!editingBankId) return;
    setSaving(true);
    try {
      const bankDisplayName = editingBankValue
        ? customBanks.find(b => `custom_${b.id}` === editingBankValue)?.displayName || null
        : null;

      const { error } = await supabase
        .from('bank_statements')
        .update({ bank: bankDisplayName })
        .eq('id', editingBankId);
      if (error) throw error;

      const { error: txError } = await supabase
        .from('transactions')
        .update({ bank: bankDisplayName })
        .eq('statement_id', editingBankId);

      if (txError) {
        console.error('Error updating transaction banks:', txError);
        toast.warning('Extracto actualizado, pero algunas transacciones no se actualizaron', 'Advertencia');
      }

      setStatements(statements.map(s =>
        s.id === editingBankId ? { ...s, bank: bankDisplayName } : s
      ));
      toast.success('Banco y transacciones actualizados correctamente');
      setEditingBankId(null);
      setEditingBankValue('');
    } catch (error) {
      console.error('Error updating bank:', error);
      toast.error('Error al actualizar el banco. Por favor intenta nuevamente.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllClick = () => setShowDeleteAllModal(true);

  const handleDeleteAll = async () => {
    if (deleteAllConfirm !== 'ELIMINAR') {
      toast.error('Por favor escribe "ELIMINAR" para confirmar', 'Error');
      return;
    }
    setDeletingAll(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from('bank_statements')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
      setStatements([]);
      setShowDeleteAllModal(false);
      setDeleteAllConfirm('');
    } catch (error) {
      console.error('Error deleting all statements:', error);
      toast.error('Error al eliminar los extractos. Por favor intenta nuevamente.', 'Error');
    } finally {
      setDeletingAll(false);
    }
  };

  const handleCancelDeleteAll = () => {
    if (!deletingAll) {
      setShowDeleteAllModal(false);
      setDeleteAllConfirm('');
    }
  };

  const handleSelectStatement = (id: string) => {
    setSelectedStatements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedStatements.size === statements.length) {
      setSelectedStatements(new Set());
    } else {
      setSelectedStatements(new Set(statements.map(s => s.id)));
    }
  };

  const handleBulkEditBanks = () => {
    if (selectedStatements.size === 0) {
      toast.error('Selecciona al menos un extracto para editar', 'Error');
      return;
    }
    setShowBulkEditModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedStatements.size === 0) {
      toast.error('Selecciona al menos un extracto para eliminar', 'Error');
      return;
    }
    if (!confirm(`¿Estas seguro de que deseas eliminar ${selectedStatements.size} extracto(s)?`)) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('bank_statements')
        .delete()
        .in('id', Array.from(selectedStatements));
      if (error) throw error;
      setStatements(statements.filter(s => !selectedStatements.has(s.id)));
      setSelectedStatements(new Set());
      toast.success(`${selectedStatements.size} extracto(s) eliminado(s) correctamente`);
    } catch (error) {
      console.error('Error deleting statements:', error);
      toast.error('Error al eliminar los extractos', 'Error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveBulkEdit = async () => {
    if (!bulkEditBank) {
      toast.error('Selecciona un banco', 'Error');
      return;
    }
    setSaving(true);
    try {
      const bankDisplayName = customBanks.find(b => `custom_${b.id}` === bulkEditBank)?.displayName || null;
      const { error } = await supabase
        .from('bank_statements')
        .update({ bank: bankDisplayName })
        .in('id', Array.from(selectedStatements));
      if (error) throw error;

      const { error: txError } = await supabase
        .from('transactions')
        .update({ bank: bankDisplayName })
        .in('statement_id', Array.from(selectedStatements));
      if (txError) {
        console.error('Error updating transaction banks:', txError);
        toast.warning('Extractos actualizados, pero algunas transacciones no se actualizaron', 'Advertencia');
      }

      setStatements(statements.map(s =>
        selectedStatements.has(s.id) ? { ...s, bank: bankDisplayName } : s
      ));
      toast.success(`${selectedStatements.size} extracto(s) actualizado(s) correctamente`);
      setShowBulkEditModal(false);
      setBulkEditBank('');
      setSelectedStatements(new Set());
    } catch (error) {
      console.error('Error updating banks:', error);
      toast.error('Error al actualizar los bancos', 'Error');
    } finally {
      setSaving(false);
    }
  };

  return {
    deleting,
    deleteTarget,
    editingId,
    editingName,
    setEditingName,
    editingBankId,
    editingBankValue,
    setEditingBankValue,
    saving,
    showDeleteAllModal,
    deleteAllConfirm,
    setDeleteAllConfirm,
    deletingAll,
    showHistoryDetails,
    setShowHistoryDetails,
    selectedStatements,
    showBulkEditModal,
    setShowBulkEditModal,
    bulkEditBank,
    setBulkEditBank,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleBankEditClick,
    handleCancelBankEdit,
    handleSaveBankEdit,
    handleDeleteAllClick,
    handleDeleteAll,
    handleCancelDeleteAll,
    handleSelectStatement,
    handleSelectAll,
    handleBulkEditBanks,
    handleBulkDelete,
    handleSaveBulkEdit,
  };
}
