'use client';

import dynamic from 'next/dynamic';
import { Camera, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { ReceiptParseResult } from '@/types';

const ImageUpload = dynamic(() => import('@/components/receipts/image-upload').then(m => ({ default: m.ImageUpload })));
const ReceiptPreviewModal = dynamic(() => import('@/components/receipts/receipt-preview-modal').then(m => ({ default: m.ReceiptPreviewModal })));

interface ReceiptScannerSectionProps {
  receiptImage: { file: File; previewUrl: string } | null;
  receiptImages: Array<{ file: File; previewUrl: string }>;
  parsingReceipt: boolean;
  receiptParseResult: ReceiptParseResult | null;
  receiptParseResults: Array<{ result: ReceiptParseResult; imageUrl: string; imageIndex: number }>;
  showReceiptPreview: boolean;
  currentReceiptIndex: number;
  categories: Array<{ id: string; name: string; color: string }>;
  onImageSelected: (file: File, previewUrl: string) => void;
  onImagesSelected: (images: Array<{ file: File; previewUrl: string }>) => void;
  onImageClear: () => void;
  onAnalyze: () => void;
  onSaved: () => void;
  onRetry: () => void;
}

export function ReceiptScannerSection({
  receiptImage,
  receiptImages,
  parsingReceipt,
  receiptParseResult,
  receiptParseResults,
  showReceiptPreview,
  currentReceiptIndex,
  categories,
  onImageSelected,
  onImagesSelected,
  onImageClear,
  onAnalyze,
  onSaved,
  onRetry,
}: ReceiptScannerSectionProps) {
  const currentResult = receiptParseResults[currentReceiptIndex];

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Escanear Ticket de Compra</h2>
          <p className="text-sm text-muted-foreground">
            Sube una foto de tu ticket y la IA extraera automaticamente los datos de la transaccion
          </p>
        </div>

        <div className="space-y-6">
          <ImageUpload
            onImageSelected={onImageSelected}
            onImagesSelected={onImagesSelected}
            onClear={onImageClear}
            disabled={parsingReceipt}
            multiple={true}
          />

          {(receiptImage || receiptImages.length > 0) && receiptParseResults.length === 0 && !receiptParseResult && (
            <div className="flex justify-center">
              <Button
                onClick={onAnalyze}
                disabled={parsingReceipt}
                size="lg"
                className="min-w-[200px]"
              >
                {parsingReceipt ? (
                  <>
                    <span className="mr-2">Analizando...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Camera className="h-5 w-5" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Analizar Ticket con IA
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Captura clara</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Asegurate que el ticket este bien iluminado y enfocado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">IA precisa</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Nuestra IA extrae fecha, comercio, monto y categoria
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Revision final</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Siempre podras editar los datos antes de guardar
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <details className="rounded-lg border bg-muted/30 p-4">
        <summary className="text-sm font-semibold flex items-center gap-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <AlertCircle className="h-4 w-4 text-primary" />
          Consejos para mejores resultados
        </summary>
        <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc mt-2">
          <li>Fotografia el ticket completo, incluyendo el encabezado y total</li>
          <li>Evita sombras y reflejos que dificulten la lectura</li>
          <li>Si el ticket esta arrugado, estiralo antes de fotografiar</li>
          <li>Funciona con tickets de supermercados, farmacias, restaurantes, etc.</li>
        </ul>
      </details>

      {/* Receipt Preview Modal */}
      {showReceiptPreview && currentResult && (
        <ReceiptPreviewModal
          result={currentResult.result}
          imageUrl={currentResult.imageUrl}
          categories={categories}
          onClose={onRetry}
          onSave={onSaved}
          onRetry={onRetry}
          currentIndex={currentReceiptIndex}
          totalCount={receiptParseResults.length}
        />
      )}
    </>
  );
}
