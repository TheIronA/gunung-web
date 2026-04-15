'use client';

import { useState } from 'react';
import { getMetricsForRange } from '@/app/admin/business-actions';
import type { BusinessMetrics, CurrencyMetrics } from '@/app/admin/business-actions';

interface RevenueStatsProps {
  metrics: BusinessMetrics;
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

function StatCard({
  label,
  revenue,
  profit,
  orders,
  formatter,
}: {
  label: string;
  revenue: number;
  profit: number | null;
  orders?: number;
  formatter: (n: number) => string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{formatter(revenue)}</p>
      {profit !== null ? (
        <p className="mt-1 text-sm text-green-600">Profit: {formatter(profit)}</p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">Set cost prices to see profit</p>
      )}
      {orders !== undefined && (
        <p className="mt-1 text-xs text-gray-500">{orders} paid order{orders !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}

function CurrencySection({
  label,
  metrics,
  formatter,
  paidOrders,
}: {
  label: string;
  metrics: CurrencyMetrics;
  formatter: (n: number) => string;
  paidOrders?: number;
}) {
  const hasData = metrics.allTimeRevenue > 0;
  if (!hasData) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard
          label="All Time"
          revenue={metrics.allTimeRevenue}
          profit={metrics.allTimeProfit}
          orders={paidOrders}
          formatter={formatter}
        />
        <StatCard
          label="This Month"
          revenue={metrics.thisMonthRevenue}
          profit={metrics.thisMonthProfit}
          formatter={formatter}
        />
        <StatCard
          label="Last 7 Days"
          revenue={metrics.thisWeekRevenue}
          profit={metrics.thisWeekProfit}
          formatter={formatter}
        />
      </div>
    </div>
  );
}

export default function RevenueStats({ metrics }: RevenueStatsProps) {
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeResult, setRangeResult] = useState<{
    myr: { revenue: number; profit: number | null; orders: number };
    idr: { revenue: number; profit: number | null; orders: number };
    sgd: { revenue: number; profit: number | null; orders: number };
    php: { revenue: number; profit: number | null; orders: number };
  } | null>(null);
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

      <CurrencySection
        label="MYR (Malaysia)"
        metrics={metrics.myr}
        formatter={formatMYR}
        paidOrders={metrics.paidOrders}
      />
      <CurrencySection
        label="IDR (Indonesia)"
        metrics={metrics.idr}
        formatter={formatIDR}
      />
      <CurrencySection
        label="SGD (Singapore)"
        metrics={metrics.sgd}
        formatter={formatSGD}
      />
      <CurrencySection
        label="PHP (Philippines)"
        metrics={metrics.php}
        formatter={formatPHP}
      />

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
          <div className="mt-4 space-y-3">
            {rangeResult.myr.orders > 0 && (
              <StatCard
                label={`${rangeStart} → ${rangeEnd} (MYR)`}
                revenue={rangeResult.myr.revenue}
                profit={rangeResult.myr.profit}
                orders={rangeResult.myr.orders}
                formatter={formatMYR}
              />
            )}
            {rangeResult.idr.orders > 0 && (
              <StatCard
                label={`${rangeStart} → ${rangeEnd} (IDR)`}
                revenue={rangeResult.idr.revenue}
                profit={rangeResult.idr.profit}
                orders={rangeResult.idr.orders}
                formatter={formatIDR}
              />
            )}
            {rangeResult.sgd.orders > 0 && (
              <StatCard
                label={`${rangeStart} → ${rangeEnd} (SGD)`}
                revenue={rangeResult.sgd.revenue}
                profit={rangeResult.sgd.profit}
                orders={rangeResult.sgd.orders}
                formatter={formatSGD}
              />
            )}
            {rangeResult.php.orders > 0 && (
              <StatCard
                label={`${rangeStart} → ${rangeEnd} (PHP)`}
                revenue={rangeResult.php.revenue}
                profit={rangeResult.php.profit}
                orders={rangeResult.php.orders}
                formatter={formatPHP}
              />
            )}
            {rangeResult.myr.orders === 0 && rangeResult.idr.orders === 0 && rangeResult.sgd.orders === 0 && rangeResult.php.orders === 0 && (
              <p className="text-sm text-gray-400">No paid orders in this range</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
