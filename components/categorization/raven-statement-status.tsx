'use client';

// Live status panel for a sharded-raven statement. Subscribes to
// bank_statements + the related transaction rows so the UI updates as the
// worker progresses.
//
// Visual language follows BRAND.md: DM Sans body, Space Mono for labels &
// data, emerald primary as the single moment of color, borders over shadows.

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type StatementStatus =
  | 'processing'
  | 'parsed'
  | 'categorizing'
  | 'completed'
  | 'failed';

interface CountsRow {
  pending: number;
  rules: number;
  cache: number;
  similar: number;
  unmatched: number;
  manual: number;
  total: number;
}

interface Props {
  statementId: string;
  onComplete?: (counts: CountsRow) => void;
}

const ZERO_COUNTS: CountsRow = {
  pending: 0,
  rules: 0,
  cache: 0,
  similar: 0,
  unmatched: 0,
  manual: 0,
  total: 0,
};

const STEPS: Array<{ key: StatementStatus; label: string }> = [
  { key: 'parsed', label: 'Importado' },
  { key: 'categorizing', label: 'Categorizando' },
  { key: 'completed', label: 'Listo' },
];

const STAT_ORDER: Array<{ key: keyof CountsRow; label: string }> = [
  { key: 'rules', label: 'Reglas' },
  { key: 'cache', label: 'Memoria' },
  { key: 'similar', label: 'Similares' },
  { key: 'manual', label: 'Manuales' },
  { key: 'unmatched', label: 'Sin categorizar' },
];

export function RavenStatementStatus({ statementId, onComplete }: Props) {
  const supabase = createClient();
  const [status, setStatus] = useState<StatementStatus>('parsed');
  const [counts, setCounts] = useState<CountsRow>(ZERO_COUNTS);
  const [recategorizing, setRecategorizing] = useState(false);
  const [inlineNote, setInlineNote] = useState<string | null>(null);

  const refreshCounts = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('categorization_status')
      .eq('statement_id', statementId);
    if (!data) return;
    const next = { ...ZERO_COUNTS, total: data.length };
    for (const r of data as Array<{ categorization_status: keyof CountsRow }>) {
      const k = r.categorization_status;
      if (k && k in next) (next[k] as number) += 1;
    }
    setCounts(next);
  }, [supabase, statementId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('bank_statements')
        .select('status')
        .eq('id', statementId)
        .single();
      if (!cancelled && data?.status) setStatus(data.status as StatementStatus);
      await refreshCounts();
    })();

    const channel = supabase
      .channel(`raven-statement-${statementId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bank_statements', filter: `id=eq.${statementId}` },
        (payload) => {
          const next = (payload.new as { status?: StatementStatus }).status;
          if (next) setStatus(next);
          if (next === 'completed' || next === 'failed') refreshCounts();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `statement_id=eq.${statementId}` },
        () => refreshCounts(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [statementId, supabase, refreshCounts]);

  useEffect(() => {
    if (status === 'completed' && onComplete) onComplete(counts);
  }, [status, counts, onComplete]);

  const handleRecategorize = async () => {
    setRecategorizing(true);
    setInlineNote(null);
    try {
      const res = await fetch('/api/transactions/recategorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement_id: statementId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setInlineNote(json.error ?? 'Error al re-categorizar');
      } else if (json.reset === 0) {
        setInlineNote('No hay transacciones para reprocesar');
      } else {
        setInlineNote(`${json.reset} en cola`);
      }
    } catch (err) {
      setInlineNote(String(err));
    } finally {
      setRecategorizing(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.key === status);
  const isFailed = status === 'failed';
  const isWorking = status === 'categorizing';
  const showStats = (status === 'completed' || isWorking) && counts.total > 0;
  const completionPct =
    counts.total > 0
      ? Math.round(((counts.total - counts.unmatched - counts.pending) / counts.total) * 100)
      : 0;

  return (
    <section
      aria-label="Estado de categorización"
      className="rounded-xl border border-border bg-background p-6"
    >
      {/* Header — single primary moment, label in mono caps */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            Extracto
          </span>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {isFailed
              ? 'Error de categorización'
              : isWorking
                ? 'Categorizando…'
                : status === 'completed'
                  ? 'Listo'
                  : 'En cola'}
          </h3>
        </div>
        <button
          onClick={handleRecategorize}
          disabled={recategorizing || isWorking}
          className="text-[11px] font-mono uppercase tracking-widest text-primary transition-opacity duration-150 ease-out hover:opacity-70 disabled:opacity-30 disabled:hover:opacity-30"
        >
          {recategorizing ? 'Reprocesando' : 'Re-categorizar'}
        </button>
      </div>

      {/* Step rail — three notches; the active one is filled emerald, past steps are muted-foreground, future steps are border-only */}
      <ol className="mt-6 grid grid-cols-3 gap-2">
        {STEPS.map((step, i) => {
          const past = !isFailed && stepIndex > i;
          const current = !isFailed && stepIndex === i;
          const future = !isFailed && stepIndex < i;
          return (
            <li key={step.key} className="flex flex-col gap-2">
              <div
                className={[
                  'h-px w-full transition-colors duration-300 ease-out',
                  isFailed
                    ? 'bg-error'
                    : past
                      ? 'bg-foreground'
                      : current
                        ? 'bg-primary'
                        : 'bg-border',
                ].join(' ')}
              />
              <div className="flex items-center justify-between">
                <span
                  className={[
                    'text-[10px] font-mono uppercase tracking-widest',
                    current
                      ? 'text-primary'
                      : past
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {step.label}
                </span>
                {current && isWorking && (
                  <span
                    className="h-1 w-1 rounded-full bg-primary"
                    style={{ animation: 'raven-pulse 1.4s ease-out infinite' }}
                    aria-hidden
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {isFailed && (
        <p className="mt-6 text-[13px] text-foreground">
          La categorización falló. Probá <span className="font-medium">Re-categorizar</span>.
        </p>
      )}

      {showStats && (
        <>
          {/* Big primary — the % categorized. One number, oversized, mono. */}
          <div className="mt-8 flex items-baseline gap-3">
            <span
              className="font-mono text-5xl font-medium tracking-tight tabular-nums text-foreground"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {completionPct}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              categorizado · {counts.total} mov.
            </span>
          </div>

          {/* Breakdown — clean grid of mono labels + tabular numbers, no
              colored pills. Unmatched is the only one allowed to lean primary
              when it's actionable. */}
          <dl className="mt-6 grid grid-cols-5 divide-x divide-border border-y border-border">
            {STAT_ORDER.map(({ key, label }) => {
              const value = counts[key];
              const isUnmatched = key === 'unmatched';
              const isActionable = isUnmatched && value > 0;
              return (
                <div
                  key={key}
                  className="flex flex-col gap-1 px-3 py-3 first:pl-0 last:pr-0"
                >
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd
                    className={[
                      'font-mono text-lg font-medium tabular-nums',
                      isActionable ? 'text-primary' : 'text-foreground',
                    ].join(' ')}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </>
      )}

      {inlineNote && (
        <p
          className="mt-4 text-[11px] font-mono uppercase tracking-widest text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {inlineNote}
        </p>
      )}

      <style jsx>{`
        @keyframes raven-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.6);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          ol li div[style*='raven-pulse'] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
