'use client';

import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export function CategoriesShowcase() {
  const categories = [
    {
      name: 'Supermercado',
      status: 'Activa',
      transactions: 45,
      total: 68450.50,
      color: 'bg-success/10 text-success',
    },
    {
      name: 'Internet',
      status: 'Activa',
      transactions: 12,
      total: 22680.00,
      color: 'bg-accent-purple/10 text-accent-purple',
    },
    {
      name: 'Electricidad',
      status: 'Activa',
      transactions: 12,
      total: 15000.00,
      color: 'bg-warning/10 text-warning',
    },
    {
      name: 'Nafta',
      status: 'Activa',
      transactions: 22,
      total: 50412.70,
      color: 'bg-accent-cyan/10 text-accent-cyan',
    },
    {
      name: 'Restaurantes',
      status: 'Activa',
      transactions: 35,
      total: 42750.00,
      color: 'bg-error/10 text-error',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Organizá con categorías personalizadas
          </h2>
          <p className="text-base sm:text-lg  max-w-2xl mx-auto px-4">
            Creá las categorías que necesites. Cada una muestra sus transacciones y totales de forma clara.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        >
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:block bg-card border-b border-border">
            <div className="grid grid-cols-10 gap-4 px-6 py-4 text-sm font-semibold">
              <div className="col-span-4">Categoría</div>
              <div className="col-span-2 text-center">Estado</div>
              <div className="col-span-2 text-center">Transacciones</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Category - Desktop */}
                <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {category.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-center font-medium">
                    {category.transactions}
                  </div>
                  <div className="col-span-2 text-right font-bold">
                    ${category.total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Category - Mobile */}
                <div className="md:hidden px-4 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-semibold text-base">{category.name}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {category.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Transacciones</span>
                      <span className="font-medium">
                        {category.transactions}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground mb-1">Total</span>
                      <span className="font-bold">
                        ${category.total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features below table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-lg font-semibold mb-2">Totales claros</div>
            <p className="text-sm text-muted-foreground">
              Ve el total de cada categoría con todas sus transacciones incluidas
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-lg font-semibold mb-2">Seguimiento preciso</div>
            <p className="text-sm text-muted-foreground">
              Monitoreá exactamente cuánto gastás en cada categoría mes a mes
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-lg font-semibold mb-2">Categorías personalizables</div>
            <p className="text-sm text-muted-foreground">
              Creá las categorías que necesites y organizá tus gastos a tu manera
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
