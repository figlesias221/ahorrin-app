'use client';

import { useState } from 'react';
// import { useChat } from '@ai-sdk/react'; // Disabled for production bundle size
import { motion } from 'framer-motion';
import { Sparkles, Wrench } from 'lucide-react';
import { typography } from '@/lib/design-tokens';

export default function AIPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(spacing.16)-theme(spacing.6))] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ring-1 ring-primary/20 shadow-lg">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-warning/20 to-warning/10 ring-1 ring-warning/30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wrench className="h-4 w-4 text-warning" />
        </motion.div>
      </motion.div>

      <motion.h2
        className={`${typography.h2} text-foreground mb-3`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Asistente AI Temporalmente No Disponible
      </motion.h2>

      <motion.p
        className={`${typography.bodySmall} text-muted-foreground max-w-md mb-6`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Estamos optimizando el asistente AI para ofrecerte una mejor experiencia.
        Volverá pronto con mejoras y nuevas funcionalidades.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
      >
        Mientras tanto, puedes seguir analizando tus gastos en las demás secciones
      </motion.div>
    </div>
  );
}
