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
    // Fast 1.2s sleek curtain reveal
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        setShowContainer(false);
        onComplete();
      }, 700);
    }, 1000);

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
            className="absolute top-0 left-0 w-full h-[50.5%] bg-black border-b border-white/10"
          />

          {/* Bottom Curtain Panel */}
          <motion.div
            initial={{ y: "0%" }}
            animate={isDone ? { y: "100%" } : { y: "0%" }}
            transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
            className="absolute bottom-0 left-0 w-full h-[50.5%] bg-black border-t border-white/10"
          />

          {/* Fast Brand Badge Center */}
          <motion.div
            animate={isDone ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-6"
          >
            <h1
              className="text-4xl md:text-6xl font-black tracking-widest text-white uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              TED<span className="text-primary text-glow font-extrabold">X</span>
              <span className="text-white/50 ml-1">KLH</span>
            </h1>
            <p className="text-[10px] font-mono tracking-[0.35em] text-primary uppercase mt-2">
              BOUNDLESS 2026
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
