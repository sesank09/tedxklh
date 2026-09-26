"use client";

import { motion } from "framer-motion";
import { MapPin, Compass, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Venue() {
  return (
    <section 
      id="venue" 
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-28 px-6 md:px-12 select-none overflow-hidden border-t border-white/[0.04]"
    >
      {/* Background neon light grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[800px] h-[500px] opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="w-full max-w-[1400px] z-20 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left column: Venue metadata details */}
        <div className="w-full lg:w-1/2 space-y-8 flex flex-col justify-center">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <span 
                className="text-xs text-[#EB0028] tracking-[0.25em] uppercase font-medium"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                CHAPTER 05 // THE ARENA
              </span>
              <span className="h-px w-8 bg-[#EB0028]/40" />
            </div>
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[1.15]" 
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              KLH AUDITORIUM <br />
              <span className="text-[#EB0028]">&amp; PAVILION</span>
            </h2>
            <div 
              className="flex items-center space-x-2 text-xs text-white/50"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <Compass className="w-3.5 h-3.5 text-[#EB0028]" />
              <span>COORDINATES: 17.5623° N, 78.3846° E · BOWRAMPET, HYDERABAD</span>
            </div>
          </div>

          <p 
            className="text-sm sm:text-base text-white/70 leading-relaxed font-normal max-w-md" 
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            KLH University, Bowrampet Campus. Engineered to facilitate volumetric keynote staging, acoustic spatial arrays, and dedicated collaboration zones for our 100 curated delegates.
          </p>

          <div className="flex flex-col space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
              <span 
                className="text-white/80"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                ALEAP Industrial Area, Bowrampet, Hyderabad, Telangana 500043
              </span>
            </div>
          </div>

          {/* Magnetic View on Google Maps */}
          <div className="pt-2">
            <Magnetic range={65} strength={0.35}>
              <a
                href="https://www.google.com/maps/place/KLH+University,+Bowrampet/data=!4m2!3m1!1s0x0:0xc307c84e835d6187?sa=X&ved=1t:2428&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.15em] uppercase text-white/80 hover:text-white border-b border-[#EB0028] pb-1 group transition-colors duration-300"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                <span>Navigate to Campus</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#EB0028] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right column: Futuristic Sci-Fi SVG Map Vector */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-[480px] aspect-square rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            {/* Ambient Red glow from map pin */}
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#EB0028]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EB0028]/25 transition-colors duration-500" />
            
            {/* Futuristic Vector Map Drawing */}
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-white/10 stroke-[0.5] fill-none relative z-10">
              
              {/* Concentric Coordinate Scan Rings */}
              <circle cx="120" cy="80" r="15" className="stroke-[#EB0028]/40 stroke-[0.75] animate-pulse" />
              <circle cx="120" cy="80" r="35" className="stroke-[#EB0028]/20 stroke-[0.5] stroke-dasharray-[2_4] animate-[spin_20s_linear_infinite]" />
              <circle cx="120" cy="80" r="60" className="stroke-white/5" />
              
              {/* Sci-fi radar scan line */}
              <motion.line 
                x1="120" y1="80" x2="20" y2="180" 
                className="stroke-[#EB0028]/40 stroke-[0.75] origin-[120px_80px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid Roads/Cables paths */}
              <path d="M10,120 L190,120 M120,10 L120,190" strokeDasharray="3 3" />
              <path d="M20,20 C50,20 80,60 120,80 C150,90 170,150 190,180" className="stroke-white/20 stroke-[1]" />
              <path d="M10,70 Q70,90 120,80 T180,30" className="stroke-white/15" />
              
              {/* Scanning crosshairs */}
              <path d="M110,80 L130,80 M120,70 L120,90" className="stroke-[#EB0028] stroke-[1]" />

              {/* Glowing Coordinate Ping Node */}
              <circle cx="120" cy="80" r="4" className="fill-[#EB0028] stroke-white stroke-[1.5] shadow-[0_0_10px_rgba(235,0,40,0.8)]" />
            </svg>

            {/* Scanning HUD labels */}
            <div 
              className="absolute top-4 left-4 text-[8px] text-white/30 space-y-1"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <div>SYS.METAMORPHOSIS: ACTIVE</div>
              <div>VENUE.MATRIX: RESOLVED</div>
            </div>

            <div 
              className="absolute bottom-4 right-4 text-[8px] text-[#EB0028] font-medium tracking-wider"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              KLH BOWRAMPET CAMPUS
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
