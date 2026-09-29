import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "TEDxKLH 2026 | METAMORPHOSIS — The Unseen Process of Becoming",
  description: "Experience TEDxKLH 2026: METAMORPHOSIS. Exploring structural transformations across science, technology, human consciousness, and design. What happens when an idea refuses to stay the same shape.",
  keywords: ["TEDx", "TEDxKLH", "Metamorphosis", "Transformation", "Conference", "Innovation", "Technology", "Design"],
  authors: [{ name: "TEDxKLH Team" }],
  openGraph: {
    title: "TEDxKLH 2026 | METAMORPHOSIS",
    description: "The Unseen Process of Becoming · TEDxKLH Annual Flagship Conference 2026",
    type: "website",
    locale: "en_US",
  },
};

import CustomCursor from "@/components/CustomCursor";

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
      </head>
      <body className="min-h-full bg-black text-white selection:bg-[#EB0028] selection:text-white flex flex-col font-sans overflow-x-hidden">
        <SmoothScroll>
          <div className="noise-overlay" aria-hidden="true" />
          <CustomCursor />
          
          <main className="relative z-10 flex-grow">
            {children}
          </main>

        </SmoothScroll>
      </body>
    </html>
  );
}
