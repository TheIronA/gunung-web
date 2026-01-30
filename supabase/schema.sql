-- Gunung Store Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create order status enum
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  image TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'myr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product sizes table (for products with variants)
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  shipping_address JSONB,
  total_amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'myr',
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- Price in cents
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_sizes_updated_at
  BEFORE UPDATE ON product_sizes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to decrease stock when order is placed
CREATE OR REPLACE FUNCTION decrease_stock(
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Get current stock
  SELECT stock INTO current_stock
  FROM product_sizes
  WHERE product_id = p_product_id AND size = p_size
  FOR UPDATE;

  -- Check if enough stock
  IF current_stock IS NULL OR current_stock < p_quantity THEN
    RETURN FALSE;
  END IF;

  -- Decrease stock
  UPDATE product_sizes
  SET stock = stock - p_quantity
  WHERE product_id = p_product_id AND size = p_size;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access to products (anyone can view)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Product sizes are viewable by everyone"
  ON product_sizes FOR SELECT
  USING (true);

-- Only service role can insert/update/delete products
CREATE POLICY "Service role can manage products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage product sizes"
  ON product_sizes FOR ALL
  USING (auth.role() = 'service_role');

-- Service role can manage all orders (for webhooks)
CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage order items"
  ON order_items FOR ALL
  USING (auth.role() = 'service_role');

-- Insert initial product data (from your current products)
INSERT INTO products (id, name, description, details, price, image, currency) VALUES
(
  'striker-qc-green-malachite',
  'STRIKER QC (Green Malachite)',
  'High-performance climbing shoes with precision fit and superior grip.',
  'The STRIKER QC in Green Malachite combines aggressive downturn with exceptional edging performance. Featuring a quick-closure system for easy on/off, sticky rubber outsole for maximum friction, and a snug fit that molds to your foot for precision on technical routes.',
  45999,
  'https://www.ocun.com/assets/products/1_700x700/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1-.jpg',
  'myr'
),
(
  'jett-qc',
  'JETT QC',
  'Versatile all-day climbing shoe perfect for gym and outdoor routes.',
  'The JETT QC is designed for climbers who demand comfort without sacrificing performance. With a moderate downturn and breathable upper, these shoes excel on long climbing sessions. The quick-closure system ensures a secure fit, while the durable rubber rand provides protection and longevity.',
  52999,
  'https://www.ocun.com/assets/products/1_700x700/o4itpyk884.04041-Jett-QC-1.jpg',
  'myr'
),
(
  'gunung-ascent-tee',
  'Gunung Ascent Tee',
  'Premium cotton blend t-shirt designed for comfort on and off the crag.',
  'The Gunung Ascent Tee is crafted from a breathable, heavyweight cotton blend that stands up to the abrasion of the rock while keeping you cool. Featuring a relaxed fit for unrestricted movement and our signature mountain motif on the back.',
  3500,
  '/gunung-tee-placeholder.png',
  'myr'
),
(
  'gunung-chalk-bag',
  'Gunung Chalk Bag',
  'Hand-stitched chalk bag with fleece lining and secure closure.',
  'Keep your hands dry and your focus sharp. Our chalk bag features a stiffened rim for easy access, a soft fleece lining to hold chalk effectively, and a tight closure system to prevent spills in your pack. Includes a brush loop and waist belt.',
  8900,
  '/gunung-chalkbag-placeholder.png',
  'myr'
);

-- Insert size data for products with variants
INSERT INTO product_sizes (product_id, size, stock) VALUES
('striker-qc-green-malachite', 'UK 5', 1),
('striker-qc-green-malachite', 'UK 5.5', 1),
('striker-qc-green-malachite', 'UK 6', 2),
('striker-qc-green-malachite', 'UK 6.5', 2),
('striker-qc-green-malachite', 'UK 7', 2),
('striker-qc-green-malachite', 'UK 7.5', 2),
('striker-qc-green-malachite', 'UK 8', 1),
('striker-qc-green-malachite', 'UK 8.5', 1),
('striker-qc-green-malachite', 'UK 9', 1),
('jett-qc', 'UK 5', 1),
('jett-qc', 'UK 6', 1),
('jett-qc', 'UK 6.5', 2),
('jett-qc', 'UK 7', 1),
('jett-qc', 'UK 7.5', 1),
('jett-qc', 'UK 8', 1),
('jett-qc', 'UK 8.5', 1),
('jett-qc', 'UK 9', 1);
