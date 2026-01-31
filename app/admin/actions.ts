'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';

const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export async function login(formData: FormData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE,
      path: '/',
    });
    redirect('/admin/dashboard');
  } else {
    redirect('/admin?error=Invalid password');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin');
}

export async function verifyAuth() {
  const cookieStore = await cookies();
  return cookieStore.has('admin_session');
}

export async function updateStock(productId: string, size: string, newStock: number) {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    throw new Error('Unauthorized');
  }

  const supabase = createServerClient();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Check if the record exists first
  const { data: existingSize } = await (supabase
    .from('product_sizes' as any) as any)
    .select('*')
    .eq('product_id', productId)
    .eq('size', size)
    .single();

  let error;

  if (existingSize) {
    // Update existing
    const { error: updateError } = await (supabase
      .from('product_sizes' as any) as any)
      .update({ stock: newStock } as any)
      .eq('product_id', productId)
      .eq('size', size);
    error = updateError;
  } else {
    // Insert new (in case we add a new size variation dynamically, 
    // though the current UI will likely just show existing ones)
    const { error: insertError } = await (supabase
      .from('product_sizes' as any) as any)
      .insert({
        product_id: productId,
        size: size,
        stock: newStock,
      });
    error = insertError;
  }

  if (error) {
    console.error('Error updating stock', error);
    throw new Error('Failed to update stock');
  }
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('products' as any) as any)
    .update({ is_active: isActive } as any)
    .eq('id', productId);

  if (error) {
    console.error('Error updating product status', error);
    throw new Error('Failed to update product status');
  }
}

export async function toggleStoreStatus(isOpen: boolean) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  // We assume row with id=1 exists (created by migration)
  const { error } = await (supabase
    .from('store_settings' as any) as any)
    .update({ is_store_open: isOpen } as any)
    .eq('id', 1);

  if (error) {
    console.error('Error updating store status', error);
    throw new Error('Failed to update store status');
  }
}

export async function updatePrice(productId: string, newPriceCents: number) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('products' as any) as any)
    .update({ price: newPriceCents } as any)
    .eq('id', productId);

  if (error) {
    console.error('Error updating product price', error);
    throw new Error('Failed to update product price');
  }
}

export async function deleteStock(productId: string, size: string) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('product_sizes' as any) as any)
    .delete()
    .eq('product_id', productId)
    .eq('size', size);

  if (error) {
    console.error('Error deleting product size', error);
    throw new Error('Failed to delete product size');
  }
}

export async function updateSalePrice(productId: string, newSalePriceCents: number | null) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  // SERVER-SIDE VALIDATION: Critical for security!
  if (newSalePriceCents !== null) {
    // Validate sale price is non-negative
    if (newSalePriceCents < 0) {
      throw new Error('Sale price cannot be negative');
    }

    // Fetch the product to validate against regular price
    const { data: product, error: fetchError } = await (supabase
      .from('products' as any) as any)
      .select('price')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      console.error('Error fetching product for validation', fetchError);
      throw new Error('Product not found');
    }

    // Validate sale price is less than regular price
    if (newSalePriceCents >= product.price) {
      throw new Error('Sale price must be less than regular price');
    }
  }

  const { error } = await (supabase
    .from('products' as any) as any)
    .update({ sale_price: newSalePriceCents } as any)
    .eq('id', productId);

  if (error) {
    console.error('Error updating sale price', error);
    throw new Error('Failed to update sale price');
  }
}
