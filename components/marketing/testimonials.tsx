'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'M.R.',
    role: 'Montevideo',
    location: 'Usuario verificado',
    rating: 5,
    text: 'Me encanta la idea de tener una app enfocada en Uruguay, ya que muchas apps de finance no trabajan con bancos uruguayos y hacen más difícil el proceso de usarla. El hecho de que no necesites conectar tu banco es un golazo.',
    highlight: 'Finalmente una app para Uruguay'
  },
  {
    name: 'J.P.',
    role: 'Punta del Este',
    location: 'Usuario verificado',
    rating: 5,
    text: 'Como freelancer con cuentas en BBVA y Scotia, necesitaba algo que me diera una vista unificada. Ahorrin lo hace perfecto. Subo los extractos y las reglas automáticas me salvan.',
    highlight: 'Perfecto para múltiples bancos'
  },
  {
    name: 'S.M.',
    role: 'Montevideo',
    location: 'Usuario verificado',
    rating: 5,
    text: 'Probé varias apps pero todas querían acceso a mi banco. Ahorrin es la única que me deja mantener el control. Solo subo extractos CSV y listo. Me dio paz mental.',
    highlight: 'Privacidad y control'
  },
  {
    name: 'C.F.',
    role: 'Maldonado',
    location: 'Usuario verificado',
    rating: 5,
    text: 'Setup en 2 minutos literal. Creé cuenta, subí extracto del Itaú, hice 3 reglas tipo "DISCO → Supermercado" y ya tenía todo categorizado. Las gráficas están buenísimas.',
    highlight: 'Súper rápido de empezar'
  }
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="h-full p-6 sm:p-8 rounded-2xl border-2 border-border bg-card hover:border-primary/30 transition-all duration-300 flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="w-8 h-8 text-primary/30" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>

        {/* Highlight */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-primary/10 inline-block">
          <span className="text-sm font-semibold text-primary">
            {testimonial.highlight}
          </span>
        </div>

        {/* Testimonial Text */}
        <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary">
              {testimonial.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div>
            <div className="font-semibold text-foreground">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role} · {testimonial.location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Feedback real de uruguayos que ya están usando Ahorrin
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border-2 border-primary/20">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-foreground">
              Usuarios verificados
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              Feedback real
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
