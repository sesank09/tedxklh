"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MetamorphosisStage {
  id: string;
  num: string;
  name: string;
  concept: string;
  tagline: string;
  description: string;
  heroImage: string;
  cardImage: string;
  accentColor: string;
}

const STAGES: MetamorphosisStage[] = [
  {
    id: "idea",
    num: "01",
    name: "IDEA",
    concept: "Primal structure / Potential",
    tagline: "Primal Structure & Potential",
    description:
      "A compact crystalline core containing the primordial impulse. Four foundational facets dense with intent, beginning their subtle inward fold toward biological emergence.",
    heroImage: "/metamorphosis/phase-01-large.png",
    cardImage: "/metamorphosis/phase-01-card.png",
    accentColor: "#FFFFFF",
  },
  {
    id: "friction",
    num: "02",
    name: "FRICTION",
    concept: "Initialization / Encapsulation",
    tagline: "Initialization & Encapsulation",
    description:
      "External resistance and environmental tension weave a resilient protective mantle of fine silk threads. The structure anchors to living wood as a hanging cocoon takes form.",
    heroImage: "/metamorphosis/phase-02-large.png",
    cardImage: "/metamorphosis/phase-02-card.png",
    accentColor: "#FFAA66",
  },
  {
    id: "change",
    num: "03",
    name: "CHANGE",
    concept: "Internal reconfiguration",
    tagline: "Internal Reconfiguration",
    description:
      "The chrysalis awakens with deep crimson internal illumination. Outer silk layers turn translucent, revealing the symphonic cellular metamorphosis of developing butterfly wings.",
    heroImage: "/metamorphosis/phase-03-large.png",
    cardImage: "/metamorphosis/phase-03-card.png",
    accentColor: "#EB0028",
  },
  {
    id: "experiment",
    num: "04",
    name: "EXPERIMENT",
    concept: "Emergence / Formation",
    tagline: "Cellular Reconfiguration",
    description:
      "Discrete imaginal fragments align into experimental bilateral symmetry, forging new geometry. The chrysalis yields as luminous scarlet wings begin their tentative unfolding.",
    heroImage: "/metamorphosis/phase-04-hero.png",
    cardImage: "/metamorphosis/phase-04-card.png",
    accentColor: "#EB0028",
  },
  {
    id: "transformation",
    num: "05",
    name: "TRANSFORMATION",
    concept: "Realization / Flight",
    tagline: "Realization & Flight",
    description:
      "The final synthesis is achieved. Unshackled from its chrysalis, the deep crimson monarch spreads its wings in full symmetrical glory, taking flight into the infinite.",
    heroImage: "/metamorphosis/phase-05-large.png",
    cardImage: "/metamorphosis/phase-05-card.png",
    accentColor: "#EB0028",
  },
];

// Interactive ambient particle field rendered on canvas
function ParticleCanvas({ activeStageIdx }: { activeStageIdx: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = 36;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45 - (activeStageIdx >= 3 ? 0.35 : 0.1),
      alpha: Math.random() * 0.65 + 0.25,
      hue: activeStageIdx === 0 ? "white" : activeStageIdx === 1 ? "gold" : "crimson",
    }));

    let burst = 1.0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      burst = Math.max(0.4, burst * 0.96);

      particles.forEach((p) => {
        p.x += p.vx * burst;
        p.y += p.vy * burst;

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (p.hue === "white") {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
        } else if (p.hue === "gold") {
          ctx.fillStyle = `rgba(255, 200, 120, ${p.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(235, 0, 40, ${p.alpha * 0.9})`;
        }
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.hue === "crimson" ? "rgba(235,0,40,0.8)" : "rgba(255,255,255,0.4)";
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeStageIdx]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.85 }}
    />
  );
}

