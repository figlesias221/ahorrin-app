-- Remove Category Hierarchy Migration
-- This migration removes the parent-child hierarchy system from categories
-- Created: 2025-10-16

BEGIN;

-- 1. Drop the category_stats view if it exists
DROP VIEW IF EXISTS public.category_stats CASCADE;

-- 2. Drop all hierarchy-related triggers
DROP TRIGGER IF EXISTS enforce_leaf_category_on_insert ON public.transactions;
DROP TRIGGER IF EXISTS enforce_leaf_category_on_update ON public.transactions;
DROP TRIGGER IF EXISTS validate_category_hierarchy_on_insert ON public.categories;
DROP TRIGGER IF EXISTS validate_category_hierarchy_on_update ON public.categories;

-- 3. Drop all hierarchy-related functions
DROP FUNCTION IF EXISTS public.validate_transaction_category() CASCADE;
DROP FUNCTION IF EXISTS public.validate_category_hierarchy() CASCADE;
DROP FUNCTION IF EXISTS public.category_has_children(UUID) CASCADE;

-- 4. Drop the old unique index that included parent_id
DROP INDEX IF EXISTS public.idx_categories_unique_name_per_parent;

-- 5. Drop the parent_id index
DROP INDEX IF EXISTS public.idx_categories_parent_id;

-- 6. Remove the parent_id column from categories table
ALTER TABLE public.categories DROP COLUMN IF EXISTS parent_id CASCADE;

-- 7. Create new unique index for category names (per user only)
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_unique_name_per_user
ON public.categories(user_id, name);

COMMIT;

-- Verify changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'categories'
ORDER BY ordinal_position;
