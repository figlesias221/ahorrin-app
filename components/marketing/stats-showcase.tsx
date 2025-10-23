'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, TrendingUp, FileText, Clock } from 'lucide-react';

// Counter animation hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, isInView]);

  return { count, setIsInView };
}

const stats = [
  {
    icon: Users,
    value: 150,
    suffix: '+',
    label: 'Usuarios activos',
    description: 'Confían en Gasty para sus finanzas',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: FileText,
    value: 3200,
    suffix: '+',
    label: 'Transacciones procesadas',
    description: 'Categorizadas automáticamente',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: TrendingUp,
    value: 18,
    suffix: '%',
    label: 'Ahorro promedio descubierto',
    description: 'Identificando gastos innecesarios',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: Clock,
    value: 2,
    suffix: ' min',
    label: 'Tiempo promedio de setup',
    description: 'Desde registro hasta primer insight',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { count, setIsInView } = useCounter(stat.value);
  const Icon = stat.icon;

  useEffect(() => {
    if (isInView) {
      setIsInView(true);
    }
  }, [isInView, setIsInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className={`p-6 sm:p-8 rounded-2xl border-2 border-border ${stat.bgColor} backdrop-blur-sm hover:border-primary/30 transition-all duration-300 text-center`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
          </div>
        </div>

        {/* Number */}
        <div className="mb-2">
          <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.color}`}>
            {count.toLocaleString('es-UY')}
          </span>
          <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color}`}>
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
          {stat.label}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {stat.description}
        </p>
      </div>
    </motion.div>
  );
}

export function StatsShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Números que hablan por sí solos
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Gasty está ayudando a uruguayos a tomar control de sus finanzas
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
