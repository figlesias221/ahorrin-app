'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ColumnDetection, ColumnType } from '@/lib/parsers/preview-types';

interface ColumnMapperProps {
  columns: ColumnDetection[];
  onMap: (mapping: { [columnIndex: number]: ColumnType }) => void;
  onClose: () => void;
}

const COLUMN_TYPE_OPTIONS: { value: ColumnType; label: string; description: string }[] = [
  { value: 'date', label: 'Fecha', description: 'Fecha de la transacción' },
  { value: 'vendor', label: 'Vendor/Comercio', description: 'Nombre del comercio o beneficiario' },
  { value: 'type', label: 'Tipo', description: 'Ingreso o Egreso (débito/haber)' },
  { value: 'currency', label: 'Moneda', description: 'UYU, USD, EUR, etc.' },
  { value: 'category', label: 'Categoría', description: 'Categoría de la transacción' },
  { value: 'reference', label: 'Referencia', description: 'Notas o referencia adicional' },
  { value: 'unknown', label: 'Ignorar', description: 'No importar esta columna' },
];

export function ColumnMapper({ columns, onMap, onClose }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<{ [columnIndex: number]: ColumnType }>(() => {
    const initial: { [columnIndex: number]: ColumnType } = {};
    columns.forEach(col => {
      initial[col.index] = col.detectedType;
    });
    return initial;
  });

  const handleTypeChange = (columnIndex: number, newType: ColumnType) => {
    setMapping(prev => ({ ...prev, [columnIndex]: newType }));
  };

  const handleApply = () => {
    onMap(mapping);
  };

  const requiredColumns = ['date', 'vendor'];
  const mappedTypes = Object.values(mapping);
  const hasAllRequired = requiredColumns.every(req => mappedTypes.includes(req as ColumnType));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Mapear Columnas</h2>
            <p className="text-sm text-gray-500 mt-1">
              Asigna el tipo correcto a cada columna del archivo
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {!hasAllRequired && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Faltan columnas requeridas
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Debes mapear al menos: <strong>Fecha</strong> y <strong>Vendor</strong>
              </p>
            </div>
          )}

          {columns.map(col => (
            <div key={col.index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Columna {col.index + 1}:
                    </span>
                    <span className="text-sm font-semibold truncate">
                      &quot;{col.originalName}&quot;
                    </span>
                  </div>
                  {col.suggestions && col.suggestions.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{col.suggestions[0]}</p>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={mapping[col.index]}
                    onChange={e => handleTypeChange(col.index, e.target.value as ColumnType)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {COLUMN_TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Show description of selected type */}
              <div className="mt-2 text-xs text-gray-500">
                {COLUMN_TYPE_OPTIONS.find(opt => opt.value === mapping[col.index])?.description}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {hasAllRequired ? (
              <span className="text-green-600 font-medium">✓ Todas las columnas requeridas mapeadas</span>
            ) : (
              <span className="text-yellow-600 font-medium">Mapea las columnas requeridas para continuar</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleApply} disabled={!hasAllRequired}>
              Aplicar Mapeo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
