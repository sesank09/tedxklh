"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Hero() {
  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center py-40 px-5 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Subtle ambient red background pool */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.12),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto text-center space-y-12 relative z-20">
        
        {/* Top Edition Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-[0.25em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ANNUAL FLAGSHIP CONFERENCE · 2026
        </motion.div>

        {/* Title & Display Heading */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* TEDxKLH Brand Reveal */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black text-white tracking-tight uppercase leading-none"
            style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 900 }}
          >
            TED<span className="text-[#EB0028] text-glow">X</span><span className="font-black text-white">KLH</span>
          </motion.h1>

          {/* Theme Display Headline: BOUNDLESS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            <div
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] font-black tracking-widest uppercase text-shimmer leading-none"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 900 }}
            >
              BOUNDLESS
            </div>

            <p
              className="text-lg sm:text-2xl md:text-[28px] text-white/80 font-medium tracking-[0.04em] uppercase max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
            >
              Ideas Worth Spreading. <br className="hidden sm:inline" />
              Voices Worth Hearing.
            </p>
          </motion.div>
        </div>

        {/* Short Editorial Abstract */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs sm:text-sm text-white/50 font-light max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          A single spark of curiosity ignites a network of ideas. Join 100 visionaries, researchers, and pioneers exploring new paradigms in Hyderabad.
        </motion.p>

        {/* Dual Editorial Pill CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
        >
          {/* Primary CTA: Apply for Delegate Pass */}
          <Magnetic range={55} strength={0.3}>
            <a
              href="#register"
              onClick={e => scrollTo(e, "#register")}
              className="relative h-[60px] px-9 rounded-full font-bold text-xs tracking-[0.2em] uppercase text-white flex items-center justify-center gap-3 overflow-hidden group cursor-pointer shadow-[0_4px_30px_rgba(235,0,40,0.5)] hover:shadow-[0_8px_40px_rgba(235,0,40,0.7)] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #EB0028 0%, #FF3D5A 100%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>APPLY FOR DELEGATE PASS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Magnetic>

          {/* Secondary CTA: Nominate Speaker */}
          <Magnetic range={50} strength={0.25}>
            <a
              href="#speakers"
              onClick={e => scrollTo(e, "#speakers")}
              className="h-[60px] px-8 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.02] hover:bg-white/10 font-bold text-xs tracking-[0.2em] uppercase text-white/80 hover:text-white flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <UserPlus className="w-4 h-4" />
              <span>NOMINATE SPEAKER</span>
            </a>
          </Magnetic>
        </motion.div>

      </div>
    </section>
  );
}
