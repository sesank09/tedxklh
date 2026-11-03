"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Lock,
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  Home,
  Copy,
  Check,
  CheckCircle2,
  Users,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ApplyPage() {
  const [copied, setCopied] = useState(false);

  const WHATSAPP_URL =
    "https://wa.me/919515576414?text=Hey%2C%20I%20need%20to%20register%20for%20TEDXKLH%20bowrampet%21";
  const PHONE_NUMBER = "+91 95155 76414";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("+919515576414");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#EB0028] selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Ambient Visual Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary Radial Glow Behind Content */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[960px] h-[720px] rounded-full blur-[140px] opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(235,0,40,0.45) 0%, rgba(235,0,40,0.12) 45%, transparent 70%)",
          }}
        />

        {/* Emerald Glow for WhatsApp harmony */}
        <div
          className="absolute top-2/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(37,211,102,0.35) 0%, transparent 65%)",
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#EB0028]/[0.08] via-transparent to-transparent" />

        {/* Soft Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 pt-36 sm:pt-44 md:pt-48 pb-24 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto w-full flex-grow flex flex-col items-center justify-center">
        {/* Main Card with Animated Conic Laser Border Sweep */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(235,0,40,0.2)] text-center"
          style={{
            background:
              "linear-gradient(155deg, rgba(17,17,17,0.96) 0%, rgba(8,8,8,0.98) 55%, rgba(5,5,5,0.99) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Animated Laser Border Sweep */}
          <div
            className="absolute overflow-hidden rounded-3xl pointer-events-none"
            style={{ inset: "-1.5px", zIndex: 0 }}
          >
            <motion.div
              className="absolute"
              style={{
                width: "200%",
                height: "200%",
                top: "-50%",
                left: "-50%",
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 65%, rgba(235,0,40,0.15) 75%, #EB0028 84%, rgba(255,160,160,0.9) 88%, #EB0028 92%, rgba(235,0,40,0.2) 96%, transparent 100%)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Inner dark container shell */}
          <div
            className="absolute inset-[1.5px] rounded-[22.5px] pointer-events-none"
            style={{
              background:
                "linear-gradient(155deg, rgba(14,14,14,0.98) 0%, rgba(7,7,7,0.98) 60%, rgba(4,4,4,0.99) 100%)",
              zIndex: 1,
            }}
          />

          {/* Interactive Card Body */}
          <div className="relative z-10 space-y-7 sm:space-y-8 flex flex-col items-center">
            {/* Status Beacon Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 shadow-[0_0_20px_rgba(235,0,40,0.25)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EB0028]"></span>
              </span>
              <span
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-white/90"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                CAPACITY REACHED · REGISTRATION UPDATE
              </span>
            </div>

            {/* Glowing Lock Emblem */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 30px rgba(235,0,40,0.25)",
                    "0 0 50px rgba(235,0,40,0.45)",
                    "0 0 30px rgba(235,0,40,0.25)",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#EB0028]/10 border border-[#EB0028]/40 flex items-center justify-center text-[#EB0028]"
              >
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-[#EB0028]" />
              </motion.div>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase leading-[1.08]"
                style={{
                  fontFamily: "var(--font-sora)",
                  fontWeight: 800,
                  textShadow: "0 0 40px rgba(235,0,40,0.35)",
                }}
              >
                REGISTRATIONS <span className="text-[#EB0028]">CLOSED</span>
              </h1>

              {/* Event Coordinates */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-white/60 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#EB0028]" />
                  <span style={{ fontFamily: "var(--font-dm-mono)" }}>NOVEMBER 4, 2026</span>
                </div>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
                  <span style={{ fontFamily: "var(--font-dm-mono)" }}>KLH UNIVERSITY, BOWRAMPET</span>
                </div>
              </div>
            </div>

            {/* Official Description */}
            <div
              className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base text-white/75 leading-relaxed font-normal"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <p className="font-semibold text-white/95 text-base sm:text-lg">
                Thank you for the overwhelming response! Official registrations for{" "}
                <span className="text-white font-bold">TEDxKLH Bowrampet 2026</span> are now closed.
              </p>
              <p className="text-white/70">
                Still interested in attending TEDxKLH? You can contact our team directly on WhatsApp to
                enquire about possible registration opportunities.
              </p>
            </div>

            {/* Prominent WhatsApp CTA Section */}
            <div className="w-full pt-3 pb-2 flex flex-col items-center gap-4 max-w-lg mx-auto">
              {/* WhatsApp Button */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-4 sm:py-5 rounded-2xl font-extrabold text-sm sm:text-base uppercase tracking-wider text-white transition-all duration-300 shadow-[0_0_35px_rgba(37,211,102,0.35)] hover:shadow-[0_0_60px_rgba(37,211,102,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer overflow-hidden border border-emerald-400/30 hover:border-emerald-400/60"
                style={{
                  background:
                    "linear-gradient(135deg, #25D366 0%, #1EBE5D 50%, #128C7E 100%)",
                  fontFamily: "var(--font-sora)",
                  fontWeight: 700,
                }}
              >
                {/* Sheen Effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <WhatsAppIcon className="w-6 h-6 text-white shrink-0" />
                <span>ENQUIRE FOR REGISTRATION</span>
                <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Direct WhatsApp Contact Details Pill with Click-to-Copy */}
              <div className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="text-[#25D366] font-bold">WhatsApp Desk:</span>
                  <span
                    className="font-mono text-white font-semibold tracking-wider select-all"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {PHONE_NUMBER}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Copy number to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white/60" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Informational Grid */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.08]">
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-0.5">
                <div
                  className="text-base sm:text-lg font-bold text-[#EB0028]"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  250
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider text-white/50 font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Curated Cohort
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-0.5">
                <div
                  className="text-base sm:text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  12
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider text-white/50 font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Keynote Speakers
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-0.5">
                <div
                  className="text-base sm:text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  Full Day
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider text-white/50 font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Immersive Summit
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-0.5">
                <div
                  className="text-base sm:text-lg font-bold text-emerald-400"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  100%
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider text-white/50 font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Passes Allocated
                </div>
              </div>
            </div>

            {/* Quick Alternate Actions for Existing Applicants */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 w-full text-xs">
              <Link
                href="/application-status"
                className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-[#EB0028]/60 bg-white/[0.04] hover:bg-[#EB0028]/10 text-white font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <Search className="w-3.5 h-3.5 text-[#EB0028]" />
                <span>CHECK APPLICATION STATUS</span>
              </Link>

              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all inline-flex items-center gap-2 cursor-pointer"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                <Home className="w-3.5 h-3.5 text-white/60" />
                <span>RETURN TO HOMEPAGE</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
