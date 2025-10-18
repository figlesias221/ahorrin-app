-- Migration: Remove type from categories
-- Categories will now be independent of income/expense type
-- The type is determined only by transactions

-- ========================================
-- Step 1: Drop dependent views first
-- ========================================
DROP VIEW IF EXISTS public.monthly_category_summary CASCADE;
DROP VIEW IF EXISTS public.category_stats CASCADE;

-- ========================================
-- Step 2: Drop the unique constraint that includes type
-- ========================================
ALTER TABLE public.categories
DROP CONSTRAINT IF EXISTS categories_user_id_name_type_key;

-- ========================================
-- Step 3: Remove the type column
-- ========================================
ALTER TABLE public.categories
DROP COLUMN IF EXISTS type;

-- ========================================
-- Step 3: Add new unique constraint without type
-- ========================================
ALTER TABLE public.categories
ADD CONSTRAINT categories_user_id_name_key UNIQUE(user_id, name);

-- ========================================
-- Step 4: Recreate category_stats view without type
-- ========================================
CREATE OR REPLACE VIEW public.category_stats AS
WITH RECURSIVE category_tree AS (
  -- Base case: all categories
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.parent_id,
    ARRAY[c.id] as path
  FROM public.categories c

  UNION ALL

  -- Recursive case: build the tree
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.parent_id,
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
  c.is_active,
  c.parent_id,
  c.created_at,
  c.updated_at,
  COALESCE(ast.total_transactions, 0) as transaction_count,
  COALESCE(ast.total_amount, 0) as total_amount,
  public.category_has_children(c.id) as has_children
FROM public.categories c
LEFT JOIN aggregated_stats ast ON c.id = ast.category_id;

GRANT SELECT ON public.category_stats TO authenticated;
ALTER VIEW public.category_stats SET (security_invoker = true);

-- ========================================
-- Step 5: Recreate monthly_category_summary view
-- Remove category_type, keep transaction_type
-- ========================================
CREATE OR REPLACE VIEW public.monthly_category_summary AS
SELECT
  t.user_id,
  c.id as category_id,
  c.name as category_name,
  c.color as category_color,
  t.type as transaction_type,
  DATE_TRUNC('month', t.date) as month,
  EXTRACT(YEAR FROM t.date) as year,
  EXTRACT(MONTH FROM t.date) as month_number,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE -t.amount END) as net_amount,
  COUNT(*) as transaction_count
FROM public.transactions t
INNER JOIN public.categories c ON t.category_id = c.id
WHERE t.is_ignored = false
GROUP BY t.user_id, c.id, c.name, c.color, t.type, DATE_TRUNC('month', t.date), EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)
ORDER BY month DESC, net_amount DESC;

GRANT SELECT ON public.monthly_category_summary TO authenticated;
ALTER VIEW public.monthly_category_summary SET (security_invoker = on);

-- ========================================
-- Step 6: Drop and recreate get_category_summary function
-- ========================================
DROP FUNCTION IF EXISTS public.get_category_summary(date, date);

CREATE OR REPLACE FUNCTION public.get_category_summary(
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_color TEXT,
  total_expenses DECIMAL,
  total_income DECIMAL,
  net_amount DECIMAL,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.color,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)::DECIMAL as total_expenses,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)::DECIMAL as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE -t.amount END)::DECIMAL as net_amount,
    COUNT(*)::BIGINT as transaction_count
  FROM public.transactions t
  INNER JOIN public.categories c ON t.category_id = c.id
  WHERE t.user_id = auth.uid()
    AND t.is_ignored = false
    AND (start_date IS NULL OR t.date >= start_date)
    AND (end_date IS NULL OR t.date <= end_date)
  GROUP BY c.id, c.name, c.color
  ORDER BY net_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Step 7: Update comments
-- ========================================
COMMENT ON TABLE public.categories IS 'User categories (type-independent, determined by transactions)';
COMMENT ON VIEW public.category_stats IS 'Aggregated statistics for categories including recursive totals from subcategories';
COMMENT ON VIEW public.monthly_category_summary IS 'Monthly summary by category with net amounts (expenses - income), excluding ignored transactions';
