"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Lock, ArrowUpRight, Sparkles } from "lucide-react";

interface Speaker { id: number; category: string; }

const SPEAKERS: Speaker[] = [
  { id: 1,  category: "Keynote Speaker" },
  { id: 2,  category: "Keynote Speaker" },
  { id: 3,  category: "Session Speaker" },
  { id: 4,  category: "Panelist" },
  { id: 5,  category: "Keynote Speaker" },
  { id: 6,  category: "Session Speaker" },
  { id: 7,  category: "Panelist" },
  { id: 8,  category: "Keynote Speaker" },
  { id: 9,  category: "Session Speaker" },
  { id: 10, category: "Panelist" },
  { id: 11, category: "Keynote Speaker" },
  { id: 12, category: "Session Speaker" },
];

const SHARDS = [
  { x: -38, y: -30, rot:  45, w: 7, h: 4, cr: true,  d: 0.00 },
  { x:  32, y: -42, rot: -30, w: 5, h: 5, cr: false, d: 0.04 },
  { x: -48, y:  14, rot: 120, w: 5, h: 4, cr: true,  d: 0.08 },
  { x:  44, y:  10, rot: -15, w: 4, h: 6, cr: false, d: 0.03 },
  { x: -20, y: -50, rot:  60, w: 5, h: 4, cr: true,  d: 0.10 },
  { x:  24, y: -48, rot: -45, w: 6, h: 3, cr: false, d: 0.06 },
  { x:  54, y: -18, rot:  30, w: 4, h: 5, cr: true,  d: 0.09 },
  { x: -40, y: -15, rot:  90, w: 5, h: 4, cr: false, d: 0.04 },
  { x:  15, y:  38, rot: -60, w: 5, h: 4, cr: true,  d: 0.07 },
  { x: -30, y:  32, rot:  75, w: 4, h: 4, cr: false, d: 0.11 },
  { x:  40, y:  26, rot: -90, w: 5, h: 4, cr: true,  d: 0.02 },
  { x: -10, y: -44, rot: 150, w: 3, h: 6, cr: false, d: 0.08 },
];

