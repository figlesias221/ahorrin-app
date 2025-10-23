'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Upload, Tags, BarChart3, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroUltimate() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-muted/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 px-4"
          >
            Dejá de Perder Plata por No Saber En Qué Gastás 🇺🇾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-6"
          >
            Importá extractos de <strong className="text-foreground">todos los bancos uruguayos</strong> (ITAÚ, BBVA, Scotiabank, BROU, Santander, Heritage) y categorizá tus gastos automáticamente.
          </motion.p>
        </div>

        {/* Flow Steps */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 md:items-stretch">

          {/* Step 1: Upload */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-xl border-2 border-primary/30 shadow-xl shadow-primary/10 overflow-hidden flex flex-col h-full hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300">
              {/* Header */}
              <div className="bg-card p-3 border-b-2 border-border flex-shrink-0">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm text-foreground">1. Importá Extractos Bancarios</h2>
                    <div className="text-xs text-muted-foreground">CSV, Excel o manual</div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3 sm:gap-4">
                <div>
                  <div className="text-xs  mb-2">
                    <span className="font-semibold text-foreground">Opción 1:</span> Ingresá manualmente
                  </div>

                  {/* Manual entry preview */}
                  <div className="border-2 border-border rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2 bg-card">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className=" font-medium">Descripción</span>
                        <input
                          type="text"
                          placeholder="Frog"
                          className="text-right bg-background px-2 py-1 rounded border border-border text-xs w-20 sm:w-24 text-foreground font-medium"
                          disabled
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className=" font-medium">Monto</span>
                        <input
                          type="text"
                          placeholder="$2,500"
                          className="text-right bg-background px-2 py-1 rounded border border-border text-xs w-20 sm:w-24 text-foreground font-medium"
                          disabled
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className=" font-medium">Categoría</span>
                        <div className="text-right bg-primary/20 px-2 py-1 rounded text-xs text-primary font-semibold">
                          Supermercado
                        </div>
                      </div>
                    </div>
                    <div className="pt-1.5 sm:pt-2 border-t-2 border-border/50 text-center">
                      <span className="text-xs text-primary font-semibold">✓ Rápido</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-border/50">
                  <div className="text-xs  mb-1.5 sm:mb-2">
                    <span className="font-semibold text-foreground">Opción 2:</span> Subí extracto
                  </div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <Upload className="w-3 h-3 " />
                    <span className=" text-xs">CSV/Excel</span>
                  </div>

                  {/* CSV to rows example */}
                  <div className="bg-card rounded-lg p-2 sm:p-3 border-2 border-border">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5 " />
                      <span className="text-xs font-bold text-foreground">CSV ITAÚ</span>
                      <div className=" text-xs font-bold">→</div>
                      <span className="text-xs font-bold text-foreground">3 Trans.</span>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="bg-card rounded-md px-2 py-1 sm:py-1.5 border-2 border-border shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">FROG</span>
                          <span className="text-red-600 font-extrabold text-xs">-$2,450</span>
                        </div>
                      </div>

                      <div className="bg-card rounded-md px-2 py-1 sm:py-1.5 border-2 border-border shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">ANTEL</span>
                          <span className="text-red-600 font-extrabold text-xs">-$890</span>
                        </div>
                      </div>

                      <div className="bg-card rounded-md px-2 py-1 sm:py-1.5 border-2 border-border shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">UBER</span>
                          <span className="text-red-600 font-extrabold text-xs">-$320</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-center  font-bold mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t-2 border-border">
                      ✓ Automático
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow connector - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Step 2: Categorize */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-card rounded-xl border-2 border-purple-500/30 shadow-xl shadow-purple-500/10 overflow-hidden flex flex-col h-full hover:border-purple-500/50 hover:shadow-purple-500/20 transition-all duration-300">
              {/* Header */}
              <div className="bg-card p-3 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm">2. Categorización Automática</h2>
                    <div className="text-xs text-muted-foreground">Reglas inteligentes</div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3 sm:gap-4">
                <div>
                  <div className="text-xs  mb-1.5 sm:mb-2">
                    Creá reglas una vez y olvidate
                    <div className="text-xs mt-0.5 sm:mt-1 /80">
                      Por detalle, monto o ambos
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">FROG</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Supermercado</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 47 veces
                      </div>
                    </div>

                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">ANTEL</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Internet</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 12 veces
                      </div>
                    </div>

                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">UTE</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Electricidad</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 6 veces
                      </div>
                    </div>

                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">UBER</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Transporte</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 18 veces
                      </div>
                    </div>

                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">OSE</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Agua</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 8 veces
                      </div>
                    </div>

                    <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold">PEDIDOSYA</span>
                        <span className="text-primary text-xs">→</span>
                        <span className="font-semibold">Comida</span>
                      </div>
                      <div className="text-xs  mt-1">
                        Por detalle • 23 veces
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 text-xs text-center  border-t border-border">
                  ✓ 487 transacciones categorizadas
                </div>
              </div>
            </div>

            {/* Arrow connector - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Step 3: Analyze */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-card rounded-xl border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10 overflow-hidden flex flex-col h-full hover:border-cyan-500/50 hover:shadow-cyan-500/20 transition-all duration-300">
              {/* Header */}
              <div className="bg-card p-3 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm">3. Visualizá tus Finanzas en Tiempo Real</h2>
                    <div className="text-xs text-muted-foreground">Gráficas y reportes</div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3 sm:gap-4">
                <div className="text-xs ">
                  Entendé tus finanzas en segundos
                </div>

                {/* Donut Chart with Center Text */}
                <div className="relative flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Supermercado - 41.7% */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="30"
                      strokeDasharray="210 471"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Servicios - 27.5% */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="30"
                      strokeDasharray="138 471"
                      strokeDashoffset="-210"
                      strokeLinecap="round"
                    />
                    {/* Transporte - 17.8% */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="30"
                      strokeDasharray="89 471"
                      strokeDashoffset="-348"
                      strokeLinecap="round"
                    />
                    {/* Entretenimiento - 13.0% */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="30"
                      strokeDasharray="63 471"
                      strokeDashoffset="-437"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-2xl font-bold text-primary">$29.8k</div>
                    <div className="text-xs ">Total</div>
                  </div>
                </div>

                {/* Legend with percentages */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between bg-card/20 rounded-lg px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                      <span className="font-medium text-xs">Supermercado</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs">$12,450</div>
                      <div className="text-xs ">41.7%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-card/20 rounded-lg px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                      <span className="font-medium text-xs">Servicios</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs">$8,200</div>
                      <div className="text-xs ">27.5%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-card/20 rounded-lg px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#06b6d4' }} />
                      <span className="font-medium text-xs">Transporte</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs">$5,300</div>
                      <div className="text-xs ">17.8%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-card/20 rounded-lg px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                      <span className="font-medium text-xs">Entretenimiento</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs">$3,890</div>
                      <div className="text-xs ">13.0%</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-2 sm:pt-3 flex items-center justify-center gap-2 text-xs border-t border-border">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span className="">Visualización instantánea de gastos</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center px-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold">
                Ver mis gastos en 2 minutos
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <span>✓ No tarjeta requerida</span>
            <span>✓ No conectás tu banco</span>
            <span>✓ Hecho en Uruguay 🇺🇾</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
