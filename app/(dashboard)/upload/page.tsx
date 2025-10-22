'use client';

import { useState, useEffect } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Calendar, Plus, Zap, Trash2, Edit2, Check, X, Trash, Clock, ChevronDown, ChevronUp, History, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Select } from '@/components/ui/select';
import { useToast } from '@/contexts/toast-context';
import { QuickCategoryModal } from '@/components/upload/QuickCategoryModal';
import { QuickRuleModal } from '@/components/upload/QuickRuleModal';
import { AddToRuleModal } from '@/components/upload/AddToRuleModal';
import { CustomBankModal } from '@/components/upload/CustomBankModal';
import { PrivacyNotice } from '@/components/upload/PrivacyNotice';
import { BankExportGuide } from '@/components/upload/BankExportGuide';
import { parseStatement, validateTransactions, deduplicateTransactions, type ParsedTransaction, type ParserResult } from '@/lib/parsers/bank-statements';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/formatters';
import type { Database } from '@/lib/supabase/database.types';
import { motion } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';
import { SuggestedBanks } from '@/components/upload/SuggestedBanks';

type BankStatement = Database['public']['Tables']['bank_statements']['Row'];

interface FileWithData {
  file: File;
  fileName: string;
  transactions: ParsedTransaction[];
  errors: string[];
  metadata: Record<string, string> | null;
  dateRange: { start: string; end: string } | null;
  bank?: string;
  format?: string;
  currency?: string;
  detectedBank?: string;
  detectionConfidence?: string;
}

