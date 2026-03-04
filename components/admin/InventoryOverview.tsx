'use client';

import { useState } from 'react';
import type { InventoryProduct } from '@/app/admin/business-actions';
import StockEditor from './StockEditor';

interface InventoryOverviewProps {
  products: InventoryProduct[];
}

const LOW_STOCK = 2;

function stockBadge(stock: number) {
  if (stock === 0)
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Out</span>;
  if (stock <= LOW_STOCK)
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">{stock}</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">{stock}</span>;
}

function ProductCard({ product }: { product: InventoryProduct }) {
  const [editing, setEditing] = useState(false);
  const [localSizes, setLocalSizes] = useState(product.sizes);

  const totalStock = localSizes.reduce((s, sz) => s + sz.stock, 0);
  const hasLowStock = localSizes.some((sz) => sz.stock <= LOW_STOCK);

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 ${
        !product.is_active ? 'opacity-60' : ''
      } ${hasLowStock ? 'border-l-4 border-amber-400' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <span className="font-medium text-gray-900">{product.name}</span>
          {!product.is_active && (
            <span className="ml-2 text-xs text-gray-400">(hidden)</span>
          )}
          <span className="ml-3 text-xs text-gray-500">Total: {totalStock}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setEditing((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
              editing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {editing ? 'Done' : 'Edit stock'}
          </button>
        </div>
      </div>

      {editing ? (
        <StockEditor
          productId={product.id}
          initialSizes={localSizes}
          onSizesChange={(sizes) => setLocalSizes(sizes.map((s) => ({ ...s, cost_price: s.cost_price ?? null })))}
          showCostPrice
        />
      ) : (
        <div>
          {localSizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {localSizes.map((sz) => (
                <div key={sz.size} className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600">{sz.size}:</span>
                  {stockBadge(sz.stock)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No size variants</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryOverview({ products }: InventoryOverviewProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Inventory Overview</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
