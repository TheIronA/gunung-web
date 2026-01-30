/**
 * Shipping rate calculator for Malaysia
 * Rates are based on standard courier services (PosLaju, J&T, etc.)
 * All rates in cents (MYR)
 */

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  rate: number; // in cents
  estimatedDays: string;
}

// Malaysian states categorization
const WEST_MALAYSIA_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Putrajaya',
];

const EAST_MALAYSIA_STATES = [
  'Sabah',
  'Sarawak',
  'Labuan',
];

export function isEastMalaysia(state: string): boolean {
  return EAST_MALAYSIA_STATES.some(
    (eastState) => state.toLowerCase().includes(eastState.toLowerCase())
  );
}

export function isWestMalaysia(state: string): boolean {
  return WEST_MALAYSIA_STATES.some(
    (westState) => state.toLowerCase().includes(westState.toLowerCase())
  );
}

/**
 * Calculate shipping rates based on location
 * Returns array of available shipping options
 */
export function calculateShippingRates(state: string, postalCode?: string): ShippingRate[] {
  const isEast = isEastMalaysia(state);
  
  if (isEast) {
    // East Malaysia rates (Sabah, Sarawak, Labuan)
    return [
      {
        id: 'standard_east',
        name: 'Standard Shipping (East Malaysia)',
        description: 'Delivery via courier service',
        rate: 1500, // RM 15.00
        estimatedDays: '5-7 business days',
      },
      {
        id: 'express_east',
        name: 'Express Shipping (East Malaysia)',
        description: 'Priority delivery',
        rate: 2500, // RM 25.00
        estimatedDays: '3-4 business days',
      },
    ];
  } else {
    // West Malaysia rates (Peninsular Malaysia)
    return [
      {
        id: 'standard_west',
        name: 'Standard Shipping (West Malaysia)',
        description: 'Delivery via courier service',
        rate: 800, // RM 8.00
        estimatedDays: '2-4 business days',
      },
      {
        id: 'express_west',
        name: 'Express Shipping (West Malaysia)',
        description: 'Priority delivery',
        rate: 1500, // RM 15.00
        estimatedDays: '1-2 business days',
      },
    ];
  }
}

/**
 * Get shipping rate by ID
 */
export function getShippingRate(rateId: string, state: string): ShippingRate | null {
  const rates = calculateShippingRates(state);
  return rates.find((rate) => rate.id === rateId) || null;
}

/**
 * Validate Malaysian state
 */
export function isValidMalaysianState(state: string): boolean {
  return isWestMalaysia(state) || isEastMalaysia(state);
}
