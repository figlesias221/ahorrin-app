'use client';

import { motion } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  PieChart,
  Calendar,
  Search,
  Wallet,
  Repeat,
  Target,
  Sparkles
} from 'lucide-react';
import { typography } from '@/lib/design-tokens';

interface Prompt {
  icon: React.ReactNode;
  text: string;
  description: string;
}

const defaultPrompts: Prompt[] = [
  {
    icon: <Calendar className="h-4 w-4" />,
    text: '¿Cuánto gasté este mes?',
    description: 'Ver total de gastos del mes actual'
  },
  {
    icon: <PieChart className="h-4 w-4" />,
    text: 'Top 5 categorías de gasto',
    description: 'Categorías donde más gastas'
  },
  {
    icon: <TrendingDown className="h-4 w-4" />,
    text: 'Compara con el mes pasado',
    description: 'Análisis de tendencias'
  },
  {
    icon: <Repeat className="h-4 w-4" />,
    text: 'Gastos recurrentes',
    description: 'Subscripciones y gastos fijos'
  },
  {
    icon: <Target className="h-4 w-4" />,
    text: '¿Cómo va mi presupuesto?',
    description: 'Estado de presupuestos'
  },
  {
    icon: <Wallet className="h-4 w-4" />,
    text: 'Balance de mis cuentas',
    description: 'Resumen de cuentas bancarias'
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: 'Tendencias de los últimos 6 meses',
    description: 'Análisis de patrones'
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    text: 'Dame insights y recomendaciones',
    description: 'Análisis profundo con IA'
  },
];

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export function SuggestedPrompts({ onSelectPrompt, isLoading }: SuggestedPromptsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className={`${typography.bodySmall} text-muted-foreground`}>
          Preguntas sugeridas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {defaultPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !isLoading && onSelectPrompt(prompt.text)}
            disabled={isLoading}
            className="
              group relative flex items-start gap-3 p-3 rounded-xl
              bg-surface hover:bg-muted
              ring-1 ring-border hover:ring-primary/50
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              text-left
            "
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {prompt.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`${typography.body} text-foreground mb-0.5 line-clamp-2`}>
                {prompt.text}
              </p>
              <p className={`${typography.bodySmall} text-muted-foreground line-clamp-1`}>
                {prompt.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
