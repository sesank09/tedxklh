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
      className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.07),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-20 relative z-20">
        
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
              CHAPTER 02 // THE THEME
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
            METAMORPHOSIS<br />
            <span className="text-[#EB0028] text-2xl sm:text-4xl md:text-5xl font-semibold tracking-normal block mt-2" style={{ fontFamily: "var(--font-sora)" }}>
              The Unseen Process of Becoming
            </span>
          </motion.h2>
        </div>

        {/* Metamorphosis Stage Selector Navigation */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 sm:pb-0 gap-2 sm:gap-3 scrollbar-none">
          {STAGES.map((st, idx) => {
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStageIdx(idx)}
                className={`group relative px-4 sm:px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 shrink-0 cursor-pointer ${
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
                  className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  {st.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="themeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#EB0028]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Central Dynamic Crystalline Metamorphosis Canvas */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center: Interactive Crystalline Shard Object */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div className="relative w-full max-w-[440px] aspect-square rounded-3xl border border-white/[0.08] bg-black/70 backdrop-blur-2xl p-8 flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] group">
              
              {/* Radial Ruby/White Backlight */}
              <div 
                className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${activeStageIdx >= 2 ? "rgba(235,0,40,0.22)" : "rgba(255,255,255,0.08)"}, transparent 70%)`
                }}
              />

              {/* Dynamic Geometric Crystalline SVG */}
              <svg 
                viewBox="0 0 390 390" 
                className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(235,0,40,0.4)]"
              >
                {/* Connecting Laser Guidelines */}
                <line x1="150" y1="20" x2="150" y2="380" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                <line x1="20" y1="200" x2="370" y2="200" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

                {/* Animated Dynamic Polygon Shards */}
                {currentStage.shards.map((shard, sIdx) => (
                  <motion.path
                    key={`${currentStage.id}-${sIdx}`}
                    d={shard.path}
                    fill={shard.fill}
                    stroke={shard.stroke}
                    strokeWidth="1.5"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                ))}

                {/* Center Core Node */}
                <circle 
                  cx="150" 
                  cy="200" 
                  r={activeStageIdx >= 3 ? "5" : "3.5"} 
                  fill="#EB0028" 
                  stroke="#ffffff" 
                  strokeWidth="1.5"
                  className="animate-pulse shadow-[0_0_12px_#EB0028]" 
                />
              </svg>

              {/* HUD Coordinates & Status */}
              <div 
                className="absolute top-4 left-4 text-[9px] text-white/40 space-y-0.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <div>STAGE // 0{activeStageIdx + 1}</div>
                <div className="text-[#EB0028]">STATE: {currentStage.name}</div>
              </div>

              <div 
                className="absolute bottom-4 right-4 text-[9px] text-white/30"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                // CRYSTALLINE_MATRIX
              </div>
            </div>
          </div>

          {/* Right: Stage Narrative & Transformation Details */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 p-8 rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-2xl relative overflow-hidden"
              >
                {/* Top Crimson Edge Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

                <div className="space-y-2">
                  <span 
                    className="text-xs font-semibold tracking-[0.25em] text-[#EB0028] uppercase block"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    PHASE 0{activeStageIdx + 1} · {currentStage.tagline}
                  </span>

                  <h3 
                    className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                  >
                    {currentStage.name}
                  </h3>
                </div>

                <p 
                  className="text-sm sm:text-base text-white/70 font-normal leading-relaxed"
                  style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                >
                  {currentStage.description}
                </p>

                {/* Visual Legend */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                    <span className="text-white/60 font-mono text-[10px]">WHITE: IDEA</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#EB0028]" />
                    <span className="text-[#EB0028] font-mono text-[10px]">CRIMSON: BECOMING</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
