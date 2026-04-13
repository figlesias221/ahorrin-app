'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckoutButton } from '@/components/payments/checkout-button';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'por siempre',
      description: 'Perfecto para empezar a gestionar tus finanzas',
      features: [
        { text: '3 extractos por mes', included: true },
        { text: '5 mensajes IA por mes', included: true },
        { text: '10 categorías', included: true },
        { text: '10 reglas de categorización', included: true },
        { text: 'Dashboard en tiempo real', included: true },
        { text: 'Historial de 3 meses', included: true },
        { text: 'Exportación básica', included: true },
        { text: 'Escaneo de recibos con IA', included: false },
        { text: 'Multi-moneda (UYU + USD)', included: false },
        { text: 'Bancos personalizados', included: false },
        { text: 'Reporte mensual por email', included: false },
      ],
      cta: 'Comenzar gratis',
      href: '/signup',
      popular: false,
      gradient: 'from-muted to-muted',
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$99',
      priceCurrency: 'UYU',
      period: 'por mes',
      description: 'Todo ilimitado para controlar tus finanzas en serio',
      badge: 'Más popular',
      features: [
        { text: 'Extractos ilimitados', included: true },
        { text: 'Chat IA ilimitado', included: true },
        { text: 'Categorías ilimitadas', included: true },
        { text: 'Reglas ilimitadas con prioridades', included: true },
        { text: 'Dashboard en tiempo real', included: true },
        { text: 'Historial completo', included: true },
        { text: 'Exportación avanzada con gráficas', included: true },
        { text: 'Escaneo de recibos con IA', included: true },
        { text: 'Multi-moneda (UYU + USD)', included: true },
        { text: 'Bancos personalizados', included: true },
        { text: 'Reporte mensual por email', included: true },
      ],
      cta: 'Comenzar prueba gratis',
      href: '/signup?plan=pro',
      popular: true,
      gradient: 'from-accent-purple via-accent-cyan to-accent-purple',
    },
    {
      name: 'Business',
      icon: Crown,
      price: '$999',
      priceCurrency: 'UYU',
      period: 'por mes',
      description: 'Para equipos y empresas que necesitan más',
      badge: 'Próximamente',
      features: [
        { text: 'Todo en Pro, más:', included: true },
        { text: 'Usuarios ilimitados', included: true },
        { text: 'Dashboard compartido', included: true },
        { text: 'Roles y permisos', included: true },
        { text: 'Integraciones empresariales', included: true },
        { text: 'Onboarding personalizado', included: true },
        { text: 'Soporte dedicado', included: true },
        { text: 'SLA garantizado', included: true },
        { text: 'Reportes para contadores', included: true },
        { text: 'Exportación fiscal', included: true },
        { text: 'API access', included: true },
      ],
      cta: 'Contactar ventas',
      href: 'mailto:hola@ahorrin.app?subject=Plan Business',
      popular: false,
      gradient: 'from-warning to-warning/70',
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

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
            <span className="text-foreground">
              Precios simples y transparentes
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Empezá gratis y pasate a Pro cuando necesites más poder.
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
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className={`px-4 py-1 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} border-0 font-semibold`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div
                  className={`h-full bg-card border ${
                    plan.popular
                      ? 'border-primary shadow-2xl scale-105'
                      : 'border-border/50'
                  } rounded-2xl p-8 hover:shadow-xl transition-all relative overflow-hidden group`}
                >
                  {/* Gradient overlay for popular plan */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 opacity-50 group-hover:opacity-70 transition-opacity" />
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
                    <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-bold ${plan.popular ? 'text-foreground' : ''}`}>
                          {plan.price}
                        </span>
                        <div className="flex flex-col">
                          {plan.priceCurrency && (
                            <span className="text-sm text-muted-foreground">{plan.priceCurrency}</span>
                          )}
                          <span className="text-muted-foreground">/ {plan.period}</span>
                        </div>
                      </div>
                      {plan.priceCurrency === 'UYU' && plan.name === 'Pro' && (
                        <p className="text-xs text-muted-foreground mt-1">~$2.25 USD - menos que un café</p>
                      )}
                    </div>

                    {/* CTA Button */}
                    {plan.name === 'Pro' ? (
                      <div className="mb-8">
                        <CheckoutButton
                          planId="pro"
                          className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                          size="lg"
                        >
                          {plan.cta}
                        </CheckoutButton>
                      </div>
                    ) : (
                      <Link href={plan.href} className="block mb-8">
                        <Button
                          className={`w-full py-6 text-base font-semibold`}
                          variant="outline"
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    )}

                    {/* Features */}
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-success" />
                          ) : (
                            <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground/40" />
                          )}
                          <span className={`text-sm ${!feature.included ? 'text-muted-foreground/60' : ''} ${feature.text.startsWith('Todo') ? 'font-semibold' : ''}`}>
                            {feature.text}
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
          <p className="text-sm text-muted-foreground">
            ¿Preguntas sobre nuestros planes?{' '}
            <Link href="#faq" className="text-primary hover:underline font-medium">
              Ver preguntas frecuentes
            </Link>
          </p>
          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Cancelá cuando quieras</span>
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
