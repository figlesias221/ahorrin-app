import Link from 'next/link';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export interface BlogSource {
  name: string;
  url: string;
}

const DEFAULT_SOURCES: BlogSource[] = [
  { name: 'DGI', url: 'https://www.dgi.gub.uy' },
  { name: 'BPS', url: 'https://www.bps.gub.uy' },
  { name: 'BCU', url: 'https://www.bcu.gub.uy' },
  { name: 'INE', url: 'https://www.ine.gub.uy' },
];

export function SourcesBlock({ sources }: { sources?: BlogSource[] }) {
  const list = sources && sources.length ? sources : DEFAULT_SOURCES;
  return (
    <section
      className="mt-12 pt-10 border-t border-border"
      aria-labelledby="sources-heading"
    >
      <h2
        id="sources-heading"
        className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        Fuentes y verificación
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-2xl">
        Este artículo se contrastó contra fuentes oficiales antes de publicarse y se
        revisa periódicamente. Si encontrás información desactualizada o querés señalar
        un error,{' '}
        <Link href="/contacto" className="text-primary hover:underline">
          escribinos
        </Link>{' '}
        y lo corregimos.
      </p>
      <ul className="flex flex-wrap gap-2 mb-5">
        {list.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors"
            >
              {s.name}
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        ))}
      </ul>
      <Link
        href="/metodologia"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
      >
        Cómo investigamos cada artículo →
      </Link>
    </section>
  );
}
