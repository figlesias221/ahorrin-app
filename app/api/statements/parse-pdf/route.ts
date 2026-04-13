import { NextRequest, NextResponse } from 'next/server';
import { parseAnyPDF } from '@/lib/parsers/pdf-statements';

// PDF parsing requires Node.js runtime
// export const runtime = 'edge';
export const maxDuration = 30; // Allow time for large PDF processing

type BankType = 'bbva' | 'scotia' | 'itau-master' | 'itau-visa' | 'itau-account' | 'santander';

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Check if PDF bank statements are enabled
    // Disabled by default for privacy reasons (PDFs contain excessive PII)
    const enableBankStatementPDF = process.env.NEXT_PUBLIC_ENABLE_BANK_STATEMENT_PDF === 'true';

    if (!enableBankStatementPDF) {
      return NextResponse.json(
        {
          success: false,
          transactions: [],
          errors: [
            '🔒 PDFs de extractos bancarios están deshabilitados por seguridad.',
            'Por favor usa CSV/XLS exportado desde tu banco, o entrada manual.',
            'Estos archivos contienen información sensible innecesaria (número de cuenta, saldo, etc.).'
          ]
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bankType = formData.get('bankType') as BankType | null;
    const forceLLM = formData.get('forceLLM') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Convert file to buffer for PDF processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF with universal parser (auto-detects or uses LLM fallback)
    const result = await parseAnyPDF(buffer, {
      bankType: bankType || undefined,
      forceLLM,
    });

    // Add helpful info to response
    const response = {
      ...result,
      info: result.usedLLM
        ? '🤖 Transacciones extraídas usando IA'
        : result.success
        ? '✅ Transacciones extraídas con parser específico (gratis)'
        : '❌ No se pudieron extraer transacciones',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in parse-pdf API:', error);
    return NextResponse.json(
      { success: false, transactions: [], errors: [String(error)] },
      { status: 500 }
    );
  }
}
