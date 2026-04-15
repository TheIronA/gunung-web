import type { BestSeller } from '@/app/admin/business-actions';

interface BestSellersProps {
  items: BestSeller[];
}

function formatMYR(cents: number) {
  return (cents / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
}

function formatIDR(rupiah: number) {
  return rupiah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatSGD(cents: number) {
  return (cents / 100).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' });
}

function formatPHP(cents: number) {
  return (cents / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
}

export default function BestSellers({ items }: BestSellersProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Best Sellers</h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400 text-sm">
          No sales data yet
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <tr key={item.product_name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.total_quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      {item.revenue_myr > 0 && <span>{formatMYR(item.revenue_myr)}</span>}
                      {item.revenue_idr > 0 && <span>{formatIDR(item.revenue_idr)}</span>}
                      {item.revenue_sgd > 0 && <span>{formatSGD(item.revenue_sgd)}</span>}
                      {item.revenue_php > 0 && <span>{formatPHP(item.revenue_php)}</span>}
                      {item.revenue_myr === 0 && item.revenue_idr === 0 && item.revenue_sgd === 0 && item.revenue_php === 0 && (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
