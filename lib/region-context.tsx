"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Region = "MY" | "ID" | "SG" | "PH";

interface RegionContextType {
  region: Region;
  setRegion: (r: Region) => void;
  currency: string; // 'myr', 'idr', or 'sgd'
  loading: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const COOKIE_NAME = "gunung-region";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

const CURRENCY_MAP: Record<Region, string> = {
  MY: "myr",
  ID: "idr",
  SG: "sgd",
  PH: "php",
};

const FLAG_MAP: Record<Region, string> = {
  MY: "🇲🇾",
  ID: "🇮🇩",
  SG: "🇸🇬",
  PH: "🇵🇭",
};

const LABEL_MAP: Record<Region, string> = {
  MY: "MYR",
  ID: "IDR",
  SG: "SGD",
  PH: "PHP",
};

export const REGIONS: Region[] = ["MY", "ID", "SG", "PH"];
export { FLAG_MAP, LABEL_MAP };

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("MY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check cookie first
    const saved = getCookie(COOKIE_NAME);
    if (saved === "MY" || saved === "ID" || saved === "SG" || saved === "PH") {
      setRegionState(saved as Region);
      setLoading(false);
      return;
    }

    // 2. Auto-detect via IP
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then((res) => res.json())
      .then((data) => {
        const cc = data.country_code;
        const detected: Region = 
          cc === "ID" ? "ID" : 
          cc === "SG" ? "SG" : 
          cc === "PH" ? "PH" : "MY";
        setRegionState(detected);
        setCookie(COOKIE_NAME, detected, 365);
      })
      .catch(() => {
        // Default to MY on failure
        setCookie(COOKIE_NAME, "MY", 365);
      })
      .finally(() => setLoading(false));
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    setCookie(COOKIE_NAME, r, 365);
  };

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        currency: CURRENCY_MAP[region],
        loading,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
