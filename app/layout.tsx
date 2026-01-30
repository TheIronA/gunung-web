import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
