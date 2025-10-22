'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { ColumnTypeDropdown } from './ColumnTypeDropdown';
import type { PreviewRow, ColumnDetection, ColumnType } from '@/lib/parsers/preview-types';

interface PreviewTableProps {
  columns: ColumnDetection[];
  rows: PreviewRow[];
  onRowDelete: (rowIndex: number) => void;
  onCellEdit: (rowIndex: number, cellIndex: number, newValue: string) => void;
  onColumnTypeChange: (columnIndex: number, newType: ColumnType) => void;
  onColumnDelete: (columnIndex: number) => void;
  onTransactionTypeChange?: (columnIndex: number, transactionType: 'income' | 'expense') => void;
  columnTransactionTypes?: { [columnIndex: number]: 'income' | 'expense' };
  showOnlyErrors?: boolean;
}

export function PreviewTable({
  columns,
  rows,
  onRowDelete,
  onCellEdit,
  onColumnTypeChange,
  onColumnDelete,
  onTransactionTypeChange,
  columnTransactionTypes = {},
  showOnlyErrors = false,
}: PreviewTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; cellIndex: number } | null>(
    null
  );
  const [editValue, setEditValue] = useState('');

  const displayRows = showOnlyErrors ? rows.filter(r => r.overallStatus === 'error') : rows;

  const handleCellClick = (rowIndex: number, cellIndex: number, currentValue: string) => {
    setEditingCell({ rowIndex, cellIndex });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (editingCell) {
      onCellEdit(editingCell.rowIndex, editingCell.cellIndex, editValue);
      setEditingCell(null);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  if (displayRows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {showOnlyErrors ? 'No hay filas con errores' : 'No hay datos para mostrar'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full text-sm">
        <thead className="bg-white border-b-2 border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-2 w-12 bg-white"></th>
            <th className="px-2 py-1.5 w-8 bg-white"></th>
            {columns.map(col => (
              <th
                key={col.index}
                className="px-2 py-1.5 text-left text-xs min-w-[180px] bg-white"
              >
                <div className="flex flex-col gap-1">
                  {/* Column name and delete button */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-medium text-gray-500 truncate flex-1" title={col.originalName}>
                      {col.originalName}
                    </span>
                    <button
                      onClick={() => onColumnDelete(col.index)}
                      className="p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600 flex-shrink-0 border border-transparent hover:border-red-300 transition-colors"
                      title={`Eliminar "${col.originalName}"`}
                    >
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Column type dropdown */}
                  <div>
                    <ColumnTypeDropdown
                      value={col.detectedType}
                      onChange={newType => onColumnTypeChange(col.index, newType)}
                      columnName={col.originalName}
                    />
                  </div>

                  {/* Transaction Type Selector for Amount Columns */}
                  {(col.detectedType === 'amount_usd' || col.detectedType === 'amount_uyu') && (
                    <div className="mt-1">
                      <select
                        value={columnTransactionTypes[col.index] || 'expense'}
                        onChange={e => {
                          const newType = e.target.value as 'income' | 'expense';
                          if (onTransactionTypeChange) {
                            onTransactionTypeChange(col.index, newType);
                          }
                        }}
                        className="w-full text-xs px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                      </select>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map(row => (
            <tr
              key={row.rowIndex}
              className={`border-b border-gray-100 hover:bg-gray-50 ${
                row.overallStatus === 'error'
                  ? 'bg-red-50/20'
                  : row.overallStatus === 'warning'
                  ? 'bg-yellow-50/20'
                  : ''
              }`}
            >
              <td className="px-2 py-2 text-center">
                {row.canDelete && (
                  <button
                    onClick={() => onRowDelete(row.rowIndex)}
                    className="p-0.5 text-gray-300 hover:text-red-500 hover:bg-gray-100 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </td>
              <td className="px-2 py-2 text-gray-400 font-mono text-xs">{row.rowIndex + 1}</td>
              {row.cells.map((cell, cellIndex) => {
                const isEditing =
                  editingCell?.rowIndex === row.rowIndex && editingCell?.cellIndex === cellIndex;
                const validation = row.validations?.[cellIndex] || { status: 'valid', message: '' };

                return (
                  <td
                    key={cellIndex}
                    className="px-2 py-2 relative group"
                    onDoubleClick={() => handleCellClick(row.rowIndex, cellIndex, cell)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyDown}
                        className="w-full px-1.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <span
                          className={`truncate flex-1 text-xs ${
                            validation.status === 'error'
                              ? 'text-red-600 font-medium'
                              : validation.status === 'warning'
                              ? 'text-yellow-700'
                              : 'text-gray-800'
                          }`}
                        >
                          {cell || <span className="text-gray-300">-</span>}
                        </span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
