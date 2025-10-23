import { InflationCalculator } from '@/components/free-tools/inflation-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Inflación Real Uruguay | Herramienta Gratuita | Gasty',
  description: 'Calculá tu inflación real personalizada en Uruguay. El BCU dice 5%, pero ¿cuánto subieron TUS gastos realmente? Descubrí tu inflación real según tus categorías de consumo.',
  keywords: [
    'inflacion real uruguay',
    'calculadora inflacion uruguay',
    'cuanto subieron mis gastos',
    'inflacion personalizada uruguay',
    'IPC uruguay',
    'costo de vida uruguay'
  ],
  openGraph: {
    title: 'Calculadora de Inflación Real Uruguay | Gasty',
    description: 'El BCU dice una cosa, tu bolsillo dice otra. Calculá tu inflación real según tus gastos.',
    type: 'website',
    url: 'https://www.gasty.app/herramientas/inflacion-real',
  },
  alternates: {
    canonical: 'https://www.gasty.app/herramientas/inflacion-real',
  },
};

export default function InflacionRealPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Inflación Real Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    description: 'Calculá tu inflación real personalizada en Uruguay. Descubrí cuánto subieron realmente tus gastos según tus categorías de consumo, más allá del IPC oficial del BCU.',
    featureList: [
      'Cálculo de inflación personalizada por categorías',
      'Comparación con IPC oficial del BCU',
      'Análisis por categorías de gasto',
      'Visualización de impacto por categoría',
      'Recomendaciones para mitigar inflación'
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InflationCalculator />
    </>
  );
}
