'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight, Upload, Tag, BarChart3, Check, Sparkles } from 'lucide-react';

export function ShowcaseReal() {
  const steps = [
    {
      icon: Upload,
      title: 'Subí tu extracto',
      subtitle: 'En 10 segundos',
      description:
        'Descargá tu extracto desde el homebanking (CSV o Excel con tus movimientos) y subilo acá. Funciona con todos los bancos uruguayos.',
      visual: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center space-y-3 bg-primary/5">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Extracto_ITAU_Enero.csv</p>
              <p className="text-xs  mt-1">
                ✓ 145 transacciones detectadas
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-card rounded-lg text-center">
              <div className="font-semibold">CSV</div>
            </div>
            <div className="p-2 bg-card rounded-lg text-center">
              <div className="font-semibold">Excel</div>
            </div>
            <div className="p-2 bg-card rounded-lg text-center">
              <div className="font-semibold">Todos los bancos</div>
            </div>
            <div className="p-2 bg-card rounded-lg text-center">
              <div className="font-semibold">Multi-moneda</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Tag,
      title: 'Creá reglas automáticas',
      subtitle: 'Una sola vez',
      description:
        'Definí reglas simples tipo "DISCO va a Supermercado" o "ANTEL va a Internet". Las reglas se aplican automáticamente a todos tus extractos futuros.',
      visual: (
        <div className="space-y-3">
          <div className="text-xs font-semibold  mb-3">
            Ejemplos de reglas
          </div>
          {[
            { from: 'DISCO', to: 'Supermercado', count: '47 veces' },
            { from: 'ANTEL', to: 'Internet', count: '12 veces' },
            { from: 'UTE', to: 'Electricidad', count: '6 veces' },
            { from: 'UBER*', to: 'Transporte', count: '24 veces' },
          ].map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="p-4 rounded-xl bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono font-semibold">
                    {rule.from}
                  </code>
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{rule.to}</span>
                </div>
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xs ">
                Aplicada {rule.count}
              </div>
            </motion.div>
          ))}
          <div className="pt-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
              <Sparkles className="w-3 h-3" />
              487 transacciones categorizadas
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: 'Analizá tus gastos',
      subtitle: 'Reportes claros',
      description:
        'Visualizá tus gastos organizados por categorías. Entendé en qué gastás más, exportá reportes y tomá mejores decisiones financieras.',
      visual: (
        <div className="space-y-4">
          <div className="text-xs font-semibold  mb-3">
            Gastos por categoría - Octubre 2025
          </div>

          {/* Pie Chart */}
          <div className="relative flex items-center justify-center mb-6">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              {/* Supermercado - 41.7% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="35"
                strokeDasharray="210 500"
                strokeDashoffset="0"
              />
              {/* Servicios - 27.5% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#a855f7"
                strokeWidth="35"
                strokeDasharray="138 500"
                strokeDashoffset="-210"
              />
              {/* Transporte - 17.8% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="35"
                strokeDasharray="89 500"
                strokeDashoffset="-348"
              />
              {/* Entretenimiento - 13.0% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#10b981"
                strokeWidth="35"
                strokeDasharray="63 500"
                strokeDashoffset="-437"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-primary">$29.8k</div>
              <div className="text-[10px] ">Total</div>
            </div>
          </div>

          {/* Legend with percentages */}
          <div className="space-y-2">
            <div className="bg-primary/5 rounded-lg p-2.5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                  <span className="font-medium text-xs">Supermercado</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs">$12,450</div>
                  <div className="text-[10px] ">41.7%</div>
                </div>
              </div>
            </div>

            <div className="bg-accent-purple/5 rounded-lg p-2.5 border border-accent-purple/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--accent-purple))' }} />
                  <span className="font-medium text-xs">Servicios</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs">$8,200</div>
                  <div className="text-[10px] ">27.5%</div>
                </div>
              </div>
            </div>

            <div className="bg-accent-cyan/5 rounded-lg p-2.5 border border-accent-cyan/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--accent-cyan))' }} />
                  <span className="font-medium text-xs">Transporte</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs">$5,300</div>
                  <div className="text-[10px] ">17.8%</div>
                </div>
              </div>
            </div>

            <div className="bg-success/5 rounded-lg p-2.5 border border-success/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--success))' }} />
                  <span className="font-medium text-xs">Entretenimiento</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs">$3,890</div>
                  <div className="text-[10px] ">13.0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Cómo funciona</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Así de simple
          </h2>

          <p className="text-xl  max-w-2xl mx-auto">
            3 pasos para tener el control total de tus finanzas
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {/* Step number */}
                  <div className="inline-flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                        Paso {index + 1}
                      </div>
                      <div className="text-xs ">
                        {step.subtitle}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-lg  leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Card className="p-8 bg-card border-border shadow-xl">
                    {step.visual}
                  </Card>
                </div>
              </div>

              {/* Connector line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 -bottom-16 transform -translate-x-1/2">
                  <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-24 pt-16 border-t border-border"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para organizarte?
          </h3>
          <p className=" mb-8">
            Comenzá gratis en menos de 2 minutos
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Empezar ahora
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
