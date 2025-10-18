'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'por siempre',
      description: 'Perfecto para empezar a gestionar tus finanzas',
      features: [
        'Transacciones ilimitadas',
        'Reglas de categorización custom',
        'Categorías personalizables',
        'Dashboard en tiempo real',
        '1 cuenta bancaria',
        'Reportes básicos',
        'Soporte por email',
      ],
      cta: 'Comenzar gratis',
      href: '/signup',
      popular: false,
      gradient: 'from-muted to-muted',
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$0',
      period: 'por siempre',
      description: 'Todas las funciones avanzadas, completamente gratis',
      badge: 'Más popular',
      features: [
        'Todo en Free, más:',
        'Múltiples cuentas bancarias',
        'Reglas ilimitadas con prioridades',
        'Reportes avanzados y exportación',
        'Normalización automática de vendors',
        'Presupuestos ilimitados',
        'Soporte prioritario 24/7',
        'Acceso a API',
      ],
      cta: 'Comenzar gratis',
      href: '/signup',
      popular: true,
      gradient: 'from-accent-purple via-accent-cyan to-accent-purple',
    },
    {
      name: 'Business',
      icon: Crown,
      price: '$0',
      period: 'por siempre',
      description: 'Para equipos y empresas que necesitan más',
      features: [
        'Todo en Pro, más:',
        'Usuarios ilimitados',
        'Dashboard compartido',
        'Roles y permisos',
        'Integraciones empresariales',
        'Onboarding personalizado',
        'Soporte dedicado',
        'SLA garantizado',
      ],
      cta: 'Contactar ventas',
      href: '#',
      popular: false,
      gradient: 'from-warning to-warning/70',
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-purple/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Precios simples y transparentes
            </span>
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Todas las funciones, completamente gratis. Sin trucos, sin límites ocultos.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-4 py-1 bg-gradient-to-r from-accent-purple to-accent-cyan text-white border-0 font-semibold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div
                  className={`h-full bg-card border ${
                    plan.popular
                      ? 'border-accent-purple shadow-2xl scale-105'
                      : 'border-border/50'
                  } rounded-2xl p-8 hover:shadow-xl transition-all relative overflow-hidden group`}
                >
                  {/* Gradient overlay for popular plan */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-accent-cyan/5 to-accent-purple/5 opacity-50 group-hover:opacity-70 transition-opacity" />
                  )}

                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`inline-flex w-14 h-14 rounded-xl bg-gradient-to-br ${plan.gradient} ${
                          plan.popular ? 'p-3.5' : 'p-3 opacity-80'
                        } items-center justify-center`}
                      >
                        <Icon className={`w-full h-full ${plan.popular ? 'text-white' : 'text-foreground'}`} />
                      </div>
                    </div>

                    {/* Plan name */}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm  mb-6 min-h-[40px]">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-bold ${plan.popular ? 'bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent' : ''}`}>
                          {plan.price}
                        </span>
                        <span className="">/ {plan.period}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={plan.href} className="block mb-8">
                      <Button
                        className={`w-full py-6 text-base font-semibold ${
                          plan.popular
                            ? 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:from-accent-purple/90 hover:to-accent-cyan/90 text-white'
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.cta}
                      </Button>
                    </Link>

                    {/* Features */}
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-accent-purple' : 'text-success'}`} />
                          <span className={`text-sm ${feature.startsWith('Todo') ? 'font-semibold' : ''}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-sm ">
            ¿Preguntas sobre nuestros planes?{' '}
            <Link href="#faq" className="text-primary hover:underline font-medium">
              Ver preguntas frecuentes
            </Link>
          </p>
          <div className="flex items-center justify-center gap-8 text-xs  pt-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Setup instantáneo</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Datos protegidos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
