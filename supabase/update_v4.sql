-- Migration v4: Business dashboard additions
-- Run this in your Supabase SQL Editor

-- 1. Add cost_price to products (for profit tracking)
--    Nullable — profit is only calculated when set
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price INTEGER;

-- 2. Allow manual (in-person) orders by making stripe_session_id nullable
--    and adding a source column to distinguish online vs in-person sales
ALTER TABLE orders ALTER COLUMN stripe_session_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'online';
-- source values: 'online' (Stripe) | 'in_person' (manually recorded)

-- 3. Order adjustments table
--    Tracks manual price changes (discounts, surcharges) separately from
--    the original total_amount, preserving the payment audit trail.
--    Effective order total = orders.total_amount + SUM(order_adjustments.amount)
CREATE TABLE IF NOT EXISTS order_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in cents; negative = discount, positive = surcharge
  reason TEXT,             -- e.g. "Friend discount", "Promo code", "Manual correction"
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_adjustments_order_id ON order_adjustments(order_id);

-- RLS: service role only (same pattern as orders)
ALTER TABLE order_adjustments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage order adjustments" ON order_adjustments;
CREATE POLICY "Service role can manage order adjustments"
  ON order_adjustments FOR ALL
  USING (auth.role() = 'service_role');

-- 4. Add cost_price per size variant for granular profit tracking
--    Each individual size (pair) can have its own cost, since batches/sizes
--    may be sourced at different prices. Falls back to products.cost_price
--    in profit calculations when no size-level cost is set.
ALTER TABLE product_sizes ADD COLUMN IF NOT EXISTS cost_price INTEGER;

-- 5. Per-order-item cost override for historical profit accuracy
--    Lets you record what a specific pair actually cost in that order,
--    independent of the current product_sizes.cost_price value.
--    Takes priority over size/product-level cost in profit calculations.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_cost INTEGER;
