'use server';

import { createServerClient } from '@/lib/supabase';
import { verifyAuth } from '@/app/admin/actions';

// Stripe fee is always returned in the account settlement currency (MYR cents).
// Convert to the order currency before deducting from profit.
function convertStripeFee(feeMyrCents: number, orderCurrency: string): number {
  const cur = orderCurrency.toLowerCase();
  if (cur === 'idr') return Math.round((feeMyrCents / 100) * 4320); // MYR → IDR whole rupiah
  if (cur === 'sgd') return Math.round(feeMyrCents / 3.14);         // MYR cents → SGD cents
  if (cur === 'php') return Math.round(feeMyrCents * 12.6);         // MYR cents → PHP cents
  return feeMyrCents; // MYR → MYR (no conversion)
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  unit_cost: number | null;
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
  /** Stripe processing fee in cents (0 for in-person orders) */
  stripe_fee: number;
  currency: string;
  status: OrderStatus;
  /** 'online' = Stripe checkout | 'in_person' = manually recorded */
  source: 'online' | 'in_person';
  tracking_number: string | null;
  created_at: string;
  items: OrderItem[];
  adjustments: OrderAdjustment[];
}

export interface ManualOrderItem {
  product_id?: string; // real UUID when selected from product list; omit for custom items
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number; // cents
}

export interface CurrencyMetrics {
  allTimeRevenue: number;
  allTimeProfit: number | null;
  thisMonthRevenue: number;
  thisMonthProfit: number | null;
  thisWeekRevenue: number;
  thisWeekProfit: number | null;
}

export interface BusinessMetrics {
  myr: CurrencyMetrics;
  idr: CurrencyMetrics;
  sgd: CurrencyMetrics;
  php: CurrencyMetrics;
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
  sizes: { size: string; stock: number; cost_price: number | null }[];
}

export interface BestSeller {
  product_name: string;
  total_quantity: number;
  revenue_myr: number;
  revenue_idr: number;
  revenue_sgd: number;
  revenue_php: number;
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
    .select('id, total_amount, stripe_fee, currency, source, status, created_at, order_items(id, product_id, size, quantity, unit_price)')
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

  // Fetch size-level cost prices — takes priority over product-level in profit calc
  const { data: sizeCosts } = await (supabase
    .from('product_sizes' as any) as any)
    .select('product_id, size, cost_price')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const sizeCostMap = new Map<string, number | null>();
  for (const sc of (sizeCosts || [])) {
    sizeCostMap.set(`${sc.product_id}|${sc.size}`, sc.cost_price ?? null);
  }

  // Fetch per-order-item cost overrides — highest priority in profit calc
  const { data: itemCostData } = await (supabase
    .from('order_items' as any) as any)
    .select('id, unit_cost')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const unitCostById = new Map<string, number | null>();
  for (const ic of (itemCostData || [])) {
    unitCostById.set(ic.id, ic.unit_cost ?? null);
  }

  const emptyMetrics = (): CurrencyMetrics => ({
    allTimeRevenue: 0,
    allTimeProfit: 0,
    thisMonthRevenue: 0,
    thisMonthProfit: 0,
    thisWeekRevenue: 0,
    thisWeekProfit: 0,
  });
  const myrM = emptyMetrics();
  const idrM = emptyMetrics();
  const sgdM = emptyMetrics();
  const phpM = emptyMetrics();

