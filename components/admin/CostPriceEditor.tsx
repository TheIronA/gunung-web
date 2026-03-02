'use client';

import { useState } from 'react';
import { updateCostPrice } from '@/app/admin/business-actions';

interface CostPriceEditorProps {
  productId: string;
  initialCostPrice: number | null;
  sellingPrice: number;
}

export default function CostPriceEditor({ productId, initialCostPrice, sellingPrice }: CostPriceEditorProps) {
  const [value, setValue] = useState(
    initialCostPrice != null ? (initialCostPrice / 100).toFixed(2) : ''
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const margin =
    value !== '' && !isNaN(parseFloat(value))
      ? sellingPrice - Math.round(parseFloat(value) * 100)
      : null;

  const handleSave = async () => {
    const parsed = value === '' ? null : parseFloat(value);
    if (parsed !== null && (isNaN(parsed) || parsed < 0)) {
      setMessage({ text: 'Invalid amount', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updateCostPrice(productId, parsed !== null ? Math.round(parsed * 100) : null);
      setMessage({ text: 'Saved', type: 'success' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to save', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500">Cost price:</span>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">MYR</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:border-indigo-400 focus:outline-none"
        />
      </div>
      {margin !== null && (
        <span className={`text-xs ${margin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          margin: {(margin / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}
        </span>
      )}
      <button
        onClick={handleSave}
        disabled={loading}
        className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
      >
        {loading ? '...' : 'Save'}
      </button>
      {message && (
        <span className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message.text}
        </span>
      )}
    </div>
  );
}
