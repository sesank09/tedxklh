"use client";

import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Background3D from "@/components/Background3D";
import Hero from "@/components/Hero";
import EventDateBanner from "@/components/EventDateBanner";
import About from "@/components/About";
import Theme from "@/components/Theme";
import Speakers from "@/components/Speakers";
import Venue from "@/components/Venue";
import Team from "@/components/Team";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-clip">
        {/* Fixed scroll-controlled 3D background — rendered once for whole site */}
        <Background3D />

        <Navbar />
        
        {/* Hero Section */}
        <Hero />
        
        {/* Event Date & Location Transition Banner */}
        <EventDateBanner />
        
        {/* Chapter 01: Visual Narrative Sequence */}
        <About />
        
        {/* Chapter 02: Geometric Metamorphosis Visual */}
        <Theme />
        
        {/* Chapter 03: The 12-Card Speaker Gallery */}
        <Speakers />
        
        {/* Chapter 04: The Venue & Coordinates */}
        <Venue />
        
        {/* Chapter 05: The Team */}
        <Team />
        
        {/* Chapter 06: Collaborators */}
        <Partners />
        
        {/* Chapter 07: Protocols & Inquiries */}
        <FAQ />
        
        {/* Final Compact Call To Action */}
        <FinalCTA />
        
        {/* Official Licensed Footer */}
        <Footer />
      </div>
    </>
  );
}
