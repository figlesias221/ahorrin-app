import type { SupabaseClient } from '@supabase/supabase-js';

export async function findSimilar(
  supabase: SupabaseClient,
  userId: string,
  vendorKeys: string[],
  threshold = 0.6,
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (vendorKeys.length === 0) return result;

  const unique = Array.from(new Set(vendorKeys));
  const { data, error } = await supabase.rpc('raven_find_similar', {
    p_user_id: userId,
    p_vendor_keys: unique,
    p_threshold: threshold,
  });

  if (error) throw error;
  for (const row of (data ?? []) as Array<{ vendor_key: string; category_id: string }>) {
    result.set(row.vendor_key, row.category_id);
  }
  return result;
}
