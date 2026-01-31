'use client';

import { useState, useEffect } from 'react';

const BANNER_STORAGE_KEY = 'gunung-launch-sale-dismissed';

export default function LaunchSaleBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if banner was already dismissed
    const wasDismissed = localStorage.getItem(BANNER_STORAGE_KEY);

    if (!wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  // Don't render on server or if dismissed
  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div className="mb-8 animate-slide-down">
      <div className="bg-gradient-to-r from-accent to-primary text-white shadow-brutal-lg border-4 border-primary rounded-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white text-accent font-bold text-2xl shadow-brutal-sm border-2 border-accent">
                  %
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading mb-1">
                  Launch Sale Now Live!
                </h3>
                <p className="text-base text-white/95">
                  Get special pricing on select climbing gear. Limited time only.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-white/80 transition-colors p-2 ml-auto"
              aria-label="Dismiss banner"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
