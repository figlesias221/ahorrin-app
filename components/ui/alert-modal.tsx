'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'info';
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-foreground hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="flex justify-end">
          <Button onClick={onClose} className="px-6">
            Entendido
          </Button>
        </div>
      </Card>
    </div>
  );
}
