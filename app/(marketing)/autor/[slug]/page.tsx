import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Linkedin, Twitter, Github, MapPin, FileText } from 'lucide-react';
import { getAllAuthorSlugs, getAuthor } from '@/lib/authors';
import { getAllPostsMetadata } from '@/lib/mdx';
import { authorSlug } from '@/lib/authors';

export async function generateStaticParams() {
  return getAllAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: 'Autor no encontrado' };

  return {
    title: `${author.displayName} — ${author.role} | Ahorrin`,
    description: author.bio,
    alternates: { canonical: author.url },
    openGraph: {
      title: `${author.displayName} | Ahorrin`,
      description: author.bio,
      url: author.url,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const allPosts = getAllPostsMetadata();
  const posts = allPosts.filter(
    (p) => authorSlug(p.author.name) === slug
  );

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    url: author.url,
    image: `https://www.ahorrin.app${author.avatar}`,
    jobTitle: author.role,
    worksFor: {
      '@type': 'Organization',
      name: 'Ahorrin',
      url: 'https://www.ahorrin.app',
    },
    knowsAbout: [
      'Finanzas personales en Uruguay',
      'IRPF',
      'BPS',
      'FONASA',
      'Inversiones',
      'Bancos uruguayos',
    ],
    ...(author.email ? { email: `mailto:${author.email}` } : {}),
  };

  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-10 pb-10 border-b border-border">
          <div className="shrink-0 relative w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <Image
              src={author.avatar}
              alt={author.displayName}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary mb-2">
              {author.role}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
              {author.displayName}
            </h1>
            <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" /> Montevideo, Uruguay
            </p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Quién es</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {author.longBio}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Trayectoria y contexto</h2>
          <ul className="space-y-3 text-muted-foreground">
            {author.credentials.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Contactar</h2>
          <ul className="space-y-3 text-sm">
            {author.email && (
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${author.email}`} className="text-primary hover:underline">
                  {author.email}
                </a>
              </li>
            )}
            {author.linkedin && (
              <li className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {author.twitter && (
              <li className="flex items-center gap-3">
                <Twitter className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter / X
                </a>
              </li>
            )}
            {author.github && (
              <li className="flex items-center gap-3">
                <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
              </li>
            )}
          </ul>
        </section>

        {posts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Artículos publicados ({posts.length})
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block border border-border rounded-lg p-5 hover:border-primary/40 hover:bg-muted/30 transition-all"
                >
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-1.5">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex gap-3 mt-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    <time dateTime={post.date} className="normal-case tracking-wider">
                      {new Date(post.date).toLocaleDateString('es-UY', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 text-sm text-muted-foreground">
          <p>
            ¿Querés saber cómo investigamos y revisamos cada artículo?{' '}
            <Link href="/metodologia" className="text-primary hover:underline">
              Mirá nuestra metodología
            </Link>
            .
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </div>
    </div>
  );
}
