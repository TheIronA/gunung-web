import { products } from "@/lib/products";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCheckoutButton from "@/components/ProductCheckoutButton";
import Link from "next/link";
import { notFound } from "next/navigation";

// This is necessary for static site generation with dynamic routes
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <Navigation />
      
      <div className="flex-grow py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Link 
            href="/store" 
            className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Product Image Placeholder */}
            <div className="aspect-square bg-white border border-border rounded shadow-brutal flex items-center justify-center text-gray-400 relative overflow-hidden">
               {/* Replace with actual Image component when you have images */}
               <span className="text-xl font-mono">{product.name} Image</span>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">{product.name}</h1>
              <div className="text-2xl font-mono font-bold text-accent mb-6">
                {(product.price / 100).toLocaleString("en-MY", {
                  style: "currency",
                  currency: product.currency.toUpperCase(),
                })}
              </div>
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{product.details}</p>
              </div>

              <div className="border-t border-border pt-8">
                <ProductCheckoutButton 
                  productId={product.id} 
                  price={product.price} 
                  currency={product.currency} 
                />
                <p className="text-xs text-gray-500 mt-4 font-mono">
                  Secure payment via Stripe • Free shipping within Malaysia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
