import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import ProductCheckoutButton from "./ProductCheckoutButton";

export default function StoreProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {products.map((product) => {
        const isComingSoon = !product.image.startsWith('http');

        return (
          <div
            key={product.id}
            className="border border-border rounded bg-white p-6 flex flex-col gap-4 shadow-brutal-sm hover:shadow-brutal transition-all duration-200 group"
          >
            <Link href={`/store/${product.id}`} className="block">
              <div className="aspect-square bg-white relative rounded overflow-hidden mb-4 flex items-center justify-center">
                {isComingSoon ? (
                  <div className="text-gray-400 text-lg font-medium">Coming Soon</div>
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
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
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold">
                    {(product.price / 100).toLocaleString("en-MY", {
                      style: "currency",
                      currency: product.currency.toUpperCase(),
                    })}
                  </span>
                  <div className="scale-90 origin-right">
                     <ProductCheckoutButton
                        productId={product.id}
                        price={product.price}
                        currency={product.currency}
                      />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
