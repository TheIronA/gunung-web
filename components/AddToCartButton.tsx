"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import { checkStock } from "@/lib/products";

export default function AddToCartButton({
  product,
  selectedSize,
  disabled = false,
}: {
  product: Product;
  selectedSize?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [availableStock, setAvailableStock] = useState<number>(
    selectedSize
      ? product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
      : Infinity
  );
  const [loading, setLoading] = useState(false);

  // Fetch real-time stock from Supabase
  const fetchStock = async () => {
    if (selectedSize) {
      setLoading(true);
      try {
        const stock = await checkStock(product.id, selectedSize);
        setAvailableStock(stock);
      } catch {
        // Fallback to product data on error
        const fallbackStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 0;
        setAvailableStock(fallbackStock);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, selectedSize]);

  // Don't subtract cart quantity - that's managed separately
  const remainingStock = availableStock;

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  const handleAddToCart = () => {
    if (remainingStock !== Infinity && quantity > remainingStock) {
      alert(`Only ${remainingStock} items available in stock`);
      return;
    }

    const executeAction = () => {
      addItem(product, quantity, selectedSize);
      // Redirect to cart page immediately after adding
      router.push('/cart');
    };

    // Add delay on mobile to show animation
    if (isMobile()) {
      setTimeout(executeAction, 150);
    } else {
      executeAction();
    }
  };

  const maxQuantity = remainingStock === Infinity ? 99 : Math.max(1, remainingStock);

  return (
    <div className="space-y-4">
      {selectedSize && remainingStock !== Infinity && (
        <p className="text-sm text-gray-600">
          {remainingStock > 0
            ? `${remainingStock} available`
            : "Out of stock"}
        </p>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-border rounded shadow-brutal">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            disabled={disabled || remainingStock === 0 || quantity <= 1}
          >
            −
          </button>
          <span className="px-6 py-2 font-medium border-x border-border bg-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            disabled={disabled || remainingStock === 0 || quantity >= maxQuantity}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || remainingStock === 0 || loading}
        className="w-full md:w-auto bg-primary text-white px-8 py-4 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brutal disabled:hover:translate-x-0 disabled:hover:translate-y-0"
      >
        {remainingStock === 0
          ? "Out of Stock"
          : loading
          ? "Loading..."
          : "Add to Cart"}
      </button>
    </div>
  );
}
