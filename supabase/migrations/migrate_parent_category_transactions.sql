-- Migration Script: Move transactions from parent categories to subcategories
-- Run this BEFORE applying restrict_parent_category_transactions.sql

-- This script handles transactions assigned to parent categories by:
-- 1. Creating a "General" subcategory if needed
-- 2. Moving transactions to the general subcategory
-- 3. Logging all changes for audit

-- Step 1: Create a temporary table to log migration actions
CREATE TEMP TABLE IF NOT EXISTS migration_log (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  parent_category_id UUID,
  parent_category_name TEXT,
  new_subcategory_id UUID,
  new_subcategory_name TEXT,
  transactions_moved INTEGER,
  migration_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: For each parent category with transactions, create a "General" subcategory
DO $$
DECLARE
  parent_cat RECORD;
  new_subcat_id UUID;
  tx_count INTEGER;
BEGIN
  -- Find all parent categories that have transactions
  FOR parent_cat IN
    SELECT DISTINCT
      c.id,
      c.user_id,
      c.name,
      c.color,
      c.type,
      COUNT(t.id) as transaction_count
    FROM public.categories c
    INNER JOIN public.transactions t ON t.category_id = c.id
    WHERE EXISTS (
      SELECT 1 FROM public.categories child
      WHERE child.parent_id = c.id
    )
    AND t.is_ignored = false
    GROUP BY c.id, c.user_id, c.name, c.color, c.type
  LOOP
    RAISE NOTICE 'Processing parent category: % (% transactions)', parent_cat.name, parent_cat.transaction_count;

    -- Check if "General" subcategory already exists
    SELECT id INTO new_subcat_id
    FROM public.categories
    WHERE parent_id = parent_cat.id
      AND name = 'General'
      AND user_id = parent_cat.user_id;

    -- If not, create it
    IF new_subcat_id IS NULL THEN
      INSERT INTO public.categories (
        user_id,
        name,
        description,
        color,
        type,
        is_active,
        parent_id
      )
      VALUES (
        parent_cat.user_id,
        'General',
        'Gastos generales de ' || parent_cat.name || ' (migrados automáticamente)',
        parent_cat.color,
        parent_cat.type,
        true,
        parent_cat.id
      )
      RETURNING id INTO new_subcat_id;

      RAISE NOTICE 'Created new subcategory "General" with id: %', new_subcat_id;
    ELSE
      RAISE NOTICE 'Using existing "General" subcategory with id: %', new_subcat_id;
    END IF;

    -- Move transactions from parent to the subcategory
    UPDATE public.transactions
    SET category_id = new_subcat_id
    WHERE category_id = parent_cat.id
      AND is_ignored = false;

    GET DIAGNOSTICS tx_count = ROW_COUNT;

    -- Log the migration
    INSERT INTO migration_log (
      user_id,
      parent_category_id,
      parent_category_name,
      new_subcategory_id,
      new_subcategory_name,
      transactions_moved
    )
    VALUES (
      parent_cat.user_id,
      parent_cat.id,
      parent_cat.name,
      new_subcat_id,
      'General',
      tx_count
    );

    RAISE NOTICE 'Moved % transactions from "%" to "General" subcategory', tx_count, parent_cat.name;
  END LOOP;

  RAISE NOTICE 'Migration completed successfully!';
END $$;

-- Step 3: Display migration summary
DO $$
DECLARE
  total_categories INTEGER;
  total_transactions INTEGER;
BEGIN
  SELECT COUNT(*), SUM(transactions_moved)
  INTO total_categories, total_transactions
  FROM migration_log;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total parent categories processed: %', COALESCE(total_categories, 0);
  RAISE NOTICE 'Total transactions migrated: %', COALESCE(total_transactions, 0);
  RAISE NOTICE '========================================';

  IF total_categories > 0 THEN
    RAISE NOTICE 'Details:';
    FOR rec IN
      SELECT
        parent_category_name,
        new_subcategory_name,
        transactions_moved
      FROM migration_log
      ORDER BY parent_category_name
    LOOP
      RAISE NOTICE '  % -> % : % transactions',
        rec.parent_category_name,
        rec.new_subcategory_name,
        rec.transactions_moved;
    END LOOP;
  END IF;

  RAISE NOTICE '========================================';
END $$;

-- Step 4: Verify migration
DO $$
DECLARE
  parent_with_tx INTEGER;
BEGIN
  -- Check if any parent categories still have transactions
  SELECT COUNT(DISTINCT c.id)
  INTO parent_with_tx
  FROM public.categories c
  INNER JOIN public.transactions t ON t.category_id = c.id
  WHERE EXISTS (
    SELECT 1 FROM public.categories child
    WHERE child.parent_id = c.id
  );

  IF parent_with_tx > 0 THEN
    RAISE WARNING 'Warning: % parent categories still have transactions assigned', parent_with_tx;
    RAISE WARNING 'Please review and manually migrate these transactions before applying the restriction';
  ELSE
    RAISE NOTICE 'Verification successful: No parent categories have transactions';
    RAISE NOTICE 'You can now safely apply restrict_parent_category_transactions.sql';
  END IF;
END $$;

-- Save migration log to a permanent table (optional, for audit)
-- Uncomment if you want to keep a permanent record
/*
CREATE TABLE IF NOT EXISTS public.category_migration_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  parent_category_id UUID,
  parent_category_name TEXT,
  new_subcategory_id UUID,
  new_subcategory_name TEXT,
  transactions_moved INTEGER,
  migration_timestamp TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.category_migration_logs
SELECT * FROM migration_log;
*/

COMMENT ON SCRIPT IS 'Migrates transactions from parent categories to new "General" subcategories';
