import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseTransactionFile, validateTransactions, isSupportedExtension } from '@/lib/parsers';
import { checkLimit, incrementUsage } from '@/lib/subscriptions';

// File upload and parsing requires Node.js runtime
// export const runtime = 'edge';

type BankType = 'bbva' | 'scotia' | 'itau-master' | 'itau-visa' | 'itau-xls';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Check upload limit
    const limitCheck = await checkLimit(user.id, 'upload');
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: 'Llegaste al límite de extractos este mes',
        limit: limitCheck.limit,
        current: limitCheck.current,
        planId: limitCheck.planId,
        upgradeRequired: true,
      }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bankType = formData.get('bankType') as BankType;
    const currency = formData.get('currency') as string || 'UYU';
    const useLLM = formData.get('useLLM') === 'true'; // Extract AI parser flag

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Check if file extension is supported
    if (!isSupportedExtension(file.name)) {
      return NextResponse.json(
        { error: 'Formato no soportado. Use PDF, CSV, XLS/XLSX, OFX, QFX, QIF o JSON' },
        { status: 400 }
      );
    }

    // Parse file using unified parser
    const fileName = file.name.toLowerCase();
    const result = await parseTransactionFile(file, {
      bankType: bankType as Exclude<BankType, 'itau-xls'>,
      forceLLM: useLLM, // Pass AI flag to parser
    });

    if (!result.success) {
      // Check if this is a PDF that could be retried with AI
      const isPDF = fileName.endsWith('.pdf');
      const canRetryWithAI = isPDF && !useLLM; // Can retry if PDF and not already using LLM

      return NextResponse.json(
        {
          error: 'Error al procesar archivo',
          details: result.errors,
          canRetryWithAI, // Flag to show "Extract with AI" button in frontend
          suggestion: canRetryWithAI
            ? 'Este documento no se pudo procesar automáticamente. Intenta usar extracción con AI.'
            : undefined
        },
        { status: 400 }
      );
    }

    // Validate transactions
    const { valid, invalid } = validateTransactions(result.transactions);

    if (valid.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron transacciones válidas', details: invalid.map(i => i.reason) },
        { status: 400 }
      );
    }

    // Calculate date range
    const dates = valid.map(tx => tx.date).sort();
    const dateRange = {
      start: dates[0],
      end: dates[dates.length - 1],
    };

    // Get bank name from type or metadata
    const bankNames: Record<BankType, string> = {
      'bbva': 'BBVA',
      'scotia': 'Scotia',
      'itau-master': 'Itaú Master',
      'itau-visa': 'Itaú Visa',
      'itau-xls': 'Itaú',
    };

    // Determine format from file extension
    let format = 'UNKNOWN';
    if (fileName.endsWith('.pdf')) format = 'PDF';
    else if (fileName.endsWith('.csv')) format = 'CSV';
    else if (fileName.endsWith('.xls')) format = 'XLS';
    else if (fileName.endsWith('.xlsx')) format = 'XLSX';
    else if (fileName.endsWith('.ofx')) format = 'OFX';
    else if (fileName.endsWith('.qfx')) format = 'QFX';
    else if (fileName.endsWith('.qif')) format = 'QIF';
    else if (fileName.endsWith('.json')) format = 'JSON';

    // Get bank name from metadata or bankType parameter
    const bankName = result.metadata?.accountName || (bankType ? bankNames[bankType] : undefined) || 'Desconocido';

    // Create bank statement record
    const { data: statement, error: statementError } = await supabase
      .from('bank_statements')
      .insert({
        user_id: user.id,
        file_path: `uploads/${user.id}/${file.name}`,
        file_name: file.name,
        period_start: dateRange.start,
        period_end: dateRange.end,
        status: 'processing',
        transactions_count: valid.length,
        bank: bankName,
        format: format,
        currency: result.metadata?.currency || currency,
      })
      .select()
      .single();

    if (statementError || !statement) {
      console.error('Error creating statement:', statementError);
      return NextResponse.json(
        { error: 'Error al crear registro de extracto' },
        { status: 500 }
      );
    }

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

    // Filter out duplicates
    const transactionsToImport = valid.filter(tx => {
      const signature = `${tx.vendor}|${tx.date}|${tx.amount}|${tx.type}|${tx.currency}`;
      return !existingSignatures.has(signature);
    });

    if (transactionsToImport.length === 0) {
      // Update statement status
      await supabase
        .from('bank_statements')
        .update({ status: 'completed', transactions_count: 0 })
        .eq('id', statement.id);

      return NextResponse.json({
        success: false,
        message: 'Todas las transacciones ya existen en el sistema',
        duplicates: valid.length,
      });
    }

    // Load user categorization rules (ordered by creation date - first created = first executed)
    const { data: userRules } = await supabase
      .from('categorization_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    // Get categories for fallback
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'No tienes categorías creadas. Crea al menos una categoría primero.' },
        { status: 400 }
      );
    }

    // Prepare transactions with categorization
    const transactionsToInsert = transactionsToImport.map(tx => {
      let categoryId = null;
      let confidenceScore = 0.5;

      // Try automatic categorization rules
      if (userRules && userRules.length > 0) {
        for (const rule of userRules) {
          let ruleMatches = false;
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
            console.log(`✓ Rule match: "${tx.vendor}" -> Rule type: ${rule.rule_type}, Match value: ${rule.match_value}`);
            break; // Stop at first match
          }
        }
      }

      // Log if no rule matched
      if (!categoryId) {
        console.log(`✗ No rule match for: "${tx.vendor}" (amount: ${tx.amount}, type: ${tx.type})`);
      }

      // Fallback to first category
      if (!categoryId) {
        categoryId = categories[0].id;
      }

      return {
        user_id: user.id,
        category_id: categoryId,
        date: tx.date,
        vendor: tx.vendor,
        amount: tx.amount,
        type: tx.type,
        currency: tx.currency,
        statement_id: statement.id, // Link to bank statement
        is_manually_verified: false,
        confidence_score: confidenceScore,
        notes: tx.reference || null,
      };
    });

    // Batch insert transactions
    const { data: insertedTransactions, error: insertError } = await supabase
      .from('transactions')
      .insert(transactionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting transactions:', insertError);

      // Update statement status to failed
      await supabase
        .from('bank_statements')
        .update({ status: 'failed' })
        .eq('id', statement.id);

      return NextResponse.json(
        { error: 'Error al importar transacciones', details: insertError.message },
        { status: 500 }
      );
    }

    // Update statement status to completed
    await supabase
      .from('bank_statements')
      .update({ status: 'completed', transactions_count: insertedTransactions?.length || 0 })
      .eq('id', statement.id);

    // Track upload usage
    await incrementUsage(user.id, 'uploads_count');

    return NextResponse.json({
      success: true,
      imported: insertedTransactions?.length || 0,
      duplicates: valid.length - transactionsToImport.length,
      total: valid.length,
      statement_id: statement.id,
      date_range: dateRange,
      // Add parsing method info for transparency
      parsingMethod: (result as any).usedLLM ? 'ai' : 'specific',
      detectedBank: (result as any).detectedBank,
      confidence: (result as any).detectionConfidence,
    });

  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud', details: String(error) },
      { status: 500 }
    );
  }
}