  for (const order of (orders || [])) {
    const rawCurrency = (order.currency || 'myr').toLowerCase();
    const cur: 'myr' | 'idr' | 'sgd' | 'php' = 
      rawCurrency === 'idr' ? 'idr' : 
      rawCurrency === 'sgd' ? 'sgd' :
      rawCurrency === 'php' ? 'php' : 'myr';
    const m = 
      cur === 'idr' ? idrM : 
      cur === 'sgd' ? sgdM : 
      cur === 'php' ? phpM : myrM;

    const adjustmentSum = adjSumByOrderId.get(order.id) ?? 0;
    const revenue = order.total_amount + adjustmentSum;
    m.allTimeRevenue += revenue;

    // Calculate profit for this order's items
    // Priority: unit_cost (per-item override) → size cost → product cost
    let orderProfit: number | null = 0;
    let processedCount = 0;
    for (const item of (order.order_items || [])) {
      const unitCost = unitCostById.get(item.id);
      if (unitCost != null) {
        processedCount++;
        if (orderProfit !== null) {
          orderProfit += (item.unit_price - unitCost) * item.quantity;
        }
        continue;
      }
      const productCost = costByProductId.get(item.product_id);
      if (productCost === undefined) continue;
      processedCount++;
      const sizeKey = `${item.product_id}|${item.size}`;
      const cost = item.size && sizeCostMap.has(sizeKey)
        ? (sizeCostMap.get(sizeKey) ?? productCost)
        : productCost;
      if (cost === null) {
        orderProfit = null;
      } else if (orderProfit !== null) {
        orderProfit += (item.unit_price - cost) * item.quantity;
      }
    }
    if (processedCount === 0) orderProfit = null;
    if (orderProfit !== null) orderProfit += adjustmentSum;
    const stripeFee = order.stripe_fee ?? 0;
    if (orderProfit !== null && stripeFee > 0) orderProfit -= convertStripeFee(stripeFee, cur);

    if (m.allTimeProfit !== null) {
      if (orderProfit === null) m.allTimeProfit = null;
      else m.allTimeProfit += orderProfit;
    }

    if (order.created_at >= startOfMonth) {
      m.thisMonthRevenue += revenue;
      if (m.thisMonthProfit !== null) {
        if (orderProfit === null) m.thisMonthProfit = null;
        else m.thisMonthProfit += orderProfit;
      }
    }

    if (order.created_at >= startOfWeek) {
      m.thisWeekRevenue += revenue;
      if (m.thisWeekProfit !== null) {
        if (orderProfit === null) m.thisWeekProfit = null;
        else m.thisWeekProfit += orderProfit;
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
    myr: myrM,
    idr: idrM,
    sgd: sgdM,
    php: phpM,
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
      stripe_fee,
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

  // Fetch per-item cost overrides — gracefully degrade if column not yet added
  const { data: itemCostRows } = await (supabase
    .from('order_items' as any) as any)
    .select('id, unit_cost')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const unitCostByItemId = new Map<string, number | null>();
  for (const ic of (itemCostRows || [])) {
    unitCostByItemId.set(ic.id, ic.unit_cost ?? null);
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

  // Fetch tracking numbers — gracefully degrade if column not yet added
  const { data: trackingData } = await (supabase
    .from('orders' as any) as any)
    .select('id, tracking_number')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const trackingById = new Map<string, string | null>();
  for (const o of (trackingData || [])) {
    trackingById.set(o.id, o.tracking_number ?? null);
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
      stripe_fee: o.stripe_fee ?? 0,
      currency: o.currency,
      status: o.status,
      source: (sourceById.get(o.id) ?? 'online') as 'online' | 'in_person',
      tracking_number: trackingById.get(o.id) ?? null,
      created_at: o.created_at,
      items: (o.order_items || []).map((item: any) => ({
        ...item,
        unit_cost: unitCostByItemId.get(item.id) ?? null,
      })),
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
    product_id: item.product_id || 'manual',
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

export async function updateOrderItemCost(
  itemId: string,
  unitCostCents: number | null,
) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (unitCostCents !== null && unitCostCents < 0) {
    throw new Error('Cost cannot be negative');
  }

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('order_items' as any) as any)
    .update({ unit_cost: unitCostCents } as any)
    .eq('id', itemId);

  if (error) {
    console.error('Error updating item cost', error);
    throw new Error('Failed to update cost');
  }
}

export async function updateSizeCostPrice(
  productId: string,
  size: string,
  costPriceCents: number | null,
) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (costPriceCents !== null && costPriceCents < 0) {
    throw new Error('Cost price cannot be negative');
  }

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('product_sizes' as any) as any)
    .update({ cost_price: costPriceCents } as any)
    .eq('product_id', productId)
    .eq('size', size);

  if (error) {
    console.error('Error updating size cost price', error);
    throw new Error('Failed to update size cost price');
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

  // Fetch size-level cost prices — gracefully degrades if column not yet added
  const { data: sizeCostData } = await (supabase
    .from('product_sizes' as any) as any)
    .select('product_id, size, cost_price')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const sizeCostMap = new Map<string, number | null>();
  for (const sc of (sizeCostData || [])) {
    sizeCostMap.set(`${sc.product_id}|${sc.size}`, sc.cost_price ?? null);
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    cost_price: costById.get(p.id) ?? null,
    is_active: p.is_active,
    sizes: (p.product_sizes || [])
      .sort((a: any, b: any) => a.size.localeCompare(b.size))
      .map((s: any) => ({
        size: s.size,
        stock: s.stock,
        cost_price: sizeCostMap.get(`${p.id}|${s.size}`) ?? null,
      })),
  }));
}

export async function getMetricsForRange(
  start: string,
  end: string,
): Promise<{ 
  myr: { revenue: number; profit: number | null; orders: number }; 
  idr: { revenue: number; profit: number | null; orders: number };
  sgd: { revenue: number; profit: number | null; orders: number };
  php: { revenue: number; profit: number | null; orders: number };
}> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: orders, error } = await (supabase
    .from('orders' as any) as any)
    .select('id, total_amount, stripe_fee, currency, order_items(id, product_id, size, quantity, unit_price)')
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

  const { data: sizeCostsR } = await (supabase
    .from('product_sizes' as any) as any)
    .select('product_id, size, cost_price')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const sizeCostMapR = new Map<string, number | null>();
  for (const sc of (sizeCostsR || [])) {
    sizeCostMapR.set(`${sc.product_id}|${sc.size}`, sc.cost_price ?? null);
  }

  const { data: itemCostDataR } = await (supabase
    .from('order_items' as any) as any)
    .select('id, unit_cost')
    .then((res: any) => res)
    .catch(() => ({ data: null }));

  const unitCostByIdR = new Map<string, number | null>();
  for (const ic of (itemCostDataR || [])) {
    unitCostByIdR.set(ic.id, ic.unit_cost ?? null);
  }

  const myrR = { revenue: 0, profit: 0 as number | null, orders: 0 };
  const idrR = { revenue: 0, profit: 0 as number | null, orders: 0 };
  const sgdR = { revenue: 0, profit: 0 as number | null, orders: 0 };
  const phpR = { revenue: 0, profit: 0 as number | null, orders: 0 };

  for (const order of (orders || [])) {
    const rawCurrency = (order.currency || 'myr').toLowerCase();
    const cur = 
      rawCurrency === 'idr' ? 'idr' : 
      rawCurrency === 'sgd' ? 'sgd' :
      rawCurrency === 'php' ? 'php' : 'myr';
    const bucket = 
      cur === 'idr' ? idrR : 
      cur === 'sgd' ? sgdR : 
      cur === 'php' ? phpR : myrR;
    bucket.orders++;

    const adjSum = adjSumByOrderId.get(order.id) ?? 0;
    bucket.revenue += order.total_amount + adjSum;

    let orderProfit: number | null = 0;
    let processedCountR = 0;
    for (const item of (order.order_items || [])) {
      const unitCost = unitCostByIdR.get(item.id);
      if (unitCost != null) {
        processedCountR++;
        if (orderProfit !== null) orderProfit += (item.unit_price - unitCost) * item.quantity;
        continue;
      }
      const productCost = costById.get(item.product_id);
      if (productCost === undefined) continue;
      processedCountR++;
      const sizeKey = `${item.product_id}|${item.size}`;
      const cost = item.size && sizeCostMapR.has(sizeKey)
        ? (sizeCostMapR.get(sizeKey) ?? productCost)
        : productCost;
      if (cost === null) orderProfit = null;
      else if (orderProfit !== null) orderProfit += (item.unit_price - cost) * item.quantity;
    }
    if (processedCountR === 0) orderProfit = null;
    if (orderProfit !== null) orderProfit += adjSum;
    const stripeFeeR = order.stripe_fee ?? 0;
    if (orderProfit !== null && stripeFeeR > 0) orderProfit -= convertStripeFee(stripeFeeR, cur);

    if (bucket.profit !== null) {
      if (orderProfit === null) bucket.profit = null;
      else bucket.profit += orderProfit;
    }
  }

  return { myr: myrR, idr: idrR, sgd: sgdR, php: phpR };
}

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  sendEmail: boolean,
) {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  if (!trackingNumber.trim()) throw new Error('Tracking number is required');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await (supabase
    .from('orders' as any) as any)
    .update({ tracking_number: trackingNumber.trim() } as any)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating tracking number', error);
    throw new Error('Failed to save tracking number. Run: ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;');
  }

  if (sendEmail) {
    const { data: order } = await (supabase
      .from('orders' as any) as any)
      .select('customer_email, customer_name')
      .eq('id', orderId)
      .single();

    if (order) {
      const { sendTrackingNotification } = await import('@/lib/notifications');
      await sendTrackingNotification({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        trackingNumber: trackingNumber.trim(),
        orderId,
      });
    }
  }
}

