'use server';

import { createServerClient } from '@/lib/supabase';
import { verifyAuth } from '@/app/admin/actions';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
}

export interface OrderAdjustment {
  id: string;
  amount: number;   // cents; negative = discount, positive = surcharge
  reason: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  stripe_session_id: string | null;
  customer_email: string;
  customer_name: string | null;
  shipping_address: Record<string, string> | null;
  /** Original amount recorded by Stripe (or manually entered) — never mutated */
  total_amount: number;
  /** total_amount + SUM(adjustments) — the effective final total */
  effective_total: number;
  currency: string;
  status: OrderStatus;
  /** 'online' = Stripe checkout | 'in_person' = manually recorded */
  source: 'online' | 'in_person';
  created_at: string;
  items: OrderItem[];
  adjustments: OrderAdjustment[];
}

export interface ManualOrderItem {
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number; // cents
}

export interface BusinessMetrics {
  allTimeRevenue: number;
  allTimeProfit: number | null; // null if cost prices not fully set
  thisMonthRevenue: number;
  thisMonthProfit: number | null;
  thisWeekRevenue: number;
  thisWeekProfit: number | null;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
}

export interface InventoryProduct {
  id: string;
  name: string;
  price: number;
  cost_price: number | null;
  is_active: boolean;
  sizes: { size: string; stock: number }[];
}

export interface BestSeller {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

const PAID_STATUSES: OrderStatus[] = ['paid', 'shipped', 'delivered'];

export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch all paid orders with items (base tables)
  const { data: orders, error } = await (supabase
    .from('orders' as any) as any)
    .select('id, total_amount, status, created_at, order_items(product_id, quantity, unit_price)')
    .in('status', PAID_STATUSES);

  // Fetch adjustments separately — degrades gracefully if migration not yet run
  const { data: allAdjs } = await (supabase
    .from('order_adjustments' as any) as any)
    .select('order_id, amount')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const adjSumByOrderId = new Map<string, number>();
  for (const adj of (allAdjs || [])) {
    adjSumByOrderId.set(adj.order_id, (adjSumByOrderId.get(adj.order_id) ?? 0) + adj.amount);
  }

  if (error) {
    console.error('Error fetching orders for metrics', error);
    throw new Error('Failed to fetch business metrics');
  }

  // Fetch products with cost_price for profit calculation
  const { data: products } = await (supabase
    .from('products' as any) as any)
    .select('id, cost_price');

  const costByProductId = new Map<string, number | null>();
  (products || []).forEach((p: any) => costByProductId.set(p.id, p.cost_price));

  let allTimeRevenue = 0;
  let allTimeProfit: number | null = 0;
  let thisMonthRevenue = 0;
  let thisMonthProfit: number | null = 0;
  let thisWeekRevenue = 0;
  let thisWeekProfit: number | null = 0;

  for (const order of (orders || [])) {
    const adjustmentSum = adjSumByOrderId.get(order.id) ?? 0;
    const revenue = order.total_amount + adjustmentSum;
    allTimeRevenue += revenue;

    // Calculate profit for this order's items
    let orderProfit: number | null = 0;
    for (const item of (order.order_items || [])) {
      const cost = costByProductId.get(item.product_id);
      if (cost == null) {
        orderProfit = null;
      } else if (orderProfit !== null) {
        orderProfit += (item.unit_price - cost) * item.quantity;
      }
    }
    // Apply adjustments to profit too
    if (orderProfit !== null) {
      orderProfit += adjustmentSum;
    }

    if (allTimeProfit !== null) {
      if (orderProfit === null) allTimeProfit = null;
      else allTimeProfit += orderProfit;
    }

    if (order.created_at >= startOfMonth) {
      thisMonthRevenue += revenue;
      if (thisMonthProfit !== null) {
        if (orderProfit === null) thisMonthProfit = null;
        else thisMonthProfit += orderProfit;
      }
    }

    if (order.created_at >= startOfWeek) {
      thisWeekRevenue += revenue;
      if (thisWeekProfit !== null) {
        if (orderProfit === null) thisWeekProfit = null;
        else thisWeekProfit += orderProfit;
      }
    }
  }

  // Count orders by status
  const { data: allOrders } = await (supabase
    .from('orders' as any) as any)
    .select('status');

  const totalOrders = (allOrders || []).length;
  const paidOrders = (allOrders || []).filter((o: any) => PAID_STATUSES.includes(o.status)).length;
  const pendingOrders = (allOrders || []).filter((o: any) => o.status === 'pending').length;

  return {
    allTimeRevenue,
    allTimeProfit,
    thisMonthRevenue,
    thisMonthProfit,
    thisWeekRevenue,
    thisWeekProfit,
    totalOrders,
    paidOrders,
    pendingOrders,
  };
}

