'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQReal() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: '¿Cómo funcionan las reglas de categorización?',
      answer:
        'Creas reglas basadas en el nombre del vendor o el monto. Por ejemplo: "DISCO" → Supermercado, "ANTEL" → Internet. También puedes usar montos: "SISTERBANC $487" → ANTEL Fijo. Las reglas se aplican automáticamente a todas las transacciones. Gasty también normaliza nombres: "DISCO MONTEV" y "DISCO 123" se convierten en "DISCO" para que la regla funcione siempre.',
    },
    {
      question: '¿Es realmente gratis? ¿Hay costos ocultos?',
      answer:
        'Sí, es completamente gratis. No hay costos ocultos, no pedimos tarjeta de crédito, y no hay límites en transacciones, cuentas o reglas. Nuestro objetivo es hacer la gestión financiera accesible para todos los uruguayos.',
    },
    {
      question: '¿Qué bancos uruguayos están soportados?',
      answer:
        'Soportamos todos los bancos uruguayos: ITAÚ, BBVA, Scotiabank, BROU, Santander, Heritage y más. Puedes subir extractos en formato CSV o Excel de cualquier banco, y Gasty los procesará automáticamente.',
    },
    {
      question: '¿Mis datos están seguros?',
      answer:
        'Absolutamente. Todos tus datos están encriptados usando encriptación de nivel bancario (AES-256). NO necesitas conectar tus cuentas bancarias ni dar credenciales. Solo subes extractos. Cumplimos con las regulaciones de protección de datos GDPR.',
    },
    {
      question: '¿Puedo importar mis datos históricos?',
      answer:
        'Sí, puedes subir extractos históricos de tus bancos en formato CSV o Excel. Gasty los procesará y aplicará tus reglas automáticamente, permitiéndote ver tendencias desde el primer día.',
    },
    {
      question: '¿Cómo funciona la normalización de vendors?',
      answer:
        'Los bancos escriben los nombres de comercios de forma diferente: "DISCO MONTEV", "DISCO MVD", "DISCO 123". Gasty los normaliza automáticamente a "DISCO" para que tus reglas funcionen siempre, sin importar cómo el banco escribió el nombre.',
    },
    {
      question: '¿Puedo tener reglas basadas en montos?',
      answer:
        'Sí. Por ejemplo, si SISTERBANC te cobra $487, sabes que es ANTEL Fijo. Si cobra $1,925, es ANTEL Internet. Puedes crear reglas que consideren tanto el vendor como el monto: "SISTERBANC + $487" → ANTEL Fijo.',
    },
    {
      question: '¿Qué tipo de reportes puedo generar?',
      answer:
        'Puedes generar reportes por categoría, por periodo, cuenta, banco o vendor. También puedes exportar en Excel o PDF. Por ejemplo: "Todos los gastos en Servicios del último trimestre" o "Detalle de Supermercado por mes".',
    },
    {
      question: '¿Necesito instalar algo?',
      answer:
        'No, Gasty es una aplicación web que funciona directamente en tu navegador. No necesitas instalar ningún software. Solo crea tu cuenta y comienza a usarla inmediatamente desde cualquier dispositivo.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent-cyan/5 via-transparent to-transparent" />

      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 mb-4">
            <HelpCircle className="w-8 h-8 text-accent-cyan" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Preguntas frecuentes
            </span>
          </h2>
          <p className="text-base sm:text-lg  max-w-2xl mx-auto px-4">
            Todo lo que necesitas saber sobre Gasty
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 text-left  transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base pr-2 sm:pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0  transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base  leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">¿No encontraste tu respuesta?</h3>
          <p className="text-sm sm:text-base  mb-4 sm:mb-6">
            Nuestro equipo está aquí para ayudarte
          </p>
          <a
            href="mailto:soporte@gasty.app"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Contactar soporte
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
