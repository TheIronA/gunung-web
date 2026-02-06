import { products, getProduct } from "@/lib/products";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { generateProductMetadata, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

// This is necessary for static site generation with dynamic routes
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return generateProductMetadata(product);
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Store', url: '/store' },
    { name: product.name, url: `/store/${product.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
              {/* Product Image */}
              <div className="aspect-square bg-white border border-border rounded shadow-brutal relative overflow-hidden flex items-center justify-center">
                {product.image.startsWith('http') ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="text-gray-400 text-2xl font-medium">Coming Soon</div>
                )}
              </div>

              {/* Product Details */}
              <ProductDetails product={product} />
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
