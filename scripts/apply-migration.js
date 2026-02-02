/**
 * Script to add new columns to the products table
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🚀 Applying schema migration...\n');

  const sql = `
-- Add foot_type columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS foot_type_narrow BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS foot_type_regular BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS foot_type_wide BOOLEAN DEFAULT FALSE;

-- Add toe_type columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS toe_type_egyptian BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS toe_type_roman BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS toe_type_greek BOOLEAN DEFAULT FALSE;

-- Add terrain columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS terrain_rocks BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS terrain_boulder BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS terrain_multipitch BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS terrain_indoor BOOLEAN DEFAULT FALSE;

-- Add technical spec columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_type TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rubber_type TEXT;
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Error applying migration:', error.message);
    console.log('\n⚠️  Please run the SQL from supabase/update_v3.sql manually in your Supabase SQL Editor');
    console.log('   Dashboard: https://app.supabase.com/project/japmjlgtuvplooelwfqh/sql');
  } else {
    console.log('✅ Migration applied successfully!');
  }
}

applyMigration().catch((err) => {
  console.error('Error:', err);
  console.log('\n⚠️  Please run the SQL from supabase/update_v3.sql manually in your Supabase SQL Editor');
  console.log('   Dashboard: https://app.supabase.com/project/japmjlgtuvplooelwfqh/sql');
});
