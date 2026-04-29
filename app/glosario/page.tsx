import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Search, ArrowUpRight } from 'lucide-react';
import { getAllTerms, hasStandalonePage, resolveRelatedHref } from '@/lib/glossary';

export const metadata: Metadata = {
  title: 'Glosario Financiero Uruguay 2026 | Definiciones de Términos',
  description:
    'Diccionario de términos financieros uruguayos. IRPF, BPS, FONASA, UI, BCU, IRAE, IBKR, ETF, CFT y más. Definiciones claras con ejemplos.',
  alternates: { canonical: 'https://www.ahorrin.app/glosario' },
  keywords: [
    'glosario financiero uruguay',
    'diccionario financiero',
    'que es irpf',
    'que es ui uruguay',
    'que es fonasa',
    'términos financieros uruguay',
  ],
  openGraph: {
    title: 'Glosario Financiero Uruguay | Ahorrin',
    description:
      'Definiciones claras de IRPF, BPS, FONASA, UI, BCU, ETF y todos los términos que necesitás conocer.',
    url: 'https://www.ahorrin.app/glosario',
    type: 'website',
  },
};

export default function GlosarioPage() {
  const terms = getAllTerms();
  const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term, 'es'));
  const letters = Array.from(new Set(sortedTerms.map((t) => t.term[0].toUpperCase()))).sort();

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glosario Financiero Uruguay',
    description: 'Diccionario de términos financieros y tributarios uruguayos',
    hasDefinedTerm: sortedTerms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      alternateName: t.abbr,
      description: t.definition,
      url: hasStandalonePage(t.slug)
        ? `https://www.ahorrin.app/glosario/${t.slug}`
        : `https://www.ahorrin.app/glosario#${t.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.ahorrin.app' },
      { '@type': 'ListItem', position: 2, name: 'Glosario', item: 'https://www.ahorrin.app/glosario' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3" />
              </li>
              <li className="text-foreground font-medium">Glosario</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Glosario Financiero Uruguay</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Definiciones claras de los términos que aparecen en tus recibos de
            sueldo, contratos bancarios e inversiones. Sin tecnicismos
            innecesarios, con ejemplos concretos para Uruguay.
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          <div className="space-y-12">
            {letters.map((letter) => (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-border">{letter}</h2>
                <dl className="space-y-8">
                  {sortedTerms
                    .filter((t) => t.term[0].toUpperCase() === letter)
                    .map((t) => {
                      const standalone = hasStandalonePage(t.slug);
                      return (
                        <div key={t.slug} id={t.slug} className="scroll-mt-24">
                          <dt className="mb-2 flex flex-wrap items-baseline gap-2">
                            {standalone ? (
                              <Link
                                href={`/glosario/${t.slug}`}
                                className="text-2xl font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                              >
                                {t.term}
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ) : (
                              <span className="text-2xl font-bold">{t.term}</span>
                            )}
                            {t.abbr && (
                              <span className="text-base text-muted-foreground">({t.abbr})</span>
                            )}
                          </dt>
                          <dd className="text-muted-foreground leading-relaxed mb-3">
                            {t.definition}
                          </dd>
                          {t.example && (
                            <dd className="bg-muted/40 border-l-4 border-primary/40 pl-4 py-2 text-sm text-muted-foreground rounded-r-md mb-3">
                              <strong className="text-foreground">Ejemplo:</strong> {t.example}
                            </dd>
                          )}
                          {t.related && t.related.length > 0 && (
                            <dd className="flex flex-wrap gap-2 text-sm">
                              <span className="text-muted-foreground">Ver también:</span>
                              {t.related.map((r) => (
                                <Link
                                  key={r.href}
                                  href={resolveRelatedHref(r.href)}
                                  className="text-primary hover:underline"
                                >
                                  {r.label}
                                </Link>
                              ))}
                            </dd>
                          )}
                          {standalone && (
                            <dd className="mt-3">
                              <Link
                                href={`/glosario/${t.slug}`}
                                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                              >
                                Leer la guía completa de {t.term}
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </dd>
                          )}
                        </div>
                      );
                    })}
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              ¿Falta un término?
            </h2>
            <p className="text-muted-foreground">
              Si encontrás un concepto financiero o tributario uruguayo que no está acá,
              escribinos a{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>{' '}
              y lo agregamos. El glosario crece con el aporte de la comunidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
