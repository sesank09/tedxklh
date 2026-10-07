"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Smoothly fade out all hero text within first 140px of scroll, strictly clamped to avoid negative overscroll glitches
  const heroOpacity = useTransform(scrollY, [0, 140], [1, 0], { clamp: true });
  const heroY = useTransform(scrollY, [0, 140], [0, -20], { clamp: true });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-11-04T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] min-h-[100dvh] w-full flex flex-col justify-between items-center pt-16 sm:pt-24 pb-4 sm:pb-8 px-3 sm:px-6 select-none overflow-hidden pointer-events-none"
    >
      {/* Center zone reserved for the 3D Butterfly */}
      <div className="w-full flex-grow min-h-[22vh] sm:min-h-[30vh]" />

      {/* Bottom Area: TEDxKLH Brand + Live Countdown + Scroll Cue */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="w-full max-w-[1440px] mx-auto text-center z-20 pb-2 sm:pb-6 flex flex-col items-center gap-2.5 sm:gap-4 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col items-center justify-center select-none text-center">
            <h1
              className="text-[clamp(2.4rem,8.2vw,7.5rem)] font-extrabold tracking-tight flex items-baseline justify-center select-none"
              style={{ 
                fontFamily: "var(--font-sora)", 
                fontWeight: 800,
                letterSpacing: "-0.03em",
                textTransform: "none",
                lineHeight: 1,
              }}
            >
              {/* Official Red TEDx with superscript 'x' at top-right of 'D' */}
              <span className="text-[#EB0028] inline-flex items-start">
                <span className="leading-none">TED</span>
                <span
                  className="text-[#EB0028] font-black inline-block leading-none"
                  style={{
                    fontSize: "0.44em",
                    fontWeight: 800,
                    transform: "translateY(0.06em)",
                    marginLeft: "0.04em",
                    marginRight: "0.12em",
                  }}
                >
                  x
                </span>
              </span>
              <span className="text-white leading-none">KLH</span>
            </h1>

            <span
              className="text-[clamp(10px,2vw,15px)] font-bold text-white uppercase tracking-[clamp(0.25em,0.8vw,0.45em)] mt-1.5 sm:mt-2.5"
              style={{
                fontFamily: "var(--font-sora)",
                textIndent: "0.3em",
                fontWeight: 700,
              }}
            >
              BOWRAMPET
            </span>
          </div>
        </motion.div>

        {/* ── LIVE COUNTDOWN TO NOVEMBER 4TH ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-col items-center my-0.5 sm:my-1.5"
        >
          {/* Subtle status tag */}
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full border border-white/[0.08] bg-black/45 backdrop-blur-md mb-2 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-ping" />
            <span
              className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-white/70 uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              COUNTDOWN TO NOV 04, 2026
            </span>
          </div>

          {/* Time Units Grid */}
          <div className="flex items-center gap-1 sm:gap-3 flex-nowrap justify-center max-w-full">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center justify-center min-w-[42px] xs:min-w-[48px] sm:min-w-[62px] px-1 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/[0.08] bg-black/55 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  <span
                    className="text-[clamp(0.95rem,3.2vw,1.75rem)] font-bold text-white tracking-tight leading-none tabular-nums"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[6.5px] xs:text-[7px] sm:text-[9px] font-bold text-[#EB0028] tracking-[0.14em] uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-white/30 text-[10px] sm:text-base font-mono -mt-1 select-none">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Scroll To Transform Cue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col items-center gap-1 cursor-pointer group mt-0.5"
          onClick={(e) => scrollTo(e, "#about")}
        >
          <span 
            className="text-[9px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50 group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            SCROLL TO TRANSFORM
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/40 group-hover:border-[#EB0028]/40 group-hover:text-[#EB0028] transition-colors"
          >
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#EB0028]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
