"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Background3D from "@/components/Background3D";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Theme from "@/components/Theme";
import Speakers from "@/components/Speakers";
import Schedule from "@/components/Schedule";
import Partners from "@/components/Partners";
import Venue from "@/components/Venue";
import FAQ from "@/components/FAQ";
import Register from "@/components/Register";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-clip">
          {/* Fixed scroll-controlled 3D background — rendered once for whole site */}
          <Background3D />

          {/* Noise grain overlay */}
          <div className="noise-overlay" />

          <Navbar />
          <Hero />
          <About />
          <Theme />
          <Speakers />
          <Schedule />

          {/* Spacing & Decorative Divider between Schedule and Partners */}
          <div className="w-full py-16 flex items-center justify-center relative overflow-hidden pointer-events-none">
            <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute w-3 h-3 rounded-full bg-primary/60 blur-[3px]" />
          </div>

          <Partners />
          <Venue />
          <FAQ />
          <Register />
          <Footer />
        </div>
      )}
    </>
  );
}
