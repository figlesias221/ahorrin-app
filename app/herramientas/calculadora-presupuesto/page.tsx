import { BudgetCalculator } from '@/components/free-tools/budget-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Presupuesto Uruguay | Herramienta Gratuita | Ahorrín',
  description: 'Calculá tu presupuesto mensual en Uruguay. Ingresá tus ingresos y gastos, y obtené recomendaciones personalizadas para controlar tus finanzas. 100% gratis.',
  keywords: [
    'calculadora presupuesto uruguay',
    'presupuesto mensual uruguay',
    'como hacer presupuesto uruguay',
    'planificar gastos uruguay',
    'finanzas personales uruguay',
    'control gastos uruguay'
  ],
  openGraph: {
    title: 'Calculadora de Presupuesto Uruguay | Ahorrín',
    description: 'Calculá tu presupuesto mensual en Uruguay. Ingresá tus ingresos y gastos, y obtené recomendaciones personalizadas.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/calculadora-presupuesto',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/calculadora-presupuesto',
  },
};

export default function CalculadoraPresupuestoPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Presupuesto Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    description: 'Calculadora gratuita de presupuesto mensual para Uruguay. Ingresá tus ingresos y gastos por categoría y obtené un análisis detallado de tu situación financiera.',
    featureList: [
      'Cálculo de presupuesto mensual personalizado',
      'Análisis por categorías de gastos',
      'Comparación con promedios uruguayos',
      'Recomendaciones financieras personalizadas',
      'Visualización de distribución de gastos'
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BudgetCalculator />
    </>
  );
}
