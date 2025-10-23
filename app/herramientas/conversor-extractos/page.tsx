import { CsvConverter } from '@/components/free-tools/csv-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversor de Extractos Bancarios Uruguay | CSV a Excel | Ahorrín',
  description: 'Convertí extractos bancarios de cualquier banco uruguayo (Itaú, BBVA, Scotiabank, BROU, Santander, Heritage) a formato Excel estandarizado. Gratis y sin registrarse.',
  keywords: [
    'convertir extracto itau excel',
    'convertir extracto bbva excel',
    'formato csv banco uruguay',
    'extracto scotiabank excel',
    'convertir extracto brou',
    'extracto bancario excel uruguay',
    'csv a excel banco'
  ],
  openGraph: {
    title: 'Conversor de Extractos Bancarios Uruguay | Ahorrín',
    description: 'Convertí extractos de cualquier banco uruguayo a Excel estandarizado. Gratis.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/conversor-extractos',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/conversor-extractos',
  },
};

export default function ConversorExtractosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Conversor de Extractos Bancarios Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    description: 'Herramienta gratuita para convertir extractos bancarios de cualquier banco uruguayo (Itaú, BBVA, Scotiabank, BROU, Santander, Heritage) a formato Excel estandarizado.',
    featureList: [
      'Conversión de CSV a Excel',
      'Soporte para todos los bancos uruguayos',
      'Formato estandarizado',
      'Procesamiento en el navegador (privado)',
      'Sin registro requerido'
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CsvConverter />
    </>
  );
}
