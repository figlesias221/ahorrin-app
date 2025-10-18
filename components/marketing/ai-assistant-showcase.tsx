'use client';

import { Sparkles, MessageCircle, TrendingUp, Zap, Brain, LineChart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function AIAssistantShowcase() {
  const features = [
    {
      icon: Brain,
      title: 'Análisis Inteligente',
      description: 'Entiende tus patrones de gasto y te ayuda a identificar oportunidades de ahorro'
    },
    {
      icon: MessageCircle,
      title: 'Conversación Natural',
      description: 'Pregunta lo que quieras en español, como si hablaras con un asesor financiero'
    },
    {
      icon: TrendingUp,
      title: 'Consejos Personalizados',
      description: 'Recomendaciones específicas basadas en tu historial y comportamiento financiero'
    },
    {
      icon: Zap,
      title: 'Respuestas Instantáneas',
      description: 'Obtén insights y análisis de tus gastos en segundos'
    },
    {
      icon: LineChart,
      title: 'Proyecciones Inteligentes',
      description: 'Visualiza tendencias y proyecciones de tus finanzas futuras'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Potenciado por IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Tu Asistente Financiero
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                con Inteligencia Artificial
              </span>
            </h2>
            <p className="text-base sm:text-lg  max-w-2xl mx-auto px-4">
              Habla con nuestro asistente AI sobre tus gastos y obtén recomendaciones
              personalizadas para mejorar tus finanzas
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Visual/Demo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-xl">
                {/* Chat Preview */}
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-[80%]">
                      <p className="text-sm">¿En qué categoría gasto más?</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-xs font-semibold ">Asistente AI</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        Tu categoría con mayor gasto es <strong>Alimentación</strong> con $45,200.
                        Representa el 32% de tus gastos totales este mes.
                        <br /><br />
                        💡 <strong>Consejo:</strong> Podrías ahorrar aproximadamente $8,000 reduciendo
                        las compras de delivery a 2 veces por semana.
                      </p>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-[80%]">
                      <p className="text-sm">¿Cómo puedo mejorar?</p>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start justify-between group"
                >
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm ">{feature.description}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="h-5 w-5" />
              <span>Prueba el Asistente AI</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
