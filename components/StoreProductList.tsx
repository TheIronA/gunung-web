"use client";

import { products } from "@/lib/products";
import { useState } from "react";

export default function StoreProductList() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (productId: string) => {
    try {
      setLoading(productId);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ id: productId, quantity: 1 }],
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-border rounded bg-white p-6 flex flex-col gap-4 shadow-brutal-sm hover:shadow-brutal transition-all duration-200"
        >
          <div className="aspect-square bg-gray-100 relative rounded overflow-hidden">
            {/* Replace with actual Image component when you have images */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              {product.name} Image
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{product.description}</p>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-mono font-bold">
              {(product.price / 100).toLocaleString("en-MY", {
                style: "currency",
                currency: product.currency.toUpperCase(),
              })}
            </span>
            <button
              onClick={() => handleCheckout(product.id)}
              disabled={loading === product.id}
              className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === product.id ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
