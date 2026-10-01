"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { playHoverTickSound, playLaunchIgnitionSound } from "@/lib/utils/audio";

// ─────────────────────────────────────────────────────────────
// HIGH-PERFORMANCE STANDALONE LAUNCH PORTAL
// Route: /launch
// Zero-recreation WebGL pipeline locked at 60 FPS
// ─────────────────────────────────────────────────────────────

export default function LaunchPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Experience timeline phase (0..4)
  const [phase, setPhase] = useState<number>(0);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [warpProgress, setWarpProgress] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  // Mutable refs to prevent React state changes from restarting/tearing WebGL context
  const phaseRef = useRef<number>(0);
  const isLaunchingRef = useRef<boolean>(false);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Sync state to refs
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    isLaunchingRef.current = isLaunching;
  }, [isLaunching]);

  // Timeline Controller (Runs once on mount)
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(4);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 4200);
    const t4 = setTimeout(() => setPhase(4), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // SINGLE-INIT 60 FPS WEBGL CANVAS PIPELINE
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    scene.fog = new THREE.FogExp2(0x020202, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x222222, 1.4);
    scene.add(ambientLight);

    const silverLight = new THREE.PointLight(0xe8f2ff, 0, 16);
    silverLight.position.set(-3.2, 1.2, 3.2);
    scene.add(silverLight);

    const crimsonLight = new THREE.PointLight(0xeb0028, 0, 16);
    crimsonLight.position.set(3.2, 1.2, 3.2);
    scene.add(crimsonLight);

    // 3. Butterfly Hierarchical Group
    const butterflyGroup = new THREE.Group();
    butterflyGroup.position.set(0, 0.42, 0);
    butterflyGroup.scale.set(0.001, 0.001, 0.001);
    scene.add(butterflyGroup);

    const leftWingPivot = new THREE.Group();
    const rightWingPivot = new THREE.Group();
    butterflyGroup.add(leftWingPivot);
    butterflyGroup.add(rightWingPivot);

    // Pre-render Wing Textures Once
    const createWingTexture = (isLeftSilver: boolean, isForewing: boolean): THREE.CanvasTexture => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 512, 512);

      const bgGrad = ctx.createRadialGradient(125, 175, 20, 256, 256, 320);
      if (isLeftSilver) {
        bgGrad.addColorStop(0, "rgba(30, 35, 45, 0.96)");
        bgGrad.addColorStop(0.5, "rgba(12, 14, 18, 0.9)");
        bgGrad.addColorStop(1, "rgba(2, 2, 4, 0.98)");
      } else {
        bgGrad.addColorStop(0, "rgba(65, 4, 14, 0.96)");
        bgGrad.addColorStop(0.5, "rgba(22, 2, 6, 0.9)");
        bgGrad.addColorStop(1, "rgba(3, 0, 1, 0.98)");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 512, 512);

      // Core Flare
      const flareGrad = ctx.createRadialGradient(
        isForewing ? 190 : 210,
        isForewing ? 210 : 230,
        8,
        256,
        256,
        250
      );
      if (isLeftSilver) {
        flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        flareGrad.addColorStop(0.3, "rgba(210, 230, 255, 0.65)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        flareGrad.addColorStop(0, "rgba(255, 70, 95, 0.98)");
        flareGrad.addColorStop(0.3, "rgba(235, 0, 40, 0.75)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, 512, 512);

      // Crystalline Venation Lines
      ctx.strokeStyle = isLeftSilver ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 190, 205, 0.95)";
      ctx.lineWidth = 2.4;
      const rootX = isForewing ? 60 : 80;
      const rootY = isForewing ? 430 : 120;
      const numVeins = isForewing ? 11 : 8;

      for (let i = 0; i < numVeins; i++) {
        const angle = isForewing
          ? -0.12 - (i / numVeins) * 1.38
          : 0.12 + (i / numVeins) * 1.34;
        const len = 220 + Math.sin(i * 1.4) * 100 + (isForewing ? 130 : 90);
        const endX = rootX + Math.cos(angle) * len;
        const endY = rootY + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    // Geometries
    const foreShape = new THREE.Shape();
    foreShape.moveTo(0, 0);
    foreShape.bezierCurveTo(0.35, 0.85, 1.2, 1.95, 1.85, 2.55);
    foreShape.bezierCurveTo(2.4, 2.75, 2.75, 2.55, 2.85, 2.15);
    foreShape.bezierCurveTo(2.8, 1.45, 2.3, 0.85, 2.05, 0.35);
    foreShape.bezierCurveTo(1.85, 0.05, 1.35, -0.1, 0.75, -0.05);
    foreShape.lineTo(0, 0);
    const foreGeom = new THREE.ShapeGeometry(foreShape, 24);

    const hindShape = new THREE.Shape();
    hindShape.moveTo(0, 0);
    hindShape.bezierCurveTo(0.55, 0.1, 1.35, 0.0, 1.8, -0.4);
    hindShape.bezierCurveTo(2.1, -0.9, 1.95, -1.65, 1.55, -2.15);
    hindShape.bezierCurveTo(1.15, -2.45, 0.65, -2.2, 0.4, -1.65);
    hindShape.bezierCurveTo(0.18, -1.15, 0.08, -0.55, 0.0, 0.0);
    hindShape.lineTo(0, 0);
    const hindGeom = new THREE.ShapeGeometry(hindShape, 20);

    const createWingMat = (map: THREE.Texture, isSilver: boolean) =>
      new THREE.MeshStandardMaterial({
        map,
        side: THREE.DoubleSide,
        roughness: isSilver ? 0.28 : 0.35,
        metalness: isSilver ? 0.8 : 0.25,
        emissive: new THREE.Color(isSilver ? 0x222a35 : 0x880018),
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.98,
      });

    // Left wings (Silver)
    const leftForeMesh = new THREE.Mesh(foreGeom, createWingMat(createWingTexture(true, true), true));
    const leftHindMesh = new THREE.Mesh(hindGeom, createWingMat(createWingTexture(true, false), true));
    leftForeMesh.scale.set(-1, 1, 1);
    leftHindMesh.scale.set(-1, 1, 1);
    leftWingPivot.add(leftForeMesh);
    leftWingPivot.add(leftHindMesh);

    // Right wings (Crimson)
    const rightForeMesh = new THREE.Mesh(foreGeom, createWingMat(createWingTexture(false, true), false));
    const rightHindMesh = new THREE.Mesh(hindGeom, createWingMat(createWingTexture(false, false), false));
    rightWingPivot.add(rightForeMesh);
    rightWingPivot.add(rightHindMesh);

    // Central Thorax Spine
    const thoraxGeom = new THREE.CylinderGeometry(0.04, 0.02, 1.5, 12);
    const thoraxMat = new THREE.MeshStandardMaterial({
      color: 0x111115,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x220508,
    });
    const thoraxMesh = new THREE.Mesh(thoraxGeom, thoraxMat);
    butterflyGroup.add(thoraxMesh);

    // 4. Lean & Fluid Crystalline Convergence Particles (700 particles)
    const PARTICLE_COUNT = 700;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pCol = new Float32Array(PARTICLE_COUNT * 3);
    const pTarget = new Float32Array(PARTICLE_COUNT * 3);
    const pSpeed = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const isLeft = i % 2 === 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 5.0 + Math.random() * 6.0;

      pPos[i3] = Math.sin(phi) * Math.cos(theta) * rad;
      pPos[i3 + 1] = Math.sin(phi) * Math.sin(theta) * rad;
      pPos[i3 + 2] = Math.cos(phi) * rad;

      const wingU = Math.random();
      const wingV = Math.random();
      const side = isLeft ? -1 : 1;
      pTarget[i3] = side * (0.25 + Math.pow(wingV, 0.5) * (1.7 + wingU * 0.7));
      pTarget[i3 + 1] = (Math.random() - 0.5) * 3.0 + 0.42;
      pTarget[i3 + 2] = (Math.random() - 0.5) * 0.4;
      pSpeed[i] = 0.025 + Math.random() * 0.035;

      if (isLeft) {
        const b = 0.85 + Math.random() * 0.15;
        pCol[i3] = 0.95 * b;
        pCol[i3 + 1] = 0.98 * b;
        pCol[i3 + 2] = 1.0 * b;
      } else {
        pCol[i3] = 0.98;
        pCol[i3 + 1] = 0.08 + Math.random() * 0.12;
        pCol[i3 + 2] = 0.22 + Math.random() * 0.12;
      }
    }

    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeom.setAttribute("color", new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(pGeom, pMat);
    scene.add(particlesMesh);

    // 5. Shatter Explosion Mesh on Launch (1,200 points)
    const SHATTER_COUNT = 1200;
    const sGeom = new THREE.BufferGeometry();
    const sPos = new Float32Array(SHATTER_COUNT * 3);
    const sCol = new Float32Array(SHATTER_COUNT * 3);
    const sVel = new Float32Array(SHATTER_COUNT * 3);

    for (let j = 0; j < SHATTER_COUNT; j++) {
      const j3 = j * 3;
      const isLeft = j % 2 === 0;
      sPos[j3] = (isLeft ? -1 : 1) * Math.random() * 2.2;
      sPos[j3 + 1] = (Math.random() - 0.5) * 2.8 + 0.42;
      sPos[j3 + 2] = (Math.random() - 0.5) * 0.4;

      const angle = Math.atan2(sPos[j3 + 1] - 0.42, sPos[j3]);
      const speed = 5.0 + Math.random() * 9.0;
      sVel[j3] = Math.cos(angle) * speed;
      sVel[j3 + 1] = Math.sin(angle) * speed;
      sVel[j3 + 2] = 7.0 + Math.random() * 12.0;

      if (isLeft) {
        sCol[j3] = 1.0;
        sCol[j3 + 1] = 1.0;
        sCol[j3 + 2] = 1.0;
      } else {
        sCol[j3] = 0.98;
        sCol[j3 + 1] = 0.08;
        sCol[j3 + 2] = 0.22;
      }
    }

    sGeom.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sGeom.setAttribute("color", new THREE.BufferAttribute(sCol, 3));

    const sMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shatterMesh = new THREE.Points(sGeom, sMat);
    scene.add(shatterMesh);

    // ── Rock-Solid 60 FPS Render Loop ──
    let animId: number;
    let startTime = performance.now();

    const renderLoop = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      const curPhase = phaseRef.current;
      const launching = isLaunchingRef.current;

      // 1. Butterfly Assembly & Wing Flap
      if (curPhase >= 2 && !launching) {
        butterflyGroup.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.06);
        const flapCycle = Math.sin(elapsed * 2.2) * 0.32 + Math.cos(elapsed * 1.1) * 0.12;
        leftWingPivot.rotation.y = flapCycle;
        rightWingPivot.rotation.y = -flapCycle;
        butterflyGroup.position.y = 0.42 + Math.sin(elapsed * 1.5) * 0.06;
      }

      // 2. Light Intensities
      if (curPhase >= 1) {
        silverLight.intensity = THREE.MathUtils.lerp(silverLight.intensity, 4.0, 0.05);
        crimsonLight.intensity = THREE.MathUtils.lerp(crimsonLight.intensity, 6.5, 0.05);
      }

      // 3. Smooth Mouse Parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      butterflyGroup.rotation.x = -mouse.y * 0.22;
      butterflyGroup.rotation.y = mouse.x * 0.30;

      // 4. Particle Simulation
      const posAttr = pGeom.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      if (curPhase === 1) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          posArr[i3] += (pTarget[i3] - posArr[i3]) * pSpeed[i];
          posArr[i3 + 1] += (pTarget[i3 + 1] - posArr[i3 + 1]) * pSpeed[i];
          posArr[i3 + 2] += (pTarget[i3 + 2] - posArr[i3 + 2]) * pSpeed[i];
        }
        posAttr.needsUpdate = true;
      } else if (curPhase >= 2 && !launching) {
        // Light subtle shimmer orbit
        for (let i = 0; i < PARTICLE_COUNT; i += 2) {
          const i3 = i * 3;
          const orbitAngle = elapsed * 0.5 + i * 0.04;
          posArr[i3] = pTarget[i3] + Math.cos(orbitAngle) * 0.12;
          posArr[i3 + 1] = pTarget[i3 + 1] + Math.sin(orbitAngle) * 0.12;
        }
        posAttr.needsUpdate = true;
      }

      // 5. Shatter Motion on Click
      if (launching) {
        sMat.opacity = Math.min(1.0, sMat.opacity + 0.12);
        butterflyGroup.scale.multiplyScalar(0.92);
        const sPosAttr = sGeom.attributes.position as THREE.BufferAttribute;
        const sArr = sPosAttr.array as Float32Array;

        for (let j = 0; j < SHATTER_COUNT; j++) {
          const j3 = j * 3;
          sArr[j3] += sVel[j3] * 0.04;
          sArr[j3 + 1] += sVel[j3 + 1] * 0.04;
          sArr[j3 + 2] += sVel[j3 + 2] * 0.04;
        }
        sPosAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Initialized ONCE!

  // Mouse Listener
  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
    mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
  };

  // Launch Trigger
  const handleLaunchClick = useCallback(() => {
    if (isLaunching) return;
    setIsLaunching(true);

    try {
      playLaunchIgnitionSound();
    } catch {}

    let p = 0;
    const progressInterval = setInterval(() => {
      p += 3;
      setWarpProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          router.push("/");
        }, 350);
      }
    }, 25);
  }, [isLaunching, router]);

  if (!mounted) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen min-h-[100dvh] bg-[#020202] text-white select-none overflow-hidden flex flex-col justify-between"
      style={{
        perspective: "1200px",
      }}
    >
      {/* WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Atmospheric Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-75"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 42%, rgba(235, 0, 40, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(235, 0, 40, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, rgba(2,2,2,0.6) 0%, rgba(2,2,2,0.15) 50%, rgba(2,2,2,0.85) 100%)
          `,
        }}
      />

      {/* Crimson Energy Pulse */}
      <AnimatePresence>
        {phase >= 3 && !isLaunching && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.9 }}
            animate={{ scale: [0.1, 4.2], opacity: [0.9, 0] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border-2 border-[#EB0028] shadow-[0_0_100px_#EB0028] pointer-events-none z-15"
          />
        )}
      </AnimatePresence>

      {/* Minimal Top Telemetry */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
            PORTAL_STATE // READY
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono tracking-widest text-white/40">
          NOV 04, 2026
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-30 flex flex-col items-center justify-end sm:justify-center px-4 mb-10 sm:my-auto text-center">
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-2 mb-8 sm:mb-12 mt-auto sm:mt-0"
            >
              {/* Brand Hierarchy */}
              <div className="flex items-baseline justify-center tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
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

              <div
                className="text-[11px] sm:text-sm font-semibold tracking-[0.45em] text-white/70 uppercase pl-1.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                BOWRAMPET
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
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

        {/* Launch Control Button */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative group flex items-center justify-center"
            >
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#EB0028]/25 via-white/10 to-[#EB0028]/25 blur-xl opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />

              <motion.button
                onClick={handleLaunchClick}
                onMouseEnter={() => {
                  try {
                    playHoverTickSound();
                  } catch {}
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96, y: 1 }}
                disabled={isLaunching}
                className="relative px-10 sm:px-14 py-4 sm:py-5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-[#EB0028]/50 bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(235,0,40,0.4)] group-hover:shadow-[0_0_55px_rgba(235,0,40,0.85)] group-hover:border-[#EB0028] transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(235,0,40,0.8)_20%,transparent_40%,rgba(255,255,255,0.7)_50%,transparent_70%)] opacity-40 group-hover:opacity-80 pointer-events-none"
                />

                <div className="absolute inset-[1.5px] rounded-full bg-[#070709]/85 backdrop-blur-md pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#EB0028] group-hover:scale-125 transition-transform" />
                  <span
                    className="text-base sm:text-lg font-bold tracking-[0.3em] uppercase text-white"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {isLaunching ? "INITIALIZING..." : "LAUNCH"}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Minimal HUD */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[10px] font-mono text-white/35">
        <div>17.5623° N · 78.3846° E</div>
        <div>COHORT // 100 SEATS</div>
      </footer>

      {/* Fullscreen Flash on Launch */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 8, opacity: [1, 0.8, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full bg-radial from-white via-[#EB0028] to-transparent blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 7, opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full border-4 border-[#EB0028] shadow-[0_0_120px_#EB0028]"
            />

            <div className="relative z-20 text-center space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-full border-4 border-t-[#EB0028] border-r-transparent border-b-white border-l-transparent mx-auto"
              />
              <div
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                ENTERING <span className="text-[#EB0028]">METAMORPHOSIS</span>
              </div>
              <div className="text-xs font-mono text-[#EB0028] tracking-widest font-bold">
                {warpProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
