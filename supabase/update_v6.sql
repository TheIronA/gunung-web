-- Migration v6: Philippines (PHP) Support
-- Run this in your Supabase SQL Editor

-- PHP prices stored in cents (2 decimal places)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_php INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price_php INTEGER;

-- Update Striker QC
UPDATE products SET
  price_php      = 730000,   -- ₱7,300 (was)
  sale_price_php = 620000    -- ₱6,200 (now)
WHERE id = 'striker-qc-green-malachite';

-- Update Jett QC
UPDATE products SET
  price_php      = 860000,   -- ₱8,600 (was)
  sale_price_php = 730000    -- ₱7,300 (now)
WHERE id = 'jett-qc';
