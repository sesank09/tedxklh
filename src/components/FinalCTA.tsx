"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Magnetic from "./Magnetic";

export default function FinalCTA() {
  return (
    <section className="relative w-full py-[clamp(3rem,6vw,7rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.12),transparent_70%)] pointer-events-none blur-3xl" />

      {/* Main Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1200px] mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-[clamp(1.5rem,4.5vw,3.5rem)] text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Top ambient crimson line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 shadow-[0_0_20px_rgba(235,0,40,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
          <span
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            LIMITED COHORT · 100 SEATS
          </span>
        </div>

        {/* Title */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <h2
            className="text-[clamp(1.75rem,4.5vw,3.6rem)] font-extrabold text-white tracking-tight uppercase leading-[1.1]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            READY TO EXPERIENCE <br />
            <span className="text-[#EB0028]">METAMORPHOSIS?</span>
          </h2>
          <p
            className="text-xs sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Join visionary thinkers, innovators, and creators at KLH University Bowrampet on November 4, 2026.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Magnetic range={50} strength={0.3}>
            <Link
              href="/apply"
              className="relative h-[48px] sm:h-[54px] px-6 sm:px-10 rounded-full font-bold text-xs sm:text-sm tracking-[0.16em] uppercase text-white flex items-center justify-center gap-2.5 sm:gap-3 shadow-[0_6px_35px_rgba(235,0,40,0.5)] hover:shadow-[0_10px_50px_rgba(235,0,40,0.75)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden group cursor-pointer w-full sm:w-auto min-h-[48px]"
              style={{
                background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                fontFamily: "var(--font-sora)",
                fontWeight: 700,
              }}
            >
              {/* Animated Light Sheen */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              
              <span className="relative z-10">APPLY FOR DELEGATE PASS</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </div>

        {/* Sub-info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/50 pt-1 sm:pt-2 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#EB0028]" />
            <span style={{ fontFamily: "var(--font-dm-mono)" }}>NOVEMBER 4, 2026</span>
          </div>
          <span className="text-white/20 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
            <span style={{ fontFamily: "var(--font-dm-mono)" }}>KLH UNIVERSITY, BOWRAMPET</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
