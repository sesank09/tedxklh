import type { Metadata } from "next";
import { Syne, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${orbitron.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-black text-white selection:bg-[#EB0028] selection:text-white flex flex-col font-sans">
        <SmoothScroll>
          <div className="noise-overlay" />
          
          <main className="relative z-10 flex-grow">
            {children}
          </main>

        </SmoothScroll>
      </body>
    </html>
  );
}
