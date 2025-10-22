/**
 * Types for File Preview and Validation
 */

export type ColumnType = 'date' | 'vendor' | 'amount' | 'amount_usd' | 'amount_uyu' | 'type' | 'currency' | 'reference' | 'unknown';

export type ValidationStatus = 'valid' | 'warning' | 'error';

export interface ColumnDetection {
  index: number;
  originalName: string;
  detectedType: ColumnType;
  confidence: 'high' | 'medium' | 'low';
  suggestions?: string[];
}

export interface CellValidation {
  status: ValidationStatus;
  message?: string;
}

export interface PreviewRow {
  rowIndex: number;
  cells: string[];
  validations: CellValidation[];
  overallStatus: ValidationStatus;
  canDelete: boolean;
  isHeader?: boolean;
}

export interface ColumnMapping {
  [columnIndex: number]: ColumnType;
}

export interface TransformationSuggestion {
  type: 'rename_column' | 'add_column' | 'delete_rows' | 'fix_format' | 'map_column';
  description: string;
  autoApplicable: boolean;
  columnIndex?: number;
  rowIndices?: number[];
  suggestedValue?: string;
}

export interface PreviewStats {
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  detectedFormat: 'csv' | 'xls' | 'xlsx' | 'unknown';
  hasHeaders: boolean;
}

export interface PreviewResult {
  success: boolean;
  columns: ColumnDetection[];
  rows: PreviewRow[];
  stats: PreviewStats;
  suggestions: TransformationSuggestion[];
  errors: string[];
  rawData: string[][]; // Original data for export/recovery
}

export interface FilePreviewOptions {
  maxRows?: number; // Max rows to preview (default: 50)
  autoDetectHeaders?: boolean; // Auto-detect header row (default: true)
  strictValidation?: boolean; // Strict validation mode (default: false)
}
