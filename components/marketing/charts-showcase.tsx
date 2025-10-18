'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { LineChart } from '@/components/charts/line-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { PieChart } from '@/components/charts/pie-chart';

export function ChartsShowcase() {
  // Datos de ejemplo: Gastos mensuales (últimos 6 meses)
  const monthlyData = [
    { month: 'May', ingresos: 65000, gastos: 48000, ahorro: 17000 },
    { month: 'Jun', ingresos: 68000, gastos: 45000, ahorro: 23000 },
    { month: 'Jul', ingresos: 72000, gastos: 52000, ahorro: 20000 },
    { month: 'Ago', ingresos: 67000, gastos: 49000, ahorro: 18000 },
    { month: 'Sep', ingresos: 70000, gastos: 51000, ahorro: 19000 },
    { month: 'Oct', ingresos: 75000, gastos: 53000, ahorro: 22000 },
  ];

  // Datos de ejemplo: Distribución por categorías padre
  const categoryData = [
    { name: 'Alimentos', value: 18800, color: '#10b981' },
    { name: 'Servicios', value: 12500, color: '#3b82f6' },
    { name: 'Transporte', value: 8400, color: '#f59e0b' },
    { name: 'Entretenimiento', value: 5900, color: '#8b5cf6' },
    { name: 'Salud', value: 4200, color: '#ef4444' },
  ];

  // Datos de ejemplo: Top gastos por categoría hijo (reales del mes)
  const subcategoryData = [
    { name: 'Frog', amount: 14200, color: '#10b981' },
    { name: 'Devoto', amount: 12000, color: '#059669' },
    { name: 'Farmacia', amount: 5400, color: '#ef4444' },
    { name: 'Comer Afuera', amount: 4050, color: '#f59e0b' },
    { name: 'Nafta', amount: 3800, color: '#f97316' },
  ];

  // Datos de ejemplo: Gastos promedio mensuales por categoría
  const avgMonthlyByCategory = [
    { month: 'May', alimentos: 3200, servicios: 2100, transporte: 1400, entretenimiento: 1000 },
    { month: 'Jun', alimentos: 2900, servicios: 2050, transporte: 1500, entretenimiento: 1200 },
    { month: 'Jul', alimentos: 3500, servicios: 2200, transporte: 1600, entretenimiento: 900 },
    { month: 'Ago', alimentos: 3100, servicios: 2150, transporte: 1350, entretenimiento: 1100 },
    { month: 'Sep', alimentos: 3300, servicios: 2000, transporte: 1500, entretenimiento: 1050 },
    { month: 'Oct', alimentos: 3350, servicios: 2100, transporte: 1450, entretenimiento: 1150 },
  ];

  // Datos de ejemplo: Distribución detallada de gastos (datos reales)
  const expenseDistribution = [
    { name: 'Frog', amount: 169835, percentage: 23.1, color: '#10b981' },
    { name: 'Devoto', amount: 144345, percentage: 19.7, color: '#059669' },
    { name: 'Farmacia', amount: 65111, percentage: 8.9, color: '#ef4444' },
    { name: 'Club', amount: 51535, percentage: 7.0, color: '#3b82f6' },
    { name: 'Comer Afuera', amount: 48628, percentage: 6.6, color: '#f59e0b' },
    { name: 'Nafta', amount: 45277, percentage: 6.2, color: '#f97316' },
    { name: 'Del Campo', amount: 30251, percentage: 4.1, color: '#22c55e' },
    { name: 'El Naranjo', amount: 27355, percentage: 3.7, color: '#84cc16' },
    { name: 'Panaderia', amount: 25209, percentage: 3.4, color: '#eab308' },
    { name: 'Marin', amount: 24309, percentage: 3.3, color: '#06b6d4' },
    { name: 'Wikimusculos', amount: 15923, percentage: 2.2, color: '#8b5cf6' },
    { name: 'Suscripciones', amount: 14041, percentage: 1.9, color: '#a855f7' },
    { name: 'Automovil Club', amount: 10350, percentage: 1.4, color: '#ec4899' },
    { name: 'Disco', amount: 10254, percentage: 1.4, color: '#14b8a6' },
    { name: 'SUNVILLE', amount: 7554, percentage: 1.0, color: '#f43f5e' },
  ].slice(0, 10);  // Limitamos a 10 para mejor visualización

  const totalExpenses = 1002326;
  const avgMonthlyExpense = 100233;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="charts" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-cyan/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Visualiza tus finanzas
            </span>
          </h2>
          <p className="text-base sm:text-lg  max-w-2xl mx-auto px-4">
            Gráficas claras y fáciles de entender. Ve exactamente a dónde va tu dinero.
          </p>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Ingresos vs Gastos con AreaChart */}
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm h-full">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Flujo Financiero</h3>
                  <p className="text-xs ">Últimos 6 meses</p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20">
                  <TrendingUp className="h-5 w-5 text-accent-purple" />
                </div>
              </div>

              <AreaChart
                data={monthlyData}
                xKey="month"
                datasets={[
                  { key: 'ingresos', label: 'Ingresos', color: '#10b981', fillOpacity: 0.3 },
                  { key: 'gastos', label: 'Gastos', color: '#ef4444', fillOpacity: 0.3 },
                  { key: 'ahorro', label: 'Ahorro', color: '#8b5cf6', fillOpacity: 0.2 },
                ]}
                height={280}
                yAxisFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tooltipFormatter={(value) => `$${value.toLocaleString('es-UY')}`}
              />

              <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                <div>
                  <span className="">Promedio Ingresos:</span>
                  <span className="ml-2 font-bold text-success">$69,500</span>
                </div>
                <div>
                  <span className="">Promedio Gastos:</span>
                  <span className="ml-2 font-bold text-error">$49,667</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Distribución por Categorías con PieChart */}
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm h-full">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Distribución por Categorías</h3>
                  <p className="text-xs ">Octubre 2025</p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-accent-cyan/20">
                  <PieChartIcon className="h-5 w-5 text-success" />
                </div>
              </div>

              <PieChart
                data={categoryData}
                height={280}
                innerRadius="35%"
                outerRadius="65%"
                showLabels={false}
                showLegend={true}
                tooltipFormatter={(value) => `$${value.toLocaleString('es-UY')}`}
              />

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="">{cat.name}</span>
                    <span className="ml-auto font-semibold">${(cat.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Top Categories Bar Chart con BarChart horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold">Top 5 Categorías</h3>
                <p className="text-xs ">Octubre 2025 • Ordenadas por monto</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-accent-purple/20">
                <BarChart3 className="h-5 w-5 text-warning" />
              </div>
            </div>

            <BarChart
              data={subcategoryData}
              xKey="name"
              datasets={[
                { key: 'amount', label: 'Monto', color: (index) => subcategoryData[index]?.color || '#8b5cf6' }
              ]}
              height={300}
              horizontal={true}
              tooltipFormatter={(value) => `$${value.toLocaleString('es-UY')}`}
              xAxisFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm  text-center">
                💡 <span className="font-semibold text-foreground">Frog</span> y{' '}
                <span className="font-semibold text-foreground">Devoto</span> son subcategorías de{' '}
                <span className="font-semibold text-success">Alimentos</span>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Evolución Mensual por Categorías con BarChart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6"
        >
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold">Evolución por Categorías</h3>
                <p className="text-xs ">Mayo - Octubre 2025 • Compara tendencias</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-success/20">
                <BarChart3 className="h-5 w-5 text-accent-cyan" />
              </div>
            </div>

            <BarChart
              data={avgMonthlyByCategory}
              xKey="month"
              datasets={[
                { key: 'alimentos', label: 'Alimentos', color: '#10b981' },
                { key: 'servicios', label: 'Servicios', color: '#3b82f6' },
                { key: 'transporte', label: 'Transporte', color: '#f59e0b' },
                { key: 'entretenimiento', label: 'Entretenimiento', color: '#8b5cf6' },
              ]}
              height={320}
              showLegend={true}
              tooltipFormatter={(value) => `$${value.toLocaleString('es-UY')}`}
              yAxisFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-2 rounded-lg bg-success/5">
                  <p className="text-xs  mb-1">Alimentos</p>
                  <p className="font-bold text-success">$3,225 prom.</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-500/5">
                  <p className="text-xs  mb-1">Servicios</p>
                  <p className="font-bold text-blue-500">$2,100 prom.</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-warning/5">
                  <p className="text-xs  mb-1">Transporte</p>
                  <p className="font-bold text-warning">$1,467 prom.</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent-purple/5">
                  <p className="text-xs  mb-1">Entretenimiento</p>
                  <p className="font-bold text-accent-purple">$1,067 prom.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Comparación de Categorías con BarChart vertical */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Comparación de Gastos</h3>
                <p className="text-xs ">Top 10 categorías • Período completo</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent-purple/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="mb-6 text-right">
              <div className="text-sm ">Total</div>
              <div className="text-xl font-bold">${totalExpenses.toLocaleString('es-UY')}</div>
              <div className="text-xs ">Promedio/mes: ${avgMonthlyExpense.toLocaleString('es-UY')}</div>
            </div>

            <BarChart
              data={expenseDistribution.map(item => ({
                name: item.name,
                monto: item.amount,
                porcentaje: item.percentage,
              }))}
              xKey="name"
              datasets={[
                { key: 'monto', label: 'Monto', color: (index) => expenseDistribution[index]?.color || '#8b5cf6' }
              ]}
              height={350}
              tooltipFormatter={(value) => `$${value.toLocaleString('es-UY')}`}
              yAxisFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
                <div className="text-center">
                  <p className=" text-xs mb-1">Mayor gasto</p>
                  <p className="font-bold text-primary">{expenseDistribution[0].name}</p>
                  <p className="text-xs ">${expenseDistribution[0].amount.toLocaleString('es-UY')}</p>
                </div>
                <div className="text-center">
                  <p className=" text-xs mb-1">Categorías totales</p>
                  <p className="font-bold text-accent-cyan">15</p>
                  <p className="text-xs ">activas</p>
                </div>
                <div className="text-center">
                  <p className=" text-xs mb-1">Top 3 representa</p>
                  <p className="font-bold text-success">51.7%</p>
                  <p className="text-xs ">del total</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}