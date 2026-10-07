"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-clip">
      {/* Centralized Single Source of Truth 3D Background — exactly ONE WebGL Canvas */}
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
  );
}
