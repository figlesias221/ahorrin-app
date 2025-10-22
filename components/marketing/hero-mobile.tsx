'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Upload, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroMobile() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* Vibrant animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-background to-cyan-500/10" />

        {/* Floating orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-violet-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
            Controlá tus gastos<br />en 3 simples pasos
          </h1>

          <p className="text-base text-foreground/80 mb-6 font-medium">
            Subí tu extracto o ingresá manualmente. Automático y rápido.
          </p>
        </motion.div>

        {/* Simple Flow Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 space-y-3"
        >
          {/* Step 1 */}
          <div className="bg-card rounded-2xl border-2 border-violet-500/20 shadow-lg shadow-violet-500/10 p-4 hover:border-violet-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/50">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-foreground">1. Ingresá gastos</div>
                <div className="text-xs text-foreground/70 font-medium">Manual o extracto</div>
              </div>
            </div>

            {/* Mini preview */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">FROG</span>
                  <span className="text-red-700 dark:text-red-500 font-extrabold">-$2,450</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">ANTEL</span>
                  <span className="text-red-700 dark:text-red-500 font-extrabold">-$890</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-primary rotate-90" />
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-2xl border-2 border-blue-500/20 shadow-lg shadow-blue-500/10 p-4 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-foreground">2. Categorizá auto</div>
                <div className="text-xs text-foreground/70 font-medium">Con reglas inteligentes</div>
              </div>
            </div>

            {/* Mini rules */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs bg-primary/10 rounded p-2">
                  <span className="font-mono font-semibold text-foreground">FROG</span>
                  <span className="text-primary font-bold">→</span>
                  <span className="font-semibold text-foreground">Súper</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-primary/10 rounded p-2">
                  <span className="font-mono font-semibold text-foreground">ANTEL</span>
                  <span className="text-primary font-bold">→</span>
                  <span className="font-semibold text-foreground">Internet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-primary rotate-90" />
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-2xl border-2 border-cyan-500/20 shadow-lg shadow-cyan-500/10 p-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-foreground">3. Analizá claro</div>
                <div className="text-xs text-foreground/70 font-medium">Gráficas simples</div>
              </div>
            </div>

            {/* Mini chart */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-xs font-medium text-foreground">Súper</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">$12.4k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-foreground">Servicios</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">$8.2k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-xs font-medium text-foreground">Transporte</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">$5.3k</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <Link href="/signup" className="block">
            <Button size="lg" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-2xl shadow-violet-500/30 border-0">
              Empezar gratis ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <div className="text-center space-y-2">
            <div className="text-xs text-foreground/70 font-medium">
              ✓ Setup en 2 minutos
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
