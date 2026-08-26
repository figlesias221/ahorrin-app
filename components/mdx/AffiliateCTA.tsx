'use client';

import { ArrowUpRight } from 'lucide-react';
import { affiliateUrl, isTracked, AFFILIATE_PROGRAMS, type AffiliateId } from '@/lib/affiliates';
import { analytics } from '@/components/analytics/google-analytics';

interface AffiliateCTAProps {
  /** Programa del registro en lib/affiliates.ts */
  program: AffiliateId;
  /** Título del bloque. Por defecto: "Abrí tu cuenta en {nombre}". */
  title?: string;
  /** Texto del botón. */
  cta?: string;
  /** Contexto: qué gana el lector si hace click. */
  children: React.ReactNode;
}

export function AffiliateCTA({ program, title, cta, children }: AffiliateCTAProps) {
  const { name } = AFFILIATE_PROGRAMS[program];
  const tracked = isTracked(program);

  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {name}
      </p>

      <h3 className="mt-2 text-lg font-bold text-foreground">
        {title ?? `Abrí tu cuenta en ${name}`}
      </h3>

      <div className="mt-2 text-sm text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>

      <a
        href={affiliateUrl(program)}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => analytics.event('affiliate_click', { program, tracked })}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {cta ?? `Ir a ${name}`}
        <ArrowUpRight className="h-4 w-4" />
      </a>

      {tracked && (
        <p className="mt-3 text-xs text-muted-foreground">
          Link de afiliado: si abrís cuenta, Ahorrin puede recibir una comisión sin
          costo extra para vos. No cambia nuestra evaluación — recomendamos{' '}
          {name} por lo que explicamos arriba.
        </p>
      )}
    </div>
  );
}
