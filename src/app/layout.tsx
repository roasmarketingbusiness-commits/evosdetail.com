import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evosdetail.com"),
  title: "EVOS Detail — Mobile Car Detailing in Houston, TX",
  description:
    "Premium mobile car detailing across Greater Houston. Interior, exterior, and full details — we come to you. Book online in 60 seconds.",
  robots: "index, follow",
  openGraph: {
    title: "EVOS Detail",
    description:
      "Premium mobile car detailing across Greater Houston. We come to you.",
    url: "https://evosdetail.com",
    siteName: "EVOS Detail",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-ink overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
