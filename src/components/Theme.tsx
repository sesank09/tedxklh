"use client";

import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldAlert, GitMerge, Zap, ArrowUpRight, Quote } from "lucide-react";

const HERO_PILLAR = {
  num: "01",
  name: "DISSOLUTION",
  tag: "PHASE I · STRUCTURAL BREAKDOWN",
  headline: "Every Butterfly First Had To Dissolve",
  desc: "Metamorphosis is not cosmetic or decorative. A caterpillar doesn't just receive new features—its entire structure is dissolved from the inside out to make room for the unforeseen.",
  quote: "“Metamorphosis isn't decoration on top of who you were. It's a rebuild from the inside.”",
};

const STAGES = [
  {
    num: "02",
    name: "THE CHRYSALIS",
    subtitle: "The Threshold Crucible",
    desc: "A threshold moment where the old form must be let go before the new can take shape. The struggle is the crucible of synthesis.",
    icon: ShieldAlert,
  },
  {
    num: "03",
    name: "REORGANIZATION",
    subtitle: "Imaginal Cellular Rebuild",
    desc: "Discrete imaginal cells activate, communicating across boundaries to build complex wings, systems, and sensory networks.",
    icon: GitMerge,
  },
  {
    num: "04",
    name: "EMERGENCE",
    subtitle: "Irreversible Flight",
    desc: "Growth is a process, not an event. The emergence is total and irreversible—the butterfly does not go back.",
    icon: Zap,
  },
  {
    num: "05",
    name: "UNIVERSAL SCALE",
    subtitle: "Beyond Biology",
    desc: "Applying to every scale—a biological cell, an individual human mind, artificial intelligence, institutions, and societies.",
    icon: Layers,
  },
];

export default function Theme() {
  return (
    <section 
      id="theme" 
      className="relative w-full py-[140px] px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.1),transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto space-y-[64px] relative z-20 flex flex-col items-center text-center">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(235,0,40,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            THE THEME DOSSIER
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-[64px] font-black text-white tracking-tight uppercase leading-none text-center"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            THE STAGES OF <span className="text-[#EB0028] text-glow">BECOMING</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-white/75 font-light max-w-2xl mx-auto text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="font-mono text-[#EB0028] font-semibold">meta</span> (change, beyond) + <span className="font-mono text-white/90 font-semibold">morphē</span> (form, shape).
            Holding both the mythic and the scientific, the wonder and the mechanism.
          </motion.p>
        </div>

        {/* 1 Hero Feature Card + 4 Supporting Cards Grid */}
        <div className="w-full space-y-8">
          
          {/* Hero Feature Card: Dissolution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 md:p-12 rounded-[32px] border border-[#EB0028]/40 bg-black/75 backdrop-blur-2xl space-y-6 shadow-[0_20px_60px_rgba(235,0,40,0.2)] text-center flex flex-col items-center justify-center group max-w-5xl mx-auto relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-mono tracking-widest text-[#EB0028] font-bold px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10">
                {HERO_PILLAR.tag}
              </span>
              <span className="text-sm font-mono text-white/40">{HERO_PILLAR.num}</span>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white group-hover:text-glow transition-all" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
                {HERO_PILLAR.headline}
              </h3>
              <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {HERO_PILLAR.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 w-full max-w-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-serif italic text-white/70">
              <Quote className="w-4 h-4 text-[#EB0028] shrink-0" />
              <span>{HERO_PILLAR.quote}</span>
            </div>
          </motion.div>

          {/* 4 Supporting Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {STAGES.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-7 rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl hover:border-[#EB0028]/40 hover:bg-black/70 hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between items-center text-center group"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-mono text-[#EB0028] font-bold">{p.num}</span>
                    <div className="w-9 h-9 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/40 transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white uppercase group-hover:text-glow transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {p.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#EB0028]/80 block">
                      {p.subtitle}
                    </span>
                    <p className="text-xs text-white/70 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 w-full flex justify-center">
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#EB0028] transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
