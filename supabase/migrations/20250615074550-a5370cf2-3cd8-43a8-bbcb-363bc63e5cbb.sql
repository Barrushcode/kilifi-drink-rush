
-- Add image_url column to products table if it does not exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
