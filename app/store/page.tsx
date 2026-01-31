import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoreProductList from "@/components/StoreProductList";
import LaunchSaleBanner from "@/components/LaunchSaleBanner";
import { getStoreSettings } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store - Climbing Gear",
  description: "Browse our collection of premium climbing shoes, chalk bags, and gear designed for Malaysian peaks.",
  openGraph: {
    title: "Gunung Store - Premium Climbing Gear",
    description: "Browse our collection of premium climbing gear for Malaysian climbers.",
  },
};

export default async function Store() {
  const settings = await getStoreSettings();
  const isStoreActive = settings.isStoreOpen;

  return (
    <main className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
      <Navigation />
      {isStoreActive ? (
        <div className="py-20 flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-center mb-4 text-primary">Our Collection</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto px-6 mb-8">
            Gear designed for the Malaysian ascent. Ascend to the peak.
          </p>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <LaunchSaleBanner />
          </div>
          <StoreProductList />
        </div>
      ) : (
        <div className="py-20 flex-grow flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-primary">
              Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Affordable climbing gear for Malaysian peaks. Making the ascent accessible to everyone.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
