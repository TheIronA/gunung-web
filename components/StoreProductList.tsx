import { products } from "@/lib/products";
import Link from "next/link";
import ProductCheckoutButton from "./ProductCheckoutButton";

export default function StoreProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-border rounded bg-white p-6 flex flex-col gap-4 shadow-brutal-sm hover:shadow-brutal transition-all duration-200 group"
        >
          <Link href={`/store/${product.id}`} className="block">
            <div className="aspect-square bg-gray-100 relative rounded overflow-hidden mb-4">
              {/* Replace with actual Image component when you have images */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-300">
                {product.name} Image
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading group-hover:text-accent transition-colors">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
            </div>
          </Link>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
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
        </div>
      ))}
    </div>
  );
}
