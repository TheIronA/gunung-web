import { getProducts } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import PriceDisplay from "./PriceDisplay";

export default async function StoreProductList() {
  const products = await getProducts();
  const activeProducts = products.filter(p => p.is_active);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {activeProducts.map((product) => {
        const isComingSoon = !product.image.startsWith('http');
        const isActive = product.is_active;

        // Calculate total stock
        const totalStock = product.sizes?.reduce((acc, size) => acc + size.stock, 0) ?? 0;
        const isSoldOut = totalStock === 0 && !isComingSoon;

        return (
          <div
            key={product.id}
            className="border border-border rounded bg-white p-6 flex flex-col gap-4 shadow-brutal-sm hover:shadow-brutal transition-all duration-200 group"
          >
            <Link href={`/store/${product.id}`} className="block relative">
              {isSoldOut && (
                <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                  SOLD OUT
                </div>
              )}
              <div className={`aspect-square bg-white relative rounded overflow-hidden mb-4 flex items-center justify-center ${isSoldOut ? 'opacity-70' : ''}`}>
                {isComingSoon ? (
                  <div className="text-gray-400 text-lg font-medium">Coming Soon</div>
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-contain group-hover:scale-105 transition-transform duration-300 p-4 ${isSoldOut ? 'grayscale' : ''}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading group-hover:text-accent transition-colors">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
              </div>
            </Link>
            <div className="mt-auto pt-4 border-t border-gray-100">
              {isComingSoon ? (
                <div className="text-center py-2">
                  <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold border border-accent/20">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <PriceDisplay
                    price={product.price}
                    salePrice={product.sale_price}
                    saleEndDate={product.sale_end_date}
                    currency={product.currency}
                    size="medium"
                    showSavings={true}
                  />

                  {isSoldOut ? (
                    <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 border border-gray-300 rounded cursor-not-allowed font-bold text-sm whitespace-nowrap">
                      Sold Out
                    </button>
                  ) : (
                    <Link
                      href={`/store/${product.id}`}
                      className="bg-primary text-white px-4 py-2 border border-primary rounded shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
