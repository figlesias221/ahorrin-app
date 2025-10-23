'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export function FounderStory() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">¿Por qué existe Ahorrin?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Simple y uruguayo</p>
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-4 sm:space-y-5 text-sm sm:text-base leading-relaxed">
            <p className="text-foreground/90">
              Durante años usé Excel para controlar gastos. Bajaba extractos, copiaba y pegaba a mano, categorizaba cada línea. Un quilombo de 2-3 horas cada mes.
            </p>

            <p className="text-foreground/90">
              Las apps internacionales no funcionan acá. No entienden los bancos uruguayos. Los extractos del BBVA, Scotia, Itaú y BROU tienen formatos diferentes. No reconocen ANTEL, UTE, OSE o FROG.
            </p>

            <p className="text-foreground/90">
              Entonces hice Ahorrin. Una app que entiende nuestros bancos y comercios. Sin conectar tu cuenta. Simple y rápida. Y con poco trabajo tenés una visualización de datos muy amplia y clara.
            </p>

            <div className="pt-4 sm:pt-6 border-t border-border">
              <p className="text-muted-foreground text-xs sm:text-sm">
                ¿Feedback o ayuda?{' '}
                <a href="mailto:figlesias221@gmail.com" className="text-primary hover:underline font-medium">
                  figlesias221@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
