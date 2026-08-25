import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Google Ads conversion tag (AW-XXXXXXXXXX) — enables Ads conversion
// tracking + remarketing alongside GA4
const AW_ID = process.env.NEXT_PUBLIC_AW_ID;
// Conversion label from the Ads "calls to a phone number on your website"
// action. When set, Google swaps the displayed number for a forwarding
// number to attribute calls to ad clicks. The phone_conversion_number
// must match the number exactly as rendered on the page.
const AW_PHONE_LABEL = process.env.NEXT_PUBLIC_AW_PHONE_LABEL;

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
  title: "EVOS Detail — Mobile Car Detailing in Splendora, Magnolia & North Houston",
  description:
    "Premium mobile car detailing across North Houston — Splendora, Magnolia, The Woodlands, Spring, Tomball, Kingwood, and Humble. Interior, exterior, and full details — we come to you, weekends 8am–8pm. Book online in 60 seconds.",
  robots: "index, follow",
  openGraph: {
    title: "EVOS Detail",
    description:
      "Premium mobile car detailing in Splendora, Magnolia, and North Houston. We come to you.",
    url: "https://evosdetail.com",
    siteName: "EVOS Detail",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EVOS Detail — black sports car covered in suds during a detail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVOS Detail — Mobile Car Detailing in Splendora, Magnolia & North Houston",
    description:
      "Premium mobile car detailing in Splendora, Magnolia, and North Houston. We come to you.",
    images: ["/og-image.jpg"],
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
      {(GA_ID || AW_ID) && (
        <head>
          {/* Google tag in the SSR'd <head> so Google's tag detector finds
              it in the raw HTML — Script strategies inject too late */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID ?? AW_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
                ${AW_ID ? `gtag('config', '${AW_ID}');` : ""}
                ${
                  AW_ID && AW_PHONE_LABEL
                    ? `gtag('config', '${AW_ID}/${AW_PHONE_LABEL}', { phone_conversion_number: '(832) 387-5145' });`
                    : ""
                }`,
            }}
          />
        </head>
      )}
      <body className="relative min-h-full text-ink overflow-x-hidden">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoWash",
              name: "EVOS Detail",
              description:
                "Premium mobile car detailing — we come to you. Interior, exterior, and full details across Splendora, Magnolia, The Woodlands, Spring, Tomball, Kingwood, and Humble.",
              url: "https://evosdetail.com",
              telephone: "+18323875145",
              priceRange: "$69–$249",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Splendora",
                addressRegion: "TX",
                addressCountry: "US",
              },
              // Circle midpoints sit ~4mi south of the home bases — coverage
              // deliberately skews toward Houston. Keep in sync with
              // ServiceArea.tsx (SOUTH_BIAS_DEG + RADIUS_METERS).
              areaServed: [
                {
                  "@type": "GeoCircle",
                  geoMidpoint: {
                    "@type": "GeoCoordinates",
                    latitude: 30.1747,
                    longitude: -95.1611,
                  },
                  geoRadius: "29000",
                },
                {
                  "@type": "GeoCircle",
                  geoMidpoint: {
                    "@type": "GeoCoordinates",
                    latitude: 30.1514,
                    longitude: -95.7508,
                  },
                  geoRadius: "29000",
                },
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday", "Sunday"],
                opens: "08:00",
                closes: "20:00",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
