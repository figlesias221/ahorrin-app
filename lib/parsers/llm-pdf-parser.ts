/**
 * LLM-Based PDF Parser
 * Uses OpenAI to extract transactions from unknown bank statements
 * Fallback for PDFs without specific extractors
 */

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { ParsedTransaction, ParserResult } from './bank-statements';

/**
 * Parse PDF buffer and extract text using unpdf
 * Note: unpdf is dynamically imported to reduce bundle size
 * This is specifically designed for Cloudflare Workers
 */
async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  const { extractText } = await import('unpdf');
  const text = await extractText(buffer);
  return text;
}

/**
 * Transaction schema for LLM structured output
 */
const TransactionSchema = z.object({
  transactions: z.array(z.object({
    date: z.string().describe('Fecha en formato YYYY-MM-DD'),
    vendor: z.string().describe('Nombre del comercio/concepto normalizado (sin sucursales ni números)'),
    amount: z.number().positive().describe('Monto positivo de la transacción'),
    type: z.enum(['expense', 'income']).describe('expense para gastos/cargos, income para ingresos/créditos'),
    currency: z.string().describe('Código de moneda: UYU, USD, EUR, etc.'),
    reference: z.string().optional().describe('Número de referencia o autorización si está disponible'),
  })),
  metadata: z.object({
    accountType: z.string().optional().describe('Tipo de cuenta o tarjeta detectada'),
    bankName: z.string().optional().describe('Nombre del banco detectado'),
    confidence: z.number().min(0).max(1).describe('Nivel de confianza en la extracción (0-1)'),
  }),
});

/**
 * Parse PDF using LLM (GPT-5-mini)
 * Cost: ~$0.005-0.01 per typical bank statement (más barato que gpt-4o-mini)
 */
