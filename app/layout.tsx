import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gunung — Born from our soil, built for ascent",
  description: "Malaysia's first homegrown climbing brand — connecting world-class gear with local climbers.",
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
