-- Migration: Restrict transactions on parent categories
-- Only leaf categories (without children) can have transactions

-- Step 1: Create a function to check if a category has children
CREATE OR REPLACE FUNCTION public.category_has_children(category_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.categories
    WHERE parent_id = category_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 2: Create a function to validate transaction category
CREATE OR REPLACE FUNCTION public.validate_transaction_category()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the category is a parent category (has children)
  IF public.category_has_children(NEW.category_id) THEN
    RAISE EXCEPTION 'Cannot assign transactions to parent categories. Please use a subcategory instead.'
      USING HINT = 'Parent categories can only show aggregated totals from their subcategories';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Add trigger to enforce the rule on INSERT
CREATE TRIGGER enforce_leaf_category_on_insert
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_transaction_category();

-- Step 4: Add trigger to enforce the rule on UPDATE
CREATE TRIGGER enforce_leaf_category_on_update
  BEFORE UPDATE OF category_id ON public.transactions
  FOR EACH ROW
  WHEN (OLD.category_id IS DISTINCT FROM NEW.category_id)
  EXECUTE FUNCTION public.validate_transaction_category();

-- Step 5: Create a function to prevent creating subcategories under categories with transactions
CREATE OR REPLACE FUNCTION public.validate_category_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a subcategory (has parent_id)
  IF NEW.parent_id IS NOT NULL THEN
    -- Check if parent has any transactions
    IF EXISTS (
      SELECT 1 FROM public.transactions
      WHERE category_id = NEW.parent_id
    ) THEN
      RAISE EXCEPTION 'Cannot create subcategories under a category that has transactions assigned.'
        USING HINT = 'Please reassign or delete transactions from the parent category first';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Add trigger to validate category hierarchy on INSERT
CREATE TRIGGER validate_category_hierarchy_on_insert
  BEFORE INSERT ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_category_hierarchy();

-- Step 7: Add trigger to validate category hierarchy on UPDATE
CREATE TRIGGER validate_category_hierarchy_on_update
  BEFORE UPDATE OF parent_id ON public.categories
  FOR EACH ROW
  WHEN (OLD.parent_id IS DISTINCT FROM NEW.parent_id)
  EXECUTE FUNCTION public.validate_category_hierarchy();

-- Step 8: Create a view for category statistics with aggregation
CREATE OR REPLACE VIEW public.category_stats AS
WITH RECURSIVE category_tree AS (
  -- Base case: all categories
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.parent_id,
    c.type,
    ARRAY[c.id] as path
  FROM public.categories c

  UNION ALL

  -- Recursive case: build the tree
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.parent_id,
    c.type,
    ct.path || c.id
  FROM public.categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
),
leaf_transactions AS (
  -- Get transactions for leaf categories only
  SELECT
    t.category_id,
    t.user_id,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount
  FROM public.transactions t
  WHERE t.is_ignored = false
  GROUP BY t.category_id, t.user_id
),
aggregated_stats AS (
  -- Aggregate stats up the tree
  SELECT
    ct.id as category_id,
    ct.user_id,
    COALESCE(SUM(lt.transaction_count), 0)::INTEGER as total_transactions,
    COALESCE(SUM(lt.total_amount), 0)::DECIMAL(12,2) as total_amount
  FROM category_tree ct
  LEFT JOIN category_tree ct_descendants ON ct.id = ANY(ct_descendants.path)
  LEFT JOIN leaf_transactions lt ON ct_descendants.id = lt.category_id AND ct.user_id = lt.user_id
  GROUP BY ct.id, ct.user_id
)
SELECT
  c.id,
  c.user_id,
  c.name,
  c.description,
  c.color,
  c.icon,
  c.type,
  c.is_active,
  c.parent_id,
  c.created_at,
  c.updated_at,
  COALESCE(ast.total_transactions, 0) as transaction_count,
  COALESCE(ast.total_amount, 0) as total_amount,
  public.category_has_children(c.id) as has_children
FROM public.categories c
LEFT JOIN aggregated_stats ast ON c.id = ast.category_id;

-- Step 9: Grant access to the view
ALTER VIEW public.category_stats OWNER TO postgres;
GRANT SELECT ON public.category_stats TO authenticated;

-- Step 10: Add RLS policy for the view
ALTER VIEW public.category_stats SET (security_invoker = true);

COMMENT ON VIEW public.category_stats IS 'Aggregated statistics for categories including recursive totals from subcategories';
COMMENT ON FUNCTION public.category_has_children(UUID) IS 'Returns true if the category has any subcategories';
COMMENT ON FUNCTION public.validate_transaction_category() IS 'Ensures transactions can only be assigned to leaf categories';
COMMENT ON FUNCTION public.validate_category_hierarchy() IS 'Prevents creating subcategories under categories with transactions';
