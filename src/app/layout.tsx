import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StructuredData from "@/components/StructuredData";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tedxklhbowrampet.in"),
  title: {
    default: "TEDxKLH — Official Website | TEDxKLH 2026 METAMORPHOSIS",
    template: "%s | TEDxKLH 2026",
  },
  description:
    "Official website for TEDxKLH 2026: METAMORPHOSIS on November 4, 2026 at KLH Auditorium, Bowrampet Campus, Hyderabad. Featuring 11+ visionary speakers across technology, neuroscience, mountaineering, design, and enterprise. Apply for 250 curated delegate passes.",
  applicationName: "TEDxKLH",
  authors: [{ name: "TEDxKLH Team", url: "https://tedxklhbowrampet.in" }],
  generator: "Next.js",
  keywords: [
    // Exact Brand & Primary Search Tokens
    "TEDxKLH",
    "TEDx KLH",
    "tedxklh",
    "tedx klh",
    "TEDxKLH 2026",
    "TEDxKLH Official",
    "TEDxKLH Website",
    "TEDxKLH Bowrampet",
    "TEDx Bowrampet",
    "TEDx Hyderabad",
    "TEDx Hyderabad 2026",
    "TEDx Telangana",
    "TEDx KL University",
    "TEDx KLH Hyderabad",
    "TEDx India",
    // Theme & Tagline
    "Metamorphosis",
    "METAMORPHOSIS TEDx",
    "The Unseen Process of Becoming",
    "Structural Transformation",
    // Campus & Geographic Keywords
    "KLH University Bowrampet",
    "Bowrampet Hyderabad",
    "ALEAP Industrial Area Bowrampet",
    "Hyderabad TEDx Events 2026",
    "Conferences in Hyderabad",
    "Tech Conferences Hyderabad November 2026",
    "Youth Leadership Events Telangana",
    // Keynote Speakers
    "Sri Charan Lakkaraju Student Tribe",
    "Phani Gogireddy 24 Frames",
    "Dr Vikrant Singh Thakur TIME Neurocare",
    "Kumar Raja Design by Raja",
    "Major General N D Prasad",
    "Moses Chowdari EnAble India",
    "Poorna Malavath Everest",
    "Srikanth Acharya OffiNeeds",
    "Tamal Chatterjee Sids Farm",
    "Madhulash Babu Krovvidi Edodwaja",
    "Mamatha Shanmugam Capgemini",
    // Registration & Passes
    "TEDxKLH Passes",
    "TEDxKLH Registration",
    "TEDxKLH Tickets",
    "Ideas Worth Spreading",
    "Delegate Registration",
    "TEDx Passes Hyderabad",
  ],
  creator: "TEDxKLH Curatorial Board",
  publisher: "TEDxKLH",
  category: "Conference",
  classification: "TEDx Conference & Innovation Summit",
  alternates: {
    canonical: "https://tedxklhbowrampet.in",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "TEDxKLH — Official Website | TEDxKLH 2026 METAMORPHOSIS",
    description:
      "Official website for TEDxKLH 2026: METAMORPHOSIS on November 4, 2026 at KLH Auditorium, Bowrampet, Hyderabad. 11+ visionary speakers, 250 curated delegates.",
    url: "https://tedxklhbowrampet.in",
    siteName: "TEDxKLH",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://tedxklhbowrampet.in/metamorphosis-art.jpg",
        width: 1200,
        height: 630,
        alt: "TEDxKLH 2026 METAMORPHOSIS Official Banner",
      },
      {
        url: "https://tedxklhbowrampet.in/icon-512.png",
        width: 512,
        height: 512,
        alt: "TEDxKLH Official Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TEDxKLH — Official Website | TEDxKLH 2026 METAMORPHOSIS",
    description:
      "Official TEDxKLH 2026 Conference on Nov 4, 2026 at KLH Bowrampet, Hyderabad. 11+ Visionary speakers. 250 Curated delegates.",
    images: ["https://tedxklhbowrampet.in/metamorphosis-art.jpg"],
    creator: "@tedxklh",
    site: "@tedxklh",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // Geographic & Local SEO (GEO)
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad, Bowrampet",
    "geo.position": "17.5623;78.3846",
    "ICBM": "17.5623, 78.3846",
    "geo.country": "India",
    "city": "Hyderabad",
    "state": "Telangana",
    "zipcode": "500043",
    "target": "all",
    "audience": "all",
    "coverage": "Worldwide",
    "distribution": "Global",
    "rating": "General",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Explicit High-Resolution Favicons for Google Search & All Browsers */}
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Bowrampet" />
        <meta name="geo.position" content="17.5623;78.3846" />
        <meta name="ICBM" content="17.5623, 78.3846" />
        <meta name="format-detection" content="telephone=no" />
        {/* Structured Data (Schema.org JSON-LD for Google Knowledge Graph & AI Engines) */}
        <StructuredData />
      </head>
      <body className="min-h-full bg-black text-white selection:bg-[#EB0028] selection:text-white flex flex-col font-sans overflow-x-hidden">
        <SmoothScroll>
          <div className="noise-overlay" aria-hidden="true" />
          
          <main className="relative z-10 flex-grow">
            {children}
          </main>

        </SmoothScroll>
      </body>
    </html>
  );
}
