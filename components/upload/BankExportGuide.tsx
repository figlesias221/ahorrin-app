'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink, FileSpreadsheet, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    icon: '🏦',
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
    icon: '🏦',
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
    icon: '🏦',
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
    icon: '🏦',
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
    icon: '🏦',
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
    icon: '🏦',
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
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              ¿Cómo exportar desde mi banco?
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-2 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/40"
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
            <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
              Guías paso a paso para exportar CSV/XLS de todos los bancos uruguayos
            </p>
          )}

          {expanded && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-purple-800 dark:text-purple-200 mb-3">
                Seleccioná tu banco para ver instrucciones detalladas:
              </p>

              {BANK_GUIDES.map((bank) => (
                <div key={bank.id} className="border border-purple-200 dark:border-purple-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  <button
                    onClick={() => toggleBank(bank.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{bank.displayName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Formatos: {bank.formats.join(', ')}
                        </p>
                      </div>
                    </div>
                    {selectedBank === bank.id ? (
                      <ChevronUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>

                  {selectedBank === bank.id && (
                    <div className="px-4 pb-4 pt-2 bg-purple-50/50 dark:bg-purple-950/20 border-t border-purple-200 dark:border-purple-700">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            📋 Pasos para exportar:
                          </p>
                          <ol className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 ml-4">
                            {bank.steps.map((step, idx) => (
                              <li key={idx} className="list-decimal">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {bank.tips && bank.tips.length > 0 && (
                          <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              💡 Tips:
                            </p>
                            <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 ml-4">
                              {bank.tips.map((tip, idx) => (
                                <li key={idx} className="list-disc">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {bank.helpLink && (
                          <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                            <a
                              href={bank.helpLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-medium"
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

              <div className="mt-4 pt-3 border-t border-purple-300 dark:border-purple-700">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  <strong>¿No encontrás opción de exportación en tu banco?</strong>
                  <br />
                  Usá la <strong>entrada manual rápida</strong> en Gasty para agregar tus transacciones de forma ágil.
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
