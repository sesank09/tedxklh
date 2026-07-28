"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, Lightbulb, Share2 } from "lucide-react";

const NARRATIVE_STEPS = [
  {
    step: "01",
    title: "The Spark of Curiosity",
    desc: "Every paradigm shift begins with a single question that refuses to be ignored. We bring together thinkers whose work challenges assumptions.",
    icon: Lightbulb,
  },
  {
    step: "02",
    title: "Neural Convergence",
    desc: "Disconnected ideas collide across disciplines—where artificial intelligence meets philosophy, design, and environmental ethics.",
    icon: Compass,
  },
  {
    step: "03",
    title: "Boundless Impact",
    desc: "Ideas are born locally but reverberate globally. Our platform catalyzes conversation that extends far beyond the auditorium stage.",
    icon: Share2,
  },
];

const METRICS = [
  { val: "12+",   label: "Keynote Speakers" },
  { val: "100",   label: "Curated Delegates" },
  { val: "18+",   label: "Topics & Exhibits" },
  { val: "100%",  label: "Non-Profit Event" },
];

export default function About() {
  return (
    <section 
      id="about" 
      className="relative w-full py-40 px-5 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Radial Background Accent */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-24 relative z-20">
        
        {/* Section Header (100% Centered) */}
        <div className="max-w-3xl mx-auto text-center space-y-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            CHAPTER I · THE NARRATIVE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase text-center"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            The Lifecycle of an <span className="text-[#EB0028] text-glow">Idea</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            TEDxKLH is built on a simple premise: when visionary minds share space without boundaries, transformative ideas take root.
          </motion.p>
        </div>

        {/* Storytelling Grid: Magazine Narrative & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Narrative Timeline (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-12">
            {NARRATIVE_STEPS.map((st, i) => {
              const IconComp = st.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.02] group-hover:bg-[#EB0028]/15 group-hover:border-[#EB0028]/40 flex items-center justify-center text-[#EB0028] shrink-0 transition-all duration-300 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="space-y-2 border-b border-white/10 pb-8 w-full">
                    <span className="text-xs font-mono text-[#EB0028] tracking-widest uppercase">
                      PHASE {st.step}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
                      {st.title}
                    </h3>
                    <p className="text-sm text-white/60 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {st.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Metrics Grid (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8 p-8 sm:p-12 rounded-[32px] border border-white/10 bg-black/60 backdrop-blur-xl">
            <h3 className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
              Impact Overview
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {m.val}
                  </div>
                  <div className="text-xs text-white/50 font-light uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                INDEPENDENT TED OPERATING LICENSE
              </div>
              <p className="text-xs text-white/40 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Organized under official license from TED, hosted at KL University Hyderabad campus to cultivate regional innovation.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
