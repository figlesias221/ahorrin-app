'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQReal() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: '¿Necesito conectar mi cuenta bancaria?',
      answer:
        'NO. Ese es uno de nuestros valores principales. Nunca necesitás conectar tu banco ni compartir credenciales. Solo subís extractos CSV/Excel que exportás vos mismo desde tu banco, o ingresás gastos manualmente. Tus credenciales bancarias siempre están seguras.',
    },
    {
      question: '¿Qué bancos uruguayos están soportados?',
      answer:
        'Todos. BBVA, Itaú, Scotiabank, BROU, Santander, Heritage, y cualquier otro banco uruguayo. Si tu banco te permite exportar extractos en CSV o Excel, Ahorrín lo puede procesar automáticamente.',
    },
    {
      question: '¿Mis datos están seguros?',
      answer:
        'Absolutamente. Usamos encriptación de nivel bancario (AES-256) para todos tus datos. Al no conectar tu banco, no tenemos acceso a tus credenciales. Cumplimos con GDPR y todas las regulaciones de protección de datos. Tus datos son solo tuyos.',
    },
    {
      question: '¿Cómo funcionan las reglas de categorización automática?',
      answer:
        'Creás reglas una vez, y Ahorrín las aplica automáticamente. Por ejemplo: "DISCO" → Supermercado. La próxima vez que aparezca DISCO en un extracto, se categoriza solo. También podés combinar vendor + monto: "SISTERBANC $487" → ANTEL Fijo. Ahorrín normaliza nombres para que "DISCO MONTEV" y "DISCO 123" se reconozcan como "DISCO".',
    },
    {
      question: '¿Cuánto tiempo me lleva empezar a usar Ahorrín?',
      answer:
        '2 minutos. Literalmente. Creás tu cuenta, subís un extracto (o ingresás algunos gastos manualmente), creás 2-3 reglas básicas, y ya estás viendo gráficas de tus gastos. No hay configuración compleja ni tutoriales largos.',
    },
    {
      question: '¿Puedo usar Ahorrín en mi celular?',
      answer:
        'Sí, Ahorrín es una aplicación web responsive que funciona perfectamente en celulares, tablets y computadoras. No necesitás instalar nada, solo abrís www.ahorrin.app en tu navegador favorito.',
    },
    {
      question: '¿Qué formatos de archivo acepta Ahorrín?',
      answer:
        'CSV y Excel (.xlsx, .xls). Estos son los formatos que todos los bancos uruguayos permiten exportar. Por seguridad, NO aceptamos PDFs de extractos completos ya que contienen información sensible innecesaria (número de cuenta, saldo, dirección).',
    },
    {
      question: '¿Puedo importar mis gastos históricos?',
      answer:
        'Sí, podés subir extractos de meses o años anteriores. Ahorrín los procesa todos y aplica tus reglas automáticamente, permitiéndote ver tendencias y patrones desde el primer día. Ideal para entender tus hábitos financieros a largo plazo.',
    },
    {
      question: '¿Cómo funciona el asistente con IA?',
      answer:
        'Ahorrín tiene un asistente conversacional con IA que puede responder preguntas sobre tus finanzas. Por ejemplo: "¿Cuánto gasté en supermercado este mes?" o "¿Cuáles son mis gastos recurrentes?". El asistente analiza tus datos y te da respuestas claras con gráficas cuando es necesario.',
    },
    {
      question: '¿Qué tipo de reportes puedo generar?',
      answer:
        'Podés filtrar por categoría, periodo, cuenta, banco, vendor, o combinar filtros. Exportá todo a Excel para análisis más profundos. Por ejemplo: "Gastos en Entretenimiento del último trimestre" o "Detalle de Supermercado por mes en mi cuenta Itaú".',
    },
    {
      question: '¿Ahorrín funciona con múltiples bancos y cuentas?',
      answer:
        'Sí. Podés tener múltiples cuentas de diferentes bancos y Ahorrín te da una vista unificada de todo. Subís extractos de BBVA, Itaú, Scotia, BROU, etc., y ves todo junto en un solo lugar. Perfecto si tenés cuentas en varios bancos.',
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
            Todo lo que necesitas saber sobre Ahorrín
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
