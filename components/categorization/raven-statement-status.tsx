'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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

const HEADING_BY_STATUS: Record<StatementStatus, string> = {
  processing: 'En cola',
  parsed: 'En cola',
  categorizing: 'Categorizando…',
  completed: 'Listo',
  failed: 'Error de categorización',
};

type StepState = 'past' | 'current' | 'future' | 'failed';

const STEP_RAIL_BG: Record<StepState, string> = {
  past: 'bg-foreground',
  current: 'bg-primary',
  future: 'bg-border',
  failed: 'bg-error',
};

const STEP_LABEL_COLOR: Record<StepState, string> = {
  past: 'text-foreground',
  current: 'text-primary',
  future: 'text-muted-foreground',
  failed: 'text-muted-foreground',
};

const sameCounts = (a: CountsRow, b: CountsRow): boolean =>
  a.pending === b.pending &&
  a.rules === b.rules &&
  a.cache === b.cache &&
  a.similar === b.similar &&
  a.unmatched === b.unmatched &&
  a.manual === b.manual &&
  a.total === b.total;

export function RavenStatementStatus({ statementId, onComplete }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatusState] = useState<StatementStatus>('parsed');
  const [counts, setCountsState] = useState<CountsRow>(ZERO_COUNTS);
  const [recategorizing, setRecategorizing] = useState(false);
  const [inlineNote, setInlineNote] = useState<string | null>(null);

  const updateStatus = useCallback((next: StatementStatus) => {
    setStatusState((prev) => (prev === next ? prev : next));
  }, []);

  const updateCounts = useCallback((next: CountsRow) => {
    setCountsState((prev) => (sameCounts(prev, next) ? prev : next));
  }, []);

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
    updateCounts(next);
  }, [supabase, statementId, updateCounts]);

  useEffect(() => {
    let cancelled = false;
    let pendingTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefresh = () => {
      if (pendingTimer) return;
      pendingTimer = setTimeout(() => {
        pendingTimer = null;
        if (!cancelled) refreshCounts();
      }, 250);
    };

    (async () => {
      const { data } = await supabase
        .from('bank_statements')
        .select('status')
        .eq('id', statementId)
        .single();
      if (!cancelled && data?.status) updateStatus(data.status as StatementStatus);
      await refreshCounts();
    })();

    const channel = supabase
      .channel(`raven-statement-${statementId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bank_statements', filter: `id=eq.${statementId}` },
        (payload) => {
          const next = (payload.new as { status?: StatementStatus }).status;
          if (next) updateStatus(next);
          if (next === 'completed' || next === 'failed') debouncedRefresh();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `statement_id=eq.${statementId}` },
        debouncedRefresh,
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (pendingTimer) clearTimeout(pendingTimer);
      supabase.removeChannel(channel);
    };
  }, [statementId, supabase, refreshCounts, updateStatus]);

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
        setInlineNote('Nada para reprocesar');
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
  const categorized = counts.total - counts.unmatched - counts.pending;
  const unmatchedActionable = counts.unmatched > 0;

  const stepStateAt = (i: number): StepState => {
    if (isFailed) return 'failed';
    if (stepIndex > i) return 'past';
    if (stepIndex === i) return 'current';
    return 'future';
  };

  return (
    <section
      aria-label="Estado de categorización"
      className="rounded-xl border border-border bg-background p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {HEADING_BY_STATUS[status]}
        </h3>
        <button
          onClick={handleRecategorize}
          disabled={recategorizing || isWorking}
          className="text-[11px] font-mono uppercase tracking-widest text-primary transition-opacity duration-150 ease-out hover:opacity-70 disabled:opacity-40 disabled:hover:opacity-40"
        >
          {recategorizing ? 'Recategorizando' : 'Recategorizar'}
        </button>
      </div>

      <ol className="mt-6 grid grid-cols-3 gap-2">
        {STEPS.map((step, i) => {
          const state = stepStateAt(i);
          const isCurrent = state === 'current';
          return (
            <li key={step.key} className="flex flex-col gap-2">
              <div
                className={`h-px w-full transition-colors duration-300 ease-out ${STEP_RAIL_BG[state]}`}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${STEP_LABEL_COLOR[state]}`}
                >
                  {step.label}
                </span>
                {isCurrent && isWorking && (
                  <span
                    className="raven-pulse-dot h-1 w-1 rounded-full bg-primary [animation:raven-pulse_1.4s_ease-out_infinite]"
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
          La categorización falló. Probá <span className="font-medium">Recategorizar</span>.
        </p>
      )}

      {showStats && (
        <>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-mono text-5xl font-medium tracking-tight tabular-nums text-foreground">
              {completionPct}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              categorizado
            </span>
          </div>

          <p className="mt-6 text-[13px] text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">{categorized}</span>{' '}
            categorizadas ·{' '}
            <span
              className={`font-mono tabular-nums ${
                unmatchedActionable ? 'text-primary' : 'text-foreground'
              }`}
            >
              {counts.unmatched}
            </span>{' '}
            sin categorizar
            {counts.pending > 0 && (
              <>
                {' · '}
                <span className="font-mono tabular-nums">{counts.pending}</span> en proceso
              </>
            )}
          </p>

          <details className="mt-4 group">
            <summary className="cursor-pointer text-[11px] font-mono uppercase tracking-widest text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-70 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
              Ver detalle
            </summary>
            <dl className="mt-4 grid grid-cols-5 divide-x divide-border border-y border-border">
              {STAT_ORDER.map(({ key, label }) => {
                const value = counts[key];
                const isActionable = key === 'unmatched' && value > 0;
                return (
                  <div
                    key={key}
                    className="flex flex-col gap-1 px-3 py-3 first:pl-0 last:pr-0"
                  >
                    <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      {label}
                    </dt>
                    <dd
                      className={`font-mono text-lg font-medium tabular-nums ${
                        isActionable ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </details>
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
    </section>
  );
}
