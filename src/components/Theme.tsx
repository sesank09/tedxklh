"use client";

import { motion } from "framer-motion";
import { ShieldAlert, GitMerge, Zap, Layers } from "lucide-react";

const STAGES = [
  {
    num: "01",
    name: "Dissolution",
    subtitle: "Structural Breakdown",
    desc: "Every paradigm shift begins with the courage to let go of the obsolete form.",
    icon: ShieldAlert,
  },
  {
    num: "02",
    name: "The Chrysalis",
    subtitle: "Threshold Crucible",
    desc: "A threshold moment where the old form must be let go before the new can take shape.",
    icon: GitMerge,
  },
  {
    num: "03",
    name: "Reorganization",
    subtitle: "Imaginal Rebuild",
    desc: "Discrete imaginal cells activate, communicating across boundaries to build complex new systems.",
    icon: Layers,
  },
  {
    num: "04",
    name: "Emergence",
    subtitle: "Irreversible Flight",
    desc: "Growth is a process, not an event. The emergence is total and irreversible.",
    icon: Zap,
  },
];

export default function Theme() {
  return (
    <section 
      id="theme" 
      className="relative w-full py-32 sm:py-40 px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.07),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-20 relative z-20">
        
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
              CHAPTER 02 // THE THEME
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
            The Stages of<br />
            <span className="text-[#EB0028]">Becoming</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/60 font-normal max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            <span className="text-[#EB0028] font-semibold" style={{ fontFamily: "var(--font-dm-mono)" }}>meta</span> (change, beyond) + <span className="text-white/90 font-semibold" style={{ fontFamily: "var(--font-dm-mono)" }}>morphē</span> (form, shape).
          </motion.p>
        </div>

        {/* Hero Dissolution Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl border border-[#EB0028]/30 bg-black/70 backdrop-blur-xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />
          
          <div className="space-y-4 max-w-2xl">
            <span 
              className="text-[11px] tracking-[0.25em] uppercase text-[#EB0028] font-medium"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              Phase I · Structural Breakdown
            </span>
            <h3 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Every butterfly first had to dissolve
            </h3>
            <p 
              className="text-sm sm:text-base text-white/70 font-normal leading-relaxed"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
            >
              Metamorphosis is not cosmetic. A caterpillar doesn&apos;t receive new features — its entire structure is dissolved from the inside out to make room for the unforeseen.
            </p>
          </div>
        </motion.div>

        {/* Animated Transformation Diagram */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage, idx) => {
            const IconComp = stage.icon;
            return (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group p-6 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-[#EB0028]/30 hover:bg-white/[0.025] hover:-translate-y-1 transition-all duration-400 space-y-4 relative"
              >
                {/* Connector line between cards */}
                {idx < STAGES.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-white/10" />
                )}
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[11px] text-[#EB0028] font-medium tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {stage.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/30 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 
                    className="text-base font-bold text-white uppercase tracking-wide group-hover:text-[#EB0028] transition-colors"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {stage.name}
                  </h4>
                  <span 
                    className="text-[10px] text-[#EB0028]/70 block font-medium"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {stage.subtitle}
                  </span>
                  <p 
                    className="text-xs text-white/60 font-normal leading-relaxed"
                    style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                  >
                    {stage.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
