'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PiggyBank,
  FileText,
  ArrowRight,
  Info,
  Users,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface SalaryBreakdown {
  nominal: number;
  bpsDeduction: number;
  fonasaDeduction: number;
  irpfDeduction: number;
  totalDeductions: number;
  netSalary: number;
  deductionPercentage: number;
}

// IRPF 2025 brackets (DGI Uruguay)
const IRPF_BRACKETS = [
  { min: 0, max: 60596, rate: 0 },
  { min: 60596, max: 86566, rate: 0.10 },
  { min: 86566, max: 119890, rate: 0.15 },
  { min: 119890, max: 177416, rate: 0.24 },
  { min: 177416, max: 239698, rate: 0.25 },
  { min: 239698, max: 456768, rate: 0.27 },
  { min: 456768, max: Infinity, rate: 0.36 },
];

const BPS_RATE = 0.15; // 15% BPS deduction

const FONASA_RATES = {
  noChildren: 0.03,      // 3% sin hijos
  oneChild: 0.045,       // 4.5% con 1 hijo
  twoOrMore: 0.06,       // 6% con 2 o más hijos
};

export function SalaryCalculator() {
  const [nominalSalary, setNominalSalary] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [compareWith, setCompareWith] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);

  const calculateIRPF = (baseAmount: number): number => {
    let irpf = 0;
    let remaining = baseAmount;

    for (let i = 0; i < IRPF_BRACKETS.length; i++) {
      const bracket = IRPF_BRACKETS[i];
      const nextBracket = IRPF_BRACKETS[i + 1];

      if (remaining <= 0) break;

      if (baseAmount > bracket.min) {
        const taxableInThisBracket = nextBracket
          ? Math.min(remaining, bracket.max - bracket.min)
          : remaining;

        irpf += taxableInThisBracket * bracket.rate;
        remaining -= taxableInThisBracket;
      }
    }

    return irpf;
  };

  const calculateSalary = (salary: number): SalaryBreakdown => {
    // BPS deduction (15%)
    const bpsDeduction = salary * BPS_RATE;

    // Fonasa deduction based on children
    let fonasaRate = FONASA_RATES.noChildren;
    if (children === 1) fonasaRate = FONASA_RATES.oneChild;
    if (children >= 2) fonasaRate = FONASA_RATES.twoOrMore;
    const fonasaDeduction = salary * fonasaRate;

    // IRPF calculation on base after BPS + Fonasa
    const baseForIRPF = salary - bpsDeduction - fonasaDeduction;
    const irpfDeduction = calculateIRPF(baseForIRPF);

    // Total deductions
    const totalDeductions = bpsDeduction + fonasaDeduction + irpfDeduction;

    // Net salary
    const netSalary = salary - totalDeductions;

    const deductionPercentage = (totalDeductions / salary) * 100;

    return {
      nominal: salary,
      bpsDeduction,
      fonasaDeduction,
      irpfDeduction,
      totalDeductions,
      netSalary,
      deductionPercentage,
    };
  };

  const handleCalculate = () => {
    const salary = parseFloat(nominalSalary);
    if (!salary || salary <= 0) {
      alert('Por favor ingresá tu salario nominal');
      return;
    }
    setShowResults(true);
    setShowComparison(false);
  };

  const handleCompare = () => {
    const salary = parseFloat(compareWith);
    if (!salary || salary <= 0) {
      alert('Por favor ingresá un salario para comparar');
      return;
    }
    setShowComparison(true);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentBreakdown = nominalSalary ? calculateSalary(parseFloat(nominalSalary)) : null;
  const comparisonBreakdown = compareWith ? calculateSalary(parseFloat(compareWith)) : null;

  const getIRPFBracket = (salary: number): string => {
    const baseForIRPF = salary - (salary * BPS_RATE) - (salary * (children === 0 ? FONASA_RATES.noChildren : children === 1 ? FONASA_RATES.oneChild : FONASA_RATES.twoOrMore));

    for (let i = IRPF_BRACKETS.length - 1; i >= 0; i--) {
      if (baseForIRPF > IRPF_BRACKETS[i].min) {
        return `${(IRPF_BRACKETS[i].rate * 100).toFixed(0)}%`;
      }
    }
    return '0%';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Actualizado 2025
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            ¿Cuánto te queda después de impuestos?
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculá tu salario líquido en Uruguay con las tasas de IRPF, BPS y Fonasa actualizadas para 2025.
            Compará escenarios y descubrí cuánto te queda realmente en mano.
          </p>
        </motion.div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Tu Salario</h2>
                <p className="text-sm text-muted-foreground">Ingresá tus datos</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="nominal-salary" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Salario Nominal (mensual)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    $
                  </span>
                  <Input
                    id="nominal-salary"
                    type="number"
                    placeholder="Ej: 80000"
                    value={nominalSalary}
                    onChange={(e) => setNominalSalary(e.target.value)}
                    className="pl-7 h-12 text-lg"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tu sueldo antes de descuentos
                </p>
              </div>

              <div>
                <Label htmlFor="children" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Hijos a cargo
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => setChildren(num)}
                      className={`h-12 rounded-lg border-2 font-semibold transition-all ${
                        children === num
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {num === 2 ? '2+' : num}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                disabled={!nominalSalary}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {showResults && currentBreakdown ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-emerald-600 rounded-2xl p-6 sm:p-8 text-white border border-emerald-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">Tu salario líquido</p>
                    <h3 className="text-4xl sm:text-5xl font-bold">
                      {formatCurrency(currentBreakdown.netSalary)}
                    </h3>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <PiggyBank className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                    <span className="text-white text-sm font-medium">Salario nominal</span>
                    <span className="font-semibold">{formatCurrency(currentBreakdown.nominal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                    <span className="text-white text-sm font-medium">BPS (15%)</span>
                    <span className="font-semibold">-{formatCurrency(currentBreakdown.bpsDeduction)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      Fonasa ({children === 0 ? '3%' : children === 1 ? '4.5%' : '6%'})
                    </span>
                    <span className="font-semibold">-{formatCurrency(currentBreakdown.fonasaDeduction)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      IRPF (franja {getIRPFBracket(currentBreakdown.nominal)})
                    </span>
                    <span className="font-semibold">-{formatCurrency(currentBreakdown.irpfDeduction)}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-700 rounded-lg border border-emerald-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">Total descuentos</span>
                    <span className="text-xl font-bold">{currentBreakdown.deductionPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-emerald-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentBreakdown.deductionPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/20 rounded-lg">
                  <p className="text-white text-sm font-semibold mb-2">Aguinaldo</p>
                  <p className="text-sm leading-relaxed text-white/90">
                    Tu aguinaldo también tiene estos descuentos. Para junio y diciembre,
                    multiplicá tu líquido mensual por 0.5 para estimar cuánto cobrarás.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Tus resultados aparecerán acá
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  Ingresá tu salario nominal y la cantidad de hijos a cargo para ver tu salario líquido
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comparison Section */}
        {showResults && currentBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Comparador de Escenarios</h2>
                <p className="text-sm text-muted-foreground">
                  ¿Y si ganás más? Compará cuánto te quedaría realmente
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Ej: 100000"
                  value={compareWith}
                  onChange={(e) => setCompareWith(e.target.value)}
                  className="pl-7 h-12 text-lg"
                />
              </div>
              <Button
                onClick={handleCompare}
                variant="outline"
                className="h-12"
                disabled={!compareWith}
              >
                Comparar
              </Button>
            </div>

            {showComparison && comparisonBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-emerald-700 font-medium mb-2">
                    Salario actual
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 mb-1">
                    {formatCurrency(currentBreakdown.netSalary)}
                  </p>
                  <p className="text-sm text-gray-600">
                    De {formatCurrency(currentBreakdown.nominal)} nominales
                  </p>
                </div>

                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    Con {formatCurrency(comparisonBreakdown.nominal)}
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {formatCurrency(comparisonBreakdown.netSalary)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      comparisonBreakdown.netSalary > currentBreakdown.netSalary
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {comparisonBreakdown.netSalary > currentBreakdown.netSalary ? '+' : ''}
                      {formatCurrency(comparisonBreakdown.netSalary - currentBreakdown.netSalary)}
                    </span>
                    <span className="text-sm text-muted-foreground">más en mano</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">IRPF 2025</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Impuesto progresivo de 0% a 36%. Deducción mínima de $60,596.
              Se calcula sobre tu salario después de BPS y Fonasa.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">BPS Fijo</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              El aporte jubilatorio es siempre 15% de tu salario nominal,
              sin importar cuánto ganes.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fonasa Variable</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              3% sin hijos, 4.5% con 1 hijo, 6% con 2 o más.
              Financia tu mutualista.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Querés optimizar tus finanzas?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ahora que sabés cuánto te queda en mano, el siguiente paso es controlar
              a dónde va cada peso. Con Ahorrin podés importar tus extractos, categorizar
              automáticamente y ver tus gastos en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/herramientas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 font-semibold rounded-lg hover:border-emerald-600 transition-colors"
              >
                Ver más herramientas
              </Link>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section for SEO */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Cómo se calcula el salario líquido en Uruguay?',
                a: 'El salario líquido es tu sueldo nominal menos los descuentos obligatorios: BPS (15%), Fonasa (3-8% según carga familiar) e IRPF (0-36% según franjas de ingreso). Las franjas de IRPF 2025 van desde 0% para ingresos hasta $60,596 hasta 36% para montos superiores a $456,768.'
              },
              {
                q: '¿Qué es el IRPF y cuánto me descuentan?',
                a: 'El IRPF (Impuesto a la Renta de las Personas Físicas) es un impuesto progresivo que va de 0% a 36%. Tenés una deducción mínima no imponible de $60,596. Sobre el excedente se aplican franjas progresivas según tu ingreso.'
              },
              {
                q: '¿El aguinaldo también tiene descuentos?',
                a: 'Sí, el aguinaldo (o sueldo anual complementario) también tiene los mismos descuentos: BPS (15%), Fonasa (3-8%) e IRPF según las franjas. Esta calculadora te ayuda a estimar tu aguinaldo neto.'
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-600 transition-colors"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
