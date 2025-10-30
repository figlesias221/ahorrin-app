import { SalaryCalculator } from '@/components/free-tools/salary-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Salario Líquido Uruguay 2025 | Herramienta Gratuita | Ahorrin',
  description: '¿Cuánto te queda después de impuestos? Calculá tu salario líquido en Uruguay 2025. IRPF, BPS, Fonasa actualizados. Compará escenarios. 100% gratis.',
  keywords: [
    'calculadora sueldo liquido uruguay',
    'salario liquido uruguay 2025',
    'calculadora irpf uruguay',
    'calcular impuestos sueldo uruguay',
    'cuanto me queda de sueldo uruguay',
    'sueldo neto uruguay',
    'calculadora bps uruguay',
    'fonasa calculadora uruguay',
    'impuestos sueldo uruguay 2025',
    'cuanto gano liquido uruguay',
    'calcular aporte bps',
    'irpf sueldo uruguay',
    'sueldo en mano uruguay'
  ],
  openGraph: {
    title: 'Calculadora de Salario Líquido Uruguay 2025 | Ahorrin',
    description: '¿Cuánto te queda realmente después de impuestos? Calculá tu salario líquido con IRPF, BPS y Fonasa actualizados 2025.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/calculadora-salario-liquido',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Salario Líquido Uruguay 2025',
    description: '¿Cuánto te queda después de IRPF, BPS y Fonasa? Calculalo gratis.',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/calculadora-salario-liquido',
  },
};

export default function CalculadoraSalarioLiquidoPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Salario Líquido Uruguay 2025',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    description: 'Calculadora gratuita de salario líquido para Uruguay 2025. Ingresá tu salario nominal y obtené tu sueldo neto después de IRPF, BPS y Fonasa con las tasas actualizadas.',
    featureList: [
      'Cálculo de IRPF según franjas DGI 2025',
      'Aportes BPS actualizados (15%)',
      'Fonasa según carga familiar',
      'Comparador de escenarios (aumentos de sueldo)',
      'Desglose detallado de descuentos',
      'Cálculo de aguinaldo neto'
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Trabajadores en relación de dependencia en Uruguay',
      geographicArea: {
        '@type': 'Country',
        name: 'Uruguay'
      }
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo se calcula el salario líquido en Uruguay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El salario líquido es tu sueldo nominal menos los descuentos obligatorios: BPS (15%), Fonasa (3-8% según carga familiar) e IRPF (0-36% según franjas de ingreso). Las franjas de IRPF 2025 van desde 0% para ingresos hasta $60,596 hasta 36% para montos superiores a $456,768.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué es el IRPF y cuánto me descuentan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El IRPF (Impuesto a la Renta de las Personas Físicas) es un impuesto progresivo que va de 0% a 36%. Tenés una deducción mínima no imponible de $60,596. Sobre el excedente se aplican franjas: 10% hasta $86,566, 15% hasta $119,890, 24% hasta $177,416, 25% hasta $239,698, 27% hasta $456,768 y 36% sobre lo que supere ese monto.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuánto es el aporte a BPS en 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El aporte al BPS (Banco de Previsión Social) es del 15% de tu salario nominal para trabajadores en relación de dependencia. Este porcentaje está vigente desde hace varios años y se descuenta automáticamente de tu recibo de sueldo.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cómo funciona el descuento de Fonasa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fonasa varía según tu carga familiar: 3% si no tenés hijos a cargo, 4.5% con 1 hijo, 6% con 2 hijos o más. Se calcula sobre tu salario nominal y financia el sistema de salud mutual.'
        }
      },
      {
        '@type': 'Question',
        name: '¿El aguinaldo también tiene descuentos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, el aguinaldo (o sueldo anual complementario) también tiene los mismos descuentos: BPS (15%), Fonasa (3-8%) e IRPF según las franjas. Esta calculadora te permite calcular tu aguinaldo neto.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SalaryCalculator />
    </>
  );
}
