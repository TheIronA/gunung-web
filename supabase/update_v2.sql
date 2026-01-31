-- Migration: Add sale price functionality to products table
-- Version: v2
-- Date: 2026-01-31

-- Add sale_price column (nullable, in cents like the price column)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sale_price INTEGER NULL;

-- Add sale_end_date column for future time-based sales
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMPTZ NULL;

-- Add index for efficient querying of products on sale
CREATE INDEX IF NOT EXISTS idx_products_sale_price
ON products(sale_price)
WHERE sale_price IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.sale_price IS 'Sale price in cents. NULL means no active sale.';
COMMENT ON COLUMN products.sale_end_date IS 'Optional end date for sale. NULL means no expiration.';
