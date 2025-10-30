'use client';

import { motion } from 'framer-motion';
import { Calculator, FileSpreadsheet, TrendingUp, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'Calculadora de Salario Líquido',
    description: '¿Cuánto te queda después de IRPF, BPS y Fonasa? Descubrí tu salario neto con las tasas 2025.',
    icon: DollarSign,
    href: '/herramientas/calculadora-salario-liquido',
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    badge: 'Nuevo',
    stats: '800+ búsquedas/mes',
  },
  {
    title: 'Calculadora de Presupuesto',
    description: 'Organizá tus ingresos y gastos. Obtené recomendaciones personalizadas en segundos.',
    icon: Calculator,
    href: '/herramientas/calculadora-presupuesto',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    stats: 'Recomendaciones IA',
  },
  {
    title: 'Conversor de Extractos',
    description: 'Convertí extractos de cualquier banco uruguayo a Excel estandarizado. Privado y seguro.',
    icon: FileSpreadsheet,
    href: '/herramientas/conversor-extractos',
    color: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    stats: 'Todos los bancos',
  },
  {
    title: 'Calculadora de Inflación Real',
    description: 'El BCU dice 5%, pero ¿cuánto subieron TUS gastos? Descubrí tu inflación personalizada.',
    icon: TrendingUp,
    href: '/herramientas/inflacion-real',
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    stats: 'Por categorías',
  },
];

export function FreeToolsShowcase() {
  return (
    <section className="mt-20 py-20 sm:py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.02]" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Herramientas 100% Gratuitas
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Probá sin registrarte
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              Herramientas financieras pro
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Accedé gratis a calculadoras y herramientas profesionales para gestionar tus finanzas en Uruguay.
            Sin registro, sin límites, sin letra chica.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={tool.href}
                  className="group relative block bg-card/60 border border-border/60 hover:border-border rounded-2xl overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 h-full"
                >
                  <div className="relative p-6 sm:p-8">
                    {/* Header with icon and badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {tool.badge && (
                        <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-md">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">
                      {tool.title}
                    </h3>

                    <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Stats badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background/60 border border-border/60 rounded-lg mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {tool.stats}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:gap-1 transition-all duration-200">
                      Usar gratis
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>

                  {/* Subtle glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/herramientas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Ver todas las herramientas
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
