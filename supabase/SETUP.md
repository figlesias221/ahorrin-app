# Database Setup Instructions

## Step 1: Apply Base Schema

Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql/new):

```sql
-- Copy and paste the entire contents of schema.sql
```

Or use the command:
```bash
cat supabase/schema.sql
```

## Step 2: Apply the Profile Creation Fix

After the base schema is applied, run:

```sql
-- Copy and paste the contents of migrations/fix_profile_creation_trigger.sql
```

Or use:
```bash
cat supabase/migrations/fix_profile_creation_trigger.sql
```

## Quick Setup (All at Once)

You can also combine both files:

```bash
# View combined schema
cat supabase/schema.sql supabase/migrations/fix_profile_creation_trigger.sql
```

Then copy the entire output to your Supabase SQL Editor and execute.

## Verify Setup

After running the schema, verify with:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see: profiles, categories, accounts, transactions, budgets, categorization_rules, bank_statements
