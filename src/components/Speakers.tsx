"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Speaker {
  id: number;
  name: string | null;
  title: string | null;
  topic: string | null;
  category: string;
  hasImage: boolean;
  accentColor: "red" | "white";
}

const SPEAKERS: Speaker[] = [
  {
    id: 1,
    name: null,
    title: null,
    topic: null,
    category: "Keynote",
    hasImage: true,
    accentColor: "red",
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 2,
    name: null,
    title: null,
    topic: null,
    category: i % 3 === 0 ? "Keynote" : i % 3 === 1 ? "Session" : "Panel",
    hasImage: false,
    accentColor: (i % 2 === 0 ? "red" : "white") as "red" | "white",
  })),
];

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const num = String(speaker.id).padStart(2, "0");
  const isRevealed = speaker.hasImage;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 ${
        isHovered
          ? "border-[#EB0028]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(235,0,40,0.15)]"
          : "border-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      }`}
      style={{
        background: "rgba(8, 8, 8, 0.7)",
        backdropFilter: "blur(16px)",
        transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
      }}
    >
      {/* Radial cursor glow */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, rgba(235,0,40,0.08), transparent 60%)`,
          }}
        />
      )}

      {/* Top sheen line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Portrait Area */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-white/[0.03] to-black/60 overflow-hidden">
        {isRevealed ? (
          <>
            {/* Card 01: Use the existing sample speaker image */}
            <img
              src="/butterfly-art.jpg"
              alt="Speaker"
              className="w-full h-full object-cover transition-transform duration-700"
              style={{
                transform: isHovered ? "scale(1.08) translateY(-3%)" : "scale(1)",
                filter: isHovered ? "brightness(1.1)" : "brightness(0.85)",
              }}
            />
            {/* Portrait rim lights */}
            <div className="absolute inset-0 pointer-events-none" style={{
              boxShadow: isHovered 
                ? "inset 0 0 30px rgba(235,0,40,0.15), inset 0 -60px 60px rgba(0,0,0,0.8)" 
                : "inset 0 -60px 60px rgba(0,0,0,0.7)"
            }} />
          </>
        ) : (
          /* Coming Soon Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
              <span 
                className="text-2xl font-normal text-white/30"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {num}
              </span>
            </div>
            <span 
              className="text-[10px] tracking-[0.3em] uppercase text-white/30"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              Coming Soon
            </span>
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <span 
            className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#EB0028] bg-black/80 px-2 py-0.5 rounded border border-[#EB0028]/25"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {speaker.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {isRevealed ? (
              <>
                <h3 
                  className="text-lg font-bold text-white tracking-tight group-hover:text-[#EB0028] transition-colors"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  Speaker {num}
                </h3>
                <p 
                  className="text-[12px] text-white/60 font-normal"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Topic to be announced
                </p>
              </>
            ) : (
              <>
                <h3 
                  className="text-lg font-bold text-white/40 tracking-tight"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  To Be Announced
                </h3>
                <p 
                  className="text-[12px] text-white/30 font-normal"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Speaker details coming soon
                </p>
              </>
            )}
          </div>
          
          <div className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center text-white/30 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/30 transition-colors">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Hover detail - topic area */}
        <div 
          className="pt-3 border-t border-white/[0.04] overflow-hidden transition-all duration-500"
          style={{ 
            maxHeight: isHovered ? "60px" : "0px", 
            opacity: isHovered ? 1 : 0,
            paddingTop: isHovered ? "12px" : "0px",
          }}
        >
          <span 
            className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028]/80 font-medium"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {isRevealed ? "View Profile →" : "Reveal Coming Soon"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef}
      id="speakers" 
      className="relative w-full py-32 sm:py-40 px-6 sm:px-12 lg:px-[72px] select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

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
              CHAPTER 03 // THE SPEAKERS
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
            Voices of<br />
            <span className="text-[#EB0028]">Transformation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/60 font-normal max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Twelve pioneering minds shaping the future across science, technology, ethics, and design.
          </motion.p>
        </div>

        {/* 12-Card Speaker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
