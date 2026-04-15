"use client";

import { formatPrice, getRegionalPriceData } from '@/lib/price-helpers';
import { useRegion } from '@/lib/region-context';
import type { Product } from '@/lib/products';

interface PriceDisplayProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  showSavings?: boolean;
}

export default function PriceDisplay({
  product,
  size = 'medium',
  showSavings = true,
}: PriceDisplayProps) {
  const { region } = useRegion();
  const { priceData, currency } = getRegionalPriceData(product, region);

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  const savingsSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  if (priceData.isOnSale) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`${sizeClasses[size]} font-mono font-bold text-accent`}>
          {formatPrice(priceData.currentPrice, currency)}
        </span>
        <span className={`${sizeClasses[size]} font-mono text-gray-400 line-through`}>
          {formatPrice(priceData.originalPrice!, currency)}
        </span>
        {showSavings && priceData.savingsPercentage && (
          <span className={`${savingsSizeClasses[size]} font-bold text-white bg-red-600 px-2 py-1 rounded`}>
            Save {priceData.savingsPercentage}%
          </span>
        )}
      </div>
    );
  }

  return (
    <span className={`${sizeClasses[size]} font-mono font-bold`}>
      {formatPrice(priceData.currentPrice, currency)}
    </span>
  );
}
