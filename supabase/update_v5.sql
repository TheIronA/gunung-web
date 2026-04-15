-- Migration v5: Multi-currency pricing (IDR & SGD)
-- Run this in your Supabase SQL Editor

-- IDR prices stored as whole rupiah (no cents — IDR doesn't use sub-units)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_idr INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price_idr INTEGER;

-- SGD prices stored in cents (same convention as MYR price column)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_sgd INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price_sgd INTEGER;

-- Populate existing products with known prices
-- price = original/crossed-out price, sale_price = current selling price
UPDATE products SET
  price         = 46999,      -- RM 469.99 (was)
  sale_price    = 39900,      -- RM 399.00 (now)
  price_idr     = 2350000,    -- Rp 2.350.000 (was)
  sale_price_idr = 2000000,   -- Rp 2.000.000 (now)
  price_sgd     = 14900,      -- SGD 149.00 (was)
  sale_price_sgd = 13000      -- SGD 130.00 (now)
WHERE id = 'striker-qc-green-malachite';

UPDATE products SET
  price         = 52999,      -- RM 529.99 (was)
  sale_price    = 46900,      -- RM 469.00 (now)
  price_idr     = 2585000,    -- Rp 2.585.000 (was)
  sale_price_idr = 2200000,   -- Rp 2.200.000 (now)
  price_sgd     = 16900,      -- SGD 169.00 (was)
  sale_price_sgd = 15300      -- SGD 153.00 (now)
WHERE id = 'jett-qc';
