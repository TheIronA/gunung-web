-- Add is_active to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
  is_store_open BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO store_settings (id, is_store_open)
VALUES (1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read access to store_settings
CREATE POLICY "Store settings are viewable by everyone"
  ON store_settings FOR SELECT
  USING (true);

-- Only service role can update store_settings
CREATE POLICY "Service role can manage store_settings"
  ON store_settings FOR ALL
  USING (auth.role() = 'service_role');
