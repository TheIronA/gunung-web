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
  image: string;
  currency: string;
  is_active: boolean;
  sizes?: ProductSize[];
}

// Database row types
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductSizeRow = Database['public']['Tables']['product_sizes']['Row'];

// Fallback products for when Supabase isn't configured
const fallbackProducts: Product[] = [
  {
    id: 'striker-qc-green-malachite',
    name: 'STRIKER QC (Green Malachite)',
    description: 'High-performance climbing shoes with precision fit and superior grip.',
    details: 'The STRIKER QC in Green Malachite combines aggressive downturn with exceptional edging performance. Featuring a quick-closure system for easy on/off, sticky rubber outsole for maximum friction, and a snug fit that molds to your foot for precision on technical routes.',
    price: 46999,
    currency: 'myr',
    is_active: true,
    image: 'https://www.ocun.com/assets/products/1_700x700/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1-.jpg',
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
    description: 'Versatile all-day climbing shoe perfect for gym and outdoor routes.',
    details: 'The JETT QC is designed for climbers who demand comfort without sacrificing performance. With a moderate downturn and breathable upper, these shoes excel on long climbing sessions. The quick-closure system ensures a secure fit, while the durable rubber rand provides protection and longevity.',
    price: 52999,
    currency: 'myr',
    is_active: true,
    image: 'https://www.ocun.com/assets/products/1_700x700/o4itpyk884.04041-Jett-QC-1.jpg',
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
      image: product.image,
      currency: product.currency,
      is_active: product.is_active ?? true,
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
      image: typedProduct.image,
      currency: typedProduct.currency,
      is_active: typedProduct.is_active ?? true,
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
    return { isStoreOpen: process.env.NEXT_PUBLIC_STORE_ACTIVE === 'true' };
  }

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('is_store_open')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return { isStoreOpen: true }; // Default to open
    }

    return { isStoreOpen: data.is_store_open };
  } catch (error) {
    console.error('Failed to fetch store settings:', error);
    return { isStoreOpen: true };
  }
}