export default function UploadPage() {
  // Feature flag: Check if PDF bank statements are enabled (disabled by default for privacy)
  const enableBankStatementPDF = process.env.NEXT_PUBLIC_ENABLE_BANK_STATEMENT_PDF === 'true';

  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<Record<number, string>>({}); // index -> edited name
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedFiles, setParsedFiles] = useState<FileWithData[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [categories, setCategories] = useState<Array<{id: string; name: string; color: string; type: 'income' | 'expense'; parentId?: string | null}>>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<number, string>>({}); // index -> categoryId
  const [selectedBank, setSelectedBank] = useState<string>(''); // User-selected bank (custom_${id})
  const [currency] = useState<string>('UYU');
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);
  const [showQuickRuleModal, setShowQuickRuleModal] = useState(false);
  const [showAddToRuleModal, setShowAddToRuleModal] = useState(false);
  const [selectedTransactionForRule, setSelectedTransactionForRule] = useState<{ vendor: string; categoryId?: string; globalIdx: number } | null>(null);
  const [vendorForNewCategory, setVendorForNewCategory] = useState<string | undefined>(undefined);
  const [vendorForAddToRule, setVendorForAddToRule] = useState<string>('');
  const [applyingRules, setApplyingRules] = useState(false);

  // Statements history state
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [loadingStatements, setLoadingStatements] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; fileName: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editingBankValue, setEditingBankValue] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
  const [deletingAll, setDeletingAll] = useState(false);
  const [activeRulesCount, setActiveRulesCount] = useState(0);
  const [showHistoryDetails, setShowHistoryDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'banks'>('upload');

  // Bulk selection state
  const [selectedStatements, setSelectedStatements] = useState<Set<string>>(new Set());
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditBank, setBulkEditBank] = useState<string>('');

  // Custom banks state
  const [customBanks, setCustomBanks] = useState<Array<{ id: string; name: string; displayName: string; color: string }>>([]);
  const [showCustomBankModal, setShowCustomBankModal] = useState(false);

  // Banks management state (for banks tab)
  const [bankStats, setBankStats] = useState<Record<string, { statementsCount: number; transactionsCount: number }>>({});
  const [searchQueryBanks, setSearchQueryBanks] = useState('');
  const [editingBank, setEditingBank] = useState<{ id: string; name: string; displayName: string; color: string } | null>(null);
  const [deleteBankTarget, setDeleteBankTarget] = useState<{ id: string; name: string } | null>(null);
  const [deletingBank, setDeletingBank] = useState(false);

  const supabase = createClient();
  const toast = useToast();

  // Fetch statements and rules
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoadingStatements(false);
      return;
    }

    // Fetch statements
    const { data, error } = await supabase
      .from('bank_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching statements:', error);
    } else {
      setStatements(data || []);
    }

    // Fetch active rules count
    const { data: rules } = await supabase
      .from('categorization_rules')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    setActiveRulesCount(rules?.length || 0);

    // Fetch custom banks
    const { data: customBanksData } = await supabase
      .from('custom_banks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (customBanksData) {
      setCustomBanks(customBanksData.map(cb => ({
        id: cb.id,
        name: cb.name,
        displayName: cb.display_name,
        color: cb.color,
      })));
    }

    // Calculate bank statistics
    const stats: Record<string, { statementsCount: number; transactionsCount: number }> = {};
    (data || []).forEach(stmt => {
      const bankName = stmt.bank || 'Desconocido';
      if (!stats[bankName]) {
        stats[bankName] = { statementsCount: 0, transactionsCount: 0 };
      }
      stats[bankName].statementsCount += 1;
      stats[bankName].transactionsCount += stmt.transactions_count;
    });
    setBankStats(stats);

    setLoadingStatements(false);
  };

  // Fetch on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Statements management functions
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
    if (!deleting) {
      setDeleteTarget(null);
    }
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

      // Update both file_name and file_path
      const statement = statements.find(s => s.id === editingId);
      if (!statement) throw new Error('Extracto no encontrado');

      const pathParts = statement.file_path.split('/');
      pathParts[pathParts.length - 1] = sanitizedName;
      const newPath = pathParts.join('/');

      const { error } = await supabase
        .from('bank_statements')
        .update({
          file_name: sanitizedName,
          file_path: newPath
        })
        .eq('id', editingId);

      if (error) throw error;

      // Update local state
      setStatements(statements.map(s =>
        s.id === editingId
          ? { ...s, file_name: sanitizedName, file_path: newPath }
          : s
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
    // Find matching custom bank from the display name
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

      // Update the bank statement
      const { error } = await supabase
        .from('bank_statements')
        .update({
          bank: bankDisplayName
        })
        .eq('id', editingBankId);

      if (error) throw error;

      // Also update all associated transactions
      const { error: txError } = await supabase
        .from('transactions')
        .update({
          bank: bankDisplayName
        })
        .eq('statement_id', editingBankId);

      if (txError) {
        console.error('Error updating transaction banks:', txError);
        toast.warning('Extracto actualizado, pero algunas transacciones no se actualizaron', 'Advertencia');
      }

      // Update local state
      setStatements(statements.map(s =>
        s.id === editingBankId
          ? { ...s, bank: bankDisplayName }
          : s
      ));

      toast.success('Banco y transacciones actualizados correctamente', 'Éxito');
      setEditingBankId(null);
      setEditingBankValue('');
    } catch (error) {
      console.error('Error updating bank:', error);
      toast.error('Error al actualizar el banco. Por favor intenta nuevamente.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

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

      // Clear local state
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

  // Bulk selection handlers
  const handleSelectStatement = (id: string) => {
    setSelectedStatements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
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

    if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedStatements.size} extracto(s)?`)) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('bank_statements')
        .delete()
        .in('id', Array.from(selectedStatements));

      if (error) throw error;

      // Update local state
      setStatements(statements.filter(s => !selectedStatements.has(s.id)));
      setSelectedStatements(new Set());
      toast.success(`${selectedStatements.size} extracto(s) eliminado(s) correctamente`, 'Éxito');
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

      // Update all selected statements
      const { error } = await supabase
        .from('bank_statements')
        .update({ bank: bankDisplayName })
        .in('id', Array.from(selectedStatements));

      if (error) throw error;

      // Update all associated transactions
      const { error: txError } = await supabase
        .from('transactions')
        .update({ bank: bankDisplayName })
        .in('statement_id', Array.from(selectedStatements));

      if (txError) {
        console.error('Error updating transaction banks:', txError);
        toast.warning('Extractos actualizados, pero algunas transacciones no se actualizaron', 'Advertencia');
      }

      // Update local state
      setStatements(statements.map(s =>
        selectedStatements.has(s.id)
          ? { ...s, bank: bankDisplayName }
          : s
      ));

      toast.success(`${selectedStatements.size} extracto(s) actualizado(s) correctamente`, 'Éxito');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            Procesando
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-error/10 text-error border-error/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleCategoryCreated = (newCategory: { id: string; name: string; color: string; type: 'income' | 'expense' }) => {
    // Add new category to the list
    setCategories(prev => [...prev, newCategory]);

    if (vendorForNewCategory) {
      toast.success(
        `La categoría "${newCategory.name}" y la regla automática fueron creadas exitosamente`,
        'Categoría y regla creadas'
      );
    } else {
      toast.success(`La categoría "${newCategory.name}" fue creada exitosamente`, 'Categoría creada');
    }

    // Reset vendor
    setVendorForNewCategory(undefined);
  };

  const handleRuleCreated = () => {
    toast.success(
      'La regla automática fue creada. Se aplicará en futuras importaciones.',
      'Regla creada'
    );
    setSelectedTransactionForRule(null);
  };

  const handleCreateRuleClick = (vendor: string, categoryId: string | undefined, globalIdx: number) => {
    console.log('handleCreateRuleClick llamado:', { vendor, categoryId, globalIdx, categoriesCount: categories.length });
    setSelectedTransactionForRule({ vendor, categoryId, globalIdx });
    setShowQuickRuleModal(true);
    console.log('showQuickRuleModal establecido a true');
  };

  const handleAddToRuleClick = (vendor: string) => {
    setVendorForAddToRule(vendor);
    setShowAddToRuleModal(true);
  };

  const handleRuleUpdated = () => {
    toast.success(
      'El concepto fue agregado a la regla existente exitosamente',
      'Regla actualizada'
    );
    setVendorForAddToRule('');
  };

  const handleCustomBankCreated = (bank: { id: string; name: string; displayName: string; color: string }) => {
    setSelectedBank(`custom_${bank.id}`);
    fetchData(); // Refresh all data including the new bank
  };

  // Banks tab handlers
  const handleCreateBankClick = () => {
    setEditingBank(null);
    setShowCustomBankModal(true);
  };

  const handleEditBankClick = (bank: { id: string; name: string; displayName: string; color: string }) => {
    setEditingBank(bank);
    setShowCustomBankModal(true);
  };

  const handleDeleteBankClick = (bank: { id: string; name: string; displayName: string; color: string }) => {
    setDeleteBankTarget({ id: bank.id, name: bank.displayName });
  };

  const handleConfirmDeleteBank = async () => {
    if (!deleteBankTarget) return;

    setDeletingBank(true);
    try {
      const { error } = await supabase
        .from('custom_banks')
        .delete()
        .eq('id', deleteBankTarget.id);

      if (error) throw error;

      toast.success(`Banco "${deleteBankTarget.name}" eliminado exitosamente`, 'Banco eliminado');
      setDeleteBankTarget(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Error al eliminar el banco', 'Error');
    } finally {
      setDeletingBank(false);
    }
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove or replace dangerous characters
    // Allow: letters, numbers, spaces, dots, dashes, underscores, parentheses
    return fileName.replace(/[^a-zA-Z0-9\s.\-_()]/g, '_').trim();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    // Security: PDF bank statements disabled by default for privacy
    const validExtensions = enableBankStatementPDF ? ['.csv', '.xls', '.xlsx', '.pdf'] : ['.csv', '.xls', '.xlsx'];
    const validFiles = droppedFiles.filter(file =>
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (validFiles.length > 0) {
      setFiles(validFiles);
      // Initialize file names with original names
      const initialNames: Record<number, string> = {};
      validFiles.forEach((file, idx) => {
        initialNames[idx] = file.name;
      });
      setFileNames(initialNames);
      parseFiles(validFiles);
    } else {
      const allowedFormats = enableBankStatementPDF ? 'CSV, XLS/XLSX o PDF' : 'CSV o XLS/XLSX';
      toast.error(`Por favor sube archivos ${allowedFormats} válidos`, 'Archivos inválidos');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      // Initialize file names with original names
      const initialNames: Record<number, string> = {};
      selectedFiles.forEach((file, idx) => {
        initialNames[idx] = file.name;
      });
      setFileNames(initialNames);
      parseFiles(selectedFiles);
    }
  };

  const parseFiles = async (filesToParse: File[]) => {
    setParsing(true);
    setParsedFiles([]);
    setSelectedCategories({});

    try {
      // Load categories first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { data: fetchedCategories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (catError) {
        console.error('Error fetching categories:', catError);
        throw new Error(`Error al obtener categorías: ${catError.message}`);
      }

      if (!fetchedCategories || fetchedCategories.length === 0) {
        console.warn('No categories found, transactions will be imported without categories');
        setCategories([]);
        toast.info('No tienes categorías creadas. Las transacciones se importarán sin categoría.', 'Sin categorías');
      } else {
        setCategories(fetchedCategories.map(c => ({ id: c.id, name: c.name, color: c.color, type: c.type, parentId: c.parent_id })));
      }

      // Parse each file separately
      const parsedFilesData: FileWithData[] = [];

      for (let i = 0; i < filesToParse.length; i++) {
        const file = filesToParse[i];
        const fileName = file.name.toLowerCase();
        let result: ParserResult;

        // Use API route for PDF files, local parser for XLS/CSV
        if (fileName.endsWith('.pdf')) {
          // Use API route for PDF processing
          const formData = new FormData();
          formData.append('file', file);
          formData.append('currency', currency);

          try {
            const response = await fetch('/api/statements/parse-pdf', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Error al procesar PDF');
            }

            result = await response.json();
          } catch (error) {
            result = {
              success: false,
              transactions: [],
              errors: [`Error al procesar PDF: ${error}`],
            };
          }
        } else {
          // Use local parser for XLS/CSV
          result = await parseStatement(file);
        }

        const fileErrors: string[] = [];

        if (!result.success) {
          fileErrors.push(...result.errors);
          parsedFilesData.push({
            file,
            fileName: fileNames[i] || file.name,
            transactions: [],
            errors: fileErrors,
            metadata: null,
            dateRange: null,
          });
          continue;
        }

        // Deduplicate transactions first
        const { unique: uniqueTransactions, duplicates } = deduplicateTransactions(result.transactions);

        if (duplicates.length > 0) {
          console.warn(`🔄 Found ${duplicates.length} duplicate transactions in file ${i + 1}`);
          fileErrors.push(`ℹ️ Se encontraron ${duplicates.length} transacciones duplicadas y fueron eliminadas`);
        }

        // Validate transactions
        const { valid, invalid } = validateTransactions(uniqueTransactions);

        if (invalid.length > 0) {
          console.warn('Transacciones inválidas:', invalid);
          fileErrors.push(...invalid.map(i => `❌ ${i.transaction.vendor}: ${i.reason}`));
        }

        // Log how many transactions were extracted vs valid
        console.log(`📊 File ${i + 1}: Extracted ${result.transactions.length} transactions, ${duplicates.length} duplicates removed, ${valid.length} valid, ${invalid.length} invalid`);

        // Calculate date range
        let dateRange: { start: string; end: string } | null = null;
        if (valid.length > 0) {
          const dates = valid.map(tx => tx.date).sort();
          dateRange = {
            start: dates[0],
            end: dates[dates.length - 1],
          };
        }

        const resultWithBankInfo = result as ParserResult & { detectedBank?: string; detectionConfidence?: string };

        parsedFilesData.push({
          file,
          fileName: fileNames[i] || file.name,
          transactions: valid,
          errors: fileErrors,
          metadata: result.metadata || null,
          dateRange,
          detectedBank: resultWithBankInfo.detectedBank,
          detectionConfidence: resultWithBankInfo.detectionConfidence,
        });
      }

      setParsedFiles(parsedFilesData);

      const totalTransactions = parsedFilesData.reduce((sum, f) => sum + f.transactions.length, 0);
      if (totalTransactions === 0) {
        toast.warning('No se encontraron transacciones válidas en los archivos', 'Sin transacciones');
      }

    } catch (error) {
      console.error('Error parsing files:', error);
      toast.error('Error al procesar los archivos. Verifica el formato.', 'Error de formato');
    } finally {
      setParsing(false);
    }
  };

  const handleApplyRules = async () => {
    setApplyingRules(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Load user categorization rules
      const { data: userRules } = await supabase
        .from('categorization_rules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (!userRules || userRules.length === 0) {
        toast.info('No tienes reglas de categorización activas', 'Sin reglas');
        return;
      }

      const allTransactions = parsedFiles.flatMap(f => f.transactions);
      const newSelectedCategories: Record<number, string> = { ...selectedCategories };
      let matchedCount = 0;

      // Apply rules to each transaction
      for (let i = 0; i < allTransactions.length; i++) {
        const tx = allTransactions[i];

        // Skip if already manually selected
        if (selectedCategories[i]) continue;

        // Try to match with rules
        for (const rule of userRules) {
          let ruleMatches = false;

          // Split match_value by comma to support multiple values (OR logic)
          const matchValues = rule.match_value.split(',').map(v => v.trim()).filter(v => v);

          // Normalize vendor for matching (remove extra spaces, special chars)
          const normalizedVendor = tx.vendor.toLowerCase().trim().replace(/\s+/g, ' ');
          const normalizedReference = (tx.reference || '').toLowerCase().trim().replace(/\s+/g, ' ');

          switch (rule.rule_type) {
            case 'vendor_contains':
              ruleMatches = matchValues.some(value => {
                const normalizedValue = value.toLowerCase().trim();
                return normalizedVendor.includes(normalizedValue);
              });
              break;
            case 'vendor_equals':
              ruleMatches = matchValues.some(value => {
                const normalizedValue = value.toLowerCase().trim();
                return normalizedVendor === normalizedValue;
              });
              break;
            case 'description_contains':
              ruleMatches = matchValues.some(value => {
                const normalizedValue = value.toLowerCase().trim();
                return normalizedReference.includes(normalizedValue);
              });
              break;
            case 'amount_equals':
              ruleMatches = tx.amount === parseFloat(matchValues[0]);
              break;
            case 'amount_greater':
              ruleMatches = tx.amount > parseFloat(matchValues[0]);
              break;
            case 'amount_less':
              ruleMatches = tx.amount < parseFloat(matchValues[0]);
              break;
          }

          if (ruleMatches) {
            newSelectedCategories[i] = rule.category_id;
            matchedCount++;
            break; // Use first matching rule
          }
        }
      }

      setSelectedCategories(newSelectedCategories);
      toast.success(
        `${matchedCount} de ${allTransactions.length} transacciones categorizadas automáticamente`,
        'Reglas aplicadas'
      );
    } catch (error) {
      console.error('Error applying rules:', error);
      toast.error('Error al aplicar reglas de categorización', 'Error');
    } finally {
      setApplyingRules(false);
    }
  };

  const handleImport = async () => {
    const allTransactions = parsedFiles.flatMap(f => f.transactions);
    if (allTransactions.length === 0) return;

    setImportStatus('importing');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Get all categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (catError) {
        console.error('Error fetching categories:', catError);
        throw new Error(`Error al obtener categorías: ${catError.message}`);
      }

      if (!categories || categories.length === 0) {
        console.warn('No categories found, transactions will be imported without categories');
        toast.info('No tienes categorías creadas. Las transacciones se importarán sin categoría.', 'Sin categorías');
      }

      const errors: string[] = [];
      const skipped: string[] = [];
      let imported = 0;

      // Check for existing transactions to avoid duplicates
      const { data: existingTransactions } = await supabase
        .from('transactions')
        .select('vendor, date, amount, type, currency')
        .eq('user_id', user.id);

      const existingSignatures = new Set(
        existingTransactions?.map(t =>
          `${t.vendor}|${t.date}|${t.amount}|${t.type}|${t.currency}`
        ) || []
      );

      // Load user categorization rules
      const { data: userRules } = await supabase
        .from('categorization_rules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      // Get bank display name from selected custom bank
      const bankDisplayName = selectedBank
        ? customBanks.find(b => `custom_${b.id}` === selectedBank)?.displayName || null
        : null;

      // FIRST: Create bank statement records for each file and get their IDs
      const statementIdMap = new Map<string, string>(); // fileName -> statement_id

      for (const fileData of parsedFiles) {
        if (fileData.transactions.length > 0 && fileData.dateRange) {
          const fileName = fileData.fileName.toLowerCase();
          const format = fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.csv') ? 'CSV' : 'XLS';

          const { data: statementData, error: statementError } = await supabase
            .from('bank_statements')
            .insert({
              user_id: user.id,
              file_path: `uploads/${user.id}/${fileData.fileName}`,
              file_name: fileData.fileName,
              period_start: fileData.dateRange.start,
              period_end: fileData.dateRange.end,
              status: 'completed',
              transactions_count: fileData.transactions.length,
              bank: bankDisplayName,
              format: format,
              currency: currency,
            })
            .select('id')
            .single();

          if (statementError) {
            console.error('Error creating statement:', statementError);
            throw new Error(`Error al crear registro de extracto: ${statementError.message}`);
          }

          if (statementData) {
            statementIdMap.set(fileData.fileName, statementData.id);
          }
        }
      }

      // SECOND: Prepare all transactions for batch insert, maintaining file association
      const transactionsToInsert = [];
      let globalTxIndex = 0; // Track global transaction index across all files

      for (const fileData of parsedFiles) {
        const statementId = statementIdMap.get(fileData.fileName);

        if (!statementId) {
          console.warn(`No statement_id found for file: ${fileData.fileName}`);
          continue;
        }

        for (const tx of fileData.transactions) {
          // Check if this transaction is a duplicate
          const signature = `${tx.vendor}|${tx.date}|${tx.amount}|${tx.type}|${tx.currency}`;
          if (existingSignatures.has(signature)) {
            skipped.push(signature);
            globalTxIndex++;
            continue; // Skip duplicates
          }

          // Get category from selectedCategories using global index
          // Ensure empty strings are converted to null (PostgreSQL UUID columns don't accept "")
          let categoryId = selectedCategories[globalTxIndex] || null;
          if (categoryId === '') categoryId = null;
          let confidenceScore = 1.0;

          // If user didn't select, try automatic rules
          if (!categoryId && userRules && userRules.length > 0) {
            for (const rule of userRules) {
              let ruleMatches = false;

              // Split match_value by comma to support multiple values (OR logic)
              const matchValues = rule.match_value.split(',').map(v => v.trim()).filter(v => v);

              // Normalize vendor for matching (remove extra spaces, special chars)
              const normalizedVendor = tx.vendor.toLowerCase().trim().replace(/\s+/g, ' ');
              const normalizedReference = (tx.reference || '').toLowerCase().trim().replace(/\s+/g, ' ');

              switch (rule.rule_type) {
                case 'vendor_contains':
                  ruleMatches = matchValues.some(value => {
                    const normalizedValue = value.toLowerCase().trim();
                    return normalizedVendor.includes(normalizedValue);
                  });
                  break;
                case 'vendor_equals':
                  ruleMatches = matchValues.some(value => {
                    const normalizedValue = value.toLowerCase().trim();
                    return normalizedVendor === normalizedValue;
                  });
                  break;
                case 'description_contains':
                  ruleMatches = matchValues.some(value => {
                    const normalizedValue = value.toLowerCase().trim();
                    return normalizedReference.includes(normalizedValue);
                  });
                  break;
                case 'amount_equals':
                  ruleMatches = tx.amount === parseFloat(matchValues[0]);
                  break;
                case 'amount_greater':
                  ruleMatches = tx.amount > parseFloat(matchValues[0]);
                  break;
                case 'amount_less':
                  ruleMatches = tx.amount < parseFloat(matchValues[0]);
                  break;
              }

              if (ruleMatches) {
                categoryId = rule.category_id;
                confidenceScore = 1.0;
                const matchedValue = matchValues.find(value => {
                  const normalizedValue = value.toLowerCase().trim();
                  if (rule.rule_type === 'vendor_contains') {
                    return normalizedVendor.includes(normalizedValue);
                  } else if (rule.rule_type === 'description_contains') {
                    return normalizedReference.includes(normalizedValue);
                  }
                  return value;
                });
                console.log(`✓ ${tx.vendor} -> RULE MATCH (${rule.rule_type}: "${matchedValue}")`);
                break;
              }
            }
          }

          // If no category assigned, leave it as null (uncategorized)
          // Don't use fallback - let the user categorize manually later

          // Check if it's a refund/reversal - mark as ignored
          const isRefund = tx.isRefund || false;

          transactionsToInsert.push({
            user_id: user.id,
            category_id: categoryId || null, // Allow null for uncategorized (already sanitized above)
            date: tx.date,
            vendor: tx.vendor,
            amount: tx.amount,
            type: tx.type,
            currency: tx.currency,
            bank: bankDisplayName,
            statement_id: statementId, // ✅ NOW ASSOCIATING WITH STATEMENT!
            is_manually_verified: selectedCategories[globalTxIndex] ? true : false,
            is_ignored: isRefund, // Auto-ignore refunds
            confidence_score: confidenceScore,
            notes: tx.reference || null,
          });

          globalTxIndex++;
        }
      }

      console.log(`Importing ${transactionsToInsert.length} transactions (${skipped.length} duplicates skipped)`);

      // Early exit if all transactions are duplicates
      if (transactionsToInsert.length === 0) {
        toast.info('Todas las transacciones ya existen en el sistema', 'Transacciones duplicadas');
        setImportStatus('idle');
        return;
      }

      // BATCH INSERT - UNA SOLA LLAMADA
      if (transactionsToInsert.length > 0) {
        const uncategorizedCount = transactionsToInsert.filter(t => !t.category_id).length;
        console.log(`🚀 Batch inserting ${transactionsToInsert.length} transactions (${uncategorizedCount} sin categoría)...`);

        const { data: insertedData, error: batchError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert)
          .select();

        if (batchError) {
          console.error('Batch insert error:', batchError);
          errors.push(`Error en batch insert: ${batchError.message}`);
        } else {
          imported = insertedData?.length || 0;
          console.log(`✅ Successfully inserted ${imported} transactions in batch`);

          if (uncategorizedCount > 0) {
            console.log(`ℹ️ ${uncategorizedCount} transacciones quedaron sin categoría - puedes categorizarlas manualmente`);
          }
        }
      }

      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }

      if (skipped.length > 0) {
        console.warn('Transacciones duplicadas omitidas:', skipped);
      }

      if (imported > 0) {
        // Bank statements were already created at the beginning (lines 708-742)
        // No need to create them again here

        setImportStatus('success');

        // Refresh statements list
        const { data: updatedStatements } = await supabase
          .from('bank_statements')
          .select('*')
          .eq('user_id', user.id)
          .order('upload_date', { ascending: false });

        if (updatedStatements) {
          setStatements(updatedStatements);
        }

        // Count uncategorized transactions
        const uncategorizedCount = transactionsToInsert.filter(t => !t.category_id).length;
        const message = uncategorizedCount > 0
          ? `Se importaron ${imported} transacciones.\n${uncategorizedCount} quedaron sin categoría y puedes categorizarlas manualmente en "Transacciones" → "Sin Categoría".`
          : `Se importaron ${imported} transacciones correctamente`;

        toast.success(message, 'Importación exitosa');
        setTimeout(() => {
          setImportStatus('idle');
          setFiles([]);
          setFileNames({});
          setParsedFiles([]);
          setSelectedCategories({});
          setSelectedBank('');
        }, 3000);
      } else {
        setImportStatus('error');
        const message = skipped.length > 0
          ? `Todas las transacciones ya existen (${skipped.length} duplicadas omitidas)`
          : `No se pudieron importar las transacciones:\n${errors.join('\n')}`;
        toast.error(message, 'Error de importación');
      }
    } catch (error) {
      console.error('Error importing:', error);
      setImportStatus('error');
      const message = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(message, 'Error al importar');
    }
  };

  const totalFilesProcessed = statements.length;
  const totalTransactionsProcessed = statements.reduce((sum, s) => sum + s.transactions_count, 0);
  const currentSessionTx = parsedFiles.reduce((sum, f) => sum + f.transactions.length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Extractos Bancarios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Importa y gestiona tus extractos bancarios
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'upload'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <UploadIcon className="h-4 w-4" />
            Subir Extractos
          </div>
          {activeTab === 'upload' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'history'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial de Extractos ({statements.length})
          </div>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'banks'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Gestión de Bancos ({customBanks.length})
          </div>
          {activeTab === 'banks' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Content: Subir Extractos */}
      {activeTab === 'upload' && (
        <>
          {/* Header with Quick Actions */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">Estadísticas</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomBankModal(true)}
              className="flex items-center gap-2 text-xs"
            >
              <Building2 className="h-3.5 w-3.5" />
              Gestionar Bancos
            </Button>
          </div>

          {/* Summary Cards - Expanded Grid with Animation */}
          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            variants={motionVariants.staggerContainer}
            initial="initial"
            animate="animate"
          >
        <motion.div variants={motionVariants.staggerItem}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Extractos Procesados</p>
                <p className="text-2xl font-bold text-foreground">{totalFilesProcessed}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total registrados</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={motionVariants.staggerItem}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Transacciones</p>
                <p className="text-2xl font-bold text-foreground">{totalTransactionsProcessed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Importadas en total</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={motionVariants.staggerItem}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">En Sesión Actual</p>
                <p className="text-2xl font-bold text-foreground">{currentSessionTx > 0 ? currentSessionTx : '0'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Por importar</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={motionVariants.staggerItem}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Reglas Activas</p>
                <p className="text-2xl font-bold text-foreground">{activeRulesCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Auto-categorización</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Privacy Notice */}
      <PrivacyNotice />

      {/* Bank Export Guide */}
      <BankExportGuide />

      {/* Upload Area */}
      <Card className="p-4">
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: dragging ? 1.02 : 1,
            borderColor: dragging ? 'var(--primary)' : 'var(--border)',
            backgroundColor: dragging ? 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' : 'transparent'
          }}
          whileHover={!dragging && files.length === 0 ? { scale: 1.01, borderColor: 'var(--primary)' } : {}}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200
            ${dragging ? 'border-primary shadow-lg shadow-primary/20' : 'border-border bg-muted/20'}
            ${files.length > 0 ? 'bg-muted/30 border-border' : ''}
            ${parsing ? 'bg-muted/30 border-primary' : ''}
          `}
        >
          {files.length === 0 ? (
            <>
              <motion.div
                className="inline-flex w-16 h-16 rounded-xl mb-4 bg-muted items-center justify-center"
                animate={dragging ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.5, repeat: dragging ? Infinity : 0 }}
              >
                <UploadIcon className="h-10 w-10 text-foreground" />
              </motion.div>
              <motion.h3
                className="text-lg font-bold text-foreground mb-2"
                animate={dragging ? { scale: 1.05 } : { scale: 1 }}
              >
                {dragging ? '¡Suelta aquí!' : 'Arrastra tus extractos aquí'}
              </motion.h3>
              <p className="text-sm text-muted-foreground mb-1">
                o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                {enableBankStatementPDF
                  ? 'Soporta PDF, CSV, XLS y XLSX de BBVA, Scotia e Itaú'
                  : 'Soporta CSV, XLS y XLSX de todos los bancos'}
              </p>
              <input
                type="file"
                accept={enableBankStatementPDF ? '.csv,.xls,.xlsx,.pdf' : '.csv,.xls,.xlsx'}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                multiple
              />
              <motion.label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <UploadIcon className="h-5 w-5" />
                Seleccionar Archivos
              </motion.label>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Formato CSV esperado
                </p>
                <div className="text-xs font-mono bg-muted border border-border p-4 rounded-lg text-left max-w-md mx-auto">
                  <div className="text-foreground font-semibold mb-2">Fecha,Concepto,Monto,Tipo</div>
                  <div className="text-muted-foreground">2025-10-01,Del Campo,3500,Gasto</div>
                  <div className="text-muted-foreground">2025-10-05,Alquiler,50000,Ingreso</div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              {parsing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mb-4"
                >
                  <div className="flex items-center gap-3 text-primary bg-blue-100 dark:bg-primary/10 px-6 py-3 rounded-lg">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-5 w-5 border-3 border-primary border-t-transparent rounded-full"
                    />
                    <span className="text-base font-semibold">Procesando archivos...</span>
                  </div>

                  {/* Skeleton loaders for files being parsed */}
                  {files.map((_, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Skeleton variant="rounded" width={40} height={40} />
                          <div className="flex-1 space-y-2">
                            <Skeleton variant="text" width="60%" height={16} />
                            <Skeleton variant="text" width="40%" height={14} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Skeleton variant="rounded" height={60} />
                          <Skeleton variant="rounded" height={60} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {!parsing && parsedFiles.length > 0 && (
                <div className="flex items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {parsedFiles.map(f => f.fileName).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {parsedFiles.reduce((sum, f) => sum + f.transactions.length, 0)} transacciones
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFiles([]);
                        setFileNames({});
                        setParsedFiles([]);
                        setSelectedCategories({});
                        setSelectedBank('');
                      }}
                    >
                      Cancelar
                    </Button>
                    {parsedFiles.some(f => f.transactions.length > 0) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleImport}
                        disabled={importStatus === 'importing'}
                      >
                        {importStatus === 'importing' ? 'Importando...' : 'Importar'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </Card>

      {/* Bank Selector */}
      {parsedFiles.some(f => f.transactions.length > 0) && (
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-1">
                Banco del Extracto
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Selecciona el banco del cual provienen las transacciones. Esta información se guardará con cada transacción.
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedBank}
                    onChange={(value) => setSelectedBank(value)}
                    placeholder="Seleccionar banco..."
                    options={customBanks.map(bank => ({
                      value: `custom_${bank.id}`,
                      label: bank.displayName,
                      color: bank.color,
                    }))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomBankModal(true)}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Banco
                </Button>
              </div>
              {selectedBank && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>
                    Las transacciones se importarán como <span className="font-semibold text-foreground">
                      {customBanks.find(b => `custom_${b.id}` === selectedBank)?.displayName}
                    </span>
                  </span>
                </div>
              )}

              {customBanks.length < 8 && (
                <div className="mt-3">
                  <SuggestedBanks
                    onBankCreated={handleCustomBankCreated}
                    existingBanks={customBanks}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Preview Table */}
      {parsedFiles.some(f => f.transactions.length > 0) && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Vista Previa de Transacciones
              </h3>
              <p className="text-sm text-muted-foreground">
                {parsedFiles.reduce((sum, f) => sum + f.transactions.length, 0)} transacciones listas para importar
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleApplyRules}
                disabled={applyingRules}
                className="flex items-center gap-2"
              >
                {applyingRules ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Aplicar Reglas
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Totals by Currency */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              // Calculate totals by currency
              const allTransactions = parsedFiles.flatMap(f => f.transactions);
              const totalsByCurrency = allTransactions.reduce((acc, tx) => {
                if (!acc[tx.currency]) {
                  acc[tx.currency] = { total: 0, count: 0, expenses: 0, income: 0 };
                }
                acc[tx.currency].total += tx.amount;
                acc[tx.currency].count += 1;
                if (tx.type === 'expense') {
                  acc[tx.currency].expenses += tx.amount;
                } else {
                  acc[tx.currency].income += tx.amount;
                }
                return acc;
              }, {} as Record<string, { total: number; count: number; expenses: number; income: number }>);

              return Object.entries(totalsByCurrency).map(([currency, data]) => (
                <Card key={currency} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold px-2 py-1 rounded bg-muted text-foreground">
                      {currency}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {data.count} tx
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gastos</span>
                      <span className="font-bold text-error">
                        {currency} {data.expenses.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ingresos</span>
                      <span className="font-bold text-success">
                        {currency} {data.income.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-foreground">
                        {currency} {data.total.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </Card>
              ));
            })()}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Archivo
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Concepto
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Referencia
                  </th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                    Monto
                  </th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">
                    Moneda
                  </th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Categoría
                  </th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground w-32">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="block text-xs font-semibold text-foreground">Auto-categorizar</span>
                      <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span>Nueva regla</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Plus className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span>Añadir a existente</span>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {parsedFiles.flatMap((fileData, fileIdx) =>
                  fileData.transactions.map((tx, txIdx) => {
                    const globalIdx = parsedFiles.slice(0, fileIdx).reduce((sum, f) => sum + f.transactions.length, 0) + txIdx;
                    return (
                      <tr key={`${fileIdx}-${txIdx}`} className={`border-b border-border hover:bg-muted/50 ${
                        tx.isRefund ? 'bg-orange-50 dark:bg-orange-950/20' : ''
                      }`}>
                        <td className="py-1.5 px-2 text-xs text-muted-foreground">{fileData.fileName.split('.')[0].slice(0, 15)}</td>
                        <td className="py-1.5 px-2 text-xs">{tx.date}</td>
                        <td className="py-1.5 px-2 text-xs font-medium">
                          <div className="flex items-center gap-1">
                            {tx.vendor}
                            {tx.isRefund && (
                              <span className="text-xs px-2 py-0.5 bg-orange-200 dark:bg-orange-950 text-orange-900 dark:text-orange-300 rounded font-bold border border-orange-300 dark:border-orange-800" title="Devolución - se ignorará automáticamente">
                                DEVOLUCIÓN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-1.5 px-2 text-xs text-muted-foreground max-w-[200px] truncate" title={tx.reference || '-'}>
                          {tx.reference || '-'}
                        </td>
                        <td className={`py-1.5 px-2 text-xs text-right font-semibold ${
                          tx.type === 'income' ? 'text-success' : 'text-error'
                        }`}>
                          {tx.amount.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-muted text-foreground">
                            {tx.currency}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            tx.type === 'income'
                              ? 'bg-success/10 text-success'
                              : 'bg-error/10 text-error'
                          }`}>
                            {tx.type === 'income' ? 'Ing' : 'Gas'}
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          <div className="flex items-center gap-1">
                            <div className="flex-1 min-w-0">
                              <Select
                                value={selectedCategories[globalIdx] || ''}
                                onChange={(value) => {
                                  setSelectedCategories(prev => ({
                                    ...prev,
                                    [globalIdx]: value
                                  }));
                                }}
                                placeholder="Seleccionar..."
                                options={categories
                                  .sort((a, b) => {
                                    if (!a.parentId && b.parentId) return -1;
                                    if (a.parentId && !b.parentId) return 1;
                                    return a.name.localeCompare(b.name);
                                  })
                                  .map(cat => {
                                    const parent = cat.parentId ? categories.find(c => c.id === cat.parentId) : null;
                                    return {
                                      value: cat.id,
                                      label: cat.name,
                                      description: parent ? `↳ ${parent.name}` : undefined,
                                      color: cat.color,
                                    };
                                  })}
                              />
                            </div>
                            {selectedCategories[globalIdx] && (
                              <span className="flex-shrink-0 text-[10px] text-success font-medium px-1.5 py-0.5 bg-success/10 rounded" title="Auto-categorizada por regla">
                                <Zap className="h-3 w-3" />
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setVendorForNewCategory(tx.vendor);
                                setShowQuickCategoryModal(true);
                              }}
                              className="flex-shrink-0 p-1 hover:bg-primary/10 rounded text-primary hover:text-primary/80 transition-colors"
                              title="Crear nueva categoría"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <div className="flex gap-1 items-center justify-center">
                            <button
                              onClick={() => handleCreateRuleClick(tx.vendor, selectedCategories[globalIdx], globalIdx)}
                              className="inline-flex items-center justify-center p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="⚡ NUEVA REGLA: Crear regla automática para este concepto. Ejemplo: todas las compras de 'MCDONALDS' se categorizarán automáticamente como 'Comida' en el futuro."
                            >
                              <Zap className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleAddToRuleClick(tx.vendor)}
                              className="inline-flex items-center justify-center p-1.5 hover:bg-green-50 dark:hover:bg-green-950 rounded text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                              title="➕ AÑADIR A REGLA EXISTENTE: Si ya tienes una regla para 'Comida', añade este concepto a esa regla. Útil cuando varios conceptos deben tener la misma categoría."
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Import Status - Success Celebration */}
      {importStatus === 'success' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Card className="p-6 border-success bg-success/5 shadow-lg shadow-success/20">
            <motion.div
              className="flex items-center gap-4"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="h-6 w-6 text-success" />
              </motion.div>
              <div>
                <motion.h3
                  className="font-semibold text-foreground mb-1 text-lg"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ¡Importación exitosa! 🎉
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Se importaron las transacciones correctamente
                </motion.p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      )}
        </>
      )}

      {/* Tab Content: Historial de Extractos */}
      {activeTab === 'history' && (
        <>
          {/* Statistics by Bank/Format */}
      {statements.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Distribución por Banco</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomBankModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Banco
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(() => {
              const bankStats = statements.reduce((acc, s) => {
                const bank = s.bank || 'Desconocido';
                if (!acc[bank]) {
                  acc[bank] = { count: 0, transactions: 0 };
                }
                acc[bank].count += 1;
                acc[bank].transactions += s.transactions_count;
                return acc;
              }, {} as Record<string, { count: number; transactions: number }>);

              return Object.entries(bankStats).map(([bank, stats]) => (
                <div key={bank} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      bank.includes('BBVA') ? 'bg-blue-500' :
                      bank.includes('Scotia') ? 'bg-red-500' :
                      bank.includes('Itaú') ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <p className="text-xs font-medium text-foreground truncate">{bank}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{stats.count}</p>
                  <p className="text-xs text-muted-foreground">{stats.transactions} tx</p>
                </div>
              ));
            })()}
          </div>
        </Card>
      )}

      {/* Statements History Section with Progressive Disclosure */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Historial de Extractos</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {statements.length} estado(s) de cuenta registrado(s)
                </p>
              </div>
              {statements.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistoryDetails(!showHistoryDetails)}
                    className="flex items-center gap-2"
                  >
                    {showHistoryDetails ? (
                      <>
                        <span>Ocultar detalles</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Ver detalles</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAllClick}
                    disabled={loadingStatements || deleting || deletingAll}
                    className="flex items-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Eliminar Todos
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {loadingStatements ? (
          <Card className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm">Cargando extractos...</span>
            </div>
          </Card>
        ) : statements.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay extractos registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Los extractos que subas aparecerán aquí
            </p>
          </Card>
        ) : showHistoryDetails ? (
          <>
            {/* Bulk Actions Bar */}
            {selectedStatements.size > 0 && (
              <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {selectedStatements.size} extracto(s) seleccionado(s)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStatements(new Set())}
                      className="text-xs"
                    >
                      Deseleccionar todos
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkEditBanks}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Editar Bancos
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={deleting}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-center py-2 px-3 w-12">
                    <input
                      type="checkbox"
                      checked={statements.length > 0 && selectedStatements.size === statements.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Archivo
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Banco
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Formato
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Moneda
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Fecha de Subida
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Período
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Transacciones
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {statements.map((statement) => (
                  <tr key={statement.id} className="border-b border-border hover:bg-muted/30">
                    <td className="text-center py-2 px-3">
                      <input
                        type="checkbox"
                        checked={selectedStatements.has(statement.id)}
                        onChange={() => handleSelectStatement(statement.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      />
                    </td>
                    <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          {editingId === statement.id ? (
                            <div className="flex-1 flex items-center gap-1">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(sanitizeFileName(e.target.value))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                className="flex-1 text-xs border border-primary rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                                placeholder="Nombre del archivo"
                                autoFocus
                                disabled={saving}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveEdit}
                                disabled={saving || !editingName.trim()}
                                className="h-6 w-6 p-0 text-success hover:bg-success/10"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="h-6 w-6 p-0 text-error hover:bg-error/10"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-between group">
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  {statement.file_name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {statement.file_path.split('/').pop()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(statement.id, statement.file_name)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {editingBankId === statement.id ? (
                          <div className="flex items-center gap-1">
                            <div className="flex-1 min-w-[140px]">
                              <Select
                                value={editingBankValue}
                                onChange={(value) => setEditingBankValue(value)}
                                placeholder="Seleccionar..."
                                options={customBanks.map(bank => ({
                                  value: `custom_${bank.id}`,
                                  label: bank.displayName,
                                  color: bank.color,
                                }))}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveBankEdit}
                              disabled={saving}
                              className="h-6 w-6 p-0 text-success hover:bg-success/10"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelBankEdit}
                              disabled={saving}
                              className="h-6 w-6 p-0 text-error hover:bg-error/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                            <div className="text-xs text-foreground">
                              {statement.bank || <span className="text-muted-foreground">-</span>}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBankEditClick(statement.id, statement.bank)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs text-foreground">
                          {statement.format || <span className="text-muted-foreground">-</span>}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                          {statement.currency || 'UYU'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(statement.upload_date)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {statement.period_start && statement.period_end ? (
                          <div className="text-xs text-foreground">
                            <p>{formatDate(statement.period_start)}</p>
                            <p className="text-[10px] text-muted-foreground">
                              hasta {formatDate(statement.period_end)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                          {statement.transactions_count}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {getStatusBadge(statement.status)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(statement.id, statement.file_name)}
                          disabled={deleting}
                          className="h-6 w-6 p-0 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Haz clic en "Ver detalles" para ver el historial completo
              </p>
            </Card>
          </motion.div>
        )}
      </div>
        </>
      )}

      {/* Tab Content: Gestión de Bancos */}
      {activeTab === 'banks' && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Administra las instituciones bancarias disponibles
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreateBankClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Banco
            </Button>
          </div>

          {/* Search */}
          <Card className="p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar banco..."
                value={searchQueryBanks}
                onChange={(e) => setSearchQueryBanks(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQueryBanks && (
                <button
                  onClick={() => setSearchQueryBanks('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>

          {/* Banks Grid */}
          {customBanks.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay bancos personalizados
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primer banco personalizado para comenzar
              </p>
              <Button variant="primary" onClick={handleCreateBankClick}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Banco
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customBanks
                .filter(bank => {
                  const matchesSearch = bank.displayName.toLowerCase().includes(searchQueryBanks.toLowerCase()) ||
                                       bank.name.toLowerCase().includes(searchQueryBanks.toLowerCase());
                  return matchesSearch;
                })
                .map((bank) => (
                  <Card
                    key={bank.id}
                    className="p-4 hover:shadow-lg transition-shadow relative group"
                  >
                    {/* Bank Color Indicator */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                      style={{ backgroundColor: bank.color }}
                    />

                    {/* Actions */}
                    <div className="flex items-start justify-end mb-3 mt-2">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditBankClick(bank)}
                          className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBankClick(bank)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${bank.color}20` }}
                      >
                        <Building2 className="h-6 w-6" style={{ color: bank.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {bank.displayName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {bank.name}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Extractos:</span>
                        <span className="font-semibold text-foreground">
                          {(bankStats[bank.displayName]?.statementsCount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Transacciones:</span>
                        <span className="font-semibold text-foreground">
                          {(bankStats[bank.displayName]?.transactionsCount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </>
      )}

      {/* Quick Category Modal */}
      <QuickCategoryModal
        isOpen={showQuickCategoryModal}
        onClose={() => {
          setShowQuickCategoryModal(false);
          setVendorForNewCategory(undefined);
        }}
        onCategoryCreated={handleCategoryCreated}
        initialType="expense"
        vendor={vendorForNewCategory}
      />

      {/* Quick Rule Modal */}
      <QuickRuleModal
        isOpen={showQuickRuleModal && selectedTransactionForRule !== null}
        onClose={() => {
          setShowQuickRuleModal(false);
          setSelectedTransactionForRule(null);
        }}
        onRuleCreated={handleRuleCreated}
        vendor={selectedTransactionForRule?.vendor || ''}
        categories={categories}
        selectedCategoryId={selectedTransactionForRule?.categoryId}
      />

      {/* Add to Rule Modal */}
      <AddToRuleModal
        isOpen={showAddToRuleModal}
        onClose={() => {
          setShowAddToRuleModal(false);
          setVendorForAddToRule('');
        }}
        onRuleUpdated={handleRuleUpdated}
        vendor={vendorForAddToRule}
      />

      {/* Custom Bank Modal */}
      <CustomBankModal
        isOpen={showCustomBankModal}
        onClose={() => {
          setShowCustomBankModal(false);
          setEditingBank(null);
        }}
        onBankCreated={handleCustomBankCreated}
        bank={editingBank}
        existingBanks={customBanks}
      />

      {/* Delete Statement Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar extracto"
        message={`¿Estás seguro de eliminar el extracto &ldquo;${deleteTarget?.fileName}&rdquo;?\n\nNOTA: Esto NO eliminará las transacciones que ya fueron importadas.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
      />

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                <Trash className="h-5 w-5 text-error" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                ¿Eliminar todos los extractos?
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Esta acción eliminará <span className="font-semibold text-foreground">{statements.length}</span> extracto(s)
                de forma permanente del historial.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">NOTA:</strong> Esto NO eliminará las transacciones que ya fueron importadas.
              </p>
              <p className="text-sm text-error font-medium">
                Esta acción no se puede deshacer.
              </p>

              <div className="pt-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Para confirmar, escribe <span className="font-mono font-bold">ELIMINAR</span>
                </label>
                <input
                  type="text"
                  value={deleteAllConfirm}
                  onChange={(e) => setDeleteAllConfirm(e.target.value)}
                  placeholder="ELIMINAR"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-error/50"
                  autoFocus
                  disabled={deletingAll}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCancelDeleteAll}
                disabled={deletingAll}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={deleteAllConfirm !== 'ELIMINAR' || deletingAll}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {deletingAll ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    Eliminar Todo
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Edit Banks Modal */}
      {showBulkEditModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Editar Bancos en Lote
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Cambiar el banco de <span className="font-semibold text-foreground">{selectedStatements.size}</span> extracto(s) seleccionado(s).
              </p>

              <div className="pt-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Seleccionar nuevo banco
                </label>
                <Select
                  value={bulkEditBank}
                  onChange={(value) => setBulkEditBank(value)}
                  placeholder="Seleccionar banco..."
                  options={customBanks.map(bank => ({
                    value: `custom_${bank.id}`,
                    label: bank.displayName,
                    color: bank.color,
                  }))}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Nota:</strong> Esta acción actualizará el banco en todos los extractos y sus transacciones asociadas.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkEditModal(false);
                  setBulkEditBank('');
                }}
                disabled={saving}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleSaveBulkEdit}
                disabled={!bulkEditBank || saving}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Bank Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteBankTarget !== null}
        onClose={() => !deletingBank && setDeleteBankTarget(null)}
        onConfirm={handleConfirmDeleteBank}
        title="Eliminar banco"
        message={`¿Estás seguro de eliminar el banco "${deleteBankTarget?.name}"?\n\nNOTA: Las transacciones y extractos asociados a este banco NO serán eliminados, pero ya no podrás filtrar por este banco.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deletingBank}
      />
    </div>
  );
}
