"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";

const DEPARTMENTS = ["All", "Leadership", "Curation", "Production", "Design", "Operations"] as const;

interface TeamMember { id: string; role: string; department: typeof DEPARTMENTS[number]; code: string; }

const TEAM_MEMBERS: TeamMember[] = [
  { id: "lead-01",     role: "Lead Organizer & Licensee",           department: "Leadership",  code: "DIR-01" },
  { id: "lead-02",     role: "Co-Organizer & Executive Director",   department: "Leadership",  code: "DIR-02" },
  { id: "curation-01", role: "Head of Speaker Curation",            department: "Curation",    code: "CUR-01" },
  { id: "design-01",   role: "Creative Director & Visual Lead",     department: "Design",      code: "DSN-01" },
  { id: "prod-01",     role: "Technical & Production Director",     department: "Production",  code: "PRD-01" },
  { id: "ops-01",      role: "Head of Marketing & Outreach",        department: "Operations",  code: "OPS-01" },
  { id: "prod-02",     role: "Digital Experience & Systems Lead",   department: "Production",  code: "PRD-02" },
  { id: "ops-02",      role: "Head of Logistics & Partnerships",    department: "Operations",  code: "OPS-02" },
];

const CRYSTAL_POINTS = "62,6 104,26 122,70 108,114 66,130 22,110 4,66 18,22";

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const rawX = useMotionValue(0); const rawY = useMotionValue(0);
  const xSpring = useSpring(rawX, { stiffness: 350, damping: 35 });
  const ySpring = useSpring(rawY, { stiffness: 350, damping: 35 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, [rawX, rawY, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false); rawX.set(0); rawY.set(0);
  }, [rawX, rawY]);

  const fx = isHovered && !prefersReducedMotion;

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, scale: 0.82, rotate: -4, y: 28 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.34, 1.4, 0.64, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={prefersReducedMotion ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px", zIndex: fx ? 10 : 1 }}
      className="relative cursor-pointer select-none"
    >
      {/* Animated border */}
      <div className="absolute overflow-hidden rounded-[21px] pointer-events-none" style={{ inset: "-1px", zIndex: 0 }}>
        <motion.div className="absolute"
          style={{ width: "200%", height: "200%", top: "-50%", left: "-50%",
            background: fx
              ? "conic-gradient(from 0deg,transparent 0%,transparent 68%,rgba(235,0,40,.1) 76%,rgba(235,0,40,.5) 82%,#EB0028 86%,rgba(235,0,40,.4) 91%,transparent 100%)"
              : "conic-gradient(from 0deg,transparent 0%,transparent 90%,rgba(235,0,40,.18) 95%,transparent 100%)",
            transition: "background .5s ease" }}
          animate={{ rotate: [0, 360] }} transition={{ duration: fx ? 4 : 14, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        />
      </div>

      {/* Background shell */}
      <div className="absolute overflow-hidden pointer-events-none"
        style={{ inset: "1px", borderRadius: "19px",
          background: fx ? "linear-gradient(148deg,rgba(235,0,40,.07) 0%,#060606 40%,#080808 100%)" : "linear-gradient(148deg,rgba(255,255,255,.025) 0%,#070707 50%,#060606 100%)",
          transition: "background .5s ease", zIndex: 1 }}>
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", width: "75%", height: "65%",
          background: "radial-gradient(circle,rgba(235,0,40,.2) 0%,transparent 70%)", opacity: fx ? 1 : 0, transition: "opacity .5s ease" }} />
        <svg viewBox="0 0 200 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.055, pointerEvents: "none" }}>
          <line x1="0" y1="80" x2="200" y2="80" stroke="white" strokeWidth=".5" />
          <line x1="0" y1="160" x2="200" y2="160" stroke="white" strokeWidth=".5" />
          <line x1="100" y1="0" x2="100" y2="260" stroke="white" strokeWidth=".5" />
          <circle cx="100" cy="80" r="60" stroke="rgba(235,0,40,.6)" fill="none" strokeWidth=".5" />
        </svg>
        <motion.div className="absolute top-0 bottom-0"
          style={{ width: "55%", left: 0, background: "linear-gradient(110deg,transparent 25%,rgba(255,255,255,.04) 50%,transparent 70%)" }}
          initial={{ x: "-100%" }} animate={{ x: fx ? "200%" : "-100%" }} transition={fx ? { duration: 0.75, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col" style={{ minHeight: "300px", zIndex: 10 }}>
        <div className="flex-grow flex items-end justify-center px-5 pt-5" style={{ overflow: "visible" }}>
          <motion.div className="relative" style={{ width: "100%", maxWidth: "155px", zIndex: 20 }}
            animate={{ y: fx ? -10 : 0, scale: fx ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>

            {/* Rotating crystalline frame */}
            <motion.svg viewBox="0 0 136 136" className="absolute pointer-events-none"
              style={{ inset: "-18px", width: "calc(100% + 36px)", height: "calc(100% + 36px)", zIndex: 25, opacity: fx ? 1 : 0, transition: "opacity .4s ease" }}>
              <motion.polygon points={CRYSTAL_POINTS} fill="none" stroke="rgba(235,0,40,.75)" strokeWidth="1" strokeDasharray="5 4"
                animate={{ rotate: fx ? [0, 360] : 0 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "68px 68px" }} />
              <motion.polygon points={CRYSTAL_POINTS} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="0.5"
                animate={{ rotate: fx ? [0, -360] : 0 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "68px 68px" }} />
            </motion.svg>

            {/* Portrait */}
            <div className="relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2.5 overflow-hidden"
              style={{ background: fx ? "radial-gradient(circle at center,rgba(235,0,40,.14) 0%,rgba(10,10,10,.96) 70%)" : "linear-gradient(148deg,rgba(255,255,255,.03) 0%,rgba(10,10,10,.96) 100%)",
                border: `1px solid ${fx ? "rgba(235,0,40,.38)" : "rgba(255,255,255,.06)"}`,
                boxShadow: fx ? "0 12px 40px rgba(235,0,40,.28),0 0 0 1px rgba(235,0,40,.1)" : "0 8px 20px rgba(0,0,0,.6)",
                transition: "all .4s ease" }}>
              <Users style={{ width: 28, height: 28, color: fx ? "#EB0028" : "rgba(255,255,255,.2)", transition: "color .35s ease" }} />
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
                color: fx ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.2)", transition: "color .35s ease" }}>PHOTO</span>
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: fx ? "inset 0 0 28px rgba(235,0,40,.32)" : "none", transition: "box-shadow .4s ease" }} />
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-5 pt-4 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span style={{ display: "inline-block", fontFamily: "var(--font-dm-mono)", fontSize: "8px", letterSpacing: "0.22em",
              textTransform: "uppercase", fontWeight: 600, color: "#EB0028", background: "rgba(235,0,40,.1)",
              border: "1px solid rgba(235,0,40,.22)", padding: "2.5px 8px", borderRadius: 5 }}>{member.department}</span>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(255,255,255,.25)", letterSpacing: "0.1em" }}>{member.code}</span>
          </div>
          <motion.p animate={{ opacity: fx ? 1 : 0.55, y: fx ? 0 : 3 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: "0.84rem", color: fx ? "#FFFFFF" : "rgba(255,255,255,.55)",
              textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{member.role}</motion.p>
          <div className="flex justify-center">
            <motion.div animate={{ width: fx ? 38 : 12, opacity: fx ? 1 : 0.3 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1.5, background: "#EB0028", borderRadius: 1 }} />
          </div>
          <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(255,255,255,.25)", letterSpacing: "0.12em" }}>TEDxKLH 2026</span>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(235,0,40,.5)" }}>// CONFIRMED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const [activeDept, setActiveDept] = useState<typeof DEPARTMENTS[number]>("All");
  const filteredMembers = activeDept === "All" ? TEAM_MEMBERS : TEAM_MEMBERS.filter((m) => m.department === activeDept);

  return (
    <section id="team" className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px]"
          style={{ height: 650, background: "radial-gradient(ellipse at center,rgba(235,0,40,.05),transparent 70%)" }} />
      </div>
      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center sm:justify-start gap-3">
            <span className="text-xs font-medium tracking-[0.25em] text-[#EB0028] uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>CHAPTER 05 // THE ORGANIZERS</span>
            <span className="h-px w-8 bg-[#EB0028]/40" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}>
            The Minds Behind<br /><span className="text-[#EB0028]">Metamorphosis</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
            The dedicated team of student organizers, curators, and technologists bringing TEDxKLH 2026 to life.
          </motion.p>
        </div>

        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-none">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button key={dept} onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  isActive ? "bg-[#EB0028] border-[#EB0028] text-white shadow-[0_0_20px_rgba(235,0,40,0.4)] font-bold" : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                }`} style={{ fontFamily: "var(--font-dm-mono)" }}>
                {dept}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <TeamCard key={member.id} member={member} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
