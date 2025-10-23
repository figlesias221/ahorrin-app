'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Clock, DollarSign } from 'lucide-react';

const badges = [
  {
    icon: DollarSign,
    title: '100% Gratis',
    description: 'Sin costos ocultos ni límites',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    icon: Shield,
    title: 'Sin Conectar Banco',
    description: 'Tus credenciales siempre seguras',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Clock,
    title: 'Setup en 2 Minutos',
    description: 'Empezá a usar inmediatamente',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: Zap,
    title: 'Hecho para Uruguay',
    description: 'Todos los bancos compatibles',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  }
];

export function TrustBadges() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-4 sm:p-6 rounded-xl border-2 ${badge.borderColor} ${badge.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${badge.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
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
