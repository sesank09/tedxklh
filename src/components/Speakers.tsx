"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Lock, ArrowUpRight, Sparkles, X, ChevronLeft, ChevronRight, Quote, Award, CheckCircle2 } from "lucide-react";

interface Speaker {
  id: number;
  category?: string;
  name?: string;
  role?: string;
  details?: string;
  quote?: string;
  tags?: string[];
  image?: string;
  cardImage?: string;
  isAnnounced?: boolean;
}

const SPEAKERS: Speaker[] = [
  {
    id: 1,
    isAnnounced: true,
    name: "Sri Charan Lakkaraju",
    role: "Founder & CEO, Student Tribe",
    details:
      "Founder & CEO, Student Tribe. Sri Charan Lakkaraju is an entrepreneur and youth-focused community builder who has spent over 15 years building platforms that connect students with opportunities, communities, skills, and careers. Through Student Tribe, he works to bridge the opportunity gap for students from Tier 2 and Tier 3 colleges across India, empowering them to discover their potential and build meaningful careers.",
    quote: "Empowering students across Tier 2 and Tier 3 colleges to discover their potential and build meaningful careers.",
    tags: ["Youth Empowerment", "Student Tribe", "15+ Years Impact", "EdTech Visionary"],
    image: "/speakers/sri-charan-lakkaraju.jpg",
    cardImage: "/speakers/sri-charan-lakkaraju-card.jpg",
  },
  {
    id: 2,
    isAnnounced: true,
    name: "Phani Gogireddy",
    role: "Founder & CEO, 24 Frames",
    details:
      "Founder & CEO, 24 Frames. Phani Gogireddy is a filmmaker, Director of Photography, and entrepreneur who transformed his passion for visual storytelling into 24 Frames, a recognised luxury wedding photography and cinematography brand in South India. Starting in 2016 with a single camera and two computers, he built a thriving creative enterprise. As an Official Nikon India Influencer, PPIN National Advisor, and APPVWA Advisor, his journey reflects creativity, perseverance, and entrepreneurial ambition.",
    quote: "From a single camera and two computers to redefining luxury visual storytelling across South India.",
    tags: ["Visual Storytelling", "24 Frames", "Nikon Influencer", "Cinematography"],
    image: "/speakers/phani-gogireddy.jpg",
    cardImage: "/speakers/phani-gogireddy-card.jpg",
  },
  {
    id: 3,
    isAnnounced: true,
    name: "Dr. Vikrant Singh Thakur",
    role: "Neurologist & Founder, TIME Neurocare",
    details:
      "Neurologist & Founder, TIME Neurocare. Dr. Vikrant Singh Thakur is a neurologist dedicated to advancing healthcare and making quality medical services accessible to all. Based in Karimnagar, Telangana, he works to bring advanced neurological care closer to communities beyond major cities. Through TIME Neurocare, he combines medical expertise with a commitment to patient well-being, health awareness, and social responsibility, striving to make a meaningful difference in the lives of patients and their families.",
    quote: "Bringing advanced neurological care and social responsibility to communities beyond metropolitan borders.",
    tags: ["Neurology", "TIME Neurocare", "Healthcare Access", "Patient Advocacy"],
    image: "/speakers/dr-vikrant-singh-thakur.jpg",
    cardImage: "/speakers/dr-vikrant-singh-thakur-card.jpg",
  },
  { id: 4,  isAnnounced: false },
  { id: 5,  isAnnounced: false },
  { id: 6,  isAnnounced: false },
  { id: 7,  isAnnounced: false },
  { id: 8,  isAnnounced: false },
  { id: 9,  isAnnounced: false },
  { id: 10, isAnnounced: false },
  { id: 11, isAnnounced: false },
  { id: 12, isAnnounced: false },
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

function SpeakerModal({
  speaker,
  onClose,
  onNavigate,
}: {
  speaker: Speaker;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) onNavigate("prev");
      if (e.key === "ArrowRight" && onNavigate) onNavigate("next");
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, onNavigate]);

  const num = String(speaker.id).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(235,0,40,0.18) 0%, rgba(235,0,40,0.04) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,80,80,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Modal Dialog Card */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 32 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-auto rounded-[28px] overflow-hidden select-text"
        style={{
          background: "linear-gradient(155deg, #111111 0%, #080808 55%, #050505 100%)",
          border: "1px solid rgba(235,0,40,0.35)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.85), 0 0 50px rgba(235,0,40,0.22), inset 0 0 40px rgba(235,0,40,0.06)",
        }}
      >
        {/* Animated Laser Border Sweep */}
        <div className="absolute overflow-hidden rounded-[28px] pointer-events-none" style={{ inset: "-1px", zIndex: 0 }}>
          <motion.div
            className="absolute"
            style={{
              width: "200%",
              height: "200%",
              top: "-50%",
              left: "-50%",
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(235,0,40,0.15) 72%, #EB0028 82%, rgba(255,160,160,0.95) 86%, #EB0028 90%, rgba(235,0,40,0.25) 95%, transparent 100%)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Inner background shell */}
        <div
          className="absolute inset-[1.5px] rounded-[26.5px] pointer-events-none"
          style={{
            background: "linear-gradient(155deg, rgba(18,18,18,0.98) 0%, rgba(8,8,8,0.98) 60%, rgba(5,5,5,0.99) 100%)",
            zIndex: 1,
          }}
        >
          {/* Subtle tech grid lines */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="xMidYMid slice">
            <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="1" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="1" />
            <line x1="0" y1="300" x2="400" y2="300" stroke="white" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="400" stroke="white" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close speaker spotlight"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
          }}
        >
          <X className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_18px_rgba(235,0,40,0.6)]" />
        </button>

        {/* Modal Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-7 md:p-9 max-h-[88vh] overflow-y-auto">
          {/* Left Column: Full Poster */}
          <div className="md:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative w-full max-w-[320px] md:max-w-none rounded-2xl overflow-hidden group shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(235,0,40,0.2)]"
              style={{
                border: "1px solid rgba(235,0,40,0.4)",
                aspectRatio: "819 / 1024",
                background: "#080808",
              }}
            >
              <img
                src={speaker.image || speaker.cardImage}
                alt={speaker.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)",
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono tracking-wider uppercase px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white/80">
                <span className="flex items-center gap-1.5 text-[#EB0028] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                  TEDxKLH 2026
                </span>
                <span className="text-white/50">CONFIRMED SPEAKER</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Speaker Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-4">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    background: "#EB0028",
                    padding: "4px 12px",
                    borderRadius: 8,
                    boxShadow: "0 0 16px rgba(235,0,40,0.45)",
                  }}
                >
                  TEDx SPEAKER
                </span>

                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "4px 10px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 text-[#EB0028]" />
                  SPEAKER {num}
                </span>
              </div>

              {/* Speaker Name */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase"
                style={{
                  fontFamily: "var(--font-sora)",
                  textShadow: "0 0 30px rgba(235,0,40,0.3)",
                }}
              >
                {speaker.name}
              </motion.h3>

              {/* Role & Designation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#EB0028]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                <Award className="w-4 h-4 flex-shrink-0" />
                <span>{speaker.role}</span>
              </motion.div>

              {/* Animated Accent Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #EB0028 0%, rgba(235,0,40,0.4) 50%, transparent 100%)",
                }}
              />

              {/* Highlight Quote */}
              {speaker.quote && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="relative p-3.5 sm:p-4 rounded-xl border border-white/10"
                  style={{
                    background: "rgba(235,0,40,0.06)",
                    borderLeft: "3px solid #EB0028",
                  }}
                >
                  <Quote className="w-4 h-4 text-[#EB0028] mb-1.5 opacity-80" />
                  <p
                    className="text-xs sm:text-sm text-white/90 italic font-medium leading-relaxed"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    "{speaker.quote}"
                  </p>
                </motion.div>
              )}

              {/* Full Details Bio */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="space-y-2 pt-1"
              >
                <span
                  className="block text-[10px] tracking-[0.2em] uppercase font-bold text-white/40"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Biography & Overview
                </span>
                <p
                  className="text-xs sm:text-sm text-white/80 leading-relaxed sm:leading-loose font-normal"
                  style={{ fontFamily: "var(--font-manrope)", lineHeight: 1.7 }}
                >
                  {speaker.details}
                </p>
              </motion.div>

              {/* Tags */}
              {speaker.tags && speaker.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex flex-wrap gap-1.5 pt-2"
                >
                  {speaker.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider text-white/70 bg-white/[0.04] border border-white/[0.08]"
                    >
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom Actions & Speaker Pagination */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              {onNavigate && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate("prev")}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    onClick={() => onNavigate("next")}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#EB0028] hover:bg-[#ff1a3d] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(235,0,40,0.4)] hover:shadow-[0_0_30px_rgba(235,0,40,0.7)] cursor-pointer ml-auto"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SpeakerCard({
  speaker,
  index,
  hoveredId,
  touchActiveId,
  onHoverChange,
  onTouchToggle,
  onOpenDetails,
}: {
  speaker: Speaker;
  index: number;
  hoveredId: number | null;
  touchActiveId: number | null;
  onHoverChange: (id: number | null) => void;
  onTouchToggle: (id: number) => void;
  onOpenDetails: (speaker: Speaker) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mouseXY, setMouseXY] = useState({ x: 0.5, y: 0.5 });
  const isActive = hoveredId === speaker.id || touchActiveId === speaker.id;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const xSpring = useSpring(rawX, { stiffness: 280, damping: 28 });
  const ySpring = useSpring(rawY, { stiffness: 280, damping: 28 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || prefersReducedMotion) return;
      const r = cardRef.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
      setMouseXY({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    },
    [rawX, rawY, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    onHoverChange(null);
    rawX.set(0);
    rawY.set(0);
    setMouseXY({ x: 0.5, y: 0.5 });
  }, [rawX, rawY, onHoverChange]);

  const anyActive = hoveredId !== null || touchActiveId !== null;
  const dimOpacity = !anyActive ? 1 : isActive ? 1 : 0.82;
  const num = String(speaker.id).padStart(2, "0");
  const fx = isActive && !prefersReducedMotion;

  const handleClick = () => {
    if (speaker.isAnnounced) {
      onOpenDetails(speaker);
    } else {
      onTouchToggle(speaker.id);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.65, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
      animate={{ opacity: dimOpacity }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => onHoverChange(speaker.id)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={
        prefersReducedMotion
          ? {}
          : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: "900px", zIndex: isActive ? 20 : 1 }
      }
      className="relative cursor-pointer select-none group max-w-[340px] sm:max-w-none mx-auto w-full"
    >
      {/* Animated Conic Laser Border */}
      <div className="absolute overflow-hidden rounded-[25px] pointer-events-none" style={{ inset: "-1.5px", zIndex: 0 }}>
        <motion.div
          className="absolute"
          style={{
            width: "200%",
            height: "200%",
            top: "-50%",
            left: "-50%",
            background: fx
              ? "conic-gradient(from 0deg,transparent 0%,transparent 54%,rgba(235,0,40,.08) 64%,rgba(235,0,40,.42) 72%,#EB0028 79%,rgba(255,140,140,.95) 83%,#EB0028 87%,rgba(235,0,40,.35) 93%,transparent 100%)"
              : "conic-gradient(from 0deg,transparent 0%,transparent 87%,rgba(235,0,40,.22) 93%,rgba(235,0,40,.07) 97%,transparent 100%)",
            transition: "background .55s ease",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: fx ? 2.2 : 11, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        />
      </div>

      {/* Card Dark Shell */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          inset: "1.5px",
          borderRadius: "22px",
          background: "linear-gradient(148deg,#0c0c0c 0%,#060606 55%,#080808 100%)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 90% 60% at 50% 105%,rgba(235,0,40,.22) 0%,transparent 70%)",
            opacity: fx ? 1 : 0.4,
            transition: "opacity .55s ease",
          }}
        />
        <svg viewBox="0 0 280 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.065, pointerEvents: "none" }}>
          <line x1="0" y1="90" x2="280" y2="90" stroke="white" strokeWidth=".6" />
          <line x1="0" y1="200" x2="280" y2="200" stroke="white" strokeWidth=".6" />
          <line x1="0" y1="310" x2="280" y2="310" stroke="white" strokeWidth=".6" />
          <line x1="70" y1="0" x2="70" y2="400" stroke="white" strokeWidth=".6" />
          <line x1="210" y1="0" x2="210" y2="400" stroke="white" strokeWidth=".6" />
          <polygon points="140,22 256,84 262,196 206,308 74,314 18,202 24,92" stroke="rgba(235,0,40,.5)" fill="none" strokeWidth=".6" />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle 140px at ${mouseXY.x * 100}% ${mouseXY.y * 100}%,rgba(235,0,40,.18),transparent 72%)`,
            opacity: fx ? 1 : 0,
            transition: "opacity .35s ease",
          }}
        />
        <motion.div
          className="absolute top-0 bottom-0"
          style={{ width: "55%", left: 0, background: "linear-gradient(110deg,transparent 24%,rgba(255,255,255,.05) 50%,rgba(235,0,40,.02) 56%,transparent 72%)" }}
          initial={{ x: "-100%" }}
          animate={{ x: fx ? "230%" : "-100%" }}
          transition={fx ? { duration: 0.88, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        />
      </div>

      {/* Card Content */}
      <div className="relative flex flex-col justify-between" style={{ minHeight: "clamp(430px,48vw,470px)", zIndex: 10 }}>
        {/* Top Media Container */}
        <div className="relative flex-grow flex items-end justify-center px-4 sm:px-5 pt-5 sm:pt-6" style={{ overflow: "visible" }}>
          {/* Floating Kinetic Shards */}
          <AnimatePresence>
            {fx &&
              SHARDS.map((s, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: s.w,
                    height: s.h,
                    top: "50%",
                    left: "50%",
                    background: s.cr ? "rgba(235,0,40,.88)" : "rgba(255,255,255,.68)",
                    borderRadius: "1px",
                    transform: `rotate(${s.rot}deg)`,
                    pointerEvents: "none",
                    zIndex: 30,
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 0.9, 0.75, 0.55], x: s.x, y: s.y, scale: 1 }}
                  exit={{ opacity: 0, x: s.x * 0.2, y: s.y * 0.2, scale: 0.2, transition: { duration: 0.55, ease: "easeIn" } }}
                  transition={{ duration: 0.58, delay: s.d, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
          </AnimatePresence>

          <motion.div
            className="relative w-full h-[250px] xs:h-[260px] sm:h-[205px] md:h-[215px] lg:h-[230px]"
            animate={{ y: fx ? -10 : 0, scale: fx ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {speaker.isAnnounced ? (
              /* ANNOUNCED SPEAKER PORTRAIT */
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
                style={{
                  border: `1px solid ${fx ? "rgba(235,0,40,0.6)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: fx
                    ? "0 12px 35px rgba(235,0,40,0.35), inset 0 0 25px rgba(235,0,40,0.2)"
                    : "0 8px 24px rgba(0,0,0,0.7)",
                }}
              >
                <img
                  src={speaker.cardImage || speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    objectPosition: "center 10%",
                    transform: fx ? "scale(1.08)" : "scale(1)",
                    filter: fx ? "brightness(1.06) contrast(1.04)" : "brightness(0.95)",
                  }}
                />
                {/* Vignette overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.15) 45%, transparent 100%)",
                  }}
                />
                {/* Top Corner Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-[#EB0028]/40 text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                  CONFIRMED
                </div>
              </div>
            ) : (
              /* LOCKED CONFIDENTIAL TEASER */
              <div
                className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden"
                style={{
                  background: fx
                    ? "linear-gradient(148deg,rgba(235,0,40,.12),rgba(5,5,5,.96))"
                    : "linear-gradient(148deg,rgba(255,255,255,.026),rgba(5,5,5,.92))",
                  border: `1px solid ${fx ? "rgba(235,0,40,.38)" : "rgba(255,255,255,.05)"}`,
                  boxShadow: fx ? "inset 0 0 36px rgba(235,0,40,.22),0 0 24px rgba(235,0,40,.15)" : "none",
                  transition: "all .45s ease",
                }}
              >
                <motion.div
                  animate={{ scale: fx ? 1.14 : 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    border: `1px solid ${fx ? "rgba(235,0,40,.6)" : "rgba(255,255,255,.1)"}`,
                    background: fx ? "rgba(235,0,40,.15)" : "rgba(0,0,0,.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .4s ease",
                  }}
                >
                  <Lock style={{ width: 22, height: 22, color: fx ? "#EB0028" : "rgba(255,255,255,.35)", transition: "color .35s ease" }} />
                </motion.div>
                <div className="text-center space-y-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  <span className="block text-[8px] sm:text-[9px] tracking-[0.3em] uppercase" style={{ color: fx ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.24)" }}>
                    SPEAKER PROFILE
                  </span>
                  <span className="block text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-bold" style={{ color: fx ? "#EB0028" : "rgba(235,0,40,.6)" }}>
                    LOCKED • CONFIDENTIAL
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Details Section */}
        <div className="px-4 sm:px-5 pb-5 pt-3 space-y-2.5 sm:space-y-3">
          {/* Index & Line */}
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ color: fx ? "#EB0028" : "rgba(255,255,255,.3)" }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}
            >
              {num}
            </motion.span>
            <motion.div
              animate={{ width: fx ? 44 : 14, opacity: fx ? 1 : 0.28 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1.5, background: "#EB0028", borderRadius: 1 }}
            />
          </div>

          {speaker.isAnnounced ? (
            /* ANNOUNCED SPEAKER NAME & ROLE */
            <>
              <motion.h3
                animate={{ opacity: fx ? 1 : 0.95, color: fx ? "#FFFFFF" : "rgba(255,255,255,0.95)" }}
                transition={{ duration: 0.35 }}
                className="font-bold text-base sm:text-lg tracking-tight uppercase leading-snug line-clamp-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {speaker.name}
              </motion.h3>

              <motion.p
                animate={{ opacity: fx ? 0.9 : 0.65 }}
                transition={{ duration: 0.35 }}
                className="text-xs text-white/70 font-medium line-clamp-1"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {speaker.role}
              </motion.p>

              {/* Action Bar */}
              <div
                style={{
                  paddingTop: 8,
                  borderTop: "1px solid rgba(255,255,255,.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <motion.span
                  animate={{ opacity: fx ? 1 : 0.8, x: fx ? 2 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: fx ? "#EB0028" : "rgba(255,255,255,0.75)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-[#EB0028]" />
                  CLICK FOR DETAILS
                </motion.span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: `1px solid ${fx ? "#EB0028" : "rgba(255,255,255,.12)"}`,
                    background: fx ? "rgba(235,0,40,.2)" : "rgba(255,255,255,.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: fx ? "#EB0028" : "rgba(255,255,255,.6)",
                    transition: "all .3s ease",
                    boxShadow: fx ? "0 0 15px rgba(235,0,40,0.5)" : "none",
                  }}
                >
                  <ArrowUpRight style={{ width: 14, height: 14 }} />
                </div>
              </div>
            </>
          ) : (
            /* LOCKED COMING SOON TEASER */
            <>
              <motion.h3
                animate={{ opacity: fx ? 1 : 0.8, y: fx ? 0 : 2, color: fx ? "#FFFFFF" : "rgba(255,255,255,.8)" }}
                transition={{ duration: 0.35 }}
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.01em" }}
              >
                COMING SOON
              </motion.h3>
              <motion.p
                animate={{ opacity: fx ? 0.75 : 0.45, y: fx ? 0 : 2 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                style={{ fontFamily: "var(--font-manrope)", fontSize: "0.72rem", color: "rgba(255,255,255,.65)", lineHeight: 1.55 }}
              >
                Speaker profile & abstract to be revealed
              </motion.p>
              <div
                style={{
                  paddingTop: 8,
                  borderTop: "1px solid rgba(255,255,255,.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <motion.span
                  animate={{ opacity: fx ? 1 : 0.6, x: fx ? 0 : -3 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: fx ? "#EB0028" : "rgba(235,0,40,.7)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Sparkles style={{ width: 11, height: 11 }} />
                  REVEAL SOON
                </motion.span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: `1px solid ${fx ? "rgba(235,0,40,.5)" : "rgba(255,255,255,.1)"}`,
                    background: fx ? "rgba(235,0,40,.12)" : "rgba(255,255,255,.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: fx ? "#EB0028" : "rgba(255,255,255,.4)",
                    transition: "all .3s ease",
                    flexShrink: 0,
                  }}
                >
                  <ArrowUpRight style={{ width: 13, height: 13 }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [touchActiveId, setTouchActiveId] = useState<number | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const handleTouchToggle = (id: number) => {
    setTouchActiveId((prev) => (prev === id ? null : id));
    setHoveredId(null);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedSpeaker) return;
    const announcedSpeakers = SPEAKERS.filter((s) => s.isAnnounced);
    const currentIndex = announcedSpeakers.findIndex((s) => s.id === selectedSpeaker.id);
    if (currentIndex === -1) return;

    if (direction === "prev") {
      const prevIdx = (currentIndex - 1 + announcedSpeakers.length) % announcedSpeakers.length;
      setSelectedSpeaker(announcedSpeakers[prevIdx]);
    } else {
      const nextIdx = (currentIndex + 1) % announcedSpeakers.length;
      setSelectedSpeaker(announcedSpeakers[nextIdx]);
    }
  };

  return (
    <section id="speakers" className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.3),transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.18),transparent)" }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1440px]"
          style={{ height: 720, background: "radial-gradient(ellipse at center,rgba(235,0,40,.07) 0%,transparent 70%)" }}
        />
      </div>

      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(2.5rem,5vw,4.5rem)] relative z-20">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-center sm:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold text-white tracking-tight uppercase leading-[1.05]"
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
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed mx-auto sm:mx-0"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Curated catalysts sharing breakthrough ideas at the intersection of technology, design, and human potential. Click on any confirmed speaker to view their complete journey.
          </motion.p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(1rem,2vw,1.5rem)] pt-2">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              index={idx}
              hoveredId={hoveredId}
              touchActiveId={touchActiveId}
              onHoverChange={setHoveredId}
              onTouchToggle={handleTouchToggle}
              onOpenDetails={setSelectedSpeaker}
            />
          ))}
        </div>
      </div>

      {/* CRAZY SMOOTH SPOTLIGHT MODAL */}
      <AnimatePresence>
        {selectedSpeaker && (
          <SpeakerModal
            speaker={selectedSpeaker}
            onClose={() => setSelectedSpeaker(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