export async function getBestSellers(): Promise<BestSeller[]> {
  const isAuth = await verifyAuth();
  if (!isAuth) throw new Error('Unauthorized');

  const supabase = createServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await (supabase
    .from('order_items' as any) as any)
    .select('product_name, quantity, unit_price, orders!inner(currency)')
    .in('orders.status', PAID_STATUSES);

  if (error) {
    console.error('Error fetching order items for best sellers', error);
    throw new Error('Failed to fetch best sellers');
  }

  const items = data || [];
  const sellersMap = new Map<string, BestSeller>();

  items.forEach((item: any) => {
    const name = item.product_name;
    if (/shipping/i.test(name)) return;
    const qty = item.quantity;
    const price = item.unit_price;
    const currency = (item.orders?.currency || 'myr').toLowerCase();
    
    if (!sellersMap.has(name)) {
      sellersMap.set(name, {
        product_name: name,
        total_quantity: 0,
        revenue_myr: 0,
        revenue_idr: 0,
        revenue_sgd: 0,
        revenue_php: 0,
      });
    }

    const seller = sellersMap.get(name)!;
    seller.total_quantity += qty;
    if (currency === 'idr') seller.revenue_idr += price * qty;
    else if (currency === 'sgd') seller.revenue_sgd += price * qty;
    else if (currency === 'php') seller.revenue_php += price * qty;
    else seller.revenue_myr += price * qty;
  });

  return Array.from(sellersMap.values())
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 10);
}
