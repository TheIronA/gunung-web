'use client';

import { useState } from 'react';
import { updatePrice } from '@/app/admin/actions';

interface ProductPriceEditorProps {
  productId: string;
  initialPrice: number; // in cents
}

export default function ProductPriceEditor({ productId, initialPrice }: ProductPriceEditorProps) {
  const [price, setPrice] = useState((initialPrice / 100).toFixed(2));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    const parsed = parseFloat(price);
    if (isNaN(parsed) || parsed < 0) {
      setMessage({ text: 'Enter a valid price', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    const newPriceCents = Math.round(parsed * 100);

    try {
      await updatePrice(productId, newPriceCents);
      setMessage({ text: 'Price updated', type: 'success' });
      // Refresh so server-rendered values reflect change
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error('Failed to update price', err);
      setMessage({ text: 'Failed to update price', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Price (MYR)</h4>
      <div className="flex items-center space-x-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-28 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
