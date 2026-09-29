"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowUpRight, ShieldAlert, Cpu, Eye, Compass, User } from "lucide-react";

interface Speaker {
  id: number;
  category: string;
  hasImage: boolean;
  isFeatured?: boolean;
}

const SPEAKERS: Speaker[] = [
  {
    id: 1,
    category: "Keynote Speaker",
    hasImage: true,
    isFeatured: true,
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 2,
    category: i % 3 === 0 ? "Keynote" : i % 3 === 1 ? "Session Speaker" : "Panelist",
    hasImage: false,
    isFeatured: false,
  })),
];

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Physics (Subtle 3-5 degrees)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const num = String(speaker.id).padStart(2, "0");
  const isRevealed = speaker.hasImage;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      data-speaker-card="true"
      className={`speaker-card group relative rounded-3xl border overflow-hidden cursor-pointer transition-all duration-500 flex flex-col justify-between ${
        speaker.isFeatured ? "sm:col-span-2 lg:col-span-2 min-h-[460px]" : "min-h-[420px]"
      } ${
        isHovered
          ? "border-[#EB0028]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(235,0,40,0.2)] bg-black/85"
          : "border-white/[0.08] bg-black/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
      } backdrop-blur-2xl`}
    >
      {/* Top Ambient Sheen & Laser Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#EB0028]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EB0028]/25 transition-colors duration-500" />

      {/* Floating Geometric Shards on Hover */}
      {isHovered && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            animate={{ opacity: 0.8, scale: 1, x: 15, y: -15 }}
            className="absolute top-8 right-8 w-3 h-3 border border-[#EB0028] rotate-45 pointer-events-none z-30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            animate={{ opacity: 0.6, scale: 1, x: -10, y: 20 }}
            className="absolute bottom-16 left-6 w-2 h-2 bg-white rotate-12 pointer-events-none z-30"
          />
        </>
      )}

      {/* Header Info Tag */}
      <div className="p-6 pb-2 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <span 
            className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#EB0028] bg-[#EB0028]/10 px-2.5 py-1 rounded-md border border-[#EB0028]/30"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {speaker.category}
          </span>
          {speaker.isFeatured && (
            <span 
              className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80 bg-white/10 px-2 py-0.5 rounded"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              FEATURED
            </span>
          )}
        </div>

        <span 
          className="text-xl font-bold text-white/30 group-hover:text-[#EB0028] transition-colors"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {num}
        </span>
      </div>

      {/* Portrait Emerging Layer */}
      <div className="relative w-full flex-grow flex items-center justify-center p-6 overflow-hidden">
        {isRevealed ? (
          <div className="relative w-full h-[240px] sm:h-[260px] flex items-center justify-center">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,0,40,0.2),transparent_70%)] rounded-2xl" />

            {/* Emerging Portrait Cutout */}
            <motion.img
              src="/butterfly-art.jpg"
              alt="Featured Keynote"
              className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl relative z-10 transition-transform duration-500"
              style={{
                transform: isHovered ? "translateZ(30px) scale(1.04)" : "translateZ(0px) scale(1)",
                filter: isHovered ? "brightness(1.1) contrast(1.05)" : "brightness(0.9)",
              }}
            />

            {/* Crimson Edge Rim Light */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none z-20 transition-opacity duration-300"
              style={{
                boxShadow: isHovered 
                  ? "inset 0 0 35px rgba(235,0,40,0.4), 0 0 25px rgba(235,0,40,0.3)" 
                  : "inset 0 0 15px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        ) : (
          /* Sleek Coming Soon Visual Monolith */
          <div className="w-full h-[200px] rounded-2xl border border-white/[0.04] bg-white/[0.015] flex flex-col items-center justify-center gap-3 relative overflow-hidden group-hover:border-[#EB0028]/20 transition-colors">
            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/30 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/40 group-hover:scale-110 transition-all duration-400">
              <User className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <span 
                className="text-[10px] tracking-[0.25em] uppercase text-white/40 block"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                SPEAKER TO BE ANNOUNCED
              </span>
              <span 
                className="text-[9px] tracking-[0.2em] uppercase text-[#EB0028]/60 font-mono"
              >
                // PROFILE ENCRYPTED
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content & Action Info */}
      <div className="p-6 pt-2 space-y-3 relative z-20">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h3 
              className={`text-lg sm:text-xl font-bold tracking-tight uppercase ${
                isRevealed ? "text-white group-hover:text-[#EB0028]" : "text-white/50 group-hover:text-white/80"
              } transition-colors`}
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              {isRevealed ? "Keynote Profile" : "Speaker To Be Announced"}
            </h3>
            <p 
              className="text-xs text-white/60 font-normal leading-relaxed"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {isRevealed ? "Keynote topic & abstract to be revealed" : "Curated voice across science & innovation"}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/50 group-hover:bg-[#EB0028]/10 transition-all shrink-0">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Hover Reveal Bar */}
        <div 
          className="pt-2 border-t border-white/[0.06] overflow-hidden transition-all duration-400"
          style={{
            maxHeight: isHovered ? "40px" : "0px",
            opacity: isHovered ? 1 : 0,
            paddingTop: isHovered ? "8px" : "0px",
          }}
        >
          <span 
            className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028] font-semibold flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            <Sparkles className="w-3 h-3" />
            {isRevealed ? "Curated Keynote Delegate Session" : "Official Reveal Coming Soon"}
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
      className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        
        {/* Chapter Header */}
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center sm:justify-start gap-3"
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
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            Voices of<br />
            <span className="text-[#EB0028]">Transformation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Twelve curated catalysts sharing breakthrough ideas at the intersection of technology, design, and human potential.
          </motion.p>
        </div>

        {/* EXACTLY 12 Speaker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
