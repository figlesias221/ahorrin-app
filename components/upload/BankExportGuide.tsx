'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink, FileSpreadsheet, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BankGuide {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  formats: string[];
  steps: string[];
  tips?: string[];
  helpLink?: string;
}

const BANK_GUIDES: BankGuide[] = [
  {
    id: 'itau',
    name: 'Itaú',
    displayName: 'Itaú',
    color: '#ec7000',
    icon: '🏦',
    formats: ['XLS', 'XLSX'],
    steps: [
      'Ingresá a tu cuenta en iLink (www.ilink.com.uy)',
      'En el menú principal, seleccioná "Estados de Cuenta"',
      'Elegí la cuenta que querés exportar (Cuenta Corriente, Caja de Ahorros, o Tarjeta de Crédito)',
      'Seleccioná el rango de fechas deseado',
      'Hacé clic en "Exportar" o "Descargar"',
      'Elegí el formato "Excel" o "XLS"',
      'Guardá el archivo en tu computadora'
    ],
    tips: [
      'El archivo de Itaú viene en formato XLS/XLSX con columnas predefinidas',
      'Gasty reconoce automáticamente el formato de Itaú Link Statement',
      'No necesitás modificar el archivo, súbelo tal como lo descargás'
    ],
    helpLink: 'https://www.itau.com.uy/ayuda'
  },
  {
    id: 'santander',
    name: 'Santander',
    displayName: 'Santander',
    color: '#ec0000',
    icon: '🔴',
    formats: ['CSV', 'XLS'],
    steps: [
      'Ingresá a tu cuenta en Santander Online Banking',
      'Seleccioná "Mis Cuentas" > "Movimientos"',
      'Elegí la cuenta o tarjeta que querés exportar',
      'Seleccioná el período (rango de fechas)',
      'Buscá la opción "Exportar" o "Descargar movimientos"',
      'Seleccioná el formato CSV o Excel',
      'Guardá el archivo'
    ],
    tips: [
      'Santander permite exportar hasta 90 días de movimientos por vez',
      'Si necesitás más tiempo, descargá varios archivos y súbelos juntos',
      'El formato CSV de Santander puede variar - si tenés problemas, contactanos'
    ]
  },
  {
    id: 'scotia',
    name: 'Scotia',
    displayName: 'Scotiabank',
    color: '#ed1c24',
    icon: '🏴',
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
    icon: '🔵',
    formats: ['CSV', 'XLS', 'PDF'],
    steps: [
      'Ingresá a BBVA Net Cash (www.bbva.com.uy)',
      'Seleccioná "Cuentas" en el menú',
      'Hacé clic en la cuenta que querés consultar',
      'Seleccioná "Movimientos" o "Extracto"',
      'Elegí el período',
      'Buscá el botón "Exportar" (puede estar como ícono de descarga)',
      'Seleccioná formato Excel o CSV',
      'Descargá el archivo'
    ],
    tips: [
      'BBVA permite exportar en varios formatos',
      'Preferí CSV o Excel antes que PDF para mejor compatibilidad',
      'Si el banco no ofrece exportación, podés usar entrada manual en Gasty'
    ]
  },
  {
    id: 'brou',
    name: 'BROU',
    displayName: 'Banco República (BROU)',
    color: '#009639',
    icon: '🟢',
    formats: ['CSV', 'XLS'],
    steps: [
      'Ingresá a e-BROU (www.ebrou.com.uy)',
      'Seleccioná "Consultas" > "Movimientos"',
      'Elegí la cuenta',
      'Definí las fechas de inicio y fin',
      'Hacé clic en "Exportar" o ícono de descarga',
      'Seleccioná CSV o Excel',
      'Guardá el archivo'
    ],
    tips: [
      'e-BROU permite exportar movimientos de cuentas y tarjetas',
      'El formato es generalmente estándar y compatible',
      'Para tarjetas Visa/Mastercard del BROU, usá la sección de Tarjetas'
    ]
  },
  {
    id: 'heritage',
    name: 'Heritage',
    displayName: 'Heritage Bank',
    color: '#1e3a8a',
    icon: '💼',
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
    id: 'generic',
    name: 'Otro Banco',
    displayName: 'Otro Banco',
    color: '#6b7280',
    icon: '🏛️',
    formats: ['CSV'],
    steps: [
      'Ingresá a tu homebanking',
      'Buscá la sección de "Movimientos", "Extractos" o "Transacciones"',
      'Seleccioná la cuenta o tarjeta',
      'Elegí el período que querés exportar',
      'Buscá opciones como "Exportar", "Descargar", o ícono de Excel/CSV',
      'Seleccioná CSV o Excel si está disponible',
      'Si no hay opción de exportación, considerá la entrada manual en Gasty'
    ],
    tips: [
      'La mayoría de los bancos modernos permiten exportar a CSV/Excel',
      'Si tu banco solo ofrece PDF, contactanos para buscar una solución',
      'Alternativamente, podés usar la entrada manual rápida en Gasty'
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
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{bank.displayName}</p>
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

              {/* Mensaje final */}
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">¿No encontrás opción de exportación en tu banco?</strong>
                  {' '}Usá la entrada manual rápida en Gasty para agregar tus transacciones de forma ágil.
                  También podés contactarnos y te ayudamos a encontrar una solución.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
