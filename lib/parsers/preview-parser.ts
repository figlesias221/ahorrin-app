/**
 * Permissive File Parser for Preview
 * Parses CSV/Excel files without strict validation
 * Returns raw data + detection results + suggestions
 */

import type {
  PreviewResult,
  PreviewRow,
  ColumnDetection,
  ColumnType,
  CellValidation,
  ValidationStatus,
  TransformationSuggestion,
  FilePreviewOptions,
} from './preview-types';

/**
 * Detect column type from header name
 */
function detectColumnType(headerName: string): {
  type: ColumnType;
  confidence: 'high' | 'medium' | 'low';
} {
  const lower = headerName.toLowerCase().trim();

  // Date detection
  if (/^(fecha|date|data|day|día)$/i.test(lower)) {
    return { type: 'date', confidence: 'high' };
  }
  if (lower.includes('fecha') || lower.includes('date')) {
    return { type: 'date', confidence: 'medium' };
  }

  // Description/Reference detection (combines vendor + description)
  if (
    /^(descripcion|description|concepto|detalle|vendor|comercio|merchant|referencia|reference)$/i.test(lower)
  ) {
    return { type: 'reference', confidence: 'high' };
  }
  if (
    lower.includes('descripcion') ||
    lower.includes('description') ||
    lower.includes('concepto') ||
    lower.includes('detalle') ||
    lower.includes('vendor') ||
    lower.includes('comercio')
  ) {
    return { type: 'reference', confidence: 'medium' };
  }

  // Amount USD detection
  if (/^(amount.*usd|monto.*usd|importe.*usd|usd.*amount|usd.*monto)$/i.test(lower)) {
    return { type: 'amount_usd', confidence: 'high' };
  }
  if ((lower.includes('monto') || lower.includes('amount') || lower.includes('importe')) && lower.includes('usd')) {
    return { type: 'amount_usd', confidence: 'high' };
  }

  // Amount UYU detection
  if (/^(amount.*uyu|monto.*uyu|importe.*uyu|uyu.*amount|uyu.*monto|monto.*peso|amount.*peso)$/i.test(lower)) {
    return { type: 'amount_uyu', confidence: 'high' };
  }
  if ((lower.includes('monto') || lower.includes('amount') || lower.includes('importe')) && (lower.includes('uyu') || lower.includes('peso'))) {
    return { type: 'amount_uyu', confidence: 'high' };
  }

  // Generic amount detection (when no currency specified)
  if (/^(amount|monto|importe|valor|total|precio)$/i.test(lower)) {
    return { type: 'amount', confidence: 'high' };
  }
  if (lower.includes('monto') || lower.includes('amount') || lower.includes('importe')) {
    return { type: 'amount', confidence: 'medium' };
  }

  // Type detection
  if (/^(type|tipo|class|clase)$/i.test(lower)) {
    return { type: 'type', confidence: 'high' };
  }
  if (
    lower.includes('debito') ||
    lower.includes('debit') ||
    lower.includes('credito') ||
    lower.includes('credit') ||
    lower.includes('ingreso') ||
    lower.includes('egreso') ||
    lower.includes('d/h')
  ) {
    return { type: 'type', confidence: 'medium' };
  }

  // Currency detection
  if (/^(currency|moneda|coin)$/i.test(lower)) {
    return { type: 'currency', confidence: 'high' };
  }
  if (lower.includes('moneda') || lower.includes('currency')) {
    return { type: 'currency', confidence: 'medium' };
  }

  // Category detection
  if (/^(category|categoria|categoría|cat)$/i.test(lower)) {
    return { type: 'category', confidence: 'high' };
  }
  if (lower.includes('categoria') || lower.includes('category')) {
    return { type: 'category', confidence: 'medium' };
  }

  // Reference/Note detection
  if (/^(reference|referencia|nota|note|observacion|comment)$/i.test(lower)) {
    return { type: 'reference', confidence: 'high' };
  }
  if (
    lower.includes('referencia') ||
    lower.includes('reference') ||
    lower.includes('nota') ||
    lower.includes('note')
  ) {
    return { type: 'reference', confidence: 'medium' };
  }

  return { type: 'unknown', confidence: 'low' };
}

/**
 * Validate date format
 */
function validateDate(dateStr: string): CellValidation {
  const cleaned = dateStr.trim();

  if (!cleaned) {
    return { status: 'error', message: 'Fecha vacía' };
  }

  // ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return { status: 'valid' };
  }

  // DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(cleaned)) {
    return { status: 'valid' };
  }

  // Excel serial date (5 digit number)
  if (/^\d{5}$/.test(cleaned)) {
    return { status: 'warning', message: 'Fecha en formato Excel serial' };
  }

  return { status: 'error', message: 'Formato de fecha no reconocido' };
}

/**
 * Validate amount
 */
