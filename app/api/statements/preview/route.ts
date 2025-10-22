import { NextRequest, NextResponse } from 'next/server';
import { parseFileForPreview } from '@/lib/parsers/preview-parser';
import type { FilePreviewOptions } from '@/lib/parsers/preview-types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const maxRows = formData.get('maxRows');
    const strictValidation = formData.get('strictValidation');

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    const options: FilePreviewOptions = {
      maxRows: maxRows ? parseInt(maxRows as string) : 50,
      autoDetectHeaders: true,
      strictValidation: strictValidation === 'true',
    };

    const result = await parseFileForPreview(file, options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in preview API:', error);
    return NextResponse.json(
      { error: 'Error al procesar archivo', details: String(error) },
      { status: 500 }
    );
  }
}
