-- Drop orphaned trigger that references removed parent_id column
-- This trigger was left behind when parent_id was removed in remove_category_hierarchy.sql

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_check_category_nesting ON public.categories;

-- Drop the function
DROP FUNCTION IF EXISTS check_category_nesting_level();
