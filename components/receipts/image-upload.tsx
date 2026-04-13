'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  onImagesSelected?: (files: Array<{ file: File; previewUrl: string }>) => void;
  onClear: () => void;
  disabled?: boolean;
  multiple?: boolean;
}

export function ImageUpload({ onImageSelected, onImagesSelected, onClear, disabled = false, multiple = false }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (multiple && onImagesSelected) {
      processMultipleFiles(Array.from(files));
    } else {
      const file = files[0];
      if (file) {
        processFile(file);
      }
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

  const processMultipleFiles = async (files: File[]) => {
    const validFiles: Array<{ file: File; previewUrl: string }> = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}: Por favor selecciona solo imágenes válidas`);
        continue;
      }

      // Validate file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert(`${file.name}: La imagen es demasiado grande. Máximo 20MB.`);
        continue;
      }

      // Create preview
      const reader = new FileReader();
      const previewUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      validFiles.push({ file, previewUrl });
    }

    if (validFiles.length > 0) {
      setPreviewUrls(validFiles);
      onImagesSelected?.(validFiles);
    }
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

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (multiple && onImagesSelected) {
      processMultipleFiles(Array.from(files));
    } else {
      const file = files[0];
      if (file) {
        processFile(file);
      }
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const removeImage = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    if (newPreviews.length === 0) {
      handleClear();
    } else {
      onImagesSelected?.(newPreviews);
    }
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
        multiple={multiple}
      />

      {!previewUrl && previewUrls.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={disabled ? undefined : openFileDialog}
        >
          <Card
            className={`relative border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Sube {multiple ? 'fotos de los tickets' : 'una foto del ticket'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arrastra y suelta {multiple ? 'una o más imágenes' : 'una imagen'}, o haz clic para seleccionar
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
        </div>
      ) : previewUrls.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((preview, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="relative aspect-[3/4] bg-muted">
                  <Image
                    src={preview.previewUrl}
                    alt={`Ticket ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <Button
                    type="button"
                    variant="error"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-2 text-center text-xs text-muted-foreground">
                  Ticket {index + 1}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>{previewUrls.length} {previewUrls.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={disabled}
              >
                <Upload className="h-4 w-4 mr-2" />
                Agregar más
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar todo
              </Button>
            </div>
          </div>
        </div>
      ) : previewUrl ? (
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
      ) : null}
    </div>
  );
}
