"use client";

import { motion } from "framer-motion";
import { MapPin, Compass, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Venue() {
  return (
    <section 
      id="venue" 
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-32 px-6 md:px-12 select-none overflow-hidden"
    >
      {/* Background neon light grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[800px] h-[500px] opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="w-full max-w-6xl z-20 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left column: Venue metadata details */}
        <div className="w-full lg:w-1/2 space-y-8 flex flex-col justify-center">
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-primary text-glow font-syne">
              The Venue
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-syne tracking-tight text-white uppercase">
              KLH GRAND <br />
              PAVILION
            </h2>
            <div className="flex items-center space-x-2 text-xs font-mono text-white/40">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>COORDINATES: 3°08'42.1"N 101°41'14.6"E</span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-sans max-w-md">
            Located in the heart of Kuala Lumpur's technological corridor. The KLH Grand Pavilion is a state-of-the-art 
            architecture specifically structured to host volumetric presentations, immersive spatial sound systems, 
            and high-density visual conferences.
          </p>

          <div className="flex flex-col space-y-3 font-sans text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-white/70">Level 4, Cyber Tech Spire, Jalan Horizon, Kuala Lumpur, Malaysia</span>
            </div>
          </div>

          {/* Magnetic View on Google Maps placeholder */}
          <div className="pt-2">
            <Magnetic range={65} strength={0.35}>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-bold font-syne tracking-[0.2em] uppercase text-white/80 hover:text-white border-b border-primary pb-1 group transition-colors duration-300"
              >
                <span>Navigate to Venue</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right column: Futuristic Sci-Fi SVG Map Vector */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-[450px] aspect-square rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-8 overflow-hidden group">
            
            {/* Ambient Red glow from map pin */}
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors duration-500" />
            
            {/* Futuristic Vector Map Drawing */}
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-white/10 stroke-[0.5] fill-none relative z-10">
              
              {/* Concentric Coordinate Scan Rings */}
              <circle cx="120" cy="80" r="15" className="stroke-primary/40 stroke-[0.75] animate-pulse" />
              <circle cx="120" cy="80" r="35" className="stroke-primary/20 stroke-[0.5] stroke-dasharray-[2_4] animate-[spin_20s_linear_infinite]" />
              <circle cx="120" cy="80" r="60" className="stroke-white/5" />
              
              {/* Sci-fi radar scan line */}
              <motion.line 
                x1="120" y1="80" x2="20" y2="180" 
                className="stroke-primary/30 stroke-[0.75] origin-[120px_80px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid Roads/Cables paths */}
              <path d="M10,120 L190,120 M120,10 L120,190" strokeDasharray="3 3" />
              <path d="M20,20 C50,20 80,60 120,80 C150,90 170,150 190,180" className="stroke-white/20 stroke-[1]" />
              <path d="M10,70 Q70,90 120,80 T180,30" className="stroke-white/15" />
              
              {/* Scanning crosshairs */}
              <path d="M110,80 L130,80 M120,70 L120,90" className="stroke-primary stroke-[1]" />

              {/* Glowing Coordinate Ping Node */}
              <circle cx="120" cy="80" r="4" className="fill-primary stroke-white stroke-[1.5] shadow-[0_0_10px_rgba(235,0,40,0.8)]" />
            </svg>

            {/* Scanning HUD labels */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-white/30 space-y-1">
              <div>SYS.SCAN: ACTIVE</div>
              <div>MATRIX: RESOLVED</div>
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-primary/60 text-glow">
              TARGET LOCATED
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
