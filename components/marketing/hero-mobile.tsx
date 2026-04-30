'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroMobile() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-5">
            Ahorrin · Montevideo · 2026
          </p>

          <h1 className="text-3xl font-bold tracking-tight mb-5 leading-[1.1]">
            Dejá de Perder Plata por No Saber En Qué Gastás 🇺🇾
          </h1>

          <p className="text-base text-foreground/80 mb-8 leading-relaxed">
            Subí tu extracto o ingresá manualmente. Automático y rápido.
          </p>

          <Link href="/signup" className="block">
            <Button size="lg" className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/30 border-0">
              Ver mis gastos en 2 minutos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <div className="mt-10 space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/70">
              BROU · Itaú · BBVA · Scotia · Santander
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
              Sin banco · Sin tarjeta · Gratis
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
