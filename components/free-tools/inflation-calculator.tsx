'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Mail, ArrowRight, Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface InflationCategory {
  name: string;
  icon: string;
  officialRate: number; // BCU official inflation rate for this category
  weight: number; // % of total spending (user input)
}

export function InflationCalculator() {
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);

  const [weights, setWeights] = useState({
    alimentos: '',
    vivienda: '',
    transporte: '',
    salud: '',
    educacion: '',
    entretenimiento: '',
    vestimenta: '',
    servicios: '',
  });

  // Real inflation rates by category (aproximados 2024 Uruguay)
  const categories: InflationCategory[] = [
    { name: 'Alimentos y Bebidas', icon: '🛒', officialRate: 8.2, weight: 0 },
    { name: 'Vivienda (Alquiler)', icon: '🏠', officialRate: 6.5, weight: 0 },
    { name: 'Transporte (Combustible)', icon: '⛽', officialRate: 12.3, weight: 0 },
    { name: 'Salud (Mutualista)', icon: '🏥', officialRate: 7.1, weight: 0 },
    { name: 'Educación', icon: '📚', officialRate: 5.8, weight: 0 },
    { name: 'Entretenimiento', icon: '🎬', officialRate: 4.2, weight: 0 },
    { name: 'Vestimenta', icon: '👔', officialRate: 3.5, weight: 0 },
    { name: 'Servicios (UTE, OSE, ANTEL)', icon: '💡', officialRate: 9.8, weight: 0 },
  ];

  const calculatePersonalInflation = () => {
    const totalWeight = Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    if (totalWeight === 0) return { personal: 0, official: 5.2, difference: 0 };

    const categoriesWithWeights = [
      { ...categories[0], weight: parseFloat(weights.alimentos) || 0 },
      { ...categories[1], weight: parseFloat(weights.vivienda) || 0 },
      { ...categories[2], weight: parseFloat(weights.transporte) || 0 },
      { ...categories[3], weight: parseFloat(weights.salud) || 0 },
      { ...categories[4], weight: parseFloat(weights.educacion) || 0 },
      { ...categories[5], weight: parseFloat(weights.entretenimiento) || 0 },
      { ...categories[6], weight: parseFloat(weights.vestimenta) || 0 },
      { ...categories[7], weight: parseFloat(weights.servicios) || 0 },
    ];

    const personalInflation = categoriesWithWeights.reduce((sum, cat) => {
      const normalizedWeight = cat.weight / totalWeight;
      return sum + (cat.officialRate * normalizedWeight);
    }, 0);

    const officialInflation = 5.2; // BCU average
    const difference = personalInflation - officialInflation;

    return {
      personal: personalInflation,
      official: officialInflation,
      difference,
      categories: categoriesWithWeights
        .filter(c => c.weight > 0)
        .map(c => ({
          ...c,
          normalizedWeight: (c.weight / totalWeight) * 100,
          impact: (c.officialRate * (c.weight / totalWeight)),
        }))
        .sort((a, b) => b.impact - a.impact),
    };
  };

  const handleCalculate = () => {
    const totalWeight = Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    if (totalWeight === 0) {
      alert('Por favor ingresá al menos una categoría de gasto');
      return;
    }

    setShowResults(true);
  };

  const handleSaveResults = () => {
    if (!email) {
      alert('Por favor ingresá tu email');
      return;
    }
    console.log('Email to save:', email);
    console.log('Inflation data:', weights);
    setEmailSaved(true);
  };

  const result = calculatePersonalInflation();

  const getImpactColor = (rate: number) => {
    if (rate > 10) return 'bg-red-600';
    if (rate > 7) return 'bg-orange-600';
    if (rate > 5) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];

    if (!result.categories || result.categories.length === 0) {
      return ['Ingresá tus categorías de gasto para obtener recomendaciones personalizadas.'];
    }

    // Top 3 categories by impact
    const topCategories = result.categories.slice(0, 3);

    topCategories.forEach((cat, index) => {
      if (cat.officialRate > 8) {
        recommendations.push(
          `${cat.icon} ${cat.name} tiene alta inflación (${cat.officialRate}%) y representa ${cat.normalizedWeight.toFixed(1)}% de tu presupuesto. Buscá alternativas o reducí este gasto.`
        );
      }
    });

    if (result.difference > 2) {
      recommendations.push(
        `⚠️ Tu inflación real (${result.personal.toFixed(1)}%) está ${result.difference.toFixed(1)} puntos por encima del IPC oficial. Tus gastos suben más rápido que el promedio.`
      );
    } else if (result.difference < -1) {
      recommendations.push(
        `✅ Tu inflación personal (${result.personal.toFixed(1)}%) está por debajo del IPC oficial. Tus gastos suben más despacio que el promedio.`
      );
    }

    if (result.personal > 8) {
      recommendations.push(
        'Considerá buscar alternativas más económicas en las categorías con mayor inflación, o negociar aumentos salariales acordes a tu inflación real.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Tu inflación personal está alineada con el promedio nacional.');
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-20 pb-12 sm:py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-red-500/10 rounded-full">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Herramienta Gratuita</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Calculadora de Inflación Real Uruguay 🇺🇾
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            El BCU dice 5.2%, pero <strong>¿cuánto subieron TUS gastos realmente?</strong>
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              La inflación oficial es un promedio. Tu inflación real depende de QUÉ comprás.
            </p>
          </div>
        </motion.div>

        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8 mb-8"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">¿En qué gastás tu plata?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Ingresá el porcentaje aproximado de tu presupuesto en cada categoría. No hace falta que sume 100%.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {categories.map((cat, index) => {
                const key = Object.keys(weights)[index] as keyof typeof weights;
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={key}
                        type="number"
                        placeholder="0"
                        value={weights[key]}
                        onChange={(e) => setWeights({ ...weights, [key]: e.target.value })}
                        className="h-10"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Inflación oficial: <span className="font-semibold text-red-600">{cat.officialRate}%</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Total ingresado: {Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(1)}%
              </p>
            </div>

            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full h-12 text-lg"
            >
              Calcular Mi Inflación Real
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

            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-xl p-6 sm:p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Tu Inflación Real</p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div>
                    <p className="text-5xl sm:text-6xl font-bold text-red-600">
                      {result.personal.toFixed(1)}%
                    </p>
                  </div>
                  {result.difference !== 0 && (
                    <div className="flex flex-col items-start">
                      <div className={`flex items-center gap-1 ${result.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        <TrendingUp className={`w-5 h-5 ${result.difference < 0 ? 'rotate-180' : ''}`} />
                        <span className="text-xl font-bold">
                          {Math.abs(result.difference).toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        vs. IPC oficial
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-muted-foreground mb-1">IPC Oficial BCU</p>
                    <p className="text-2xl font-bold">{result.official}%</p>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-muted-foreground mb-1">Diferencia</p>
                    <p className={`text-2xl font-bold ${result.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.difference > 0 ? '+' : ''}{result.difference.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            {result.categories && result.categories.length > 0 && (
              <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Impacto por Categoría</h2>
                <div className="space-y-4">
                  {result.categories.map((cat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600">{cat.officialRate}%</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({cat.normalizedWeight.toFixed(1)}% de tu presupuesto)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${getImpactColor(cat.officialRate)}`}
                            style={{ width: `${Math.min((cat.impact / result.personal) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground w-16 text-right">
                          {cat.impact.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">¿Qué Hacer?</h2>
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
                    <h3 className="text-xl font-bold mb-2">Recibí Actualizaciones Mensuales</h3>
                    <p className="text-sm text-muted-foreground">
                      Te enviamos tu inflación real cada mes + consejos para mitigar el impacto en tu bolsillo
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
                    Suscribirme
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-950 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                      ¡Suscripto!
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Te vamos a mandar actualizaciones mensuales sobre tu inflación real.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA to Ahorrin */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border-2 border-primary/30 p-6 sm:p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">Controlá Tus Gastos Mes a Mes</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Con Ahorrin, importás tus extractos bancarios y ves exactamente en qué categorías gastás más.
                  Así podés combatir la inflación donde más te pega.
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
                  ✓ Categorización automática ✓ Análisis de tendencias ✓ Hecho en Uruguay 🇺🇾
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
