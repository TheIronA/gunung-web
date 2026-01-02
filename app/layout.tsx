import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
