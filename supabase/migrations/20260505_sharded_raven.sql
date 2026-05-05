-- Sharded Raven: deterministic, async categorization pipeline
-- Adds: categorization_jobs, merchant_cache, vendor_key on transactions,
--       categorization_status on transactions, file_hash + idempotency on
--       bank_statements, and the indexes those features rely on.

-- Extensions ----------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- vendor_key normalizer ------------------------------------------------------
-- Single source of truth used by triggers AND application code (mirrored in
-- lib/categorization/vendor-key.ts). Keep them in sync.

CREATE OR REPLACE FUNCTION raven_vendor_key(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(
    LEFT(
      LOWER(
        TRIM(
          regexp_replace(
            unaccent(COALESCE(input, '')),
            '\s+', ' ', 'g'
          )
        )
      ),
      80
    ),
    ''
  );
$$;

-- transactions: vendor_key + categorization_status ---------------------------

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS vendor_key text,
  ADD COLUMN IF NOT EXISTS categorization_status text NOT NULL DEFAULT 'pending';

ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_categorization_status_check;
ALTER TABLE transactions
  ADD CONSTRAINT transactions_categorization_status_check
  CHECK (categorization_status IN
    ('pending','rules','cache','similar','manual','unmatched'));

-- Trigger to keep vendor_key in sync with vendor.
CREATE OR REPLACE FUNCTION raven_set_vendor_key()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.vendor_key := raven_vendor_key(NEW.vendor);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transactions_vendor_key ON transactions;
CREATE TRIGGER trg_transactions_vendor_key
  BEFORE INSERT OR UPDATE OF vendor ON transactions
  FOR EACH ROW EXECUTE FUNCTION raven_set_vendor_key();

-- Backfill vendor_key for existing rows.
UPDATE transactions SET vendor_key = raven_vendor_key(vendor)
WHERE vendor_key IS NULL;

-- Mark existing rows so the new categorization_status reflects reality.
-- Anything with a category and is_manually_verified -> 'manual';
-- anything with a category but not verified -> 'rules' (best-effort);
-- anything without category -> 'unmatched'.
UPDATE transactions
SET categorization_status = CASE
  WHEN category_id IS NULL THEN 'unmatched'
  WHEN is_manually_verified THEN 'manual'
  ELSE 'rules'
END
WHERE categorization_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_transactions_user_vendor_key
  ON transactions(user_id, vendor_key)
  WHERE vendor_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_user_date_vendor_key
  ON transactions(user_id, date, vendor_key);

CREATE INDEX IF NOT EXISTS idx_transactions_vendor_key_trgm
  ON transactions USING gin (vendor_key gin_trgm_ops)
  WHERE vendor_key IS NOT NULL AND is_manually_verified = true;

CREATE INDEX IF NOT EXISTS idx_transactions_categorization_status
  ON transactions(user_id, categorization_status)
  WHERE categorization_status IN ('pending','unmatched');

-- bank_statements: idempotency + extended status -----------------------------

ALTER TABLE bank_statements
  ADD COLUMN IF NOT EXISTS file_hash text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_statements_user_file_hash
  ON bank_statements(user_id, file_hash)
  WHERE file_hash IS NOT NULL;

ALTER TABLE bank_statements
  DROP CONSTRAINT IF EXISTS bank_statements_status_check;
ALTER TABLE bank_statements
  ADD CONSTRAINT bank_statements_status_check
  CHECK (status IN ('processing','parsed','categorizing','completed','failed'));

-- categorization_jobs --------------------------------------------------------

CREATE TABLE IF NOT EXISTS categorization_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statement_id uuid REFERENCES bank_statements(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','done','failed','dead')),
  shard_count int,
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categorization_jobs_pending
  ON categorization_jobs(status, created_at)
  WHERE status IN ('queued','running');

CREATE INDEX IF NOT EXISTS idx_categorization_jobs_statement
  ON categorization_jobs(statement_id);

ALTER TABLE categorization_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own jobs" ON categorization_jobs;
CREATE POLICY "users read own jobs" ON categorization_jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Worker uses service role and bypasses RLS; users only need read for UI.

-- merchant_cache -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS merchant_cache (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_key text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  hit_count int NOT NULL DEFAULT 1,
  source text NOT NULL DEFAULT 'observed'
    CHECK (source IN ('rule','manual','observed')),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, vendor_key)
);

CREATE INDEX IF NOT EXISTS idx_merchant_cache_user
  ON merchant_cache(user_id);

ALTER TABLE merchant_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own cache" ON merchant_cache;
CREATE POLICY "users read own cache" ON merchant_cache
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users write own cache" ON merchant_cache;
CREATE POLICY "users write own cache" ON merchant_cache
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- categorization_rules: composite index for hot-path lookup.
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_active
  ON categorization_rules(user_id, created_at)
  WHERE is_active = true;

-- Backfill merchant_cache from existing manually-verified transactions -------
-- The most-recent verified category wins per (user_id, vendor_key) pair.

INSERT INTO merchant_cache (user_id, vendor_key, category_id, hit_count, source, last_seen_at)
SELECT user_id, vendor_key, category_id, hits, 'manual', last_seen
FROM (
  SELECT
    t.user_id,
    t.vendor_key,
    t.category_id,
    COUNT(*) AS hits,
    MAX(t.updated_at) AS last_seen,
    ROW_NUMBER() OVER (
      PARTITION BY t.user_id, t.vendor_key
      ORDER BY MAX(t.updated_at) DESC
    ) AS rn
  FROM transactions t
  WHERE t.is_manually_verified = true
    AND t.vendor_key IS NOT NULL
    AND t.category_id IS NOT NULL
  GROUP BY t.user_id, t.vendor_key, t.category_id
) ranked
WHERE rn = 1
ON CONFLICT (user_id, vendor_key) DO NOTHING;

-- raven_find_similar: nearest-neighbor over manually-verified history ------
-- For each input vendor_key, returns the category_id of the user's most
-- similar manually-verified transaction, if similarity >= threshold.

CREATE OR REPLACE FUNCTION raven_find_similar(
  p_user_id uuid,
  p_vendor_keys text[],
  p_threshold real DEFAULT 0.6
)
RETURNS TABLE (vendor_key text, category_id uuid, similarity real)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT vk AS vendor_key, t.category_id, similarity(t.vendor_key, vk) AS similarity
  FROM unnest(p_vendor_keys) AS vk
  CROSS JOIN LATERAL (
    SELECT category_id, vendor_key
    FROM transactions
    WHERE user_id = p_user_id
      AND is_manually_verified = true
      AND category_id IS NOT NULL
      AND vendor_key IS NOT NULL
      AND vendor_key % vk
    ORDER BY similarity(vendor_key, vk) DESC
    LIMIT 1
  ) AS t
  WHERE similarity(t.vendor_key, vk) >= p_threshold;
$$;

REVOKE ALL ON FUNCTION raven_find_similar(uuid, text[], real) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION raven_find_similar(uuid, text[], real) TO authenticated, service_role;

-- Manual-verify feedback into merchant_cache --------------------------------
-- When a user manually verifies a transaction (or edits its category while
-- already verified), upsert the (vendor_key → category_id) mapping with
-- source='manual'. Worker-driven updates do NOT touch is_manually_verified,
-- so they don't trip this trigger.

CREATE OR REPLACE FUNCTION raven_feed_cache_from_manual()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_manually_verified
     AND NEW.category_id IS NOT NULL
     AND NEW.vendor_key IS NOT NULL
     AND (
       (TG_OP = 'INSERT')
       OR (OLD.is_manually_verified IS DISTINCT FROM NEW.is_manually_verified)
       OR (OLD.category_id IS DISTINCT FROM NEW.category_id)
     )
  THEN
    NEW.categorization_status := 'manual';
    INSERT INTO merchant_cache (user_id, vendor_key, category_id, source, last_seen_at, hit_count)
    VALUES (NEW.user_id, NEW.vendor_key, NEW.category_id, 'manual', now(), 1)
    ON CONFLICT (user_id, vendor_key) DO UPDATE
      SET category_id = EXCLUDED.category_id,
          source = 'manual',
          last_seen_at = now(),
          hit_count = merchant_cache.hit_count + 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transactions_manual_cache ON transactions;
CREATE TRIGGER trg_transactions_manual_cache
  BEFORE INSERT OR UPDATE OF category_id, is_manually_verified ON transactions
  FOR EACH ROW EXECUTE FUNCTION raven_feed_cache_from_manual();

-- updated_at trigger for jobs (mirrors existing pattern) ---------------------

CREATE OR REPLACE FUNCTION raven_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categorization_jobs_updated_at ON categorization_jobs;
CREATE TRIGGER trg_categorization_jobs_updated_at
  BEFORE UPDATE ON categorization_jobs
  FOR EACH ROW EXECUTE FUNCTION raven_touch_updated_at();

COMMENT ON TABLE categorization_jobs IS
  'Sharded-raven background jobs that categorize transactions for a statement.';
COMMENT ON TABLE merchant_cache IS
  'Per-user learned mapping from normalized vendor (vendor_key) to category. Fed by rules, manual corrections, and observed history.';
COMMENT ON COLUMN transactions.categorization_status IS
  'Why this transaction has its current category: rules | cache | similar | manual | unmatched | pending.';
COMMENT ON COLUMN transactions.vendor_key IS
  'Normalized vendor used by sharded-raven. Maintained by trigger; do not write directly.';
