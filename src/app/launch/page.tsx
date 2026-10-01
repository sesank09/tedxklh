"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// TEDx KLH 2026 — CINEMATIC METAMORPHOSIS LAUNCH EXPERIENCE
// Route: /launch (100% Standalone, Zero Homepage Interference)
// Ultra-Smooth 60 FPS Canvas Engine with Delta-Time Physics
// ─────────────────────────────────────────────────────────────

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  angle: number;
  vAngle: number;
  alpha: number;
  targetAlpha: number;
  isLeftSilver: boolean;
  depth: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  wingPhase: number;
  shatterVx: number;
  shatterVy: number;
  shatterVz: number;
}

export default function LaunchPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Experience timeline states
  // 0: Darkness (0 - 0.8s)
  // 1: The First Energy (0.8s - 2.0s)
  // 2: Fragment Storm & Convergence (2.0s - 4.5s)
  // 3: Butterfly Metamorphosis Formed (4.5s - 6.2s)
  // 4: Cinematic Pulse & Brand / Button Reveal (6.2s+)
  const [timelinePhase, setTimelinePhase] = useState<number>(0);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [buttonActive, setButtonActive] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Magnetic button state
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnOffset, setBtnOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Physics & Animation state refs (Prevents re-render lag)
  const stateRef = useRef<{
    phase: number;
    launching: boolean;
    launchStartTime: number;
    pulseProgress: number;
    butterflyAlpha: number;
    wingFlap: number;
    shards: Shard[];
    corePulse: number;
    mouseX: number;
    mouseY: number;
    targetMouseX: number;
    targetMouseY: number;
    cameraZoom: number;
    flashAlpha: number;
    width: number;
    height: number;
    dpr: number;
  }>({
    phase: 0,
    launching: false,
    launchStartTime: 0,
    pulseProgress: 0,
    butterflyAlpha: 0,
    wingFlap: 0,
    shards: [],
    corePulse: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    cameraZoom: 1,
    flashAlpha: 0,
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Sync React states to ref
  useEffect(() => {
    stateRef.current.phase = timelinePhase;
  }, [timelinePhase]);

  useEffect(() => {
    stateRef.current.launching = isLaunching;
  }, [isLaunching]);

  // Reduced motion check
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReducedMotion(isMotionReduced);
      if (isMotionReduced) {
        setTimelinePhase(4);
        setButtonActive(true);
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 1. TIMELINE SEQUENCER (Clean single timer sequence)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || reducedMotion) return;

    // Phase 1: First Energy pulse at 0.8s
    const t1 = setTimeout(() => setTimelinePhase(1), 800);
    // Phase 2: Fragment storm & attraction field at 2.2s
    const t2 = setTimeout(() => setTimelinePhase(2), 2200);
    // Phase 3: Butterfly assembly completes at 4.8s
    const t3 = setTimeout(() => setTimelinePhase(3), 4800);
    // Phase 4: Silence -> Massive Crimson Pulse & Brand Reveal at 6.2s
    const t4 = setTimeout(() => {
      setTimelinePhase(4);
      // Button materializes after pulse
      setTimeout(() => setButtonActive(true), 1200);
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [mounted, reducedMotion]);

  // ─────────────────────────────────────────────────────────────
  // 2. ULTRA-SMOOTH CANVAS 2D/3D METAMORPHOSIS ENGINE
  // Zero Garbage Collection, Locked 60 FPS Delta-Time Loop
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Setup Canvas Resolution
    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.dpr = dpr;

      // Re-initialize shard target positions on resize
      initShards(w, h);
    };

    // Initialize Shards (Adaptive count: 320 on desktop, 160 on mobile)
    const initShards = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? 180 : 360;
      const shards: Shard[] = [];

      const cx = w / 2;
      const cy = h * 0.44;

      for (let i = 0; i < count; i++) {
        const isLeft = i % 2 === 0;
        const side = isLeft ? -1 : 1;

        // Wing shape distribution
        const u = Math.random();
        const v = Math.random();
        const isForewing = Math.random() < 0.65;

        let wx = 0;
        let wy = 0;

        if (isForewing) {
          // Upper wing arc
          const angle = -0.15 - u * 1.35;
          const radius = Math.pow(v, 0.45) * (isMobile ? 110 : 175);
          wx = cx + side * (Math.cos(angle) * radius * 1.35 + 15);
          wy = cy + Math.sin(angle) * radius - (isMobile ? 15 : 25);
        } else {
          // Lower wing arc
          const angle = 0.2 + u * 1.25;
          const radius = Math.pow(v, 0.5) * (isMobile ? 80 : 130);
          wx = cx + side * (Math.cos(angle) * radius * 1.1 + 12);
          wy = cy + Math.sin(angle) * radius + (isMobile ? 18 : 30);
        }

        // Spawn position: widely dispersed along screen perimeter
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = Math.max(w, h) * (0.6 + Math.random() * 0.5);
        const sx = cx + Math.cos(spawnAngle) * spawnDist;
        const sy = cy + Math.sin(spawnAngle) * spawnDist;

        // Shatter explosion trajectory
        const shatterAngle = Math.atan2(wy - cy, wx - cx) + (Math.random() - 0.5) * 0.5;
        const shatterSpeed = (isMobile ? 12 : 18) + Math.random() * 22;

        shards.push({
          x: sx,
          y: sy,
          vx: 0,
          vy: 0,
          targetX: wx,
          targetY: wy,
          size: (isMobile ? 2.5 : 3.8) + Math.random() * (isMobile ? 3.5 : 5.5),
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.08,
          alpha: 0,
          targetAlpha: 0.25 + Math.random() * 0.65,
          isLeftSilver: isLeft,
          depth: 0.5 + Math.random() * 1.2,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitRadius: 2 + Math.random() * 8,
          orbitSpeed: (0.4 + Math.random() * 0.8) * (Math.random() < 0.5 ? 1 : -1),
          wingPhase: Math.random() * Math.PI * 2,
          shatterVx: Math.cos(shatterAngle) * shatterSpeed,
          shatterVy: Math.sin(shatterAngle) * shatterSpeed,
          shatterVz: 1.0 + Math.random() * 3.5, // Fly toward camera
        });
      }

      stateRef.current.shards = shards;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ─────────────────────────────────────────────────────────────
    // 3. MAIN 60 FPS RENDER LOOP
    // ─────────────────────────────────────────────────────────────
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05); // Clamped delta time
      lastTime = now;

      const state = stateRef.current;
      const { width: w, height: h, dpr, phase, shards, launching } = state;

      // Mouse Parallax Smooth Lerp
      state.mouseX += (state.targetMouseX - state.mouseX) * (dt * 4.0);
      state.mouseY += (state.targetMouseY - state.mouseY) * (dt * 4.0);

      const cx = w / 2 + state.mouseX * 25;
      const cy = h * 0.44 + state.mouseY * 20;

      // Clear Frame
      ctx.save();
      ctx.scale(dpr, dpr);

      // Layer 1: Atmospheric Deep Black Void
      ctx.fillStyle = "#020202";
      ctx.fillRect(0, 0, w, h);

      // Layer 2: Atmospheric Volumetric Crimson Breathing Glow
      const glowRadius = Math.min(w, h) * (0.4 + Math.sin(now * 0.0015) * 0.05);
      const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
      const glowOpacity = phase === 0 ? 0.04 : phase < 3 ? 0.12 : 0.22;
      bgGlow.addColorStop(0, `rgba(235, 0, 40, ${glowOpacity})`);
      bgGlow.addColorStop(0.5, `rgba(100, 0, 16, ${glowOpacity * 0.4})`);
      bgGlow.addColorStop(1, "rgba(2, 2, 2, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // ── PHASE 1 & 2: THE FIRST ENERGY & CORE PULSE ──
      if (phase >= 1 && !launching) {
        state.corePulse += dt * 2.5;
        const pulseScale = 1.0 + Math.sin(state.corePulse) * 0.15;
        const coreRad = (phase === 1 ? 4 : 8) * pulseScale;

        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRad * 4);
        coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        coreGrad.addColorStop(0.3, "rgba(235, 0, 40, 0.85)");
        coreGrad.addColorStop(0.7, "rgba(235, 0, 40, 0.25)");
        coreGrad.addColorStop(1, "rgba(235, 0, 40, 0)");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRad * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── PHASE 3 & 4: BUTTERFLY CRYSTALLIZATION & WING MOTION ──
      if (phase >= 2) {
        state.butterflyAlpha = Math.min(1.0, state.butterflyAlpha + dt * 0.8);
        state.wingFlap += dt * 2.2;
      }

      // ── PHASE 4: CINEMATIC PULSE WAVE EXPANSION ──
      if (phase >= 4 && !launching) {
        state.pulseProgress = Math.min(1.0, state.pulseProgress + dt * 0.7);
        const pWave = state.pulseProgress;
        if (pWave > 0 && pWave < 1) {
          const waveRadius = pWave * Math.max(w, h) * 0.9;
          const waveAlpha = (1.0 - pWave) * 0.75;

          ctx.strokeStyle = `rgba(235, 0, 40, ${waveAlpha})`;
          ctx.lineWidth = 3.5 * (1.0 - pWave) + 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner shockwave ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha * 0.6})`;
          ctx.lineWidth = 1.5 * (1.0 - pWave);
          ctx.beginPath();
          ctx.arc(cx, cy, waveRadius * 0.82, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ── DRAW METAMORPHOSIS CRYSTALLINE WINGS (Phase 3+) ──
      if (state.butterflyAlpha > 0.05 && !launching) {
        const flap = Math.sin(state.wingFlap) * 0.18;
        const bAlpha = state.butterflyAlpha;

        // Draw Left Wing Structure (Silver / White)
        ctx.save();
        ctx.translate(cx - 4, cy);
        ctx.scale(1.0 - Math.abs(flap) * 0.35, 1.0 + flap * 0.1);
        ctx.globalAlpha = bAlpha * 0.92;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.8;
        ctx.fillStyle = "rgba(240, 245, 255, 0.08)";

        // Left Forewing Path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-45, -75, -120, -155, -170, -120);
        ctx.bezierCurveTo(-195, -75, -150, -15, -110, 15);
        ctx.bezierCurveTo(-75, 25, -35, 15, 0, 0);
        ctx.stroke();
        ctx.fill();

        // Left Hindwing Path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-35, 20, -115, 45, -125, 95);
        ctx.bezierCurveTo(-95, 140, -45, 125, -20, 75);
        ctx.bezierCurveTo(-8, 45, -4, 20, 0, 0);
        ctx.stroke();
        ctx.fill();

        // Left Crystalline Facet Veins
        ctx.strokeStyle = "rgba(200, 225, 255, 0.45)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-135, -85);
        ctx.moveTo(0, 0); ctx.lineTo(-155, -40);
        ctx.moveTo(0, 0); ctx.lineTo(-95, -110);
        ctx.moveTo(0, 0); ctx.lineTo(-90, 80);
        ctx.moveTo(0, 0); ctx.lineTo(-65, 105);
        ctx.stroke();
        ctx.restore();

        // Draw Right Wing Structure (Ruby Crimson)
        ctx.save();
        ctx.translate(cx + 4, cy);
        ctx.scale(1.0 - Math.abs(flap) * 0.35, 1.0 + flap * 0.1);
        ctx.globalAlpha = bAlpha * 0.95;

        ctx.strokeStyle = "rgba(255, 45, 75, 0.95)";
        ctx.lineWidth = 2.0;
        ctx.fillStyle = "rgba(235, 0, 40, 0.14)";

        // Right Forewing Path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(45, -75, 120, -155, 170, -120);
        ctx.bezierCurveTo(195, -75, 150, -15, 110, 15);
        ctx.bezierCurveTo(75, 25, 35, 15, 0, 0);
        ctx.stroke();
        ctx.fill();

        // Right Hindwing Path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(35, 20, 115, 45, 125, 95);
        ctx.bezierCurveTo(95, 140, 45, 125, 20, 75);
        ctx.bezierCurveTo(8, 45, 4, 20, 0, 0);
        ctx.stroke();
        ctx.fill();

        // Right Crystalline Facet Veins
        ctx.strokeStyle = "rgba(255, 140, 160, 0.65)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(135, -85);
        ctx.moveTo(0, 0); ctx.lineTo(155, -40);
        ctx.moveTo(0, 0); ctx.lineTo(95, -110);
        ctx.moveTo(0, 0); ctx.lineTo(90, 80);
        ctx.moveTo(0, 0); ctx.lineTo(65, 105);
        ctx.stroke();
        ctx.restore();

        // Central Spine / Thorax
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = bAlpha * 0.9;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 3, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── SHARDS PHYSICS & RENDERING (The Crystalline Metamorphosis Particles) ──
      const len = shards.length;
      const isShattering = launching;

      for (let i = 0; i < len; i++) {
        const s = shards[i];

        if (phase === 0) {
          // Complete darkness
          s.alpha = 0;
          continue;
        }

        if (!isShattering) {
          if (phase === 1) {
            // First few fragments appear
            if (i < 24) {
              s.alpha = Math.min(s.targetAlpha, s.alpha + dt * 0.4);
            }
          } else if (phase >= 2) {
            // Fragment storm converges toward wings via attraction field
            s.alpha = Math.min(s.targetAlpha, s.alpha + dt * 0.8);

            const dx = s.targetX - s.x;
            const dy = s.targetY - s.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Attraction + Inertia + Damping
            const force = Math.min(dist * 0.08, 14);
            const ax = (dx / (dist + 0.001)) * force;
            const ay = (dy / (dist + 0.001)) * force;

            s.vx = (s.vx + ax * dt * 4.5) * 0.90;
            s.vy = (s.vy + ay * dt * 4.5) * 0.90;

            s.x += s.vx;
            s.y += s.vy;

            // Subtle orbital motion when locked in place
            if (dist < 15 && phase >= 3) {
              s.orbitAngle += s.orbitSpeed * dt;
              s.x = s.targetX + Math.cos(s.orbitAngle) * s.orbitRadius;
              s.y = s.targetY + Math.sin(s.orbitAngle) * s.orbitRadius;
            }
          }
        } else {
          // ── PHASE 8: HYPERSPACE SHATTER EXPLOSION ──
          s.x += s.shatterVx * dt * 60;
          s.y += s.shatterVy * dt * 60;
          s.depth += s.shatterVz * dt * 4.0; // Accelerates toward camera
          s.size = Math.max(0.5, s.size * (1.0 + dt * 2.5));
          s.alpha = Math.max(0, s.alpha - dt * 0.65);
        }

        s.angle += s.vAngle;

        if (s.alpha <= 0.01) continue;

        // Render Individual Diamond Crystalline Shard
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.globalAlpha = s.alpha;

        if (s.isLeftSilver) {
          // Left: Silver / White Shard
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.strokeStyle = "rgba(200, 230, 255, 0.7)";
        } else {
          // Right: Ruby Crimson Shard
          ctx.fillStyle = "rgba(235, 0, 40, 0.95)";
          ctx.strokeStyle = "rgba(255, 120, 145, 0.85)";
        }

        ctx.lineWidth = 1.0;
        const sz = s.size;

        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.lineTo(sz * 0.65, 0);
        ctx.lineTo(0, sz * 1.2);
        ctx.lineTo(-sz * 0.65, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // ── LAUNCH HYPERSPACE FLASH & FADE TO WHITE/CRIMSON ──
      if (launching) {
        state.flashAlpha = Math.min(1.0, state.flashAlpha + dt * 1.8);
        if (state.flashAlpha > 0.01) {
          ctx.fillStyle = `rgba(235, 0, 40, ${state.flashAlpha * 0.85})`;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = `rgba(255, 255, 255, ${state.flashAlpha * 0.65})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 4. MOUSE PARALLAX & MAGNETIC BUTTON LOGIC
  // ─────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    stateRef.current.targetMouseX = (e.clientX / innerWidth) - 0.5;
    stateRef.current.targetMouseY = (e.clientY / innerHeight) - 0.5;

    // Magnetic pull for Launch Button
    if (buttonRef.current && buttonActive && !isLaunching) {
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const pull = (1.0 - dist / 100) * 4.5;
        setBtnOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
      } else {
        setBtnOffset({ x: 0, y: 0 });
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5. LAUNCH CLICK — THE GOOSEBUMPS TRANSFORMATION MOMENT
  // ─────────────────────────────────────────────────────────────
  const handleLaunchClick = useCallback(() => {
    if (isLaunching) return;
    setIsLaunching(true);

    // Sequence: Shatter -> Fly-through -> Navigate to /
    setTimeout(() => {
      router.push("/");
    }, 1100);
  }, [isLaunching, router]);

  if (!mounted) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen min-h-[100dvh] bg-[#020202] text-white select-none overflow-hidden flex flex-col justify-between"
      style={{ perspective: "1200px" }}
    >
      {/* ── HIGH PERFORMANCE 60 FPS CANVAS ── */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* ── TOP MINIMAL HUD METADATA (NO NAVBAR) ── */}
      <header className="relative z-20 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
            PORTAL_STATE // METAMORPHOSIS
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono tracking-widest text-white/40">
          NOV 04, 2026
        </div>
      </header>

      {/* ── MAIN CENTER STAGE: BRAND HIERARCHY & LAUNCH CONTROL ── */}
      <main className="relative z-20 flex flex-col items-center justify-end sm:justify-center px-4 mb-8 sm:my-auto text-center pointer-events-auto">
        
        {/* BRAND REVEAL (Phase 4) */}
        <AnimatePresence>
          {timelinePhase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-1.5 mb-6 sm:mb-10 mt-auto sm:mt-0"
            >
              {/* TEDx KLH Hierarchy */}
              <div className="flex items-baseline justify-center tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                >
                  TED
                </span>
                <span
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-[#EB0028] ml-0.5"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 900 }}
                >
                  x
                </span>
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-light text-white/95 ml-3 sm:ml-4"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                >
                  KLH
                </span>
              </div>

              {/* BOWRAMPET Subtitle */}
              <div
                className="text-[11px] sm:text-sm font-semibold tracking-[0.45em] text-white/70 uppercase pl-1.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                BOWRAMPET
              </div>

              {/* METAMORPHOSIS Theme Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="pt-2 sm:pt-3 flex items-center gap-2 text-xs sm:text-sm text-[#EB0028] font-bold tracking-[0.3em] uppercase font-mono"
              >
                <span>METAMORPHOSIS</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60 font-medium tracking-[0.2em] hidden sm:inline">
                  THE UNSEEN PROCESS OF BECOMING
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── THE FUTURISTIC MAGNETIC LAUNCH CONTROL ── */}
        <AnimatePresence>
          {buttonActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group flex items-center justify-center"
              style={{
                transform: `translate3d(${btnOffset.x}px, ${btnOffset.y}px, 0)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Outer Energy Field */}
              <div className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-[#EB0028]/25 via-white/10 to-[#EB0028]/25 blur-xl opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />

              {/* Magnetic Button */}
              <motion.button
                ref={buttonRef}
                onClick={handleLaunchClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLaunching}
                className="relative px-10 sm:px-14 py-4 sm:py-5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-[#EB0028]/50 bg-black/75 backdrop-blur-xl shadow-[0_0_35px_rgba(235,0,40,0.45)] group-hover:shadow-[0_0_65px_rgba(235,0,40,0.9)] group-hover:border-[#EB0028] transition-all duration-300"
              >
                {/* Traveling Perimeter Laser Tracer */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4.0, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(235,0,40,0.85)_25%,transparent_45%,rgba(255,255,255,0.75)_50%,transparent_75%)] opacity-40 group-hover:opacity-85 pointer-events-none"
                />

                {/* Inner Obsidian Shield */}
                <div className="absolute inset-[1.5px] rounded-full bg-[#08080a]/90 backdrop-blur-md pointer-events-none" />

                {/* Button Typography */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#EB0028] group-hover:scale-125 transition-transform" />
                  <span
                    className="text-base sm:text-lg font-bold tracking-[0.3em] uppercase text-white"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {isLaunching ? "WARPING..." : "LAUNCH"}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM MINIMAL COORDINATES ── */}
      <footer className="relative z-20 w-full px-6 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[10px] font-mono text-white/35 pointer-events-none">
        <div>17.5623° N · 78.3846° E</div>
        <div>COHORT // 100 SEATS</div>
      </footer>
    </div>
  );
}
