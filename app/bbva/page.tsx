import { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileUp, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BBVA Uruguay - Importá y Categorizá tus Extractos Automáticamente',
  description:
    'Importá tus extractos bancarios de BBVA Uruguay a Ahorrin. Categorización automática, análisis de gastos en tiempo real. Compatible con extractos PDF y Excel del BBVA.',
  keywords: [
    'extracto bancario bbva uruguay',
    'bbva uruguay',
    'como descargar extracto bbva',
    'analizar extracto bbva',
    'importar extracto bbva',
    'categorizar gastos bbva',
    'bbva home banking',
  ],
  alternates: {
    canonical: 'https://www.ahorrin.app/bbva',
  },
  openGraph: {
    title: 'BBVA Uruguay + Ahorrin - Control de Gastos Automático',
    description:
      'Importá tus extractos de BBVA Uruguay a Ahorrin en segundos. Categorización inteligente, gráficas y reportes automáticos.',
    url: 'https://www.ahorrin.app/bbva',
  },
};

export default function BBVAPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#004481] via-[#0066b3] to-[#00adee] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">Compatible con BBVA Uruguay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Importá tus Extractos de BBVA en Segundos
              </h1>

              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Sube tu extracto de BBVA Uruguay y obtén categorización automática, gráficas y
                análisis inteligente de tus gastos. Sin conectar tu cuenta bancaria.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#004481] rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
                >
                  Empezar Gratis
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border-2 border-white/30"
                >
                  Ver Cómo Funciona
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Sin conexión bancaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>100% seguro</span>
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
                      <div className="font-bold text-lg">1. Subí tu extracto</div>
                      <div className="text-white/70 text-sm">PDF o Excel de BBVA</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">2. Categorización IA</div>
                      <div className="text-white/70 text-sm">Automática en segundos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">3. Visualizá tus gastos</div>
                      <div className="text-white/70 text-sm">Gráficas y reportes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works with BBVA */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Cómo Usar Ahorrin con BBVA Uruguay
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              En 3 pasos simples, pasás de extracto bancario a análisis completo de tus finanzas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-[#004481] rounded-2xl flex items-center justify-center mb-6">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Descargá tu Extracto de BBVA</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">BBVA Net Cash</strong>:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a tu Home Banking de BBVA</li>
                  <li>Seleccioná "Consultas" → "Extractos"</li>
                  <li>Elegí el período (último mes, trimestre, etc.)</li>
                  <li>Descargá en formato PDF o Excel</li>
                </ol>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Importá a Ahorrin</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Procesamiento Inteligente</strong>:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sube tu archivo (arrastrá y soltá)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Categorización automática con IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Normalización de nombres de comercios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Proceso completo en segundos</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Analizá tus Finanzas</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Dashboard Completo</strong>:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Gráficas por categoría</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Tendencias mes a mes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exportá a Excel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Reportes personalizados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Specific to BBVA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Por Qué Ahorrin es Perfecto para Clientes BBVA
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Diseñado específicamente para extractos bancarios uruguayos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reconocimiento Automático</h3>
              <p className="text-muted-foreground">
                Detectamos automáticamente el formato de BBVA Uruguay (PDF y Excel). Solo subís el
                archivo y listo.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Privado</h3>
              <p className="text-muted-foreground">
                No necesitás conectar tu cuenta de BBVA. Subís solo el extracto que querés
                analizar. Tus credenciales nunca las tocamos.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">IA que Entiende Uruguay</h3>
              <p className="text-muted-foreground">
                Nuestra IA conoce comercios uruguayos: DISCO, Ta-Ta, UTE, OSE, Antel, etc.
                Categorización precisa desde el día 1.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Moneda</h3>
              <p className="text-muted-foreground">
                Soporte completo para transacciones en UYU y USD. Ideal si tenés cuenta en dólares
                o hacés compras internacionales.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FileUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Importación Ilimitada</h3>
              <p className="text-muted-foreground">
                Importá todos los extractos que quieras. Sin límites de transacciones ni períodos.
                100% gratis.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exportación a Excel</h3>
              <p className="text-muted-foreground">
                Exportá tus datos categorizados a Excel. Perfecto si tu contador usa BBVA y
                necesitás compartir información.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Preguntas Frecuentes - BBVA + Ahorrin
          </h2>

          <div className="space-y-6">
            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Qué formatos de extracto de BBVA acepta Ahorrin?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Ahorrin acepta extractos de BBVA Uruguay en formato PDF y Excel (.xlsx). Ambos
                formatos son descargables desde el Home Banking de BBVA Net Cash.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Es seguro subir mi extracto de BBVA a Ahorrin?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí, es 100% seguro. Ahorrin NO requiere que conectes tu cuenta bancaria ni
                proporciones tus credenciales de BBVA. Solo subís el extracto que ya descargaste.
                Todos los datos se procesan con encriptación de nivel bancario (AES-256).
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Puedo importar extractos históricos de BBVA?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Podés subir extractos de cualquier período. Te recomendamos empezar con los
                últimos 3-6 meses para obtener un análisis completo de tus patrones de gasto.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Cómo funciona la categorización automática?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Nuestra IA analiza cada transacción de tu extracto BBVA y la categoriza
                automáticamente basándose en el nombre del comercio y el monto. Por ejemplo:
                "DISCO MONTEV" → Supermercado, "ANTEL" → Servicios. Podés crear reglas
                personalizadas para mayor precisión.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Ahorrin funciona con otras cuentas además de BBVA?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Ahorrin es compatible con todos los principales bancos uruguayos: BBVA,
                Scotiabank, Itaú, BROU, Santander y Heritage. Podés importar extractos de múltiples
                bancos en la misma cuenta.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#004481] to-[#00adee] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Empezá a Controlar tus Gastos de BBVA Hoy
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a miles de usuarios que ya organizaron sus finanzas con Ahorrin
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#004481] rounded-lg font-bold text-xl hover:bg-white/90 transition-colors shadow-xl"
          >
            Crear Cuenta Gratis
          </Link>

          <p className="text-sm text-white/70 mt-6">
            Gratis • Sin tarjeta de crédito • Sin conexión bancaria
          </p>
        </div>
      </section>

      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'BBVA Uruguay - Importar Extractos a Ahorrin',
            description:
              'Importá tus extractos bancarios de BBVA Uruguay a Ahorrin para categorización automática y análisis de gastos.',
            url: 'https://www.ahorrin.app/bbva',
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Ahorrin para BBVA Uruguay',
              applicationCategory: 'FinanceApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'UYU',
              },
              featureList: [
                'Importación de extractos BBVA PDF y Excel',
                'Categorización automática con IA',
                'Dashboard en tiempo real',
                'Multi-moneda (UYU, USD)',
                'Exportación a Excel',
              ],
            },
          }),
        }}
      />
    </div>
  );
}
