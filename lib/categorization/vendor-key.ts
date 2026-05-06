// Must stay in sync with the `raven_vendor_key()` SQL function in
// supabase/migrations/20260505_sharded_raven.sql — both produce the merchant
// cache key.

const COMBINING_MARKS = /[̀-ͯ]/g;

export function vendorKey(input: string | null | undefined): string | null {
  if (!input) return null;
  const stripped = input.normalize('NFD').replace(COMBINING_MARKS, '');
  const normalized = stripped.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return null;
  return normalized.slice(0, 80);
}
