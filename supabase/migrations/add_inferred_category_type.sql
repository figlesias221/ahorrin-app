-- Migration: Add inferred type to category_stats view
-- Categories now infer their type based on dominant transaction amount

-- Drop and recreate category_stats view with inferred type
DROP VIEW IF EXISTS public.category_stats CASCADE;

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
  -- Get transactions for leaf categories with type breakdown
  SELECT
    t.category_id,
    t.user_id,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense_amount,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income_amount
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
    COALESCE(SUM(lt.total_amount), 0)::DECIMAL(12,2) as total_amount,
    COALESCE(SUM(lt.expense_amount), 0)::DECIMAL(12,2) as expense_amount,
    COALESCE(SUM(lt.income_amount), 0)::DECIMAL(12,2) as income_amount
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
  COALESCE(ast.expense_amount, 0) as expense_amount,
  COALESCE(ast.income_amount, 0) as income_amount,
  -- Infer type based on dominant amount
  CASE
    WHEN COALESCE(ast.expense_amount, 0) > COALESCE(ast.income_amount, 0) THEN 'expense'
    WHEN COALESCE(ast.income_amount, 0) > COALESCE(ast.expense_amount, 0) THEN 'income'
    ELSE NULL  -- No transactions or equal amounts
  END as inferred_type,
  public.category_has_children(c.id) as has_children
FROM public.categories c
LEFT JOIN aggregated_stats ast ON c.id = ast.category_id;

GRANT SELECT ON public.category_stats TO authenticated;
ALTER VIEW public.category_stats SET (security_invoker = true);

COMMENT ON VIEW public.category_stats IS 'Category statistics with inferred type based on dominant transaction amount (expense vs income)';
