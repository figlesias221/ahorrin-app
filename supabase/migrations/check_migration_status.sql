-- Migration Status Check
-- Run this to see what's already done and what's missing

-- 1. Check existing tables
SELECT
  'Tables' as check_type,
  table_name,
  'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('categories', 'transactions', 'bank_statements', 'categorization_rules')
ORDER BY table_name;

-- 2. Check transactions columns
SELECT
  'Transactions Columns' as check_type,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'transactions'
  AND column_name IN ('currency', 'statement_id')
ORDER BY column_name;

-- 3. Check bank_statements columns
SELECT
  'Bank Statements Columns' as check_type,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'bank_statements'
  AND column_name IN ('format', 'bank', 'currency')
ORDER BY column_name;

-- 4. Check categorization_rules structure
SELECT
  'Categorization Rules Columns' as check_type,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'categorization_rules'
ORDER BY ordinal_position;

-- 5. Check constraints
SELECT
  'Constraints' as check_type,
  conname as constraint_name,
  conrelid::regclass as table_name
FROM pg_constraint
WHERE conname LIKE '%currency%' OR conname LIKE '%statement%'
ORDER BY conrelid::regclass::text;

-- 6. Check indexes
SELECT
  'Indexes' as check_type,
  indexname,
  tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND (indexname LIKE '%statement%' OR indexname LIKE '%dedup%')
ORDER BY tablename, indexname;
