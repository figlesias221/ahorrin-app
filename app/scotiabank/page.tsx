import { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileUp, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Scotiabank Uruguay - Importá y Analizá tus Extractos Automáticamente',
  description:
    'Importá tus extractos bancarios de Scotiabank Uruguay a Ahorrin. Categorización automática, análisis de gastos y reportes en tiempo real. Compatible con Scotia Online.',
  keywords: [
    'scotiabank uruguay',
    'scotia uruguay',
    'extracto scotiabank',
    'scotia online uruguay',
    'scotiabank comisiones',
    'analizar extracto scotia',
    'importar extracto scotiabank',
  ],
  alternates: {
    canonical: 'https://www.ahorrin.app/scotiabank',
  },
  openGraph: {
    title: 'Scotiabank Uruguay + Ahorrin - Control Total de tus Finanzas',
    description:
      'Importá extractos de Scotiabank Uruguay a Ahorrin. Categorización inteligente, gráficas automáticas y reportes detallados.',
    url: 'https://www.ahorrin.app/scotiabank',
  },
};

export default function ScotiabankPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Scotia Red Theme */}
      <section className="bg-gradient-to-br from-[#E00E2D] via-[#C00024] to-[#A0001E] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">Compatible con Scotiabank Uruguay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Controlá tus Gastos de Scotiabank sin Esfuerzo
              </h1>

              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Importá extractos de Scotia Online y obtén análisis completo con categorización automática por IA. Privado y sin conectar tu cuenta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#E00E2D] rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
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
                  <span>100% Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Sin registro bancario</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Máxima privacidad</span>
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
                      <div className="font-bold text-lg">1. Descargá desde Scotia Online</div>
                      <div className="text-white/70 text-sm">PDF o Excel</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">2. Importá a Ahorrin</div>
                      <div className="text-white/70 text-sm">Procesamiento inteligente</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">3. Analizá tus finanzas</div>
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
              Cómo Funciona con Scotiabank
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              3 pasos para pasar de extracto a análisis completo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-[#E00E2D] rounded-2xl flex items-center justify-center mb-6">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Descargá desde Scotia Online</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">En Scotia Online</strong>:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a Scotia Online</li>
                  <li>Seleccioná "Mis Cuentas" → "Movimientos"</li>
                  <li>Filtrá por fecha (mes, trimestre, etc.)</li>
                  <li>Exportá a Excel o PDF</li>
                </ol>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Procesamiento Inteligente</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">Ahorrin hace todo</strong>:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Detecta formato Scotiabank automáticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Categoriza con IA en segundos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Normaliza nombres de comercios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Lista en tu dashboard inmediatamente</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Visualizá y Decidí</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">Insights instantáneos</strong>:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Gráficas interactivas por categoría</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Comparativas mes a mes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Detecta gastos hormiga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Reportes para descargar</span>
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
              Ventajas Exclusivas para Clientes Scotia
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Optimizado para extractos de Scotiabank Uruguay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Formato Scotia Nativo</h3>
              <p className="text-muted-foreground">
                Reconocemos automáticamente los formatos de exportación de Scotia Online. Excel y PDF soportados.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sin Acceso Bancario</h3>
              <p className="text-muted-foreground">
                No pedimos credenciales de Scotia Online. Solo subís el extracto descargado. Tu seguridad primero.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Detección de Comisiones</h3>
              <p className="text-muted-foreground">
                Identifica automáticamente comisiones de Scotiabank. Sabé exactamente cuánto te cobran mensualmente.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Cuenta Scotia</h3>
              <p className="text-muted-foreground">
                ¿Tenés cuenta corriente y caja de ahorro? Importá ambas y analízalas por separado o en conjunto.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FileUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Histórico Completo</h3>
              <p className="text-muted-foreground">
                Importá extractos de años anteriores. Ideal para ver tendencias y preparar declaraciones de IRPF.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exportación Flexible</h3>
              <p className="text-muted-foreground">
                Exportá tus datos categorizados a Excel. Compatibilidad total con contadores y planillas personales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Preguntas Frecuentes - Scotiabank + Ahorrin
          </h2>

          <div className="space-y-6">
            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Cómo descargo mi extracto de Scotiabank?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                En Scotia Online: 1) Ingresá con tu usuario, 2) Andá a "Mis Cuentas" → "Movimientos", 3) Seleccioná el período, 4) Clickeá "Exportar" y elegí Excel o PDF. El archivo se descarga automáticamente.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Ahorrin se conecta a mi cuenta de Scotiabank?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                NO. Ahorrin nunca se conecta a tu cuenta bancaria ni requiere tus credenciales de Scotia Online. Vos descargás el extracto manualmente y lo subís a Ahorrin. Es 100% privado y seguro.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Puedo analizar comisiones de Scotiabank?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Ahorrin detecta automáticamente las comisiones que te cobra Scotiabank (mantenimiento de cuenta, emisión de tarjeta, etc.) y las categoriza. Podés ver cuánto pagás mensualmente en comisiones.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Funciona con tarjetas de crédito Scotia?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Sí! Podés importar el resumen de tu tarjeta Scotiabank Visa o Mastercard desde Scotia Online. Ahorrin categoriza automáticamente todos los gastos de tu tarjeta.
              </p>
            </details>

            <details className="bg-card border border-border rounded-xl p-6 group">
              <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                ¿Qué otros bancos soporta Ahorrin?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Ahorrin funciona con todos los bancos principales de Uruguay: BBVA, Itaú, BROU, Santander y Heritage. Podés tener cuentas de múltiples bancos en Ahorrin.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#E00E2D] to-[#A0001E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Tomá Control de tus Finanzas de Scotiabank
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Gratis, privado y sin complicaciones. Empezá en 2 minutos.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#E00E2D] rounded-lg font-bold text-xl hover:bg-white/90 transition-colors shadow-xl"
          >
            Crear Cuenta Gratis
          </Link>

          <p className="text-sm text-white/70 mt-6">
            Sin tarjeta • Sin conexión bancaria • 100% seguro
          </p>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Scotiabank Uruguay - Control de Gastos con Ahorrin',
            description:
              'Importá extractos de Scotiabank Uruguay a Ahorrin para análisis automático de gastos y finanzas personales.',
            url: 'https://www.ahorrin.app/scotiabank',
          }),
        }}
      />
    </div>
  );
}
