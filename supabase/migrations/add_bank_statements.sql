-- Add bank_statements table for tracking uploaded files
-- Compatible with simplified schema (no accounts table)
-- Run this in your Supabase SQL Editor

-- Create bank_statements table
CREATE TABLE IF NOT EXISTS public.bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  period_start DATE,
  period_end DATE,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  transactions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_bank_statements_user_id ON public.bank_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_upload_date ON public.bank_statements(upload_date DESC);

-- Enable Row Level Security
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own statements" ON public.bank_statements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload statements" ON public.bank_statements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their statements" ON public.bank_statements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their statements" ON public.bank_statements
  FOR DELETE USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.bank_statements IS 'Tracks uploaded bank statement files and their processing status';
