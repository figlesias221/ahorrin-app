-- Fix subcategories support migration
-- This fixes the UNIQUE constraint issue and ensures parent_id column exists

-- Add parent_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE public.categories
    ADD COLUMN parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;

    RAISE NOTICE 'Added parent_id column';
  ELSE
    RAISE NOTICE 'parent_id column already exists';
  END IF;
END $$;

-- Add index for performance when querying subcategories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- Drop old constraints if they exist
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_user_id_name_key;
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_user_id_name_parent_unique;

-- Create a UNIQUE INDEX instead of CONSTRAINT to handle COALESCE properly
-- This allows same category name for different parents or at top level
DROP INDEX IF EXISTS idx_categories_unique_name_per_parent;

CREATE UNIQUE INDEX idx_categories_unique_name_per_parent
ON public.categories(user_id, name, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Function to prevent deep nesting (max 1 level: category -> subcategory)
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

-- Create trigger to enforce nesting level
DROP TRIGGER IF EXISTS trigger_check_category_nesting ON public.categories;

CREATE TRIGGER trigger_check_category_nesting
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_nesting_level();

-- Comments for documentation
COMMENT ON COLUMN public.categories.parent_id IS 'Reference to parent category. NULL for top-level categories, UUID for subcategories';
COMMENT ON FUNCTION check_category_nesting_level IS 'Prevents nesting beyond 1 level (category -> subcategory only)';
COMMENT ON INDEX idx_categories_unique_name_per_parent IS 'Ensures unique names within the same parent category or at top level';
