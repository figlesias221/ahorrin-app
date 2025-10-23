'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BankGuide {
  id: string;
  name: string;
  displayName: string;
  color: string;
  formats: string[];
  steps: string[];
  tips?: string[];
  helpLink?: string;
  verified?: boolean; // Indicates if instructions are verified for 2025
  limitations?: string[]; // Known limitations for this bank
}

const BANK_GUIDES: BankGuide[] = [
  {
    id: 'itau',
    name: 'Itaú',
    displayName: 'Itaú',
    color: '#ec7000',
    formats: ['XLS', 'XLSX'],
    verified: true,
    steps: [
      'Ingresá a Hola! Itaú (www.itau.com.uy) con tu documento y clave',
      'Para TARJETAS DE CRÉDITO: Seleccioná "Tarjetas de Crédito" → "Ver más" → "Control de gastos"',
      'Para CUENTAS: Andá a "Cuentas" → Elegí tu cuenta → "Movimientos"',
      'Seleccioná el rango de fechas que querés consultar',
      'Hacé clic en el botón "Descargar" o ícono de Excel',
      'El archivo se descarga automáticamente en formato Excel (.xls o .xlsx)',
      'Guardá el archivo sin modificarlo'
    ],
    tips: [
      'Itaú ofrece 3 formatos diferentes de descarga según la sección',
      'Para tarjetas, la función "Control de gastos" es la más completa',
      'NO ofrece CSV directo, solo Excel - pero Ahorrín acepta archivos .xls/.xlsx sin problemas',
      'El formato de Itaú es automáticamente reconocido por Ahorrín',
      'No necesitás editar ni convertir el archivo'
    ],
    limitations: [
      'Solo ofrece formato Excel (XLS/XLSX), no CSV directo',
      'El rango de descarga puede estar limitado según el tipo de cuenta'
    ],
    helpLink: 'https://www.itau.com.uy/inst/controlDeGastos.html'
  },
  {
    id: 'santander',
    name: 'Santander',
    displayName: 'Santander',
    color: '#ec0000',
    formats: ['XLS', 'TXT', 'CSV'],
    verified: true,
    steps: [
      'Ingresá a Santander Online Banking (www.santander.com.uy)',
      'También podés usar la App Santander desde tu celular',
      'Seleccioná "Mis Cuentas" → "Movimientos" o "Consulta de movimientos"',
      'Elegí la cuenta o tarjeta que querés consultar',
      'Definí el período (rango de fechas) que necesitás',
      'Buscá el botón "Exportar" o ícono de descarga',
      'Seleccioná el formato: Excel, .txt, o Multicash según tus necesidades',
      'El archivo se descarga automáticamente'
    ],
    tips: [
      'Santander ofrece 3 formatos: Excel, .txt, y Multicash - elegí Excel o CSV para Ahorrín',
      'La app móvil también permite exportar estados de cuenta',
      'Podés exportar hasta 90 días por vez - si necesitás más, descargá varios períodos',
      'Ahorrín puede procesar múltiples archivos juntos',
      'El formato de Santander es generalmente estándar y bien compatible'
    ],
    limitations: [
      'Límite de 90 días por exportación (descargá múltiples períodos si necesitás más)'
    ],
    helpLink: 'https://www.santander.com.uy/santander-digital/app-santander-uruguay'
  },
  {
    id: 'scotia',
    name: 'Scotia',
    displayName: 'Scotiabank',
    color: '#ed1c24',
    formats: ['CSV', 'XLS'],
    steps: [
      'Ingresá a ScotiaWeb (www.scotiaweb.com.uy)',
      'Seleccioná "Cuentas" > "Consulta de Movimientos"',
      'Elegí la cuenta o tarjeta',
      'Definí el rango de fechas',
      'Hacé clic en "Exportar a Excel" o "Descargar CSV"',
      'Guardá el archivo en tu equipo'
    ],
    tips: [
      'Scotia ofrece exportación directa a Excel',
      'Para tarjetas de crédito, el proceso es similar pero en la sección "Tarjetas"',
      'Verificá que el archivo contenga las columnas: Fecha, Descripción, Monto'
    ]
  },
  {
    id: 'bbva',
    name: 'BBVA',
    displayName: 'BBVA',
    color: '#004481',
    formats: ['XLS', 'CSV', 'PDF'],
    verified: true,
    steps: [
      'Ingresá a BBVA Net (www.bbva.com.uy) con tu usuario y clave',
      'En el menú principal, seleccioná "Cuentas"',
      'Hacé clic en "Posición Global" en el margen derecho',
      'Buscá la opción "Estado de Cuenta Mensual"',
      'IMPORTANTE: Los estados están disponibles entre el día 8 y 10 de cada mes',
      'Seleccioná el mes que querés descargar',
      'Hacé clic en "Descargar"',
      'Elegí formato Excel o CSV (evitá PDF para mejor compatibilidad)'
    ],
    tips: [
      'Los estados de cuenta se publican mensualmente entre el 8 y 10 de cada mes',
      'BBVA ofrece múltiples formatos: preferí Excel o CSV sobre PDF',
      'PDF tiene limitaciones de privacidad y procesamiento - mejor usar Excel/CSV',
      'Si necesitás consultar movimientos más recientes, usá "Movimientos" en lugar de "Estados"',
      'Para períodos no cubiertos por estados, considerá la entrada manual en Ahorrín'
    ],
    limitations: [
      'Estados de cuenta solo disponibles mensualmente (días 8-10 de cada mes)',
      'Descarga limitada a períodos cerrados del mes anterior',
      'Para consultas en tiempo real, usar sección "Movimientos" (sin descarga)'
    ],
    helpLink: 'https://www.bbva.com.uy/personas/ayuda.html'
  },
  {
    id: 'brou',
    name: 'BROU',
    displayName: 'Banco República (BROU)',
    color: '#009639',
    formats: ['CSV', 'XLS', 'Excel'],
    verified: true,
    steps: [
      'Ingresá a e-BROU (www.ebrou.com.uy) o usá la app eBROU desde tu celular',
      'Seleccioná "Consultas" en el menú principal',
      'Hacé clic en "Movimientos" o "Consulta de movimientos"',
      'Elegí la cuenta que querés consultar',
      'Definí el rango de fechas (fecha inicio y fecha fin)',
      'Buscá el botón "Exportar" o el ícono de descarga',
      'Seleccioná el formato (generalmente Excel o CSV)',
      'El archivo se descarga automáticamente a tu dispositivo'
    ],
    tips: [
      'e-BROU está disponible tanto en web como en app móvil (iOS/Android)',
      'Podés consultar y exportar movimientos de todas tus cuentas y tarjetas',
      'Para tarjetas Visa/Mastercard del BROU, andá a la sección "Tarjetas"',
      'El formato de exportación es estándar y compatible con Ahorrín',
      'Recomendación: consultá periódicamente para mantener tus registros actualizados'
    ],
    limitations: [
      'El formato exacto de exportación puede variar según el tipo de cuenta',
      'Verificá que la descarga incluya: Fecha, Descripción/Concepto, Monto'
    ],
    helpLink: 'https://www.brou.com.uy/ayuda'
  },
  {
    id: 'heritage',
    name: 'Heritage',
    displayName: 'Heritage Bank',
    color: '#1e3a8a',
    formats: ['CSV', 'XLS'],
    steps: [
      'Ingresá a Heritage Online Banking',
      'Navega a "Account Statements" o "Movimientos"',
      'Seleccioná la cuenta',
      'Elegí el rango de fechas',
      'Descargá en formato CSV o Excel',
      'Guardá el archivo'
    ],
    tips: [
      'Heritage suele ofrecer exportación en formato internacional',
      'Verificá que las columnas incluyan Date, Description, Amount',
      'Si tenés problemas con el formato, contactanos para ayudarte'
    ]
  },
  {
    id: 'oca',
    name: 'OCA',
    displayName: 'OCA',
    color: '#0066cc',
    formats: ['CSV', 'Excel'],
    verified: true,
    steps: [
      'Ingresá a Mi Cuenta OCA (micuenta.oca.com.uy) con tu usuario y clave',
      'También podés usar la app OCA desde tu celular',
      'Seleccioná "Mis Movimientos" o "Consulta de Movimientos"',
      'Elegí el período que querés consultar (rango de fechas)',
      'Buscá el botón "Exportar" o "Descargar"',
      'Seleccioná el formato Excel o CSV',
      'El archivo se descarga automáticamente'
    ],
    tips: [
      'OCA permite ver tus movimientos en tiempo real desde la web o app',
      'Podés consultar movimientos históricos y descargarlos',
      'El formato de exportación es compatible con Ahorrín',
      'Si usás OCA vinculada a diferentes bancos, los movimientos aparecen unificados',
      'La app móvil también ofrece opciones de consulta y descarga'
    ],
    limitations: [
      'El rango de exportación puede variar según tu tipo de cuenta',
      'Verificá que el archivo incluya: Fecha, Comercio/Descripción, Monto'
    ],
    helpLink: 'https://oca.uy/ayuda'
  },
  {
    id: 'generic',
    name: 'Otro Banco',
    displayName: 'Otro Banco',
    color: '#6b7280',
    formats: ['CSV'],
    steps: [
      'Ingresá a tu homebanking',
      'Buscá la sección de "Movimientos", "Extractos" o "Transacciones"',
      'Seleccioná la cuenta o tarjeta',
      'Elegí el período que querés exportar',
      'Buscá opciones como "Exportar", "Descargar", o ícono de Excel/CSV',
      'Seleccioná CSV o Excel si está disponible',
      'Si no hay opción de exportación, considerá la entrada manual en Ahorrín'
    ],
    tips: [
      'La mayoría de los bancos modernos permiten exportar a CSV/Excel',
      'Si tu banco solo ofrece PDF, contactanos para buscar una solución',
      'Alternativamente, podés usar la entrada manual rápida en Ahorrín'
    ]
  }
];

