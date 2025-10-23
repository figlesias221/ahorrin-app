'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Upload,
  TrendingUp,
  PieChart,
  FileText,
  Zap,
  Brain,
  Lock,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export function FeaturesGrid() {
  const features = [
    {
      icon: Sparkles,
      title: 'Categorización Automática',
      description:
        'Nuestra IA aprende de tus patrones y categoriza automáticamente tus transacciones con 98% de precisión.',
      gradient: 'from-accent-purple to-accent-purple/50',
      size: 'large',
    },
    {
      icon: Upload,
      title: 'Sube tus Extractos Bancarios',
      description:
        'Descarga el extracto de tu banco (el CSV o Excel que te da el banco) y súbelo aquí. Funciona con todos los bancos uruguayos.',
      gradient: 'from-accent-cyan to-accent-cyan/50',
      size: 'medium',
    },
    {
      icon: BarChart3,
      title: 'Dashboard en Tiempo Real',
      description:
        'Visualiza tus gastos e ingresos con gráficos interactivos y métricas actualizadas en tiempo real.',
      gradient: 'from-success to-success/50',
      size: 'medium',
    },
    {
      icon: PieChart,
      title: 'Análisis Inteligente',
      description:
        'Obtén insights automáticos sobre tus hábitos de gasto y oportunidades de ahorro.',
      gradient: 'from-warning to-warning/50',
      size: 'medium',
    },
    {
      icon: FileText,
      title: 'Reportes Personalizados',
      description: 'Genera reportes detallados por periodo, categoría o cuenta.',
      gradient: 'from-error to-error/50',
      size: 'small',
    },
    {
      icon: Zap,
      title: 'Multi-Cuenta',
      description: 'Gestiona múltiples cuentas y bancos desde un solo lugar.',
      gradient: 'from-primary to-primary/70',
      size: 'small',
    },
    {
      icon: Brain,
      title: 'Reglas Automáticas Personalizables',
      description:
        'Crea reglas simples como: "Todo lo que compro en DISCO va a Supermercado" o "Pagos a ANTEL van a Servicios". La app las aplicará automáticamente a todas tus transacciones futuras. También puedes corregir manualmente cualquier categoría y la IA aprenderá.',
      gradient: 'from-accent-purple to-accent-cyan',
      size: 'large',
    },
    {
      icon: Lock,
      title: 'Seguridad Total',
      description:
        'Tus datos están encriptados y protegidos con los más altos estándares de seguridad.',
      gradient: 'from-success to-accent-cyan',
      size: 'small',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
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
              Todo lo que necesitas
            </span>
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Herramientas poderosas para tomar el control total de tus finanzas personales
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const sizeClasses = {
              small: 'md:col-span-1 md:row-span-1',
              medium: 'md:col-span-2 md:row-span-1',
              large: 'md:col-span-2 md:row-span-2',
            };

            return (
              <motion.div
                key={index}
                variants={item}
                className={`${sizeClasses[feature.size as keyof typeof sizeClasses]} group`}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col h-full">
                    {/* Header with Icon */}
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className=" leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                    </div>

                    {/* Spacer for large cards */}
                    <div className="flex-1" />

                    {/* Hover effect decoration */}
                    {feature.size === 'large' && (
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-2 bg-card rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${feature.gradient}`}
                                initial={{ width: '0%' }}
                                whileInView={{
                                  width:
                                    feature.title ===
                                    'Categorización Automática con IA'
                                      ? '98%'
                                      : '100%',
                                }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            {feature.title === 'Categorización Automática con IA'
                              ? '98%'
                              : '100%'}
                          </span>
                        </div>
                        <p className="text-xs  mt-2">
                          {feature.title === 'Categorización Automática con IA'
                            ? 'Precisión promedio de categorización'
                            : 'Automático y configurable'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