function SpeakerCard({ speaker, index, hoveredId, touchActiveId, onHoverChange, onTouchToggle }: {
  speaker: Speaker; index: number; hoveredId: number | null; touchActiveId: number | null;
  onHoverChange: (id: number | null) => void; onTouchToggle: (id: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mouseXY, setMouseXY] = useState({ x: 0.5, y: 0.5 });
  const isActive = hoveredId === speaker.id || touchActiveId === speaker.id;
  const rawX = useMotionValue(0); const rawY = useMotionValue(0);
  const xSpring = useSpring(rawX, { stiffness: 280, damping: 28 });
  const ySpring = useSpring(rawY, { stiffness: 280, damping: 28 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
    setMouseXY({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, [rawX, rawY, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    onHoverChange(null); rawX.set(0); rawY.set(0); setMouseXY({ x: 0.5, y: 0.5 });
  }, [rawX, rawY, onHoverChange]);

  const anyActive = hoveredId !== null || touchActiveId !== null;
  const dimOpacity = !anyActive ? 1 : isActive ? 1 : 0.84;
  const num = String(speaker.id).padStart(2, "0");
  const fx = isActive && !prefersReducedMotion;

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.93 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.65, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
      animate={{ opacity: dimOpacity }}
      onMouseEnter={() => onHoverChange(speaker.id)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}
      onClick={() => onTouchToggle(speaker.id)}
      style={prefersReducedMotion ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: "900px", zIndex: isActive ? 20 : 1 }}
      className="relative cursor-pointer select-none"
    >
      <div className="absolute overflow-hidden rounded-[25px] pointer-events-none" style={{ inset: "-1.5px", zIndex: 0 }}>
        <motion.div className="absolute"
          style={{ width: "200%", height: "200%", top: "-50%", left: "-50%",
            background: fx
              ? "conic-gradient(from 0deg,transparent 0%,transparent 56%,rgba(235,0,40,.07) 65%,rgba(235,0,40,.38) 73%,#EB0028 79%,rgba(255,120,120,.9) 83%,#EB0028 87%,rgba(235,0,40,.3) 93%,transparent 100%)"
              : "conic-gradient(from 0deg,transparent 0%,transparent 87%,rgba(235,0,40,.22) 93%,rgba(235,0,40,.07) 97%,transparent 100%)",
            transition: "background .55s ease" }}
          animate={{ rotate: [0, 360] }} transition={{ duration: fx ? 2.2 : 11, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        />
      </div>

      <div className="absolute overflow-hidden pointer-events-none"
        style={{ inset: "1.5px", borderRadius: "22px", background: "linear-gradient(148deg,#0a0a0a 0%,#060606 55%,#080808 100%)", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 60% at 50% 105%,rgba(235,0,40,.18) 0%,transparent 70%)", opacity: fx ? 1 : 0.38, transition: "opacity .55s ease" }} />
        <svg viewBox="0 0 280 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.065, pointerEvents: "none" }}>
          <line x1="0" y1="90" x2="280" y2="90" stroke="white" strokeWidth=".6" />
          <line x1="0" y1="200" x2="280" y2="200" stroke="white" strokeWidth=".6" />
          <line x1="0" y1="310" x2="280" y2="310" stroke="white" strokeWidth=".6" />
          <line x1="70" y1="0" x2="70" y2="400" stroke="white" strokeWidth=".6" />
          <line x1="210" y1="0" x2="210" y2="400" stroke="white" strokeWidth=".6" />
          <polygon points="140,22 256,84 262,196 206,308 74,314 18,202 24,92" stroke="rgba(235,0,40,.5)" fill="none" strokeWidth=".6" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle 135px at ${mouseXY.x * 100}% ${mouseXY.y * 100}%,rgba(235,0,40,.15),transparent 72%)`, opacity: fx ? 1 : 0, transition: "opacity .35s ease" }} />
        <motion.div className="absolute top-0 bottom-0"
          style={{ width: "55%", left: 0, background: "linear-gradient(110deg,transparent 24%,rgba(255,255,255,.046) 50%,rgba(235,0,40,.014) 56%,transparent 72%)" }}
          initial={{ x: "-100%" }} animate={{ x: fx ? "230%" : "-100%" }} transition={fx ? { duration: 0.88, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        />
      </div>

      <div className="relative flex flex-col justify-between" style={{ minHeight: "clamp(380px,44vw,440px)", zIndex: 10 }}>
        <div className="relative flex-grow flex items-end justify-center px-4 sm:px-5 pt-5 sm:pt-6" style={{ overflow: "visible" }}>
          <AnimatePresence>
            {fx && SHARDS.map((s, i) => (
              <motion.div key={i}
                style={{ position: "absolute", width: s.w, height: s.h, top: "50%", left: "50%",
                  background: s.cr ? "rgba(235,0,40,.88)" : "rgba(255,255,255,.68)", borderRadius: "1px",
                  transform: `rotate(${s.rot}deg)`, pointerEvents: "none", zIndex: 30 }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.9, 0.75, 0.55], x: s.x, y: s.y, scale: 1 }}
                exit={{ opacity: 0, x: s.x * 0.2, y: s.y * 0.2, scale: 0.2, transition: { duration: 0.55, ease: "easeIn" } }}
                transition={{ duration: 0.58, delay: s.d, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </AnimatePresence>

          <motion.div className="relative w-full"
            style={{ height: "clamp(170px,21vw,210px)", zIndex: 20 }}
            animate={{ y: fx ? -12 : 0, scale: fx ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 255, damping: 22 }}
          >
            <div className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden"
              style={{ background: fx ? "linear-gradient(148deg,rgba(235,0,40,.12),rgba(5,5,5,.96))" : "linear-gradient(148deg,rgba(255,255,255,.026),rgba(5,5,5,.92))",
                border: `1px solid ${fx ? "rgba(235,0,40,.38)" : "rgba(255,255,255,.05)"}`,
                boxShadow: fx ? "inset 0 0 36px rgba(235,0,40,.22),0 0 24px rgba(235,0,40,.15)" : "none", transition: "all .45s ease" }}>
              <motion.div animate={{ scale: fx ? 1.14 : 1 }} transition={{ duration: 0.4 }}
                style={{ width: 56, height: 56, borderRadius: 16, border: `1px solid ${fx ? "rgba(235,0,40,.6)" : "rgba(255,255,255,.1)"}`,
                  background: fx ? "rgba(235,0,40,.15)" : "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .4s ease" }}>
                <Lock style={{ width: 22, height: 22, color: fx ? "#EB0028" : "rgba(255,255,255,.35)", transition: "color .35s ease" }} />
              </motion.div>
              <div className="text-center space-y-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.3em] uppercase" style={{ color: fx ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.24)" }}>SPEAKER PROFILE</span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-bold" style={{ color: fx ? "#EB0028" : "rgba(235,0,40,.6)" }}>LOCKED • CONFIDENTIAL</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-4 sm:px-5 pb-5 pt-3 space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2.5">
            <motion.span animate={{ color: fx ? "#EB0028" : "rgba(255,255,255,.22)" }} transition={{ duration: 0.3 }}
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}>{num}</motion.span>
            <motion.div animate={{ width: fx ? 44 : 14, opacity: fx ? 1 : 0.28 }} transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1.5, background: "#EB0028", borderRadius: 1 }} />
          </div>
          <span style={{ display: "inline-block", fontFamily: "var(--font-dm-mono)", fontSize: "9px", letterSpacing: "0.22em",
            textTransform: "uppercase", fontWeight: 600, color: "#EB0028", background: "rgba(235,0,40,.1)",
            border: "1px solid rgba(235,0,40,.25)", padding: "3px 10px", borderRadius: 6 }}>{speaker.category}</span>
          <motion.h3 animate={{ opacity: fx ? 1 : 0.8, y: fx ? 0 : 2, color: fx ? "#FFFFFF" : "rgba(255,255,255,.8)" }} transition={{ duration: 0.35 }}
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
            COMING SOON
          </motion.h3>
          <motion.p animate={{ opacity: fx ? 0.75 : 0.45, y: fx ? 0 : 2 }} transition={{ duration: 0.35, delay: 0.05 }}
            style={{ fontFamily: "var(--font-manrope)", fontSize: "0.72rem", color: "rgba(255,255,255,.65)", lineHeight: 1.55 }}>
            Speaker profile & abstract to be revealed
          </motion.p>
          <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <motion.span animate={{ opacity: fx ? 1 : 0.6, x: fx ? 0 : -3 }} transition={{ duration: 0.3, delay: 0.1 }}
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, color: fx ? "#EB0028" : "rgba(235,0,40,.7)", display: "flex", alignItems: "center", gap: 5 }}>
              <Sparkles style={{ width: 11, height: 11 }} />REVEAL SOON
            </motion.span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${fx ? "rgba(235,0,40,.5)" : "rgba(255,255,255,.1)"}`,
              background: fx ? "rgba(235,0,40,.12)" : "rgba(255,255,255,.02)", display: "flex", alignItems: "center", justifyContent: "center",
              color: fx ? "#EB0028" : "rgba(255,255,255,.4)", transition: "all .3s ease", flexShrink: 0 }}>
              <ArrowUpRight style={{ width: 13, height: 13 }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const [hoveredId,     setHoveredId]     = useState<number | null>(null);
  const [touchActiveId, setTouchActiveId] = useState<number | null>(null);

  const handleTouchToggle = (id: number) => {
    setTouchActiveId((prev) => (prev === id ? null : id));
    setHoveredId(null);
  };

  return (
    <section id="speakers" className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.3),transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.18),transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1440px]"
          style={{ height: 720, background: "radial-gradient(ellipse at center,rgba(235,0,40,.07) 0%,transparent 70%)" }} />
      </div>
      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(2.5rem,5vw,4.5rem)] relative z-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-center sm:text-left">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}>
            Voices of<br /><span className="text-[#EB0028]">Transformation</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed mx-auto sm:mx-0" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
            Twelve curated catalysts sharing breakthrough ideas at the intersection of technology, design, and human potential.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(1rem,2vw,1.5rem)] pt-2">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={idx} hoveredId={hoveredId}
              touchActiveId={touchActiveId} onHoverChange={setHoveredId} onTouchToggle={handleTouchToggle} />
          ))}
        </div>
      </div>
    </section>
  );
}
