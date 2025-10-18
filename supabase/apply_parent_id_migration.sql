-- Apply parent_id migration to categories table
-- Copy and paste this into your Supabase SQL Editor

-- Step 1: Add parent_id column to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;

-- Step 2: Add index for performance when querying subcategories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- Step 3: Update unique constraint to allow same name for subcategories of different parents
-- Drop old constraint if exists
ALTER TABLE public.categories
DROP CONSTRAINT IF EXISTS categories_user_id_name_key;

-- Drop old unique constraint if exists
ALTER TABLE public.categories
DROP CONSTRAINT IF EXISTS categories_user_id_name_parent_unique;

-- Drop old unique index if exists
DROP INDEX IF EXISTS idx_categories_user_name_parent_unique;

-- Create unique index that includes parent_id (using COALESCE to handle NULLs)
CREATE UNIQUE INDEX idx_categories_user_name_parent_unique
ON public.categories (user_id, name, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Step 4: Function to prevent deep nesting (max 1 level: category -> subcategory)
CREATE OR REPLACE FUNCTION check_category_nesting_level()
RETURNS TRIGGER AS $$
BEGIN
  -- If this category has a parent
  IF NEW.parent_id IS NOT NULL THEN
    -- Check if the parent itself has a parent (which would make this a level 3)
    IF EXISTS (
      SELECT 1 FROM public.categories
      WHERE id = NEW.parent_id AND parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Cannot create subcategory: maximum nesting level is 1 (parent -> child only). The selected parent is already a subcategory.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger to enforce nesting level
DROP TRIGGER IF EXISTS trigger_check_category_nesting ON public.categories;

CREATE TRIGGER trigger_check_category_nesting
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_nesting_level();

-- Step 6: Add comments for documentation
COMMENT ON COLUMN public.categories.parent_id IS 'Reference to parent category. NULL for top-level categories, UUID for subcategories';
COMMENT ON FUNCTION check_category_nesting_level IS 'Prevents nesting beyond 1 level (category -> subcategory only)';
COMMENT ON INDEX idx_categories_user_name_parent_unique IS 'Ensures unique names within the same parent category or at top level';

-- Verification query
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'categories'
ORDER BY ordinal_position;
