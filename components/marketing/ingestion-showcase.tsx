'use client';

import { motion } from 'framer-motion';
import { Upload, Zap, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function IngestionShowcase() {
  const [step, setStep] = useState(0);

  // Simulated transaction data from uploaded file
  const transactions = [
    { vendor: 'UBER TRIP', amount: 850, date: '2025-10-05', type: 'expense' },
    { vendor: 'DEVOTO SUPERMERCADO', amount: 4200, date: '2025-10-06', type: 'expense' },
    { vendor: 'UBER EATS', amount: 1200, date: '2025-10-07', type: 'expense' },
    { vendor: 'FARMASHOP', amount: 650, date: '2025-10-08', type: 'expense' },
  ];

  // Categories that will be created based on data
  const suggestedCategories = [
    { name: 'Transporte', color: '#3b82f6', vendors: ['UBER', 'CABIFY', 'TAXI'] },
    { name: 'Supermercado', color: '#10b981', vendors: ['DEVOTO', 'DISCO', 'TIENDA INGLESA'] },
    { name: 'Delivery', color: '#f59e0b', vendors: ['UBER EATS', 'PEDIDOSYA', 'RAPPI'] },
    { name: 'Farmacia', color: '#06b6d4', vendors: ['FARMASHOP', 'FARMACIA'] },
  ];

  // Rules that will be created
  const autoRules = [
    { category: 'Transporte', rule: 'Si vendor contiene "UBER"', matches: 2 },
    { category: 'Supermercado', rule: 'Si vendor contiene "DEVOTO"', matches: 1 },
    { category: 'Delivery', rule: 'Si vendor contiene "UBER EATS"', matches: 1 },
    { category: 'Farmacia', rule: 'Si vendor contiene "FARMASHOP"', matches: 1 },
  ];

  const steps = [
    {
      title: '1. Subí tu extracto',
      description: 'Arrastrás tu archivo PDF, CSV o Excel de BBVA, Scotia o Itaú',
      icon: Upload,
      color: 'blue',
    },
    {
      title: '2. Creá categorías inteligentes',
      description: 'El sistema analiza los datos y sugiere categorías basadas en los vendors detectados',
      icon: Plus,
      color: 'green',
    },
    {
      title: '3. Reglas automáticas',
      description: 'Al crear una categoría, generás reglas para auto-categorizar futuras transacciones',
      icon: Zap,
      color: 'orange',
    },
    {
      title: '4. Todo categorizado',
      description: 'Las próximas transacciones se categorizan automáticamente según tus reglas',
      icon: CheckCircle,
      color: 'purple',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Inteligencia basada en datos
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Subís datos, creás categorías y reglas
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto px-4">
            La app aprende de tus transacciones y te permite crear categorías y reglas automáticas
            basadas en los datos que importás
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  step === idx
                    ? 'border-primary bg-primary/5 shadow-lg sm:scale-105'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
                onClick={() => setStep(idx)}
              >
                <div className="inline-flex p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 bg-primary/10">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm">{s.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        >
          <div className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
          {/* Step 0: Upload */}
          {step === 0 && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Subí tu extracto bancario</h3>
                <p className="text-sm sm:text-base">Formato PDF, CSV o Excel</p>
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 md:p-12 bg-card/20 hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <p className="text-base sm:text-lg font-semibold mb-2">Arrastrá tu archivo aquí</p>
                  <p className="text-xs sm:text-sm mb-4">o hacé clic para seleccionar</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm sm:text-base">
                    <Upload className="w-4 h-4" />
                    Seleccionar archivo
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div className="p-3 sm:p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="font-semibold mb-1">✓ BBVA Visa</div>
                  <div className="text-xs ">Extracto PDF</div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="font-semibold mb-1">✓ Scotiabank</div>
                  <div className="text-xs ">Extracto PDF</div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="font-semibold mb-1">✓ Itaú</div>
                  <div className="text-xs ">Excel/CSV</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Parsed Transactions */}
          {step === 1 && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 sm:p-3 rounded-full bg-primary/10">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Datos analizados</h3>
                    <p className="text-sm sm:text-base">{transactions.length} transacciones detectadas</p>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="mb-6 sm:mb-8 rounded-lg border border-border overflow-x-auto">
                <table className="w-full text-xs sm:text-sm min-w-[500px]">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">Fecha</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">Vendor</th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">Monto</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, idx) => (
                      <tr key={idx} className="border-b border-border">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{tx.date}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">{tx.vendor}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-error whitespace-nowrap text-xs sm:text-sm">
                          ${tx.amount.toLocaleString()}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 whitespace-nowrap inline-block">
                            Sin categoría
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Suggested Categories */}
              <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
                    <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">💡 Categorías sugeridas basadas en tus datos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                      {suggestedCategories.map((cat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-all cursor-pointer"
                        >
                          <div
                            className="w-3 sm:w-4 h-3 sm:h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs sm:text-sm">{cat.name}</div>
                            <div className="text-xs truncate">
                              Detectado: {cat.vendors.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <Plus className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Create Rules */}
          {step === 2 && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 sm:p-3 rounded-full bg-primary/10">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Reglas automáticas creadas</h3>
                    <p className="text-sm sm:text-base">Basadas en los vendors de tus transacciones</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {autoRules.map((rule, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{rule.category}</div>
                          <div className="text-sm font-mono">
                            {rule.rule}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success">{rule.matches}</div>
                        <div className="text-xs">transacciones</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-card border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Reglas guardadas exitosamente</h4>
                    <p className="text-sm ">
                      Las futuras transacciones que coincidan con estos patrones se categorizarán automáticamente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Auto-Categorized */}
          {step === 3 && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 sm:p-3 rounded-full bg-primary/10">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Todo categorizado automáticamente</h3>
                    <p className="text-sm sm:text-base">Las reglas aplicadas a tus transacciones</p>
                  </div>
                </div>
              </div>

              {/* Categorized Transactions */}
              <div className="rounded-lg border border-border overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold">Vendor</th>
                      <th className="text-right py-3 px-4 font-semibold">Monto</th>
                      <th className="text-center py-3 px-4 font-semibold">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, idx) => {
                      const matchedCategory = suggestedCategories.find(cat =>
                        cat.vendors.some(v => tx.vendor.includes(v))
                      );
                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border-b border-border"
                        >
                          <td className="py-3 px-4">{tx.date}</td>
                          <td className="py-3 px-4 font-medium">{tx.vendor}</td>
                          <td className="py-3 px-4 text-right font-semibold text-error">
                            ${tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {matchedCategory && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
                                <Zap className="w-3 h-3" />
                                <span className="text-xs font-semibold">{matchedCategory.name}</span>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Success Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-card border border-border text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-success mb-1">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm ">Auto-categorizadas</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-card border border-border text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {autoRules.length}
                  </div>
                  <div className="text-xs sm:text-sm ">Reglas activas</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-card border border-border text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent-purple mb-1">
                    0s
                  </div>
                  <div className="text-xs sm:text-sm ">Tiempo manual</div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Navigation */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === idx ? 'bg-primary w-8' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                disabled={step === steps.length - 1}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
