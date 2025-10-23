'use client';

import { motion } from 'framer-motion';
import { MapPin, Lock, Zap, Brain } from 'lucide-react';

const benefits = [
  {
    icon: MapPin,
    title: 'Hecho para Uruguay 🇺🇾',
    description: 'Compatible con todos los bancos uruguayos: BBVA, Itaú, Scotiabank, BROU, Santander, Heritage y más.',
    features: [
      'Extractos CSV/Excel',
      'Formatos locales soportados',
      'Multi-moneda (UYU, USD)'
    ],
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10'
  },
  {
    icon: Lock,
    title: '100% Privado y Seguro',
    description: 'No necesitás conectar tus cuentas bancarias ni compartir credenciales. Solo subís extractos.',
    features: [
      'Sin acceso a tu banco',
      'Encriptación AES-256',
      'Datos solo tuyos'
    ],
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10'
  },
  {
    icon: Zap,
    title: 'Setup en 2 Minutos',
    description: 'Creá tu cuenta, subí un extracto o ingresá gastos manualmente, y empezá a ver insights inmediatamente.',
    features: [
      'Sin instalación',
      'Sin configuración compleja',
      'Resultados inmediatos'
    ],
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10'
  },
  {
    icon: Brain,
    title: 'Inteligencia Artificial',
    description: 'Categorización automática de gastos. Creá reglas una vez y olvidate de categorizar manualmente.',
    features: [
      'Asistente financiero IA',
      'Reglas inteligentes',
      'Análisis predictivo'
    ],
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10'
  }
];

export function BenefitsGrid() {
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
            ¿Por qué elegir Gasty?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            La forma más simple y segura de tomar control total de tus finanzas en Uruguay
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-6 sm:p-8 rounded-2xl border-2 border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${benefit.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${benefit.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-5 leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${benefit.iconColor.replace('text-', 'bg-')}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
