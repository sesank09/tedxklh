"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Radio, Cpu, Volume2, VolumeX, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { playHoverTickSound, playLaunchIgnitionSound } from "@/lib/utils/audio";

const SHARD_COUNT = 32;

interface LaunchOverlayProps {
  onLaunched: () => void;
}

export default function LaunchOverlay({ onLaunched }: LaunchOverlayProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [warpProgress, setWarpProgress] = useState(0);
  const [systemTime, setSystemTime] = useState("");
  const [fps, setFps] = useState(60);

  // Mouse tracking for parallax reactor depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22 });
  const rotateReactorX = useTransform(springY, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateReactorY = useTransform(springX, [-0.5, 0.5], ["-20deg", "20deg"]);

  // Random shards data
  const shards = useMemo(() => {
    return Array.from({ length: SHARD_COUNT }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 90,
      y: (Math.random() - 0.5) * 85,
      size: 4 + Math.random() * 12,
      duration: 3.5 + Math.random() * 4,
      delay: Math.random() * 2,
      isRed: Math.random() < 0.45,
      rot: Math.random() * 360,
    }));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + `.${Math.floor(now.getMilliseconds() / 100)}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 100);

    const fpsInterval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4));
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(fpsInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX / innerWidth) - 0.5);
    mouseY.set((e.clientY / innerHeight) - 0.5);
  };

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);

    if (soundEnabled) {
      playLaunchIgnitionSound();
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 2.5;
      setWarpProgress(Math.min(100, Math.floor(p)));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onLaunched();
        }, 400);
      }
    }, 28);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[99999] w-full h-full bg-[#030303] text-white select-none overflow-hidden flex flex-col justify-between"
      style={{
        perspective: "1200px",
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(235, 0, 40, 0.16) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 40%),
          linear-gradient(180deg, #030303 0%, #000000 100%)
        `,
      }}
    >
      {/* 1. BACKGROUND HUD GRID & SCANLINES */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="launchGridOverlay" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
              <circle cx="60" cy="60" r="1" fill="rgba(235, 0, 40, 0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#launchGridOverlay)" />
        </svg>
      </div>

      {/* Laser Horizon Sweep */}
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB0028]/60 to-transparent pointer-events-none blur-[1px]"
      />

      {/* 2. FLOATING DYNAMIC CRYSTAL SHARDS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {shards.map((s) => (
          <motion.div
            key={s.id}
            animate={{
              y: [0, -35, 0],
              x: [0, (s.id % 2 === 0 ? 25 : -25), 0],
              rotate: [s.rot, s.rot + 180, s.rot + 360],
              opacity: [0.2, 0.85, 0.2],
              scale: isLaunching ? [1, 3.5, 0] : [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: isLaunching ? 0.8 : s.duration,
              repeat: isLaunching ? 0 : Infinity,
              delay: s.delay,
              ease: isLaunching ? "easeIn" : "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${50 + s.x}%`,
              top: `${50 + s.y}%`,
              width: s.size,
              height: s.size,
              background: s.isRed
                ? "linear-gradient(135deg, #EB0028, #FF454A)"
                : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              boxShadow: s.isRed ? "0 0 16px #EB0028" : "0 0 12px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* 3. TOP HUD BAR */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo-white.png"
            alt="TEDx KLH"
            width={160}
            height={44}
            className="h-8 sm:h-9 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
            priority
          />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[10px] font-mono tracking-widest text-[#EB0028]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-ping" />
            <span>SYS_READY // 2026.11.04</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs text-white/60 font-mono">
          <div className="hidden md:flex flex-col items-end text-[10px] space-y-0.5">
            <span className="text-white/40">GEO_LOCATION:</span>
            <span className="text-white/80 font-bold">17.5623° N · 78.3846° E</span>
          </div>

          <div className="hidden sm:flex flex-col items-end text-[10px] space-y-0.5">
            <span className="text-white/40">SYSTEM_TIME:</span>
            <span className="text-[#EB0028] font-bold">{systemTime || "00:00:00.0"}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/70 hover:text-white hover:border-[#EB0028] transition-all cursor-pointer shadow-lg"
            title={soundEnabled ? "Mute audio synthesis" : "Enable audio synthesis"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#EB0028]" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>
        </div>
      </header>

      {/* 4. MAIN CENTER STAGE: HOLOGRAPHIC LAUNCH REACTOR */}
      <main className="relative z-30 flex flex-col items-center justify-center px-4 my-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-center space-y-3 mb-6 sm:mb-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
            <span
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              TEDxKLH OFFICIAL LAUNCH EXPERIENCE
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            META<span className="text-[#EB0028]">MORPHOSIS</span>
          </h1>

          <p
            className="text-xs sm:text-sm md:text-base text-white/60 font-medium tracking-wide max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            The Unseen Process of Becoming · Bowrampet Campus · Nov 4, 2026
          </p>
        </motion.div>

        {/* ── THE 3D HOLOGRAPHIC LAUNCH REACTOR ── */}
        <motion.div
          style={{
            rotateX: rotateReactorX,
            rotateY: rotateReactorY,
            transformStyle: "preserve-3d",
          }}
          className="relative flex items-center justify-center p-8 sm:p-12"
        >
          {/* Outer Pulsing Aura Glow */}
          <motion.div
            animate={{
              scale: isLaunching ? [1, 2.8] : [1, 1.15, 1],
              opacity: isLaunching ? [0.6, 1, 0] : [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: isLaunching ? 1.2 : 3,
              repeat: isLaunching ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#EB0028] blur-[80px] pointer-events-none"
          />

          {/* Ring 1: Outer Segmented Laser Ring */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: isLaunching ? 1.5 : 22, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border border-dashed border-white/20 pointer-events-none"
            style={{
              borderWidth: "1.5px",
              borderColor: "rgba(235, 0, 40, 0.45)",
            }}
          />

          {/* Ring 2: Counter-Rotating Mechanical HUD Ring */}
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: isLaunching ? 1 : 16, repeat: Infinity, ease: "linear" }}
            className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] rounded-full border border-white/10 pointer-events-none flex items-center justify-center"
          >
            <div className="absolute top-0 w-3 h-3 bg-[#EB0028] rounded-full shadow-[0_0_12px_#EB0028]" />
            <div className="absolute bottom-0 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#FFFFFF]" />
            <div className="absolute left-0 w-2 h-2 bg-[#EB0028] rounded-full" />
            <div className="absolute right-0 w-2 h-2 bg-white rounded-full" />
          </motion.div>

          {/* Ring 3: Concentric Energy Arc */}
          <motion.div
            animate={{ rotate: [0, 360], scale: [0.96, 1.04, 0.96] }}
            transition={{
              rotate: { duration: isLaunching ? 0.8 : 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute w-[220px] h-[220px] sm:w-[310px] sm:h-[310px] rounded-full border-2 border-t-[#EB0028] border-r-transparent border-b-white border-l-transparent pointer-events-none shadow-[0_0_25px_rgba(235,0,40,0.6)]"
          />

          {/* ── CENTRAL INTERACTIVE LAUNCH BUTTON ── */}
          <motion.button
            onClick={handleLaunch}
            onMouseEnter={playHoverTickSound}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            disabled={isLaunching}
            className="relative group w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden z-20 shadow-[0_0_60px_rgba(235,0,40,0.65)] hover:shadow-[0_0_90px_rgba(235,0,40,0.95)] transition-all duration-500"
            style={{
              background: "radial-gradient(circle at center, #EB0028 0%, #8B0014 65%, #1A0004 100%)",
              border: "3px solid rgba(255, 255, 255, 0.85)",
            }}
          >
            {/* Holographic Shimmer Surface */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
            />

            {/* Inner Red Energy Flare */}
            <div className="absolute inset-2 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm pointer-events-none" />

            {/* Button Inner Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 p-4">
              <motion.div
                animate={isLaunching ? { scale: [1, 2], rotate: 360 } : { y: [0, -3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white text-[#EB0028] flex items-center justify-center shadow-[0_0_20px_#FFFFFF]"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB0028]" />
              </motion.div>

              <span
                className="text-lg sm:text-2xl font-black text-white tracking-wider uppercase leading-none mt-1"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                {isLaunching ? "WARPING..." : "LAUNCH"}
              </span>

              <span
                className="text-[9px] sm:text-[11px] font-bold text-white/85 tracking-[0.22em] uppercase font-mono"
              >
                {isLaunching ? `${warpProgress}%` : "EXPERIENCE"}
              </span>
            </div>

            {/* Dynamic Wave Ripple on Click */}
            {isLaunching && (
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-4 border-white bg-white/30 pointer-events-none"
              />
            )}
          </motion.button>
        </motion.div>

        {/* Subtitle Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-10 flex items-center gap-3 text-xs sm:text-sm text-white/60 font-mono tracking-widest uppercase"
        >
          <span className="h-px w-6 sm:w-12 bg-white/20" />
          <span className="text-[#EB0028] font-bold">CLICK LAUNCH</span> TO ENTER THE HORIZON
          <span className="h-px w-6 sm:w-12 bg-white/20" />
        </motion.div>

        {/* Quick Skip to Home */}
        <div className="mt-4">
          <button
            onClick={onLaunched}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer"
          >
            <span>Skip intro & enter website directly</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </main>

      {/* 5. BOTTOM HUD BAR */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-6 flex items-end justify-between">
        <div className="flex items-end gap-1 sm:gap-1.5 h-6 sm:h-8">
          {[24, 65, 42, 85, 30, 95, 50, 78, 38, 90, 60, 40].map((h, i) => (
            <motion.div
              key={i}
              animate={{
                height: isLaunching
                  ? [`${h}%`, "100%", "20%"]
                  : [`${Math.max(15, h * 0.4)}%`, `${h}%`, `${Math.max(10, h * 0.3)}%`],
              }}
              transition={{
                duration: 0.6 + (i % 4) * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 sm:w-1.5 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#EB0028" : "rgba(255,255,255,0.75)",
                boxShadow: i % 2 === 0 ? "0 0 6px #EB0028" : "0 0 4px #FFFFFF",
              }}
            />
          ))}
          <span className="text-[9px] font-mono text-white/40 ml-2 hidden sm:inline-block">
            AUDIO_FREQ // 48.0 kHz
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/40">
          <Cpu className="w-3.5 h-3.5 text-[#EB0028]" />
          <span>FPS: {fps} · ENGINE: THREE_WEBGL · LICENSE: TED_OFFICIAL</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-white/60">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#EB0028] animate-pulse" />
            <span>METAMORPHOSIS COHORT: 100 SEATS</span>
          </div>
        </div>
      </footer>

      {/* 6. FULLSCREEN WARP TRANSITION OVERLAY */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full border-4 border-[#EB0028] shadow-[0_0_120px_#EB0028]"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.15, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full border-2 border-white shadow-[0_0_100px_#FFFFFF]"
            />

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0.1, opacity: 0 }}
                  animate={{ scaleY: [0.1, 4, 0.1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: (i * 0.03) }}
                  style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: "2px",
                    height: "120px",
                    background: i % 2 === 0 ? "#EB0028" : "#FFFFFF",
                    boxShadow: i % 2 === 0 ? "0 0 14px #EB0028" : "0 0 12px #FFFFFF",
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-20 text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-t-[#EB0028] border-r-transparent border-b-white border-l-transparent mx-auto"
              />
              <div
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-widest uppercase"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                INITIALIZING <span className="text-[#EB0028]">METAMORPHOSIS</span>
              </div>
              <div className="text-sm font-mono text-[#EB0028] tracking-widest font-bold">
                TELEPORTING TO HOMEPAGE // {warpProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
