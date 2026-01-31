export interface PriceDisplayData {
  currentPrice: number; // The price to charge (sale or regular)
  originalPrice?: number; // Only set if on sale
  savings?: number; // Amount saved in cents
  savingsPercentage?: number; // Percentage saved
  isOnSale: boolean;
}

/**
 * Calculates price display data including sale status and savings
 * @param price - Regular price in cents
 * @param salePrice - Sale price in cents (null if no sale)
 * @param saleEndDate - Optional end date for the sale
 * @returns Price display data with current price, savings, and sale status
 */
export function getPriceDisplayData(
  price: number,
  salePrice: number | null | undefined,
  saleEndDate?: string | null
): PriceDisplayData {
  // Check if sale is still valid (if end date exists)
  const isSaleValid = salePrice !== null && salePrice !== undefined &&
    (!saleEndDate || new Date(saleEndDate) > new Date());

  if (isSaleValid && salePrice < price) {
    const savings = price - salePrice;
    const savingsPercentage = Math.round((savings / price) * 100);

    return {
      currentPrice: salePrice,
      originalPrice: price,
      savings,
      savingsPercentage,
      isOnSale: true,
    };
  }

  return {
    currentPrice: price,
    isOnSale: false,
  };
}

/**
 * Formats a price in cents to a currency string
 * @param priceInCents - Price in cents
 * @param currency - Currency code (e.g., 'myr')
 * @returns Formatted price string (e.g., 'RM 459.99')
 */
export function formatPrice(priceInCents: number, currency: string): string {
  return (priceInCents / 100).toLocaleString('en-MY', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
}
