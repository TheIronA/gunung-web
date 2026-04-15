'use client';

import { useState, useRef, useEffect } from 'react';
import { createManualOrder, getInventoryOverview, type OrderStatus, type ManualOrderItem } from '@/app/admin/business-actions';
import type { InventoryProduct } from '@/app/admin/business-actions';

const STATUS_OPTIONS: OrderStatus[] = ['paid', 'pending', 'shipped', 'delivered', 'cancelled'];

interface LineItem {
  product_id: string; // real UUID if selected from list, '' for custom
  product_name: string;
  size: string;
  quantity: number;
  unit_price: string; // MYR string, converted on submit
}

const emptyItem = (): LineItem => ({ product_id: '', product_name: '', size: '', quantity: 1, unit_price: '' });

interface LineItemRowProps {
  item: LineItem;
  idx: number;
  products: InventoryProduct[];
  showRemove: boolean;
  currency: string;
  onChange: (idx: number, field: keyof LineItem, val: string | number) => void;
  onRemove: (idx: number) => void;
}

function LineItemRow({ item, idx, products, showRemove, currency, onChange, onRemove }: LineItemRowProps) {
  const isIDR = currency.toLowerCase() === 'idr';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matched = products.find((p) => p.name === item.product_name);

  const suggestions = item.product_name.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(item.product_name.toLowerCase())
      )
    : products;

  const selectProduct = (product: InventoryProduct) => {
    onChange(idx, 'product_id', product.id);
    onChange(idx, 'product_name', product.name);
    // Use regional price if possible
    const price = currency.toLowerCase() === 'idr' ? (product as any).price_idr : 
                  currency.toLowerCase() === 'sgd' ? (product as any).price_sgd : 
                  currency.toLowerCase() === 'php' ? (product as any).price_php :
                  product.price;
    const finalPrice = price || product.price;
    onChange(idx, 'unit_price', isIDR ? finalPrice.toString() : (finalPrice / 100).toFixed(2));
    onChange(idx, 'size', '');
    setDropdownOpen(false);
  };

  const handleInputChange = (val: string) => {
    onChange(idx, 'product_name', val);
    // If the new value no longer exactly matches the previous product, reset price + id
    const exactMatch = products.find((p) => p.name === val);
    if (!exactMatch) {
      onChange(idx, 'product_id', '');
      onChange(idx, 'unit_price', '');
      onChange(idx, 'size', '');
    }
    setDropdownOpen(true);
  };

  return (
    <div className="flex gap-2 flex-wrap items-start">
      {/* Product name — custom combobox */}
      <div className="relative flex-1 min-w-40">
        <input
          type="text"
          value={item.product_name}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => {
            // Delay close so click on a suggestion fires first
            closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
          }}
          placeholder="Product name"
          autoComplete="off"
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
        />

        {dropdownOpen && suggestions.length > 0 && (
          <ul
            className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
            onMouseDown={(e) => {
              // Prevent input blur from firing before click
              e.preventDefault();
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
          >
            {suggestions.map((p) => (
              <li
                key={p.id}
                onClick={() => selectProduct(p)}
                className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {currency.toLowerCase() === 'idr' 
                    ? ((p as any).price_idr || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                    : currency.toLowerCase() === 'sgd'
                    ? (((p as any).price_sgd || 0) / 100).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })
                    : currency.toLowerCase() === 'php'
                    ? (((p as any).price_php || 0) / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                    : (p.price / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Size — dropdown if known product with sizes, free text otherwise */}
      {matched && matched.sizes.length > 0 ? (
        <select
          value={item.size}
          onChange={(e) => onChange(idx, 'size', e.target.value)}
          className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400 bg-white mt-0"
        >
          <option value="">Size...</option>
          {matched.sizes.map((s) => (
            <option key={s.size} value={s.size} disabled={s.stock === 0}>
              {s.size}{s.stock === 0 ? ' (out)' : ''}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={item.size}
          onChange={(e) => onChange(idx, 'size', e.target.value)}
          placeholder="Size (opt.)"
          className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
        />
      )}

      {/* Quantity */}
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => onChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
        className="w-14 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400 text-center"
        title="Quantity"
      />

      {/* Unit price */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">{currency.toUpperCase()}</span>
        <input
          type="number"
          min="0"
          step={isIDR ? "1000" : "0.01"}
          value={item.unit_price}
          onChange={(e) => onChange(idx, 'unit_price', e.target.value)}
          placeholder={isIDR ? "0" : "0.00"}
          className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
          title="Unit price"
        />
      </div>

      {showRemove && (
        <button
          onClick={() => onRemove(idx)}
          className="text-gray-300 hover:text-red-500 text-lg leading-none py-1.5"
          title="Remove item"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface AddManualSaleFormProps {
  onSaved: () => void;
  products: InventoryProduct[];
}

export default function AddManualSaleForm({ onSaved, products: initialProducts }: AddManualSaleFormProps) {
  const [open, setOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<InventoryProduct[]>(initialProducts);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<OrderStatus>('paid');
  const [currency, setCurrency] = useState('MYR');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch fresh stock data whenever the form is opened
  useEffect(() => {
    if (!open) return;
    getInventoryOverview()
      .then(setLiveProducts)
      .catch(() => {/* keep stale data on error */});
  }, [open]);

  const updateItem = (idx: number, field: keyof LineItem, val: string | number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const computedTotal = items.reduce((sum, it) => {
    const price = parseFloat(it.unit_price);
    const isIDR = currency === 'IDR';
    return sum + (isNaN(price) ? 0 : (isIDR ? Math.round(price) : Math.round(price * 100)) * it.quantity);
  }, 0);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) { setError('Customer name is required'); return; }

    const parsedItems: ManualOrderItem[] = [];
    for (const it of items) {
      if (!it.product_name.trim()) { setError('Each item needs a product name'); return; }
      const price = parseFloat(it.unit_price);
      if (isNaN(price) || price < 0) { setError(`Invalid price for "${it.product_name}"`); return; }
      const isIDR = currency === 'IDR';
      parsedItems.push({
        product_id: it.product_id || undefined,
        product_name: it.product_name.trim(),
        size: it.size.trim() || null,
        quantity: it.quantity,
        unit_price: isIDR ? Math.round(price) : Math.round(price * 100),
      });
    }

    if (parsedItems.length === 0) { setError('Add at least one item'); return; }

    setLoading(true);
    try {
      await createManualOrder({
        customer_name: name,
        customer_email: email,
        total_amount: computedTotal,
        currency: currency.toLowerCase(),
        status,
        items: parsedItems,
        note: note || undefined,
      });
      setName(''); setEmail(''); setNote('');
      setItems([emptyItem()]); setStatus('paid');
      setOpen(false);
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const totalFormatted = currency === 'IDR' 
    ? computedTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
    : currency === 'SGD'
    ? (computedTotal / 100).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })
    : currency === 'PHP'
    ? (computedTotal / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
    : (computedTotal / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        {open ? 'Cancel' : '+ Add in-person sale'}
      </button>

      {open && (
        <div className="mt-3 bg-white rounded-lg shadow p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Record in-person sale</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Customer name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmad"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@email.com"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Items *</label>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <LineItemRow
                  key={idx}
                  item={item}
                  idx={idx}
                  products={liveProducts}
                  showRemove={items.length > 1}
                  currency={currency}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <button
              onClick={() => setItems((prev) => [...prev, emptyItem()])}
              className="mt-2 text-xs text-indigo-600 hover:underline"
            >
              + Add another item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Cash payment at crag"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
            <span className="text-xs font-medium text-gray-500">Currency:</span>
            {['MYR', 'IDR', 'SGD', 'PHP'].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  currency === c ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Total: <span className="text-gray-900 font-bold">{totalFormatted}</span>
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save sale'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
