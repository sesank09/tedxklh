"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Flame, RefreshCw, FlaskConical, Sparkles, ChevronRight } from "lucide-react";

const STAGES = [
  {
    id: "idea",
    num: "01",
    name: "IDEA",
    tagline: "The Latent Monolith",
    description: "A compact crystalline core containing the primordial impulse. Unformed yet dense with intent.",
    icon: Lightbulb,
    color: "#FFFFFF",
    shards: [
      { path: "M 150,80 L 220,130 L 150,180 L 80,130 Z", fill: "rgba(255,255,255,0.85)", stroke: "#ffffff" },
      { path: "M 150,180 L 220,230 L 150,280 L 80,230 Z", fill: "rgba(255,255,255,0.4)", stroke: "rgba(255,255,255,0.7)" },
      { path: "M 80,130 L 150,180 L 80,230 L 10,180 Z", fill: "rgba(255,255,255,0.6)", stroke: "#ffffff" },
      { path: "M 220,130 L 290,180 L 220,230 L 150,180 Z", fill: "rgba(255,255,255,0.5)", stroke: "#ffffff" },
    ],
  },
  {
    id: "friction",
    num: "02",
    name: "FRICTION",
    tagline: "Structural Tension",
    description: "External resistance causes stress fractures across the facet planes. The monolith destabilizes.",
    icon: Flame,
    color: "#FFAA66",
    shards: [
      { path: "M 150,60 L 240,110 L 160,170 L 60,110 Z", fill: "rgba(255,220,200,0.8)", stroke: "#ffaa66" },
      { path: "M 140,190 L 230,250 L 150,300 L 70,240 Z", fill: "rgba(235,0,40,0.4)", stroke: "#EB0028" },
      { path: "M 60,110 L 140,170 L 50,230 L 10,160 Z", fill: "rgba(255,255,255,0.5)", stroke: "#ffffff" },
      { path: "M 240,110 L 310,170 L 240,240 L 160,180 Z", fill: "rgba(235,0,40,0.6)", stroke: "#ff4466" },
    ],
  },
  {
    id: "change",
    num: "03",
    name: "CHANGE",
    tagline: "Dissolution & Dispersion",
    description: "The crystalline bonds shatter. Shards drift outward, exploring unmapped coordinate space.",
    icon: RefreshCw,
    color: "#EB0028",
    shards: [
      { path: "M 150,30 L 260,80 L 170,150 L 40,80 Z", fill: "rgba(255,255,255,0.7)", stroke: "#ffffff" },
      { path: "M 130,220 L 250,290 L 140,340 L 40,270 Z", fill: "rgba(235,0,40,0.65)", stroke: "#EB0028" },
      { path: "M 40,80 L 130,150 L 30,220 L 0,140 Z", fill: "rgba(255,100,120,0.6)", stroke: "#ff6688" },
      { path: "M 260,80 L 340,150 L 260,230 L 170,160 Z", fill: "rgba(235,0,40,0.85)", stroke: "#EB0028" },
    ],
  },
  {
    id: "experiment",
    num: "04",
    name: "EXPERIMENT",
    tagline: "Cellular Reconfiguration",
    description: "Discrete imaginal fragments align into experimental bilateral symmetry, forging new geometry.",
    icon: FlaskConical,
    color: "#FF2E54",
    shards: [
      { path: "M 150,20 L 280,70 L 180,140 L 20,70 Z", fill: "rgba(255,255,255,0.8)", stroke: "#ffffff" },
      { path: "M 120,240 L 270,310 L 150,360 L 20,290 Z", fill: "rgba(235,0,40,0.75)", stroke: "#EB0028" },
      { path: "M 20,70 L 120,140 L 20,220 L 0,130 Z", fill: "rgba(255,255,255,0.65)", stroke: "#ffffff" },
      { path: "M 280,70 L 370,140 L 280,230 L 180,150 Z", fill: "rgba(235,0,40,0.9)", stroke: "#EB0028" },
    ],
  },
  {
    id: "transformation",
    num: "05",
    name: "TRANSFORMATION",
    tagline: "Irreversible Emergence",
    description: "The final synthesis is achieved. White idea fragments fuse with ruby transformation facets into flight.",
    icon: Sparkles,
    color: "#EB0028",
    shards: [
      { path: "M 150,10 L 300,60 L 190,130 L 0,60 Z", fill: "rgba(255,255,255,0.95)", stroke: "#ffffff" },
      { path: "M 110,250 L 290,330 L 150,380 L 10,300 Z", fill: "rgba(235,0,40,0.9)", stroke: "#EB0028" },
      { path: "M 0,60 L 110,130 L 10,230 L 0,120 Z", fill: "rgba(255,255,255,0.85)", stroke: "#ffffff" },
      { path: "M 300,60 L 390,130 L 300,230 L 190,140 Z", fill: "rgba(235,0,40,0.95)", stroke: "#EB0028" },
    ],
  },
];

