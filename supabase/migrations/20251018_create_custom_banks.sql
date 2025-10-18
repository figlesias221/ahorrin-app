-- Create custom_banks table for user-defined bank institutions
-- This allows users to add banks beyond the predefined ones

-- ========================================
-- TABLE: custom_banks
-- ========================================
CREATE TABLE IF NOT EXISTS public.custom_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX idx_custom_banks_user_id ON public.custom_banks(user_id);
CREATE INDEX idx_custom_banks_user_name ON public.custom_banks(user_id, name);

-- ========================================
-- Row Level Security (RLS)
-- ========================================
ALTER TABLE public.custom_banks ENABLE ROW LEVEL SECURITY;

-- Users can view own custom banks
CREATE POLICY "Users can view own custom banks" ON public.custom_banks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create own custom banks
CREATE POLICY "Users can create own custom banks" ON public.custom_banks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own custom banks
CREATE POLICY "Users can update own custom banks" ON public.custom_banks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own custom banks
CREATE POLICY "Users can delete own custom banks" ON public.custom_banks
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- Trigger for updated_at
-- ========================================
CREATE TRIGGER set_updated_at_custom_banks
  BEFORE UPDATE ON public.custom_banks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- Comments
-- ========================================
COMMENT ON TABLE public.custom_banks IS 'User-defined custom bank institutions beyond the predefined ones';
COMMENT ON COLUMN public.custom_banks.name IS 'Internal unique name for the bank';
COMMENT ON COLUMN public.custom_banks.display_name IS 'Display name shown in selectors and UI';
COMMENT ON COLUMN public.custom_banks.color IS 'Brand color in hex format for visual identification';
