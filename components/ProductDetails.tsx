"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import PriceDisplay from "./PriceDisplay";

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Check if size is required but not selected
  const isSizeRequired = product.sizes && product.sizes.length > 0;
  const canAddToCart = !isSizeRequired || selectedSize !== "";
  const isComingSoon = !product.image.startsWith('http');

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">
        {product.name}
      </h1>
      {isComingSoon ? (
        <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-lg font-bold mb-6 border border-accent/20">
          Coming Soon
        </div>
      ) : (
        <div className="mb-6">
          <PriceDisplay
            price={product.price}
            salePrice={product.sale_price}
            saleEndDate={product.sale_end_date}
            currency={product.currency}
            size="large"
            showSavings={true}
          />
        </div>
      )}

      <div className="prose prose-lg text-gray-600 mb-8">
        <p>{product.details}</p>
      </div>

      {/* Size Selection */}
      {isSizeRequired && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {product.sizes!.map((sizeOption) => {
              const isOutOfStock = sizeOption.stock === 0;
              const isSelected = selectedSize === sizeOption.size;

              return (
                <button
                  key={sizeOption.size}
                  onClick={() => !isOutOfStock && setSelectedSize(sizeOption.size)}
                  disabled={isOutOfStock}
                  className={`
                    py-3 px-4 border rounded text-sm font-medium transition-all duration-200
                    ${isSelected
                      ? 'border-accent bg-accent text-white shadow-brutal-sm'
                      : isOutOfStock
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-border bg-white hover:border-accent hover:shadow-brutal-sm'
                    }
                  `}
                >
                  {sizeOption.size}
                  {isOutOfStock && (
                    <span className="block text-xs mt-1">Out of stock</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isComingSoon && (
        <div className="border-t border-border pt-8">
          {!canAddToCart && (
            <p className="text-sm text-red-600 mb-4 font-medium">
              Please select a size to continue
            </p>
          )}
          <AddToCartButton
            product={product}
            disabled={!canAddToCart}
            selectedSize={selectedSize}
          />
          <p className="text-xs text-gray-500 mt-4 font-mono">
            Secure payment via Stripe • Free shipping within Malaysia
          </p>
        </div>
      )}
    </div>
  );
}
