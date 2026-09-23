"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Smoothly fade out all hero text (TEDxKLH, top badge, scroll cue) within first 120px of scroll
  const heroOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const heroY = useTransform(scrollY, [0, 120], [0, -20]);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex flex-col justify-between items-center pt-24 pb-8 px-6 select-none overflow-hidden pointer-events-none"
    >
      {/* Top Header Badge — Fades away on scroll */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="w-full max-w-[1440px] mx-auto text-center z-20 pt-2 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/80 text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
          <span>TEDxKLH · ANNUAL FLAGSHIP CONFERENCE · 2026</span>
        </motion.div>
      </motion.div>

      {/* Center zone for the 3D Butterfly */}
      <div className="w-full flex-grow min-h-[36vh] sm:min-h-[40vh]" />

      {/* Bottom Area: TEDxKLH Brand + Scroll Cue — Fades away cleanly before Metamorphosis appears */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="w-full max-w-[1440px] mx-auto text-center z-20 pb-8 flex flex-col items-center gap-4 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            TED<span className="text-[#EB0028] text-glow">x</span>KLH
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-2 cursor-pointer group mt-1"
          onClick={(e) => scrollTo(e, "#about")}
        >
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors">
            SCROLL TO TRANSFORM
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/40 group-hover:border-[#EB0028]/40 group-hover:text-[#EB0028] transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-[#EB0028]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
