"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Users, Atom, Crown, Compass, ArrowUpRight } from "lucide-react";

const HERO_PILLAR = {
  num: "01",
  name: "INNOVATION",
  tag: "FLAGSHIP RESEARCH PILLAR",
  headline: "Transcending Computational & Cognitive Limits",
  desc: "Exploring how generative AI, quantum processors, and autonomous neural systems expand what it means to build, think, and evolve across post-digital paradigms.",
  metrics: "8 Keynote Key Topics",
};

const SUPPORTING_PILLARS = [
  {
    num: "02",
    name: "HUMANITY",
    headline: "Bio-Architecture & Social Fabrics",
    desc: "Reimagining urban environments, post-biological ethics, and circular ecological systems.",
    icon: Users,
  },
  {
    num: "03",
    name: "RESEARCH",
    headline: "Frontier Physics & Deep Tech",
    desc: "Synthesizing clean energy, spatial acoustics, and planetary engineering.",
    icon: Atom,
  },
  {
    num: "04",
    name: "LEADERSHIP",
    headline: "Guiding the Post-Digital Epoch",
    desc: "Empowering next-generation stewards to lead with ethical clarity and courage.",
    icon: Crown,
  },
  {
    num: "05",
    name: "FUTURE",
    headline: "Boundless Horizons Beyond 2050",
    desc: "A bold exploration into space exploration, cognitive augmentation, and deep time.",
    icon: Compass,
  },
];

export default function Theme() {
  return (
    <section 
      id="theme" 
      className="relative w-full py-[160px] px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-[64px] relative z-20 flex flex-col items-center text-center">
        
        {/* 100% Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            CHAPTER III · ANNUAL THEME
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-[72px] font-black text-white tracking-tight uppercase leading-none text-center"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            BOUNDLESS <span className="text-[#EB0028] text-glow">PILLARS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[24px] text-white/80 font-light max-w-2xl mx-auto text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Five core thematic dimensions driving human discovery at TEDxKLH 2026.
          </motion.p>
        </div>

        {/* 1 Hero Feature Card + 4 Supporting Cards Grid */}
        <div className="w-full space-y-8">
          
          {/* Hero Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 md:p-12 rounded-[32px] border border-[#EB0028]/40 bg-black/70 backdrop-blur-2xl space-y-6 shadow-[0_20px_60px_rgba(235,0,40,0.2)] text-center flex flex-col items-center justify-center group max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-mono tracking-widest text-[#EB0028] font-bold px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10">
                {HERO_PILLAR.tag}
              </span>
              <span className="text-sm font-mono text-white/40">{HERO_PILLAR.num}</span>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              <h3 className="text-3xl sm:text-5xl font-black text-white group-hover:text-glow transition-all" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
                {HERO_PILLAR.headline}
              </h3>
              <p className="text-[18px] text-white/80 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {HERO_PILLAR.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 w-full max-w-2xl flex justify-between items-center text-xs font-mono text-white/50">
              <span>{HERO_PILLAR.name}</span>
              <span>{HERO_PILLAR.metrics}</span>
            </div>
          </motion.div>

          {/* 4 Floating Supporting Cards Grid (Gap 32px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {SUPPORTING_PILLARS.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl hover:border-white/30 hover:bg-black/60 hover:-translate-y-1.5 transition-all duration-300 space-y-5 flex flex-col justify-between items-center text-center group"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-mono text-[#EB0028] font-bold">{p.num}</span>
                    <div className="w-9 h-9 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white uppercase group-hover:text-glow transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {p.name}
                    </h4>
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
