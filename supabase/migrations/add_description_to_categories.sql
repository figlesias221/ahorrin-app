-- Migration: Add description field to categories table
-- Purpose: Allow users to add optional descriptions to their categories

-- Add description column to categories (nullable for backwards compatibility)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

-- Add comment
COMMENT ON COLUMN categories.description IS 'Optional description for the category';
