-- Migration: Add product metadata for climbing shoes
-- Version: v3
-- Date: 2026-02-02

-- Add foot_type_narrow column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS foot_type_narrow BOOLEAN DEFAULT FALSE;

-- Add foot_type_regular column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS foot_type_regular BOOLEAN DEFAULT FALSE;

-- Add foot_type_wide column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS foot_type_wide BOOLEAN DEFAULT FALSE;

-- Add toe_type_egyptian column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS toe_type_egyptian BOOLEAN DEFAULT FALSE;

-- Add toe_type_roman column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS toe_type_roman BOOLEAN DEFAULT FALSE;

-- Add toe_type_greek column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS toe_type_greek BOOLEAN DEFAULT FALSE;

-- Add terrain_rocks column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS terrain_rocks BOOLEAN DEFAULT FALSE;

-- Add terrain_boulder column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS terrain_boulder BOOLEAN DEFAULT FALSE;

-- Add terrain_multipitch column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS terrain_multipitch BOOLEAN DEFAULT FALSE;

-- Add terrain_indoor column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS terrain_indoor BOOLEAN DEFAULT FALSE;

-- Add last_type column (text) - e.g., "Entratic", "All-round", etc.
ALTER TABLE products
ADD COLUMN IF NOT EXISTS last_type TEXT NULL;

-- Add rubber_type column (text) - e.g., "CAT 1.1", "CAT 1.5", etc.
ALTER TABLE products
ADD COLUMN IF NOT EXISTS rubber_type TEXT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.foot_type_narrow IS 'Suitable for narrow feet';
COMMENT ON COLUMN products.foot_type_regular IS 'Suitable for regular width feet';
COMMENT ON COLUMN products.foot_type_wide IS 'Suitable for wide feet';
COMMENT ON COLUMN products.toe_type_egyptian IS 'Suitable for Egyptian toe shape';
COMMENT ON COLUMN products.toe_type_roman IS 'Suitable for Roman toe shape';
COMMENT ON COLUMN products.toe_type_greek IS 'Suitable for Greek toe shape';
COMMENT ON COLUMN products.terrain_rocks IS 'Suitable for rock climbing';
COMMENT ON COLUMN products.terrain_boulder IS 'Suitable for bouldering';
COMMENT ON COLUMN products.terrain_multipitch IS 'Suitable for multipitch climbing';
COMMENT ON COLUMN products.terrain_indoor IS 'Suitable for indoor/gym climbing';
COMMENT ON COLUMN products.last_type IS 'Type of shoe last (e.g., Entratic, All-round)';
COMMENT ON COLUMN products.rubber_type IS 'Type of rubber sole (e.g., CAT 1.1, CAT 1.5)';
