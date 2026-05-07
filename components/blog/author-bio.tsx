import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import type { Author } from '@/lib/authors';

export function AuthorBio({ author }: { author: Author }) {
  const firstName = author.displayName.split(' ')[0];
  return (
    <section className="border-t border-border mt-12 pt-10" aria-labelledby="author-bio-heading">
      <h2
        id="author-bio-heading"
        className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-6"
      >
        Sobre el autor
      </h2>
      <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
        <div className="shrink-0 relative w-20 h-20 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Image
            src={author.avatar}
            alt={author.displayName}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold leading-tight mb-1">
            <Link
              href={`/autor/${author.slug}`}
              rel="author"
              className="hover:underline"
            >
              {author.displayName}
            </Link>
          </h3>
          <p className="text-sm text-primary font-medium mb-3">{author.role}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {author.bio}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Montevideo, Uruguay
            </span>
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> {author.email}
              </a>
            )}
            <Link
              href={`/autor/${author.slug}`}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Más sobre {firstName} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
