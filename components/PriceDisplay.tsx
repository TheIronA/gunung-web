import { formatPrice, getPriceDisplayData } from '@/lib/price-helpers';

interface PriceDisplayProps {
  price: number;
  salePrice?: number | null;
  saleEndDate?: string | null;
  currency: string;
  size?: 'small' | 'medium' | 'large';
  showSavings?: boolean;
}

export default function PriceDisplay({
  price,
  salePrice,
  saleEndDate,
  currency,
  size = 'medium',
  showSavings = true,
}: PriceDisplayProps) {
  const priceData = getPriceDisplayData(price, salePrice, saleEndDate);

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
