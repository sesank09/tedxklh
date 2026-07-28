import type { Metadata } from "next";
import { Syne, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Background3D from "@/components/Background3D";

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
  title: "TEDxKLH 2026 | BOUNDLESS",
  description: "Experience the premium, futuristic, and unforgettable TEDxKLH event. Showcasing ground-breaking concepts, quantum designs, and boundary-pushing perspectives. Register now.",
  keywords: ["TEDx", "TEDxKLH", "Event", "Conference", "Boundless", "Technology", "Design", "Entertainment"],
  authors: [{ name: "TEDxKLH Team" }],
  openGraph: {
    title: "TEDxKLH 2026 | BOUNDLESS",
    description: "Experience the premium, futuristic, and unforgettable TEDxKLH event.",
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
      <body className="min-h-full bg-black text-white selection:bg-primary selection:text-white flex flex-col font-sans">
        <SmoothScroll>
          <Background3D />
          <CustomCursor />
          <div className="noise-overlay" />
          
          <main className="relative z-10 flex-grow">
            {children}
          </main>

        </SmoothScroll>
      </body>
    </html>
  );
}
