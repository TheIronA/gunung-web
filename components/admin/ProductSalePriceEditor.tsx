'use client';

import { useState } from 'react';
import { updateSalePrice } from '@/app/admin/actions';

interface ProductSalePriceEditorProps {
  productId: string;
  initialSalePrice: number | null; // in cents, null means no sale
  regularPrice: number; // for validation
}

export default function ProductSalePriceEditor({
  productId,
  initialSalePrice,
  regularPrice
}: ProductSalePriceEditorProps) {
  const [salePrice, setSalePrice] = useState(
    initialSalePrice !== null ? (initialSalePrice / 100).toFixed(2) : ''
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    // Empty string means clear the sale
    if (salePrice.trim() === '') {
      await handleClear();
      return;
    }

    const parsed = parseFloat(salePrice);
    if (isNaN(parsed) || parsed < 0) {
      setMessage({ text: 'Enter a valid sale price', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const salePriceCents = Math.round(parsed * 100);

    // Validate sale price is less than regular price
    if (salePriceCents >= regularPrice) {
      setMessage({ text: 'Sale price must be less than regular price', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updateSalePrice(productId, salePriceCents);
      setMessage({ text: 'Sale price updated', type: 'success' });
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error('Failed to update sale price', err);
      setMessage({ text: 'Failed to update sale price', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await updateSalePrice(productId, null);
      setSalePrice('');
      setMessage({ text: 'Sale price cleared', type: 'success' });
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error('Failed to clear sale price', err);
      setMessage({ text: 'Failed to clear sale price', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        Sale Price (MYR)
        <span className="text-xs text-gray-500 ml-2">Optional - leave empty for no sale</span>
      </h4>
      <div className="flex items-center space-x-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="e.g., 399.99"
          className="w-28 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {initialSalePrice !== null && (
          <button
            onClick={handleClear}
            disabled={loading}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            Clear Sale
          </button>
        )}
      </div>
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
