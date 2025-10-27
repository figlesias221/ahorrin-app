import Link from 'next/link';
import type { Metadata } from 'next';
import { Calculator, FileSpreadsheet, TrendingUp, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Herramientas Financieras Gratuitas Uruguay | Ahorrin',
  description: 'Herramientas gratuitas para gestionar tus finanzas en Uruguay: calculadora de presupuesto, conversor de extractos bancarios y calculadora de inflación real. Sin registro.',
  keywords: [
    'herramientas financieras uruguay',
    'calculadora finanzas uruguay',
    'gestión finanzas gratis',
    'herramientas presupuesto uruguay',
    'calculadora presupuesto gratis',
    'conversor extractos bancarios',
    'inflacion real uruguay'
  ],
  openGraph: {
    title: 'Herramientas Financieras Gratuitas Uruguay | Ahorrin',
    description: 'Accedé a herramientas gratuitas para gestionar tus finanzas: calculadora de presupuesto, conversor de extractos y más.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas',
  },
};

const tools = [
  {
    title: 'Calculadora de Presupuesto',
    description: 'Calculá tu presupuesto mensual en Uruguay. Ingresá tus ingresos y gastos, y obtené recomendaciones personalizadas para controlar tus finanzas.',
    icon: Calculator,
    href: '/herramientas/calculadora-presupuesto',
    color: 'from-blue-500 to-cyan-500',
    keywords: ['Presupuesto mensual', 'Análisis de gastos', 'Recomendaciones'],
  },
  {
    title: 'Conversor de Extractos Bancarios',
    description: 'Convertí extractos bancarios de cualquier banco uruguayo (Itaú, BBVA, Scotiabank, BROU, Santander, Heritage) a formato Excel estandarizado.',
    icon: FileSpreadsheet,
    href: '/herramientas/conversor-extractos',
    color: 'from-green-500 to-emerald-500',
    keywords: ['CSV a Excel', 'Todos los bancos', 'Procesamiento privado'],
  },
  {
    title: 'Calculadora de Inflación Real',
    description: 'El BCU dice 5%, pero ¿cuánto subieron TUS gastos realmente? Descubrí tu inflación real personalizada según tus categorías de consumo.',
    icon: TrendingUp,
    href: '/herramientas/inflacion-real',
    color: 'from-orange-500 to-red-500',
    keywords: ['Inflación personalizada', 'Comparación IPC', 'Por categorías'],
  },
];

export default function HerramientasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Herramientas Financieras Gratuitas Uruguay',
    description: 'Colección de herramientas gratuitas para gestionar finanzas personales en Uruguay',
    url: 'https://www.ahorrin.app/herramientas',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebApplication',
          name: tool.title,
          description: tool.description,
          url: `https://www.ahorrin.app${tool.href}`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'UYU',
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Herramientas Financieras
              <span className="block text-blue-600 dark:text-blue-400 mt-2">
                100% Gratuitas
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Accedé a herramientas profesionales para gestionar tus finanzas en Uruguay.
              Sin registro, sin límites, sin letra chica.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative bg-card border border-border rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Keywords/Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                    Usar herramienta
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Decorative corner gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 rounded-xl blur-2xl transition-opacity -z-10`} />
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-1 max-w-2xl mx-auto">
              <div className="bg-card rounded-xl p-8 sm:p-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  ¿Querés más control sobre tus finanzas?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Creá una cuenta gratuita en Ahorrin y accedé a categorización automática con IA,
                  importación de extractos bancarios, gráficas en tiempo real y mucho más.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
