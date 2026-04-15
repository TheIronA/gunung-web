import type { Region } from "./region-context";
import type { Product } from "./products";

export interface PriceDisplayData {
  currentPrice: number; // The price to charge (sale or regular)
  originalPrice?: number; // Only set if on sale
  savings?: number; // Amount saved
  savingsPercentage?: number; // Percentage saved
  isOnSale: boolean;
}

/**
 * Calculates price display data including sale status and savings
 */
export function getPriceDisplayData(
  price: number,
  salePrice: number | null | undefined,
  saleEndDate?: string | null
): PriceDisplayData {
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

// Conversion rates from MYR
const MYR_TO_IDR = 4320; // 1 MYR ≈ 4,320 IDR (based on actual product pricing)
const MYR_TO_SGD_CENTS = 1 / 3.14; // 1 MYR cent ≈ 0.318 SGD cents
const MYR_TO_PHP = 12.6; // 1 MYR ≈ 12.6 PHP

/**
 * Get price display data for a product in the given region.
 * Uses explicit regional prices when available, otherwise auto-converts from MYR.
 */
export function getRegionalPriceData(
  product: Product,
  region: Region
): { priceData: PriceDisplayData; currency: string } {
  if (region === "ID") {
    if (product.price_idr != null) {
      return {
        priceData: getPriceDisplayData(
          product.price_idr,
          product.sale_price_idr,
          product.sale_end_date
        ),
        currency: "idr",
      };
    }
    // Auto-convert from MYR cents → IDR whole rupiah
    const convertedPrice = Math.round((product.price / 100) * MYR_TO_IDR);
    const convertedSale = product.sale_price != null
      ? Math.round((product.sale_price / 100) * MYR_TO_IDR)
      : null;
    return {
      priceData: getPriceDisplayData(convertedPrice, convertedSale, product.sale_end_date),
      currency: "idr",
    };
  }

  if (region === "SG") {
    if (product.price_sgd != null) {
      return {
        priceData: getPriceDisplayData(
          product.price_sgd,
          product.sale_price_sgd,
          product.sale_end_date
        ),
        currency: "sgd",
      };
    }
    // Auto-convert from MYR cents → SGD cents
    const convertedPrice = Math.round(product.price * MYR_TO_SGD_CENTS);
    const convertedSale = product.sale_price != null
      ? Math.round(product.sale_price * MYR_TO_SGD_CENTS)
      : null;
    return {
      priceData: getPriceDisplayData(convertedPrice, convertedSale, product.sale_end_date),
      currency: "sgd",
    };
  }
  
  if (region === "PH") {
    if (product.price_php != null) {
      return {
        priceData: getPriceDisplayData(
          product.price_php,
          product.sale_price_php,
          product.sale_end_date
        ),
        currency: "php",
      };
    }
    // Auto-convert from MYR cents → PHP cents
    const convertedPrice = Math.round(product.price * MYR_TO_PHP);
    const convertedSale = product.sale_price != null
      ? Math.round(product.sale_price * MYR_TO_PHP)
      : null;
    return {
      priceData: getPriceDisplayData(convertedPrice, convertedSale, product.sale_end_date),
      currency: "php",
    };
  }

  return {
    priceData: getPriceDisplayData(
      product.price,
      product.sale_price,
      product.sale_end_date
    ),
    currency: "myr",
  };
}

/**
 * Formats a price to a currency string.
 * MYR: stored in cents → RM 399.00
 * SGD: stored in cents → S$145.00
 * IDR: stored as whole rupiah → Rp 899.000
 */
export function formatPrice(amount: number, currency: string): string {
  const code = currency.toUpperCase();

  if (code === "IDR") {
    // IDR stored as whole rupiah (no cents)
    return "Rp " + amount.toLocaleString("id-ID");
  }

  if (code === "SGD") {
    // SGD stored in cents
    return (amount / 100).toLocaleString("en-SG", {
      style: "currency",
      currency: "SGD",
    });
  }

  if (code === "PHP") {
    // PHP stored in cents
    return (amount / 100).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  }

  // MYR stored in cents
  return (amount / 100).toLocaleString("en-MY", {
    style: "currency",
    currency: "MYR",
  });
}
