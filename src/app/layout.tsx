import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
      className={`${bricolage.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-ink overflow-x-hidden">
        {children}
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoWash",
              name: "EVOS Detail",
              description:
                "Premium mobile car detailing — we come to you. Interior, exterior, and full details across Greater Houston.",
              url: "https://evosdetail.com",
              telephone: "+18323875145",
              priceRange: "$69–$249",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pearland",
                addressRegion: "TX",
                addressCountry: "US",
              },
              areaServed: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 29.5636,
                  longitude: -95.286,
                },
                geoRadius: "32000",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
