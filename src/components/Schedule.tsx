"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

interface ScheduleItem {
  time: string;
  act: string;
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
    act: "ACT I · DISSOLUTION",
    title: "Quantum Phase Shifts: When Matter Dissolves & Reassembles",
    speaker: "Dr. Sarah Chen",
    duration: "45 Min",
    location: "Main Auditorium",
    category: "Keynote",
    desc: "Opening the day by investigating what happens at the atomic and cognitive scale when old structures disintegrate to make space for radical new configurations.",
  },
  {
    time: "10:45 AM",
    act: "ACT II · THE CRUCIBLE",
    title: "The Chrysalis City: Architecture that Refuses Static Form",
    speaker: "Marcus Thorne",
    duration: "35 Min",
    location: "Chrysalis Dome",
    category: "Session",
    desc: "A vision for urban infrastructure engineered with living biomaterials, capable of autonomous structural metamorphosis in response to planetary flux.",
  },
  {
    time: "11:45 AM",
    act: "ACT II · THE THRESHOLD",
    title: "Synthetic Sentience: The Irreversible Emergence of Machine Minds",
    speaker: "Prof. Elena Rostova",
    duration: "45 Min",
    location: "Auditorium B",
    category: "Panel",
    desc: "An in-depth inquiry into the threshold moment where artificial neural representations cross from predictive tools into sentient self-transforming agents.",
  },
  {
    time: "02:00 PM",
    act: "ACT III · REORGANIZATION",
    title: "Dissolving Boundaries: Sonic Metamorphosis & Spatial Echoes",
    speaker: "Kavi Dev",
    duration: "30 Min",
    location: "Resonance Hall",
    category: "Interactive",
    desc: "An immersive spatial acoustic journey reconstructing how sound frequency alters human neural topology and creates collective cognitive reorganization.",
  },
  {
    time: "03:15 PM",
    act: "ACT IV · EMERGENCE",
    title: "The Anthropocene Rebuild: Planetary Engineering from Within",
    speaker: "Zoe Sterling",
    duration: "50 Min",
    location: "Main Auditorium",
    category: "Keynote Finale",
    desc: "The grand closing keynote synthesizing the overarching thesis of Metamorphosis: human civilization cannot simply add decoration on top of history; we must actively rebuild from within.",
  },
];

export default function Schedule() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <section 
      id="schedule" 
      className="relative w-full py-[140px] px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto space-y-[64px] relative z-20 flex flex-col items-center text-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(235,0,40,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            THE METAMORPHIC AGENDA
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-[64px] font-black text-white tracking-tight uppercase leading-none"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            TIMELINE OF <span className="text-[#EB0028] text-glow">BECOMING</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-white/70 font-light max-w-2xl mx-auto"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Four continuous acts chronicling the journey from structural breakdown to threshold synthesis and irreversible flight.
          </motion.p>
        </div>

        {/* Centered Schedule Cards Stack */}
        <div className="w-full max-w-3xl mx-auto space-y-6 flex flex-col items-center">
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
                className={`w-full p-7 sm:p-9 rounded-[32px] border transition-all duration-300 overflow-hidden cursor-pointer space-y-5 text-center flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${
                  isExpanded
                    ? "border-[#EB0028]/50 bg-black/85 shadow-[0_10px_40px_rgba(235,0,40,0.2)]"
                    : "border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60"
                }`}
              >
                {/* Header Badge & Category */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] font-mono text-xs font-bold tracking-widest">
                    {item.time}
                  </span>
                  <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                    {item.act} · {item.duration}
                  </span>
                </div>

                {/* Title & Speaker */}
                <div className="space-y-2 max-w-xl mx-auto text-center">
                  <h3
                    className={`text-xl sm:text-2xl font-bold tracking-wide uppercase transition-colors ${
                      isExpanded ? "text-[#EB0028]" : "text-white"
                    }`}
                    style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Talk by <span className="text-white font-bold">{item.speaker}</span> · {item.location}
                  </p>
                </div>

                {/* Expand Chevron Icon */}
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-transform ${
                  isExpanded ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028] rotate-180" : ""
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>

                {/* Expandable Abstract */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-5 border-t border-white/10 text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-xl mx-auto text-center"
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
