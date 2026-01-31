"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { getPriceDisplayData } from "@/lib/price-helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [confirmRemove, setConfirmRemove] = useState<{ productId: string; size?: string } | null>(null);

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  const formatPrice = (cents: number, currency: string) => {
    const formatted = (cents / 100).toFixed(2);
    return currency.toUpperCase() === "MYR" ? `RM ${formatted}` : `$${formatted}`;
  };

  // Check available stock for each item
  const getAvailableStock = (item: typeof items[0]) => {
    if (!item.selectedSize || !item.product.sizes) {
      return Infinity; // No size restriction
    }
    const sizeData = item.product.sizes.find((s) => s.size === item.selectedSize);
    return sizeData?.stock ?? 0;
  };

  const handleDecreaseQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity === 1) {
      // Show confirmation modal
      setConfirmRemove({ productId, size });
    } else {
      updateQuantity(productId, quantity - 1, size);
    }
  };

  const handleConfirmRemove = () => {
    if (confirmRemove) {
      const executeAction = () => {
        removeItem(confirmRemove.productId, confirmRemove.size);
        setConfirmRemove(null);
      };

      if (isMobile()) {
        setTimeout(executeAction, 150);
      } else {
        executeAction();
      }
    }
  };

  const handleClearCart = () => {
    if (isMobile()) {
      setTimeout(clearCart, 150);
    } else {
      clearCart();
    }
  };

  const handleCheckout = () => {
    // Validate stock before checkout
    const stockIssues = items.filter((item) => {
      const availableStock = getAvailableStock(item);
      return availableStock !== Infinity && item.quantity > availableStock;
    });

    if (stockIssues.length > 0) {
      alert(
        `Some items exceed available stock:\n${stockIssues
          .map(
            (item) =>
              `${item.product.name} (${item.selectedSize}): ${item.quantity} requested, ${getAvailableStock(
                item
              )} available`
          )
          .join("\n")}`
      );
      return;
    }

    if (items.length > 0) {
      const executeAction = () => {
        router.push("/checkout");
      };

      if (isMobile()) {
        setTimeout(executeAction, 150);
      } else {
        executeAction();
      }
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
        <Navigation />
        <div className="flex-grow py-12 lg:py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-8">
              Shopping Cart
            </h1>
            <div className="bg-white border border-border rounded shadow-brutal p-12 text-center">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-heading font-bold mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding some gear to your collection!
              </p>
              <Link
                href="/store"
                className="inline-block bg-primary text-white px-8 py-4 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading"
              >
                Browse Store
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
      <Navigation />
      <div className="flex-grow py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h1 className="text-4xl md:text-5xl font-heading font-black">
              Shopping Cart
            </h1>
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const availableStock = getAvailableStock(item);
                const hasStockIssue =
                  availableStock !== Infinity && item.quantity > availableStock;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize || "no-size"}`}
                    className="bg-white border border-border rounded shadow-brutal p-6"
                  >
                    <div className="flex gap-6">
                      {/* Product Image & Quantity */}
                      <div className="flex-shrink-0 flex flex-col gap-3">
                        <div className="w-24 h-24 bg-gray-50 border border-border rounded relative overflow-hidden">
                          {item.product.image.startsWith("http") ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-contain p-2"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded shadow-brutal w-fit">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(
                                item.product.id,
                                item.quantity,
                                item.selectedSize
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-100 transition-colors font-bold text-sm"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-medium border-x border-border bg-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const maxQty =
                                availableStock === Infinity
                                  ? 99
                                  : availableStock;
                              updateQuantity(
                                item.product.id,
                                Math.min(item.quantity + 1, maxQty),
                                item.selectedSize
                              );
                            }}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                            disabled={
                              availableStock !== Infinity &&
                              item.quantity >= availableStock
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-heading font-bold text-lg">
                              {item.product.name}
                            </h3>
                            {item.selectedSize && (
                              <p className="text-sm text-gray-600">
                                Size: {item.selectedSize}
                              </p>
                            )}
                            {hasStockIssue && (
                              <p className="text-sm text-red-600 font-medium mt-1">
                                ⚠ Only {availableStock} in stock
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              setConfirmRemove({ productId: item.product.id, size: item.selectedSize })
                            }
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <p className="text-sm text-gray-600">
                            {item.product.description}
                          </p>

                          {/* Price */}
                          <div className="text-right">
                            {(() => {
                              const priceData = getPriceDisplayData(
                                item.product.price,
                                item.product.sale_price,
                                item.product.sale_end_date
                              );
                              return (
                                <>
                                  <div className="text-sm text-gray-600 mb-1">
                                    {priceData.isOnSale ? (
                                      <>
                                        <span className="line-through mr-1">
                                          {formatPrice(priceData.originalPrice!, item.product.currency)}
                                        </span>
                                        <span className="text-accent font-bold">
                                          {formatPrice(priceData.currentPrice, item.product.currency)}
                                        </span>
                                        {" each"}
                                      </>
                                    ) : (
                                      <>
                                        {formatPrice(priceData.currentPrice, item.product.currency)} each
                                      </>
                                    )}
                                  </div>
                                  <p className="font-heading font-bold text-lg">
                                    {formatPrice(
                                      priceData.currentPrice * item.quantity,
                                      item.product.currency
                                    )}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-border rounded shadow-brutal p-6 sticky top-6">
                <h2 className="font-heading font-bold text-2xl mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal, items[0].product.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-xl">
                    <span>Total</span>
                    <span>{formatPrice(subtotal, items[0].product.currency)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white px-6 py-4 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading text-lg mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/store"
                  className="block text-center text-primary hover:underline font-medium"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>
                      Secure checkout powered by Stripe. Free shipping on orders
                      over RM 500.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Confirmation Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-border rounded shadow-brutal p-6 max-w-md w-full">
            <h2 className="font-heading font-bold text-2xl mb-4">
              Remove Item?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 px-6 py-3 border-2 border-border rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-6 py-3 bg-red-600 text-white border-2 border-red-600 rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
