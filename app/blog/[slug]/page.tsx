import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug, getRelatedPosts, categoryToSlug } from '@/lib/mdx';
import { ComparisonTable, CalloutBox } from '@/components/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { BlogAdTop, BlogAdBottom } from '@/components/ads/blog-ads';

const mdxComponents = {
  ComparisonTable,
  CalloutBox,
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground/90" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => <a className="text-primary hover:text-primary/80 hover:underline transition-colors" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-primary/5 py-2 rounded-r-lg" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-border shadow-sm">
      <table className="min-w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border-b border-border bg-muted px-4 py-3 text-left font-semibold text-foreground" {...props} />
  ),
  td: (props: any) => <td className="border-b border-border/50 px-4 py-3 hover:bg-muted/30 transition-colors" {...props} />,
  code: (props: any) => (
    <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-sm font-mono border border-border" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4 border border-border" {...props} />
  ),
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postData = getPostBySlug(slug);

  if (!postData) {
    return { title: 'Post no encontrado' };
  }

  const { metadata } = postData;

  return {
    title: metadata.title,
    description: metadata.excerpt,
    keywords: metadata.keywords,
    authors: [{ name: metadata.author.name }],
    alternates: {
      canonical: `https://www.ahorrin.app/blog/${slug}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      type: 'article',
      publishedTime: metadata.date,
      authors: [metadata.author.name],
      url: `https://www.ahorrin.app/blog/${slug}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.excerpt,
      images: ['/og-image.png'],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = getPostBySlug(slug);

  if (!postData) {
    notFound();
  }

  const { metadata, content } = postData;
  const related = getRelatedPosts(slug, 3);
  const postUrl = `https://www.ahorrin.app/blog/${slug}`;

  // Use modification date that signals freshness to crawlers (rolling 30 days)
  const postDate = new Date(metadata.date);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateModified = (postDate > thirtyDaysAgo ? postDate : thirtyDaysAgo).toISOString();

  return (
    <div className="min-h-screen bg-background">
      <header className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white font-medium truncate max-w-xs">
                {metadata.title}
              </li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-white font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          <div className="mb-8">
            <Link
              href={`/blog/categoria/${categoryToSlug(metadata.category)}`}
              className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-sm font-semibold rounded-full hover:bg-white transition-colors"
            >
              {metadata.category}
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-white leading-tight">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-primary-foreground/80 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{metadata.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={metadata.date}>
                {new Date(metadata.date).toLocaleDateString('es-UY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{metadata.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </header>

      <BlogAdTop />

      <article className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'wrap',
                        properties: { className: ['anchor'] },
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </div>
      </article>

      <BlogAdBottom />

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-border bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Seguí leyendo
            </h2>
            <p className="text-muted-foreground mb-8">
              Otros artículos relacionados con {metadata.category.toLowerCase()}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-card border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} de lectura
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Ver todos los artículos del blog
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Comenzá a usar Ahorrin gratis y organiza tus gastos en minutos
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 shadow-lg transition-all"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: metadata.title,
            description: metadata.excerpt,
            image: 'https://www.ahorrin.app/og-image.png',
            author: {
              '@type': 'Organization',
              name: metadata.author.name,
              url: 'https://www.ahorrin.app/sobre-nosotros',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Ahorrin',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.ahorrin.app/logo.svg',
              },
            },
            datePublished: new Date(metadata.date).toISOString(),
            dateModified,
            mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
            articleSection: metadata.category,
            keywords: metadata.keywords.join(', '),
            inLanguage: 'es-UY',
          }),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: 'https://www.ahorrin.app',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://www.ahorrin.app/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: metadata.title,
                item: postUrl,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
