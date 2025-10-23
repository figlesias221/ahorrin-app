import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { getAllPostsMetadata } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog - Finanzas Personales y Control de Gastos',
  description: 'Guías, tutoriales y consejos sobre finanzas personales, control de gastos, bancos en Uruguay y gestión financiera inteligente.',
  alternates: {
    canonical: 'https://www.gasty.app/blog',
  },
};

export default function BlogPage() {
  const blogPosts = getAllPostsMetadata();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Blog de Finanzas Personales
            </h1>
            <p className="text-lg sm:text-xl text-blue-50">
              Guías prácticas, consejos expertos y análisis sobre gestión financiera en Uruguay
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b border-border bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Todos', 'Educación Financiera', 'Bancos Uruguay', 'Tecnología', 'Consejos'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === 'Todos'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
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
                className="group bg-card border border-blue-100 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300"
              >
                {/* Featured Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-cyan-500/40 group-hover:from-blue-500/50 group-hover:to-cyan-400/50 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
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

                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 hover:text-blue-700 transition-all"
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Recibe consejos financieros en tu inbox</h2>
          <p className="text-lg text-blue-50 mb-8">
            Suscribite para recibir guías exclusivas y novedades sobre gestión financiera
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 bg-white/90 backdrop-blur-sm focus:bg-white focus:border-white transition-all"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
