'use client';

import { useState } from 'react';
import { updateStock, deleteStock } from '@/app/admin/actions';
import { ProductSize } from '@/lib/products';

interface StockEditorProps {
    productId: string;
    initialSizes: ProductSize[];
}

export default function StockEditor({ productId, initialSizes }: StockEditorProps) {
    const [sizes, setSizes] = useState<ProductSize[]>(initialSizes);
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // New size inputs
    const [newSize, setNewSize] = useState('');
    const [newStock, setNewStock] = useState('0');

    const handleDelete = async (size: string) => {
        if (!confirm(`Delete size "${size}"? This action cannot be undone.`)) return;
        setLoading(`delete-${size}`);
        setMessage(null);

        try {
            await deleteStock(productId, size);
            setSizes((prev) => prev.filter((s) => s.size !== size));
            setMessage({ text: `Deleted ${size}`, type: 'success' });
        } catch (err) {
            console.error('Failed to delete size', err);
            setMessage({ text: 'Failed to delete size', type: 'error' });
        } finally {
            setLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };


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
            setSizes((prev) => [...prev, { size: trimmed, stock: stockVal }]);
            setMessage({ text: `Added ${trimmed}`, type: 'success' });
            setNewSize('');
            setNewStock('0');
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
                            <button
                                onClick={() => handleDelete(s.size)}
                                disabled={loading === `delete-${s.size}`}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                title={`Delete ${s.size}`}
                            >
                                {loading === `delete-${s.size}` ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    ))
                )}

                {/* Add new size */}
                <div className="pt-2 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-gray-900">Add New Size</h5>
                    <div className="mt-2 flex items-center space-x-3">
                        <input
                            type="text"
                            placeholder="e.g. UK 8 / S / M"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            className="w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                        />
                        <input
                            type="number"
                            min="0"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 border"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={loading === 'add'}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
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
