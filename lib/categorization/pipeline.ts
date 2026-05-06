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
  return runPipeline(supabase, userId, { statementId });
}

export async function runPipelineForUserPending(
  supabase: SupabaseClient,
  userId: string,
): Promise<PipelineCounts> {
  return runPipeline(supabase, userId, {});
}

async function runPipeline(
  supabase: SupabaseClient,
  userId: string,
  scope: { statementId?: string },
): Promise<PipelineCounts> {
  let txQuery = supabase
    .from('transactions')
    .select('id, vendor, amount, notes, vendor_key')
    .eq('user_id', userId)
    .eq('categorization_status', 'pending');
  if (scope.statementId) txQuery = txQuery.eq('statement_id', scope.statementId);

  const [
    { data: txns, error: txErr },
    { data: rules, error: rulesErr },
    { data: cats, error: catErr },
  ] = await Promise.all([
    txQuery,
    supabase
      .from('categorization_rules')
      .select('id, category_id, rule_type, match_value, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true),
  ]);

  if (txErr) throw txErr;
  if (rulesErr) throw rulesErr;
  if (catErr) throw catErr;

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

  const validCategoryIds = new Set((cats ?? []).map((c) => c.id as string));
  const vendorKeyByTxId = new Map<string, string>();
  for (const tx of inputs) {
    const k = vendorKey(tx.vendor);
    if (k) vendorKeyByTxId.set(tx.id, k);
  }

  const { matched: ruleMatched, unmatched: postRules } = applyRules(
    inputs,
    (rules ?? []) as unknown as CategorizationRule[],
  );

  const keysNeeded: string[] = [];
  for (const tx of postRules) {
    const k = vendorKeyByTxId.get(tx.id);
    if (k) keysNeeded.push(k);
  }

  const cacheMap =
    keysNeeded.length > 0
      ? await lookupCache(supabase, userId, keysNeeded)
      : new Map<string, string>();

  const stillMissing: string[] = [];
  for (const k of keysNeeded) if (!cacheMap.has(k)) stillMissing.push(k);
  const similarMap =
    stillMissing.length > 0
      ? await findSimilar(supabase, userId, stillMissing, SIMILARITY_THRESHOLD)
      : new Map<string, string>();

  type Update = {
    id: string;
    category_id: string | null;
    categorization_status: CategorizationStatus;
  };
  const updates: Update[] = [];
  const ruleHits: Array<{ vendor_key: string; category_id: string }> = [];
  const counts: PipelineCounts = { rules: 0, cache: 0, similar: 0, unmatched: 0, total: inputs.length };

  for (const m of ruleMatched) {
    if (!validCategoryIds.has(m.category_id)) {
      updates.push({ id: m.id, category_id: null, categorization_status: 'unmatched' });
      counts.unmatched++;
      continue;
    }
    updates.push({ id: m.id, category_id: m.category_id, categorization_status: 'rules' });
    counts.rules++;
    const k = vendorKeyByTxId.get(m.id);
    if (k) ruleHits.push({ vendor_key: k, category_id: m.category_id });
  }

  for (const tx of postRules) {
    const k = vendorKeyByTxId.get(tx.id);
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

  // One UPDATE per distinct (status, category_id) keeps round-trips bounded
  // by stages × distinct categories. Without grouping it would be one round-
  // trip per row.
  const grouped = new Map<string, string[]>();
  for (const u of updates) {
    const key = `${u.categorization_status}|${u.category_id ?? ''}`;
    const arr = grouped.get(key) ?? [];
    arr.push(u.id);
    grouped.set(key, arr);
  }

  const updateOps: Array<Promise<unknown>> = [];
  for (const [key, ids] of grouped) {
    const [status, catId] = key.split('|') as [CategorizationStatus, string];
    for (let i = 0; i < ids.length; i += UPDATE_CHUNK) {
      const slice = ids.slice(i, i + UPDATE_CHUNK);
      updateOps.push(
        supabase
          .from('transactions')
          .update({
            category_id: catId === '' ? null : catId,
            categorization_status: status,
          })
          .in('id', slice)
          .then((res) => {
            if (res.error) throw res.error;
            return res;
          }),
      );
    }
  }

  if (ruleHits.length > 0) {
    updateOps.push(recordCacheHits(supabase, userId, ruleHits, 'rule'));
  }

  await Promise.all(updateOps);

  return counts;
}
