"use client";

import { motion } from "framer-motion";
import { Sparkles, Building2, ExternalLink } from "lucide-react";

const PARTNERS = [
  { name: "Google Quantum AI", tier: "Title Partner", category: "Technology" },
  { name: "CERN OpenLab",      tier: "Research Partner", category: "Science" },
  { name: "NVIDIA Robotics",   tier: "Compute Partner", category: "Hardware" },
  { name: "MIT Media Lab",     tier: "Academic Partner", category: "Education" },
  { name: "Designboom",        tier: "Media Partner", category: "Design" },
  { name: "KLH University, Bowrampet", tier: "Host Institution", category: "Campus" },
];

export default function Partners() {
  return (
    <section 
      id="partners" 
      className="relative w-full py-40 px-5 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1440px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-16 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            INSTITUTIONAL COLLABORATORS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            Logo <span className="text-[#EB0028] text-glow">Museum</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-white/60 font-light max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Empowered by global institutions, research labs, and technology leaders committed to spreading impactful ideas.
          </motion.p>
        </div>

        {/* Logo Museum Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PARTNERS.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl hover:border-[#EB0028]/50 hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-44 cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#EB0028] px-3 py-1 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10">
                  {p.tier}
                </span>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#EB0028] transition-colors" />
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-glow transition-all" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
                  {p.name}
                </h3>
                <p className="text-xs text-white/40 font-light uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {p.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