export default function Theme() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // Auto-cycle through metamorphosis if user remains idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentStage = STAGES[activeStageIdx];

  return (
    <section 
      id="theme" 
      className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.07),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(2.5rem,5vw,4.5rem)] relative z-20">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6 text-center sm:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            METAMORPHOSIS<br />
            <span 
              className="text-[#EB0028] text-[clamp(1.1rem,2.8vw,2.2rem)] font-semibold tracking-normal block mt-1.5 sm:mt-2" 
              style={{ fontFamily: "var(--font-sora)" }}
            >
              The Unseen Process of Becoming
            </span>
          </motion.h2>
        </div>

        {/* Metamorphosis Stage Selector Navigation */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 sm:pb-0 gap-2 sm:gap-3 scrollbar-none w-full max-w-full">
          {STAGES.map((st, idx) => {
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStageIdx(idx)}
                className={`group relative px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer min-h-[44px] ${
                  isActive
                    ? "bg-[#EB0028]/20 border-[#EB0028] shadow-[0_0_25px_rgba(235,0,40,0.35)]"
                    : "bg-black/50 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
                }`}
              >
                <span 
                  className={`text-xs font-bold transition-colors ${
                    isActive ? "text-[#EB0028]" : "text-white/40 group-hover:text-white/80"
                  }`}
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  {st.num}
                </span>
                <span 
                  className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage Display Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Dynamic Shard SVG Visualization */}
          <div className="flex items-center justify-center w-full">
            <div className="relative w-full max-w-[min(100%,420px)] aspect-square rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
              
              {/* Center Ambient Core */}
              <div 
                className="absolute w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
                style={{ background: `${currentStage.color}18` }}
              />

              {/* Dynamic Animated Crystalline Facets */}
              <svg viewBox="0 0 400 400" className="w-full h-full max-w-[340px] drop-shadow-[0_0_30px_rgba(235,0,40,0.35)]">
                <AnimatePresence mode="wait">
                  <motion.g
                    key={currentStage.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.15 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {currentStage.shards.map((shard, sIdx) => (
                      <motion.path
                        key={sIdx}
                        d={shard.path}
                        fill={shard.fill}
                        stroke={shard.stroke}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, delay: sIdx * 0.08 }}
                      />
                    ))}
                  </motion.g>
                </AnimatePresence>
              </svg>

              {/* HUD Coordinates Label */}
              <div 
                className="absolute bottom-4 left-5 text-[9px] font-mono text-white/30 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                PHASE 0{activeStageIdx + 1} — {currentStage.name}
              </div>
            </div>
          </div>

          {/* Right: Stage Narrative & Details */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-bold uppercase tracking-widest">
              <span>PHASE {currentStage.num}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/80">{currentStage.tagline}</span>
            </div>

            <h3 
              className="text-[clamp(1.8rem,4vw,3.2rem)] font-extrabold text-white tracking-tight uppercase leading-tight"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
            >
              {currentStage.name}
            </h3>

            <p 
              className="text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
            >
              {currentStage.description}
            </p>

            {/* Quick Next Stage Trigger */}
            <div className="pt-2 flex items-center justify-center lg:justify-start">
              <button
                onClick={() => setActiveStageIdx((activeStageIdx + 1) % STAGES.length)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-[#EB0028] transition-colors cursor-pointer py-2"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <span>NEXT PHASE</span>
                <ChevronRight className="w-4 h-4 text-[#EB0028]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
