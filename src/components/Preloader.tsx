"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isDone, setIsDone] = useState(false);
  const [showContainer, setShowContainer] = useState(true);

  useEffect(() => {
    // Sleek 1.3s curtain reveal
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        setShowContainer(false);
        onComplete();
      }, 700);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showContainer && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] select-none overflow-hidden bg-transparent pointer-events-none">
          {/* Top Curtain Panel */}
          <motion.div
            initial={{ y: "0%" }}
            animate={isDone ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
            className="absolute top-0 left-0 w-full h-[50.5%] bg-black border-b border-[#EB0028]/30"
          />

          {/* Bottom Curtain Panel */}
          <motion.div
            initial={{ y: "0%" }}
            animate={isDone ? { y: "100%" } : { y: "0%" }}
            transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
            className="absolute bottom-0 left-0 w-full h-[50.5%] bg-black border-t border-[#EB0028]/30"
          />

          {/* Brand & Metamorphosis Reveal Center */}
          <motion.div
            animate={isDone ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2"
          >
            <h1
              className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              TED<span className="text-[#EB0028] text-glow font-extrabold">X</span>
              <span className="text-white/60 ml-1 font-semibold">KLH</span>
            </h1>

            <div className="flex items-center gap-1 text-xs md:text-sm font-mono tracking-[0.3em] uppercase pt-1">
              <span className="text-white font-bold">META</span>
              <span className="text-[#EB0028] font-bold text-glow">MORPHOSIS</span>
              <span className="text-white/40 ml-2">· 2026</span>
            </div>

            <p className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase">
              THE UNSEEN PROCESS OF BECOMING
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
