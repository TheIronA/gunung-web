import { supabase, isSupabaseConfigured } from './supabase';
import type { Database } from '@/types/supabase';

export interface ProductSize {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number; // in cents
  sale_price?: number | null; // in cents, null means no active sale
  sale_end_date?: string | null;
  image: string;
  currency: string;
  is_active: boolean;
  sizes?: ProductSize[];
  // Climbing shoe metadata
  foot_type_narrow?: boolean;
  foot_type_regular?: boolean;
  foot_type_wide?: boolean;
  toe_type_egyptian?: boolean;
  toe_type_roman?: boolean;
  toe_type_greek?: boolean;
  terrain_rocks?: boolean;
  terrain_boulder?: boolean;
  terrain_multipitch?: boolean;
  terrain_indoor?: boolean;
  last_type?: string | null;
  rubber_type?: string | null;
}

// Database row types
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductSizeRow = Database['public']['Tables']['product_sizes']['Row'];

// Fallback products for when Supabase isn't configured
const fallbackProducts: Product[] = [
  {
    id: 'striker-qc-green-malachite',
    name: 'STRIKER QC (Green Malachite)',
    description: 'Comfortable shoe suitable for daylong routes - ideal for beginners and recreational climbers.',
    details: 'The Striker QC is an ideal choice for beginners and recreational climbers. With its comfortable Entratic last, mild asymmetry, and flat profile, it offers plenty of comfort for all-day climbing while still providing elements of sport precision. Features quick Velcro closure, CAT rubber 1.1 sole, reinforced toe rand, seamless heel, and comfortable elastic tongue. 100% vegan and handmade in the Czech Republic. Suitable for narrow, wide, and regular-width feet. Best for Roman toe shape, but also works for Egyptian and Greek types.',
    price: 46999,
    sale_price: null,
    currency: 'myr',
    is_active: true,
    image: 'https://www.ocun.com/assets/products/1_700x700/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1-.jpg',
    // Climbing shoe metadata
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
    sizes: [
      { size: 'UK 5', stock: 1 },
      { size: 'UK 5.5', stock: 1 },
      { size: 'UK 6', stock: 2 },
      { size: 'UK 6.5', stock: 2 },
      { size: 'UK 7', stock: 2 },
      { size: 'UK 7.5', stock: 2 },
      { size: 'UK 8', stock: 1 },
      { size: 'UK 8.5', stock: 1 },
      { size: 'UK 9', stock: 1 },
    ],
  },
  {
    id: 'jett-qc',
    name: 'JETT QC',
    description: 'Sport climbing shoes that do not compromise comfort - built for performance with medium asymmetry.',
    details: 'Jett QC is a comfortable climbing shoe for everyone who wants to push their limits. The All-round last with medium asymmetry and more volume in the instep and toe area, combined with a stiffer midsole, ensures both stability and support. Features CAT rubber 1.5 sole for highly grippy performance, dual opposite Velcro straps for quick and precise tightening, seamless heel, breathable tongue, and microfiber upper. 100% vegan and handcrafted in the Czech Republic. Ideal for climbers with Egyptian toe shape and regular-width feet. Also fits Greek and Roman toe shapes.',
    price: 52999,
    sale_price: null,
    currency: 'myr',
    is_active: true,
    image: 'https://www.ocun.com/assets/products/1_700x700/o4itpyk884.04041-Jett-QC-1.jpg',
    // Climbing shoe metadata
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
    sizes: [
      { size: 'UK 5', stock: 1 },
      { size: 'UK 6', stock: 1 },
      { size: 'UK 6.5', stock: 2 },
      { size: 'UK 7', stock: 1 },
      { size: 'UK 7.5', stock: 1 },
      { size: 'UK 8', stock: 1 },
      { size: 'UK 8.5', stock: 1 },
      { size: 'UK 9', stock: 1 },
    ],
  },
  {
    id: 'gunung-ascent-tee',
    name: 'Gunung Ascent Tee',
    description: 'Premium cotton blend t-shirt designed for comfort on and off the crag.',
    details: 'The Gunung Ascent Tee is crafted from a breathable, heavyweight cotton blend that stands up to the abrasion of the rock while keeping you cool. Featuring a relaxed fit for unrestricted movement and our signature mountain motif on the back.',
    price: 3500,
    sale_price: null,
    currency: 'myr',
    is_active: true,
    image: '/gunung-tee-placeholder.png',
  },
  {
    id: 'gunung-chalk-bag',
    name: 'Gunung Chalk Bag',
    description: 'Hand-stitched chalk bag with fleece lining and secure closure.',
    details: 'Keep your hands dry and your focus sharp. Our chalk bag features a stiffened rim for easy access, a soft fleece lining to hold chalk effectively, and a tight closure system to prevent spills in your pack. Includes a brush loop and waist belt.',
    price: 8900,
    sale_price: null,
    currency: 'myr',
    is_active: true,
    image: '/gunung-chalkbag-placeholder.png',
  },
];

