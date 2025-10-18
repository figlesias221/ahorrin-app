/**
 * Format Detection Module
 * Auto-detects file format from extension and content
 */

export type SupportedFormat =
  | 'pdf'
  | 'csv'
  | 'xls'
  | 'xlsx'
  | 'ofx'
  | 'qfx'
  | 'qif'
  | 'json';

export interface FormatDetectionResult {
  format: SupportedFormat | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Detect format from file extension
 */
function detectFromExtension(fileName: string): SupportedFormat | null {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.xls')) return 'xls';
  if (lower.endsWith('.xlsx')) return 'xlsx';
  if (lower.endsWith('.ofx')) return 'ofx';
  if (lower.endsWith('.qfx')) return 'qfx';
  if (lower.endsWith('.qif')) return 'qif';
  if (lower.endsWith('.json')) return 'json';

  return null;
}

/**
 * Detect format from file content
 */
async function detectFromContent(file: File): Promise<SupportedFormat | null> {
  try {
    // Read first 1KB for content sniffing
    const blob = file.slice(0, 1024);
    const text = await blob.text();
    const upper = text.toUpperCase();

    // PDF signature
    if (text.startsWith('%PDF')) return 'pdf';

    // OFX/QFX (SGML or XML format)
    if (upper.includes('OFXHEADER') || upper.includes('<OFX>')) return 'ofx';

    // QIF format (starts with !Type or !Account)
    if (/^!Type/m.test(text) || /^!Account/m.test(text)) return 'qif';

    // JSON format
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const sample = text.trim().slice(0, 500);
        JSON.parse(sample);
        return 'json';
      } catch {
        // Not valid JSON
      }
    }

    // Excel binary format (starts with PK for XLSX or specific bytes for XLS)
    if (text.startsWith('PK')) return 'xlsx';
    if (text.includes('\xD0\xCF\x11\xE0')) return 'xls';

    // CSV detection (has commas, semicolons, or tabs with line breaks)
    if (/[,;\t]/.test(text) && /\n/.test(text)) return 'csv';

    return null;
  } catch {
    return null;
  }
}

/**
 * Detect file format from name and content
 */
export async function detectFormat(file: File): Promise<FormatDetectionResult> {
  // Try extension first
  const extensionFormat = detectFromExtension(file.name);

  if (extensionFormat) {
    // Verify with content if possible
    const contentFormat = await detectFromContent(file);

    if (contentFormat === extensionFormat) {
      return {
        format: extensionFormat,
        confidence: 'high',
        reason: `Extension and content both indicate ${extensionFormat.toUpperCase()} format`
      };
    }

    if (contentFormat && contentFormat !== extensionFormat) {
      return {
        format: contentFormat,
        confidence: 'medium',
        reason: `Extension says ${extensionFormat.toUpperCase()} but content appears to be ${contentFormat.toUpperCase()}`
      };
    }

    // Content detection failed, trust extension
    return {
      format: extensionFormat,
      confidence: 'medium',
      reason: `Based on file extension (.${extensionFormat})`
    };
  }

  // No extension match, try content only
  const contentFormat = await detectFromContent(file);

  if (contentFormat) {
    return {
      format: contentFormat,
      confidence: 'low',
      reason: `Detected ${contentFormat.toUpperCase()} from content (unusual extension)`
    };
  }

  // Could not detect format
  return {
    format: null,
    confidence: 'low',
    reason: 'Could not determine file format'
  };
}

/**
 * Check if a format is supported
 */
export function isFormatSupported(format: string | null): format is SupportedFormat {
  return ['pdf', 'csv', 'xls', 'xlsx', 'ofx', 'qfx', 'qif', 'json'].includes(format || '');
}
