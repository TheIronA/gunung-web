'use client';

import { useState } from 'react';
import { updateStock, deleteStock } from '@/app/admin/actions';
import { updateSizeCostPrice } from '@/app/admin/business-actions';

type SizeEntry = {
  size: string;
  stock: number;
  cost_price?: number | null;
};

interface StockEditorProps {
  productId: string;
  initialSizes: SizeEntry[];
  onSizesChange?: (sizes: SizeEntry[]) => void;
  showCostPrice?: boolean;
}

export default function StockEditor({
  productId,
  initialSizes,
  onSizesChange,
  showCostPrice = false,
}: StockEditorProps) {
  const [sizes, setSizes] = useState<SizeEntry[]>(initialSizes);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Cost price inputs keyed by size label
  const [costInputs, setCostInputs] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    for (const s of initialSizes) {
      obj[s.size] = s.cost_price != null ? (s.cost_price / 100).toFixed(2) : '';
    }
    return obj;
  });

  // New size inputs
  const [newSize, setNewSize] = useState('');
  const [newStock, setNewStock] = useState('0');
  const [newCost, setNewCost] = useState('');

  const updateSizes = (next: SizeEntry[]) => {
    setSizes(next);
    onSizesChange?.(next);
  };

  const handleDelete = async (size: string) => {
    if (!confirm(`Delete size "${size}"? This action cannot be undone.`)) return;
    setLoading(`delete-${size}`);
    setMessage(null);

    try {
      await deleteStock(productId, size);
      const next = sizes.filter((s) => s.size !== size);
      updateSizes(next);
      setCostInputs((prev) => { const n = { ...prev }; delete n[size]; return n; });
      setMessage({ text: `Deleted ${size}`, type: 'success' });
    } catch (err) {
      console.error('Failed to delete size', err);
      setMessage({ text: 'Failed to delete size', type: 'error' });
    } finally {
      setLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleStockChange = (size: string, value: string) => {
    // Allow empty string (user backspacing), treat as 0
    const v = value === '' ? 0 : parseInt(value);
    if (isNaN(v) || v < 0) return;
    setSizes((prev) => prev.map((s) => (s.size === size ? { ...s, stock: v } : s)));
  };

  const handleSave = async (size: string) => {
    const sizeData = sizes.find((s) => s.size === size);
    if (!sizeData) return;

    setLoading(size);
    setMessage(null);

    try {
      await updateStock(productId, size, sizeData.stock);

      let savedCost: number | null | undefined = undefined;
      if (showCostPrice) {
        const costStr = costInputs[size] ?? '';
        if (costStr === '') {
          savedCost = null;
          await updateSizeCostPrice(productId, size, null);
        } else {
          const parsed = parseFloat(costStr);
          if (!isNaN(parsed) && parsed >= 0) {
            savedCost = Math.round(parsed * 100);
            await updateSizeCostPrice(productId, size, savedCost);
          }
        }
      }

      const next = sizes.map((s) =>
        s.size === size
          ? { ...s, cost_price: savedCost !== undefined ? savedCost : s.cost_price }
          : s
      );
      updateSizes(next);
      setMessage({ text: `Updated ${size}`, type: 'success' });
    } catch {
      setMessage({ text: `Failed to update ${size}`, type: 'error' });
    } finally {
      setLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAdd = async () => {
    const trimmed = newSize.trim();
    const stockVal = Math.max(0, parseInt(newStock || '0'));

    if (!trimmed) {
      setMessage({ text: 'Size cannot be empty', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (sizes.find((s) => s.size.toLowerCase() === trimmed.toLowerCase())) {
      setMessage({ text: 'Size already exists', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading('add');
    setMessage(null);

    try {
      await updateStock(productId, trimmed, stockVal);

      let costCents: number | null = null;
      if (showCostPrice && newCost !== '') {
        const parsed = parseFloat(newCost);
        if (!isNaN(parsed) && parsed >= 0) {
          costCents = Math.round(parsed * 100);
          await updateSizeCostPrice(productId, trimmed, costCents);
        }
      }

      const next = [...sizes, { size: trimmed, stock: stockVal, cost_price: costCents }];
      updateSizes(next);
      setCostInputs((prev) => ({ ...prev, [trimmed]: newCost }));
      setMessage({ text: `Added ${trimmed}`, type: 'success' });
      setNewSize('');
      setNewStock('0');
      setNewCost('');
    } catch (err) {
      console.error('Failed to add size', err);
      setMessage({ text: 'Failed to add size', type: 'error' });
    } finally {
      setLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Stock Levels</h4>
      <div className="space-y-3">
        {sizes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No sizes defined for this product.</p>
        ) : (
          sizes.map((s) => (
            <div key={s.size} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="w-16 text-sm text-gray-700 font-medium shrink-0">{s.size}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Stock</span>
                <input
                  type="number"
                  min="0"
                  value={s.stock}
                  onChange={(e) => handleStockChange(s.size, e.target.value)}
                  className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                />
              </div>
              {showCostPrice && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Cost MYR</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={costInputs[s.size] ?? ''}
                    onChange={(e) => setCostInputs((prev) => ({ ...prev, [s.size]: e.target.value }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                  />
                </div>
              )}
              <button
                onClick={() => handleSave(s.size)}
                disabled={loading === s.size}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
              >
                {loading === s.size ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleDelete(s.size)}
                disabled={loading === `delete-${s.size}`}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
              >
                {loading === `delete-${s.size}` ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))
        )}

        {/* Add new size */}
        <div className="pt-2 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-900">Add New Size</h5>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="e.g. UK 8 / S / M"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Stock</span>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
              />
            </div>
            {showCostPrice && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Cost MYR</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                />
              </div>
            )}
            <button
              onClick={handleAdd}
              disabled={loading === 'add'}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
            >
              {loading === 'add' ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
