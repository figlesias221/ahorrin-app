import type { Metadata } from 'next';
import { Pricing } from '@/components/marketing/pricing';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planes y Precios - Ahorrin | Desde $0 UYU',
  description:
    'Descubrí los planes de Ahorrin: empezá gratis y pasate a Pro por solo $99 UYU/mes. Control total de tus finanzas personales en Uruguay. Extractos ilimitados, chat IA, escaneo de recibos y más.',
  keywords: [
    'planes ahorrin',
    'precios ahorrin uruguay',
    'app finanzas gratis uruguay',
    'ahorrin gratis',
    'control gastos gratis',
    'planes finanzas personales',
    'precio app presupuesto',
    'ahorrin costo',
    'finanzas personales gratuitas',
    'mejor app finanzas gratis uruguay',
  ],
  openGraph: {
    title: 'Planes Ahorrin: 100% Gratis, Sin Costos Ocultos',
    description:
      'Control total de tus finanzas personales en Uruguay. Gratis para siempre. Importá extractos, categorizá con IA, visualizá en tiempo real.',
    url: 'https://www.ahorrin.app/pricing',
    type: 'website',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planes Ahorrin: 100% Gratis para Siempre',
    description:
      'Control total de tus finanzas en Uruguay. Sin costos ocultos. Comenzá ahora.',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/pricing',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PricingPage() {
  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planes y Precios - Ahorrin',
    description:
      'Planes de Ahorrin: 100% gratis para controlar tus finanzas personales en Uruguay',
    url: 'https://www.ahorrin.app/pricing',
    provider: {
      '@type': 'Organization',
      name: 'Ahorrin',
      url: 'https://www.ahorrin.app',
      logo: 'https://www.ahorrin.app/logo.svg',
    },
  };

  // SoftwareApplication with pricing info
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ahorrin',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Plan Free',
        price: '0',
        priceCurrency: 'UYU',
        description:
          'Plan gratuito de Ahorrin con funciones esenciales para control de finanzas personales en Uruguay',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
      },
      {
        '@type': 'Offer',
        name: 'Plan Pro',
        price: '99',
        priceCurrency: 'UYU',
        description:
          'Plan Pro de Ahorrin: extractos ilimitados, chat IA ilimitado, escaneo de recibos, multi-moneda y más',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
      },
      {
        '@type': 'Offer',
        name: 'Plan Business',
        price: '999',
        priceCurrency: 'UYU',
        description:
          'Plan Business de Ahorrin: usuarios ilimitados, dashboard compartido, soporte dedicado, SLA garantizado',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
      },
    ],
  };

  // FAQPage schema (smaller, key questions only)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Es realmente gratis Ahorrin? ¿No hay costos ocultos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, Ahorrin es 100% gratis. No hay costos ocultos, no hay trucos. Todas las funciones están disponibles sin pagar nada. No pedimos tarjeta de crédito ni información de pago.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué bancos uruguayos están soportados en Ahorrin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ahorrin funciona con todos los bancos uruguayos: BROU, Itaú, BBVA, Scotiabank, Santander, HSBC, Heritage, Bandes y más. Si tu banco exporta extractos en CSV o Excel, funciona con Ahorrin.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Mis datos están seguros en Ahorrin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutamente. Ahorrin no se conecta a tu banco - vos importás los extractos manualmente. Tus datos están encriptados y solo vos tenés acceso. Nunca compartimos tu información financiera con terceros.',
        },
      },
    ],
  };

  return (
    <>
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* SoftwareApplication with Offers Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section - Similar to homepage */}
        <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient like homepage */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-[11px] font-mono font-bold uppercase tracking-widest border border-success/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Gratis para Siempre
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Planes y Precios
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empezá gratis y pasate a Pro cuando necesites más poder.
            </p>
          </div>
        </section>

        {/* Pricing Component */}
        <Pricing />

        {/* Trust Section */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold pt-1">Sin Costos Ocultos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No hay trucos ni tarifas escondidas
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold pt-1">Todos los Bancos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  BROU, Itaú, BBVA, Scotia, Santander y más
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-accent-cyan/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="font-semibold pt-1">Seguro y Privado</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tus datos nunca salen de tu control
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Like homepage */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Comenzá a controlar tus finanzas hoy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sin tarjeta de crédito. Sin compromisos. Comenzá en 30 segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Comenzar Gratis
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border border-border hover:bg-muted/50 transition-all duration-300"
              >
                Ver Blog
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
