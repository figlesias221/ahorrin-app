import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { getAllPostsMetadata } from '@/lib/mdx';
import { BlogCategoryFilter } from '@/components/marketing/blog-category-filter';

export const metadata: Metadata = {
  title: 'Blog - Finanzas Personales y Control de Gastos en Uruguay',
  description:
    'Guías, tutoriales y consejos sobre finanzas personales, impuestos, inversiones, bancos en Uruguay y gestión financiera inteligente. Contenido educativo gratuito.',
  alternates: {
    canonical: 'https://www.ahorrin.app/blog',
  },
  openGraph: {
    title: 'Blog de Finanzas Personales | Ahorrin',
    description:
      'Guías prácticas sobre IRPF, FONASA, inversiones, bancos y finanzas personales en Uruguay.',
    url: 'https://www.ahorrin.app/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const blogPosts = getAllPostsMetadata();

  // Real categories derived from posts, sorted by frequency
  const categoryCounts = blogPosts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog de Ahorrin',
    description:
      'Guías y artículos sobre finanzas personales, impuestos e inversiones en Uruguay',
    url: 'https://www.ahorrin.app/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Ahorrin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ahorrin.app/logo.svg',
      },
    },
    blogPost: blogPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://www.ahorrin.app/blog/${post.slug}`,
      datePublished: new Date(post.date).toISOString(),
      author: { '@type': 'Organization', name: post.author.name },
    })),
  };

  const breadcrumbJsonLd = {
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
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white font-medium">Blog</li>
            </ol>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Blog de Finanzas Personales
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80">
              Guías prácticas, análisis honestos y consejos sobre finanzas
              personales, impuestos, inversiones y bancos en Uruguay.
            </p>
            <p className="text-base text-primary-foreground/70 mt-4">
              {blogPosts.length} artículos disponibles · Actualizados regularmente
            </p>
          </div>
        </div>
      </section>

      <BlogCategoryFilter posts={blogPosts} categories={categories} />
    </div>
  );
}
