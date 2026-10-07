"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles } from "lucide-react";

export default function EventDateBanner() {
  return (
    <div className="relative w-full z-20 px-3 sm:px-8 py-4 sm:py-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-[1400px] mx-auto rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl p-3.5 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
      >
        {/* Subtle crimson edge glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/60 to-transparent" />
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#EB0028]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Left Side: Event Date */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028] shrink-0 shadow-[0_0_15px_rgba(235,0,40,0.2)]">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-0.5 text-center md:text-left">
            <span
              className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#EB0028] uppercase font-semibold block"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              OFFICIAL EVENT DATE
            </span>
            <div
              className="text-base sm:text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              NOVEMBER 4, 2026
            </div>
          </div>
        </div>

        {/* Center: Location */}
        <div className="flex items-center gap-2 sm:gap-3 text-center md:text-left">
          <MapPin className="w-4 h-4 text-[#EB0028] shrink-0 hidden sm:block" />
          <div className="space-y-0.5">
            <span
              className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium block"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              VENUE LOCATION
            </span>
            <span
              className="text-xs sm:text-sm font-medium text-white/80"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
            >
              KLH UNIVERSITY · BOWRAMPET · HYDERABAD
            </span>
          </div>
        </div>

        {/* Right Side: Pass Badge */}
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-[#EB0028] bg-[#EB0028]/10 border border-[#EB0028]/30 px-3 sm:px-3.5 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            <Sparkles className="w-3 h-3 text-[#EB0028]" />
            250 DELEGATE SEATS
          </span>
        </div>
      </motion.div>
    </div>
  );
}
