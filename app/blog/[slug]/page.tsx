import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { ComparisonTable, CalloutBox } from '@/components/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// MDX Components
const mdxComponents = {
  // Custom components
  ComparisonTable,
  CalloutBox,
  // HTML elements styling
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-blue-900" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-8 mb-4 text-blue-800" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-blue-700" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:text-blue-700 hover:underline" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50/50 py-2" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-blue-200 shadow-sm">
      <table className="min-w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 text-left font-semibold text-blue-900" {...props} />
  ),
  td: (props: any) => <td className="border-b border-blue-100 px-4 py-3 hover:bg-blue-50/30" {...props} />,
  code: (props: any) => (
    <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono border border-blue-200" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg overflow-x-auto my-4 border border-blue-200" {...props} />
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
    return {
      title: 'Post no encontrado',
    };
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          <div className="mb-6">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
              {metadata.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-blue-100">
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

      {/* Content */}
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
                        properties: {
                          className: ['anchor'],
                        },
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg text-blue-50 mb-8">
            Comenzá a usar Ahorrín gratis y organiza tus gastos en minutos
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all"
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
            headline: metadata.title,
            description: metadata.excerpt,
            author: {
              '@type': 'Organization',
              name: metadata.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Ahorrín',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.ahorrin.app/logo.png',
              },
            },
            datePublished: metadata.date,
            dateModified: metadata.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.ahorrin.app/blog/${slug}`,
            },
            keywords: metadata.keywords.join(', '),
          }),
        }}
      />
    </div>
  );
}
