'use client';

import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FreeToolCTA() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 rounded-3xl border-2 border-primary/20 p-8 sm:p-12 md:p-16 text-center overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Herramienta Gratuita</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              ¿Sabés cuánto deberías gastar cada mes?
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Usá nuestra <strong>Calculadora de Presupuesto</strong> gratuita.
              Comparamos tus gastos con promedios uruguayos y te damos recomendaciones personalizadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/herramientas/calculadora-presupuesto">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Probar Calculadora Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                ✓ No requiere email ✓ 100% gratis ✓ En 2 minutos
              </p>
            </div>

            {/* Social proof */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">
                Categorías que analizamos:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['🏠 Vivienda', '🛒 Supermercado', '🚗 Transporte', '💡 Servicios', '🏥 Salud', '💰 Ahorro'].map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-background/50 rounded-full text-sm border border-border">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
