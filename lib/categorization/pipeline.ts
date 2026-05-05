// Pipeline orchestrator. Loads inputs once, runs rules → cache → similar in
// memory, writes results in chunked UPDATEs, and feeds the merchant_cache.
//
// Used by:
//  - app/api/jobs/categorize/route.ts (worker, called from upload + cron drain)
//  - lib/services/recategorize.ts (manual reprocess)

import type { SupabaseClient } from '@supabase/supabase-js';
import { applyRules, type CategorizationRule, type RuleInput } from './rules';
import { lookupCache, recordCacheHits } from './cache';
import { findSimilar } from './similar';
import { vendorKey } from './vendor-key';

export type CategorizationStatus =
  | 'pending'
  | 'rules'
  | 'cache'
  | 'similar'
  | 'manual'
  | 'unmatched';

export interface PipelineCounts {
  rules: number;
  cache: number;
  similar: number;
  unmatched: number;
  total: number;
}

const UPDATE_CHUNK = 500;
const SIMILARITY_THRESHOLD = parseFloat(
  process.env.RAVEN_SIMILARITY_THRESHOLD ?? '0.6',
);

export async function runPipelineForStatement(
  supabase: SupabaseClient,
  userId: string,
  statementId: string,
): Promise<PipelineCounts> {
  // Load all txns of this statement that still need categorization.
  const { data: txns, error: txErr } = await supabase
    .from('transactions')
    .select('id, vendor, amount, notes, vendor_key')
    .eq('user_id', userId)
    .eq('statement_id', statementId)
    .eq('categorization_status', 'pending');

  if (txErr) throw txErr;
  const inputs: RuleInput[] = (txns ?? []).map((t) => ({
    id: t.id as string,
    vendor: (t.vendor as string) ?? '',
    amount: Number(t.amount),
    reference: (t.notes as string | null) ?? null,
    notes: (t.notes as string | null) ?? null,
  }));

  if (inputs.length === 0) {
    return { rules: 0, cache: 0, similar: 0, unmatched: 0, total: 0 };
  }

  // Load rules + active categories once.
  const { data: rules, error: rulesErr } = await supabase
    .from('categorization_rules')
    .select('id, category_id, rule_type, match_value, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  if (rulesErr) throw rulesErr;

  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);
  if (catErr) throw catErr;
  const validCategoryIds = new Set((cats ?? []).map((c) => c.id as string));

  // Stage 1: rules.
  const { matched: ruleMatched, unmatched: postRules } = applyRules(
    inputs,
    (rules ?? []) as unknown as CategorizationRule[],
  );

  // Build vendor_key list for stages 2/3 over rules-unmatched.
  const keyByTxId = new Map<string, string>();
  const keysNeeded: string[] = [];
  for (const tx of postRules) {
    const k = (tx as RuleInput).vendor ? vendorKey(tx.vendor) : null;
    if (k) {
      keyByTxId.set(tx.id, k);
      keysNeeded.push(k);
    }
  }

  // Stage 2: merchant_cache.
  const cacheMap =
    keysNeeded.length > 0
      ? await lookupCache(supabase, userId, keysNeeded)
      : new Map<string, string>();

  // Stage 3: trigram similarity for whatever cache missed.
  const stillMissing: string[] = [];
  for (const k of keysNeeded) if (!cacheMap.has(k)) stillMissing.push(k);
  const similarMap =
    stillMissing.length > 0
      ? await findSimilar(supabase, userId, stillMissing, SIMILARITY_THRESHOLD)
      : new Map<string, string>();

  // Build write-set.
  type Update = {
    id: string;
    category_id: string | null;
    categorization_status: CategorizationStatus;
  };
  const updates: Update[] = [];
  const ruleHits: Array<{ vendor_key: string; category_id: string }> = [];
  let counts: PipelineCounts = { rules: 0, cache: 0, similar: 0, unmatched: 0, total: inputs.length };

  for (const m of ruleMatched) {
    if (!validCategoryIds.has(m.category_id)) {
      updates.push({ id: m.id, category_id: null, categorization_status: 'unmatched' });
      counts.unmatched++;
      continue;
    }
    updates.push({
      id: m.id,
      category_id: m.category_id,
      categorization_status: 'rules',
    });
    counts.rules++;
    // Feed cache for future short-circuit.
    const tx = inputs.find((t) => t.id === m.id);
    const k = tx ? vendorKey(tx.vendor) : null;
    if (k) ruleHits.push({ vendor_key: k, category_id: m.category_id });
  }

  for (const tx of postRules) {
    const k = keyByTxId.get(tx.id);
    let categoryId: string | null = null;
    let status: CategorizationStatus = 'unmatched';

    if (k) {
      const fromCache = cacheMap.get(k);
      if (fromCache && validCategoryIds.has(fromCache)) {
        categoryId = fromCache;
        status = 'cache';
        counts.cache++;
      } else {
        const fromSimilar = similarMap.get(k);
        if (fromSimilar && validCategoryIds.has(fromSimilar)) {
          categoryId = fromSimilar;
          status = 'similar';
          counts.similar++;
        }
      }
    }

    if (!categoryId) counts.unmatched++;
    updates.push({ id: tx.id, category_id: categoryId, categorization_status: status });
  }

  // Write updates in chunks. Supabase has no batch update by id; we issue one
  // UPDATE per distinct (category_id, status) pair, which keeps round-trips
  // bounded by the number of stages (max 4: rules / cache / similar / unmatched
  // × distinct categories). For typical inputs this is well under 50 calls.
  const grouped = new Map<string, string[]>();
  for (const u of updates) {
    const key = `${u.categorization_status}|${u.category_id ?? ''}`;
    const arr = grouped.get(key) ?? [];
    arr.push(u.id);
    grouped.set(key, arr);
  }

  for (const [key, ids] of grouped) {
    const [status, catId] = key.split('|') as [CategorizationStatus, string];
    for (let i = 0; i < ids.length; i += UPDATE_CHUNK) {
      const slice = ids.slice(i, i + UPDATE_CHUNK);
      const { error: upErr } = await supabase
        .from('transactions')
        .update({
          category_id: catId === '' ? null : catId,
          categorization_status: status,
        })
        .in('id', slice);
      if (upErr) throw upErr;
    }
  }

  // Feed merchant_cache from rule matches (so future uploads short-circuit).
  if (ruleHits.length > 0) {
    await recordCacheHits(supabase, userId, ruleHits, 'rule');
  }

  return counts;
}
