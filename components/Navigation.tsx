"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
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
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/#about" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
            About
          </Link>
          <Link href="/#opportunity" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
            Why Gunung
          </Link>
          <Link href="/store" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
            Store
          </Link>
          <Link
            href="/#contact"
            className="bg-accent text-white px-6 py-2 border border-accent rounded shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
