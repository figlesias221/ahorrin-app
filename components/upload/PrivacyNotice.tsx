'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Lock, FileCheck, Database, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PrivacyNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              🔒 Privacidad Primero
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/60"
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

          <div className="mt-2 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Por tu seguridad, Gasty NO acepta PDFs de extractos bancarios completos.</strong>
                <br />
                Estos archivos contienen información sensible innecesaria: número de cuenta, saldo, dirección, etc.
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                ✅ Alternativas seguras:
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FileCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>CSV/XLS:</strong> Exportá desde tu banco (solo transacciones, sin datos de cuenta)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Entrada manual:</strong> Agregá transacciones individuales con el formulario</span>
                </li>
              </ul>
            </div>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1.5">
                    <Database className="h-4 w-4" />
                    ¿Qué datos guardamos?
                  </p>
                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 ml-5">
                    <li className="list-disc">✅ <strong>Transacciones:</strong> Fecha, concepto, monto, categoría</li>
                    <li className="list-disc">✅ <strong>Configuración:</strong> Categorías, reglas, preferencias</li>
                    <li className="list-disc">❌ <strong>NO guardamos:</strong> Archivos originales (CSV/XLS)</li>
                    <li className="list-disc">❌ <strong>NO guardamos:</strong> Números de cuenta, saldos, ni otros datos bancarios</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1.5">
                    <Lock className="h-4 w-4" />
                    Seguridad de tus datos
                  </p>
                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 ml-5">
                    <li className="list-disc"><strong>Encriptación AES-256</strong> en la base de datos</li>
                    <li className="list-disc"><strong>Row-Level Security (RLS)</strong> en PostgreSQL</li>
                    <li className="list-disc"><strong>Solo vos</strong> podés acceder a tus datos</li>
                    <li className="list-disc">Procesamiento <strong>local primero</strong>, sin enviar a servidores cuando sea posible</li>
                  </ul>
                </div>

                <div className="mt-3 pt-2 border-t border-blue-300 dark:border-blue-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    💡 <strong>Tip:</strong> Si tu banco no permite exportar CSV/XLS, contactanos y te ayudamos a encontrar una solución segura.
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
