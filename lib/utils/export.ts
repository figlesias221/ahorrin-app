interface ExportTransaction {
  id: string;
  date: Date | string;
  vendor: string;
  description?: string;
  amount: number;
  type: 'expense' | 'income';
  currency: string;
  bank?: string;
  notes?: string;
  isIgnored?: boolean;
  is_ignored?: boolean;
  isManuallyVerified?: boolean;
  is_manually_verified?: boolean;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

/**
 * Export transactions to Excel file
 */
export async function exportTransactionsToExcel(
  transactions: ExportTransaction[],
  filename: string = 'transacciones'
) {
  // Dynamic import to avoid bundling XLSX in server
  const XLSX = await import('xlsx');

  // Prepare data for export
  const data = transactions.map(tx => ({
    Fecha: new Date(tx.date).toLocaleDateString('es-ES'),
    Vendor: tx.vendor,
    Descripción: tx.description || '',
    Monto: tx.amount,
    Moneda: tx.currency,
    Tipo: tx.type === 'income' ? 'Ingreso' : 'Gasto',
    Categoría: tx.category?.name || 'Sin categoría',
    Banco: tx.bank || '',
    Notas: tx.notes || '',
    Ignorado: (tx.isIgnored || (tx as any).is_ignored) ? 'Sí' : 'No',
    Verificado: (tx.isManuallyVerified || (tx as any).is_manually_verified) ? 'Sí' : 'No',
  }));

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');

  // Auto-size columns
  const maxWidth = 50;
  const wscols = [
    { wch: 12 }, // Fecha
    { wch: 20 }, // Vendor
    { wch: 30 }, // Descripción
    { wch: 12 }, // Monto
    { wch: 8 },  // Moneda
    { wch: 10 }, // Tipo
    { wch: 20 }, // Categoría
    { wch: 15 }, // Banco
    { wch: 30 }, // Notas
    { wch: 10 }, // Ignorado
    { wch: 10 }, // Verificado
  ];
  ws['!cols'] = wscols;

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${dateStr}.xlsx`;

  // Write file
  XLSX.writeFile(wb, fullFilename);
}

/**
 * Export transactions to CSV file
 */
export async function exportTransactionsToCSV(
  transactions: ExportTransaction[],
  filename: string = 'transacciones'
) {
  // Dynamic import to avoid bundling XLSX in server
  const XLSX = await import('xlsx');

  // Prepare data for export
  const data = transactions.map(tx => ({
    Fecha: new Date(tx.date).toLocaleDateString('es-ES'),
    Vendor: tx.vendor,
    Descripción: tx.description || '',
    Monto: tx.amount,
    Moneda: tx.currency,
    Tipo: tx.type === 'income' ? 'Ingreso' : 'Gasto',
    Categoría: tx.category?.name || 'Sin categoría',
    Banco: tx.bank || '',
    Notas: tx.notes || '',
    Ignorado: (tx.isIgnored || (tx as any).is_ignored) ? 'Sí' : 'No',
    Verificado: (tx.isManuallyVerified || (tx as any).is_manually_verified) ? 'Sí' : 'No',
  }));

  // Create worksheet and convert to CSV
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${dateStr}.csv`;

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fullFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
