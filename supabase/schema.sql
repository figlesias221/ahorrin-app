-- Ahorrín Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts table (bank accounts)
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  account_number TEXT,
  currency TEXT DEFAULT 'UYU',
  initial_balance DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL NOT NULL,
  date DATE NOT NULL,
  vendor TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  is_manually_verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, period, start_date)
);

-- Categorization rules table (for auto-categorization)
CREATE TABLE public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_pattern TEXT NOT NULL,
  amount_min DECIMAL(12, 2),
  amount_max DECIMAL(12, 2),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank statements uploads table
CREATE TABLE public.bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  period_start DATE,
  period_end DATE,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  transactions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);

-- Unique index for category names per user
CREATE UNIQUE INDEX idx_categories_unique_name_per_user
ON public.categories(user_id, name);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can view their own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON public.accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" ON public.accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view their own budgets" ON public.budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" ON public.budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON public.budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON public.budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Categorization rules policies
CREATE POLICY "Users can view their own rules" ON public.categorization_rules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules" ON public.categorization_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules" ON public.categorization_rules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules" ON public.categorization_rules
  FOR DELETE USING (auth.uid() = user_id);

-- Bank statements policies
CREATE POLICY "Users can view their own statements" ON public.bank_statements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload statements" ON public.bank_statements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their statements" ON public.bank_statements
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_accounts
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_transactions
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_budgets
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_rules
  BEFORE UPDATE ON public.categorization_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