export async function getOrdersWithItems(): Promise<Order[]> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  // Fetch orders + items (base tables that always exist)
  const { data, error } = await (supabase
    .from('orders' as any) as any)
    .select(`
      id,
      stripe_session_id,
      customer_email,
      customer_name,
      shipping_address,
      total_amount,
      currency,
      status,
      created_at,
      order_items(id, product_id, product_name, size, quantity, unit_price)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders', error);
    throw new Error('Failed to fetch orders');
  }

  // Fetch new columns added by migration separately — gracefully degrade if not yet run
  const { data: ordersV4 } = await (supabase
    .from('orders' as any) as any)
    .select('id, source')
    .order('created_at', { ascending: false })
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const sourceById = new Map<string, string>();
  for (const o of (ordersV4 || [])) {
    sourceById.set(o.id, o.source ?? 'online');
  }

  // Fetch adjustments — gracefully degrade if migration not yet run
  const { data: adjData } = await (supabase
    .from('order_adjustments' as any) as any)
    .select('id, order_id, amount, reason, created_at')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const adjsByOrderId = new Map<string, OrderAdjustment[]>();
  for (const adj of (adjData || [])) {
    const list = adjsByOrderId.get(adj.order_id) || [];
    list.push({ id: adj.id, amount: adj.amount, reason: adj.reason, created_at: adj.created_at });
    adjsByOrderId.set(adj.order_id, list);
  }

  return (data || []).map((o: any) => {
    const adjustments: OrderAdjustment[] = adjsByOrderId.get(o.id) || [];
    const adjustmentSum = adjustments.reduce((s, a) => s + a.amount, 0);
    return {
      id: o.id,
      stripe_session_id: o.stripe_session_id,
      customer_email: o.customer_email,
      customer_name: o.customer_name,
      shipping_address: o.shipping_address,
      total_amount: o.total_amount,
      effective_total: o.total_amount + adjustmentSum,
      currency: o.currency,
      status: o.status,
      source: (sourceById.get(o.id) ?? 'online') as 'online' | 'in_person',
      created_at: o.created_at,
      items: o.order_items || [],
      adjustments,
    };
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('orders' as any) as any)
    .update({ status } as any)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status', error);
    throw new Error('Failed to update order status');
  }
}

/**
 * Records a manual price adjustment for an order.
 * Does NOT modify orders.total_amount (preserves the Stripe payment record).
 * Pass a negative amount for a discount, positive for a surcharge.
 */
export async function addOrderAdjustment(
  orderId: string,
  amountCents: number,
  reason: string
) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (!reason.trim()) throw new Error('Reason is required');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('order_adjustments' as any) as any)
    .insert({ order_id: orderId, amount: amountCents, reason: reason.trim() });

  if (error) {
    console.error('Error adding order adjustment', error);
    throw new Error('Failed to add adjustment');
  }
}

export async function deleteOrderAdjustment(adjustmentId: string) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('order_adjustments' as any) as any)
    .delete()
    .eq('id', adjustmentId);

  if (error) {
    console.error('Error deleting order adjustment', error);
    throw new Error('Failed to delete adjustment');
  }
}

/**
 * Creates a manually-entered order (in-person sale, cash transaction, etc.).
 * No Stripe session — stripe_session_id is null.
 */
export async function createManualOrder(params: {
  customer_name: string;
  customer_email: string;
  total_amount: number; // cents
  currency: string;
  status: OrderStatus;
  items: ManualOrderItem[];
  note?: string; // stored as an adjustment with amount=0 if provided
}) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (!params.customer_name.trim()) throw new Error('Customer name is required');
  if (params.total_amount < 0) throw new Error('Total cannot be negative');
  if (params.items.length === 0) throw new Error('At least one item is required');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  // Insert the order — try with source column, fall back without if migration not yet run
  const basePayload: any = {
    stripe_session_id: null,
    customer_name: params.customer_name.trim(),
    customer_email: params.customer_email.trim() || 'in-person@gunung.local',
    total_amount: params.total_amount,
    currency: params.currency,
    status: params.status,
    source: 'in_person',
  };

  let result = await (supabase
    .from('orders' as any) as any)
    .insert(basePayload)
    .select('id')
    .single();

  if (result.error?.code === 'PGRST204') {
    // 'source' column not in schema yet — retry without it
    const { source: _s, ...withoutSource } = basePayload;
    result = await (supabase
      .from('orders' as any) as any)
      .insert(withoutSource)
      .select('id')
      .single();
  }

  const order = result.data;
  const orderError = result.error;

  if (orderError || !order) {
    console.error('Error creating manual order', orderError);
    throw new Error('Failed to create order');
  }

  const orderId = (order as any).id;

  // Insert order items
  const itemRows = params.items.map((item) => ({
    order_id: orderId,
    product_id: 'manual',
    product_name: item.product_name,
    size: item.size || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await (supabase
    .from('order_items' as any) as any)
    .insert(itemRows);

  if (itemsError) {
    console.error('Error inserting order items', itemsError);
    throw new Error('Order created but failed to save items');
  }

  // Optionally store a note as a zero-amount adjustment
  if (params.note?.trim()) {
    await (supabase
      .from('order_adjustments' as any) as any)
      .insert({
        order_id: orderId,
        amount: 0,
        reason: params.note.trim(),
      });
  }

  return orderId;
}

export async function updateCostPrice(productId: string, costPriceCents: number | null) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (costPriceCents !== null && costPriceCents < 0) {
    throw new Error('Cost price cannot be negative');
  }

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('products' as any) as any)
    .update({ cost_price: costPriceCents } as any)
    .eq('id', productId);

  if (error) {
    console.error('Error updating cost price', error);
    throw new Error('Failed to update cost price');
  }
}

export async function getInventoryOverview(): Promise<InventoryProduct[]> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  // Base query — always works even before migration
  const { data, error } = await (supabase
    .from('products' as any) as any)
    .select('id, name, price, is_active, product_sizes(size, stock)')
    .order('name');

  if (error) {
    console.error('Error fetching inventory', error);
    throw new Error('Failed to fetch inventory');
  }

  // Fetch cost_price separately — gracefully degrades if migration not yet run
  const { data: costData } = await (supabase
    .from('products' as any) as any)
    .select('id, cost_price')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const costById = new Map<string, number | null>();
  for (const p of (costData || [])) {
    costById.set(p.id, p.cost_price ?? null);
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    cost_price: costById.get(p.id) ?? null,
    is_active: p.is_active,
    sizes: (p.product_sizes || []).sort((a: any, b: any) => a.size.localeCompare(b.size)),
  }));
}

export async function getMetricsForRange(
  start: string,
  end: string,
): Promise<{ revenue: number; profit: number | null; orders: number }> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: orders, error } = await (supabase
    .from('orders' as any) as any)
    .select('id, total_amount, order_items(product_id, quantity, unit_price)')
    .in('status', PAID_STATUSES)
    .gte('created_at', `${start}T00:00:00Z`)
    .lte('created_at', `${end}T23:59:59Z`);

  if (error) throw new Error('Failed to fetch range metrics');

  const { data: allAdjs } = await (supabase
    .from('order_adjustments' as any) as any)
    .select('order_id, amount')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const adjSumByOrderId = new Map<string, number>();
  for (const adj of (allAdjs || [])) {
    adjSumByOrderId.set(adj.order_id, (adjSumByOrderId.get(adj.order_id) ?? 0) + adj.amount);
  }

  const { data: products } = await (supabase
    .from('products' as any) as any)
    .select('id, cost_price');

  const costById = new Map<string, number | null>();
  (products || []).forEach((p: any) => costById.set(p.id, p.cost_price ?? null));

  let revenue = 0;
  let profit: number | null = 0;

  for (const order of (orders || [])) {
    const adjSum = adjSumByOrderId.get(order.id) ?? 0;
    revenue += order.total_amount + adjSum;

    let orderProfit: number | null = 0;
    for (const item of (order.order_items || [])) {
      const cost = costById.get(item.product_id);
      if (cost == null) orderProfit = null;
      else if (orderProfit !== null) orderProfit += (item.unit_price - cost) * item.quantity;
    }
    if (orderProfit !== null) orderProfit += adjSum;

    if (profit !== null) {
      if (orderProfit === null) profit = null;
      else profit += orderProfit;
    }
  }

  return { revenue, profit, orders: (orders || []).length };
}

export async function getBestSellers(): Promise<BestSeller[]> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await (supabase
    .from('order_items' as any) as any)
    .select('product_name, quantity, unit_price');

  if (error) {
    console.error('Error fetching order items for best sellers', error);
    throw new Error('Failed to fetch best sellers');
  }

  const aggregated = new Map<string, { total_quantity: number; total_revenue: number }>();
  for (const item of (data || [])) {
    const existing = aggregated.get(item.product_name) || { total_quantity: 0, total_revenue: 0 };
    existing.total_quantity += item.quantity;
    existing.total_revenue += item.unit_price * item.quantity;
    aggregated.set(item.product_name, existing);
  }

  return Array.from(aggregated.entries())
    .map(([product_name, stats]) => ({ product_name, ...stats }))
    .sort((a, b) => b.total_quantity - a.total_quantity);
}
