'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: '¿Cómo funcionan las reglas automáticas?',
      answer:
        'Puedes crear reglas simples basadas en el nombre del comercio, monto o descripción. Por ejemplo: "Si vendor contiene DISCO → Supermercado". Una vez creadas, todas tus transacciones futuras se categorizan automáticamente. También incluimos paquetes pre-configurados con reglas comunes de Uruguay.',
    },
    {
      question: '¿Es realmente gratis? ¿Hay costos ocultos?',
      answer:
        'Sí, es completamente gratis. No hay costos ocultos, no pedimos tarjeta de crédito, y no hay límites en el número de transacciones o cuentas que puedes gestionar. Nuestro objetivo es hacer la gestión financiera accesible para todos.',
    },
    {
      question: '¿Qué bancos uruguayos están soportados?',
      answer:
        'Soportamos todos los bancos uruguayos: ITAÚ, BBVA, Scotiabank, BROU, Santander, Heritage y más. Puedes subir extractos en formato CSV o Excel de cualquier banco, y nuestro sistema los procesará automáticamente.',
    },
    {
      question: '¿Mis datos están seguros?',
      answer:
        'Absolutamente. Todos tus datos están encriptados usando encriptación de nivel bancario (AES-256). No almacenamos credenciales bancarias y nunca compartimos tu información con terceros. Cumplimos con las regulaciones de protección de datos GDPR.',
    },
    {
      question: '¿Puedo importar mis datos históricos?',
      answer:
        'Sí, puedes subir extractos históricos de tus bancos en formato CSV o Excel. El sistema los procesará automáticamente y aplicará tus reglas de categorización a todas las transacciones, permitiéndote ver tendencias desde el primer día.',
    },
    {
      question: '¿Funciona en móvil?',
      answer:
        'Sí, Ahorrin es completamente responsive y funciona perfectamente en cualquier dispositivo móvil. Puedes acceder desde tu navegador móvil con la misma experiencia que en desktop.',
    },
    {
      question: '¿Puedo corregir categorizaciones incorrectas?',
      answer:
        'Por supuesto. Puedes editar cualquier transacción con un click o usar la edición masiva para cambiar múltiples a la vez. También puedes crear reglas personalizadas para automatizar casos específicos y que las futuras transacciones similares se categoricen correctamente.',
    },
    {
      question: '¿Qué tipo de reportes puedo generar?',
      answer:
        'Puedes generar reportes personalizados por periodo, categoría, cuenta, o comercio. También puedes exportar tus datos en formato Excel o PDF para compartir con tu contador o para tus propios análisis.',
    },
    {
      question: '¿Necesito instalar algo?',
      answer:
        'No, Ahorrin es una aplicación web que funciona directamente en tu navegador. No necesitas instalar ningún software. Solo crea tu cuenta y comienza a usarla inmediatamente.',
    },
    {
      question: '¿Ofrecen soporte si tengo problemas?',
      answer:
        'Sí, ofrecemos soporte por email para todos los usuarios. Los usuarios Pro tienen acceso a soporte prioritario 24/7. También tenemos una extensa documentación y guías para ayudarte a sacar el máximo provecho de Ahorrin.',
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
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Preguntas frecuentes
            </span>
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre Ahorrin
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
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left  transition-colors"
              >
                <span className="font-semibold text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0  transition-transform duration-300 ${
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
                    <div className="px-6 pb-5  leading-relaxed">
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
          className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50"
        >
          <h3 className="text-xl font-semibold mb-2">¿No encontraste tu respuesta?</h3>
          <p className=" mb-6">
            Nuestro equipo está aquí para ayudarte
          </p>
          <a
            href="mailto:soporte@ahorrin.app"
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
