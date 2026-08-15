import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