function validateAmount(amountStr: string): CellValidation {
  const cleaned = amountStr.trim();

  if (!cleaned) {
    return { status: 'error', message: 'Monto vacío' };
  }

  // Remove currency symbols and whitespace
  const normalized = cleaned.replace(/[$\sUYUUSD€£,]/gi, '');

  // Check if it's a valid number
  const num = parseFloat(normalized);

  if (isNaN(num)) {
    return { status: 'error', message: 'No es un número válido' };
  }

  if (num === 0) {
    return { status: 'warning', message: 'Monto es cero' };
  }

  if (num < 0) {
    return { status: 'warning', message: 'Monto negativo' };
  }

  return { status: 'valid' };
}

/**
 * Validate reference/description
 */
function validateReference(refStr: string): CellValidation {
  const cleaned = refStr.trim();

  if (!cleaned) {
    return { status: 'error', message: 'Descripción vacía' };
  }

  if (cleaned.length < 2) {
    return { status: 'warning', message: 'Descripción muy corta' };
  }

  return { status: 'valid' };
}

/**
 * Validate cell based on column type
 */
function validateCell(value: string, columnType: ColumnType): CellValidation {
  switch (columnType) {
    case 'date':
      return validateDate(value);
    case 'amount':
    case 'amount_usd':
    case 'amount_uyu':
      return validateAmount(value);
    case 'reference':
      return validateReference(value);
    case 'type':
    case 'currency':
      return { status: 'valid' };
    case 'unknown':
      return { status: 'warning', message: 'Columna no identificada' };
    default:
      return { status: 'valid' };
  }
}


/**
 * Parse CSV with PapaParse
 */
async function parseCSVRaw(file: File): Promise<string[][]> {
  const Papa = await import('papaparse');
  const text = await file.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: false,
      skipEmptyLines: true,
      delimiter: '', // Auto-detect
      complete: results => {
        resolve(results.data as string[][]);
      },
      error: error => {
        reject(error);
      },
    });
  });
}

/**
 * Parse Excel with XLSX
 */
async function parseExcelRaw(file: File): Promise<string[][]> {
  const XLSX = await import('xlsx');
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to 2D array
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

  // Convert all cells to strings and filter empty rows
  return data
    .map(row => row.map(cell => (cell !== null && cell !== undefined ? String(cell) : '')))
    .filter(row => row.some(cell => cell.trim() !== '')); // Skip completely empty rows
}

/**
 * Main preview parser function
 */
