// Mirrors the SQL `raven_vendor_key()` function from
// supabase/migrations/20260505_sharded_raven.sql. Both must produce the same
// output for the merchant_cache to hit. If you change one, change both.

const COMBINING_MARKS = /[̀-ͯ]/g;

export function vendorKey(input: string | null | undefined): string | null {
  if (!input) return null;
  const stripped = input.normalize('NFD').replace(COMBINING_MARKS, '');
  const normalized = stripped.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return null;
  return normalized.slice(0, 80);
}
