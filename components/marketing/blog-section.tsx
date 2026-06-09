import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import type { BlogPostMetadata } from '@/lib/mdx';

interface BlogSectionProps {
  posts: BlogPostMetadata[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Blog de Finanzas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Guías de Finanzas Personales para Uruguay
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Más de 50 guías prácticas sobre impuestos, bancos, inversiones y ahorro — escritas para Uruguay, con fuentes oficiales
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-12">
          {/* Featured Post */}
          <Link href={`/blog/${featured.slug}`} className="group block">
            <article className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 sm:h-64 bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-900 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                    {featured.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{featured.readTime} de lectura</span>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Leer artículo completo
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </article>
          </Link>

          {/* Recent Posts */}
          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                <article className="h-full bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-2 text-sm">
                    <span className="text-primary font-semibold">{post.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                </article>
              </Link>
            ))}
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Ver todas las guías
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
