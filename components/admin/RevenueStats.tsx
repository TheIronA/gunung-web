'use client';

import { useState } from 'react';
import { getMetricsForRange } from '@/app/admin/business-actions';
import type { BusinessMetrics } from '@/app/admin/business-actions';

interface RevenueStatsProps {
  metrics: BusinessMetrics;
}

function formatMYR(cents: number) {
  return (cents / 100).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
}

function StatCard({
  label,
  revenue,
  profit,
  orders,
}: {
  label: string;
  revenue: number;
  profit: number | null;
  orders?: number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{formatMYR(revenue)}</p>
      {profit !== null ? (
        <p className="mt-1 text-sm text-green-600">Profit: {formatMYR(profit)}</p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">Set cost prices to see profit</p>
      )}
      {orders !== undefined && (
        <p className="mt-1 text-xs text-gray-500">{orders} paid order{orders !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}

export default function RevenueStats({ metrics }: RevenueStatsProps) {
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeResult, setRangeResult] = useState<{ revenue: number; profit: number | null; orders: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchRange = async () => {
    if (!rangeStart || !rangeEnd) return;
    setLoading(true);
    setFetchError(false);
    try {
      const result = await getMetricsForRange(rangeStart, rangeEnd);
      setRangeResult(result);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Revenue & Profit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard
          label="All Time"
          revenue={metrics.allTimeRevenue}
          profit={metrics.allTimeProfit}
          orders={metrics.paidOrders}
        />
        <StatCard
          label="This Month"
          revenue={metrics.thisMonthRevenue}
          profit={metrics.thisMonthProfit}
        />
        <StatCard
          label="Last 7 Days"
          revenue={metrics.thisWeekRevenue}
          profit={metrics.thisWeekProfit}
        />
      </div>

      <div className="flex gap-4 flex-wrap mb-4">
        <div className="bg-blue-50 rounded-lg px-4 py-2 text-sm">
          <span className="font-medium text-blue-700">{metrics.totalOrders}</span>
          <span className="text-blue-600 ml-1">total orders</span>
        </div>
        <div className="bg-amber-50 rounded-lg px-4 py-2 text-sm">
          <span className="font-medium text-amber-700">{metrics.pendingOrders}</span>
          <span className="text-amber-600 ml-1">pending</span>
        </div>
        <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
          <span className="font-medium text-green-700">{metrics.paidOrders}</span>
          <span className="text-green-600 ml-1">paid / fulfilled</span>
        </div>
      </div>

      {/* Custom date range */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Custom date range</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => { setRangeStart(e.target.value); setRangeResult(null); }}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => { setRangeEnd(e.target.value); setRangeResult(null); }}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          <button
            onClick={fetchRange}
            disabled={!rangeStart || !rangeEnd || loading}
            className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>
        {fetchError && <p className="mt-2 text-sm text-red-500">Failed to load data</p>}
        {rangeResult && (
          <div className="mt-4">
            <StatCard
              label={`${rangeStart} → ${rangeEnd}`}
              revenue={rangeResult.revenue}
              profit={rangeResult.profit}
              orders={rangeResult.orders}
            />
          </div>
        )}
      </div>
    </div>
  );
}
