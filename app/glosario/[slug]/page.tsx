import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ShieldCheck, AlertTriangle, Calculator, BookOpen, ExternalLink } from 'lucide-react';
import {
  getStandalonePageSlugs,
  getTermBySlug,
  getAllTerms,
  resolveRelatedHref,
} from '@/lib/glossary';
import { getPostMetadata } from '@/lib/mdx';

export async function generateStaticParams() {
  return getStandalonePageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term || !term.intro) return { title: 'Término no encontrado' };

  const title = term.abbr
    ? `${term.term} (${term.abbr}) | Glosario Financiero Uruguay`
    : `${term.term} | Glosario Financiero Uruguay`;

  return {
    title,
    description: term.metaDescription ?? term.definition,
    keywords: term.keywords,
    alternates: { canonical: `https://www.ahorrin.app/glosario/${slug}` },
    openGraph: {
      title,
      description: term.metaDescription ?? term.definition,
      url: `https://www.ahorrin.app/glosario/${slug}`,
      type: 'article',
    },
  };
}

function paragraphs(text: string) {
  return text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term || !term.intro) notFound();

  const url = `https://www.ahorrin.app/glosario/${slug}`;
  const allTerms = getAllTerms();
  const relatedTerms = (term.related ?? [])
    .filter((r) => !r.href.startsWith('/'))
    .map((r) => allTerms.find((t) => t.slug === r.href))
    .filter((t): t is NonNullable<typeof t> => !!t);

  const relatedPosts = (term.relatedPostSlugs ?? [])
    .map((s) => getPostMetadata(s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const reviewedDisplay = term.lastReviewed
    ? new Date(term.lastReviewed).toLocaleDateString('es-UY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    alternateName: term.abbr,
    description: term.definition,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Glosario Financiero Uruguay',
      url: 'https://www.ahorrin.app/glosario',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.ahorrin.app' },
      { '@type': 'ListItem', position: 2, name: 'Glosario', item: 'https://www.ahorrin.app/glosario' },
      { '@type': 'ListItem', position: 3, name: term.term, item: url },
    ],
  };

  const faqJsonLd =
    term.faq && term.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: term.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <section className="bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/glosario"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al glosario
          </Link>

          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3" />
              </li>
              <li>
                <Link href="/glosario" className="hover:text-foreground">
                  Glosario
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3" />
              </li>
              <li className="text-foreground font-medium">{term.term}</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{term.term}</h1>
          {term.abbr && (
            <p className="text-lg text-muted-foreground mb-6">{term.abbr}</p>
          )}

          <p className="text-xl text-foreground/90 leading-relaxed mb-4">{term.definition}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/metodologia"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-3 py-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Cómo verificamos esta información
            </Link>
            {reviewedDisplay && (
              <span className="inline-flex items-center text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
                Última revisión: {reviewedDisplay}
              </span>
            )}
          </div>

          <article className="prose prose-lg max-w-none">
            {paragraphs(term.intro!).map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}

            {term.howCalculated && (
              <section className="my-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-primary" />
                  Cómo se calcula
                </h2>
                {paragraphs(term.howCalculated).map((p, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-foreground/90 whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </section>
            )}

            {term.commonMistakes && term.commonMistakes.length > 0 && (
              <section className="my-10 not-prose">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  Errores comunes
                </h2>
                <ul className="space-y-3">
                  {term.commonMistakes.map((m, i) => (
                    <li
                      key={i}
                      className="flex gap-3 border border-border rounded-lg p-4 bg-card"
                    >
                      <span className="shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-2.5" />
                      <span className="text-foreground/90 leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {term.faq && term.faq.length > 0 && (
              <section className="my-10 not-prose">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Preguntas frecuentes</h2>
                <div className="space-y-4">
                  {term.faq.map((f, i) => (
                    <details
                      key={i}
                      className="group border border-border rounded-lg p-5 bg-card hover:border-primary/30 transition-colors"
                    >
                      <summary className="font-semibold cursor-pointer flex items-start justify-between gap-4">
                        <span>{f.q}</span>
                        <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-3 text-foreground/85 leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {term.relatedTool && (
            <section className="my-12 not-prose bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                Herramienta relacionada
              </p>
              <h3 className="text-xl font-bold mb-2">{term.relatedTool.label}</h3>
              <p className="text-muted-foreground mb-4">
                Calculá tu situación específica usando los parámetros uruguayos actualizados.
              </p>
              <Link
                href={term.relatedTool.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Ir a la calculadora
                <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          )}

          {relatedPosts.length > 0 && (
            <section className="my-12 not-prose">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Artículos relacionados
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block border border-border rounded-lg p-4 hover:border-primary/40 hover:bg-muted/30 transition-all"
                  >
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold mt-1 mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedTerms.length > 0 && (
            <section className="my-12 not-prose">
              <h2 className="text-2xl font-bold mb-4">Ver también</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((t) => (
                  <Link
                    key={t.slug}
                    href={resolveRelatedHref(t.slug)}
                    className="px-4 py-2 bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    {t.term}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="my-12 bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              ¿Encontraste un error o tenés una pregunta sobre este término?{' '}
              <a
                href="mailto:hola@ahorrin.app"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Escribinos a hola@ahorrin.app
                <ExternalLink className="w-3 h-3" />
              </a>
              . Lo revisamos y te respondemos.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