export function BankExportGuide() {
  const [expanded, setExpanded] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const toggleBank = (bankId: string) => {
    setSelectedBank(selectedBank === bankId ? null : bankId);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              ¿Cómo exportar desde mi banco?
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
                  <span className="text-xs">Ocultar</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  <span className="text-xs">Ver guías</span>
                </>
              )}
            </Button>
          </div>

          {!expanded && (
            <p className="text-xs text-muted-foreground mt-1">
              Guías paso a paso para exportar CSV/XLS de todos los bancos uruguayos
            </p>
          )}

          {expanded && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Seleccioná tu banco para ver instrucciones detalladas:
              </p>

              {BANK_GUIDES.map((bank) => (
                <div
                  key={bank.id}
                  className="border border-border/50 rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-colors"
                >
                  <button
                    onClick={() => toggleBank(bank.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-10 rounded-sm"
                        style={{ backgroundColor: bank.color }}
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{bank.displayName}</p>
                          {bank.verified && (
                            <Badge
                              variant="default"
                              className="text-xs px-1.5 py-0 h-4 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                            >
                              ✓ 2025
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mt-0.5">
                          {bank.formats.map((format) => (
                            <Badge
                              key={format}
                              variant="outline"
                              className="text-xs px-1.5 py-0 h-4 text-muted-foreground border-border/50"
                            >
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedBank === bank.id ? (
                      <ChevronUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {selectedBank === bank.id && (
                    <div className="px-4 pb-4 pt-2 bg-muted/30 border-t border-border/50">
                      <div className="space-y-3">
                        {/* Pasos */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-2">
                            Pasos para exportar:
                          </p>
                          <ol className="space-y-1.5 text-xs text-muted-foreground ml-4">
                            {bank.steps.map((step, idx) => (
                              <li key={idx} className="list-decimal">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Tips */}
                        {bank.tips && bank.tips.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs font-semibold text-foreground mb-2">
                              💡 Tips:
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                              {bank.tips.map((tip, idx) => (
                                <li key={idx} className="list-disc">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Limitations */}
                        {bank.limitations && bank.limitations.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                              Limitaciones conocidas:
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                              {bank.limitations.map((limitation, idx) => (
                                <li key={idx} className="list-disc text-amber-700 dark:text-amber-400">
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Link */}
                        {bank.helpLink && (
                          <div className="pt-2 border-t border-border/50">
                            <a
                              href={bank.helpLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Ayuda oficial del banco
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Mensaje final - Alternativas */}
              <div className="mt-4 pt-3 border-t border-border/50 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">
                    ¿No encontrás opción de exportación en tu banco?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Usá la <strong>entrada manual rápida</strong> en Ahorrín para agregar tus transacciones de forma ágil y segura.
                    Es más rápido de lo que pensás y tenés control total sobre tu información.
                  </p>
                </div>

                <div className="bg-background border-2 border-amber-500 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    ¿Por qué evitamos PDF?
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    Los extractos PDF contienen información sensible como números de cuenta completos,
                    saldos totales, y datos personales. Subir PDFs representa una <strong>barrera de seguridad
                    y privacidad</strong> que muchos usuarios (como vos) prefieren evitar.
                    Por eso recomendamos CSV/Excel (solo transacciones) o entrada manual.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">¿Necesitás ayuda?</strong>
                    {' '}Contactanos y te ayudamos a encontrar la mejor solución para tu banco.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
