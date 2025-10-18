-- Migration: Add custom_banks table for user-defined banks
-- Users can add custom bank options in the upload page

CREATE TABLE IF NOT EXISTS public.custom_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique bank names per user
  CONSTRAINT custom_banks_user_name_key UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.custom_banks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own custom banks"
  ON public.custom_banks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom banks"
  ON public.custom_banks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom banks"
  ON public.custom_banks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom banks"
  ON public.custom_banks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_custom_banks_user_id ON public.custom_banks(user_id);
CREATE INDEX idx_custom_banks_name ON public.custom_banks(name);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_banks TO authenticated;

-- Comments
COMMENT ON TABLE public.custom_banks IS 'User-defined custom banks for statement uploads';
COMMENT ON COLUMN public.custom_banks.name IS 'Internal bank name (unique per user)';
COMMENT ON COLUMN public.custom_banks.display_name IS 'Display name shown in UI';
COMMENT ON COLUMN public.custom_banks.color IS 'Hex color code for bank identification';
