'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export function ProductShowcase() {
  const steps = [
    {
      number: '01',
      title: 'Sube el extracto de tu banco',
      description:
        'Entra a tu homebanking, descarga tu extracto (ese archivo PDF o Excel con tus movimientos), y súbelo aquí. Funciona con extractos de cuenta corriente, tarjetas de crédito, tarjetas de débito, de cualquier banco uruguayo.',
      features: [
        'Acepta PDF, Excel (XLS/XLSX), CSV e imágenes',
        'BROU, Santander, Itaú, BBVA, Heritage, Scotiabank',
        'Sube varios meses a la vez',
      ],
    },
    {
      number: '02',
      title: 'Reglas automáticas que trabajan por ti',
      description:
        'Crea reglas simples y poderosas: "Todo de DISCO → Supermercado", "Netflix → Entretenimiento", "ANTEL → Servicios". Una vez configuradas, todas tus transacciones se categorizan automáticamente. También incluimos paquetes pre-configurados listos para usar.',
      features: [
        'Reglas basadas en comercio, monto o descripción',
        'Paquetes pre-configurados para Uruguay',
        'Edición masiva de múltiples transacciones',
      ],
    },
    {
      number: '03',
      title: 'Ve tus gastos claramente',
      description:
        'Mira en qué gastas tu dinero: gráficos por categoría, tendencias mes a mes, cuánto entra y cuánto sale. Todo actualizado en tiempo real cada vez que subes un extracto nuevo.',
      features: [
        'Gráficos claros por categoría',
        'Ve tus tendencias de gasto',
        'Exporta reportes cuando quieras',
      ],
    },
  ];

  const mockTransactions = [
    {
      vendor: 'DISCO',
      category: 'Supermercado',
      amount: -2450,
      type: 'expense',
    },
    {
      vendor: 'ANTEL',
      category: 'Servicios',
      amount: -1890,
      type: 'expense',
    },
    {
      vendor: 'Salary',
      category: 'Ingresos',
      amount: 85000,
      type: 'income',
    },
    {
      vendor: 'Netflix',
      category: 'Entretenimiento',
      amount: -579,
      type: 'expense',
    },
  ];

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Así de simple
            </span>
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            En solo 3 pasos comienza a gestionar tus finanzas de forma inteligente
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="text-6xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold">{step.title}</h3>
                  <p className="text-lg  leading-relaxed">
                    {step.description}
                  </p>
                  <div className="space-y-3 pt-4">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
                  {/* Step 1: Upload visualization */}
                  {index === 0 && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-8 h-8 text-primary rotate-90" />
                        </div>
                        <div>
                          <p className="font-medium">Arrastra tus extractos aquí</p>
                          <p className="text-sm  mt-1">
                            o haz click para seleccionar
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm ">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          Soporta archivos PDF, Excel y CSV
                        </div>
                        <div className="flex items-center gap-2 text-sm ">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          También acepta capturas de extractos
                        </div>
                        <div className="flex items-center gap-2 text-sm ">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          Compatible con todos los bancos de Uruguay
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Rules visualization */}
                  {index === 1 && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium mb-4">
                        Reglas activas
                      </div>

                      {/* Rule examples */}
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                          className="p-4 rounded-lg bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">Si el vendor contiene</span>
                            <span className="px-2 py-1 rounded bg-background text-xs font-mono">DISCO</span>
                            <ArrowRight className="w-4 h-4 " />
                            <span className="px-2 py-1 rounded bg-primary/10 text-xs font-medium text-primary">Supermercado</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          className="p-4 rounded-lg bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">Si el vendor contiene</span>
                            <span className="px-2 py-1 rounded bg-background text-xs font-mono">Netflix</span>
                            <ArrowRight className="w-4 h-4 " />
                            <span className="px-2 py-1 rounded bg-primary/10 text-xs font-medium text-primary">Entretenimiento</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          className="p-4 rounded-lg bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">Si el vendor contiene</span>
                            <span className="px-2 py-1 rounded bg-background text-xs font-mono">ANTEL</span>
                            <ArrowRight className="w-4 h-4 " />
                            <span className="px-2 py-1 rounded bg-primary/10 text-xs font-medium text-primary">Servicios</span>
                          </div>
                        </motion.div>
                      </div>

                      <div className="pt-2 text-xs ">
                        <CheckCircle2 className="w-4 h-4 inline mr-1 text-success" />
                        24 transacciones categorizadas automáticamente
                      </div>
                    </div>
                  )}

                  {/* Step 3: Dashboard visualization */}
                  {index === 2 && (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                          <div className="flex items-center gap-2 text-success mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Ingresos</span>
                          </div>
                          <p className="text-2xl font-bold">$85,000</p>
                        </div>
                        <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                          <div className="flex items-center gap-2 text-error mb-2">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-medium">Gastos</span>
                          </div>
                          <p className="text-2xl font-bold">$45,280</p>
                        </div>
                      </div>

                      {/* Chart placeholder */}
                      <div className="h-48 rounded-lg bg-card border border-border/50 p-4 flex items-end justify-around gap-2">
                        {[65, 45, 80, 55, 70, 50, 85].map((height, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
