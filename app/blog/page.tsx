import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - Finanzas Personales y Control de Gastos',
  description: 'Guías, tutoriales y consejos sobre finanzas personales, control de gastos, bancos en Uruguay y gestión financiera inteligente.',
  alternates: {
    canonical: 'https://www.gasty.app/blog',
  },
};

// Blog posts data (will be moved to CMS/markdown later)
const blogPosts = [
  {
    slug: 'organizar-finanzas-personales-uruguay-2025',
    title: 'Cómo Organizar tus Finanzas Personales en Uruguay [2025]',
    excerpt: 'Guía completa paso a paso para tomar control de tus finanzas personales en Uruguay. Aprende a crear un presupuesto, categorizar gastos y alcanzar tus metas financieras.',
    category: 'Educación Financiera',
    date: '2025-10-21',
    readTime: '12 min',
    image: '/blog/finanzas-uruguay.jpg',
    author: {
      name: 'Equipo Gasty',
      avatar: '/logo.svg',
    },
  },
  // More posts will be added here
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Blog de Finanzas Personales
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Guías prácticas, consejos expertos y análisis sobre gestión financiera en Uruguay
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Todos', 'Educación Financiera', 'Bancos Uruguay', 'Tecnología', 'Consejos'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === 'Todos'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Featured Image */}
                <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-cyan/20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
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

                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Próximamente: guías y artículos sobre finanzas personales en Uruguay
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Recibe consejos financieros en tu inbox</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Suscribite para recibir guías exclusivas y novedades sobre gestión financiera
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
