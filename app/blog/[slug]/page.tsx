import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

// This will be replaced with actual markdown/MDX content loading
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  keywords: string[];
}

// Mock data - will be replaced with actual content loading
const blogPosts: Record<string, BlogPost> = {
  'organizar-finanzas-personales-uruguay-2025': {
    slug: 'organizar-finanzas-personales-uruguay-2025',
    title: 'Cómo Organizar tus Finanzas Personales en Uruguay [2025]',
    excerpt:
      'Guía completa paso a paso para tomar control de tus finanzas personales en Uruguay.',
    content: `
      <p>Próximamente: contenido completo del artículo.</p>
      <p>Este artículo cubrirá:</p>
      <ul>
        <li>Cómo crear un presupuesto personal efectivo</li>
        <li>Métodos de categorización de gastos</li>
        <li>Herramientas y apps recomendadas</li>
        <li>Consejos específicos para Uruguay</li>
      </ul>
    `,
    category: 'Educación Financiera',
    date: '2025-10-21',
    readTime: '12 min',
    author: {
      name: 'Equipo Gasty',
      avatar: '/logo.svg',
    },
    keywords: [
      'finanzas personales uruguay',
      'como organizar finanzas',
      'presupuesto personal',
      'control de gastos',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://www.gasty.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      url: `https://www.gasty.app/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/5 to-background py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          <div className="mb-6">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('es-UY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-primary/5 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comenzá a usar Gasty gratis y organiza tus gastos en minutos
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Schema.org Article Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: {
              '@type': 'Organization',
              name: post.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gasty',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.gasty.app/logo.png',
              },
            },
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.gasty.app/blog/${post.slug}`,
            },
            keywords: post.keywords.join(', '),
          }),
        }}
      />
    </div>
  );
}
