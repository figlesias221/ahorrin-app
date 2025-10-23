'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Settings, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroReal() {
  const badges = [
    { icon: Settings, text: 'Reglas Custom', color: 'text-accent-purple' },
    { icon: Shield, text: '100% Seguro', color: 'text-success' },
    { icon: Zap, text: 'Setup en 10s', color: 'text-accent-cyan' },
  ];

  // Ejemplos REALES de transacciones uruguayas
  const realTransactions = [
    { vendor: 'DISCO MONTEVIDEO', category: 'Supermercado', amount: -2450 },
    { vendor: 'ANTEL', category: 'Internet', amount: -1890 },
    { vendor: 'TA-TA', category: 'Supermercado', amount: -3200 },
    { vendor: 'UTE', category: 'Electricidad', amount: -1250 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-purple/10 via-background to-background" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-accent-purple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent-cyan/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-success/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-12">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="#features">
              <Badge
                variant="outline"
                className="px-6 py-3 text-sm border-border/50 bg-card/30 backdrop-blur-sm  transition-all cursor-pointer group"
              >
                <Settings className="w-4 h-4 mr-2 text-accent-purple" />
                Reglas inteligentes de categorización
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Badge>
            </Link>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Tus gastos uruguayos
              </span>
              <span className="block bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent animate-gradient-x mt-2">
                organizados automáticamente
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl  leading-relaxed font-light">
              Crea reglas una sola vez y Ahorrin categoriza todo automáticamente.
              <br className="hidden sm:block" />
              DISCO → Supermercado. ANTEL → Internet. UTE → Electricidad.{' '}
              <span className="text-foreground font-medium">Así de simple.</span>
            </p>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border hover:shadow-lg transition-all"
              >
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                <span className="font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" className="group px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                Comenzar gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#showcase">
              <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold border-2 ">
                <ArrowRight className="mr-2 w-5 h-5" />
                Ver ejemplo real
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm  pt-8"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>100% Seguro</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-foreground/30" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span>Bancos uruguayos: ITAÚ, BBVA, BROU, Scotiabank</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-foreground/30" />
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent-purple" />
              <span>Setup instantáneo</span>
            </div>
          </motion.div>

          {/* Real Transaction Examples */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-16 pb-8 relative"
          >
            <div className="relative max-w-5xl mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-accent-cyan/20 to-success/20 blur-3xl -z-10 transform scale-110" />

              {/* Browser chrome */}
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                {/* Browser header */}
                <div className="bg-card px-4 py-3 flex items-center gap-2 border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-card/80 rounded-md px-3 py-1 text-xs  flex items-center gap-2 max-w-md">
                      <Shield className="w-3 h-3 text-success" />
                      <span>ahorrin.app/transactions</span>
                    </div>
                  </div>
                </div>

                {/* Real transactions */}
                <div className="p-8 bg-gradient-to-br from-background via-muted/20 to-background">
                  <div className="text-sm  mb-4 flex items-center justify-between">
                    <span>Procesando extracto ITAÚ Visa...</span>
                    <span className="text-success font-medium">Reglas aplicadas ✓</span>
                  </div>

                  <div className="space-y-3">
                    {realTransactions.map((tx, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.15 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-card/80 backdrop-blur border border-border/50 hover:border-border hover:shadow-md transition-all group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-base">{tx.vendor}</p>
                            <ArrowRight className="w-4 h-4 text-accent-cyan" />
                            <Badge className="text-xs bg-gradient-to-r from-accent-purple to-accent-cyan text-white border-0">
                              {tx.category}
                            </Badge>
                          </div>
                          <p className="text-xs ">
                            Regla: "{tx.vendor.split(' ')[0]}" siempre va a {tx.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-error">
                            ${Math.abs(tx.amount).toLocaleString()}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-success text-xs">✓</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-border/50"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="">
                        4 transacciones categorizadas automáticamente
                      </span>
                      <span className="font-semibold text-success">100% precisión</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs  font-medium group- transition-colors">
              Descubre más
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 group-hover:border-foreground/50 flex items-start justify-center p-2 transition-colors"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-foreground/50 group-hover:bg-foreground rounded-full transition-colors"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(40px, -80px) scale(1.15);
          }
          50% {
            transform: translate(-30px, 40px) scale(0.95);
          }
          75% {
            transform: translate(60px, 80px) scale(1.08);
          }
        }

        .animate-blob {
          animation: blob 25s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
      `}</style>
    </section>
  );
}
