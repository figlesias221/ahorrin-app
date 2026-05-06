import type { SupabaseClient } from '@supabase/supabase-js';
import { vendorKey } from '@/lib/categorization/vendor-key';

const PROBE_CHUNK = 500;

export interface DedupCandidate {
  date: string;
  vendor: string;
  amount: number;
  type: string;
  currency: string;
}

export interface DedupResult<T extends DedupCandidate> {
  fresh: T[];
  duplicates: T[];
}

const sig = (
  date: string,
  vendor: string,
  amount: number,
  type: string,
  currency: string,
) => `${date}|${vendorKey(vendor) ?? ''}|${amount}|${type}|${currency}`;

export async function dedupAgainstHistory<T extends DedupCandidate>(
  supabase: SupabaseClient,
  userId: string,
  batch: T[],
): Promise<DedupResult<T>> {
  if (batch.length === 0) return { fresh: [], duplicates: [] };

  const dates = Array.from(new Set(batch.map((b) => b.date))).sort();
  const keys = Array.from(
    new Set(batch.map((b) => vendorKey(b.vendor)).filter((v): v is string => !!v)),
  );

  if (dates.length === 0 || keys.length === 0) {
    return { fresh: batch, duplicates: [] };
  }

  const existingSigs = new Set<string>();

  for (let i = 0; i < keys.length; i += PROBE_CHUNK) {
    const keySlice = keys.slice(i, i + PROBE_CHUNK);
    const { data, error } = await supabase
      .from('transactions')
      .select('date, vendor, vendor_key, amount, type, currency')
      .eq('user_id', userId)
      .in('vendor_key', keySlice)
      .in('date', dates);

    if (error) throw error;
    for (const row of data ?? []) {
      existingSigs.add(
        sig(
          row.date as string,
          (row.vendor as string) ?? '',
          Number(row.amount),
          (row.type as string) ?? '',
          (row.currency as string) ?? '',
        ),
      );
    }
  }

  const fresh: T[] = [];
  const duplicates: T[] = [];
  for (const tx of batch) {
    const s = sig(tx.date, tx.vendor, Number(tx.amount), tx.type, tx.currency);
    if (existingSigs.has(s)) duplicates.push(tx);
    else fresh.push(tx);
  }

  return { fresh, duplicates };
}
