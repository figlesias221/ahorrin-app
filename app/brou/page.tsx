import { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileUp, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BROU Uruguay - Importar Extracto Bancario | Control de Gastos con IA | Ahorrin',
  description:
    'Importá extractos bancarios de BROU Uruguay (CSV/Excel) a Ahorrin. Categorización automática con IA, dashboard en tiempo real, gráficas y reportes completos. Compatible con e-BROU, tarjeta BROU y caja de ahorro. Gratis y sin acceso a tu cuenta.',
  keywords: [
    'brou uruguay',
    'banco republica oriental uruguay',
    'extracto brou',
    'e-brou',
    'brou extracto bancario',
    'importar extracto brou',
    'analizar extracto brou',
    'categorizar gastos brou',
    'control gastos brou',
    'finanzas brou',
    'tarjeta brou mastercard',
    'caja ahorro brou',
    'cuenta corriente brou',
    'como descargar extracto brou',
    'brou csv',
    'brou excel',
    'app control gastos brou',
    'control finanzas personales uruguay',
    'banco republica categorizar gastos',
  ],
  alternates: {
    canonical: 'https://www.ahorrin.app/brou',
  },
  openGraph: {
    title: 'BROU Uruguay + Ahorrin - Gestión Financiera Inteligente con IA',
    description:
      'Controlá tus gastos de BROU Uruguay con Ahorrin. Importá extractos CSV/Excel desde e-BROU, categorización automática con IA y análisis completo de finanzas. Gratis y sin acceso a tu cuenta.',
    url: 'https://www.ahorrin.app/brou',
    type: 'website',
    locale: 'es_UY',
    siteName: 'Ahorrin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BROU Uruguay + Ahorrin - Control de Gastos con IA',
    description: 'Importá extractos BROU y controlá tus gastos automáticamente. Gratis y sin acceso a tu cuenta.',
  },
};

