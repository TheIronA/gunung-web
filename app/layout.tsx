import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Gunung — Ascend to the peak",
  description: "Bridging Malaysian climbers with world-class gear through partnerships, community, and shared passion.",
  icons: {
    icon: "/gunung-logo.png",
    apple: "/gunung-logo.png",
  },
};

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
