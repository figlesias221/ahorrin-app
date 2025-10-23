'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, FileJson, Copy, Check } from 'lucide-react';
import { typography } from '@/lib/design-tokens';
import type { Message } from '@ai-sdk/react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  conversationTitle?: string;
}

export function ExportDialog({ isOpen, onClose, messages, conversationTitle }: ExportDialogProps) {
  const [format, setFormat] = useState<'markdown' | 'json' | 'text'>('markdown');
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    let markdown = `# ${conversationTitle || 'Conversación con Ahorrin AI'}\n\n`;
    markdown += `Exportado el: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}\n\n---\n\n`;

    messages.forEach((msg) => {
      const role = msg.role === 'user' ? '👤 Usuario' : '🤖 Asistente';
      markdown += `## ${role}\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    return markdown;
  };

  const generateJSON = () => {
    return JSON.stringify({
      title: conversationTitle || 'Conversación con Ahorrin AI',
      exportDate: new Date().toISOString(),
      messagesCount: messages.length,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt || new Date().toISOString(),
      }))
    }, null, 2);
  };

  const generateText = () => {
    let text = `${conversationTitle || 'Conversación con Ahorrin AI'}\n`;
    text += `Exportado el: ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `${'='.repeat(60)}\n\n`;

    messages.forEach((msg) => {
      const role = msg.role === 'user' ? 'USUARIO' : 'ASISTENTE';
      text += `${role}:\n${msg.content}\n\n${'-'.repeat(60)}\n\n`;
    });

    return text;
  };

  const getContent = () => {
    switch (format) {
      case 'markdown':
        return generateMarkdown();
      case 'json':
        return generateJSON();
      case 'text':
        return generateText();
    }
  };

  const getFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const title = (conversationTitle || 'conversacion').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const ext = format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt';
    return `ahorrin-${title}-${timestamp}.${ext}`;
  };

  const handleDownload = () => {
    const content = getContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const content = getContent();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full bg-background rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className={typography.h2}>Exportar conversación</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <label className={`${typography.body} text-foreground mb-3 block`}>
                  Formato de exportación
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFormat('markdown')}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${format === 'markdown'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <FileText className={`h-5 w-5 mx-auto mb-2 ${
                      format === 'markdown' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className={`${typography.bodySmall} text-center`}>Markdown</p>
                  </button>

                  <button
                    onClick={() => setFormat('json')}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${format === 'json'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <FileJson className={`h-5 w-5 mx-auto mb-2 ${
                      format === 'json' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className={`${typography.bodySmall} text-center`}>JSON</p>
                  </button>

                  <button
                    onClick={() => setFormat('text')}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${format === 'text'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <FileText className={`h-5 w-5 mx-auto mb-2 ${
                      format === 'text' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className={`${typography.bodySmall} text-center`}>Texto</p>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className={`${typography.body} text-foreground mb-3 block`}>
                  Vista previa
                </label>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-surface ring-1 ring-border text-xs overflow-x-auto max-h-64 overflow-y-auto">
                    {getContent()}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-background hover:bg-muted rounded-lg transition-colors ring-1 ring-border"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <p className={`${typography.bodySmall} text-muted-foreground`}>
                {messages.length} mensajes
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
