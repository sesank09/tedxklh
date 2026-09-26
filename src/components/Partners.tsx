"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PARTNERS = [
  { tier: "Title Partner", category: "To Be Announced" },
  { tier: "Research Partner", category: "To Be Announced" },
  { tier: "Technology Partner", category: "To Be Announced" },
  { tier: "Academic Partner", category: "To Be Announced" },
  { tier: "Media Partner", category: "To Be Announced" },
  { tier: "Host Institution", category: "KLH University, Bowrampet", isRevealed: true },
];

export default function Partners() {
  return (
    <section 
      id="partners" 
      className="relative w-full py-32 sm:py-40 px-5 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1440px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.04),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-16 relative z-20">
        
        {/* Chapter Header */}
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span 
              className="text-xs font-medium tracking-[0.25em] text-[#EB0028] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              CHAPTER 07 // COLLABORATORS
            </span>
            <span className="h-px w-8 bg-[#EB0028]/40" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            Our<br />
            <span className="text-[#EB0028]">Collaborators</span>
          </motion.h2>
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {PARTNERS.map((p, idx) => (
            <motion.div
              key={p.tier}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group p-7 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-[#EB0028]/30 hover:bg-white/[0.025] hover:-translate-y-1 transition-all duration-400 flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-center relative z-10">
                <span 
                  className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028] font-medium"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  // {p.tier}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-[#EB0028] transition-colors" />
              </div>

              <div className="relative z-10 space-y-1">
                <h3 
                  className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                    p.isRevealed ? "text-white group-hover:text-[#EB0028]" : "text-white/30"
                  }`}
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {p.category}
                </h3>
                {!p.isRevealed && (
                  <p 
                    className="text-[10px] text-white/20 uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    Coming Soon
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
