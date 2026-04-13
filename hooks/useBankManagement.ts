'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/contexts/toast-context';
import type { CustomBank } from './useUploadData';

export function useBankManagement(fetchData: () => void) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBank, setEditingBank] = useState<CustomBank | null>(null);
  const [deleteBankTarget, setDeleteBankTarget] = useState<{ id: string; name: string } | null>(null);
  const [deletingBank, setDeletingBank] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const supabase = createClient();
  const toast = useToast();

  const handleCreate = () => {
    setEditingBank(null);
    setShowModal(true);
  };

  const handleEdit = (bank: CustomBank) => {
    setEditingBank(bank);
    setShowModal(true);
  };

  const handleDelete = (bank: CustomBank) => {
    setDeleteBankTarget({ id: bank.id, name: bank.displayName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteBankTarget) return;
    setDeletingBank(true);
    try {
      const { error } = await supabase
        .from('custom_banks')
        .delete()
        .eq('id', deleteBankTarget.id);
      if (error) throw error;
      toast.success(`Banco "${deleteBankTarget.name}" eliminado exitosamente`);
      setDeleteBankTarget(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Error al eliminar el banco', 'Error');
    } finally {
      setDeletingBank(false);
    }
  };

  const handleBankCreated = (bank: CustomBank) => {
    fetchData();
    return bank;
  };

  return {
    searchQuery,
    setSearchQuery,
    editingBank,
    deleteBankTarget,
    setDeleteBankTarget,
    deletingBank,
    showModal,
    setShowModal,
    handleCreate,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleBankCreated,
  };
}
