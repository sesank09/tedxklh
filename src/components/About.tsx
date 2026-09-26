"use client";

import { motion } from "framer-motion";

const STATEMENTS = [
  { text: "Ideas change.", delay: 0 },
  { text: "People change.", delay: 0.15 },
  { text: "Systems change.", delay: 0.3 },
];

const METRICS = [
  { val: "12+",   label: "Speakers" },
  { val: "100",   label: "Curated Delegates" },
  { val: "4",     label: "Transformation Acts" },
  { val: "100%",  label: "Non-Profit License" },
];

export default function About() {
  return (
    <section 
      id="about" 
      className="relative w-full pt-10 pb-28 sm:pt-16 sm:pb-36 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Radial Background Accent */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-24 relative z-20">
        
        {/* Chapter Header — Visual First */}
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
              CHAPTER 01 // THE NARRATIVE
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
            The Anatomy of<br />
            <span className="text-[#EB0028]">Transformation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            TEDxKLH 2026 gathers catalysts who refuse to stay the same shape. 
            We explore what happens when ideas rebuild our world from the inside out.
          </motion.p>
        </div>

        {/* Cinematic Visual Statements */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {STATEMENTS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: s.delay, duration: 0.6 }}
                className="text-center sm:text-left"
              >
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {s.text}
                </h3>
                <div className="mt-3 w-10 h-[2px] bg-[#EB0028]/60 mx-auto sm:mx-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metrics — Animated Numbers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.015]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {METRICS.map((m, idx) => (
              <motion.div 
                key={idx} 
                className="text-center space-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {m.val}
                </div>
                <div 
                  className="text-[10px] text-white/50 font-medium uppercase tracking-[0.18em]"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
