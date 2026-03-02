import { verifyAuth, logout } from '@/app/admin/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getBusinessMetrics,
  getOrdersWithItems,
  getInventoryOverview,
  getBestSellers,
} from '@/app/admin/business-actions';
import RevenueStats from '@/components/admin/RevenueStats';
import OrdersTable from '@/components/admin/OrdersTable';
import InventoryOverview from '@/components/admin/InventoryOverview';
import BestSellers from '@/components/admin/BestSellers';

export default async function BusinessDashboard() {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    redirect('/admin');
  }

  const [metrics, orders, inventory, bestSellers] = await Promise.all([
    getBusinessMetrics(),
    getOrdersWithItems(),
    getInventoryOverview(),
    getBestSellers(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100" suppressHydrationWarning>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">Gunung Admin</h1>
              <div className="flex gap-1">
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Inventory
                </Link>
                <Link
                  href="/admin/business"
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-700"
                >
                  Business
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <form action={logout}>
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        <RevenueStats metrics={metrics} />
        <OrdersTable initialOrders={orders} products={inventory} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <BestSellers items={bestSellers} />
          <InventoryOverview products={inventory} />
        </div>
      </main>
    </div>
  );
}
