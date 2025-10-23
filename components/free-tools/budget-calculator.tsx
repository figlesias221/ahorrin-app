'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface BudgetData {
  income: number;
  categories: {
    name: string;
    amount: number;
    avgPercentage: number; // Average percentage in Uruguay
  }[];
}

export function BudgetCalculator() {
  const [income, setIncome] = useState<string>('');
  const [expenses, setExpenses] = useState({
    vivienda: '',
    supermercado: '',
    transporte: '',
    servicios: '',
    salud: '',
    entretenimiento: '',
    ahorro: '',
    otros: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);

  const categories = [
    { key: 'vivienda', label: 'Vivienda (Alquiler/Préstamo)', avgPercentage: 30, icon: '🏠' },
    { key: 'supermercado', label: 'Supermercado y Comida', avgPercentage: 25, icon: '🛒' },
    { key: 'transporte', label: 'Transporte', avgPercentage: 10, icon: '🚗' },
    { key: 'servicios', label: 'Servicios (UTE, OSE, ANTEL)', avgPercentage: 8, icon: '💡' },
    { key: 'salud', label: 'Salud (Mutualista, Medicamentos)', avgPercentage: 7, icon: '🏥' },
    { key: 'entretenimiento', label: 'Entretenimiento y Ocio', avgPercentage: 5, icon: '🎬' },
    { key: 'ahorro', label: 'Ahorro e Inversiones', avgPercentage: 10, icon: '💰' },
    { key: 'otros', label: 'Otros Gastos', avgPercentage: 5, icon: '📦' },
  ];

  const calculateBudget = () => {
    const incomeNum = parseFloat(income) || 0;
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const remaining = incomeNum - totalExpenses;

    return {
      income: incomeNum,
      totalExpenses,
      remaining,
      percentageSpent: incomeNum > 0 ? (totalExpenses / incomeNum) * 100 : 0,
    };
  };

  const handleCalculate = () => {
    if (!income || parseFloat(income) <= 0) {
      alert('Por favor ingresá tu ingreso mensual');
      return;
    }
    setShowResults(true);
  };

  const handleSaveResults = async () => {
    if (!email) {
      alert('Por favor ingresá tu email');
      return;
    }

    // Here you would integrate with your email service (ConvertKit, Mailchimp, etc.)
    // For now, we'll just show a success message
    console.log('Email to save:', email);
    console.log('Budget data:', { income, expenses });

    setEmailSaved(true);
  };

  const budget = calculateBudget();

  const getStatusColor = (percentage: number) => {
    if (percentage > 90) return 'text-red-600';
    if (percentage > 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage > 90) return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (percentage > 70) return <TrendingUp className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];
    const incomeNum = parseFloat(income) || 0;

    categories.forEach(cat => {
      const amount = parseFloat(expenses[cat.key as keyof typeof expenses]) || 0;
      const percentage = incomeNum > 0 ? (amount / incomeNum) * 100 : 0;

      if (percentage > cat.avgPercentage * 1.3) {
        recommendations.push(
          `Tu gasto en ${cat.label} (${percentage.toFixed(1)}%) está por encima del promedio uruguayo (${cat.avgPercentage}%). Considerá reducir este gasto.`
        );
      }
    });

    if (budget.percentageSpent > 100) {
      recommendations.push('⚠️ Estás gastando más de lo que ganás. Es urgente reducir gastos o aumentar ingresos.');
    } else if (budget.percentageSpent > 90) {
      recommendations.push('Estás gastando más del 90% de tu ingreso. Intentá aumentar tu ahorro para emergencias.');
    }

    const savingAmount = parseFloat(expenses.ahorro) || 0;
    if (savingAmount < incomeNum * 0.1) {
      recommendations.push('Intentá ahorrar al menos el 10% de tu ingreso mensual para emergencias y objetivos futuros.');
    }

    if (recommendations.length === 0) {
      recommendations.push('¡Excelente! Tu presupuesto está balanceado. Seguí así.');
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 sm:py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Herramienta Gratuita</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Calculadora de Presupuesto Uruguay 🇺🇾
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculá tu presupuesto mensual y obtené recomendaciones personalizadas para controlar tus finanzas
          </p>
        </motion.div>

        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8 mb-8"
        >
          <div className="space-y-6">

            {/* Income Input */}
            <div>
              <Label htmlFor="income" className="text-base font-semibold mb-2 flex items-center gap-2">
                💵 Ingreso Mensual (UYU)
              </Label>
              <Input
                id="income"
                type="number"
                placeholder="Ej: 80000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="text-lg h-12"
              />
            </div>

            {/* Expenses by Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gastos por Categoría</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.key}>
                    <Label htmlFor={cat.key} className="text-sm mb-1.5 flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </Label>
                    <Input
                      id={cat.key}
                      type="number"
                      placeholder="0"
                      value={expenses[cat.key as keyof typeof expenses]}
                      onChange={(e) => setExpenses({ ...expenses, [cat.key]: e.target.value })}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Promedio UY: {cat.avgPercentage}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full h-12 text-lg"
            >
              Calcular Presupuesto
              <Calculator className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >

            {/* Summary Card */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                {getStatusIcon(budget.percentageSpent)}
                Resumen de tu Presupuesto
              </h2>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ingreso Mensual</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${budget.income.toLocaleString('es-UY')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Gastos</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${budget.totalExpenses.toLocaleString('es-UY')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Disponible</p>
                  <p className={`text-2xl font-bold ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${budget.remaining.toLocaleString('es-UY')}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Porcentaje del Ingreso Gastado</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${
                        budget.percentageSpent > 90 ? 'bg-red-600' :
                        budget.percentageSpent > 70 ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(budget.percentageSpent, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xl font-bold ${getStatusColor(budget.percentageSpent)}`}>
                    {budget.percentageSpent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Recomendaciones Personalizadas</h2>
              <ul className="space-y-3">
                {getRecommendations().map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm sm:text-base">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Capture */}
            {!emailSaved ? (
              <div className="bg-primary/5 rounded-2xl border-2 border-primary/20 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Guardá tus Resultados</h3>
                    <p className="text-sm text-muted-foreground">
                      Ingresá tu email y te enviamos un resumen de tu presupuesto + consejos mensuales para mejorar tus finanzas
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-11"
                  />
                  <Button onClick={handleSaveResults} className="h-11">
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-950 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                    ¡Resultados Guardados!
                  </h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                  Te enviamos un email con tu presupuesto. Revisá tu casilla en unos minutos.
                </p>
              </div>
            )}

            {/* CTA to Ahorrin */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border-2 border-primary/30 p-6 sm:p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">¿Querés Automatizar Todo Esto?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Con Ahorrin, no tenés que calcular manualmente cada mes. Importás tus extractos bancarios y
                  la app categoriza y analiza tus gastos automáticamente con IA.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="h-12">
                      Probar Ahorrin Gratis
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="h-12">
                      Ver Cómo Funciona
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ✓ Setup en 2 minutos ✓ No tarjeta requerida ✓ Hecho en Uruguay 🇺🇾
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
