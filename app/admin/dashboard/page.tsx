import { verifyAuth, logout } from '@/app/admin/actions';
import { redirect } from 'next/navigation';
import { getProducts, getStoreSettings } from '@/lib/products';
import StockEditor from '@/components/admin/StockEditor';
import StoreStatusToggle from '@/components/admin/StoreStatusToggle';
import ProductVisibilityToggle from '@/components/admin/ProductVisibilityToggle';
import ProductPriceEditor from '@/components/admin/ProductPriceEditor';

export default async function AdminDashboard() {
    const isAuth = await verifyAuth();
    if (!isAuth) {
        redirect('/admin');
    }

    const products = await getProducts();
    const { isStoreOpen } = await getStoreSettings();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">Gunung Admin</h1>
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

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                    </div>

                    <StoreStatusToggle initialIsOpen={isStoreOpen} />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <div key={product.id} className={`bg-white overflow-hidden shadow rounded-lg ${!product.is_active ? 'opacity-75 bg-gray-50' : ''}`}>
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-16 w-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {/* Format price from cents to currency */}
                                                {(product.price / 100).toLocaleString('en-MY', {
                                                    style: 'currency',
                                                    currency: product.currency,
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <ProductVisibilityToggle
                                        productId={product.id}
                                        initialIsActive={product.is_active}
                                    />

                                    <ProductPriceEditor
                                        productId={product.id}
                                        initialPrice={product.price}
                                    />

                                    <div className="border-t border-gray-200 pt-4">
                                        <StockEditor
                                            productId={product.id}
                                            initialSizes={product.sizes || []}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
