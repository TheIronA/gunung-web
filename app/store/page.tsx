import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Store() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <Navigation />
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-bold font-mono mb-4 border border-accent/20">
            COMING SOON
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-primary">
            Our Store is<br />Under Construction
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            We are currently curating a collection of high-quality products born from our soil. Stay tuned for our launch.
          </p>
          <div className="pt-8">
             <Link
                href="/"
                className="bg-primary text-white px-8 py-3 border border-primary rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-medium inline-block"
              >
                Back to Home
              </Link>
          </div>
        </div>
      </div>
      
      {/* 
        TODO: When ready to launch, replace the content above with the product list:
        
        import StoreProductList from "@/components/StoreProductList";
        
        <div className="py-20">
          <h1 className="text-4xl font-bold font-heading text-center mb-12">Our Collection</h1>
          <StoreProductList />
        </div>
      */}
      
      <Footer />
    </main>
  );
}
