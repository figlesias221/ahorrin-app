'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Upload, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroMobile() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/10 to-background" />

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

          <p className="text-base  mb-6">
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
          <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">1. Ingresá gastos</div>
                <div className="text-xs ">Manual o extracto</div>
              </div>
            </div>

            {/* Mini preview */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">FROG</span>
                  <span className="text-red-600 font-extrabold">-$2,450</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">ANTEL</span>
                  <span className="text-red-600 font-extrabold">-$890</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-primary rotate-90" />
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">2. Categorizá auto</div>
                <div className="text-xs ">Con reglas inteligentes</div>
              </div>
            </div>

            {/* Mini rules */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs bg-primary/10 rounded p-2">
                  <span className="font-mono font-semibold">FROG</span>
                  <span className="text-primary">→</span>
                  <span className="font-semibold">Súper</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-primary/10 rounded p-2">
                  <span className="font-mono font-semibold">ANTEL</span>
                  <span className="text-primary">→</span>
                  <span className="font-semibold">Internet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-primary rotate-90" />
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">3. Analizá claro</div>
                <div className="text-xs ">Gráficas simples</div>
              </div>
            </div>

            {/* Mini chart */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-xs font-medium">Súper</span>
                  </div>
                  <span className="text-xs font-bold">$12.4k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium">Servicios</span>
                  </div>
                  <span className="text-xs font-bold">$8.2k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-xs font-medium">Transporte</span>
                  </div>
                  <span className="text-xs font-bold">$5.3k</span>
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
            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/25">
              Empezar gratis ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <div className="text-center space-y-2">
            <div className="text-xs ">
              ✓ Setup en 2 minutos
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
