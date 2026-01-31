"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { getPriceDisplayData } from "@/lib/price-helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateShippingRates, isValidMalaysianState, type ShippingRate } from "@/lib/shipping";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>("");
  const [shippingError, setShippingError] = useState("");

  const formatPrice = (cents: number, currency: string) => {
    const formatted = (cents / 100).toFixed(2);
    return currency.toUpperCase() === "MYR" ? `RM ${formatted}` : `$${formatted}`;
  };

  // Calculate shipping rates when state is entered
  useEffect(() => {
    if (shippingAddress.state) {
      setShippingError("");

      if (!isValidMalaysianState(shippingAddress.state)) {
        setShippingError("Please enter a valid Malaysian state");
        setShippingRates([]);
        setSelectedShippingRate("");
        return;
      }

      const rates = calculateShippingRates(shippingAddress.state, shippingAddress.postalCode);
      setShippingRates(rates);

      // Auto-select first option
      if (rates.length > 0 && !selectedShippingRate) {
        setSelectedShippingRate(rates[0].id);
      }
    } else {
      setShippingRates([]);
      setSelectedShippingRate("");
    }
  }, [shippingAddress.state, shippingAddress.postalCode, selectedShippingRate]);

  const selectedRate = shippingRates.find((rate) => rate.id === selectedShippingRate);
  const shippingCost = selectedRate ? selectedRate.rate : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (isMobile()) {
      setTimeout(processCheckout, 150);
    } else {
      processCheckout();
    }
  };

  const processCheckout = async () => {
    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.phone ||
        !shippingAddress.line1 || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.postalCode) {
      alert("Please fill in all required shipping address fields");
      return;
    }

    if (!isValidMalaysianState(shippingAddress.state)) {
      alert("Please enter a valid Malaysian state");
      return;
    }

    if (!selectedShippingRate) {
      alert("Please select a shipping method");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
          })),
          shippingAddress,
          shippingRateId: selectedShippingRate,
          discountCode: discountCode || undefined,
          notes: orderNotes || undefined,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Clear cart on successful checkout
        clearCart();
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
      <Navigation />
      <div className="flex-grow py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Review */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Form */}
              <div className="bg-white border border-border rounded shadow-brutal p-6">
                <h2 className="font-heading font-bold text-2xl mb-4">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+60123456789"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123 Jalan Example"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.line2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Kuala Lumpur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Selangor"
                      required
                    />
                    {shippingError && (
                      <p className="text-sm text-red-600 mt-1">{shippingError}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              {shippingRates.length > 0 && (
                <div className="bg-white border border-border rounded shadow-brutal p-6">
                  <h2 className="font-heading font-bold text-2xl mb-4">
                    Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {shippingRates.map((rate) => (
                      <label
                        key={rate.id}
                        className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                          selectedShippingRate === rate.id
                            ? "border-primary bg-primary/5 shadow-brutal-sm"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value={rate.id}
                            checked={selectedShippingRate === rate.id}
                            onChange={(e) => setSelectedShippingRate(e.target.value)}
                            className="mr-3 w-4 h-4 text-primary"
                          />
                          <div>
                            <p className="font-heading font-bold">{rate.name}</p>
                            <p className="text-sm text-gray-600">
                              {rate.description} • {rate.estimatedDays}
                            </p>
                          </div>
                        </div>
                        <p className="font-heading font-bold text-lg">
                          {formatPrice(rate.rate, items[0].product.currency)}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Review */}
              <div className="bg-white border border-border rounded shadow-brutal p-6">
                <h2 className="font-heading font-bold text-2xl mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize || "no-size"}`}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 border border-border rounded relative overflow-hidden">
                        {item.product.image.startsWith("http") ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <h3 className="font-heading font-bold">
                          {item.product.name}
                        </h3>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-heading font-bold">
                          {(() => {
                            const priceData = getPriceDisplayData(
                              item.product.price,
                              item.product.sale_price,
                              item.product.sale_end_date
                            );
                            return formatPrice(
                              priceData.currentPrice * item.quantity,
                              item.product.currency
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/cart"
                  className="inline-block mt-4 text-primary hover:underline font-medium text-sm"
                >
                  ← Edit Cart
                </Link>
              </div>

              {/* Discount Code */}
              <div className="bg-white border border-border rounded shadow-brutal p-6">
                <h2 className="font-heading font-bold text-xl mb-4">
                  Discount Code
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-grow px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    className="px-6 py-3 bg-gray-100 border border-border rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
                    disabled
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Discount codes coming soon!
                </p>
              </div>

              {/* Order Notes */}
              <div className="bg-white border border-border rounded shadow-brutal p-6">
                <h2 className="font-heading font-bold text-xl mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for your order?"
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded shadow-brutal focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Order Summary & Payment */}
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
                    <span>
                      {selectedRate ? (
                        formatPrice(shippingCost, items[0].product.currency)
                      ) : (
                        <span className="text-sm text-gray-500">
                          Enter address
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-xl">
                    <span>Total</span>
                    <span>{formatPrice(total, items[0].product.currency)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-primary text-white px-6 py-4 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brutal disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  {loading ? "Processing..." : "Pay with Stripe"}
                </button>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p>
                      <strong>Secure Payment:</strong> Your payment information
                      is encrypted and secure.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p>
                      <strong>Order Confirmation:</strong> You'll receive an email
                      confirmation after payment.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <div>
                      <p className="mb-1">
                        <strong>Shipping Rates:</strong>
                      </p>
                      <p className="text-xs">
                        • West Malaysia: RM 8 (Standard) / RM 15 (Express)<br />
                        • East Malaysia: RM 15 (Standard) / RM 25 (Express)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