// For static export compatibility, use fallback products
export const products = fallbackProducts;

// Fetch products from Supabase (use in server components or API routes)
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackProducts;
  }

  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (productsError || !productsData) {
      console.error('Error fetching products:', productsError);
      return fallbackProducts;
    }

    // Fetch sizes for all products
    const { data: sizesData, error: sizesError } = await supabase
      .from('product_sizes')
      .select('*');

    if (sizesError) {
      console.error('Error fetching sizes:', sizesError);
    }

    // Map products with their sizes
    const productsWithSizes: Product[] = (productsData as ProductRow[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      details: product.details,
      price: product.price,
      sale_price: product.sale_price,
      sale_end_date: product.sale_end_date,
      image: product.image,
      currency: product.currency,
      is_active: (product as any).is_active ?? true,
      // Climbing shoe metadata
      foot_type_narrow: (product as any).foot_type_narrow,
      foot_type_regular: (product as any).foot_type_regular,
      foot_type_wide: (product as any).foot_type_wide,
      toe_type_egyptian: (product as any).toe_type_egyptian,
      toe_type_roman: (product as any).toe_type_roman,
      toe_type_greek: (product as any).toe_type_greek,
      terrain_rocks: (product as any).terrain_rocks,
      terrain_boulder: (product as any).terrain_boulder,
      terrain_multipitch: (product as any).terrain_multipitch,
      terrain_indoor: (product as any).terrain_indoor,
      last_type: (product as any).last_type,
      rubber_type: (product as any).rubber_type,
      sizes: (sizesData as ProductSizeRow[] | null)
        ?.filter((size) => size.product_id === product.id)
        .map((size) => ({ size: size.size, stock: size.stock })),
    }));

    return productsWithSizes;
  } catch (error) {
    console.error('Failed to fetch products from Supabase:', error);
    return fallbackProducts;
  }
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackProducts.find((p) => p.id === id) || null;
  }

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError || !product) {
      // Fallback to local products
      return fallbackProducts.find((p) => p.id === id) || null;
    }

    const typedProduct = product as ProductRow;

    // Fetch sizes for this product
    const { data: sizesData } = await supabase
      .from('product_sizes')
      .select('*')
      .eq('product_id', id);

    return {
      id: typedProduct.id,
      name: typedProduct.name,
      description: typedProduct.description,
      details: typedProduct.details,
      price: typedProduct.price,
      sale_price: typedProduct.sale_price,
      sale_end_date: typedProduct.sale_end_date,
      image: typedProduct.image,
      currency: typedProduct.currency,
      is_active: (typedProduct as any).is_active ?? true,
      // Climbing shoe metadata
      foot_type_narrow: (typedProduct as any).foot_type_narrow,
      foot_type_regular: (typedProduct as any).foot_type_regular,
      foot_type_wide: (typedProduct as any).foot_type_wide,
      toe_type_egyptian: (typedProduct as any).toe_type_egyptian,
      toe_type_roman: (typedProduct as any).toe_type_roman,
      toe_type_greek: (typedProduct as any).toe_type_greek,
      terrain_rocks: (typedProduct as any).terrain_rocks,
      terrain_boulder: (typedProduct as any).terrain_boulder,
      terrain_multipitch: (typedProduct as any).terrain_multipitch,
      terrain_indoor: (typedProduct as any).terrain_indoor,
      last_type: (typedProduct as any).last_type,
      rubber_type: (typedProduct as any).rubber_type,
      sizes: (sizesData as ProductSizeRow[] | null)?.map((size) => ({
        size: size.size,
        stock: size.stock
      })),
    };
  } catch (error) {
    console.error('Failed to fetch product from Supabase:', error);
    return fallbackProducts.find((p) => p.id === id) || null;
  }
}

// Check stock availability for a specific size
export async function checkStock(productId: string, size: string): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    const product = fallbackProducts.find((p) => p.id === productId);
    const sizeData = product?.sizes?.find((s) => s.size === size);
    return sizeData?.stock ?? 0;
  }

  try {
    const { data, error } = await supabase
      .from('product_sizes')
      .select('stock')
      .eq('product_id', productId)
      .eq('size', size)
      .single();

    if (error || !data) {
      // Fallback to local products
      const product = fallbackProducts.find((p) => p.id === productId);
      const sizeData = product?.sizes?.find((s) => s.size === size);
      return sizeData?.stock ?? 0;
    }

    return (data as { stock: number }).stock;
  } catch (error) {
    console.error('Failed to check stock:', error);
    return 0;
  }
}

export async function getStoreSettings(): Promise<{ isStoreOpen: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, defaulting store to open');
    return { isStoreOpen: true };
  }

  try {
    const { data, error } = await (supabase
      .from('store_settings' as any) as any)
      .select('is_store_open')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return { isStoreOpen: true }; // Default to open
    }

    return { isStoreOpen: (data as any).is_store_open };
  } catch (error) {
    console.error('Failed to fetch store settings:', error);
    return { isStoreOpen: true };
  }
}
