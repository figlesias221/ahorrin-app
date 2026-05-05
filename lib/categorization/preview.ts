'use client';

// Live preview of which transactions a candidate rule would match.
// Pulls the user's recent non-ignored transactions once and re-evaluates
// in-memory on every keystroke using the same applyRules() the worker uses,
// so what the user sees is exactly what will run.

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  applyRules,
  type CategorizationRule,
  type RuleInput,
} from './rules';

const PREVIEW_FETCH_LIMIT = 2000;

export interface PreviewTxn {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  notes: string | null;
  category_id: string | null;
  category_name: string | null;
  category_color: string | null;
}

export interface PreviewResult {
  loading: boolean;
  total: number;
  count: number;
  samples: PreviewTxn[];
}

export function useRulePreview(args: {
  ruleType: CategorizationRule['rule_type'];
  matchValues: string[];
  enabled?: boolean;
}): PreviewResult {
  const [txns, setTxns] = useState<PreviewTxn[]>([]);
  const [loading, setLoading] = useState(false);

  const enabled = args.enabled !== false;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('transactions')
        .select(
          'id, vendor, amount, date, notes, category_id, categories(name, color)',
        )
        .eq('user_id', user.id)
        .eq('is_ignored', false)
        .order('date', { ascending: false })
        .limit(PREVIEW_FETCH_LIMIT);

      if (cancelled) return;
      const rows = (data ?? []).map((r: any) => ({
        id: r.id,
        vendor: r.vendor ?? '',
        amount: Number(r.amount),
        date: r.date,
        notes: r.notes ?? null,
        category_id: r.category_id,
        category_name: r.categories?.name ?? null,
        category_color: r.categories?.color ?? null,
      })) as PreviewTxn[];
      setTxns(rows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return useMemo(() => {
    const cleaned = args.matchValues.map((v) => v.trim()).filter(Boolean);
    if (cleaned.length === 0) {
      return { loading, total: txns.length, count: 0, samples: [] };
    }

    const synth: CategorizationRule = {
      id: '__preview__',
      category_id: '__preview__',
      rule_type: args.ruleType,
      match_value: cleaned.join(','),
      is_active: true,
    };
    const inputs: RuleInput[] = txns.map((t) => ({
      id: t.id,
      vendor: t.vendor,
      amount: t.amount,
      notes: t.notes,
      reference: t.notes,
    }));
    const { matched } = applyRules(inputs, [synth]);
    const matchedIds = new Set(matched.map((m) => m.id));
    const samples = txns.filter((t) => matchedIds.has(t.id)).slice(0, 5);
    return { loading, total: txns.length, count: matched.length, samples };
  }, [loading, txns, args.ruleType, args.matchValues]);
}
