/**
 * Shipping rate calculator for Malaysia, Indonesia & Singapore
 * MY rates based on PosLaju / J&T (MYR cents)
 * ID rates based on J&T / JNE for ~1kg package (IDR whole rupiah)
 * SG rates based on Pos Malaysia international / Ninja Van cross-border (SGD cents)
 */

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  rate: number; // MYR cents or IDR whole rupiah depending on country
  currency: string;
  estimatedDays: string;
}

// ─── Malaysia ────────────────────────────────────────────────────────────────

const WEST_MALAYSIA_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Selangor',
  'Terengganu', 'Kuala Lumpur', 'Putrajaya',
];

const EAST_MALAYSIA_STATES = ['Sabah', 'Sarawak', 'Labuan'];

export function isEastMalaysia(state: string): boolean {
  return EAST_MALAYSIA_STATES.some(
    (s) => state.toLowerCase().includes(s.toLowerCase())
  );
}

export function isWestMalaysia(state: string): boolean {
  return WEST_MALAYSIA_STATES.some(
    (s) => state.toLowerCase().includes(s.toLowerCase())
  );
}

export function isValidMalaysianState(state: string): boolean {
  return isWestMalaysia(state) || isEastMalaysia(state);
}

// ─── Indonesia ───────────────────────────────────────────────────────────────

// Zone 1: Java + Bali (cheapest, most accessible)
const INDONESIA_ZONE_1 = [
  'Jakarta', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'DI Yogyakarta', 'Banten', 'Bali',
];

// Zone 2: Sumatra, Kalimantan, Sulawesi, NTB, NTT
const INDONESIA_ZONE_2 = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
  'Jambi', 'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Bangka Belitung',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
  'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
  'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
];

// Zone 3: Papua, Maluku (remote)
const INDONESIA_ZONE_3 = [
  'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah',
  'Papua Pegunungan', 'Papua Barat Daya',
  'Maluku', 'Maluku Utara',
];

function getIndonesiaZone(province: string): 1 | 2 | 3 | null {
  const lower = province.toLowerCase();
  if (INDONESIA_ZONE_1.some((p) => lower.includes(p.toLowerCase()))) return 1;
  if (INDONESIA_ZONE_2.some((p) => lower.includes(p.toLowerCase()))) return 2;
  if (INDONESIA_ZONE_3.some((p) => lower.includes(p.toLowerCase()))) return 3;
  return null;
}

export function isValidIndonesianProvince(province: string): boolean {
  return getIndonesiaZone(province) !== null;
}

// ─── Unified API ─────────────────────────────────────────────────────────────

/**
 * Validate a state/province for the given country code.
 */
export function isValidState(state: string, country: string = "MY"): boolean {
  if (country === "ID") return isValidIndonesianProvince(state);
  if (country === "SG" || country === "PH") return true; 
  return isValidMalaysianState(state);
}

/**
 * Calculate shipping rates based on location.
 * For MY: rates in MYR cents. For ID: rates in IDR (whole rupiah).
 */
export function calculateShippingRates(
  state: string,
  postalCode?: string,
  country: string = "MY"
): ShippingRate[] {
  if (country === "ID") {
    const zone = getIndonesiaZone(state);
    if (zone === 1) {
      // Java + Bali
      return [
        {
          id: 'standard_id_z1',
          name: 'Standard Shipping (Java/Bali)',
          description: 'J&T / JNE Regular',
          rate: 172000, // Rp 172.000
          currency: 'idr',
          estimatedDays: '3-5 business days',
        },
        {
          id: 'express_id_z1',
          name: 'Express Shipping (Java/Bali)',
          description: 'J&T / JNE Express',
          rate: 275000, // Rp 275.000
          currency: 'idr',
          estimatedDays: '1-2 business days',
        },
      ];
    }
    if (zone === 2) {
      // Sumatra, Kalimantan, Sulawesi, NTB/NTT
      return [
        {
          id: 'standard_id_z2',
          name: 'Standard Shipping (Outer Islands)',
          description: 'J&T / JNE Regular',
          rate: 172000, // Rp 172.000
          currency: 'idr',
          estimatedDays: '5-7 business days',
        },
        {
          id: 'express_id_z2',
          name: 'Express Shipping (Outer Islands)',
          description: 'J&T / JNE Express',
          rate: 300000, // Rp 300.000
          currency: 'idr',
          estimatedDays: '3-4 business days',
        },
      ];
    }
    // Zone 3: Papua, Maluku
    return [
      {
        id: 'standard_id_z3',
        name: 'Standard Shipping (Papua/Maluku)',
        description: 'JNE Regular',
        rate: 172000, // Rp 172.000
        currency: 'idr',
        estimatedDays: '7-14 business days',
      },
    ];
  }

  // ─── Philippines ──────────────────────────────────────────────────────────
  if (country === "PH") {
    return [
      {
        id: 'standard_ph',
        name: 'Standard Shipping (Philippines)',
        description: 'LBC / J&T Express Standard',
        rate: 45000, // ₱450.00
        currency: 'php',
        estimatedDays: '3-5 business days',
      },
      {
        id: 'express_ph',
        name: 'Express Shipping (Philippines)',
        description: 'LBC / J&T Express Priority',
        rate: 115000, // ₱1,150.00
        currency: 'php',
        estimatedDays: '1-2 business days',
      },
    ];
  }

  // ─── Singapore ────────────────────────────────────────────────────────────
  if (country === "SG") {
    return [
      {
        id: 'standard_sg',
        name: 'Standard Shipping (Singapore)',
        description: 'Pos Malaysia International / J&T cross-border',
        rate: 1500, // SGD 15.00
        currency: 'sgd',
        estimatedDays: '5-7 business days',
      },
      {
        id: 'express_sg',
        name: 'Express Shipping (Singapore)',
        description: 'Ninja Van / DHL Express',
        rate: 2500, // SGD 25.00
        currency: 'sgd',
        estimatedDays: '2-3 business days',
      },
    ];
  }

  // ─── Malaysia ─────────────────────────────────────────────────────────────
  const isEast = isEastMalaysia(state);

  if (isEast) {
    return [
      {
        id: 'standard_east',
        name: 'Standard Shipping (East Malaysia)',
        description: 'Delivery via courier service',
        rate: 1500, // RM 15.00
        currency: 'myr',
        estimatedDays: '5-7 business days',
      },
      {
        id: 'express_east',
        name: 'Express Shipping (East Malaysia)',
        description: 'Priority delivery',
        rate: 2500, // RM 25.00
        currency: 'myr',
        estimatedDays: '3-4 business days',
      },
    ];
  }

  // West Malaysia
  return [
    {
      id: 'standard_west',
      name: 'Standard Shipping (West Malaysia)',
      description: 'Delivery via courier service',
      rate: 800, // RM 8.00
      currency: 'myr',
      estimatedDays: '2-4 business days',
    },
    {
      id: 'express_west',
      name: 'Express Shipping (West Malaysia)',
      description: 'Priority delivery',
      rate: 1500, // RM 15.00
      currency: 'myr',
      estimatedDays: '1-2 business days',
    },
  ];
}

/**
 * Get shipping rate by ID
 */
export function getShippingRate(rateId: string, state: string, country: string = "MY"): ShippingRate | null {
  const rates = calculateShippingRates(state, undefined, country);
  return rates.find((rate) => rate.id === rateId) || null;
}
