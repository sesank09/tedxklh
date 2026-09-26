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
import Venue from "@/components/Venue";
import Team from "@/components/Team";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import Register from "@/components/Register";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-clip">
        {/* Fixed scroll-controlled 3D background — rendered once for whole site */}
        <Background3D />

        <Navbar />
        <Hero />
        <About />
        <Theme />
        <Speakers />
        <Schedule />
        <Venue />
        <Team />
        <Partners />
        <FAQ />
        <Register />
        <Footer />
      </div>
    </>
  );
}
