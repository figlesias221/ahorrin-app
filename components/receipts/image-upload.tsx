'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelected, onClear, disabled = false }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 20MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPreviewUrl(url);
      onImageSelected(file, url);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Use back camera on mobile
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!previewUrl ? (
        <Card
          className={`relative border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={disabled ? undefined : openFileDialog}
        >
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Sube una foto del ticket
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arrastra y suelta una imagen, o haz clic para seleccionar
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivo
              </Button>

              {/* Show camera button only on mobile */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="sm:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
              >
                <Camera className="h-4 w-4 mr-2" />
                Tomar foto
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Formatos: JPG, PNG, WebP • Máx: 20MB
            </p>
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden">
          <div className="relative aspect-[3/4] max-h-[600px] bg-muted">
            <Image
              src={previewUrl}
              alt="Preview del ticket"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          <div className="p-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>Imagen seleccionada</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-2" />
              Cambiar imagen
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
