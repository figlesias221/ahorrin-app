import type { Metadata } from 'next';
import { Pricing } from '@/components/marketing/pricing';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planes y Precios - Ahorrin | 100% Gratis para Siempre',
  description:
    'Descubrí los planes de Ahorrin: 100% gratis, sin costos ocultos. Control total de tus finanzas personales en Uruguay. Importá extractos bancarios, categorizá gastos automáticamente con IA, y visualizá tu dinero en tiempo real.',
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
          'Plan gratuito de Ahorrin con funciones esenciales para control de finanzas personales',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2025-12-31',
      },
      {
        '@type': 'Offer',
        name: 'Plan Pro',
        price: '0',
        priceCurrency: 'UYU',
        description:
          'Plan Pro gratuito de Ahorrin con funciones avanzadas: múltiples cuentas, reglas ilimitadas, reportes avanzados',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2025-12-31',
      },
      {
        '@type': 'Offer',
        name: 'Plan Business',
        price: '0',
        priceCurrency: 'UYU',
        description:
          'Plan Business gratuito de Ahorrin con funciones empresariales: usuarios ilimitados, dashboard compartido, soporte dedicado',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2025-12-31',
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
      <Navbar />

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
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient like homepage */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium border border-success/20">
                <CheckCircle2 className="w-4 h-4" />
                100% Gratis para Siempre
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Planes y Precios
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Elegí el plan que mejor se adapte a tus necesidades.{' '}
              <span className="text-foreground font-semibold">
                Todos 100% gratis.
              </span>
            </p>
          </div>
        </section>

        {/* Pricing Component */}
        <Pricing />

        {/* Trust Section - Compact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Sin Costos Ocultos</h3>
                <p className="text-sm text-muted-foreground">
                  No hay trucos ni tarifas escondidas
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Todos los Bancos</h3>
                <p className="text-sm text-muted-foreground">
                  BROU, Itaú, BBVA, Scotia, Santander y más
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-accent-cyan/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="font-semibold">Seguro y Privado</h3>
                <p className="text-sm text-muted-foreground">
                  Tus datos nunca salen de tu control
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Like homepage */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Comenzá a controlar tus finanzas hoy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sin tarjeta de crédito. Sin compromisos. Comenzá en 30 segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

      <Footer />
    </>
  );
}
