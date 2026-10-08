"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PreloaderProps {
  onComplete?: () => void;
}

const STATUS_MESSAGES = [
  "INITIALIZING QUANTUM CANVAS...",
  "COMPILING 3D METAMORPHOSIS SHADERS...",
  "SYNCHRONIZING SPEAKER MATRICES...",
  "CALIBRATING VOLUMETRIC AUDIO...",
  "ACCESS GRANTED • WELCOME TO TEDxKLH 2026",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock body scroll during preloading
    document.body.style.overflow = "hidden";

    const duration = 1800; // ~1.8 seconds total duration
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step + Math.random() * 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = "";
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Update status messages according to progress thresholds
  useEffect(() => {
    if (progress < 25) {
      setStatusIndex(0);
    } else if (progress < 50) {
      setStatusIndex(1);
    } else if (progress < 75) {
      setStatusIndex(2);
    } else if (progress < 95) {
      setStatusIndex(3);
    } else {
      setStatusIndex(4);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="tedx-preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-black text-white p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[750px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(235,0,40,0.16),transparent_70%)] pointer-events-none blur-3xl" />
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Holographic Grid Lines */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top Header Information */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex items-center justify-between relative z-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-ping" />
              <span 
                className="text-[10px] sm:text-xs tracking-[0.3em] font-mono uppercase text-white/50"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                SYSTEM BOOTLOADER v2.6
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 text-[#EB0028] font-bold"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                KLH BOWRAMPET
              </span>
            </div>
          </motion.div>

          {/* Centerpiece: Brand Identity & Counter */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 relative z-10 my-auto">
            {/* Logo Unit */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span 
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#EB0028] drop-shadow-[0_0_35px_rgba(235,0,40,0.6)]"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                >
                  TEDx
                </span>
                <span 
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                >
                  KLH
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span 
                  className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-white/40 font-mono"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  METAMORPHOSIS • 2026
                </span>
              </div>
            </motion.div>

            {/* Giant Futuristic Numerical Counter */}
            <div className="space-y-1">
              <div 
                className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 tracking-tighter"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                {Math.min(100, Math.floor(progress))}
                <span className="text-2xl sm:text-4xl md:text-5xl text-[#EB0028] font-mono ml-1 font-bold">%</span>
              </div>
            </div>

            {/* Dynamic Status Capsule */}
            <div className="h-8 flex items-center justify-center">
              <motion.div
                key={statusIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EB0028] animate-pulse" />
                <span 
                  className="text-[10px] sm:text-xs tracking-[0.2em] font-mono text-white/70 uppercase"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  {STATUS_MESSAGES[statusIndex]}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Bottom Progress Bar & Shard Indicator */}
          <div className="w-full max-w-xl space-y-3 relative z-10">
            {/* Progress Bar Container */}
            <div className="w-full h-1 sm:h-1.5 rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#EB0028] via-[#ff3b5c] to-white rounded-full shadow-[0_0_15px_#EB0028]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-white/40 tracking-wider">
              <span>INITIALIZING SUMMIT RUNTIME</span>
              <span>
                {progress === 100 ? "LAUNCHING..." : "STREAMING ASSETS..."}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