export default function BROUPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero - BROU Orange Theme */}
      <section className="bg-gradient-to-br from-[#EC7000] via-[#D86400] to-[#C45800] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">Compatible con BROU Uruguay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Gestioná tus Finanzas de BROU con Inteligencia Artificial
              </h1>

              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Importá extractos desde e-BROU y obtén categorización automática, gráficas interactivas y control total de tus gastos. Privado y seguro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#EC7000] rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
                >
                  Comenzar Gratis
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border-2 border-white/30"
                >
                  Cómo Funciona
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Siempre gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Sin acceso a tu cuenta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Datos encriptados</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <FileUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">1. Descargá de e-BROU</div>
                      <div className="text-white/70 text-sm">Extracto CSV/Excel</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">2. Sube a Ahorrin</div>
                      <div className="text-white/70 text-sm">IA categoriza todo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">3. Controlá tus gastos</div>
                      <div className="text-white/70 text-sm">Dashboard completo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Ahorrin + BROU en 3 Pasos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              De extracto a insights en minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-[#EC7000] rounded-2xl flex items-center justify-center mb-6">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Descargá desde BROU</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">e-BROU BROU</strong>:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a www.brou.com.uy</li>
                  <li>Andá a "Extracto" o "Movimientos"</li>
                  <li>Seleccioná el período a analizar</li>
                  <li>Descargá en CSV/Excel</li>
                </ol>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. IA Hace el Trabajo</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">Procesamiento automático</strong>:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Reconoce formato BROU Uruguay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Categoriza cada transacción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Normaliza nombres de comercios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Todo en menos de 10 segundos</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Insights Accionables</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">Dashboard inteligente</strong>:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Gráficas por categoría y tiempo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Detecta gastos hormiga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Compara con meses anteriores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exporta reportes customizados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Por Qué Clientes BROU Eligen Ahorrin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Optimizado para el ecosistema BROU Uruguay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Formato BROU Nativo</h3>
              <p className="text-muted-foreground">
                Detectamos y procesamos extractos de BROU Uruguay automáticamente. CSV/Excel completamente soportados desde e-BROU.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacidad Total</h3>
              <p className="text-muted-foreground">
                No necesitás conectar tu cuenta BROU. No pedimos credenciales. Solo subís el extracto descargado. Encriptación bancaria (AES-256).
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">IA que Conoce Uruguay</h3>
              <p className="text-muted-foreground">
                Comercios uruguayos pre-entrenados: DISCO, Ta-Ta, UTE, Ancel, OSE y cientos más. Categorización precisa desde día 1.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Producto BROU</h3>
              <p className="text-muted-foreground">
                Cuenta corriente, caja de ahorro, tarjeta de crédito BROU. Importá todos tus productos y analizalos juntos o por separado.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FileUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sin Límites</h3>
              <p className="text-muted-foreground">
                Importá cuantos extractos quieras. 3 meses, 12 meses, 5 años. Sin límite de transacciones ni períodos. Gratis siempre.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compatibilidad Total</h3>
              <p className="text-muted-foreground">
                Usás otros bancos también? Ahorrin soporta BBVA, Scotia, BROU, Santander. Todas tus cuentas en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Preguntas Frecuentes - BROU + Ahorrin
          </h2>

          <div className="space-y-6">
            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Dónde descargo mi extracto de BROU?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Ingresá a www.brou.com.uy → e-BROU → Seleccioná tu cuenta → Andá a "Extracto" o "Movimientos" → Elegí el período → Descargá en CSV/Excel. El archivo se guarda en tu carpeta de Descargas.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Tengo que dar mis claves de BROU?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                NO. Jamás pedimos tus credenciales de BROU. Vos descargás el extracto manualmente desde e-BROU y lo subís a Ahorrin. No hay conexión directa con tu cuenta bancaria.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Funciona con tarjeta BROU Mastercard?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Podés importar el resumen de tu tarjeta de crédito BROU desde e-BROU. Ahorrin categoriza automáticamente todos tus gastos de tarjeta.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Qué hago si uso BROU + otro banco?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Perfecto! Ahorrin soporta múltiples bancos. Importá extractos de BROU, BBVA, Scotia, BROU, etc. en la misma cuenta. Podés ver todas tus finanzas unificadas o por banco separado.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Puedo compartir mis datos con mi contador?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Exportá tus transacciones categorizadas a Excel en cualquier momento. Ideal para IRPF, declaraciones o simplemente compartir con tu contador.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#EC7000] to-[#C45800] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Organizá tus Finanzas de BROU en Minutos
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Miles de clientes BROU ya usan Ahorrin. Súmate gratis.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#EC7000] rounded-lg font-bold text-xl hover:bg-white/90 transition-colors shadow-xl"
          >
            Empezar Ahora - Gratis
          </Link>

          <p className="text-sm text-white/70 mt-6">
            No se requiere tarjeta • Sin acceso a tu cuenta • 100% privado
          </p>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Ahorrin - Control de Gastos BROU',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Web, Windows, macOS, Linux',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'UYU',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '127',
                },
                description:
                  'Importá extractos bancarios de BROU Uruguay. Categorización automática con IA, dashboard y reportes.',
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: '¿Dónde descargo mi extracto de BROU?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Ingresá a www.brou.com.uy → e-BROU → Seleccioná tu cuenta → Andá a Extracto o Movimientos → Elegí el período → Descargá en CSV/Excel.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '¿Tengo que dar mis claves de BROU?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'NO. Jamás pedimos tus credenciales de BROU. Vos descargás el extracto manualmente y lo subís a Ahorrin. No hay conexión directa con tu cuenta bancaria.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '¿Funciona con tarjeta BROU Mastercard?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Sí! Podés importar el resumen de tu tarjeta de crédito BROU desde e-BROU. Ahorrin categoriza automáticamente todos tus gastos de tarjeta.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '¿Qué hago si uso BROU + otro banco?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Perfecto! Ahorrin soporta múltiples bancos. Importá extractos de BROU, BBVA, Scotia, Itaú, Santander en la misma cuenta. Podés ver todas tus finanzas unificadas.',
                    },
                  },
                ],
              },
              {
                '@type': 'Organization',
                name: 'Ahorrin',
                url: 'https://www.ahorrin.app',
                logo: 'https://www.ahorrin.app/logo.svg',
                sameAs: ['https://www.ahorrin.app'],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Support',
                  areaServed: 'UY',
                  availableLanguage: 'es',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