export async function parseFileForPreview(
  file: File,
  options: FilePreviewOptions = {}
): Promise<PreviewResult> {
  const {
    maxRows = 50,
    autoDetectHeaders = true,
  } = options;

  try {
    const fileName = file.name.toLowerCase();
    let rawData: string[][];
    let detectedFormat: 'csv' | 'xls' | 'xlsx' | 'unknown' = 'unknown';

    // Parse based on file extension
    if (fileName.endsWith('.csv')) {
      rawData = await parseCSVRaw(file);
      detectedFormat = 'csv';
    } else if (fileName.endsWith('.xls')) {
      rawData = await parseExcelRaw(file);
      detectedFormat = 'xls';
    } else if (fileName.endsWith('.xlsx')) {
      rawData = await parseExcelRaw(file);
      detectedFormat = 'xlsx';
    } else {
      return {
        success: false,
        columns: [],
        rows: [],
        stats: {
          totalRows: 0,
          validRows: 0,
          warningRows: 0,
          errorRows: 0,
          detectedFormat: 'unknown',
          hasHeaders: false,
        },
        suggestions: [],
        errors: ['Formato no soportado. Use CSV o Excel (XLS/XLSX)'],
        rawData: [],
      };
    }

    if (rawData.length === 0) {
      return {
        success: false,
        columns: [],
        rows: [],
        stats: {
          totalRows: 0,
          validRows: 0,
          warningRows: 0,
          errorRows: 0,
          detectedFormat,
          hasHeaders: false,
        },
        suggestions: [],
        errors: ['El archivo está vacío'],
        rawData: [],
      };
    }

    // Treat first row as headers by default
    const firstRow = rawData[0];
    const hasHeaders = autoDetectHeaders; // Always true by default

    // Determine max column count from all rows to ensure we don't miss any columns
    const maxCols = Math.max(...rawData.map(row => row.length));

    // Check which columns have at least some data (not all empty)
    const columnsWithData: boolean[] = [];
    for (let colIndex = 0; colIndex < maxCols; colIndex++) {
      const hasData = rawData.slice(hasHeaders ? 1 : 0).some(row => {
        const cell = row[colIndex];
        return cell && cell.trim() !== '';
      });
      columnsWithData[colIndex] = hasData;
    }

    // Detect columns - only include columns that have data
    const columns: ColumnDetection[] = [];
    let displayIndex = 0;

    for (let originalIndex = 0; originalIndex < maxCols; originalIndex++) {
      // Skip completely empty columns
      if (!columnsWithData[originalIndex]) {
        continue;
      }

      const cellValue = firstRow[originalIndex] || `Columna ${displayIndex + 1}`;
      const detection = hasHeaders && firstRow[originalIndex]
        ? detectColumnType(cellValue)
        : { type: 'unknown' as ColumnType, confidence: 'low' as const };

      const suggestions: string[] = [];

      // Add suggestions based on detection
      if (detection.type === 'unknown' && hasHeaders) {
        suggestions.push(`No se pudo identificar esta columna. ¿Es "${cellValue}" una fecha, monto o vendor?`);
      }

      if (detection.type === 'vendor' && detection.confidence === 'medium') {
        suggestions.push('Esta columna parece contener el vendor/comercio');
      }

      columns.push({
        index: displayIndex,
        originalName: hasHeaders && firstRow[originalIndex] ? cellValue : `Columna ${displayIndex + 1}`,
        detectedType: detection.type,
        confidence: detection.confidence,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      });

      displayIndex++;
    }

    // Build column type map for validation
    const columnTypeMap: { [index: number]: ColumnType } = {};
    columns.forEach(col => {
      columnTypeMap[col.index] = col.detectedType;
    });

    // Process rows (skip header if detected)
    const dataRows = hasHeaders ? rawData.slice(1) : rawData;
    const rowsToProcess = dataRows.slice(0, maxRows);

    const rows: PreviewRow[] = rowsToProcess.map((rowData, idx) => {
      // Only include cells from columns that have data
      const filteredCells: string[] = [];
      for (let originalIndex = 0; originalIndex < maxCols; originalIndex++) {
        if (columnsWithData[originalIndex]) {
          filteredCells.push(rowData[originalIndex] || '');
        }
      }

      // Validate each cell
      const validations: CellValidation[] = filteredCells.map((cellValue, colIndex) => {
        const columnType = columnTypeMap[colIndex] || 'unknown';
        return validateCell(cellValue, columnType);
      });

      // Determine overall row status
      let overallStatus: ValidationStatus = 'valid';
      if (validations.some(v => v.status === 'error')) {
        overallStatus = 'error';
      } else if (validations.some(v => v.status === 'warning')) {
        overallStatus = 'warning';
      }

      return {
        rowIndex: idx,
        cells: filteredCells,
        validations,
        overallStatus,
        canDelete: true,
        isHeader: false,
      };
    });

    // Calculate stats
    const validRows = rows.filter(r => r.overallStatus === 'valid').length;
    const warningRows = rows.filter(r => r.overallStatus === 'warning').length;
    const errorRows = rows.filter(r => r.overallStatus === 'error').length;

    const stats = {
      totalRows: dataRows.length,
      validRows,
      warningRows,
      errorRows,
      detectedFormat,
      hasHeaders,
    };

    // Generate suggestions
    const suggestions: TransformationSuggestion[] = [];

    // Check for missing required columns
    const hasDate = columns.some(c => c.detectedType === 'date');
    const hasAmount = columns.some(c => c.detectedType === 'amount' || c.detectedType === 'amount_usd' || c.detectedType === 'amount_uyu');
    const hasVendor = columns.some(c => c.detectedType === 'vendor');

    if (!hasDate) {
      suggestions.push({
        type: 'add_column',
        description: 'No se detectó columna de fecha. Asignala con el dropdown.',
        autoApplicable: false,
      });
    }

    if (!hasAmount) {
      suggestions.push({
        type: 'add_column',
        description: 'No se detectó columna de monto. Asignala con el dropdown.',
        autoApplicable: false,
      });
    }

    if (!hasVendor) {
      suggestions.push({
        type: 'add_column',
        description: 'No se detectó columna de concepto. Asignala con el dropdown.',
        autoApplicable: false,
      });
    }

    // Suggest deleting error rows if any
    if (errorRows > 0) {
      const errorRowIndices = rows.filter(r => r.overallStatus === 'error').map(r => r.rowIndex);
      suggestions.push({
        type: 'delete_rows',
        description: `Eliminar ${errorRows} filas con errores para importar solo las válidas`,
        autoApplicable: true,
        rowIndices: errorRowIndices,
      });
    }

    // Success if we have at least date, amount, vendor columns
    const canProceed = hasDate && hasAmount && hasVendor;

    return {
      success: canProceed,
      columns,
      rows,
      stats,
      suggestions,
      errors: canProceed ? [] : ['Faltan columnas requeridas: fecha, monto y concepto'],
      rawData,
    };
  } catch (error) {
    return {
      success: false,
      columns: [],
      rows: [],
      stats: {
        totalRows: 0,
        validRows: 0,
        warningRows: 0,
        errorRows: 0,
        detectedFormat: 'unknown',
        hasHeaders: false,
      },
      suggestions: [],
      errors: [`Error al procesar archivo: ${error}`],
      rawData: [],
    };
  }
}
