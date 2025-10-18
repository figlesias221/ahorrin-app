'use client';

import { motion } from 'framer-motion';
import { Upload, BarChart3, Shield, Zap, FileSpreadsheet, MessageSquare } from 'lucide-react';

export function FeaturesMobile() {
  const features = [
    {
      icon: Upload,
      title: 'Ingresá fácil',
      description: 'Subí tu extracto de BBVA, Scotia o Itaú. O ingresá manual.',
    },
    {
      icon: MessageSquare,
      title: 'Chat con IA',
      description: 'Preguntale a la IA sobre tus gastos y obtené respuestas al instante.',
    },
    {
      icon: Zap,
      title: 'Auto-categorización',
      description: 'Olvidate de categorizar manualmente. Todo automático.',
    },
    {
      icon: BarChart3,
      title: 'Gráficas claras',
      description: 'Entendé tus finanzas en segundos con visualizaciones.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Exportá a Excel',
      description: 'Descargá tus datos cuando quieras en Excel.',
    },
    {
      icon: Shield,
      title: 'Seguro y privado',
      description: 'Tus datos son tuyos. Sin compartir con terceros.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Todo lo que necesitás
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Potente y simple
          </h2>
          <p className="text-sm ">
            Todas las herramientas para gestionar tus finanzas
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card rounded-2xl border border-border shadow-lg p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                    <p className="text-sm  leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
