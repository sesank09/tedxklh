"use client";

import { motion } from "framer-motion";
import { ExternalLink, Handshake, Building2, Sparkles } from "lucide-react";

const PARTNER_TIERS = [
  { tier: "Host Institution", category: "KLH University, Bowrampet", isConfirmed: true },
  { tier: "Title Partner", category: "Partner To Be Announced", isConfirmed: false },
  { tier: "Research & Innovation", category: "Partner To Be Announced", isConfirmed: false },
  { tier: "Technology & Cloud", category: "Partner To Be Announced", isConfirmed: false },
  { tier: "Media & Broadcast", category: "Partner To Be Announced", isConfirmed: false },
  { tier: "Experience Partner", category: "Partner To Be Announced", isConfirmed: false },
];

export default function Partners() {
  return (
    <section 
      id="partners" 
      className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1400px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        
        {/* Chapter Header */}
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center sm:justify-start gap-3"
          >
            <span 
              className="text-xs font-medium tracking-[0.25em] text-[#EB0028] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              CHAPTER 06 // COLLABORATORS
            </span>
            <span className="h-px w-8 bg-[#EB0028]/40" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            Our<br />
            <span className="text-[#EB0028]">Collaborators</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed mx-auto sm:mx-0"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Visionary institutions and enterprises partnering with TEDxKLH to support ideas that reshape our world.
          </motion.p>
        </div>

        {/* Grayscale Partner Field with Smooth White/Crimson Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNER_TIERS.map((p, idx) => (
            <motion.div
              key={p.tier}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="group p-8 rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl hover:border-[#EB0028]/40 hover:bg-black/85 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between min-h-[190px] cursor-pointer relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Top Sheen */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-center relative z-10">
                <span 
                  className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028] font-semibold bg-[#EB0028]/10 px-2.5 py-0.5 rounded border border-[#EB0028]/25"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  // {p.tier}
                </span>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-[#EB0028] transition-colors" />
              </div>

              <div className="relative z-10 space-y-1.5 my-2">
                <h3 
                  className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                    p.isConfirmed ? "text-white group-hover:text-[#EB0028]" : "text-white/40 group-hover:text-white/80"
                  }`}
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {p.category}
                </h3>
                {!p.isConfirmed && (
                  <p 
                    className="text-[10px] text-[#EB0028]/60 uppercase tracking-[0.2em] font-mono"
                  >
                    // INQUIRIES OPEN
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[9px] text-white/30">
                <span style={{ fontFamily: "var(--font-dm-mono)" }}>
                  TEDxKLH 2026
                </span>
                <span className="text-[#EB0028]/60 font-mono">
                  {p.isConfirmed ? "HOST CAMPUS" : "COLLABORATION"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