export default function Theme() {
  const [activeStageIdx, setActiveStageIdx] = useState(3); // Default to Phase 04 (EXPERIMENT) as in reference mockup
  const [isPaused, setIsPaused] = useState(false);
  const cardRowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Auto-cycle through metamorphosis (pauses when user interacts or hovers)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % STAGES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowRight") {
        setActiveStageIdx((prev) => (prev + 1) % STAGES.length);
      } else if (e.key === "ArrowLeft") {
        setActiveStageIdx((prev) => (prev - 1 + STAGES.length) % STAGES.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Smooth scroll active bottom card into view on small screens
  useEffect(() => {
    if (!cardRowRef.current) return;
    const activeEl = cardRowRef.current.children[activeStageIdx] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeStageIdx]);

  const currentStage = STAGES[activeStageIdx];

  const handleNext = () => {
    setActiveStageIdx((prev) => (prev + 1) % STAGES.length);
  };

  const handlePrev = () => {
    setActiveStageIdx((prev) => (prev - 1 + STAGES.length) % STAGES.length);
  };

  return (
    <section
      id="theme"
      className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[720px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

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

        {/* Top 5 Metamorphosis Stage Selector Navigation Pills */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 sm:pb-0 gap-2 sm:gap-3 scrollbar-none w-full max-w-full">
          {STAGES.map((st, idx) => {
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStageIdx(idx)}
                aria-label={`Select ${st.name} phase`}
                className={`group relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer min-h-[44px] ${
                  isActive
                    ? "bg-[#EB0028]/15 border-[#EB0028] shadow-[0_0_25px_rgba(235,0,40,0.35)] ring-1 ring-[#EB0028]/50"
                    : "bg-black/60 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
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

        {/* Main Interactive Stage Display Container (Two-column on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Cinematic Master Cocoon-to-Butterfly Transformation Visual Panel */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center w-full">
            <div className="relative w-full max-w-[560px] aspect-[16/10] rounded-3xl border border-white/10 bg-[#060606] backdrop-blur-2xl p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] group">
              
              {/* Corner Ambient Core Glow */}
              <div
                className="absolute inset-0 bg-radial-gradient pointer-events-none transition-all duration-700"
                style={{
                  background:
                    activeStageIdx >= 2
                      ? "radial-gradient(circle at 50% 50%, rgba(235,0,40,0.18) 0%, transparent 70%)"
                      : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
                }}
              />

              {/* Particle Canvas Overlay */}
              {!prefersReducedMotion && <ParticleCanvas activeStageIdx={activeStageIdx} />}

              {/* The Cinematic Metamorphosis Stage Visual */}
              <div className="relative w-full h-full flex items-center justify-center z-10 overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage.id}
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* Living Stage-Specific Animation Wrappers */}
                    {activeStageIdx === 0 && (
                      /* Phase 01: Diamond Crystalline Monolith */
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={currentStage.heroImage}
                          alt="Phase 01 — Idea Crystalline Structure"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] max-h-[300px]"
                        />
                      </motion.div>
                    )}

                    {activeStageIdx === 1 && (
                      /* Phase 02: Silk Cocoon Hanging from Twig */
                      <motion.div
                        animate={{ rotate: [-1.4, 1.4, -1.4] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transformOrigin: "50% 10%" }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={currentStage.heroImage}
                          alt="Phase 02 — Friction Silk Cocoon"
                          className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-h-[300px]"
                        />
                      </motion.div>
                    )}

                    {activeStageIdx === 2 && (
                      /* Phase 03: Internal Crimson Luminescence */
                      <motion.div
                        animate={{ scale: [1, 1.025, 1] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ opacity: [0.65, 1, 0.65] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className="w-48 h-48 rounded-full bg-[#EB0028]/25 blur-3xl" />
                        </motion.div>
                        <img
                          src={currentStage.heroImage}
                          alt="Phase 03 — Change Chrysalis Reconfiguration"
                          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(235,0,40,0.65)] max-h-[300px]"
                        />
                      </motion.div>
                    )}

                    {activeStageIdx === 3 && (
                      /* Phase 04: Butterfly Wing Emergence from Chrysalis */
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        {/* Swirling Orbital Ring */}
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                          className="absolute w-[260px] h-[260px] rounded-full border border-[#EB0028]/25 pointer-events-none"
                          style={{
                            boxShadow: "0 0 30px rgba(235,0,40,0.2)",
                          }}
                        />
                        <img
                          src={currentStage.heroImage}
                          alt="Phase 04 — Experiment Emergent Chrysalis"
                          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(235,0,40,0.7)] max-h-[300px]"
                        />
                      </motion.div>
                    )}

                    {activeStageIdx === 4 && (
                      /* Phase 05: Fully Formed Red & Black Butterfly in Flight */
                      <motion.div
                        animate={{
                          scaleX: [1, 0.9, 1],
                          y: [0, -7, 0],
                          rotate: [-0.6, 0.6, -0.6],
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={currentStage.heroImage}
                          alt="Phase 05 — Transformation Full Butterfly"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_45px_rgba(235,0,40,0.8)] max-h-[300px]"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* HUD Coordinates Label (Bottom-Left, exactly as in Reference Image) */}
              <div
                className="absolute bottom-4 left-5 text-[9px] font-mono text-white/40 uppercase tracking-widest z-20 flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                PHASE 0{activeStageIdx + 1} — {currentStage.name}
              </div>
            </div>
          </div>

          {/* Right: Stage Narrative, Title & Dynamic Metadata */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 text-[#EB0028] text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(235,0,40,0.2)]">
              <span>PHASE {currentStage.num}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/90">{currentStage.tagline}</span>
            </div>

            {/* Big Stage Name */}
            <h3
              className="text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold text-white tracking-tight uppercase leading-tight"
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 800,
                textShadow: "0 0 35px rgba(235,0,40,0.25)",
              }}
            >
              {currentStage.name}
            </h3>

            {/* Stage Description Narrative */}
            <p
              className="text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
            >
              {currentStage.description}
            </p>

            {/* Navigation Actions (NEXT PHASE >) */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-5">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer py-2"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <ChevronLeft className="w-4 h-4 text-white/50" />
                <span>PREV</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#EB0028] hover:text-[#ff2e54] transition-all cursor-pointer py-2 group"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <span>NEXT PHASE</span>
                <ChevronRight className="w-4 h-4 text-[#EB0028] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Row of 5 Phase Cards with Chevrons (Exactly as in Reference Image 2) */}
        <div className="pt-4 sm:pt-6">
          <div
            ref={cardRowRef}
            className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x"
          >
            {STAGES.map((st, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <div key={st.id} className="flex items-center gap-3 sm:gap-4 shrink-0">
                  {/* Phase Card */}
                  <div
                    onClick={() => setActiveStageIdx(idx)}
                    className="flex flex-col space-y-2 cursor-pointer group w-[150px] sm:w-[170px] md:w-[195px] lg:w-[210px] xl:w-[230px]"
                  >
                    <div
                      className={`relative aspect-[16/9] w-full rounded-2xl overflow-hidden border transition-all duration-300 bg-black/60 ${
                        isActive
                          ? "border-[#EB0028] shadow-[0_0_25px_rgba(235,0,40,0.45)] ring-1 ring-[#EB0028]/60 scale-[1.02]"
                          : "border-white/10 hover:border-white/30 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={st.cardImage}
                        alt={`${st.num} ${st.name} Preview`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isActive && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 border border-[#EB0028]/60 text-[8px] font-mono text-[#EB0028] font-bold uppercase tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-[#EB0028] animate-pulse" />
                          ACTIVE
                        </div>
                      )}
                    </div>

                    {/* Card Metadata (Number, Name & Concept) */}
                    <div className="text-center sm:text-left px-1 space-y-0.5">
                      <div
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                          isActive ? "text-[#EB0028]" : "text-white/80 group-hover:text-white"
                        }`}
                        style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                      >
                        {st.num} {st.name}
                      </div>
                      <div
                        className="text-[10px] sm:text-[11px] text-white/50 font-normal truncate"
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        {st.concept}
                      </div>
                    </div>
                  </div>

                  {/* Red Chevron separator connecting stages (hidden after the last stage) */}
                  {idx < STAGES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#EB0028] opacity-50 shrink-0 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
