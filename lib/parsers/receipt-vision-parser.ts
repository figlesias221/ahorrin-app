/**
 * Receipt Vision Parser
 * Uses GPT-5-mini multimodal to extract transaction data from receipt images
 */

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { ReceiptParseResult, Category } from '@/types';

/**
 * Receipt schema for GPT-5-mini structured output
 */
const ReceiptSchema = z.object({
  date: z.string().describe('Fecha en formato YYYY-MM-DD'),
  vendor: z.string().describe('Nombre del comercio normalizado (sin sucursal ni números)'),
  amount: z.number().positive().describe('Monto total de la compra'),
  currency: z.string().describe('Código de moneda: UYU, USD, EUR'),
  description: z.string().optional().describe('Breve descripción de la compra'),
  suggestedCategory: z.string().optional().describe('Categoría sugerida del usuario'),
  confidence: z.number().min(0).max(1).describe('Nivel de confianza (0-1)'),
  items: z.array(z.object({
    name: z.string(),
    amount: z.number()
  })).optional().describe('Items de la compra si son pocos y legibles'),
});

interface ParseReceiptOptions {
  imageBuffer: Buffer;
  userCategories: Category[];
  userId: string;
}

/**
 * Parse receipt image using GPT-5-mini Vision
 * Cost: ~$0.01-0.03 per image
 */
export async function parseReceiptImage(
  options: ParseReceiptOptions
): Promise<ReceiptParseResult> {
  const { imageBuffer, userCategories } = options;

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    // Build category list for prompt (already filtered by is_active at DB level)
    const categoryNames = userCategories
      .map(cat => cat.name)
      .join(', ');

    // System prompt for receipt extraction
    const systemPrompt = `Eres un experto en extraer datos de tickets y recibos de compra.

DATOS A EXTRAER:
1. Fecha de compra (formato YYYY-MM-DD)
2. Nombre del comercio (normalizado, sin sucursal)
3. Monto total (número sin símbolos)
4. Moneda (UYU por defecto si es Uruguay)
5. Descripción breve de la compra
6. Items principales (opcional, solo si son pocos y legibles)

CONTEXTO DEL USUARIO:
- Ubicación: Uruguay, idioma español
- Categorías disponibles: ${categoryNames || 'General'}
- Sugiere la categoría más apropiada según el comercio/items

REGLAS IMPORTANTES:
1. **Fecha**: Si no tiene año, usar ${new Date().getFullYear()}. Convertir a YYYY-MM-DD.
2. **Comercio**: Normalizar quitando sucursales
   - "DEVOTO N°3" → "DEVOTO"
   - "FARMASHOP LOCAL 8" → "FARMASHOP"
   - "TA-TA SUCURSAL 45" → "TA-TA"
3. **Moneda**:
   - $, PESOS, UYU, $U → UYU
   - U$S, US$, USD, DÓLARES → USD
   - €, EUR → EUR
   - Por defecto: UYU
4. **Monto**: Usar el TOTAL de la compra (no subtotales)
5. **Confidence**:
   - 0.9-1.0: Todo legible y claro
   - 0.7-0.8: Algunos datos con dudas
   - 0.5-0.6: Difícil de leer pero intentable
   - <0.5: Ilegible, retornar error
6. **Items**: Solo incluir si son pocos (max 5) y totalmente legibles

EJEMPLOS DE NORMALIZACIÓN:
- "SUPERMERCADO DEVOTO - SUC 3" → "DEVOTO"
- "Farmacia Americana N° 125" → "FARMACIA AMERICANA"
- "MC DONALD'S LOCAL MONTEVIDEO" → "MC DONALD'S"

Si la imagen está borrosa, rotada, o no contiene un ticket legible, indica confidence <0.5.

Responde SOLO con el JSON estructurado.`;

    const result = await generateObject({
      model: openai('gpt-5-mini'),
      schema: ReceiptSchema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            {
              type: 'image',
              image: imageDataUrl
            }
          ]
        }
      ],
      temperature: 0.1, // Low temperature for consistency
    });

    const parsed = result.object;

    // Validate confidence threshold
    if (parsed.confidence < 0.5) {
      return {
        success: false,
        confidence: parsed.confidence,
        error: 'La imagen no es legible o no contiene un ticket válido. Intenta con una foto más clara.',
      };
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
      return {
        success: false,
        confidence: parsed.confidence,
        error: 'No se pudo extraer una fecha válida del ticket.',
      };
    }

    return {
      success: true,
      transaction: {
        date: parsed.date,
        vendor: parsed.vendor,
        amount: parsed.amount,
        currency: parsed.currency,
        description: parsed.description,
        suggestedCategory: parsed.suggestedCategory,
        items: parsed.items,
      },
      confidence: parsed.confidence,
    };

  } catch (error: unknown) {
    console.error('Error parsing receipt image:', error);
    const err = error as Error;

    // Better error messages
    if (err?.message?.includes('API key')) {
      return {
        success: false,
        confidence: 0,
        error: 'Error: OpenAI API key no configurada o inválida',
      };
    }

    if (err?.message?.includes('rate limit')) {
      return {
        success: false,
        confidence: 0,
        error: 'Límite de requests excedido. Intenta nuevamente en unos minutos.',
      };
    }

    if (err?.message?.includes('timeout')) {
      return {
        success: false,
        confidence: 0,
        error: 'El análisis tardó demasiado. Intenta con una imagen más pequeña.',
      };
    }

    return {
      success: false,
      confidence: 0,
      error: `Error al procesar imagen: ${err?.message || 'Error desconocido'}`,
    };
  }
}

/**
 * Validate image file before processing
 */
export function validateReceiptImage(buffer: Buffer): { valid: boolean; error?: string } {
  // Check file size (max 20MB)
  const maxSize = 20 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: 'La imagen es demasiado grande. Máximo 20MB.',
    };
  }

  // Check minimum size (at least 1KB)
  if (buffer.length < 1024) {
    return {
      valid: false,
      error: 'La imagen es demasiado pequeña o está corrupta.',
    };
  }

  // Check magic bytes for common image formats
  const jpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const png = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const webp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  if (!jpg && !png && !webp) {
    return {
      valid: false,
      error: 'Formato de imagen no soportado. Usa JPG, PNG o WebP.',
    };
  }

  return { valid: true };
}
