"use client";

import { motion } from "framer-motion";
import { Sparkles, Cpu, Eye, Compass } from "lucide-react";

const STATEMENTS = [
  {
    num: "01",
    tag: "THE IDEA",
    title1: "IDEAS",
    title2: "CHANGE",
    desc: "A singular premise transforms the trajectory of technology and human consciousness.",
    icon: Sparkles,
    accent: "white",
  },
  {
    num: "02",
    tag: "THE INDIVIDUAL",
    title1: "PEOPLE",
    title2: "EVOLVE",
    desc: "Pioneers discard outdated mental models to inhabit higher dimensions of thought.",
    icon: Cpu,
    accent: "red",
  },
  {
    num: "03",
    tag: "THE COLLECTIVE",
    title1: "PERSPECTIVES",
    title2: "SHIFT",
    desc: "When divergent disciplines collide, collective vision reconfigures the horizon.",
    icon: Eye,
    accent: "white",
  },
  {
    num: "04",
    tag: "THE FUTURE",
    title1: "POSSIBILITIES",
    title2: "EMERGE",
    desc: "Metamorphosis completes when the unforeseen becomes the tangible reality.",
    icon: Compass,
    accent: "red",
  },
];

const METRICS = [
  { val: "12",   label: "Keynote Voices" },
  { val: "250",  label: "Curated Delegates" },
  { val: "4",    label: "Transformative Acts" },
  { val: "TEDx", label: "LICENSED EVENT" },
];

export default function About() {
  return (
    <section 
      id="about" 
      className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden"
    >
      {/* Cinematic Ambient Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(3rem,6vw,5.5rem)] relative z-20">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-center sm:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            The Anatomy of<br />
            <span className="text-[#EB0028]">Transformation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-[clamp(0.9rem,1.3vw,1.1rem)] text-white/70 font-normal leading-relaxed max-w-2xl mx-auto sm:mx-0"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            TEDxKLH 2026 gathers thinkers and builders who refuse to stay the same shape.
          </motion.p>
        </div>

        {/* 4-Part Cinematic Visual Sequence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1rem,2vw,1.5rem)]">
          {STATEMENTS.map((item, idx) => {
            const IconComp = item.icon;
            const isRed = item.accent === "red";
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group relative p-[clamp(1.25rem,2.5vw,2rem)] rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl flex flex-col justify-between min-h-[clamp(320px,36vw,380px)] overflow-hidden hover:border-[#EB0028]/40 hover:bg-black/80 hover:-translate-y-2 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Top Sheen Line & Shard Glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#EB0028]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#EB0028]/25 transition-colors" />

                {/* Top Row: Chapter Number & Tag */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-2xl sm:text-3xl font-bold text-white/30 group-hover:text-[#EB0028] transition-colors"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {item.num}
                    </span>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/40 transition-colors">
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <span 
                    className="text-[10px] tracking-[0.25em] uppercase text-[#EB0028] font-semibold block"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Center: Large Visual Typography */}
                <div className="my-4 sm:my-6 space-y-0.5">
                  <div 
                    className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold text-white tracking-tight uppercase leading-none"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                  >
                    {item.title1}
                  </div>
                  <div 
                    className={`text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold tracking-tight uppercase leading-none ${
                      isRed ? "text-[#EB0028]" : "text-white/90 group-hover:text-[#EB0028] transition-colors"
                    }`}
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                  >
                    {item.title2}
                  </div>
                </div>

                {/* Bottom: Minimal Short Paragraph */}
                <div className="pt-3 sm:pt-4 border-t border-white/[0.06] space-y-2">
                  <p 
                    className="text-xs sm:text-sm text-white/65 font-normal leading-relaxed"
                    style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Metrics Bar with TEDx Licensed Event Label */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pt-4">
          {METRICS.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="p-4 sm:p-6 rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-1"
            >
              <div 
                className={`text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold tracking-tight ${
                  m.val === "TEDx" ? "text-[#EB0028]" : "text-white"
                }`}
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                {m.val}
              </div>
              <div 
                className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
