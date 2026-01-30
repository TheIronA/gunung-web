'use client';

import { useState } from 'react';
import { updateStock } from '@/app/admin/actions';
import { ProductSize } from '@/lib/products';

interface StockEditorProps {
    productId: string;
    initialSizes: ProductSize[];
}

export default function StockEditor({ productId, initialSizes }: StockEditorProps) {
    const [sizes, setSizes] = useState<ProductSize[]>(initialSizes);
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleStockChange = (size: string, newStock: string) => {
        const stockValue = parseInt(newStock);
        if (isNaN(stockValue) || stockValue < 0) return;

        setSizes((prev) =>
            prev.map((s) => (s.size === size ? { ...s, stock: stockValue } : s))
        );
    };

    const handleSave = async (size: string) => {
        const sizeData = sizes.find((s) => s.size === size);
        if (!sizeData) return;

        setLoading(size);
        setMessage(null);

        try {
            await updateStock(productId, size, sizeData.stock);
            setMessage({ text: `Updated ${size}`, type: 'success' });
        } catch {
            setMessage({ text: `Failed to update ${size}`, type: 'error' });
        } finally {
            setLoading(null);
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Stock Levels</h4>
            <div className="space-y-2">
                {sizes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No sizes defined for this product.</p>
                ) : (
                    sizes.map((s) => (
                        <div key={s.size} className="flex items-center space-x-4">
                            <span className="w-16 text-sm text-gray-700 font-medium">{s.size}</span>
                            <input
                                type="number"
                                min="0"
                                value={s.stock}
                                onChange={(e) => handleStockChange(s.size, e.target.value)}
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                            />
                            <button
                                onClick={() => handleSave(s.size)}
                                disabled={loading === s.size}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading === s.size ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    ))
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
