"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Smoothly fade out all hero text within first 140px of scroll
  const heroOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const heroY = useTransform(scrollY, [0, 140], [0, -20]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-11-04T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
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
      className="relative min-h-screen w-full flex flex-col justify-between items-center pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 select-none overflow-hidden pointer-events-none"
    >
      {/* Center zone reserved for the 3D Butterfly */}
      <div className="w-full flex-grow min-h-[26vh] sm:min-h-[32vh]" />

      {/* Bottom Area: TEDxKLH Brand + Live Countdown + Scroll Cue */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="w-full max-w-[1440px] mx-auto text-center z-20 pb-4 sm:pb-6 flex flex-col items-center gap-3 sm:gap-4 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col items-center justify-center select-none text-center">
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight flex items-baseline justify-center"
              style={{ 
                fontFamily: "var(--font-sora)", 
                fontWeight: 800,
                letterSpacing: "-0.04em",
                textTransform: "none",
                lineHeight: 1,
              }}
            >
              <span>TED</span>
              <span
                className="text-[#EB0028]"
                style={{
                  fontSize: "0.52em",
                  fontWeight: 700,
                  verticalAlign: "0.22em",
                  letterSpacing: "0em",
                  lineHeight: 1,
                  marginRight: "0.06em",
                }}
              >
                x
              </span>
              <span>KLH</span>
            </h1>

            <span
              className="text-[10px] sm:text-xs md:text-sm font-semibold text-white/70 uppercase tracking-[0.38em] mt-2 sm:mt-2.5"
              style={{
                fontFamily: "var(--font-sora)",
                letterSpacing: "0.38em",
                textIndent: "0.38em",
                fontWeight: 600,
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
          className="flex flex-col items-center my-1 sm:my-2"
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
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[62px] px-2 sm:px-3 py-1.5 rounded-xl border border-white/[0.08] bg-black/55 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  <span
                    className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {mounted ? String(item.value).padStart(2, "0") : "--"}
                  </span>
                  <span
                    className="text-[8px] sm:text-[9px] font-bold text-[#EB0028] tracking-[0.18em] uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-white/30 text-sm sm:text-lg font-mono -mt-2 select-none">
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
          className="flex flex-col items-center gap-1.5 cursor-pointer group mt-0.5"
          onClick={(e) => scrollTo(e, "#about")}
        >
          <span 
            className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-white/50 group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            SCROLL TO TRANSFORM
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/40 group-hover:border-[#EB0028]/40 group-hover:text-[#EB0028] transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EB0028]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
