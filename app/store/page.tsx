import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoreProductList from "@/components/StoreProductList";

const isStoreActive = process.env.NEXT_PUBLIC_STORE_ACTIVE === 'true';

export default function Store() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <Navigation />
      {isStoreActive ? (
        <div className="py-20 flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-center mb-4 text-primary">Our Collection</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto px-6 mb-12">
            Gear designed for the Malaysian ascent. Ascend to the peak.
          </p>
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
