'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Receipt,
  FolderTree,
  Settings,
  BarChart3,
  Upload,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function AppScreenshots() {
  const features = [
    {
      title: 'Dashboard principal',
      description: 'Visualiza tus ingresos, gastos y balance en tiempo real con gráficos interactivos',
      icon: LayoutDashboard,
      gradient: 'from-accent-purple to-accent-cyan',
    },
    {
      title: 'Transacciones categorizadas',
      description: 'Todas tus transacciones organizadas automáticamente con filtros avanzados',
      icon: Receipt,
      gradient: 'from-accent-cyan to-success',
    },
    {
      title: 'Categorías jerárquicas',
      description: 'Organiza tus gastos con categorías padre e hijas, totalmente personalizable',
      icon: FolderTree,
      gradient: 'from-success to-warning',
    },
    {
      title: 'Reglas automáticas',
      description: 'Configura una vez y olvídate, las reglas trabajan por vos automáticamente',
      icon: Settings,
      gradient: 'from-warning to-error',
    },
    {
      title: 'Gastos por categorías',
      description: 'Ve cuánto gastás en cada categoría con gráficos claros y totales automáticos',
      icon: BarChart3,
      gradient: 'from-error to-accent-purple',
    },
    {
      title: 'Upload simplificado',
      description: 'Sube tus extractos bancarios en segundos, todos los formatos soportados',
      icon: Upload,
      gradient: 'from-accent-purple/80 to-accent-cyan/80',
    },
  ];

  // Mockup components
  const renderMockup = (index: number) => {
    switch (index) {
      case 0: // Dashboard
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
              >
                <div className="flex items-center gap-2 text-success mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">Ingresos</span>
                </div>
                <p className="text-2xl font-bold text-success">$85,000</p>
                <p className="text-xs  mt-1">+12% vs mes anterior</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-gradient-to-br from-error/10 to-error/5 border border-error/20"
              >
                <div className="flex items-center gap-2 text-error mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-medium">Gastos</span>
                </div>
                <p className="text-2xl font-bold text-error">$45,280</p>
                <p className="text-xs  mt-1">-8% vs mes anterior</p>
              </motion.div>
            </div>

            {/* Mini bar chart */}
            <div className="p-4 rounded-xl bg-card/80 backdrop-blur border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-semibold">Gastos por categoría</h4>
                  <p className="text-[10px] ">Últimos 30 días</p>
                </div>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">Oct 2025</Badge>
              </div>

              <div className="h-32 flex items-end justify-between gap-1.5">
                {[
                  { height: 75, label: 'Alim', color: 'from-accent-purple to-accent-purple/60' },
                  { height: 45, label: 'Serv', color: 'from-accent-cyan to-accent-cyan/60' },
                  { height: 90, label: 'Tran', color: 'from-success to-success/60' },
                  { height: 60, label: 'Ent', color: 'from-warning to-warning/60' },
                  { height: 55, label: 'Otro', color: 'from-error to-error/60' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.height}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className={`w-full bg-gradient-to-t ${bar.color} rounded-t-md`}
                    />
                    <span className="text-[10px] font-semibold">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Transacciones
        return (
          <div className="space-y-3">
            {[
              { vendor: 'DISCO MONTEVIDEO 123', category: 'Supermercado', parent: 'Alimentos', amount: -2450 },
              { vendor: 'ANTEL PAGOS SERV', category: 'Internet', parent: 'Servicios', amount: -1890 },
              { vendor: 'UTE MONTEVIDEO', category: 'Electricidad', parent: 'Servicios', amount: -1250 },
            ].map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-3 rounded-xl bg-card/80 backdrop-blur border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium truncate">{tx.vendor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{tx.parent}</Badge>
                      <ArrowRight className="w-3 h-3 " />
                      <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-accent-purple to-accent-cyan border-0">
                        {tx.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-error">${Math.abs(tx.amount).toLocaleString()}</p>
                    <CheckCircle2 className="w-3 h-3 text-success ml-auto mt-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="pt-2 text-center">
              <Badge variant="outline" className="text-[10px] text-success">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                145 transacciones procesadas
              </Badge>
            </div>
          </div>
        );

      case 2: // Categorías
        return (
          <div className="space-y-3">
            {[
              { parent: 'Servicios', children: ['Internet', 'Electricidad', 'Gas'], total: 5140 },
              { parent: 'Alimentos', children: ['Supermercado', 'Restaurantes', 'Delivery'], total: 12450 },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-4 rounded-xl bg-card border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-accent-cyan" />
                    <span className="font-semibold text-sm">{cat.parent}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">${cat.total.toLocaleString()}</Badge>
                </div>
                <div className="pl-7 space-y-1">
                  {cat.children.map((child, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs ">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan/50" />
                      {child}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 3: // Reglas
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold  uppercase tracking-wider flex items-center gap-2 mb-2">
              <Settings className="w-3 h-3" />
              Reglas configuradas
            </div>
            {[
              { rule: 'DISCO*', category: 'Supermercado', count: '47 veces' },
              { rule: 'ANTEL', category: 'Internet', count: '12 veces' },
              { rule: 'UTE', category: 'Electricidad', count: '6 veces' },
              { rule: 'UBER*', category: 'Transporte', count: '24 veces' },
            ].map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-border/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono font-semibold">{rule.rule}</code>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-xs font-semibold">{rule.category}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div className="text-[10px] ">Aplicada {rule.count}</div>
              </motion.div>
            ))}
            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-xs font-medium text-success">
                <Sparkles className="w-3 h-3" />
                487 transacciones categorizadas
              </div>
            </div>
          </div>
        );

      case 4: // Gastos por categorías
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold  mb-2">
              Gastos por categoría - Octubre 2025
            </div>
            <div className="space-y-3">
              {[
                { label: 'Supermercado', amount: 12450, percent: 85, color: 'bg-accent-purple' },
                { label: 'Servicios', amount: 8200, percent: 60, color: 'bg-accent-cyan' },
                { label: 'Transporte', amount: 5300, percent: 40, color: 'bg-success' },
                { label: 'Entretenimiento', amount: 3890, percent: 30, color: 'bg-warning' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-bold">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + 0.1 * i, duration: 0.8 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-3 p-3 rounded-xl bg-gradient-to-r from-success/10 to-accent-cyan/10 border border-success/20 text-center">
              <div className="text-[10px]  mb-1">Total gastado</div>
              <div className="text-xl font-bold text-success">$29,840</div>
            </div>
          </div>
        );

      case 5: // Upload
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center space-y-3 bg-primary/5 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Extracto_ITAU_Enero.pdf</p>
                <p className="text-xs  mt-1">
                  ✓ 145 transacciones detectadas
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['PDF', 'Excel', 'CSV', 'Todos los bancos'].map((format, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="p-2 bg-card rounded-lg text-center font-semibold"
                >
                  {format}
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="screenshots" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Todas las funciones que necesitás
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Control completo de tus finanzas en una sola app
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 border-border/50">
                  {/* Mockup Container */}
                  <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10">
                    {renderMockup(index)}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-2 bg-card">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-sm  leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className=" mb-4">
            ¿Querés ver más? Probalo gratis ahora
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Comenzar gratis
          </a>
        </motion.div>
      </div>
    </section>
  );
}
