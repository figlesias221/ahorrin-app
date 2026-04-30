'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroUltimate() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-muted/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary mb-6 sm:mb-8"
          >
            Ahorrin · Hecho en Montevideo · 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 px-4 leading-[1.05]"
          >
            Dejá de Perder Plata por No Saber En Qué Gastás 🇺🇾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-6 mb-10 sm:mb-12 leading-relaxed"
          >
            Importá tu extracto bancario y categorizá tus gastos automáticamente. Sabés exactamente dónde se va la plata.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex justify-center px-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold">
                  Ver mis gastos en 2 minutos
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16"
          >
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground/70 mb-3">
              BROU · Itaú · BBVA · Scotia · Santander · Heritage
            </p>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
              Sin conectar tu banco · Sin tarjeta · 100% gratis
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
