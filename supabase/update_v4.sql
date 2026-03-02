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
