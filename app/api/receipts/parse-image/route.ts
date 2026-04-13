/**
 * Receipt Image Parsing API Endpoint
 * POST /api/receipts/parse-image
 * Accepts image file and returns structured transaction data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseReceiptImage, validateReceiptImage } from '@/lib/parsers/receipt-vision-parser';
import { getUserPlan, incrementUsage } from '@/lib/subscriptions';
import type { Category } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max for GPT-5-mini processing

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  // Reset every minute
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + 60000, // 1 minute
    });
    return { allowed: true };
  }

  // Max 10 requests per minute
  if (limit.count >= 10) {
    return {
      allowed: false,
      error: 'Límite de requests excedido. Máximo 10 por minuto.',
    };
  }

  limit.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Check Pro plan required for receipt scanning
    const plan = await getUserPlan(user.id);
    if (!plan.features.receipts) {
      return NextResponse.json(
        { success: false, error: 'El escaneo de recibos es una función Pro', upgradeRequired: true, planId: plan.planId },
        { status: 403 }
      );
    }

    // 3. Check rate limit
    const rateLimitCheck = checkRateLimit(user.id);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimitCheck.error },
        { status: 429 }
      );
    }

    // 3. Parse form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ninguna imagen' },
        { status: 400 }
      );
    }

    // 4. Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // 5. Validate image
    const validation = validateReceiptImage(imageBuffer);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 6. Fetch user categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json(
        { success: false, error: 'Error al cargar categorías del usuario' },
        { status: 500 }
      );
    }

    // 7. Parse receipt with GPT-5-mini Vision
    const result = await parseReceiptImage({
      imageBuffer,
      userCategories: categories as Category[],
      userId: user.id,
    });

    // 8. Return result
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in parse-image endpoint:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'receipt-parse-image',
    model: 'ai-vision',
    maxFileSize: '20MB',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
  });
}
