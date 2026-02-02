/**
 * Script to update Supabase database with:
 * 1. New schema fields (from update_v3.sql)
 * 2. Updated product information
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

const updatedProducts = [
  {
    id: 'striker-qc-green-malachite',
    description: 'Comfortable shoe suitable for daylong routes - ideal for beginners and recreational climbers.',
    details: 'The Striker QC is an ideal choice for beginners and recreational climbers. With its comfortable Entratic last, mild asymmetry, and flat profile, it offers plenty of comfort for all-day climbing while still providing elements of sport precision. Features quick Velcro closure, CAT rubber 1.1 sole, reinforced toe rand, seamless heel, and comfortable elastic tongue. 100% vegan and handmade in the Czech Republic. Suitable for narrow, wide, and regular-width feet. Best for Roman toe shape, but also works for Egyptian and Greek types.',
    foot_type_narrow: true,
    foot_type_regular: true,
    foot_type_wide: true,
    toe_type_egyptian: true,
    toe_type_roman: true,
    toe_type_greek: true,
    terrain_rocks: true,
    terrain_boulder: true,
    terrain_multipitch: true,
    terrain_indoor: true,
    last_type: 'Entratic',
    rubber_type: 'CAT 1.1',
  },
  {
    id: 'jett-qc',
    description: 'Sport climbing shoes that do not compromise comfort - built for performance with medium asymmetry.',
    details: 'Jett QC is a comfortable climbing shoe for everyone who wants to push their limits. The All-round last with medium asymmetry and more volume in the instep and toe area, combined with a stiffer midsole, ensures both stability and support. Features CAT rubber 1.5 sole for highly grippy performance, dual opposite Velcro straps for quick and precise tightening, seamless heel, breathable tongue, and microfiber upper. 100% vegan and handcrafted in the Czech Republic. Ideal for climbers with Egyptian toe shape and regular-width feet. Also fits Greek and Roman toe shapes.',
    foot_type_narrow: false,
    foot_type_regular: true,
    foot_type_wide: false,
    toe_type_egyptian: true,
    toe_type_roman: true,
    toe_type_greek: true,
    terrain_rocks: true,
    terrain_boulder: true,
    terrain_multipitch: true,
    terrain_indoor: true,
    last_type: 'All-round',
    rubber_type: 'CAT 1.5',
  },
];

async function updateDatabase() {
  console.log('🚀 Starting database update...\n');

  // Update each product
  for (const product of updatedProducts) {
    console.log(`📦 Updating ${product.id}...`);
    
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select();

    if (error) {
      console.error(`❌ Error updating ${product.id}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Successfully updated ${product.id}`);
    } else {
      console.log(`⚠️  Product ${product.id} not found in database`);
    }
  }

  console.log('\n✨ Database update complete!');
}

updateDatabase().catch(console.error);
