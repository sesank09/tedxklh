"use client";

import { motion } from "framer-motion";
import { MapPin, Compass, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Venue() {
  return (
    <section 
      id="venue" 
      className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden"
    >
      {/* Background Radial Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto z-20 flex flex-col lg:flex-row gap-[clamp(2.5rem,5vw,4.5rem)] items-center">
        
        {/* Left Column: Venue Metadata & Event Details */}
        <div className="w-full lg:w-1/2 space-y-[clamp(1.25rem,2.5vw,2rem)] flex flex-col justify-center text-center lg:text-left">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <h2 
              className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold tracking-tight text-white uppercase leading-[1.05]" 
              style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
            >
              KLH AUDITORIUM <br />
              <span className="text-[#EB0028]">&amp; PAVILION</span>
            </h2>

            <div 
              className="flex items-center justify-center lg:justify-start space-x-2 text-xs text-white/60 pt-0.5"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <Compass className="w-4 h-4 text-[#EB0028] shrink-0" />
              <span>COORDINATES: 17.5623° N, 78.3846° E</span>
            </div>
          </div>

          <p 
            className="text-sm sm:text-base text-white/70 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0" 
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            KLH University, Bowrampet Campus. Engineered for volumetric keynote staging, spatial acoustic resonance, and collaborative breakout experiences for our cohort of 250 curated delegates.
          </p>

          <div className="space-y-3 text-xs sm:text-sm max-w-lg mx-auto lg:mx-0 text-left">
            <div className="flex items-start space-x-3 p-4 rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-xl">
              <MapPin className="w-5 h-5 text-[#EB0028] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white font-bold block" style={{ fontFamily: "var(--font-sora)" }}>
                  KLH University, Bowrampet
                </span>
                <span 
                  className="text-white/60 text-xs block"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  ALEAP Industrial Area, Bowrampet, Hyderabad, Telangana 500043
                </span>
              </div>
            </div>
          </div>

          {/* Magnetic Google Maps Action Button */}
          <div className="pt-2 flex justify-center lg:justify-start">
            <Magnetic range={65} strength={0.35}>
              <a
                href="https://www.google.com/maps/place/KLH+University,+Bowrampet/data=!4m2!3m1!1s0x0:0xc307c84e835d6187?sa=X&ved=1t:2428&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 text-xs font-bold tracking-[0.2em] uppercase text-white bg-white/[0.04] border border-white/10 hover:border-[#EB0028] px-6 py-3.5 rounded-full group transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(235,0,40,0.3)] min-h-[44px]"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-4 h-4 text-[#EB0028] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right Column: Geometric Location Visualization */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-[min(100%,440px)] aspect-square rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            
            {/* Ambient Ruby Radar Glow */}
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#EB0028]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EB0028]/35 transition-colors duration-500" />
            
            {/* Geometric Vector Visualization */}
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-white/15 stroke-[0.5] fill-none relative z-10">
              {/* Concentric Coordinate Rings */}
              <circle cx="120" cy="80" r="16" className="stroke-[#EB0028]/50 stroke-[0.75] animate-pulse" />
              <circle cx="120" cy="80" r="36" className="stroke-[#EB0028]/30 stroke-[0.5] stroke-dasharray-[2_4] animate-[spin_25s_linear_infinite]" />
              <circle cx="120" cy="80" r="64" className="stroke-white/10 stroke-[0.5]" />
              <circle cx="120" cy="80" r="90" className="stroke-white/5 stroke-[0.5]" />
              
              {/* Rotating Radar Scan Sweep */}
              <motion.line 
                x1="120" y1="80" x2="20" y2="180" 
                className="stroke-[#EB0028]/50 stroke-[0.75] origin-[120px_80px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid Lines */}
              <path d="M10,120 L190,120 M120,10 L120,190" strokeDasharray="3 3" />
              <path d="M20,20 C50,20 80,60 120,80 C150,90 170,150 190,180" className="stroke-white/25 stroke-[1]" />
              <path d="M10,70 Q70,90 120,80 T180,30" className="stroke-white/20" />
              
              {/* Reticle Crosshair */}
              <path d="M108,80 L132,80 M120,68 L120,92" className="stroke-[#EB0028] stroke-[1]" />

              {/* Glowing Beacon Ping */}
              <circle cx="120" cy="80" r="4.5" className="fill-[#EB0028] stroke-white stroke-[1.5] shadow-[0_0_15px_#EB0028]" />
            </svg>

            {/* HUD Status Labels */}
            <div 
              className="absolute top-4 sm:top-5 left-4 sm:left-5 text-[9px] text-white/40 space-y-1"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <div>SYS.VENUE: CALIBRATED</div>
              <div className="text-[#EB0028]">LAT: 17.5623° · LON: 78.3846°</div>
            </div>

            <div 
              className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 text-[9px] text-[#EB0028] font-bold tracking-widest uppercase"
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
