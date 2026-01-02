"use client";

import { useState } from "react";

export default function ProductCheckoutButton({
  productId,
  price,
  currency,
  disabled = false,
  selectedSize,
}: {
  productId: string;
  price: number;
  currency: string;
  disabled?: boolean;
  selectedSize?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ id: productId, quantity: 1, size: selectedSize }],
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
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className="w-full md:w-auto bg-primary text-white px-8 py-4 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brutal disabled:hover:translate-x-0 disabled:hover:translate-y-0"
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}
