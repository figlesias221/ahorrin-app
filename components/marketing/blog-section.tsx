import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';

const featuredPosts = [
  {
    slug: 'organizar-finanzas-personales-uruguay-2025',
    title: 'Cómo Organizar tus Finanzas Personales en Uruguay [2025]',
    excerpt: 'Guía completa paso a paso para tomar control de tus finanzas. Sin vueltas, sin frases motivacionales vacías. Solo lo que funciona.',
    category: 'Educación Financiera',
    readTime: '12 min',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

export function BlogSection() {
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
            Aprende a Manejar tu Plata
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Guías prácticas, consejos reales y análisis sobre finanzas personales en Uruguay
          </p>
        </div>

        {/* Featured Post */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Image/Gradient Header */}
                <div className={`h-48 sm:h-64 bg-gradient-to-br ${post.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} de lectura</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Leer artículo completo
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-cyan/5 border border-border rounded-2xl p-6 sm:p-8 lg:p-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Querés más consejos sobre finanzas?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Cada semana publicamos guías prácticas, comparativas de bancos y tips para que le saques el jugo a tu plata en Uruguay.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">
                  <strong>Guías paso a paso</strong> para cada banco uruguayo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">
                  <strong>Tips reales</strong> que funcionan en Uruguay
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">
                  <strong>Sin vueltas</strong>, directo al grano
                </span>
              </li>
            </ul>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Ver todos los artículos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
