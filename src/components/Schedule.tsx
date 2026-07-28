"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

interface ScheduleItem {
  time: string;
  title: string;
  speaker: string;
  duration: string;
  location: string;
  category: string;
  desc: string;
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: "09:30 AM",
    title: "Quantum Consciousness & Digital Paradigms",
    speaker: "Dr. Sarah Chen",
    duration: "45 Min",
    location: "Main Auditorium",
    category: "Keynote",
    desc: "Delving into quantum systems, cellular automation models, and the boundaries where human thought merges with computational frameworks.",
  },
  {
    time: "10:30 AM",
    title: "Architecting the Boundless: Cities of 2050",
    speaker: "Marcus Thorne",
    duration: "30 Min",
    location: "Helix Dome",
    category: "Session",
    desc: "A structural forecast into autonomous skyscrapers, living concrete, and circular bio-architectures designed for future climate paradigms.",
  },
  {
    time: "11:30 AM",
    title: "The Ethics of Synthetic Sentience",
    speaker: "Prof. Elena Rostova",
    duration: "45 Min",
    location: "Auditorium B",
    category: "Panel",
    desc: "A panel discussion exploring legal structures, neuro-computational rights, and neural-symbolic alignment for post-biological agents.",
  },
  {
    time: "01:30 PM",
    title: "Acoustic Archeology & Sacred Soundscapes",
    speaker: "Kavi Dev",
    duration: "30 Min",
    location: "Resonance Hall",
    category: "Interactive",
    desc: "Recreating the acoustic resonances of prehistoric structures using spatial audio techniques and holographic soundscapes.",
  },
  {
    time: "02:30 PM",
    title: "Closing Keynote: Designing the Next Epoch",
    speaker: "Zoe Sterling",
    duration: "50 Min",
    location: "Main Auditorium",
    category: "Keynote",
    desc: "Synthesizing the core insights of human exploration, boundless creativity, and our collective responsibility as planetary engineers.",
  },
];

export default function Schedule() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <section 
      id="schedule" 
      className="relative w-full py-[160px] px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-[64px] relative z-20 flex flex-col items-center text-center">
        
        {/* Section Header (Centered Title 72px, Subtitle 24px) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            CHAPTER V · CONFERENCE TIMELINE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-[72px] font-black text-white tracking-tight uppercase leading-none"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            Editorial <span className="text-[#EB0028] text-glow">Agenda</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[24px] text-white/70 font-light max-w-2xl mx-auto"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            A full-day conference sequence organized into keynote sessions, panel debates, and interactive exhibitions.
          </motion.p>
        </div>

        {/* 100% Centered Schedule Cards Stack */}
        <div className="w-full max-w-3xl mx-auto space-y-[40px] flex flex-col items-center">
          {SCHEDULE_ITEMS.map((item, index) => {
            const isExpanded = expandedIdx === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setExpandedIdx(isExpanded ? null : index)}
                className={`w-full p-8 sm:p-10 rounded-[32px] border transition-all duration-300 overflow-hidden cursor-pointer space-y-6 text-center flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${
                  isExpanded
                    ? "border-[#EB0028]/50 bg-black/80 shadow-[0_10px_40px_rgba(235,0,40,0.2)]"
                    : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60"
                }`}
              >
                {/* Header Badge & Category (Centered) */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] font-mono text-xs font-bold tracking-widest">
                    {item.time}
                  </span>
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                    {item.category} · {item.duration}
                  </span>
                </div>

                {/* Title & Speaker (Centered) */}
                <div className="space-y-2 max-w-xl mx-auto text-center">
                  <h3
                    className={`text-2xl sm:text-3xl font-bold tracking-wide uppercase transition-colors ${
                      isExpanded ? "text-[#EB0028]" : "text-white"
                    }`}
                    style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Keynote by <span className="text-white font-bold">{item.speaker}</span> · {item.location}
                  </p>
                </div>

                {/* Expand Chevron Icon */}
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-transform ${
                  isExpanded ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028] rotate-180" : ""
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>

                {/* Expandable Abstract (Centered) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-6 border-t border-white/10 text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-xl mx-auto text-center"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
