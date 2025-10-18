-- Create categorization_rules table
CREATE TABLE IF NOT EXISTS public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_pattern TEXT NOT NULL,
  amount_min DECIMAL(15, 2),
  amount_max DECIMAL(15, 2),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS categorization_rules_user_id_idx ON public.categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS categorization_rules_category_id_idx ON public.categorization_rules(category_id);
CREATE INDEX IF NOT EXISTS categorization_rules_priority_idx ON public.categorization_rules(priority DESC);
CREATE INDEX IF NOT EXISTS categorization_rules_active_idx ON public.categorization_rules(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own categorization rules"
  ON public.categorization_rules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categorization rules"
  ON public.categorization_rules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorization rules"
  ON public.categorization_rules
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorization rules"
  ON public.categorization_rules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categorization_rules_updated_at
  BEFORE UPDATE ON public.categorization_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
