"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useRegion, REGIONS, FLAG_MAP, LABEL_MAP, type Region } from "@/lib/region-context";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { region, setRegion } = useRegion();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <Image
              src="/gunung-logo.png"
              alt="Gunung Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">GUNUNG</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/#about" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16v-4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
            </svg>
            About
          </Link>
          <Link href="/#opportunity" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Gunung
          </Link>
          <Link href="/#contact" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </Link>
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="text-xs font-mono font-bold px-2 py-1 rounded border border-border hover:border-primary transition-colors bg-white flex items-center gap-1"
              title="Switch region"
            >
              {FLAG_MAP[region]} {LABEL_MAP[region]}
              <svg className={`w-3 h-3 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[100px]">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRegion(r); setIsCurrencyOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono font-bold hover:bg-gray-50 flex items-center gap-2 ${
                      r === region ? 'bg-gray-100 text-primary' : 'text-gray-600'
                    }`}
                  >
                    {FLAG_MAP[r]} {LABEL_MAP[r]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/cart" className="relative text-gray-500 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/store"
            className="bg-accent text-white px-6 py-2 border border-accent rounded shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Store
          </Link>
        </div>

        {/* Burger Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-6 py-4 border-t border-border bg-white flex flex-col gap-4">
          <Link
            href="/#about"
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16v-4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
            </svg>
            About
          </Link>
          <Link
            href="/#opportunity"
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Gunung
          </Link>
          <Link
            href="/#contact"
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium">Currency</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => { setRegion(r); setIsMenuOpen(false); }}
                className={`text-sm font-mono font-bold py-1 flex items-center gap-2 transition-colors ${
                  r === region ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                {FLAG_MAP[r]} {LABEL_MAP[r]} {r === region && '✓'}
              </button>
            ))}
          </div>
          <Link
            href="/cart"
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2 flex items-center gap-2 relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          <Link
            href="/store"
            className="bg-accent text-white px-6 py-2 border border-accent rounded shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm font-medium text-center flex items-center justify-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Store
          </Link>
        </div>
      </div>
    </nav>
  );
}