export async function parsePDFWithLLM(
  buffer: Buffer
): Promise<ParserResult & { detectedBank?: string; detectionConfidence?: string; usedLLM: boolean }> {
  try {
    // 1. Extract text from PDF
    const text = await parsePDFBuffer(buffer);

    if (!text || text.trim().length < 50) {
      return {
        success: false,
        transactions: [],
        errors: ['El PDF está vacío o no contiene texto suficiente'],
        usedLLM: true,
      };
    }

    // 2. Use LLM to extract structured transactions
    console.log('🤖 Usando GPT-5-mini para extraer transacciones...');

    const result = await generateObject({
      model: openai('gpt-5-mini'),
      schema: TransactionSchema,
      prompt: `Eres un experto en extracción de datos financieros de documentos. Analiza este texto extraído de un PDF y extrae TODAS las transacciones o gastos válidos.

TEXTO DEL DOCUMENTO:
${text.slice(0, 8000)} ${text.length > 8000 ? '... (texto truncado)' : ''}

TIPOS DE DOCUMENTOS SOPORTADOS:
- Extractos bancarios (tarjetas de crédito, cuentas corrientes)
- Tickets de compra (supermercados, tiendas)
- Facturas y recibos
- Estados de cuenta de cualquier institución financiera
- Documentos de gastos no estructurados

REGLAS DE EXTRACCIÓN:

1. **Identificación de transacciones**:
   - Extractos bancarios: Busca patrones de fecha + comercio + monto
   - Tickets: Extrae cada ítem con precio (puede ser una sola transacción del total)
   - Facturas: Extrae el monto total con fecha y emisor
   - Ignora: encabezados, totales duplicados, saldos anteriores, límites de crédito

2. **Formato de fecha** (CRÍTICO):
   - Convierte TODAS las fechas a YYYY-MM-DD
   - Ejemplos: 15/01/2025 → 2025-01-15, 15-01-25 → 2025-01-15, 15 ENE 2025 → 2025-01-15
   - Si solo aparece día/mes sin año, usa el año actual (2025)
   - Si no hay fecha clara, usa la fecha del documento o hoy

3. **Normalización de comercios/vendedores**:
   - Quita números de sucursal: "FARMASHOP N° 3" → "FARMASHOP"
   - Quita locales: "DEVOTO LOCAL 8" → "DEVOTO"
   - Quita caracteres especiales innecesarios
   - Para tickets: usa el nombre del comercio del encabezado
   - Mantén mayúsculas y limpia espacios extras

4. **Detección de moneda** (CRÍTICO — solo UYU o USD):
   - Ejemplos:
     * "U$S 1.234,50" → USD
     * "$ 1.234,50" → UYU
     * "$U 1.234,50" → UYU
     * "USD 50" → USD
     * "US$ 200" → USD
     * "PESOS" / "MONEDA NACIONAL" / "$U" → UYU
     * "DÓLARES" / "DOLARES" / "USD" → USD
   - Si una fila no tiene marcador propio pero el encabezado o pie de la
     sección dice "MONEDA: DÓLARES" o "MONEDA: PESOS", aplica esa moneda
     a TODAS las filas de esa sección.
   - Solo se permiten 'UYU' o 'USD'. NO uses 'ARS', 'EUR' ni 'BRL'.
     Si tienes dudas, usa 'UYU' (Uruguay focus).

5. **Tipo de transacción**:
   - Compras, cargos, débitos, gastos, ítems → expense
   - Pagos recibidos, depósitos, créditos, ingresos → income
   - Devoluciones, reversales, reembolsos → income
   - Tickets de compra: siempre expense

6. **Monto**:
   - Siempre positivo (sin signo negativo)
   - Sin símbolos de moneda
   - Para tickets: puedes extraer el total general O cada ítem (usa el total si hay muchos ítems)

7. **Nivel de confianza** (metadata.confidence):
   - 0.9-1.0: Formato claro y estructurado (extracto bancario estándar)
   - 0.7-0.8: Algunas ambigüedades pero datos claros (tickets, facturas)
   - 0.5-0.6: Texto difícil de interpretar o mal escaneado
   - <0.5: Muy incierto (devuelve array vacío)

8. **Detección de banco/comercio**:
   - Busca logos, nombres de bancos, RUT, razón social
   - Guarda en metadata.bankName (puede ser el banco o el comercio del ticket)

IMPORTANTE:
- Si una transacción aparece en múltiples monedas, crea SOLO UNA con la moneda original
- Para tickets con muchos ítems, puedes crear UNA transacción con el total
- Si es un documento de compra/gasto, siempre extrae al menos 1 transacción

Responde SOLO con el JSON estructurado, sin explicaciones adicionales.`,
      temperature: 0.1, // Baja temperatura para mayor consistencia
    });

    // 3. Validate and return results
    const { transactions, metadata } = result.object;

    // Filter out invalid transactions and coerce currency to UYU/USD only
    // (Uruguay focus — reject ARS/EUR/BRL even if the model returns them).
    const validTransactions = transactions
      .filter(tx => {
        if (!tx.date || !tx.vendor || !tx.amount || tx.amount <= 0) return false;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) return false;
        return true;
      })
      .map(tx => ({
        ...tx,
        currency: tx.currency === 'USD' ? 'USD' : 'UYU',
      }));

    if (validTransactions.length === 0 && metadata.confidence < 0.5) {
      return {
        success: false,
        transactions: [],
        errors: ['No se pudieron extraer transacciones válidas del PDF. El formato puede no ser compatible.'],
        usedLLM: true,
      };
    }

    console.log(`✅ LLM extrajo ${validTransactions.length} transacciones (confianza: ${(metadata.confidence * 100).toFixed(0)}%)`);

    return {
      success: true,
      transactions: validTransactions,
      errors: [],
      metadata: {
        accountType: metadata.accountType,
        currency: validTransactions[0]?.currency || 'UYU',
      },
      detectedBank: metadata.bankName,
      detectionConfidence: metadata.confidence > 0.8 ? 'high' : metadata.confidence > 0.6 ? 'medium' : 'low',
      usedLLM: true,
    };

  } catch (error: any) {
    console.error('Error en LLM PDF parser:', error);

    // Better error messages
    if (error?.message?.includes('API key')) {
      return {
        success: false,
        transactions: [],
        errors: ['Error: OpenAI API key no configurada o inválida'],
        usedLLM: true,
      };
    }

    if (error?.message?.includes('rate limit')) {
      return {
        success: false,
        transactions: [],
        errors: ['Error: Límite de requests de OpenAI excedido. Intenta nuevamente en unos minutos.'],
        usedLLM: true,
      };
    }

    return {
      success: false,
      transactions: [],
      errors: [`Error al procesar PDF con LLM: ${error?.message || error}`],
      usedLLM: true,
    };
  }
}
