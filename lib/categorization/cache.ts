import type { SupabaseClient } from '@supabase/supabase-js';

export type CacheSource = 'rule' | 'manual' | 'observed';

export interface CacheEntry {
  vendor_key: string;
  category_id: string;
}

export async function lookupCache(
  supabase: SupabaseClient,
  userId: string,
  vendorKeys: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (vendorKeys.length === 0) return result;

  const unique = Array.from(new Set(vendorKeys));
  const { data, error } = await supabase
    .from('merchant_cache')
    .select('vendor_key, category_id')
    .eq('user_id', userId)
    .in('vendor_key', unique);

  if (error) throw error;
  for (const row of data ?? []) {
    result.set(row.vendor_key as string, row.category_id as string);
  }
  return result;
}

export async function recordCacheHits(
  supabase: SupabaseClient,
  userId: string,
  entries: CacheEntry[],
  source: CacheSource,
): Promise<void> {
  if (entries.length === 0) return;

  const dedup = new Map<string, string>();
  for (const e of entries) {
    if (e.vendor_key) dedup.set(e.vendor_key, e.category_id);
  }

  const rows = Array.from(dedup.entries()).map(([vendor_key, category_id]) => ({
    user_id: userId,
    vendor_key,
    category_id,
    source,
    last_seen_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('merchant_cache')
    .upsert(rows, { onConflict: 'user_id,vendor_key' });

  if (error) throw error;
}
