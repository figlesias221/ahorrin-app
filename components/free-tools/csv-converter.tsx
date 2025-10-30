'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, CheckCircle2, Mail, ArrowRight, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface ConvertedData {
  rows: number;
  bankDetected: string;
  previewData: Array<{
    date: string;
    description: string;
    amount: string;
    balance?: string;
  }>;
}

export function CsvConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [convertedData, setConvertedData] = useState<ConvertedData | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedBanks = [
    { name: 'Itaú', icon: '🏦', format: 'CSV' },
    { name: 'BBVA', icon: '🏦', format: 'CSV/Excel' },
    { name: 'Scotiabank', icon: '🏦', format: 'CSV' },
    { name: 'BROU', icon: '🏦', format: 'CSV/Excel' },
    { name: 'Santander', icon: '🏦', format: 'CSV' },
    { name: 'Heritage', icon: '🏦', format: 'CSV' },
  ];

  const detectBank = (content: string): string => {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('itau') || lowerContent.includes('itaú')) return 'Itaú';
    if (lowerContent.includes('bbva')) return 'BBVA';
    if (lowerContent.includes('scotia')) return 'Scotiabank';
    if (lowerContent.includes('brou') || lowerContent.includes('banco república')) return 'BROU';
    if (lowerContent.includes('santander')) return 'Santander';
    if (lowerContent.includes('heritage')) return 'Heritage';

    return 'Desconocido';
  };

  const parseCSV = (content: string): Array<any> => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Simple CSV parser (in real app, use a library like PapaParse)
    const rows = lines.map(line => {
      // Handle quoted values with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      return values;
    });

    return rows;
  };

  const standardizeData = (rows: Array<any>, bank: string): ConvertedData => {
    // Skip header row
    const dataRows = rows.slice(1);

    // This is a simplified example - in production, you'd have specific parsers for each bank
    const standardized = dataRows.slice(0, 5).map(row => {
      // Generic format: try to detect date, description, amount
      return {
        date: row[0] || '',
        description: row[1] || row[2] || '',
        amount: row[row.length - 2] || row[row.length - 1] || '',
        balance: row[row.length - 1] || '',
      };
    });

    return {
      rows: dataRows.length,
      bankDetected: bank,
      previewData: standardized,
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setConverted(false);
    setConvertedData(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Por favor seleccioná un archivo primero');
      return;
    }

    setConverting(true);
    setError(null);

    try {
      const content = await file.text();
      const bank = detectBank(content);
      const rows = parseCSV(content);

      if (rows.length === 0) {
        throw new Error('El archivo no contiene datos válidos');
      }

      const standardized = standardizeData(rows, bank);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConvertedData(standardized);
      setConverted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedData) return;

    // In production, generate actual Excel file using a library like xlsx
    // For now, we'll just create a CSV with standardized format
    const csvContent = [
      'Fecha,Descripción,Monto,Saldo',
      ...convertedData.previewData.map(row =>
        `${row.date},${row.description},${row.amount},${row.balance || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `extracto_estandarizado_${convertedData.bankDetected}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = () => {
    if (!email) {
      alert('Por favor ingresá tu email');
      return;
    }

    // In production, send email with converted file
    console.log('Send email to:', email);
    console.log('Converted data:', convertedData);

    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Herramienta Gratuita</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Conversor de Extractos Bancarios 🇺🇾
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Convertí extractos de <strong>cualquier banco uruguayo</strong> a formato Excel estandarizado
          </p>
        </motion.div>

        {/* Supported Banks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Bancos Soportados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {supportedBanks.map((bank) => (
              <div key={bank.name} className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="text-3xl">{bank.icon}</span>
                <span className="font-semibold text-sm text-center">{bank.name}</span>
                <span className="text-xs text-muted-foreground">{bank.format}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8 mb-8"
        >
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Subí tu Extracto</h2>
              <p className="text-sm text-muted-foreground">
                Tu archivo se procesa en tu navegador. No subimos nada a ningún servidor.
              </p>
            </div>

            {/* File Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {file ? (
                <div>
                  <p className="font-semibold text-lg mb-2">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-lg mb-2">Click para seleccionar archivo</p>
                  <p className="text-sm text-muted-foreground">
                    CSV o Excel de cualquier banco uruguayo
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <Button
              onClick={handleConvert}
              size="lg"
              className="w-full h-12 text-lg"
              disabled={!file || converting}
            >
              {converting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                <>
                  Convertir a Excel
                  <FileSpreadsheet className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        {converted && convertedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >

            {/* Success Card */}
            <div className="bg-green-50 dark:bg-green-950 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                    ¡Archivo Convertido!
                  </h2>
                  <div className="space-y-2">
                    <p className="text-green-800 dark:text-green-200">
                      <strong>Banco detectado:</strong> {convertedData.bankDetected}
                    </p>
                    <p className="text-green-800 dark:text-green-200">
                      <strong>Transacciones procesadas:</strong> {convertedData.rows}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Vista Previa (primeras 5 filas)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-semibold">Fecha</th>
                      <th className="text-left py-2 px-3 font-semibold">Descripción</th>
                      <th className="text-right py-2 px-3 font-semibold">Monto</th>
                      <th className="text-right py-2 px-3 font-semibold">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convertedData.previewData.map((row, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 px-3">{row.date}</td>
                        <td className="py-2 px-3">{row.description}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.amount}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-4">Descargar Archivo</h2>
              <div className="space-y-4">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  variant="outline"
                  className="w-full h-12"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Descargar Excel Estandarizado
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>o</p>
                </div>

                {!emailSent ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ingresá tu email y te lo enviamos por correo
                    </p>
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-11"
                      />
                      <Button onClick={handleSendEmail} className="h-11">
                        <Mail className="mr-2 w-4 h-4" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ¡Email enviado! Revisá tu casilla.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA to Ahorrin */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border-2 border-primary/30 p-6 sm:p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">¿Querés Automatizar Todo Esto?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Con Ahorrin, no tenés que convertir extractos manualmente. Subís el archivo original y
                  la app lo categoriza automáticamente con IA. <strong>Sin convertir, sin Excel, sin vueltas.</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="h-12">
                      Probar Ahorrin Gratis
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="h-12">
                      Ver Cómo Funciona
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ✓ Soporta todos los bancos ✓ Categorización con IA ✓ Hecho en Uruguay 🇺🇾
                </p>
              </div>
            </div>

          </motion.div>
        )}

        {/* How it Works */}
        {!converted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted/30 rounded-2xl border border-border p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold mb-6 text-center">¿Cómo Funciona?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-semibold mb-2">1. Subís tu extracto</h3>
                <p className="text-sm text-muted-foreground">
                  CSV o Excel de cualquier banco uruguayo
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold mb-2">2. Lo procesamos</h3>
                <p className="text-sm text-muted-foreground">
                  Detectamos el banco y estandarizamos el formato
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">3. Descargás Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Formato limpio, listo para usar
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
