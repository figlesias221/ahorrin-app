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
                  className="group relative block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300 h-full"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative p-6 sm:p-8">
                    {/* Header with icon and badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {tool.badge && (
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full animate-pulse">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {tool.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>

                    {/* Stats badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-foreground">
                        {tool.stats}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                      Usar gratis
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
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
