"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Award, Compass, Shield } from "lucide-react";

const SPEAKERS = [
  {
    name: "Dr. Sarah Chen",
    title: "Quantum Computing Lead",
    company: "CERN Quantum Initiative",
    category: "Keynote",
    topic: "Quantum Consciousness & Digital Paradigms",
    avatarColor: "from-[#EB0028]/30 via-[#EB0028]/10 to-transparent",
    badgeColor: "text-[#EB0028] border-[#EB0028]/30 bg-[#EB0028]/10",
  },
  {
    name: "Marcus Thorne",
    title: "Principal Urban Futurist",
    company: "Metropolis 2050 Institute",
    category: "Session",
    topic: "Architecting the Boundless: Bio-Cities",
    avatarColor: "from-white/30 via-white/10 to-transparent",
    badgeColor: "text-white/80 border-white/30 bg-white/10",
  },
  {
    name: "Prof. Elena Rostova",
    title: "Director of Neuro-Ethics",
    company: "Oxford AI Ethics Lab",
    category: "Panelist",
    topic: "The Ethics of Synthetic Sentience",
    avatarColor: "from-[#EB0028]/30 via-[#EB0028]/10 to-transparent",
    badgeColor: "text-[#EB0028] border-[#EB0028]/30 bg-[#EB0028]/10",
  },
  {
    name: "Kavi Dev",
    title: "Spatial Audio Archeologist",
    company: "Acoustic Horizon Labs",
    category: "Interactive",
    topic: "Acoustic Archeology & Sacred Soundscapes",
    avatarColor: "from-white/30 via-white/10 to-transparent",
    badgeColor: "text-white/80 border-white/30 bg-white/10",
  },
  {
    name: "Zoe Sterling",
    title: "Planetary Systems Engineer",
    company: "Horizon Biosphere Group",
    category: "Keynote",
    topic: "Designing the Next Epoch: Ecological Engineering",
    avatarColor: "from-[#EB0028]/30 via-[#EB0028]/10 to-transparent",
    badgeColor: "text-[#EB0028] border-[#EB0028]/30 bg-[#EB0028]/10",
  },
  {
    name: "Dr. Aris Thorne",
    title: "Autonomous Robotics Chair",
    company: "Stanford Robotics Vision",
    category: "Session",
    topic: "Cognitive Robotics & Post-Biological Labor",
    avatarColor: "from-white/30 via-white/10 to-transparent",
    badgeColor: "text-white/80 border-white/30 bg-white/10",
  },
];

export default function Speakers() {
  return (
    <section 
      id="speakers" 
      className="relative min-h-[120vh] w-full py-[160px] px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden flex flex-col justify-center"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-[64px] relative z-20">
        
        {/* Section Header (Title 72px, Subtitle 24px) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            CHAPTER IV · FEATURED SPEAKERS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-[72px] font-black text-white tracking-tight uppercase leading-none"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            Thought <span className="text-[#EB0028] text-glow">Leaders</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[24px] text-white/70 font-light max-w-2xl mx-auto"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Pioneers and researchers shaping quantum computing, neuro-ethics, and planetary engineering.
          </motion.p>
        </div>

        {/* Spacious 3-Column Gallery Grid (Desktop 3 Columns, Gap 40px / gap-10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SPEAKERS.map((s, idx) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="group relative rounded-[32px] border border-white/10 bg-black/50 backdrop-blur-2xl p-10 overflow-hidden hover:border-[#EB0028]/50 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Radial hover accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.avatarColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10 flex items-start justify-between">
                <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border ${s.badgeColor}`}>
                  {s.category}
                </span>

                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/40 transition-colors">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-glow transition-all" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
                  {s.name}
                </h3>
                <p className="text-xs text-white/70 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {s.title}
                </p>
                <p className="text-xs font-semibold text-[#EB0028] uppercase tracking-wider">
                  {s.company}
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">
                  KEYNOTE TOPIC
                </span>
                <p className="text-sm font-bold text-white tracking-wide leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  "{s.topic}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
