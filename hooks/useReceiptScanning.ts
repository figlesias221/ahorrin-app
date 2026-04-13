'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { analytics } from '@/components/analytics/google-analytics';
import type { ReceiptParseResult } from '@/types';

export function useReceiptScanning(onDataChanged: () => void) {
  const [receiptImage, setReceiptImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [receiptImages, setReceiptImages] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const [parsingReceipt, setParsingReceipt] = useState(false);
  const [receiptParseResult, setReceiptParseResult] = useState<ReceiptParseResult | null>(null);
  const [receiptParseResults, setReceiptParseResults] = useState<Array<{ result: ReceiptParseResult; imageUrl: string; imageIndex: number }>>([]);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);

  const toast = useToast();

  const handleImageSelected = (file: File, previewUrl: string) => {
    setReceiptImage({ file, previewUrl });
  };

  const handleImagesSelected = (images: Array<{ file: File; previewUrl: string }>) => {
    setReceiptImages(images);
  };

  const handleImageClear = () => {
    setReceiptImage(null);
    setReceiptImages([]);
    setReceiptParseResult(null);
    setReceiptParseResults([]);
  };

  const handleAnalyze = async () => {
    const imagesToProcess = receiptImages.length > 0 ? receiptImages : (receiptImage ? [receiptImage] : []);
    if (imagesToProcess.length === 0) return;

    setParsingReceipt(true);
    setReceiptParseResult(null);
    setReceiptParseResults([]);
    analytics.useFeature('receipt_scan');

    try {
      const results: Array<{ result: ReceiptParseResult; imageUrl: string; imageIndex: number }> = [];

      for (let i = 0; i < imagesToProcess.length; i++) {
        const image = imagesToProcess[i];
        try {
          const formData = new FormData();
          formData.append('image', image.file);

          const response = await fetch('/api/receipts/parse-image', {
            method: 'POST',
            body: formData,
          });

          const result: ReceiptParseResult = await response.json();

          if (!response.ok) {
            toast.error(`Ticket ${i + 1}: ${result.error || 'Error al procesar'}`);
            continue;
          }

          if (result.success) {
            results.push({ result, imageUrl: image.previewUrl, imageIndex: i });
          } else {
            toast.error(`Ticket ${i + 1}: ${result.error || 'Error al procesar'}`);
          }
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error);
          toast.error(`Ticket ${i + 1}: Error al procesar la imagen`);
        }
      }

      if (results.length > 0) {
        setReceiptParseResults(results);
        setCurrentReceiptIndex(0);
        setShowReceiptPreview(true);

        if (results.length === 1) {
          toast.success(`Ticket analizado con ${(results[0].result.confidence * 100).toFixed(0)}% de confianza`);
        } else {
          toast.success(`${results.length} tickets analizados exitosamente`);
        }
      } else {
        toast.error('No se pudo analizar ningún ticket');
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error analyzing receipts:', error);
      toast.error(err.message || 'Error al analizar los tickets');
    } finally {
      setParsingReceipt(false);
    }
  };

  const handleSaved = () => {
    onDataChanged();

    if (receiptParseResults.length > 1) {
      const nextIndex = currentReceiptIndex + 1;
      if (nextIndex < receiptParseResults.length) {
        setCurrentReceiptIndex(nextIndex);
        toast.success(`Transaccion ${currentReceiptIndex + 1} creada. Mostrando ticket ${nextIndex + 1} de ${receiptParseResults.length}`);
      } else {
        handleImageClear();
        setShowReceiptPreview(false);
        setCurrentReceiptIndex(0);
        toast.success('Todas las transacciones creadas exitosamente');
      }
    } else {
      handleImageClear();
      setShowReceiptPreview(false);
      toast.success('Transaccion creada exitosamente desde ticket');
    }
  };

  const handleRetry = () => {
    setShowReceiptPreview(false);
    setReceiptParseResult(null);
    setReceiptParseResults([]);
  };

  return {
    receiptImage,
    receiptImages,
    parsingReceipt,
    receiptParseResult,
    receiptParseResults,
    showReceiptPreview,
    currentReceiptIndex,
    handleImageSelected,
    handleImagesSelected,
    handleImageClear,
    handleAnalyze,
    handleSaved,
    handleRetry,
  };
}
