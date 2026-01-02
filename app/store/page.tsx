import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoreProductList from "@/components/StoreProductList";

export default function Store() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <Navigation />
      <div className="py-20 flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-center mb-4 text-primary">Our Collection</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto px-6 mb-12">
          Gear designed for the Malaysian ascent. Ascend to the peak.
        </p>
        <StoreProductList />
      </div>
      <Footer />
    </main>
  );
}
