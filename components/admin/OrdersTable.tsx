'use client';

import { useState, useEffect } from 'react';
import {
  updateOrderStatus,
  addOrderAdjustment,
  deleteOrderAdjustment,
  updateOrderItemCost,
  type Order,
  type OrderItem,
  type OrderStatus,
  type InventoryProduct,
} from '@/app/admin/business-actions';
import AddManualSaleForm from './AddManualSaleForm';

interface OrdersTableProps {
  initialOrders: Order[];
  products: InventoryProduct[];
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const PAGE_SIZE = 25;

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function formatMYR(cents: number) {
  return (cents / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Per-item cost editor ─────────────────────────────────────────────────────

function ItemCostEditor({ item }: { item: OrderItem }) {
  const [editing, setEditing] = useState(false);
  const [costInput, setCostInput] = useState(
    item.unit_cost != null ? (item.unit_cost / 100).toFixed(2) : ''
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleSave = async () => {
    const cents = costInput === '' ? null : Math.round(parseFloat(costInput) * 100);
    if (costInput !== '' && (isNaN(cents!) || cents! < 0)) { setSaveError(true); return; }
    setSaving(true);
    setSaveError(false);
    try {
      await updateOrderItemCost(item.id, cents);
      setEditing(false);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-xs text-gray-600">
      <div>
        {item.product_name}
        {item.size ? <span className="text-gray-400"> ({item.size})</span> : null}
        {item.quantity > 1 ? <span className="text-gray-400"> ×{item.quantity}</span> : null}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="ml-2 text-gray-300 hover:text-indigo-500 transition-colors"
            title="Set cost for this item"
          >
            {item.unit_cost != null
              ? `· cost ${formatMYR(item.unit_cost)}`
              : '+ cost'}
          </button>
        )}
      </div>
      {editing && (
        <div className="flex items-center gap-1 mt-1 ml-1">
          <span className="text-gray-400">cost MYR</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={costInput}
            autoFocus
            onChange={(e) => { setCostInput(e.target.value); setSaveError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            className={`w-20 rounded border px-1 py-0.5 text-xs focus:outline-none ${saveError ? 'border-red-400' : 'border-gray-300 focus:border-indigo-400'}`}
          />
          <button onClick={handleSave} disabled={saving} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 font-medium">
            {saving ? '…' : '✓'}
          </button>
          <button onClick={() => { setEditing(false); setSaveError(false); }} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}

// ─── Adjustment panel ────────────────────────────────────────────────────────

interface AdjustmentPanelProps {
  orderId: string;
  stripeTotal: number;
  effectiveTotal: number;
  adjustments: Order['adjustments'];
}

function AdjustmentPanel({ orderId, stripeTotal, effectiveTotal, adjustments: initialAdjs }: AdjustmentPanelProps) {
  const [open, setOpen] = useState(false);
  const [adjs, setAdjs] = useState(initialAdjs);
  const [effective, setEffective] = useState(effectiveTotal);

  const [type, setType] = useState<'discount' | 'surcharge'>('discount');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }
    setLoading(true);
    setError(null);
    const amountCents = Math.round(parsed * 100) * (type === 'discount' ? -1 : 1);
    try {
      await addOrderAdjustment(orderId, amountCents, reason);
      const newAdj = {
        id: crypto.randomUUID(),
        amount: amountCents,
        reason: reason.trim(),
        created_at: new Date().toISOString(),
      };
      const newAdjs = [...adjs, newAdj];
      setAdjs(newAdjs);
      setEffective(stripeTotal + newAdjs.reduce((s, a) => s + a.amount, 0));
      setValue('');
      setReason('');
    } catch {
      setError('Failed to save adjustment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adjId: string, adjAmount: number) => {
    try {
      await deleteOrderAdjustment(adjId);
      const newAdjs = adjs.filter((a) => a.id !== adjId);
      setAdjs(newAdjs);
      setEffective(stripeTotal + newAdjs.reduce((s, a) => s + a.amount, 0));
    } catch {
      // silent — user can retry
    }
  };

  const adjusted = effective !== stripeTotal;

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{formatMYR(effective)}</span>
        {adjusted && (
          <span className="text-xs text-gray-400 line-through">{formatMYR(stripeTotal)}</span>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          title="Add / view adjustments"
        >
          {open ? 'Close' : adjusted ? `${adjs.length} adj.` : '+ adjust'}
        </button>
      </div>

      {open && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 text-xs">
          <p className="font-medium text-gray-600">Stripe charged: {formatMYR(stripeTotal)}</p>

          {adjs.length > 0 && (
            <ul className="space-y-1">
              {adjs.map((adj) => (
                <li key={adj.id} className="flex items-center justify-between gap-2">
                  <span className={adj.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                    {adj.amount < 0 ? '−' : '+'}{formatMYR(Math.abs(adj.amount))}
                  </span>
                  <span className="text-gray-500 flex-1">{adj.reason}</span>
                  <button
                    onClick={() => handleDelete(adj.id, adj.amount)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Remove adjustment"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-gray-200 pt-2 space-y-2">
            <p className="font-medium text-gray-600">Add adjustment</p>
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'discount' | 'surcharge')}
                className="rounded border border-gray-300 px-1.5 py-1 text-xs"
              >
                <option value="discount">Discount (−)</option>
                <option value="surcharge">Surcharge (+)</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">MYR</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-16 rounded border border-gray-300 px-1 py-1 text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Reason (e.g. Friend discount)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-indigo-400"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 text-xs"
            >
              {loading ? 'Saving...' : 'Save adjustment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Status select ────────────────────────────────────────────────────────────

function StatusSelect({ orderId, status: initialStatus }: { orderId: string; status: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: OrderStatus) => {
    setLoading(true);
    const prev = status;
    setStatus(newStatus);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
      setStatus(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={loading}
      className={`text-xs rounded-full px-2 py-1 font-medium border-0 cursor-pointer focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50 ${STATUS_STYLES[status]}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  );
}

// ─── Main table ───────────────────────────────────────────────────────────────

export default function OrdersTable({ initialOrders, products }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      search === '' ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 whenever filters change
  useEffect(() => setPage(1), [search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const headers = ['Date', 'Customer', 'Email', 'Items', 'Total (MYR)', 'Status', 'Type'];
    const rows = filtered.map((o) => [
      new Date(o.created_at).toISOString().slice(0, 10),
      o.customer_name || '',
      o.customer_email,
      o.items.map((i) => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity}`).join('; '),
      (o.effective_total / 100).toFixed(2),
      o.status,
      o.source === 'in_person' ? 'In-person' : 'Online',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AddManualSaleForm onSaved={() => window.location.reload()} products={products} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none w-52"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            title="Export current view to CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400 text-sm">
          {initialOrders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                      {order.source === 'in_person' && (
                        <span className="inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                          In-person
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name || '—'}</div>
                      <div className="text-xs text-gray-400">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {order.items.map((item) => (
                          <ItemCostEditor key={item.id} item={item} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AdjustmentPanel
                        orderId={order.id}
                        stripeTotal={order.total_amount}
                        effectiveTotal={order.effective_total}
                        adjustments={order.adjustments}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusSelect orderId={order.id} status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">
              {filtered.length > PAGE_SIZE
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} orders`
                : `${filtered.length} order${filtered.length !== 1 ? 's' : ''}`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-500">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
