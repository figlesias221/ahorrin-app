'use client';

// Live status panel for a sharded-raven statement. Subscribes to
// bank_statements and the related categorization_jobs row so the UI updates
// in real time as the worker progresses.

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type StatementStatus =
  | 'processing'
  | 'parsed'
  | 'categorizing'
  | 'completed'
  | 'failed';

interface CountsRow {
  rules: number;
  cache: number;
  similar: number;
  unmatched: number;
  manual: number;
  total: number;
}

interface Props {
  statementId: string;
  /** Optional callback when the statement finishes categorizing. */
  onComplete?: (counts: CountsRow) => void;
}

const ZERO_COUNTS: CountsRow = {
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

export function RavenStatementStatus({ statementId, onComplete }: Props) {
  const supabase = createClient();
  const [status, setStatus] = useState<StatementStatus>('parsed');
  const [counts, setCounts] = useState<CountsRow>(ZERO_COUNTS);
  const [recategorizing, setRecategorizing] = useState(false);

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

  const stepIndex = STEPS.findIndex((s) => s.key === status);
  const isFailed = status === 'failed';

  const handleRecategorize = async () => {
    setRecategorizing(true);
    try {
      await fetch('/api/transactions/recategorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement_id: statementId }),
      });
      // Status will refresh via Realtime.
    } finally {
      setRecategorizing(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Estado del extracto
        </h3>
        <button
          onClick={handleRecategorize}
          disabled={recategorizing || status === 'categorizing'}
          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {recategorizing ? 'Reprocesando…' : 'Re-categorizar'}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {STEPS.map((step, i) => {
          const reached = !isFailed && (stepIndex >= i || status === 'completed');
          const isCurrent = STEPS[stepIndex]?.key === step.key;
          return (
            <div key={step.key} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-colors ${
                  isFailed
                    ? 'bg-red-300'
                    : reached
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                } ${isCurrent && status === 'categorizing' ? 'animate-pulse' : ''}`}
              />
              <span
                className={`text-xs font-medium ${
                  reached ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isFailed && (
        <p className="mt-3 text-xs text-red-600">
          La categorización falló. Probá «Re-categorizar».
        </p>
      )}

      {(status === 'completed' || status === 'categorizing') && counts.total > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-5">
          <Stat label="Reglas" value={counts.rules} tone="emerald" />
          <Stat label="Memoria" value={counts.cache} tone="sky" />
          <Stat label="Similares" value={counts.similar} tone="violet" />
          <Stat label="Manuales" value={counts.manual} tone="slate" />
          <Stat label="Sin categorizar" value={counts.unmatched} tone="amber" />
        </dl>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'emerald' | 'sky' | 'violet' | 'slate' | 'amber';
}) {
  const toneCls: Record<typeof tone, string> = {
    emerald: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950',
    sky: 'text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950',
    violet: 'text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950',
    slate: 'text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-800',
    amber: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950',
  };
  return (
    <div className={`rounded-md px-2 py-2 text-center ${toneCls[tone]}`}>
      <div className="text-base font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide opacity-80">
        {label}
      </div>
    </div>
  );
}
