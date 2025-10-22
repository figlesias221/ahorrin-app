'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Lock, FileCheck, Database, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PrivacyNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Privacidad Primero
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-2 text-muted-foreground hover:bg-muted"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span className="text-xs">Menos info</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  <span className="text-xs">Más info</span>
                </>
              )}
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            {/* Alerta principal */}
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                <strong>Por tu seguridad, Gasty NO acepta PDFs de extractos bancarios completos.</strong>
                {' '}Estos archivos contienen información sensible innecesaria: número de cuenta, saldo, dirección, etc.
              </p>
            </div>

            {/* Alternativas seguras */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs font-semibold text-foreground mb-2">
                Alternativas seguras:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">CSV/XLS:</strong> Exportá desde tu banco (solo transacciones, sin datos de cuenta)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Entrada manual:</strong> Agregá transacciones individuales con el formulario</span>
                </li>
              </ul>
            </div>

            {expanded && (
              <div className="space-y-3 pt-2">
                {/* ¿Qué datos guardamos? */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Database className="h-4 w-4 text-primary" />
                    ¿Qué datos guardamos?
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground ml-5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Transacciones:</strong> Fecha, concepto, monto, categoría</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Configuración:</strong> Categorías, reglas, preferencias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3 w-3 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">NO guardamos:</strong> Archivos originales (CSV/XLS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3 w-3 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">NO guardamos:</strong> Números de cuenta, saldos, ni otros datos bancarios</span>
                    </li>
                  </ul>
                </div>

                {/* Seguridad */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-primary" />
                    Seguridad de tus datos
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground ml-5">
                    <li className="list-disc"><strong className="text-foreground">Encriptación AES-256</strong> en la base de datos</li>
                    <li className="list-disc"><strong className="text-foreground">Row-Level Security (RLS)</strong> en PostgreSQL</li>
                    <li className="list-disc"><strong className="text-foreground">Solo vos</strong> podés acceder a tus datos</li>
                    <li className="list-disc">Procesamiento <strong className="text-foreground">local primero</strong>, sin enviar a servidores cuando sea posible</li>
                  </ul>
                </div>

                {/* Tip final */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">💡 Tip:</strong> Si tu banco no permite exportar CSV/XLS, contactanos y te ayudamos a encontrar una solución segura.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
