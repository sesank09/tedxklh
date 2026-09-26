"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScheduleItem {
  time: string;
  act: string;
  title: string;
  duration: string;
  location: string;
  category: string;
  desc: string;
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: "09:30 AM",
    act: "Act I · Dissolution",
    title: "Opening Keynote",
    duration: "45 Min",
    location: "Main Auditorium",
    category: "Keynote",
    desc: "Opening the day by investigating what happens at the atomic and cognitive scale when old structures disintegrate to make space for radical new configurations.",
  },
  {
    time: "10:45 AM",
    act: "Act II · The Crucible",
    title: "Session Talk",
    duration: "35 Min",
    location: "Main Auditorium",
    category: "Session",
    desc: "A vision for infrastructure engineered with living biomaterials, capable of autonomous structural metamorphosis in response to planetary flux.",
  },
  {
    time: "11:45 AM",
    act: "Act II · The Threshold",
    title: "Panel Discussion",
    duration: "45 Min",
    location: "Main Auditorium",
    category: "Panel",
    desc: "An in-depth inquiry into the threshold moment where emerging technologies cross from predictive tools into self-transforming agents.",
  },
  {
    time: "02:00 PM",
    act: "Act III · Reorganization",
    title: "Interactive Experience",
    duration: "30 Min",
    location: "Main Auditorium",
    category: "Interactive",
    desc: "An immersive journey reconstructing how innovation alters human understanding and creates collective cognitive reorganization.",
  },
  {
    time: "03:15 PM",
    act: "Act IV · Emergence",
    title: "Closing Keynote",
    duration: "50 Min",
    location: "Main Auditorium",
    category: "Keynote Finale",
    desc: "The grand closing keynote synthesizing the overarching thesis of Metamorphosis: we must actively rebuild from within.",
  },
];

export default function Schedule() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <section 
      id="schedule" 
      className="relative w-full py-32 sm:py-40 px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.05),transparent_70%)] pointer-events-none" />

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
              CHAPTER 04 // THE SCHEDULE
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
            Timeline of<br />
            <span className="text-[#EB0028]">Becoming</span>
          </motion.h2>
        </div>

        {/* Interactive Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#EB0028]/30 via-white/10 to-transparent" />

          <div className="space-y-4">
            {SCHEDULE_ITEMS.map((item, index) => {
              const isExpanded = expandedIdx === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => setExpandedIdx(isExpanded ? null : index)}
                  className="relative pl-16 sm:pl-20 cursor-pointer group"
                >
                  {/* Timeline node */}
                  <div className={`absolute left-4 sm:left-6 top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isExpanded 
                      ? "border-[#EB0028] bg-[#EB0028] shadow-[0_0_12px_rgba(235,0,40,0.6)]"
                      : "border-white/20 bg-black group-hover:border-[#EB0028]/50"
                  }`} />

                  {/* Card */}
                  <div className={`p-6 sm:p-7 rounded-xl border transition-all duration-400 ${
                    isExpanded
                      ? "border-[#EB0028]/30 bg-white/[0.025] shadow-[0_10px_30px_rgba(235,0,40,0.1)]"
                      : "border-white/[0.05] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.015]"
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span 
                            className="text-[11px] font-semibold tracking-[0.15em] text-[#EB0028]"
                            style={{ fontFamily: "var(--font-dm-mono)" }}
                          >
                            {item.time}
                          </span>
                          <span 
                            className="text-[10px] tracking-[0.15em] text-white/40 uppercase"
                            style={{ fontFamily: "var(--font-dm-mono)" }}
                          >
                            {item.act} · {item.duration}
                          </span>
                        </div>
                        <h3
                          className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                            isExpanded ? "text-white" : "text-white/80"
                          }`}
                          style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                        >
                          {item.title}
                        </h3>
                        <p 
                          className="text-[12px] text-white/50 font-normal"
                          style={{ fontFamily: "var(--font-manrope)" }}
                        >
                          {item.location} · Speaker to be announced
                        </p>
                      </div>

                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isExpanded ? "border-[#EB0028]/50 text-[#EB0028] rotate-180" : "border-white/10 text-white/30"
                      }`}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-4 mt-4 border-t border-white/[0.05] text-xs sm:text-sm text-white/60 font-normal leading-relaxed"
                          style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                        >
                          {item.desc}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
