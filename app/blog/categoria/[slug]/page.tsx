import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react';
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategorySlug,
} from '@/lib/mdx';
import { getCategoryProfile } from '@/lib/blog-categories';

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Categoría no encontrada' };

  const profile = getCategoryProfile(slug);
  const description =
    profile?.description ??
    `Todos los artículos sobre ${category.name.toLowerCase()} en Uruguay. ${category.count} guías y análisis prácticos sobre finanzas personales.`;

  return {
    title: `${category.name} | Blog Ahorrin`,
    description,
    alternates: {
      canonical: `https://www.ahorrin.app/blog/categoria/${slug}`,
    },
    openGraph: {
      title: `${category.name} - Blog Ahorrin`,
      description,
      url: `https://www.ahorrin.app/blog/categoria/${slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategorySlug(slug);
  const otherCategories = getAllCategories().filter((c) => c.slug !== slug);
  const profile = getCategoryProfile(slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.ahorrin.app' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.ahorrin.app/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://www.ahorrin.app/blog/categoria/${slug}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Artículos sobre ${category.name}`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.ahorrin.app/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-white">Inicio</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-white font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Todos los artículos
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'} sobre{' '}
            {category.name.toLowerCase()} en Uruguay. Guías prácticas con datos
            concretos y referencias oficiales.
          </p>
        </div>
      </section>

      {profile && (
        <section className="py-10 sm:py-12 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {profile.intro}
            </p>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/80 via-primary to-primary-700 relative">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('es-UY', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Otras categorías</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/categoria/${c.slug}`}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
