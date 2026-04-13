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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 px-4"
          >
            Dejá de Perder Plata por No Saber En Qué Gastás 🇺🇾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-6 mb-8 sm:mb-10"
          >
            Importá extractos de <strong className="text-foreground">todos los bancos uruguayos</strong> (ITAÚ, BBVA, Scotiabank, BROU, Santander, Heritage) y categorizá tus gastos automáticamente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center px-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold">
                  Ver mis gastos en 2 minutos
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-4">Sin conectar tu banco. Sin tarjeta de crédito. 100% gratis.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
