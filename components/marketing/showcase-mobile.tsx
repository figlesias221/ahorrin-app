'use client';

import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Calendar, MessageSquare, Sparkles } from 'lucide-react';

export function ShowcaseMobile() {
  return (
    <section className="py-16 px-4 bg-card/20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold mb-3">
            Visualizá tus finanzas
          </h2>
          <p className="text-sm ">
            Gráficas y reportes para entender dónde va tu plata
          </p>
        </motion.div>

        {/* Visual Examples */}
        <div className="space-y-6">
          {/* Example 0: AI Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm">Chat con IA</h3>
                <p className="text-xs ">Preguntá lo que quieras</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-3">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                  <p className="text-xs">¿Cuánto gasté en supermercado este mes?</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                  <p className="text-xs mb-2">Gastaste <span className="font-bold text-primary">$12,450</span> en Supermercado este mes.</p>
                  <div className="text-xs ">
                    Esto es un <span className="font-semibold">8% menos</span> que el mes pasado 📉
                  </div>
                </div>
              </div>

              {/* Suggested questions */}
              <div className="pt-2 space-y-1.5">
                <p className="text-xs  font-medium">Preguntá también:</p>
                <div className="flex flex-wrap gap-1.5">
                  <div className="text-xs bg-card border border-border rounded-full px-2.5 py-1">
                    ¿Cuál fue mi mayor gasto?
                  </div>
                  <div className="text-xs bg-card border border-border rounded-full px-2.5 py-1">
                    Comparar con mes anterior
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Example 1: Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm">Gastos por categoría</h3>
                <p className="text-xs ">Este mes</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Simplified donut visualization */}
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
                {/* Supermercado - 41.7% */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="28"
                  strokeDasharray="200 440"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Servicios - 27.5% */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="28"
                  strokeDasharray="130 440"
                  strokeDashoffset="-200"
                  strokeLinecap="round"
                />
                {/* Transporte - 17.8% */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="28"
                  strokeDasharray="85 440"
                  strokeDashoffset="-330"
                  strokeLinecap="round"
                />
                {/* Otros - 13% */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="28"
                  strokeDasharray="60 440"
                  strokeDashoffset="-415"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary">$29.8k</div>
                <div className="text-xs ">Total</div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                  <span>Supermercado</span>
                </div>
                <span className="font-bold">41.7%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                  <span>Servicios</span>
                </div>
                <span className="font-bold">27.5%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#06b6d4' }} />
                  <span>Transporte</span>
                </div>
                <span className="font-bold">17.8%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                  <span>Otros</span>
                </div>
                <span className="font-bold">13.0%</span>
              </div>
            </div>
          </motion.div>

          {/* Example 2: Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm">Tendencias</h3>
                <p className="text-xs ">Últimos 6 meses</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Simplified bar chart */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="">Octubre</span>
                  <span className="font-bold">$29.8k</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/80" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="">Septiembre</span>
                  <span className="font-bold">$31.2k</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/80" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="">Agosto</span>
                  <span className="font-bold">$27.5k</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/80" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="">Julio</span>
                  <span className="font-bold">$26.1k</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/80" style={{ width: '84%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="inline-flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                Bajaste 4.5% vs mes anterior
              </div>
            </div>
          </motion.div>

          {/* Example 3: Monthly Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm">Resumen mensual</h3>
                <p className="text-xs ">Octubre 2025</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="text-xs  mb-1">Total Gastos</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">$29,840</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <div className="text-xs  mb-1">Transacciones</div>
                  <div className="text-xl font-bold">127</div>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <div className="text-xs  mb-1">Promedio día</div>
                  <div className="text-xl font-bold">$964</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
