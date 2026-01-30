import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://gunung.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Gunung — Malaysia\'s First Climbing Brand',
    template: '%s | Gunung',
  },
  description: 'Premium climbing gear for Malaysian peaks. Affordable, high-performance shoes and equipment designed for Southeast Asian climbers.',
  keywords: [
    'climbing gear Malaysia',
    'climbing shoes Malaysia',
    'rock climbing equipment',
    'bouldering shoes',
    'climbing chalk bag',
    'Malaysian climbing brand',
    'affordable climbing gear',
    'Southeast Asia climbing',
    'Gunung climbing',
  ],
  authors: [{ name: 'Syed Alwi Al-haddad' }],
  creator: 'Gunung',
  publisher: 'Gunung',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: baseUrl,
    siteName: 'Gunung',
    title: 'Gunung — Malaysia\'s First Climbing Brand',
    description: 'Premium climbing gear for Malaysian peaks. Affordable, high-performance shoes and equipment.',
    images: [
      {
        url: `${baseUrl}/gunung-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Gunung - Climbing Gear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gunung — Malaysia\'s First Climbing Brand',
    description: 'Premium climbing gear for Malaysian peaks.',
    images: [`${baseUrl}/gunung-logo.png`],
    creator: '@gunung',
  },
  icons: {
    icon: '/gunung-logo.png',
    apple: '/gunung-logo.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export function generateProductMetadata(product: {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  currency: string;
  image: string;
}): Metadata {
  const price = (product.price / 100).toFixed(2);
  const productUrl = `${baseUrl}/store/${product.id}`;

  return {
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      'climbing gear',
      'Malaysia',
      'rock climbing',
      'bouldering',
      'climbing equipment',
    ],
    openGraph: {
      type: 'website',
      url: productUrl,
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

// Structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gunung',
    url: baseUrl,
    logo: `${baseUrl}/gunung-logo.png`,
    description: 'Malaysia\'s first climbing brand offering premium gear for Southeast Asian climbers',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'syedalwialhaddad@gmail.com',
      contactType: 'Customer Service',
    },
    sameAs: [
      // Add your social media URLs here
      // 'https://www.facebook.com/gunung',
      // 'https://www.instagram.com/gunung',
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gunung',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/store?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateProductSchema(product: {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  currency: string;
  image: string;
  sizes?: Array<{ size: string; stock: number }>;
}) {
  const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) ?? 0;
  const inStock = totalStock > 0 || !product.sizes?.length;
  const price = (product.price / 100).toFixed(2);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Gunung',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/store/${product.id}`,
      priceCurrency: product.currency.toUpperCase(),
      price: price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Gunung',
      },
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
