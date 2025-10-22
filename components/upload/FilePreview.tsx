'use client';

import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PreviewTable } from './PreviewTable';
import type { PreviewResult, ColumnType, PreviewRow } from '@/lib/parsers/preview-types';

interface FilePreviewProps {
  file: File;
  onProceed: (
    validRows: string[][],
    columnMapping: { [index: number]: ColumnType },
    columnTransactionTypes: { [index: number]: 'income' | 'expense' }
  ) => void;
  onCancel: () => void;
}

export function FilePreview({ file, onProceed, onCancel }: FilePreviewProps) {
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [localRows, setLocalRows] = useState<PreviewRow[]>([]);
  const [localColumns, setLocalColumns] = useState<PreviewResult['columns']>([]);
  const [columnMapping, setColumnMapping] = useState<{ [index: number]: ColumnType }>({});
  const [columnTransactionTypes, setColumnTransactionTypes] = useState<{ [index: number]: 'income' | 'expense' }>({});

  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('maxRows', '100');

      const response = await fetch('/api/statements/preview', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al cargar preview');
      }

      const result: PreviewResult = await response.json();
      setPreview(result);
      setLocalRows(result.rows);
      setLocalColumns(result.columns);

      // Initialize column mapping from detection
      const initialMapping: { [index: number]: ColumnType } = {};
      result.columns.forEach(col => {
        initialMapping[col.index] = col.detectedType;
      });
      setColumnMapping(initialMapping);
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowDelete = (rowIndex: number) => {
    setLocalRows(prev => prev.filter(r => r.rowIndex !== rowIndex));
  };

  const handleCellEdit = (rowIndex: number, cellIndex: number, newValue: string) => {
    setLocalRows(prev =>
      prev.map(row => {
        if (row.rowIndex === rowIndex) {
          const newCells = [...row.cells];
          newCells[cellIndex] = newValue;
          return { ...row, cells: newCells };
        }
        return row;
      })
    );
  };

  const handleDeleteErrorRows = () => {
    setLocalRows(prev => prev.filter(r => r.overallStatus !== 'error'));
  };

  const handleColumnTypeChange = (columnIndex: number, newType: ColumnType) => {
    // Update column detection type
    setLocalColumns(prev =>
      prev.map(col =>
        col.index === columnIndex ? { ...col, detectedType: newType } : col
      )
    );

    // Update mapping
    setColumnMapping(prev => ({
      ...prev,
      [columnIndex]: newType,
    }));
  };

  const handleColumnDelete = (columnIndex: number) => {
    // Remove column from columns list
    setLocalColumns(prev => prev.filter(col => col.index !== columnIndex));

    // Remove from mapping
    setColumnMapping(prev => {
      const newMapping = { ...prev };
      delete newMapping[columnIndex];
      return newMapping;
    });

    // Remove from transaction types
    setColumnTransactionTypes(prev => {
      const newTypes = { ...prev };
      delete newTypes[columnIndex];
      return newTypes;
    });

    // Remove column data from all rows
    setLocalRows(prev =>
      prev.map(row => ({
        ...row,
        cells: row.cells.filter((_, idx) => idx !== columnIndex),
        validations: row.validations.filter((_, idx) => idx !== columnIndex),
      }))
    );
  };

  const handleTransactionTypeChange = (columnIndex: number, transactionType: 'income' | 'expense') => {
    setColumnTransactionTypes(prev => ({
      ...prev,
      [columnIndex]: transactionType,
    }));
  };


  const handleExportCorrected = () => {
    // Export corrected CSV
    const header = preview?.columns.map(c => c.originalName).join(',') || '';
    const dataRows = localRows.map(r => r.cells.join(',')).join('\n');
    const csv = `${header}\n${dataRows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_corregido.csv`;
    a.click();
  };

  const handleProceed = () => {
    // Map reference column to vendor for backend compatibility
    let finalMapping = { ...columnMapping };

    const refEntry = Object.entries(columnMapping).find(
      ([, type]) => type === 'reference'
    );

    if (refEntry) {
      const [refColIndex] = refEntry;
      finalMapping = {
        ...columnMapping,
        [refColIndex]: 'vendor', // Backend expects 'vendor' field
      };
    }

    // Convert localRows to raw data (include warnings as valid)
    const validRowsData = localRows
      .filter(r => r.overallStatus === 'valid' || r.overallStatus === 'warning')
      .map(r => r.cells);

    onProceed(validRowsData, finalMapping, columnTransactionTypes);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <h2 className="font-semibold">Analizando archivo</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label="Cancelar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading content */}
        <div className="p-12">
          <div className="flex flex-col items-center gap-6">
            {/* Animated loader */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-800" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <p className="text-gray-900 font-medium">Analizando archivo...</p>
              <p className="text-sm text-gray-500">Detectando columnas y validando datos</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <h2 className="font-semibold">Error al cargar</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error content */}
        <div className="p-12">
          <div className="flex flex-col items-center gap-6">
            {/* Error icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <p className="text-gray-900 font-semibold text-lg">Error al cargar el archivo</p>
              <p className="text-sm text-gray-600">
                No pudimos procesar este archivo. Por favor verifica que sea un CSV o Excel válido e intenta nuevamente.
              </p>
            </div>

            {/* Action button */}
            <Button
              onClick={onCancel}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6"
            >
              Volver a intentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have minimum required columns
  // We need: date + amount (any type) + vendor (Concepto)
  const hasDate = Object.values(columnMapping).includes('date');
  const hasAmount = Object.values(columnMapping).some(type =>
    type === 'amount' || type === 'amount_usd' || type === 'amount_uyu'
  );
  const hasVendor = Object.values(columnMapping).includes('vendor');

  const hasRequiredColumns = hasDate && hasAmount && hasVendor;

  // Determine what to show in alerts
  const missingColumns: string[] = [];
  if (!hasDate) missingColumns.push('Fecha');
  if (!hasAmount) missingColumns.push('Monto');
  if (!hasVendor) missingColumns.push('Concepto');

  const validRowsCount = localRows.filter(r => r.overallStatus === 'valid').length;
  const warningRowsCount = localRows.filter(r => r.overallStatus === 'warning').length;
  const errorRowsCount = localRows.filter(r => r.overallStatus === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
      {/* Simple header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <div>
            <h2 className="font-semibold">{file.name}</h2>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-white/20 rounded transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-4 space-y-4 flex-shrink-0">
        {/* Simple stats bar */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{preview.stats.totalRows} filas</span>
            <span>•</span>
            <span>{preview.stats.detectedFormat.toUpperCase()}</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="flex h-full">
              <div
                className="bg-green-500"
                style={{ width: `${(validRowsCount / localRows.length) * 100}%` }}
              />
              <div
                className="bg-yellow-500"
                style={{ width: `${(warningRowsCount / localRows.length) * 100}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${(errorRowsCount / localRows.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {validRowsCount > 0 && (
              <span className="text-green-600 font-medium">{validRowsCount} ✓</span>
            )}
            {warningRowsCount > 0 && (
              <span className="text-yellow-600 font-medium">{warningRowsCount} ⚠</span>
            )}
            {errorRowsCount > 0 && (
              <span className="text-red-600 font-medium">{errorRowsCount} ✗</span>
            )}
          </div>
        </div>

        {/* Columns - simplified */}
        {!hasRequiredColumns && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              Faltan columnas: <strong>{missingColumns.join(', ')}</strong>.
              {' '}Usa los dropdowns arriba para asignarlas.
            </p>
          </div>
        )}

        {/* Info tip */}
        {hasRequiredColumns && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ✓ Listo para importar. Las categorías se asignan automáticamente según tus reglas.
            </p>
          </div>
        )}

        {/* Suggestions - only if critical */}
        {errorRowsCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              {errorRowsCount} filas tienen errores.{' '}
              <button
                onClick={handleDeleteErrorRows}
                className="underline font-medium hover:text-yellow-900"
              >
                Eliminar automáticamente
              </button>
            </p>
          </div>
        )}

        {/* Simple toolbar */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setShowOnlyErrors(!showOnlyErrors)}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              {showOnlyErrors ? 'Ver todas' : 'Solo errores'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCorrected}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Exportar
            </button>
          </div>
        </div>

      </div>

      {/* Preview table with independent scroll */}
      <div className="flex-1 overflow-auto px-6 min-h-0">
        <div className="border rounded-lg overflow-hidden mb-4">
          <PreviewTable
            columns={localColumns}
            rows={localRows}
            onRowDelete={handleRowDelete}
            onCellEdit={handleCellEdit}
            onColumnTypeChange={handleColumnTypeChange}
            onColumnDelete={handleColumnDelete}
            onTransactionTypeChange={handleTransactionTypeChange}
            columnTransactionTypes={columnTransactionTypes}
            showOnlyErrors={showOnlyErrors}
          />
        </div>
      </div>

      {/* Simple footer */}
      <div className="bg-gray-50 border-t px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-900">
          Cancelar
        </button>
        <div className="flex items-center gap-4">
          {!hasRequiredColumns ? (
            <span className="text-sm text-red-600 font-medium">
              Faltan columnas requeridas
            </span>
          ) : (validRowsCount + warningRowsCount) === 0 ? (
            <span className="text-sm text-red-600 font-medium">
              No hay filas válidas para importar
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              {validRowsCount + warningRowsCount} transacciones
            </span>
          )}
          <Button
            onClick={handleProceed}
            disabled={!hasRequiredColumns || (validRowsCount + warningRowsCount) === 0}
            className="bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Importar
          </Button>
        </div>
      </div>

    </div>
  );
}
