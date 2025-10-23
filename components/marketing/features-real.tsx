'use client';

import { motion } from 'framer-motion';
import {
  Settings,
  Upload,
  TrendingUp,
  FolderTree,
  FileText,
  Zap,
  WandSparkles,
  Lock,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FeaturesReal() {
  const features = [
    {
      icon: Settings,
      title: 'Reglas Automáticas',
      description:
        'Crea reglas simples: escribes "DISCO" y eliges "Supermercado", escribes "ANTEL" y eliges "Internet". A partir de ahí, todas las compras en DISCO van automáticamente a Supermercado. También puedes hacer reglas por monto: si SISTERBANC cobra $487 va a Telefonía, si cobra $1925 va a Internet.',
      gradient: 'from-accent-purple to-accent-purple/50',
      size: 'large',
      examples: [
        { rule: 'DISCO*', category: 'Supermercado' },
        { rule: 'ANTEL', category: 'Internet' },
        { rule: 'UTE', category: 'Electricidad' },
      ],
    },
    {
      icon: Upload,
      title: 'Sube Extractos de tu Banco',
      description:
        'Descarga el extracto desde tu homebanking (CSV o Excel con tus movimientos) y súbelo acá. Funciona con todos los bancos uruguayos: ITAÚ, BBVA, BROU, Scotiabank, Heritage y más.',
      gradient: 'from-success to-success/50',
      size: 'medium',
    },
    {
      icon: WandSparkles,
      title: 'Limpia los Nombres Automáticamente',
      description:
        'Los bancos escriben los comercios de cualquier forma: "DISCO MONTEVIDEO", "DISCO MVD 123", "DISCO LA BLANQUEADA". Ahorrin los normaliza a "DISCO" para que sea más fácil crear reglas y ver totales.',
      gradient: 'from-warning to-warning/50',
      size: 'medium',
    },
    {
      icon: BarChart3,
      title: 'Ve tus Gastos Claros',
      description:
        'Gráficos simples que te muestran en qué gastás: totales por categoría padre (Servicios: $5,000) o detalle de cada hijo (Internet: $1,890, Electricidad: $1,250). Todo se actualiza automáticamente.',
      gradient: 'from-error to-error/50',
      size: 'medium',
    },
    {
      icon: FileText,
      title: 'Reportes Personalizados',
      description:
        'Exporta reportes por categoría padre o hijo, por periodo, cuenta o banco.',
      gradient: 'from-primary to-primary/70',
      size: 'small',
    },
    {
      icon: Zap,
      title: 'Multi-Cuenta',
      description:
        'ITAÚ Visa, BBVA Débito, BROU Sueldo. Todas tus cuentas en un solo dashboard.',
      gradient: 'from-accent-purple to-accent-cyan',
      size: 'small',
    },
    {
      icon: Lock,
      title: 'Seguridad Total',
      description:
        'Tus datos encriptados. Sin acceso a cuentas bancarias. Solo subes extractos.',
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
            Herramientas diseñadas específicamente para Uruguay
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
                    {/* Icon */}
                    <div className="mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className=" leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Examples for large cards */}
                    {feature.size === 'large' && feature.examples && (
                      <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                        {feature.title === 'Reglas Inteligentes' && (
                          <>
                            <p className="text-xs font-semibold  uppercase tracking-wider mb-3">
                              Ejemplos de reglas
                            </p>
                            {feature.examples.map((example: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-lg bg-card/30 border border-border/30"
                              >
                                <code className="text-xs font-mono text-accent-purple">
                                  {example.rule}
                                </code>
                                <span className="text-xs">→</span>
                                <Badge variant="outline" className="text-xs">
                                  {example.category}
                                </Badge>
                              </div>
                            ))}
                          </>
                        )}

                        {feature.title === 'Categorías Padre/Hijo' && (
                          <>
                            <p className="text-xs font-semibold  uppercase tracking-wider mb-3">
                              Jerarquías
                            </p>
                            {feature.examples.map((example: any, i: number) => (
                              <div key={i} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FolderTree className="w-4 h-4 text-accent-cyan" />
                                  <span className="font-semibold text-sm">{example.parent}</span>
                                </div>
                                <div className="pl-6 space-y-1">
                                  {example.children.map((child: string, j: number) => (
                                    <div key={j} className="flex items-center gap-2 text-xs ">
                                      <div className="w-2 h-2 rounded-full bg-accent-cyan/50" />
                                      {child}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Real world example callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-accent-purple/10 via-accent-cyan/10 to-accent-purple/10 border border-border/50"
        >
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold">Ejemplo real de Uruguay</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
                <p className="font-mono text-xs  mb-2">Extracto ITAÚ</p>
                <p className="font-semibold mb-1">DISCO MONTEV 123</p>
                <p className="text-xs ">Se normaliza a "DISCO"</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50 flex items-center justify-center">
                <span className="text-2xl text-accent-cyan">→</span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 backdrop-blur border border-border/50">
                <Badge className="mb-2 bg-card text-foreground">Alimentos</Badge>
                <p className="font-semibold">Supermercado</p>
                <p className="text-xs text-success mt-2">✓ Regla aplicada</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
